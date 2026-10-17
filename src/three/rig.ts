import * as THREE from 'three';
import { COMPONENT_COUNT } from '../data/components';

/**
 * Damped, per-frame animation state shared by the Director (which writes it)
 * and the watch parts (which read it). Lives outside React.
 */
export const rig = {
  /** 0 = assembled, 1 = fully exploded, per component. */
  explode: new Float32Array(COMPONENT_COUNT),
  /** 1 = fully lit, 0 = in darkness, per component. */
  light: new Float32Array(COMPONENT_COUNT).fill(1),
  /** Opacity of the 3D labels. */
  labels: 0,
  /** Highlighted component for labels, or -1. */
  focus: -1,
  /** Seconds of movement time (scaled by the balance playback rate). */
  movementTime: 0,
  watch: null as THREE.Group | null,
};

/** Exploded offsets in watch-local space, per component (see COMPONENTS order). */
export const EXPLODE_OFFSETS: [number, number, number][] = [
  [0, 0, 3.0], // crystal
  [0, 0, 2.2], // bezel
  [0, 0, 1.4], // dial & hands
  [0, 0, 0], // case (crown moves on its own)
  [0, 0, -1.3], // movement
  [0, 0, -2.15], // balance & escapement
  [0, 0, -2.15], // barrel
  [0, 0, 0], // gaskets (each seal moves on its own)
  [0, 0, -3.4], // case back
  [0, 0, 0], // bracelet (halves move on their own)
];

/** Where each component's centre sits once exploded — used as a camera target. */
export const FOCUS_POINTS: [number, number, number][] = [
  [0, 0, 3.26],
  [0, 0, 2.43],
  [0, 0, 1.52],
  [0.25, 0, 0],
  [0, 0, -1.38],
  [0.3, -0.3, -2.22],
  [-0.32, 0.3, -2.4],
  [0, 0, -0.2],
  [0, 0, -3.66],
  [0, 0, -1.0],
];

export const smooth = (t: number) => t * t * (3 - 2 * t);
export const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
export const range = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
