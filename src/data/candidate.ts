import { CandidateProfile, Experience } from "@/types";

export const candidateProfile: CandidateProfile = {
  name: "Pranshu Rajan",
  handle: "pranshu-rajan",
  title: "Full Stack Developer & AI Engineer",
  location: "Ahmedabad, Gujarat, India",
  email: "pranshurajan9211@gmail.com",
  github: "https://github.com/pranshu-rajan",
  linkedin: "https://www.linkedin.com/in/pranshu-rajan/",
  leetcode: "https://leetcode.com/u/PranshuRajan/",
  twitter: "https://x.com",
  portfolioUrl: "https://github.com/pranshu-rajan",
  status: "Targeting Software-Based Roles · Seeking Winter & Summer Internships",
  availability: "Open to Remote / Hybrid / On-site · Open to Relocation across all India & Worldwide",
  bio: "Full Stack Developer and AI Engineer actively seeking Winter and Summer Internships for software-based roles (Software Engineering, Full-Stack, AI/ML, Backend). High-impact problem solver with demonstrated expertise in distributed cryptography (UPI Offline Mesh), custom C++17 vector databases (Pranshu's AI), multi-threaded packet inspection (PacketLens AI), and computer vision models (Leaf Disease Detection).",
  skills: [
    {
      category: "Programming Languages",
      items: ["JavaScript", "TypeScript", "Python", "C++17", "SQL", "HTML5", "CSS3"]
    },
    {
      category: "Frontend Technologies",
      items: [
        "React.js",
        "Next.js (App Router)",
        "Vite",
        "Tailwind CSS",
        "Framer Motion",
        "GSAP",
        "Three.js",
        "React Three Fiber",
        "Chart.js"
      ]
    },
    {
      category: "Backend & Payments",
      items: [
        "Node.js",
        "Express.js",
        "REST APIs",
        "JWT Authentication",
        "OAuth2",
        "NextAuth",
        "Prisma ORM",
        "Stripe",
        "Razorpay",
        "n8n Automation"
      ]
    },
    {
      category: "AI & Machine Learning",
      items: [
        "RAG Pipelines",
        "Large Language Models (LLM)",
        "OpenAI",
        "Groq API",
        "Claude API",
        "Prompt Engineering",
        "Vector Embeddings",
        "pgvector",
        "HNSW & KD-Tree",
        "BM25 Search"
      ]
    },
    {
      category: "Databases & Cloud",
      items: [
        "PostgreSQL",
        "Supabase",
        "MongoDB",
        "MySQL",
        "Vercel",
        "Render",
        "Railway",
        "Docker",
        "Git / GitHub CI/CD"
      ]
    }
  ],
  education: [
    {
      degree: "B.Tech in Electronics and Instrumentation Engineering (Currently in 3rd Year)",
      school: "Nirma University, Ahmedabad, Gujarat",
      year: "2024 — 2028",
      description: "CGPA: 7.88. Coursework in Control Systems, Fuzzy Logic & Intelligent Control, Microcontrollers, Signal Processing, and Distributed Systems."
    },
    {
      degree: "Class XII (GSEB)",
      school: "Swastik Academy, Gujarat",
      year: "2024",
      description: "Scored 80.3% with distinction in Science and Mathematics."
    }
  ]
};

export const candidateExperiences: Experience[] = [
  {
    company: "Xtin Capital",
    role: "Full Stack Developer Intern",
    period: "May 2026 — July 2026",
    location: "Ahmedabad, India",
    type: "Full-Time",
    description: "Architected and redesigned React frontends to match company visual identity and improve user experience across fintech applications.",
    achievements: [
      "Engineered scalable Node.js and Express backend services with optimized database management and clean code architecture.",
      "Implemented SEBI-compliant hybrid payment architecture utilizing Razorpay and MFU APIs for SIP mandate processing.",
      "Resolved critical production bugs including data-integrity and race-condition issues affecting payment workflows.",
      "Conducted responsive design audits across multiple devices and prepared formal QA test reports."
    ],
    skills: ["React.js", "Node.js", "Express.js", "Razorpay", "Fintech APIs", "PostgreSQL"]
  },
  {
    company: "Edunet Foundation — IBM SkillsBuild",
    role: "AI & Cloud Intern",
    period: "September 2025 — October 2025",
    location: "Remote",
    type: "Contract",
    description: "Developed end-to-end AI models using Python with IBM Cloud and Watson Studio platform.",
    achievements: [
      "Executed complete machine learning pipeline including data collection, preprocessing, model training, and evaluation.",
      "Deployed trained models on enterprise cloud infrastructure following production-grade best practices."
    ],
    skills: ["Python", "IBM Cloud", "Watson Studio", "Machine Learning", "Model Deployment"]
  },
  {
    company: "International Society of Automation (ISA)",
    role: "Executive Committee Board Member",
    period: "December 2025 — December 2026",
    location: "Nirma University",
    type: "Open Source",
    description: "Promoted to Executive Committee Board based on demonstrated leadership and technical contribution record.",
    achievements: [
      "Lead coordination of technical events, workshops, and competitions as part of Nirma University's annual tech fest.",
      "Coordinated and managed technical events, workshops, and student learning hackathons."
    ],
    skills: ["Leadership", "Event Management", "Technical Mentorship", "Web Development"]
  }
];
