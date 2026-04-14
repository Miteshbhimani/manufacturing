// ─── Type Definitions ─────────────────────────────────────────────────────────
export interface Product {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  category: string;
  industry: string;
  heroImage: string;
  price: null;
  specs?: string[];
}

// ─── Pump Industry (21 products) ──────────────────────────────────────────────
const pumpProducts: Product[] = [
  {
    id: "pump-001",
    slug: "pump-casing-centrifugal",
    name: "Centrifugal Pump Casing",
    shortDescription:
      "Heavy-duty centrifugal pump casing cast in shell mould process for dimensional accuracy and surface finish. Ideal for water supply, chemical and process industry applications.",
    category: "Pump Industry",
    industry: "Pump Industry",
    heroImage: "/src/assets/pump/1.jpg",
    price: null,
    specs: [
      "Product Type: Pump Casing",
      "Material: Cast Iron / SG Iron / SS304",
      "Manufacturing Process: Shell Mould Casting",
      "Finish: As-Cast / Machined",
      "Key Application: Centrifugal pumps, water supply, chemical processing",
    ],
  },
  {
    id: "pump-002",
    slug: "pump-impeller-open",
    name: "Open Impeller — Centrifugal Pump",
    shortDescription:
      "Precision-cast open impeller for centrifugal pumps. Shell moulded for consistent vane geometry and balanced hydraulic performance in demanding fluid handling systems.",
    category: "Pump Industry",
    industry: "Pump Industry",
    heroImage: "/src/assets/pump/2.jpg",
    price: null,
    specs: [
      "Product Type: Open Impeller",
      "Material: Cast Iron / SG Iron / Bronze",
      "Manufacturing Process: Shell Mould Casting",
      "Finish: As-Cast / Machined",
      "Key Application: Water, chemical, and slurry centrifugal pumps",
    ],
  },
  {
    id: "pump-003",
    slug: "pump-impeller-closed",
    name: "Closed Impeller — Centrifugal Pump",
    shortDescription:
      "High-efficiency closed impeller casting for centrifugal pumps. Provides superior head and flow characteristics with minimal hydraulic losses for industrial pumping systems.",
    category: "Pump Industry",
    industry: "Pump Industry",
    heroImage: "/src/assets/pump/3.jpg",
    price: null,
    specs: [
      "Product Type: Closed Impeller",
      "Material: SG Iron / Alloy Steel / Bronze",
      "Manufacturing Process: Shell Mould Casting",
      "Finish: Precision Machined",
      "Key Application: High-pressure centrifugal pumps, HVAC, process industry",
    ],
  },
  {
    id: "pump-004",
    slug: "pump-back-plate",
    name: "Pump Back Plate / Rear Cover",
    shortDescription:
      "Precisely cast pump back plates and rear covers manufactured via shell moulding for accurate mating surfaces and consistent sealing in centrifugal pump assemblies.",
    category: "Pump Industry",
    industry: "Pump Industry",
    heroImage: "/src/assets/pump/4.jpg",
    price: null,
    specs: [
      "Product Type: Back Plate / Rear Cover",
      "Material: Cast Iron / SG Iron",
      "Manufacturing Process: Shell Mould Casting",
      "Finish: As-Cast / Machined Mating Faces",
      "Key Application: Centrifugal pump rear cover, bearing housing end cap",
    ],
  },
  {
    id: "pump-005",
    slug: "pump-bearing-housing",
    name: "Pump Bearing Housing",
    shortDescription:
      "Robust bearing housing casting for centrifugal and submersible pumps. Shell mould cast for consistent bore geometry and alignment critical for long bearing life.",
    category: "Pump Industry",
    industry: "Pump Industry",
    heroImage: "/src/assets/pump/5.jpg",
    price: null,
    specs: [
      "Product Type: Bearing Housing",
      "Material: Cast Iron (FG 200 / FG 260)",
      "Manufacturing Process: Shell Mould Casting",
      "Finish: Bore Precision Machined",
      "Key Application: Centrifugal pump bearing support, motor end shield",
    ],
  },
  {
    id: "pump-006",
    slug: "pump-diffuser-bowl",
    name: "Pump Diffuser Bowl — Turbine Pump",
    shortDescription:
      "Multi-stage turbine pump diffuser bowl cast in shell mould process. Delivers precise flow channels and consistent wall thickness critical for hydraulic efficiency in deep well and borehole pumps.",
    category: "Pump Industry",
    industry: "Pump Industry",
    heroImage: "/src/assets/pump/6.jpg",
    price: null,
    specs: [
      "Product Type: Diffuser Bowl",
      "Material: Cast Iron / Bronze / SS304",
      "Manufacturing Process: Shell Mould Casting",
      "Finish: As-Cast / Machined Ports",
      "Key Application: Multi-stage turbine pumps, deep bore well pumps",
    ],
  },
  {
    id: "pump-007",
    slug: "pump-stuffing-box",
    name: "Pump Stuffing Box / Seal Housing",
    shortDescription:
      "Precision stuffing box and mechanical seal housing casting for centrifugal and process pumps. Tight dimensional tolerances ensure reliable sealing and minimal leakage.",
    category: "Pump Industry",
    industry: "Pump Industry",
    heroImage: "/src/assets/pump/7.jpg",
    price: null,
    specs: [
      "Product Type: Stuffing Box / Seal Housing",
      "Material: Cast Iron / SG Iron",
      "Manufacturing Process: Shell Mould Casting",
      "Finish: Machined Bore and Faces",
      "Key Application: Process pump sealing, gland packing, mechanical seals",
    ],
  },
  {
    id: "pump-008",
    slug: "pump-lantern-ring",
    name: "Pump Lantern Ring / Seal Cage",
    shortDescription:
      "Precision lantern ring and seal cage castings for pump gland packing assemblies. Engineered to maintain lubrication flow and cooling to packing rings under operating conditions.",
    category: "Pump Industry",
    industry: "Pump Industry",
    heroImage: "/src/assets/pump/8.jpg",
    price: null,
    specs: [
      "Product Type: Lantern Ring / Seal Cage",
      "Material: Bronze / Cast Iron",
      "Manufacturing Process: Shell Mould Casting",
      "Finish: Precision Machined",
      "Key Application: Pump stuffing box, gland packing assembly",
    ],
  },
  {
    id: "pump-009",
    slug: "pump-wear-ring",
    name: "Pump Wear Ring / Neck Ring",
    shortDescription:
      "Replaceable wear ring and neck ring castings for centrifugal pumps. Controls internal leakage between impeller and casing, significantly extending pump service life.",
    category: "Pump Industry",
    industry: "Pump Industry",
    heroImage: "/src/assets/pump/9.jpg",
    price: null,
    specs: [
      "Product Type: Wear Ring / Neck Ring",
      "Material: Bronze / SG Iron / SS316",
      "Manufacturing Process: Shell Mould Casting",
      "Finish: Precision Machined to Drawing",
      "Key Application: Centrifugal pump wear control, gap sealing",
    ],
  },
  {
    id: "pump-010",
    slug: "pump-shaft-sleeve",
    name: "Pump Shaft Sleeve",
    shortDescription:
      "Hardened pump shaft sleeve casting to protect the main shaft from corrosion and wear at the gland packing or mechanical seal area. Replaceable design minimises downtime.",
    category: "Pump Industry",
    industry: "Pump Industry",
    heroImage: "/src/assets/pump/10.jpg",
    price: null,
    specs: [
      "Product Type: Shaft Sleeve",
      "Material: Bronze / SS304 / Ni-Hard",
      "Manufacturing Process: Shell Mould Casting + CNC Machining",
      "Finish: Ground OD and ID",
      "Key Application: Shaft protection at gland / seal zone in pumps",
    ],
  },
  {
    id: "pump-011",
    slug: "pump-coupling-half",
    name: "Pump–Motor Coupling Half",
    shortDescription:
      "Robust coupling half casting for pump-to-motor drive connection. Shell moulded for concentricity and balance, reducing vibration transmission across the drive train.",
    category: "Pump Industry",
    industry: "Pump Industry",
    heroImage: "/src/assets/pump/11.jpg",
    price: null,
    specs: [
      "Product Type: Coupling Half",
      "Material: Cast Iron / SG Iron",
      "Manufacturing Process: Shell Mould Casting",
      "Finish: Machined Bore & Keyway",
      "Key Application: Pump–motor flexible drive coupling",
    ],
  },
  {
    id: "pump-012",
    slug: "pump-discharge-elbow",
    name: "Pump Discharge Elbow / Volute Elbow",
    shortDescription:
      "Precision discharge elbow and volute elbow castings for centrifugal pumps. Shell moulding ensures smooth flow passage geometry for minimal pressure loss at discharge.",
    category: "Pump Industry",
    industry: "Pump Industry",
    heroImage: "/src/assets/pump/12.jpg",
    price: null,
    specs: [
      "Product Type: Discharge Elbow / Volute Elbow",
      "Material: Cast Iron / SG Iron",
      "Manufacturing Process: Shell Mould Casting",
      "Finish: As-Cast / Flanged Faces Machined",
      "Key Application: Centrifugal pump discharge porting, pipeline connection",
    ],
  },
  {
    id: "pump-013",
    slug: "pump-suction-cover",
    name: "Pump Suction Cover / Front Plate",
    shortDescription:
      "Suction cover and front plate castings for centrifugal pumps. Provides the pump suction inlet and retains the front wear ring, precision manufactured for leak-free assembly.",
    category: "Pump Industry",
    industry: "Pump Industry",
    heroImage: "/src/assets/pump/13.jpg",
    price: null,
    specs: [
      "Product Type: Suction Cover / Front Plate",
      "Material: Cast Iron / SG Iron / SS304",
      "Manufacturing Process: Shell Mould Casting",
      "Finish: Machined Sealing Faces",
      "Key Application: Centrifugal pump suction inlet, front wear ring retention",
    ],
  },
  {
    id: "pump-014",
    slug: "pump-column-pipe-bracket",
    name: "Pump Column Pipe Bracket",
    shortDescription:
      "Column pipe bracket casting for vertical turbine and deep well pump installations. Provides intermediate bearing support and column alignment in long pump strings.",
    category: "Pump Industry",
    industry: "Pump Industry",
    heroImage: "/src/assets/pump/14.jpg",
    price: null,
    specs: [
      "Product Type: Column Pipe Bracket",
      "Material: Cast Iron (FG 260)",
      "Manufacturing Process: Shell Mould Casting",
      "Finish: As-Cast / Machined Bore",
      "Key Application: Vertical turbine pump columns, deep bore well pump strings",
    ],
  },
  {
    id: "pump-015",
    slug: "pump-strainer-foot-valve",
    name: "Foot Valve Body / Suction Strainer",
    shortDescription:
      "Foot valve body and suction strainer casting for pump suction lines. Prevents backflow and filters debris, ensuring continuous prime and protection of pump internals.",
    category: "Pump Industry",
    industry: "Pump Industry",
    heroImage: "/src/assets/pump/15.jpg",
    price: null,
    specs: [
      "Product Type: Foot Valve Body / Strainer",
      "Material: Cast Iron / Bronze",
      "Manufacturing Process: Shell Mould Casting",
      "Finish: As-Cast / Machined Seat",
      "Key Application: Pump suction protection, non-return duty, debris filtering",
    ],
  },
  {
    id: "pump-016",
    slug: "pump-mechanical-seal-housing",
    name: "Mechanical Seal Housing / Gland Plate",
    shortDescription:
      "Precision mechanical seal housing and gland plate casting for process pumps. Ensures accurate seal face alignment and positive liquid containment at the shaft penetration.",
    category: "Pump Industry",
    industry: "Pump Industry",
    heroImage: "/src/assets/pump/16.jpg",
    price: null,
    specs: [
      "Product Type: Mechanical Seal Housing / Gland Plate",
      "Material: Cast Iron / SG Iron / SS304",
      "Manufacturing Process: Shell Mould Casting + CNC Machining",
      "Finish: Precision Machined to API 682",
      "Key Application: API process pump mechanical seal containment",
    ],
  },
  {
    id: "pump-017",
    slug: "pump-base-plate",
    name: "Pump Base Plate / Mounting Frame",
    shortDescription:
      "Rigid pump base plate and mounting frame casting for pump-motor sets. Precision-machined mounting pads ensure accurate alignment and vibration damping in operation.",
    category: "Pump Industry",
    industry: "Pump Industry",
    heroImage: "/src/assets/pump/17.jpg",
    price: null,
    specs: [
      "Product Type: Base Plate / Mounting Frame",
      "Material: Cast Iron (FG 200 / FG 260)",
      "Manufacturing Process: Shell Mould Casting",
      "Finish: Machined Mounting Pads",
      "Key Application: Pump-motor set alignment and mounting",
    ],
  },
  {
    id: "pump-018",
    slug: "pump-valve-body-non-return",
    name: "Non-Return Valve Body — Pump Line",
    shortDescription:
      "Non-return valve body casting for pump discharge and suction lines. Prevents reverse flow on pump shutdown protecting the pump from water hammer damage.",
    category: "Pump Industry",
    industry: "Pump Industry",
    heroImage: "/src/assets/pump/18.jpg",
    price: null,
    specs: [
      "Product Type: Non-Return Valve Body",
      "Material: Cast Iron / SG Iron",
      "Manufacturing Process: Shell Mould Casting",
      "Finish: Machined Seat and Flanges",
      "Key Application: Pump discharge line backflow prevention",
    ],
  },
  {
    id: "pump-019",
    slug: "pump-bowl-assembly-stage",
    name: "Bowl Assembly Stage — Submersible Pump",
    shortDescription:
      "Multi-stage submersible pump bowl assembly casting. Shell moulded for tight hydraulic clearances between impeller and diffuser stage, maximising efficiency in borehole applications.",
    category: "Pump Industry",
    industry: "Pump Industry",
    heroImage: "/src/assets/pump/19.jpg",
    price: null,
    specs: [
      "Product Type: Bowl Assembly Stage",
      "Material: Cast Iron / SS304",
      "Manufacturing Process: Shell Mould Casting",
      "Finish: Precision Machined",
      "Key Application: Submersible bore well pumps, multi-stage turbine pumps",
    ],
  },
  {
    id: "pump-020",
    slug: "pump-motor-end-shield",
    name: "Motor End Shield — Submersible Pump Motor",
    shortDescription:
      "Submersible pump motor end shield and bracket casting. Provides precise bearing location and hermetic sealing at the motor end for reliable underwater motor operation.",
    category: "Pump Industry",
    industry: "Pump Industry",
    heroImage: "/src/assets/pump/20.jpg",
    price: null,
    specs: [
      "Product Type: Motor End Shield / Bracket",
      "Material: Cast Iron / Aluminium Alloy",
      "Manufacturing Process: Shell Mould Casting",
      "Finish: Machined Bearing Bore and Spigot",
      "Key Application: Submersible pump motor, electric motor end frames",
    ],
  },
  {
    id: "pump-021",
    slug: "pump-sand-casting-special",
    name: "Special Pump Component — Custom Cast",
    shortDescription:
      "Custom-engineered pump component cast to customer drawing. Nucleus Metal Cast offers engineering support from pattern design through final machining for non-standard pump parts.",
    category: "Pump Industry",
    industry: "Pump Industry",
    heroImage: "/src/assets/pump/21.jpg",
    price: null,
    specs: [
      "Product Type: Custom / Special Pump Component",
      "Material: As Per Customer Specification",
      "Manufacturing Process: Shell Mould Casting",
      "Finish: As-Cast / Machined per drawing",
      "Key Application: OEM replacement, special pump assemblies",
    ],
  },
];

