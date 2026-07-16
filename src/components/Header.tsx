"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { STUDIO } from "@/lib/config";

/* Il sito è una "single page": le voci puntano alle ancore delle sezioni
   della home. Il prefisso "/" fa funzionare i link anche da /privacy
   e dall'area riservata. */
const VOCI_MENU = [
  { href: "/", etichetta: "Home" },
  { href: "/#chi-sono", etichetta: "Chi sono" },
  { href: "/#servizi", etichetta: "Servizi" },
  { href: "/#contatti", etichetta: "Contatti" },
];

export default function Header() {
  const [menuAperto, setMenuAperto] = useState(false);
  const chiudi = () => setMenuAperto(false);

  return (
    <header className="sticky top-0 z-40 border-b border-bordo-header bg-[rgba(246,242,236,0.92)] backdrop-blur-[8px]">
      <div className="mx-auto flex max-w-[1160px] items-center justify-between px-6 py-[10px]">
        {/* Logo fornito dal cliente e ripulito (trasparenza reale, tratto
            #2C251E, margini ritagliati): public/images/logo-sito.png.
            L'originale è conservato in logo-originale.png. */}
        <Link href="/" onClick={chiudi} className="flex items-center">
          <Image
            src="/images/logo-sito.png"
            alt={STUDIO.nome}
            width={800}
            height={323}
            priority
            className="h-14 w-auto lg:h-20"
          />
        </Link>

        {/* Navigazione desktop */}
        <nav className="hidden items-center gap-6 lg:flex">
          {VOCI_MENU.map((voce) => (
            <Link
              key={voce.href}
              href={voce.href}
              className="whitespace-nowrap text-[15px] font-medium text-felce hover:text-bosco"
            >
              {voce.etichetta}
            </Link>
          ))}
          <Link href="/#prenota" className="btn-primario px-6 py-3 text-[14.5px]">
            Prenota una seduta
          </Link>
        </nav>

        {/* Hamburger (solo mobile) */}
        <button
          type="button"
          onClick={() => setMenuAperto((v) => !v)}
          aria-expanded={menuAperto}
          aria-label={menuAperto ? "Chiudi il menu" : "Apri il menu"}
          className="flex cursor-pointer flex-col gap-[5px] border-none bg-transparent p-2 lg:hidden"
        >
          <span className="block h-[2px] w-[22px] bg-bosco" />
          <span className="block h-[2px] w-[22px] bg-bosco" />
          <span className="block h-[2px] w-[22px] bg-bosco" />
        </button>
      </div>

      {/* Menu mobile */}
      {menuAperto && (
        <div className="flex flex-col gap-[2px] border-t border-bordo-header px-6 pb-5 pt-2 lg:hidden">
          {VOCI_MENU.map((voce) => (
            <Link
              key={voce.href}
              href={voce.href}
              onClick={chiudi}
              className="border-b border-riga-menu px-1 py-[14px] text-[16px] font-medium text-bosco hover:text-bosco"
            >
              {voce.etichetta}
            </Link>
          ))}
          <Link
            href="/#prenota"
            onClick={chiudi}
            className="btn-primario mt-[14px] px-6 py-[14px] text-[15px]"
          >
            Prenota una seduta
          </Link>
          <Link
            href="/area-riservata"
            onClick={chiudi}
            className="mt-4 text-center text-[13px] text-salvia-spenta hover:text-felce"
          >
            Area riservata
          </Link>
        </div>
      )}
    </header>
  );
}
