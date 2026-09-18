"use client";

import React, { useState } from "react";
import { WallpaperId } from "@/types";
import { Image, Volume2, Sliders, Info, Check } from "lucide-react";
import { sounds } from "@/utils/sound";
import { candidateProfile } from "@/data/candidate";

interface SettingsAppProps {
  currentWallpaper: WallpaperId;
  onSelectWallpaper: (wp: WallpaperId) => void;
}

const WALLPAPERS: { id: WallpaperId; title: string; subtitle: string; previewClass: string }[] = [
  {
    id: "sequoia",
    title: "macOS Sequoia",
    subtitle: "Default dynamic gradient landscape",
    previewClass: "from-blue-600 via-indigo-700 to-amber-500",
  },
  {
    id: "sonoma",
    title: "macOS Sonoma",
    subtitle: "Vibrant sunset horizon",
    previewClass: "from-sky-500 via-indigo-600 to-pink-500",
  },
  {
    id: "ventura",
    title: "macOS Ventura",
    subtitle: "Abstract dynamic amber burst",
    previewClass: "from-amber-500 via-orange-600 to-rose-700",
  },
  {
    id: "aurora",
    title: "Aurora Borealis",
    subtitle: "Deep neon northern lights",
    previewClass: "from-emerald-600 via-teal-700 to-purple-900",
  },
  {
    id: "midnight",
    title: "Midnight Studio",
    subtitle: "Minimal dark obsidian glass",
    previewClass: "from-zinc-900 via-zinc-800 to-black",
  },
];

