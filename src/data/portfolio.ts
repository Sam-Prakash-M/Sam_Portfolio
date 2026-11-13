import type { IconType } from "react-icons";
import { FaJava, FaDocker, FaGitAlt, FaLinkedinIn, FaGithub, FaHackerrank, FaDatabase } from "react-icons/fa";
import {
  SiSpringboot, SiSpring, SiPostgresql, SiMongodb, SiRedis, SiJavascript, SiCplusplus,
  SiApachekafka, SiHibernate, SiJenkins, SiGrafana, SiPostman, SiMysql,
  SiApachetomcat, SiLeetcode, SiApachemaven, SiLangchain,
} from "react-icons/si";
import { FiCode, FiServer, FiCpu, FiDatabase, FiTool, FiLayers } from "react-icons/fi";

export interface SkillItem { name: string; icon?: IconType; color?: string }
export interface SkillGroup { title: string; icon: IconType; items: SkillItem[] }
export interface Project { title: string; kind: string; summary: string; points: string[]; tech: string[] }
export interface Experience {
  role: string; company: string; team?: string; period: string;
  location: string; current: boolean; points: string[]; tags: string[];
}
export interface Social { name: string; handle: string; url: string; icon: IconType }

export const RESUME_URL = "/Sam_Prakash_Latest_Resume.pdf";
export const EMAIL = "msamprakash05@gmail.com";
export const PHONE = "+91 6385812669";
export const LOCATION = "Chennai, India";

export const SECTIONS = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

export const skillGroups: SkillGroup[] = [
  {
    title: "Languages", icon: FiCode,
    items: [
      { name: "Java (Core & Advanced)", icon: FaJava, color: "#f89820" },
      { name: "C / C++", icon: SiCplusplus, color: "#659ad2" },
      { name: "JavaScript", icon: SiJavascript, color: "#f7df1e" },
      { name: "SQL", icon: FaDatabase, color: "#7aa2f7" },
    ],
  },
  {
    title: "Backend & Frameworks", icon: FiServer,
    items: [
      { name: "Spring Boot", icon: SiSpringboot, color: "#6db33f" },
      { name: "Spring MVC", icon: SiSpring, color: "#6db33f" },
      { name: "Spring Data JPA", icon: SiSpring, color: "#6db33f" },
      { name: "Hibernate", icon: SiHibernate, color: "#bcae79" },
      { name: "Servlets / JSP" },
      { name: "Apache Kafka", icon: SiApachekafka, color: "#e4e4e7" },
    ],
  },
  {
    title: "AI / GenAI", icon: FiCpu,
    items: [
      { name: "LLM Integration" },
      { name: "RAG" },
      { name: "pgvector", icon: SiPostgresql, color: "#6c9bd2" },
      { name: "Embeddings" },
      { name: "LangChain4j", icon: SiLangchain, color: "#7fc8a9" },
    ],
  },
  {
    title: "Databases", icon: FiDatabase,
    items: [
      { name: "MySQL", icon: SiMysql, color: "#5d9cc9" },
      { name: "PostgreSQL", icon: SiPostgresql, color: "#6c9bd2" },
      { name: "MongoDB", icon: SiMongodb, color: "#4db33d" },
      { name: "Redis", icon: SiRedis, color: "#ff6b5e" },
    ],
  },
  {
    title: "Tools & DevOps", icon: FiTool,
    items: [
      { name: "Git", icon: FaGitAlt, color: "#f05032" },
      { name: "Maven", icon: SiApachemaven, color: "#e5536d" },
      { name: "Docker", icon: FaDocker, color: "#2496ed" },
      { name: "Jenkins", icon: SiJenkins, color: "#e8695b" },
      { name: "Grafana", icon: SiGrafana, color: "#f46800" },
      { name: "WinDbg" },
      { name: "Postman", icon: SiPostman, color: "#ff6c37" },
      { name: "Apache Tomcat", icon: SiApachetomcat, color: "#f8dc75" },
    ],
  },
  {
    title: "Concepts", icon: FiLayers,
    items: [
      { name: "Microservices" }, { name: "REST APIs" }, { name: "Distributed Systems" },
      { name: "System Design" }, { name: "Event-Driven" }, { name: "Multithreading" },
      { name: "CI/CD" }, { name: "Agile" },
    ],
  },
];

export const marquee = [
  "Java", "Spring Boot", "Apache Kafka", "PostgreSQL", "pgvector", "Redis", "LangChain4j",
  "RAG", "Docker", "C / C++", "MongoDB", "Microservices", "System Design", "Grafana",
];

