import { useMemo } from 'react';
import * as THREE from 'three';
import { getMaterials } from '../materials';
import { PartLabel, SubExplode } from '../ExplodablePart';

const INDEX = 7;

/** Three seals, each lifting away along its own axis when exploded. */
export function Gaskets() {
  const m = getMaterials();
  const geo = useMemo(
    () => ({
      crystal: new THREE.TorusGeometry(0.84, 0.012, 12, 160),
      back: new THREE.TorusGeometry(0.885, 0.014, 12, 160),
      crown: new THREE.TorusGeometry(0.068, 0.012, 10, 40).rotateY(Math.PI / 2),
    }),
    [],
  );
  return (
    <group>
      <SubExplode index={INDEX} offset={[0, 0, 2.38]} position={[0, 0, 0.232]}>
        <mesh geometry={geo.crystal} material={m.rubber} />
      </SubExplode>
      <SubExplode index={INDEX} offset={[0, 0, -2.75]} position={[0, 0, -0.195]}>
        <mesh geometry={geo.back} material={m.rubber} />
        <PartLabel index={INDEX} position={[0.66, -0.62, 0]} />
      </SubExplode>
      <SubExplode index={INDEX} offset={[0.32, 0, 0]} position={[1.1, 0, 0]}>
        <mesh geometry={geo.crown} material={m.rubber} />
      </SubExplode>
    </group>
  );
}
