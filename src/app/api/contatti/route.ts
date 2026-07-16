import { NextResponse } from "next/server";
import { schemaContatto, primoErrore } from "@/lib/validation";
import { inviaMessaggioContatto } from "@/lib/email";
import { consentiRichiesta, chiaveClient } from "@/lib/rate-limit";

/**
 * POST /api/contatti
 *
 * Inoltra il messaggio del modulo Contatti alla psicologa via email.
 * Per minimizzare i dati trattati (GDPR), il messaggio NON viene
 * salvato nel database: arriva solo nella casella di posta.
 */
export async function POST(richiesta: Request) {
  let corpo: unknown;
  try {
    corpo = await richiesta.json();
  } catch {
    return NextResponse.json({ errore: "Richiesta non valida" }, { status: 400 });
  }

  // Honeypot anti-bot (vedi /api/prenotazioni).
  if (
    typeof corpo === "object" &&
    corpo !== null &&
    "sito" in corpo &&
    typeof (corpo as { sito?: unknown }).sito === "string" &&
    (corpo as { sito: string }).sito.length > 0
  ) {
    return NextResponse.json({ ok: true });
  }

  if (!consentiRichiesta(`contatti:${chiaveClient(richiesta)}`, 5, 10 * 60_000)) {
    return NextResponse.json(
      { errore: "Troppe richieste ravvicinate: riprova tra qualche minuto." },
      { status: 429 }
    );
  }

  const esito = schemaContatto.safeParse(corpo);
  if (!esito.success) {
    return NextResponse.json({ errore: primoErrore(esito.error) }, { status: 400 });
  }

  try {
    await inviaMessaggioContatto(esito.data);
  } catch (errore) {
    console.error("Errore invio messaggio di contatto:", errore);
    return NextResponse.json(
      { errore: "Impossibile inviare il messaggio: riprova tra poco." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
