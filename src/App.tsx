import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  FaJava, FaReact, FaDocker, FaGitAlt, FaLinkedinIn,
  FaGithub, FaHackerrank, FaDatabase, FaEnvelope, FaPhone,
  FaMapMarkerAlt, FaDownload, FaExternalLinkAlt, FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import {
  SiSpringboot, SiPostgresql, SiMongodb, SiRedis,
  SiJavascript, SiCplusplus, SiApachekafka, SiRabbitmq,
  SiHibernate, SiJenkins, SiGrafana, SiPostman, SiMysql,
  SiApachetomcat, SiRust, SiLeetcode, SiTypescript, SiApachemaven,
} from "react-icons/si";
import "./App.css";

// ─── Scroll helper ───
const scrollTo = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

// ─── Animated section wrapper ───
function Section({
  id, children, className = "",
}: { id: string; children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <section id={id} ref={ref} className={`section ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="container"
      >
        {children}
      </motion.div>
    </section>
  );
}

// ─── Stagger reveal children ───
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

// ─── Typewriter ───
function Typewriter({ words }: { words: string[] }) {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[idx];
    const speed = deleting ? 40 : 80;
    const timer = setTimeout(() => {
      if (!deleting) {
        setText(word.slice(0, text.length + 1));
        if (text.length + 1 === word.length) setTimeout(() => setDeleting(true), 1800);
      } else {
        setText(word.slice(0, text.length - 1));
        if (text.length === 0) { setDeleting(false); setIdx((idx + 1) % words.length); }
      }
    }, speed);
    return () => clearTimeout(timer);
  }, [text, deleting, idx, words]);

  return (
    <span className="typewriter">
      {text}<span className="cursor">|</span>
    </span>
  );
}

// ─── Counter animation ───
function Counter({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let current = 0;
    const step = end / 60;
    const timer = setInterval(() => {
      current += step;
      if (current >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, 20);
    return () => clearInterval(timer);
  }, [isInView, end]);

  return <span ref={ref}>{count}{suffix}</span>;
}

// ================================================================
// DATA
// ================================================================
const SECTIONS = ["home", "about", "skills", "projects", "experience", "contact"];

const skillCategories = [
  {
    name: "Languages",
    skills: [
      { name: "Java", icon: FaJava, color: "#f89820" },
      { name: "C / C++", icon: SiCplusplus, color: "#00599C" },
      { name: "JavaScript", icon: SiJavascript, color: "#f7df1e" },
      { name: "TypeScript", icon: SiTypescript, color: "#3178c6" },
      { name: "SQL", icon: FaDatabase, color: "#336791" },
      { name: "Rust", icon: SiRust, color: "#ce412b" },
    ],
  },
  {
    name: "Frameworks",
    skills: [
      { name: "Spring Boot", icon: SiSpringboot, color: "#6db33f" },
      { name: "Hibernate", icon: SiHibernate, color: "#59666c" },
      { name: "React JS", icon: FaReact, color: "#61dafb" },
      { name: "Servlets/JSP", icon: FaJava, color: "#e76f00" },
      { name: "RabbitMQ", icon: SiRabbitmq, color: "#ff6600" },
      { name: "Apache Kafka", icon: SiApachekafka, color: "#231f20" },
    ],
  },
  {
    name: "DB & DevOps",
    skills: [
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
    ],
  },
];

const projects = [
  {
    title: "Railway Booking System",
    desc: "Full-featured train reservation platform with smart search, PNR tracking, QR-based e-ticketing, dynamic fare calculation, and waitlist auto-promotion. Integrated PayPal, Razorpay & Cashfree payment gateways; jBCrypt password hashing, session-based auth, multi-step OTP recovery via JavaMail SMTP.",
    tech: ["Java", "Jakarta EE", "JSP", "Servlets", "MongoDB"],
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    icon: "🚂",
  },
  {
    title: "E-Commerce Microservices",
    desc: "Distributed backend architecture with independent services (Product, Order, Auth, Payment) communicating via RabbitMQ; Eureka service discovery and Spring Cloud Gateway for intelligent routing. Redis caching cut response times by 45%; Resilience4j circuit breakers for fault tolerance; fully containerized with Docker Compose.",
    tech: ["Spring Boot", "Docker", "RabbitMQ", "Redis", "Eureka"],
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    icon: "🛒",
  },
  {
    title: "URL Shortener Service",
    desc: "High-performance REST API with Base62 encoding, custom aliases, link expiration, and click analytics with geo-tracking. Redis caching achieves sub-10ms redirects; Bucket4j rate limiting, Spring Security API key authentication, and comprehensive OpenAPI/Swagger documentation.",
    tech: ["Spring Boot", "PostgreSQL", "Redis", "Spring Security"],
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    icon: "🔗",
  },
  {
    title: "Real-Time Chat Application",
    desc: "Private and group messaging with typing indicators, read receipts, and live online presence via STOMP over WebSocket. JWT authentication with refresh token rotation, MongoDB message persistence, paginated history API, and file/image sharing support.",
    tech: ["Spring Boot", "WebSocket", "React", "MongoDB", "JWT"],
    gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
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
    color: "#6366f1",
    points: [
      "Built crash dump analysis tool integrated with Zoho Desk API — parses tickets, fetches PDBs, runs WinDbg CLI resolution, reducing triage time by 60%",
      "Developed Java-based hourly log parser that auto-analyzes tickets, identifies root causes, and posts diagnostics back to Desk",
      "Created unified JSON framework in C++ using jsoncpp across 10+ agent components; integrated crash analytics into Grafana dashboards",
    ],
    tags: ["Java", "C++", "Grafana", "WinDbg", "Zoho Desk API"],
  },
  {
    role: "Graduate Trainee",
    company: "Zoho Corporation",
    team: "Zoho School of Learning → Incubation",
    period: "Oct 2023 — Jul 2024",
    location: "Tenkasi / Chennai",
    current: false,
    color: "#8b5cf6",
    points: [
      "Completed intensive Java, MySQL, Servlets, JSP training at Zoho School of Learning",
      "Transitioned to incubation program focusing on Windows networking (Active Directory) and C/C++ system-level tools",
    ],
    tags: ["Java", "MySQL", "C/C++", "Windows Server", "Active Directory"],
  },
  {
    role: "Programmer Analyst",
    company: "Cognizant",
    team: "Technology Solutions Group",
    period: "Feb 2022 — Oct 2023",
    location: "Remote / Coimbatore",
    current: false,
    color: "#06b6d4",
    points: [
      "Full Stack Java training program with enterprise application development",
      "MuleSoft API-led connectivity; built POC applications and responsive web interfaces",
    ],
    tags: ["Java", "MuleSoft", "Full Stack", "API Development"],
  },
];

const socials = [
  { name: "LinkedIn", url: "https://linkedin.com/in/msamprakash", icon: FaLinkedinIn, color: "#0077b5" },
  { name: "GitHub", url: "https://github.com/Sam-Prakash-M", icon: FaGithub, color: "#e6edf3" },
  { name: "LeetCode", url: "https://leetcode.com/u/Sam_Prakash/", icon: SiLeetcode, color: "#ffa116" },
  { name: "HackerRank", url: "https://hackerrank.com/profile/msamprakash05", icon: FaHackerrank, color: "#2ec866" },
];

const coreConcepts = [
  "Microservices", "REST APIs", "Design Patterns", "JVM Tuning",
  "Multithreading", "CI/CD", "JUnit / Mockito", "Agile / Scrum",
  "JDBC", "Crash Dump Analysis", "System Design", "Data Structures",
  "STOMP / WebSocket", "Spring Security", "OAuth2 / JWT",
];

// ================================================================
// APP
// ================================================================
export default function App() {
  const [active, setActive] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [mouse, setMouse] = useState({ x: -500, y: -500 });
  const [skillTab, setSkillTab] = useState(0);
  const [expOpen, setExpOpen] = useState(0);

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
    const onMouse = (e: MouseEvent) => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMouse, { passive: true });
    return () => window.removeEventListener("mousemove", onMouse);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <div className="portfolio">
      {/* ─── Cursor Glow ─── */}
      <div className="cursor-glow" style={{ left: mouse.x - 200, top: mouse.y - 200 }} />

      {/* ─── Floating Particles ─── */}
      <div className="particles-container">
        {Array.from({ length: 30 }).map((_, i) => (
          <div key={i} className="particle" style={{
            width: Math.random() * 3 + 1 + "px",
            height: Math.random() * 3 + 1 + "px",
            left: Math.random() * 100 + "%",
            top: Math.random() * 100 + "%",
            animationDuration: 12 + Math.random() * 18 + "s",
            animationDelay: -Math.random() * 15 + "s",
            opacity: Math.random() * 0.3 + 0.05,
          }} />
        ))}
      </div>

      {/* ━━━ NAVIGATION ━━━ */}
      <nav className="navbar">
        <motion.div
          className="nav-brand"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => scrollTo("home")}
        >
          <span className="brand-bracket">&lt;</span>
          <span className="brand-name">Sam</span>
          <span className="brand-slash"> /</span>
          <span className="brand-bracket">&gt;</span>
        </motion.div>

        <div className="nav-links">
          {SECTIONS.map((s, i) => (
            <motion.button
              key={s}
              className={`nav-link ${active === s ? "active" : ""}`}
              onClick={() => scrollTo(s)}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              {s}
              {active === s && <motion.div className="nav-indicator" layoutId="nav-indicator" />}
            </motion.button>
          ))}
        </div>

        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span className={`menu-bar ${menuOpen ? "open" : ""}`} />
          <span className={`menu-bar ${menuOpen ? "open" : ""}`} />
          <span className={`menu-bar ${menuOpen ? "open" : ""}`} />
        </button>
      </nav>

      {/* ─── Mobile Menu ─── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {SECTIONS.map((s, i) => (
              <motion.button
                key={s}
                className="mobile-link"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => { scrollTo(s); setMenuOpen(false); }}
              >
                {s}
              </motion.button>
            ))}
            <div className="mobile-socials">
              {socials.map((s, i) => (
                <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" style={{ color: s.color }}>
                  <s.icon size={22} />
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ━━━━━━ HERO ━━━━━━ */}
      <section id="home" className="section hero-section">
        <div className="container">
          <div className="hero-layout">
            <motion.div
              className="hero-content"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.div
                className="hero-badge"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <span className="badge-dot" />
                Available for opportunities
              </motion.div>

              <h1 className="hero-heading">
                Hi, I'm <br />
                <span className="gradient-text">Sam Prakash</span>
              </h1>

              <div className="hero-type">
                <Typewriter words={[
                  "Backend Engineer",
                  "Java Specialist",
                  "Spring Boot Developer",
                  "System-level Programmer",
                  "Microservices Architect",
                ]} />
              </div>

              <p className="hero-desc">
                3+ years building crash analysis pipelines, automation tools, and enterprise
                backend systems at <strong>Zoho</strong> &amp; <strong>Cognizant</strong>.
              </p>

              <div className="hero-actions">
                <button className="btn-glow" onClick={() => scrollTo("projects")}>
                  View My Work
                  <FaExternalLinkAlt size={12} style={{ marginLeft: 8 }} />
                </button>
                <a href="mailto:msamprakash05@gmail.com" className="btn-glass">
                  Get In Touch
                </a>
                <a
                  href="/Sam_Prakash_Latest_Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-glass"
                >
                  <FaDownload size={13} style={{ marginRight: 8 }} />
                  Resume
                </a>
              </div>

              <div className="hero-socials">
                {socials.map((s, i) => (
                  <motion.a
                    key={i}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icon-btn"
                    style={{ "--accent": s.color } as React.CSSProperties}
                    whileHover={{ y: -4, scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.08 }}
                    title={s.name}
                  >
                    <s.icon size={18} />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="hero-visual"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="avatar-container">
                <div className="avatar-bg-glow" />
                <div className="orbit-ring">
                  <div className="orbit-dot" />
                </div>
                <div className="orbit-ring orbit-ring-2">
                  <div className="orbit-dot orbit-dot-2" />
                </div>
                <div className="avatar-main">
                  <span className="avatar-initials">SP</span>
                </div>
              </div>

              <div className="floating-badges">
                {[
                  { text: "Java", icon: "☕", pos: "tl" },
                  { text: "Spring", icon: "🍃", pos: "tr" },
                  { text: "C++", icon: "⚡", pos: "bl" },
                  { text: "REST", icon: "🔥", pos: "br" },
                ].map((b, i) => (
                  <motion.div
                    key={i}
                    className={`floating-badge pos-${b.pos}`}
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
                  >
                    <span className="badge-icon">{b.icon}</span>
                    <span className="badge-label">{b.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ━━━━━━ ABOUT ━━━━━━ */}
      <Section id="about">
        <div className="section-header">
          <span className="section-tag">01 / About</span>
          <h2 className="section-title">
            Building systems that <span className="gradient-text">matter</span>.
          </h2>
        </div>

        <div className="about-layout">
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <motion.p className="about-para" variants={fadeUp}>
              Backend engineer with 3+ years at <strong>Zoho Corporation</strong> and <strong>Cognizant</strong>,
              building scalable Java applications, automating crash analysis pipelines, and developing system-level tools in C/C++.
            </motion.p>
            <motion.p className="about-para" variants={fadeUp}>
              Skilled in Spring Boot, RESTful APIs, and enterprise Java with a strong foundation in debugging,
              performance optimization, and cross-platform development. Passionate about microservices architecture
              and building tools that solve real engineering problems.
            </motion.p>
            <motion.p className="about-para" variants={fadeUp}>
              Currently at Zoho's <strong>ManageEngine Endpoint Central</strong> team
              — building crash dump analysis tools integrated with Zoho Desk API, unified C++ JSON frameworks
              across 10+ agent components, and crash analytics dashboards with Grafana.
            </motion.p>
          </motion.div>

          <motion.div
            className="stats-grid"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {[
              { n: 3, s: "+", label: "Years Exp.", icon: "💼" },
              { n: 60, s: "%", label: "Triage Saved", icon: "⚡" },
              { n: 10, s: "+", label: "Components", icon: "🧩" },
              { n: 4, s: "+", label: "Projects", icon: "🚀" },
            ].map((stat, i) => (
              <motion.div key={i} className="stat-card" variants={fadeUp} whileHover={{ y: -6, scale: 1.02 }}>
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-number"><Counter end={stat.n} suffix={stat.s} /></div>
                <div className="stat-label">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* ━━━━━━ SKILLS ━━━━━━ */}
      <Section id="skills">
        <div className="section-header">
          <span className="section-tag">02 / Skills</span>
          <h2 className="section-title">
            My <span className="gradient-text">toolkit</span>.
          </h2>
        </div>

        <div className="skill-tab-bar">
          {skillCategories.map((cat, i) => (
            <button
              key={i}
              className={`skill-tab ${skillTab === i ? "active" : ""}`}
              onClick={() => setSkillTab(i)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <motion.div
          className="skills-grid"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          key={skillTab}
        >
          {skillCategories[skillTab].skills.map((skill, i) => {
            const Icon = skill.icon;
            return (
              <motion.div
                key={`${skillTab}-${i}`}
                className="skill-card"
                variants={fadeUp}
                whileHover={{ y: -8, scale: 1.04 }}
                style={{ "--skill-color": skill.color } as React.CSSProperties}
              >
                <div className="skill-icon-wrap">
                  <Icon size={28} color={skill.color} />
                </div>
                <span className="skill-name">{skill.name}</span>
                <div className="skill-glow" />
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          className="concepts-section"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <span className="concepts-label">CORE CONCEPTS</span>
          <div className="concepts-wrap">
            {coreConcepts.map((c, i) => (
              <motion.span
                key={i}
                className="concept-pill"
                whileHover={{ scale: 1.05, y: -2 }}
              >
                {c}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </Section>

      {/* ━━━━━━ PROJECTS ━━━━━━ */}
      <Section id="projects">
        <div className="section-header">
          <span className="section-tag">03 / Projects</span>
          <h2 className="section-title">
            Things I've <span className="gradient-text">built</span>.
          </h2>
        </div>

        <motion.div
          className="projects-grid"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {projects.map((p, i) => (
            <motion.div
              key={i}
              className="project-card"
              variants={fadeUp}
              whileHover={{ y: -10 }}
            >
              <div className="project-cover" style={{ background: p.gradient }}>
                <span className="project-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="project-emoji">{p.icon}</span>
              </div>
              <div className="project-body">
                <h3 className="project-title">{p.title}</h3>
                <p className="project-desc">{p.desc}</p>
                <div className="project-tech">
                  {p.tech.map((t, j) => (
                    <span key={j} className="tech-chip">{t}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* ━━━━━━ EXPERIENCE ━━━━━━ */}
      <Section id="experience">
        <div className="section-header">
          <span className="section-tag">04 / Experience</span>
          <h2 className="section-title">
            Where I've <span className="gradient-text">worked</span>.
          </h2>
        </div>

        <div className="timeline">
          {experiences.map((exp, i) => (
            <motion.div
              key={i}
              className="timeline-item"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
            >
              <div className={`timeline-dot ${exp.current ? "current" : ""}`} />
              <div
                className="timeline-card"
                style={{ borderLeftColor: exp.color }}
                onClick={() => setExpOpen(expOpen === i ? -1 : i)}
              >
                <div className="timeline-top">
                  <div>
                    <h3 className="exp-role">{exp.role}</h3>
                    <p className="exp-company" style={{ color: exp.color }}>{exp.company}</p>
                    {exp.team && <p className="exp-team">{exp.team}</p>}
                  </div>
                  <div className="exp-meta">
                    <span className="exp-period">{exp.period}</span>
                    <span className="exp-location"><FaMapMarkerAlt size={10} /> {exp.location}</span>
                  </div>
                </div>

                <AnimatePresence>
                  {expOpen === i && (
                    <motion.div
                      className="exp-details"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35 }}
                    >
                      <ul className="exp-points">
                        {exp.points.map((pt, j) => (
                          <li key={j}>{pt}</li>
                        ))}
                      </ul>
                      <div className="exp-tags">
                        {exp.tags.map((t, j) => <span key={j} className="concept-pill small">{t}</span>)}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button className="exp-toggle">
                  {expOpen === i ? <><FaChevronUp size={10} /> collapse</> : <><FaChevronDown size={10} /> expand</>}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Education & Achievements */}
        <motion.div
          className="info-cards"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <motion.div className="info-card" variants={fadeUp}>
            <h3 className="info-card-title">🎓 Education</h3>
            <div className="info-item">
              <strong>BE in Mechatronics Engineering</strong>
              <span>Thiagarajar College of Engineering — Madurai</span>
              <span className="info-date">2018 – 2022</span>
            </div>
            <div className="info-item">
              <strong>HSC (Higher Secondary)</strong>
              <span>Amir Jamal HSS — Tirunelveli</span>
              <span className="info-date">2017 – 2018</span>
              <span className="info-highlight">200/200 in Mathematics 🏅</span>
            </div>
          </motion.div>

          <motion.div className="info-card" variants={fadeUp}>
            <h3 className="info-card-title">🏆 Achievements</h3>
            <div className="achievement-item">
              <span className="achievement-badge gold">200/200</span>
              <span>Mathematics — 12th HSC Board Exam</span>
            </div>
            <div className="achievement-item">
              <span className="achievement-badge gold">100/100</span>
              <span>Mathematics — 10th SSLC Board Exam</span>
            </div>
          </motion.div>

          <motion.div className="info-card" variants={fadeUp}>
            <h3 className="info-card-title">📜 Certifications</h3>
            {[
              "Java SE — HackerRank",
              "Spring Boot — Udemy",
              "Problem Solving — HackerRank",
              "SQL — HackerRank",
            ].map((c, i) => (
              <div key={i} className="cert-item">
                <div className="cert-dot" />
                <span>{c}</span>
              </div>
            ))}
          </motion.div>

          <motion.div className="info-card" variants={fadeUp}>
            <h3 className="info-card-title">🔗 Coding Profiles</h3>
            {[
              { name: "LeetCode", user: "Sam_Prakash", url: "https://leetcode.com/u/Sam_Prakash/", color: "#ffa116", icon: SiLeetcode },
              { name: "HackerRank", user: "msamprakash05", url: "https://hackerrank.com/profile/msamprakash05", color: "#2ec866", icon: FaHackerrank },
              { name: "GitHub", user: "Sam-Prakash-M", url: "https://github.com/Sam-Prakash-M", color: "#e6edf3", icon: FaGithub },
            ].map((p, i) => (
              <a key={i} href={p.url} target="_blank" rel="noopener noreferrer" className="profile-link" style={{ "--link-color": p.color } as React.CSSProperties}>
                <p.icon size={16} color={p.color} />
                <span>{p.name}</span>
                <span className="profile-user">@{p.user}</span>
              </a>
            ))}
          </motion.div>
        </motion.div>
      </Section>

      {/* ━━━━━━ CONTACT ━━━━━━ */}
      <Section id="contact" className="contact-section">
        <div className="section-header center">
          <span className="section-tag">05 / Contact</span>
          <h2 className="section-title">
            Let's <span className="gradient-text">connect</span>.
          </h2>
          <p className="section-subtitle">
            Open to Java backend roles, engineering challenges, or collaboration opportunities.
            Let's build something great together.
          </p>
        </div>

        <motion.div
          className="contact-card"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="contact-info-grid">
            <div className="contact-info-item">
              <FaEnvelope className="contact-icon" />
              <span className="contact-label">Email</span>
              <a href="mailto:msamprakash05@gmail.com" className="contact-value link">
                msamprakash05@gmail.com
              </a>
            </div>
            <div className="contact-info-item">
              <FaPhone className="contact-icon" />
              <span className="contact-label">Phone</span>
              <span className="contact-value">+91 6385812669</span>
            </div>
            <div className="contact-info-item">
              <FaMapMarkerAlt className="contact-icon" />
              <span className="contact-label">Location</span>
              <span className="contact-value">Chennai, India</span>
            </div>
          </div>

          <div className="contact-socials">
            {socials.map((s, i) => (
              <motion.a
                key={i}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-social-btn"
                style={{ "--btn-color": s.color } as React.CSSProperties}
                whileHover={{ y: -4, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <s.icon size={18} />
                <span>{s.name}</span>
              </motion.a>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="cta-wrap"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <a href="mailto:msamprakash05@gmail.com" className="btn-glow large">
            <FaEnvelope style={{ marginRight: 10 }} /> Send Me an Email
          </a>
        </motion.div>
      </Section>

      {/* ━━━ Footer ━━━ */}
      <footer className="footer">
        <div className="footer-inner">
          <span className="footer-brand">
            <span className="brand-bracket">&lt;</span>
            <span className="brand-name">Sam</span>
            <span className="brand-slash"> /</span>
            <span className="brand-bracket">&gt;</span>
          </span>
          <p className="footer-text">© 2026 Sam Prakash M — Built with ❤️ and Java</p>
          <div className="footer-links">
            {socials.map((s, i) => (
              <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className="footer-social" title={s.name}>
                <s.icon size={16} />
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

