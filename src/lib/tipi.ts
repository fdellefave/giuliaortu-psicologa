/** Tipi delle righe del database (vedi supabase/schema.sql). */

export type Cliente = {
  id: string;
  nome: string;
  cognome: string;
  email: string;
  telefono: string | null;
  creato_il: string;
};

export type StatoAppuntamento = "confermato" | "annullato";
export type Modalita = "studio" | "online";

export type Appuntamento = {
  id: string;
  cliente_id: string;
  inizio: string; // timestamptz ISO
  fine: string; // timestamptz ISO
  modalita: Modalita;
  motivo: string;
  note_cliente: string | null;
  nota_seduta: string | null;
  stato: StatoAppuntamento;
  google_event_id: string | null;
  privacy_consenso_il: string;
  creato_il: string;
};
