"use client";

import React, { useState } from "react";
import { 
  ArrowLeft, 
  ArrowRight, 
  RotateCw, 
  ShieldCheck, 
  ExternalLink,
  Laptop,
  Smartphone,
  Sparkles,
  Info,
  Globe
} from "lucide-react";
import { projectsData } from "@/data/projects";
import { sounds } from "@/utils/sound";

interface SafariAppProps {
  initialUrl?: string;
}

// Curated clean bookmarks list with short titles & icons
const QUICK_BOOKMARKS = [
  {
    id: "smart-irrigation",
    title: "Smart Irrigation",
    icon: "🌾",
    url: "https://irrigation-fuzzy-system.vercel.app/"
  },
  {
    id: "upi-offline",
    title: "UPI Offline",
    icon: "💳",
    url: "https://upi-offline-rho.vercel.app"
  },
  {
    id: "dpi-packet-analyser",
    title: "PacketLens AI",
    icon: "🔍",
    url: "https://dpi-packet-analyser.vercel.app"
  },
  {
    id: "pranshu-ai",
    title: "Pranshu's AI",
    icon: "🤖",
    url: "https://pranshu-ai.vercel.app"
  },
  {
    id: "vaudeville-2026",
    title: "Vaudeville 2026",
    icon: "🏴‍☠️",
    url: "https://vaudeville-2026.vercel.app/"
  },
  {
    id: "leaf-disease",
    title: "Leaf Disease",
    icon: "🍃",
    url: "https://leafdisease-detection.streamlit.app"
  },
  {
    id: "nuzeal-fest",
    title: "Nuzeal Fest",
    icon: "🎓",
    url: "https://nuzeal-2026-live.vercel.app"
  }
];

