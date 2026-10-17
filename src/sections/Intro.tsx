import { scene } from '../state/store';
import { MinusIcon, PlusIcon, ResetIcon } from '../components/Icons';

const zoomBy = (f: number) => {
  scene.user.zoom = Math.min(1.8, Math.max(0.6, scene.user.zoom * f));
  scene.user.lastInteraction = performance.now();
};
const reset = () => {
  scene.user.yaw = 0;
  scene.user.pitch = 0;
  scene.user.zoom = 1;
};

export function Intro() {
  return (
    <section id="object" className="section intro" aria-labelledby="intro-title">
      <div className="intro-sticky">
        <div className="intro-copy">
          <span className="eyebrow" data-reveal>I — The Object</span>
          <h2 id="intro-title" className="h2" data-reveal>
            Every surface,<br /><em className="display">considered.</em>
          </h2>
          <p className="lede" data-reveal>
            Polished bevels catch the light while brushed flanks soften it. A ceramic bezel frames
            a sunburst dial, and beneath the sapphire, applied markers rise like architecture.
            Turn it in your hand.
          </p>
          <ul className="spec-list" data-reveal aria-label="About this concept watch">
            <li><span>Concept</span><span>Three-hand automatic, date</span></li>
            <li><span>Case</span><span>40 mm, polished &amp; brushed steel</span></li>
            <li><span>Bezel</span><span>Unidirectional, ceramic insert</span></li>
            <li><span>Note</span><span>An original design for this exhibition</span></li>
          </ul>
        </div>
        <div className="intro-stage" data-rotate>
          <div className="intro-controls">
            <span className="intro-hint">Drag to rotate · Pinch or ⌘/Ctrl + scroll to zoom</span>
            <button className="icon-btn" onClick={() => zoomBy(1 / 1.15)} aria-label="Zoom out"><MinusIcon /></button>
            <button className="icon-btn" onClick={() => zoomBy(1.15)} aria-label="Zoom in"><PlusIcon /></button>
            <button className="icon-btn" onClick={reset} aria-label="Reset view"><ResetIcon /></button>
          </div>
        </div>
      </div>
    </section>
  );
}
