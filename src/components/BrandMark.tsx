/** Original monogram for the fictional "Aurel" exhibition — not a trademarked emblem. */
export function BrandMark({ className = 'brand-mark' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <circle cx="16" cy="16" r="14.5" stroke="currentColor" strokeWidth="0.8" />
      <circle cx="16" cy="16" r="11" stroke="currentColor" strokeWidth="0.4" opacity="0.6" />
      <path d="M16 6.5 L20.6 22 H18.4 L17.3 18.4 H14.7 L13.6 22 H11.4 Z M15.2 16.6 H16.8 L16 13.8 Z" fill="currentColor" />
      <path d="M16 1.5 V4" stroke="currentColor" strokeWidth="0.8" />
    </svg>
  );
}
