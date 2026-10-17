import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getMaterials } from '../materials';
import { extrude, gearShape, spiralRibbon } from '../geometry';
import { PartLabel, SubExplode } from '../ExplodablePart';
import { LAYOUT } from '../dimensions';
import { rig } from '../../rig';

const INDEX = 6;

/** Barrel drum with its mainspring; cover and barrel bridge lift away when exploded. */
export function Barrel() {
  const m = getMaterials();
  const arbor = useRef<THREE.Group>(null);
  const ratchet = useRef<THREE.Mesh>(null);

  const geo = useMemo(() => {
    const drumShape = gearShape({ teeth: 84, rRoot: 0.262, rTip: 0.278, toothShape: 0.5 });
    const inner = new THREE.Path();
    inner.absarc(0, 0, 0.245, 0, Math.PI * 2, true);
    drumShape.holes.push(inner);
    const drum = extrude(drumShape, 0.06, 0, 12);
    const floor = new THREE.CylinderGeometry(0.25, 0.25, 0.008, 96).rotateX(Math.PI / 2);
    const spring = spiralRibbon(0.05, 0.238, 8.5, 0.046);
    const arborGeo = new THREE.CylinderGeometry(0.042, 0.042, 0.075, 32).rotateX(Math.PI / 2);
    const hook = new THREE.BoxGeometry(0.02, 0.012, 0.046);
    const cover = new THREE.CylinderGeometry(0.246, 0.246, 0.006, 96).rotateX(Math.PI / 2);
    const bridge = extrude(new THREE.Shape().absarc(0, 0, 0.278, 0, Math.PI * 2, false), 0.024, 0.006, 96);
    const ratchetGeo = extrude(gearShape({ teeth: 48, rRoot: 0.16, rTip: 0.178, toothShape: 0.7, hole: 0.03 }), 0.016, 0.002, 8);
    const screw = new THREE.CylinderGeometry(0.05, 0.05, 0.016, 40).rotateX(Math.PI / 2);
    const slot = new THREE.BoxGeometry(0.1, 0.012, 0.02);
    return { drum, floor, spring, arborGeo, hook, cover, bridge, ratchetGeo, screw, slot };
  }, []);

  useFrame(() => {
    // Gentle, visible winding: arbor and ratchet turn together.
    const a = -rig.movementTime * 0.25;
    arbor.current!.rotation.z = a;
    ratchet.current!.rotation.z = a;
  });

  return (
    <group position={[LAYOUT.barrel[0], LAYOUT.barrel[1], 0]}>
      <mesh geometry={geo.drum} material={m.gilt} position={[0, 0, -0.03]} castShadow />
      <mesh geometry={geo.floor} material={m.gilt} position={[0, 0, -0.004]} />
      <group ref={arbor} position={[0, 0, -0.032]}>
        <mesh geometry={geo.spring} material={m.springSteel} />
        <mesh geometry={geo.arborGeo} material={m.steel} />
        <mesh geometry={geo.hook} material={m.springSteel} position={[0.048, 0, 0]} />
      </group>

      <SubExplode index={INDEX} offset={[0, 0, -0.28]} position={[0, 0, -0.062]}>
        <mesh geometry={geo.cover} material={m.gilt} />
      </SubExplode>

      <SubExplode index={INDEX} offset={[0, 0, -0.55]} position={[0, 0, -0.08]}>
        <mesh geometry={geo.bridge} material={m.cotes} castShadow />
        <mesh ref={ratchet} geometry={geo.ratchetGeo} material={m.snail} position={[0, 0, -0.024]} castShadow />
        <mesh geometry={geo.screw} material={m.blued} position={[0, 0, -0.036]} />
        <mesh geometry={geo.slot} material={m.rubber} position={[0, 0, -0.04]} />
      </SubExplode>

      <PartLabel index={INDEX} position={[-0.26, 0.2, -0.1]} />
    </group>
  );
}
