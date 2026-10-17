import { useMemo } from 'react';
import { getMaterials } from '../materials';
import { revolve } from '../geometry';
import { PartLabel } from '../ExplodablePart';
import { CRYSTAL } from '../dimensions';

export function Crystal() {
  const m = getMaterials();
  const geo = useMemo(() => {
    const { radius: r, bottom: b, top: t } = CRYSTAL;
    return revolve(
      [
        [0.0001, b],
        [r, b],
        [r, t - 0.02],
        [r - 0.02, t],
        [0.0001, t],
      ],
      128,
    );
  }, []);
  return (
    <group>
      <mesh geometry={geo} material={m.sapphire} />
      <PartLabel index={0} position={[0.62, 0.62, 0.29]} />
    </group>
  );
}
