import { NextRequest } from "next/server";
import resumeData from "@/data/resume.json";

// System prompt strictly grounded in Pranshu Rajan's verified background
const SYSTEM_PROMPT = `You are the authentic AI Digital Twin and autonomous recruiter representative for Pranshu Rajan.
You speak on behalf of Pranshu Rajan with deep technical knowledge, confidence, humility, and engineering precision.

### VERIFIED ACADEMIC & CANDIDATE DATA (GROUND TRUTH):
- Name: Pranshu Rajan
- Title: Full Stack Developer & AI Engineer
- Email: pranshurajan9211@gmail.com | Phone: +91 9316347270
- Location: Ahmedabad, Gujarat, India
- GitHub: https://github.com/pranshu-rajan | LinkedIn: https://www.linkedin.com/in/pranshu-rajan/
- College & Education: Nirma University, Ahmedabad (July 2024 – July 2028).
  - Degree: B.Tech in Electronics and Instrumentation Engineering
  - Current Status: Currently in 3rd Year
  - CGPA: 7.88
  - Key Academic Coursework: Control Systems, Fuzzy Logic & Intelligent Control, Microcontrollers, Signal Processing, Computer Networks, Distributed Systems.
- High School: Class XII (GSEB), Swastik Academy, Gujarat (80.3%, 2024).

### VERIFIED FLAGSHIP PROJECTS:
1. Smart Multizone Irrigation & Water Resource Management Using Hierarchical Adaptive Fuzzy Control
   - GitHub: https://github.com/pranshu-rajan/smart-irrigation-fuzzy-system
   - Academic Context: B.Tech 3rd-Year Electronics & Instrumentation Engineering project at Nirma University.
   - Core Architecture: Closed-loop hierarchical adaptive Mamdani fuzzy control system avoiding black-box ML.
   - Subsystems: 5 modular Fuzzy Inference Systems (Soil Stress FIS, Weather Stress FIS, Water Demand FIS, Main Irrigation Demand FIS, Water Allocation FIS) using Min-Max implication/aggregation and Centroid defuzzification.
   - Physics-Based Ingestion: FAO-56 Penman-Monteith reference evapotranspiration (ET0), crop-specific ETc, dynamic soil-water balance modeling, tracking closed-loop moisture error e(t) and normalized relative soil moisture (RSM).
   - Validation: Benchmarked against traditional On-Off (bang-bang) and PID controllers using MATLAB/Simulink and Python (scikit-fuzzy).

2. UPI Offline Mesh — Peer-to-Peer Offline Payment Prototype
   - GitHub: https://github.com/pranshu-rajan/upi-offline-mesh | Live: https://upi-offline-rho.vercel.app
   - Technologies: Java, Spring Boot, PostgreSQL, Next.js, TypeScript, Docker.
   - Architecture: Solves zero-connectivity UPI failures by routing encrypted transactions peer-to-peer across nearby devices.
   - Security: Hybrid encryption (RSA-2048-OAEP + AES-256-GCM) preventing intermediate relay snooping; SHA-256 idempotency hashing and database optimistic locking (@Version) eliminating double-spending and replay attacks.

3. PacketLens AI - Network Forensics & Deep Packet Inspection
   - GitHub: https://github.com/pranshu-rajan/dpi-packet-analyser | Live: https://dpi-packet-analyser.vercel.app
   - Technologies: C++17, FastAPI, Python, Next.js, TypeScript.
   - Architecture: Multi-threaded C++17 packet engine parsing raw PCAP dumps without processing bottlenecks. Wireshark-style browser inspector with live hex viewer and streaming security copilot.

4. Pranshu’s AI - Production Vector Database & Hybrid RAG Engine
   - GitHub: https://github.com/pranshu-rajan/pranshu-ai | Live: https://pranshu-ai.vercel.app
   - Technologies: C++17, Python, FastAPI, Next.js, TypeScript, Groq API, SQLite.
   - Architecture: Custom C++17 vector engine with HNSW and KD-Tree spatial indexing slashing query latency to sub-milliseconds. BM25 and dense embedding hybrid retrieval via Reciprocal Rank Fusion (RRF).

5. Nuzeal Cultural Fest Web Platform
   - GitHub: https://github.com/pranshu-rajan/nuzeal-cultural-fest | Live: https://nuzeal-2026-live.vercel.app
   - Technologies: Next.js, TypeScript, Tailwind CSS, Vercel.
   - Architecture: High-traffic web portal engineered for Nirma University's annual fest.

6. Vaudeville 2026 — The Voyage Begins
   - GitHub: https://github.com/pranshu-rajan/vaudeville-2026 | Live: https://vaudeville-2026.vercel.app/
   - Technologies: React, TypeScript, Vite, Tailwind CSS, Framer Motion.
   - Architecture: Immersive pirate-themed cultural festival web portal with atmospheric soundscapes and registration pipelines.

7. Leaf Disease Detection
   - GitHub: https://github.com/pranshu-rajan/leaf-disease-detection | Live: https://leafdisease-detection.streamlit.app
   - Technologies: Python, TensorFlow/PyTorch, Streamlit. Computer vision pipeline for plant pathology diagnosis.

### VERIFIED PROFESSIONAL EXPERIENCE:
- Xtin Capital (May 2026 – July 2026): Full Stack Developer Intern (Ahmedabad, India).
  - Engineered React frontends and Node.js/Express backend services.
  - Implemented SEBI-compliant payment architecture with Razorpay and MFU APIs for SIP mandates. Resolved critical race-conditions.
- Edunet Foundation - IBM SkillsBuild (September 2025 – October 2025): AI & Cloud Intern (Remote).
  - Built ML pipelines in Python on IBM Cloud Watson Studio. Deployed models to cloud infrastructure.
- International Society of Automation (ISA) Nirma University:
  - Executive Committee Board Member (Dec 2025 – Dec 2026).
  - Coordinated technical events, hackathons, and workshops.

### VERIFIED CERTIFICATIONS:
- SAP Certified Generative AI Developer
- AI Agents Course - Hugging Face
- Oracle Cloud Infrastructure 2025 Certified Generative AI Professional
- Get Started with Databricks for Machine Learning - SimpliLearn
- Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate
- Certificate of Scholar - Nirma University

### CRITICAL RULES:
1. ZERO HALLUCINATION: You MUST ground all statements strictly in the facts above. Do not invent any work experience, degrees, or projects not in this prompt.
2. If asked about his education, state: Nirma University, Ahmedabad (2024–2028), currently in 3rd year of B.Tech in Electronics and Instrumentation Engineering (CGPA 7.88).
3. If asked about projects, emphasize Smart Irrigation Fuzzy System, UPI Offline Mesh, PacketLens AI, or Pranshu's AI.
4. STRUCTURE: Use markdown headings (### 🎯 Overview, ### 🛠️ Architecture & Tech Stack, ### ⚡ Key Highlights, ### 🔗 Links) and bullet points. Never output walls of plain text.
5. Notice Period: Never mention notice periods. Pranshu is actively available for full-time roles and internships.`;

