"use client";

import React from "react";
import { ExternalLink } from "lucide-react";

interface ChatMarkdownProps {
  content: string;
  isStreaming?: boolean;
}

// Helper to remove any stray emojis for a clean engineering aesthetic
function stripEmojis(text: string): string {
  return text.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E0}-\u{1F1FF}]/gu, "").trim();
}

export function ChatMarkdown({ content, isStreaming }: ChatMarkdownProps) {
  const cleanContent = stripEmojis(content);
  // Split into lines
  const lines = cleanContent.split("\n");
  const elements: React.ReactNode[] = [];

  let currentListItems: React.ReactNode[] = [];

  const flushList = () => {
    if (currentListItems.length > 0) {
      elements.push(
        <div key={`list-${elements.length}`} className="my-2 space-y-1.5">
          {currentListItems}
        </div>
      );
      currentListItems = [];
    }
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    // Empty line
    if (!trimmed) {
      flushList();
      return;
    }

    // Horizontal Rule
    if (trimmed === "---" || trimmed === "***" || trimmed === "___") {
      flushList();
      elements.push(
        <hr key={`hr-${idx}`} className="border-white/10 my-3" />
      );
      return;
    }

    // Heading 3: ### Title -> Sleek CSS pill badge
    if (trimmed.startsWith("### ")) {
      flushList();
      const title = trimmed.replace(/^###\s+/, "");
      elements.push(
        <div key={`h3-${idx}`} className="my-2.5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-purple-500/15 border border-purple-500/30 text-[10.5px] font-semibold text-purple-300 tracking-wider uppercase shadow-sm shadow-purple-900/30">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            {parseInlineText(title)}
          </span>
        </div>
      );
      return;
    }

    // Heading 2: ## Title
    if (trimmed.startsWith("## ")) {
      flushList();
      const title = trimmed.replace(/^##\s+/, "");
      elements.push(
        <div
          key={`h2-${idx}`}
          className="text-[13px] font-bold text-white mt-3.5 mb-1.5 border-b border-white/10 pb-1 flex items-center gap-2"
        >
          <span className="w-1.5 h-3 bg-blue-500 rounded-full" />
          {parseInlineText(title)}
        </div>
      );
      return;
    }

    // Heading 1: # Title
    if (trimmed.startsWith("# ")) {
      flushList();
      const title = trimmed.replace(/^#\s+/, "");
      elements.push(
        <div
          key={`h1-${idx}`}
          className="text-sm font-extrabold text-white mt-4 mb-2 border-b border-white/15 pb-1"
        >
          {parseInlineText(title)}
        </div>
      );
      return;
    }

    // Bullet List Item (- or * or •)
    const bulletMatch = trimmed.match(/^[-*•]\s+(.*)$/);
    if (bulletMatch) {
      const itemText = bulletMatch[1];
      currentListItems.push(
        <div key={`bullet-${idx}`} className="flex items-start gap-2.5 text-xs text-white/90 leading-relaxed">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0 shadow-sm shadow-blue-500/50" />
          <div className="flex-1 min-w-0">{parseInlineText(itemText)}</div>
        </div>
      );
      return;
    }

    // Numbered List Item (1. , 2. )
    const numberMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
    if (numberMatch) {
      const num = numberMatch[1];
      const itemText = numberMatch[2];
      currentListItems.push(
        <div key={`num-${idx}`} className="flex items-start gap-2.5 text-xs text-white/90 leading-relaxed">
          <span className="w-4 h-4 rounded-full bg-white/10 text-white/80 flex items-center justify-center text-[10px] font-mono font-medium shrink-0 mt-0.5 border border-white/15">
            {num}
          </span>
          <div className="flex-1 min-w-0">{parseInlineText(itemText)}</div>
        </div>
      );
      return;
    }

    // Regular paragraph or continuation line
    flushList();
    elements.push(
      <p key={`p-${idx}`} className="text-xs text-white/90 leading-relaxed my-1.5">
        {parseInlineText(trimmed)}
      </p>
    );
  });

  flushList();

  return (
    <div className="space-y-1 text-xs">
      {elements}
      {isStreaming && (
        <span className="inline-block w-2 h-3.5 bg-blue-400 ml-1 translate-y-0.5 animate-pulse rounded-[1px]" />
      )}
    </div>
  );
}

// Parses inline bold, italic, code, and markdown links
function parseInlineText(text: string): React.ReactNode {
  // Tokens regex matching [anchor](url), `code`, **bold**, *italic*
  const tokenRegex = /(\[.*?\]\(.*?\)|\*\*.*?\*\*|\*.*?\*|`.*?`)/g;
  const parts = text.split(tokenRegex);

  return parts.map((part, index) => {
    if (!part) return null;

    // Link: [label](url)
    const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch) {
      return (
        <a
          key={index}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-400 hover:text-purple-300 font-semibold underline underline-offset-2 inline-flex items-center gap-0.5 mx-0.5 transition-colors"
        >
          <span>{linkMatch[1]}</span>
          <ExternalLink className="w-2.5 h-2.5 opacity-70" />
        </a>
      );
    }

    // Bold: **text**
    if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
      return (
        <strong key={index} className="font-bold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }

    // Italic: *text*
    if (part.startsWith("*") && part.endsWith("*") && part.length >= 2) {
      return (
        <em key={index} className="italic text-white/85">
          {part.slice(1, -1)}
        </em>
      );
    }

    // Inline Code: `code`
    if (part.startsWith("`") && part.endsWith("`") && part.length >= 2) {
      return (
        <code
          key={index}
          className="px-1.5 py-0.5 mx-0.5 rounded bg-black/40 text-purple-300 font-mono text-[11px] border border-white/10"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    return part;
  });
}
