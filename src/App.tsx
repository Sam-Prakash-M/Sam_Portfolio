import { useState, useEffect, useRef } from "react";
import "./App.css";

const SECTIONS = ["home", "about", "skills", "projects", "experience", "contact"];
const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

function useInView(t = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: t });
    obs.observe(el);
    return () => obs.disconnect();
  }, [t]);
  return [ref, v] as const;
}

function Counter({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [c, setC] = useState(0);
  const [ref, v] = useInView();
  useEffect(() => {
    if (!v) return;
    let s = 0;
    const step = end / 80;
    const t = setInterval(() => {
      s += step;
      if (s >= end) { setC(end); clearInterval(t); } else setC(Math.floor(s));
    }, 16);
    return () => clearInterval(t);
  }, [v, end]);
  return <span ref={ref}>{c}{suffix}</span>;
}

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const [ref, v] = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: v ? 1 : 0,
        transform: v ? "translateY(0)" : "translateY(30px)",
        transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

function SkillBar({ name, level, color }: { name: string; level: number; color: string }) {
  const [ref, v] = useInView();
  return (
    <div ref={ref} className="skill-card">
      <div className="skill-header">
        <span className="skill-name">{name}</span>
        <span className="skill-pct" style={{ color }}>{level}%</span>
      </div>
      <div className="bar-track">
        <div className="bar-fill" style={{ width: v ? level + "%" : "0%", background: `linear-gradient(90deg, ${color}, ${color}66)` }} />
      </div>
    </div>
  );
}

// ===== DATA =====
const skills = [
  {
    cat: "Languages", items: [
      { name: "Java (Core & Advanced)", level: 95, color: "#f89820" },
      { name: "C / C++", level: 88, color: "#00599C" },
      { name: "JavaScript", level: 85, color: "#f7df1e" },
      { name: "SQL", level: 90, color: "#336791" },
      { name: "Rust", level: 50, color: "#ce412b" },
    ]
  },
  {
    cat: "Frameworks", items: [
      { name: "Spring Boot", level: 90, color: "#6db33f" },
      { name: "Spring MVC / Data JPA", level: 87, color: "#6db33f" },
      { name: "Hibernate", level: 85, color: "#59666c" },
      { name: "Servlets / JSP", level: 88, color: "#e76f00" },
      { name: "React JS", level: 70, color: "#61dafb" },
    ]
  },
  {
    cat: "DB & Tools", items: [
      { name: "MySQL / PostgreSQL", level: 90, color: "#336791" },
      { name: "MongoDB", level: 75, color: "#4db33d" },
      { name: "Redis", level: 72, color: "#dc382d" },
      { name: "Docker / Jenkins", level: 68, color: "#2496ed" },
      { name: "Git / Maven", level: 88, color: "#f05032" },
    ]
  },
];

const projects = [
  {
    title: "Railway Booking System",
    desc: "End-to-end reservation platform with authentication, seat search, booking management, admin panel, dynamic fare calculation, JDBC pooling, and CSRF protection.",
    tech: ["Java", "Servlets", "JSP", "MySQL"],
    color: "#6366f1",
    icon: "🚂",
  },
  {
    title: "E-Commerce Microservices",
    desc: "Microservices backend (Product, Order, Auth, Payment) with RabbitMQ messaging, Resilience4j circuit breakers, Redis caching reducing API response by 45%.",
    tech: ["Spring Boot", "Docker", "RabbitMQ", "Redis"],
    color: "#ec4899",
    icon: "🛒",
  },
  {
    title: "URL Shortener Service",
    desc: "High-throughput shortener with Base62 encoding, custom aliases, expiration policies, click analytics, sub-10ms redirect via Redis, Bucket4j rate limiting.",
    tech: ["Spring Boot", "MongoDB", "Redis"],
    color: "#06b6d4",
    icon: "🔗",
  },
  {
    title: "Real-Time Chat App",
    desc: "Messaging platform with private/group chats, typing indicators, read receipts via STOMP over WebSocket, JWT auth, paginated history.",
    tech: ["Spring Boot", "WebSocket", "React", "PostgreSQL"],
    color: "#10b981",
    icon: "💬",
  },
];

const experience = [
  {
    role: "Member of Technical Staff",
    co: "Zoho Corporation",
    team: "ManageEngine Endpoint Central — UEMS Agent Framework",
    period: "Jul 2024 — Present",
    loc: "Chennai",
    current: true,
    color: "#6366f1",
    pts: [
      "Built automated crash dump analysis tool with Zoho Desk API — reduces triage time by 60%",
      "Developed Java hourly log parser for auto-diagnosing support tickets",
      "Created C++ JSON framework using jsoncpp across 10+ agent components",
      "Integrated crash analytics into Grafana + built Servlet/JSP dashboard",
    ],
    tags: ["Java", "C++", "Grafana", "WinDbg"],
  },
  {
    role: "Incubation Trainee",
    co: "Zoho Corporation",
    team: undefined,
    period: "Apr — Jul 2024",
    loc: "Chennai",
    current: false,
    color: "#8b5cf6",
    pts: [
      "Gained expertise in Windows networking (Domains, Active Directory) and built C/C++ network diagnostic tools",
    ],
    tags: ["C/C++", "Windows Server"],
  },
  {
    role: "Programmer Analyst",
    co: "Cognizant",
    team: undefined,
    period: "Feb 2022 — Oct 2023",
    loc: "Remote / Coimbatore",
    current: false,
    color: "#06b6d4",
    pts: [
      "Full Stack Java & MuleSoft API training; built POC apps using Anypoint Platform",
      "Developed responsive web interfaces with HTML5, CSS3, Bootstrap",
    ],
    tags: ["Java", "MuleSoft", "HTML/CSS"],
  },
];

const socials = [
  { name: "LinkedIn", url: "https://linkedin.com/in/msamprakash", c: "#0077b5" },
  { name: "GitHub", url: "https://github.com/Sam-Prakash-M", c: "#a78bfa" },
  { name: "LeetCode", url: "https://leetcode.com/u/Sam_Prakash/", c: "#ffa116" },
  { name: "HackerRank", url: "https://hackerrank.com/profile/msamprakash05", c: "#2ec866" },
  { name: "Portfolio", url: "https://samprakash.vercel.app", c: "#6366f1" },
];

export default function App() {
  const [active, setActive] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [mouse, setMouse] = useState({ x: -500, y: -500 });
  const [sTab, setSTab] = useState(0);
  const [expOpen, setExpOpen] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      for (const s of [...SECTIONS].reverse()) {
        const el = document.getElementById(s);
        if (el && el.getBoundingClientRect().top < 250) { setActive(s); break; }
      }
    };
    const onMouse = (e: MouseEvent) => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouse, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("mousemove", onMouse); };
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <div className="portfolio-root">
      {/* Cursor glow */}
      <div className="cursor-glow" style={{ left: mouse.x - 200, top: mouse.y - 200 }} />

      {/* Particles */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
        {Array.from({ length: 25 }).map((_, i) => (
          <div key={i} className="particle" style={{
            width: Math.random() * 2.5 + 1 + "px",
            height: Math.random() * 2.5 + 1 + "px",
            background: `rgba(${100 + Math.random() * 60}, ${100 + Math.random() * 60}, 255, ${Math.random() * 0.25 + 0.06})`,
            left: Math.random() * 100 + "%",
            top: Math.random() * 100 + "%",
            "--dur": (12 + Math.random() * 16) + "s",
            "--delay": (-Math.random() * 12) + "s",
          } as React.CSSProperties} />
        ))}
      </div>

      {/* ===== NAVIGATION ===== */}
      <nav className="main-nav">
        <span className="nav-logo" onClick={() => scrollTo("home")}>
          <span className="gt">sam</span>
          <span style={{ color: "rgba(255,255,255,.25)" }}>prakash</span>
        </span>
        <div className="nav-links">
          {SECTIONS.map(s => (
            <button key={s} className={`nav-btn ${active === s ? "active" : ""}`} onClick={() => scrollTo(s)}>
              {s}
            </button>
          ))}
        </div>
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <span style={{ transform: menuOpen ? "rotate(45deg) translate(4px, 4px)" : "" }} />
          <span style={{ opacity: menuOpen ? 0 : 1 }} />
          <span style={{ transform: menuOpen ? "rotate(-45deg) translate(4px, -4px)" : "" }} />
        </button>
      </nav>

      {/* Mobile menu */}
      <div className="mobile-menu" style={{ display: menuOpen ? "flex" : undefined, opacity: menuOpen ? 1 : 0, pointerEvents: menuOpen ? "auto" : "none" }}>
        {SECTIONS.map(s => (
          <button key={s} className="nav-btn" onClick={() => { scrollTo(s); setMenuOpen(false); }}>{s}</button>
        ))}
      </div>

      {/* ========== HOME ========== */}
      <section id="home" className="section" style={{ paddingTop: 70 }}>
        <div className="container">
          <div className="hero-grid">
            <div>
              <Reveal>
                <div className="hero-badge">
                  <span className="hero-badge-dot" />
                  <span>Available for new opportunities</span>
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <h1 className="section-title hero-title">
                  Hi, I'm<br />
                  <span className="gt">Sam Prakash</span>
                </h1>
              </Reveal>

              <Reveal delay={0.2}>
                <p className="hero-sub">
                  Backend engineer specializing in{" "}
                  <strong style={{ color: "#f89820" }}>Java</strong>,{" "}
                  <strong style={{ color: "#6db33f" }}>Spring Boot</strong>, and{" "}
                  <strong style={{ color: "#818cf8" }}>scalable microservices</strong>.
                </p>
              </Reveal>

              <Reveal delay={0.25}>
                <p className="hero-small">
                  3+ years building crash analysis pipelines, automation tools, and enterprise backend systems at Zoho & Cognizant.
                </p>
              </Reveal>

              <Reveal delay={0.3}>
                <div className="hero-btns">
                  <button className="btn-primary" onClick={() => scrollTo("projects")}>View My Work ↗</button>
                  <a href="mailto:msamprakash05@gmail.com" className="btn-outline">Get In Touch</a>
                  <a
                    href="/Sam_Prakash_Latest_Resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline"
                  >
                    📄 Resume
                  </a>
                </div>
              </Reveal>
            </div>

            <div className="avatar-wrap">
              <div className="avatar-glow" />
              <div className="avatar-ring"><div className="avatar-ring-dot" /></div>
              <div className="avatar-circle"><span className="avatar-text">SP</span></div>
              {["☕ Java", "🚀 Spring Boot", "⚡ C++", "🔥 REST API"].map((t, i) => (
                <div key={i} className="float-tag" style={{
                  animation: `float ${5 + i * 1.2}s ease-in-out infinite`,
                  animationDelay: `${i * -1.2}s`,
                  ...[
                    { top: "6%", left: "0%" },
                    { bottom: "20%", left: "-2%" },
                    { top: "8%", right: "0%" },
                    { bottom: "8%", right: "-2%" }
                  ][i]
                }}>{t}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========== ABOUT ========== */}
      <section id="about" className="section">
        <div className="container section-inner">
          <Reveal><div className="section-label">01 / About</div></Reveal>
          <Reveal delay={0.1}>
            <h2 className="section-title" style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}>
              Building systems that <span className="gt">matter</span>.
            </h2>
          </Reveal>

          <div className="about-grid">
            <div>
              <Reveal delay={0.15}>
                <p className="about-text">
                  Backend engineer with 3+ years at <strong>Zoho Corporation</strong> and <strong>Cognizant</strong>,
                  building scalable Java applications, automating crash analysis pipelines, and developing system-level tools in C/C++.
                </p>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="about-text">
                  Skilled in Spring Boot, RESTful APIs, and enterprise Java with a strong foundation in debugging,
                  performance optimization, and cross-platform development. Passionate about microservices architecture
                  and building tools that solve real engineering problems.
                </p>
              </Reveal>
              <Reveal delay={0.25}>
                <p className="about-text">
                  Currently at Zoho's <strong>ManageEngine Endpoint Central</strong> team, working on the UEMS Agent Framework
                  — building crash dump analyzers, diagnostic dashboards, and C++ JSON frameworks used across 10+ agent components.
                </p>
              </Reveal>
            </div>

            <Reveal delay={0.2}>
              <div className="stats-grid">
                {[
                  { n: 3, s: "+", l: "Years Exp." },
                  { n: 60, s: "%", l: "Triage Saved" },
                  { n: 10, s: "+", l: "Components" },
                  { n: 4, s: "+", l: "Projects" },
                ].map((d, i) => (
                  <div key={i} className="stat-card">
                    <div className="stat-num"><Counter end={d.n} suffix={d.s} /></div>
                    <div className="stat-label">{d.l}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ========== SKILLS ========== */}
      <section id="skills" className="section">
        <div className="container section-inner">
          <Reveal><div className="section-label">02 / Skills</div></Reveal>
          <Reveal delay={0.1}>
            <h2 className="section-title" style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}>
              My <span className="gt">toolkit</span>.
            </h2>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="skill-tabs">
              {skills.map((g, i) => (
                <button key={i} className={`skill-tab ${sTab === i ? "active" : ""}`} onClick={() => setSTab(i)}>
                  {g.cat}
                </button>
              ))}
            </div>
          </Reveal>

          <div className="skills-grid">
            {skills[sTab].items.map((s, i) => (
              <SkillBar key={`${sTab}-${i}`} {...s} />
            ))}
          </div>

          <Reveal delay={0.2}>
            <div className="concepts-wrap">
              <span className="concepts-label">CORE CONCEPTS</span>
              {[
                "Microservices", "REST APIs", "Design Patterns", "JVM Tuning",
                "Multithreading", "CI/CD", "JUnit/Mockito", "Agile/Scrum",
                "JDBC", "Crash Dump Analysis", "System Design", "Data Structures",
              ].map((c, i) => (
                <span key={i} className="concept-tag">{c}</span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ========== PROJECTS ========== */}
      <section id="projects" className="section">
        <div className="container section-inner">
          <Reveal><div className="section-label">03 / Projects</div></Reveal>
          <Reveal delay={0.1}>
            <h2 className="section-title" style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}>
              Things I've <span className="gt">built</span>.
            </h2>
          </Reveal>

          <div className="projects-grid">
            {projects.map((p, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="project-card">
                  <div className="project-header" style={{ background: `linear-gradient(135deg, ${p.color}18, ${p.color}06)` }}>
                    <span className="project-num">{String(i + 1).padStart(2, "0")}</span>
                    <span className="project-icon">{p.icon}</span>
                  </div>
                  <div className="project-body">
                    <h3 className="project-title">{p.title}</h3>
                    <p className="project-desc">{p.desc}</p>
                    <div className="project-tags">
                      {p.tech.map((t, j) => (
                        <span key={j} className="concept-tag" style={{ borderColor: `${p.color}30`, color: `${p.color}aa` }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ========== EXPERIENCE ========== */}
      <section id="experience" className="section">
        <div className="container section-inner">
          <Reveal><div className="section-label">04 / Experience</div></Reveal>
          <Reveal delay={0.1}>
            <h2 className="section-title" style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}>
              Where I've <span className="gt">worked</span>.
            </h2>
          </Reveal>

          <div className="exp-timeline">
            {experience.map((e, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="exp-item" onClick={() => setExpOpen(expOpen === i ? -1 : i)}>
                  <div className={`exp-dot ${e.current ? "current" : ""}`} />
                  <div className="exp-card" style={{ borderLeft: `3px solid ${e.color}` }}>
                    <div className="exp-header">
                      <div>
                        <div className="exp-role">{e.role}</div>
                        <div className="exp-company" style={{ color: e.color }}>{e.co}</div>
                        {e.team && <div className="exp-team">{e.team}</div>}
                      </div>
                      <div className="exp-meta">
                        <div className="exp-date">{e.period}</div>
                        <div className="exp-loc">📍 {e.loc}</div>
                      </div>
                    </div>
                    <div className="exp-details" style={{ maxHeight: expOpen === i ? 500 : 0, marginTop: expOpen === i ? 16 : 0 }}>
                      {e.pts.map((pt, j) => (
                        <div key={j} className="exp-point">
                          <span className="exp-bullet" style={{ color: e.color }}>▹</span>
                          <p className="exp-text">{pt}</p>
                        </div>
                      ))}
                      <div className="exp-tags">
                        {e.tags.map((t, j) => <span key={j} className="concept-tag">{t}</span>)}
                      </div>
                    </div>
                    <span className="exp-toggle">{expOpen === i ? "▲ collapse" : "▼ expand"}</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Education & Certifications */}
          <Reveal delay={0.2}>
            <div className="info-grid">
              <div className="info-card">
                <div className="info-title">🎓 Education</div>
                <div className="info-item">
                  <div className="info-item-title">BE Mechatronics — Thiagarajar College of Engineering</div>
                  <div className="info-item-sub">2018 – 2022 · Madurai, Tamil Nadu</div>
                </div>
                <div className="info-item">
                  <div className="info-item-title">Graduate Training — Zoho School of Learning</div>
                  <div className="info-item-sub">Oct 2023 – Jan 2024 · Java, MySQL, Servlets, DSA</div>
                </div>
              </div>

              <div className="info-card">
                <div className="info-title">📜 Certifications</div>
                {[
                  "Java SE — HackerRank",
                  "Spring Boot — Udemy",
                  "Problem Solving — HackerRank",
                  "SQL — HackerRank",
                ].map((c, i) => (
                  <div key={i} className="cert-item">
                    <div className="cert-dot" />
                    <span className="cert-text">{c}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ========== CONTACT ========== */}
      <section id="contact" className="section">
        <div className="container section-inner" style={{ maxWidth: 720, textAlign: "center" }}>
          <Reveal><div className="section-label" style={{ justifyContent: "center" }}>05 / Contact</div></Reveal>
          <Reveal delay={0.1}>
            <h2 className="section-title" style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}>
              Let's <span className="gt">connect</span>.
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p style={{ color: "rgba(255,255,255,.45)", fontSize: 15, lineHeight: 1.85, maxWidth: 480, margin: "0 auto 40px" }}>
              Open to Java backend roles, engineering challenges, or collaboration opportunities. Let's build something great together.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="contact-card">
              <div className="contact-grid">
                <div>
                  <div className="contact-label">Email</div>
                  <a href="mailto:msamprakash05@gmail.com" style={{ color: "#818cf8", textDecoration: "none" }} className="contact-value">
                    msamprakash05@gmail.com
                  </a>
                </div>
                <div>
                  <div className="contact-label">Phone</div>
                  <div className="contact-value" style={{ color: "#fff" }}>+91 6385812669</div>
                </div>
                <div>
                  <div className="contact-label">Location</div>
                  <div className="contact-value" style={{ color: "#fff" }}>Chennai, India</div>
                </div>
              </div>
              <div className="social-links">
                {socials.map((s, i) => (
                  <a
                    key={i}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-btn"
                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = s.c; (e.currentTarget as HTMLAnchorElement).style.borderColor = s.c + "44"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = ""; (e.currentTarget as HTMLAnchorElement).style.borderColor = ""; }}
                  >
                    {s.name}
                  </a>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.25}>
            <a
              href="mailto:msamprakash05@gmail.com"
              className="btn-primary"
              style={{ display: "inline-block", textDecoration: "none", padding: "16px 44px", fontSize: 15 }}
            >
              ✉️ Send Me an Email
            </a>
          </Reveal>
        </div>
      </section>

      <footer className="footer">© 2026 SAM PRAKASH M — BUILT WITH ❤️ AND JAVA</footer>
    </div>
  );
}