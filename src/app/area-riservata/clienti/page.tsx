import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { creaClientServer } from "@/lib/supabase/server";
import { formattaDataOra } from "@/lib/formatta";
import type { Cliente } from "@/lib/tipi";
import BarraDashboard from "./BarraDashboard";

export const metadata: Metadata = {
  title: "Clienti · Area riservata",
  robots: { index: false },
};

type AppuntamentoFuturo = { cliente_id: string; inizio: string };

export default async function Clienti() {
  const supabase = await creaClientServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/area-riservata");

  const [{ data: clienti }, { data: futuri }] = await Promise.all([
    supabase.from("clienti").select("*").order("cognome").order("nome"),
    supabase
      .from("appuntamenti")
      .select("cliente_id, inizio")
      .eq("stato", "confermato")
      .gte("inizio", new Date().toISOString())
      .order("inizio"),
  ]);

  // Prima seduta futura per ogni cliente.
  const prossimaPerCliente = new Map<string, string>();
  for (const appuntamento of (futuri ?? []) as AppuntamentoFuturo[]) {
    if (!prossimaPerCliente.has(appuntamento.cliente_id)) {
      prossimaPerCliente.set(appuntamento.cliente_id, appuntamento.inizio);
    }
  }

  const elenco = (clienti ?? []) as Cliente[];

  return (
    <div className="min-h-screen bg-fondo">
      <BarraDashboard />

      <div className="mx-auto max-w-[1000px] px-6 py-12">
        <h1 className="m-0 mb-6 text-[24px] font-extrabold text-bosco">Clienti</h1>

        {elenco.length === 0 ? (
          <div className="rounded-2xl border border-bordo bg-white px-6 py-8 text-[14.5px] leading-[1.6] text-felce">
            Ancora nessun cliente: i clienti compaiono qui automaticamente alla prima
            prenotazione dal sito.
          </div>
        ) : (
          <div className="flex flex-col gap-[14px]">
            {elenco.map((cliente) => {
              const prossima = prossimaPerCliente.get(cliente.id);
              return (
                <Link
                  key={cliente.id}
                  href={`/area-riservata/clienti/${cliente.id}`}
                  className="flex items-center justify-between rounded-2xl border border-bordo bg-white px-[26px] py-[22px] hover:border-bordo-input"
                >
                  <div>
                    <div className="text-[16px] font-bold text-bosco">
                      {cliente.nome} {cliente.cognome}
                    </div>
                    <div className="mt-1 text-[13.5px] text-salvia-spenta">
                      Prossima seduta:{" "}
                      {prossima ? formattaDataOra(new Date(prossima)) : "da fissare"}
                    </div>
                  </div>
                  <span className="text-[18px] text-salvia-spenta" aria-hidden="true">
                    ›
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
