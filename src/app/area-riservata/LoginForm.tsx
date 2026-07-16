"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { creaClientBrowser } from "@/lib/supabase/client";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errore, setErrore] = useState<string | null>(null);
  const [inCorso, setInCorso] = useState(false);

  async function accedi(evento: React.FormEvent) {
    evento.preventDefault();
    if (inCorso) return;
    setInCorso(true);
    setErrore(null);

    const supabase = creaClientBrowser();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setErrore("Credenziali non valide.");
      setInCorso(false);
      return;
    }

    router.push("/area-riservata/clienti");
    router.refresh();
  }

  return (
    <div className="w-full max-w-[380px] rounded-[22px] bg-white px-[34px] py-10">
      <Link href="/" className="mb-6 block text-[13px] text-salvia-spenta hover:text-felce">
        ← Torna al sito
      </Link>
      <div className="occhiello mb-[10px]">AREA RISERVATA</div>
      <h1 className="m-0 mb-7 text-[24px] font-extrabold text-bosco">Accesso psicologa</h1>

      <form onSubmit={accedi}>
        <div className="mb-4">
          <label className="etichetta" htmlFor="login-email">
            Email
          </label>
          <input
            id="login-email"
            type="email"
            className="campo"
            placeholder="giulia@ortupsicologa.it"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-[26px]">
          <label className="etichetta" htmlFor="login-password">
            Password
          </label>
          <input
            id="login-password"
            type="password"
            className="campo"
            placeholder="••••••••"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {errore && (
          <div className="mb-5 text-[13.5px] font-semibold text-[#B0533F]">{errore}</div>
        )}

        <button
          type="submit"
          disabled={inCorso || !email || !password}
          className="btn-primario w-full py-[14px] text-[15px]"
        >
          {inCorso ? "Accesso in corso…" : "Accedi"}
        </button>
      </form>
    </div>
  );
}
