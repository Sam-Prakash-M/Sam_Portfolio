import { useState, useEffect, useRef, useCallback, type ReactNode, type MouseEvent } from "react";
import {
  motion, useScroll, useSpring, useInView, AnimatePresence, animate,
  MotionConfig, useReducedMotion,
} from "framer-motion";
import Lenis from "lenis";
import {
  FiArrowUpRight, FiDownload, FiMail, FiPhone, FiMapPin, FiMenu, FiX, FiAward, FiBookOpen,
} from "react-icons/fi";
import {
  skillGroups, projects, experiences, socials, stats, marquee, education, achievements,
  certifications, SECTIONS, RESUME_URL, EMAIL, PHONE, LOCATION,
} from "./data/portfolio";
import "./App.css";

const EASE = [0.16, 1, 0.3, 1] as const;

/* Fade-up on scroll into view */
function Reveal({ children, delay = 0, className = "" }: {
  children: ReactNode; delay?: number; className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >{children}</motion.div>
  );
}

/* Card with a pointer-following spotlight (position fed to CSS variables) */
function Card({ children, className = "", delay = 0 }: {
  children: ReactNode; className?: string; delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <motion.div ref={ref} className={`card ${className}`} onMouseMove={onMove}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >{children}</motion.div>
  );
}

function Counter({ end, suffix = "" }: { end: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const ctrl = animate(0, end, {
      duration: reduce ? 0 : 1.4, ease: EASE,
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => ctrl.stop();
  }, [inView, end, reduce]);
  return <span ref={ref}>{value}{suffix}</span>;
}

function SectionHead({ num, label, children }: { num: string; label: string; children: ReactNode }) {
  return (
    <Reveal className="sec-head">
      <span className="sec-label"><span className="sec-num">{num}</span>{label}</span>
      <h2 className="sec-title">{children}</h2>
    </Reveal>
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  // Smooth scrolling (skipped when the visitor prefers reduced motion)
  useEffect(() => {
    if (reduce) return;
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenisRef.current = lenis;
    let id = requestAnimationFrame(function raf(time: number) {
      lenis.raf(time);
      id = requestAnimationFrame(raf);
    });
    return () => { cancelAnimationFrame(id); lenis.destroy(); lenisRef.current = null; };
  }, [reduce]);

  // Navbar state + active section
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      let current = "";
      for (const s of SECTIONS) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.4) current = s.id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock scrolling while the mobile menu is open; close it on Escape or when resizing to desktop
  useEffect(() => {
    if (!menuOpen) return;
    document.body.style.overflow = "hidden";
    lenisRef.current?.stop();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMenuOpen(false); };
    const onResize = () => { if (window.innerWidth > 860) setMenuOpen(false); };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = "";
      lenisRef.current?.start();
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [menuOpen]);

  const scrollTo = useCallback((id: string) => {
    setMenuOpen(false);
    // wait a frame so the menu's scroll lock is released first
    requestAnimationFrame(() => {
      const target = id === "home" ? 0 : document.getElementById(id);
      if (target === null) return;
      if (lenisRef.current) {
        lenisRef.current.start();
        lenisRef.current.scrollTo(target, { offset: -80 });
      } else if (typeof target === "number") {
        window.scrollTo({ top: 0 });
      } else {
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80 });
      }
    });
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <div className="app">
        <motion.div className="scroll-progress" style={{ scaleX: progress }} />
        <div className="bg" aria-hidden="true">
          <div className="bg-grid" />
          <div className="bg-glow g1" />
          <div className="bg-glow g2" />
        </div>

        {/* ─── NAV ─── */}
        <header className={`nav ${scrolled || menuOpen ? "solid" : ""}`}>
          <button className="nav-logo" onClick={() => scrollTo("home")} aria-label="Back to top">
            <span className="logo-mark">SP</span>
            <span className="logo-text">Sam Prakash</span>
          </button>
          <nav className="nav-links" aria-label="Sections">
            {SECTIONS.map((s) => (
              <button key={s.id} className={`nav-link ${active === s.id ? "active" : ""}`}
                onClick={() => scrollTo(s.id)}
              >
                {active === s.id && (
                  <motion.span layoutId="nav-pill" className="nav-pill"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }} />
                )}
                <span>{s.label}</span>
              </button>
            ))}
          </nav>
          <a href={RESUME_URL} download="Sam_Prakash_Resume.pdf" className="btn btn-sm nav-resume">
            <FiDownload size={13} /> Resume
          </a>
          <button className="burger" onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen}
          >
            {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </header>

        <AnimatePresence>
          {menuOpen && (
            <motion.div className="mob-menu"
              initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: EASE }}
            >
              {SECTIONS.map((s, i) => (
                <button key={s.id} className="mob-link" onClick={() => scrollTo(s.id)}>
                  <span className="mob-num">0{i + 1}</span>{s.label}
                </button>
              ))}
              <a href={RESUME_URL} download="Sam_Prakash_Resume.pdf" className="btn btn-primary mob-resume">
                <FiDownload size={15} /> Download resume
              </a>
              <div className="mob-socials">
                {socials.map((s) => (
                  <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.name}>
                    <s.icon size={18} />
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <main>
          {/* ─── HERO ─── */}
          <section id="home" className="hero container">
            <motion.a href={`mailto:${EMAIL}`} className="badge"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <span className="badge-dot" /> Member of Technical Staff at Zoho · {LOCATION}
            </motion.a>

            <h1 className="hero-title">
              {["Sam Prakash", "builds backend systems", "that hold up."].map((line, i) => (
                <span key={line} className="line-clip">
                  <motion.span className={`line ${i === 0 ? "" : i === 1 ? "soft" : "accent"}`}
                    initial={{ y: "110%" }} animate={{ y: 0 }}
                    transition={{ duration: 0.9, delay: 0.1 + i * 0.1, ease: EASE }}
                  >{line}</motion.span>
                </span>
              ))}
            </h1>

            <motion.p className="hero-sub"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
            >
              Backend engineer working across <strong>Java, Spring Boot and C/C++</strong> — from crash-analysis
              tooling at ManageEngine Endpoint Central to event-driven pipelines and RAG services.
            </motion.p>

            <motion.div className="hero-ctas"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.62, ease: EASE }}
            >
              <button className="btn btn-primary" onClick={() => scrollTo("projects")}>
                View projects <FiArrowUpRight size={16} />
              </button>
              <a href={RESUME_URL} download="Sam_Prakash_Resume.pdf" className="btn">
                <FiDownload size={15} /> Download resume
              </a>
              <div className="hero-socials">
                {socials.map((s) => (
                  <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer"
                    className="icon-btn" aria-label={s.name} title={s.name}
                  ><s.icon size={16} /></a>
                ))}
              </div>
            </motion.div>
          </section>

          <div className="marquee" aria-hidden="true">
            <div className="marquee-track">
              {[...marquee, ...marquee].map((m, i) => (
                <span key={i} className="marquee-item">{m}<span className="marquee-sep">✦</span></span>
              ))}
            </div>
          </div>

          {/* ─── ABOUT ─── */}
          <section id="about" className="sec container">
            <SectionHead num="01" label="About">Engineer by training, <em>backend by choice.</em></SectionHead>
            <div className="bento">
              <Card className="b-bio">
                <p className="bio-lead">
                  I'm a backend engineer at <strong>Zoho</strong>, on the ManageEngine Endpoint Central team.
                </p>
                <p className="bio-text">
                  My day-to-day is the unglamorous, high-leverage layer: crash-triage dashboards, stack-trace
                  deduplication, WinDbg-driven dump analysis, a Solaris agent, and CVE remediation across a C/C++
                  stack. Outside work I build Spring Boot systems around Kafka, pgvector and LLMs.
                </p>
                <p className="bio-text">
                  Before Zoho I spent close to two years at <strong>Cognizant</strong> working on full-stack Java
                  and MuleSoft API-led connectivity.
                </p>
              </Card>
              {stats.map((s, i) => (
                <Card key={s.label} className="b-stat" delay={0.06 * (i + 1)}>
                  <span className="stat-num"><Counter end={s.n} suffix={s.s} /></span>
                  <span className="stat-label">{s.label}</span>
                </Card>
              ))}
              <Card className="b-edu" delay={0.1}>
                <h3 className="card-title"><FiBookOpen size={15} /> Education</h3>
                {education.map((e) => (
                  <div key={e.title} className="entry">
                    <strong>{e.title}</strong>
                    <span>{e.place}</span>
                    <span className="mono">{e.period}</span>
                  </div>
                ))}
              </Card>
              <Card className="b-ach" delay={0.14}>
                <h3 className="card-title"><FiAward size={15} /> Achievements</h3>
                {achievements.map((a) => (
                  <div key={a.label} className="ach">
                    <span className="ach-score">{a.score}</span><span>{a.label}</span>
                  </div>
                ))}
              </Card>
              <Card className="b-cert" delay={0.18}>
                <h3 className="card-title"><FiAward size={15} /> Certifications</h3>
                <ul className="cert-list">
                  {certifications.map((c) => <li key={c}>{c}</li>)}
                </ul>
              </Card>
            </div>
          </section>

          {/* ─── SKILLS ─── */}
          <section id="skills" className="sec container">
            <SectionHead num="02" label="Skills">The stack I <em>reach for.</em></SectionHead>
            <div className="skill-grid">
              {skillGroups.map((g, i) => (
                <Card key={g.title} className="skill-card" delay={0.05 * i}>
                  <h3 className="card-title"><g.icon size={15} /> {g.title}</h3>
                  <div className="chips">
                    {g.items.map((it) => (
                      <span key={it.name} className="chip">
                        {it.icon && <it.icon size={13} color={it.color} />}{it.name}
                      </span>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* ─── PROJECTS ─── */}
          <section id="projects" className="sec container">
            <SectionHead num="03" label="Projects">Things I've <em>built.</em></SectionHead>
            <div className="proj-list">
              {projects.map((p, i) => (
                <Card key={p.title} className="proj" delay={0.06 * i}>
                  <div className="proj-side">
                    <span className="proj-num">0{i + 1}</span>
                    <span className="proj-kind">{p.kind}</span>
                  </div>
                  <div className="proj-main">
                    <h3 className="proj-title">{p.title}</h3>
                    <p className="proj-summary">{p.summary}</p>
                    <ul className="points">
                      {p.points.map((pt) => <li key={pt}>{pt}</li>)}
                    </ul>
                    <div className="chips">
                      {p.tech.map((t) => <span key={t} className="chip chip-sm">{t}</span>)}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <Reveal className="proj-more">
              <a href={socials[1].url} target="_blank" rel="noopener noreferrer" className="link">
                More on GitHub <FiArrowUpRight size={15} />
              </a>
            </Reveal>
          </section>

          {/* ─── EXPERIENCE ─── */}
          <section id="experience" className="sec container">
            <SectionHead num="04" label="Experience">Where I've <em>worked.</em></SectionHead>
            <div className="timeline">
              {experiences.map((e, i) => (
                <Reveal key={e.role + e.period} className="tl-item" delay={0.05 * i}>
                  <div className={`tl-dot ${e.current ? "now" : ""}`} />
                  <div className="tl-meta">
                    <span className="mono">{e.period}</span>
                    <span className="tl-loc"><FiMapPin size={11} /> {e.location}</span>
                  </div>
                  <div className="tl-body">
                    <h3 className="tl-role">
                      {e.role} {e.current && <span className="now-tag">Current</span>}
                    </h3>
                    <p className="tl-co">{e.company}{e.team && <span> · {e.team}</span>}</p>
                    <ul className="points">
                      {e.points.map((pt) => <li key={pt}>{pt}</li>)}
                    </ul>
                    <div className="chips">
                      {e.tags.map((t) => <span key={t} className="chip chip-sm">{t}</span>)}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>

          {/* ─── CONTACT ─── */}
          <section id="contact" className="sec container">
            <Card className="contact">
              <span className="sec-label"><span className="sec-num">05</span>Contact</span>
              <h2 className="contact-title">Let's build something <em>together.</em></h2>
              <p className="contact-sub">
                Open to backend engineering roles and interesting problems. Email is the fastest way to reach me.
              </p>
              <div className="contact-ctas">
                <a href={`mailto:${EMAIL}`} className="btn btn-primary"><FiMail size={15} /> {EMAIL}</a>
                <a href={`tel:${PHONE.replace(/\s/g, "")}`} className="btn"><FiPhone size={15} /> {PHONE}</a>
              </div>
              <div className="contact-links">
                {socials.map((s) => (
                  <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" className="profile">
                    <s.icon size={16} />
                    <span className="profile-name">{s.name}</span>
                    <span className="profile-handle">@{s.handle}</span>
                    <FiArrowUpRight size={14} className="profile-arrow" />
                  </a>
                ))}
              </div>
            </Card>
          </section>
        </main>

        <footer className="footer container">
          <span>© {new Date().getFullYear()} Sam Prakash M</span>
          <span className="footer-loc"><FiMapPin size={12} /> {LOCATION}</span>
          <button className="link" onClick={() => scrollTo("home")}>Back to top ↑</button>
        </footer>
      </div>
    </MotionConfig>
  );
}
