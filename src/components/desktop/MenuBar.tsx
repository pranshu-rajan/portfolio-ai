"use client";

import { useState, useEffect } from "react";
import { 
  Wifi, 
  Search, 
  Battery, 
  Volume2, 
  VolumeX, 
  Sliders, 
  Moon, 
  Sun,
  Info,
  ExternalLink,
  Code
} from "lucide-react";
import { AppId, WallpaperId } from "@/types";
import { sounds } from "@/utils/sound";
import { candidateProfile } from "@/data/candidate";

interface MenuBarProps {
  activeApp: AppId;
  onOpenApp: (appId: AppId) => void;
  onToggleSpotlight: () => void;
  wallpaper: WallpaperId;
  onSelectWallpaper: (wp: WallpaperId) => void;
}

const APP_NAMES: Record<AppId, string> = {
  aichat: "HireMe AI",
  finder: "Finder",
  safari: "Safari",
  terminal: "Terminal",
  resume: "Preview",
  mail: "Mail",
  settings: "Settings",
  contacts: "Contacts",
  photos: "Photos",
};

export function MenuBar({
  activeApp,
  onOpenApp,
  onToggleSpotlight,
  wallpaper,
  onSelectWallpaper,
}: MenuBarProps) {
  const [time, setTime] = useState<string>("");
  const [appleMenuOpen, setAppleMenuOpen] = useState(false);
  const [controlCenterOpen, setControlCenterOpen] = useState(false);
  const [soundMuted, setSoundMuted] = useState(!sounds.enabled);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      };
      setTime(now.toLocaleDateString("en-US", options).replace(/,/g, ""));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleSound = () => {
    sounds.enabled = !sounds.enabled;
    setSoundMuted(!sounds.enabled);
    sounds.playClick();
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-7.5 z-[9999] flex items-center justify-between px-3 text-[13px] font-medium text-white/90 select-none backdrop-blur-2xl bg-black/30 border-b border-white/[0.12] shadow-sm">
        {/* Left: Apple Icon & Nav Menus */}
        <div className="flex items-center gap-4">
          {/* Apple Logo */}
          <div className="relative">
            <button
              onClick={() => {
                setAppleMenuOpen(!appleMenuOpen);
                setControlCenterOpen(false);
                sounds.playClick();
              }}
              className="p-1 rounded hover:bg-white/15 transition-colors focus:outline-none flex items-center justify-center text-white"
              title="Apple Menu"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 170 170">
                <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.08-7.71-7.83-12.04-14.25-5.97-8.89-10.74-19.1-14.31-30.63-3.58-11.53-5.37-22.34-5.37-32.44 0-14.75 3.7-26.96 11.09-36.63 7.39-9.67 16.73-14.61 28.01-14.83 5.02 0 10.51 1.34 16.48 4.02 5.97 2.68 9.94 4.08 11.91 4.2 1.79 0 5.86-1.45 12.22-4.34 6.36-2.89 11.83-4.19 16.42-3.9 12.62.67 22.84 5.37 30.66 14.09-11.05 6.7-16.48 15.86-16.29 27.48.22 9.16 3.75 16.92 10.59 23.28 6.84 6.36 14.83 9.94 23.97 10.73-2.12 6.59-4.8 13.52-8.04 20.78zM119.22 31.84c0-7.37 2.63-14.3 7.89-20.78 5.25-6.48 11.78-10.39 19.59-11.73.22 1.23.34 2.35.34 3.35 0 7.37-2.79 14.41-8.38 21.12-5.59 6.7-12.39 10.5-20.4 11.4-.22-1.12-.34-2.23-.34-3.36z" />
              </svg>
            </button>

            {appleMenuOpen && (
              <div className="absolute top-8 left-0 w-60 rounded-xl bg-[#1e1e22]/95 backdrop-blur-2xl border border-white/15 shadow-2xl py-1.5 z-50 text-white/90 animate-in fade-in zoom-in-95 duration-100">
                <button
                  onClick={() => {
                    setAboutModalOpen(true);
                    setAppleMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-1.5 hover:bg-blue-600 hover:text-white rounded-md mx-1 transition-colors flex items-center justify-between"
                >
                  <span>About This Portfolio</span>
                  <Info className="w-3.5 h-3.5 opacity-60" />
                </button>
                <div className="h-px bg-white/10 my-1 mx-2" />
                <button
                  onClick={() => {
                    onOpenApp("settings");
                    setAppleMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-1.5 hover:bg-blue-600 hover:text-white rounded-md mx-1 transition-colors"
                >
                  System Settings...
                </button>
                <button
                  onClick={() => {
                    onOpenApp("terminal");
                    setAppleMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-1.5 hover:bg-blue-600 hover:text-white rounded-md mx-1 transition-colors"
                >
                  Developer CLI...
                </button>
                <div className="h-px bg-white/10 my-1 mx-2" />
                <button
                  onClick={() => {
                    window.location.reload();
                  }}
                  className="w-full text-left px-4 py-1.5 hover:bg-blue-600 hover:text-white rounded-md mx-1 transition-colors"
                >
                  Restart Desktop (Reload)
                </button>
              </div>
            )}
          </div>

          {/* Brand & Active Application Name */}
          <span className="font-bold tracking-wide text-white drop-shadow-sm flex items-center gap-1.5">
            <span>Pranshu&apos;s Portfolio</span>
            <span className="text-white/40 font-normal">|</span>
            <span className="text-white/80 font-medium text-xs">{APP_NAMES[activeApp] || "Desktop"}</span>
          </span>

          {/* Menu Items */}
          <div className="hidden sm:flex items-center gap-3 text-white/70 text-xs">
            <button
              onClick={() => onOpenApp("finder")}
              className="hover:text-white transition-colors cursor-pointer px-1 py-0.5 rounded"
            >
              Projects
            </button>
            <button
              onClick={() => onOpenApp("contacts")}
              className="hover:text-white transition-colors cursor-pointer px-1 py-0.5 rounded"
            >
              Contact
            </button>
            <button
              onClick={() => onOpenApp("resume")}
              className="hover:text-white transition-colors cursor-pointer px-1 py-0.5 rounded"
            >
              Resume
            </button>
          </div>
        </div>

        {/* Right: System Tray & Clock */}
        <div className="flex items-center gap-3.5">
          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="p-1 hover:bg-white/15 rounded transition-colors text-white/80 hover:text-white"
            title={soundMuted ? "Sound Muted" : "Sound Enabled"}
          >
            {soundMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          {/* Wi-Fi Icon */}
          <span title="Wi-Fi: Connected (High Speed)">
            <Wifi className="w-3.5 h-3.5 text-white/85" />
          </span>

          {/* Battery */}
          <div className="flex items-center gap-1 text-[11px] text-white/85" title="Battery: 100% (Plugged In)">
            <span className="font-mono">100%</span>
            <Battery className="w-4 h-4 text-emerald-400" />
          </div>

          {/* Spotlight Trigger */}
          <button
            onClick={onToggleSpotlight}
            className="p-1 hover:bg-white/15 rounded transition-colors text-white/85 hover:text-white flex items-center gap-1"
            title="Spotlight Search (Cmd + K)"
          >
            <Search className="w-3.5 h-3.5" />
          </button>

          {/* Control Center */}
          <div className="relative">
            <button
              onClick={() => {
                setControlCenterOpen(!controlCenterOpen);
                setAppleMenuOpen(false);
                sounds.playClick();
              }}
              className="p-1 hover:bg-white/15 rounded transition-colors text-white/85 hover:text-white"
              title="Control Center"
            >
              <Sliders className="w-3.5 h-3.5" />
            </button>

            {/* Control Center Popover */}
            {controlCenterOpen && (
              <div className="absolute top-8 right-0 w-72 rounded-2xl bg-[#1e1e22]/95 backdrop-blur-2xl border border-white/15 shadow-2xl p-3 z-50 text-white animate-in fade-in zoom-in-95 duration-100">
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-white/10 hover:bg-white/15 transition-colors p-2.5 rounded-xl flex items-center gap-2.5 cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                      <Wifi className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[12px] font-semibold">Wi-Fi</div>
                      <div className="text-[10px] text-white/60">Connected</div>
                    </div>
                  </div>

                  <div 
                    onClick={toggleSound}
                    className="bg-white/10 hover:bg-white/15 transition-colors p-2.5 rounded-xl flex items-center gap-2.5 cursor-pointer"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${soundMuted ? "bg-zinc-600" : "bg-blue-500"}`}>
                      {soundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="text-[12px] font-semibold">Sound</div>
                      <div className="text-[10px] text-white/60">{soundMuted ? "Muted" : "Active"}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 p-2.5 rounded-xl mb-2">
                  <div className="text-[11px] font-medium text-white/70 mb-1 flex items-center justify-between">
                    <span>Wallpaper Theme</span>
                    <span className="capitalize text-blue-400 text-[10px]">{wallpaper}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5 mt-2">
                    {(["sequoia", "sonoma", "ventura", "aurora"] as WallpaperId[]).map((wp) => (
                      <button
                        key={wp}
                        onClick={() => {
                          onSelectWallpaper(wp);
                          sounds.playClick();
                        }}
                        className={`h-7 rounded-lg text-[10px] font-medium capitalize border transition-all ${
                          wallpaper === wp 
                            ? "bg-blue-500/80 border-blue-400 text-white shadow-sm" 
                            : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                        }`}
                      >
                        {wp}
                      </button>
                    ))}
                  </div>
                </div>

                <div 
                  onClick={() => {
                    onOpenApp("aichat");
                    setControlCenterOpen(false);
                  }}
                  className="bg-gradient-to-r from-blue-600/30 to-purple-600/30 border border-blue-500/30 p-2.5 rounded-xl flex items-center justify-between cursor-pointer hover:border-blue-400/50 transition-all"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">✨</span>
                    <div className="text-[12px] font-medium">Talk with AI Candidate</div>
                  </div>
                  <span className="text-[10px] bg-blue-500 text-white px-2 py-0.5 rounded-full font-medium">Launch</span>
                </div>
              </div>
            )}
          </div>

          {/* Dynamic Clock */}
          <span className="tabular-nums font-normal text-white/90 text-[12px] tracking-tight">
            {time || "12:00 PM"}
          </span>
        </div>
      </header>

      {/* About this Portfolio Modal */}
      {aboutModalOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[10000] flex items-center justify-center p-4"
          onClick={() => setAboutModalOpen(false)}
        >
          <div 
            className="w-full max-w-md bg-[#1e1e24] border border-white/20 rounded-2xl shadow-2xl p-6 text-white text-center animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 mx-auto flex items-center justify-center shadow-lg mb-4 text-3xl">
              💻
            </div>
            <h2 className="text-xl font-bold">{candidateProfile.name}&apos;s Portfolio OS</h2>
            <p className="text-xs text-white/60 mt-1">macOS Sequoia Edition · HireMe AI Integrated</p>

            <div className="my-5 p-3.5 rounded-xl bg-white/5 border border-white/10 text-left text-xs space-y-2 text-white/80">
              <div className="flex justify-between">
                <span className="text-white/50">Developer:</span>
                <span className="font-semibold text-white">{candidateProfile.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Primary Focus:</span>
                <span className="font-semibold text-white">{candidateProfile.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">AI Twin Model:</span>
                <span className="font-semibold text-emerald-400">Grounded Resume LLM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Framework:</span>
                <span className="font-semibold text-white">Next.js 15 & Framer Motion</span>
              </div>
            </div>

            <button
              onClick={() => setAboutModalOpen(false)}
              className="px-6 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold shadow-md transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
