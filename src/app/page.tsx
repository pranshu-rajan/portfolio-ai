"use client";

import React, { useState, useEffect } from "react";
import { useWindowManager } from "@/hooks/useWindowManager";
import { MenuBar } from "@/components/desktop/MenuBar";
import { Dock } from "@/components/desktop/Dock";
import { DesktopIcon } from "@/components/desktop/DesktopIcon";
import { WindowFrame } from "@/components/desktop/WindowFrame";
import { Spotlight } from "@/components/desktop/Spotlight";
import { ContextMenu } from "@/components/desktop/ContextMenu";
import { MobileView } from "@/components/mobile/MobileView";

// App Components
import { AiChatApp } from "@/components/apps/AiChatApp";
import { ProjectsApp } from "@/components/apps/ProjectsApp";
import { SafariApp } from "@/components/apps/SafariApp";
import { TerminalApp } from "@/components/apps/TerminalApp";
import { ResumeApp } from "@/components/apps/ResumeApp";
import { MailApp } from "@/components/apps/MailApp";
import { SettingsApp } from "@/components/apps/SettingsApp";

import { AppId, WallpaperId, Project } from "@/types";
import { sounds } from "@/utils/sound";
import { 
  FolderGit2, 
  Bot, 
  FileText, 
  Terminal as TerminalIcon, 
  Compass, 
  Mail as MailIcon,
  Sparkles 
} from "lucide-react";

