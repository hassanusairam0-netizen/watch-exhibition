import { COMPONENT_COUNT } from '../data/components';
import { HEARTBEAT_STAGES } from '../data/content';
import { scene, getUi } from '../state/store';
import { LAYERS } from '../state/scroll';
import { FOCUS_POINTS, range, smooth } from './rig';

/** A camera framing, in spherical coordinates around a target. */
export type Shot = {
  az: number;
  el: number;
  dist: number;
  target: [number, number, number];
  /** Screen-space offset of the framing centre (fraction of viewport). */
  shift: [number, number];
};

export type Targets = {
  shot: Shot;
  explode: number[];
  light: number[];
  labels: number;
  focus: number;
  /** Allow idle sway / pointer parallax. */
  idle: number;
};

const shot = (az: number, el: number, dist: number, target: [number, number, number] = [0, 0, 0], shift: [number, number] = [0, 0]): Shot => ({ az, el, dist, target, shift });

export function lerpShot(a: Shot, b: Shot, t: number): Shot {
  const l = (x: number, y: number) => x + (y - x) * t;
  return {
    az: l(a.az, b.az),
    el: l(a.el, b.el),
    dist: l(a.dist, b.dist),
    target: [l(a.target[0], b.target[0]), l(a.target[1], b.target[1]), l(a.target[2], b.target[2])],
    shift: [l(a.shift[0], b.shift[0]), l(a.shift[1], b.shift[1])],
  };
}

/** Per-component inspection framings: front for the dial side, back for the movement. */
const FOCUS: [number, number, number][] = [
  // az, el, dist
  [0.55, 0.32, 5.2],
  [0.5, 0.42, 5.0],
  [0.32, 0.22, 4.6],
  [0.95, 0.3, 5.2],
  [2.55, 0.32, 4.8],
  [2.7, 0.42, 2.8],
  [2.35, 0.42, 3.4],
  [1.5, 0.3, 10.5],
  [2.75, 0.3, 4.8],
  [0.85, 0.42, 12],
];

/** Parts hidden while inspecting a step, because they would sit between camera and subject. */
const HIDE: number[][] = [[9], [9], [0, 1, 9], [0, 1], [7, 8, 9], [7, 8, 9], [7, 8, 9], [], [9], []];

const fill = (v: number) => Array.from({ length: COMPONENT_COUNT }, () => v);

/** Pure mapping: scroll state → where everything should be. */
export function computeTargets(aspect: number): Targets {
  const portrait = aspect < 0.85;
  const P = scene.progress;
  const ui = getUi();
  const k = portrait ? 1.55 : 1; // portrait screens need more distance
  const sx = portrait ? 0 : 1;
  const sy = portrait ? 1 : 0;

  const HERO = shot(0.42, 0.1, portrait ? 14 : 8.4, [0, 0, 0], [0.22 * sx, 0.2 * sy]);
  const INTRO = shot(-0.35 + P.intro * 0.5, 0.2, portrait ? 12 : 5.4, [0, 0, 0], [0.2 * sx, 0.14 * sy]);
  const OVERVIEW = portrait
    ? shot(0.45, 0.95, 15, [0, 0, -0.3], [0, 0.2])
    : shot(0.95, 0.3, 12.5, [0, 0, -0.3], [0.17, 0]);
  const ASSEMBLED = shot(0.5, 0.25, portrait ? 10 : 6, [0, 0, 0], [0.12 * sx, 0.18 * sy]);

  const base: Targets = { shot: HERO, explode: fill(0), light: fill(1), labels: 0, focus: -1, idle: 1 };

  switch (scene.active) {
    case 'hero':
    case 'intro': {
      const t = smooth(range(P.hero, 0.05, 0.95));
      return { ...base, shot: lerpShot(HERO, INTRO, t), idle: 1 - t * 0.6 };
    }

    case 'layers': {
      if (ui.assembled) return { ...base, shot: ASSEMBLED, idle: 0.4 };
      const p = P.layers;
      const e = smooth(range(p, 0, LAYERS.explodeEnd));
      const step = ui.step;
      const explode = fill(e);
      if (step < 0) {
        const s = lerpShot(INTRO, OVERVIEW, smooth(range(p, 0, LAYERS.explodeEnd * 0.6)));
        return { ...base, shot: s, explode: fill(smooth(range(p, 0, LAYERS.explodeEnd * 0.6))), labels: e > 0.8 ? 1 : 0, idle: 0 };
      }
      const [az, el, dist] = FOCUS[step];
      const focusShot = shot(
        az,
        portrait ? el + 0.2 : el,
        dist * k,
        FOCUS_POINTS[step],
        [0.13 * sx, 0.24 * sy],
      );
      const light = fill(0.14);
      for (const h of HIDE[step]) light[h] = 0;
      light[step] = 1;
      return { ...base, shot: focusShot, explode, light, labels: 1, focus: step, idle: 0 };
    }

    case 'heartbeat': {
      const stage = HEARTBEAT_STAGES[ui.beatStage];
      const focus = stage.focus[0];
      const light = fill(0);
      light[4] = focus === 4 ? 1 : 0.3;
      light[5] = focus === 5 ? 1 : 0.3;
      light[6] = focus === 6 ? 1 : 0.3;
      if (focus === 2) light[2] = 1;
      if (focus === 5) light[6] = 0; // barrel bridge would loom in front of the balance
      const shift: [number, number] = [-0.17 * sx, 0.2 * sy];
      let s: Shot;
      if (focus === 2) s = shot(0.3, 0.2, 4.4 * k, FOCUS_POINTS[2], shift);
      else if (focus === 4) s = shot(2.6, 0.45, 5.2 * k, [0, 0, -1.7], shift);
      else s = shot(focus === 5 ? 2.75 : 2.4, 0.42, (focus === 5 ? 2.7 : 3.2) * k, FOCUS_POINTS[focus], shift);
      return { ...base, shot: s, explode: fill(1), light, idle: 0 };
    }

    case 'reassembly': {
      const p = P.reassembly;
      const e = 1 - smooth(range(p, 0.08, 0.8));
      const t = smooth(range(p, 0, 0.9));
      const end = shot(-0.3 + Math.PI * 2, 0.12, portrait ? 10.5 : 6.4, [0, 0, 0], [0, -0.12]);
      const s = lerpShot(OVERVIEW, end, t);
      return { ...base, shot: s, explode: fill(e), light: fill(Math.min(1, 0.4 + p * 3)), idle: 0 };
    }

    case 'materials':
    case 'finale':
    default: {
      const FINALE = shot(Math.PI * 2 - 0.15, 0.04, portrait ? 13 : 9.6, [0, 0, 0], [0, -0.02]);
      return { ...base, shot: FINALE, idle: 1 };
    }
  }
}
