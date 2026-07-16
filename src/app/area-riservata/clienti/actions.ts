"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { creaClientServer } from "@/lib/supabase/server";
import { eliminaEvento } from "@/lib/google-calendar";

/**
 * Azioni della dashboard. Ogni azione verifica che la richiesta
 * arrivi dalla psicologa autenticata; le query passano comunque
 * dalla Row Level Security del database.
 */

type Esito = { ok: boolean; errore?: string };

async function clientAutenticato() {
  const supabase = await creaClientServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user ? supabase : null;
}

/** Salva (o aggiorna) la nota privata di una seduta. */
export async function salvaNota(appuntamentoId: string, nota: string): Promise<Esito> {
  const supabase = await clientAutenticato();
  if (!supabase) return { ok: false, errore: "Sessione scaduta: accedi di nuovo." };

  const testo = nota.trim().slice(0, 5000);
  const { error } = await supabase
    .from("appuntamenti")
    .update({ nota_seduta: testo || null })
    .eq("id", appuntamentoId);

  if (error) {
    console.error("Errore salvataggio nota:", error);
    return { ok: false, errore: "Impossibile salvare la nota: riprova." };
  }

  revalidatePath("/area-riservata/clienti");
  return { ok: true };
}

/**
 * Annulla un appuntamento: elimina l'evento dal Google Calendar
 * (così l'orario torna prenotabile) e segna la riga come annullata.
 */
export async function annullaAppuntamento(appuntamentoId: string): Promise<Esito> {
  const supabase = await clientAutenticato();
  if (!supabase) return { ok: false, errore: "Sessione scaduta: accedi di nuovo." };

  const { data: appuntamento, error } = await supabase
    .from("appuntamenti")
    .select("id, google_event_id, stato")
    .eq("id", appuntamentoId)
    .single();

  if (error || !appuntamento) {
    return { ok: false, errore: "Appuntamento non trovato." };
  }
  if (appuntamento.stato === "annullato") {
    return { ok: true };
  }

  if (appuntamento.google_event_id) {
    try {
      await eliminaEvento(appuntamento.google_event_id);
    } catch (erroreCalendario) {
      console.error("Errore eliminazione evento calendario:", erroreCalendario);
      return {
        ok: false,
        errore:
          "Non riesco a eliminare l'evento dal calendario. Riprova, oppure cancellalo a mano da Google Calendar e ripeti l'annullamento.",
      };
    }
  }

  const { error: erroreStato } = await supabase
    .from("appuntamenti")
    .update({ stato: "annullato" })
    .eq("id", appuntamentoId);

  if (erroreStato) {
    console.error("Errore aggiornamento stato:", erroreStato);
    return { ok: false, errore: "Impossibile aggiornare lo stato: riprova." };
  }

  revalidatePath("/area-riservata/clienti");
  return { ok: true };
}

/** Chiude la sessione e torna alla pagina di accesso. */
export async function esci(): Promise<void> {
  const supabase = await creaClientServer();
  await supabase.auth.signOut();
  redirect("/area-riservata");
}
