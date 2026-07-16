"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PRENOTAZIONI, STUDIO } from "@/lib/config";
import type { GiornoPrenotabile } from "@/lib/slots";

type SlotOrario = { ora: string; disponibile: boolean };
type Modalita = "studio" | "online";

type StatoForm = {
  nome: string;
  cognome: string;
  email: string;
  telefono: string;
  motivo: string;
  note: string;
  privacy: boolean;
  sito: string; // honeypot: resta vuoto per gli utenti reali
};

const FORM_INIZIALE: StatoForm = {
  nome: "",
  cognome: "",
  email: "",
  telefono: "",
  motivo: PRENOTAZIONI.motivi[0],
  note: "",
  privacy: false,
  sito: "",
};

export default function BookingFlow({ giorni }: { giorni: GiornoPrenotabile[] }) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [modalita, setModalita] = useState<Modalita>("studio");
  const [giornoIdx, setGiornoIdx] = useState(0);
  const [orari, setOrari] = useState<SlotOrario[] | null>(null);
  const [erroreOrari, setErroreOrari] = useState(false);
  const [oraScelta, setOraScelta] = useState<string | null>(null);
  const [form, setForm] = useState<StatoForm>(FORM_INIZIALE);
  const [invioInCorso, setInvioInCorso] = useState(false);
  const [erroreInvio, setErroreInvio] = useState<string | null>(null);

  const giorno = giorni[giornoIdx];
  const etichettaGiorno = giorno ? `${giorno.giorno} ${giorno.numero} ${giorno.mese}` : "";
  const etichettaModalita = modalita === "studio" ? "In studio" : "Online";

  // Carica gli orari realmente liberi (da Google Calendar) al cambio giorno.
  useEffect(() => {
    if (!giorno) return;
    let attivo = true;
    setOrari(null);
    setErroreOrari(false);
    setOraScelta(null);

    fetch(`/api/disponibilita?data=${giorno.iso}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("richiesta fallita"))))
      .then((dati: { orari: SlotOrario[] }) => {
        if (attivo) setOrari(dati.orari);
      })
      .catch(() => {
        if (attivo) {
          setOrari([]);
          setErroreOrari(true);
        }
      });

    return () => {
      attivo = false;
    };
  }, [giorno]);

  const aggiornaCampo = <K extends keyof StatoForm>(campo: K, valore: StatoForm[K]) =>
    setForm((f) => ({ ...f, [campo]: valore }));

  const formValido =
    form.nome.trim().length >= 2 &&
    form.cognome.trim().length >= 2 &&
    /^\S+@\S+\.\S+$/.test(form.email.trim()) &&
    form.privacy;

  async function inviaPrenotazione() {
    if (!formValido || !oraScelta || !giorno || invioInCorso) return;
    setInvioInCorso(true);
    setErroreInvio(null);

    try {
      const risposta = await fetch("/api/prenotazioni", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: giorno.iso,
          ora: oraScelta,
          modalita,
          nome: form.nome.trim(),
          cognome: form.cognome.trim(),
          email: form.email.trim(),
          telefono: form.telefono.trim(),
          motivo: form.motivo,
          note: form.note.trim(),
          privacy: form.privacy,
          sito: form.sito,
        }),
      });

      if (risposta.ok) {
        setStep(3);
        return;
      }

      const dati = (await risposta.json().catch(() => null)) as
        | { errore?: string }
        | null;

      if (risposta.status === 409) {
        // Qualcun altro ha appena prenotato lo stesso orario:
        // torniamo allo step 1 e ricarichiamo la disponibilità.
        setErroreInvio(
          "L'orario scelto è stato appena prenotato da un'altra persona. Scegli un altro orario."
        );
        setStep(1);
        setOraScelta(null);
        setOrari(null);
        const aggiornati = await fetch(`/api/disponibilita?data=${giorno.iso}`)
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null);
        setOrari(aggiornati ? aggiornati.orari : []);
        return;
      }

      setErroreInvio(
        dati?.errore ??
          "Non è stato possibile completare la prenotazione. Riprova tra qualche minuto oppure scrivimi dal modulo di contatto."
      );
    } catch {
      setErroreInvio(
        "Non è stato possibile completare la prenotazione. Controlla la connessione e riprova."
      );
    } finally {
      setInvioInCorso(false);
    }
  }

  return (
    <div>
      {/* ---------- Indicatore di avanzamento ---------- */}
      <div className="mb-12 flex items-center justify-center gap-[10px]">
        {[1, 2, 3].map((n, i) => (
          <span key={n} className="flex items-center gap-[10px]">
            {i > 0 && <span className="block h-[2px] w-11 bg-bordo-input" />}
            <span
              className={
                "flex h-8 w-8 items-center justify-center rounded-full text-[14px] font-bold " +
                (n <= step
                  ? "bg-salvia text-white"
                  : "border-2 border-bordo-input bg-white text-salvia-spenta")
              }
            >
              {n}
            </span>
          </span>
        ))}
      </div>

      {erroreInvio && step === 1 && (
        <div className="mb-8 rounded-2xl border border-sabbia bg-white px-5 py-4 text-[14.5px] leading-[1.5] text-bosco">
          {erroreInvio}
        </div>
      )}

      {/* ---------- STEP 1: modalità, giorno e orario ---------- */}
      {step === 1 && (
        <div>
          <div className="mb-[14px] text-[14px] font-bold text-bosco">
            Dove preferisci fare la seduta?
          </div>
          <div className="mb-9 flex flex-col gap-4 lg:flex-row">
            <button
              type="button"
              onClick={() => setModalita("studio")}
              className={
                "flex-1 cursor-pointer rounded-2xl px-5 py-[18px] text-left " +
                (modalita === "studio"
                  ? "border-2 border-salvia bg-crema"
                  : "border-2 border-bordo-input bg-white")
              }
            >
              <div className="text-[15.5px] font-bold text-bosco">In studio</div>
              <div className="mt-1 text-[13.5px] text-felce">{STUDIO.indirizzo}</div>
            </button>
            <button
              type="button"
              onClick={() => setModalita("online")}
              className={
                "flex-1 cursor-pointer rounded-2xl px-5 py-[18px] text-left " +
                (modalita === "online"
                  ? "border-2 border-salvia bg-crema"
                  : "border-2 border-bordo-input bg-white")
              }
            >
              <div className="text-[15.5px] font-bold text-bosco">Online</div>
              <div className="mt-1 text-[13.5px] text-felce">
                Videochiamata, da qualsiasi luogo
              </div>
            </button>
          </div>

          <div className="mb-[14px] text-[14px] font-bold text-bosco">Scegli un giorno</div>
          <div className="mb-8 flex gap-3 overflow-x-auto pb-2">
            {giorni.map((g, i) => (
              <button
                key={g.iso}
                type="button"
                onClick={() => setGiornoIdx(i)}
                className={
                  "w-16 flex-shrink-0 cursor-pointer rounded-[14px] py-[14px] text-center " +
                  (i === giornoIdx
                    ? "border-2 border-salvia bg-crema"
                    : "border-2 border-bordo-input bg-white")
                }
              >
                <div className="text-[12px] font-semibold text-salvia-spenta">{g.giorno}</div>
                <div className="my-1 text-[19px] font-bold text-bosco">{g.numero}</div>
                <div className="text-[11.5px] text-salvia-spenta">{g.mese}</div>
              </button>
            ))}
          </div>

          <div className="mb-[14px] text-[14px] font-bold text-bosco">
            Orari disponibili · {etichettaGiorno}
          </div>

          {orari === null ? (
            <div className="mb-10 py-3 text-[14.5px] text-salvia-spenta">
              Sto controllando la disponibilità sul calendario…
            </div>
          ) : orari.length === 0 || orari.every((o) => !o.disponibile) ? (
            <div className="mb-10 py-3 text-[14.5px] leading-[1.6] text-felce">
              {erroreOrari
                ? "Non riesco a leggere la disponibilità in questo momento. Riprova tra poco oppure scrivimi dal modulo di contatto."
                : "Per questo giorno non ci sono più orari liberi: prova a scegliere un altro giorno."}
            </div>
          ) : (
            <div className="mb-10 grid grid-cols-4 gap-3">
              {orari.map((slot) => (
                <button
                  key={slot.ora}
                  type="button"
                  disabled={!slot.disponibile}
                  onClick={() => setOraScelta(slot.ora)}
                  className={
                    "rounded-xl py-[13px] text-center text-[14.5px] font-semibold " +
                    (!slot.disponibile
                      ? "cursor-not-allowed border-2 border-transparent bg-crema text-salvia-spenta line-through opacity-60"
                      : oraScelta === slot.ora
                        ? "cursor-pointer border-2 border-salvia bg-salvia text-white"
                        : "cursor-pointer border-2 border-bordo-input bg-white text-bosco")
                  }
                >
                  {slot.ora}
                </button>
              ))}
            </div>
          )}

          <div className="text-right">
            <button
              type="button"
              onClick={() => oraScelta && setStep(2)}
              disabled={!oraScelta}
              className="btn-primario px-8 py-[15px] text-[15.5px]"
            >
              Continua
            </button>
          </div>
        </div>
      )}

      {/* ---------- STEP 2: i tuoi dati ---------- */}
      {step === 2 && (
        <div>
          <div className="mb-8 rounded-2xl bg-crema px-[22px] py-[18px] text-[14.5px] text-bosco">
            <strong>{etichettaModalita}</strong> · {etichettaGiorno} · {oraScelta}
          </div>

          <div className="mb-[18px] grid grid-cols-1 gap-[18px] lg:grid-cols-2">
            <div>
              <label className="etichetta" htmlFor="pren-nome">
                Nome
              </label>
              <input
                id="pren-nome"
                className="campo"
                placeholder="Il tuo nome"
                value={form.nome}
                onChange={(e) => aggiornaCampo("nome", e.target.value)}
              />
            </div>
            <div>
              <label className="etichetta" htmlFor="pren-cognome">
                Cognome
              </label>
              <input
                id="pren-cognome"
                className="campo"
                placeholder="Il tuo cognome"
                value={form.cognome}
                onChange={(e) => aggiornaCampo("cognome", e.target.value)}
              />
            </div>
          </div>

          <div className="mb-[18px] grid grid-cols-1 gap-[18px] lg:grid-cols-2">
            <div>
              <label className="etichetta" htmlFor="pren-email">
                Email
              </label>
              <input
                id="pren-email"
                type="email"
                className="campo"
                placeholder="nome@email.it"
                value={form.email}
                onChange={(e) => aggiornaCampo("email", e.target.value)}
              />
            </div>
            <div>
              <label className="etichetta" htmlFor="pren-telefono">
                Telefono
              </label>
              <input
                id="pren-telefono"
                type="tel"
                className="campo"
                placeholder="Il tuo numero"
                value={form.telefono}
                onChange={(e) => aggiornaCampo("telefono", e.target.value)}
              />
            </div>
          </div>

          <div className="mb-[18px]">
            <label className="etichetta" htmlFor="pren-motivo">
              Motivo della richiesta
            </label>
            <select
              id="pren-motivo"
              className="campo"
              value={form.motivo}
              onChange={(e) => aggiornaCampo("motivo", e.target.value)}
            >
              {PRENOTAZIONI.motivi.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-[22px]">
            <label className="etichetta" htmlFor="pren-note">
              Note (facoltativo)
            </label>
            <textarea
              id="pren-note"
              className="campo resize-y"
              rows={3}
              placeholder="Se vuoi, raccontami brevemente cosa ti porta qui."
              value={form.note}
              onChange={(e) => aggiornaCampo("note", e.target.value)}
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
            value={form.sito}
            onChange={(e) => aggiornaCampo("sito", e.target.value)}
          />

          <div className="mb-8 flex items-start gap-[10px]">
            <input
              id="pren-privacy"
              type="checkbox"
              className="mt-[3px] h-[17px] w-[17px] flex-shrink-0 accent-salvia"
              checked={form.privacy}
              onChange={(e) => aggiornaCampo("privacy", e.target.checked)}
            />
            <label htmlFor="pren-privacy" className="text-[13.5px] leading-[1.5] text-felce">
              Acconsento al trattamento dei miei dati personali secondo l&apos;
              <Link href="/privacy" className="underline">
                informativa sulla privacy
              </Link>
              . Ogni informazione è coperta dal segreto professionale.
            </label>
          </div>

          {erroreInvio && (
            <div className="mb-6 rounded-2xl border border-sabbia bg-white px-5 py-4 text-[14.5px] leading-[1.5] text-bosco">
              {erroreInvio}
            </div>
          )}

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => {
                setErroreInvio(null);
                setStep(1);
              }}
              className="btn-contorno px-[26px] py-[14px] text-[15px]"
            >
              Indietro
            </button>
            <button
              type="button"
              onClick={inviaPrenotazione}
              disabled={!formValido || invioInCorso}
              className="btn-primario px-8 py-[15px] text-[15.5px]"
            >
              {invioInCorso ? "Invio in corso…" : "Conferma prenotazione"}
            </button>
          </div>
        </div>
      )}

      {/* ---------- STEP 3: conferma ---------- */}
      {step === 3 && (
        <div className="py-5 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-crema">
            <div className="h-3 w-6 -translate-y-[2px] translate-x-[2px] -rotate-45 border-b-[3px] border-l-[3px] border-salvia" />
          </div>
          <h2 className="m-0 mb-[14px] text-[26px] text-bosco">
            Prenotazione ricevuta, {form.nome.trim()}.
          </h2>
          <p className="mx-auto mb-8 max-w-[440px] text-[16px] leading-[1.7] text-felce">
            Riceverai a breve un&apos;email di conferma per la seduta del{" "}
            <strong>{etichettaGiorno}</strong> alle <strong>{oraScelta}</strong> (
            {etichettaModalita}).{" "}
            {modalita === "online"
              ? "Il collegamento per la videochiamata ti arriverà prima della seduta. "
              : ""}
            Se hai bisogno di modificare l&apos;appuntamento, scrivimi pure.
          </p>
          <button
            type="button"
            // Il calendario vive nella single page: si torna semplicemente
            // in cima (lo scorrimento morbido è definito in globals.css).
            onClick={() => window.scrollTo({ top: 0 })}
            className="btn-primario px-[30px] py-[15px] text-[15.5px]"
          >
            Torna all&apos;inizio
          </button>
        </div>
      )}
    </div>
  );
}
