import { createBrowserClient } from "@supabase/ssr";

/**
 * Client Supabase per il browser.
 * Usato solo nella pagina di login dell'area riservata.
 */
export function creaClientBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
