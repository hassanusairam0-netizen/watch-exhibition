import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { ExplodablePart } from './ExplodablePart';
import { Crystal } from './parts/Crystal';
import { Bezel } from './parts/Bezel';
import { Dial } from './parts/Dial';
import { Case } from './parts/Case';
import { Movement } from './parts/Movement';
import { BalanceAssembly } from './parts/BalanceAssembly';
import { Barrel } from './parts/Barrel';
import { Gaskets } from './parts/Gaskets';
import { CaseBack } from './parts/CaseBack';
import { Bracelet } from './parts/Bracelet';
import { rig } from '../rig';

const PARTS = [Crystal, Bezel, Dial, Case, Movement, BalanceAssembly, Barrel, Gaskets, CaseBack, Bracelet];

/** The complete procedural watch: ten explodable components in COMPONENTS order. */
export function Watch() {
  const ref = useRef<THREE.Group>(null);
  useEffect(() => {
    rig.watch = ref.current;
    return () => void (rig.watch = null);
  }, []);
  return (
    <group ref={ref} rotation-order="YXZ">
      {PARTS.map((Part, i) => (
        <ExplodablePart key={i} index={i}>
          <Part />
        </ExplodablePart>
      ))}
    </group>
  );
}
