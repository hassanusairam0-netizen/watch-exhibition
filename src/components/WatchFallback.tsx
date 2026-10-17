/** Static illustration shown only when WebGL is unavailable — clearly labelled as such. */
export function WatchFallback() {
  const ticks = Array.from({ length: 60 }, (_, i) => i);
  return (
    <>
      <div className="fallback" aria-hidden="true">
        <svg className="fallback-watch" viewBox="-120 -170 240 340">
          <defs>
            <radialGradient id="fb-dial" cx="0.45" cy="0.4" r="0.7">
              <stop offset="0" stopColor="#1f5c45" />
              <stop offset="1" stopColor="#06231a" />
            </radialGradient>
            <linearGradient id="fb-steel" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0" stopColor="#f2f4f6" />
              <stop offset="0.45" stopColor="#8d9297" />
              <stop offset="0.7" stopColor="#dfe2e5" />
              <stop offset="1" stopColor="#5d6267" />
            </linearGradient>
          </defs>
          <rect x="-50" y="-170" width="100" height="120" rx="10" fill="url(#fb-steel)" opacity="0.7" />
          <rect x="-50" y="50" width="100" height="120" rx="10" fill="url(#fb-steel)" opacity="0.7" />
          <circle r="104" fill="url(#fb-steel)" />
          <circle r="92" fill="#0d3d2d" />
          <circle r="74" fill="url(#fb-dial)" />
          {ticks.map((i) => (
            <rect key={i} x="-0.6" y="-72" width={i % 5 ? 1.2 : 3} height={i % 5 ? 4 : 9} fill="#e6d3a8" transform={`rotate(${i * 6})`} />
          ))}
          <rect x="-1.5" y="-46" width="3" height="50" fill="#e8c98c" transform="rotate(300)" />
          <rect x="-1.2" y="-64" width="2.4" height="68" fill="#e8c98c" transform="rotate(50)" />
          <circle r="4" fill="#e8c98c" />
          <rect x="102" y="-9" width="12" height="18" rx="2" fill="url(#fb-steel)" />
        </svg>
      </div>
      <p className="fallback-note fine">
        Interactive 3D requires WebGL, which isn’t available in this browser. A static illustration is shown instead.
      </p>
    </>
  );
}
