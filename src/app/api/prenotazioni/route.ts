import { NextResponse } from "next/server";
import { schemaPrenotazione, primoErrore } from "@/lib/validation";
import { giornoValido, orarioValido, intervalloSlot } from "@/lib/slots";
import { periodiOccupati, slotOccupato, creaEvento } from "@/lib/google-calendar";
import { creaClientAdmin } from "@/lib/supabase/admin";
import { inviaConfermaCliente, inviaNotificaPsicologa } from "@/lib/email";
import { consentiRichiesta, chiaveClient } from "@/lib/rate-limit";

/**
 * POST /api/prenotazioni
 *
 * Flusso di una prenotazione:
 *  1. validazione dei dati (zod) + honeypot + limite richieste
 *  2. verifica che giorno e orario siano tra quelli proposti
 *  3. ricontrollo della disponibilità sul Google Calendar
 *  4. salvataggio di cliente e appuntamento su Supabase
 *     (un vincolo del database impedisce due prenotazioni sovrapposte)
 *  5. creazione dell'evento sul Google Calendar
 *  6. invio delle email di conferma (cliente) e notifica (psicologa)
 */
export async function POST(richiesta: Request) {
  let corpo: unknown;
  try {
    corpo = await richiesta.json();
  } catch {
    return NextResponse.json({ errore: "Richiesta non valida" }, { status: 400 });
  }

  // Honeypot: se il campo nascosto è compilato, è un bot.
  // Rispondiamo "ok" senza fare nulla, per non dargli indizi.
  if (
    typeof corpo === "object" &&
    corpo !== null &&
    "sito" in corpo &&
    typeof (corpo as { sito?: unknown }).sito === "string" &&
    (corpo as { sito: string }).sito.length > 0
  ) {
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  // Limite best-effort: max 5 prenotazioni ogni 10 minuti per indirizzo.
  if (!consentiRichiesta(`prenotazioni:${chiaveClient(richiesta)}`, 5, 10 * 60_000)) {
    return NextResponse.json(
      { errore: "Troppe richieste ravvicinate: riprova tra qualche minuto." },
      { status: 429 }
    );
  }

  const esito = schemaPrenotazione.safeParse(corpo);
  if (!esito.success) {
    return NextResponse.json({ errore: primoErrore(esito.error) }, { status: 400 });
  }
  const dati = esito.data;

  if (!giornoValido(dati.data) || !orarioValido(dati.ora)) {
    return NextResponse.json(
      { errore: "Giorno o orario non prenotabile" },
      { status: 400 }
    );
  }

  const { inizio, fine } = intervalloSlot(dati.data, dati.ora);
  if (inizio <= new Date()) {
    return NextResponse.json({ errore: "L'orario scelto è già passato" }, { status: 400 });
  }

  // Ricontrollo della disponibilità reale sul calendario.
  try {
    const occupati = await periodiOccupati(inizio, fine);
    if (slotOccupato(inizio, fine, occupati)) {
      return NextResponse.json({ errore: "orario_occupato" }, { status: 409 });
    }
  } catch (errore) {
    console.error("Errore verifica calendario:", errore);
    return NextResponse.json(
      { errore: "Impossibile verificare la disponibilità: riprova tra poco." },
      { status: 502 }
    );
  }

  const supabase = creaClientAdmin();

  // Cliente: un record per email (se esiste, aggiorna nome e telefono).
  const { data: cliente, error: erroreCliente } = await supabase
    .from("clienti")
    .upsert(
      {
        nome: dati.nome,
        cognome: dati.cognome,
        email: dati.email.toLowerCase(),
        telefono: dati.telefono || null,
      },
      { onConflict: "email" }
    )
    .select("id")
    .single();

  if (erroreCliente || !cliente) {
    console.error("Errore salvataggio cliente:", erroreCliente);
    return NextResponse.json(
      { errore: "Errore nel salvataggio dei dati: riprova tra poco." },
      { status: 500 }
    );
  }

  // Appuntamento: il vincolo del database blocca eventuali sovrapposizioni
  // nate da due richieste arrivate nello stesso istante.
  const { data: appuntamento, error: erroreAppuntamento } = await supabase
    .from("appuntamenti")
    .insert({
      cliente_id: cliente.id,
      inizio: inizio.toISOString(),
      fine: fine.toISOString(),
      modalita: dati.modalita,
      motivo: dati.motivo,
      note_cliente: dati.note || null,
    })
    .select("id")
    .single();

  if (erroreAppuntamento || !appuntamento) {
    if (erroreAppuntamento?.code === "23P01") {
      // Violazione del vincolo di esclusione: orario appena occupato.
      return NextResponse.json({ errore: "orario_occupato" }, { status: 409 });
    }
    console.error("Errore salvataggio appuntamento:", erroreAppuntamento);
    return NextResponse.json(
      { errore: "Errore nel salvataggio della prenotazione: riprova tra poco." },
      { status: 500 }
    );
  }

  // Evento sul Google Calendar della psicologa.
  let googleEventId: string;
  try {
    googleEventId = await creaEvento({
      inizio,
      fine,
      modalita: dati.modalita,
      nome: dati.nome,
      cognome: dati.cognome,
      email: dati.email,
      telefono: dati.telefono || undefined,
      motivo: dati.motivo,
      noteCliente: dati.note || undefined,
    });
  } catch (errore) {
    console.error("Errore creazione evento calendario:", errore);
    // Senza evento in calendario la prenotazione non è affidabile:
    // annulliamo la riga appena creata e chiediamo di riprovare.
    await supabase.from("appuntamenti").delete().eq("id", appuntamento.id);
    return NextResponse.json(
      { errore: "Impossibile confermare la prenotazione: riprova tra poco." },
      { status: 502 }
    );
  }

  await supabase
    .from("appuntamenti")
    .update({ google_event_id: googleEventId })
    .eq("id", appuntamento.id);

  // Email: se l'invio fallisce non blocchiamo la prenotazione
  // (l'appuntamento è comunque in calendario e in dashboard).
  const datiEmail = {
    nome: dati.nome,
    cognome: dati.cognome,
    email: dati.email,
    telefono: dati.telefono || undefined,
    inizio,
    modalita: dati.modalita,
    motivo: dati.motivo,
    noteCliente: dati.note || undefined,
  };
  try {
    await inviaConfermaCliente(datiEmail);
  } catch (errore) {
    console.error("Errore invio email cliente:", errore);
  }
  try {
    await inviaNotificaPsicologa(datiEmail);
  } catch (errore) {
    console.error("Errore invio email psicologa:", errore);
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
