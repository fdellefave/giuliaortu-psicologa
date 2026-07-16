import { PRENOTAZIONI } from "@/lib/config";

const TZ = PRENOTAZIONI.fusoOrario;

function maiuscolaIniziale(testo: string): string {
  return testo.charAt(0).toUpperCase() + testo.slice(1);
}

/** "18 Lug 2026" — usato nella dashboard, come nel mockup. */
export function formattaData(d: Date): string {
  const parti = new Intl.DateTimeFormat("it-IT", {
    timeZone: TZ,
    day: "numeric",
    month: "short",
    year: "numeric",
  }).formatToParts(d);
  const giorno = parti.find((p) => p.type === "day")?.value ?? "";
  const mese = parti.find((p) => p.type === "month")?.value ?? "";
  const anno = parti.find((p) => p.type === "year")?.value ?? "";
  return `${giorno} ${maiuscolaIniziale(mese.replace(".", ""))} ${anno}`;
}

/** "10:00" in ora italiana. */
export function formattaOra(d: Date): string {
  return new Intl.DateTimeFormat("it-IT", {
    timeZone: TZ,
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

/** "18 Lug 2026 · 10:00" — formato della dashboard. */
export function formattaDataOra(d: Date): string {
  return `${formattaData(d)} · ${formattaOra(d)}`;
}

/** "giovedì 23 luglio 2026" — formato esteso per le email. */
export function formattaDataEstesa(d: Date): string {
  return new Intl.DateTimeFormat("it-IT", {
    timeZone: TZ,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

/** Etichetta della modalità della seduta. */
export function etichettaModalita(modalita: "studio" | "online"): string {
  return modalita === "studio" ? "In studio" : "Online";
}
