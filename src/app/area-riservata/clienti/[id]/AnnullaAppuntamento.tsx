"use client";

import { useState, useTransition } from "react";
import { annullaAppuntamento } from "../actions";

export default function AnnullaAppuntamento({ appuntamentoId }: { appuntamentoId: string }) {
  const [errore, setErrore] = useState<string | null>(null);
  const [inCorso, avvia] = useTransition();

  function annulla() {
    const conferma = window.confirm(
      "Annullare questo appuntamento?\n\nL'evento verrà eliminato dal Google Calendar e l'orario tornerà prenotabile dal sito. Ricordati di avvisare il cliente."
    );
    if (!conferma) return;

    setErrore(null);
    avvia(async () => {
      const esito = await annullaAppuntamento(appuntamentoId);
      if (!esito.ok) setErrore(esito.errore ?? "Impossibile annullare: riprova.");
    });
  }

  return (
    <div className="text-right">
      <button
        type="button"
        onClick={annulla}
        disabled={inCorso}
        className="cursor-pointer border-none bg-transparent p-0 text-[13px] font-semibold text-salvia-spenta underline hover:text-bosco"
      >
        {inCorso ? "Annullamento…" : "Annulla appuntamento"}
      </button>
      {errore && (
        <div className="mt-2 max-w-[260px] text-[12.5px] leading-[1.5] text-[#B0533F]">
          {errore}
        </div>
      )}
    </div>
  );
}
