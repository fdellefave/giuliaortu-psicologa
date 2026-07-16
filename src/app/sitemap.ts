import type { MetadataRoute } from "next";
import { urlSito } from "@/lib/config";

/**
 * Il sito è una "single page": le uniche pagine indicizzabili sono
 * la home (che contiene tutte le sezioni) e l'informativa privacy.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = urlSito();
  return [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/privacy`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
