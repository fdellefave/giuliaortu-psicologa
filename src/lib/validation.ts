import { z } from "zod";
import { PRENOTAZIONI } from "@/lib/config";

/**
 * Dati inviati dal modulo di prenotazione (step 1 + step 2).
 * Il campo `sito` è una "honeypot": è invisibile agli utenti reali
 * e serve a scartare i bot che compilano tutti i campi.
 */
export const schemaPrenotazione = z.object({
  data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data non valida"),
  ora: z.string().regex(/^\d{2}:\d{2}$/, "Orario non valido"),
  modalita: z.enum(["studio", "online"]),
  nome: z.string().trim().min(2, "Inserisci il tuo nome").max(80),
  cognome: z.string().trim().min(2, "Inserisci il tuo cognome").max(80),
  email: z.string().trim().email("Inserisci un'email valida").max(160),
  telefono: z.string().trim().max(30).optional().or(z.literal("")),
  motivo: z.enum(PRENOTAZIONI.motivi),
  note: z.string().trim().max(1000, "Le note sono troppo lunghe").optional().or(z.literal("")),
  privacy: z.literal(true, {
    errorMap: () => ({ message: "È necessario accettare l'informativa privacy" }),
  }),
  sito: z.string().optional(),
});

export type DatiPrenotazione = z.infer<typeof schemaPrenotazione>;

/** Dati inviati dal modulo della pagina Contatti. */
export const schemaContatto = z.object({
  nome: z.string().trim().min(2, "Inserisci il tuo nome").max(80),
  email: z.string().trim().email("Inserisci un'email valida").max(160),
  messaggio: z.string().trim().min(5, "Scrivi un messaggio").max(3000),
  sito: z.string().optional(),
});

export type DatiContatto = z.infer<typeof schemaContatto>;

/** Estrae il primo messaggio d'errore leggibile da un errore zod. */
export function primoErrore(errore: z.ZodError): string {
  return errore.errors[0]?.message ?? "Dati non validi";
}
