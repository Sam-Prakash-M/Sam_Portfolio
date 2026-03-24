import type { IconType } from "react-icons";
import {
  FaJava, FaReact, FaDocker, FaGitAlt, FaLinkedinIn,
  FaGithub, FaHackerrank, FaDatabase,
} from "react-icons/fa";
import {
  SiSpringboot, SiPostgresql, SiMongodb, SiRedis,
  SiJavascript, SiCplusplus, SiApachekafka, SiRabbitmq,
  SiHibernate, SiJenkins, SiGrafana, SiPostman, SiMysql,
  SiApachetomcat, SiRust, SiLeetcode, SiTypescript, SiApachemaven,
} from "react-icons/si";

export interface Skill { name: string; icon: IconType; color: string }
export interface Project { title: string; desc: string; tech: string[]; gradient: string; icon: string }
export interface Experience {
  role: string; company: string; team?: string; period: string;
  location: string; current: boolean; color: string;
  points: string[]; tags: string[];
}
export interface Social { name: string; url: string; icon: IconType; color: string }

export const SECTIONS = ["home", "about", "skills", "projects", "experience", "contact"];

export const skills: Skill[] = [
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

export const projects: Project[] = [
  { title: "Railway Booking System", desc: "Train reservation: smart search, PNR tracking, QR e-ticketing, dynamic fares, waitlist promotion. PayPal + Razorpay + Cashfree; jBCrypt, session auth, OTP recovery via SMTP.", tech: ["Java", "Jakarta EE", "JSP", "MongoDB"], gradient: "linear-gradient(135deg, #667eea, #764ba2)", icon: "🚂" },
  { title: "E-Commerce Microservices", desc: "Independent services (Product, Order, Auth, Payment) via RabbitMQ; Eureka & Spring Cloud Gateway. Redis caching → 45% faster; Resilience4j; Docker Compose.", tech: ["Spring Boot", "Docker", "RabbitMQ", "Redis"], gradient: "linear-gradient(135deg, #f093fb, #f5576c)", icon: "🛒" },
  { title: "URL Shortener Service", desc: "REST API: Base62 encoding, custom aliases, expiration, geo-tracked analytics. Redis → sub-10ms redirects; Bucket4j rate-limiting; Spring Security + OpenAPI.", tech: ["Spring Boot", "PostgreSQL", "Redis"], gradient: "linear-gradient(135deg, #4facfe, #00f2fe)", icon: "🔗" },
  { title: "Real-Time Chat App", desc: "Private & group messaging: typing indicators, read receipts, presence via STOMP/WebSocket. JWT w/ refresh tokens, MongoDB persistence, file sharing.", tech: ["Spring Boot", "WebSocket", "React", "MongoDB"], gradient: "linear-gradient(135deg, #43e97b, #38f9d7)", icon: "💬" },
];

export const experiences: Experience[] = [
  { role: "Member of Technical Staff", company: "Zoho Corporation", team: "ManageEngine — Endpoint Central", period: "Jul 2024 — Present", location: "Chennai", current: true, color: "#818cf8", points: ["Built crash dump analysis tool integrated with Zoho Desk API — reducing triage time by 60%", "Java-based hourly log parser: auto-analyzes tickets, posts root-cause diagnostics", "Unified C++ JSON framework (jsoncpp) across 10+ agent components; Grafana dashboards"], tags: ["Java", "C++", "Grafana", "WinDbg"] },
  { role: "Graduate Trainee", company: "Zoho Corporation", team: "Zoho School of Learning → Incubation", period: "Oct 2023 — Jul 2024", location: "Tenkasi / Chennai", current: false, color: "#a78bfa", points: ["Intensive Java, MySQL, Servlets, JSP training at Zoho School", "Incubation: Windows networking (Active Directory) and C/C++ system tools"], tags: ["Java", "MySQL", "C/C++", "Windows Server"] },
  { role: "Programmer Analyst", company: "Cognizant", team: "Technology Solutions Group", period: "Feb 2022 — Oct 2023", location: "Remote / Coimbatore", current: false, color: "#22d3ee", points: ["Full Stack Java training & enterprise app development", "MuleSoft API-led connectivity; built POC apps & responsive web interfaces"], tags: ["Java", "MuleSoft", "Full Stack"] },
];

export const socials: Social[] = [
  { name: "LinkedIn", url: "https://linkedin.com/in/msamprakash", icon: FaLinkedinIn, color: "#0077b5" },
  { name: "GitHub", url: "https://github.com/Sam-Prakash-M", icon: FaGithub, color: "#e6edf3" },
  { name: "LeetCode", url: "https://leetcode.com/u/Sam_Prakash/", icon: SiLeetcode, color: "#ffa116" },
  { name: "HackerRank", url: "https://hackerrank.com/profile/msamprakash05", icon: FaHackerrank, color: "#2ec866" },
];

export const stats = [
  { n: 3, s: "+", label: "Years", emoji: "💼" },
  { n: 60, s: "%", label: "Triage Saved", emoji: "⚡" },
  { n: 10, s: "+", label: "Components", emoji: "🧩" },
  { n: 4, s: "+", label: "Projects", emoji: "🚀" },
];

export const concepts = [
  "Microservices", "REST APIs", "Design Patterns", "JVM Tuning", "Multithreading",
  "CI/CD", "JUnit/Mockito", "Agile", "System Design", "DSA", "WebSocket",
  "Spring Security", "OAuth2/JWT", "Crash Analysis",
];

