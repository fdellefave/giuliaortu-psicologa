"use client";

import { useState } from "react";

export default function ContactForm() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [messaggio, setMessaggio] = useState("");
  const [sito, setSito] = useState(""); // honeypot anti-bot
  const [invioInCorso, setInvioInCorso] = useState(false);
  const [inviato, setInviato] = useState(false);
  const [errore, setErrore] = useState<string | null>(null);

  const valido =
    nome.trim().length >= 2 && /^\S+@\S+\.\S+$/.test(email.trim()) && messaggio.trim().length >= 5;

  async function invia() {
    if (!valido || invioInCorso) return;
    setInvioInCorso(true);
    setErrore(null);

    try {
      const risposta = await fetch("/api/contatti", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: nome.trim(),
          email: email.trim(),
          messaggio: messaggio.trim(),
          sito,
        }),
      });

      if (risposta.ok) {
        setInviato(true);
        return;
      }
      const dati = (await risposta.json().catch(() => null)) as { errore?: string } | null;
      setErrore(
        dati?.errore ?? "Impossibile inviare il messaggio: riprova tra qualche minuto."
      );
    } catch {
      setErrore("Impossibile inviare il messaggio: controlla la connessione e riprova.");
    } finally {
      setInvioInCorso(false);
    }
  }

  if (inviato) {
    return (
      <div className="px-[10px] py-10 text-center">
        <h3 className="m-0 mb-[10px] text-[20px] text-bosco">
          Grazie, {nome.trim()}.
        </h3>
        <p className="m-0 text-[15px] leading-[1.6] text-felce">
          Ho ricevuto il tuo messaggio e ti risponderò al più presto.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-[18px]">
        <label className="etichetta" htmlFor="cont-nome">
          Nome
        </label>
        <input
          id="cont-nome"
          className="campo"
          placeholder="Il tuo nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
      </div>

      <div className="mb-[18px]">
        <label className="etichetta" htmlFor="cont-email">
          Email
        </label>
        <input
          id="cont-email"
          type="email"
          className="campo"
          placeholder="nome@email.it"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="mb-6">
        <label className="etichetta" htmlFor="cont-messaggio">
          Messaggio
        </label>
        <textarea
          id="cont-messaggio"
          className="campo resize-y"
          rows={8}
          placeholder="Raccontami brevemente cosa ti porta a scrivere."
          value={messaggio}
          onChange={(e) => setMessaggio(e.target.value)}
        />
      </div>

      {/* Campo honeypot: invisibile alle persone, i bot lo compilano. */}
      <input
        type="text"
        name="sito"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
        value={sito}
        onChange={(e) => setSito(e.target.value)}
      />

      {errore && (
        <div className="mb-5 rounded-2xl border border-sabbia bg-white px-5 py-4 text-[14.5px] leading-[1.5] text-bosco">
          {errore}
        </div>
      )}

      <button
        type="button"
        onClick={invia}
        disabled={!valido || invioInCorso}
        className="btn-primario w-full py-[15px] text-[15.5px]"
      >
        {invioInCorso ? "Invio in corso…" : "Invia messaggio"}
      </button>
    </div>
  );
}
