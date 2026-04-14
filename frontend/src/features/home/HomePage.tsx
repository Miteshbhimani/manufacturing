import * as React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, Phone, Mail, MapPin, CheckCircle, Award,
  Factory, Shield, Zap, ChevronDown, Star, Globe,
  Clock, Layers, Settings
} from "lucide-react";

/* ─── Animated Counter Hook ─────────────────────────────────────────── */
function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(ease * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

/* ─── Intersection Observer Hook ────────────────────────────────────── */
function useInView(threshold = 0.2) {
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

/* ─── Stat Counter Component ─────────────────────────────────────────── */
function StatCounter({ value, label, suffix = "", prefix = "" }: { value: number; label: string; suffix?: string; prefix?: string }) {
  const { ref, inView } = useInView(0.3);
  const count = useCountUp(value, 2000, inView);
  return (
    <div ref={ref} className="nmc-stat-card">
      <div className="nmc-stat-value">{prefix}{count.toLocaleString()}{suffix}</div>
      <div className="nmc-stat-label">{label}</div>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────── */
export function HomePage() {
  const [heroVisible, setHeroVisible] = React.useState(false);
  const [scrollY, setScrollY] = React.useState(0);

  React.useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 100);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => { clearTimeout(t); window.removeEventListener("scroll", handleScroll); };
  }, []);

  const industries = [
    {
      name: "Pump & Valve Components",
      description: "High-precision impellers, casings, and valve bodies engineered for water management and process industries.",
      icon: <Layers className="nmc-industry-icon" />,
      accent: "#0b3d91",
    },
    {
      name: "Automotive Parts",
      description: "Critical engine brackets, housings, and structural components meeting OEM tolerances for Indian auto manufacturers.",
      icon: <Zap className="nmc-industry-icon" />,
      accent: "#d32f2f",
    },
    {
      name: "Industrial Machinery",
      description: "Robust pump bodies, gearbox housings, and custom engineered castings for heavy manufacturing sectors.",
      icon: <Settings className="nmc-industry-icon" />,
      accent: "#0b3d91",
    },
    {
      name: "General Engineering",
      description: "Versatile casting solutions for agriculture, railway, power, and infrastructure equipment manufacturers.",
      icon: <Factory className="nmc-industry-icon" />,
      accent: "#d32f2f",
    },
  ];

  const qualityFeatures = [
    "Shell mould casting with resin-coated sand technology",
    "ISO 9001:2015 certified quality management system",
    "In-house optical emission spectrometer for alloy verification",
    "CNC machining for critical tolerances & finishing",
    "Non-destructive testing (NDT) for structural integrity",
    "Complete traceability — raw material to final dispatch",
  ];


  return (
    <div className="nmc-page">
      <title>Shell Mould Casting Manufacturer India | Precision Foundry Rajkot Gujarat | Nucleus Metal Cast</title>
      <meta name="description" content="Nucleus Metal Cast — Leading shell mould casting manufacturer in Rajkot, Gujarat. Precision metal castings in SS 304/316, alloy steel & cast iron for automotive, pump, and industrial sectors. ISO 9001:2015 certified. Request a free quote today." />
      <meta name="keywords" content="shell mould casting India, precision casting manufacturer Gujarat, metal casting Rajkot, foundry India, SS 304 casting, pump impeller casting, automotive casting India, ISO certified foundry" />

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section className="nmc-hero" style={{ backgroundPositionY: scrollY * 0.3 }}>
        <div className="nmc-hero-overlay" />
        <div className={`nmc-hero-content ${heroVisible ? "nmc-hero-content--visible" : ""}`}>
          <div className="nmc-hero-badge">
            <Star className="h-3 w-3" /> ISO 9001:2015 Certified &nbsp;•&nbsp; Made in India
          </div>
          <h1 className="nmc-hero-title">
            Precision Shell Mould Casting
            <span className="nmc-hero-accent"> for India's Industry</span>
          </h1>
          <p className="nmc-hero-subtitle">
            From Rajkot's foundry heartland, Nucleus Metal Cast produces superior quality castings in stainless steel, alloy steel, and cast iron — delivering dimensional precision that critical applications demand.
          </p>
          <div className="nmc-hero-actions">
            <Link to="/contact">
              <button className="nmc-btn-primary">
                Get a Free Quote <ArrowRight className="h-5 w-5" />
              </button>
            </Link>
            <Link to="/process">
              <button className="nmc-btn-outline">
                Our Casting Process
              </button>
            </Link>
          </div>
          <div className="nmc-hero-badges">
            <div className="nmc-trust-badge"><CheckCircle className="h-4 w-4 text-amber-400" /> 5,000+ MT Capacity</div>
            <div className="nmc-trust-badge"><CheckCircle className="h-4 w-4 text-amber-400" /> ±0.1mm Tolerance</div>
            <div className="nmc-trust-badge"><CheckCircle className="h-4 w-4 text-amber-400" /> 99.8% On-Time Delivery</div>
          </div>
        </div>
        <button className="nmc-scroll-indicator" onClick={() => window.scrollBy({ top: window.innerHeight, behavior: "smooth" })}>
          <ChevronDown className="h-6 w-6 animate-bounce" />
        </button>
      </section>

      {/* ── STATS BAR ───────────────────────────────────────────────────── */}
      <section className="nmc-stats-bar">
        <div className="nmc-container nmc-stats-grid">
          <StatCounter value={500} label="Satisfied Clients" suffix="+" />
          <StatCounter value={5000} label="MT Annual Capacity" suffix="+" />
          <StatCounter value={99} label="On-Time Delivery" suffix=".8%" />
          <StatCounter value={15} label="States Served" suffix="+" />
        </div>
      </section>

      {/* ── INDUSTRIES ─────────────────────────────────────────────────── */}
      <section className="nmc-section nmc-section--light">
        <div className="nmc-container">
          <div className="nmc-section-header">
            <div className="nmc-eyebrow">Industries We Serve</div>
            <h2 className="nmc-section-title">Casting Solutions Across Core Industries</h2>
            <p className="nmc-section-subtitle">
              Trusted by Indian manufacturers across automotive, pump, and industrial engineering sectors for consistent quality and reliable supply.
            </p>
          </div>
          <div className="nmc-industry-grid">
            {industries.map((industry, i) => (
              <div key={i} className="nmc-industry-card" style={{ "--accent": industry.accent } as React.CSSProperties}>
                <div className="nmc-industry-icon-wrap">{industry.icon}</div>
                <h3 className="nmc-industry-name">{industry.name}</h3>
                <p className="nmc-industry-desc">{industry.description}</p>
                <div className="nmc-industry-arrow">
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY NUCLEUS ────────────────────────────────────────────────── */}
      <section className="nmc-section nmc-section--dark-gradient">
        <div className="nmc-container">
          <div className="nmc-two-col">
            <div className="nmc-why-left">
              <div className="nmc-eyebrow nmc-eyebrow--light">Quality Assurance</div>
              <h2 className="nmc-section-title nmc-title--white">Why Manufacturers Choose Nucleus Metal Cast</h2>
              <p className="nmc-body-text nmc-body-text--muted">
                Every casting produced at our Rajkot facility undergoes a rigorous multi-stage quality protocol. We combine traditional foundry craftsmanship with modern metallurgical science to deliver components that meet the most demanding specifications.
              </p>
              <div className="nmc-feature-list">
                {qualityFeatures.map((feature, i) => (
                  <div key={i} className="nmc-feature-item">
                    <CheckCircle className="nmc-check-icon" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              <div className="nmc-why-cta">
                <Link to="/process">
                  <button className="nmc-btn-amber">
                    Explore Our Process <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
              </div>
            </div>
            <div className="nmc-why-right">
              <div className="nmc-glass-card">
                <div className="nmc-glass-stat-grid">
                  <div className="nmc-glass-stat">
                    <Award className="h-10 w-10 text-amber-400 mx-auto mb-2" />
                    <div className="nmc-glass-stat-value">ISO</div>
                    <div className="nmc-glass-stat-label">9001:2015</div>
                  </div>
                  <div className="nmc-glass-stat">
                    <Shield className="h-10 w-10 text-amber-400 mx-auto mb-2" />
                    <div className="nmc-glass-stat-value">Zero</div>
                    <div className="nmc-glass-stat-label">Defect Target</div>
                  </div>
                  <div className="nmc-glass-stat">
                    <Globe className="h-10 w-10 text-amber-400 mx-auto mb-2" />
                    <div className="nmc-glass-stat-value">15+</div>
                    <div className="nmc-glass-stat-label">States Served</div>
                  </div>
                  <div className="nmc-glass-stat">
                    <Clock className="h-10 w-10 text-amber-400 mx-auto mb-2" />
                    <div className="nmc-glass-stat-value">24hrs</div>
                    <div className="nmc-glass-stat-label">Quote Response</div>
                  </div>
                </div>
              </div>
              <div className="nmc-material-card">
                <h4 className="nmc-material-title">Materials We Cast</h4>
                <div className="nmc-material-tags">
                  {["SS 304", "SS 316", "Duplex SS", "Carbon Steel", "Alloy Steel", "Cast Iron", "SG Iron", "Aluminium"].map(m => (
                    <span key={m} className="nmc-material-tag">{m}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROCESS PREVIEW ────────────────────────────────────────────── */}
      <section className="nmc-section nmc-section--light">
        <div className="nmc-container">
          <div className="nmc-section-header">
            <div className="nmc-eyebrow">Our Manufacturing Process</div>
            <h2 className="nmc-section-title">11 Steps to Casting Perfection</h2>
            <p className="nmc-section-subtitle">
              Our systematic shell mould casting process ensures precision, consistency, and quality at every stage — from pattern design to final dispatch.
            </p>
          </div>
          <div className="nmc-process-preview-grid">
            {[
              { step: "01", label: "Pattern Design", desc: "CAD modeling & precision tooling" },
              { step: "02", label: "Sand Preparation", desc: "Resin-coated high-silica sand" },
              { step: "03", label: "Shell Formation", desc: "200–250°C controlled layering" },
              { step: "04", label: "Metal Pouring", desc: "Spectrometer-verified alloys" },
              { step: "05", label: "Finishing & QC", desc: "CNC machining & NDT testing" },
              { step: "06", label: "Dispatch", desc: "Packed, inspected, documented" },
            ].map((p, i) => (
              <div key={i} className="nmc-process-step-card">
                <div className="nmc-process-step-num">{p.step}</div>
                <h4 className="nmc-process-step-label">{p.label}</h4>
                <p className="nmc-process-step-desc">{p.desc}</p>
              </div>
            ))}
          </div>
          <div className="nmc-section-cta">
            <Link to="/process">
              <button className="nmc-btn-primary">
                View Full Process <ArrowRight className="h-5 w-5" />
              </button>
            </Link>
          </div>
        </div>
      </section>


      {/* ── CTA BAND ────────────────────────────────────────────────────── */}
      <section className="nmc-cta-band">
        <div className="nmc-container nmc-cta-inner">
          <div className="nmc-cta-text">
            <h2 className="nmc-cta-title">Ready to Source Your Castings?</h2>
            <p className="nmc-cta-subtitle">Get technical consultation within 24 hours. Competitive pricing, prototype-to-production scalability, and zero-compromise quality.</p>
          </div>
          <div className="nmc-cta-actions">
            <Link to="/contact">
              <button className="nmc-btn-dark">
                Request Free Quote <ArrowRight className="h-5 w-5" />
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
