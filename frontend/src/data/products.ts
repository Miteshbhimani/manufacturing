export interface Product {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  category: string;
  industry: string;
  heroImage: string;
  price: null, // Price on enquiry only
  specs?: string[];
  has3D?: boolean;
  images360?: {
    front: string;
    back: string;
    left: string;
    right: string;
    top: string;
    bottom: string;
  };
}

export const mockProducts: Product[] = [
  {
    id: "real-prod-1",
    slug: "submersible-motor-base-ss304",
    name: "Submersible Motor Base – SS 304",
    shortDescription: "Critical structural component for submersible pumps designed for durability in corrosive environments.",
    category: "Submersible Components",
    industry: "Water & Chemical",
    heroImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=80",
    price: null,
    images360: {
      front: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=80",
      back: "https://images.unsplash.com/photo-1453728106915-7163ad373e10?auto=format&fit=crop&w=1000&q=80",
      left: "https://images.unsplash.com/photo-1580983546059-ad2058c49e7a?auto=format&fit=crop&w=1000&q=80",
      right: "https://images.unsplash.com/photo-1565034940-3b9660284f44?auto=format&fit=crop&w=1000&q=80",
      top: "https://images.unsplash.com/photo-1517245386807-6c5e987665a5?auto=format&fit=crop&w=1000&q=80",
      bottom: "https://images.unsplash.com/photo-1518548414154-0839269903b6?auto=format&fit=crop&w=1000&q=80"
    },
    specs: [
      "Material: Stainless Steel SS 304",
      "Corrosion Resistance: High (Water, Chemicals, Moisture)",
      "Magnetic Property: Non-magnetic (Annealed)",
      "Structure: High-precision alignment support"
    ]
  },
  {
    id: "real-prod-2",
    slug: "precision-pump-impeller-ss316",
    name: "High-Efficiency Pump Impeller (SS 316)",
    shortDescription: "Precision investment cast SS 316 impeller for superior fluid dynamics and corrosion resistance.",
    category: "Submersible Components",
    industry: "Water Management",
    heroImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=80",
    price: null,
    images360: {
      front: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=80",
      back: "https://images.unsplash.com/photo-1453728106915-7163ad373e10?auto=format&fit=crop&w=1000&q=80",
      left: "https://images.unsplash.com/photo-1580983546059-ad2058c49e7a?auto=format&fit=crop&w=1000&q=80",
      right: "https://images.unsplash.com/photo-1565034940-3b9660284f44?auto=format&fit=crop&w=1000&q=80",
      top: "https://images.unsplash.com/photo-1517245386807-6c5e987665a5?auto=format&fit=crop&w=1000&q=80",
      bottom: "https://images.unsplash.com/photo-1518548414154-0839269903b6?auto=format&fit=crop&w=1000&q=80"
    },
    specs: [
      "Material: CF8M (SS 316) Stainless Steel",
      "Type: Closed / Semi-Open / Open available",
      "Process: Precision Shell Moulding",
      "Application: Chemical & Industrial Pumps"
    ]
  },
  {
    id: "real-prod-3",
    slug: "submersible-pump-diffuser",
    name: "Stage Diffuser for Submersible Units",
    shortDescription: "Heavy-duty stage diffuser designed for multistage submersible pumps with zero-vibration assembly.",
    category: "Submersible Components",
    industry: "Agriculture & Mining",
    heroImage: "https://images.unsplash.com/photo-1517245386807-6c5e987665a5?auto=format&fit=crop&w=1000&q=80",
    price: null,
    specs: [
      "Material: SS 304 / SS 316 Cast Steel",
      "Design: Optimized Vane Geometry",
      "Process: Resin-Coated Sand Casting",
      "Feature: Wear-resistant smooth finish"
    ]
  },
  {
    id: "real-prod-4",
    slug: "pump-discharge-suction-case",
    name: "Discharge & Suction Case Set",
    shortDescription: "Matched set of suction and discharge cases for high-pressure vertical submersible pumps.",
    category: "Submersible Components",
    industry: "Industrial Water Supply",
    heroImage: "https://images.unsplash.com/photo-1518548414154-0839269903b6?auto=format&fit=crop&w=1000&q=80",
    price: null,
    specs: [
      "Material: Alloy Steel / Stainless Steel",
      "Standard: ISO 9001:2015 Compliant",
      "Process: 11-Step Shell Moulding",
      "Durability: Pressure tested to 40+ Bar"
    ]
  },
  {
    id: "gen-eng-1",
    slug: "general-engineering-component",
    name: "General Engineering Component",
    shortDescription: "Precision manufactured component for general engineering applications.",
    category: "General Engineering Parts",
    industry: "General Manufacturing",
    heroImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=80",
    price: null,
    specs: ["Material: Alloy Steel", "Process: CNC Machining"]
  },
  {
    id: "pump-part-1",
    slug: "industrial-pump-housing",
    name: "Industrial Pump Housing",
    shortDescription: "Heavy-duty pump housing for industrial fluid transfer.",
    category: "Pump Parts",
    industry: "Fluid Dynamics",
    heroImage: "https://images.unsplash.com/photo-1580983546059-ad2058c49e7a?auto=format&fit=crop&w=1000&q=80",
    price: null,
    specs: ["Material: Cast Iron", "Durability: High Pressure"]
  },
  {
    id: "railway-part-1",
    slug: "railway-suspension-component",
    name: "Railway Suspension Component",
    shortDescription: "High-strength suspension parts for railway locomotives and carriages.",
    category: "Railway Equipment Parts",
    industry: "Transportation",
    heroImage: "https://images.unsplash.com/photo-1473625247510-8eceb153094d?auto=format&fit=crop&w=1000&q=80",
    price: null,
    specs: ["Material: High Carbon Steel", "Standard: Railway Safety API"]
  },
  {
    id: "fire-part-1",
    slug: "fire-hydrant-valve",
    name: "Fire Hydrant Valve",
    shortDescription: "Reliable and durable valves for fire safety and suppression systems.",
    category: "Fire industry parts",
    industry: "Safety & Security",
    heroImage: "https://images.unsplash.com/photo-1621535497270-22c608f10842?auto=format&fit=crop&w=1000&q=80",
    price: null,
    specs: ["Material: Brass / Bronze", "Pressure Rating: 300 PSI"]
  },
  {
    id: "power-part-1",
    slug: "turbine-blade-base",
    name: "Turbine Blade Base",
    shortDescription: "High-temperature resistant base for power generation turbines.",
    category: "Powerplant parts",
    industry: "Energy",
    heroImage: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=1000&q=80",
    price: null,
    specs: ["Material: Titanium Alloy", "Heat Resistance: Up to 1200°C"]
  }
];
