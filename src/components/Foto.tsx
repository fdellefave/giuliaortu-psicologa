import Image from "next/image";

type Props = {
  /** Etichetta mostrata nel segnaposto, es. "foto professionale · ritratto". */
  etichetta: string;
  /** Proporzioni, es. "4/5" oppure "1/1". */
  ratio: string;
  /** Raggio degli angoli in pixel. */
  radius: number;
  /** Controlla come l'immagine viene adattata al contenitore. */
  objectFit?: "cover" | "contain";
  /**
   * Percorso della foto reale (es. "/images/ritratto.jpg").
   * Finché non viene indicato, resta il segnaposto a righe del mockup.
   * Per aggiungere le foto: copiare i file in `public/images/` e passare
   * qui il percorso (vedi GUIDA-GESTIONE.md).
   */
  src?: string;
  /** Testo alternativo della foto (accessibilità). */
  alt?: string;
  className?: string;
};

export default function Foto({ etichetta, ratio, radius, src, alt, className, objectFit = "cover" }: Props) {
  if (src) {
    return (
      <div
        className={`relative w-full overflow-hidden ${className ?? ""}`}
        style={{ aspectRatio: ratio, borderRadius: radius }}
      >
        <Image
          src={src}
          alt={alt ?? etichetta}
          fill
          className={objectFit === "contain" ? "object-contain" : "object-cover"}
        />
      </div>
    );
  }

  return (
    <div
      className={`segnaposto-foto w-full ${className ?? ""}`}
      style={{ aspectRatio: ratio, borderRadius: radius }}
      role="img"
      aria-label={alt ?? etichetta}
    >
      <span>{etichetta}</span>
    </div>
  );
}
