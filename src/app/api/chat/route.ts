import { NextRequest } from "next/server";

// System prompt strictly grounded in Pranshu Rajan's verified background
const SYSTEM_PROMPT = `You are the authentic AI Digital Twin and autonomous recruiter representative for Pranshu Rajan.
You speak on behalf of Pranshu Rajan with deep technical knowledge, confidence, humility, and engineering precision.

### VERIFIED ACADEMIC & CANDIDATE DATA (GROUND TRUTH):
- Name: Pranshu Rajan
- Title: Full Stack Developer & AI Engineer
- Email: pranshurajan9211@gmail.com | Phone: +91 9316347270
- Location: Ahmedabad, Gujarat, India (Open to relocation across all locations in India & Worldwide)
- GitHub: https://github.com/pranshu-rajan
- LinkedIn: https://www.linkedin.com/in/pranshu-rajan/
- LeetCode: https://leetcode.com/u/PranshuRajan/
- Target Roles: Strictly SOFTWARE-BASED ROLES ONLY (Software Development Engineer Intern, Full Stack Developer Intern, AI/ML Engineer Intern, Backend Engineer Intern). He is NOT targeting hardware-based roles under any circumstances.
- Opportunities Sought: Actively seeking Winter and Summer Internships for now (2 to 3 months duration).
  - Winter Internship Window: November 2026 – December 2026 (2 to 3 months).
  - Summer Internship Window: Standard summer window (May – July, 2 to 3 months).
- Immediate Joining / Availability: Pranshu CANNOT join immediately right now mid-semester due to university coursework; he is available for the scheduled Winter (Nov–Dec 2026) and Summer internship cycles.
- Target Industries & Domains: Developer Tooling, GenAI Infrastructure, High-Throughput Systems, and Distributed AI Backends.
- Preferred Tech Stack: His proven core stack — C++17 (systems & algorithms), Python (FastAPI, PyTorch), Java/Spring Boot (resilient backend architectures), Next.js / TypeScript (modern full-stack web), Docker, and PostgreSQL.
- Team Culture: Thrives in collaborative, structured engineering environments with clean workflows and zero chaos.
- Work Modes: Open to all modes (Remote / Hybrid / On-site).
- Location & Relocation: Open to relocation across all locations in India and globally.
- College & Education: Nirma University, Ahmedabad (July 2024 – July 2028).
  - Degree: B.Tech in Electronics and Instrumentation Engineering
  - Current Status: Currently in 3rd Year
  - CGPA: 7.88
  - Key Coursework: Distributed Systems, Computer Networks, Control Systems, Fuzzy Logic & Intelligent Control, Microcontrollers, Signal Processing.
- High School: Class XII (GSEB), Swastik Academy, Gujarat (80.3%, 2024).

### TOP 4 FEATURED SOFTWARE PROJECTS:
1. UPI Offline Mesh — Peer-to-Peer Offline Payment Prototype
   - GitHub: https://github.com/pranshu-rajan/upi-offline-mesh | Live: https://upi-offline-rho.vercel.app
   - Technologies: Java, Spring Boot, PostgreSQL, Next.js, TypeScript, Docker.
   - Core Architecture: Solves zero-connectivity UPI transaction failures in crowded or dead-zone environments by routing encrypted transactions peer-to-peer across nearby devices until an internet-connected peer forwards them to the banking backend.
   - Key Engineering Breakthrough (STAR Story): Solved double-spending race conditions and cryptographic replay attacks in untrusted mesh relays by architecting a hybrid encryption relay (RSA-2048-OAEP for asymmetric key exchange + AES-256-GCM for authenticated payload encryption), paired with SHA-256 ciphertext idempotency hashing and database optimistic locking (@Version) with automated retry queues on the banking gateway.

2. PacketLens AI - Network Forensics & Deep Packet Inspection
   - GitHub: https://github.com/pranshu-rajan/dpi-packet-analyser | Live: https://dpi-packet-analyser.vercel.app
   - Technologies: C++17, FastAPI, Python, Next.js, TypeScript, Tailwind CSS.
   - Core Architecture: Multi-threaded C++17 packet engine parsing raw PCAP binary files, tracking TCP/UDP sessions, extracting TLS/HTTP headers without CPU bottlenecking.
   - Features: Interactive Wireshark-style browser packet inspector with synchronized hex viewer and streaming security copilot for real-time network threat triage.

3. Pranshu’s AI - Production Vector Database & Hybrid RAG Engine
   - GitHub: https://github.com/pranshu-rajan/pranshu-ai | Live: https://pranshu-ai.vercel.app
   - Technologies: C++17, Python, FastAPI, Next.js, TypeScript, Groq API, SQLite.
   - Core Architecture: Custom C++17 vector engine with HNSW (Hierarchical Navigable Small World) and KD-Tree spatial indexing slashing query latency to sub-milliseconds without relying on paid external vector databases.
   - Hybrid Retrieval: Reciprocal Rank Fusion (RRF) synthesizing dense semantic embeddings with BM25 keyword matching in FastAPI to prevent context fragmentation.

4. Agricultural Leaf Disease Detection
   - GitHub: https://github.com/pranshu-rajan/leaf-disease-detection | Live: https://leafdisease-detection.streamlit.app
   - Technologies: Python, PyTorch, Streamlit, Computer Vision, PIL.
   - Core Architecture: End-to-end computer vision pipeline utilizing convolutional neural networks trained on plant pathology datasets to automatically classify leaf diseases from photos and output diagnostic confidence distributions with treatment recommendations.
   - Performance: Lightweight model architecture optimized for low-latency CPU and GPU inference without cloud timeouts.

### ADDITIONAL ACADEMIC & WEB PROJECTS:
- Smart Multizone Irrigation Fuzzy System (Academic 3rd-Year project at Nirma University): 5-engine hierarchical adaptive Mamdani fuzzy control system using FAO-56 Penman-Monteith evapotranspiration and dynamic soil-water balance modeling. [Live Demo](https://irrigation-fuzzy-system.vercel.app/) | [GitHub](https://github.com/pranshu-rajan/smart-irrigation-fuzzy-system)
- Nuzeal Cultural Fest (Nirma University official cultural fest portal): Next.js, TypeScript. [Live](https://nuzeal-2026-live.vercel.app)
- Vaudeville 2026 (Pirate-themed cultural festival platform): React, TypeScript, Vite, Framer Motion. [Live](https://vaudeville-2026.vercel.app/)

### VERIFIED PROFESSIONAL EXPERIENCE:
- Xtin Capital (May 2026 – July 2026): Full Stack Developer Intern (Ahmedabad, India).
  - Architected and redesigned React frontends to match company visual identity and improve UX across fintech applications.
  - Engineered scalable Node.js and Express backend services with optimized database management.
  - Implemented SEBI-compliant payment architecture with Razorpay and MFU APIs for SIP mandates; resolved critical production race conditions.
- Edunet Foundation - IBM SkillsBuild (September 2025 – October 2025): AI & Cloud Intern (Remote).
  - Built ML pipelines in Python on IBM Cloud Watson Studio; deployed models to cloud infrastructure.
- International Society of Automation (ISA) Nirma University:
  - Executive Committee Board Member (Dec 2025 – Dec 2026).
  - Coordinated technical events, hackathons, and student workshops.

### VERIFIED CERTIFICATIONS & HONORS (ALL 8 CREDENTIALS):
1. SAP Certified - SAP Generative AI Developer (Issued Jan 15, 2026, Expires Jan 16, 2027, Credly ID: b004db60-7712-45cf-88d2-93997a79f6e4)
2. Oracle Certified Professional: Oracle Cloud Infrastructure 2025 Certified Generative AI Professional (Issued Sep 09, 2025, ID: 321763733OCI25GAIOCP)
3. Oracle Certified Foundations Associate: OCI 2025 Certified AI Foundations Associate (Issued Aug 18, 2025, ID: 321763733OCI25AICFA)
4. Certificate of Scholar — Nirma University (Scholastic Award with SGPA 8.57/10 in 2nd Semester, School of Technology, Batch 2024-28, Date: 07-Jul-2025, No.: SCHOLAR-CERTI/2502599)
5. AI Agents Course — Certificate of Excellence, Hugging Face (Credential ID: pranshurajan, Issued Apr 2026, autonomous agent architectures and smolagents)
6. C Programming Certification Test — Certificate of Completion, KnowledgeGate (No: 12219903219980860626648, Verify: https://learn.knowledgegate.ai/learn/certificate/12219903-219980)
7. Get Started with Databricks for Machine Learning — SimpliLearn SkillUp (Issued 3rd July 2025, Code: 8565682)
8. Certificate of Participation — AI in Renewable Energy Field (ISA Students' Chapter, Gujarat Section, Nirma University, Issued 28th June 2025)

### CRITICAL RULES & OUT-OF-SCOPE SCOPE ENFORCEMENT:
1. STRICT SCOPE ENFORCEMENT (CRITICAL):
   - You are exclusively and strictly trained on Pranshu Rajan's data, software projects, engineering systems, academic credentials, and career interests.
   - If the user asks ANY question outside of Pranshu Rajan's background (for example: general knowledge, history, geography, celebrity gossip, politics, sports, recipes, math or coding homework unrelated to Pranshu's systems, general creative writing, or third-party topics), YOU MUST IMMEDIATELY AND EXACTLY RESPOND:
     "This is out of my scope."
     (You can follow with: "I am Pranshu Rajan's AI portfolio agent and can only answer questions related to Pranshu's verified background, software projects, technical skills, certifications, and internship opportunities.")
   - NEVER answer general questions or wander outside Pranshu Rajan's portfolio.
2. ZERO HALLUCINATION: Ground all statements strictly in the facts above.
3. ROLES TARGETED: Pranshu is targeting SOFTWARE-BASED ROLES ONLY (SDE, Full-Stack, AI/ML, Backend). He is NOT seeking hardware-based roles under any condition.
4. INTERNSHIPS: Actively seeking Winter and Summer Internships. Open to Remote, Hybrid, or On-site across all locations in India & Worldwide (flexible with relocation).
5. CODING PROFILE: If asked about DSA or competitive programming, highlight his LeetCode profile: https://leetcode.com/u/PranshuRajan/
6. TECHNICAL STORIES: When asked about a challenging technical hurdle, describe how he solved the double-spend & replay attack problem in UPI Offline Mesh using hybrid RSA/AES cryptography + SHA-256 idempotency + JPA optimistic locking (@Version).
7. STRUCTURE: Use markdown headings and crisp bullet points. Never output walls of plain text.`;

