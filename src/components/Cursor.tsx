import { useEffect, useRef } from 'react';

/** A soft trailing ring that grows over links and reads "DRAG" over rotate zones. Fine pointers only. */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const el = ref.current!;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let x = -100, y = -100, cx = x, cy = y, raf = 0;

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      el.classList.add('is-visible');
      const t = e.target as Element | null;
      const interactive = t?.closest('a, button, [role="button"], input, label');
      const drag = !interactive && t?.closest('[data-rotate]');
      el.classList.toggle('is-link', !!interactive);
      el.classList.toggle('is-drag', !!drag);
    };
    const onLeave = () => el.classList.remove('is-visible');
    const tick = () => {
      const k = reduced ? 1 : 0.2;
      cx += (x - cx) * k;
      cy += (y - cy) * k;
      el.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <div ref={ref} className="cursor" aria-hidden="true">
      <span>DRAG</span>
    </div>
  );
}
