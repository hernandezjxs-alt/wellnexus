export function Logo({ size = 40 }: { size?: number }) {
  return (
    <svg viewBox="0 0 80 80" width={size} height={size} aria-hidden="true" className="shrink-0">
      <rect width="80" height="80" rx="20" fill="#3E6A94" />
      <polyline points="16,22 28,56 40,30 52,56 64,22" fill="none" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      {[[16, 22], [28, 56], [52, 56], [64, 22]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="4.5" fill="#BFE6FB" />)}
      <circle cx="40" cy="30" r="7" fill="#7DD3FC" stroke="#3E6A94" strokeWidth="2.5" />
      <g className="v5-only"><rect x="14" y="65" width="17.3" height="5" fill="#FFCC00" /><rect x="31.3" y="65" width="17.3" height="5" fill="#17212F" /><rect x="48.6" y="65" width="17.4" height="5" fill="#E5394B" /></g>
    </svg>
  );
}