// ─── General Engineering (9 products) ─────────────────────────────────────────
const generalEngineeringProducts: Product[] = [
  {
    id: "ge-001",
    slug: "ge-housing-multibore",
    name: "Multi-Bore Housing / Camshaft Carrier",
    shortDescription:
      "Heavy-duty elongated cast iron housing with multiple precision counter-bored holes in-line and lateral mounting tabs. Used in engines, compressors, and general machinery for camshaft or valve train support.",
    category: "General Engineering",
    industry: "General Engineering",
    heroImage: "/src/assets/general-engineering/1.jpg",
    price: null,
    specs: [
      "Product Type: Multi-Bore Housing / Carrier",
      "Material: Cast Iron (FG 260 / Alloy Iron)",
      "Manufacturing Process: Shell Mould Casting",
      "Finish: As-Cast Grey Iron — Machined Bores",
      "Key Application: Camshaft carriers, valve train support, engine brackets",
      "Feature: Multi-bore precision casting, vibration-resistant",
    ],
  },
  {
    id: "ge-002",
    slug: "ge-gearbox-housing",
    name: "Gearbox Housing / Gear Case",
    shortDescription:
      "Rigid gearbox housing casting with precision-machined bearing bores and sealing faces. Shell moulded for consistent wall thickness and minimal porosity in industrial gear drives.",
    category: "General Engineering",
    industry: "General Engineering",
    heroImage: "/src/assets/general-engineering/2.jpg",
    price: null,
    specs: [
      "Product Type: Gearbox Housing / Gear Case",
      "Material: Cast Iron (FG 200 / FG 260)",
      "Manufacturing Process: Shell Mould Casting",
      "Finish: Machined Bearing Bores and Gasket Faces",
      "Key Application: Industrial gear reducers, worm drives, helical gearboxes",
    ],
  },
  {
    id: "ge-003",
    slug: "ge-valve-body-gate",
    name: "Gate Valve Body Casting",
    shortDescription:
      "Precision-engineered gate valve body casting for industrial pipeline systems. Conforms to PN-rated pressure standards with smooth flow bore for minimal pressure drop.",
    category: "General Engineering",
    industry: "General Engineering",
    heroImage: "/src/assets/general-engineering/3.jpg",
    price: null,
    specs: [
      "Product Type: Gate Valve Body",
      "Material: Cast Iron / SG Iron / Cast Steel",
      "Manufacturing Process: Shell Mould Casting",
      "Finish: Machined Flanges and Bore",
      "Key Application: Industrial pipeline isolation valves, water treatment",
      "Standard Compliance: PN 16 / PN 25 / API 600",
    ],
  },
  {
    id: "ge-004",
    slug: "ge-machine-base-frame",
    name: "Machine Base Frame / Bed Casting",
    shortDescription:
      "Heavy rigid machine tool bed and base frame casting providing a vibration-damping foundation for CNC machines, presses and general industrial equipment.",
    category: "General Engineering",
    industry: "General Engineering",
    heroImage: "/src/assets/general-engineering/4.jpg",
    price: null,
    specs: [
      "Product Type: Machine Base / Bed Casting",
      "Material: Gray Cast Iron (FG 260 / FG 300)",
      "Manufacturing Process: Shell Mould Casting",
      "Finish: Machined Mounting Surfaces",
      "Key Application: CNC machine bases, industrial press frames, lathe beds",
      "Feature: High vibration damping, ribbed construction",
    ],
  },
  {
    id: "ge-005",
    slug: "ge-bracket-pedestal",
    name: "Bearing Pedestal / Plummer Block Housing",
    shortDescription:
      "Plummer block housing and bearing pedestal casting for shaft support in industrial machinery. Precision-bored to accept standard bearing outer races with consistent interference fit.",
    category: "General Engineering",
    industry: "General Engineering",
    heroImage: "/src/assets/general-engineering/5.jpg",
    price: null,
    specs: [
      "Product Type: Bearing Pedestal / Plummer Block",
      "Material: Cast Iron (FG 200)",
      "Manufacturing Process: Shell Mould Casting",
      "Finish: Precision Machined Bore",
      "Key Application: Conveyor shafts, fan shafts, general rotating machinery",
    ],
  },
  {
    id: "ge-006",
    slug: "ge-flange-coupling-hub",
    name: "Flange Coupling Hub / Drive Hub",
    shortDescription:
      "Robust flange coupling hub and drive hub casting for rigid shaft-to-shaft connections. Shell moulded for concentricity and balance to handle high torque transmission.",
    category: "General Engineering",
    industry: "General Engineering",
    heroImage: "/src/assets/general-engineering/6.jpg",
    price: null,
    specs: [
      "Product Type: Flange Coupling Hub",
      "Material: Cast Iron / SG Iron",
      "Manufacturing Process: Shell Mould Casting",
      "Finish: Machined Bore, Keyway and Flange Face",
      "Key Application: Rigid shaft couplings, drive train connections",
    ],
  },
  {
    id: "ge-007",
    slug: "ge-pulley-sheave",
    name: "Belt Pulley / V-Belt Sheave",
    shortDescription:
      "Precision cast iron V-belt pulley and flat belt sheave for industrial drive systems. Dynamically balanced for smooth high-speed operation in compressors, fans and conveyors.",
    category: "General Engineering",
    industry: "General Engineering",
    heroImage: "/src/assets/general-engineering/7.jpg",
    price: null,
    specs: [
      "Product Type: Belt Pulley / V-Belt Sheave",
      "Material: Cast Iron (FG 200)",
      "Manufacturing Process: Shell Mould Casting",
      "Finish: Groove Precision Machined and Balanced",
      "Key Application: Industrial belt drive systems, compressor drives, fans",
    ],
  },
  {
    id: "ge-008",
    slug: "ge-castellated-nut",
    name: "Castellated Nut — Safety Critical",
    shortDescription:
      "Precision cast castellated nut with six top slots for cotter pin locking. Manufactured to exact dimensional tolerances for safety-critical fastening in automotive, agricultural and industrial machinery.",
    category: "General Engineering",
    industry: "General Engineering",
    heroImage: "/src/assets/general-engineering/8.jpg",
    price: null,
    specs: [
      "Product Type: Fastening Component — Castellated Nut",
      "Material: Cast Iron / Ductile Iron",
      "Manufacturing Process: Shell Mould Casting",
      "Finish: As-Cast Grey Iron — Machined Thread",
      "Key Application: Safety-critical fastening — automotive, agricultural machinery",
      "Feature: 6-slot castellated design for cotter pin locking",
    ],
  },
  {
    id: "ge-009",
    slug: "ge-thumb-nut-oval",
    name: "Thumb Nut — Oval Hand Fastener",
    shortDescription:
      "Oval body thumb nut casting with integral thumb lug and threaded central bore. Enables tool-free tightening in jig fixtures, clamping systems and hand-operated assemblies.",
    category: "General Engineering",
    industry: "General Engineering",
    heroImage: "/src/assets/general-engineering/9.jpg",
    price: null,
    specs: [
      "Product Type: Hand Fastening Component",
      "Material: Cast Iron (IS 210)",
      "Manufacturing Process: Shell Mould Casting",
      "Finish: As-Cast Grey Iron",
      "Key Application: Jig fixtures, clamping systems, hand-tightened assemblies",
      "Feature: Tool-free tightening, ergonomic thumb lug",
    ],
  },
];

