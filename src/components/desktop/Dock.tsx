"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion";
import { AppId, WindowState } from "@/types";
import { sounds } from "@/utils/sound";

interface DockProps {
  windows: Record<AppId, WindowState>;
  onOpenApp: (id: AppId) => void;
}

interface DockItemConfig {
  id: AppId;
  title: string;
  imageSrc: string;
  isCustomButton?: boolean;
}

const DOCK_ITEMS: DockItemConfig[] = [
  {
    id: "finder",
    title: "Finder",
    imageSrc: "/images/finder.png",
  },
  {
    id: "safari",
    title: "Safari",
    imageSrc: "/images/safari.png",
  },
  {
    id: "photos",
    title: "Photos",
    imageSrc: "/images/photos.png",
  },
  {
    id: "contacts",
    title: "Contacts",
    imageSrc: "/images/contact.png",
  },
  {
    id: "terminal",
    title: "Terminal",
    imageSrc: "/images/terminal.png",
  },
  {
    id: "aichat",
    title: "Ask Me",
    imageSrc: "/icons/svgexport.svg",
    isCustomButton: true,
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

  const widthSync = useTransform(distance, [-140, 0, 140], [50, 72, 50]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 190, damping: 14 });

  const handleClick = () => {
    sounds.playClick();
    setBouncing(true);
    setTimeout(() => setBouncing(false), 850);
    onClick();
  };

  return (
    <div className="relative group flex flex-col items-center select-none">
      {/* macOS Style Tooltip */}
      <div className="absolute -top-10 scale-0 group-hover:scale-100 transition-all duration-150 ease-out z-50 pointer-events-none">
        <div className="px-2.5 py-1 rounded-md bg-[#1e1e22]/90 text-white text-[11px] font-medium shadow-xl backdrop-blur-md border border-white/10 whitespace-nowrap">
          {item.title}
        </div>
      </div>

      {item.isCustomButton ? (
        /* Special "Ask Me" Pill Button (as in saurabh-kushwaha.vercel.app) */
        <motion.div
          ref={ref}
          style={{ height: width }}
          animate={
            bouncing
              ? {
                  y: [0, -22, 0, -12, 0],
                  transition: { duration: 0.75, ease: "easeOut" },
                }
              : { y: 0 }
          }
          onClick={handleClick}
          className="relative flex items-center gap-2 px-3.5 rounded-2xl bg-white/95 hover:bg-white text-zinc-900 shadow-xl cursor-pointer active:scale-95 transition-all border border-white/50 backdrop-blur-md"
        >
          <div className="relative w-7 h-7 shrink-0">
            <Image
              src={item.imageSrc}
              alt={item.title}
              fill
              className="object-contain"
              sizes="32px"
            />
          </div>
          <span className="text-[13px] font-semibold text-zinc-900 whitespace-nowrap pr-1 tracking-tight">
            Ask Me
          </span>
        </motion.div>
      ) : (
        /* Standard App Icon */
        <motion.div
          ref={ref}
          style={{ width, height: width }}
          animate={
            bouncing
              ? {
                  y: [0, -22, 0, -12, 0],
                  transition: { duration: 0.75, ease: "easeOut" },
                }
              : { y: 0 }
          }
          onClick={handleClick}
          className="relative rounded-2xl cursor-pointer flex items-center justify-center p-1 transition-all active:scale-95"
        >
          <div className="relative w-full h-full drop-shadow-md">
            <Image
              src={item.imageSrc}
              alt={item.title}
              fill
              className="object-contain"
              sizes="72px"
              priority
            />
          </div>
        </motion.div>
      )}

      {/* Active Indicator Dot */}
      <div className="h-1 flex items-center justify-center mt-0.5">
        {isOpen && (
          <span className="w-1.5 h-1.5 rounded-full bg-white/90 shadow-[0_0_6px_rgba(255,255,255,0.8)]" />
        )}
      </div>
    </div>
  );
}

export function Dock({ windows, onOpenApp }: DockProps) {
  const mouseX = useMotionValue(Infinity);

  return (
    <footer className="fixed bottom-3 left-1/2 -translate-x-1/2 z-[9990] flex flex-col items-center">
      <div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="flex items-end gap-3 px-3 py-2 rounded-[24px] bg-white/20 backdrop-blur-2xl border border-white/30 shadow-[0_12px_40px_rgba(0,0,0,0.35)] transition-all"
        style={{
          boxShadow: "0 10px 30px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.4)",
        }}
      >
        {DOCK_ITEMS.map((item) => (
          <DockIcon
            key={item.id}
            item={item}
            mouseX={mouseX}
            isOpen={windows[item.id]?.isOpen ?? false}
            onClick={() => onOpenApp(item.id)}
          />
        ))}
      </div>
    </footer>
  );
}
