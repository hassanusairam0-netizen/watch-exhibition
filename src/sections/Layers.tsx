import { COMPONENTS } from '../data/components';
import { setUi, useUi } from '../state/store';
import { scrollToId, scrollToLayerStep } from '../state/scroll';
import { NextIcon, PrevIcon } from '../components/Icons';

export function Layers() {
  const step = useUi((s) => s.step);
  const assembled = useUi((s) => s.assembled);
  const inSection = useUi((s) => s.section === 'layers');
  const c = step >= 0 ? COMPONENTS[step] : null;
  const showPanel = !!c && !assembled;

  return (
    <section id="layers" className="layers" aria-labelledby="layers-title">
      <div className={`layers-sticky ${showPanel ? 'is-inspecting' : ''}`}>
        <div className="layers-rotate" data-rotate aria-hidden="true" />

        <div className="layers-head">
          <div>
            <span className="eyebrow">II — Discover the Layers</span>
            <h2 id="layers-title" className="h2">Ten parts, one purpose.</h2>
          </div>
          <div className="layers-actions">
            <button
              className="btn btn--ghost"
              aria-pressed={assembled}
              onClick={() => {
                if (assembled) {
                  setUi({ assembled: false });
                  if (step < 0) scrollToLayerStep(0);
                } else setUi({ assembled: true });
              }}
            >
              {assembled ? 'Explode view' : 'Assemble watch'}
            </button>
            <button className="btn btn--ghost" onClick={() => scrollToId('movement')}>
              Skip
            </button>
          </div>
        </div>

        <div className={`layers-intro ${step >= 0 && !assembled ? 'is-hidden' : ''}`}>
          <p className="lede">
            {assembled
              ? 'Reassembled. Choose a component, or scroll, to separate the layers again.'
              : 'Scroll to separate the watch into its components. Select any label to inspect it.'}
          </p>
        </div>

        <div className={`panel ${showPanel ? '' : 'is-hidden'}`} aria-live="polite">
          {c && (
            <div key={c.id} className="panel-swap">
              <div className="panel-index">
                <b>{String(step + 1).padStart(2, '0')}</b>/ {COMPONENTS.length}
              </div>
              <h3 className="panel-title">{c.name}</h3>
              <p className="panel-body">{c.description}</p>
              <p className="panel-typical">
                <strong>Commonly made from</strong>
                {c.typical}
              </p>
              <div className="panel-nav">
                <button
                  className="icon-btn"
                  aria-label="Previous component"
                  disabled={step <= 0}
                  onClick={() => scrollToLayerStep(Math.max(0, step - 1))}
                >
                  <PrevIcon />
                </button>
                <button
                  className="icon-btn"
                  aria-label="Next component"
                  disabled={step >= COMPONENTS.length - 1}
                  onClick={() => scrollToLayerStep(Math.min(COMPONENTS.length - 1, step + 1))}
                >
                  <NextIcon />
                </button>
              </div>
            </div>
          )}
        </div>

        <ul className="component-index" aria-label="Watch components">
          {COMPONENTS.map((comp, i) => (
            <li key={comp.id}>
              <button
                className={i === step && !assembled ? 'is-active' : ''}
                aria-current={i === step && !assembled ? 'step' : undefined}
                tabIndex={inSection ? 0 : -1}
                onClick={() => scrollToLayerStep(i)}
              >
                <span className="label-text">{comp.name}</span>
                <span className="tick" />
              </button>
            </li>
          ))}
        </ul>

        <p className="layers-disclaimer fine">
          A representative, simplified construction. Actual materials, layouts and part counts vary by manufacturer and model.
        </p>
      </div>
    </section>
  );
}