// ─── Fire Industry (6 products) ───────────────────────────────────────────────
const fireIndustryProducts: Product[] = [
  {
    id: "fire-001",
    slug: "fire-square-head-pipe-plug",
    name: "Square Head Pipe Plug — Male Thread",
    shortDescription:
      "Cast iron square head pipe plug with solid round base for sealing and blanking off pipe ends, test points and unused port openings in fire hydrant, sprinkler and industrial pipework systems.",
    category: "Fire Industry",
    industry: "Fire Industry",
    heroImage: "/src/assets/fire-industry/1.jpg",
    price: null,
    specs: [
      "Product Type: Pipe Sealing Component",
      "Material: Malleable Cast Iron",
      "Manufacturing Process: Shell Mould Casting",
      "Finish: As-Cast Grey Iron / Black Iron",
      "Key Application: Blank-off plugs for fire hydrants, sprinkler systems, pipe networks",
      "Feature: Square wrench head, standard thread profile",
      "Standard Compliance: IS / BS / DIN pipe thread standards",
    ],
  },
  {
    id: "fire-002",
    slug: "fire-female-instantaneous-coupling-hex",
    name: "Female Instantaneous Coupling — Hexagonal Head (ISI Marked)",
    shortDescription:
      "Female instantaneous quick-connect coupling with a hexagonal wrench head and lobster-claw bayonet base. ISI marked per IS 903 for rapid hose-to-hydrant connections in fire brigades and industrial fire systems.",
    category: "Fire Industry",
    industry: "Fire Industry",
    heroImage: "/src/assets/fire-industry/2.jpg",
    price: null,
    specs: [
      "Product Type: Fire Hose Coupling Component",
      "Material: Malleable Cast Iron / SG Iron",
      "Manufacturing Process: Shell Mould Casting",
      "Finish: As-Cast Grey Iron",
      "Key Application: Fire hydrant hose connections, delivery main couplings",
      "Feature: ISI-marked, instant bayonet connection",
      "Standard Compliance: IS 903 Fire Hose Couplings",
    ],
  },
  {
    id: "fire-003",
    slug: "fire-male-coupling-small-isi",
    name: "Male Instantaneous Coupling with Hose Shank — Small (ISI Marked)",
    shortDescription:
      "Compact male instantaneous coupling with an integral ribbed hose shank. ISI-marked per IS 903 for lightweight fire hose assemblies and portable pump applications. Ribbed shank ensures secure crimping under working pressure.",
    category: "Fire Industry",
    industry: "Fire Industry",
    heroImage: "/src/assets/fire-industry/3.jpg",
    price: null,
    specs: [
      "Product Type: Fire Hose Coupling Component",
      "Material: Malleable Cast Iron / Aluminium Alloy",
      "Manufacturing Process: Shell Mould Casting",
      "Finish: As-Cast / Light Polish",
      "Key Application: Light-duty fire hose assemblies, portable pumps",
      "Feature: ISI-marked, ribbed shank for crimping / banding",
      "Standard Compliance: IS 903 Fire Hose Couplings",
    ],
  },
  {
    id: "fire-004",
    slug: "fire-male-coupling-large-isi",
    name: "Male Instantaneous Coupling with Hose Shank — Large (ISI Marked)",
    shortDescription:
      "Heavy-duty large-bore male instantaneous coupling with an extended ribbed hose shank. Built for high-pressure, large-diameter fire hose applications including trunk mains, ladder monitors and hydrant boosters.",
    category: "Fire Industry",
    industry: "Fire Industry",
    heroImage: "/src/assets/fire-industry/4.jpg",
    price: null,
    specs: [
      "Product Type: Fire Hose Coupling Component — Heavy Duty",
      "Material: Malleable Cast Iron / SG Iron",
      "Manufacturing Process: Shell Mould Casting",
      "Finish: As-Cast Grey Iron",
      "Key Application: Trunk mains, hydrant boosters, ladder monitors",
      "Feature: Extended shank for high pull-out resistance, ISI-marked",
      "Standard Compliance: IS 903 Fire Hose Couplings",
    ],
  },
  {
    id: "fire-005",
    slug: "fire-female-coupling-lug-isi",
    name: "Female Instantaneous Coupling with Hose Tail — Lug Base (ISI Marked)",
    shortDescription:
      "Mid-size female instantaneous coupling with integrated hose tail and two-lug quick-release base. The lug-type bayonet design allows single-hand coupling and uncoupling under field conditions.",
    category: "Fire Industry",
    industry: "Fire Industry",
    heroImage: "/src/assets/fire-industry/5.jpg",
    price: null,
    specs: [
      "Product Type: Fire Hose Coupling Component",
      "Material: Malleable Cast Iron",
      "Manufacturing Process: Shell Mould Casting",
      "Finish: As-Cast Grey Iron",
      "Key Application: Mid-size fire hose assemblies, portable fire-fighting",
      "Feature: Single-hand 2-lug coupling, integrated hose tail",
      "Standard Compliance: IS 903 Fire Hose Couplings",
    ],
  },
  {
    id: "fire-006",
    slug: "fire-precision-male-coupling-ss",
    name: "Precision Machined Male Coupling with Threaded Shank (SS/Cast)",
    shortDescription:
      "Premium precision-machined male instantaneous coupling with a threaded hose shank and mirror-polished mating surfaces. Ideal for premium fire-fighting equipment, offshore fire systems and export-grade hose assemblies.",
    category: "Fire Industry",
    industry: "Fire Industry",
    heroImage: "/src/assets/fire-industry/6.jpg",
    price: null,
    specs: [
      "Product Type: Fire Hose Coupling — Precision Machined",
      "Material: Cast Iron Body + Stainless Steel (SS304) Shank",
      "Manufacturing Process: Shell Mould Casting + CNC Precision Machining",
      "Finish: As-Cast Iron Body + Precision Machined SS Shank",
      "Key Application: Premium fire-fighting, offshore systems, export-grade assemblies",
      "Feature: Corrosion-resistant SS shank, tight tolerances, mirror finish",
    ],
  },
];

