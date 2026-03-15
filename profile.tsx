import { useState, useEffect, useRef } from "react";

const SECTIONS = ["home","about","skills","projects","experience","contact"];

const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Counter({ end, suffix = "", duration = 2000 }) {
  const [count, setCount] = useState(0);
  const [ref, visible] = useInView();
  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [visible]);
  return <span ref={ref}>{count}{suffix}</span>;
}

function MagButton({ children, href, onClick, style = {}, className = "" }) {
  const ref = useRef(null);
  const handleMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    ref.current.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px, ${(e.clientY - r.top - r.height / 2) * 0.25}px)`;
  };
  const handleLeave = () => { ref.current.style.transform = "translate(0,0)"; };
  return href ? (
    <a ref={ref} href={href} target="_blank" rel="noopener noreferrer" className={className} style={{ ...style, transition: "transform 0.2s ease-out", display: "inline-block", textDecoration: "none" }} onMouseMove={handleMove} onMouseLeave={handleLeave}>{children}</a>
  ) : (
    <button ref={ref} onClick={onClick} className={className} style={{ ...style, transition: "transform 0.2s ease-out" }} onMouseMove={handleMove} onMouseLeave={handleLeave}>{children}</button>
  );
}

function Section({ id, children }) {
  const [ref, visible] = useInView();
  return (
    <section id={id} ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(50px)", transition: "all 0.9s cubic-bezier(0.16, 1, 0.3, 1)", minHeight: "100vh", position: "relative" }}>
      {children}
    </section>
  );
}

// DATA
const skills = [
  { cat: "Languages", items: [
    { name: "Java (Core & Advanced)", level: 95, color: "#f89820" },
    { name: "C / C++", level: 88, color: "#00599C" },
    { name: "JavaScript", level: 85, color: "#f7df1e" },
    { name: "SQL", level: 90, color: "#336791" },
    { name: "Rust", level: 50, color: "#ce412b" },
  ]},
  { cat: "Frameworks & Backend", items: [
    { name: "Spring Boot", level: 90, color: "#6db33f" },
    { name: "Spring MVC / Data JPA", level: 87, color: "#6db33f" },
    { name: "Hibernate", level: 85, color: "#59666c" },
    { name: "Servlets / JSP", level: 88, color: "#e76f00" },
    { name: "React JS", level: 70, color: "#61dafb" },
  ]},
  { cat: "Databases & Tools", items: [
    { name: "MySQL / PostgreSQL", level: 90, color: "#336791" },
    { name: "MongoDB", level: 75, color: "#4db33d" },
    { name: "Redis", level: 72, color: "#dc382d" },
    { name: "Docker / Jenkins", level: 68, color: "#2496ed" },
    { name: "Git / Maven", level: 88, color: "#f05032" },
  ]},
];

const projects = [
  { title: "Railway Booking System", desc: "End-to-end reservation platform with auth, seat search, booking management, admin panel, dynamic fare calculation, JDBC connection pooling, and CSRF protection.", tech: ["Java", "Servlets", "JSP", "MySQL"], gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", icon: "🚂" },
  { title: "E-Commerce Microservices", desc: "Microservices backend with Product, Order, Auth, Payment services. RabbitMQ messaging, Resilience4j circuit breakers, Redis caching reducing API response by 45%.", tech: ["Spring Boot", "Docker", "RabbitMQ", "Redis"], gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", icon: "🛒" },
  { title: "URL Shortener Service", desc: "High-throughput URL shortener with Base62 encoding, custom aliases, expiration policies, click analytics, sub-10ms redirect via Redis, rate limiting with Bucket4j.", tech: ["Spring Boot", "MongoDB", "Redis"], gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)", icon: "🔗" },
  { title: "Real-Time Chat App", desc: "Messaging platform with private/group chats, typing indicators, read receipts via STOMP over WebSocket, JWT auth, message persistence, paginated history.", tech: ["Spring Boot", "WebSocket", "React", "PostgreSQL"], gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)", icon: "💬" },
];

const experience = [
  { title: "Member of Technical Staff", company: "Zoho Corporation", team: "ManageEngine Endpoint Central — UEMS Agent Framework", date: "Jul 2024 — Present", location: "Chennai, India", color: "#667eea", icon: "🔧",
    points: [
      "Built automated crash dump analysis tool integrated with Zoho Desk API — parses tickets, fetches PDB symbols, runs WinDbg CLI resolution, reducing triage time by 60%.",
      "Developed Java-based hourly log parser that auto-analyzes support tickets, identifies root causes, and posts diagnostics back.",
      "Created unified JSON handling framework in C++ using jsoncpp, improving consistency across 10+ agent components.",
      "Integrated crash analytics into Grafana dashboards and built Servlet/JSP dashboard for real-time monitoring."
    ]},
  { title: "Incubation Trainee", company: "Zoho Corporation", date: "Apr 2024 — Jul 2024", location: "Chennai, India", color: "#764ba2", icon: "🎓",
    points: ["Gained expertise in Windows networking (Domains, Active Directory) and built C/C++ tools for network diagnostics."]},
  { title: "Programmer Analyst", company: "Cognizant", date: "Feb 2022 — Oct 2023", location: "Remote / Coimbatore", color: "#4facfe", icon: "💻",
    points: [
      "Trained in Full Stack Java and MuleSoft API-led connectivity; built POC apps using Anypoint Platform.",
      "Developed responsive web interfaces with HTML5, CSS3, and Bootstrap."
    ]},
];

const socials = [
  { name: "LinkedIn", url: "https://linkedin.com/in/msamprakash", icon: "in", bg: "#0077b5" },
  { name: "GitHub", url: "https://github.com/Sam-Prakash-M", icon: "GH", bg: "#333" },
  { name: "LeetCode", url: "https://leetcode.com/u/Sam_Prakash/", icon: "LC", bg: "#ffa116" },
  { name: "HackerRank", url: "https://hackerrank.com/profile/msamprakash05", icon: "HR", bg: "#2ec866" },
  { name: "Portfolio", url: "https://sam-prakash-porfolio.onrender.com", icon: "🌐", bg: "#667eea" },
];

export default function Portfolio() {
  const [active, setActive] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [expandedExp, setExpandedExp] = useState(0);
  const [skillTab, setSkillTab] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      for (const s of [...SECTIONS].reverse()) {
        const el = document.getElementById(s);
        if (el && el.getBoundingClientRect().top < 200) { setActive(s); break; }
      }
    };
    const onMouse = (e) => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener("scroll", onScroll);
    window.addEventListener("mousemove", onMouse);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("mousemove", onMouse); };
  }, []);

  return (
    <div style={{ background: "#050816", color: "#fff", fontFamily: "'Inter', -apple-system, sans-serif", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }
        ::selection { background: rgba(102,126,234,0.4); }
        @keyframes float { 0%,100% { transform:translate(0,0); } 25% { transform:translate(12px,-18px); } 50% { transform:translate(-8px,12px); } 75% { transform:translate(14px,8px); } }
        @keyframes gradient { 0% { background-position:0% 50%; } 50% { background-position:100% 50%; } 100% { background-position:0% 50%; } }
        @keyframes pulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:.5; transform:scale(1.3); } }
        @keyframes morphBlob { 0%,100% { border-radius:60% 40% 30% 70%/60% 30% 70% 40%; } 50% { border-radius:30% 60% 70% 40%/50% 60% 30% 60%; } }
        @keyframes shimmer { 0% { transform:translateX(-100%); } 100% { transform:translateX(100%); } }
        @keyframes spin { to { transform:rotate(360deg); } }
        .g { background:rgba(255,255,255,0.02); backdrop-filter:blur(20px); border:1px solid rgba(255,255,255,0.06); }
        .g:hover { border-color:rgba(102,126,234,0.25); background:rgba(255,255,255,0.04); }
        .gt { background:linear-gradient(135deg,#667eea,#764ba2,#f093fb,#667eea); background-size:300% 300%; -webkit-background-clip:text; -webkit-text-fill-color:transparent; animation:gradient 4s ease infinite; }
        .nl { color:rgba(255,255,255,0.45); text-decoration:none; font-size:12px; font-weight:600; letter-spacing:1.5px; text-transform:uppercase; transition:all .3s; cursor:pointer; padding:8px 0; position:relative; }
        .nl:hover,.nl.a { color:#fff; }
        .nl.a::after { content:''; position:absolute; bottom:0; left:0; right:0; height:2px; background:linear-gradient(90deg,#667eea,#764ba2); border-radius:1px; }
        .pc { transition:all .4s cubic-bezier(.175,.885,.32,1.275); cursor:pointer; }
        .pc:hover { transform:translateY(-10px) scale(1.01); }
        .tt { padding:5px 14px; border-radius:20px; font-size:11px; font-weight:600; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.08); color:rgba(255,255,255,0.6); letter-spacing:.5px; }
        .sb { height:5px; background:rgba(255,255,255,0.04); border-radius:3px; overflow:hidden; position:relative; }
        .sf { height:100%; border-radius:3px; transition:width 1.5s cubic-bezier(.16,1,.3,1); position:relative; overflow:hidden; }
        .sf::after { content:''; position:absolute; inset:0; background:linear-gradient(90deg,transparent,rgba(255,255,255,.25),transparent); animation:shimmer 2s infinite; }
        .hb { display:none; flex-direction:column; gap:5px; cursor:pointer; z-index:1001; background:none; border:none; }
        .hb span { width:22px; height:2px; background:#fff; transition:all .3s; display:block; }
        @media(max-width:768px) { .hb{display:flex;} .nd{display:none!important;} .mm{display:flex!important;} }
        @media(min-width:769px) { .mm{display:none!important;} }
        .exp-card { transition: all 0.4s ease; cursor: pointer; }
        .exp-card:hover { border-color: rgba(102,126,234,0.3) !important; }
        .stab { padding:10px 20px; border-radius:10px; font-size:13px; font-weight:600; cursor:pointer; transition:all .3s; border:1px solid transparent; background:transparent; color:rgba(255,255,255,0.5); }
        .stab.act { background:linear-gradient(135deg,#667eea,#764ba2); color:#fff; border-color:transparent; }
        .stab:hover:not(.act) { border-color:rgba(255,255,255,0.15); color:#fff; }
      `}</style>

      {/* Particles */}
      <div style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none", overflow:"hidden" }}>
        {Array.from({length:40}).map((_,i)=>(
          <div key={i} style={{ position:"absolute", width:Math.random()*3+1+"px", height:Math.random()*3+1+"px",
            background:`rgba(${100+Math.random()*100},${120+Math.random()*100},255,${Math.random()*.4+.08})`,
            borderRadius:"50%", left:Math.random()*100+"%", top:Math.random()*100+"%",
            animation:`float ${10+Math.random()*15}s ease-in-out infinite`, animationDelay:`-${Math.random()*10}s` }} />
        ))}
      </div>

      {/* Cursor glow */}
      <div style={{ position:"fixed", width:350, height:350, borderRadius:"50%",
        background:"radial-gradient(circle,rgba(102,126,234,0.06),transparent 70%)",
        left:mouse.x-175, top:mouse.y-175, pointerEvents:"none", zIndex:1, transition:"left .3s ease-out,top .3s ease-out" }} />

      {/* NAV */}
      <nav className="g" style={{ position:"fixed", top:14, left:"50%", transform:"translateX(-50%)", zIndex:100, padding:"10px 28px", borderRadius:50, display:"flex", alignItems:"center", gap:28 }}>
        <span style={{ fontFamily:"'Space Grotesk'", fontWeight:700, fontSize:18, cursor:"pointer" }} onClick={()=>scrollTo("home")}>
          <span className="gt">SP</span>
        </span>
        <div className="nd" style={{ display:"flex", gap:22 }}>
          {SECTIONS.map(s=><span key={s} className={`nl ${active===s?"a":""}`} onClick={()=>scrollTo(s)}>{s}</span>)}
        </div>
        <button className="hb" onClick={()=>setMenuOpen(!menuOpen)}>
          <span style={{ transform:menuOpen?"rotate(45deg) translate(5px,5px)":"none" }} />
          <span style={{ opacity:menuOpen?0:1 }} />
          <span style={{ transform:menuOpen?"rotate(-45deg) translate(5px,-5px)":"none" }} />
        </button>
      </nav>

      {/* Mobile menu */}
      <div className="mm" style={{ display:"none", position:"fixed", inset:0, zIndex:99, background:"rgba(5,8,22,0.95)", backdropFilter:"blur(20px)",
        flexDirection:"column", alignItems:"center", justifyContent:"center", gap:28,
        opacity:menuOpen?1:0, pointerEvents:menuOpen?"auto":"none", transition:"opacity .3s" }}>
        {SECTIONS.map(s=><span key={s} className="nl" style={{fontSize:18}} onClick={()=>{scrollTo(s);setMenuOpen(false);}}>{s}</span>)}
      </div>

      {/* ===== HERO ===== */}
      <Section id="home">
        <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", padding:"120px 24px 80px", position:"relative", zIndex:2 }}>
          <div style={{ maxWidth:1200, margin:"0 auto", width:"100%", display:"flex", flexWrap:"wrap", alignItems:"center", gap:60 }}>
            <div style={{ flex:"1 1 500px" }}>
              <div className="g" style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"8px 20px", borderRadius:50, marginBottom:24 }}>
                <span style={{ width:8, height:8, background:"#10b981", borderRadius:"50%", animation:"pulse 2s infinite" }} />
                <span style={{ fontSize:12, fontWeight:500, color:"rgba(255,255,255,0.6)" }}>Available for new opportunities</span>
              </div>
              <h1 style={{ fontFamily:"'Space Grotesk'", fontSize:"clamp(2.8rem,7vw,5rem)", fontWeight:800, lineHeight:1.05, letterSpacing:-3, marginBottom:20 }}>
                Hi, I'm<br/><span className="gt">Sam Prakash</span>
              </h1>
              <p style={{ fontSize:"clamp(1rem,2vw,1.2rem)", color:"rgba(255,255,255,0.45)", lineHeight:1.8, maxWidth:540, marginBottom:12 }}>
                Backend engineer specializing in <span style={{color:"#f89820"}}>Java</span>,{" "}
                <span style={{color:"#6db33f"}}>Spring Boot</span>, and{" "}
                <span style={{color:"#61dafb"}}>scalable microservices</span>.
              </p>
              <p style={{ fontSize:14, color:"rgba(255,255,255,0.35)", lineHeight:1.8, maxWidth:540, marginBottom:32 }}>
                2+ years building crash analysis pipelines, automation tools, and enterprise backend systems at Zoho & Cognizant.
              </p>
              <div style={{ display:"flex", gap:14, flexWrap:"wrap" }}>
                <MagButton onClick={()=>scrollTo("projects")} style={{ padding:"14px 32px", borderRadius:12, fontWeight:700, color:"#fff",
                  background:"linear-gradient(135deg,#667eea,#764ba2)", border:"none", cursor:"pointer", fontSize:15 }}>
                  View My Work ↗
                </MagButton>
                <MagButton href="mailto:msamprakash05@gmail.com" style={{ padding:"14px 32px", borderRadius:12, fontWeight:600, color:"#fff",
                  background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.1)", cursor:"pointer", fontSize:15 }}>
                  Get In Touch
                </MagButton>
              </div>
            </div>
            <div style={{ flex:"1 1 300px", display:"flex", justifyContent:"center" }}>
              <div style={{ position:"relative", width:320, height:320 }}>
                <div style={{ position:"absolute", inset:-30, background:"linear-gradient(135deg,#667eea,#764ba2)", borderRadius:"50%", filter:"blur(60px)", opacity:.35, animation:"morphBlob 8s ease-in-out infinite" }} />
                {/* Orbit ring */}
                <div style={{ position:"absolute", inset:-10, border:"1px solid rgba(255,255,255,0.05)", borderRadius:"50%", animation:"spin 25s linear infinite" }}>
                  <div style={{ position:"absolute", top:-5, left:"50%", width:10, height:10, background:"#667eea", borderRadius:"50%", marginLeft:-5 }} />
                </div>
                <div style={{ position:"relative", width:320, height:320, borderRadius:"50%",
                  background:"linear-gradient(135deg,rgba(102,126,234,0.15),rgba(118,75,162,0.15))",
                  border:"2px solid rgba(255,255,255,0.08)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <span style={{ fontFamily:"'Space Grotesk'", fontWeight:800, fontSize:80, background:"linear-gradient(135deg,#667eea,#764ba2)",
                    WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>SP</span>
                </div>
                {["☕ Java","🚀 Spring Boot","⚡ C++","🔥 REST API"].map((t,i)=>(
                  <div key={i} className="g" style={{ position:"absolute", padding:"7px 14px", borderRadius:10, fontSize:12, fontWeight:600, whiteSpace:"nowrap",
                    animation:`float ${6+i*1.5}s ease-in-out infinite`, animationDelay:`${i*-1.5}s`,
                    ...[{top:"2%",left:"-18%"},{top:"68%",left:"-22%"},{top:"8%",right:"-18%"},{bottom:"5%",right:"-22%"}][i]
                  }}>{t}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ===== ABOUT ===== */}
      <Section id="about">
        <div style={{ maxWidth:1200, margin:"0 auto", padding:"100px 24px", position:"relative", zIndex:2 }}>
          <span className="g" style={{ padding:"8px 20px", borderRadius:50, fontSize:12, fontWeight:600, color:"#667eea", display:"inline-block", marginBottom:12 }}>👤 About Me</span>
          <h2 style={{ fontFamily:"'Space Grotesk'", fontSize:"clamp(2rem,4vw,3rem)", fontWeight:800, marginBottom:40 }}>
            Who I <span className="gt">Am</span>
          </h2>
          <div style={{ display:"flex", flexWrap:"wrap", gap:40 }}>
            <div style={{ flex:"1 1 450px" }}>
              <p style={{ color:"rgba(255,255,255,0.55)", lineHeight:1.9, fontSize:15, marginBottom:20 }}>
                Backend engineer with 2+ years of experience at <strong style={{color:"#fff"}}>Zoho Corporation</strong> and <strong style={{color:"#fff"}}>Cognizant</strong>,
                building scalable Java applications, automating crash analysis pipelines, and developing system-level tools in C/C++.
              </p>
              <p style={{ color:"rgba(255,255,255,0.55)", lineHeight:1.9, fontSize:15 }}>
                Skilled in Spring Boot, RESTful APIs, and enterprise Java with a strong foundation in debugging,
                performance optimization, and cross-platform development. Passionate about microservices architecture
                and building tools that solve real engineering problems.
              </p>
            </div>
            <div style={{ flex:"1 1 250px", display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(130px, 1fr))", gap:14 }}>
              {[
                { num:2, suffix:"+", label:"Years Experience" },
                { num:15, suffix:"+", label:"Projects Delivered" },
                { num:60, suffix:"%", label:"Triage Time Saved" },
                { num:10, suffix:"+", label:"Agent Components" },
              ].map((s,i)=>(
                <div key={i} className="g" style={{ padding:22, borderRadius:16, textAlign:"center", transition:"all .3s" }}>
                  <div style={{ fontFamily:"'Space Grotesk'", fontSize:30, fontWeight:800, lineHeight:1 }}>
                    <Counter end={s.num} suffix={s.suffix} />
                  </div>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginTop:8, fontWeight:500 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ===== SKILLS ===== */}
      <Section id="skills">
        <div style={{ maxWidth:1200, margin:"0 auto", padding:"100px 24px", position:"relative", zIndex:2 }}>
          <span className="g" style={{ padding:"8px 20px", borderRadius:50, fontSize:12, fontWeight:600, color:"#667eea", display:"inline-block", marginBottom:12 }}>🛠️ Technical Arsenal</span>
          <h2 style={{ fontFamily:"'Space Grotesk'", fontSize:"clamp(2rem,4vw,3rem)", fontWeight:800, marginBottom:32 }}>
            Skills & <span className="gt">Technologies</span>
          </h2>

          {/* Tabs */}
          <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:32 }}>
            {skills.map((cat,i)=>(
              <button key={i} className={`stab ${skillTab===i?"act":""}`} onClick={()=>setSkillTab(i)}>{cat.cat}</button>
            ))}
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(300px, 1fr))", gap:16 }}>
            {skills[skillTab].items.map((s,i)=>{
              const [ref, visible] = useInView();
              return (
                <div key={`${skillTab}-${i}`} ref={ref} className="g" style={{ padding:22, borderRadius:14, transition:"all .3s" }}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
                    <span style={{ fontWeight:700, fontSize:14 }}>{s.name}</span>
                    <span style={{ fontSize:12, fontWeight:700, color:s.color }}>{s.level}%</span>
                  </div>
                  <div className="sb">
                    <div className="sf" style={{ width:visible?s.level+"%":"0%", background:`linear-gradient(90deg,${s.color},${s.color}66)` }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Concepts */}
          <div style={{ marginTop:32 }}>
            <h3 style={{ fontFamily:"'Space Grotesk'", fontSize:16, fontWeight:700, marginBottom:16, color:"rgba(255,255,255,0.7)" }}>Core Concepts</h3>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {["Microservices","REST APIs","Design Patterns","JVM Tuning","Multithreading","CI/CD","JUnit/Mockito","Agile/Scrum"].map((c,i)=>(
                <span key={i} className="tt">{c}</span>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ===== PROJECTS ===== */}
      <Section id="projects">
        <div style={{ maxWidth:1200, margin:"0 auto", padding:"100px 24px", position:"relative", zIndex:2 }}>
          <span className="g" style={{ padding:"8px 20px", borderRadius:50, fontSize:12, fontWeight:600, color:"#667eea", display:"inline-block", marginBottom:12 }}>🚀 Innovation</span>
          <h2 style={{ fontFamily:"'Space Grotesk'", fontSize:"clamp(2rem,4vw,3rem)", fontWeight:800, marginBottom:48 }}>
            Featured <span className="gt">Projects</span>
          </h2>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(320px, 1fr))", gap:24 }}>
            {projects.map((p,i)=>(
              <div key={i} className="pc g" style={{ borderRadius:20, overflow:"hidden" }}>
                <div style={{ height:150, background:p.gradient, display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>
                  <span style={{ fontSize:52 }}>{p.icon}</span>
                  <span style={{ position:"absolute", top:14, left:18, fontSize:44, fontWeight:800, fontFamily:"'Space Grotesk'", color:"rgba(255,255,255,0.12)" }}>
                    {String(i+1).padStart(2,"0")}
                  </span>
                </div>
                <div style={{ padding:24 }}>
                  <h3 style={{ fontFamily:"'Space Grotesk'", fontSize:17, fontWeight:700, marginBottom:10, lineHeight:1.3 }}>{p.title}</h3>
                  <p style={{ color:"rgba(255,255,255,0.45)", fontSize:13, lineHeight:1.7, marginBottom:14 }}>{p.desc}</p>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                    {p.tech.map((t,j)=><span key={j} className="tt">{t}</span>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ===== EXPERIENCE ===== */}
      <Section id="experience">
        <div style={{ maxWidth:1200, margin:"0 auto", padding:"100px 24px", position:"relative", zIndex:2 }}>
          <span className="g" style={{ padding:"8px 20px", borderRadius:50, fontSize:12, fontWeight:600, color:"#667eea", display:"inline-block", marginBottom:12 }}>💼 Career</span>
          <h2 style={{ fontFamily:"'Space Grotesk'", fontSize:"clamp(2rem,4vw,3rem)", fontWeight:800, marginBottom:48 }}>
            Professional <span className="gt">Journey</span>
          </h2>
          <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
            {experience.map((e,i)=>(
              <div key={i} className="exp-card g" onClick={()=>setExpandedExp(expandedExp===i?-1:i)}
                style={{ padding:28, borderRadius:18, borderLeft:`3px solid ${e.color}`, transition:"all .4s" }}>
                <div style={{ display:"flex", flexWrap:"wrap", alignItems:"flex-start", gap:18 }}>
                  <div style={{ width:52, height:52, background:`linear-gradient(135deg,${e.color},${e.color}88)`, borderRadius:13,
                    display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>{e.icon}</div>
                  <div style={{ flex:1, minWidth:200 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:8 }}>
                      <div>
                        <h3 style={{ fontFamily:"'Space Grotesk'", fontSize:18, fontWeight:700, marginBottom:3 }}>{e.title}</h3>
                        <p style={{ color:e.color, fontWeight:600, fontSize:14 }}>{e.company}</p>
                        {e.team && <p style={{ color:"rgba(255,255,255,0.35)", fontSize:12, fontStyle:"italic", marginTop:2 }}>{e.team}</p>}
                      </div>
                      <div style={{ textAlign:"right" }}>
                        <div className="g" style={{ padding:"5px 14px", borderRadius:8, fontSize:12, fontWeight:500, color:"rgba(255,255,255,0.5)", display:"inline-block" }}>{e.date}</div>
                        <p style={{ fontSize:11, color:"rgba(255,255,255,0.3)", marginTop:4 }}>{e.location}</p>
                      </div>
                    </div>
                    <div style={{ maxHeight:expandedExp===i?500:0, overflow:"hidden", transition:"max-height .5s ease", marginTop:expandedExp===i?16:0 }}>
                      {e.points.map((pt,j)=>(
                        <div key={j} style={{ display:"flex", gap:10, marginBottom:10 }}>
                          <span style={{ color:e.color, flexShrink:0, marginTop:2 }}>▸</span>
                          <p style={{ color:"rgba(255,255,255,0.55)", fontSize:13, lineHeight:1.7 }}>{pt}</p>
                        </div>
                      ))}
                    </div>
                    <span style={{ fontSize:11, color:"rgba(255,255,255,0.3)", marginTop:8, display:"inline-block" }}>
                      {expandedExp===i?"Click to collapse ▲":"Click to expand ▼"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Education + Certs */}
          <div style={{ display:"flex", flexWrap:"wrap", gap:20, marginTop:40 }}>
            <div className="g" style={{ flex:"1 1 300px", padding:28, borderRadius:18 }}>
              <h3 style={{ fontFamily:"'Space Grotesk'", fontSize:16, fontWeight:700, marginBottom:16 }}>🎓 Education</h3>
              <div style={{ marginBottom:14 }}>
                <p style={{ fontWeight:700, fontSize:14 }}>Thiagarajar College</p>
                <p style={{ color:"rgba(255,255,255,0.5)", fontSize:13 }}>BE in Mechatronics Engineering</p>
                <p style={{ color:"rgba(255,255,255,0.35)", fontSize:12 }}>2018 — 2022 | Madurai, TN</p>
              </div>
              <div>
                <p style={{ fontWeight:700, fontSize:14 }}>Zoho School</p>
                <p style={{ color:"rgba(255,255,255,0.5)", fontSize:13 }}>Graduate Training — Java, MySQL, Servlets, JSP</p>
                <p style={{ color:"rgba(255,255,255,0.35)", fontSize:12 }}>Oct 2023 — Jan 2024 | Tenkasi</p>
              </div>
            </div>
            <div className="g" style={{ flex:"1 1 300px", padding:28, borderRadius:18 }}>
              <h3 style={{ fontFamily:"'Space Grotesk'", fontSize:16, fontWeight:700, marginBottom:16 }}>📜 Certifications</h3>
              {["Java SE — HackerRank","Spring Boot — Udemy","Problem Solving — HackerRank"].map((c,i)=>(
                <div key={i} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
                  <div style={{ width:8, height:8, background:"linear-gradient(135deg,#667eea,#764ba2)", borderRadius:"50%", flexShrink:0 }} />
                  <span style={{ color:"rgba(255,255,255,0.6)", fontSize:14 }}>{c}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ===== CONTACT ===== */}
      <Section id="contact">
        <div style={{ maxWidth:800, margin:"0 auto", padding:"100px 24px", textAlign:"center", position:"relative", zIndex:2 }}>
          <span className="g" style={{ padding:"8px 20px", borderRadius:50, fontSize:12, fontWeight:600, color:"#667eea", display:"inline-block", marginBottom:12 }}>🔗 Connect</span>
          <h2 style={{ fontFamily:"'Space Grotesk'", fontSize:"clamp(2rem,4vw,3rem)", fontWeight:800, marginBottom:16 }}>
            Let's Build Something <span className="gt">Great</span>
          </h2>
          <p style={{ color:"rgba(255,255,255,0.4)", fontSize:15, lineHeight:1.8, maxWidth:480, margin:"0 auto 40px" }}>
            Open to discussing Java backend roles, interesting engineering challenges, or collaboration opportunities.
          </p>

          <div className="g" style={{ padding:36, borderRadius:22, marginBottom:32 }}>
            <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"center", gap:28, marginBottom:28 }}>
              {[
                { label:"Email", value:"msamprakash05@gmail.com", href:"mailto:msamprakash05@gmail.com" },
                { label:"Phone", value:"+91 6385812669" },
                { label:"Location", value:"Chennai, India" },
              ].map((c,i)=>(
                <div key={i} style={{ textAlign:"center" }}>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,0.35)", marginBottom:4, textTransform:"uppercase", letterSpacing:1 }}>{c.label}</div>
                  {c.href ? <a href={c.href} style={{ color:"#667eea", textDecoration:"none", fontWeight:600, fontSize:14 }}>{c.value}</a>
                    : <span style={{ color:"#fff", fontWeight:600, fontSize:14 }}>{c.value}</span>}
                </div>
              ))}
            </div>
            <div style={{ display:"flex", justifyContent:"center", gap:10, flexWrap:"wrap" }}>
              {socials.map((s,i)=>(
                <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
                  style={{ width:48, height:48, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center",
                    fontWeight:700, fontSize:13, textDecoration:"none", color:"#fff", transition:"all .3s",
                    background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)" }}
                  onMouseEnter={e=>{e.target.style.background=s.bg;e.target.style.transform="translateY(-3px)";}}
                  onMouseLeave={e=>{e.target.style.background="rgba(255,255,255,0.04)";e.target.style.transform="translateY(0)";}}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <MagButton href="mailto:msamprakash05@gmail.com" style={{ padding:"16px 40px", borderRadius:14, fontWeight:700, color:"#fff",
            background:"linear-gradient(135deg,#667eea,#764ba2)", border:"none", cursor:"pointer", fontSize:16,
            boxShadow:"0 10px 40px rgba(102,126,234,0.3)" }}>
            ✉️ Send Me an Email
          </MagButton>
        </div>
      </Section>

      <footer style={{ borderTop:"1px solid rgba(255,255,255,0.05)", padding:"28px 24px", textAlign:"center", position:"relative", zIndex:2 }}>
        <p style={{ color:"rgba(255,255,255,0.25)", fontSize:13 }}>© 2026 Sam Prakash M · Crafted with ❤️ and Java</p>
      </footer>
    </div>
  );
}
