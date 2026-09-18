import { NextRequest, NextResponse } from "next/server";
import resumeData from "@/data/resume.json";

export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json();

    if (!question || typeof question !== "string") {
      return NextResponse.json(
        { error: "Question parameter is required." },
        { status: 400 }
      );
    }

    const backendUrl = process.env.FASTAPI_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL;
    if (backendUrl) {
      try {
        const fastapiRes = await fetch(`${backendUrl}/api/v1/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question }),
          signal: AbortSignal.timeout(6000),
        });
        if (fastapiRes.ok) {
          const data = await fastapiRes.json();
          return NextResponse.json({
            answer: data.answer,
            suggestedFollowUps: data.suggested_follow_ups || [
              "Tell me about UPI Offline Mesh architecture",
              "How does your C++17 Vector Database work?",
              "What were your achievements at Xtin Capital?",
            ],
            source: "fastapi-mongodb",
          });
        }
      } catch {
        // Fall through to direct Groq or grounded local engine
      }
    }

    const apiKey = process.env.GROQ_API_KEY;
    // Model specified by user: openai/gpt-oss-120b via Groq
    const preferredModel = process.env.GROQ_MODEL || "openai/gpt-oss-120b";

    // If GROQ_API_KEY is configured in .env.local, call Groq API
    if (apiKey) {

      try {
        const systemPrompt = `You are the authentic AI Digital Twin and autonomous recruiter representative for ${resumeData.name}.
You speak on behalf of ${resumeData.name} with deep technical knowledge, confidence, humility, and engineering precision.

Here is ${resumeData.name}'s verified background and resume details:
- Name: ${resumeData.name}
- Title: ${resumeData.title}
- Email: ${resumeData.email} | Phone: ${resumeData.phone} | Location: ${resumeData.location}
- GitHub: ${resumeData.github} | LinkedIn: ${resumeData.linkedin}
- Summary: ${resumeData.summary}

SKILLS & TECHNICAL EXPERTISE:
${JSON.stringify(resumeData.skills_categories, null, 2)}

EDUCATION:
${JSON.stringify(resumeData.education, null, 2)}

PROFESSIONAL EXPERIENCE:
${JSON.stringify(resumeData.professional_experience, null, 2)}

ENGINEERING PROJECTS:
${JSON.stringify(resumeData.projects, null, 2)}

POSITIONS OF RESPONSIBILITY:
${JSON.stringify(resumeData.positions_of_responsibility, null, 2)}

CERTIFICATIONS & CREDENTIALS:
${JSON.stringify(resumeData.certifications, null, 2)}

CRITICAL OPERATIONAL & FORMATTING RULES:
1. Ground every answer strictly in the verified background above. Never invent facts.
2. MANDATORY STRUCTURED FORMAT:
   - Begin with a clear 1-2 sentence overview.
   - Use '### ' section titles (e.g. '### 🎯 Overview', '### 🛠️ Architecture & Tech Stack', '### ⚡ Key Highlights', '### 🔗 Links').
   - Use clean bullet points ('- **Key Concept**: Details') for readability. NEVER output long walls of text or unstructured paragraphs.
   - Always format URLs as clickable markdown: [Link Text](URL).
3. For project questions, highlight architectural choices (e.g. C++17 HNSW vector indexing in Pranshu's AI, RSA-2048-OAEP + AES-256-GCM encryption in UPI Offline Mesh, multi-threaded PCAP parsing in PacketLens AI).
4. For work experience questions, highlight his fintech engineering at Xtin Capital (SEBI-compliant payment architectures with Razorpay & MFU APIs) and ML pipelines at Edunet IBM SkillsBuild.
5. Do NOT mention any notice period under any circumstances.
6. Keep tone confident, technical, articulate, and recruiter-ready.`;

        // Try primary model (openai/gpt-oss-120b)
        let groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: preferredModel,
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: question },
            ],
            temperature: 0.2,
            max_tokens: 850,
          }),
        });

        // Fallback to llama-3.3-70b-versatile if model name differs
        if (!groqResponse.ok && preferredModel !== "llama-3.3-70b-versatile") {
          groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              model: "llama-3.3-70b-versatile",
              messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: question },
              ],
              temperature: 0.2,
              max_tokens: 850,
            }),
          });
        }

        if (groqResponse.ok) {
          const result = await groqResponse.json();
          const answer = result.choices?.[0]?.message?.content || "";
          return NextResponse.json({
            answer,
            suggestedFollowUps: [
              "Tell me about UPI Offline Mesh architecture",
              "How does your C++17 Vector Database work?",
              "What were your achievements at Xtin Capital?",
            ],
          });
        }
      } catch {
        // Fall back to local grounded rule engine if remote call fails
      }
    }

    // Local Grounded Response Engine (Zero-latency verified fallback with structured formatting)
    const q = question.toLowerCase();
    let answer = "";
    const suggestedFollowUps: string[] = [];

    if (q.includes("hire") || q.includes("why should") || q.includes("strength") || q.includes("fit")) {
      answer = `### 🎯 Why Pranshu Rajan Stands Out\n\n` +
        `**${resumeData.name}** is a high-impact Full Stack Developer and AI Engineer who bridges low-level systems programming with modern production web architectures.\n\n` +
        `### ⚡ Core Engineering Strengths\n` +
        `- **Systems & Full-Stack Polyglot**: Proficient in low-level high-throughput engineering (**C++17, Python, Java Spring Boot**) as well as modern reactive web stacks (**Next.js 15, React, Node.js, TypeScript, Tailwind CSS**).\n` +
        `- **Custom AI & Vector Engines**: Engineered **Pranshu's AI** from scratch—a C++17 & Python vector database featuring HNSW/KD-tree spatial indexing and BM25 hybrid search with sub-millisecond query latency.\n` +
        `- **Fintech Security & Resilience**: Architected **UPI Offline Mesh** using hybrid encryption (RSA-2048-OAEP + AES-256-GCM) and database optimistic locking; implemented SEBI-compliant payment flows at **Xtin Capital**.\n` +
        `- **Leadership & Verified Credentials**: Executive Committee Board Member at **ISA Nirma University** (CGPA 7.88), with 6 industry certifications including SAP Generative AI Developer and Oracle OCI GenAI Professional.`;
      suggestedFollowUps.push("Tell me about UPI Offline Mesh", "Explain Pranshu's AI Vector Database", "What is your experience at Xtin Capital?");
    } else if (q.includes("project") || q.includes("built") || q.includes("work") || q.includes("portfolio")) {
      answer = `### 🚀 Flagship Engineering Projects\n\n` +
        `Here are the verified systems and platforms engineered by **${resumeData.name}**:\n\n` +
        `### ⚡ Featured Systems\n` +
        `- **UPI Offline Mesh** (Java, Spring Boot, PostgreSQL, Next.js, Docker): Offline P2P payment prototype relaying encrypted transactions across nearby devices to solve zero-connectivity UPI failures. Secured with RSA-2048 + AES-256-GCM and SHA-256 idempotency. [Live Demo](https://upi-offline-rho.vercel.app) · [Code](https://github.com/pranshu-rajan/upi-offline-mesh)\n` +
        `- **PacketLens AI** (C++17, FastAPI, Python, Next.js, TypeScript): Multi-threaded C++17 network forensics platform with a Wireshark-style packet inspector, synchronized hex viewer, and streaming security copilot. [Live Demo](https://dpi-packet-analyser.vercel.app) · [Code](https://github.com/pranshu-rajan/dpi-packet-analyser)\n` +
        `- **Pranshu’s AI** (C++17, Python, FastAPI, Next.js, Groq API, SQLite): Custom vector database with custom HNSW and KD-Tree indexing, cutting query latency to sub-milliseconds, paired with BM25 hybrid RAG. [Live Demo](https://pranshu-ai.vercel.app) · [Code](https://github.com/pranshu-rajan/pranshu-ai)\n` +
        `- **Vaudeville 2026** (React, TypeScript, Vite, Tailwind CSS, Framer Motion): Highly cinematic, immersive pirate-themed cultural fest platform with atmospheric typography, audio lore, and team registration workflows. [Live Demo](https://vaudeville-2026.vercel.app/) · [Code](https://github.com/pranshu-rajan/vaudeville-2026)\n` +
        `- **Nuzeal Cultural Fest** (Next.js, TypeScript, Tailwind): High-traffic cultural fest web portal built for Nirma University. [Live Demo](https://nuzeal-2026-live.vercel.app) · [Code](https://github.com/pranshu-rajan/nuzeal-cultural-fest)\n` +
        `- **Leaf Disease Detection** (Python, PyTorch, Streamlit): Deep learning computer vision pipeline for automated agricultural pathology diagnosis. [Live Demo](https://leafdisease-detection.streamlit.app) · [Code](https://github.com/pranshu-rajan/leaf-disease-detection)`;
      suggestedFollowUps.push("Tell me about Vaudeville 2026", "How does UPI Offline Mesh encryption work?", "Explain Pranshu's AI indexing");
    } else if (q.includes("vaudeville")) {
      answer = `### 🏴‍☠️ Vaudeville 2026 — The Voyage Begins\n\n` +
        `A highly cinematic, immersive pirate-themed college cultural festival web platform engineered by **${resumeData.name}**.\n\n` +
        `### 🛠️ Architecture & Tech Stack\n` +
        `- **Frontend Engine**: React, TypeScript, Vite, Tailwind CSS, Framer Motion.\n` +
        `- **Aesthetic Craft**: Custom Cinzel Decorative and Pirata One typography, atmospheric pirate theme, dynamic particles, and interactive soundscapes.\n` +
        `- **Features**: Responsive event schedule exploration, live team registration pipelines, and interactive lore.\n\n` +
        `### 🔗 Verified Links\n` +
        `- **Live Web Portal**: [vaudeville-2026.vercel.app](https://vaudeville-2026.vercel.app/)\n` +
        `- **GitHub Source**: [github.com/pranshu-rajan/vaudeville-2026](https://github.com/pranshu-rajan/vaudeville-2026)`;
      suggestedFollowUps.push("Tell me about UPI Offline Mesh", "Tell me about Pranshu's AI", "Why should we hire you?");
    } else if (q.includes("upi") || q.includes("offline") || q.includes("mesh") || q.includes("payment")) {
      answer = `### 💳 UPI Offline Mesh — Architecture Breakdown\n\n` +
        `An offline peer-to-peer payment prototype engineered by **${resumeData.name}** to solve zero-connectivity transaction failures in crowded stadiums, remote rural areas, or underground transit.\n\n` +
        `### 🔐 Cryptographic & Distributed Design\n` +
        `- **P2P Relay Mechanism**: Nearby devices relay encrypted transactions hop-by-hop until any device reaches cellular connectivity, which forwards it to banking backends.\n` +
        `- **Hybrid Encryption**: Combines **RSA-2048-OAEP** for asymmetric key exchange with **AES-256-GCM** for authenticated payload encryption. Intermediate relay nodes cannot inspect PINs or tamper with payment amounts without failing validation.\n` +
        `- **Double-Spend & Replay Defense**: Implements SHA-256 ciphertext idempotency hashing and database optimistic locking (\`@Version\`), verified through multi-threaded concurrency tests.\n\n` +
        `### 🛠️ Tech Stack & Live Links\n` +
        `- **Technologies**: Java, Spring Boot, PostgreSQL, Next.js, TypeScript, Docker.\n` +
        `- **Live Demo**: [upi-offline-rho.vercel.app](https://upi-offline-rho.vercel.app)\n` +
        `- **GitHub Repository**: [github.com/pranshu-rajan/upi-offline-mesh](https://github.com/pranshu-rajan/upi-offline-mesh)`;
      suggestedFollowUps.push("Tell me about PacketLens AI", "Tell me about Pranshu's AI", "Why should we hire you?");
    } else if (q.includes("packetlens") || q.includes("packet") || q.includes("dpi") || q.includes("network") || q.includes("c++")) {
      answer = `### 🔍 PacketLens AI — Network Forensics & DPI\n\n` +
        `A high-throughput packet inspection and network security platform powered by a custom multi-threaded C++17 engine.\n\n` +
        `### ⚡ Key Capabilities\n` +
        `- **Multi-Threaded C++17 Core**: Parses raw PCAP binary files, tracks TCP/UDP sessions, and extracts HTTP/TLS headers with zero CPU bottlenecking during gigabyte-scale network traffic dumps.\n` +
        `- **Telemetry & Firewall Rules**: FastAPI backend persists network metrics and applies dynamic firewall rules to automatically generate sanitized PCAP files.\n` +
        `- **Browser Triage Inspector**: Interactive Wireshark-style packet inspector, synchronized live hex viewer, and streaming security copilot.\n\n` +
        `### 🔗 Links & Code\n` +
        `- **Live Demo**: [dpi-packet-analyser.vercel.app](https://dpi-packet-analyser.vercel.app)\n` +
        `- **GitHub Repository**: [github.com/pranshu-rajan/dpi-packet-analyser](https://github.com/pranshu-rajan/dpi-packet-analyser)`;
      suggestedFollowUps.push("Tell me about Pranshu's AI Vector Engine", "Tell me about UPI Offline Mesh", "What is your tech stack?");
    } else if (q.includes("vector") || q.includes("rag") || q.includes("pranshu's ai") || q.includes("pranshu-ai") || q.includes("hnsw")) {
      answer = `### ⚡ Pranshu’s AI — Vector Database & Hybrid RAG\n\n` +
        `A custom production vector database and hybrid RAG engine written from scratch in **C++17 & Python** by **${resumeData.name}**.\n\n` +
        `### 🛠️ Architecture Highlights\n` +
        `- **Custom Indexing Engine**: Custom **HNSW** (Hierarchical Navigable Small World) and **KD-Tree** indexing slashing query latency to sub-milliseconds, eliminating dependence on external paid vector SaaS.\n` +
        `- **Hybrid Retrieval (RRF)**: Implements Reciprocal Rank Fusion combining dense semantic embeddings with BM25 keyword matching in FastAPI, preventing context fragmentation.\n` +
        `- **Full-Stack Dashboard**: Next.js 15, TypeScript, and Docker web dashboard with drag-and-drop document chunking, graph inspection, and Groq LPU inference.\n\n` +
        `### 🔗 Links & Code\n` +
        `- **Live Demo**: [pranshu-ai.vercel.app](https://pranshu-ai.vercel.app)\n` +
        `- **GitHub Repository**: [github.com/pranshu-rajan/pranshu-ai](https://github.com/pranshu-rajan/pranshu-ai)`;
      suggestedFollowUps.push("Tell me about your internships", "What is your full tech stack?", "Why should we hire you?");
    } else if (q.includes("experience") || q.includes("intern") || q.includes("xtin") || q.includes("ibm") || q.includes("edunet")) {
      answer = `### 💼 Professional Work Experience\n\n` +
        `### 1. Xtin Capital — Full Stack Developer Intern\n` +
        `*May 2026 – July 2026 | Ahmedabad, India*\n` +
        `- Architected and redesigned React frontends to match company visual identity and improve UX across fintech applications.\n` +
        `- Engineered scalable Node.js and Express backend services with optimized database management and clean code architecture.\n` +
        `- Implemented SEBI-compliant hybrid payment architecture utilizing Razorpay and MFU APIs for SIP mandate processing.\n` +
        `- Resolved critical production bugs including data-integrity and race-condition issues affecting payment workflows.\n` +
        `- Conducted responsive design audits and prepared formal QA test reports.\n\n` +
        `### 2. Edunet Foundation - IBM SkillsBuild — AI & Cloud Intern\n` +
        `*September 2025 – October 2025 | Remote*\n` +
        `- Developed end-to-end AI models using Python with IBM Cloud and Watson Studio platform.\n` +
        `- Executed complete machine learning pipeline including data collection, preprocessing, model training, and evaluation.\n` +
        `- Deployed trained models on enterprise cloud infrastructure following production-grade best practices.`;
      suggestedFollowUps.push("Tell me about your certifications", "Tell me about your projects", "What is your education?");
    } else if (q.includes("skill") || q.includes("stack") || q.includes("technolog") || q.includes("language")) {
      answer = `### 🛠️ Technical Skills & Expertise\n\n` +
        `- **Programming Languages**: JavaScript, TypeScript, Python, SQL, HTML5, CSS3, C++17, Java.\n` +
        `- **Frontend Technologies**: React.js, Next.js (App Router), Vite, Tailwind CSS, Framer Motion, GSAP, Three.js, React Three Fiber, Chart.js.\n` +
        `- **Backend Technologies**: Node.js, Express.js, Spring Boot, REST APIs, JWT Authentication, OAuth2, NextAuth, Prisma ORM, Stripe, Razorpay, n8n Automation.\n` +
        `- **Databases**: PostgreSQL, Supabase, MongoDB, MySQL, Row Level Security, Database Triggers, Query Optimization.\n` +
        `- **Cloud & DevOps**: Vercel, Render, Railway, GoDaddy, Git, GitHub, CI/CD Pipelines, Docker.\n` +
        `- **AI & Machine Learning**: RAG Pipelines, Large Language Models (LLM), OpenAI, Groq API, Claude API, Prompt Engineering, Vector Embeddings, pgvector, HNSW, KD-Tree, BM25.\n` +
        `- **Best Practices**: Code Review, Unit Testing, Responsive Design, System Design, Team Leadership.`;
      suggestedFollowUps.push("Tell me about your projects", "Why should we hire you?", "What certifications do you hold?");
    } else if (q.includes("certif") || q.includes("credential") || q.includes("award")) {
      answer = `### 📜 Verified Certifications & Credentials\n\n` +
        `1. **SAP Certified Generative AI Developer** — SAP\n` +
        `2. **AI Agents Course** — Hugging Face\n` +
        `3. **Oracle Cloud Infrastructure 2025 Certified Generative AI Professional** — Oracle\n` +
        `4. **Get Started with Databricks for Machine Learning** — SimpliLearn\n` +
        `5. **Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate** — Oracle\n` +
        `6. **Certificate of Scholar** — Nirma University`;
      suggestedFollowUps.push("What is your education background?", "Tell me about your work at Xtin Capital", "Why should we hire you?");
    } else if (q.includes("education") || q.includes("nirma") || q.includes("degree") || q.includes("college")) {
      answer = `### 🎓 Academic Background\n\n` +
        `- **B.Tech in Electronics and Instrumentation Engineering** — Nirma University, Gujarat\n` +
        `  - CGPA: **7.88** (Expected Graduation: July 2024 – July 2028)\n` +
        `  - Executive Committee Board Member at **International Society of Automation (ISA)**\n\n` +
        `- **Class XII (GSEB)** — Swastik Academy, Gujarat\n` +
        `  - Scored **80.3%** (2024)`;
      suggestedFollowUps.push("Tell me about his role at ISA", "What are his top projects?", "Why should we hire you?");
    } else if (q.includes("isa") || q.includes("leadership") || q.includes("responsibility") || q.includes("position")) {
      answer = `### 🌟 Positions of Responsibility\n\n` +
        `### Executive Committee Board Member | International Society of Automation (ISA)\n` +
        `*December 2025 – December 2026*\n` +
        `- Promoted to Executive Committee Board based on demonstrated leadership and technical contribution record.\n` +
        `- Lead coordination of technical events, workshops, and competitions as part of Nirma University's annual tech fest.\n\n` +
        `### Member | International Society of Automation\n` +
        `*May 2025 – July 2026*\n` +
        `- Coordinated and managed technical events, workshops, and student learning hackathons.`;
      suggestedFollowUps.push("What is your education?", "Tell me about UPI Offline Mesh", "What are your certifications?");
    } else if (q.includes("contact") || q.includes("email") || q.includes("phone") || q.includes("reach") || q.includes("linkedin") || q.includes("github")) {
      answer = `### 📬 Contact & Profiles\n\n` +
        `Reach out to **${resumeData.name}** directly:\n\n` +
        `- **Email**: [${resumeData.email}](mailto:${resumeData.email})\n` +
        `- **Phone**: ${resumeData.phone}\n` +
        `- **Location**: ${resumeData.location}\n` +
        `- **GitHub**: [github.com/pranshu-rajan](https://github.com/pranshu-rajan)\n` +
        `- **LinkedIn**: [linkedin.com/in/pranshu-rajan](https://www.linkedin.com/in/pranshu-rajan/)\n\nYou can also launch the **Mail app** on this desktop to send an inquiry directly!`;
      suggestedFollowUps.push("Why should we hire you?", "What are your top projects?", "Can I download your resume?");
    } else {
      answer = `### 👋 Hello! I am ${resumeData.name}'s AI Digital Twin\n\n` +
        `${resumeData.summary}\n\n` +
        `### ⚡ Verified Background\n` +
        `- **Education**: B.Tech in Electronics & Instrumentation at Nirma University (CGPA 7.88)\n` +
        `- **Experience**: Full Stack Developer Intern at Xtin Capital & AI/Cloud Intern at Edunet (IBM SkillsBuild)\n` +
        `- **Flagship Work**: UPI Offline Mesh (P2P payments), PacketLens AI (C++17 packet inspector), Pranshu's AI (C++17 vector DB & RAG), Vaudeville 2026 (pirate-themed platform)\n\n` +
        `What would you like to explore about ${resumeData.name}'s background?`;
      suggestedFollowUps.push("Why should we hire you?", "Tell me about UPI Offline Mesh", "What is your tech stack?");
    }

    return NextResponse.json({ answer, suggestedFollowUps });
  } catch {
    return NextResponse.json(
      { error: "Internal server error occurred." },
      { status: 500 }
    );
  }
}