export const projects: Project[] = [
  {
    title: "AI Document Intelligence Platform",
    kind: "RAG backend",
    summary: "Embeds documents and serves grounded, source-cited answers over a REST API.",
    points: [
      "API-key authentication and rate limiting in front of the question-answering endpoints.",
      "Vector search on PostgreSQL + pgvector with Redis caching and LangChain4j LLM integration; fully Dockerized.",
    ],
    tech: ["Spring Boot", "LangChain4j", "pgvector", "Redis", "Docker"],
  },
  {
    title: "Distributed Log Intelligence Pipeline",
    kind: "Event-driven system",
    summary: "Ingests high-volume logs via Kafka and correlates them into incidents with horizontally scalable consumers.",
    points: [
      "LLM-assisted root-cause tagging and severity classification with signature deduplication.",
      "Redis-backed state, REST APIs and a metrics dashboard.",
    ],
    tech: ["Spring Boot", "Apache Kafka", "PostgreSQL", "Redis", "Docker"],
  },
  {
    title: "Railway Booking System",
    kind: "Full-stack platform",
    summary: "Reservation platform with smart search, PNR tracking, QR ticketing, dynamic fares and waitlist promotion.",
    points: [
      "PayPal, Razorpay and Cashfree payment gateways.",
      "jBCrypt password hashing, session auth and multi-step OTP recovery.",
    ],
    tech: ["Java", "Jakarta EE", "JSP", "MongoDB"],
  },
];

export const experiences: Experience[] = [
  {
    role: "Member of Technical Staff", company: "Zoho Corporation", team: "ManageEngine Endpoint Central",
    period: "Jul 2024 — Present", location: "Chennai", current: true,
    points: [
      "Built a web crash-triage dashboard (symbolized stack traces, faulting-module data, multi-dimensional filters), cutting triage time by 60%.",
      "Engineered stack-trace deduplication — one canonical ticket per crash signature, auto-assigning the DRI via the faulting file.",
      "Developed a crash-dump analysis tool (Zoho Desk API) that fetches PDBs and drives WinDbg/CDB to extract stack traces and line numbers as JSON.",
      "Designed and maintained the Solaris agent — inventory scan, patch scan and secure agent–server communication.",
      "Led CVE remediation across the C/C++ stack (curl, zlib, libxml2), owned the MSVC/CMake build, and shipped a shared jsoncpp framework across 10+ components with Grafana analytics.",
    ],
    tags: ["Java", "C/C++", "WinDbg", "CMake", "Grafana", "Solaris"],
  },
  {
    role: "Graduate Trainee", company: "Zoho Corporation", team: "Zoho School → Incubation",
    period: "Oct 2023 — Jul 2024", location: "Tenkasi / Chennai", current: false,
    points: [
      "Zoho School training (Java, MySQL, Servlets, JSP); moved to incubation building Windows AD networking and C/C++ tools.",
    ],
    tags: ["Java", "MySQL", "Servlets/JSP", "C/C++", "Active Directory"],
  },
  {
    role: "Programmer Analyst", company: "Cognizant",
    period: "Feb 2022 — Oct 2023", location: "Remote / Coimbatore", current: false,
    points: [
      "Full-stack Java and MuleSoft API-led connectivity training; built POC apps and responsive web interfaces.",
    ],
    tags: ["Java", "MuleSoft", "Full Stack"],
  },
];

export const socials: Social[] = [
  { name: "LinkedIn", handle: "msamprakash", url: "https://linkedin.com/in/msamprakash", icon: FaLinkedinIn },
  { name: "GitHub", handle: "Sam-Prakash-M", url: "https://github.com/Sam-Prakash-M", icon: FaGithub },
  { name: "LeetCode", handle: "Sam_Prakash", url: "https://leetcode.com/u/Sam_Prakash/", icon: SiLeetcode },
  { name: "HackerRank", handle: "msamprakash05", url: "https://hackerrank.com/profile/msamprakash05", icon: FaHackerrank },
];

export const stats = [
  { n: 4, s: "+", label: "Years in software" },
  { n: 60, s: "%", label: "Faster crash triage" },
  { n: 10, s: "+", label: "Components on shared framework" },
];

export const education = [
  { title: "BE, Mechatronics Engineering", place: "Thiagarajar College of Engineering, Madurai", period: "2018 — 2022" },
  { title: "HSC (Higher Secondary)", place: "Amir Jamal HSS, Tirunelveli", period: "2017 — 2018" },
];

export const achievements = [
  { score: "200/200", label: "Mathematics — 12th HSC" },
  { score: "100/100", label: "Mathematics — 10th SSLC" },
];

export const certifications = ["Java SE — HackerRank", "Spring Boot — Udemy", "Problem Solving — HackerRank"];
