"use client";

import React, { useState } from "react";
import { 
  Bot, 
  FolderGit2, 
  FileText, 
  Terminal,
  Users,
  Image as ImageIcon,
  Compass,
  Settings,
  Mail,
  Grid,
  X,
  Sparkles
} from "lucide-react";
import { candidateProfile } from "@/data/candidate";
import { AiChatApp } from "@/components/apps/AiChatApp";
import { ProjectsApp } from "@/components/apps/ProjectsApp";
import { ResumeApp } from "@/components/apps/ResumeApp";
import { ContactsApp } from "@/components/apps/ContactsApp";
import { PhotosApp } from "@/components/apps/PhotosApp";
import { TerminalApp } from "@/components/apps/TerminalApp";
import { SafariApp } from "@/components/apps/SafariApp";
import { SettingsApp } from "@/components/apps/SettingsApp";
import { MailApp } from "@/components/apps/MailApp";
import { sounds } from "@/utils/sound";
import { AppId } from "@/types";

const ALL_MOBILE_APPS: { id: AppId; name: string; icon: React.ComponentType<{ className?: string }>; color: string; desc: string }[] = [
  { id: "aichat", name: "HireMe AI", icon: Bot, color: "from-purple-500 to-pink-500", desc: "Interactive AI Twin" },
  { id: "finder", name: "Projects", icon: FolderGit2, color: "from-blue-500 to-indigo-600", desc: "Flagship Software" },
  { id: "resume", name: "Resume", icon: FileText, color: "from-amber-500 to-orange-600", desc: "Verified PDF & Skills" },
  { id: "photos", name: "Certifications", icon: ImageIcon, color: "from-emerald-500 to-teal-600", desc: "Oracle & AI Badges" },
  { id: "contacts", name: "Contacts", icon: Users, color: "from-sky-500 to-blue-600", desc: "Reach Out & Socials" },
  { id: "safari", name: "Live Demos", icon: Compass, color: "from-blue-400 to-cyan-500", desc: "Interactive Web Apps" },
  { id: "terminal", name: "Developer CLI", icon: Terminal, color: "from-emerald-600 to-zinc-800", desc: "Zsh Command Line" },
  { id: "mail", name: "Recruiter Mail", icon: Mail, color: "from-blue-600 to-indigo-700", desc: "Direct Inquiry Form" },
  { id: "settings", name: "Settings", icon: Settings, color: "from-zinc-500 to-zinc-700", desc: "Theme & Diagnostics" },
];

