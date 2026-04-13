import * as React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, CheckCircle, Zap, Target, Award, Settings,
  Cpu, Thermometer, Droplets, Hammer, Wrench, Phone, Mail,
  MapPin, FlaskConical, Layers, ScanLine, PackageCheck
} from "lucide-react";

function useInView(threshold = 0.15) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [inView, setInView] = React.useState(false);
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function AnimateIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, inView } = useInView(0.05);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    // Fallback: if IntersectionObserver fails to trigger within 2 seconds, force show
    const timer = setTimeout(() => setMounted(true), 1500 + delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const isVisible = inView || mounted;

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}


export function ProcessPage() {
  const [activeStep, setActiveStep] = React.useState<number | null>(null);

  const processSteps = [
    {
      step: "01",
      title: "Pattern Design & Development",
      description: "Precision CAD modelling, in-house metal pattern manufacturing, and sample trial validation before production begins.",
      icon: <Target className="h-7 w-7" />,
      details: [
        "3D CAD design tailored to customer drawings and tolerances",
        "High-durability steel patterns manufactured in our tool room",
        "Trial samples inspected with CMM for dimensional sign-off",
        "Pattern lifecycle tracked — inspected every 100 production cycles",
      ],
      color: "#0b3d91",
    },
    {
      step: "02",
      title: "Pattern Preparation",
      description: "Surface treatment, pre-heating, and precise pattern positioning to ensure repeatable shell quality.",
      icon: <Settings className="h-7 w-7" />,
      details: [
        "Release agent applied for consistent shell separation",
        "Patterns pre-heated to 180–220°C before sand application",
        "Alignment jigs ensure accurate mould-half positioning",
      ],
      color: "#d32f2f",
    },
    {
      step: "03",
      title: "Sand Preparation",
      description: "High-silica sand coated with phenol-formaldehyde resin for optimal strength, permeability, and surface finish.",
      icon: <Droplets className="h-7 w-7" />,
      details: [
        "AFS-grade silica sand with controlled grain size distribution",
        "Thermosetting resin coating for rigid shell properties",
        "Moisture and temperature monitoring at 25–30°C",
        "Sand mix quality tested every shift",
      ],
      color: "#0b3d91",
    },
    {
      step: "04",
      title: "Shell Formation",
      description: "Resin-coated sand applied to the heated pattern to build a thin, rigid shell of 6–8 mm thickness.",
      icon: <Layers className="h-7 w-7" />,
      details: [
        "Multiple sand layers applied at 200–250°C pattern temperature",
        "Shell thickness maintained at 6–8 mm for strength",
        "Curing time precisely controlled per alloy specification",
      ],
      color: "#d32f2f",
    },
    {
      step: "05",
      title: "Shell Removal & Inspection",
      description: "Shells carefully separated from patterns and subjected to visual and dimensional quality inspection.",
      icon: <ScanLine className="h-7 w-7" />,
      details: [
        "Pneumatic ejection for clean, damage-free shell release",
        "100% visual inspection of every shell half",
        "Wall thickness gauging at 4+ measurement points",
        "Rejected shells tracked and root-caused for improvement",
      ],
      color: "#0b3d91",
    },
    {
      step: "06",
      title: "Core Assembly",
      description: "Sand cores for internal cavities produced and precisely positioned within the shell halves.",
      icon: <Cpu className="h-7 w-7" />,
      details: [
        "Cores produced using cold-box or shell-core processes",
        "Core dimensional check against drawing before assembly",
        "Adhesive bonding prevents core shift during pouring",
      ],
      color: "#d32f2f",
    },
    {
      step: "07",
      title: "Mould Assembly",
      description: "Cope and drag shell halves assembled, clamped, and backed with steel shot or sand for support during pouring.",
      icon: <Hammer className="h-7 w-7" />,
      details: [
        "Precise cope-drag alignment using dowel pin system",
        "Mechanical clamping prevents parting-line flash",
        "Gating and riser system pre-integrated at design stage",
      ],
      color: "#0b3d91",
    },
    {
      step: "08",
      title: "Metal Melting & Preparation",
      description: "Charge mix calculated, melted in induction furnaces, and chemical composition verified via optical emission spectrometry.",
      icon: <Thermometer className="h-7 w-7" />,
      details: [
        "Induction furnace melting under controlled conditions",
        "OES spectrometer analysis — every heat verified before pouring",
        "Precise alloy adjustment to meet customer material spec",
        "Slag removal and degassing for clean metal",
      ],
      color: "#d32f2f",
    },
    {
      step: "09",
      title: "Metal Pouring",
      description: "Liquid metal poured at precise temperature with controlled flow rate to prevent turbulence and defects.",
      icon: <Zap className="h-7 w-7" />,
      details: [
        "Pour temperature controlled ±10°C per alloy specification",
        "Pouring time and speed optimised per mould design",
        "PPE-compliant, safety-first pouring environment",
      ],
      color: "#0b3d91",
    },
    {
      step: "10",
      title: "Cooling & Shakeout",
      description: "Controlled cooling ensures optimal material microstructure; castings are shaken out and heat-treated when required.",
      icon: <Wrench className="h-7 w-7" />,
      details: [
        "Cooling curves designed per alloy and section thickness",
        "Mechanical shakeout for sand removal",
        "Heat treatment (annealing, normalising, hardening) as required",
      ],
      color: "#d32f2f",
    },
    {
      step: "11",
      title: "Finishing, Machining & QC",
      description: "Fettling, shot blasting, CNC machining, and comprehensive multi-point inspection before final dispatch.",
      icon: <PackageCheck className="h-7 w-7" />,
      details: [
        "Fettling — remove gates, risers, parting-line flash",
        "Shot blasting for clean, consistent surface finish",
        "CNC machining for critical dimensional features",
        "Final CMM inspection, hardness testing, and documentation",
        "Third-party NDT arranged on customer request",
      ],
      color: "#0b3d91",
    },
  ];

  const materials = [
    {
      category: "Stainless Steel",
      items: ["SS 304 / SS 304L", "SS 316 / SS 316L", "SS 410 / SS 420", "Duplex SS (2205)", "Super Duplex SS (2507)"],
      accent: "#0b3d91",
    },
    {
      category: "Carbon & Alloy Steel",
      items: ["Carbon Steel: EN8, EN9, EN24", "Alloy Steel: EN19, EN31", "Case Hardening Grades: EN36", "High-Manganese Steel"],
      accent: "#d32f2f",
    },
    {
      category: "Cast Iron Grades",
      items: ["Grey Cast Iron (GCI)", "Spheroidal Graphite Iron (SG/Ductile)", "Malleable Cast Iron", "Ni-Hard, Hi-Chrome Iron"],
      accent: "#0b3d91",
    },
    {
      category: "Non-Ferrous Alloys",
      items: ["Aluminium: LM6, LM25", "Bronze: Phosphor Bronze, Gunmetal", "Brass: Leaded & Unleaded", "Custom Special Alloys on Inquiry"],
      accent: "#d32f2f",
    },
  ];

  const capabilities = [
    { title: "Weight Range", value: "100g – 50 kg", desc: "Per casting component" },
    { title: "Min Wall Thickness", value: "3 mm", desc: "As-cast achievable" },
    { title: "Linear Tolerance", value: "±0.1 mm", desc: "Precision critical dimensions" },
    { title: "Surface Finish (as-cast)", value: "125–250 Ra", desc: "Machined: 32–63 Ra" },
  ];

  const qualityPoints = [
    "Pattern inspection every 100 production cycles",
    "Shell wall thickness checked at 4+ points per mould",
    "Spectrometer analysis on every heat/melt batch",
    "Pouring temperature logged for every mould",
    "CMM dimensional inspection on finished castings",
    "NDT (UT, MPI, DPI) available on customer specification",
    "Full material and process traceability documentation",
    "Third-party inspection support (TPIA) arranged on request",
  ];

  return (
    <div className="nmc-page">
      <title>Shell Mould Casting Process | 11-Step Precision Manufacturing | Nucleus Metal Cast Rajkot</title>
      <meta name="description" content="Discover Nucleus Metal Cast's 11-step shell mould casting process in Rajkot, Gujarat. Precision casting manufacturing with spectrometer alloy verification, CNC finishing, and ISO 9001:2015 quality control — serving Indian industry." />
      <meta name="keywords" content="shell mould casting process India, precision casting process Gujarat, foundry process Rajkot, metal casting steps, investment casting process, ISO casting manufacturer India, alloy casting process" />

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="nmc-page-hero nmc-page-hero--blue">
        <div className="nmc-page-hero-bg-pattern" />
        <div className="nmc-container nmc-page-hero-inner">
          <AnimateIn>
            <div className="nmc-eyebrow nmc-eyebrow--light">Manufacturing Excellence</div>
            <h1 className="nmc-page-hero-title">
              Our Shell Mould Casting
              <span className="nmc-hero-accent"> Process — 11 Steps to Perfection</span>
            </h1>
            <p className="nmc-page-hero-subtitle">
              At Nucleus Metal Cast, every casting is the result of a rigorously controlled 11-step manufacturing process. From pattern design to final dispatch, each stage is monitored, documented, and optimised to deliver precision castings that Indian manufacturers rely on.
            </p>
            <div className="nmc-hero-actions">
              <Link to="/contact">
                <button className="nmc-btn-amber">
                  Get Technical Consultation <ArrowRight className="h-5 w-5" />
                </button>
              </Link>
              <Link to="/infrastructure">
                <button className="nmc-btn-outline-white">View Our Facility</button>
              </Link>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ── WHAT IS SHELL MOULD CASTING ─────────────────────────────── */}
      <section className="nmc-section nmc-section--light">
        <div className="nmc-container">
          <div className="nmc-two-col nmc-two-col--gap-lg">
            <AnimateIn>
              <div className="nmc-eyebrow">About the Process</div>
              <h2 className="nmc-section-title">What is Shell Mould Casting?</h2>
              <p className="nmc-body-text" style={{ marginBottom: "1.25rem" }}>
                Shell mould casting is a precision foundry process in which resin-coated sand is applied to a heated metal pattern to create a thin, rigid shell mould. This advanced technique produces castings with significantly better surface finish, dimensional accuracy, and repeatability compared to conventional green sand casting.
              </p>
              <p className="nmc-body-text" style={{ marginBottom: "1.75rem" }}>
                It is the process of choice for India's pump manufacturers, automotive OEM suppliers, and general engineering industries — where consistent quality and tighter tolerances are non-negotiable.
              </p>
              <div className="nmc-advantage-list">
                {[
                  "Superior surface finish: 125–250 Ra (as cast) vs 500+ Ra in green sand",
                  "Higher dimensional accuracy: ±0.1mm linear tolerance achievable",
                  "Complex geometries: thin walls, undercuts, and intricate features possible",
                  "Wide alloy range: ferrous and non-ferrous grades supported",
                  "Faster cycle times: ideal for medium- to high-volume production runs",
                ].map((adv, i) => (
                  <div key={i} className="nmc-advantage-item">
                    <CheckCircle className="nmc-check-icon nmc-check-icon--green" />
                    <span>{adv}</span>
                  </div>
                ))}
              </div>
            </AnimateIn>
            <AnimateIn delay={150}>
              <div className="nmc-capability-panel">
                <h3 className="nmc-capability-panel-title">Process Capabilities at a Glance</h3>
                <div className="nmc-capability-grid">
                  {capabilities.map((c, i) => (
                    <div key={i} className="nmc-capability-stat">
                      <div className="nmc-capability-value">{c.value}</div>
                      <div className="nmc-capability-label">{c.title}</div>
                      <div className="nmc-capability-desc">{c.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* ── 11-STEP PROCESS ─────────────────────────────────────────── */}
      <section className="nmc-section nmc-section--white">
        <div className="nmc-container">
          <div className="nmc-section-header">
            <div className="nmc-eyebrow">Step-by-Step</div>
            <h2 className="nmc-section-title">Our 11-Step Manufacturing Process</h2>
            <p className="nmc-section-subtitle">Click any step to see detailed process notes. Each stage has built-in quality checkpoints that uphold our ISO 9001:2015 standards.</p>
          </div>
          <div className="nmc-process-grid">
            {processSteps.map((step, i) => (
              <AnimateIn key={i} delay={i * 40}>
                <div
                  className={`nmc-process-card ${activeStep === i ? "nmc-process-card--active" : ""}`}
                  style={{ "--step-accent": step.color } as React.CSSProperties}
                  onClick={() => setActiveStep(activeStep === i ? null : i)}
                >
                  <div className="nmc-process-card-header">
                    <div className="nmc-process-num">{step.step}</div>
                    <div className="nmc-process-icon">{step.icon}</div>
                  </div>
                  <h3 className="nmc-process-title">{step.title}</h3>
                  <p className="nmc-process-desc">{step.description}</p>
                  {activeStep === i && (
                    <ul className="nmc-process-details">
                      {step.details.map((d, di) => (
                        <li key={di}>
                          <CheckCircle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" style={{ color: step.color }} />
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="nmc-process-toggle">
                    {activeStep === i ? "Show less ↑" : "Details ↓"}
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── MATERIAL CAPABILITIES ───────────────────────────────────── */}
      <section className="nmc-section nmc-section--light">
        <div className="nmc-container">
          <div className="nmc-section-header">
            <div className="nmc-eyebrow">Material Expertise</div>
            <h2 className="nmc-section-title">Alloys & Materials We Cast</h2>
            <p className="nmc-section-subtitle">Our multi-furnace facility handles a wide range of ferrous and non-ferrous alloys — all verified by in-house spectrometer analysis.</p>
          </div>
          <div className="nmc-material-grid">
            {materials.map((mat, i) => (
              <AnimateIn key={i} delay={i * 80}>
                <div className="nmc-material-card-full" style={{ "--accent": mat.accent } as React.CSSProperties}>
                  <div className="nmc-material-card-header">
                    <FlaskConical className="h-6 w-6" />
                    <h3 className="nmc-material-cat-title">{mat.category}</h3>
                  </div>
                  <ul className="nmc-material-list">
                    {mat.items.map((item, ii) => (
                      <li key={ii}>
                        <CheckCircle className="h-4 w-4 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUALITY CONTROL ─────────────────────────────────────────── */}
      <section className="nmc-section nmc-section--dark-gradient">
        <div className="nmc-container">
          <div className="nmc-two-col">
            <AnimateIn>
              <div className="nmc-eyebrow nmc-eyebrow--light">Quality Management</div>
              <h2 className="nmc-section-title nmc-title--white">Quality is Built Into Every Step</h2>
              <p className="nmc-body-text nmc-body-text--muted" style={{ marginBottom: "2rem" }}>
                Our ISO 9001:2015 quality management system is not a final checkpoint — it is integrated throughout every stage of our manufacturing process. From the first pattern inspection to the final CMM measurement, quality is non-negotiable at Nucleus Metal Cast.
              </p>
              <div className="nmc-qc-list">
                {qualityPoints.map((qp, i) => (
                  <div key={i} className="nmc-qc-item">
                    <Award className="nmc-qc-icon" />
                    <span>{qp}</span>
                  </div>
                ))}
              </div>
            </AnimateIn>
            <AnimateIn delay={150}>
              <div className="nmc-qc-panel">
                <div className="nmc-qc-panel-block">
                  <ScanLine className="h-8 w-8 text-amber-400 mb-3" />
                  <h4 className="nmc-qc-block-title">In-Process Inspection</h4>
                  <p className="nmc-qc-block-text">Real-time checks at every critical control point — shell thickness, pour temperature, chemical composition — logged and traceable.</p>
                </div>
                <div className="nmc-qc-panel-block">
                  <Award className="h-8 w-8 text-amber-400 mb-3" />
                  <h4 className="nmc-qc-block-title">Final Acceptance Testing</h4>
                  <p className="nmc-qc-block-text">Dimensional (CMM), mechanical (hardness, tensile), and chemical (OES) testing on finished castings before any shipment.</p>
                </div>
                <div className="nmc-qc-panel-block">
                  <PackageCheck className="h-8 w-8 text-amber-400 mb-3" />
                  <h4 className="nmc-qc-block-title">Full Traceability</h4>
                  <p className="nmc-qc-block-text">Heat number, material cert, inspection report, and dispatch record maintained for every batch. Third-party inspection on request.</p>
                </div>
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* ── APPLICATIONS ────────────────────────────────────────────── */}
      <section className="nmc-section nmc-section--white">
        <div className="nmc-container">
          <div className="nmc-section-header">
            <div className="nmc-eyebrow">Industry Applications</div>
            <h2 className="nmc-section-title">Where Our Castings Go to Work</h2>
            <p className="nmc-section-subtitle">Our castings are trusted across India's core industrial sectors — engineered to perform in demanding real-world conditions.</p>
          </div>
          <div className="nmc-app-grid">
            {[
              {
                icon: <Zap className="h-8 w-8" />,
                title: "Pump & Water Management",
                desc: "Impellers, volute casings, back plates, and diffusers for submersible pumps, centrifugal pumps, and water treatment systems.",
                color: "#0b3d91",
              },
              {
                icon: <Settings className="h-8 w-8" />,
                title: "Automotive & OEM",
                desc: "Engine brackets, gearbox housings, brake components, suspension parts — meeting Indian OEM tolerances and volume requirements.",
                color: "#d32f2f",
              },
              {
                icon: <Cpu className="h-8 w-8" />,
                title: "Industrial Machinery",
                desc: "Valve bodies, pump housings, compressor parts, and heavy engineering components in special alloys for wear resistance.",
                color: "#0b3d91",
              },
              {
                icon: <Hammer className="h-8 w-8" />,
                title: "General Engineering",
                desc: "Agricultural equipment parts, railway fittings, power sector components, and custom engineered solutions for niche industries.",
                color: "#d32f2f",
              },
            ].map((app, i) => (
              <AnimateIn key={i} delay={i * 80}>
                <div className="nmc-app-card" style={{ "--accent": app.color } as React.CSSProperties}>
                  <div className="nmc-app-icon-wrap">{app.icon}</div>
                  <h3 className="nmc-app-title">{app.title}</h3>
                  <p className="nmc-app-desc">{app.desc}</p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────── */}
      <section className="nmc-cta-band">
        <div className="nmc-container nmc-cta-inner">
          <div className="nmc-cta-text">
            <h2 className="nmc-cta-title">Start Your Casting Project Today</h2>
            <p className="nmc-cta-subtitle">Share your drawings or specifications — our process engineers will review and respond within 24 hours with a technical proposal and quote.</p>
          </div>
          <div className="nmc-cta-actions">
            <Link to="/contact">
              <button className="nmc-btn-dark">
                Request Sample Development <ArrowRight className="h-5 w-5" />
              </button>
            </Link>
            <div className="nmc-contact-chips">
              <a href="tel:+919825343585" className="nmc-contact-chip">
                <Phone className="h-4 w-4" /> +91 98253 43585
              </a>
              <a href="mailto:info@nucleusmetalcast.com" className="nmc-contact-chip">
                <Mail className="h-4 w-4" /> info@nucleusmetalcast.com
              </a>
              <span className="nmc-contact-chip">
                <MapPin className="h-4 w-4" /> Rajkot, Gujarat
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ProcessPage;
