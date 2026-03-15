import { useState, useEffect, useRef } from "react";

const SECTIONS = ["home", "about", "skills", "projects", "experience", "contact"];
const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

function useInView(t = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: t });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, v] as const;
}

function Counter({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [c, setC] = useState(0);
  const [ref, v] = useInView();
  useEffect(() => {
    if (!v) return;
    let s = 0;
    const step = end / 80;
    const t = setInterval(() => { s += step; if (s >= end) { setC(end); clearInterval(t); } else setC(Math.floor(s)); }, 16);
    return () => clearInterval(t);
  }, [v]);
  return <span ref={ref}>{c}{suffix}</span>;
}

function Reveal({ children, delay = 0, style = {} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const [ref, v] = useInView();
  return <div ref={ref} style={{ ...style, opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(35px)", transition: `all 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s` }}>{children}</div>;
}

function SkillBar({ name, level, color }: { name: string; level: number; color: string }) {
  const [ref, v] = useInView();
  return (
    <div ref={ref} className="skill-card">
      <div className="skill-header">
        <span className="skill-name">{name}</span>
        <span className="skill-pct" style={{ color }}>{level}%</span>
      </div>
      <div className="bar-track"><div className="bar-fill" style={{ width: v ? level + "%" : "0%", background: `linear-gradient(90deg,${color},${color}77)` }} /></div>
    </div>
  );
}

// ===== DATA =====
const skills = [
  { cat: "Languages", items: [{ name: "Java (Core & Advanced)", level: 95, color: "#f89820" }, { name: "C / C++", level: 88, color: "#00599C" }, { name: "JavaScript", level: 85, color: "#f7df1e" }, { name: "SQL", level: 90, color: "#336791" }, { name: "Rust", level: 50, color: "#ce412b" }] },
  { cat: "Frameworks", items: [{ name: "Spring Boot", level: 90, color: "#6db33f" }, { name: "Spring MVC / Data JPA", level: 87, color: "#6db33f" }, { name: "Hibernate", level: 85, color: "#59666c" }, { name: "Servlets / JSP", level: 88, color: "#e76f00" }, { name: "React JS", level: 70, color: "#61dafb" }] },
  { cat: "DB & Tools", items: [{ name: "MySQL / PostgreSQL", level: 90, color: "#336791" }, { name: "MongoDB", level: 75, color: "#4db33d" }, { name: "Redis", level: 72, color: "#dc382d" }, { name: "Docker / Jenkins", level: 68, color: "#2496ed" }, { name: "Git / Maven", level: 88, color: "#f05032" }] },
];

const projects = [
  { title: "Railway Booking System", desc: "End-to-end reservation platform with auth, seat search, booking management, admin panel, dynamic fare calculation, JDBC pooling, and CSRF protection.", tech: ["Java", "Servlets", "JSP", "MySQL"], color: "#667eea", icon: "🚂" },
  { title: "E-Commerce Microservices", desc: "Microservices backend (Product, Order, Auth, Payment) with RabbitMQ messaging, Resilience4j circuit breakers, Redis caching reducing API response by 45%.", tech: ["Spring Boot", "Docker", "RabbitMQ", "Redis"], color: "#f5576c", icon: "🛒" },
  { title: "URL Shortener Service", desc: "High-throughput shortener with Base62 encoding, custom aliases, expiration policies, click analytics, sub-10ms redirect via Redis, Bucket4j rate limiting.", tech: ["Spring Boot", "MongoDB", "Redis"], color: "#4facfe", icon: "🔗" },
  { title: "Real-Time Chat App", desc: "Messaging platform with private/group chats, typing indicators, read receipts via STOMP over WebSocket, JWT auth, paginated history.", tech: ["Spring Boot", "WebSocket", "React", "PostgreSQL"], color: "#43e97b", icon: "💬" },
];

const experience = [
  {
    role: "Member of Technical Staff", co: "Zoho Corporation", team: "ManageEngine Endpoint Central — UEMS Agent Framework", period: "Jul 2024 — Present", loc: "Chennai", current: true, color: "#667eea",
    pts: ["Built automated crash dump analysis tool with Zoho Desk API — reduces triage time by 60%", "Developed Java hourly log parser for auto-diagnosing support tickets", "Created C++ JSON framework using jsoncpp across 10+ agent components", "Integrated crash analytics into Grafana + built Servlet/JSP dashboard"], tags: ["Java", "C++", "Grafana", "WinDbg"]
  },
  {
    role: "Incubation Trainee", co: "Zoho Corporation", period: "Apr — Jul 2024", loc: "Chennai", color: "#764ba2",
    pts: ["Gained expertise in Windows networking (Domains, Active Directory) and built C/C++ network diagnostic tools"], tags: ["C/C++", "Windows Server"]
  },
  {
    role: "Programmer Analyst", co: "Cognizant", period: "Feb 2022 — Oct 2023", loc: "Remote / Coimbatore", color: "#4facfe",
    pts: ["Full Stack Java & MuleSoft API training; built POC apps using Anypoint Platform", "Developed responsive web interfaces with HTML5, CSS3, Bootstrap"], tags: ["Java", "MuleSoft", "HTML/CSS"]
  },
];

const socials = [
  { name: "LinkedIn", url: "https://linkedin.com/in/msamprakash", c: "#0077b5" },
  { name: "GitHub", url: "https://github.com/Sam-Prakash-M", c: "#6e5494" },
  { name: "LeetCode", url: "https://leetcode.com/u/Sam_Prakash/", c: "#ffa116" },
  { name: "HackerRank", url: "https://hackerrank.com/profile/msamprakash05", c: "#2ec866" },
  { name: "Portfolio", url: "https://samprakash.vercel.app", c: "#667eea" },
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
    window.addEventListener("scroll", onScroll);
    window.addEventListener("mousemove", onMouse);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("mousemove", onMouse); };
  }, []);

  return (
    <div className="portfolio-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        html { scroll-behavior:smooth; -webkit-font-smoothing:antialiased; }
        ::selection { background:rgba(102,126,234,.3); }

        .portfolio-root {
          background:#0a0a1a; color:#e8e8e8;
          font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;
          overflow-x:hidden; min-height:100vh;
        }

        /* noise texture overlay for modern grain effect */
        .portfolio-root::before {
          content:''; position:fixed; inset:0; z-index:0; pointer-events:none; opacity:.03;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }

        /* ===== ANIMATIONS ===== */
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(1.3)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes morph { 0%,100%{border-radius:60% 40% 30% 70%/60% 30% 70% 40%} 50%{border-radius:30% 60% 70% 40%/50% 60% 30% 60%} }
        @keyframes shimmer { 0%{left:-100%} 100%{left:100%} }
        @keyframes gradient { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @keyframes glow-pulse { 0%,100%{box-shadow:0 0 15px rgba(102,126,234,.15)} 50%{box-shadow:0 0 30px rgba(102,126,234,.25)} }

        /* ===== CURSOR GLOW ===== */
        .cursor-glow {
          position:fixed; width:350px; height:350px; border-radius:50%; pointer-events:none; z-index:1;
          background:radial-gradient(circle,rgba(102,126,234,.05),transparent 70%);
          transition:left .35s ease-out,top .35s ease-out;
        }

        /* ===== PARTICLES ===== */
        .particle {
          position:absolute; border-radius:50%;
          animation:float var(--dur) ease-in-out infinite;
          animation-delay:var(--delay);
        }

        /* ===== GRADIENT TEXT ===== */
        .gt {
          background:linear-gradient(135deg,#667eea,#764ba2,#f093fb,#667eea);
          background-size:300% 300%;
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;
          animation:gradient 5s ease infinite;
        }

        /* ===== NAV ===== */
        .main-nav {
          position:fixed; top:0; left:0; right:0; z-index:100;
          padding:12px 24px; display:flex; justify-content:space-between; align-items:center;
          background:rgba(10,10,26,.85); backdrop-filter:blur(20px);
          border-bottom:1px solid rgba(255,255,255,.04);
        }
        .nav-logo { font-family:'Space Grotesk'; font-weight:700; font-size:20px; cursor:pointer; letter-spacing:-1px; }
        .nav-links { display:flex; gap:4px; }
        .nav-btn {
          padding:7px 14px; border-radius:20px; font-size:11px; font-weight:600;
          letter-spacing:1.2px; text-transform:uppercase; cursor:pointer;
          transition:all .3s; color:rgba(255,255,255,.35);
          border:1px solid transparent; background:none;
        }
        .nav-btn:hover { color:rgba(255,255,255,.8); }
        .nav-btn.active { color:#fff; background:rgba(102,126,234,.12); border-color:rgba(102,126,234,.25); }
        .hamburger {
          display:none; flex-direction:column; gap:5px; cursor:pointer;
          border:none; background:none; padding:8px; z-index:200;
        }
        .hamburger span { width:20px; height:1.5px; background:#fff; transition:all .3s; display:block; }
        .mobile-menu {
          display:none; position:fixed; inset:0; z-index:99;
          background:rgba(10,10,26,.97); backdrop-filter:blur(30px);
          flex-direction:column; align-items:center; justify-content:center; gap:12px;
          transition:opacity .3s;
        }
        .mobile-menu .nav-btn {
          font-size:15px; padding:14px 32px; width:70%; text-align:center;
          border-radius:12px; border:1px solid rgba(255,255,255,.06);
          background:rgba(255,255,255,.03); color:rgba(255,255,255,.6);
          -webkit-tap-highlight-color:transparent;
        }
        .mobile-menu .nav-btn:active { background:rgba(102,126,234,.15); color:#fff; }

        @media(max-width:900px) {
          .nav-links { display:none !important; }
          .hamburger { display:flex !important; }
        }
        @media(min-width:901px) {
          .mobile-menu { display:none !important; }
        }

        /* ===== CONTAINER ===== */
        .container { max-width:1200px; margin:0 auto; padding:0 24px; width:100%; }
        @media(min-width:1600px) { .container { max-width:1400px; } }

        /* ===== SECTION ===== */
        .section { min-height:100vh; display:flex; align-items:center; position:relative; }
        .section-inner { width:100%; padding:120px 0 80px; }
        .section-label {
          font-family:'JetBrains Mono'; font-size:11px; font-weight:500;
          letter-spacing:3px; text-transform:uppercase; color:rgba(102,126,234,.6);
          margin-bottom:12px; display:flex; align-items:center; gap:14px;
        }
        .section-label::after { content:''; flex:0 0 50px; height:1px; background:linear-gradient(90deg,rgba(102,126,234,.4),transparent); }
        .section-title {
          font-family:'Space Grotesk'; font-weight:700; letter-spacing:-2px;
          color:#fff; line-height:1.08; margin-bottom:32px;
        }

        /* ===== HERO ===== */
        .hero-grid { display:grid; grid-template-columns:1.2fr 0.8fr; gap:40px; align-items:center; overflow:hidden; }
        .hero-badge {
          display:inline-flex; align-items:center; gap:8px;
          padding:8px 18px; border-radius:50px; margin-bottom:28px;
          background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.06);
          font-size:12px; color:rgba(255,255,255,.5); font-weight:500;
        }
        .hero-title { font-size:clamp(2.5rem,5.5vw,5rem); }
        .hero-sub { color:rgba(255,255,255,.45); line-height:1.8; font-size:clamp(14px,1.1vw,17px); max-width:500px; margin-bottom:10px; }
        .hero-small { color:rgba(255,255,255,.3); font-size:13px; line-height:1.7; max-width:500px; margin-bottom:36px; }
        .hero-btns { display:flex; gap:14px; flex-wrap:wrap; }
        .btn-primary {
          padding:14px 32px; border-radius:10px; font-weight:700; color:#fff;
          background:linear-gradient(135deg,#667eea,#764ba2); border:none;
          cursor:pointer; font-size:14px; transition:all .3s; font-family:inherit;
        }
        .btn-primary:hover { transform:translateY(-2px); box-shadow:0 12px 35px rgba(102,126,234,.3); }
        .btn-outline {
          padding:14px 32px; border-radius:10px; font-weight:600; color:#fff;
          background:transparent; border:1px solid rgba(255,255,255,.1);
          cursor:pointer; font-size:14px; transition:all .3s; text-decoration:none; font-family:inherit;
        }
        .btn-outline:hover { border-color:rgba(102,126,234,.4); }

        .avatar-wrap { display:flex; justify-content:center; align-items:center; position:relative; overflow:hidden; padding:20px; }
        .avatar-glow {
          position:absolute; width:100%; height:100%;
          background:linear-gradient(135deg,#667eea,#764ba2); border-radius:50%;
          filter:blur(50px); opacity:.2; animation:morph 8s ease-in-out infinite;
        }
        .avatar-ring {
          position:absolute; width:calc(100% + 10px); height:calc(100% + 10px);
          border:1px solid rgba(255,255,255,.05); border-radius:50%;
          animation:spin 30s linear infinite;
        }
        .avatar-ring-dot {
          position:absolute; top:-4px; left:50%; width:8px; height:8px;
          background:#667eea; border-radius:50%; margin-left:-4px;
        }
        .avatar-circle {
          position:relative; width:clamp(180px,18vw,260px); height:clamp(180px,18vw,260px);
          border-radius:50%; display:flex; align-items:center; justify-content:center;
          background:linear-gradient(135deg,rgba(102,126,234,.12),rgba(118,75,162,.12));
          border:2px solid rgba(255,255,255,.06); flex-shrink:0;
        }
        .avatar-text {
          font-family:'Space Grotesk'; font-weight:800; font-size:clamp(40px,4vw,64px);
          background:linear-gradient(135deg,#667eea,#764ba2);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;
        }
        .float-tag {
          position:absolute; padding:5px 12px; border-radius:8px; font-size:11px;
          font-weight:600; white-space:nowrap; background:rgba(10,10,26,.8);
          border:1px solid rgba(255,255,255,.08); z-index:2;
        }

        @media(max-width:900px) {
          .hero-grid { grid-template-columns:1fr; text-align:center; }
          .hero-sub, .hero-small { margin-left:auto; margin-right:auto; }
          .hero-btns { justify-content:center; }
          .avatar-wrap { margin-top:20px; }
          .float-tag { display:none; }
        }
        @media(max-width:480px) {
          .hero-btns { flex-direction:column; }
          .btn-primary, .btn-outline { width:100%; text-align:center; }
        }

        /* ===== ABOUT ===== */
        .about-grid { display:grid; grid-template-columns:1.2fr 1fr; gap:48px; align-items:start; }
        .about-text { color:rgba(255,255,255,.5); line-height:1.85; font-size:15px; margin-bottom:18px; }
        .stats-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
        .stat-card {
          padding:22px; border-radius:14px; text-align:center;
          background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.06);
          backdrop-filter:blur(10px); transition:all .35s cubic-bezier(.4,0,.2,1);
        }
        .stat-card:hover { border-color:rgba(102,126,234,.25); transform:translateY(-3px); box-shadow:0 8px 30px rgba(102,126,234,.08); }
        .stat-num { font-family:'Space Grotesk'; font-size:28px; font-weight:700; line-height:1; }
        .stat-label { font-size:10px; color:rgba(255,255,255,.35); margin-top:8px; font-weight:600; letter-spacing:1px; text-transform:uppercase; }

        @media(max-width:768px) { .about-grid { grid-template-columns:1fr; } }

        /* ===== SKILLS ===== */
        .skill-tabs { display:flex; gap:6px; flex-wrap:wrap; margin-bottom:28px; }
        .skill-tab {
          padding:8px 18px; border-radius:8px; font-size:13px; font-weight:600;
          cursor:pointer; transition:all .3s; border:1px solid rgba(255,255,255,.06);
          background:transparent; color:rgba(255,255,255,.4); font-family:inherit;
        }
        .skill-tab.active { background:rgba(102,126,234,.12); border-color:rgba(102,126,234,.3); color:#667eea; }
        .skill-tab:hover:not(.active) { color:rgba(255,255,255,.7); border-color:rgba(255,255,255,.12); }
        .skills-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(min(260px,100%),1fr)); gap:12px; }
        .skill-card {
          padding:18px 20px; border-radius:12px;
          background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.06);
          backdrop-filter:blur(10px); transition:all .35s cubic-bezier(.4,0,.2,1);
        }
        .skill-card:hover { border-color:rgba(102,126,234,.25); box-shadow:0 4px 20px rgba(102,126,234,.06); }
        .skill-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; }
        .skill-name { font-weight:600; font-size:13px; }
        .skill-pct { font-family:'JetBrains Mono'; font-size:12px; font-weight:600; }
        .bar-track { height:4px; background:rgba(255,255,255,.04); border-radius:2px; overflow:hidden; }
        .bar-fill { height:100%; border-radius:2px; transition:width 1.3s cubic-bezier(.16,1,.3,1); position:relative; overflow:hidden; }
        .bar-fill::after { content:''; position:absolute; top:0; width:60px; height:100%; background:linear-gradient(90deg,transparent,rgba(255,255,255,.25),transparent); animation:shimmer 2s infinite; }
        .concepts-wrap { display:flex; flex-wrap:wrap; gap:6px; margin-top:28px; }
        .concept-tag {
          padding:5px 14px; border-radius:20px; font-size:11px; font-weight:600;
          border:1px solid rgba(255,255,255,.07); color:rgba(255,255,255,.45);
          background:rgba(255,255,255,.02); letter-spacing:.3px;
        }

        /* ===== PROJECTS ===== */
        .projects-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(min(300px,100%),1fr)); gap:20px; }
        .project-card {
          border-radius:16px; overflow:hidden;
          background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.06);
          backdrop-filter:blur(10px); transition:all .4s cubic-bezier(.175,.885,.32,1.275);
        }
        .project-card:hover { transform:translateY(-6px); border-color:rgba(102,126,234,.2); box-shadow:0 16px 40px rgba(0,0,0,.25),0 0 0 1px rgba(102,126,234,.1); }
        .project-header { height:140px; display:flex; align-items:center; justify-content:center; position:relative; }
        .project-num { position:absolute; top:12px; left:16px; font-family:'Space Grotesk'; font-size:40px; font-weight:800; color:rgba(255,255,255,.1); }
        .project-icon { font-size:48px; position:relative; z-index:1; }
        .project-body { padding:22px; }
        .project-title { font-family:'Space Grotesk'; font-size:16px; font-weight:700; margin-bottom:8px; line-height:1.3; }
        .project-desc { color:rgba(255,255,255,.4); font-size:13px; line-height:1.7; margin-bottom:14px; }
        .project-tags { display:flex; flex-wrap:wrap; gap:5px; }

        @media(max-width:480px) { .projects-grid { grid-template-columns:1fr; } }

        /* ===== EXPERIENCE ===== */
        .exp-timeline { position:relative; padding-left:28px; }
        .exp-timeline::before {
          content:''; position:absolute; left:6px; top:10px; bottom:10px; width:1px;
          background:linear-gradient(180deg,rgba(102,126,234,.4),rgba(102,126,234,.05));
        }
        .exp-item { position:relative; margin-bottom:24px; cursor:pointer; }
        .exp-dot {
          position:absolute; left:-28px; top:10px; width:14px; height:14px;
          border-radius:50%; border:2px solid rgba(102,126,234,.4); background:#0a0a1a; z-index:1;
        }
        .exp-dot.current { background:#667eea; border-color:#667eea; box-shadow:0 0 10px rgba(102,126,234,.4); }
        .exp-card {
          padding:24px; border-radius:14px;
          background:rgba(255,255,255,.02); border:1px solid rgba(255,255,255,.06);
          transition:all .3s;
        }
        .exp-card:hover { border-color:rgba(102,126,234,.2); }
        .exp-header { display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:10px; }
        .exp-role { font-family:'Space Grotesk'; font-size:17px; font-weight:700; margin-bottom:3px; }
        .exp-company { font-size:14px; font-weight:600; }
        .exp-team { font-size:12px; color:rgba(255,255,255,.3); font-style:italic; margin-top:2px; }
        .exp-meta { text-align:right; }
        .exp-date { font-family:'JetBrains Mono'; font-size:11px; color:rgba(255,255,255,.35); }
        .exp-loc { font-size:11px; color:rgba(255,255,255,.25); margin-top:2px; }
        .exp-details { overflow:hidden; transition:max-height .4s ease; }
        .exp-point { display:flex; gap:10px; margin-bottom:8px; }
        .exp-bullet { flex-shrink:0; margin-top:3px; font-size:12px; }
        .exp-text { color:rgba(255,255,255,.5); font-size:13px; line-height:1.7; }
        .exp-toggle { font-family:'JetBrains Mono'; font-size:10px; color:rgba(255,255,255,.2); margin-top:10px; display:block; }
        .exp-tags { display:flex; flex-wrap:wrap; gap:4px; margin-top:10px; }

        @media(max-width:480px) {
          .exp-header { flex-direction:column; }
          .exp-meta { text-align:left; }
          .exp-card { padding:16px; }
          .exp-role { font-size:15px; }
        }

        /* ===== EDU/CERT ===== */
        .info-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-top:36px; }
        .info-card {
          padding:24px; border-radius:14px;
          background:rgba(255,255,255,.02); border:1px solid rgba(255,255,255,.06);
        }
        .info-title { font-family:'Space Grotesk'; font-size:15px; font-weight:700; margin-bottom:14px; }
        @media(max-width:600px) {
          .info-grid { grid-template-columns:1fr; }
          .info-card { padding:18px; }
        }

        /* ===== CONTACT ===== */
        .contact-card {
          padding:36px; border-radius:18px; text-align:center;
          background:rgba(255,255,255,.02); border:1px solid rgba(255,255,255,.06);
          margin-bottom:28px;
        }
        .contact-grid { display:flex; flex-wrap:wrap; justify-content:center; gap:28px; margin-bottom:24px; }
        .contact-label { font-size:10px; color:rgba(255,255,255,.3); letter-spacing:1px; text-transform:uppercase; margin-bottom:4px; }
        .contact-value { font-weight:600; font-size:14px; word-break:break-all; }
        .social-links { display:flex; justify-content:center; gap:10px; flex-wrap:wrap; }
        .social-btn {
          padding:10px 18px; border-radius:8px; text-decoration:none;
          color:rgba(255,255,255,.45); font-size:13px; font-weight:600;
          background:rgba(255,255,255,.02); border:1px solid rgba(255,255,255,.06);
          transition:all .3s; display:inline-block;
        }
        .social-btn:hover { transform:translateY(-2px); }

        @media(max-width:480px) {
          .contact-card { padding:20px 16px; }
          .contact-grid { gap:20px; flex-direction:column; align-items:center; }
          .contact-value { font-size:13px; }
          .social-links { gap:8px; }
          .social-btn { padding:10px 14px; font-size:12px; flex:1 1 auto; text-align:center; min-width:0; }
        }

        /* ===== FOOTER ===== */
        .footer {
          border-top:1px solid rgba(255,255,255,.04); padding:24px;
          text-align:center; font-family:'JetBrains Mono'; font-size:11px;
          color:rgba(255,255,255,.18); letter-spacing:1px;
        }

        /* ===== GLOBAL MOBILE FIXES ===== */
        @media(max-width:768px) {
          .section { min-height:auto; }
          .section-inner { padding:100px 0 60px; }
          .container { padding:0 16px; }
          .section-title { letter-spacing:-1px; margin-bottom:24px; }
          .cursor-glow { display:none; }
        }
        @media(max-width:480px) {
          .section-inner { padding:80px 0 40px; }
          .container { padding:0 14px; }
          .skill-tabs { gap:4px; margin-bottom:20px; }
          .skill-tab { padding:8px 14px; font-size:12px; }
          .stat-card { padding:16px; }
          .stat-num { font-size:24px; }
          .stat-label { font-size:9px; }
          .main-nav { padding:10px 14px; }
          .nav-logo { font-size:18px; }
          .concept-tag { font-size:10px; padding:4px 10px; }
        }
      `}</style>

      {/* Cursor glow */}
      <div className="cursor-glow" style={{ left: mouse.x - 175, top: mouse.y - 175 }} />

      {/* Particles */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
        {Array.from({ length: 30 }).map((_, i) => (
          <div key={i} className="particle" style={{
            width: Math.random() * 2.5 + 1 + "px", height: Math.random() * 2.5 + 1 + "px",
            background: `rgba(${130 + Math.random() * 80},${140 + Math.random() * 80},255,${Math.random() * .3 + .06})`,
            left: Math.random() * 100 + "%", top: Math.random() * 100 + "%",
            "--dur": (10 + Math.random() * 14) + "s", "--delay": (-Math.random() * 10) + "s",
          } as React.CSSProperties} />
        ))}
      </div>

      {/* ===== NAV ===== */}
      <nav className="main-nav">
        <span className="nav-logo" onClick={() => scrollTo("home")}>
          <span className="gt">sam</span><span style={{ color: "rgba(255,255,255,.25)" }}>prakash</span>
        </span>
        <div className="nav-links">
          {SECTIONS.map(s => <button key={s} className={`nav-btn ${active === s ? "active" : ""}`} onClick={() => scrollTo(s)}>{s}</button>)}
        </div>
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span style={{ transform: menuOpen ? "rotate(45deg) translate(4px,4px)" : "" }} />
          <span style={{ opacity: menuOpen ? 0 : 1 }} />
          <span style={{ transform: menuOpen ? "rotate(-45deg) translate(4px,-4px)" : "" }} />
        </button>
      </nav>

      {/* Mobile menu */}
      <div className="mobile-menu" style={{ display: menuOpen ? "flex" : undefined, opacity: menuOpen ? 1 : 0, pointerEvents: menuOpen ? "auto" : "none" }}>
        {SECTIONS.map(s => <button key={s} className="nav-btn" style={{ fontSize: 16 }} onClick={() => { scrollTo(s); setMenuOpen(false); }}>{s}</button>)}
      </div>

      {/* ========== HOME ========== */}
      <section id="home" className="section" style={{ paddingTop: 70 }}>
        <div className="container">
          <div className="hero-grid">
            <div>
              <Reveal><div className="hero-badge"><span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", animation: "pulse 2s infinite" }} /><span>Available for new opportunities</span></div></Reveal>
              <Reveal delay={0.1}><h1 className="section-title hero-title">Hi, I'm<br /><span className="gt">Sam Prakash</span></h1></Reveal>
              <Reveal delay={0.2}><p className="hero-sub">Backend engineer specializing in <span style={{ color: "#f89820" }}>Java</span>, <span style={{ color: "#6db33f" }}>Spring Boot</span>, and <span style={{ color: "#61dafb" }}>scalable microservices</span>.</p></Reveal>
              <Reveal delay={0.25}><p className="hero-small">2+ years building crash analysis pipelines, automation tools, and enterprise backend systems at Zoho & Cognizant.</p></Reveal>
              <Reveal delay={0.3}><div className="hero-btns"><button className="btn-primary" onClick={() => scrollTo("projects")}>View My Work ↗</button><a href="mailto:msamprakash05@gmail.com" className="btn-outline">Get In Touch</a></div></Reveal>
            </div>
            <div className="avatar-wrap">
              <div className="avatar-glow" />
              <div className="avatar-ring"><div className="avatar-ring-dot" /></div>
              <div className="avatar-circle"><span className="avatar-text">SP</span></div>
              {["☕ Java", "🚀 Spring Boot", "⚡ C++", "🔥 REST API"].map((t, i) => (
                <div key={i} className="float-tag" style={{
                  animation: `float ${5 + i * 1.2}s ease-in-out infinite`, animationDelay: `${i * -1.2}s`,
                  ...[{ top: "8%", left: "2%" }, { bottom: "18%", left: "0%" }, { top: "10%", right: "2%" }, { bottom: "10%", right: "0%" }][i]
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
          <Reveal delay={0.1}><h2 className="section-title" style={{ fontSize: "clamp(2rem,4vw,3rem)" }}>Building systems that <span className="gt">matter</span>.</h2></Reveal>
          <div className="about-grid">
            <div>
              <Reveal delay={0.15}><p className="about-text">Backend engineer with 2+ years at <strong style={{ color: "#fff" }}>Zoho Corporation</strong> and <strong style={{ color: "#fff" }}>Cognizant</strong>, building scalable Java applications, automating crash analysis pipelines, and developing system-level tools in C/C++.</p></Reveal>
              <Reveal delay={0.2}><p className="about-text">Skilled in Spring Boot, RESTful APIs, and enterprise Java with a strong foundation in debugging, performance optimization, and cross-platform development. Passionate about microservices architecture and building tools that solve real engineering problems.</p></Reveal>
            </div>
            <Reveal delay={0.2}>
              <div className="stats-grid">
                {[{ n: 2, s: "+", l: "Years Exp." }, { n: 60, s: "%", l: "Triage Saved" }, { n: 10, s: "+", l: "Components" }, { n: 4, s: "", l: "Projects" }].map((d, i) => (
                  <div key={i} className="stat-card"><div className="stat-num"><Counter end={d.n} suffix={d.s} /></div><div className="stat-label">{d.l}</div></div>
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
          <Reveal delay={0.1}><h2 className="section-title" style={{ fontSize: "clamp(2rem,4vw,3rem)" }}>My <span className="gt">toolkit</span>.</h2></Reveal>
          <Reveal delay={0.15}>
            <div className="skill-tabs">
              {skills.map((g, i) => <button key={i} className={`skill-tab ${sTab === i ? "active" : ""}`} onClick={() => setSTab(i)}>{g.cat}</button>)}
            </div>
          </Reveal>
          <div className="skills-grid">
            {skills[sTab].items.map((s, i) => <SkillBar key={`${sTab}-${i}`} {...s} />)}
          </div>
          <Reveal delay={0.2}>
            <div className="concepts-wrap">
              <div style={{ width: "100%", marginBottom: 8 }}><span style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, color: "rgba(255,255,255,.3)", letterSpacing: 2 }}>CORE CONCEPTS</span></div>
              {["Microservices", "REST APIs", "Design Patterns", "JVM Tuning", "Multithreading", "CI/CD", "JUnit/Mockito", "Agile/Scrum", "JDBC", "Crash Dump Analysis"].map((c, i) => <span key={i} className="concept-tag">{c}</span>)}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ========== PROJECTS ========== */}
      <section id="projects" className="section">
        <div className="container section-inner">
          <Reveal><div className="section-label">03 / Projects</div></Reveal>
          <Reveal delay={0.1}><h2 className="section-title" style={{ fontSize: "clamp(2rem,4vw,3rem)" }}>Things I've <span className="gt">built</span>.</h2></Reveal>
          <div className="projects-grid">
            {projects.map((p, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <div className="project-card">
                  <div className="project-header" style={{ background: `linear-gradient(135deg,${p.color}22,${p.color}08)` }}>
                    <span className="project-num">{String(i + 1).padStart(2, "0")}</span>
                    <span className="project-icon">{p.icon}</span>
                  </div>
                  <div className="project-body">
                    <h3 className="project-title">{p.title}</h3>
                    <p className="project-desc">{p.desc}</p>
                    <div className="project-tags">{p.tech.map((t, j) => <span key={j} className="concept-tag" style={{ borderColor: `${p.color}22`, color: `${p.color}99` }}>{t}</span>)}</div>
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
          <Reveal delay={0.1}><h2 className="section-title" style={{ fontSize: "clamp(2rem,4vw,3rem)" }}>Where I've <span className="gt">worked</span>.</h2></Reveal>
          <div className="exp-timeline">
            {experience.map((e, i) => (
              <Reveal key={i} delay={i * 0.08}>
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
                        <div className="exp-loc">{e.loc}</div>
                      </div>
                    </div>
                    <div className="exp-details" style={{ maxHeight: expOpen === i ? 400 : 0, marginTop: expOpen === i ? 14 : 0 }}>
                      {e.pts.map((pt, j) => <div key={j} className="exp-point"><span className="exp-bullet" style={{ color: e.color }}>▹</span><p className="exp-text">{pt}</p></div>)}
                      <div className="exp-tags">{e.tags.map((t, j) => <span key={j} className="concept-tag">{t}</span>)}</div>
                    </div>
                    <span className="exp-toggle">{expOpen === i ? "▲ collapse" : "▼ expand"}</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <div className="info-grid">
              <div className="info-card">
                <div className="info-title">🎓 Education</div>
                <p style={{ fontWeight: 600, fontSize: 14 }}>BE Mechatronics — Thiagarajar College</p>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,.3)", marginBottom: 12 }}>2018–2022 · Madurai, TN</p>
                <p style={{ fontWeight: 600, fontSize: 14 }}>Graduate Training — Zoho School</p>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,.3)" }}>Oct 2023–Jan 2024 · Java, MySQL, Servlets</p>
              </div>
              <div className="info-card">
                <div className="info-title">📜 Certifications</div>
                {["Java SE — HackerRank", "Spring Boot — Udemy", "Problem Solving — HackerRank"].map((c, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#667eea", flexShrink: 0 }} />
                    <span style={{ color: "rgba(255,255,255,.5)", fontSize: 14 }}>{c}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ========== CONTACT ========== */}
      <section id="contact" className="section">
        <div className="container section-inner" style={{ maxWidth: 700, textAlign: "center" }}>
          <Reveal><div className="section-label" style={{ justifyContent: "center" }}>05 / Contact</div></Reveal>
          <Reveal delay={0.1}><h2 className="section-title" style={{ fontSize: "clamp(2rem,4vw,3rem)" }}>Let's <span className="gt">connect</span>.</h2></Reveal>
          <Reveal delay={0.15}><p style={{ color: "rgba(255,255,255,.4)", fontSize: 15, lineHeight: 1.8, maxWidth: 450, margin: "0 auto 36px" }}>Open to Java backend roles, engineering challenges, or collaboration opportunities.</p></Reveal>
          <Reveal delay={0.2}>
            <div className="contact-card">
              <div className="contact-grid">
                <div><div className="contact-label">Email</div><a href="mailto:msamprakash05@gmail.com" style={{ color: "#667eea", textDecoration: "none" }} className="contact-value">msamprakash05@gmail.com</a></div>
                <div><div className="contact-label">Phone</div><div className="contact-value" style={{ color: "#fff" }}>+91 6385812669</div></div>
                <div><div className="contact-label">Location</div><div className="contact-value" style={{ color: "#fff" }}>Chennai, India</div></div>
              </div>
              <div className="social-links">
                {socials.map((s, i) => <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className="social-btn"
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = s.c; (e.currentTarget as HTMLAnchorElement).style.borderColor = s.c + "44"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,.45)"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,.06)"; }}>
                  {s.name}
                </a>)}
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.25}>
            <a href="mailto:msamprakash05@gmail.com" className="btn-primary" style={{ display: "inline-block", textDecoration: "none", padding: "16px 40px", fontSize: 15 }}>
              ✉️ Send Me an Email
            </a>
          </Reveal>
        </div>
      </section>

      <footer className="footer">© 2026 SAM PRAKASH M — BUILT WITH ❤️ AND JAVA</footer>
    </div>
  );
}