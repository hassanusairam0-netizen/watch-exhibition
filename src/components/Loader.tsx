import { useEffect, useState } from 'react';
import { BrandMark } from './BrandMark';
import { useUi } from '../state/store';

/** Brief, refined veil while the WebGL studio compiles. Never blocks for long. */
export function Loader() {
  const ready = useUi((s) => s.ready || s.fallback);
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setTimedOut(true), 6000);
    return () => clearTimeout(t);
  }, []);

  const done = ready || timedOut;
  return (
    <div className={`loader ${done ? 'is-done' : ''}`} aria-hidden={done} role="status">
      <div className="loader-inner">
        <span className="brand">
          <BrandMark />
          AUREL
        </span>
        <div className="loader-bar" />
        <span className="sr-only">Preparing the exhibition</span>
      </div>
    </div>
  );
}
