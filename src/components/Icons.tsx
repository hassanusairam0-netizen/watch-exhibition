const base = { viewBox: '0 0 16 16', fill: 'none', stroke: 'currentColor', strokeWidth: 1.2, 'aria-hidden': true } as const;

export const PlusIcon = () => (
  <svg {...base}><path d="M8 3v10M3 8h10" /></svg>
);
export const MinusIcon = () => (
  <svg {...base}><path d="M3 8h10" /></svg>
);
export const ResetIcon = () => (
  <svg {...base}><path d="M3 8a5 5 0 1 0 1.6-3.7M3 2.5v2.8h2.8" /></svg>
);
export const PrevIcon = () => (
  <svg {...base}><path d="M10 3 5 8l5 5" /></svg>
);
export const NextIcon = () => (
  <svg {...base}><path d="m6 3 5 5-5 5" /></svg>
);
export const InfoIcon = () => (
  <svg viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
    <circle cx="22" cy="22" r="20" />
    <path d="M22 19v12M22 13v2" />
  </svg>
);
