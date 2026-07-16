import type { MetadataRoute } from "next";
import { urlSito } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/area-riservata", "/api"],
    },
    sitemap: `${urlSito()}/sitemap.xml`,
  };
}
