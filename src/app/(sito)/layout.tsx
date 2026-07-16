import Header from "@/components/Header";
import Footer from "@/components/Footer";

/**
 * Layout delle pagine pubbliche: header e footer condivisi.
 * L'area riservata (fuori da questo gruppo) non li mostra,
 * come nel mockup approvato.
 */
export default function LayoutSito({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
