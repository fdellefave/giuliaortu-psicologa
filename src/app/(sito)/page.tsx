import BookingFlow from "@/components/BookingFlow";
import ContactForm from "@/components/ContactForm";
import Foto from "@/components/Foto";
import { SERVIZI, STUDIO } from "@/lib/config";
import { generaGiorniPrenotabili } from "@/lib/slots";
import { IconaCalendario, IconaTelefono, IconaWhatsApp } from "@/components/Icone";
import Link from "next/link";

/**
 * Home "single page": tutte le sezioni del sito in un'unica pagina,
 * raggiungibili dal menu tramite le ancore #chi-sono, #servizi,
 * #prenota e #contatti (i vecchi URL reindirizzano qui, vedi
 * next.config.ts). Privacy e area riservata restano pagine separate.
 * La sezione finale scura unisce prenotazione e contatti: bottoni
 * WhatsApp/chiamata + calendario a sinistra, modulo a destra.
 */

// I giorni prenotabili partono sempre da "domani": la pagina va
// calcolata a ogni richiesta, non congelata al momento del deploy.
export const dynamic = "force-dynamic";

const FORMAZIONE = [
  "Laurea in Psicologia Clinica, Università degli Studi di Roma",
  "Specializzazione in Psicoterapia Cognitivo-Comportamentale",
  "Formazione continua in psicologia dell'adolescenza e terapia familiare",
  "Iscritta all'Albo degli Psicologi del Lazio, n. 33345",
];