export function SafariApp({ initialUrl = "https://irrigation-fuzzy-system.vercel.app/" }: SafariAppProps) {
  const [currentUrl, setCurrentUrl] = useState(initialUrl);
  const [inputUrl, setInputUrl] = useState(initialUrl);
  const [deviceMode, setDeviceMode] = useState<"desktop" | "mobile">("desktop");
  const [iframeKey, setIframeKey] = useState(0);
  const [showIntel, setShowIntel] = useState(false);

  const [prevInitialUrl, setPrevInitialUrl] = useState(initialUrl);

  // Sync if initialUrl changes from external selection (e.g. clicking Live Demo in Projects app)
  if (initialUrl !== prevInitialUrl) {
    setPrevInitialUrl(initialUrl);
    setCurrentUrl(initialUrl);
    setInputUrl(initialUrl);
    setIframeKey((k) => k + 1);
  }

  const matchedProject = projectsData.find(
    (p) => p.liveUrl && (p.liveUrl === currentUrl || p.liveUrl.replace(/\/$/, "") === currentUrl.replace(/\/$/, ""))
  );

  const handleNavigate = (url: string) => {
    sounds.playClick();
    setCurrentUrl(url);
    setInputUrl(url);
    setShowIntel(false);
    setIframeKey((prev) => prev + 1);
  };

  const handleReload = () => {
    sounds.playClick();
    setIframeKey((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col h-full bg-[#1e1e24] text-white select-none">
      {/* Safari Navigation Bar */}
      <div className="h-12 border-b border-white/10 px-3 flex items-center justify-between gap-3 bg-[#24242c]/95 shrink-0">
        {/* Navigation Buttons */}
        <div className="flex items-center gap-1">
          <button
            className="p-1 rounded-md text-white/40 hover:text-white/80 hover:bg-white/10 transition-colors"
            title="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            className="p-1 rounded-md text-white/40 hover:text-white/80 hover:bg-white/10 transition-colors"
            title="Forward"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={handleReload}
            className="p-1 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            title="Reload page"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Address Bar */}
        <div className="flex-1 max-w-xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              let target = inputUrl.trim();
              if (!target.startsWith("http://") && !target.startsWith("https://")) {
                target = "https://" + target;
              }
              handleNavigate(target);
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/40 border border-white/15 focus-within:border-blue-500/80 transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              className="w-full bg-transparent text-xs text-white/90 outline-none font-mono tracking-tight"
              placeholder="Enter web address..."
            />
          </form>
        </div>

        {/* Right Tools: Viewport Toggle, Intel & External Link */}
        <div className="flex items-center gap-1.5">
          {matchedProject && (
            <button
              onClick={() => {
                sounds.playClick();
                setShowIntel(!showIntel);
              }}
              className={`px-2 py-1 rounded-lg text-xs flex items-center gap-1 transition-colors ${
                showIntel 
                  ? "bg-purple-600 text-white font-medium shadow" 
                  : "bg-white/10 hover:bg-white/15 text-purple-300"
              }`}
              title="View Architecture Intel & Metrics"
            >
              <Info className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Intel</span>
            </button>
          )}

          <div className="flex items-center p-0.5 rounded-lg bg-white/10">
            <button
              onClick={() => {
                sounds.playClick();
                setDeviceMode("desktop");
              }}
              className={`p-1 rounded ${deviceMode === "desktop" ? "bg-white/20 text-white" : "text-white/50 hover:text-white"}`}
              title="Desktop view"
            >
              <Laptop className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                setDeviceMode("mobile");
              }}
              className={`p-1 rounded ${deviceMode === "mobile" ? "bg-white/20 text-white" : "text-white/50 hover:text-white"}`}
              title="Mobile view"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>

          <a
            href={currentUrl}
            target="_blank"
            rel="noreferrer"
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors flex items-center gap-1 text-xs"
            title="Open in new browser tab"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Bookmarks Bar */}
      <div className="h-8 border-b border-white/10 px-3 flex items-center gap-1.5 bg-[#1a1a20] text-[11px] text-white/70 overflow-x-auto shrink-0 scrollbar-none">
        <div className="flex items-center gap-1 text-white/40 text-[10px] font-semibold uppercase pr-2 shrink-0">
          <Globe className="w-3 h-3 text-blue-400" />
          <span>Bookmarks:</span>
        </div>
        {QUICK_BOOKMARKS.map((b) => {
          const isActive = currentUrl.replace(/\/$/, "") === b.url.replace(/\/$/, "");
          return (
            <button
              key={b.id}
              onClick={() => handleNavigate(b.url)}
              className={`whitespace-nowrap px-2 py-0.5 rounded-md transition-colors flex items-center gap-1.5 shrink-0 ${
                isActive 
                  ? "bg-blue-600/30 text-blue-300 font-semibold border border-blue-500/40" 
                  : "hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className="text-xs">{b.icon}</span>
              <span>{b.title}</span>
            </button>
          );
        })}
      </div>

      {/* Browser Viewport Area */}
      <div className="flex-1 bg-[#121215] flex items-center justify-center p-2 overflow-hidden relative">
        <div
          className={`h-full transition-all duration-300 rounded-xl overflow-hidden bg-white shadow-2xl flex flex-col relative ${
            deviceMode === "mobile" ? "w-[380px] border-4 border-zinc-800" : "w-full"
          }`}
        >
          {showIntel && matchedProject ? (
            /* Rich Architecture & Project Intel Overlay */
            <div className="flex-1 bg-[#15151a] text-white flex flex-col justify-between p-8 overflow-y-auto">
              <div className="space-y-4 max-w-xl mx-auto">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-semibold border border-blue-500/30">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Verified Project Telemetry</span>
                </div>

                <h1 className="text-2xl font-bold">{matchedProject.title}</h1>
                <p className="text-sm text-white/70 leading-relaxed">
                  {matchedProject.description}
                </p>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                  <div className="text-xs font-bold text-white/90">Key Engineering Highlights:</div>
                  <ul className="text-xs text-white/70 space-y-1 list-disc list-inside">
                    {matchedProject.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {matchedProject.technologies.map((t, i) => (
                    <span
                      key={i}
                      className="text-xs px-2.5 py-1 rounded-md bg-white/10 text-white font-mono"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 flex items-center justify-center gap-3">
                <button
                  onClick={() => setShowIntel(false)}
                  className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all"
                >
                  Return to Live Web View
                </button>
                <a
                  href={matchedProject.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold flex items-center gap-2 shadow-lg transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Launch in New Tab</span>
                </a>
              </div>
            </div>
          ) : (
            /* Live Interactive Webpage Iframe */
            <div className="w-full h-full relative flex flex-col bg-white">
              <iframe
                key={iframeKey}
                src={currentUrl}
                className="w-full h-full border-0 bg-white"
                title="Safari Browser Viewport"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
              />

              {/* Discreet Bottom Bar for External Popup if Frame Ancestors Block */}
              <div className="h-7 bg-[#1c1c22] border-t border-white/10 px-3 flex items-center justify-between text-[11px] text-white/60">
                <span className="truncate max-w-sm">Viewing: <strong className="text-white/80">{currentUrl}</strong></span>
                <a
                  href={currentUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-blue-400 flex items-center gap-1 transition-colors shrink-0"
                >
                  <span>Open external window</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
