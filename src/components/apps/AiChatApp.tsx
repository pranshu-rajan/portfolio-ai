"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Send, 
  Sparkles, 
  RotateCcw, 
  Download, 
  Volume2, 
  VolumeX, 
  Check, 
  Copy, 
  Bot, 
  User, 
  Briefcase,
  Layers,
  Award,
  GraduationCap
} from "lucide-react";
import { ChatMessage } from "@/types";
import { candidateProfile } from "@/data/candidate";
import { sounds } from "@/utils/sound";
import { ChatMarkdown } from "@/components/chat/ChatMarkdown";

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "welcome-1",
    role: "assistant",
    content: `### 👋 Welcome! I am ${candidateProfile.name}'s AI Digital Twin\n\nI am strictly grounded in **${candidateProfile.name}'s** verified background, projects, LeetCode track record, and software engineering internships.\n\n### ⚡ Quick Facts\n- **Target Roles**: **Software-Based Roles Only** (SDE, Full-Stack, AI/ML, Backend Internships). Seeking **Winter & Summer Internships** across all modes (Remote / Hybrid / On-site).\n- **Location & Relocation**: Based in India; **open to relocation** across India & globally.\n- **Top 4 Software Projects**: [UPI Offline Mesh](https://github.com/pranshu-rajan/upi-offline-mesh), [PacketLens AI C++17 DPI](https://github.com/pranshu-rajan/dpi-packet-analyser), [Pranshu's AI Vector DB](https://github.com/pranshu-rajan/pranshu-ai), and [Leaf Disease Detection](https://github.com/pranshu-rajan/leaf-disease-detection).\n- **Problem Solving**: Active on [LeetCode](https://leetcode.com/u/PranshuRajan/).\n- **Education**: Nirma University, Ahmedabad (2024–2028, currently in 3rd Year, CGPA 7.88).\n\nWhat would you like to explore about my engineering background?`,
    timestamp: "Just now",
    suggestedFollowUps: [
      "What roles and internships are you targeting?",
      "How did you solve double-spending in UPI Offline Mesh?",
      "Tell me about your C++17 projects & LeetCode",
      "Explain your education at Nirma University",
    ],
  },
];

const PROMPT_SUGGESTIONS = [
  { label: "Target roles & internship availability", icon: Briefcase },
  { label: "UPI Mesh cryptographic replay defense", icon: Award },
  { label: "LeetCode & algorithmic skills", icon: Layers },
  { label: "Nirma University education & CGPA", icon: GraduationCap },
];

