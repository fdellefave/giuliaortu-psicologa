import Link from "next/link";
import { STUDIO } from "@/lib/config";
import { esci } from "./actions";

export default function BarraDashboard() {
  return (
    <div className="flex items-center justify-between bg-bosco px-7 py-5">
      <div className="text-[16px] font-bold text-white">Dashboard · {STUDIO.nome}</div>
      <div className="flex items-center gap-5">
        <Link href="/" className="text-[13.5px] text-[#B9C2AE] hover:text-white">
          Torna al sito
        </Link>
        <form action={esci}>
          <button
            type="submit"
            className="cursor-pointer rounded-full border-none bg-[rgba(255,255,255,0.12)] px-4 py-2 text-[13.5px] text-white hover:bg-[rgba(255,255,255,0.2)]"
          >
            Esci
          </button>
        </form>
      </div>
    </div>
  );
}
