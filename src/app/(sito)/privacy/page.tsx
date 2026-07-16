import type { Metadata } from "next";
import { STUDIO } from "@/lib/config";

export const metadata: Metadata = {
  title: "Informativa privacy",
  description:
    "Informativa sul trattamento dei dati personali del sito della Dott.ssa Giulia Ortu.",
  robots: { index: false },
};

/**
 * ATTENZIONE: questa è una BOZZA di informativa, scritta per coprire i
 * trattamenti effettivamente svolti dal sito (prenotazioni, modulo contatti,
 * fornitori tecnici). Va fatta revisionare da un consulente privacy/legale
 * e completata nei punti segnati [DA COMPLETARE] prima della pubblicazione.
 */

function Sezione({ titolo, children }: { titolo: string; children: React.ReactNode }) {
  return (
    <section className="mb-9">
      <h2 className="m-0 mb-3 text-[20px] text-bosco">{titolo}</h2>
      <div className="text-[15.5px] leading-[1.75] text-felce [&>p]:m-0 [&>p]:mb-3">
        {children}
      </div>
    </section>
  );
}

export default function Privacy() {
  return (
    <main className="mx-auto max-w-[760px] px-6 pb-[110px] pt-20">
      <div className="occhiello mb-4">PRIVACY</div>
      <h1 className="m-0 mb-4 text-[34px] leading-[1.25] text-bosco">
        Informativa sul trattamento dei dati personali
      </h1>
      <p className="m-0 mb-10 text-[14px] text-salvia-spenta">
        Ai sensi degli artt. 13 e 14 del Regolamento (UE) 2016/679 (&quot;GDPR&quot;). Ultimo
        aggiornamento: [DA COMPLETARE].
      </p>

      <Sezione titolo="Titolare del trattamento">
        <p>
          {STUDIO.nome}, {STUDIO.professione} — {STUDIO.albo}.
          <br />
          Studio: {STUDIO.indirizzo} · Email: {STUDIO.email} · Telefono: {STUDIO.telefono}.
          <br />
          Partita IVA / Codice fiscale: [DA COMPLETARE].
        </p>
      </Sezione>

      <Sezione titolo="Quali dati trattiamo e perché">
        <p>
          <strong className="text-bosco">Prenotazione di una seduta.</strong> Quando prenoti dal
          sito raccogliamo nome, cognome, email, telefono (facoltativo), il motivo della
          richiesta e le eventuali note che scegli di lasciare, oltre a data, ora e modalità
          dell&apos;appuntamento. Questi dati servono a gestire l&apos;appuntamento e a
          ricontattarti (base giuridica: misure precontrattuali e consenso; per le informazioni
          che riguardano la salute, il consenso esplicito espresso con la casella dedicata).
        </p>
        <p>
          <strong className="text-bosco">Modulo contatti.</strong> Nome, email e messaggio sono
          usati solo per rispondere alla tua richiesta e non vengono salvati nel database del
          sito: arrivano esclusivamente nella casella di posta della professionista.
        </p>
        <p>
          <strong className="text-bosco">Note professionali.</strong> Dopo le sedute la
          professionista può annotare appunti clinici, custoditi in un&apos;area protetta da
          credenziali personali e coperti dal segreto professionale.
        </p>
      </Sezione>

      <Sezione titolo="Dove sono conservati i dati">
        <p>
          I dati sono conservati su servizi cloud con trattamento nell&apos;Unione Europea o
          con garanzie equivalenti previste dal GDPR:
        </p>
        <p>
          — <strong className="text-bosco">Supabase</strong> (database e autenticazione, server
          in UE) · — <strong className="text-bosco">Vercel</strong> (hosting del sito) · —{" "}
          <strong className="text-bosco">Resend</strong> (invio delle email di conferma) · —{" "}
          <strong className="text-bosco">Google</strong> (Google Calendar per la gestione degli
          appuntamenti).
        </p>
        <p>
          Con ciascun fornitore è in essere un accordo di trattamento dei dati (DPA). I dati non
          vengono venduti né usati per pubblicità.
        </p>
      </Sezione>

      <Sezione titolo="Per quanto tempo">
        <p>
          I dati delle prenotazioni e le note professionali sono conservati per il tempo
          necessario alla gestione del percorso e per gli obblighi di legge e deontologici
          applicabili alla professione di psicologo [DA COMPLETARE con i termini scelti]. I
          messaggi del modulo contatti restano solo nella casella email fino alla loro
          cancellazione.
        </p>
      </Sezione>

      <Sezione titolo="I tuoi diritti">
        <p>
          Puoi chiedere in ogni momento l&apos;accesso, la rettifica o la cancellazione dei tuoi
          dati, la limitazione del trattamento, la portabilità, oppure revocare il consenso,
          scrivendo a {STUDIO.email}. Hai inoltre il diritto di proporre reclamo al Garante per
          la protezione dei dati personali (www.garanteprivacy.it).
        </p>
      </Sezione>

      <Sezione titolo="Segreto professionale">
        <p>
          Ogni informazione condivisa prima, durante e dopo i colloqui è tutelata dal segreto
          professionale, secondo il Codice Deontologico degli Psicologi Italiani.
        </p>
      </Sezione>

      <p className="mt-2 rounded-2xl bg-crema px-5 py-4 text-[13.5px] leading-[1.6] text-felce">
        Nota per la titolare: questa pagina è una bozza tecnica generata insieme al sito. Prima
        della pubblicazione va revisionata da un consulente privacy e completata nei punti
        segnati [DA COMPLETARE].
      </p>
    </main>
  );
}
