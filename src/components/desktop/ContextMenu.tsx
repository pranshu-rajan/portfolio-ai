"use client";

import React, { useEffect } from "react";
import { AppId, WallpaperId } from "@/types";
import { Sparkles, FolderGit2, Terminal, Image, Info } from "lucide-react";
import { sounds } from "@/utils/sound";

interface ContextMenuProps {
  x: number;
  y: number;
  isOpen: boolean;
  onClose: () => void;
  onOpenApp: (id: AppId) => void;
  onNextWallpaper: () => void;
  currentWallpaper: WallpaperId;
}

export function ContextMenu({
  x,
  y,
  isOpen,
  onClose,
  onOpenApp,
  onNextWallpaper,
  currentWallpaper,
}: ContextMenuProps) {
  useEffect(() => {
    const handleClickOutside = () => {
      if (isOpen) onClose();
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Ensure menu doesn't overflow screen bounds
  const menuX = Math.min(x, typeof window !== "undefined" ? window.innerWidth - 220 : x);
  const menuY = Math.min(y, typeof window !== "undefined" ? window.innerHeight - 260 : y);

  const handleAction = (cb: () => void) => {
    sounds.playClick();
    cb();
    onClose();
  };

  return (
    <div
      style={{ left: `${menuX}px`, top: `${menuY}px` }}
      className="fixed z-[10001] w-54 rounded-xl bg-[#1e1e24]/95 backdrop-blur-2xl border border-white/20 shadow-2xl py-1.5 text-white/90 text-xs select-none animate-in fade-in zoom-in-95 duration-100"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={() => handleAction(() => onOpenApp("aichat"))}
        className="w-full text-left px-3.5 py-1.5 hover:bg-blue-600 hover:text-white rounded-md mx-1 transition-colors flex items-center gap-2"
      >
        <Sparkles className="w-3.5 h-3.5 text-purple-400" />
        <span>Talk to HireMe AI</span>
      </button>

      <button
        onClick={() => handleAction(() => onOpenApp("finder"))}
        className="w-full text-left px-3.5 py-1.5 hover:bg-blue-600 hover:text-white rounded-md mx-1 transition-colors flex items-center gap-2"
      >
        <FolderGit2 className="w-3.5 h-3.5 text-blue-400" />
        <span>Browse Projects</span>
      </button>

      <button
        onClick={() => handleAction(() => onOpenApp("terminal"))}
        className="w-full text-left px-3.5 py-1.5 hover:bg-blue-600 hover:text-white rounded-md mx-1 transition-colors flex items-center gap-2"
      >
        <Terminal className="w-3.5 h-3.5 text-emerald-400" />
        <span>New Terminal Window</span>
      </button>

      <div className="h-px bg-white/10 my-1 mx-2" />

      <button
        onClick={() => handleAction(onNextWallpaper)}
        className="w-full text-left px-3.5 py-1.5 hover:bg-blue-600 hover:text-white rounded-md mx-1 transition-colors flex items-center justify-between"
      >
        <span className="flex items-center gap-2">
          <Image className="w-3.5 h-3.5 text-amber-400" />
          <span>Next Wallpaper</span>
        </span>
        <span className="text-[10px] text-white/40 capitalize">{currentWallpaper}</span>
      </button>

      <button
        onClick={() => handleAction(() => onOpenApp("settings"))}
        className="w-full text-left px-3.5 py-1.5 hover:bg-blue-600 hover:text-white rounded-md mx-1 transition-colors flex items-center gap-2"
      >
        <Info className="w-3.5 h-3.5 text-sky-400" />
        <span>System Preferences...</span>
      </button>
    </div>
  );
}
