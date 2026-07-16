import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { creaClientServer } from "@/lib/supabase/server";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Area riservata",
  robots: { index: false },
};

export default async function AreaRiservata() {
  const supabase = await creaClientServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect("/area-riservata/clienti");

  return (
    <div className="min-h-screen bg-bosco">
      <div className="flex min-h-screen items-center justify-center p-6">
        <LoginForm />
      </div>
    </div>
  );
}
