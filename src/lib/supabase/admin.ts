import { createClient } from "@supabase/supabase-js";

/**
 * Client Supabase con chiave `service_role`: bypassa la Row Level
 * Security. Va usato SOLO lato server (route API delle prenotazioni),
 * mai importato in codice che finisce nel browser.
 */
export function creaClientAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}
