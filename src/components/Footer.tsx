import Link from "next/link";
import { STUDIO } from "@/lib/config";

/* Come nel menu dell'header: ancore delle sezioni della single page. */
const VOCI_MENU = [
  { href: "/", etichetta: "Home" },
  { href: "/#chi-sono", etichetta: "Chi sono" },
  { href: "/#servizi", etichetta: "Servizi" },
  { href: "/#contatti", etichetta: "Contatti" },
];

export default function Footer() {
  return (
    <footer className="bg-bosco px-6 pb-8 pt-[70px]">
      <div className="mx-auto max-w-[1160px]">
        <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div>
            <div className="mb-[14px] text-[18px] font-bold text-white">{STUDIO.nome}</div>
            <p className="m-0 max-w-[280px] text-[14px] leading-[1.7] text-footer-chiaro">
              Psicologa a Roma, in studio e online. Un ascolto senza fretta e senza giudizio.
            </p>
          </div>

          <div>
            <div className="mb-4 text-[13.5px] font-bold tracking-[0.3px] text-white">
              CONTATTI
            </div>
            <div className="text-[14px] leading-8 text-footer-chiaro">
              {STUDIO.indirizzo}
              <br />
              {STUDIO.telefono}
              <br />
              {STUDIO.email}
            </div>
          </div>

          <div>
            <div className="mb-4 text-[13.5px] font-bold tracking-[0.3px] text-white">
              NAVIGAZIONE
            </div>
            <div className="flex flex-col gap-[10px]">
              {VOCI_MENU.map((voce) => (
                <Link
                  key={voce.href}
                  href={voce.href}
                  className="text-[14px] text-footer-chiaro hover:text-white"
                >
                  {voce.etichetta}
                </Link>
              ))}
              <Link
                href="/area-riservata"
                className="text-[14px] text-footer-spento hover:text-footer-chiaro"
              >
                Area riservata
              </Link>
              <Link
                href="/privacy"
                className="text-[14px] text-footer-spento hover:text-footer-chiaro"
              >
                Privacy
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-footer-riga pt-6 text-[13px] text-footer-spento">
          {STUDIO.nome} · {STUDIO.professione} · {STUDIO.albo} · © 2026 — Tutti i diritti
          riservati
        </div>
      </div>
    </footer>
  );
}
