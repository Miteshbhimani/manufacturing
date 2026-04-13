import * as React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, Award, Users, Target, Eye, Heart, TreePine,
  Phone, Mail, MapPin, CheckCircle, TrendingUp, Factory,
  Shield, Globe, Star, Lightbulb, Handshake
} from "lucide-react";

/* ─── Intersection Observer Hook ────────────────────────────────────── */
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
        transform: inView ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}


export function AboutPage() {
  const milestones = [
    {
      period: "2010",
      title: "Foundation",
      description: "Nucleus Metal Cast Private Limited was incorporated in Rajkot, Gujarat with a vision to bring precision shell mould casting to India's growing manufacturing sector.",
      icon: <Factory className="h-6 w-6" />,
    },
    {
      period: "2013",
      title: "Capacity Expansion",
      description: "Doubled our foundry capacity with additional shell moulding machines and an in-house spectrometer for alloy composition verification.",
      icon: <TrendingUp className="h-6 w-6" />,
    },
    {
      period: "2016",
      title: "ISO Certification",
      description: "Achieved ISO 9001:2015 certification — a testament to our structured quality management systems and commitment to zero-defect manufacturing.",
      icon: <Award className="h-6 w-6" />,
    },
    {
      period: "2019",
      title: "CNC Integration",
      description: "Integrated CNC precision machining capabilities to offer complete casting + machining solutions under one roof, reducing lead times for clients.",
      icon: <Shield className="h-6 w-6" />,
    },
    {
      period: "Present",
      title: "Industry Leadership",
      description: "Today, Nucleus Metal Cast serves 500+ clients across 15+ States in India, producing 5,000+ MT of precision castings annually across multiple material grades.",
      icon: <Globe className="h-6 w-6" />,
    },
  ];

  const values = [
    {
      icon: <Award className="h-8 w-8" />,
      title: "Quality Without Compromise",
      description: "Every casting is a commitment. Our ISO 9001:2015 processes, in-house testing, and multi-point inspection ensure zero-defect deliveries — batch after batch.",
      color: "#0b3d91",
    },
    {
      icon: <Lightbulb className="h-8 w-8" />,
      title: "Engineering Innovation",
      description: "We invest continuously in process R&D, material science, and equipment upgrades to stay ahead of what India's manufacturing sector demands.",
      color: "#d32f2f",
    },
    {
      icon: <Handshake className="h-8 w-8" />,
      title: "Partnership Mindset",
      description: "We don't just supply castings — we become manufacturing partners. From prototype to full-scale production, we walk alongside our clients.",
      color: "#0b3d91",
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Sustainable Practices",
      description: "Responsible manufacturing is built into our operations — 95% material recycling, energy-efficient furnaces, and strict emission controls.",
      color: "#d32f2f",
    },
  ];

  const achievements = [
    { icon: <Factory className="h-7 w-7" />, value: "50,000+", label: "Sq. Ft. Manufacturing Area" },
    { icon: <Users className="h-7 w-7" />, value: "200+", label: "Skilled Employees" },
    { icon: <Globe className="h-7 w-7" />, value: "15+", label: "States Supplied Across India" },
    { icon: <Award className="h-7 w-7" />, value: "ISO", label: "9001:2015 Certified" },
  ];

  return (
    <div className="nmc-page">
      <title>About Nucleus Metal Cast | Shell Mould Casting Manufacturer Rajkot Gujarat India</title>
      <meta name="description" content="About Nucleus Metal Cast Private Limited — ISO 9001:2015 certified shell mould casting manufacturer in Rajkot, Gujarat. Learn our story, values, and manufacturing capabilities serving 500+ clients across India." />
      <meta name="keywords" content="Nucleus Metal Cast about, casting manufacturer Rajkot, foundry Gujarat India, shell mould casting company, ISO certified casting, metal casting manufacturer India" />

      {/* ── HERO ───────────────────────────────────────────────────────── */}
      <section className="nmc-page-hero nmc-page-hero--blue">
        <div className="nmc-page-hero-bg-pattern" />
        <div className="nmc-container nmc-page-hero-inner">
          <AnimateIn>
            <div className="nmc-eyebrow nmc-eyebrow--light">Our Story</div>
            <h1 className="nmc-page-hero-title">
              Engineering Trust, <span className="nmc-hero-accent">One Casting at a Time</span>
            </h1>
            <p className="nmc-page-hero-subtitle">
              Nucleus Metal Cast Private Limited is a GST-registered precision casting manufacturer headquartered in Rajkot, Gujarat — the engineering capital of India. We combine deep foundry expertise with modern quality systems to serve India's most demanding manufacturers.
            </p>
            <div className="nmc-hero-actions">
              <Link to="/contact">
                <button className="nmc-btn-amber">
                  Schedule a Factory Visit <ArrowRight className="h-5 w-5" />
                </button>
              </Link>
              <Link to="/infrastructure">
                <button className="nmc-btn-outline-white">
                  View Our Facility
                </button>
              </Link>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ── COMPANY OVERVIEW ───────────────────────────────────────────── */}
      <section className="nmc-section nmc-section--light">
        <div className="nmc-container">
          <div className="nmc-two-col nmc-two-col--gap-lg">
            <AnimateIn delay={0}>
              <div className="nmc-eyebrow">Company Profile</div>
              <h2 className="nmc-section-title">Nucleus Metal Cast Private Limited</h2>
              <p className="nmc-body-text" style={{ marginBottom: "1.5rem" }}>
                Incorporated and operating from Rajkot — India's hub of precision engineering — Nucleus Metal Cast has built a reputation for delivering shell mould castings and investment castings that meet the tightest dimensional and metallurgical specifications.
              </p>
              <p className="nmc-body-text" style={{ marginBottom: "2rem" }}>
                Our 50,000+ sq. ft. facility houses a complete foundry ecosystem: from pattern shop and sand preparation lines to multiple induction furnaces, CNC machining centres, and a full-spectrum quality laboratory.
              </p>
              <div className="nmc-detail-card">
                <h3 className="nmc-detail-card-title">Legal & Corporate Details</h3>
                <div className="nmc-detail-grid">
                  <div className="nmc-detail-row">
                    <span className="nmc-detail-key">Company Name</span>
                    <span className="nmc-detail-val">Nucleus Metal Cast Private Limited</span>
                  </div>
                  <div className="nmc-detail-row">
                    <span className="nmc-detail-key">GSTIN</span>
                    <span className="nmc-detail-val">24AAFCN3454D1ZP</span>
                  </div>
                  <div className="nmc-detail-row">
                    <span className="nmc-detail-key">Registration State</span>
                    <span className="nmc-detail-val">Gujarat (Code: 24)</span>
                  </div>
                  <div className="nmc-detail-row">
                    <span className="nmc-detail-key">GST Status</span>
                    <span className="nmc-detail-val">Active — Regular Taxpayer</span>
                  </div>
                  <div className="nmc-detail-row">
                    <span className="nmc-detail-key">Location</span>
                    <span className="nmc-detail-val">Rajkot, Gujarat, India</span>
                  </div>
                  <div className="nmc-detail-row">
                    <span className="nmc-detail-key">ISO Certification</span>
                    <span className="nmc-detail-val">ISO 9001:2015 Certified</span>
                  </div>
                </div>
              </div>
            </AnimateIn>
            <AnimateIn delay={150}>
              <div className="nmc-achievement-grid">
                {achievements.map((a, i) => (
                  <div key={i} className="nmc-achievement-card">
                    <div className="nmc-achievement-icon">{a.icon}</div>
                    <div className="nmc-achievement-value">{a.value}</div>
                    <div className="nmc-achievement-label">{a.label}</div>
                  </div>
                ))}
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* ── MISSION & VISION ───────────────────────────────────────────── */}
      <section className="nmc-section nmc-section--white">
        <div className="nmc-container">
          <div className="nmc-section-header">
            <div className="nmc-eyebrow">Mission & Vision</div>
            <h2 className="nmc-section-title">What Drives Us Forward</h2>
          </div>
          <div className="nmc-mv-grid">
            <AnimateIn delay={0}>
              <div className="nmc-mv-card nmc-mv-card--blue">
                <div className="nmc-mv-icon-wrap"><Target className="h-10 w-10" /></div>
                <h3 className="nmc-mv-title">Our Mission</h3>
                <p className="nmc-mv-text">
                  To deliver superior quality metal casting solutions through precision engineering, advanced shell mould technology, and sustainable manufacturing practices — enabling Indian manufacturers to compete globally with components they can trust completely.
                </p>
                <ul className="nmc-mv-points">
                  <li><CheckCircle className="h-4 w-4" /> Customer-first approach on every order</li>
                  <li><CheckCircle className="h-4 w-4" /> Continuous investment in process excellence</li>
                  <li><CheckCircle className="h-4 w-4" /> On-time, every-time commitment</li>
                </ul>
              </div>
            </AnimateIn>
            <AnimateIn delay={150}>
              <div className="nmc-mv-card nmc-mv-card--red">
                <div className="nmc-mv-icon-wrap"><Eye className="h-10 w-10" /></div>
                <h3 className="nmc-mv-title">Our Vision</h3>
                <p className="nmc-mv-text">
                  To be recognized as India's most reliable and technically advanced precision casting company — setting the benchmark for quality, turnaround, and customer partnership in the metal casting industry across Rajkot, Gujarat, and beyond.
                </p>
                <ul className="nmc-mv-points">
                  <li><CheckCircle className="h-4 w-4" /> Pan-India supply chain leadership</li>
                  <li><CheckCircle className="h-4 w-4" /> 100% digitally traceable quality records</li>
                  <li><CheckCircle className="h-4 w-4" /> Expanding export presence</li>
                </ul>
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* ── CORE VALUES ────────────────────────────────────────────────── */}
      <section className="nmc-section nmc-section--light">
        <div className="nmc-container">
          <div className="nmc-section-header">
            <div className="nmc-eyebrow">Core Values</div>
            <h2 className="nmc-section-title">The Principles Behind Every Casting</h2>
            <p className="nmc-section-subtitle">Our culture is built on values that translate directly into the quality and reliability our clients experience.</p>
          </div>
          <div className="nmc-values-grid">
            {values.map((v, i) => (
              <AnimateIn key={i} delay={i * 80}>
                <div className="nmc-value-card" style={{ "--accent": v.color } as React.CSSProperties}>
                  <div className="nmc-value-icon-wrap">{v.icon}</div>
                  <h3 className="nmc-value-title">{v.title}</h3>
                  <p className="nmc-value-desc">{v.description}</p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── GROWTH TIMELINE ────────────────────────────────────────────── */}
      <section className="nmc-section nmc-section--dark-gradient">
        <div className="nmc-container">
          <div className="nmc-section-header">
            <div className="nmc-eyebrow nmc-eyebrow--light">Our Journey</div>
            <h2 className="nmc-section-title nmc-title--white">Growth That Speaks for Itself</h2>
            <p className="nmc-section-subtitle nmc-subtitle--muted">
              From a focused foundry startup to a trusted pan-India casting partner — our milestones reflect relentless commitment to quality and growth.
            </p>
          </div>
          <div className="nmc-timeline">
            {milestones.map((m, i) => (
              <AnimateIn key={i} delay={i * 100}>
                <div className={`nmc-timeline-item ${i % 2 === 0 ? "nmc-timeline-item--left" : "nmc-timeline-item--right"}`}>
                  <div className="nmc-timeline-dot">{m.icon}</div>
                  <div className="nmc-timeline-card">
                    <div className="nmc-timeline-period">{m.period}</div>
                    <h3 className="nmc-timeline-title">{m.title}</h3>
                    <p className="nmc-timeline-desc">{m.description}</p>
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── CSR ────────────────────────────────────────────────────────── */}
      <section className="nmc-section nmc-section--white">
        <div className="nmc-container">
          <div className="nmc-two-col">
            <AnimateIn>
              <div className="nmc-eyebrow">Corporate Responsibility</div>
              <h2 className="nmc-section-title">Rooted in Rajkot, Committed to India</h2>
              <p className="nmc-body-text" style={{ marginBottom: "1.5rem" }}>
                While we serve industrial clients across India, our commitment to the local community in Rajkot remains unwavering. Manufacturing is people-first at Nucleus Metal Cast.
              </p>
              <div className="nmc-csr-cards">
                <div className="nmc-csr-card">
                  <Users className="h-7 w-7 text-blue-600 mb-3" />
                  <h4 className="nmc-csr-card-title">Local Employment</h4>
                  <ul className="nmc-csr-list">
                    <li>200+ direct employment opportunities</li>
                    <li>Ongoing skill development & ITI training programs</li>
                    <li>Preference for local hiring & vendor partnerships</li>
                  </ul>
                </div>
                <div className="nmc-csr-card">
                  <TreePine className="h-7 w-7 text-green-600 mb-3" />
                  <h4 className="nmc-csr-card-title">Environmental Stewardship</h4>
                  <ul className="nmc-csr-list">
                    <li>95% sand and metal recycling rate</li>
                    <li>Energy-efficient induction furnace systems</li>
                    <li>Advanced dust and emission control infrastructure</li>
                  </ul>
                </div>
              </div>
            </AnimateIn>
            <AnimateIn delay={150}>
              <div className="nmc-csr-stat-panel">
                <div className="nmc-csr-stat">
                  <Star className="h-8 w-8 text-amber-400" />
                  <div className="nmc-csr-stat-value">500+</div>
                  <div className="nmc-csr-stat-label">Happy Clients Served</div>
                </div>
                <div className="nmc-csr-stat">
                  <Globe className="h-8 w-8 text-amber-400" />
                  <div className="nmc-csr-stat-value">15+</div>
                  <div className="nmc-csr-stat-label">States Across India</div>
                </div>
                <div className="nmc-csr-stat">
                  <Shield className="h-8 w-8 text-amber-400" />
                  <div className="nmc-csr-stat-value">95%</div>
                  <div className="nmc-csr-stat-label">Material Recycled</div>
                </div>
                <div className="nmc-csr-stat">
                  <TrendingUp className="h-8 w-8 text-amber-400" />
                  <div className="nmc-csr-stat-value">5,000+</div>
                  <div className="nmc-csr-stat-label">MT Capacity p.a.</div>
                </div>
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────── */}
      <section className="nmc-cta-band">
        <div className="nmc-container nmc-cta-inner">
          <div className="nmc-cta-text">
            <h2 className="nmc-cta-title">Partner with Nucleus Metal Cast</h2>
            <p className="nmc-cta-subtitle">Whether you need prototype samples or long-run production, we're ready to discuss your casting requirements today.</p>
          </div>
          <div className="nmc-cta-actions">
            <Link to="/contact">
              <button className="nmc-btn-dark">
                Get in Touch <ArrowRight className="h-5 w-5" />
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

export default AboutPage;
