"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { WindowState } from "@/types";

interface WindowFrameProps {
  window: WindowState;
  isActive: boolean;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onUpdatePosition: (pos: { x: number; y: number }) => void;
  onUpdateSize: (size: { width: number; height: number }) => void;
  children: React.ReactNode;
}

export function WindowFrame({
  window: win,
  isActive,
  onFocus,
  onClose,
  onMinimize,
  onMaximize,
  onUpdatePosition,
  onUpdateSize,
  children,
}: WindowFrameProps) {
  const windowRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const [isResizing, setIsResizing] = useState(false);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, w: 0, h: 0 });

  // Handle Dragging
  const handleMouseDownHeader = (e: React.MouseEvent) => {
    if (win.isMaximized) return;
    if (e.target !== e.currentTarget && !(e.target as HTMLElement).classList.contains("window-drag-handle")) {
      // Don't drag if clicking buttons
      return;
    }
    e.preventDefault();
    onFocus();
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - win.position.x,
      y: e.clientY - win.position.y,
    });
  };

  // Handle Resizing
  const handleMouseDownResize = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onFocus();
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      w: win.size.width,
      h: win.size.height,
    });
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      const newX = Math.max(0, Math.min(window.innerWidth - 100, e.clientX - dragOffset.x));
      const newY = Math.max(30, Math.min(window.innerHeight - 100, e.clientY - dragOffset.y));
      onUpdatePosition({ x: newX, y: newY });
    } else if (isResizing) {
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;
      const newW = Math.max(win.minSize.width, resizeStart.w + deltaX);
      const newH = Math.max(win.minSize.height, resizeStart.h + deltaY);
      onUpdateSize({ width: newW, height: newH });
    }
  }, [isDragging, isResizing, dragOffset, resizeStart, win.minSize, onUpdatePosition, onUpdateSize]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  if (!win.isOpen || win.isMinimized) {
    return null;
  }

  const style: React.CSSProperties = win.isMaximized
    ? {
        position: "fixed",
        top: "32px",
        left: "8px",
        right: "8px",
        bottom: "76px",
        width: "auto",
        height: "auto",
        zIndex: win.zIndex,
      }
    : {
        position: "fixed",
        left: `${win.position.x}px`,
        top: `${win.position.y}px`,
        width: `${win.size.width}px`,
        height: `${win.size.height}px`,
        maxWidth: `calc(100vw - ${Math.max(win.position.x + 16, 24)}px)`,
        maxHeight: `calc(100vh - ${Math.max(win.position.y + 74, 80)}px)`,
        zIndex: win.zIndex,
      };

  return (
    <div
      ref={windowRef}
      style={style}
      onClick={onFocus}
      className={`flex flex-col rounded-xl overflow-hidden border transition-[box-shadow,opacity] duration-200 ${
        isActive
          ? "border-white/20 shadow-2xl shadow-black/60 opacity-100 ring-1 ring-white/10"
          : "border-white/10 shadow-lg shadow-black/40 opacity-95"
      } bg-[#1e1e24]/90 backdrop-blur-3xl text-white`}
    >
      {/* macOS Window Header */}
      <div
        onMouseDown={handleMouseDownHeader}
        className={`window-drag-handle h-10 px-4 flex items-center justify-between border-b select-none cursor-default ${
          isActive
            ? "bg-[#282830]/90 border-white/10 text-white/90"
            : "bg-[#202026]/80 border-white/5 text-white/50"
        }`}
      >
        {/* Traffic Light Buttons */}
        <div className="flex items-center gap-2 group/lights">
          {/* Close (Red) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="w-3 h-3 rounded-full bg-[#ff5f57] border border-[#e0443e] flex items-center justify-center text-black/70 hover:opacity-100 transition-opacity"
            title="Close"
          >
            <span className="opacity-0 group-hover/lights:opacity-100 text-[9px] font-bold leading-none mb-0.5">
              ×
            </span>
          </button>

          {/* Minimize (Yellow) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMinimize();
            }}
            className="w-3 h-3 rounded-full bg-[#febc2e] border border-[#d89e24] flex items-center justify-center text-black/70 hover:opacity-100 transition-opacity"
            title="Minimize"
          >
            <span className="opacity-0 group-hover/lights:opacity-100 text-[10px] font-bold leading-none mb-1">
              -
            </span>
          </button>

          {/* Maximize (Green) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMaximize();
            }}
            className="w-3 h-3 rounded-full bg-[#28c840] border border-[#1aab29] flex items-center justify-center text-black/70 hover:opacity-100 transition-opacity"
            title={win.isMaximized ? "Restore" : "Zoom"}
          >
            <span className="opacity-0 group-hover/lights:opacity-100 text-[7px] font-bold leading-none">
              +
            </span>
          </button>
        </div>

        {/* Window Title */}
        <div className="text-xs font-semibold tracking-wide text-center truncate max-w-[65%] pointer-events-none">
          {win.title}
        </div>

        {/* Dummy spacer for symmetric balance */}
        <div className="w-12" />
      </div>

      {/* Window Body */}
      <div className="flex-1 min-h-0 overflow-hidden relative flex flex-col bg-[#16161a]/95">
        {children}
      </div>

      {/* Resize Handle (Bottom Right) */}
      {!win.isMaximized && (
        <div
          onMouseDown={handleMouseDownResize}
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize flex items-end justify-end p-0.5 z-50 group"
          title="Resize window"
        >
          <svg
            className="w-2.5 h-2.5 text-white/30 group-hover:text-white/70 transition-colors"
            viewBox="0 0 6 6"
          >
            <circle cx="5" cy="5" r="0.8" fill="currentColor" />
            <circle cx="5" cy="2" r="0.8" fill="currentColor" />
            <circle cx="2" cy="5" r="0.8" fill="currentColor" />
          </svg>
        </div>
      )}
    </div>
  );
}
