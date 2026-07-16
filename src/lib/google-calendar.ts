import { google, type calendar_v3 } from "googleapis";
import { PRENOTAZIONI, STUDIO } from "@/lib/config";

/**
 * Integrazione con il Google Calendar della psicologa.
 *
 * Il sito si autentica con un "service account" Google a cui è stato
 * condiviso il calendario (vedi README → "Configurare Google Calendar").
 * - La disponibilità mostrata sul sito è calcolata dagli impegni reali
 *   del calendario (API freebusy).
 * - Ogni prenotazione confermata crea un evento sul calendario.
 */

function clientCalendar(): calendar_v3.Calendar {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  // Nel file .env i ritorni a capo della chiave sono scritti come "\n":
  // qui li ripristiniamo.
  const chiave = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!email || !chiave) {
    throw new Error(
      "Variabili GOOGLE_SERVICE_ACCOUNT_EMAIL / GOOGLE_PRIVATE_KEY mancanti"
    );
  }

  const auth = new google.auth.JWT({
    email,
    key: chiave,
    scopes: ["https://www.googleapis.com/auth/calendar"],
  });

  return google.calendar({ version: "v3", auth });
}

function idCalendario(): string {
  const id = process.env.GOOGLE_CALENDAR_ID;
  if (!id) throw new Error("Variabile GOOGLE_CALENDAR_ID mancante");
  return id;
}

export type PeriodoOccupato = { inizio: Date; fine: Date };

/** Legge dal calendario i periodi occupati nell'intervallo indicato. */
export async function periodiOccupati(da: Date, a: Date): Promise<PeriodoOccupato[]> {
  const calendar = clientCalendar();
  const risposta = await calendar.freebusy.query({
    requestBody: {
      timeMin: da.toISOString(),
      timeMax: a.toISOString(),
      timeZone: PRENOTAZIONI.fusoOrario,
      items: [{ id: idCalendario() }],
    },
  });

  const calendari = risposta.data.calendars ?? {};
  const occupati = Object.values(calendari)[0]?.busy ?? [];
  return occupati
    .filter((b) => b.start && b.end)
    .map((b) => ({ inizio: new Date(b.start!), fine: new Date(b.end!) }));
}

/** True se l'intervallo [inizio, fine) si sovrappone a un periodo occupato. */
export function slotOccupato(
  inizio: Date,
  fine: Date,
  occupati: PeriodoOccupato[]
): boolean {
  return occupati.some((o) => inizio < o.fine && fine > o.inizio);
}

type DatiEvento = {
  inizio: Date;
  fine: Date;
  modalita: "studio" | "online";
  nome: string;
  cognome: string;
  email: string;
  telefono?: string;
  motivo: string;
  noteCliente?: string;
};

/** Crea l'evento della seduta sul calendario e ritorna il suo id. */
export async function creaEvento(dati: DatiEvento): Promise<string> {
  const calendar = clientCalendar();

  const dove = dati.modalita === "studio" ? "in studio" : "online";
  const descrizione = [
    `Prenotazione dal sito — ${dati.motivo}`,
    ``,
    `Cliente: ${dati.nome} ${dati.cognome}`,
    `Email: ${dati.email}`,
    dati.telefono ? `Telefono: ${dati.telefono}` : null,
    dati.noteCliente ? `` : null,
    dati.noteCliente ? `Note del cliente:\n${dati.noteCliente}` : null,
  ]
    .filter((r) => r !== null)
    .join("\n");

  const risposta = await calendar.events.insert({
    calendarId: idCalendario(),
    requestBody: {
      summary: `Seduta ${dove} · ${dati.nome} ${dati.cognome}`,
      description: descrizione,
      location: dati.modalita === "studio" ? STUDIO.indirizzo : "Online",
      start: {
        dateTime: dati.inizio.toISOString(),
        timeZone: PRENOTAZIONI.fusoOrario,
      },
      end: {
        dateTime: dati.fine.toISOString(),
        timeZone: PRENOTAZIONI.fusoOrario,
      },
    },
  });

  const id = risposta.data.id;
  if (!id) throw new Error("Google Calendar non ha restituito l'id dell'evento");
  return id;
}

/** Elimina un evento dal calendario (usato quando si annulla un appuntamento). */
export async function eliminaEvento(eventId: string): Promise<void> {
  const calendar = clientCalendar();
  try {
    await calendar.events.delete({ calendarId: idCalendario(), eventId });
  } catch (errore) {
    // Se l'evento è già stato cancellato a mano dal calendario, va bene così.
    const codice = (errore as { code?: number }).code;
    if (codice === 404 || codice === 410) return;
    throw errore;
  }
}
