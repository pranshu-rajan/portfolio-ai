"use client";

import React, { useState } from "react";
import { 
  Bot, 
  FolderGit2, 
  FileText, 
  Mail, 
  Terminal
} from "lucide-react";
import { candidateProfile } from "@/data/candidate";
import { AiChatApp } from "@/components/apps/AiChatApp";
import { ProjectsApp } from "@/components/apps/ProjectsApp";
import { ResumeApp } from "@/components/apps/ResumeApp";
import { MailApp } from "@/components/apps/MailApp";
import { TerminalApp } from "@/components/apps/TerminalApp";
import { sounds } from "@/utils/sound";
import { AppId } from "@/types";

export function MobileView() {
  const [activeTab, setActiveTab] = useState<AppId>("aichat");

  const handleTabChange = (tab: AppId) => {
    sounds.playClick();
    setActiveTab(tab);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#0d0d11] text-white overflow-hidden font-sans">
      {/* Mobile Top Header */}
      <header className="h-14 border-b border-white/10 px-4 flex items-center justify-between bg-[#15151a] shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-sm font-bold shadow-md">
            P
          </div>
          <div>
            <h1 className="text-xs font-bold leading-tight">{candidateProfile.name}</h1>
            <p className="text-[10px] text-white/50">{candidateProfile.title}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium">
            Available
          </span>
        </div>
      </header>

      {/* Active Tab View */}
      <main className="flex-1 overflow-hidden relative">
        {activeTab === "aichat" && <AiChatApp />}
        {activeTab === "finder" && <ProjectsApp onOpenApp={handleTabChange} />}
        {activeTab === "resume" && <ResumeApp />}
        {activeTab === "mail" && <MailApp />}
        {activeTab === "terminal" && <TerminalApp onOpenApp={handleTabChange} />}
      </main>

      {/* Mobile Bottom Navigation Bar (iOS / macOS Style) */}
      <nav 
        aria-label="Mobile Navigation"
        className="h-16 border-t border-white/10 bg-[#15151a]/95 backdrop-blur-xl px-2 flex items-center justify-around shrink-0 z-50 pb-1"
      >
        <button
          onClick={() => handleTabChange("aichat")}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
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
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
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
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            activeTab === "resume"
              ? "text-amber-400 font-bold"
              : "text-white/50 hover:text-white"
          }`}
        >
          <FileText className="w-5 h-5" />
          <span className="text-[10px]">Resume</span>
        </button>

        <button
          onClick={() => handleTabChange("terminal")}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            activeTab === "terminal"
              ? "text-emerald-400 font-bold"
              : "text-white/50 hover:text-white"
          }`}
        >
          <Terminal className="w-5 h-5" />
          <span className="text-[10px]">CLI</span>
        </button>

        <button
          onClick={() => handleTabChange("mail")}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            activeTab === "mail"
              ? "text-sky-400 font-bold"
              : "text-white/50 hover:text-white"
          }`}
        >
          <Mail className="w-5 h-5" />
          <span className="text-[10px]">Contact</span>
        </button>
      </nav>
    </div>
  );
}
