"use client";

import React, { useState, useEffect, useSyncExternalStore } from "react";
import Image from "next/image";
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
import { ContactsApp } from "@/components/apps/ContactsApp";
import { PhotosApp } from "@/components/apps/PhotosApp";

import { WallpaperId } from "@/types";
import { sounds } from "@/utils/sound";

const emptySubscribe = () => () => {};
const subscribeResize = (callback: () => void) => {
  window.addEventListener("resize", callback);
  return () => window.removeEventListener("resize", callback);
};

export default function Desktop() {
  const isMounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const isMobile = useSyncExternalStore(
    subscribeResize,
    () => window.innerWidth < 768 || (window.innerWidth < 1024 && window.innerHeight < 550),
    () => false
  );

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
  const [safariUrl, setSafariUrl] = useState<string>("https://irrigation-fuzzy-system.vercel.app/");

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
          <span>Booting Pranshu&apos;s Portfolio...</span>
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
      className="relative w-screen h-screen overflow-hidden select-none"
    >
      {/* Authentic macOS Silk Wave Wallpaper */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <Image
          src="/images/wallpaper.png"
          alt="macOS Desktop Wallpaper"
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* Top Menu Bar */}
      <MenuBar
        activeApp={activeApp}
        onOpenApp={openWindow}
        onToggleSpotlight={() => setSpotlightOpen((prev) => !prev)}
        wallpaper={wallpaper}
        onSelectWallpaper={setWallpaper}
      />

      {/* Center Welcome Hero (as in saurabh-kushwaha.vercel.app with Pranshu) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none z-10 px-4 pb-12">
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="font-aubrey text-base sm:text-2xl md:text-3xl text-white tracking-wide whitespace-nowrap drop-shadow-md m-0">
            {"Hey, I'm Pranshu! welcome to my".split("").map((char, i) => (
              <span
                key={i}
                className="hover-letter pointer-events-auto cursor-default font-normal text-white/95"
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </h1>
          <h1 className="font-lacquer text-4xl sm:text-5xl md:text-6xl text-white tracking-normal whitespace-nowrap -mt-2 sm:-mt-3.5 drop-shadow-xl m-0">
            {"portfolio".split("").map((char, i) => (
              <span
                key={i}
                className="hover-letter pointer-events-auto cursor-default text-white"
              >
                {char}
              </span>
            ))}
          </h1>
        </div>
      </div>

      {/* Desktop Area: 2-Column Grid (Folders in Col 1, Resume.pdf in Col 2) */}
      <div className="absolute top-10 left-5 z-20 hidden lg:flex flex-row gap-3 pointer-events-auto">
        {/* Column 1: Best 4 Project Folders */}
        <div className="flex flex-col gap-2 w-[100px] items-center">
          <DesktopIcon
            id="finder"
            title="UPI Offline Mesh"
            icon={
              <div className="relative w-14 h-14 drop-shadow-lg">
                <Image
                  src="/images/folder.png"
                  alt="UPI Offline Mesh"
                  fill
                  className="object-contain"
                  sizes="64px"
                />
              </div>
            }
            onOpen={() => openWindow("finder")}
          />

          <DesktopIcon
            id="finder"
            title="PacketLens AI"
            icon={
              <div className="relative w-14 h-14 drop-shadow-lg">
                <Image
                  src="/images/folder.png"
                  alt="PacketLens AI DPI"
                  fill
                  className="object-contain"
                  sizes="64px"
                />
              </div>
            }
            onOpen={() => openWindow("finder")}
          />

          <DesktopIcon
            id="finder"
            title="Pranshu's AI"
            icon={
              <div className="relative w-14 h-14 drop-shadow-lg">
                <Image
                  src="/images/folder.png"
                  alt="Pranshu's AI Vector DB"
                  fill
                  className="object-contain"
                  sizes="64px"
                />
              </div>
            }
            onOpen={() => openWindow("finder")}
          />

          <DesktopIcon
            id="finder"
            title="Leaf Disease Detection"
            icon={
              <div className="relative w-14 h-14 drop-shadow-lg">
                <Image
                  src="/images/folder.png"
                  alt="Agricultural Leaf Disease Detection"
                  fill
                  className="object-contain"
                  sizes="64px"
                />
              </div>
            }
            onOpen={() => openWindow("finder")}
          />
        </div>

        {/* Column 2: Documents */}
        <div className="flex flex-col gap-2 w-[100px] items-center">
          <DesktopIcon
            id="resume"
            title="Resume.pdf"
            icon={
              <div className="relative w-14 h-14 drop-shadow-lg">
                <Image
                  src="/images/pdf.png"
                  alt="Resume PDF"
                  fill
                  className="object-contain"
                  sizes="64px"
                />
              </div>
            }
            onOpen={() => openWindow("resume")}
          />
        </div>
      </div>

      {/* Windows Manager Layer */}
      {/* 1. HireMe AI Chat App ("Ask Me") */}
      {windows.aichat && (
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
      )}

      {/* 2. Projects Finder App */}
      {windows.finder && (
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
              if (url) setSafariUrl(url);
              openWindow("safari");
            }}
            onAskAiAboutProject={() => {
              openWindow("aichat");
            }}
          />
        </WindowFrame>
      )}

      {/* 3. Safari Browser App */}
      {windows.safari && (
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
          <SafariApp initialUrl={safariUrl} />
        </WindowFrame>
      )}

      {/* 4. Terminal App */}
      {windows.terminal && (
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
      )}

      {/* 5. Resume Preview App */}
      {windows.resume && (
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
      )}

      {/* 6. Contacts App (Replaces standalone mail & settings in dock) */}
      {windows.contacts && (
        <WindowFrame
          window={windows.contacts}
          isActive={activeApp === "contacts"}
          onFocus={() => bringToFront("contacts")}
          onClose={() => closeWindow("contacts")}
          onMinimize={() => minimizeWindow("contacts")}
          onMaximize={() => toggleMaximize("contacts")}
          onUpdatePosition={(pos) => updatePosition("contacts", pos)}
          onUpdateSize={(size) => updateSize("contacts", size)}
        >
          <ContactsApp onOpenApp={openWindow} />
        </WindowFrame>
      )}

      {/* 7. Mail App (also available if opened directly) */}
      {windows.mail && (
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
      )}

      {/* 8. System Settings App */}
      {windows.settings && (
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
      )}

      {/* 9. Photos App (Certifications & Credentials) */}
      {windows.photos && (
        <WindowFrame
          window={windows.photos}
          isActive={activeApp === "photos"}
          onFocus={() => bringToFront("photos")}
          onClose={() => closeWindow("photos")}
          onMinimize={() => minimizeWindow("photos")}
          onMaximize={() => toggleMaximize("photos")}
          onUpdatePosition={(pos) => updatePosition("photos", pos)}
          onUpdateSize={(size) => updateSize("photos", size)}
        >
          <PhotosApp />
        </WindowFrame>
      )}

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
        onAskAi={() => {
          openWindow("aichat");
        }}
        onSelectProject={() => {
          openWindow("finder");
        }}
      />

      {/* Floating macOS Dock */}
      <Dock windows={windows} onOpenApp={openWindow} />
    </div>
  );
}
