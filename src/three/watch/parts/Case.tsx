import { useMemo } from 'react';
import * as THREE from 'three';
import { getMaterials } from '../materials';
import { extrude, knurledRing, profileToWorld, revolve } from '../geometry';
import { PartLabel, SubExplode } from '../ExplodablePart';
import { LUG_GAP } from '../dimensions';

const INDEX = 3;
const LUG_T = 0.2;

function lugGeometry() {
  // Side profile in (y, z): sweeps down from the case flank to the lug tip.
  const s = new THREE.Shape();
  s.moveTo(0.72, -0.17);
  s.lineTo(1.2, -0.13);
  s.quadraticCurveTo(1.3, -0.12, 1.31, -0.04);
  s.lineTo(1.3, 0.03);
  s.quadraticCurveTo(1.28, 0.085, 1.19, 0.095);
  s.quadraticCurveTo(0.96, 0.13, 0.72, 0.19);
  s.closePath();
  const g = new THREE.ExtrudeGeometry(s, {
    depth: LUG_T - 0.03,
    bevelEnabled: true,
    bevelThickness: 0.015,
    bevelSize: 0.015,
    bevelSegments: 3,
    curveSegments: 24,
  });
  return profileToWorld(g);
}

export function Case() {
  const m = getMaterials();
  const geo = useMemo(() => {
    const middle = revolve([
      [0.8, -0.2],
      [0.9, -0.2],
      [0.97, -0.185],
      [1.005, -0.15],
      [1.025, -0.06],
      [1.03, 0.04],
      [1.022, 0.13],
      [1.0, 0.17],
      [0.985, 0.185],
      [0.8, 0.185],
      [0.8, -0.2],
    ]);
    // inner flange ring (rehaut) between dial and crystal
    const flange = revolve(
      [
        [0.845, 0.236],
        [0.826, 0.101],
      ],
      128,
    );
    const lug = lugGeometry();
    const crown = extrude(knurledRing(0, 0.165, 44, 0.012), 0.15, 0.01, 12);
    crown.rotateY(Math.PI / 2);
    const crownCap = revolve([
      [0.0001, 0.0],
      [0.12, 0.0],
      [0.13, 0.008],
      [0.12, 0.02],
      [0.0001, 0.03],
    ], 64);
    crownCap.rotateY(Math.PI / 2);
    const tube = new THREE.CylinderGeometry(0.075, 0.075, 0.1, 40);
    tube.rotateZ(Math.PI / 2);
    return { middle, flange, lug, crown, crownCap, tube };
  }, []);

  const lugX = LUG_GAP / 2 + 0.015;
  const lugs = (
    <>
      <mesh geometry={geo.lug} material={m.steelBrushed} position={[lugX, 0, 0]} castShadow />
      <mesh geometry={geo.lug} material={m.steelBrushed} position={[-lugX - LUG_T + 0.03, 0, 0]} castShadow />
    </>
  );

  return (
    <group>
      <mesh geometry={geo.middle} material={m.steel} castShadow receiveShadow />
      <mesh geometry={geo.flange} material={m.flange} />
      {lugs}
      <group rotation={[0, 0, Math.PI]}>{lugs}</group>

      <mesh geometry={geo.tube} material={m.steel} position={[1.06, 0, 0]} />
      <SubExplode index={INDEX} offset={[0.55, 0, 0]} position={[1.11, 0, 0]}>
        <mesh geometry={geo.crown} material={m.steel} position={[0.085, 0, 0]} castShadow />
        <mesh geometry={geo.crownCap} material={m.steel} position={[0.17, 0, 0]} />
      </SubExplode>

      <PartLabel index={INDEX} position={[1.15, 0.55, 0.1]} />
    </group>
  );
}
