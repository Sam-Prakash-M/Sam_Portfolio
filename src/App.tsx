import { useState, useEffect, useRef, type ReactNode } from "react";
import {
  motion, useScroll, useTransform, useSpring, useInView, AnimatePresence,
} from "framer-motion";
import {
  FaJava, FaReact, FaDocker, FaGitAlt, FaLinkedinIn,
  FaGithub, FaHackerrank, FaDatabase, FaEnvelope, FaPhone,
  FaMapMarkerAlt, FaDownload, FaChevronDown,
  FaChevronUp, FaArrowRight,
} from "react-icons/fa";
import {
  SiSpringboot, SiPostgresql, SiMongodb, SiRedis,
  SiJavascript, SiCplusplus, SiApachekafka, SiRabbitmq,
  SiHibernate, SiJenkins, SiGrafana, SiPostman, SiMysql,
  SiApachetomcat, SiRust, SiLeetcode, SiTypescript, SiApachemaven,
} from "react-icons/si";
import "./App.css";

/* ═══════════════════════════════════════
   UTILITIES
   ═══════════════════════════════════════ */

const scrollTo = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

// Reveal on scroll
function Reveal({ children, delay = 0, className = "", direction = "up" }: {
  children: ReactNode; delay?: number; className?: string; direction?: "up" | "left" | "right";
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const dirs = { up: { y: 60 }, left: { x: -60 }, right: { x: 60 } };
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
    let n = 0;
    const s = end / 50;
    const t = setInterval(() => { n += s; if (n >= end) { setC(end); clearInterval(t); } else setC(Math.floor(n)); }, 25);
    return () => clearInterval(t);
  }, [inView, end]);
  return <span ref={ref}>{c}{suffix}</span>;
}

