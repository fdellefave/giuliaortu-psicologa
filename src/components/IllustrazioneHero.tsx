/**
 * Illustrazione stilizzata della hero (restyling caldo 2026):
 * un arco color sabbia, il sole terracotta e una pianta di salvia.
 * È un SVG decorativo disegnato a mano nei colori della palette
 * (vedi globals.css); occupa lo stesso riquadro 4/5 della foto.
 */
export default function IllustrazioneHero() {
  return (
    <div
      className="w-full overflow-hidden rounded-[28px] border border-bordo bg-crema"
      style={{ aspectRatio: "4/5" }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 400 500"
        className="h-full w-full"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Sole terracotta */}
        <circle cx="308" cy="98" r="46" fill="#6F7D60" />
        <circle cx="308" cy="98" r="62" fill="none" stroke="#D9C7B8" strokeWidth="2" />

        {/* Arco color sabbia */}
        <path
          d="M84 500V240c0-64 52-116 116-116s116 52 116 116v260Z"
          fill="#D9C7B8"
        />
        <path
          d="M110 500V246c0-50 40-90 90-90s90 40 90 90v254Z"
          fill="#EFE8DC"
          opacity="0.55"
        />

        {/* Colline in basso */}
        <ellipse cx="52" cy="512" rx="160" ry="76" fill="#E4D9C8" />
        <ellipse cx="356" cy="518" rx="180" ry="84" fill="#E4D9C8" />

        {/* Pianta di salvia: steli */}
        <path d="M200 436V320" stroke="#6F7D60" strokeWidth="6" strokeLinecap="round" />
        <path
          d="M199 392c-26-12-38-30-41-56"
          stroke="#6F7D60"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M201 392c26-12 38-30 41-56"
          stroke="#6F7D60"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Foglie */}
        <path d="M200 322c-17-27-17-49 0-68 17 19 17 41 0 68Z" fill="#8C9A7B" />
        <path
          d="M158 338c-22-8-33-22-36-42 20 2 33 12 40 30-2 5-3 9-4 12Z"
          fill="#8C9A7B"
        />
        <path
          d="M242 338c22-8 33-22 36-42-20 2-33 12-40 30 2 5 3 9 4 12Z"
          fill="#6F7D60"
        />
        <path d="M177 366c-14-4-22-13-25-27 13 1 22 8 27 20l-2 7Z" fill="#6F7D60" />
        <path d="M223 366c14-4 22-13 25-27-13 1-22 8-27 20l2 7Z" fill="#8C9A7B" />

        {/* Vaso */}
        <path d="M156 436h88l-9 64h-70Z" fill="#2C251E" />
        <rect x="150" y="430" width="100" height="14" rx="7" fill="#A64F2E" />

        {/* Dettagli sparsi */}
        <circle cx="86" cy="132" r="4" fill="#6F7D60" />
        <circle cx="118" cy="86" r="3" fill="#8C9A7B" />
        <path
          d="M60 210c8 2 12 6 14 14 2-8 6-12 14-14-8-2-12-6-14-14-2 8-6 12-14 14Z"
          fill="#6F7D60"
        />
        <path
          d="M318 236c6 1.5 9 4.5 10.5 10.5 1.5-6 4.5-9 10.5-10.5-6-1.5-9-4.5-10.5-10.5-1.5 6-4.5 9-10.5 10.5Z"
          fill="#8C9A7B"
        />
      </svg>
    </div>
  );
}
