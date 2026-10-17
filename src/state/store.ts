import { useSyncExternalStore } from 'react';

/**
 * Two kinds of state live here:
 *
 * 1. `scene` — a mutable object written by scroll/pointer handlers and read every
 *    frame inside the WebGL render loop. It never triggers React renders.
 * 2. `ui` — a tiny observable store for discrete values the DOM needs to react to
 *    (active component, assembled toggle, ...).
 */

export type SectionId =
  | 'hero'
  | 'intro'
  | 'layers'
  | 'heartbeat'
  | 'reassembly'
  | 'materials'
  | 'finale';

export const scene = {
  /** 0..1 progress of each section through the viewport (set by ScrollTrigger). */
  progress: {
    hero: 0,
    intro: 0,
    layers: 0,
    heartbeat: 0,
    reassembly: 0,
    materials: 0,
    finale: 0,
  } as Record<SectionId, number>,
  /** Section whose area currently contains the viewport centre. */
  active: 'hero' as SectionId,
  /** Fraction of the viewport the footer has pushed up — the finale watch scrolls away with it. */
  footerShift: 0,
  /** True while an opaque section fully covers the canvas — rendering pauses. */
  covered: false,
  /** Full-screen mobile menu is open — rendering pauses behind it. */
  menuOpen: false,

  /** User-driven orbit offsets (radians) and zoom multiplier. */
  user: { yaw: 0, pitch: 0, zoom: 1, lastInteraction: 0 },

  /** Pointer position in normalised device coords, for subtle parallax. */
  pointer: { x: 0, y: 0 },

  reducedMotion: false,
  /** Balance-wheel playback rate in the movement chapter (1 = real 4 Hz). */
  balanceRate: 0.125,
};

/* ------------------------------------------------------------------ */

type UiState = {
  /** Component index highlighted in the exploded view, or -1. */
  step: number;
  /** Heartbeat stage index. */
  beatStage: number;
  /** Manual "assemble" override inside the exploded chapter. */
  assembled: boolean;
  /** WebGL scene has rendered its first frame. */
  ready: boolean;
  /** WebGL unavailable or crashed. */
  fallback: boolean;
  realSpeed: boolean;
  /** Section shown as active in the navigation. */
  section: SectionId;
};

let ui: UiState = {
  step: -1,
  beatStage: 0,
  assembled: false,
  ready: false,
  fallback: false,
  realSpeed: false,
  section: 'hero',
};

const listeners = new Set<() => void>();

export function setUi(patch: Partial<UiState>) {
  let changed = false;
  for (const key in patch) {
    const k = key as keyof UiState;
    if (ui[k] !== patch[k]) changed = true;
  }
  if (!changed) return;
  ui = { ...ui, ...patch };
  listeners.forEach((l) => l());
}

export function getUi() {
  return ui;
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useUi<T>(selector: (s: UiState) => T): T {
  return useSyncExternalStore(subscribe, () => selector(ui), () => selector(ui));
}
