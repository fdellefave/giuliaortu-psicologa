import { NextResponse } from "next/server";
import { PRENOTAZIONI } from "@/lib/config";
import { giornoValido, intervalloSlot } from "@/lib/slots";
import { periodiOccupati, slotOccupato } from "@/lib/google-calendar";

/**
 * GET /api/disponibilita?data=YYYY-MM-DD
 *
 * Ritorna gli orari della giornata con la loro disponibilità reale,
 * letta dal Google Calendar della psicologa: un orario è libero solo
 * se il calendario non ha impegni che si sovrappongono.
 */
export async function GET(richiesta: Request) {
  const url = new URL(richiesta.url);
  const data = url.searchParams.get("data");

  if (!data || !/^\d{4}-\d{2}-\d{2}$/.test(data)) {
    return NextResponse.json({ errore: "Data mancante o non valida" }, { status: 400 });
  }
  if (!giornoValido(data)) {
    return NextResponse.json(
      { errore: "Il giorno richiesto non è prenotabile" },
      { status: 400 }
    );
  }

  // Intervallo dell'intera giornata lavorativa (dal primo all'ultimo slot).
  const primo = intervalloSlot(data, PRENOTAZIONI.orari[0]);
  const ultimo = intervalloSlot(data, PRENOTAZIONI.orari[PRENOTAZIONI.orari.length - 1]);

  try {
    const occupati = await periodiOccupati(primo.inizio, ultimo.fine);
    const adesso = new Date();

    const orari = PRENOTAZIONI.orari.map((ora) => {
      const { inizio, fine } = intervalloSlot(data, ora);
      const disponibile = inizio > adesso && !slotOccupato(inizio, fine, occupati);
      return { ora, disponibile };
    });

    return NextResponse.json(
      { data, orari },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (errore) {
    console.error("Errore lettura disponibilità:", errore);
    return NextResponse.json(
      { errore: "Impossibile leggere la disponibilità in questo momento" },
      { status: 502 }
    );
  }
}
