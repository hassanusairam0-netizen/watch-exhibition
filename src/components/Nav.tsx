import { useEffect, useState } from 'react';
import { BrandMark } from './BrandMark';
import { scrollToId } from '../state/scroll';
import { scene } from '../state/store';

const LINKS = [
  { id: 'object', label: 'The Object' },
  { id: 'layers', label: 'Layers' },
  { id: 'movement', label: 'Movement' },
  { id: 'materials', label: 'Materials' },
  { id: 'finale', label: 'Finale' },
];

export function Nav({ active }: { active: string }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    scene.menuOpen = open;
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    scrollToId(id);
  };

  return (
    <header className={`nav ${scrolled ? 'is-scrolled' : ''}`}>
      <a href="#top" className="brand" onClick={go('top')} aria-label="Aurel — back to top">
        <BrandMark />
        AUREL
      </a>
      <nav aria-label="Sections">
        <button
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="nav-links"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
        </button>
        <ul id="nav-links" className={`nav-links ${open ? 'is-open' : ''}`}>
          {LINKS.map((l) => (
            <li key={l.id}>
              <a
                href={`#${l.id}`}
                onClick={go(l.id)}
                className={active === l.id ? 'is-active' : ''}
                aria-current={active === l.id ? 'true' : undefined}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
