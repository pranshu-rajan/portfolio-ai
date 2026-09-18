import asyncio
import json
import logging
from pathlib import Path
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie

from app.config import settings
from app.models.candidate import (
    CandidateProfile,
    EducationItem,
    ExperienceItem,
    LeadershipItem
)
from app.models.project import ProjectDocument
from app.models import ALL_MODELS

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("seed_db")

async def seed():
    logger.info(f"Connecting to MongoDB at {settings.MONGODB_URI}...")
    client = AsyncIOMotorClient(settings.MONGODB_URI, serverSelectionTimeoutMS=5000)
    try:
        setattr(client, "append_metadata", lambda *args, **kwargs: None)
    except Exception:
        pass
    await init_beanie(database=client[settings.MONGODB_DB_NAME], document_models=ALL_MODELS)
    logger.info("Beanie initialized.")
    await seed_collections()
    client.close()

async def seed_collections() -> int:



    # 1. Seed Candidate Profile from verified resume.json or fallback
    candidate_paths = [
        Path(__file__).resolve().parents[2] / "src" / "data" / "resume.json",
        Path(__file__).resolve().parents[1] / "src" / "data" / "resume.json",
        Path("/app/src/data/resume.json"),
        Path(__file__).resolve().parent / "resume.json"
    ]
    data = None
    for p in candidate_paths:
        if p.exists():
            try:
                with open(p, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    logger.info(f"Loaded candidate data from {p}")
                    break
            except Exception as ex:
                logger.warning(f"Error reading candidate data from {p}: {ex}")

    if not data:
        data = {
            "name": "Pranshu Rajan",
            "title": "Full Stack Developer & AI Engineer",
            "email": "pranshurajan9211@gmail.com",
            "phone": "+91 9316347270",
            "location": "Ahmedabad, Gujarat, India",
            "github": "https://github.com/pranshu-rajan",
            "linkedin": "https://www.linkedin.com/in/pranshu-rajan/",
            "summary": "Full Stack Developer and AI Engineer passionate about building high-performance web systems, custom vector databases, offline P2P payment architectures, and deep packet inspection tools.",
            "skills_categories": {
                "Languages": ["JavaScript", "TypeScript", "Python", "C++17", "Java", "SQL"],
                "Frontend": ["React.js", "Next.js", "Tailwind CSS", "Framer Motion"],
                "Backend": ["FastAPI", "Node.js", "Spring Boot", "REST APIs"],
                "Databases": ["MongoDB", "PostgreSQL", "SQLite"],
                "AI/ML": ["RAG", "HNSW Indexing", "BM25", "Groq LPU", "PyTorch"]
            },
            "education": [
                {
                    "institution": "Nirma University",
                    "degree": "B.Tech in Electronics and Instrumentation Engineering",
                    "location": "Ahmedabad, Gujarat",
                    "timeline": "July 2024 - July 2028",
                    "gpa_or_percentage": "CGPA: 7.88",
                    "highlights": ["Executive Committee Board Member at ISA"]
                }
            ],
            "professional_experience": [
                {
                    "role": "Full Stack Developer Intern",
                    "company": "Xtin Capital",
                    "location": "Ahmedabad, India",
                    "timeline": "May 2026 - July 2026",
                    "bullets": [
                        "Architected React frontends and Node.js backend services.",
                        "Implemented SEBI-compliant payment flows with Razorpay & MFU APIs."
                    ]
                }
            ],
            "positions_of_responsibility": [
                {
                    "role": "Executive Committee Board Member",
                    "organization": "International Society of Automation (ISA)",
                    "timeline": "December 2025 - Present",
                    "bullets": ["Coordinated university tech fest events and student hackathons."]
                }
            ],
            "certifications": [
                "SAP Certified Generative AI Developer",
                "Hugging Face AI Agents Course",
                "Oracle OCI GenAI Professional"
            ]
        }

    await CandidateProfile.find_all().delete()
    candidate = CandidateProfile(
        name=data["name"],
        title=data["title"],
        email=data["email"],
        phone=data["phone"],
        location=data["location"],
        github=data["github"],
        linkedin=data["linkedin"],
        summary=data["summary"],
        skills_categories=data["skills_categories"],
        education=[EducationItem(**e) for e in data.get("education", [])],
        professional_experience=[ExperienceItem(**e) for e in data.get("professional_experience", [])],
        positions_of_responsibility=[LeadershipItem(**l) for l in data.get("positions_of_responsibility", [])],
        certifications=data.get("certifications", [])
    )
    await candidate.insert()
    logger.info("Successfully seeded CandidateProfile document.")


    # 2. Seed Projects Collection
    projects_data = [
        {
            "slug": "smart-irrigation",
            "title": "Smart Multizone Irrigation Fuzzy Control System",
            "tagline": "Hierarchical Adaptive Closed-Loop Fuzzy Control System for Precision Water Management",
            "category": "AI / ML & Systems",
            "description": "A hierarchical adaptive closed-loop fuzzy control architecture orchestrating 5 modular FIS engines to dynamically manage soil moisture, atmospheric vapor pressure deficits, and evapotranspiration demands for multi-crop zones with resource prioritization.",
            "highlights": [
                "Engineered 5-engine hierarchical Mamdani FIS: Soil Stress, Weather Stress, Crop Water Demand, Main Irrigation Demand, and Resource Allocation",
                "Incorporated FAO-56 Penman-Monteith reference evapotranspiration (ETo) dynamic calculations and vapor pressure deficit metrics",
                "Simulated non-linear soil hydraulic moisture depletion dynamics with hysteresis compensation across Sandy Loam, Clay, and Silt soils",
                "Built Centroid defuzzification producing smooth, continuous valve flow-rates and pump frequency outputs with zero overshoot vs bang-bang/PID",
                "Validated via dual-platform implementation in MATLAB/Simulink and Python (scikit-fuzzy, NumPy, SciPy) with full unit test suite"
            ],
            "technologies": ["Python", "MATLAB", "Simulink", "scikit-fuzzy", "NumPy", "SciPy", "Control Systems", "Fuzzy Logic"],
            "live_url": "https://irrigation-fuzzy-system.vercel.app/",
            "github_url": "https://github.com/pranshu-rajan/smart-irrigation-fuzzy-system",
            "featured": True,
            "stars": 1,
            "role": "Control Systems & Instrumentation Engineer",
            "timeline": "2026",
            "metrics": "5 FIS Engines, 30-40% water savings vs On-Off",
            "accent_color": "#059669",
            "preview_gradient": "from-emerald-600 via-teal-700 to-cyan-800",
            "icon": "Cpu"
        },
        {
            "slug": "upi-offline-mesh",
            "title": "UPI Offline Mesh · P2P Payment Prototype",
            "tagline": "Cryptographic Peer-to-Peer Offline Payment Relay for Zero-Connectivity Zones",
            "category": "Full Stack",
            "description": "An offline payment system solving zero-connectivity UPI failures by routing encrypted transactions peer-to-peer across nearby devices until a connected phone automatically forwards them to banking backends.",
            "highlights": [
                "Hybrid encryption (RSA-2048-OAEP + AES-256-GCM) protecting transaction amounts and PINs from intermediate relay devices",
                "Eliminated double-spending and replay attacks using SHA-256 ciphertext idempotency hashing and database optimistic locking (@Version)",
                "Validated through multi-threaded concurrency stress tests and live Next.js simulation dashboard"
            ],
            "technologies": ["Java", "Spring Boot", "PostgreSQL", "Next.js", "TypeScript", "REST APIs", "Docker"],
            "live_url": "https://upi-offline-rho.vercel.app",
            "github_url": "https://github.com/pranshu-rajan/upi-offline-mesh",
            "featured": True,
            "stars": 1,
            "role": "Full Stack & Cryptography Engineer",
            "timeline": "2026",
            "metrics": "Zero-data-leakage relay, 100% replay attack defense",
            "accent_color": "#10b981",
            "preview_gradient": "from-emerald-500 via-teal-600 to-cyan-600",
            "icon": "Share2"
        },
        {
            "slug": "dpi-packet-analyser",
            "title": "PacketLens AI · Network Forensics & DPI",
            "tagline": "Multi-threaded C++17 Deep Packet Inspection Engine with Live Security Copilot",
            "category": "Systems & Tools",
            "description": "A high-throughput packet inspection and network security platform powered by a multi-threaded C++17 engine. Parses raw PCAP files, tracks network connections, extracts TLS/HTTP headers, and streams AI triage insights in real time.",
            "highlights": [
                "Multi-threaded C++17 packet engine to parse raw PCAP dumps and extract headers without processing bottlenecks",
                "Scalable backend persisting telemetry and applying dynamic firewall rules to sanitize PCAP files automatically",
                "Wireshark-style browser packet inspector with synchronized hex viewer and streaming security copilot"
            ],
            "technologies": ["C++17", "FastAPI", "Python", "Next.js", "TypeScript", "Tailwind CSS"],
            "live_url": "https://dpi-packet-analyser.vercel.app",
            "github_url": "https://github.com/pranshu-rajan/dpi-packet-analyser",
            "featured": True,
            "stars": 1,
            "role": "Systems & Security Engineer",
            "timeline": "2026",
            "metrics": "Parses gigabyte-scale PCAP dumps at native C++ speeds",
            "accent_color": "#3b82f6",
            "preview_gradient": "from-blue-600 via-sky-600 to-cyan-500",
            "icon": "Server"
        },
        {
            "slug": "pranshu-ai",
            "title": "Pranshu’s AI · Production Vector DB & RAG",
            "tagline": "Custom C++17 Vector Database & Hybrid BM25/Dense Retrieval Engine",
            "category": "AI & ML",
            "description": "A custom vector database and hybrid RAG engine built from scratch using C++17 & Python. Implements HNSW and KD-Tree indexing, cutting query latency to sub-milliseconds without relying on external paid vector services.",
            "highlights": [
                "Custom C++17 vector engine with HNSW & KD-Tree indexing achieving sub-millisecond query latency",
                "Document ingestion pipeline using FastAPI with recursive text chunking and BM25/Dense hybrid search (RRF)",
                "Full-stack web dashboard using Next.js 15, TypeScript, and Docker with drag-and-drop file uploads"
            ],
            "technologies": ["C++17", "Python", "FastAPI", "Next.js", "TypeScript", "Groq API", "SQLite", "Docker"],
            "live_url": "https://pranshu-ai.vercel.app",
            "github_url": "https://github.com/pranshu-rajan/pranshu-ai",
            "featured": True,
            "stars": 1,
            "role": "Creator & Lead Systems Architect",
            "timeline": "2026",
            "metrics": "Sub-millisecond query latency, zero paid DB cost",
            "accent_color": "#8b5cf6",
            "preview_gradient": "from-purple-600 via-indigo-600 to-blue-600",
            "icon": "Bot"
        },
        {
            "slug": "vaudeville-2026",
            "title": "Vaudeville 2026 · The Voyage Begins",
            "tagline": "Cinematic, Immersive Pirate-Themed College Cultural Fest Platform",
            "category": "Full Stack",
            "description": "A highly cinematic, immersive, pirate-themed college cultural festival platform featuring dynamic animations, event scheduling, team registrations, and interactive lore.",
            "highlights": [
                "Custom atmospheric pirate theme designed with bespoke Cinzel Decorative typography and audio effects",
                "Interactive event registration pipelines and responsive schedule exploration",
                "High-performance client rendering built with React, TypeScript, and Vite with zero lag"
            ],
            "technologies": ["React", "TypeScript", "Vite", "Tailwind CSS", "Framer Motion", "Vercel"],
            "live_url": "https://vaudeville-2026.vercel.app/",
            "github_url": "https://github.com/pranshu-rajan/vaudeville-2026",
            "featured": True,
            "stars": 1,
            "role": "Lead Frontend Engineer",
            "timeline": "2026",
            "metrics": "Immersive pirate-themed cultural fest web portal",
            "accent_color": "#d97706",
            "preview_gradient": "from-amber-600 via-yellow-600 to-stone-800",
            "icon": "Compass"
        },
        {
            "slug": "nuzeal-website",
            "title": "Nuzeal 2026 · Cultural Fest Platform",
            "tagline": "High-Traffic Official Fest Web Portal for Nirma University",
            "category": "Full Stack",
            "description": "The official web platform for Nirma University's annual cultural fest, serving thousands of student participants with schedule agendas, event registrations, and dynamic visual interactions.",
            "highlights": [
                "Interactive 3D and responsive UI animations built with Next.js and Tailwind CSS",
                "Optimized static page generation delivering sub-second load times during peak traffic"
            ],
            "technologies": ["TypeScript", "Next.js", "Tailwind CSS", "Vercel", "Framer Motion"],
            "live_url": "https://nuzeal-2026-live.vercel.app",
            "github_url": "https://github.com/pranshu-rajan/nuzeal-cultural-fest",
            "featured": False,
            "stars": 1,
            "role": "Lead Frontend Developer",
            "timeline": "2026",
            "metrics": "Handled thousands of concurrent active student users",
            "accent_color": "#f59e0b",
            "preview_gradient": "from-amber-500 via-orange-600 to-red-500",
            "icon": "Sparkles"
        },
        {
            "slug": "leaf-disease-detection",
            "title": "Agricultural Leaf Disease Detection",
            "tagline": "Computer Vision Model for Automated Plant Pathology Diagnosis",
            "category": "AI & ML",
            "description": "An automated agricultural health assessment system utilizing deep learning convolutional models to classify leaf diseases from photographs and provide treatment guidance.",
            "highlights": [
                "End-to-end computer vision pipeline trained on plant pathology datasets",
                "Interactive Streamlit web interface with real-time image upload, inference, and classification confidence"
            ],
            "technologies": ["Python", "PyTorch", "Streamlit", "Computer Vision", "PIL"],
            "live_url": "https://leafdisease-detection.streamlit.app",
            "github_url": "https://github.com/pranshu-rajan/leaf-disease-detection",
            "featured": False,
            "stars": 1,
            "role": "ML Engineer",
            "timeline": "2026",
            "metrics": "Instant diagnostic inference with top-3 confidence scores",
            "accent_color": "#84cc16",
            "preview_gradient": "from-lime-500 via-emerald-600 to-green-700",
            "icon": "Leaf"
        },
        {
            "slug": "finbert-lstm-stock",
            "title": "Reliance Stock Prediction with FinBERT + LSTM",
            "tagline": "Hybrid NLP Sentiment & Recurrent Neural Network for Stock Price Forecasting",
            "category": "AI & ML",
            "description": "A hybrid deep learning forecasting model integrating financial news sentiment analysis with LSTM neural networks. Fine-tuned with Optuna for automated hyperparameter optimization.",
            "highlights": [
                "Integrated FinBERT transformer embeddings to quantify market sentiment from financial headlines",
                "Coupled sentiment vectors with historical price time-series inside multi-layer LSTM networks"
            ],
            "technologies": ["Python", "FinBERT", "PyTorch", "LSTM", "Optuna", "Pandas"],
            "github_url": "https://github.com/pranshu-rajan/Reliance-Stock-Prediction-FinBERT-LSTM",
            "featured": False,
            "stars": 1,
            "role": "Deep Learning Researcher",
            "timeline": "2025",
            "metrics": "Reduced forecasting RMSE through hybrid sentiment fusion",
            "accent_color": "#6366f1",
            "preview_gradient": "from-indigo-600 via-purple-700 to-pink-700",
            "icon": "TrendingUp"
        }
    ]

    for p in projects_data:
        existing = await ProjectDocument.find_one(ProjectDocument.slug == p["slug"])
        if existing:
            for k, v in p.items():
                setattr(existing, k, v)
            await existing.save()
        else:
            doc = ProjectDocument(**p)
            await doc.insert()

    logger.info(f"Successfully seeded {len(projects_data)} projects into MongoDB.")
    return len(projects_data)


if __name__ == "__main__":
    asyncio.run(seed())
