export function AlignmentDiagram() {
  return (
    <div>
      <svg className="schematic" viewBox="0 0 340 190" role="img" aria-label="Top-down wheel alignment diagram showing camber, toe and thrust line">
        <g fill="none" stroke="currentColor" strokeWidth="1.3">
          <rect x="132" y="16" width="76" height="158" rx="26" />
          <path d="M148 34h44v36h-44zM148 120h44v36h-44z" opacity="0.5" />
          <rect x="108" y="36" width="18" height="38" rx="3" />
          <rect x="214" y="36" width="18" height="38" rx="3" />
          <rect x="108" y="116" width="18" height="38" rx="3" />
          <rect x="214" y="116" width="18" height="38" rx="3" />
          <path d="M170 6v178" strokeDasharray="4 4" opacity="0.55" />
          <path d="M117 36l7-8m-7 8 9 3M223 36l-7-8m7 8-9 3" />
          <path d="M117 154l7 8m-7-8 9-3M223 154l-7 8m7-8-9-3" />
        </g>
        <g fill="currentColor" fontSize="9" fontFamily="Barlow, sans-serif">
          <text x="14" y="40">Camber</text>
          <text x="270" y="40">Toe</text>
          <text x="14" y="164">Rear toe</text>
          <text x="252" y="164">Thrust line</text>
        </g>
        <g stroke="currentColor" strokeWidth="0.8" opacity="0.6">
          <path d="M60 38h46M266 38h-32M66 162h38M248 162h-40" />
        </g>
      </svg>
      <p className="schematic-caption">Measurement points. Camber, caster and toe are recorded at each corner.</p>
    </div>
  );
}
