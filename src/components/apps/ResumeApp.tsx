"use client";

import React, { useState, useRef } from "react";
import { 
  Download, 
  ZoomIn, 
  ZoomOut, 
  FileText,
  ExternalLink,
  Eye,
  FileCheck
} from "lucide-react";
import { sounds } from "@/utils/sound";

export function ResumeApp() {
  const [zoom, setZoom] = useState(100);
  const [activePage, setActivePage] = useState<1 | 2>(1);
  const [viewMode, setViewMode] = useState<"document" | "native">("document");
  const page1Ref = useRef<HTMLDivElement>(null);
  const page2Ref = useRef<HTMLDivElement>(null);

  const scrollToPage = (page: 1 | 2) => {
    setActivePage(page);
    sounds.playClick();
    if (page === 1) {
      page1Ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      page2Ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleDownload = () => {
    sounds.playClick();
    const link = document.createElement("a");
    link.href = "/Pranshu_Rajan_Resume.pdf";
    link.download = "Pranshu_Rajan_Resume.pdf";
    link.click();
  };

  return (
    <div className="flex h-full bg-[#24242c] text-white select-text">
      {/* Left Sidebar: 2-Page Thumbnails */}
      <div className="w-48 border-r border-white/10 bg-[#1a1a20] p-3 flex flex-col items-center select-none shrink-0 overflow-y-auto">
        <div className="text-[10px] uppercase font-bold tracking-wider text-white/40 mb-3 w-full text-left">
          Pages (2 Pages)
        </div>

        {/* Thumbnail 1 */}
        <button
          onClick={() => scrollToPage(1)}
          className={`w-36 h-48 rounded-lg p-2.5 flex flex-col justify-between shadow-lg transition-all mb-3 text-left ${
            activePage === 1
              ? "bg-white/15 border-2 border-blue-500 shadow-blue-500/20"
              : "bg-white/5 border border-white/10 hover:bg-white/10"
          }`}
        >
          <div className="space-y-1 w-full">
            <div className="w-20 h-2 rounded bg-white/60 font-bold" />
            <div className="w-28 h-1 rounded bg-white/30" />
            <div className="w-full h-0.5 rounded bg-white/20 mt-2" />
            <div className="w-full h-0.5 rounded bg-white/20" />
            <div className="w-4/5 h-0.5 rounded bg-white/15" />
            <div className="w-full h-0.5 rounded bg-white/10 mt-2" />
            <div className="w-3/4 h-0.5 rounded bg-white/10" />
          </div>
          <div className="flex items-center justify-between text-[10px] text-white/70 w-full pt-2 border-t border-white/10">
            <span className="font-semibold">Page 1</span>
            <span className="text-[9px] text-white/40">Skills & Exp</span>
          </div>
        </button>

        {/* Thumbnail 2 */}
        <button
          onClick={() => scrollToPage(2)}
          className={`w-36 h-48 rounded-lg p-2.5 flex flex-col justify-between shadow-lg transition-all text-left ${
            activePage === 2
              ? "bg-white/15 border-2 border-blue-500 shadow-blue-500/20"
              : "bg-white/5 border border-white/10 hover:bg-white/10"
          }`}
        >
          <div className="space-y-1 w-full">
            <div className="w-16 h-1.5 rounded bg-white/40" />
            <div className="w-24 h-1 rounded bg-white/20" />
            <div className="w-full h-0.5 rounded bg-white/15 mt-2" />
            <div className="w-full h-0.5 rounded bg-white/15" />
            <div className="w-2/3 h-0.5 rounded bg-white/10" />
            <div className="w-full h-0.5 rounded bg-white/15 mt-2" />
            <div className="w-4/5 h-0.5 rounded bg-white/10" />
          </div>
          <div className="flex items-center justify-between text-[10px] text-white/70 w-full pt-2 border-t border-white/10">
            <span className="font-semibold">Page 2</span>
            <span className="text-[9px] text-white/40">Projects & Certs</span>
          </div>
        </button>

        <div className="mt-auto pt-4 text-[10px] text-white/30 text-center w-full">
          Verified PDF Document
        </div>
      </div>

      {/* Main Document Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Document Toolbar */}
        <div className="h-11 border-b border-white/10 px-4 flex items-center justify-between bg-[#1e1e24] shrink-0 select-none">
          <div className="flex items-center gap-2 text-xs font-semibold text-white/80">
            <FileText className="w-4 h-4 text-rose-400" />
            <span className="truncate max-w-[200px] md:max-w-none">Pranshu_Rajan_Resume.pdf</span>
            <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-white/50">
              Page {activePage} of 2
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-black/30 p-0.5 rounded-lg border border-white/10 text-xs">
              <button
                onClick={() => {
                  setViewMode("document");
                  sounds.playClick();
                }}
                className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors flex items-center gap-1 ${
                  viewMode === "document"
                    ? "bg-white/20 text-white shadow-sm"
                    : "text-white/60 hover:text-white"
                }`}
              >
                <FileCheck className="w-3 h-3 text-blue-400" />
                <span>Document</span>
              </button>
              <button
                onClick={() => {
                  setViewMode("native");
                  sounds.playClick();
                }}
                className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors flex items-center gap-1 ${
                  viewMode === "native"
                    ? "bg-white/20 text-white shadow-sm"
                    : "text-white/60 hover:text-white"
                }`}
              >
                <Eye className="w-3 h-3 text-emerald-400" />
                <span>Native PDF</span>
              </button>
            </div>

            {/* Zoom Controls */}
            {viewMode === "document" && (
              <div className="flex items-center p-0.5 rounded-lg bg-white/10 text-xs">
                <button
                  onClick={() => setZoom((z) => Math.max(70, z - 10))}
                  className="p-1 hover:bg-white/10 rounded text-white/70 hover:text-white"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="px-2 text-[11px] font-mono text-white/80">{zoom}%</span>
                <button
                  onClick={() => setZoom((z) => Math.min(130, z + 10))}
                  className="p-1 hover:bg-white/10 rounded text-white/70 hover:text-white"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Download Original PDF Button */}
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>

        {/* View Content Stage */}
        {viewMode === "native" ? (
          <div className="flex-1 w-full h-full bg-[#18181c] relative">
            <iframe
              src="/Pranshu_Rajan_Resume.pdf#toolbar=1"
              className="w-full h-full border-0"
              title="Pranshu Rajan Real Resume PDF"
            />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center bg-[#15151a] gap-8">
            {/* PAGE 1 CANVAS */}
            <div
              ref={page1Ref}
              style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}
              className="w-[740px] min-h-[1020px] bg-white text-neutral-900 shadow-2xl p-10 font-sans text-xs transition-transform duration-150 shrink-0 leading-normal rounded-sm"
            >
              {/* Header */}
              <div className="border-b border-neutral-300 pb-3 mb-4">
                <h1 className="text-2xl font-bold tracking-tight text-neutral-900 text-center uppercase">
                  PRANSHU RAJAN
                </h1>
                <div className="text-center text-[11.5px] text-neutral-700 mt-1 font-medium space-x-1.5">
                  <span>pranshurajan9211@gmail.com</span>
                  <span>|</span>
                  <span>+91 9316347270</span>
                  <span>|</span>
                  <span>Ahmedabad, Gujarat</span>
                </div>
                <div className="text-center text-[11.5px] text-neutral-700 mt-0.5 space-x-2">
                  <span>
                    GitHub:{" "}
                    <a
                      href="https://github.com/pranshu-rajan"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline font-medium"
                    >
                      github.com/pranshu-rajan
                    </a>
                  </span>
                  <span>|</span>
                  <span>
                    LinkedIn:{" "}
                    <a
                      href="https://www.linkedin.com/in/pranshu-rajan/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline font-medium"
                    >
                      linkedin.com/in/pranshu-rajan
                    </a>
                  </span>
                </div>
              </div>

              {/* SKILLS */}
              <div className="mb-4">
                <h2 className="text-[12.5px] font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-400 pb-0.5 mb-2">
                  SKILLS
                </h2>
                <div className="space-y-1 text-[11.5px] leading-relaxed text-neutral-800">
                  <div>
                    <span className="font-bold text-neutral-900">Programming Languages: </span>
                    <span>JavaScript, TypeScript, Python, SQL, HTML5, CSS3, C++17, Java</span>
                  </div>
                  <div>
                    <span className="font-bold text-neutral-900">Frontend Technologies: </span>
                    <span>React.js, Next.js, Vite, Tailwind CSS, Framer Motion, GSAP, Three.js, React Three Fiber, Chart.js</span>
                  </div>
                  <div>
                    <span className="font-bold text-neutral-900">Backend Technologies: </span>
                    <span>Node.js, Express.js, REST APIs, JWT Authentication, OAuth2, NextAuth, Prisma ORM, Stripe, Razorpay, n8n Automation, Spring Boot</span>
                  </div>
                  <div>
                    <span className="font-bold text-neutral-900">Databases: </span>
                    <span>PostgreSQL, Supabase, MongoDB, MySQL, Row Level Security, Database Triggers, Query Optimization</span>
                  </div>
                  <div>
                    <span className="font-bold text-neutral-900">Cloud & DevOps: </span>
                    <span>Vercel, Render, Railway, GoDaddy, Git, GitHub, CI/CD Pipelines, Docker</span>
                  </div>
                  <div>
                    <span className="font-bold text-neutral-900">AI/Machine Learning: </span>
                    <span>RAG Pipelines, Large Language Models (LLM), OpenAI, Groq, Claude API, Prompt Engineering, Vector Embeddings, pgvector, HNSW, BM25</span>
                  </div>
                  <div>
                    <span className="font-bold text-neutral-900">Web Technologies & Tools: </span>
                    <span>Leaflet, SEO Optimization, JSON-LD, Docker</span>
                  </div>
                  <div>
                    <span className="font-bold text-neutral-900">Best Practices: </span>
                    <span>Code Review, Unit Testing, Responsive Design, System Design, Team Leadership</span>
                  </div>
                </div>
              </div>

              {/* EDUCATION */}
              <div className="mb-4">
                <h2 className="text-[12.5px] font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-400 pb-0.5 mb-2">
                  EDUCATION
                </h2>
                <div className="space-y-2 text-[11.5px]">
                  <div>
                    <div className="flex justify-between items-baseline font-bold text-neutral-900">
                      <span>Electronics and Instrumentation Engineering | Nirma University, Gujarat</span>
                      <span className="font-medium text-neutral-700">CGPA: 7.88</span>
                    </div>
                    <div className="text-neutral-600 text-[11px]">
                      Expected Graduation: July 2024 – Jul 2028
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-baseline font-bold text-neutral-900">
                      <span>XII (GSEB) | Swastik Academy, Gujarat</span>
                      <span className="font-medium text-neutral-700">Percentage: 80.3%</span>
                    </div>
                    <div className="text-neutral-600 text-[11px]">
                      Year: 2024
                    </div>
                  </div>
                </div>
              </div>

              {/* PROFESSIONAL EXPERIENCE */}
              <div className="mb-4">
                <h2 className="text-[12.5px] font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-400 pb-0.5 mb-2">
                  PROFESSIONAL EXPERIENCE
                </h2>

                <div className="space-y-3.5 text-[11.5px]">
                  {/* Experience 1 */}
                  <div>
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="font-bold text-neutral-900">
                        Full Stack Developer Intern | Xtin Capital
                      </span>
                      <span className="text-neutral-700 font-semibold text-[11px]">
                        May 2026 - July 2026
                      </span>
                    </div>
                    <ul className="list-disc list-outside pl-4 space-y-1 text-neutral-800 text-[11px] leading-relaxed">
                      <li>Architected and redesigned React frontends to match company visual identity and improve user experience across fintech applications</li>
                      <li>Engineered scalable Node.js and Express backend services with optimized database management and clean code architecture</li>
                      <li>Implemented SEBI-compliant hybrid payment architecture utilizing Razorpay and MFU APIs for SIP mandate processing</li>
                      <li>Resolved critical production bugs including data-integrity and race-condition issues affecting payment workflows</li>
                      <li>Conducted responsive design audits across multiple devices and prepared formal QA test reports</li>
                    </ul>
                  </div>

                  {/* Experience 2 */}
                  <div>
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="font-bold text-neutral-900">
                        AI & Cloud Intern | Edunet Foundation - IBM SkillsBuild
                      </span>
                      <span className="text-neutral-700 font-semibold text-[11px]">
                        September 2025 - October 2025
                      </span>
                    </div>
                    <ul className="list-disc list-outside pl-4 space-y-1 text-neutral-800 text-[11px] leading-relaxed">
                      <li>Developed end-to-end AI models using Python with IBM Cloud and Watson Studio platform</li>
                      <li>Executed complete machine learning pipeline including data collection, preprocessing, model training, and evaluation</li>
                      <li>Deployed trained models on enterprise cloud infrastructure following production-grade best practices</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* PROJECTS (Begins on Page 1) */}
              <div>
                <h2 className="text-[12.5px] font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-400 pb-0.5 mb-2">
                  PROJECTS
                </h2>

                <div>
                  <div className="font-bold text-neutral-900 text-[12px]">
                    UPI Offline Mesh — Peer-to-Peer Offline Payment Prototype
                  </div>
                  <div className="text-[11px] text-neutral-700 italic">
                    Technologies: Java, Spring Boot, PostgreSQL, Next.js, TypeScript, REST APIs, Docker
                  </div>
                  <div className="text-[11px] text-neutral-600 mb-1">
                    GitHub:{" "}
                    <a
                      href="https://github.com/pranshu-rajan/upi-offline-mesh"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      github.com/pranshu-rajan/upi-offline-mesh
                    </a>{" "}
                    | Live:{" "}
                    <a
                      href="https://upi-offline-rho.vercel.app"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      upi-offline-rho.vercel.app
                    </a>
                  </div>
                  <ul className="list-disc list-outside pl-4 space-y-1 text-neutral-800 text-[11px] leading-relaxed">
                    <li>Built an offline payment system that solves zero-connectivity UPI failures by routing encrypted transactions peer-to-peer across nearby devices until a connected phone automatically forwards them to the banking backend.</li>
                  </ul>
                </div>
              </div>

              {/* Page Number Indicator */}
              <div className="mt-8 pt-3 border-t border-neutral-200 text-center text-[10px] text-neutral-400">
                Page 1 of 2
              </div>
            </div>

            {/* PAGE 2 CANVAS */}
            <div
              ref={page2Ref}
              style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}
              className="w-[740px] min-h-[1020px] bg-white text-neutral-900 shadow-2xl p-10 font-sans text-xs transition-transform duration-150 shrink-0 leading-normal rounded-sm"
            >
              {/* Continued UPI Offline Mesh */}
              <div className="mb-4">
                <ul className="list-disc list-outside pl-4 space-y-1 text-neutral-800 text-[11px] leading-relaxed">
                  <li>Secured data in transit using hybrid encryption (RSA-2048-OAEP + AES-256-GCM), preventing intermediate relay devices from reading sensitive details (amounts, PINs) or altering data without failing cryptographic validation.</li>
                  <li>Eliminated double-spending and replay attacks using SHA-256 ciphertext idempotency hashing and database optimistic locking (@Version), validated through multi-threaded concurrency tests and a Next.js live simulation dashboard.</li>
                </ul>
              </div>

              {/* PacketLens AI */}
              <div className="mb-4">
                <div className="font-bold text-neutral-900 text-[12px]">
                  PacketLens AI - Real-Time Network Forensics & DPI Platform
                </div>
                <div className="text-[11px] text-neutral-700 italic">
                  Technologies: C++17, FastAPI, Python, Next.js, TypeScript
                </div>
                <div className="text-[11px] text-neutral-600 mb-1">
                  GitHub:{" "}
                  <a
                    href="https://github.com/pranshu-rajan/dpi-packet-analyser"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    github.com/pranshu-rajan/dpi-packet-analyser
                  </a>{" "}
                  | Live:{" "}
                  <a
                    href="https://dpi-packet-analyser.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    dpi-packet-analyser.vercel.app
                  </a>
                </div>
                <ul className="list-disc list-outside pl-4 space-y-1 text-neutral-800 text-[11px] leading-relaxed">
                  <li>Built a multi-threaded C++17 packet engine to parse raw PCAP files, track connections, and extract TLS/HTTP headers, eliminating bottlenecks when processing large traffic dumps.</li>
                  <li>Developed a scalable backend to persist network telemetry and apply dynamic firewall rules, automating the generation of sanitized PCAP files with blocked traffic removed.</li>
                  <li>Created a dashboard with a Wireshark-style packet inspector, synchronized hex viewer, and streaming security copilot, allowing engineers to triage network threats directly in the browser.</li>
                </ul>
              </div>

              {/* Pranshu’s AI */}
              <div className="mb-5">
                <div className="font-bold text-neutral-900 text-[12px]">
                  Pranshu’s AI - Production Vector Database and Hybrid RAG Engine
                </div>
                <div className="text-[11px] text-neutral-700 italic">
                  Technologies: C++17, Python, FastAPI, Next.js, TypeScript, Groq API, SQLite
                </div>
                <div className="text-[11px] text-neutral-600 mb-1">
                  GitHub:{" "}
                  <a
                    href="https://github.com/pranshu-rajan/pranshu-ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    github.com/pranshu-rajan/pranshu-ai
                  </a>{" "}
                  | Live:{" "}
                  <a
                    href="https://pranshu-ai.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    pranshu-ai.vercel.app
                  </a>
                </div>
                <ul className="list-disc list-outside pl-4 space-y-1 text-neutral-800 text-[11px] leading-relaxed">
                  <li>Built a custom vector engine using C++17 & Python with HNSW and KD-Tree indexing, cutting query latency to sub-milliseconds and eliminating reliance on paid vector databases.</li>
                  <li>Engineered a document ingestion pipeline using FastAPI with recursive text chunking and BM25/Dense hybrid search (RRF), preventing context fragmentation and fixing keyword-misses during retrieval.</li>
                  <li>Developed a full-stack web dashboard using Next.js 15, TypeScript, and Docker with drag-and-drop file uploads, real-time graph inspection, and latency benchmarks, making index debugging and document management seamless.</li>
                </ul>
              </div>

              {/* POSITIONS OF RESPONSIBILITY */}
              <div className="mb-5">
                <h2 className="text-[12.5px] font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-400 pb-0.5 mb-2">
                  POSITIONS OF RESPONSIBILITY
                </h2>

                <div className="space-y-3 text-[11.5px]">
                  <div>
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="font-bold text-neutral-900">
                        Executive Committee Board Member | International Society of Automation
                      </span>
                      <span className="text-neutral-700 font-semibold text-[11px]">
                        December 2025 - December 2026
                      </span>
                    </div>
                    <ul className="list-disc list-outside pl-4 space-y-1 text-neutral-800 text-[11px] leading-relaxed">
                      <li>Promoted to Executive Committee Board based on demonstrated leadership and technical contribution record</li>
                      <li>Lead coordination of technical events, workshops, and competitions as part of Nirma University&apos;s annual tech fest</li>
                    </ul>
                  </div>

                  <div>
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="font-bold text-neutral-900">
                        Member | International Society of Automation
                      </span>
                      <span className="text-neutral-700 font-semibold text-[11px]">
                        May 2025 - July 2026
                      </span>
                    </div>
                    <ul className="list-disc list-outside pl-4 space-y-1 text-neutral-800 text-[11px] leading-relaxed">
                      <li>Coordinated and managed technical events, workshops, and competitions supporting student learning and skill development</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* CERTIFICATIONS & CREDENTIALS */}
              <div>
                <h2 className="text-[12.5px] font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-400 pb-0.5 mb-2">
                  CERTIFICATIONS & CREDENTIALS
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-1.5 gap-x-4 text-[11px] text-neutral-800 font-medium">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                    <span>SAP Certified Generative AI Developer - SAP</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                    <span>AI Agents Course - Hugging Face</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                    <span>Oracle Cloud Infrastructure 2025 Certified Generative AI Professional - Oracle</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                    <span>Get Started with Databricks for Machine Learning - SimpliLearn</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                    <span>Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate - Oracle</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                    <span>Certificate of Scholar - Nirma University</span>
                  </div>
                </div>
              </div>

              {/* Page Number Indicator */}
              <div className="mt-8 pt-3 border-t border-neutral-200 text-center text-[10px] text-neutral-400">
                Page 2 of 2
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
