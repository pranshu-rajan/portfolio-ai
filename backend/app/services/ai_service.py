import logging
import json
from typing import AsyncGenerator, Dict, Any, List, Optional

import httpx
from app.config import settings
from app.models.candidate import CandidateProfile
from app.models.chat import ChatSession, MessageItem

logger = logging.getLogger(__name__)

DEFAULT_SUGGESTIONS = [
    "Tell me about UPI Offline Mesh architecture",
    "How does your C++17 Vector Database work?",
    "Tell me about Vaudeville 2026",
    "What were your achievements at Xtin Capital?"
]

class AIService:
    @staticmethod
    async def get_grounding_context() -> str:
        """Fetch candidate background from MongoDB or fallback to static verified json."""
        try:
            profile = await CandidateProfile.find_one()
            if profile:
                return (
                    f"Candidate: {profile.name} ({profile.title})\n"
                    f"Email: {profile.email} | Location: {profile.location}\n"
                    f"GitHub: {profile.github} | LinkedIn: {profile.linkedin}\n\n"
                    f"Summary: {profile.summary}\n\n"
                    f"Skills:\n{json.dumps(profile.skills_categories, indent=2)}\n\n"
                    f"Education:\n{json.dumps([e.model_dump() for e in profile.education], indent=2)}\n\n"
                    f"Experience:\n{json.dumps([e.model_dump() for e in profile.professional_experience], indent=2)}\n\n"
                    f"Leadership:\n{json.dumps([e.model_dump() for e in profile.positions_of_responsibility], indent=2)}\n\n"
                    f"Certifications:\n{json.dumps(profile.certifications, indent=2)}"
                )
        except Exception as e:
            logger.warning(f"Could not load CandidateProfile from MongoDB: {e}")

        # Static fallback context
        return (
            "Candidate: Pranshu Rajan (Full Stack Developer & AI Engineer)\n"
            "Email: pranshurajan9211@gmail.com | Phone: +91 9316347270 | Location: Ahmedabad, Gujarat, India\n"
            "GitHub: https://github.com/pranshu-rajan | LinkedIn: https://www.linkedin.com/in/pranshu-rajan/\n\n"
            "Key Projects:\n"
            "- UPI Offline Mesh: P2P offline payment prototype using RSA-2048-OAEP + AES-256-GCM and SHA-256 idempotency. Live: upi-offline-rho.vercel.app\n"
            "- PacketLens AI: Multi-threaded C++17 PCAP parser, Wireshark-style inspector, hex viewer. Live: dpi-packet-analyser.vercel.app\n"
            "- Pranshu's AI: C++17 & Python vector DB with HNSW indexing and BM25 hybrid search. Live: pranshu-ai.vercel.app\n"
            "- Vaudeville 2026: Pirate-themed college cultural fest platform with Cinzel typography and audio lore. Live: vaudeville-2026.vercel.app\n"
            "- Nuzeal Cultural Fest: Next.js platform for Nirma University. Live: nuzeal-2026-live.vercel.app\n"
            "- Leaf Disease Detection: Deep learning CV pipeline with Streamlit. Live: leafdisease-detection.streamlit.app\n\n"
            "Experience:\n"
            "- Xtin Capital (May-July 2026): Full Stack Developer Intern. SEBI-compliant hybrid payments with Razorpay & MFU APIs, race condition bug resolutions.\n"
            "- Edunet IBM SkillsBuild (Sept-Oct 2025): AI & Cloud Intern. ML pipelines on Watson Studio.\n\n"
            "Education: B.Tech in Electronics & Instrumentation at Nirma University (CGPA 7.88). Class XII Swastik Academy (80.3%).\n"
            "Leadership: Executive Committee Board Member at International Society of Automation (ISA).\n"
            "Certifications: SAP Certified GenAI Developer, Hugging Face AI Agents, Oracle OCI GenAI Professional & Foundations, Databricks SimpliLearn, Nirma Scholar."
        )

    @classmethod
    def build_system_prompt(cls, context: str) -> str:
        return f"""You are the authentic AI Digital Twin and autonomous recruiter representative for Pranshu Rajan.
You speak on behalf of Pranshu Rajan with deep technical knowledge, confidence, humility, and engineering precision.

VERIFIED CANDIDATE KNOWLEDGE BASE:
{context}

CRITICAL RULES:
1. Ground every answer strictly in the verified background above. Never invent facts.
2. MANDATORY STRUCTURED FORMAT:
   - Begin with a clear 1-2 sentence overview.
   - Use '### ' section titles (e.g. '### 🎯 Overview', '### 🛠️ Architecture & Tech Stack', '### ⚡ Key Highlights', '### 🔗 Links').
   - Use clean bullet points ('- **Key Concept**: Details') for readability. NEVER output long walls of text.
   - Always format URLs as clickable markdown: [Link Text](URL).
3. For project questions, highlight architectural choices (e.g. C++17 HNSW vector indexing in Pranshu's AI, RSA-2048-OAEP + AES-256-GCM encryption in UPI Offline Mesh, multi-threaded PCAP parsing in PacketLens AI).
4. For work experience questions, highlight his fintech engineering at Xtin Capital (SEBI-compliant payment architectures with Razorpay & MFU APIs) and ML pipelines at Edunet IBM SkillsBuild.
5. Do NOT mention any notice period under any circumstances.
6. Keep tone confident, technical, articulate, and recruiter-ready."""

    @classmethod
    async def generate_answer(cls, question: str, session_id: str = None) -> Dict[str, Any]:
        """Generate response via Groq API or grounded local fallback."""
        context = await cls.get_grounding_context()
        system_prompt = cls.build_system_prompt(context)

        if settings.GROQ_API_KEY:
            try:
                async with httpx.AsyncClient(timeout=30.0) as client:
                    payload = {
                        "model": settings.GROQ_MODEL,
                        "messages": [
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": question}
                        ],
                        "temperature": 0.2,
                        "max_tokens": 850
                    }
                    response = await client.post(
                        "https://api.groq.com/openai/v1/chat/completions",
                        headers={"Authorization": f"Bearer {settings.GROQ_API_KEY}"},
                        json=payload
                    )

                    if not response.is_success and settings.GROQ_MODEL != settings.FALLBACK_MODEL:
                        payload["model"] = settings.FALLBACK_MODEL
                        response = await client.post(
                            "https://api.groq.com/openai/v1/chat/completions",
                            headers={"Authorization": f"Bearer {settings.GROQ_API_KEY}"},
                            json=payload
                        )

                    if response.is_success:
                        data = response.json()
                        answer = data["choices"][0]["message"]["content"]
                        await cls._log_session(session_id, question, answer)
                        return {
                            "answer": answer,
                            "suggested_follow_ups": DEFAULT_SUGGESTIONS[:3],
                            "model_used": payload["model"]
                        }
            except Exception as e:
                logger.warning(f"Groq API call failed: {e}. Falling back to grounded rule engine.")

        # Grounded rule engine fallback
        answer = cls._local_fallback(question)
        await cls._log_session(session_id, question, answer)
        return {
            "answer": answer,
            "suggested_follow_ups": DEFAULT_SUGGESTIONS[:3],
            "model_used": "grounded-local-engine"
        }

    @classmethod
    async def stream_answer(cls, question: str) -> AsyncGenerator[str, None]:
        """Stream answer tokens via SSE (Server-Sent Events)."""
        context = await cls.get_grounding_context()
        system_prompt = cls.build_system_prompt(context)

        if settings.GROQ_API_KEY:
            try:
                async with httpx.AsyncClient(timeout=45.0) as client:
                    payload = {
                        "model": settings.GROQ_MODEL,
                        "messages": [
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": question}
                        ],
                        "temperature": 0.2,
                        "max_tokens": 850,
                        "stream": True
                    }
                    async with client.stream(
                        "POST",
                        "https://api.groq.com/openai/v1/chat/completions",
                        headers={"Authorization": f"Bearer {settings.GROQ_API_KEY}"},
                        json=payload
                    ) as response:
                        if response.is_success:
                            async for line in response.aiter_lines():
                                if line.startswith("data: "):
                                    chunk_str = line[6:].strip()
                                    if chunk_str == "[DONE]":
                                        yield f"data: {json.dumps({'done': True, 'token': ''})}\n\n"
                                        return
                                    try:
                                        chunk = json.loads(chunk_str)
                                        delta = chunk.get("choices", [{}])[0].get("delta", {}).get("content", "")
                                        if delta:
                                            yield f"data: {json.dumps({'token': delta, 'done': False})}\n\n"
                                    except Exception:
                                        continue
            except Exception as e:
                logger.warning(f"Streaming failed: {e}. Falling back to chunked local response.")

        # Fallback stream
        full_text = cls._local_fallback(question)
        words = full_text.split(" ")
        for i, word in enumerate(words):
            yield f"data: {json.dumps({'token': word + (' ' if i < len(words) - 1 else ''), 'done': False})}\n\n"
        yield f"data: {json.dumps({'done': True, 'token': '', 'suggested_follow_ups': DEFAULT_SUGGESTIONS[:3]})}\n\n"

    @staticmethod
    async def _log_session(session_id: Optional[str], question: str, answer: str):
        if not session_id:
            return
        try:
            session = await ChatSession.find_one(ChatSession.session_id == session_id)
            if not session:
                session = ChatSession(session_id=session_id, messages=[])
            session.messages.append(MessageItem(role="user", content=question))
            session.messages.append(MessageItem(role="assistant", content=answer))
            await session.save()
        except Exception as e:
            logger.debug(f"Could not persist chat session: {e}")

    @staticmethod
    def _local_fallback(question: str) -> str:
        q = question.lower()
        if "hire" in q or "why" in q or "strength" in q or "fit" in q:
            return (
                "### 🎯 Why Pranshu Rajan Stands Out\n\n"
                "**Pranshu Rajan** is a high-impact Full Stack Developer and AI Engineer who bridges low-level systems programming with modern production web architectures.\n\n"
                "### ⚡ Core Engineering Strengths\n"
                "- **Systems & Full-Stack Polyglot**: Proficient in low-level high-throughput engineering (**C++17, Python, Java Spring Boot**) as well as modern reactive web stacks (**Next.js 15, React, Node.js, TypeScript, Tailwind CSS**).\n"
                "- **Custom AI & Vector Engines**: Engineered **Pranshu's AI** from scratch—a C++17 & Python vector database featuring HNSW/KD-tree spatial indexing and BM25 hybrid search with sub-millisecond query latency.\n"
                "- **Fintech Security & Resilience**: Architected **UPI Offline Mesh** using hybrid encryption (RSA-2048-OAEP + AES-256-GCM) and database optimistic locking; implemented SEBI-compliant payment flows at **Xtin Capital**.\n"
                "- **Leadership & Verified Credentials**: Executive Committee Board Member at **ISA Nirma University** (CGPA 7.88), with 6 industry certifications including SAP Generative AI Developer and Oracle OCI GenAI Professional."
            )
        if "vaudeville" in q:
            return (
                "### 🏴‍☠️ Vaudeville 2026 — The Voyage Begins\n\n"
                "A highly cinematic, immersive pirate-themed college cultural festival web platform engineered by **Pranshu Rajan**.\n\n"
                "### 🛠️ Architecture & Tech Stack\n"
                "- **Frontend Engine**: React, TypeScript, Vite, Tailwind CSS, Framer Motion.\n"
                "- **Aesthetic Craft**: Custom Cinzel Decorative and Pirata One typography, atmospheric pirate theme, dynamic particles, and interactive soundscapes.\n"
                "- **Features**: Responsive event schedule exploration, live team registration pipelines, and interactive lore.\n\n"
                "### 🔗 Verified Links\n"
                "- **Live Web Portal**: [vaudeville-2026.vercel.app](https://vaudeville-2026.vercel.app/)\n"
                "- **GitHub Source**: [github.com/pranshu-rajan/vaudeville-2026](https://github.com/pranshu-rajan/vaudeville-2026)"
            )
        if "upi" in q or "offline" in q or "mesh" in q or "payment" in q:
            return (
                "### 💳 UPI Offline Mesh — Architecture Breakdown\n\n"
                "An offline peer-to-peer payment prototype engineered by **Pranshu Rajan** to solve zero-connectivity transaction failures in crowded stadiums, remote rural areas, or underground transit.\n\n"
                "### 🔐 Cryptographic & Distributed Design\n"
                "- **P2P Relay Mechanism**: Nearby devices relay encrypted transactions hop-by-hop until any device reaches cellular connectivity, which forwards it to banking backends.\n"
                "- **Hybrid Encryption**: Combines **RSA-2048-OAEP** for asymmetric key exchange with **AES-256-GCM** for authenticated payload encryption. Intermediate relay nodes cannot inspect PINs or tamper with payment amounts without failing validation.\n"
                "- **Double-Spend & Replay Defense**: Implements SHA-256 ciphertext idempotency hashing and database optimistic locking (`@Version`), verified through multi-threaded concurrency tests.\n\n"
                "### 🛠️ Tech Stack & Live Links\n"
                "- **Technologies**: Java, Spring Boot, PostgreSQL, Next.js, TypeScript, Docker.\n"
                "- **Live Demo**: [upi-offline-rho.vercel.app](https://upi-offline-rho.vercel.app)\n"
                "- **GitHub Repository**: [github.com/pranshu-rajan/upi-offline-mesh](https://github.com/pranshu-rajan/upi-offline-mesh)"
            )
        if "packetlens" in q or "packet" in q or "dpi" in q or "network" in q or "c++" in q:
            return (
                "### 🔍 PacketLens AI — Network Forensics & DPI\n\n"
                "A high-throughput packet inspection and network security platform powered by a custom multi-threaded C++17 engine.\n\n"
                "### ⚡ Key Capabilities\n"
                "- **Multi-Threaded C++17 Core**: Parses raw PCAP binary files, tracks TCP/UDP sessions, and extracts HTTP/TLS headers with zero CPU bottlenecking during gigabyte-scale network traffic dumps.\n"
                "- **Telemetry & Firewall Rules**: FastAPI backend persists network metrics and applies dynamic firewall rules to automatically generate sanitized PCAP files.\n"
                "- **Browser Triage Inspector**: Interactive Wireshark-style packet inspector, synchronized live hex viewer, and streaming security copilot.\n\n"
                "### 🔗 Links & Code\n"
                "- **Live Demo**: [dpi-packet-analyser.vercel.app](https://dpi-packet-analyser.vercel.app)\n"
                "- **GitHub Repository**: [github.com/pranshu-rajan/dpi-packet-analyser](https://github.com/pranshu-rajan/dpi-packet-analyser)"
            )
        if "vector" in q or "rag" in q or "pranshu's ai" in q or "hnsw" in q:
            return (
                "### ⚡ Pranshu’s AI — Vector Database & Hybrid RAG\n\n"
                "A custom production vector database and hybrid RAG engine written from scratch in **C++17 & Python** by **Pranshu Rajan**.\n\n"
                "### 🛠️ Architecture Highlights\n"
                "- **Custom Indexing Engine**: Custom **HNSW** (Hierarchical Navigable Small World) and **KD-Tree** indexing slashing query latency to sub-milliseconds, eliminating dependence on external paid vector SaaS.\n"
                "- **Hybrid Retrieval (RRF)**: Implements Reciprocal Rank Fusion combining dense semantic embeddings with BM25 keyword matching in FastAPI, preventing context fragmentation.\n"
                "- **Full-Stack Dashboard**: Next.js 15, TypeScript, and Docker web dashboard with drag-and-drop document chunking, graph inspection, and Groq LPU inference.\n\n"
                "### 🔗 Links & Code\n"
                "- **Live Demo**: [pranshu-ai.vercel.app](https://pranshu-ai.vercel.app)\n"
                "- **GitHub Repository**: [github.com/pranshu-rajan/pranshu-ai](https://github.com/pranshu-rajan/pranshu-ai)"
            )
        return (
            "### 🚀 Flagship Engineering Projects\n\n"
            "Here are the verified systems and platforms engineered by **Pranshu Rajan**:\n\n"
            "### ⚡ Featured Systems\n"
            "- **UPI Offline Mesh** (Java, Spring Boot, PostgreSQL, Next.js, Docker): Offline P2P payment prototype relaying encrypted transactions across nearby devices. [Live Demo](https://upi-offline-rho.vercel.app) · [Code](https://github.com/pranshu-rajan/upi-offline-mesh)\n"
            "- **PacketLens AI** (C++17, FastAPI, Python, Next.js, TypeScript): Multi-threaded C++17 network forensics platform with a Wireshark-style packet inspector and hex viewer. [Live Demo](https://dpi-packet-analyser.vercel.app) · [Code](https://github.com/pranshu-rajan/dpi-packet-analyser)\n"
            "- **Pranshu’s AI** (C++17, Python, FastAPI, Next.js, Groq API, SQLite): Custom vector database with HNSW and KD-Tree indexing and BM25 hybrid RAG. [Live Demo](https://pranshu-ai.vercel.app) · [Code](https://github.com/pranshu-rajan/pranshu-ai)\n"
            "- **Vaudeville 2026** (React, TypeScript, Vite, Tailwind CSS, Framer Motion): Highly cinematic pirate-themed cultural fest platform. [Live Demo](https://vaudeville-2026.vercel.app/) · [Code](https://github.com/pranshu-rajan/vaudeville-2026)\n"
            "- **Nuzeal Cultural Fest** (Next.js, TypeScript, Tailwind): High-traffic portal for Nirma University. [Live Demo](https://nuzeal-2026-live.vercel.app) · [Code](https://github.com/pranshu-rajan/nuzeal-cultural-fest)\n"
            "- **Leaf Disease Detection** (Python, PyTorch, Streamlit): Deep learning CV pipeline for agricultural diagnosis. [Live Demo](https://leafdisease-detection.streamlit.app) · [Code](https://github.com/pranshu-rajan/leaf-disease-detection)"
        )