function getGroundedFallbackText(query: string): string {
  const q = query.toLowerCase();

  if (q.includes("role") || q.includes("hardware") || q.includes("software") || q.includes("intern") || q.includes("winter") || q.includes("summer") || q.includes("relocat") || q.includes("mode") || q.includes("location") || q.includes("availab") || q.includes("join") || q.includes("timeline") || q.includes("duration")) {
    return `### Target Roles & Internship Availability\n\n` +
      `- **Target Roles**: **Strictly Software-Based Roles** (Software Development Engineer Intern, Full Stack Developer Intern, AI/ML Engineer Intern, Backend Engineer Intern). Pranshu does not seek hardware roles.\n` +
      `- **Target Domains**: **Developer Tooling**, **GenAI Infrastructure**, **High-Throughput Systems**, and **Distributed AI Backends**.\n` +
      `- **Internship Timelines & Duration**:\n` +
      `  - **Winter Internship**: **November 2026 – December 2026** (2 to 3 months).\n` +
      `  - **Summer Internship**: **May – July** (Standard summer window, 2 to 3 months).\n` +
      `- **Availability / Immediate Joining**: Pranshu is currently enrolled in his 3rd year at Nirma University, so he cannot join immediately mid-semester. He is available for the scheduled Winter (Nov–Dec 2026) and Summer internship windows.\n` +
      `- **Work Modes**: Open to all modes — **Remote**, **Hybrid**, or **On-site**.\n` +
      `- **Location & Relocation**: Based in India; **fully open to relocation** across all locations in India and globally.\n` +
      `- **DSA & Coding Profile**: Check out his active LeetCode track record at [leetcode.com/u/PranshuRajan](https://leetcode.com/u/PranshuRajan/).`;
  }

  if (q.includes("domain") || q.includes("industry") || q.includes("tooling") || q.includes("genai infra")) {
    return `### Target Industries & Domains of Interest\n\n` +
      `Pranshu is particularly passionate about engineering high-impact software in:\n` +
      `- **Developer Tooling**: Building high-efficiency tools, compilers, parsers, and diagnostic platforms (demonstrated in **PacketLens AI** C++17 DPI and packet inspection).\n` +
      `- **GenAI Infrastructure & Systems**: Vector databases, indexing algorithms (HNSW, KD-Tree), RAG pipelines, and LLM orchestration (demonstrated in **Pranshu's AI** and SAP/Oracle GenAI certifications).\n` +
      `- **High-Performance Distributed Backends**: Resilient payment relays, cryptographic protocols, and concurrent architectures (demonstrated in **UPI Offline Mesh**).\n\n` +
      `He thrives in collaborative engineering cultures with clean code practices and zero chaos.`;
  }

  if (q.includes("leetcode") || q.includes("dsa") || q.includes("code") || q.includes("problem solve")) {
    return `### LeetCode & Problem Solving\n\n` +
      `- **Profile URL**: [leetcode.com/u/PranshuRajan](https://leetcode.com/u/PranshuRajan/)\n` +
      `- **Core Strengths**: Data structures, algorithms, graph theory, dynamic programming, and low-latency system design in C++, Java, and Python.\n` +
      `- **Application in Projects**: Implemented custom HNSW and KD-Tree indexing from scratch in C++17 (**Pranshu's AI**) and multi-threaded PCAP dump parsing in **PacketLens AI**.`;
  }

  if (q.includes("leaf") || q.includes("disease") || q.includes("plant") || q.includes("crop") || q.includes("pathology")) {
    return `### Agricultural Leaf Disease Detection\n\n` +
      `An automated agricultural health assessment system utilizing deep learning convolutional models to classify plant leaf diseases from photographs and provide treatment guidance.\n\n` +
      `### Architecture & Capabilities\n` +
      `- **Deep Learning Pipeline**: End-to-end computer vision model trained on plant pathology datasets using **PyTorch**.\n` +
      `- **Interactive Web App**: Interactive **Streamlit** dashboard enabling instant photo uploads, live inference, top-3 classification confidence scores, and crop treatment guidance.\n` +
      `- **Latency Optimization**: Lightweight model architecture optimized for rapid CPU and GPU execution, preventing deployment timeouts.\n\n` +
      `### Project Links\n` +
      `- **Live Web App**: [leafdisease-detection.streamlit.app](https://leafdisease-detection.streamlit.app)\n` +
      `- **GitHub Source**: [github.com/pranshu-rajan/leaf-disease-detection](https://github.com/pranshu-rajan/leaf-disease-detection)`;
  }

  if (q.includes("upi") || q.includes("offline") || q.includes("mesh") || q.includes("payment") || q.includes("double-spend") || q.includes("challenge") || q.includes("bug")) {
    return `### UPI Offline Mesh — Architecture & Engineering Breakdown\n\n` +
      `An innovative offline peer-to-peer payment prototype engineered by **Pranshu Rajan** to solve zero-connectivity transaction failures in high-congestion zones or transit.\n\n` +
      `### Cryptographic & Distributed Defense (STAR Story)\n` +
      `- **The Challenge**: Relaying payment payloads through untrusted intermediate peer devices without internet connectivity poses severe security risks: snooping on PINs/amounts, double-spending funds, and injecting replay attacks.\n` +
      `- **Hybrid Cryptography**: Transactions are wrapped in **RSA-2048-OAEP** for asymmetric banking key agreement combined with **AES-256-GCM** authenticated payload encryption. Intermediate mesh relays only forward encrypted envelopes and cannot inspect amounts or credentials.\n` +
      `- **Double-Spending & Replay Defense**: Implemented **SHA-256 ciphertext idempotency hashing** combined with database optimistic locking (**@Version**) on the Spring Boot backend with queue retries, guaranteeing zero duplicate transactions even under concurrent mesh deliveries.\n\n` +
      `### Tech Stack & Links\n` +
      `- **Technologies**: Java, Spring Boot, PostgreSQL, Next.js, TypeScript, REST APIs, Docker.\n` +
      `- **Live Simulation**: [upi-offline-rho.vercel.app](https://upi-offline-rho.vercel.app)\n` +
      `- **GitHub Source**: [github.com/pranshu-rajan/upi-offline-mesh](https://github.com/pranshu-rajan/upi-offline-mesh)`;
  }

  if (q.includes("packetlens") || q.includes("packet") || q.includes("dpi") || q.includes("network") || q.includes("c++")) {
    return `### PacketLens AI — Network Forensics & DPI Platform\n\n` +
      `A high-throughput packet inspection and network security platform powered by a custom multi-threaded C++17 engine.\n\n` +
      `### Key Capabilities\n` +
      `- **Multi-Threaded C++17 Core**: Parses raw PCAP binary files, tracks TCP/UDP sessions, and extracts HTTP/TLS headers without CPU bottlenecking.\n` +
      `- **Dynamic Firewall Rules**: FastAPI backend persists network metrics and automatically generates sanitized PCAP files with blocked traffic removed.\n` +
      `- **Browser Triage Inspector**: Interactive Wireshark-style packet inspector with synchronized live hex viewer and streaming security copilot.\n\n` +
      `### Project Links\n` +
      `- **Live Demo**: [dpi-packet-analyser.vercel.app](https://dpi-packet-analyser.vercel.app)\n` +
      `- **GitHub Source**: [github.com/pranshu-rajan/dpi-packet-analyser](https://github.com/pranshu-rajan/dpi-packet-analyser)`;
  }

  if (q.includes("vector") || q.includes("rag") || q.includes("pranshu's ai") || q.includes("pranshu-ai") || q.includes("hnsw")) {
    return `### Pranshu’s AI — Custom Vector Database & Hybrid RAG\n\n` +
      `A custom production vector database and hybrid RAG engine written from scratch in **C++17 & Python** by **Pranshu Rajan**.\n\n` +
      `### Architecture Highlights\n` +
      `- **Custom Spatial Indexing**: Implements custom **HNSW** (Hierarchical Navigable Small World) and **KD-Tree** indexing slashing query latency to sub-milliseconds.\n` +
      `- **Hybrid Retrieval (RRF)**: Implements Reciprocal Rank Fusion combining dense semantic embeddings with BM25 keyword matching in FastAPI.\n` +
      `- **Full-Stack Dashboard**: Next.js 15, TypeScript, and Docker web dashboard with drag-and-drop document chunking and real-time graph inspection.\n\n` +
      `### Project Links\n` +
      `- **Live Demo**: [pranshu-ai.vercel.app](https://pranshu-ai.vercel.app)\n` +
      `- **GitHub Source**: [github.com/pranshu-rajan/pranshu-ai](https://github.com/pranshu-rajan/pranshu-ai)`;
  }

  if (q.includes("project") || q.includes("built") || q.includes("work") || q.includes("portfolio")) {
    return `### Top 4 Verified Software Projects\n\n` +
      `Here are the top 4 software systems engineered by **Pranshu Rajan**:\n\n` +
      `1. **UPI Offline Mesh** (Java, Spring Boot, PostgreSQL, Next.js, Docker): Cryptographic peer-to-peer offline payment relay solving zero-connectivity payment failures with RSA-2048/AES-256 and optimistic locking defense. [Live Demo](https://upi-offline-rho.vercel.app) · [GitHub](https://github.com/pranshu-rajan/upi-offline-mesh)\n` +
      `2. **PacketLens AI** (C++17, FastAPI, Python, Next.js): Multi-threaded C++17 deep packet inspection engine parsing gigabyte-scale PCAP dumps with browser hex inspection. [Live Demo](https://dpi-packet-analyser.vercel.app) · [GitHub](https://github.com/pranshu-rajan/dpi-packet-analyser)\n` +
      `3. **Pranshu’s AI** (C++17, Python, FastAPI, Next.js, Groq API): Production vector database with custom HNSW and KD-Tree indexing yielding sub-millisecond query latency. [Live Demo](https://pranshu-ai.vercel.app) · [GitHub](https://github.com/pranshu-rajan/pranshu-ai)\n` +
      `4. **Agricultural Leaf Disease Detection** (Python, PyTorch, Streamlit): Deep learning computer vision pipeline for automated plant pathology diagnosis with real-time confidence scores. [Live App](https://leafdisease-detection.streamlit.app) · [GitHub](https://github.com/pranshu-rajan/leaf-disease-detection)\n\n` +
      `*(Also authored the Smart Multizone Irrigation Fuzzy Control System for his B.Tech 3rd year coursework at Nirma University).*`;
  }

  if (q.includes("education") || q.includes("college") || q.includes("university") || q.includes("degree") || q.includes("nirma") || q.includes("study") || q.includes("year")) {
    return `### Education & Academic Profile\n\n` +
      `### Nirma University, Ahmedabad (2024 – 2028)\n` +
      `- **Degree**: Bachelor of Technology (B.Tech) in **Electronics and Instrumentation Engineering**\n` +
      `- **Current Academic Status**: Currently in **3rd Year**\n` +
      `- **Cumulative GPA**: **7.88 / 10.0**\n` +
      `- **Key Coursework**: Distributed Systems, Computer Networks, Control Systems, Fuzzy Systems & Intelligent Control, Microcontrollers, Digital Signal Processing.\n` +
      `- **Leadership**: Executive Committee Board Member at **International Society of Automation (ISA)** Nirma Chapter; Recipient of the **Certificate of Scholar** from Nirma University.\n\n` +
      `### Swastik Academy, Gujarat\n` +
      `- **Class XII (GSEB)**: **80.3%** (Science & Mathematics, 2024)`;
  }

  if (q.includes("hire") || q.includes("why should") || q.includes("strength") || q.includes("fit")) {
    return `### Why Pranshu Rajan Stands Out for Software Roles\n\n` +
      `**Pranshu Rajan** is a high-impact software developer and AI engineer with deep problem-solving skills across systems programming, cryptography, and modern web engineering.\n\n` +
      `### Key Reasons to Hire Pranshu:\n` +
      `- **Systems & Algorithmic Excellence**: Engineered custom C++17 spatial indexing (HNSW, KD-Tree) for vector search and multi-threaded PCAP forensics without off-the-shelf crutches.\n` +
      `- **Resilient Fintech Architecture**: Solved cryptographic double-spend and replay vulnerabilities in P2P mesh payments; handled SEBI-compliant SIP mandate flows at **Xtin Capital**.\n` +
      `- **Active Problem Solver**: Strong DSA foundation on [LeetCode](https://leetcode.com/u/PranshuRajan/).\n` +
      `- **Availability**: Actively seeking **Winter & Summer Internships**; open to Remote, Hybrid, or On-site across all locations in India and globally.`;
  }

  if (q.includes("experience") || q.includes("intern") || q.includes("xtin") || q.includes("ibm") || q.includes("edunet")) {
    return `### Professional Work Experience\n\n` +
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

  if (q.includes("irrigation") || q.includes("fuzzy")) {
    return `### Smart Multizone Irrigation · Hierarchical Adaptive Fuzzy Control\n\n` +
      `Academic control systems project at **Nirma University** (3rd-Year Electronics & Instrumentation Engineering).\n\n` +
      `- **5 Modular FIS Engines**: Soil Stress, Weather Stress, Water Demand (FAO-56 Penman-Monteith ET0), Main Irrigation Demand, and Water Allocation.\n` +
      `- **Live Web Application**: [irrigation-fuzzy-system.vercel.app](https://irrigation-fuzzy-system.vercel.app/)\n` +
      `- **GitHub Source**: [github.com/pranshu-rajan/smart-irrigation-fuzzy-system](https://github.com/pranshu-rajan/smart-irrigation-fuzzy-system)`;
  }

  if (q.includes("skill") || q.includes("stack") || q.includes("technolog") || q.includes("language")) {
    return `### Technical Skills & Expertise\n\n` +
      `- **Programming Languages**: Python, C++17, JavaScript, TypeScript, Java, SQL, HTML5, CSS3.\n` +
      `- **Core Specializations**: Software Engineering, Distributed Systems, Cryptography, Vector Search (HNSW, KD-Tree), Computer Vision (PyTorch), RAG Pipelines.\n` +
      `- **Frontend**: React.js, Next.js 15 (App Router), Vite, Tailwind CSS, Framer Motion, GSAP, Three.js.\n` +
      `- **Backend & Cloud**: Node.js, Express.js, FastAPI, Spring Boot, REST APIs, Docker, PostgreSQL, MongoDB, Redis, Vercel, Render.\n` +
      `- **Problem Solving**: Active on [LeetCode](https://leetcode.com/u/PranshuRajan/).`;
  }

  if (q.includes("certif") || q.includes("credential") || q.includes("award") || q.includes("scholar") || q.includes("sap") || q.includes("oracle")) {
    return `### Verified Certifications & Credentials (8 Total)\n\n` +
      `1. **SAP Certified - SAP Generative AI Developer** — SAP (Issued Jan 15, 2026, [Credly Badge](https://www.credly.com/badges/b004db60-7712-45cf-88d2-93997a79f6e4))\n` +
      `2. **Oracle Certified Professional: OCI 2025 Generative AI Professional** — Oracle University (Credential ID: \`321763733OCI25GAIOCP\`)\n` +
      `3. **Oracle Certified Foundations Associate: OCI 2025 AI Foundations Associate** — Oracle University (Credential ID: \`321763733OCI25AICFA\`)\n` +
      `4. **Certificate of Scholar** — Nirma University (Scholastic Award, SGPA 8.57/10 in 2nd Semester, No: \`SCHOLAR-CERTI/2502599\`)\n` +
      `5. **AI Agents Course** — Hugging Face (Credential ID: \`pranshurajan\`)\n` +
      `6. **C Programming Certification Test** — KnowledgeGate (Cert No: \`12219903219980860626648\`, [Verify](https://learn.knowledgegate.ai/learn/certificate/12219903-219980))\n` +
      `7. **Get Started with Databricks for Machine Learning** — SimpliLearn SkillUp (Code: \`8565682\`)\n` +
      `8. **Certificate of Participation — AI in Renewable Energy Field** — ISA Students' Chapter, Nirma University\n\n` +
      `*You can also open the **Photos app** on this desktop to view high-resolution scans and official badges of each certificate!*`;
  }

  // Check if query is greeting or introductory
  const isGreeting = q.includes("hi") || q.includes("hello") || q.includes("hey") || q.includes("who are you") || q.includes("what can you do") || q.includes("pranshu") || q.trim() === "" || q.includes("about you") || q.includes("intro");

  if (isGreeting) {
    return `### Hello — Pranshu Rajan's AI Digital Twin\n\n` +
      `I am strictly grounded in **Pranshu Rajan's** verified resume, engineering systems, and academic credentials at **Nirma University**.\n\n` +
      `### Key Information at a Glance\n` +
      `- **Education**: 3rd Year B.Tech in Electronics & Instrumentation Engineering at **Nirma University, Ahmedabad** (2024–2028, CGPA 7.88).\n` +
      `- **Control & AI Flagship**: [Smart Multizone Irrigation Fuzzy System](https://irrigation-fuzzy-system.vercel.app/) (5 Mamdani FIS subsystems, FAO-56 Penman-Monteith, validated vs PID).\n` +
      `- **Systems Projects**: [UPI Offline Mesh](https://upi-offline-rho.vercel.app), [PacketLens AI C++17 DPI](https://dpi-packet-analyser.vercel.app), and [Pranshu's AI C++17 Vector DB](https://pranshu-ai.vercel.app).\n` +
      `- **Work Experience**: Full Stack Intern at **Xtin Capital** (Fintech) and AI Intern at **Edunet IBM SkillsBuild**.\n` +
      `- **Certifications**: 8 verified credentials including **SAP Certified Generative AI Developer**, **Oracle OCI GenAI Professional**, and **Nirma Certificate of Scholar**.\n\n` +
      `Feel free to ask me anything about Pranshu's architecture, code, algorithms, certifications, or academic background!`;
  }

  // Strict Out-of-Scope boundary for any external / unrelated query
  return `This is out of my scope. I am Pranshu Rajan's AI portfolio representative and can only answer questions related to Pranshu's verified background, software projects, technical skills, certifications, and internship opportunities.`;
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
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "An unexpected error occurred.";
    return new Response(
      JSON.stringify({ error: errorMsg }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
