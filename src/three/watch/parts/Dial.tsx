import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { getMaterials } from '../materials';
import { extrude } from '../geometry';
import { PartLabel, SubExplode } from '../ExplodablePart';
import { DIAL } from '../dimensions';

const INDEX = 2;
const IDX_R = 0.62;

function poly(points: [number, number][]) {
  const s = new THREE.Shape();
  points.forEach(([x, y], i) => (i ? s.lineTo(x, y) : s.moveTo(x, y)));
  s.closePath();
  return s;
}

/** Hands are drawn pointing to 12 (+Y) and rotated about Z. */
function handGeometries() {
  const D = 0.008;
  const hour = extrude(poly([[-0.017, -0.02], [-0.028, 0.31], [0, 0.44], [0.028, 0.31], [0.017, -0.02]]), D, 0.002, 4);
  const hourLume = extrude(poly([[-0.009, 0.09], [-0.016, 0.3], [0, 0.39], [0.016, 0.3], [0.009, 0.09]]), 0.004, 0, 4);
  const minute = extrude(poly([[-0.012, -0.02], [-0.02, 0.6], [0, 0.71], [0.02, 0.6], [0.012, -0.02]]), D, 0.002, 4);
  const minuteLume = extrude(poly([[-0.006, 0.11], [-0.011, 0.59], [0, 0.665], [0.011, 0.59], [0.006, 0.11]]), 0.004, 0, 4);

  const sec = new THREE.Shape();
  sec.moveTo(-0.004, -0.17);
  sec.lineTo(0.004, -0.17);
  sec.lineTo(0.0025, 0.79);
  sec.lineTo(-0.0025, 0.79);
  sec.closePath();
  const seconds = extrude(sec, 0.005, 0.001, 4);
  const ring = new THREE.Shape();
  ring.absarc(0, 0, 0.034, 0, Math.PI * 2, false);
  const ringHole = new THREE.Path();
  ringHole.absarc(0, 0, 0.022, 0, Math.PI * 2, true);
  ring.holes.push(ringHole);
  const secRing = extrude(ring, 0.005, 0.001, 32);
  const secLume = new THREE.CylinderGeometry(0.022, 0.022, 0.004, 32).rotateX(Math.PI / 2);
  const counter = new THREE.CylinderGeometry(0.03, 0.03, 0.006, 32).rotateX(Math.PI / 2);
  const hub = new THREE.CylinderGeometry(0.042, 0.046, 0.012, 48).rotateX(Math.PI / 2);
  const cap = new THREE.CylinderGeometry(0.018, 0.02, 0.012, 32).rotateX(Math.PI / 2);
  return { hour, hourLume, minute, minuteLume, seconds, secRing, secLume, counter, hub, cap };
}

export function Dial() {
  const m = getMaterials();
  const hourRef = useRef<THREE.Group>(null);
  const minRef = useRef<THREE.Group>(null);
  const secRef = useRef<THREE.Group>(null);

  const geo = useMemo(() => {
    const face = new THREE.CircleGeometry(DIAL.radius, 128);
    const edge = new THREE.CylinderGeometry(DIAL.radius, DIAL.radius, 0.02, 128, 1, true).rotateX(Math.PI / 2);
    const back = new THREE.CircleGeometry(DIAL.radius, 64).rotateY(Math.PI);
    const baton = new RoundedBoxGeometry(0.042, 0.14, 0.03, 2, 0.008);
    const batonLume = new RoundedBoxGeometry(0.022, 0.105, 0.012, 2, 0.004);
    const frameH = new RoundedBoxGeometry(0.13, 0.012, 0.022, 2, 0.004);
    const frameV = new RoundedBoxGeometry(0.012, 0.11, 0.022, 2, 0.004);
    return { face, edge, back, baton, batonLume, frameH, frameV, hands: handGeometries() };
  }, []);

  const indices = useMemo(() => {
    const out: { x: number; y: number; rot: number }[] = [];
    for (let h = 0; h < 12; h++) {
      if (h === 3) continue; // date aperture
      const a = (h / 12) * Math.PI * 2;
      const place = (dx: number) => ({
        x: Math.sin(a) * IDX_R + Math.cos(a) * dx,
        y: Math.cos(a) * IDX_R - Math.sin(a) * dx,
        rot: -a,
      });
      if (h === 0) out.push(place(-0.032), place(0.032));
      else out.push(place(0));
    }
    return out;
  }, []);

  useFrame(() => {
    const now = new Date();
    // 8 steps per second, like a 28,800 vph movement
    const s = now.getSeconds() + Math.floor(now.getMilliseconds() / 125) / 8;
    const min = now.getMinutes() + s / 60;
    const hr = (now.getHours() % 12) + min / 60;
    secRef.current!.rotation.z = -(s / 60) * Math.PI * 2;
    minRef.current!.rotation.z = -(min / 60) * Math.PI * 2;
    hourRef.current!.rotation.z = -(hr / 12) * Math.PI * 2;
  });

  const z = DIAL.z;
  const dateX = 0.66 * DIAL.radius;
  const h = geo.hands;
  return (
    <group>
      <mesh geometry={geo.face} material={m.dial} position={[0, 0, z]} receiveShadow />
      <mesh geometry={geo.edge} material={m.brass} position={[0, 0, z - 0.01]} />
      <mesh geometry={geo.back} material={m.brass} position={[0, 0, z - 0.02]} />

      {indices.map((p, i) => (
        <group key={i} position={[p.x, p.y, z + 0.015]} rotation={[0, 0, p.rot]}>
          <mesh geometry={geo.baton} material={m.gold} castShadow />
          <mesh geometry={geo.batonLume} material={m.lume} position={[0, 0, 0.012]} />
        </group>
      ))}

      <group position={[dateX, 0, z + 0.011]}>
        <mesh geometry={geo.frameH} material={m.gold} position={[0, 0.049, 0]} castShadow />
        <mesh geometry={geo.frameH} material={m.gold} position={[0, -0.049, 0]} castShadow />
        <mesh geometry={geo.frameV} material={m.gold} position={[0.059, 0, 0]} castShadow />
        <mesh geometry={geo.frameV} material={m.gold} position={[-0.059, 0, 0]} castShadow />
      </group>

      <SubExplode index={INDEX} offset={[0, 0, 0.32]}>
        <mesh geometry={h.hub} material={m.gold} position={[0, 0, z + 0.022]} castShadow />
        <group ref={hourRef} position={[0, 0, z + 0.03]}>
          <mesh geometry={h.hour} material={m.gold} castShadow />
          <mesh geometry={h.hourLume} material={m.lume} position={[0, 0, 0.005]} />
        </group>
        <group ref={minRef} position={[0, 0, z + 0.045]}>
          <mesh geometry={h.minute} material={m.gold} castShadow />
          <mesh geometry={h.minuteLume} material={m.lume} position={[0, 0, 0.005]} />
        </group>
        <group ref={secRef} position={[0, 0, z + 0.058]}>
          <mesh geometry={h.seconds} material={m.gold} castShadow />
          <mesh geometry={h.secRing} material={m.gold} position={[0, 0.56, 0]} />
          <mesh geometry={h.secLume} material={m.lume} position={[0, 0.56, 0]} />
          <mesh geometry={h.counter} material={m.gold} position={[0, -0.12, 0]} />
          <mesh geometry={h.cap} material={m.gold} position={[0, 0, 0.004]} />
        </group>
      </SubExplode>

      <PartLabel index={INDEX} position={[0.6, 0.62, z + 0.05]} />
    </group>
  );
}
