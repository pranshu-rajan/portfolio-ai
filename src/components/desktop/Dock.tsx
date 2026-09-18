"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion";
import { AppId, WindowState } from "@/types";
import { sounds } from "@/utils/sound";
import { 
  FolderGit2, 
  Compass, 
  Bot, 
  Terminal, 
  FileText, 
  Mail, 
  Settings, 
  Trash2,
  Sparkles
} from "lucide-react";

interface DockProps {
  windows: Record<AppId, WindowState>;
  onOpenApp: (id: AppId) => void;
}

interface DockItemConfig {
  id: AppId | "trash";
  title: string;
  icon: React.ReactNode;
  bgGradient: string;
  badge?: string;
}

const DOCK_ITEMS: DockItemConfig[] = [
  {
    id: "finder",
    title: "Finder (Projects)",
    icon: <FolderGit2 className="w-full h-full text-blue-100" />,
    bgGradient: "from-blue-500 to-indigo-600",
  },
  {
    id: "safari",
    title: "Safari (Live Demos)",
    icon: <Compass className="w-full h-full text-sky-100" />,
    bgGradient: "from-sky-400 to-blue-600",
  },
  {
    id: "aichat",
    title: "HireMe AI (Ask Me)",
    icon: <Bot className="w-full h-full text-white" />,
    bgGradient: "from-violet-600 via-purple-600 to-pink-500",
    badge: "AI",
  },
  {
    id: "terminal",
    title: "Terminal",
    icon: <Terminal className="w-full h-full text-emerald-300" />,
    bgGradient: "from-zinc-900 to-black border border-zinc-700",
  },
  {
    id: "resume",
    title: "Resume (Preview)",
    icon: <FileText className="w-full h-full text-amber-100" />,
    bgGradient: "from-amber-500 to-orange-600",
  },
  {
    id: "mail",
    title: "Mail (Contact)",
    icon: <Mail className="w-full h-full text-sky-100" />,
    bgGradient: "from-blue-600 to-cyan-600",
  },
  {
    id: "settings",
    title: "System Settings",
    icon: <Settings className="w-full h-full text-zinc-100" />,
    bgGradient: "from-zinc-600 to-zinc-800",
  },
  {
    id: "trash",
    title: "Trash",
    icon: <Trash2 className="w-full h-full text-zinc-300" />,
    bgGradient: "from-zinc-700 to-zinc-900",
  },
];

function DockIcon({
  item,
  mouseX,
  isOpen,
  onClick,
}: {
  item: DockItemConfig;
  mouseX: MotionValue<number>;
  isOpen: boolean;
  onClick: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [bouncing, setBouncing] = useState(false);

  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-150, 0, 150], [48, 74, 48]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 180, damping: 14 });

  const handleClick = () => {
    sounds.playClick();
    setBouncing(true);
    setTimeout(() => setBouncing(false), 900);
    onClick();
  };

  return (
    <div className="relative group flex flex-col items-center">
      {/* Tooltip */}
      <div className="absolute -top-10 scale-0 group-hover:scale-100 transition-all duration-150 ease-out z-50 pointer-events-none">
        <div className="px-2.5 py-1 rounded-md bg-zinc-900/90 text-white text-[11px] font-medium shadow-lg backdrop-blur-md border border-white/10 whitespace-nowrap">
          {item.title}
        </div>
      </div>

      <motion.div
        ref={ref}
        style={{ width, height: width }}
        animate={
          bouncing
            ? {
                y: [0, -26, 0, -14, 0],
                transition: { duration: 0.8, ease: "easeOut" },
              }
            : { y: 0 }
        }
        onClick={handleClick}
        className={`relative rounded-2xl shadow-lg cursor-pointer flex items-center justify-center p-2.5 transition-shadow select-none ${
          item.id === "aichat" ? "ring-2 ring-purple-400/60 ring-offset-2 ring-offset-black/50" : ""
        }`}
      >
        <div
          className={`w-full h-full rounded-[14px] bg-gradient-to-br ${item.bgGradient} flex items-center justify-center p-2 shadow-inner border border-white/20`}
        >
          {item.icon}
        </div>

        {/* Special AI badge */}
        {item.badge && (
          <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white text-[9px] font-extrabold shadow-sm flex items-center gap-0.5 animate-pulse">
            <Sparkles className="w-2 h-2" />
            {item.badge}
          </span>
        )}
      </motion.div>

      {/* Running App Indicator Dot */}
      <div className="h-1.5 mt-1 flex items-center justify-center">
        {isOpen && (
          <span className="w-1 h-1 rounded-full bg-white/90 shadow-[0_0_6px_rgba(255,255,255,0.9)]" />
        )}
      </div>
    </div>
  );
}

export function Dock({ windows, onOpenApp }: DockProps) {
  const mouseX = useMotionValue<number>(Infinity);
  const [trashOpen, setTrashOpen] = useState(false);

  const handleAppClick = (id: AppId | "trash") => {
    if (id === "trash") {
      setTrashOpen(true);
      sounds.playClick();
      return;
    }
    onOpenApp(id);
  };

  return (
    <>
      <nav 
        aria-label="macOS Dock"
        className="fixed bottom-3 left-1/2 -translate-x-1/2 z-[9990] flex items-end"
      >
        <motion.div
          onMouseMove={(e) => mouseX.set(e.pageX)}
          onMouseLeave={() => mouseX.set(Infinity)}
          className="flex items-end gap-2.5 px-3 py-2 rounded-[24px] bg-white/[0.12] dark:bg-black/35 backdrop-blur-3xl border border-white/20 shadow-2xl shadow-black/40"
        >
          {DOCK_ITEMS.map((item) => {
            const isOpen = item.id !== "trash" && windows[item.id as AppId]?.isOpen;
            return (
              <DockIcon
                key={item.id}
                item={item}
                mouseX={mouseX}
                isOpen={!!isOpen}
                onClick={() => handleAppClick(item.id)}
              />
            );
          })}
        </motion.div>
      </nav>

      {/* Trash Easter Egg Modal */}
      {trashOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[10000] flex items-center justify-center p-4"
          onClick={() => setTrashOpen(false)}
        >
          <div
            className="w-full max-w-sm bg-[#1e1e24] border border-white/20 rounded-2xl shadow-2xl p-6 text-white text-center animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-14 h-14 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center mx-auto mb-3 text-2xl">
              🗑️
            </div>
            <h3 className="text-base font-bold">Trash is Empty!</h3>
            <p className="text-xs text-white/60 mt-1 mb-4">
              &quot;All bugs were caught in pre-production testing. Zero critical issues remain.&quot;
            </p>
            <button
              onClick={() => setTrashOpen(false)}
              className="px-5 py-1.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold shadow-md transition-colors"
            >
              Empty Trash (Close)
            </button>
          </div>
        </div>
      )}
    </>
  );
}
