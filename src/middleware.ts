import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Middleware dell'area riservata:
 * - mantiene aggiornata la sessione Supabase (rinnovo dei token nei cookie);
 * - blocca l'accesso alla dashboard se la psicologa non è autenticata.
 */
export async function middleware(richiesta: NextRequest) {
  let risposta = NextResponse.next({ request: richiesta });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return richiesta.cookies.getAll();
        },
        setAll(daImpostare: { name: string; value: string; options: CookieOptions }[]) {
          daImpostare.forEach(({ name, value }) => richiesta.cookies.set(name, value));
          risposta = NextResponse.next({ request: richiesta });
          daImpostare.forEach(({ name, value, options }) =>
            risposta.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const percorso = richiesta.nextUrl.pathname;
  if (!user && percorso.startsWith("/area-riservata/clienti")) {
    const destinazione = richiesta.nextUrl.clone();
    destinazione.pathname = "/area-riservata";
    return NextResponse.redirect(destinazione);
  }

  return risposta;
}

export const config = {
  matcher: ["/area-riservata/:path*"],
};
