import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getMaterials } from '../materials';
import { extrude, gearShape, sectorShape } from '../geometry';
import { PartLabel } from '../ExplodablePart';
import { LAYOUT, MOVEMENT } from '../dimensions';
import { rig } from '../../rig';

const INDEX = 4;

/** Assembled z-levels (dial side is +Z, the decorated bridge side faces the case back). */
export const MZ = {
  plate: 0.03,
  wheels: -0.02,
  bridge: -0.08,
  jewels: -0.098,
  rotor: -0.15,
};

function circleHole(x: number, y: number, r: number) {
  const p = new THREE.Path();
  p.absarc(x, y, r, 0, Math.PI * 2, true);
  return p;
}

export function Movement() {
  const m = getMaterials();
  const rotorRef = useRef<THREE.Group>(null);
  const wheelRefs = useRef<(THREE.Mesh | null)[]>([]);

  const geo = useMemo(() => {
    const plate = new THREE.CylinderGeometry(MOVEMENT.radius, MOVEMENT.radius, 0.06, 128).rotateX(Math.PI / 2);

    // Three-quarter plate with apertures for barrel, balance and escapement.
    const bridgeShape = new THREE.Shape();
    bridgeShape.absarc(0, 0, 0.74, 0, Math.PI * 2, false);
    bridgeShape.holes.push(
      circleHole(LAYOUT.barrel[0], LAYOUT.barrel[1], 0.285),
      circleHole(LAYOUT.balance[0], LAYOUT.balance[1], 0.245),
      circleHole(LAYOUT.escape[0], LAYOUT.escape[1], 0.125),
      circleHole(LAYOUT.third[0] + 0.04, LAYOUT.third[1] - 0.04, 0.1),
    );
    const bridge = extrude(bridgeShape, 0.024, 0.006, 96);

    const centerWheel = extrude(gearShape({ teeth: 80, rRoot: 0.24, rTip: 0.255, spokes: 4, hub: 0.05, rim: 0.03, spokeWidth: 0.03, hole: 0.012 }), 0.012, 0, 12);
    const thirdWheel = extrude(gearShape({ teeth: 64, rRoot: 0.16, rTip: 0.172, spokes: 4, hub: 0.035, rim: 0.025, spokeWidth: 0.022, hole: 0.01 }), 0.012, 0, 12);
    const fourthWheel = extrude(gearShape({ teeth: 60, rRoot: 0.145, rTip: 0.157, spokes: 4, hub: 0.03, rim: 0.022, spokeWidth: 0.02, hole: 0.01 }), 0.012, 0, 12);

    const jewel = new THREE.CylinderGeometry(0.022, 0.022, 0.01, 24).rotateX(Math.PI / 2);
    const chaton = new THREE.TorusGeometry(0.03, 0.008, 10, 32);
    const screwHead = new THREE.CylinderGeometry(0.03, 0.03, 0.014, 32).rotateX(Math.PI / 2);
    const slot = new THREE.BoxGeometry(0.06, 0.008, 0.02);

    const rotor = extrude(sectorShape(0.075, 0.6, Math.PI * 0.02, Math.PI * 0.98), 0.016, 0.004, 64);
    const rotorRim = extrude(sectorShape(0.6, 0.735, 0, Math.PI), 0.034, 0.006, 64);
    const rotorHub = new THREE.CylinderGeometry(0.085, 0.085, 0.03, 48).rotateX(Math.PI / 2);
    const bearing = new THREE.TorusGeometry(0.06, 0.012, 12, 48);
    return { plate, bridge, centerWheel, thirdWheel, fourthWheel, jewel, chaton, screwHead, slot, rotor, rotorRim, rotorHub, bearing };
  }, []);

  useFrame(() => {
    const t = rig.movementTime;
    // Representative relative speeds (not exact gearing): 4th wheel = 1 rev/min.
    const [c, third, fourth] = wheelRefs.current;
    if (c) c.rotation.z = -(t / 3600) * Math.PI * 2;
    if (third) third.rotation.z = (t / 480) * Math.PI * 2;
    if (fourth) fourth.rotation.z = -(t / 60) * Math.PI * 2;
    if (rotorRef.current) rotorRef.current.rotation.z = Math.sin(t * 0.35) * 1.6 + Math.sin(t * 0.13) * 0.8;
  });

  const jewels: [number, number][] = [
    [LAYOUT.third[0], LAYOUT.third[1]],
    [LAYOUT.fourth[0], LAYOUT.fourth[1]],
    [0.12, 0.36],
    [0.5, 0.3],
  ];
  const screws: [number, number][] = [
    [0.58, 0.33],
    [-0.64, -0.12],
    [0.04, 0.66],
    [-0.28, -0.6],
    [0.62, -0.32],
  ];

  return (
    <group>
      <mesh geometry={geo.plate} material={m.rhodium} position={[0, 0, MZ.plate]} receiveShadow />

      <mesh ref={(r) => (wheelRefs.current[0] = r)} geometry={geo.centerWheel} material={m.gilt} position={[0, 0, MZ.wheels]} />
      <mesh ref={(r) => (wheelRefs.current[1] = r)} geometry={geo.thirdWheel} material={m.gilt} position={[LAYOUT.third[0], LAYOUT.third[1], MZ.wheels - 0.015]} />
      <mesh ref={(r) => (wheelRefs.current[2] = r)} geometry={geo.fourthWheel} material={m.gilt} position={[LAYOUT.fourth[0], LAYOUT.fourth[1], MZ.wheels]} />

      <mesh geometry={geo.bridge} material={m.cotes} position={[0, 0, MZ.bridge]} castShadow receiveShadow />

      {jewels.map(([x, y], i) => (
        <group key={i} position={[x, y, MZ.jewels]}>
          <mesh geometry={geo.jewel} material={m.ruby} />
          <mesh geometry={geo.chaton} material={m.gold} />
        </group>
      ))}
      {screws.map(([x, y], i) => (
        <group key={i} position={[x, y, MZ.jewels]} rotation={[0, 0, i * 1.3]}>
          <mesh geometry={geo.screwHead} material={m.blued} />
          <mesh geometry={geo.slot} material={m.rubber} position={[0, 0, -0.004]} />
        </group>
      ))}

      <group ref={rotorRef} position={[0, 0, MZ.rotor]}>
        <mesh geometry={geo.rotor} material={m.cotes} castShadow />
        <mesh geometry={geo.rotorRim} material={m.gold} position={[0, 0, -0.008]} castShadow />
        <mesh geometry={geo.rotorHub} material={m.gold} />
        <mesh geometry={geo.bearing} material={m.steel} position={[0, 0, -0.016]} />
      </group>

      <PartLabel index={INDEX} position={[-0.62, -0.5, -0.1]} />
    </group>
  );
}
