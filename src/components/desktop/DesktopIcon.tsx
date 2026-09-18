"use client";

import React, { useState } from "react";
import { AppId } from "@/types";
import { sounds } from "@/utils/sound";

interface DesktopIconProps {
  id: AppId;
  title: string;
  icon: React.ReactNode;
  onOpen: () => void;
}

export function DesktopIcon({ title, icon, onOpen }: DesktopIconProps) {
  const [isSelected, setIsSelected] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSelected(true);
    sounds.playClick();
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpen();
  };

  return (
    <div
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      className={`group flex flex-col items-center justify-center w-22 p-2 rounded-xl cursor-pointer select-none transition-all ${
        isSelected
          ? "bg-white/20 border border-white/30 backdrop-blur-sm shadow-md"
          : "hover:bg-white/10 border border-transparent"
      }`}
    >
      <div className="w-13 h-13 flex items-center justify-center drop-shadow-md group-hover:scale-105 transition-transform">
        {icon}
      </div>
      <span
        className={`mt-1.5 text-[11px] font-medium text-center leading-tight tracking-wide px-1.5 py-0.5 rounded ${
          isSelected
            ? "bg-blue-600 text-white font-semibold"
            : "text-white text-shadow drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
        }`}
      >
        {title}
      </span>
    </div>
  );
}
