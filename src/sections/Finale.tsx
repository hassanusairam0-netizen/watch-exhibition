import { scrollToId } from '../state/scroll';

export function Finale() {
  return (
    <section id="finale" className="finale" aria-labelledby="finale-title">
      <div className="finale-sticky">
        <div className="finale-rotate" data-rotate aria-hidden="true" />
        <div style={{ position: 'relative' }}>
          <span className="eyebrow" data-reveal>VI — Finale</span>
          <h2 id="finale-title" className="display finale-title" data-reveal>
            Built for <em>generations.</em>
          </h2>
        </div>
        <div className="finale-bottom">
          <p className="lede" data-reveal>
            Hundreds of hours of design, a few hundred parts, and one quiet promise —
            that it will still be keeping time long after today.
          </p>
          <a href="#top" className="btn" data-reveal onClick={(e) => { e.preventDefault(); scrollToId('top'); }}>
            Begin again <span className="arrow" />
          </a>
        </div>
      </div>
    </section>
  );
}
