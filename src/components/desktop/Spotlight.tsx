"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Search, Sparkles, FolderGit2, Terminal, FileText, ArrowRight } from "lucide-react";
import { AppId, Project } from "@/types";
import { projectsData } from "@/data/projects";
import { candidateProfile } from "@/data/candidate";
import { sounds } from "@/utils/sound";

interface SpotlightProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenApp: (id: AppId) => void;
  onAskAi: (question: string) => void;
  onSelectProject: (p: Project) => void;
}

interface SearchItem {
  type: "project" | "app" | "skill" | "ai";
  title: string;
  subtitle: string;
  id?: AppId;
  project?: Project;
  icon: React.ComponentType<{ className?: string }>;
}

export function Spotlight({
  isOpen,
  onClose,
  onOpenApp,
  onAskAi,
  onSelectProject,
}: SpotlightProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Close on Escape or click outside
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const searchResults: SearchItem[] = useMemo(() => {
    if (!query.trim()) {
      return [
        { type: "app", title: "HireMe AI Candidate Assistant", subtitle: "Ask anything about candidate & projects", id: "aichat" as AppId, icon: Sparkles },
        { type: "app", title: "Projects Finder", subtitle: "Browse full-stack and AI projects", id: "finder" as AppId, icon: FolderGit2 },
        { type: "app", title: "Terminal CLI", subtitle: "Run developer commands & neofetch", id: "terminal" as AppId, icon: Terminal },
        { type: "app", title: "Resume Preview", subtitle: "View candidate resume and credentials", id: "resume" as AppId, icon: FileText },
      ];
    }

    const q = query.toLowerCase();
    const items: SearchItem[] = [];

    // Projects match
    projectsData.forEach((proj) => {
      if (
        proj.title.toLowerCase().includes(q) ||
        proj.tagline.toLowerCase().includes(q) ||
        proj.technologies.some((t) => t.toLowerCase().includes(q))
      ) {
        items.push({
          type: "project",
          title: proj.title,
          subtitle: `Project · ${proj.technologies.slice(0, 3).join(", ")}`,
          project: proj,
          icon: FolderGit2,
        });
      }
    });

    // Skills match
    candidateProfile.skills.forEach((cat) => {
      cat.items.forEach((skill) => {
        if (skill.toLowerCase().includes(q)) {
          items.push({
            type: "skill",
            title: skill,
            subtitle: `Skill · ${cat.category}`,
            icon: Sparkles,
          });
        }
      });
    });

    // Ask AI Action
    items.unshift({
      type: "ai",
      title: `Ask AI: "${query}"`,
      subtitle: "Query the HireMe AI Assistant directly",
      icon: Sparkles,
    });

    return items;
  }, [query]);

  if (!isOpen) return null;

  const handleSelect = (item: (typeof searchResults)[0]) => {
    sounds.playClick();
    if (item.type === "app" && item.id) {
      onOpenApp(item.id as AppId);
    } else if (item.type === "project" && item.project) {
      onSelectProject(item.project);
    } else if (item.type === "ai" || item.type === "skill") {
      onAskAi(query || item.title);
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[10000] bg-black/40 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-24 px-3 sm:px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-[#1e1e24]/95 border border-white/20 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-2xl animate-in zoom-in-95 duration-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-3.5 sm:px-4 py-3 border-b border-white/10 gap-2.5 sm:gap-3">
          <Search className="w-5 h-5 text-white/50 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Spotlight Search or Ask AI anything..."
            className="flex-1 bg-transparent text-white text-sm sm:text-base outline-none placeholder:text-white/40"
            autoFocus
          />
          <kbd className="text-[10px] text-white/40 border border-white/20 rounded px-1.5 py-0.5 shrink-0">
            ESC
          </kbd>
        </div>

        {/* Search Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {searchResults.map((item, idx) => {
            const Icon = item.icon;
            const isSelected = idx === selectedIndex;
            return (
              <div
                key={idx}
                onClick={() => handleSelect(item)}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${
                  isSelected
                    ? "bg-blue-600 text-white"
                    : "hover:bg-white/10 text-white/90"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isSelected ? "bg-white/20 text-white" : "bg-white/10 text-blue-400"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold truncate">{item.title}</div>
                    <div
                      className={`text-[10px] truncate ${
                        isSelected ? "text-white/80" : "text-white/50"
                      }`}
                    >
                      {item.subtitle}
                    </div>
                  </div>
                </div>

                <ArrowRight
                  className={`w-3.5 h-3.5 ${
                    isSelected ? "opacity-100 text-white" : "opacity-0"
                  }`}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