// 3D tilt card
function TiltCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [over, setOver] = useState(false);
  const handleMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setPos({ x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 });
  };
  return (
    <motion.div ref={ref} className={`tilt-card ${className}`}
      onMouseMove={handleMove} onMouseEnter={() => setOver(true)} onMouseLeave={() => { setOver(false); setPos({ x: 0, y: 0 }); }}
      style={{
        transform: over
          ? `perspective(800px) rotateY(${pos.x * 12}deg) rotateX(${-pos.y * 12}deg) scale3d(1.03,1.03,1.03)`
          : "perspective(800px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)",
        transition: over ? "transform 0.15s ease" : "transform 0.6s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      <div className="tilt-shine" style={{
        background: over
          ? `radial-gradient(circle at ${(pos.x + 0.5) * 100}% ${(pos.y + 0.5) * 100}%, rgba(255,255,255,0.08), transparent 60%)`
          : "none",
      }} />
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════
   DATA
   ═══════════════════════════════════════ */

const SECTIONS = ["home", "about", "skills", "projects", "experience", "contact"];

const allSkills = [
  { name: "Java", icon: FaJava, color: "#f89820" },
  { name: "Spring Boot", icon: SiSpringboot, color: "#6db33f" },
  { name: "C / C++", icon: SiCplusplus, color: "#00599C" },
  { name: "JavaScript", icon: SiJavascript, color: "#f7df1e" },
  { name: "TypeScript", icon: SiTypescript, color: "#3178c6" },
  { name: "React", icon: FaReact, color: "#61dafb" },
  { name: "Hibernate", icon: SiHibernate, color: "#59666c" },
  { name: "RabbitMQ", icon: SiRabbitmq, color: "#ff6600" },
  { name: "Kafka", icon: SiApachekafka, color: "#888" },
  { name: "MySQL", icon: SiMysql, color: "#4479a1" },
  { name: "PostgreSQL", icon: SiPostgresql, color: "#336791" },
  { name: "MongoDB", icon: SiMongodb, color: "#4db33d" },
  { name: "Redis", icon: SiRedis, color: "#dc382d" },
  { name: "Docker", icon: FaDocker, color: "#2496ed" },
  { name: "Jenkins", icon: SiJenkins, color: "#d24939" },
  { name: "Git", icon: FaGitAlt, color: "#f05032" },
  { name: "Maven", icon: SiApachemaven, color: "#c71a36" },
  { name: "Grafana", icon: SiGrafana, color: "#f46800" },
  { name: "Postman", icon: SiPostman, color: "#ff6c37" },
  { name: "Tomcat", icon: SiApachetomcat, color: "#f8dc75" },
  { name: "SQL", icon: FaDatabase, color: "#336791" },
  { name: "Rust", icon: SiRust, color: "#ce412b" },
];

const projects = [
  {
    title: "Railway Booking System",
    desc: "Train reservation platform: smart search, PNR tracking, QR e-ticketing, dynamic fares, waitlist auto-promotion. PayPal + Razorpay + Cashfree; jBCrypt, session auth, OTP recovery via SMTP.",
    tech: ["Java", "Jakarta EE", "JSP", "MongoDB"],
    gradient: "linear-gradient(135deg, #667eea, #764ba2)",
    icon: "🚂",
  },
  {
    title: "E-Commerce Microservices",
    desc: "Independent services (Product, Order, Auth, Payment) via RabbitMQ; Eureka discovery & Spring Cloud Gateway. Redis caching → 45% faster; Resilience4j circuit breakers; Docker Compose.",
    tech: ["Spring Boot", "Docker", "RabbitMQ", "Redis"],
    gradient: "linear-gradient(135deg, #f093fb, #f5576c)",
    icon: "🛒",
  },
  {
    title: "URL Shortener Service",
    desc: "REST API: Base62 encoding, custom aliases, expiration, geo-tracked click analytics. Redis → sub-10ms redirects; Bucket4j rate-limiting; Spring Security + OpenAPI docs.",
    tech: ["Spring Boot", "PostgreSQL", "Redis"],
    gradient: "linear-gradient(135deg, #4facfe, #00f2fe)",
    icon: "🔗",
  },
  {
    title: "Real-Time Chat App",
    desc: "Private & group messaging: typing indicators, read receipts, online presence via STOMP/WebSocket. JWT w/ refresh tokens, MongoDB persistence, file sharing.",
    tech: ["Spring Boot", "WebSocket", "React", "MongoDB"],
    gradient: "linear-gradient(135deg, #43e97b, #38f9d7)",
    icon: "💬",
  },
];

const experiences = [
  {
    role: "Member of Technical Staff",
    company: "Zoho Corporation",
    team: "ManageEngine — Endpoint Central",
    period: "Jul 2024 — Present",
    location: "Chennai",
    current: true,
    color: "#818cf8",
    points: [
      "Built crash dump analysis tool integrated with Zoho Desk API — reducing triage time by 60%",
      "Java-based hourly log parser: auto-analyzes tickets, posts root-cause diagnostics",
      "Unified C++ JSON framework (jsoncpp) across 10+ agent components; Grafana dashboards",
    ],
    tags: ["Java", "C++", "Grafana", "WinDbg"],
  },
  {
    role: "Graduate Trainee",
    company: "Zoho Corporation",
    team: "Zoho School of Learning → Incubation",
    period: "Oct 2023 — Jul 2024",
    location: "Tenkasi / Chennai",
    current: false,
    color: "#a78bfa",
    points: [
      "Intensive Java, MySQL, Servlets, JSP training at Zoho School",
      "Incubation: Windows networking (Active Directory) and C/C++ system tools",
    ],
    tags: ["Java", "MySQL", "C/C++", "Windows Server"],
  },
  {
    role: "Programmer Analyst",
    company: "Cognizant",
    team: "Technology Solutions Group",
    period: "Feb 2022 — Oct 2023",
    location: "Remote / Coimbatore",
    current: false,
    color: "#22d3ee",
    points: [
      "Full Stack Java training & enterprise app development",
      "MuleSoft API-led connectivity; built POC apps & responsive web interfaces",
    ],
    tags: ["Java", "MuleSoft", "Full Stack"],
  },
];

const socials = [
  { name: "LinkedIn", url: "https://linkedin.com/in/msamprakash", icon: FaLinkedinIn, color: "#0077b5" },
  { name: "GitHub", url: "https://github.com/Sam-Prakash-M", icon: FaGithub, color: "#e6edf3" },
  { name: "LeetCode", url: "https://leetcode.com/u/Sam_Prakash/", icon: SiLeetcode, color: "#ffa116" },
  { name: "HackerRank", url: "https://hackerrank.com/profile/msamprakash05", icon: FaHackerrank, color: "#2ec866" },
];

/* ═══════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════ */
export default function App() {
  const [active, setActive] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [cursorHover, setCursorHover] = useState(false);
  const [expOpen, setExpOpen] = useState(0);

  // Scroll progress
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  // Hero parallax
  const heroRef = useRef(null);
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(heroProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    const onScroll = () => {
      for (const s of [...SECTIONS].reverse()) {
        const el = document.getElementById(s);
        if (el && el.getBoundingClientRect().top < 250) { setActive(s); break; }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onMouse = (e: MouseEvent) => setCursorPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMouse, { passive: true });
    return () => window.removeEventListener("mousemove", onMouse);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  // Setup magnetic hover for interactive elements
  useEffect(() => {
    const hoverEls = document.querySelectorAll("a, button, .tilt-card");
    const enter = () => setCursorHover(true);
    const leave = () => setCursorHover(false);
    hoverEls.forEach(el => { el.addEventListener("mouseenter", enter); el.addEventListener("mouseleave", leave); });
    return () => hoverEls.forEach(el => { el.removeEventListener("mouseenter", enter); el.removeEventListener("mouseleave", leave); });
  });

  const marqueeSkills = [...allSkills, ...allSkills]; // double for seamless loop

  return (
    <div className="app">
      {/* ── Custom Cursor ── */}
      <motion.div className={`custom-cursor ${cursorHover ? "hover" : ""}`}
        animate={{ x: cursorPos.x - 10, y: cursorPos.y - 10 }}
        transition={{ type: "spring", stiffness: 500, damping: 28, mass: 0.5 }}
      />
      <motion.div className="cursor-ring"
        animate={{
          x: cursorPos.x - (cursorHover ? 30 : 20),
          y: cursorPos.y - (cursorHover ? 30 : 20),
          width: cursorHover ? 60 : 40,
          height: cursorHover ? 60 : 40,
        }}
        transition={{ type: "spring", stiffness: 150, damping: 20, mass: 0.8 }}
      />

      {/* ── Scroll Progress ── */}
      <motion.div className="scroll-progress" style={{ scaleX }} />

      {/* ━━━━━━━━━━━━━ NAVBAR ━━━━━━━━━━━━━ */}
      <nav className="navbar">
        <motion.div className="nav-logo" onClick={() => scrollTo("home")}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        >
          <span className="logo-dot" />
          <span>SAM PRAKASH</span>
        </motion.div>

        <div className="nav-pills">
          {SECTIONS.map((s, i) => (
            <motion.button key={s} className={`nav-pill ${active === s ? "active" : ""}`}
              onClick={() => scrollTo(s)}
              initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.05 }}
            >
              {s}
            </motion.button>
          ))}
        </div>

        <motion.a href="/Sam_Prakash_Latest_Resume.pdf" target="_blank" rel="noopener noreferrer"
          className="nav-resume" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
        >
          <FaDownload size={12} /> Resume
        </motion.a>

        <button className="burger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span className={menuOpen ? "open" : ""} />
          <span className={menuOpen ? "open" : ""} />
        </button>
      </nav>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div className="mob-menu" initial={{ clipPath: "circle(0% at 95% 5%)" }}
            animate={{ clipPath: "circle(150% at 95% 5%)" }} exit={{ clipPath: "circle(0% at 95% 5%)" }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="mob-inner">
              {SECTIONS.map((s, i) => (
                <motion.button key={s} className="mob-link"
                  initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.06 }}
                  onClick={() => { scrollTo(s); setMenuOpen(false); }}
                >
                  <span className="mob-num">0{i + 1}</span>
                  <span>{s}</span>
                </motion.button>
              ))}
              <motion.div className="mob-socials" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
                {socials.map((s, i) => (
                  <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"><s.icon size={20} /></a>
                ))}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ━━━━━━━━━━ HERO ━━━━━━━━━━ */}
      <section id="home" className="hero" ref={heroRef}>
        <motion.div className="hero-bg" style={{ y: heroY, opacity: heroOpacity }}>
          {/* Grid pattern */}
          <div className="hero-grid-pattern" />
          <div className="hero-gradient-orb orb-1" />
          <div className="hero-gradient-orb orb-2" />
        </motion.div>

        <motion.div className="hero-inner" style={{ y: heroY, opacity: heroOpacity }}>
          <motion.div className="hero-eyebrow"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
          >
            <span className="eyebrow-dot" /> BACKEND ENGINEER — JAVA · SPRING BOOT · C++
          </motion.div>

          <div className="hero-name-block">
            {"SAM PRAKASH".split("").map((ch, i) => (
              <motion.span key={i} className="hero-letter"
                initial={{ opacity: 0, y: 80, rotateX: -90 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ delay: 1 + i * 0.04, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                {ch === " " ? "\u00A0" : ch}
              </motion.span>
            ))}
          </div>

          <motion.p className="hero-tagline"
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6, duration: 0.8 }}
          >
            Crafting scalable systems & automation tools<br />
            at <strong>Zoho</strong> & <strong>Cognizant</strong> — 3+ years
          </motion.p>

          <motion.div className="hero-ctas"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.9 }}
          >
            <button className="cta-main" onClick={() => scrollTo("projects")}>
              Explore My Work <FaArrowRight size={14} />
            </button>
            <a href="mailto:msamprakash05@gmail.com" className="cta-outline">Say Hello</a>
          </motion.div>

          <motion.div className="hero-social-strip"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }}
          >
            {socials.map((s, i) => (
              <motion.a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
                className="hero-social" whileHover={{ y: -5, scale: 1.15 }}
                style={{ color: s.color }}
              ><s.icon size={20} /></motion.a>
            ))}
          </motion.div>
        </motion.div>

        <motion.div className="scroll-hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}>
          <motion.div className="scroll-line" animate={{ scaleY: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <span>SCROLL</span>
        </motion.div>
      </section>

      {/* ── Marquee Skills Ribbon ── */}
      <div className="marquee-section">
        <div className="marquee-track">
          <motion.div className="marquee-content" animate={{ x: [0, -50 * allSkills.length] }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          >
            {marqueeSkills.map((s, i) => {
              const Icon = s.icon;
              return (
                <span key={i} className="marquee-item">
                  <Icon size={18} color={s.color} />
                  <span>{s.name}</span>
                </span>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* ━━━━━━━━━━ ABOUT — BENTO GRID ━━━━━━━━━━ */}
      <section id="about" className="sec">
        <div className="container">
          <Reveal>
            <div className="sec-label">
              <span className="sec-num">01</span>
              <span className="sec-line" />
              <span>ABOUT ME</span>
            </div>
          </Reveal>

          <div className="bento">
            <Reveal className="bento-main" delay={0.1}>
              <h2 className="bento-heading">
                I build systems<br />that <em>matter</em>.
              </h2>
              <p className="bento-text">
                Backend engineer with 3+ years at <strong>Zoho</strong> &amp; <strong>Cognizant</strong>.
                Building scalable Java apps, crash analysis pipelines, and system-level C/C++ tools.
                Currently at ManageEngine Endpoint Central — integrating crash dump analysis with Zoho Desk,
                building unified JSON frameworks, and Grafana dashboards.
              </p>
            </Reveal>

            {[
              { n: 3, s: "+", l: "Years of\nExperience", emoji: "💼" },
              { n: 60, s: "%", l: "Triage Time\nReduced", emoji: "⚡" },
              { n: 10, s: "+", l: "Agent\nComponents", emoji: "🧩" },
              { n: 4, s: "+", l: "Full\nProjects", emoji: "🚀" },
            ].map((d, i) => (
              <Reveal key={i} className="bento-stat" delay={0.15 + i * 0.08}>
                <span className="bento-emoji">{d.emoji}</span>
                <span className="bento-big"><Counter end={d.n} suffix={d.s} /></span>
                <span className="bento-label">{d.l}</span>
              </Reveal>
            ))}

            <Reveal className="bento-tech" delay={0.3}>
              <span className="bento-tech-title">CORE STACK</span>
              <div className="bento-tech-icons">
                {[
                  { icon: FaJava, color: "#f89820" },
                  { icon: SiSpringboot, color: "#6db33f" },
                  { icon: SiCplusplus, color: "#00599C" },
                  { icon: SiMongodb, color: "#4db33d" },
                  { icon: SiRedis, color: "#dc382d" },
                  { icon: FaDocker, color: "#2496ed" },
                ].map((s, i) => <s.icon key={i} size={24} color={s.color} />)}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━ SKILLS ━━━━━━━━━━ */}
      <section id="skills" className="sec">
        <div className="container">
          <Reveal>
            <div className="sec-label">
              <span className="sec-num">02</span>
              <span className="sec-line" />
              <span>SKILLS & TOOLS</span>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="sec-heading">My <em>toolkit</em>.</h2>
          </Reveal>

          <div className="skills-hex-grid">
            {allSkills.map((skill, i) => {
              const Icon = skill.icon;
              return (
                <Reveal key={i} delay={i * 0.03}>
                  <motion.div className="skill-hex" whileHover={{ scale: 1.1, y: -8 }}
                    style={{ "--sc": skill.color } as React.CSSProperties}
                  >
                    <div className="hex-icon"><Icon size={26} color={skill.color} /></div>
                    <span className="hex-name">{skill.name}</span>
                  </motion.div>
                </Reveal>
              );
            })}
          </div>

          <Reveal delay={0.2}>
            <div className="concepts-row">
              {["Microservices", "REST APIs", "Design Patterns", "JVM Tuning", "Multithreading", "CI/CD",
                "JUnit/Mockito", "Agile", "System Design", "DSA", "WebSocket", "Spring Security", "OAuth2/JWT", "Crash Analysis"
              ].map((c, i) => (
                <motion.span key={i} className="concept-chip" whileHover={{ scale: 1.06 }}>{c}</motion.span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ━━━━━━━━━━ PROJECTS ━━━━━━━━━━ */}
      <section id="projects" className="sec">
        <div className="container">
          <Reveal>
            <div className="sec-label">
              <span className="sec-num">03</span>
              <span className="sec-line" />
              <span>PROJECTS</span>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="sec-heading">Things I've <em>built</em>.</h2>
          </Reveal>

          <div className="proj-grid">
            {projects.map((p, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <TiltCard className="proj-card">
                  <div className="proj-top" style={{ background: p.gradient }}>
                    <span className="proj-idx">{String(i + 1).padStart(2, "0")}</span>
                    <span className="proj-icon">{p.icon}</span>
                  </div>
                  <div className="proj-bottom">
                    <h3 className="proj-title">{p.title}</h3>
                    <p className="proj-desc">{p.desc}</p>
                    <div className="proj-tags">
                      {p.tech.map((t, j) => <span key={j} className="proj-tag">{t}</span>)}
                    </div>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━ EXPERIENCE ━━━━━━━━━━ */}
      <section id="experience" className="sec">
        <div className="container">
          <Reveal>
            <div className="sec-label">
              <span className="sec-num">04</span>
              <span className="sec-line" />
              <span>EXPERIENCE</span>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="sec-heading">Where I've <em>worked</em>.</h2>
          </Reveal>

          <div className="exp-list">
            {experiences.map((exp, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <motion.div className={`exp-row ${expOpen === i ? "open" : ""}`}
                  onClick={() => setExpOpen(expOpen === i ? -1 : i)}
                  layout
                >
                  <div className="exp-top-row">
                    <div className="exp-left">
                      <div className="exp-indicator" style={{ background: exp.color }} />
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
                      <motion.div className="exp-body" initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35 }}
                      >
                        <ul className="exp-bullets">
                          {exp.points.map((pt, j) => <li key={j}>{pt}</li>)}
                        </ul>
                        <div className="exp-chips">
                          {exp.tags.map((t, j) => <span key={j} className="concept-chip sm">{t}</span>)}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Reveal>
            ))}
          </div>

          {/* Edu / Achievements / Certs */}
          <div className="info-bento">
            <Reveal className="info-block" delay={0.1}>
              <h3 className="info-heading">🎓 Education</h3>
              <div className="info-entry">
                <strong>BE Mechatronics Engineering</strong>
                <span>Thiagarajar College of Engineering, Madurai · 2018–2022</span>
              </div>
              <div className="info-entry">
                <strong>HSC — Amir Jamal HSS, Tirunelveli</strong>
                <span>2017–2018 · <em className="gold">200/200 Mathematics 🏅</em></span>
              </div>
            </Reveal>

            <Reveal className="info-block" delay={0.15}>
              <h3 className="info-heading">🏆 Achievements</h3>
              <div className="achiev-row"><span className="achiev-badge">200/200</span> Maths — 12th HSC</div>
              <div className="achiev-row"><span className="achiev-badge">100/100</span> Maths — 10th SSLC</div>
            </Reveal>

            <Reveal className="info-block" delay={0.2}>
              <h3 className="info-heading">📜 Certifications</h3>
              {["Java SE — HackerRank", "Spring Boot — Udemy", "Problem Solving — HackerRank", "SQL — HackerRank"].map((c, i) => (
                <div key={i} className="cert-row"><span className="cert-bullet" />{c}</div>
              ))}
            </Reveal>

            <Reveal className="info-block" delay={0.25}>
              <h3 className="info-heading">🔗 Profiles</h3>
              {[
                { name: "LeetCode", user: "Sam_Prakash", url: "https://leetcode.com/u/Sam_Prakash/", icon: SiLeetcode, color: "#ffa116" },
                { name: "HackerRank", user: "msamprakash05", url: "https://hackerrank.com/profile/msamprakash05", icon: FaHackerrank, color: "#2ec866" },
                { name: "GitHub", user: "Sam-Prakash-M", url: "https://github.com/Sam-Prakash-M", icon: FaGithub, color: "#e6edf3" },
              ].map((p, i) => (
                <a key={i} href={p.url} target="_blank" rel="noopener noreferrer" className="profile-row">
                  <p.icon size={16} color={p.color} />
                  <span>{p.name}</span>
                  <span className="profile-handle">@{p.user}</span>
                </a>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━ CONTACT ━━━━━━━━━━ */}
      <section id="contact" className="sec contact-sec">
        <div className="container">
          <Reveal>
            <div className="sec-label center">
              <span className="sec-num">05</span>
              <span className="sec-line" />
              <span>CONTACT</span>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="contact-big-text">
              Let's work<br /><em>together</em>.
            </h2>
          </Reveal>

          <Reveal delay={0.15}>
            <p className="contact-sub">
              Open to Java backend roles, engineering challenges, or collaborations.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="contact-grid">
              <a href="mailto:msamprakash05@gmail.com" className="contact-block">
                <FaEnvelope size={22} />
                <span className="contact-block-label">EMAIL</span>
                <span className="contact-block-value">msamprakash05@gmail.com</span>
              </a>
              <div className="contact-block">
                <FaPhone size={22} />
                <span className="contact-block-label">PHONE</span>
                <span className="contact-block-value">+91 6385812669</span>
              </div>
              <div className="contact-block">
                <FaMapMarkerAlt size={22} />
                <span className="contact-block-label">LOCATION</span>
                <span className="contact-block-value">Chennai, India</span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.25}>
            <div className="contact-socials">
              {socials.map((s, i) => (
                <motion.a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
                  className="contact-social" whileHover={{ y: -6, scale: 1.08 }}
                  style={{ "--soc": s.color } as React.CSSProperties}
                >
                  <s.icon size={20} />
                  <span>{s.name}</span>
                </motion.a>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <a href="mailto:msamprakash05@gmail.com" className="cta-main big">
              <FaEnvelope /> Send Me a Message <FaArrowRight />
            </a>
          </Reveal>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="container footer-grid">
          <div className="footer-brand">
            <span className="logo-dot" />
            <span>SAM PRAKASH</span>
          </div>
          <p className="footer-copy">© 2026 · Built with ❤️ and Java</p>
          <div className="footer-socials">
            {socials.map((s, i) => (
              <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"><s.icon size={16} /></a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