// ─── Power Plant (3 products) ─────────────────────────────────────────────────
const powerPlantProducts: Product[] = [
  {
    id: "power-001",
    slug: "power-camshaft-support-bracket",
    name: "Camshaft Support / Cylinder Head Bracket — Multi-Bore",
    shortDescription:
      "Heavy-duty elongated cast iron support bracket and camshaft carrier with seven precision counter-bored holes in-line and lateral mounting tabs. Used in power plant auxiliary engines, compressors and turbine governor systems.",
    category: "Power Plant",
    industry: "Power Plant",
    heroImage: "/src/assets/power-plant/1.jpg",
    price: null,
    specs: [
      "Product Type: Engine / Turbine Support Component",
      "Material: Cast Iron (FG 260 / Alloy Iron)",
      "Manufacturing Process: Shell Mould Casting",
      "Finish: As-Cast Grey Iron — Machined Bores",
      "Key Application: Camshaft carriers, valve train support in auxiliary power plant engines",
      "Feature: Multi-bore precision casting, vibration-resistant",
    ],
  },
  {
    id: "power-002",
    slug: "power-coal-mill-hammer-bar",
    name: "Coal Mill Hammer Bar / Crusher Wear Block",
    shortDescription:
      "Precision-cast rectangular hammer bar and crusher wear block for coal mill and pulveriser applications in thermal power stations. Cast in high-hardness alloy iron (60–65 HRC) to resist abrasive wear inherent in coal crushing.",
    category: "Power Plant",
    industry: "Power Plant",
    heroImage: "/src/assets/power-plant/2.jpg",
    price: null,
    specs: [
      "Product Type: Wear / Crusher Component",
      "Material: High-Chromium / Alloy Cast Iron (60–65 HRC)",
      "Manufacturing Process: Shell Mould Casting",
      "Finish: As-Cast Alloy Iron",
      "Key Application: Coal mills, pulverisers, thermal power stations",
      "Feature: High-hardness wear resistance, multi-bore pin attachment",
    ],
  },
  {
    id: "power-003",
    slug: "power-grate-bar-ckp",
    name: "Grate Bar / Stoker Bar — CKP Grade (Pair)",
    shortDescription:
      "Heavy-duty ribbed grate bar manufactured to CKP specification, supplied in matched pairs. The parallel ridge profile increases burning surface area, promotes uniform air distribution and resists thermal warping during continuous combustion in chain grate and travelling grate boilers.",
    category: "Power Plant",
    industry: "Power Plant",
    heroImage: "/src/assets/power-plant/3.jpg",
    price: null,
    specs: [
      "Product Type: Combustion / Boiler Component",
      "Grade / Marking: CKP (cast-in specification marking)",
      "Material: Heat-Resistant Cast Iron / Alloy Iron (up to 900°C)",
      "Manufacturing Process: Shell Mould Casting",
      "Finish: As-Cast with Anti-Rust Paint",
      "Key Application: Chain grate, travelling grate, and fixed grate boilers",
      "Feature: Ribbed surface for air distribution, thermal warp resistance",
    ],
  },
];

