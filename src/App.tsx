import { useState, useEffect, useRef, useCallback, type ReactNode } from "react";
import {
  motion, useScroll, useTransform, useSpring, useInView,
  useMotionValue, useAnimationFrame, AnimatePresence, animate,
} from "framer-motion";
import Lenis from "lenis";
import {
  FaEnvelope, FaPhone, FaMapMarkerAlt, FaDownload,
  FaArrowRight, FaChevronDown, FaChevronUp, FaArrowDown,
} from "react-icons/fa";
import {
  skills, projects, experiences, socials, stats, concepts, SECTIONS,
} from "./data/portfolio";
import "./App.css";

/* ═══════════════════════════════════════
   PRELOADER
   ═══════════════════════════════════════ */
function Preloader({ onDone }: { onDone: () => void }) {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    let n = 0;
    const iv = setInterval(() => {
      n += Math.random() * 12 + 3;
      if (n >= 100) { n = 100; clearInterval(iv); setTimeout(onDone, 600); }
      setPct(Math.min(n, 100));
    }, 80);
    return () => clearInterval(iv);
  }, [onDone]);
  return (
    <motion.div className="preloader" exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
      <div className="pre-inner">
        <motion.div className="pre-name">
          {"SAM".split("").map((ch, i) => (
            <motion.span key={i}
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.08, duration: 0.6 }}
            >{ch}</motion.span>
          ))}
        </motion.div>
        <motion.p className="pre-sub" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
          PORTFOLIO
        </motion.p>
        <div className="pre-bar-track">
          <div className="pre-bar-fill" style={{ width: `${pct}%` }} />
        </div>
        <span className="pre-count">{Math.floor(pct)}%</span>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════
   CUSTOM CURSOR
   ═══════════════════════════════════════ */
function CustomCursor() {
  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);
  const ringX = useSpring(dotX, { stiffness: 200, damping: 25 });
  const ringY = useSpring(dotY, { stiffness: 200, damping: 25 });
  const [hov, setHov] = useState(false);
  const [proj, setProj] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => { dotX.set(e.clientX); dotY.set(e.clientY); };
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const link = t.closest("a, button, .skill-hex, .stat-card, .exp-row, .c-block, .profile-link, .chip, .hero-soc, .c-soc, .nav-link, .nav-resume, .nav-logo, .burger");
      const project = t.closest(".proj-card");
      setHov(!!link || !!project);
      setProj(!!project);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseover", over); };
  }, [dotX, dotY]);

  const size = hov ? 60 : 36;
  return (
    <>
      <motion.div className={`cur-dot ${hov ? "hov" : ""}`}
        style={{ x: dotX, y: dotY, translateX: "-50%", translateY: "-50%" }}
      />
      <motion.div className={`cur-ring ${hov ? "hov" : ""} ${proj ? "proj" : ""}`}
        style={{ x: ringX, y: ringY, width: size, height: size, translateX: "-50%", translateY: "-50%" }}
      >
        {proj && <span className="cur-label">VIEW</span>}
      </motion.div>
    </>
  );
}

/* ═══════════════════════════════════════
   TEXT REVEAL (word-by-word clip)
   ═══════════════════════════════════════ */
function TextReveal({ children, delay = 0, className = "" }: {
  children: string; delay?: number; className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const words = children.split(" ");
  return (
    <span ref={ref} className={`tr-wrap ${className}`}>
      {words.map((w, i) => (
        <span key={i} className="tr-clip" style={{ marginRight: "0.3em" }}>
          <motion.span className="tr-word"
            initial={{ y: "105%" }}
            animate={inView ? { y: 0 } : { y: "105%" }}
            transition={{ delay: delay + i * 0.06, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >{w}</motion.span>
        </span>
      ))}
    </span>
  );
}

/* ═══════════════════════════════════════
   MAGNETIC HOVER
   ═══════════════════════════════════════ */
function Magnetic({ children, strength = 0.3 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 250, damping: 20 });
  const sy = useSpring(y, { stiffness: 250, damping: 20 });
  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * strength);
    y.set((e.clientY - r.top - r.height / 2) * strength);
  };
  const onLeave = () => { x.set(0); y.set(0); };
  return (
    <motion.div ref={ref} style={{ x: sx, y: sy, display: "inline-block" }}
      onMouseMove={onMove} onMouseLeave={onLeave}
    >{children}</motion.div>
  );
}

