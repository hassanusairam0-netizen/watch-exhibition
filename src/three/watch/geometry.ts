import * as THREE from 'three';

/**
 * Revolve a cross-section (r, z) around the watch's Z axis.
 * Points must run counter-clockwise in the (r, z) plane so normals face outward.
 */
export function revolve(points: [number, number][], segments = 128) {
  const g = new THREE.LatheGeometry(
    points.map(([r, z]) => new THREE.Vector2(r, z)),
    segments,
  );
  g.rotateX(Math.PI / 2);
  return g;
}

/** Flat extruded shape lying in XY, extruded toward +Z, centred on z = 0. */
export function extrude(shape: THREE.Shape, depth: number, bevel = 0, curveSegments = 48) {
  const g = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: bevel > 0,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 2,
    curveSegments,
  });
  g.translate(0, 0, -depth / 2);
  return g;
}

function circlePath(r: number, x = 0, y = 0, clockwise = true) {
  const p = new THREE.Path();
  p.absarc(x, y, r, 0, Math.PI * 2, clockwise);
  return p;
}

type GearOpts = {
  teeth: number;
  rRoot: number;
  rTip: number;
  /** central arbor hole */
  hole?: number;
  /** spoked wheel: number of spokes, hub radius, rim width, spoke width */
  spokes?: number;
  hub?: number;
  rim?: number;
  spokeWidth?: number;
  /** tooth flank share (0..1) */
  toothShape?: number;
};

/** Involute-ish gear outline with optional spokes and arbor hole. */
export function gearShape(o: GearOpts) {
  const s = new THREE.Shape();
  const pitch = (Math.PI * 2) / o.teeth;
  const share = o.toothShape ?? 0.5;
  const pt = (r: number, a: number) => [Math.cos(a) * r, Math.sin(a) * r] as const;
  for (let i = 0; i < o.teeth; i++) {
    const a = i * pitch;
    if (i === 0) s.moveTo(...pt(o.rRoot, a));
    else s.lineTo(...pt(o.rRoot, a));
    s.lineTo(...pt(o.rTip, a + pitch * share * 0.25));
    s.lineTo(...pt(o.rTip, a + pitch * share * 0.75));
    s.lineTo(...pt(o.rRoot, a + pitch * share));
  }
  s.closePath();

  if (o.spokes && o.hub && o.rim) {
    const ri = o.rRoot - o.rim;
    const sector = (Math.PI * 2) / o.spokes;
    const half = (o.spokeWidth ?? 0.02) / 2;
    for (let i = 0; i < o.spokes; i++) {
      const a0 = i * sector;
      const a1 = (i + 1) * sector;
      const p = new THREE.Path();
      p.absarc(0, 0, ri, a0 + half / ri, a1 - half / ri, false);
      p.absarc(0, 0, o.hub, a1 - half / o.hub, a0 + half / o.hub, true);
      p.closePath();
      s.holes.push(p);
    }
  }
  if (o.hole) s.holes.push(circlePath(o.hole));
  return s;
}

/** Ring with a fine coin-edge, used for the bezel and crown. */
export function knurledRing(rInner: number, rOuter: number, notches: number, depth: number) {
  const s = gearShape({ teeth: notches, rRoot: rOuter - depth, rTip: rOuter, toothShape: 0.6 });
  if (rInner > 0) s.holes.push(circlePath(rInner));
  return s;
}

export function annulus(rInner: number, rOuter: number) {
  const s = new THREE.Shape();
  s.absarc(0, 0, rOuter, 0, Math.PI * 2, false);
  s.holes.push(circlePath(rInner));
  return s;
}

/** Ring sector (used for the oscillating rotor). */
export function sectorShape(rInner: number, rOuter: number, a0: number, a1: number) {
  const s = new THREE.Shape();
  s.absarc(0, 0, rOuter, a0, a1, false);
  s.absarc(0, 0, rInner, a1, a0, true);
  s.closePath();
  return s;
}

/**
 * Re-orient an extrusion made in a side-profile plane:
 * shape X → world Y, shape Y → world Z, extrusion Z → world X.
 */
export function profileToWorld(g: THREE.BufferGeometry) {
  const m = new THREE.Matrix4().set(0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1);
  g.applyMatrix4(m);
  return g;
}

/** Flat ribbon spiral (mainspring / hairspring) of height h, wound in XY. */
export function spiralRibbon(r0: number, r1: number, turns: number, h: number, steps = 600) {
  const pos: number[] = [];
  const nor: number[] = [];
  const idx: number[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const a = t * turns * Math.PI * 2;
    const r = r0 + (r1 - r0) * t;
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r;
    const nx = Math.cos(a);
    const ny = Math.sin(a);
    pos.push(x, y, -h / 2, x, y, h / 2);
    nor.push(nx, ny, 0, nx, ny, 0);
    if (i < steps) {
      const k = i * 2;
      idx.push(k, k + 2, k + 1, k + 1, k + 2, k + 3);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  g.setIndex(idx);
  return g;
}

/** Thin wire spiral as a tube (hairspring). */
export function spiralTube(r0: number, r1: number, turns: number, radius: number) {
  const pts: THREE.Vector3[] = [];
  const steps = 900;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const a = t * turns * Math.PI * 2;
    const r = r0 + (r1 - r0) * t;
    pts.push(new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r, 0));
  }
  const curve = new THREE.CatmullRomCurve3(pts);
  return new THREE.TubeGeometry(curve, steps, radius, 5, false);
}
