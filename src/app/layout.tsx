import type { Metadata } from "next";
import localFont from "next/font/local";
import { STUDIO } from "@/lib/config";
import "./globals.css";

/**
 * I font sono self-hosted (file in src/fonts): nessuna richiesta a
 * Google Fonts dal browser dei visitatori — scelta migliore anche
 * per il GDPR.
 * - Figtree (variabile, pesi 300–900): testo corrente.
 * - Fraunces (variabile, con asse "SOFT" per il tratto morbido):
 *   titoli e logo, come nel restyling caldo di luglio 2026.
 */
const figtree = localFont({
  src: [
    {
      path: "../fonts/figtree-latin.woff2",
      weight: "300 900",
      style: "normal",
    },
  ],
  variable: "--font-figtree",
  display: "swap",
});

const fraunces = localFont({
  src: [
    {
      path: "../fonts/fraunces-latin-full-normal.woff2",
      weight: "100 900",
      style: "normal",
    },
    {
      path: "../fonts/fraunces-latin-full-italic.woff2",
      weight: "100 900",
      style: "italic",
    },
  ],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${STUDIO.nome} — ${STUDIO.professione} a ${STUDIO.citta}`,
    template: `%s | ${STUDIO.nome} — ${STUDIO.professione} a ${STUDIO.citta}`,
  },
  description:
    "Psicologa a Roma e online. Sedute individuali, sostegno psicologico, percorsi per adolescenti e famiglie. Prenota online il primo colloquio.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body className={`${figtree.variable} ${fraunces.variable} antialiased`}>{children}</body>
    </html>
  );
}
