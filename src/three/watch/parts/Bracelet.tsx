import { useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { getMaterials } from '../materials';
import { PartLabel, SubExplode } from '../ExplodablePart';
import { LUG_GAP } from '../dimensions';

const INDEX = 9;
const PITCH = 0.3;
const THICK = 0.12;
const CLASP_HALF = 0.46;

/** Path the 12-o'clock half follows around an average wrist, in (y, z). */
const WRIST: [number, number][] = [
  [1.12, -0.04],
  [1.5, -0.2],
  [1.72, -0.6],
  [1.75, -1.15],
  [1.53, -1.68],
  [1.06, -2.03],
  [0.45, -2.2],
  [0, -2.22],
];

type Link = { m: THREE.Matrix4; w: number };

function buildHalf(sign: 1 | -1) {
  const curve = new THREE.CatmullRomCurve3(WRIST.map(([y, z]) => new THREE.Vector3(0, y * sign, z)));
  const length = curve.getLength();
  const X = new THREE.Vector3(sign, 0, 0);
  const frame = (s: number) => {
    const u = Math.min(1, s / length);
    const P = curve.getPointAt(u);
    const T = curve.getTangentAt(u);
    const Z = new THREE.Vector3().crossVectors(X, T).normalize();
    const Y = new THREE.Vector3().crossVectors(Z, X).normalize();
    return { P, m: new THREE.Matrix4().makeBasis(X, Y, Z).setPosition(P), Z };
  };

  const end = frame(0.1).m;
  const center: Link[] = [];
  const outer: Link[] = [];
  for (let s = 0.2 + PITCH / 2; s < length; s += PITCH) {
    const f = frame(s);
    if (Math.abs(f.P.y) < CLASP_HALF + PITCH * 0.45) break;
    const taper = 1 - 0.18 * Math.min(1, s / length);
    const w = LUG_GAP * taper;
    const cw = w * 0.36;
    const ow = w * 0.3;
    center.push({ m: f.m.clone(), w: cw });
    for (const side of [-1, 1]) {
      const off = new THREE.Vector3(side * sign * (cw / 2 + ow / 2 + 0.008), 0, 0);
      outer.push({ m: f.m.clone().multiply(new THREE.Matrix4().makeTranslation(off)), w: ow });
    }
  }
  return { end, center, outer };
}

function Links({ links, geometry, material, baseWidth }: { links: Link[]; geometry: THREE.BufferGeometry; material: THREE.Material; baseWidth: number }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const s = new THREE.Matrix4();
    links.forEach((l, i) => {
      s.makeScale(l.w / baseWidth, 1, 1);
      ref.current!.setMatrixAt(i, l.m.clone().multiply(s));
    });
    ref.current!.instanceMatrix.needsUpdate = true;
    ref.current!.computeBoundingSphere();
  }, [links, baseWidth]);
  return <instancedMesh ref={ref} args={[geometry, material, links.length]} castShadow receiveShadow />;
}

export function Bracelet() {
  const m = getMaterials();
  const data = useMemo(() => {
    const top = buildHalf(1);
    const bottom = buildHalf(-1);
    const cw = LUG_GAP * 0.33;
    const ow = LUG_GAP * 0.27;
    return {
      top,
      bottom,
      cw,
      ow,
      centerGeo: new RoundedBoxGeometry(cw, PITCH - 0.015, THICK, 3, 0.035),
      outerGeo: new RoundedBoxGeometry(ow, PITCH - 0.012, THICK, 3, 0.04),
      endGeo: new RoundedBoxGeometry(LUG_GAP - 0.01, 0.2, THICK + 0.01, 3, 0.04),
      claspGeo: new RoundedBoxGeometry(LUG_GAP * 0.84, CLASP_HALF * 2, THICK + 0.02, 3, 0.04),
      coverGeo: new RoundedBoxGeometry(0.46, CLASP_HALF * 1.6, 0.03, 3, 0.012),
      emblemGeo: new THREE.CylinderGeometry(0.05, 0.05, 0.012, 32).rotateX(Math.PI / 2),
    };
  }, []);

  const half = (h: ReturnType<typeof buildHalf>) => (
    <>
      <mesh geometry={data.endGeo} material={m.steelBrushed} matrixAutoUpdate={false} matrix={h.end} castShadow />
      <Links links={h.center} geometry={data.centerGeo} material={m.steel} baseWidth={data.cw} />
      <Links links={h.outer} geometry={data.outerGeo} material={m.steelBrushed} baseWidth={data.ow} />
    </>
  );

  return (
    <group>
      <SubExplode index={INDEX} offset={[0, 1.8, 0.3]}>
        {half(data.top)}
        <PartLabel index={INDEX} position={[0.6, 1.78, -0.9]} />
      </SubExplode>
      <SubExplode index={INDEX} offset={[0, -1.8, 0.3]}>
        {half(data.bottom)}
        <group position={[0, 0, -2.22]} rotation={[Math.PI, 0, 0]}>
          <mesh geometry={data.claspGeo} material={m.steelBrushed} castShadow />
          <mesh geometry={data.coverGeo} material={m.steel} position={[0, 0, THICK / 2 + 0.02]} />
          <mesh geometry={data.emblemGeo} material={m.gold} position={[0, 0.18, THICK / 2 + 0.04]} />
        </group>
      </SubExplode>
    </group>
  );
}
