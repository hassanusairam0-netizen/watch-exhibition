/** Macro view of a ceramic bezel arc with engraved, metal-filled graduations. */
export function CeramicSurface() {
  const cx = 200;
  const cy = 560;
  const rOut = 470;
  const rIn = 330;
  const marks = Array.from({ length: 21 }, (_, i) => i - 10);
  return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <radialGradient id="cer-body" cx="200" cy="560" r="470" gradientUnits="userSpaceOnUse">
          <stop offset="0.7" stopColor="#06261b" />
          <stop offset="0.86" stopColor="#0f4a36" />
          <stop offset="1" stopColor="#05221a" />
        </radialGradient>
        <linearGradient id="cer-gloss" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.42" stopColor="#fff" stopOpacity="0.28" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="cer-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6e7c4" />
          <stop offset="1" stopColor="#b8955a" />
        </linearGradient>
      </defs>
      <circle cx={cx} cy={cy} r={rOut} fill="url(#cer-body)" />
      <circle cx={cx} cy={cy} r={rIn} fill="#030d09" />
      <circle cx={cx} cy={cy} r={rIn} fill="none" stroke="#c8ccd0" strokeOpacity="0.5" strokeWidth="3" />
      {marks.map((m) => {
        const deg = m * 3;
        const major = m % 5 === 0;
        return (
          <g key={m} transform={`rotate(${deg} ${cx} ${cy})`}>
            {major ? (
              <text x={cx} y={cy - (rIn + rOut) / 2 + 14} textAnchor="middle" fontFamily="Manrope, sans-serif" fontWeight="600" fontSize="40" fill="url(#cer-fill)">
                {String(((m / 5 + 8) % 12) * 5).padStart(2, '0')}
              </text>
            ) : (
              <rect x={cx - 2.5} y={cy - rOut + 22} width="5" height="34" rx="1" fill="url(#cer-fill)" />
            )}
          </g>
        );
      })}
      <rect x="0" y="0" width="400" height="300" fill="url(#cer-gloss)" />
    </svg>
  );
}
