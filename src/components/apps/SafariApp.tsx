"use client";

import React, { useState } from "react";
import { 
  ArrowLeft, 
  ArrowRight, 
  RotateCw, 
  ShieldCheck, 
  Share2, 
  ExternalLink,
  Laptop,
  Smartphone,
  Sparkles
} from "lucide-react";
import { projectsData } from "@/data/projects";
import { sounds } from "@/utils/sound";

interface SafariAppProps {
  initialUrl?: string;
}

export function SafariApp({ initialUrl }: SafariAppProps) {
  const [currentUrl, setCurrentUrl] = useState(initialUrl || "https://pranshu-ai.vercel.app");
  const [inputUrl, setInputUrl] = useState(currentUrl);
  const [deviceMode, setDeviceMode] = useState<"desktop" | "mobile">("desktop");
  const [iframeKey, setIframeKey] = useState(0);

  const matchedProject = projectsData.find((p) => p.liveUrl === currentUrl);

  const handleNavigate = (url: string) => {
    sounds.playClick();
    setCurrentUrl(url);
    setInputUrl(url);
    setIframeKey((prev) => prev + 1);
  };

  const handleReload = () => {
    sounds.playClick();
    setIframeKey((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col h-full bg-[#1e1e24] text-white select-none">
      {/* Safari Navigation Bar */}
      <div className="h-12 border-b border-white/10 px-3 flex items-center justify-between gap-3 bg-[#24242c]/90">
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
              handleNavigate(inputUrl);
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/40 border border-white/15 focus-within:border-blue-500/80 transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              className="w-full bg-transparent text-xs text-white/90 outline-none font-mono"
            />
          </form>
        </div>

        {/* Right Tools: Viewport Toggle & Share */}
        <div className="flex items-center gap-1.5">
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
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            title="Open in external browser window"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Bookmarks Bar */}
      <div className="h-8 border-b border-white/5 px-4 flex items-center gap-4 bg-[#1e1e24] text-[11px] text-white/70 overflow-x-auto">
        <span className="text-white/40 text-[10px] font-semibold uppercase">Bookmarks:</span>
        {projectsData
          .filter((p) => p.liveUrl)
          .map((p) => (
            <button
              key={p.id}
              onClick={() => handleNavigate(p.liveUrl!)}
              className={`whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                currentUrl === p.liveUrl ? "text-blue-400 font-semibold" : "hover:text-white"
              }`}
            >
              <span>{p.title}</span>
            </button>
          ))}
      </div>

      {/* Browser Viewport Area */}
      <div className="flex-1 bg-[#121215] flex items-center justify-center p-2 overflow-hidden relative">
        <div
          className={`h-full transition-all duration-300 rounded-xl overflow-hidden bg-white shadow-2xl flex flex-col ${
            deviceMode === "mobile" ? "w-[375px] border-4 border-zinc-800" : "w-full"
          }`}
        >
          {matchedProject ? (
            /* Rich Interactive Web Preview Card */
            <div className="flex-1 bg-[#15151a] text-white flex flex-col justify-between p-8 overflow-y-auto">
              <div className="space-y-4 max-w-xl mx-auto">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-semibold border border-blue-500/30">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Verified Live Project</span>
                </div>

                <h1 className="text-2xl font-bold">{matchedProject.title}</h1>
                <p className="text-sm text-white/70 leading-relaxed">
                  {matchedProject.description}
                </p>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                  <div className="text-xs font-bold text-white/90">Performance Highlights:</div>
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
                <a
                  href={matchedProject.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold flex items-center gap-2 shadow-lg transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Launch Live Site in New Tab</span>
                </a>
              </div>
            </div>
          ) : (
            /* Fallback generic iframe */
            <iframe
              key={iframeKey}
              src={currentUrl}
              className="w-full h-full border-0 bg-white"
              title="Project Demo"
              sandbox="allow-scripts allow-same-origin allow-forms"
            />
          )}
        </div>
      </div>
    </div>
  );
}