export function AiChatApp() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    sounds.playClick();
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const aiMsgId = `ai-${Date.now()}`;
    const assistantMsgPlaceholder: ChatMessage = {
      id: aiMsgId,
      role: "assistant",
      content: "",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      suggestedFollowUps: [
        "Tell me about the Smart Irrigation Fuzzy System",
        "Explain your education at Nirma University",
        "How does UPI Offline Mesh work?",
      ],
    };

    setMessages((prev) => [...prev, userMsg, assistantMsgPlaceholder]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: query }),
      });

      if (!res.ok) {
        throw new Error("API call returned non-200");
      }

      if (!res.body) {
        throw new Error("No response body");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let streamedContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const textChunk = decoder.decode(value, { stream: true });
        streamedContent += textChunk;

        setMessages((prev) => {
          return prev.map((msg) => {
            if (msg.id === aiMsgId) {
              return { ...msg, content: streamedContent };
            }
            return msg;
          });
        });
      }
    } catch {
      // Fallback if network or stream interrupted
      const fallbackAnswer = generateFallbackAnswer(query);
      setMessages((prev) => {
        return prev.map((msg) => {
          if (msg.id === aiMsgId) {
            return {
              ...msg,
              content: msg.content || fallbackAnswer,
            };
          }
          return msg;
        });
      });
    } finally {
      setIsLoading(false);
      sounds.playChime();
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    sounds.playClick();
  };

  const handleSpeak = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const cleanText = text.replace(/[*_`#]/g, "");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleClear = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    setMessages(INITIAL_MESSAGES);
    sounds.playClick();
  };

  const handleDownloadTranscript = () => {
    const transcript = messages
      .map((m) => `[${m.timestamp}] ${m.role.toUpperCase()}:\n${m.content}\n`)
      .join("\n---\n\n");
    const blob = new Blob([transcript], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${candidateProfile.name}_AI_Interview_Transcript.txt`;
    a.click();
    URL.revokeObjectURL(url);
    sounds.playClick();
  };

  return (
    <div className="flex flex-col h-full min-h-0 bg-[#18181c] text-white select-text">
      {/* App Top Toolbar */}
      <div className="shrink-0 flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-[#212127]/90">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold flex items-center gap-1.5">
              <span>HireMe AI Digital Twin</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 rounded-full font-medium">
                Online
              </span>
            </div>
            <div className="text-[10px] text-white/50">
              Grounded in {candidateProfile.name}&apos;s verified resume & projects
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleDownloadTranscript}
            className="p-1.5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors"
            title="Download Transcript"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleClear}
            className="p-1.5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors"
            title="Clear Chat History"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4 text-xs leading-relaxed">
        {messages.map((msg) => {
          const isAi = msg.role === "assistant";
          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isAi ? "items-start" : "flex-row-reverse items-end"}`}
            >
              {/* Avatar */}
              <div
                className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center text-xs font-semibold ${
                  isAi
                    ? "bg-gradient-to-tr from-purple-600 to-pink-600 text-white shadow-md"
                    : "bg-blue-600 text-white shadow-md"
                }`}
              >
                {isAi ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              {/* Message Content Bubble */}
              <div className={`max-w-[88%] flex flex-col ${isAi ? "items-start" : "items-end"}`}>
                <div
                  className={`p-3.5 rounded-2xl ${
                    isAi
                      ? "bg-[#23232b] border border-white/10 text-white/90 shadow-md w-full"
                      : "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md"
                  }`}
                >
                  {isAi ? (
                    <ChatMarkdown content={msg.content} />
                  ) : (
                    <div className="whitespace-pre-wrap text-xs">{msg.content}</div>
                  )}
                </div>

                {/* Sub-actions for AI message */}
                {isAi && (
                  <div className="flex items-center gap-2 mt-1.5 px-1 text-[10px] text-white/40">
                    <span>{msg.timestamp}</span>
                    <span>·</span>
                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="hover:text-white transition-colors flex items-center gap-1"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                    <span>·</span>
                    <button
                      onClick={() => handleSpeak(msg.content)}
                      className="hover:text-white transition-colors flex items-center gap-1"
                    >
                      {isSpeaking ? <VolumeX className="w-3 h-3 text-amber-400" /> : <Volume2 className="w-3 h-3" />}
                      <span>{isSpeaking ? "Stop" : "Listen"}</span>
                    </button>
                  </div>
                )}

                {/* Suggested follow up chips */}
                {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {msg.suggestedFollowUps.map((prompt, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendMessage(prompt)}
                        className="text-[10px] px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-purple-300 hover:text-white transition-all flex items-center gap-1 text-left"
                      >
                        <span>✨</span>
                        <span>{prompt}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-3 items-start">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-white shadow-md">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3 rounded-2xl bg-[#23232b] border border-white/10 flex items-center gap-1.5 text-white/50">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "300ms" }} />
              <span className="text-[11px] ml-1.5 text-white/60">Grounded inference...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Starter Chips */}
      {messages.length <= 2 && (
        <div className="shrink-0 px-4 py-2 border-t border-white/5 bg-[#1b1b20]">
          <div className="text-[10px] text-white/40 mb-1.5 font-medium">Quick Questions:</div>
          <div className="flex flex-wrap gap-1.5">
            {PROMPT_SUGGESTIONS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(item.label)}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-purple-600/30 border border-white/10 hover:border-purple-500/40 text-[11px] text-white/70 hover:text-white transition-all flex items-center gap-1.5"
                >
                  <Icon className="w-3 h-3 text-purple-400" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Input Bar - Always docked at bottom of modal */}
      <div className="shrink-0 p-3 border-t border-white/10 bg-[#202026]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about UPI Offline Mesh, C++17 Vector DB, Xtin Capital..."
            className="flex-1 min-w-0 bg-[#151518] border border-white/15 focus:border-purple-500/80 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-white/40 outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`w-9 h-9 shrink-0 rounded-xl flex items-center justify-center transition-all ${
              input.trim() && !isLoading
                ? "bg-gradient-to-tr from-purple-600 to-pink-600 text-white shadow-md hover:scale-105 active:scale-95"
                : "bg-white/10 text-white/30 cursor-not-allowed"
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

// Client-side intelligent fallback response generator strictly grounded in Pranshu Rajan's real verified resume
function generateFallbackAnswer(query: string): string {
  const q = query.toLowerCase();

  if (q.includes("role") || q.includes("hardware") || q.includes("software") || q.includes("intern") || q.includes("winter") || q.includes("summer") || q.includes("relocat") || q.includes("mode") || q.includes("location") || q.includes("availab") || q.includes("join") || q.includes("timeline") || q.includes("duration")) {
    return `### 🎯 Target Roles & Internship Availability\n\n` +
      `- **Target Roles**: **Strictly Software-Based Roles** (Software Development Engineer Intern, Full Stack Developer Intern, AI/ML Engineer Intern, Backend Engineer Intern). Pranshu does **not** seek hardware roles.\n` +
      `- **Target Domains**: **Developer Tooling**, **GenAI Infrastructure**, **High-Throughput Systems**, and **Distributed Backends**.\n` +
      `- **Internship Timelines & Duration**:\n` +
      `  - **Winter Internship**: **November 2026 – December 2026** (2 to 3 months).\n` +
      `  - **Summer Internship**: **May – July** (Standard summer window, 2 to 3 months).\n` +
      `- **Availability / Immediate Joining**: Pranshu is currently enrolled in his 3rd year at Nirma University, so he **cannot join immediately mid-semester**. He is available for the scheduled Winter (Nov–Dec 2026) and Summer internship cycles.\n` +
      `- **Work Modes**: Open to all modes — **Remote**, **Hybrid**, or **On-site**.\n` +
      `- **Location & Relocation**: Based in India; **fully open to relocation** across all locations in India and globally.\n` +
      `- **DSA & Coding Profile**: Check out his active LeetCode track record at [leetcode.com/u/PranshuRajan](https://leetcode.com/u/PranshuRajan/).`;
  }

  if (q.includes("domain") || q.includes("industry") || q.includes("tooling") || q.includes("genai infra")) {
    return `### 🚀 Target Industries & Domains of Interest\n\n` +
      `Pranshu is particularly passionate about engineering high-impact software in:\n` +
      `- **Developer Tooling**: Building high-efficiency developer tools, compilers, parsers, and diagnostic platforms (demonstrated in **PacketLens AI** C++17 DPI and packet inspection).\n` +
      `- **GenAI Infrastructure & Systems**: Vector databases, indexing algorithms (HNSW, KD-Tree), RAG pipelines, and LLM orchestration (demonstrated in **Pranshu's AI** and SAP/Oracle GenAI certifications).\n` +
      `- **High-Performance Distributed Backends**: Resilient payment relays, cryptographic protocols, and concurrent architectures (demonstrated in **UPI Offline Mesh**).\n\n` +
      `He thrives in collaborative engineering cultures with clean code practices and zero chaos.`;
  }

  if (q.includes("hire") || q.includes("why should") || q.includes("strength") || q.includes("recommend")) {
    return `### 🎯 Why Pranshu Rajan Stands Out\n\n` +
      `**${candidateProfile.name}** is a versatile Full Stack Developer and AI Engineer combining low-level systems programming with modern production web architectures.\n\n` +
      `### ⚡ Core Engineering Strengths\n` +
      `- **Systems & Full-Stack Polyglot**: Mastered high-throughput low-level programming (**C++17, Python, Java Spring Boot**) alongside production web stacks (**Next.js 15, React, Node.js, Express, Tailwind CSS**).\n` +
      `- **Custom AI & Vector Engines**: Engineered **Pranshu's AI** from scratch—a C++17 & Python vector database featuring HNSW/KD-tree indexing and BM25 hybrid search with sub-millisecond query latency.\n` +
      `- **Fintech Security & Resilience**: Architected **UPI Offline Mesh** using hybrid encryption (RSA-2048-OAEP + AES-256-GCM) and database optimistic locking; resolved critical payment race conditions at **Xtin Capital**.\n` +
      `- **Leadership & Verified Credentials**: Executive Committee Board Member at **ISA Nirma University** (CGPA 7.88), holding 8 verified certifications including SAP Generative AI Developer and Oracle OCI GenAI Professional.`;
  }

  if (q.includes("irrigation") || q.includes("fuzzy") || q.includes("water") || q.includes("agriculture")) {
    return `### 🌾 Smart Multizone Irrigation · Hierarchical Adaptive Fuzzy Control\n\n` +
      `This is **Pranshu Rajan's** flagship academic control systems project at **Nirma University** (3rd-Year Electronics & Instrumentation Engineering).\n\n` +
      `### 🛠️ Core Control Theory & Architecture\n` +
      `- **Theoretical Foundation**: Implements a closed-loop hierarchical adaptive Mamdani fuzzy control system, avoiding black-box ML or crude hysteresis switching.\n` +
      `- **5 Modular Fuzzy Inference Systems (FIS)**: Soil Stress FIS, Weather Stress FIS, Water Demand FIS, Main Irrigation Demand FIS, and Water Allocation FIS using Centroid defuzzification.\n` +
      `- **Physics-Based Modeling**: Formulates reference evapotranspiration ($ET_0$) via **FAO-56 Penman-Monteith** and models dynamic soil-water balance to arbitrate zone competition.\n` +
      `- **Validation**: Benchmarked against traditional On-Off (bang-bang) and PID controllers using MATLAB/Simulink and Python (**scikit-fuzzy**).\n\n` +
      `### 🔗 Repository & Live Deployment\n` +
      `- **Live Web App**: [irrigation-fuzzy-system.vercel.app](https://irrigation-fuzzy-system.vercel.app/)\n` +
      `- **GitHub Source**: [github.com/pranshu-rajan/smart-irrigation-fuzzy-system](https://github.com/pranshu-rajan/smart-irrigation-fuzzy-system)`;
  }

  if (q.includes("project") || q.includes("built") || q.includes("work") || q.includes("portfolio")) {
    return `### 🚀 Flagship Engineering Projects\n\n` +
      `Here are the verified systems and platforms engineered by **${candidateProfile.name}**:\n\n` +
      `### ⚡ Featured Systems\n` +
      `- **Smart Multizone Irrigation Fuzzy System** (Python, Fuzzy Logic, MATLAB, Simulink): Closed-loop hierarchical adaptive Mamdani fuzzy control system across 5 modular FIS engines, incorporating FAO-56 Penman-Monteith. [Live Demo](https://irrigation-fuzzy-system.vercel.app/) · [Code](https://github.com/pranshu-rajan/smart-irrigation-fuzzy-system)\n` +
      `- **UPI Offline Mesh** (Java, Spring Boot, PostgreSQL, Next.js, Docker): Offline P2P payment prototype relaying encrypted transactions across nearby devices to solve zero-connectivity UPI failures. Secured with RSA-2048 + AES-256-GCM and SHA-256 idempotency. [Live Demo](https://upi-offline-rho.vercel.app) · [Code](https://github.com/pranshu-rajan/upi-offline-mesh)\n` +
      `- **PacketLens AI** (C++17, FastAPI, Python, Next.js, TypeScript): Multi-threaded C++17 network forensics platform with a Wireshark-style packet inspector, synchronized hex viewer, and streaming security copilot. [Live Demo](https://dpi-packet-analyser.vercel.app) · [Code](https://github.com/pranshu-rajan/dpi-packet-analyser)\n` +
      `- **Pranshu’s AI** (C++17, Python, FastAPI, Next.js, Groq API, SQLite): Custom vector database with HNSW and KD-Tree indexing, cutting query latency to sub-milliseconds, paired with BM25 hybrid RAG. [Live Demo](https://pranshu-ai.vercel.app) · [Code](https://github.com/pranshu-rajan/pranshu-ai)\n` +
      `- **Vaudeville 2026** (React, TypeScript, Vite, Tailwind CSS, Framer Motion): Highly cinematic, immersive pirate-themed cultural fest platform with atmospheric typography, audio lore, and team registrations. [Live Demo](https://vaudeville-2026.vercel.app/) · [Code](https://github.com/pranshu-rajan/vaudeville-2026)\n` +
      `- **Nuzeal Cultural Fest Platform** (Next.js, TypeScript, Tailwind): High-traffic cultural fest web portal for Nirma University. [Live Demo](https://nuzeal-2026-live.vercel.app) · [Code](https://github.com/pranshu-rajan/nuzeal-cultural-fest)\n` +
      `- **Leaf Disease Detection** (Python, PyTorch, Streamlit): Deep learning computer vision pipeline for automated agricultural pathology diagnosis. [Live Demo](https://leafdisease-detection.streamlit.app) · [Code](https://github.com/pranshu-rajan/leaf-disease-detection)`;
  }

  if (q.includes("vaudeville")) {
    return `### 🏴‍☠️ Vaudeville 2026 — The Voyage Begins\n\n` +
      `A highly cinematic, immersive pirate-themed college cultural festival web platform engineered by **${candidateProfile.name}**.\n\n` +
      `### 🛠️ Architecture & Tech Stack\n` +
      `- **Frontend Core**: React, TypeScript, Vite, Tailwind CSS, Framer Motion.\n` +
      `- **Aesthetic Craft**: Custom Cinzel Decorative and Pirata One typography, atmospheric pirate theme, dynamic audio effects, and particle animations.\n` +
      `- **Features**: Interactive schedule exploration, live team registration pipelines, and immersive lore.\n\n` +
      `### 🔗 Verified Links\n` +
      `- **Live Web Portal**: [vaudeville-2026.vercel.app](https://vaudeville-2026.vercel.app/)\n` +
      `- **GitHub Source**: [github.com/pranshu-rajan/vaudeville-2026](https://github.com/pranshu-rajan/vaudeville-2026)`;
  }

  if (q.includes("upi") || q.includes("offline") || q.includes("mesh") || q.includes("payment")) {
    return `### 💳 UPI Offline Mesh — Architecture Breakdown\n\n` +
      `An offline peer-to-peer payment prototype engineered by **${candidateProfile.name}** to solve zero-connectivity transaction failures in crowded stadiums, remote rural areas, or underground transit.\n\n` +
      `### 🔐 Cryptographic & Distributed Design\n` +
      `- **P2P Relay Mechanism**: Nearby devices relay encrypted transactions hop-by-hop until any device reaches cellular connectivity, which forwards it to banking backends.\n` +
      `- **Hybrid Encryption**: Combines **RSA-2048-OAEP** for asymmetric key exchange with **AES-256-GCM** for authenticated payload encryption. Intermediary nodes cannot inspect PINs or tamper with amounts without failing validation.\n` +
      `- **Double-Spend & Replay Defense**: Implements SHA-256 ciphertext idempotency hashing and database optimistic locking (\`@Version\`), verified through multi-threaded concurrency tests.\n\n` +
      `### 🛠️ Tech Stack & Links\n` +
      `- **Technologies**: Java, Spring Boot, PostgreSQL, Next.js, TypeScript, Docker.\n` +
      `- **Live Demo**: [upi-offline-rho.vercel.app](https://upi-offline-rho.vercel.app)\n` +
      `- **GitHub Repository**: [github.com/pranshu-rajan/upi-offline-mesh](https://github.com/pranshu-rajan/upi-offline-mesh)`;
  }

  if (q.includes("packetlens") || q.includes("packet") || q.includes("dpi") || q.includes("network") || q.includes("c++")) {
    return `### 🔍 PacketLens AI — Network Forensics & DPI\n\n` +
      `A high-throughput packet inspection and network security platform powered by a custom multi-threaded C++17 engine.\n\n` +
      `### ⚡ Key Capabilities\n` +
      `- **Multi-Threaded C++17 Core**: Parses raw PCAP binary files, tracks TCP/UDP sessions, and extracts HTTP/TLS headers with zero CPU bottlenecking during gigabyte-scale network traffic dumps.\n` +
      `- **Telemetry & Firewall Rules**: FastAPI backend persists network metrics and applies dynamic firewall rules to automatically generate sanitized PCAP files.\n` +
      `- **Browser Triage Inspector**: Interactive Wireshark-style packet inspector, synchronized live hex viewer, and streaming security copilot.\n\n` +
      `### 🔗 Links & Code\n` +
      `- **Live Demo**: [dpi-packet-analyser.vercel.app](https://dpi-packet-analyser.vercel.app)\n` +
      `- **GitHub Repository**: [github.com/pranshu-rajan/dpi-packet-analyser](https://github.com/pranshu-rajan/dpi-packet-analyser)`;
  }

  if (q.includes("vector") || q.includes("rag") || q.includes("pranshu's ai") || q.includes("pranshu-ai") || q.includes("hnsw")) {
    return `### ⚡ Pranshu’s AI — Vector Database & Hybrid RAG\n\n` +
      `A custom production vector database and hybrid RAG engine written from scratch in **C++17 & Python** by **${candidateProfile.name}**.\n\n` +
      `### 🛠️ Architecture Highlights\n` +
      `- **Custom Indexing Engine**: Custom **HNSW** (Hierarchical Navigable Small World) and **KD-Tree** indexing slashing query latency to sub-milliseconds, eliminating dependence on external paid vector SaaS.\n` +
      `- **Hybrid Retrieval (RRF)**: Implements Reciprocal Rank Fusion combining dense semantic embeddings with BM25 keyword matching in FastAPI, preventing context fragmentation.\n` +
      `- **Full-Stack Dashboard**: Next.js 15, TypeScript, and Docker web dashboard with drag-and-drop document chunking, graph inspection, and Groq LPU inference.\n\n` +
      `### 🔗 Links & Code\n` +
      `- **Live Demo**: [pranshu-ai.vercel.app](https://pranshu-ai.vercel.app)\n` +
      `- **GitHub Repository**: [github.com/pranshu-rajan/pranshu-ai](https://github.com/pranshu-rajan/pranshu-ai)`;
  }

  if (q.includes("experience") || q.includes("intern") || q.includes("xtin") || q.includes("ibm") || q.includes("edunet")) {
    return `### 💼 Professional Work Experience\n\n` +
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
  }

  if (q.includes("skill") || q.includes("stack") || q.includes("technolog") || q.includes("language")) {
    return `### 🛠️ Technical Skills & Expertise\n\n` +
      `- **Programming Languages**: JavaScript, TypeScript, Python, SQL, HTML5, CSS3, C++17, Java.\n` +
      `- **Frontend Technologies**: React.js, Next.js (App Router), Vite, Tailwind CSS, Framer Motion, GSAP, Three.js, React Three Fiber, Chart.js.\n` +
      `- **Backend Technologies**: Node.js, Express.js, Spring Boot, REST APIs, JWT Authentication, OAuth2, NextAuth, Prisma ORM, Stripe, Razorpay, n8n Automation.\n` +
      `- **Databases**: PostgreSQL, Supabase, MongoDB, MySQL, Row Level Security, Database Triggers, Query Optimization.\n` +
      `- **Cloud & DevOps**: Vercel, Render, Railway, GoDaddy, Git, GitHub, CI/CD Pipelines, Docker.\n` +
      `- **AI & Machine Learning**: RAG Pipelines, Large Language Models (LLM), OpenAI, Groq API, Claude API, Prompt Engineering, Vector Embeddings, pgvector, HNSW, KD-Tree, BM25.\n` +
      `- **Best Practices**: Code Review, Unit Testing, Responsive Design, System Design, Team Leadership.`;
  }

  if (q.includes("certif") || q.includes("credential") || q.includes("award") || q.includes("scholar") || q.includes("sap") || q.includes("oracle")) {
    return `### 📜 Verified Certifications & Credentials (8 Total)\n\n` +
      `1. **SAP Certified - SAP Generative AI Developer** — SAP (Issued Jan 15, 2026, [Credly Badge](https://www.credly.com/badges/b004db60-7712-45cf-88d2-93997a79f6e4))\n` +
      `2. **Oracle Certified Professional**: OCI 2025 Generative AI Professional — Oracle (ID: \`321763733OCI25GAIOCP\`)\n` +
      `3. **Oracle Certified Foundations Associate**: OCI 2025 AI Foundations Associate — Oracle (ID: \`321763733OCI25AICFA\`)\n` +
      `4. **Certificate of Scholar** — Nirma University (Scholastic Award, SGPA 8.57/10 in 2nd Semester, No: \`SCHOLAR-CERTI/2502599\`)\n` +
      `5. **AI Agents Course** — Hugging Face (Credential ID: \`pranshurajan\`)\n` +
      `6. **C Programming Certification Test** — KnowledgeGate (Cert No: \`12219903219980860626648\`, [Verify](https://learn.knowledgegate.ai/learn/certificate/12219903-219980))\n` +
      `7. **Get Started with Databricks for Machine Learning** — SimpliLearn SkillUp (Code: \`8565682\`)\n` +
      `8. **Certificate of Participation — AI in Renewable Energy Field** — ISA Students' Chapter, Nirma University\n\n` +
      `*You can also open the **Photos app** on this desktop to view high-resolution scans and official badges of each certificate!*`;
  }

  if (q.includes("education") || q.includes("nirma") || q.includes("college") || q.includes("degree") || q.includes("study") || q.includes("year")) {
    return `### 🎓 Academic Background\n\n` +
      `- **B.Tech in Electronics and Instrumentation Engineering** — Nirma University, Ahmedabad\n` +
      `  - **Academic Standing**: Currently in **3rd Year** (Duration: **July 2024 – July 2028**)\n` +
      `  - **Cumulative GPA**: **7.88 / 10.0**\n` +
      `  - **Key Coursework**: Control Systems, Fuzzy Logic & Intelligent Control, Microcontrollers, Digital Signal Processing, Distributed Systems\n` +
      `  - **Leadership**: Executive Committee Board Member at **International Society of Automation (ISA)** Nirma Chapter\n` +
      `  - **Scholarship**: Recipient of the **Certificate of Scholar** from Nirma University\n\n` +
      `- **Class XII (GSEB)** — Swastik Academy, Gujarat\n` +
      `  - Scored **80.3%** in Science & Mathematics (2024)`;
  }

  if (q.includes("isa") || q.includes("leadership") || q.includes("responsibility") || q.includes("position")) {
    return `### 🌟 Positions of Responsibility\n\n` +
      `### Executive Committee Board Member | International Society of Automation (ISA)\n` +
      `*December 2025 – December 2026*\n` +
      `- Promoted to Executive Committee Board based on demonstrated leadership and technical contribution record.\n` +
      `- Lead coordination of technical events, workshops, and competitions as part of Nirma University's annual tech fest.\n\n` +
      `### Member | International Society of Automation\n` +
      `*May 2025 – July 2026*\n` +
      `- Coordinated and managed technical events, workshops, and student learning hackathons.`;
  }

  if (q.includes("contact") || q.includes("email") || q.includes("reach") || q.includes("github") || q.includes("linkedin")) {
    return `### 📬 Contact & Profiles\n\n` +
      `Reach out to **${candidateProfile.name}** directly:\n\n` +
      `- **Email**: [${candidateProfile.email}](mailto:${candidateProfile.email})\n` +
      `- **Phone**: +91 9316347270\n` +
      `- **Location**: ${candidateProfile.location}\n` +
      `- **GitHub**: [github.com/pranshu-rajan](https://github.com/pranshu-rajan)\n` +
      `- **LinkedIn**: [linkedin.com/in/pranshu-rajan](https://www.linkedin.com/in/pranshu-rajan/)\n\nYou can also launch the **Mail app** on this desktop to draft a direct message right away!`;
  }

  const isGreeting = q.includes("hi") || q.includes("hello") || q.includes("hey") || q.includes("who are you") || q.includes("what can you do") || q.includes("pranshu") || q.trim() === "" || q.includes("about you") || q.includes("intro");

  if (isGreeting) {
    return `### 👋 Hello! I am ${candidateProfile.name}'s AI Digital Twin\n\n` +
      `${candidateProfile.bio}\n\n` +
      `### ⚡ Verified Background\n` +
      `- **Education**: B.Tech in Electronics & Instrumentation Engineering at **Nirma University, Ahmedabad** (2024–2028, currently in 3rd Year, CGPA 7.88)\n` +
      `- **Flagship Control Systems**: [Smart Multizone Irrigation Fuzzy System](https://irrigation-fuzzy-system.vercel.app/) (5 Mamdani FIS engines, FAO-56 Penman-Monteith, validated vs PID)\n` +
      `- **Systems & Fintech**: [UPI Offline Mesh](https://upi-offline-rho.vercel.app), [PacketLens AI C++17 DPI](https://dpi-packet-analyser.vercel.app), and [Pranshu's AI Vector DB](https://pranshu-ai.vercel.app)\n` +
      `- **Internships**: Full Stack Developer Intern at **Xtin Capital** & AI/Cloud Intern at **Edunet (IBM SkillsBuild)**\n` +
      `- **Certifications**: 8 verified credentials including **SAP Certified Generative AI Developer**, **Oracle OCI GenAI Professional**, and **Nirma Certificate of Scholar**.\n\n` +
      `What would you like to explore about ${candidateProfile.name}'s background?`;
  }

  // Strict Out-of-Scope boundary for any external / unrelated query
  return `This is out of my scope. I am Pranshu Rajan's AI portfolio representative and can only answer questions related to Pranshu's verified background, software projects, technical skills, certifications, and internship opportunities.`;
}