// ─── Railway (3 products) ──────────────────────────────────────────────────────
const railwayProducts: Product[] = [
  {
    id: "railway-001",
    slug: "railway-rail-clip-hook-bolt",
    name: "Rail Clip / Hook Bolt — Z-Type Track Fastening",
    shortDescription:
      "Z-profile cast iron rail clip and hook bolt for track fastening to sleepers and tie plates. The Z-shaped geometry provides spring-loaded clamp force on the rail foot, absorbing dynamic train loads and preventing rail creep.",
    category: "Railway",
    industry: "Railway",
    heroImage: "/src/assets/railway/1.jpg",
    price: null,
    specs: [
      "Product Type: Track Fastening Component",
      "Material: Cast Iron / Ductile Iron (IS 1367)",
      "Manufacturing Process: Shell Mould Casting",
      "Finish: As-Cast / Hot-Dip Galvanised",
      "Key Application: Rail-to-sleeper fastening, anti-creep rail clips",
      "Feature: Z-profile spring clamp action, anti-creep, mounting hole",
      "Standard Compliance: IRS / RDSO Railway Standards",
    ],
  },
  {
    id: "railway-002",
    slug: "railway-hook-bolt-fishplate",
    name: "Rail Hook Bolt / Fishplate Fastening Lever",
    shortDescription:
      "Long flat-bar hook bolt and fishplate fastening lever with a clevis / forked foot and two fastening holes at the blade end. Used for joining rail sections via fishplates and securing track components in heavy-haul and mainline railway applications.",
    category: "Railway",
    industry: "Railway",
    heroImage: "/src/assets/railway/2.jpg",
    price: null,
    specs: [
      "Product Type: Rail Joining / Fastening Component",
      "Material: Cast Iron / Alloy Steel",
      "Manufacturing Process: Shell Mould Casting",
      "Finish: As-Cast / Anti-Corrosion Coated",
      "Key Application: Fishplate fastening, rail joint locking, heavy-haul track",
      "Feature: Clevis fork for positive interlock, dual bolt holes",
      "Standard Compliance: IRS / RDSO Railway Standards",
    ],
  },
  {
    id: "railway-003",
    slug: "railway-rail-anchor-y-fork",
    name: "Rail Anchor / Tie Plate Clip — Y-Fork Type",
    shortDescription:
      "Y-fork profile rail anchor and tie plate clip designed to prevent longitudinal rail movement under dynamic train loads. The forked toe engages the underside of the rail foot and tie plate flange simultaneously, providing bi-directional anti-creep restraint.",
    category: "Railway",
    industry: "Railway",
    heroImage: "/src/assets/railway/3.jpg",
    price: null,
    specs: [
      "Product Type: Track Anti-Creep Component",
      "Material: Cast Iron / Ductile Iron",
      "Manufacturing Process: Shell Mould Casting",
      "Finish: As-Cast Dark Iron",
      "Key Application: Rail anti-creep anchors, tie plate clips on heavy-haul routes",
      "Feature: Bi-directional restraint, hammer-drive installation",
      "Standard Compliance: IRS / RDSO Railway Standards",
    ],
  },
];

// ─── Combined Export ───────────────────────────────────────────────────────────
export const staticProducts: Product[] = [
  ...pumpProducts,
  ...generalEngineeringProducts,
  ...fireIndustryProducts,
  ...powerPlantProducts,
  ...railwayProducts,
];

// Get all unique categories in display order
export const getCategories = (): string[] => {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const p of staticProducts) {
    if (!seen.has(p.category)) {
      seen.add(p.category);
      result.push(p.category);
    }
  }
  return result;
};

// Get products by category
export const getProductsByCategory = (category: string): Product[] => {
  if (category === "All") return staticProducts;
  return staticProducts.filter((p) => p.category === category);
};

// Get product by slug
export const getProductBySlug = (slug: string): Product | undefined =>
  staticProducts.find((p) => p.slug === slug);