export default function Desktop() {
  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [wallpaper, setWallpaper] = useState<WallpaperId>("sequoia");
  const [spotlightOpen, setSpotlightOpen] = useState(false);

  // Right-click Context Menu State
  const [contextMenu, setContextMenu] = useState<{
    isOpen: boolean;
    x: number;
    y: number;
  }>({
    isOpen: false,
    x: 0,
    y: 0,
  });

  const {
    windows,
    activeApp,
    openWindow,
    closeWindow,
    minimizeWindow,
    toggleMaximize,
    bringToFront,
    updatePosition,
    updateSize,
  } = useWindowManager();

  // Responsive Screen Check
  useEffect(() => {
    setIsMounted(true);
    const checkViewport = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkViewport();
    window.addEventListener("resize", checkViewport);
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  // Global Keyboard Shortcuts (Cmd+K / Ctrl+K for Spotlight)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSpotlightOpen((prev) => !prev);
        sounds.playClick();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Context Menu on Wallpaper Right Click
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({
      isOpen: true,
      x: e.clientX,
      y: e.clientY,
    });
    sounds.playClick();
  };

  const handleCycleWallpaper = () => {
    const wallpapers: WallpaperId[] = ["sequoia", "sonoma", "ventura", "aurora", "midnight"];
    const currentIdx = wallpapers.indexOf(wallpaper);
    const nextWp = wallpapers[(currentIdx + 1) % wallpapers.length];
    setWallpaper(nextWp);
  };

  if (!isMounted) {
    return (
      <div className="w-screen h-screen bg-[#0d0d11] flex items-center justify-center text-white text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
          <span>Booting macOS Portfolio...</span>
        </div>
      </div>
    );
  }

  // Mobile View
  if (isMobile) {
    return <MobileView />;
  }

  return (
    <div
      onContextMenu={handleContextMenu}
      onClick={() => {
        if (contextMenu.isOpen) {
          setContextMenu((prev) => ({ ...prev, isOpen: false }));
        }
      }}
      className={`relative w-screen h-screen overflow-hidden select-none wallpaper-${wallpaper} transition-all duration-700`}
    >
      {/* Top Menu Bar */}
      <MenuBar
        activeApp={activeApp}
        onOpenApp={openWindow}
        onToggleSpotlight={() => setSpotlightOpen((prev) => !prev)}
        wallpaper={wallpaper}
        onSelectWallpaper={setWallpaper}
      />

      {/* Desktop Icons Grid (Left Side) */}
      <div className="absolute top-12 left-5 z-20 flex flex-col gap-4">
        <DesktopIcon
          id="finder"
          title="Projects"
          icon={
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg border border-white/20">
              <FolderGit2 className="w-6 h-6 text-blue-100" />
            </div>
          }
          onOpen={() => openWindow("finder")}
        />

        <DesktopIcon
          id="aichat"
          title="HireMe AI"
          icon={
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-violet-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg border border-white/20 relative">
              <Bot className="w-6 h-6 text-white" />
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-black" />
            </div>
          }
          onOpen={() => openWindow("aichat")}
        />

        <DesktopIcon
          id="resume"
          title="Resume.pdf"
          icon={
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg border border-white/20">
              <FileText className="w-6 h-6 text-white" />
            </div>
          }
          onOpen={() => openWindow("resume")}
        />

        <DesktopIcon
          id="terminal"
          title="Terminal"
          icon={
            <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center text-emerald-400 shadow-lg">
              <TerminalIcon className="w-6 h-6" />
            </div>
          }
          onOpen={() => openWindow("terminal")}
        />

        <DesktopIcon
          id="safari"
          title="Live Demos"
          icon={
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-sky-400 to-blue-600 flex items-center justify-center text-white shadow-lg border border-white/20">
              <Compass className="w-6 h-6" />
            </div>
          }
          onOpen={() => openWindow("safari")}
        />
      </div>

      {/* Windows Manager Layer */}
      {/* 1. HireMe AI Chat App */}
      <WindowFrame
        window={windows.aichat}
        isActive={activeApp === "aichat"}
        onFocus={() => bringToFront("aichat")}
        onClose={() => closeWindow("aichat")}
        onMinimize={() => minimizeWindow("aichat")}
        onMaximize={() => toggleMaximize("aichat")}
        onUpdatePosition={(pos) => updatePosition("aichat", pos)}
        onUpdateSize={(size) => updateSize("aichat", size)}
      >
        <AiChatApp />
      </WindowFrame>

      {/* 2. Projects Finder App */}
      <WindowFrame
        window={windows.finder}
        isActive={activeApp === "finder"}
        onFocus={() => bringToFront("finder")}
        onClose={() => closeWindow("finder")}
        onMinimize={() => minimizeWindow("finder")}
        onMaximize={() => toggleMaximize("finder")}
        onUpdatePosition={(pos) => updatePosition("finder", pos)}
        onUpdateSize={(size) => updateSize("finder", size)}
      >
        <ProjectsApp
          onOpenApp={openWindow}
          onPreviewInSafari={(url) => {
            openWindow("safari");
          }}
          onAskAiAboutProject={(projName) => {
            openWindow("aichat");
          }}
        />
      </WindowFrame>

      {/* 3. Safari Browser App */}
      <WindowFrame
        window={windows.safari}
        isActive={activeApp === "safari"}
        onFocus={() => bringToFront("safari")}
        onClose={() => closeWindow("safari")}
        onMinimize={() => minimizeWindow("safari")}
        onMaximize={() => toggleMaximize("safari")}
        onUpdatePosition={(pos) => updatePosition("safari", pos)}
        onUpdateSize={(size) => updateSize("safari", size)}
      >
        <SafariApp />
      </WindowFrame>

      {/* 4. Terminal App */}
      <WindowFrame
        window={windows.terminal}
        isActive={activeApp === "terminal"}
        onFocus={() => bringToFront("terminal")}
        onClose={() => closeWindow("terminal")}
        onMinimize={() => minimizeWindow("terminal")}
        onMaximize={() => toggleMaximize("terminal")}
        onUpdatePosition={(pos) => updatePosition("terminal", pos)}
        onUpdateSize={(size) => updateSize("terminal", size)}
      >
        <TerminalApp onOpenApp={openWindow} />
      </WindowFrame>

      {/* 5. Resume Preview App */}
      <WindowFrame
        window={windows.resume}
        isActive={activeApp === "resume"}
        onFocus={() => bringToFront("resume")}
        onClose={() => closeWindow("resume")}
        onMinimize={() => minimizeWindow("resume")}
        onMaximize={() => toggleMaximize("resume")}
        onUpdatePosition={(pos) => updatePosition("resume", pos)}
        onUpdateSize={(size) => updateSize("resume", size)}
      >
        <ResumeApp />
      </WindowFrame>

      {/* 6. Mail App */}
      <WindowFrame
        window={windows.mail}
        isActive={activeApp === "mail"}
        onFocus={() => bringToFront("mail")}
        onClose={() => closeWindow("mail")}
        onMinimize={() => minimizeWindow("mail")}
        onMaximize={() => toggleMaximize("mail")}
        onUpdatePosition={(pos) => updatePosition("mail", pos)}
        onUpdateSize={(size) => updateSize("mail", size)}
      >
        <MailApp />
      </WindowFrame>

      {/* 7. System Settings App */}
      <WindowFrame
        window={windows.settings}
        isActive={activeApp === "settings"}
        onFocus={() => bringToFront("settings")}
        onClose={() => closeWindow("settings")}
        onMinimize={() => minimizeWindow("settings")}
        onMaximize={() => toggleMaximize("settings")}
        onUpdatePosition={(pos) => updatePosition("settings", pos)}
        onUpdateSize={(size) => updateSize("settings", size)}
      >
        <SettingsApp
          currentWallpaper={wallpaper}
          onSelectWallpaper={setWallpaper}
        />
      </WindowFrame>

      {/* Right-click Context Menu */}
      <ContextMenu
        x={contextMenu.x}
        y={contextMenu.y}
        isOpen={contextMenu.isOpen}
        onClose={() => setContextMenu((prev) => ({ ...prev, isOpen: false }))}
        onOpenApp={openWindow}
        onNextWallpaper={handleCycleWallpaper}
        currentWallpaper={wallpaper}
      />

      {/* Spotlight Search Overlay */}
      <Spotlight
        isOpen={spotlightOpen}
        onClose={() => setSpotlightOpen(false)}
        onOpenApp={openWindow}
        onAskAi={(question) => {
          openWindow("aichat");
        }}
        onSelectProject={(proj) => {
          openWindow("finder");
        }}
      />

      {/* Floating macOS Dock */}
      <Dock windows={windows} onOpenApp={openWindow} />
    </div>
  );
}
