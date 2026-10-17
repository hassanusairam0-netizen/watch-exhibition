import { useMemo } from 'react';
import * as THREE from 'three';
import { getMaterials } from '../materials';
import { extrude, knurledRing, revolve } from '../geometry';
import { PartLabel } from '../ExplodablePart';

export function CaseBack() {
  const m = getMaterials();
  const geo = useMemo(() => {
    const dome = revolve(
      [
        [0.0001, -0.318],
        [0.64, -0.318],
        [0.79, -0.3],
        [0.86, -0.27],
        [0.86, -0.2],
        [0.0001, -0.2],
      ],
      128,
    );
    const fluted = extrude(knurledRing(0.84, 0.93, 36, 0.035), 0.06, 0.006, 96);
    fluted.translate(0, 0, -0.235);
    const thread = new THREE.CylinderGeometry(0.88, 0.88, 0.03, 128, 1, true).rotateX(Math.PI / 2);
    thread.translate(0, 0, -0.19);
    const engraving = new THREE.CircleGeometry(0.62, 96).rotateY(Math.PI);
    engraving.translate(0, 0, -0.3175);
    return { dome, fluted, thread, engraving };
  }, []);
  return (
    <group>
      <mesh geometry={geo.dome} material={m.snail} castShadow receiveShadow />
      <mesh geometry={geo.fluted} material={m.steel} castShadow />
      <mesh geometry={geo.thread} material={m.steelBrushed} />
      <mesh geometry={geo.engraving} material={m.engraving} />
      <PartLabel index={8} position={[0.8, -0.5, -0.27]} />
    </group>
  );
}
