import { MATERIALS } from '../data/content';
import { InfoIcon } from '../components/Icons';
import { CeramicSurface } from '../components/CeramicSurface';

function onMove(e: React.PointerEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
  e.currentTarget.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
}

export function Materials() {
  return (
    <section id="materials" className="section materials" aria-labelledby="materials-title">
      <div className="materials-head">
        <div>
          <span className="eyebrow" data-reveal>V — Materials &amp; Craftsmanship</span>
          <h2 id="materials-title" className="h2" data-reveal>
            Chosen for a<br /><em className="display">lifetime.</em>
          </h2>
        </div>
        <p className="lede" data-reveal>
          A fine watch is a study in materials science. Here are the families of materials most
          commonly found in luxury watchmaking — and why they are used.
        </p>
      </div>

      <div className="material-grid">
        {MATERIALS.map((m, i) => (
          <article key={m.id} className="material-card" data-reveal data-delay={(i % 3) * 0.12} aria-labelledby={`mat-${m.id}`}>
            <div className="material-visual" onPointerMove={onMove} aria-hidden="true">
              <div className={`surface surface--${m.visual}`}>
                {m.visual === 'ceramic' && <CeramicSurface />}
              </div>
              <div className="sheen" />
            </div>
            <div className="material-body">
              <span className="eyebrow">{m.kicker}</span>
              <h3 id={`mat-${m.id}`}>{m.title}</h3>
              <p>{m.text}</p>
              <ul>
                {m.points.map((p) => <li key={p}>{p}</li>)}
              </ul>
            </div>
          </article>
        ))}
      </div>

      <aside className="notice" data-reveal aria-labelledby="notice-title">
        <InfoIcon />
        <div>
          <h3 id="notice-title">General knowledge vs. model-specific facts</h3>
          <p>
            <span className="tag">General</span>
            Everything on this page describes common watchmaking practice. Materials, alloys,
            movement architecture and water resistance differ between brands, collections and
            individual references.
          </p>
          <p>
            <span className="tag">Model-specific</span>
            For a particular watch, rely on the manufacturer’s official documentation. For
            example, Rolex publicly describes its steel as “Oystersteel”, which it states
            belongs to the 904L family — a manufacturer statement, not an industry standard.
          </p>
        </div>
      </aside>
    </section>
  );
}