function getGroundedFallbackText(query: string): string {
  const q = query.toLowerCase();

  if (q.includes("irrigation") || q.includes("fuzzy") || q.includes("smart") || q.includes("water") || q.includes("agriculture")) {
    return `### 🌾 Smart Multizone Irrigation · Hierarchical Adaptive Fuzzy Control\n\n` +
      `This is **Pranshu Rajan's** flagship academic control systems project at **Nirma University** (3rd-Year Electronics & Instrumentation Engineering).\n\n` +
      `### 🛠️ Core Control Theory & Architecture\n` +
      `- **Theoretical Foundation**: Implements a closed-loop hierarchical adaptive Mamdani fuzzy control system. Rather than using black-box machine learning or crude hysteresis thresholds, it relies on formal control-theoretic modeling.\n` +
      `- **5 Modular Fuzzy Inference Systems (FIS)**:\n` +
      `  1. **Soil Stress FIS**: Assesses soil moisture and error $e(t) = SM_{\\text{target}} - SM(t)$.\n` +
      `  2. **Weather Stress FIS**: Evaluates temperature, relative humidity, solar radiation, wind speed, and precipitation.\n` +
      `  3. **Water Demand FIS**: Formulates reference evapotranspiration ($ET_0$) via physics-based **FAO-56 Penman-Monteith** and crop coefficients ($ET_c = K_c \\times ET_0$).\n` +
      `  4. **Main Irrigation Demand FIS**: Synthesizes soil stress, weather stress, and moisture deficit.\n` +
      `  5. **Water Allocation FIS**: Resolves inter-zone competition for constrained reservoir capacities.\n` +
      `- **Defuzzification & Modeling**: Employs Min-Max implication/aggregation and Centroid defuzzification with dynamic soil-water balance modeling.\n` +
      `- **Validation**: Rigorously benchmarked against traditional On-Off (bang-bang) and PID controllers in MATLAB/Simulink and Python (**scikit-fuzzy**).\n\n` +
      `### 🔗 Repository\n` +
      `- **GitHub Source**: [github.com/pranshu-rajan/smart-irrigation-fuzzy-system](https://github.com/pranshu-rajan/smart-irrigation-fuzzy-system)`;
  }

  if (q.includes("education") || q.includes("college") || q.includes("university") || q.includes("degree") || q.includes("nirma") || q.includes("study") || q.includes("year")) {
    return `### 🎓 Education & Academic Profile\n\n` +
      `### Nirma University, Ahmedabad (2024 – 2028)\n` +
      `- **Degree**: Bachelor of Technology (B.Tech) in **Electronics and Instrumentation Engineering**\n` +
      `- **Current Academic Status**: Currently in **3rd Year**\n` +
      `- **Cumulative GPA**: **7.88 / 10.0**\n` +
      `- **Key Coursework**: Control Systems, Fuzzy Systems & Intelligent Control, Microcontrollers & Embedded Architectures, Digital Signal Processing, Distributed Systems, Computer Networks.\n` +
      `- **Honors & Leadership**: Executive Committee Board Member at **International Society of Automation (ISA)** Nirma Chapter; Recipient of the **Certificate of Scholar** from Nirma University.\n\n` +
      `### Swastik Academy, Gujarat\n` +
      `- **Class XII (GSEB)**: **80.3%** (Science & Mathematics, 2024)`;
  }

  if (q.includes("hire") || q.includes("why should") || q.includes("strength") || q.includes("fit")) {
    return `### 🎯 Why Pranshu Rajan Stands Out\n\n` +
      `**Pranshu Rajan** is a high-impact Full Stack Developer and AI Engineer who bridges low-level control systems and C++ engineering with modern production web architectures.\n\n` +
      `### ⚡ Core Engineering Strengths\n` +
      `- **Control Systems & AI**: Engineered the **Smart Multizone Irrigation Fuzzy System** at Nirma University (5 hierarchical Mamdani FIS engines, FAO-56 Penman-Monteith, validated vs PID).\n` +
      `- **High-Performance C++ & Distributed Systems**: Built **Pranshu's AI** (custom C++17 vector engine with HNSW/KD-tree indexing) and **PacketLens AI** (multi-threaded C++17 DPI packet inspector).\n` +
      `- **Fintech & Cryptography**: Designed **UPI Offline Mesh** using RSA-2048-OAEP + AES-256-GCM encryption and optimistic locking; implemented SEBI-compliant payment flows at **Xtin Capital**.\n` +
      `- **Education & Leadership**: 3rd-year Electronics and Instrumentation student at **Nirma University** (CGPA 7.88) and Executive Committee Board Member at **ISA Nirma**.`;
  }

  if (q.includes("project") || q.includes("built") || q.includes("work") || q.includes("portfolio")) {
    return `### 🚀 Verified Flagship Projects\n\n` +
      `Here are the verified systems and platforms engineered by **Pranshu Rajan**:\n\n` +
      `1. **Smart Multizone Irrigation Fuzzy System** (Python, Fuzzy Logic, MATLAB, Simulink): Closed-loop hierarchical adaptive Mamdani fuzzy control system across 5 modular FIS engines, incorporating FAO-56 Penman-Monteith evapotranspiration. [GitHub](https://github.com/pranshu-rajan/smart-irrigation-fuzzy-system)\n` +
      `2. **UPI Offline Mesh** (Java, Spring Boot, PostgreSQL, Next.js, Docker): Offline peer-to-peer payment prototype relaying encrypted transactions with RSA-2048 + AES-256-GCM and SHA-256 idempotency. [Live Demo](https://upi-offline-rho.vercel.app) · [GitHub](https://github.com/pranshu-rajan/upi-offline-mesh)\n` +
      `3. **PacketLens AI** (C++17, FastAPI, Python, Next.js): Multi-threaded C++17 deep packet inspection engine parsing gigabyte-scale PCAP files with browser hex inspection. [Live Demo](https://dpi-packet-analyser.vercel.app) · [GitHub](https://github.com/pranshu-rajan/dpi-packet-analyser)\n` +
      `4. **Pranshu’s AI** (C++17, Python, FastAPI, Next.js, Groq API): Production vector database with custom HNSW and KD-Tree indexing yielding sub-millisecond query latency. [Live Demo](https://pranshu-ai.vercel.app) · [GitHub](https://github.com/pranshu-rajan/pranshu-ai)\n` +
      `5. **Nuzeal Cultural Fest** (Next.js, TypeScript, Tailwind): High-traffic cultural fest portal built for Nirma University. [Live Demo](https://nuzeal-2026-live.vercel.app) · [GitHub](https://github.com/pranshu-rajan/nuzeal-cultural-fest)\n` +
      `6. **Vaudeville 2026** (React, TypeScript, Vite, Framer Motion): Cinematic pirate-themed college cultural fest web platform. [Live Demo](https://vaudeville-2026.vercel.app/) · [GitHub](https://github.com/pranshu-rajan/vaudeville-2026)`;
  }

  if (q.includes("upi") || q.includes("offline") || q.includes("mesh") || q.includes("payment")) {
    return `### 💳 UPI Offline Mesh — Architecture Breakdown\n\n` +
      `An offline peer-to-peer payment prototype engineered by **Pranshu Rajan** to solve zero-connectivity transaction failures in high-congestion zones or transit.\n\n` +
      `### 🔐 Cryptographic & Distributed Design\n` +
      `- **P2P Relay Mechanism**: Nearby devices relay encrypted transactions hop-by-hop until any device reaches internet connectivity to forward it to banking servers.\n` +
      `- **Hybrid Encryption**: Combines **RSA-2048-OAEP** for asymmetric key exchange with **AES-256-GCM** for authenticated payload encryption.\n` +
      `- **Double-Spend & Replay Defense**: Implements SHA-256 ciphertext idempotency hashing and database optimistic locking (@Version).\n\n` +
      `### 🛠️ Tech Stack & Live Links\n` +
      `- **Technologies**: Java, Spring Boot, PostgreSQL, Next.js, TypeScript, Docker.\n` +
      `- **Live Demo**: [upi-offline-rho.vercel.app](https://upi-offline-rho.vercel.app)\n` +
      `- **GitHub Source**: [github.com/pranshu-rajan/upi-offline-mesh](https://github.com/pranshu-rajan/upi-offline-mesh)`;
  }

  if (q.includes("packetlens") || q.includes("packet") || q.includes("dpi") || q.includes("network") || q.includes("c++")) {
    return `### 🔍 PacketLens AI — Network Forensics & DPI\n\n` +
      `A high-throughput packet inspection and network forensics platform powered by a custom multi-threaded C++17 engine.\n\n` +
      `### ⚡ Key Capabilities\n` +
      `- **Multi-Threaded C++17 Core**: Parses raw PCAP binary files, tracks TCP/UDP sessions, and extracts HTTP/TLS headers without CPU bottlenecking.\n` +
      `- **Telemetry & Firewall Rules**: FastAPI backend persists network metrics and automatically generates sanitized PCAP files.\n` +
      `- **Browser Triage Inspector**: Interactive Wireshark-style packet inspector with synchronized live hex viewer and streaming security copilot.\n\n` +
      `### 🔗 Links & Code\n` +
      `- **Live Demo**: [dpi-packet-analyser.vercel.app](https://dpi-packet-analyser.vercel.app)\n` +
      `- **GitHub Source**: [github.com/pranshu-rajan/dpi-packet-analyser](https://github.com/pranshu-rajan/dpi-packet-analyser)`;
  }

  if (q.includes("vector") || q.includes("rag") || q.includes("pranshu's ai") || q.includes("pranshu-ai") || q.includes("hnsw")) {
    return `### ⚡ Pranshu’s AI — Vector Database & Hybrid RAG\n\n` +
      `A custom production vector database and hybrid RAG engine written from scratch in **C++17 & Python** by **Pranshu Rajan**.\n\n` +
      `### 🛠️ Architecture Highlights\n` +
      `- **Custom Spatial Indexing**: Implements custom **HNSW** (Hierarchical Navigable Small World) and **KD-Tree** indexing slashing query latency to sub-milliseconds.\n` +
      `- **Hybrid Retrieval (RRF)**: Implements Reciprocal Rank Fusion combining dense semantic embeddings with BM25 keyword matching in FastAPI.\n` +
      `- **Full-Stack Dashboard**: Next.js 15, TypeScript, and Docker web dashboard with drag-and-drop document chunking and real-time graph inspection.\n\n` +
      `### 🔗 Links & Code\n` +
      `- **Live Demo**: [pranshu-ai.vercel.app](https://pranshu-ai.vercel.app)\n` +
      `- **GitHub Source**: [github.com/pranshu-rajan/pranshu-ai](https://github.com/pranshu-rajan/pranshu-ai)`;
  }

  if (q.includes("experience") || q.includes("intern") || q.includes("xtin") || q.includes("ibm") || q.includes("edunet")) {
    return `### 💼 Professional Work Experience\n\n` +
      `### 1. Xtin Capital — Full Stack Developer Intern\n` +
      `*May 2026 – July 2026 | Ahmedabad, India*\n` +
      `- Architected and redesigned React frontends to match company visual identity and improve UX across fintech applications.\n` +
      `- Engineered scalable Node.js and Express backend services with optimized database management.\n` +
      `- Implemented SEBI-compliant hybrid payment architecture utilizing Razorpay and MFU APIs for SIP mandate processing.\n` +
      `- Resolved critical data-integrity and race-condition bugs affecting payment workflows.\n\n` +
      `### 2. Edunet Foundation - IBM SkillsBuild — AI & Cloud Intern\n` +
      `*September 2025 – October 2025 | Remote*\n` +
      `- Developed end-to-end AI models using Python with IBM Cloud and Watson Studio.\n` +
      `- Executed complete ML pipeline (data preprocessing, training, evaluation, cloud deployment).`;
  }

  if (q.includes("skill") || q.includes("stack") || q.includes("technolog") || q.includes("language")) {
    return `### 🛠️ Technical Skills & Expertise\n\n` +
      `- **Programming Languages**: Python, C++17, JavaScript, TypeScript, Java, SQL, HTML5, CSS3.\n` +
      `- **AI & Intelligent Systems**: Fuzzy Logic (Mamdani FIS, Centroid defuzzification), Control Systems, RAG Pipelines, Vector Embeddings (HNSW, KD-Tree, pgvector), Groq LPU, OpenAI, Prompt Engineering.\n` +
      `- **Frontend Technologies**: React.js, Next.js 15 (App Router), Vite, Tailwind CSS, Framer Motion, GSAP, Three.js, Chart.js.\n` +
      `- **Backend Technologies**: Node.js, Express.js, FastAPI, Spring Boot, REST APIs, JWT Authentication, OAuth2, Prisma ORM, Razorpay, Docker.\n` +
      `- **Databases**: PostgreSQL, MongoDB, Supabase, MySQL, SQLite, Redis.\n` +
      `- **Tools & Simulation**: MATLAB, Simulink, Wireshark, Git, GitHub CI/CD, Vercel, Render.`;
  }

  // General default grounded overview
  return `### 👋 Hello! I am Pranshu Rajan's AI Digital Twin\n\n` +
    `I am strictly grounded in **Pranshu Rajan's** verified resume, engineering systems, and academic credentials at **Nirma University**.\n\n` +
    `### ⚡ Key Information at a Glance\n` +
    `- **Education**: 3rd Year B.Tech in Electronics & Instrumentation Engineering at **Nirma University, Ahmedabad** (2024–2028, CGPA 7.88).\n` +
    `- **Control & AI Flagship**: [Smart Multizone Irrigation Fuzzy System](https://github.com/pranshu-rajan/smart-irrigation-fuzzy-system) (5 Mamdani FIS subsystems, FAO-56 Penman-Monteith, validated vs PID).\n` +
    `- **Systems Projects**: [UPI Offline Mesh](https://github.com/pranshu-rajan/upi-offline-mesh), [PacketLens AI C++17 DPI](https://github.com/pranshu-rajan/dpi-packet-analyser), and [Pranshu's AI C++17 Vector DB](https://github.com/pranshu-rajan/pranshu-ai).\n` +
    `- **Work Experience**: Full Stack Intern at **Xtin Capital** (Fintech) and AI Intern at **Edunet IBM SkillsBuild**.\n\n` +
    `Feel free to ask me anything about Pranshu's architecture, code, algorithms, or academic background!`;
}