export default function Home() {
  const giorni = generaGiorniPrenotabili();

  /** Link WhatsApp con messaggio precompilato (testo in config.ts). */
  const linkWhatsApp = `https://wa.me/${STUDIO.telefonoInternazionale.replace("+", "")}?text=${encodeURIComponent(STUDIO.messaggioWhatsApp)}`;

  return (
    <main>
      {/* ---------- Hero ---------- */}
      <section className="mx-auto max-w-[1160px] px-6 pb-[100px] pt-[88px]">
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:gap-[72px]">
          <div className="min-w-[280px] flex-1">
            <div className="occhiello mb-5">PSICOLOGA · ROMA &amp; ONLINE</div>
            <h1 className="m-0 mb-[22px] text-[40px] leading-[1.1] tracking-[-1px] text-bosco lg:text-[52px]">
              Chiedere aiuto è <span className="evidenzia">il primo passo</span>.
            </h1>
            <p className="m-0 mb-[34px] max-w-[480px] text-[18px] leading-[1.65] text-felce">
              Se stai attraversando un momento difficile, o senti che è arrivato il momento di
              occuparti di te, sono qui per ascoltarti. Senza fretta, senza giudizio.
            </p>
            {/* Tre canali diretti: WhatsApp (messaggio precompilato),
                telefonata (dialer) e prenotazione (scorre alla sezione). */}
            <div className="mb-7 flex flex-wrap gap-[14px]">
              <a
                href={linkWhatsApp}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-salvia gap-2 px-7 py-[13.5px] text-[15.5px]"
              >
                <IconaWhatsApp />
                WhatsApp
              </a>
              <a
                href={`tel:${STUDIO.telefonoInternazionale}`}
                className="btn-contorno gap-2 px-7 py-[13.5px] text-[15.5px]"
              >
                <IconaTelefono />
                Chiamami
              </a>
              <Link
                href="#prenota"
                className="btn-primario gap-2 px-[30px] py-[15px] text-[15.5px]"
              >
                <IconaCalendario />
                Prenota una seduta
              </Link>
            </div>
            <div className="text-[14px] text-salvia-spenta">Studio a Roma · Anche online</div>
          </div>
          {/* Colonna immagine doppia rispetto al testo (flex 2) e ratio
              identico al file (1024×559): immagine intera, senza ritagli.
              Su mobile è nascosta: la hero resta solo testo. */}
          <div className="hidden w-full min-w-[280px] flex-1 lg:block lg:flex-[2]">
            {/* Foto reale della hero (public/images/homepage.jpg — era .jfif,
                rinominata: l'ottimizzatore immagini di Vercel non accetta
                quell'estensione). Per tornare all'illustrazione stilizzata:
                <IllustrazioneHero /> (ancora disponibile in components/). */}
            <Foto
              etichetta="foto homepage"
              ratio="1024/559"
              radius={28}
              src="/images/homepage.jpg"
              alt="Dott.ssa Giulia Ortu — psicologa a Roma"
            />
          </div>
        </div>
      </section>

      {/* ---------- Chi sono ---------- */}
      <section id="chi-sono" className="bg-crema px-6 py-24">
        <div className="mx-auto max-w-[1160px]">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-16">
            <div className="w-full lg:w-[340px] lg:flex-none">
              {/* Ritratto reale (public/images/chi-sono.jpg): il taglio 4/5
                  del design rifila solo i lati, il viso resta centrato. */}
              <Foto
                etichetta="foto professionale · studio"
                ratio="4/5"
                radius={24}
                src="/images/chi-sono.jpg"
                alt="Ritratto della Dott.ssa Giulia Ortu"
              />
            </div>

            <div className="min-w-[280px] flex-1">
              <div className="occhiello mb-4">CHI SONO</div>
              <h2 className="m-0 mb-6 text-[32px] leading-[1.2] text-bosco lg:text-[40px]">
                Sono Giulia, e credo nell&apos;<span className="evidenzia">ascolto vero</span>.
              </h2>
              <p className="m-0 mb-5 text-[17px] leading-[1.7] text-felce">
                Ho scelto questo lavoro perché credo che chiedere aiuto sia un atto di coraggio.
                Il mio obiettivo non è dirti cosa fare — è aiutarti a capire cosa vuoi davvero, e
                accompagnarti mentre lo raggiungi.
              </p>
              <p className="m-0 mb-9 text-[17px] leading-[1.7] text-felce">
                Ho costruito la mia esperienza affiancando adulti, adolescenti e famiglie in
                momenti di crisi, cambiamento e crescita personale. Quello che troverai in studio
                è uno spazio dove puoi essere te stesso, senza filtri.
              </p>

              <div className="mb-10 border-l-[3px] border-sabbia pl-5">
                <p className="m-0 text-[19px] italic leading-[1.5] text-bosco">
                  &quot;Non sono qui per dirti cosa fare. Sono qui per aiutarti a capire cosa
                  vuoi davvero.&quot;
                </p>
              </div>

              <div className="occhiello mb-4">FORMAZIONE ED ESPERIENZA</div>
              <div className="flex flex-col gap-4">
                {FORMAZIONE.map((voce) => (
                  <div key={voce} className="flex items-start gap-[14px]">
                    <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-salvia" />
                    <div className="text-[15.5px] leading-[1.5] text-bosco">{voce}</div>
                  </div>
                ))}
              </div>

              <Link
                href="#prenota"
                className="btn-primario mt-10 gap-2 px-[30px] py-[15px] text-[15.5px]"
              >
                <IconaCalendario />
                Prenota una seduta
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Ti riconosci? + Servizi (sezione unica) ---------- */}
      {/* Ogni card abbina il bisogno in cui riconoscersi al percorso
          che vi risponde (dati appaiati in SERVIZI, lib/config.ts). */}
      <section id="servizi" className="mx-auto max-w-[1160px] px-6 py-24">
        <div className="mx-auto mb-14 max-w-[680px] text-center">
          <div className="occhiello mb-4">TI RICONOSCI IN QUESTO?</div>
          <h2 className="m-0 mb-[18px] text-[30px] leading-[1.25] text-bosco lg:text-[38px]">
            Non devi arrivare in crisi per <span className="evidenzia">iniziare</span>.
          </h2>
          <p className="m-0 text-[17px] leading-[1.7] text-felce">
            Ogni servizio è disponibile in studio a Roma o online, con la stessa qualità di
            ascolto.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {SERVIZI.map((servizio) => (
            <div key={servizio.titolo} className="carta flex flex-col rounded-[22px] p-9">
              {/* Il bisogno: il gancio in cui riconoscersi */}
              <h3 className="m-0 mb-3 text-[21px] text-bosco">
                {servizio.bisogno.titolo}
              </h3>
              <p className="m-0 mb-6 text-[15.5px] leading-[1.65] text-felce">
                {servizio.bisogno.descrizione}
              </p>

              {/* Il percorso che risponde al bisogno */}
              <div className="mt-auto border-t border-bordo pt-6">
                <div className="occhiello mb-2">IL PERCORSO</div>
                <div className="font-titoli mb-2 text-[18px] font-medium text-bosco">
                  {servizio.titolo}
                </div>
                <p className="m-0 mb-4 text-[14.5px] leading-[1.6] text-felce">
                  {servizio.descrizione}
                </p>
                <div className="mb-5 text-[13px] font-semibold tracking-[0.3px] text-salvia-spenta">
                  {servizio.tag}
                </div>
                <Link
                  href="#prenota"
                  className="btn-contorno-salvia gap-2 px-6 py-[11px] text-[14.5px]"
                >
                  <IconaCalendario dimensione={16} />
                  Prenota
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Prenota & Contatti (sezione unica, scura) ---------- */}
      {/* Come nel riferimento grafico: fondo marrone caffè. A sinistra i
          canali rapidi (WhatsApp, telefono) e il calendario in card bianca;
          a destra la card con il modulo di contatto. Niente mappa: i
          recapiti completi sono nel footer. */}
      <section id="prenota" className="bg-bosco px-6 py-24">
        <div className="mx-auto max-w-[1160px]">
          <div className="mx-auto mb-12 max-w-[640px] text-center">
            <div className="occhiello mb-4">PRENOTA UNA SEDUTA</div>
            <h2 className="m-0 mb-4 text-[32px] leading-[1.3] text-crema">
              Il primo colloquio è uno spazio per <span className="evidenzia">conoscerci</span>.
            </h2>
            <p className="m-0 text-[17px] leading-[1.7] text-footer-chiaro">
              Nessun impegno. Solo un&apos;ora per capire cosa stai vivendo e se possiamo
              lavorare bene insieme. Scegli il modo che preferisci.
            </p>
          </div>

          {/* Canali rapidi: una riga a tutta larghezza sopra le due card */}
          <div className="mb-8 flex flex-col gap-3 lg:flex-row">
            <a
              href={linkWhatsApp}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-salvia flex-1 gap-2 px-5 py-[11px] text-[14.5px]"
            >
              <IconaWhatsApp />
              Scrivimi su WhatsApp
            </a>
            <a
              href={`tel:${STUDIO.telefonoInternazionale}`}
              className="btn-primario flex-1 gap-2 px-5 py-[11px] text-[14.5px]"
            >
              <IconaTelefono />
              Chiama {STUDIO.telefono}
            </a>
          </div>

          {/* Due card di pari altezza (items-stretch): calendario e modulo */}
          <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-2">
            <div className="carta rounded-[22px] p-9">
              <h3 className="m-0 mb-2 text-[21px] text-bosco">Prenota dal calendario</h3>
              <p className="m-0 mb-7 text-[14.5px] leading-[1.6] text-felce">
                Scegli giorno e orario tra quelli realmente disponibili.
              </p>
              <BookingFlow giorni={giorni} />
            </div>

            <div id="contatti" className="carta flex flex-col rounded-[22px] p-9">
              <h3 className="m-0 mb-2 text-[21px] text-bosco">
                Un messaggio può cambiare <span className="evidenzia">qualcosa</span>.
              </h3>
              <p className="m-0 mb-7 text-[14.5px] leading-[1.6] text-felce">
                Non servono grandi motivazioni per scrivere. Rispondo personalmente, di solito
                entro poche ore.
              </p>
              <ContactForm />
              <div className="mt-auto pt-6 text-center text-[13.5px] leading-[1.6] text-salvia-spenta">
                Ogni colloquio è tutelato dal segreto professionale.
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
