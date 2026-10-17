export type WatchComponent = {
  id: string;
  name: string;
  short: string;
  description: string;
  /** "Typically" — common choices, not a claim about any specific model. */
  typical: string;
};

/**
 * Ordered front-to-back, the way a watchmaker would lift the parts away.
 * Descriptions are general watchmaking information; construction and materials
 * differ between manufacturers and references.
 */
export const COMPONENTS: WatchComponent[] = [
  {
    id: 'crystal',
    name: 'Sapphire Crystal',
    short: 'Protects the dial',
    description:
      'A transparent window that protects the dial and hands. Synthetic sapphire is prized for its scratch resistance — far harder than mineral glass or acrylic — and is often given an anti-reflective coating.',
    typical: 'Synthetic sapphire (corundum); some watches use mineral glass or acrylic.',
  },
  {
    id: 'bezel',
    name: 'Bezel',
    short: 'Frames the crystal',
    description:
      'The ring that surrounds and secures the crystal. On dive-style watches it may rotate in one direction and carry a graduated insert used to time elapsed minutes.',
    typical: 'Steel or precious metal; inserts in ceramic, aluminium or sapphire.',
  },
  {
    id: 'dial',
    name: 'Dial & Hands',
    short: 'Display the time',
    description:
      'The face of the watch. Applied hour markers and hands are often finished by hand and may carry luminescent material for legibility in the dark. The hands are driven by the motion works beneath the dial.',
    typical: 'Brass dial base with lacquer, sunburst or enamel finishes; metal hands.',
  },
  {
    id: 'case',
    name: 'Case & Crown',
    short: 'Protects the mechanism',
    description:
      'The structural core that houses the movement and anchors the lugs, bezel and case back. The crown passes through a sealed tube to wind the watch and set the time.',
    typical: 'Stainless steel, gold, platinum, titanium or ceramic.',
  },
  {
    id: 'movement',
    name: 'Movement',
    short: 'The engine',
    description:
      'The mechanical system that powers the watch: plates and bridges hold a gear train that transmits energy from the mainspring to the escapement. In automatic movements an oscillating rotor winds the mainspring as the wrist moves.',
    typical: 'Rhodium- or gold-plated brass plates, steel pinions, synthetic ruby jewels.',
  },
  {
    id: 'balance',
    name: 'Balance & Escapement',
    short: 'Regulate time',
    description:
      'The regulating organ. The balance wheel oscillates back and forth on its hairspring at a steady rate, while the escapement — escape wheel and pallet fork — releases the gear train in tiny, equal steps and gives the balance a small push each swing.',
    typical: 'Alloy or silicon hairsprings; steel or silicon escapement parts.',
  },
  {
    id: 'barrel',
    name: 'Mainspring & Barrel',
    short: 'Store energy',
    description:
      'A coiled mainspring, enclosed in a toothed drum called the barrel, stores the energy from winding. As it slowly unwinds, the barrel turns and drives the gear train for many hours — often two days or more.',
    typical: 'Cobalt-nickel based spring alloys; brass or steel barrel.',
  },
  {
    id: 'gaskets',
    name: 'Gaskets & Seals',
    short: 'Keep water out',
    description:
      'Compressible rings at the crystal, crown and case back that help seal the case against water and dust. Seals age over time, which is why water resistance should be checked during servicing.',
    typical: 'Synthetic rubbers such as nitrile or fluoroelastomer; some use PTFE.',
  },
  {
    id: 'caseback',
    name: 'Case Back',
    short: 'Encloses the movement',
    description:
      'Closes the case and compresses the rear gasket. It may screw down, snap on or be held by screws; some are solid metal, others include a sapphire window to display the movement.',
    typical: 'Matching case metal; sometimes a sapphire display window.',
  },
  {
    id: 'bracelet',
    name: 'Bracelet & Clasp',
    short: 'Secure it to the wrist',
    description:
      'Articulated links that follow the curve of the wrist, joined to the case by spring bars or screws between the lugs. A folding clasp secures it and may include a safety catch or fine-adjustment system.',
    typical: 'Solid metal links; alternatively rubber, leather or textile straps.',
  },
];

export const COMPONENT_COUNT = COMPONENTS.length;