export function SettingsApp({ currentWallpaper, onSelectWallpaper }: SettingsAppProps) {
  const [activeTab, setActiveTab] = useState<"wallpaper" | "sound" | "about" | "diagnostics">("wallpaper");
  const [soundEnabled, setSoundEnabled] = useState(sounds.enabled);
  const [backendStatus, setBackendStatus] = useState<"idle" | "checking" | "online" | "offline">("idle");
  const [dbStatus, setDbStatus] = useState<string>("unknown");

  const checkBackendHealth = async () => {
    setBackendStatus("checking");
    sounds.playClick();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    try {
      const res = await fetch(`${apiUrl}/api/v1/health`, {
        signal: AbortSignal.timeout(3000),
      });
      if (res.ok) {
        const data = await res.json();
        setBackendStatus("online");
        setDbStatus(data.database || "connected");
        sounds.playChime();
      } else {
        setBackendStatus("offline");
        setDbStatus("unreachable");
      }
    } catch {
      setBackendStatus("offline");
      setDbStatus("offline (running in local fallback mode)");
    }
  };


  const handleToggleSound = () => {
    sounds.enabled = !soundEnabled;
    setSoundEnabled(!soundEnabled);
    if (!soundEnabled) {
      sounds.playClick();
    }
  };

  return (
    <div className="flex h-full bg-[#18181c] text-white select-none">
      {/* Settings Sidebar */}
      <div className="w-48 border-r border-white/10 bg-[#1e1e24] p-3 space-y-1 text-xs shrink-0">
        <div className="text-[10px] font-bold uppercase text-white/40 mb-2 px-2">Settings</div>

        <button
          onClick={() => {
            sounds.playClick();
            setActiveTab("wallpaper");
          }}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-colors font-medium ${
            activeTab === "wallpaper" ? "bg-blue-600 text-white" : "text-white/70 hover:bg-white/10"
          }`}
        >
          <Image className="w-4 h-4" />
          <span>Wallpaper</span>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            setActiveTab("sound");
          }}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-colors font-medium ${
            activeTab === "sound" ? "bg-blue-600 text-white" : "text-white/70 hover:bg-white/10"
          }`}
        >
          <Volume2 className="w-4 h-4" />
          <span>Sound Effects</span>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            setActiveTab("about");
          }}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-colors font-medium ${
            activeTab === "about" ? "bg-blue-600 text-white" : "text-white/70 hover:bg-white/10"
          }`}
        >
          <Info className="w-4 h-4" />
          <span>About Candidate</span>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            setActiveTab("diagnostics");
          }}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-colors font-medium ${
            activeTab === "diagnostics" ? "bg-blue-600 text-white" : "text-white/70 hover:bg-white/10"
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Full Stack Status</span>
        </button>
      </div>


      {/* Settings Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {activeTab === "wallpaper" && (
          <div>
            <h2 className="text-sm font-bold text-white mb-1">Desktop Wallpapers</h2>
            <p className="text-xs text-white/50 mb-4">
              Select your preferred macOS background wallpaper.
            </p>

            <div className="grid grid-cols-2 gap-3.5">
              {WALLPAPERS.map((wp) => {
                const isSelected = currentWallpaper === wp.id;
                return (
                  <div
                    key={wp.id}
                    onClick={() => {
                      sounds.playClick();
                      onSelectWallpaper(wp.id);
                    }}
                    className={`rounded-xl border p-2 cursor-pointer transition-all ${
                      isSelected
                        ? "border-blue-500 bg-blue-500/10 ring-2 ring-blue-500/40"
                        : "border-white/10 bg-white/5 hover:border-white/20"
                    }`}
                  >
                    <div
                      className={`h-24 rounded-lg bg-gradient-to-br ${wp.previewClass} mb-2 relative flex items-center justify-center shadow-inner`}
                    >
                      {isSelected && (
                        <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-lg">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <div className="text-xs font-semibold text-white">{wp.title}</div>
                    <div className="text-[10px] text-white/50">{wp.subtitle}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === "sound" && (
          <div className="max-w-md space-y-4">
            <h2 className="text-sm font-bold text-white mb-1">Sound & Feedback</h2>
            <p className="text-xs text-white/50 mb-4">
              Control native synthetic sound effects for window actions and button clicks.
            </p>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-white">System Sound Effects</div>
                <div className="text-[11px] text-white/50">
                  Window opening chimes, button clicks, and trash effects
                </div>
              </div>
              <button
                onClick={handleToggleSound}
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                  soundEnabled ? "bg-blue-600" : "bg-zinc-700"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    soundEnabled ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        )}

        {activeTab === "about" && (
          <div className="max-w-md space-y-3 text-xs">
            <h2 className="text-sm font-bold text-white">About Candidate</h2>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex justify-between">
                <span className="text-white/50">Name:</span>
                <span className="font-semibold text-white">{candidateProfile.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Title:</span>
                <span className="font-semibold text-white">{candidateProfile.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Availability:</span>
                <span className="font-semibold text-emerald-400">{candidateProfile.availability}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Email:</span>
                <span className="font-semibold text-white">{candidateProfile.email}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "diagnostics" && (
          <div className="max-w-lg space-y-4 text-xs">
            <div>
              <h2 className="text-sm font-bold text-white mb-1">Full-Stack System Status</h2>
              <p className="text-xs text-white/50 mb-3">
                Live architectural verification for Next.js, Tailwind CSS, FastAPI, and MongoDB.
              </p>
            </div>

            <div className="space-y-2">
              {/* Frontend Card */}
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Frontend Web Engine</span>
                  </div>
                  <div className="text-[11px] text-white/50">
                    Next.js 16.3 (Turbopack) · Tailwind CSS v4 · TypeScript 5
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold">
                  Online
                </span>
              </div>

              {/* FastAPI Backend Card */}
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        backendStatus === "online"
                          ? "bg-emerald-400"
                          : backendStatus === "offline"
                          ? "bg-amber-400"
                          : "bg-blue-400"
                      }`}
                    />
                    <span>FastAPI Backend Service</span>
                  </div>
                  <div className="text-[11px] text-white/50">
                    Python 3.11 · Uvicorn · Asynchronous REST API
                  </div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                    backendStatus === "online"
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                      : backendStatus === "offline"
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                      : "bg-white/10 text-white/60 border-white/10"
                  }`}
                >
                  {backendStatus === "online"
                    ? "Connected"
                    : backendStatus === "offline"
                    ? "Local Fallback"
                    : "Not Tested"}
                </span>
              </div>

              {/* MongoDB Card */}
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        backendStatus === "online" ? "bg-emerald-400" : "bg-white/30"
                      }`}
                    />
                    <span>MongoDB Database</span>
                  </div>
                  <div className="text-[11px] text-white/50">
                    Motor Async Client · Beanie ODM · MongoDB 7.0
                  </div>
                </div>
                <span className="text-[10px] font-medium text-white/60">
                  {backendStatus === "online" ? dbStatus : "Ready / Standby"}
                </span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={checkBackendHealth}
                disabled={backendStatus === "checking"}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors flex items-center gap-2 shadow-md shadow-blue-600/20 disabled:opacity-50"
              >
                {backendStatus === "checking" ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Pinging Backend...</span>
                  </>
                ) : (
                  <span>Test API Connection</span>
                )}
              </button>

              <span className="text-[10px] text-white/40">
                Target: {process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

