import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { creaClientServer } from "@/lib/supabase/server";
import { formattaData, formattaDataOra, etichettaModalita } from "@/lib/formatta";
import type { Appuntamento, Cliente } from "@/lib/tipi";
import BarraDashboard from "../BarraDashboard";
import AnnullaAppuntamento from "./AnnullaAppuntamento";
import NotaEditor from "./NotaEditor";

export const metadata: Metadata = {
  title: "Cliente · Area riservata",
  robots: { index: false },
};

export default async function DettaglioCliente({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await creaClientServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/area-riservata");

  const [{ data: cliente }, { data: appuntamenti }] = await Promise.all([
    supabase.from("clienti").select("*").eq("id", id).maybeSingle(),
    supabase
      .from("appuntamenti")
      .select("*")
      .eq("cliente_id", id)
      .eq("stato", "confermato")
      .order("inizio", { ascending: false }),
  ]);

  if (!cliente) notFound();

  const datiCliente = cliente as Cliente;
  const tutti = (appuntamenti ?? []) as Appuntamento[];
  const adesso = Date.now();

  const futuri = tutti
    .filter((a) => new Date(a.inizio).getTime() >= adesso)
    .sort((a, b) => a.inizio.localeCompare(b.inizio));
  const prossimo = futuri[0] ?? null;
  const passati = tutti.filter((a) => new Date(a.inizio).getTime() < adesso);

  return (
    <div className="min-h-screen bg-fondo">
      <BarraDashboard />

      <div className="mx-auto max-w-[1000px] px-6 py-12">
        <Link
          href="/area-riservata/clienti"
          className="mb-5 block text-[13.5px] text-salvia-spenta hover:text-felce"
        >
          ← Tutti i clienti
        </Link>

        <div className="mb-7">
          <h1 className="m-0 text-[24px] font-extrabold text-bosco">
            {datiCliente.nome} {datiCliente.cognome}
          </h1>
          <div className="mt-[6px] text-[13.5px] text-salvia-spenta">
            {datiCliente.email}
            {datiCliente.telefono ? ` · ${datiCliente.telefono}` : ""}
          </div>
        </div>

        <div className="mb-7 rounded-2xl border border-bordo bg-white px-[26px] py-[22px]">
          <div className="mb-[6px] text-[12.5px] font-bold tracking-[0.5px] text-salvia-spenta">
            PROSSIMO APPUNTAMENTO
          </div>
          {prossimo ? (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-[17px] font-semibold text-bosco">
                  {formattaDataOra(new Date(prossimo.inizio))} ·{" "}
                  {etichettaModalita(prossimo.modalita)}
                </div>
                <div className="mt-1 text-[13.5px] text-felce">{prossimo.motivo}</div>
                {prossimo.note_cliente && (
                  <div className="mt-2 text-[13.5px] leading-[1.6] text-salvia-spenta">
                    Note del cliente: {prossimo.note_cliente}
                  </div>
                )}
              </div>
              <AnnullaAppuntamento appuntamentoId={prossimo.id} />
            </div>
          ) : (
            <div className="text-[15px] text-felce">Da fissare</div>
          )}
        </div>

        <div className="mb-[14px] text-[14px] font-bold text-bosco">Storico sedute</div>
        {passati.length === 0 ? (
          <div className="rounded-2xl border border-bordo bg-white px-6 py-6 text-[14.5px] text-felce">
            Nessuna seduta svolta finora.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {passati.map((seduta) => (
              <div
                key={seduta.id}
                className="rounded-2xl border border-bordo bg-white px-6 py-[18px]"
              >
                <div className="mb-[6px] text-[13px] font-bold text-salvia">
                  {formattaData(new Date(seduta.inizio))} ·{" "}
                  {etichettaModalita(seduta.modalita)}
                </div>
                <NotaEditor appuntamentoId={seduta.id} nota={seduta.nota_seduta} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
