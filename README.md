# Aurel — Engineered to Last

An interactive, scroll-driven exhibition about the engineering of a luxury mechanical watch.
Built with React 19, Vite 7, Three.js via React Three Fiber + drei, and GSAP ScrollTrigger.

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # type-check + production build into dist/
npm run preview   # serve the production build
```

## Structure

```
src/
  state/store.ts        per-frame scene state (no React renders) + small UI store
  state/scroll.ts       GSAP ScrollTrigger wiring: section progress, steps, reveals
  data/                 educational copy: components, movement stages, materials
  sections/             page chapters (Hero, Intro, Layers, Heartbeat, …, Footer)
  components/           Nav, Cursor, Loader, WebGL fallback, icons
  hooks/useDragRotate   drag / pinch / ctrl+wheel interaction on [data-rotate] zones
  three/Experience.tsx  Canvas, adaptive DPR, render loop (pauses when covered)
  three/Director.tsx    damped camera + explode + lighting, driven by shots.ts
  three/shots.ts        pure mapping from scroll state to camera framings
  three/Studio.tsx      locally rendered Lightformer studio (no HDRI download)
  three/watch/          procedural watch: textures, materials, geometry, 10 parts
```

## Notes

- The watch is an original, procedurally modelled concept; all textures are generated on
  canvas at runtime, so there are no third-party assets.
- Aurel is fictional. The site is inspired by, but not affiliated with, Rolex or any maker.
- `prefers-reduced-motion` disables idle sway, reveals and the 4 Hz balance playback, and
  makes camera transitions near-instant. Without WebGL, a static illustration is shown.
