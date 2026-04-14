import * as React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, CheckCircle, Factory, Award, Cpu, Thermometer,
  ScanLine, Wrench, Shield, Phone, Mail, MapPin, Zap,
  Layers, Settings, PackageCheck, FlaskConical, Ruler
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
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export function InfrastructurePage() {
  const facilities = [
    {
      icon: <Factory className="h-8 w-8" />,
      title: "Shell Moulding Shop",
      description: "Our core shell moulding facility houses multiple automatic shell moulding machines with precise temperature and cycle-time control for consistent, high-volume output.",
      specs: [
        "6 automatic shell moulding machines — capacity 50–1,500g shells",
        "Pattern pre-heating ovens with ±5°C accuracy",
        "Pneumatic shell ejection systems for damage-free release",
        "Dedicated core-making stations with cold-box process",
      ],
      color: "#0b3d91",
    },
    {
      icon: <Thermometer className="h-8 w-8" />,
      title: "Melting & Pouring Bay",
      description: "Multiple induction furnaces with controlled melting environment for a broad range of ferrous and non-ferrous alloys — from SS 304 to ductile iron.",
      specs: [
        "5 medium-frequency induction furnaces (100–500 kg capacity each)",
        "Pour temperature monitoring with pyrometers at ladle stage",
        "Automated pouring systems for high-volume repetitive components",
        "Dedicated charging area with accurate weigh-batching",
      ],
      color: "#d32f2f",
    },
    {
      icon: <FlaskConical className="h-8 w-8" />,
      title: "Quality Testing Laboratory",
      description: "A fully equipped in-house laboratory for chemical, mechanical, and dimensional analysis — enabling real-time decisions, no waiting for external labs.",
      specs: [
        "Optical Emission Spectrometer (OES) for alloy verification",
        "Universal Testing Machine (UTM) for tensile and yield strength",
        "Hardness testers: Brinell, Rockwell, Vickers",
        "Roughness tester for surface finish measurement",
        "Pressure testing equipment for castings up to 50 bar",
      ],
      color: "#0b3d91",
    },
    {
      icon: <Cpu className="h-8 w-8" />,
      title: "CNC Machining Centre",
      description: "Modern CNC turning and machining centres for complete casting-to-machined-component solutions — eliminating the need for outsourced machining operations.",
      specs: [
        "8 CNC turning centres with live tooling capability",
        "4-axis VMC for complex prismatic component machining",
        "Boring machines and radial drill presses for secondary ops",
        "Standard tooling and fixtures for repeat production runs",
        "Component capacity up to 800 mm diameter / 600 mm length",
      ],
      color: "#d32f2f",
    },
    {
      icon: <ScanLine className="h-8 w-8" />,
      title: "Inspection & Metrology",
      description: "Precision inspection infrastructure to verify every casting against drawing specifications before dispatch — zero escapes, zero surprises.",
      specs: [
        "Coordinate Measuring Machine (CMM) for 3D dimensional analysis",
        "Height gauges, vernier callipers, bore gauges, plug gauges",
        "Profile projectors for contour measurement",
        "Magnetic Particle Inspection (MPI) and Dye Penetrant (DPI) equipment",
        "Ultrasonics (UT) equipment for internal defect detection",
      ],
      color: "#0b3d91",
    },
    {
      icon: <Wrench className="h-8 w-8" />,
      title: "Fettling & Finishing Shop",
      description: "Dedicated post-casting finishing area for gate removal, shot blasting, and pre-paint treatments — ensuring clean, ready-to-use castings.",
      specs: [
        "Omega shot blasting machine for consistent surface finish",
        "Pneumatic grinding and linishing stations",
        "Controlled heat treatment furnaces (up to 1,100°C)",
        "Passivation and pickling tanks for stainless steel grades",
        "Deburring, anti-rust treatment, and packing area",
      ],
      color: "#d32f2f",
    },
  ];

  const overallStats = [
    { value: "50,000+", label: "Total Facility Area", icon: <Factory className="h-6 w-6" /> },
    { value: "5,000+ MT", label: "Annual Casting Capacity", icon: <Layers className="h-6 w-6" /> },
    { value: "200+", label: "Skilled Workforce", icon: <Award className="h-6 w-6" /> },
    { value: "3-shift", label: "Round-the-Clock Operations", icon: <Zap className="h-6 w-6" /> },
  ];

  const certifications = [
    { label: "ISO 9001:2015", desc: "Quality Management System", icon: <Award className="h-7 w-7" /> },
    { label: "GSTIN Registered", desc: "24AAFCN3454D1ZP — Gujarat", icon: <Shield className="h-7 w-7" /> },
    { label: "OES Lab", desc: "In-house spectrometer analysis", icon: <FlaskConical className="h-7 w-7" /> },
    { label: "CMM Equipped", desc: "3D dimensional verification", icon: <Ruler className="h-7 w-7" /> },
    { label: "NDT Ready", desc: "MPI, DPI, UT capabilities", icon: <ScanLine className="h-7 w-7" /> },
    { label: "CNC Machining", desc: "Turn-key casting solutions", icon: <Settings className="h-7 w-7" /> },
  ];

  return (
    <div className="nmc-page">
      <title>Infrastructure & Facility | Precision Casting Plant Rajkot Gujarat | Nucleus Metal Cast</title>
      <meta name="description" content="Explore Nucleus Metal Cast's 50,000+ sq. ft. state-of-the-art precision casting facility in Rajkot, Gujarat. Shell moulding shop, induction furnaces, CNC machining, CMM inspection — ISO 9001:2015 certified." />
      <meta name="keywords" content="casting facility Rajkot, foundry infrastructure Gujarat India, shell moulding plant, induction furnace foundry, CNC machining casting, quality lab foundry India, CMM inspection casting" />

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="nmc-page-hero nmc-page-hero--blue">
        <div className="nmc-page-hero-bg-pattern" />
        <div className="nmc-container nmc-page-hero-inner">
          <AnimateIn>
            <div className="nmc-eyebrow nmc-eyebrow--light">Our Manufacturing Facility</div>
            <h1 className="nmc-page-hero-title">
              <span className="nmc-hero-accent">Precision Manufacturing Power</span>
            </h1>
            <p className="nmc-page-hero-subtitle">
              Our Rajkot facility is purpose-built for precision shell mould casting — every department, from the melting bay to the quality lab, is designed to deliver consistent, zero-defect castings at scale. Come see it for yourself.
            </p>
            <div className="nmc-hero-actions">
              <Link to="/contact">
                <button className="nmc-btn-amber">
                  Schedule a Factory Visit <ArrowRight className="h-5 w-5" />
                </button>
              </Link>
              <Link to="/process">
                <button className="nmc-btn-outline-white">View Process</button>
              </Link>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ── OVERALL STATS ────────────────────────────────────────────── */}
      <section className="nmc-stats-bar">
        <div className="nmc-container nmc-stats-grid">
          {overallStats.map((s, i) => (
            <div key={i} className="nmc-stat-card">
              <div className="nmc-stat-icon">{s.icon}</div>
              <div className="nmc-stat-value">{s.value}</div>
              <div className="nmc-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FACILITY OVERVIEW ────────────────────────────────────────── */}
      <section className="nmc-section nmc-section--light">
        <div className="nmc-container">
          <div className="nmc-section-header">
            <div className="nmc-eyebrow">Facility Layout</div>
            <h2 className="nmc-section-title">Six Specialist Manufacturing Zones</h2>
            <p className="nmc-section-subtitle">
              Our facility is organised into six dedicated operational zones — each optimised for its specific function in the casting production process, with seamless material flow between departments.
            </p>
          </div>
          <div className="nmc-infra-grid">
            {facilities.map((fac, i) => (
              <AnimateIn key={i} delay={i * 60}>
                <div className="nmc-infra-card" style={{ "--accent": fac.color } as React.CSSProperties}>
                  <div className="nmc-infra-card-header">
                    <div className="nmc-infra-icon-wrap">{fac.icon}</div>
                    <div>
                      <h3 className="nmc-infra-title">{fac.title}</h3>
                                          </div>
                  </div>
                  <p className="nmc-infra-desc">{fac.description}</p>
                  <ul className="nmc-infra-specs">
                    {fac.specs.map((spec, si) => (
                      <li key={si}>
                        <CheckCircle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" style={{ color: fac.color }} />
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── CERTIFICATIONS & ACCREDITATIONS ─────────────────────────── */}
      <section className="nmc-section nmc-section--dark-gradient">
        <div className="nmc-container">
          <div className="nmc-section-header">
            <div className="nmc-eyebrow nmc-eyebrow--light">Certifications & Capabilities</div>
            <h2 className="nmc-section-title nmc-title--white">Verified Quality, Recognised Credentials</h2>
            <p className="nmc-section-subtitle nmc-subtitle--muted">
              Our facility's certifications and in-house capabilities give our clients the confidence to trust Nucleus Metal Cast with their most critical components.
            </p>
          </div>
          <div className="nmc-cert-grid">
            {certifications.map((cert, i) => (
              <AnimateIn key={i} delay={i * 70}>
                <div className="nmc-cert-card">
                  <div className="nmc-cert-icon">{cert.icon}</div>
                  <div className="nmc-cert-label">{cert.label}</div>
                  <div className="nmc-cert-desc">{cert.desc}</div>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── TECHNOLOGY HIGHLIGHT ─────────────────────────────────────── */}
      <section className="nmc-section nmc-section--white">
        <div className="nmc-container">
          <div className="nmc-two-col">
            <AnimateIn>
              <div className="nmc-eyebrow">Technology Investment</div>
              <h2 className="nmc-section-title">Built for Precision. Invested in the Future.</h2>
              <p className="nmc-body-text" style={{ marginBottom: "1.5rem" }}>
                Nucleus Metal Cast continuously invests in equipment upgrades and technology adoption. Our commitment is to ensure that every casting manufactured at our facility benefits from the latest advances in foundry science and quality control.
              </p>
              <div className="nmc-tech-list">
                {[
                  { icon: <Thermometer className="h-5 w-5" />, label: "Induction Melting", desc: "Consistent melt quality, energy efficient, controllable chemistry" },
                  { icon: <FlaskConical className="h-5 w-5" />, label: "OES Spectrometry", desc: "Full alloy verification — every heat, every pour, no exceptions" },
                  { icon: <Cpu className="h-5 w-5" />, label: "CNC Precision Machining", desc: "Tight tolerances, complex features, all under one roof" },
                  { icon: <ScanLine className="h-5 w-5" />, label: "CMM Inspection", desc: "3D dimensional accuracy verified to micron-level precision" },
                  { icon: <PackageCheck className="h-5 w-5" />, label: "Traceability Systems", desc: "Full batch and heat traceability from raw material to dispatch" },
                ].map((tech, i) => (
                  <div key={i} className="nmc-tech-item">
                    <div className="nmc-tech-item-icon">{tech.icon}</div>
                    <div>
                      <div className="nmc-tech-item-label">{tech.label}</div>
                      <div className="nmc-tech-item-desc">{tech.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </AnimateIn>
            <AnimateIn delay={150}>
              <div className="nmc-visit-panel">
                <div className="nmc-visit-panel-inner">
                  <Factory className="h-14 w-14 text-amber-400 mx-auto mb-4" />
                  <h3 className="nmc-visit-title">Visit Our Facility</h3>
                  <p className="nmc-visit-text">
                    We welcome prospective clients to visit our Rajkot facility and see our manufacturing process first-hand. Schedule a factory tour to experience our capabilities directly.
                  </p>
                  <div className="nmc-visit-details">
                    <div className="nmc-visit-row">
                      <MapPin className="h-4 w-4 text-amber-400" />
                      <span>Rajkot, Gujarat — 360 xxx</span>
                    </div>
                    <div className="nmc-visit-row">
                      <Phone className="h-4 w-4 text-amber-400" />
                      <a href="tel:+919825343585">+91 98253 43585</a>
                    </div>
                    <div className="nmc-visit-row">
                      <Mail className="h-4 w-4 text-amber-400" />
                      <a href="mailto:info@nucleusmetalcast.com">info@nucleusmetalcast.com</a>
                    </div>
                  </div>
                  <Link to="/contact">
                    <button className="nmc-btn-amber" style={{ width: "100%", marginTop: "1.5rem", justifyContent: "center" }}>
                      Book a Factory Tour <ArrowRight className="h-5 w-5" />
                    </button>
                  </Link>
                </div>
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────── */}
      <section className="nmc-cta-band">
        <div className="nmc-container nmc-cta-inner">
          <div className="nmc-cta-text">
            <h2 className="nmc-cta-title">Ready to Partner with Us?</h2>
            <p className="nmc-cta-subtitle">Our facility is ready to handle your casting requirements — from single prototype to full-scale production. Let's start the conversation.</p>
          </div>
          <div className="nmc-cta-actions">
            <Link to="/contact">
              <button className="nmc-btn-dark">
                Request a Quote <ArrowRight className="h-5 w-5" />
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
