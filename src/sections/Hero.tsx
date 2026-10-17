import { scrollToId } from '../state/scroll';

export function Hero() {
  return (
    <section id="top" className="section hero" aria-labelledby="hero-title">
      <div className="hero-rotate" data-rotate aria-hidden="true" />
      <div className="hero-copy">
        <span className="eyebrow" data-reveal>An exhibition of mechanical watchmaking</span>
        <h1 id="hero-title" className="display hero-title">
          <span className="line"><span>ENGINEERED</span></span>{' '}
          <span className="line"><span><em>TO LAST.</em></span></span>
        </h1>
        <p className="lede" data-reveal data-delay="0.6">
          Discover the extraordinary engineering hidden beneath timeless design.
        </p>
        <div data-reveal data-delay="0.8">
          <a href="#object" className="btn" onClick={(e) => { e.preventDefault(); scrollToId('object'); }}>
            Explore the Craft <span className="arrow" />
          </a>
        </div>
      </div>
      <div className="hero-meta">
        <p className="fine">
          An independent educational concept inspired by the heritage of Swiss watchmaking.
          Not affiliated with or endorsed by any watch manufacturer.
        </p>
        <button className="scroll-indicator" onClick={() => scrollToId('object')} aria-label="Scroll to the next section">
          <span>Scroll</span>
          <span className="track" />
        </button>
        <p className="fine" style={{ textAlign: 'right' }}>Drag the watch to rotate it.</p>
      </div>
    </section>
  );
}
