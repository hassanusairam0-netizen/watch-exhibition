import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getMaterials } from '../materials';
import { annulus, extrude, gearShape, spiralTube } from '../geometry';
import { PartLabel } from '../ExplodablePart';
import { LAYOUT } from '../dimensions';
import { rig } from '../../rig';

const INDEX = 5;
const FREQ = 4; // Hz — 28,800 vibrations per hour
const AMPLITUDE = 4.6; // rad ≈ 265°
const ESCAPE_TEETH = 20;

/** Rounded bridge: a disc over the pivot, tapering toward an anchor point. */
function cockShape(ex: number, ey: number, r0: number, r1: number) {
  const a = Math.atan2(ey, ex);
  const s = new THREE.Shape();
  s.absarc(0, 0, r0, a + Math.PI / 2, a + (Math.PI * 3) / 2, false);
  s.absarc(ex, ey, r1, a - Math.PI / 2, a + Math.PI / 2, false);
  s.closePath();
  return s;
}

export function BalanceAssembly() {
  const m = getMaterials();
  const wheel = useRef<THREE.Group>(null);
  const spring = useRef<THREE.Mesh>(null);
  const fork = useRef<THREE.Group>(null);
  const escape = useRef<THREE.Mesh>(null);

  const [bx, by] = LAYOUT.balance;
  const esc: [number, number] = [LAYOUT.escape[0] - bx, LAYOUT.escape[1] - by];
  const pal: [number, number] = [LAYOUT.pallet[0] - bx, LAYOUT.pallet[1] - by];

  const geo = useMemo(() => {
    const rim = extrude(annulus(0.165, 0.195), 0.026, 0.004, 96);
    const arm = new THREE.BoxGeometry(0.33, 0.026, 0.012);
    const weight = new THREE.CylinderGeometry(0.012, 0.012, 0.03, 16).rotateZ(Math.PI / 2);
    const staff = new THREE.CylinderGeometry(0.01, 0.01, 0.16, 16).rotateX(Math.PI / 2);
    const roller = new THREE.CylinderGeometry(0.045, 0.045, 0.01, 32).rotateX(Math.PI / 2);
    const impulsePin = new THREE.BoxGeometry(0.01, 0.014, 0.02);
    const hairspring = spiralTube(0.022, 0.15, 12, 0.0024);
    const stud = new THREE.BoxGeometry(0.02, 0.03, 0.02);

    // Balance cock, anchored toward the movement edge.
    const len = Math.hypot(bx, by);
    const ex = (bx / len) * 0.3;
    const ey = (by / len) * 0.3;
    const cock = extrude(cockShape(ex, ey, 0.07, 0.1), 0.026, 0.005, 48);
    const shock = new THREE.TorusGeometry(0.032, 0.005, 8, 40, Math.PI * 1.6);
    const jewel = new THREE.CylinderGeometry(0.02, 0.02, 0.012, 24).rotateX(Math.PI / 2);
    const screw = new THREE.CylinderGeometry(0.028, 0.028, 0.012, 24).rotateX(Math.PI / 2);

    const escWheel = extrude(
      gearShape({ teeth: ESCAPE_TEETH, rRoot: 0.08, rTip: 0.112, toothShape: 0.28, spokes: 5, hub: 0.022, rim: 0.016, spokeWidth: 0.012, hole: 0.008 }),
      0.01,
      0,
      8,
    );

    // Pallet fork: lever toward the balance, cross arms toward the escape wheel.
    const dx = -pal[0];
    const dy = -pal[1];
    const ang = Math.atan2(dy, dx);
    const forkShape = new THREE.Shape();
    const L = 0.2;
    forkShape.moveTo(0, -0.012);
    forkShape.lineTo(L, -0.008);
    forkShape.lineTo(L + 0.02, -0.022);
    forkShape.lineTo(L + 0.03, -0.016);
    forkShape.lineTo(L + 0.012, 0);
    forkShape.lineTo(L + 0.03, 0.016);
    forkShape.lineTo(L + 0.02, 0.022);
    forkShape.lineTo(L, 0.008);
    forkShape.lineTo(0, 0.012);
    forkShape.lineTo(-0.03, 0.09);
    forkShape.lineTo(-0.05, 0.08);
    forkShape.lineTo(-0.02, 0);
    forkShape.lineTo(-0.05, -0.08);
    forkShape.lineTo(-0.03, -0.09);
    forkShape.closePath();
    const forkGeo = extrude(forkShape, 0.008, 0.002, 4);
    forkGeo.rotateZ(ang);
    const stone = new THREE.BoxGeometry(0.014, 0.036, 0.012);
    const pivot = new THREE.CylinderGeometry(0.014, 0.014, 0.04, 16).rotateX(Math.PI / 2);
    const stones = [
      new THREE.Vector2(-0.04, 0.095).rotateAround(new THREE.Vector2(), ang),
      new THREE.Vector2(-0.04, -0.095).rotateAround(new THREE.Vector2(), ang),
    ];
    return { rim, arm, weight, staff, roller, impulsePin, hairspring, stud, cock, shock, jewel, screw, escWheel, forkGeo, stone, stones, pivot, ex, ey, ang };
  }, [bx, by, pal]);

  useFrame(() => {
    const t = rig.movementTime;
    const phase = Math.PI * 2 * FREQ * t;
    const theta = AMPLITUDE * Math.sin(phase);
    wheel.current!.rotation.z = theta;
    // the hairspring "breathes" as it winds and unwinds
    spring.current!.rotation.z = theta * 0.85;
    const breathe = 1 + 0.035 * Math.sin(phase);
    spring.current!.scale.set(breathe, breathe, 1);
    // pallet fork flicks between banking pins as the impulse pin passes centre
    fork.current!.rotation.z = 0.16 * Math.max(-1, Math.min(1, theta / 0.7));
    // escape wheel advances half a tooth per vibration, quickly, then locks
    const vib = t * FREQ * 2;
    const frac = vib - Math.floor(vib);
    const ease = Math.min(1, frac * 7);
    escape.current!.rotation.z = -((Math.floor(vib) + ease * ease) * Math.PI) / ESCAPE_TEETH;
  });

  return (
    <group position={[bx, by, 0]}>
      {/* balance wheel */}
      <group ref={wheel} position={[0, 0, -0.045]}>
        <mesh geometry={geo.rim} material={m.gold} castShadow />
        <mesh geometry={geo.arm} material={m.gold} />
        <mesh geometry={geo.arm} material={m.gold} rotation={[0, 0, Math.PI / 2]} />
        {[0, 1, 2, 3].map((i) => {
          const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
          return <mesh key={i} geometry={geo.weight} material={m.gold} position={[Math.cos(a) * 0.205, Math.sin(a) * 0.205, 0]} rotation={[0, 0, a]} />;
        })}
        <mesh geometry={geo.roller} material={m.steel} position={[0, 0, 0.03]} />
        <mesh geometry={geo.impulsePin} material={m.ruby} position={[0, 0.036, 0.04]} />
      </group>
      <mesh geometry={geo.staff} material={m.steel} position={[0, 0, -0.04]} />
      <mesh ref={spring} geometry={geo.hairspring} material={m.springSteel} position={[0, 0, -0.075]} />

      {/* balance cock */}
      <group position={[0, 0, -0.105]}>
        <mesh geometry={geo.cock} material={m.cotes} castShadow />
        <mesh geometry={geo.jewel} material={m.ruby} position={[0, 0, -0.012]} />
        <mesh geometry={geo.shock} material={m.gold} position={[0, 0, -0.018]} />
        <mesh geometry={geo.screw} material={m.blued} position={[geo.ex, geo.ey, -0.016]} />
      </group>

      {/* escapement */}
      <mesh ref={escape} geometry={geo.escWheel} material={m.steel} position={[esc[0], esc[1], -0.03]} castShadow />
      <mesh geometry={geo.jewel} material={m.ruby} position={[esc[0], esc[1], -0.045]} />
      <group position={[pal[0], pal[1], -0.03]}>
        <group ref={fork}>
          <mesh geometry={geo.forkGeo} material={m.steel} />
          {geo.stones.map((v, i) => (
            <mesh key={i} geometry={geo.stone} material={m.ruby} position={[v.x, v.y, 0]} rotation={[0, 0, geo.ang]} />
          ))}
        </group>
        <mesh geometry={geo.pivot} material={m.steel} />
      </group>

      <PartLabel index={INDEX} position={[0.2, -0.24, -0.1]} />
    </group>
  );
}
