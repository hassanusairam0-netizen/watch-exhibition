/** Energy-flow chapter. Component indices refer to COMPONENTS. */
export const HEARTBEAT_STAGES = [
  {
    title: 'Power',
    kicker: 'Mainspring & barrel',
    text: 'Winding — by the crown or by an automatic rotor — tightens the mainspring inside its barrel. The spring wants to unwind, and that is the only source of energy in the watch.',
    focus: [6],
  },
  {
    title: 'Transmission',
    kicker: 'The gear train',
    text: 'The barrel turns a train of wheels and pinions, each mounted between jewel bearings. The gearing converts a slow, powerful unwinding into faster, gentler rotation.',
    focus: [4],
  },
  {
    title: 'Regulation',
    kicker: 'Escapement & balance',
    text: 'Without control, the spring would unwind in seconds. The escapement lets the train advance one tooth at a time, in step with the oscillating balance. Many modern movements beat at 28,800 vibrations per hour (4 Hz); others run at 21,600 or 36,000.',
    focus: [5],
  },
  {
    title: 'Display',
    kicker: 'Motion works & hands',
    text: 'Beneath the dial, a small set of wheels called the motion works reduces the rotation to the 12-to-1 ratio between minute and hour hands — turning measured energy into readable time.',
    focus: [2],
  },
];

export type Material = {
  id: string;
  title: string;
  kicker: string;
  text: string;
  points: string[];
  visual: 'steel' | 'gold' | 'sapphire' | 'ceramic' | 'movement' | 'straps';
};

export const MATERIALS: Material[] = [
  {
    id: 'steel',
    title: 'Stainless Steel',
    kicker: 'Case & bracelet',
    visual: 'steel',
    text: 'Austenitic stainless steels are the workhorse of fine watchmaking: corrosion resistant, tough, and able to take both a mirror polish and a satin brush.',
    points: [
      '316L is widely used across the industry.',
      'Some makers use 904L-family or proprietary alloys.',
      'Polished and brushed surfaces are often alternated for contrast.',
    ],
  },
  {
    id: 'gold',
    title: 'Precious Metals',
    kicker: 'Gold & platinum',
    visual: 'gold',
    text: 'Precious-metal cases are alloys. 18-carat gold is 75% pure gold by weight; the remainder determines whether it appears yellow, white or rose.',
    points: [
      '18k gold is hallmarked “750”.',
      'Platinum watches are commonly 950 (95%) platinum.',
      'Several brands develop their own proprietary gold alloys.',
    ],
  },
  {
    id: 'sapphire',
    title: 'Sapphire Crystal',
    kicker: 'Synthetic corundum',
    visual: 'sapphire',
    text: 'Grown synthetically and cut into thin discs, sapphire is 9 on the Mohs hardness scale — second only to diamond among common gem materials.',
    points: [
      'Highly scratch resistant, but can shatter under a hard impact.',
      'Anti-reflective coatings reduce glare.',
      'Also used for display case backs and some bezel inserts.',
    ],
  },
  {
    id: 'ceramic',
    title: 'Ceramic',
    kicker: 'Bezel inserts & cases',
    visual: 'ceramic',
    text: 'Technical ceramics — most often zirconium oxide — are sintered at very high temperatures to create surfaces that resist scratches and fading from UV light.',
    points: [
      'Colour is integral to the material rather than painted on.',
      'Very hard, but brittle under sharp impact.',
      'Markings may be engraved and filled with metal or lacquer.',
    ],
  },
  {
    id: 'movement',
    title: 'Movement Components',
    kicker: 'Inside the calibre',
    visual: 'movement',
    text: 'A movement can contain well over a hundred parts, each chosen for a specific job: stability, low friction, or resistance to magnetism and temperature change.',
    points: [
      'Plates and bridges: often brass or nickel silver, plated and decorated.',
      'Jewels: synthetic ruby bearings reduce friction and wear.',
      'Hairsprings: specialised alloys or silicon, depending on the maker.',
    ],
  },
  {
    id: 'straps',
    title: 'Bracelets & Straps',
    kicker: 'Rubber, leather, metal',
    visual: 'straps',
    text: 'What secures the watch shapes how it wears. Each material balances comfort, durability and character differently.',
    points: [
      'Metal: solid links are heavier and more durable than folded ones.',
      'Rubber: fluoroelastomer (FKM) resists heat, UV and chemicals.',
      'Leather: refined and comfortable, but should be kept away from water.',
    ],
  },
];
