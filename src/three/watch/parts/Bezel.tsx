import { useMemo } from 'react';
import * as THREE from 'three';
import { getMaterials } from '../materials';
import { extrude, knurledRing } from '../geometry';
import { PartLabel } from '../ExplodablePart';
import { BEZEL, BEZEL_INSERT } from '../dimensions';

export function Bezel() {
  const m = getMaterials();
  const geo = useMemo(() => {
    const h = BEZEL.top - BEZEL.bottom;
    const ring = extrude(knurledRing(BEZEL.inner, BEZEL.outer, 120, 0.014), h - 0.02, 0.01, 96);
    ring.translate(0, 0, BEZEL.bottom + h / 2);
    const insert = new THREE.RingGeometry(BEZEL_INSERT.inner, BEZEL_INSERT.outer, 160, 1);
    const pipCup = new THREE.TorusGeometry(0.03, 0.007, 12, 32);
    const pip = new THREE.SphereGeometry(0.026, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2);
    pip.rotateX(Math.PI / 2);
    return { ring, insert, pipCup, pip };
  }, []);

  const pipY = (BEZEL_INSERT.inner + BEZEL_INSERT.outer) / 2 + 0.01;
  return (
    <group>
      <mesh geometry={geo.ring} material={m.steel} castShadow receiveShadow />
      <mesh geometry={geo.insert} material={m.ceramic} position={[0, 0, BEZEL_INSERT.z]} receiveShadow />
      <mesh geometry={geo.pipCup} material={m.steel} position={[0, pipY, BEZEL_INSERT.z + 0.004]} />
      <mesh geometry={geo.pip} material={m.lume} position={[0, pipY, BEZEL_INSERT.z]} scale={[1, 1, 0.5]} />
      <PartLabel index={1} position={[0.78, 0.78, 0.27]} />
    </group>
  );
}
