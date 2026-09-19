"use client";

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
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
    minSize: { width: 320, height: 300 },
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
    minSize: { width: 340, height: 320 },
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
    minSize: { width: 340, height: 320 },
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
    minSize: { width: 320, height: 260 },
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
    minSize: { width: 340, height: 320 },
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
    minSize: { width: 320, height: 300 },
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
    minSize: { width: 320, height: 300 },
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
    minSize: { width: 340, height: 320 },
  },
  photos: {
    id: "photos",
    title: "Photos · Certifications & Credentials",
    icon: "Image",
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    size: { width: 800, height: 520 },
    defaultSize: { width: 800, height: 520 },
    minSize: { width: 340, height: 320 },
  },
};

export function useWindowManager() {
  const [windows, setWindows] = useState<Record<AppId, WindowState>>(() => {
    const initial: Record<string, WindowState> = {};
    let initialZ = 10;

    Object.entries(DEFAULT_WINDOWS).forEach(([key, config], idx) => {
      const id = key as AppId;
      const x = 50 + idx * 24;
      const y = 45 + idx * 20;
      initial[id] = {
        ...config,
        zIndex: id === "aichat" ? 25 : initialZ++,
        position: { x, y },
      };
    });

    return initial as Record<AppId, WindowState>;
  });

  const topZRef = useRef(30);

  // Center window on screen safely within viewport bounds
  const centerPosition = useCallback((width: number, height: number) => {
    if (typeof window === "undefined") return { x: 80, y: 50 };
    const screenW = window.innerWidth;
    const screenH = window.innerHeight;
    const targetW = Math.min(width, Math.max(300, screenW - 32));
    const targetH = Math.min(height, Math.max(260, screenH - 110));
    const x = Math.max(12, Math.floor((screenW - targetW) / 2));
    const y = Math.max(34, Math.floor((screenH - targetH - 75) / 2));
    return { x, y };
  }, []);

  // Compute adaptive window size that fits screen comfortably
  const getFittedSize = useCallback((defaultSize: { width: number; height: number }, minSize: { width: number; height: number }) => {
    if (typeof window === "undefined") return defaultSize;
    const screenW = window.innerWidth;
    const screenH = window.innerHeight;
    const maxAllowedW = Math.max(minSize.width, screenW - 32);
    const maxAllowedH = Math.max(minSize.height, screenH - 115);
    return {
      width: Math.min(defaultSize.width, maxAllowedW),
      height: Math.min(defaultSize.height, maxAllowedH),
    };
  }, []);

  // Adapt open windows to real screen size on client mount and window resize
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      const screenW = window.innerWidth;
      const screenH = window.innerHeight;

      setWindows((prev) => {
        const updated = { ...prev };
        let hasChanges = false;

        Object.keys(updated).forEach((key) => {
          const id = key as AppId;
          const win = updated[id];
          if (!win) return;

          // Clamp size so it doesn't exceed screen
          const maxAllowedW = Math.max(win.minSize.width, screenW - 24);
          const maxAllowedH = Math.max(win.minSize.height, screenH - 90);
          const newW = Math.min(win.size.width, maxAllowedW);
          const newH = Math.min(win.size.height, maxAllowedH);

          // Clamp position so titlebar and window stay visible
          const maxX = Math.max(12, screenW - newW - 12);
          const maxY = Math.max(32, screenH - newH - 75);
          const newX = Math.max(12, Math.min(win.position.x, maxX));
          const newY = Math.max(32, Math.min(win.position.y, maxY));

          if (
            newW !== win.size.width ||
            newH !== win.size.height ||
            newX !== win.position.x ||
            newY !== win.position.y
          ) {
            hasChanges = true;
            updated[id] = {
              ...win,
              size: { width: newW, height: newH },
              position: { x: newX, y: newY },
            };
          }
        });

        return hasChanges ? updated : prev;
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const bringToFront = useCallback((id: AppId) => {
    topZRef.current += 1;
    const nextZ = topZRef.current;
    setWindows((prevWindows) => ({
      ...prevWindows,
      [id]: {
        ...prevWindows[id],
        zIndex: nextZ,
        isMinimized: false,
      },
    }));
  }, []);

  const openWindow = useCallback(
    (id: AppId) => {
      sounds.playWindowOpen();
      topZRef.current += 1;
      const nextZ = topZRef.current;
      setWindows((prevWindows) => {
        const current = prevWindows[id];
        const fittedSize = getFittedSize(current.defaultSize, current.minSize);
        const screenW = typeof window !== "undefined" ? window.innerWidth : 1024;
        const screenH = typeof window !== "undefined" ? window.innerHeight : 768;

        // Check if existing position is within reasonable bounds
        const isOutOfBounds =
          !current.position ||
          current.position.x + 80 > screenW ||
          current.position.y + 60 > screenH ||
          current.position.x < 0;

        const newPos = isOutOfBounds
          ? centerPosition(fittedSize.width, fittedSize.height)
          : {
              x: Math.max(12, Math.min(current.position.x, screenW - fittedSize.width - 12)),
              y: Math.max(34, Math.min(current.position.y, screenH - fittedSize.height - 75)),
            };

        return {
          ...prevWindows,
          [id]: {
            ...current,
            isOpen: true,
            isMinimized: false,
            zIndex: nextZ,
            size: current.isOpen ? current.size : fittedSize,
            position: newPos,
          },
        };
      });
    },
    [centerPosition, getFittedSize]
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

  const updatePosition = useCallback((id: AppId, position: { x: number; y: number }) => {
    setWindows((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        position,
      },
    }));
  }, []);

  const updateSize = useCallback((id: AppId, size: { width: number; height: number }) => {
    setWindows((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        size,
      },
    }));
  }, []);

  // Compute active app directly from highest zIndex among open, non-minimized windows
  const activeApp = useMemo<AppId>(() => {
    let highestZ = -1;
    let highestApp: AppId = "aichat";

    Object.values(windows).forEach((w) => {
      if (w.isOpen && !w.isMinimized && w.zIndex > highestZ) {
        highestZ = w.zIndex;
        highestApp = w.id;
      }
    });

    return highestApp;
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
