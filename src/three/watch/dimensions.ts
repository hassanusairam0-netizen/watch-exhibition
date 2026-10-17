/**
 * Scene scale: 1 unit = 20 mm. The concept watch is a 40 mm three-hander.
 * Z points out of the dial toward the viewer.
 */
export const CASE = { radius: 1.0, top: 0.2, bottom: -0.2 };
export const BEZEL = { inner: 0.83, outer: 1.045, bottom: 0.18, top: 0.27 };
export const BEZEL_INSERT = { inner: 0.86, outer: 1.0, z: 0.272 };
export const CRYSTAL = { radius: 0.835, bottom: 0.235, top: 0.29 };
export const DIAL = { radius: 0.86, z: 0.1 };
export const MOVEMENT = { radius: 0.76 };

/** Layout of the movement, in movement-local XY (seen from the dial side). */
export const LAYOUT = {
  barrel: [-0.32, 0.3] as const,
  center: [0, 0] as const,
  third: [-0.31, -0.2] as const,
  fourth: [-0.12, -0.42] as const,
  escape: [0.45, -0.05] as const,
  pallet: [0.385, -0.235] as const,
  balance: [0.24, -0.4] as const,
};

export const LUG_GAP = 1.0;
