"use client";

import { useState, useCallback, useEffect } from "react";
import { AppId, WindowState } from "@/types";
import { sounds } from "@/utils/sound";

const DEFAULT_WINDOWS: Record<AppId, Omit<WindowState, "zIndex" | "position">> = {
  aichat: {
    id: "aichat",
    title: "HireMe AI · Candidate Assistant",
    icon: "Bot",
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    size: { width: 480, height: 480 },
    defaultSize: { width: 480, height: 480 },
    minSize: { width: 340, height: 320 },
  },
  finder: {
    id: "finder",
    title: "Projects Finder",
    icon: "FolderGit2",
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    size: { width: 820, height: 520 },
    defaultSize: { width: 820, height: 520 },
    minSize: { width: 520, height: 380 },
  },
  safari: {
    id: "safari",
    title: "Safari · Live Project Previews",
    icon: "Compass",
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    size: { width: 840, height: 530 },
    defaultSize: { width: 840, height: 530 },
    minSize: { width: 560, height: 380 },
  },
  terminal: {
    id: "terminal",
    title: "Terminal · zsh",
    icon: "Terminal",
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    size: { width: 660, height: 420 },
    defaultSize: { width: 660, height: 420 },
    minSize: { width: 440, height: 300 },
  },
  resume: {
    id: "resume",
    title: "Preview · Pranshu_Rajan_Resume.pdf",
    icon: "FileText",
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    size: { width: 780, height: 580 },
    defaultSize: { width: 780, height: 580 },
    minSize: { width: 480, height: 400 },
  },
  mail: {
    id: "mail",
    title: "Mail · Recruiter Outreach",
    icon: "Mail",
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    size: { width: 620, height: 470 },
    defaultSize: { width: 620, height: 470 },
    minSize: { width: 420, height: 360 },
  },
  settings: {
    id: "settings",
    title: "System Settings",
    icon: "Settings",
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    size: { width: 600, height: 460 },
    defaultSize: { width: 600, height: 460 },
    minSize: { width: 440, height: 340 },
  },
  contacts: {
    id: "contacts",
    title: "Contacts · Pranshu Rajan",
    icon: "Users",
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    size: { width: 720, height: 500 },
    defaultSize: { width: 720, height: 500 },
    minSize: { width: 480, height: 360 },
  },
  photos: {
    id: "photos",
    title: "Photos · Project Showcase",
    icon: "Image",
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    size: { width: 800, height: 520 },
    defaultSize: { width: 800, height: 520 },
    minSize: { width: 500, height: 380 },
  },
};

export function useWindowManager() {
  const [windows, setWindows] = useState<Record<AppId, WindowState>>(() => {
    const initial: Record<string, WindowState> = {};
    let initialZ = 10;

    Object.entries(DEFAULT_WINDOWS).forEach(([key, config], idx) => {
      const id = key as AppId;
      const x = 70 + idx * 32;
      const y = 50 + idx * 24;
      initial[id] = {
        ...config,
        zIndex: id === "aichat" ? 25 : initialZ++,
        position: { x, y },
      };
    });

    return initial as Record<AppId, WindowState>;
  });

  const [topZ, setTopZ] = useState(30);
  const [activeApp, setActiveApp] = useState<AppId>("aichat");

  // Center window on screen safely within viewport
  const centerPosition = useCallback((width: number, height: number) => {
    if (typeof window === "undefined") return { x: 100, y: 50 };
    const screenW = window.innerWidth;
    const screenH = window.innerHeight;
    const targetW = Math.min(width, Math.max(340, screenW - 32));
    const targetH = Math.min(height, Math.max(350, screenH - 110));
    const x = Math.max(16, Math.floor((screenW - targetW) / 2));
    const y = Math.max(36, Math.floor((screenH - targetH - 75) / 2));
    return { x, y };
  }, []);

  // Adapt initially opened windows to real screen size on client mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const screenW = window.innerWidth;
    const screenH = window.innerHeight;

    setWindows((prev) => {
      const updated = { ...prev };
      const chat = updated.aichat;
      if (chat) {
        const fitW = Math.min(chat.defaultSize.width, screenW - 32);
        const fitH = Math.min(chat.defaultSize.height, screenH - 120);
        const pos = {
          x: Math.max(16, Math.floor((screenW - fitW) / 2)),
          y: Math.max(36, Math.floor((screenH - fitH - 75) / 2)),
        };
        updated.aichat = {
          ...chat,
          size: { width: fitW, height: fitH },
          position: pos,
        };
      }
      return updated;
    });
  }, []);

  const bringToFront = useCallback((id: AppId) => {
    setTopZ((prev) => {
      const nextZ = prev + 1;
      setWindows((prevWindows) => ({
        ...prevWindows,
        [id]: {
          ...prevWindows[id],
          zIndex: nextZ,
          isMinimized: false,
        },
      }));
      setActiveApp(id);
      return nextZ;
    });
  }, []);

  const openWindow = useCallback(
    (id: AppId) => {
      sounds.playWindowOpen();
      setTopZ((prev) => {
        const nextZ = prev + 1;
        setWindows((prevWindows) => {
          const current = prevWindows[id];
          const newPos = current.position || centerPosition(current.size.width, current.size.height);
          return {
            ...prevWindows,
            [id]: {
              ...current,
              isOpen: true,
              isMinimized: false,
              zIndex: nextZ,
              position: newPos,
            },
          };
        });
        setActiveApp(id);
        return nextZ;
      });
    },
    [centerPosition]
  );

  const closeWindow = useCallback((id: AppId) => {
    sounds.playWindowClose();
    setWindows((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        isOpen: false,
        isMinimized: false,
        isMaximized: false,
      },
    }));
  }, []);

  const minimizeWindow = useCallback((id: AppId) => {
    sounds.playClick();
    setWindows((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        isMinimized: true,
      },
    }));
  }, []);

  const toggleMaximize = useCallback((id: AppId) => {
    sounds.playClick();
    setWindows((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        isMaximized: !prev[id].isMaximized,
      },
    }));
  }, []);

  const updatePosition = useCallback((id: AppId, pos: { x: number; y: number }) => {
    setWindows((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        position: {
          x: Math.max(0, pos.x),
          y: Math.max(30, pos.y), // keep below menu bar
        },
      },
    }));
  }, []);

  const updateSize = useCallback((id: AppId, size: { width: number; height: number }) => {
    setWindows((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        size: {
          width: Math.max(prev[id].minSize.width, size.width),
          height: Math.max(prev[id].minSize.height, size.height),
        },
      },
    }));
  }, []);

  // Update active app on focus
  useEffect(() => {
    let highestZ = -1;
    let highestApp: AppId = "aichat";

    Object.values(windows).forEach((w) => {
      if (w.isOpen && !w.isMinimized && w.zIndex > highestZ) {
        highestZ = w.zIndex;
        highestApp = w.id;
      }
    });

    if (highestZ > -1) {
      setActiveApp(highestApp);
    }
  }, [windows]);

  return {
    windows,
    activeApp,
    openWindow,
    closeWindow,
    minimizeWindow,
    toggleMaximize,
    bringToFront,
    updatePosition,
    updateSize,
  };
}
