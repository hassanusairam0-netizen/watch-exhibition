import { HEARTBEAT_STAGES } from '../data/content';
import { scene, setUi, useUi } from '../state/store';

export function Heartbeat() {
  const stage = useUi((s) => s.beatStage);
  const realSpeed = useUi((s) => s.realSpeed);

  // Rapid 4 Hz oscillation is withheld when the visitor prefers reduced motion.
  const reduced = scene.reducedMotion;

  const setSpeed = (real: boolean) => {
    scene.balanceRate = real ? 1 : 0.125;
    setUi({ realSpeed: real });
  };

  return (
    <section id="movement" className="heartbeat" aria-labelledby="movement-title">
      <div className="heartbeat-sticky">
        <div className="heartbeat-copy">
          <span className="eyebrow">III — The Heartbeat</span>
          <h2 id="movement-title" className="h2">How energy<br />becomes time.</h2>
          <ol className="beat-stages">
            {HEARTBEAT_STAGES.map((s, i) => (
              <li key={s.title} className={i === stage ? 'is-active' : ''} aria-current={i === stage ? 'step' : undefined}>
                <h3><small>{String(i + 1).padStart(2, '0')} · {s.kicker}</small>{s.title}</h3>
                <p><span>{s.text}</span></p>
              </li>
            ))}
          </ol>
        </div>
        <div className="heartbeat-tools">
          <div className="toggle" role="group" aria-label="Balance wheel speed">
            <button aria-pressed={!realSpeed} onClick={() => setSpeed(false)}>Slow motion</button>
            <button
              aria-pressed={realSpeed && !reduced}
              disabled={reduced}
              title={reduced ? 'Unavailable while reduced motion is enabled' : undefined}
              onClick={() => setSpeed(true)}
            >
              4 Hz
            </button>
          </div>
          {reduced && <span className="fine">Real-time speed is off because reduced motion is enabled.</span>}
        </div>
      </div>
    </section>
  );
}
