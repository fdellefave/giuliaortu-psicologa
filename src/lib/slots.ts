import { fromZonedTime, formatInTimeZone } from "date-fns-tz";
import { PRENOTAZIONI } from "@/lib/config";

/** Un giorno selezionabile nel calendario di prenotazione. */
export type GiornoPrenotabile = {
  /** Data in formato ISO, es. "2026-07-16" (giorno in ora italiana). */
  iso: string;
  /** Etichetta breve del giorno della settimana, es. "Gio". */
  giorno: string;
  /** Numero del giorno del mese, es. 16. */
  numero: number;
  /** Etichetta breve del mese, es. "Lug". */
  mese: string;
};

const GIORNI_SETTIMANA = ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"];
const MESI = ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"];

const MS_GIORNO = 86_400_000;

/**
 * Genera l'elenco dei giorni prenotabili: a partire da domani (ora italiana),
 * saltando i giorni di chiusura, fino a `giorniVisibili` giorni.
 * Stessa logica del mockup approvato.
 */
export function generaGiorniPrenotabili(): GiornoPrenotabile[] {
  // "Oggi" secondo il fuso orario dello studio.
  const oggiIso = formatInTimeZone(new Date(), PRENOTAZIONI.fusoOrario, "yyyy-MM-dd");
  const [anno, mese, giorno] = oggiIso.split("-").map(Number);

  const risultato: GiornoPrenotabile[] = [];
  // I calcoli sul calendario avvengono in UTC puro: qui contano solo le date,
  // non gli istanti, quindi non ci sono problemi di ora legale.
  let cursore = Date.UTC(anno, mese - 1, giorno) + MS_GIORNO; // da domani

  const chiusure: readonly number[] = PRENOTAZIONI.giorniChiusura;
  while (risultato.length < PRENOTAZIONI.giorniVisibili) {
    const data = new Date(cursore);
    const giornoSettimana = data.getUTCDay();
    if (!chiusure.includes(giornoSettimana)) {
      risultato.push({
        iso: data.toISOString().slice(0, 10),
        giorno: GIORNI_SETTIMANA[giornoSettimana],
        numero: data.getUTCDate(),
        mese: MESI[data.getUTCMonth()],
      });
    }
    cursore += MS_GIORNO;
  }
  return risultato;
}

/**
 * Converte un giorno + orario (ora italiana) nell'istante UTC di inizio
 * e fine della seduta.
 */
export function intervalloSlot(dataIso: string, ora: string): { inizio: Date; fine: Date } {
  const inizio = fromZonedTime(`${dataIso} ${ora}:00`, PRENOTAZIONI.fusoOrario);
  const fine = new Date(inizio.getTime() + PRENOTAZIONI.durataMinuti * 60_000);
  return { inizio, fine };
}

/** True se l'orario richiesto è uno di quelli proposti dallo studio. */
export function orarioValido(ora: string): boolean {
  return (PRENOTAZIONI.orari as readonly string[]).includes(ora);
}

/** True se il giorno richiesto è tra quelli attualmente prenotabili. */
export function giornoValido(dataIso: string): boolean {
  return generaGiorniPrenotabili().some((g) => g.iso === dataIso);
}