export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json();

    if (!question || typeof question !== "string") {
      return new Response(JSON.stringify({ error: "Question parameter is required." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const apiKey = process.env.GROQ_API_KEY;
    const preferredModel = process.env.GROQ_MODEL || "openai/gpt-oss-120b";

    // 1. Try streaming directly from Groq API if key is available
    if (apiKey) {
      try {
        const groqStreamResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: preferredModel,
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              { role: "user", content: question },
            ],
            temperature: 0.15,
            max_tokens: 1200,
            stream: true,
          }),
        });

        if (groqStreamResponse.ok && groqStreamResponse.body) {
          const encoder = new TextEncoder();
          const decoder = new TextDecoder();

          const stream = new ReadableStream({
            async start(controller) {
              const reader = groqStreamResponse.body!.getReader();
              let buffer = "";

              try {
                while (true) {
                  const { done, value } = await reader.read();
                  if (done) break;

                  buffer += decoder.decode(value, { stream: true });
                  const lines = buffer.split("\n");
                  buffer = lines.pop() || "";

                  for (const line of lines) {
                    const trimmed = line.trim();
                    if (!trimmed || trimmed === "data: [DONE]") continue;

                    if (trimmed.startsWith("data: ")) {
                      try {
                        const parsed = JSON.parse(trimmed.slice(6));
                        const content = parsed.choices?.[0]?.delta?.content;
                        if (content) {
                          controller.enqueue(encoder.encode(content));
                        }
                      } catch {
                        // Skip malformed SSE json
                      }
                    }
                  }
                }
              } catch (err) {
                controller.error(err);
              } finally {
                controller.close();
              }
            },
          });

          return new Response(stream, {
            headers: {
              "Content-Type": "text/plain; charset=utf-8",
              "Transfer-Encoding": "chunked",
              "Cache-Control": "no-cache, no-transform",
            },
          });
        }
      } catch {
        // Fall through to streaming local grounded response
      }
    }

    // 2. Fallback: Stream grounded response token-by-token with realistic zero-latency chunking
    const fallbackText = getGroundedFallbackText(question);
    const encoder = new TextEncoder();

    // Stream words/tokens with small timing slices
    const stream = new ReadableStream({
      async start(controller) {
        // Split by words/spaces while preserving formatting
        const chunks = fallbackText.split(/(?<=\s|[\n])/);
        for (const chunk of chunks) {
          controller.enqueue(encoder.encode(chunk));
          // Very slight pause for ultra-smooth realistic streaming
          await new Promise((resolve) => setTimeout(resolve, 8));
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
        "Cache-Control": "no-cache, no-transform",
      },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || "An unexpected error occurred." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
