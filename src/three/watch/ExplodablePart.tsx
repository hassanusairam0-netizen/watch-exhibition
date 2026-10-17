import { useLayoutEffect, useRef, type ReactNode } from 'react';
import { useFrame, type ThreeElements } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { rig, EXPLODE_OFFSETS } from '../rig';
import { COMPONENTS } from '../../data/components';
import { scrollToLayerStep } from '../../state/scroll';

type Dimmable = {
  mat: THREE.MeshStandardMaterial;
  color: THREE.Color;
  env: number;
  emissive: number;
};

/**
 * Wraps one of the ten watch components:
 * - translates it along its exploded offset
 * - clones its materials so it can be dimmed while another part is inspected
 */
export function ExplodablePart({ index, children }: { index: number; children: ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  const dimmables = useRef<Dimmable[]>([]);
  const lastLight = useRef(-1);
  const offset = EXPLODE_OFFSETS[index];

  useLayoutEffect(() => {
    const clones = new Map<THREE.Material, THREE.MeshStandardMaterial>();
    const list: Dimmable[] = [];
    ref.current!.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      const src = mesh.material as THREE.MeshStandardMaterial;
      let clone = clones.get(src);
      if (!clone) {
        clone = src.clone();
        clones.set(src, clone);
        list.push({
          mat: clone,
          color: clone.color.clone(),
          env: clone.envMapIntensity ?? 1,
          emissive: clone.emissiveIntensity ?? 0,
        });
      }
      mesh.material = clone;
    });
    dimmables.current = list;
    return () => clones.forEach((m) => m.dispose());
  }, []);

  useFrame(() => {
    const g = ref.current!;
    const e = rig.explode[index];
    g.position.set(offset[0] * e, offset[1] * e, offset[2] * e);

    const l = rig.light[index];
    g.visible = l > 0.02;
    if (Math.abs(l - lastLight.current) < 0.002) return;
    lastLight.current = l;
    const k = 0.06 + 0.94 * l;
    for (const d of dimmables.current) {
      d.mat.color.copy(d.color).multiplyScalar(k);
      d.mat.envMapIntensity = d.env * (0.15 + 0.85 * l * l);
      d.mat.emissiveIntensity = d.emissive * l;
    }
  });

  return <group ref={ref}>{children}</group>;
}

/** Numbered marker + name floating beside a component; selecting it inspects that part. */
export function PartLabel({ index, position }: { index: number; position: [number, number, number] }) {
  const ref = useRef<HTMLButtonElement>(null);
  const portal = useRef<HTMLElement>(document.getElementById('label-layer')!);
  const state = useRef({ o: -1, active: false, dim: false });

  useFrame(() => {
    const el = ref.current;
    if (!el) return;
    const shown = rig.light[index] > 0.1 && (rig.focus < 0 || rig.focus === index);
    const o = rig.labels * (shown ? 1 : 0);
    const active = rig.focus === index;
    const dim = rig.focus >= 0 && !active;
    const s = state.current;
    if (Math.abs(o - s.o) > 0.01) {
      el.style.opacity = String(o);
      el.style.visibility = o < 0.05 ? 'hidden' : 'visible';
      s.o = o;
    }
    if (active !== s.active) el.classList.toggle('is-active', (s.active = active));
    if (dim !== s.dim) el.classList.toggle('is-dim', (s.dim = dim));
  });

  return (
    <Html position={position} portal={portal} zIndexRange={[10, 0]} style={{ pointerEvents: 'none' }}>
      <button
        ref={ref}
        className="part-label"
        style={{ opacity: 0, visibility: 'hidden' }}
        onClick={() => scrollToLayerStep(index)}
        aria-label={`Inspect ${COMPONENTS[index].name}`}
        tabIndex={-1}
      >
        <span className="dot">{index + 1}</span>
        <span className="line" />
        <span className="name">{COMPONENTS[index].name}</span>
      </button>
    </Html>
  );
}

/**
 * A sub-assembly that travels further than its parent when exploded
 * (e.g. the crown pulling out of the case, hands lifting off the dial).
 */
export function SubExplode({
  index,
  offset,
  children,
  ...props
}: {
  index: number;
  offset: [number, number, number];
  children: ReactNode;
} & ThreeElements['group']) {
  const ref = useRef<THREE.Group>(null);
  const base = useRef<THREE.Vector3 | null>(null);
  useFrame(() => {
    const g = ref.current!;
    base.current ??= g.position.clone();
    const e = rig.explode[index];
    g.position.set(base.current.x + offset[0] * e, base.current.y + offset[1] * e, base.current.z + offset[2] * e);
  });
  return (
    <group ref={ref} {...props}>
      {children}
    </group>
  );
}
