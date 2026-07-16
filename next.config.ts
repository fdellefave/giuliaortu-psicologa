import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Il sito è diventato una "single page": i vecchi URL delle pagine
   * (link salvati, risultati già indicizzati) reindirizzano in modo
   * permanente alle rispettive sezioni della home.
   */
  async redirects() {
    return [
      { source: "/chi-sono", destination: "/#chi-sono", permanent: true },
      { source: "/servizi", destination: "/#servizi", permanent: true },
      { source: "/prenotazione", destination: "/#prenota", permanent: true },
      { source: "/contatti", destination: "/#contatti", permanent: true },
    ];
  },
};

export default nextConfig;
