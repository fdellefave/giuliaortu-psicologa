import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

type CookieDaImpostare = { name: string; value: string; options: CookieOptions };

/**
 * Client Supabase per Server Component e Server Action.
 * Legge la sessione della psicologa dai cookie: le query passano
 * dalla Row Level Security (accesso consentito solo se autenticata).
 */
export async function creaClientServer() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(daImpostare: CookieDaImpostare[]) {
          try {
            daImpostare.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Chiamato da un Server Component: i cookie vengono
            // aggiornati dal middleware, si può ignorare.
          }
        },
      },
    }
  );
}
