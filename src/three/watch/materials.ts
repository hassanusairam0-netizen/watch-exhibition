import * as THREE from 'three';
import {
  makeBezelTexture,
  makeCasebackEngraving,
  makeCotesTexture,
  makeDialTexture,
  makePerlageTexture,
  makeRadialAnisotropyMap,
  makeSnailTexture,
} from './textures';
import { BEZEL_INSERT } from './dimensions';

/**
 * Shared physically-based materials. Created lazily once; each exploded part
 * clones what it uses so it can be dimmed independently.
 */
function create() {
  const steel = new THREE.MeshPhysicalMaterial({
    name: 'steel-polished',
    color: '#d9dde1',
    metalness: 1,
    roughness: 0.13,
  });

  const steelBrushed = new THREE.MeshPhysicalMaterial({
    name: 'steel-brushed',
    color: '#c9cdd1',
    metalness: 1,
    roughness: 0.36,
    anisotropy: 0.7,
  });

  const gold = new THREE.MeshPhysicalMaterial({
    name: 'champagne-gold',
    color: '#e8c98c',
    metalness: 1,
    roughness: 0.14,
  });

  const gilt = new THREE.MeshPhysicalMaterial({
    name: 'gilt',
    color: '#d6b067',
    metalness: 1,
    roughness: 0.26,
  });

  const lume = new THREE.MeshStandardMaterial({
    name: 'lume',
    color: '#eef1e4',
    roughness: 0.55,
    emissive: '#a6e8bf',
    emissiveIntensity: 0.06,
  });

  const dial = new THREE.MeshPhysicalMaterial({
    name: 'dial',
    map: makeDialTexture(new Date().getDate()),
    metalness: 0.55,
    roughness: 0.34,
    anisotropy: 0.9,
    anisotropyMap: makeRadialAnisotropyMap(),
    clearcoat: 0.6,
    clearcoatRoughness: 0.12,
  });

  const ceramic = new THREE.MeshPhysicalMaterial({
    name: 'ceramic',
    map: makeBezelTexture(BEZEL_INSERT.inner / BEZEL_INSERT.outer),
    metalness: 0.1,
    roughness: 0.2,
    clearcoat: 1,
    clearcoatRoughness: 0.04,
  });

  // Reflection-only glass: added on top of the dial, like a thin flat sapphire.
  // Far cheaper than a transmission pass and visually equivalent for a flat crystal.
  const sapphire = new THREE.MeshPhysicalMaterial({
    name: 'sapphire',
    // faint blue-violet bloom, like an anti-reflective coating catching the light
    color: '#0a1220',
    metalness: 0,
    roughness: 0.03,
    ior: 1.77,
    specularIntensity: 1,
    clearcoat: 1,
    clearcoatRoughness: 0.02,
    envMapIntensity: 2.2,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const rhodium = new THREE.MeshPhysicalMaterial({
    name: 'rhodium-perlage',
    color: '#cfd3d7',
    map: makePerlageTexture(),
    metalness: 1,
    roughness: 0.32,
  });

  const cotes = new THREE.MeshPhysicalMaterial({
    name: 'rhodium-cotes',
    color: '#e3e6e9',
    map: makeCotesTexture(),
    metalness: 1,
    roughness: 0.2,
  });

  const snail = new THREE.MeshPhysicalMaterial({
    name: 'steel-snailed',
    color: '#d8dbde',
    map: makeSnailTexture(),
    metalness: 1,
    roughness: 0.32,
  });

  const ruby = new THREE.MeshPhysicalMaterial({
    name: 'ruby',
    color: '#b0102a',
    metalness: 0,
    roughness: 0.06,
    clearcoat: 1,
    sheen: 0.4,
    sheenColor: new THREE.Color('#ff6d7d'),
  });

  const blued = new THREE.MeshPhysicalMaterial({
    name: 'blued-steel',
    color: '#2b44a8',
    metalness: 1,
    roughness: 0.22,
  });

  const springSteel = new THREE.MeshPhysicalMaterial({
    name: 'spring-alloy',
    color: '#8e98a4',
    metalness: 1,
    roughness: 0.28,
    side: THREE.DoubleSide,
  });

  const rubber = new THREE.MeshPhysicalMaterial({
    name: 'rubber',
    color: '#101010',
    metalness: 0,
    roughness: 0.62,
    sheen: 0.3,
    sheenColor: new THREE.Color('#333333'),
  });

  const flange = new THREE.MeshPhysicalMaterial({
    name: 'flange',
    color: '#0c2a20',
    metalness: 0.4,
    roughness: 0.3,
    clearcoat: 0.5,
  });

  const engraving = new THREE.MeshPhysicalMaterial({
    name: 'engraving',
    color: '#5f656b',
    metalness: 1,
    roughness: 0.55,
    alphaMap: makeCasebackEngraving(),
    transparent: true,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -2,
  });

  const dateWheel = new THREE.MeshStandardMaterial({ name: 'brass', color: '#b48c4a', metalness: 1, roughness: 0.35 });

  return {
    steel,
    steelBrushed,
    gold,
    gilt,
    lume,
    dial,
    ceramic,
    sapphire,
    rhodium,
    cotes,
    snail,
    ruby,
    blued,
    springSteel,
    rubber,
    flange,
    engraving,
    brass: dateWheel,
  };
}

let cache: ReturnType<typeof create> | null = null;
export function getMaterials() {
  return (cache ??= create());
}
export type Materials = ReturnType<typeof create>;
