import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { scene } from '../state/store';
import { computeTargets, type Shot } from './shots';
import { rig } from './rig';

const damp = (current: number, target: number, lambda: number, dt: number) =>
  current + (target - current) * (1 - Math.exp(-lambda * dt));

const tmp = new THREE.Vector3();

/**
 * Runs first every frame: reads scroll/pointer state, damps every animated value
 * toward its target and positions the camera and watch.
 */
export function Director() {
  const { camera, size } = useThree();
  const cam = camera as THREE.PerspectiveCamera;
  const cur = useRef<Shot | null>(null);

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 1 / 20);
    const time = performance.now() / 1000;
    const reduced = scene.reducedMotion;
    const T = computeTargets(size.width / size.height);

    // movement clock (slow motion by default)
    rig.movementTime += dt * (reduced ? Math.min(scene.balanceRate, 0.125) : scene.balanceRate);

    // camera lambda: higher = snappier. Reduced motion → near-instant.
    const L = reduced ? 14 : 2.6;

    const s = (cur.current ??= structuredClone(T.shot));
    s.az = damp(s.az, T.shot.az, L, dt);
    s.el = damp(s.el, T.shot.el, L, dt);
    s.dist = damp(s.dist, T.shot.dist / scene.user.zoom, L, dt);
    for (let i = 0; i < 3; i++) s.target[i] = damp(s.target[i], T.shot.target[i], L, dt);
    for (let i = 0; i < 2; i++) s.shift[i] = damp(s.shift[i], T.shot.shift[i], L, dt);

    for (let i = 0; i < rig.explode.length; i++) {
      rig.explode[i] = damp(rig.explode[i], T.explode[i], reduced ? 14 : 3.2, dt);
      rig.light[i] = damp(rig.light[i], T.light[i], reduced ? 14 : 4, dt);
    }
    rig.labels = damp(rig.labels, T.labels, 10, dt);
    rig.focus = T.focus;

    // user orbit relaxes back when idle (except in the hands-on intro chapter)
    const u = scene.user;
    const idleFor = performance.now() - u.lastInteraction;
    if (scene.active !== 'intro' && idleFor > 2500) {
      u.yaw = damp(u.yaw, Math.round(u.yaw / (Math.PI * 2)) * Math.PI * 2, 1.5, dt);
      u.pitch = damp(u.pitch, 0, 1.5, dt);
      if (scene.active !== 'layers') u.zoom = damp(u.zoom, 1, 1.5, dt);
    }

    // watch orientation: user + idle sway
    const w = rig.watch;
    if (w) {
      const sway = reduced ? 0 : T.idle;
      w.rotation.y = u.yaw + Math.sin(time * 0.32) * 0.2 * sway + scene.pointer.x * 0.08 * sway;
      w.rotation.x = u.pitch + Math.sin(time * 0.23) * 0.05 * sway - scene.pointer.y * 0.05 * sway;
      w.position.y = Math.sin(time * 0.7) * 0.03 * sway;
      w.updateMatrixWorld();
    }

    // camera from spherical framing, target follows the (rotated) watch
    tmp.set(s.target[0], s.target[1], s.target[2]);
    if (w) tmp.applyMatrix4(w.matrixWorld);
    const ce = Math.cos(s.el);
    cam.position.set(
      tmp.x + s.dist * ce * Math.sin(s.az),
      tmp.y + s.dist * Math.sin(s.el),
      tmp.z + s.dist * ce * Math.cos(s.az),
    );
    cam.lookAt(tmp);

    // off-centre framing so copy and watch share the screen
    const W = size.width;
    const H = size.height;
    cam.setViewOffset(W, H, -s.shift[0] * W, (s.shift[1] + scene.footerShift) * H, W, H);
  }, -1);

  return null;
}
