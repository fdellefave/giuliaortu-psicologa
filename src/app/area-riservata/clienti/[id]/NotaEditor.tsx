"use client";

import { useState, useTransition } from "react";
import { salvaNota } from "../actions";

type Props = {
  appuntamentoId: string;
  nota: string | null;
};

export default function NotaEditor({ appuntamentoId, nota }: Props) {
  const [inModifica, setInModifica] = useState(false);
  const [testo, setTesto] = useState(nota ?? "");
  const [errore, setErrore] = useState<string | null>(null);
  const [inCorso, avvia] = useTransition();

  function salva() {
    setErrore(null);
    avvia(async () => {
      const esito = await salvaNota(appuntamentoId, testo);
      if (!esito.ok) {
        setErrore(esito.errore ?? "Impossibile salvare la nota: riprova.");
        return;
      }
      setInModifica(false);
    });
  }

  if (inModifica) {
    return (
      <div>
        <textarea
          className="campo mt-0 resize-y"
          rows={3}
          placeholder="Appunti della seduta (visibili solo a te)."
          value={testo}
          onChange={(e) => setTesto(e.target.value)}
          autoFocus
        />
        {errore && <div className="mt-2 text-[13px] font-semibold text-[#B0533F]">{errore}</div>}
        <div className="mt-3 flex gap-3">
          <button
            type="button"
            onClick={salva}
            disabled={inCorso}
            className="btn-primario px-5 py-[9px] text-[13.5px]"
          >
            {inCorso ? "Salvataggio…" : "Salva nota"}
          </button>
          <button
            type="button"
            onClick={() => {
              setTesto(nota ?? "");
              setErrore(null);
              setInModifica(false);
            }}
            className="cursor-pointer border-none bg-transparent p-0 text-[13.5px] font-semibold text-salvia-spenta hover:text-felce"
          >
            Annulla
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start justify-between gap-4">
      <div className="text-[14.5px] leading-[1.6] text-felce">
        {nota ? nota : <span className="text-salvia-spenta">Nessuna nota per questa seduta.</span>}
      </div>
      <button
        type="button"
        onClick={() => setInModifica(true)}
        className="flex-shrink-0 cursor-pointer border-none bg-transparent p-0 text-[13px] font-semibold text-salvia hover:text-salvia-scura"
      >
        {nota ? "Modifica" : "Aggiungi nota"}
      </button>
    </div>
  );
}
