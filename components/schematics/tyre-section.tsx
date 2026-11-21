export function TyreSection() {
  return (
    <div>
      <svg className="schematic" viewBox="0 0 340 190" role="img" aria-label="Tyre cross-section showing tread, sidewall, bead and rim">
        <g fill="none" stroke="currentColor" strokeWidth="1.4">
          <path d="M92 32h156c14 0 26 10 30 24l12 48c4 16-2 30-14 40l-18 16H82L64 144c-12-10-18-24-14-40l12-48c4-14 16-24 30-24Z" />
          <path d="M104 44h132c9 0 17 6 20 15l11 42c3 12-2 22-10 30l-16 14H99l-16-14c-8-8-13-18-10-30l11-42c3-9 11-15 20-15Z" strokeDasharray="3 3" />
          <path d="M118 60h104l8 34c2 9-1 16-7 22l-12 10h-82l-12-10c-6-6-9-13-7-22l8-34Z" />
          <path d="M78 150h184v10H78z" />
          <path d="M126 160v10m88-10v10" />
          <path d="M170 24v14M170 38l-6-6m6 6 6-6" />
        </g>
        <g fill="currentColor" fontSize="9" fontFamily="Barlow, sans-serif">
          <text x="222" y="20">Tread</text>
          <text x="272" y="106">Sidewall</text>
          <text x="278" y="164">Bead / rim seal</text>
          <text x="24" y="106">Shoulder</text>
        </g>
        <g stroke="currentColor" strokeWidth="0.8" opacity="0.6">
          <path d="M218 24h-30v18" />
          <path d="M268 110h-26" />
          <path d="M274 162h-40" />
          <path d="M66 110h28" />
        </g>
      </svg>
      <p className="schematic-caption">Cross-section. We check the bead line on both sides after fitting.</p>
    </div>
  );
}
