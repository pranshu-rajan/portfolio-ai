"use client";

import React, { useState, useMemo } from "react";
import { 
  FolderGit2, 
  ExternalLink, 
  Sparkles, 
  LayoutGrid, 
  List, 
  Search, 
  Star, 
  Bot, 
  Layers, 
  CheckCircle2,
  X
} from "lucide-react";
import { GithubIcon } from "@/components/icons/BrandIcons";
import { Project, AppId } from "@/types";
import { projectsData } from "@/data/projects";
import { sounds } from "@/utils/sound";

interface ProjectsAppProps {
  onOpenApp: (id: AppId) => void;
  onPreviewInSafari?: (url: string) => void;
  onAskAiAboutProject?: (projectName: string) => void;
}

const CATEGORIES = ["All", "AI & ML", "Full Stack", "Systems & Tools", "Open Source"] as const;

export function ProjectsApp({ onOpenApp, onPreviewInSafari, onAskAiAboutProject }: ProjectsAppProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const filteredProjects = useMemo(() => {
    return projectsData.filter((p) => {
      const matchCat = selectedCategory === "All" || p.category === selectedCategory;
      const matchQuery =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.technologies.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchQuery;
    });
  }, [selectedCategory, searchQuery]);

  const handleLaunchLive = (url?: string) => {
    if (!url) return;
    sounds.playClick();
    if (onPreviewInSafari) {
      onPreviewInSafari(url);
    } else {
      window.open(url, "_blank");
    }
  };

  const handleAskAi = (projectTitle: string) => {
    sounds.playClick();
    if (onAskAiAboutProject) {
      onAskAiAboutProject(projectTitle);
    } else {
      onOpenApp("aichat");
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-full bg-[#18181c] text-white">
      {/* Finder Left Sidebar - Hidden on small screen / mobile */}
      <div className="hidden md:flex w-48 lg:w-52 border-r border-white/10 bg-[#1e1e24]/70 p-3 flex-col justify-between shrink-0 select-none">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-white/40 px-2 mb-2">
            Categories
          </div>
          <div className="space-y-0.5">
            {CATEGORIES.map((cat) => {
              const count =
                cat === "All"
                  ? projectsData.length
                  : projectsData.filter((p) => p.category === cat).length;
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    sounds.playClick();
                    setSelectedCategory(cat);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isSelected
                      ? "bg-blue-600 text-white"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FolderGit2 className={`w-3.5 h-3.5 ${isSelected ? "text-white" : "text-blue-400"}`} />
                    <span>{cat}</span>
                  </div>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected ? "bg-white/20 text-white" : "bg-white/5 text-white/40"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Help Card */}
        <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-left">
          <div className="text-[11px] font-semibold text-purple-300 flex items-center gap-1 mb-1">
            <Sparkles className="w-3 h-3" />
            <span>AI Project Assistant</span>
          </div>
          <p className="text-[10px] text-white/50 leading-snug">
            Want to know about design patterns or architecture? Click &apos;Ask AI&apos; on any project.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Horizontal Category Chips Bar on Mobile / Narrow screens */}
        <div className="md:hidden flex items-center gap-1.5 px-3 py-2 border-b border-white/10 bg-[#1b1b22] overflow-x-auto scrollbar-none shrink-0">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  sounds.playClick();
                  setSelectedCategory(cat);
                }}
                className={`whitespace-nowrap px-2.5 py-1 rounded-full text-xs font-medium transition-all shrink-0 ${
                  isSelected
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-white/5 border border-white/10 text-white/70 hover:bg-white/10"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Finder Toolbar */}
        <div className="h-auto min-h-11 py-2 border-b border-white/10 px-3 sm:px-4 flex flex-wrap items-center justify-between gap-2 bg-[#202026]/70 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white/90">
              {selectedCategory} Projects
            </span>
            <span className="text-[11px] text-white/40">({filteredProjects.length})</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-1 sm:flex-initial justify-end">
            {/* Search */}
            <div className="relative flex items-center flex-1 sm:flex-initial">
              <Search className="w-3.5 h-3.5 text-white/40 absolute left-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter projects & stack..."
                className="w-full sm:w-44 lg:w-48 bg-[#151518] border border-white/10 rounded-lg pl-8 pr-2.5 py-1 text-xs text-white placeholder:text-white/40 outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center p-0.5 rounded-lg bg-white/10 border border-white/10 shrink-0">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1 rounded ${viewMode === "grid" ? "bg-white/20 text-white" : "text-white/50 hover:text-white"}`}
                title="Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1 rounded ${viewMode === "list" ? "bg-white/20 text-white" : "text-white/50 hover:text-white"}`}
                title="List View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Projects View */}
        <div className="flex-1 overflow-y-auto p-4">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => {
                    sounds.playClick();
                    setActiveProject(project);
                  }}
                  className="group rounded-2xl bg-[#202026] border border-white/10 hover:border-white/25 hover:shadow-xl transition-all flex flex-col overflow-hidden cursor-pointer"
                >
                  {/* Card Header Gradient Banner */}
                  <div
                    className={`h-28 bg-gradient-to-r ${project.previewGradient} p-3.5 flex flex-col justify-between relative overflow-hidden`}
                  >
                    <div className="flex items-center justify-between z-10">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/20">
                        {project.category}
                      </span>
                      {project.stars && (
                        <div className="flex items-center gap-1 text-[10px] bg-black/40 backdrop-blur-md text-amber-300 px-2 py-0.5 rounded-full border border-white/10">
                          <Star className="w-2.5 h-2.5 fill-amber-300" />
                          <span>{project.stars}</span>
                        </div>
                      )}
                    </div>

                    <div className="z-10">
                      <h3 className="text-sm font-bold text-white group-hover:underline">
                        {project.title}
                      </h3>
                      <p className="text-[11px] text-white/80 line-clamp-1">
                        {project.tagline}
                      </p>
                    </div>

                    {/* Subtle aesthetic backdrop blur element */}
                    <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-white/10 blur-xl pointer-events-none" />
                  </div>

                  {/* Card Body */}
                  <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
                    <p className="text-[11px] text-white/70 line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>

                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.slice(0, 4).map((tech, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-white/60 border border-white/5"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 4 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-white/5 text-white/40">
                          +{project.technologies.length - 4}
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {project.liveUrl && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLaunchLive(project.liveUrl);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-[11px] font-semibold flex items-center gap-1 transition-colors"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Live Demo</span>
                          </button>
                        )}
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-medium flex items-center gap-1 transition-colors"
                        >
                          <GithubIcon className="w-3 h-3" />
                          <span>Code</span>
                        </a>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAskAi(project.title);
                        }}
                        className="px-2 py-1 rounded-lg bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-300 hover:text-white text-[10px] font-medium flex items-center gap-1 transition-colors"
                        title="Ask AI about this project"
                      >
                        <Bot className="w-3 h-3" />
                        <span>Ask AI</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="space-y-2">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => {
                    sounds.playClick();
                    setActiveProject(project);
                  }}
                  className="px-4 py-3 rounded-xl bg-[#202026] border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-lg bg-gradient-to-tr ${project.previewGradient} flex items-center justify-center text-white shrink-0`}
                    >
                      <Layers className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <span>{project.title}</span>
                        <span className="text-[10px] text-white/40 font-normal">· {project.category}</span>
                      </div>
                      <div className="text-[11px] text-white/60 truncate max-w-md">
                        {project.tagline}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {project.liveUrl && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLaunchLive(project.liveUrl);
                        }}
                        className="px-2.5 py-1 rounded-md bg-blue-500 hover:bg-blue-600 text-white text-[10px] font-semibold flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Live</span>
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAskAi(project.title);
                      }}
                      className="px-2 py-1 rounded-md bg-purple-500/20 text-purple-300 hover:text-white text-[10px] flex items-center gap-1"
                    >
                      <Bot className="w-3 h-3" />
                      <span>Ask AI</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Project Detail Modal */}
      {activeProject && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[10000] flex items-center justify-center p-4"
          onClick={() => setActiveProject(null)}
        >
          <div
            className="w-full max-w-xl bg-[#1e1e24] border border-white/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] text-white animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Banner */}
            <div
              className={`p-6 bg-gradient-to-r ${activeProject.previewGradient} flex items-start justify-between relative`}
            >
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-black/40 text-white border border-white/20">
                  {activeProject.category}
                </span>
                <h2 className="text-xl font-bold text-white mt-2">{activeProject.title}</h2>
                <p className="text-xs text-white/80 mt-0.5">{activeProject.tagline}</p>
              </div>

              <button
                onClick={() => setActiveProject(null)}
                className="w-7 h-7 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white/80 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              <div>
                <h4 className="text-[11px] font-bold uppercase text-white/50 mb-1">
                  Architecture & Overview
                </h4>
                <p className="text-white/80 leading-relaxed">{activeProject.description}</p>
              </div>

              <div>
                <h4 className="text-[11px] font-bold uppercase text-white/50 mb-1.5">
                  Key Technical Achievements
                </h4>
                <div className="space-y-1.5">
                  {activeProject.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2 text-white/80">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-[11px] font-bold uppercase text-white/50 mb-1.5">
                  Technologies Used
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {activeProject.technologies.map((tech, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white/80 font-mono text-[11px]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3 sm:p-4 border-t border-white/10 bg-[#16161a] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
              <div className="flex flex-wrap items-center gap-2">
                {activeProject.liveUrl && (
                  <button
                    onClick={() => {
                      handleLaunchLive(activeProject.liveUrl);
                      setActiveProject(null);
                    }}
                    className="flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Live Demo</span>
                  </button>
                )}
                <a
                  href={activeProject.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 sm:flex-initial px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                  <span>GitHub</span>
                </a>
              </div>

              <button
                onClick={() => {
                  handleAskAi(activeProject.title);
                  setActiveProject(null);
                }}
                className="w-full sm:w-auto px-3 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
              >
                <Bot className="w-3.5 h-3.5 text-purple-400" />
                <span>Ask AI About This</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
