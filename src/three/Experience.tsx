import { useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import * as THREE from 'three';
import { Studio } from './Studio';
import { Watch } from './watch/Watch';
import { Director } from './Director';
import { scene, setUi, getUi } from '../state/store';
import { rig } from './rig';

/** Takes over rendering so frames can be skipped while an opaque section covers the canvas. */
function Renderer() {
  useFrame(({ gl, scene: s, camera }) => {
    if (scene.covered || scene.menuOpen) return;
    gl.render(s, camera);
    if (!getUi().ready) requestAnimationFrame(() => setUi({ ready: true }));
    if (import.meta.env.DEV) Object.assign(window, { __gl: gl.info, __rig: rig, __scene: scene, __ui: getUi });
  }, 1);
  return null;
}

export default function Experience() {
  const coarse = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
  const maxDpr = coarse ? 1.5 : 2;
  const [dpr, setDpr] = useState(maxDpr);

  return (
    <Canvas
      className="stage-canvas-inner"
      dpr={[1, dpr]}
      shadows="percentage"
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ fov: 30, near: 0.1, far: 100, position: [0, 0, 8] }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
        gl.setClearColor(0x000000, 0);
      }}
      style={{ pointerEvents: 'none' }}
      aria-hidden="true"
    >
      <PerformanceMonitor
        onDecline={() => setDpr((d) => Math.max(1, d - 0.5))}
        onIncline={() => setDpr((d) => Math.min(maxDpr, d + 0.25))}
      />
      <Director />
      <Studio />
      <Watch />
      <Renderer />
    </Canvas>
  );
}