export function MobileView() {
  const [activeTab, setActiveTab] = useState<AppId>("aichat");
  const [safariUrl, setSafariUrl] = useState<string>("https://irrigation-fuzzy-system.vercel.app/");
  const [appDrawerOpen, setAppDrawerOpen] = useState(false);

  const handleTabChange = (tab: AppId) => {
    sounds.playClick();
    setActiveTab(tab);
    setAppDrawerOpen(false);
  };

  const handlePreviewSafari = (url: string) => {
    if (url) setSafariUrl(url);
    handleTabChange("safari");
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#0d0d11] text-white overflow-hidden font-sans select-none">
      {/* Mobile Top Header */}
      <header className="h-14 border-b border-white/10 px-3 sm:px-4 flex items-center justify-between bg-[#15151a] shrink-0 z-40">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-sm font-bold shadow-md shrink-0">
            P
          </div>
          <div className="min-w-0">
            <h1 className="text-xs font-bold leading-tight truncate">{candidateProfile.name}</h1>
            <p className="text-[10px] text-white/50 truncate">{candidateProfile.title}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="hidden xs:inline-block text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium">
            Available
          </span>

          {/* All Apps Drawer Trigger */}
          <button
            onClick={() => {
              sounds.playClick();
              setAppDrawerOpen((prev) => !prev);
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-all ${
              appDrawerOpen
                ? "bg-purple-600 text-white border-purple-500"
                : "bg-white/10 text-white/80 hover:text-white border-white/10 active:scale-95"
            }`}
            title="App Switcher"
          >
            <Grid className="w-3.5 h-3.5" />
            <span className="text-[11px]">Apps</span>
          </button>
        </div>
      </header>

      {/* Active Tab View */}
      <main className="flex-1 overflow-hidden relative min-h-0 bg-[#141418]">
        {activeTab === "aichat" && <AiChatApp />}
        {activeTab === "finder" && (
          <ProjectsApp
            onOpenApp={handleTabChange}
            onPreviewInSafari={handlePreviewSafari}
            onAskAiAboutProject={() => handleTabChange("aichat")}
          />
        )}
        {activeTab === "resume" && <ResumeApp />}
        {activeTab === "photos" && <PhotosApp />}
        {activeTab === "contacts" && <ContactsApp onOpenApp={handleTabChange} />}
        {activeTab === "terminal" && <TerminalApp onOpenApp={handleTabChange} />}
        {activeTab === "safari" && <SafariApp initialUrl={safariUrl} />}
        {activeTab === "mail" && <MailApp />}
        {activeTab === "settings" && (
          <SettingsApp currentWallpaper="sequoia" onSelectWallpaper={() => {}} />
        )}

        {/* All Apps Modal Drawer (iOS App Library style) */}
        {appDrawerOpen && (
          <div 
            className="absolute inset-0 bg-black/75 backdrop-blur-md z-50 flex flex-col p-4 animate-in fade-in zoom-in-95 duration-150"
            onClick={() => setAppDrawerOpen(false)}
          >
            <div 
              className="bg-[#1c1c22] border border-white/15 rounded-2xl shadow-2xl p-4 flex flex-col max-h-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-bold text-white">Portfolio Applications</span>
                </div>
                <button
                  onClick={() => setAppDrawerOpen(false)}
                  className="p-1 rounded-lg hover:bg-white/10 text-white/60 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-3 grid grid-cols-2 xs:grid-cols-3 gap-2.5">
                {ALL_MOBILE_APPS.map((app) => {
                  const Icon = app.icon;
                  const isActive = activeTab === app.id;
                  return (
                    <button
                      key={app.id}
                      onClick={() => handleTabChange(app.id)}
                      className={`p-3 rounded-xl border flex flex-col items-center text-center transition-all ${
                        isActive
                          ? "bg-purple-600/25 border-purple-500/60 text-white shadow-md ring-1 ring-purple-500/40"
                          : "bg-white/5 border-white/10 hover:bg-white/10 text-white/80"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${app.color} flex items-center justify-center text-white mb-2 shadow-md`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-semibold leading-tight">{app.name}</span>
                      <span className="text-[9px] text-white/50 mt-0.5 line-clamp-1">{app.desc}</span>
                    </button>
                  );
                })}
              </div>

              <div className="pt-2.5 border-t border-white/10 text-[10px] text-white/40 text-center shrink-0">
                Tap any app to switch instantly
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation Bar (iOS / macOS Style) */}
      <nav 
        aria-label="Mobile Navigation"
        className="h-16 border-t border-white/10 bg-[#15151a]/95 backdrop-blur-xl px-1 sm:px-2 flex items-center justify-around shrink-0 z-40 pb-safe"
      >
        <button
          onClick={() => handleTabChange("aichat")}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
            activeTab === "aichat"
              ? "text-purple-400 font-bold"
              : "text-white/50 hover:text-white"
          }`}
        >
          <div className="relative">
            <Bot className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
          </div>
          <span className="text-[10px]">HireMe AI</span>
        </button>

        <button
          onClick={() => handleTabChange("finder")}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
            activeTab === "finder"
              ? "text-blue-400 font-bold"
              : "text-white/50 hover:text-white"
          }`}
        >
          <FolderGit2 className="w-5 h-5" />
          <span className="text-[10px]">Projects</span>
        </button>

        <button
          onClick={() => handleTabChange("resume")}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
            activeTab === "resume"
              ? "text-amber-400 font-bold"
              : "text-white/50 hover:text-white"
          }`}
        >
          <FileText className="w-5 h-5" />
          <span className="text-[10px]">Resume</span>
        </button>

        <button
          onClick={() => handleTabChange("photos")}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
            activeTab === "photos"
              ? "text-emerald-400 font-bold"
              : "text-white/50 hover:text-white"
          }`}
        >
          <ImageIcon className="w-5 h-5" />
          <span className="text-[10px]">Certs</span>
        </button>

        <button
          onClick={() => handleTabChange("contacts")}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
            activeTab === "contacts"
              ? "text-sky-400 font-bold"
              : "text-white/50 hover:text-white"
          }`}
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px]">Contact</span>
        </button>
      </nav>
    </div>
  );
}