/* ═══════════════════════════════════════
   VELOCITY MARQUEE
   ═══════════════════════════════════════ */
function VelocityMarquee({ children, baseSpeed = 1 }: { children: ReactNode; baseSpeed?: number }) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useMotionValue(0);
  const prev = useRef(0);
  const dir = useRef(1);

  useAnimationFrame((_t, delta) => {
    const sv = scrollY.get();
    const diff = sv - prev.current;
    prev.current = sv;
    scrollVelocity.set(diff);
    if (diff > 0) dir.current = -1;
    else if (diff < 0) dir.current = 1;
    const speed = baseSpeed + Math.min(Math.abs(diff) * 0.08, 6);
    let next = baseX.get() + dir.current * speed * (delta / 16);
    if (next <= -50) next += 50;
    if (next >= 0) next -= 50;
    baseX.set(next);
  });

  const xPct = useTransform(baseX, (v) => `${v}%`);
  return (
    <div className="marquee-wrap">
      <motion.div className="marquee-inner" style={{ x: xPct }}>
        {children}{children}{children}{children}
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════
   HORIZONTAL SCROLL PROJECTS (desktop)
   ═══════════════════════════════════════ */
function HorizontalProjects() {
  const outerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: outerRef, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["2%", `-${(projects.length - 1) * 52}%`]);

  return (
    <div id="projects" className="hscroll-outer" ref={outerRef}>
      <div className="hscroll-sticky">
        <div className="hscroll-header">
          <Reveal>
            <span className="sec-label"><span className="sec-num">03</span><span className="sec-line" /> PROJECTS</span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="sec-heading"><TextReveal>Things I've built.</TextReveal></h2>
          </Reveal>
        </div>
        <motion.div className="hscroll-track" style={{ x }}>
          {projects.map((p, i) => (
            <motion.div key={i} className="proj-card" whileHover={{ y: -10 }}>
              <div className="proj-visual" style={{ background: p.gradient }}>
                <span className="proj-idx">0{i + 1}</span>
                <span className="proj-emoji">{p.icon}</span>
              </div>
              <div className="proj-info">
                <h3 className="proj-title">{p.title}</h3>
                <p className="proj-desc">{p.desc}</p>
                <div className="proj-tags">
                  {p.tech.map((t, j) => <span key={j} className="chip sm">{t}</span>)}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   MOBILE PROJECTS (vertical fallback)
   ═══════════════════════════════════════ */
function MobileProjects() {
  return (
    <section id="projects" className="sec">
      <div className="container">
        <Reveal>
          <span className="sec-label"><span className="sec-num">03</span><span className="sec-line" /> PROJECTS</span>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="sec-heading"><TextReveal>Things I've built.</TextReveal></h2>
        </Reveal>
        <div className="proj-grid-mobile">
          {projects.map((p, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="proj-card mobile">
                <div className="proj-visual" style={{ background: p.gradient }}>
                  <span className="proj-idx">0{i + 1}</span>
                  <span className="proj-emoji">{p.icon}</span>
                </div>
                <div className="proj-info">
                  <h3 className="proj-title">{p.title}</h3>
                  <p className="proj-desc">{p.desc}</p>
                  <div className="proj-tags">
                    {p.tech.map((t, j) => <span key={j} className="chip sm">{t}</span>)}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   UTILITIES
   ═══════════════════════════════════════ */


// Reveal on scroll
function Reveal({ children, delay = 0, className = "", direction = "up", y }: {
  children: ReactNode; delay?: number; className?: string; direction?: "up" | "left" | "right"; y?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const dirs = { up: { y: y ?? 60 }, left: { x: -60 }, right: { x: 60 } };
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, ...dirs[direction] }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] }}
    >{children}</motion.div>
  );
}

// Animated counter
function Counter({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [c, setC] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    const ctrl = animate(0, end, {
      duration: 1.5, ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setC(Math.floor(v)),
    });
    return () => ctrl.stop();
  }, [inView, end]);
  return <span ref={ref}>{c}{suffix}</span>;
}



/* ═══════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════ */
export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("home");
  const [expOpen, setExpOpen] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  // Scroll progress
  const { scrollYProgress } = useScroll();
  const progressX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  // Hero parallax
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroScale = useTransform(heroScroll, [0, 1], [1, 0.8]);
  const heroOpacity = useTransform(heroScroll, [0, 0.7], [1, 0]);
  const heroY = useTransform(heroScroll, [0, 1], [0, 150]);
  const heroRotate = useTransform(heroScroll, [0, 1], [0, -5]);

  // Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
    function raf(time: number) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  // Mobile detect
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Active section
  useEffect(() => {
    const onScroll = () => {
      for (const s of [...SECTIONS].reverse()) {
        const el = document.getElementById(s);
        if (el && el.getBoundingClientRect().top < 300) { setActive(s); break; }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body on menu
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const onPreloaderDone = useCallback(() => setLoaded(true), []);

  // Skill marquee items
  const marqueeItems = (
    <>
      {skills.map((s, i) => {
        const Icon = s.icon;
        return (
          <span key={i} className="mq-item">
            <Icon size={18} color={s.color} />
            <span>{s.name}</span>
            <span className="mq-dot">·</span>
          </span>
        );
      })}
    </>
  );

  return (
    <>
      {/* PRELOADER */}
      <AnimatePresence mode="wait">
        {!loaded && <Preloader onDone={onPreloaderDone} />}
      </AnimatePresence>

      {loaded && (
        <div className="app">
          {/* Custom cursor (desktop only) */}
          {!isMobile && <CustomCursor />}

          {/* Scroll progress */}
          <motion.div className="scroll-progress" style={{ scaleX: progressX }} />

          {/* ─── NAVBAR ─── */}
          <motion.nav className="navbar"
            initial={{ y: -80 }} animate={{ y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <Magnetic>
              <div className="nav-logo" onClick={() => scrollTo("home")}>
                <span className="logo-dot" /><span>SAM PRAKASH</span>
              </div>
            </Magnetic>

            <div className="nav-links">
              {SECTIONS.map((s) => (
                <Magnetic key={s} strength={0.2}>
                  <button className={`nav-link ${active === s ? "active" : ""}`}
                    onClick={() => scrollTo(s)}
                  >{s}</button>
                </Magnetic>
              ))}
            </div>

            <Magnetic>
              <a href="/Sam_Prakash_Latest_Resume.pdf" target="_blank" rel="noopener noreferrer" className="nav-resume">
                <FaDownload size={11} /> Resume
              </a>
            </Magnetic>

            <button className="burger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
              <span className={menuOpen ? "open" : ""} />
              <span className={menuOpen ? "open" : ""} />
            </button>
          </motion.nav>

          {/* ─── MOBILE MENU ─── */}
          <AnimatePresence>
            {menuOpen && (
              <motion.div className="mob-menu"
                initial={{ clipPath: "circle(0% at 95% 3%)" }}
                animate={{ clipPath: "circle(150% at 95% 3%)" }}
                exit={{ clipPath: "circle(0% at 95% 3%)" }}
                transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
              >
                {SECTIONS.map((s, i) => (
                  <motion.button key={s} className="mob-link"
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.06 }}
                    onClick={() => { scrollTo(s); setMenuOpen(false); }}
                  >
                    <span className="mob-num">0{i + 1}</span>{s}
                  </motion.button>
                ))}
                <motion.div className="mob-socials" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
                  {socials.map((s, i) => (
                    <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" style={{ color: s.color }}><s.icon size={22} /></a>
                  ))}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ━━━━━ HERO ━━━━━ */}
          <section id="home" className="hero" ref={heroRef}>
            <div className="hero-bg">
              <div className="hero-grid-lines" />
              <div className="hero-orb orb1" />
              <div className="hero-orb orb2" />
              <div className="hero-orb orb3" />
            </div>

            <motion.div className="hero-inner" style={{ scale: heroScale, opacity: heroOpacity, y: heroY, rotateX: heroRotate }}>
              <motion.div className="hero-eyebrow"
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                <span className="eyebrow-dot" /> BACKEND ENGINEER · JAVA · SPRING BOOT · C++
              </motion.div>

              <h1 className="hero-name">
                {"SAM".split("").map((ch, i) => (
                  <motion.span key={`a${i}`} className="hero-char"
                    initial={{ opacity: 0, y: 100, rotateX: -80 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{ delay: 0.6 + i * 0.06, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  >{ch}</motion.span>
                ))}
                <br />
                {"PRAKASH".split("").map((ch, i) => (
                  <motion.span key={`b${i}`} className="hero-char outline"
                    initial={{ opacity: 0, y: 100, rotateX: -80 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{ delay: 0.85 + i * 0.05, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  >{ch}</motion.span>
                ))}
              </h1>

              <motion.p className="hero-sub"
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.8 }}
              >
                Crafting scalable systems & automation tools at <strong>Zoho</strong> & <strong>Cognizant</strong> — 3+ years
              </motion.p>

              <motion.div className="hero-ctas"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8 }}
              >
                <Magnetic>
                  <button className="btn-fill" onClick={() => scrollTo("projects")}>
                    Explore Work <FaArrowRight size={13} />
                  </button>
                </Magnetic>
                <Magnetic>
                  <a href="mailto:msamprakash05@gmail.com" className="btn-outline">Say Hello</a>
                </Magnetic>
              </motion.div>

              <motion.div className="hero-socials"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.1 }}
              >
                {socials.map((s, i) => (
                  <Magnetic key={i} strength={0.4}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="hero-soc" style={{ color: s.color }}>
                      <s.icon size={19} />
                    </a>
                  </Magnetic>
                ))}
              </motion.div>
            </motion.div>

            <motion.div className="scroll-arrow"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.4 }}
            >
              <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
                <FaArrowDown size={14} />
              </motion.div>
              <span>SCROLL</span>
            </motion.div>
          </section>

          {/* ─── MARQUEE ─── */}
          <div className="marquee-section">
            <VelocityMarquee baseSpeed={1.5}>{marqueeItems}</VelocityMarquee>
          </div>

          {/* ━━━━━ ABOUT ━━━━━ */}
          <section id="about" className="sec">
            <div className="container">
              <Reveal>
                <span className="sec-label"><span className="sec-num">01</span><span className="sec-line" /> ABOUT ME</span>
              </Reveal>

              <div className="about-split">
                <div className="about-left">
                  <Reveal delay={0.1}>
                    <h2 className="about-heading">
                      <TextReveal>I build systems</TextReveal><br />
                      <TextReveal delay={0.2}>that matter.</TextReveal>
                    </h2>
                  </Reveal>
                  <Reveal delay={0.2}>
                    <p className="about-text">
                      Backend engineer with 3+ years at <strong>Zoho</strong> & <strong>Cognizant</strong>.
                      Building scalable Java apps, crash analysis pipelines, and system-level C/C++ tools.
                      Currently at ManageEngine Endpoint Central — crash dump analysis with Zoho Desk,
                      unified JSON frameworks, and Grafana dashboards.
                    </p>
                  </Reveal>
                  <Reveal delay={0.3}>
                    <div className="about-stack">
                      {[skills[0], skills[1], skills[2], skills[12], skills[11], skills[13]].map((s, i) => (
                        <div key={i} className="stack-icon"><s.icon size={22} color={s.color} /></div>
                      ))}
                    </div>
                  </Reveal>
                </div>

                <div className="about-right">
                  {stats.map((d, i) => (
                    <Reveal key={i} className="stat-card" delay={0.15 + i * 0.08}>
                      <span className="stat-emoji">{d.emoji}</span>
                      <span className="stat-big"><Counter end={d.n} suffix={d.s} /></span>
                      <span className="stat-label">{d.label}</span>
                    </Reveal>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ━━━━━ SKILLS ━━━━━ */}
          <section id="skills" className="sec">
            <div className="container">
              <Reveal>
                <span className="sec-label"><span className="sec-num">02</span><span className="sec-line" /> SKILLS & TOOLS</span>
              </Reveal>
              <Reveal delay={0.1}>
                <h2 className="sec-heading"><TextReveal>My toolkit.</TextReveal></h2>
              </Reveal>

              <div className="skills-grid">
                {skills.map((skill, i) => {
                  const Icon = skill.icon;
                  return (
                    <Reveal key={i} delay={i * 0.025} y={40}>
                      <motion.div className="skill-hex" whileHover={{ scale: 1.12, y: -6 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        style={{ "--sc": skill.color } as React.CSSProperties}
                      >
                        <div className="hex-icon"><Icon size={24} color={skill.color} /></div>
                        <span className="hex-label">{skill.name}</span>
                        <div className="hex-glow" />
                      </motion.div>
                    </Reveal>
                  );
                })}
              </div>

              <Reveal delay={0.2}>
                <div className="chips-row">
                  {concepts.map((c, i) => (
                    <Magnetic key={i} strength={0.15}>
                      <span className="chip">{c}</span>
                    </Magnetic>
                  ))}
                </div>
              </Reveal>
            </div>
          </section>

          {/* ━━━━━ PROJECTS (horizontal on desktop, vertical on mobile) ━━━━━ */}
          {isMobile ? <MobileProjects /> : <HorizontalProjects />}

          {/* ━━━━━ EXPERIENCE ━━━━━ */}
          <section id="experience" className="sec">
            <div className="container">
              <Reveal>
                <span className="sec-label"><span className="sec-num">04</span><span className="sec-line" /> EXPERIENCE</span>
              </Reveal>
              <Reveal delay={0.1}>
                <h2 className="sec-heading"><TextReveal>Where I've worked.</TextReveal></h2>
              </Reveal>

              <div className="exp-list">
                {experiences.map((exp, i) => (
                  <Reveal key={i} delay={i * 0.1}>
                    <motion.div className={`exp-row ${expOpen === i ? "open" : ""}`}
                      onClick={() => setExpOpen(expOpen === i ? -1 : i)}
                      whileHover={{ x: 6 }}
                    >
                      <div className="exp-top">
                        <div className="exp-left">
                          <div className="exp-bar" style={{ background: exp.color }} />
                          <div>
                            <h3 className="exp-role">{exp.role}</h3>
                            <p className="exp-co" style={{ color: exp.color }}>{exp.company}</p>
                            {exp.team && <p className="exp-team">{exp.team}</p>}
                          </div>
                        </div>
                        <div className="exp-right">
                          <span className="exp-date">{exp.period}</span>
                          <span className="exp-loc"><FaMapMarkerAlt size={10} /> {exp.location}</span>
                        </div>
                        <span className="exp-arrow">{expOpen === i ? <FaChevronUp /> : <FaChevronDown />}</span>
                      </div>
                      <AnimatePresence>
                        {expOpen === i && (
                          <motion.div className="exp-body"
                            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4 }}
                          >
                            <ul className="exp-pts">
                              {exp.points.map((pt, j) => <li key={j}>{pt}</li>)}
                            </ul>
                            <div className="exp-chips">
                              {exp.tags.map((t, j) => <span key={j} className="chip sm">{t}</span>)}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </Reveal>
                ))}
              </div>

              {/* Info bento */}
              <div className="info-bento">
                <Reveal className="info-card">
                  <h3 className="info-title">🎓 Education</h3>
                  <div className="info-entry"><strong>BE Mechatronics</strong><span>Thiagarajar College of Engineering, Madurai · 2018–2022</span></div>
                  <div className="info-entry"><strong>HSC — Amir Jamal HSS</strong><span>2017–2018 · <em className="gold">200/200 Maths 🏅</em></span></div>
                </Reveal>
                <Reveal className="info-card" delay={0.05}>
                  <h3 className="info-title">🏆 Achievements</h3>
                  <div className="achiev"><span className="achiev-badge">200/200</span> Maths — 12th HSC</div>
                  <div className="achiev"><span className="achiev-badge">100/100</span> Maths — 10th SSLC</div>
                </Reveal>
                <Reveal className="info-card" delay={0.1}>
                  <h3 className="info-title">📜 Certifications</h3>
                  {["Java SE — HackerRank", "Spring Boot — Udemy", "Problem Solving — HackerRank", "SQL — HackerRank"].map((c, i) => (
                    <div key={i} className="cert-row"><span className="cert-dot" />{c}</div>
                  ))}
                </Reveal>
                <Reveal className="info-card" delay={0.15}>
                  <h3 className="info-title">🔗 Profiles</h3>
                  {[
                    { name: "LeetCode", user: "Sam_Prakash", url: "https://leetcode.com/u/Sam_Prakash/", color: "#ffa116", Icon: socials[2].icon },
                    { name: "HackerRank", user: "msamprakash05", url: "https://hackerrank.com/profile/msamprakash05", color: "#2ec866", Icon: socials[3].icon },
                    { name: "GitHub", user: "Sam-Prakash-M", url: "https://github.com/Sam-Prakash-M", color: "#e6edf3", Icon: socials[1].icon },
                  ].map((p, i) => (
                    <a key={i} href={p.url} target="_blank" rel="noopener noreferrer" className="profile-link">
                      <p.Icon size={15} color={p.color} /><span>{p.name}</span><span className="profile-user">@{p.user}</span>
                    </a>
                  ))}
                </Reveal>
              </div>
            </div>
          </section>

          {/* ━━━━━ CONTACT ━━━━━ */}
          <section id="contact" className="sec contact-sec">
            <div className="container">
              <Reveal>
                <span className="sec-label center"><span className="sec-num">05</span><span className="sec-line" /> CONTACT</span>
              </Reveal>
              <Reveal delay={0.1}>
                <h2 className="contact-heading">
                  <TextReveal className="contact-line">Let's work</TextReveal><br />
                  <TextReveal className="contact-line em" delay={0.15}>together.</TextReveal>
                </h2>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="contact-sub">Open to Java backend roles, engineering challenges, or collaborations.</p>
              </Reveal>
              <Reveal delay={0.25}>
                <div className="contact-blocks">
                  <a href="mailto:msamprakash05@gmail.com" className="c-block">
                    <FaEnvelope size={20} /><span className="c-label">EMAIL</span><span className="c-val">msamprakash05@gmail.com</span>
                  </a>
                  <div className="c-block">
                    <FaPhone size={20} /><span className="c-label">PHONE</span><span className="c-val">+91 6385812669</span>
                  </div>
                  <div className="c-block">
                    <FaMapMarkerAlt size={20} /><span className="c-label">LOCATION</span><span className="c-val">Chennai, India</span>
                  </div>
                </div>
              </Reveal>
              <Reveal delay={0.3}>
                <div className="contact-socs">
                  {socials.map((s, i) => (
                    <Magnetic key={i} strength={0.35}>
                      <a href={s.url} target="_blank" rel="noopener noreferrer" className="c-soc"
                        style={{ "--soc": s.color } as React.CSSProperties}
                      ><s.icon size={18} /><span>{s.name}</span></a>
                    </Magnetic>
                  ))}
                </div>
              </Reveal>
              <Reveal delay={0.35}>
                <Magnetic>
                  <a href="mailto:msamprakash05@gmail.com" className="btn-fill big">
                    <FaEnvelope /> Send a Message <FaArrowRight />
                  </a>
                </Magnetic>
              </Reveal>
            </div>
          </section>

          {/* FOOTER */}
          <footer className="footer">
            <div className="container footer-inner">
              <div className="footer-brand"><span className="logo-dot" /><span>SAM PRAKASH</span></div>
              <p className="footer-copy">© 2026 · Built with ❤️ and Java</p>
              <div className="footer-socs">
                {socials.map((s, i) => (
                  <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"><s.icon size={15} /></a>
                ))}
              </div>
            </div>
          </footer>
        </div>
      )}
    </>
  );
}
