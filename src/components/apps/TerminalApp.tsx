"use client";

import React, { useState, useRef, useEffect } from "react";
import confetti from "canvas-confetti";
import { candidateProfile } from "@/data/candidate";
import { projectsData } from "@/data/projects";
import { sounds } from "@/utils/sound";
import { AppId } from "@/types";

interface TerminalAppProps {
  onOpenApp?: (id: AppId) => void;
}

interface CommandOutput {
  id: string;
  command: string;
  response: React.ReactNode;
}

const WELCOME_BANNER = `Last login: ${new Date().toDateString()} on ttys001
Type 'help' to view available developer commands, or 'ai <question>' to talk with AI clone.`;

export function TerminalApp({ onOpenApp }: TerminalAppProps) {
  const [history, setHistory] = useState<CommandOutput[]>([
    {
      id: "init",
      command: "welcome",
      response: <pre className="font-mono text-xs text-emerald-400">{WELCOME_BANNER}</pre>,
    },
  ]);
  const [input, setInput] = useState("");
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number>(-1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleCommand = async (rawCmd: string) => {
    const trimmed = rawCmd.trim();
    if (!trimmed) return;

    sounds.playClick();
    setCmdHistory((prev) => [...prev, trimmed]);
    setHistoryIdx(-1);
    setInput("");

    const [mainCmd, ...args] = trimmed.split(" ");
    const argStr = args.join(" ");

    let response: React.ReactNode = null;

    switch (mainCmd.toLowerCase()) {
      case "help":
        response = (
          <div className="space-y-1 font-mono text-xs text-white/90">
            <div>Available Commands:</div>
            <div className="grid grid-cols-2 gap-1 text-white/70">
              <div><span className="text-emerald-400">help</span> - List all commands</div>
              <div><span className="text-emerald-400">about</span> - Developer summary</div>
              <div><span className="text-emerald-400">skills</span> - Technical skills</div>
              <div><span className="text-emerald-400">projects</span> - View flagship projects</div>
              <div><span className="text-emerald-400">resume</span> - Open resume preview</div>
              <div><span className="text-emerald-400">ai &lt;q&gt;</span> - Query AI twin directly</div>
              <div><span className="text-emerald-400">neofetch</span> - Show developer specs</div>
              <div><span className="text-emerald-400">sudo hire</span> - 🚀 Make an offer</div>
              <div><span className="text-emerald-400">contact</span> - Email & socials</div>
              <div><span className="text-emerald-400">clear</span> - Clear terminal</div>
            </div>
          </div>
        );
        break;

      case "about":
        response = (
          <div className="font-mono text-xs text-white/80 space-y-1.5">
            <div className="text-emerald-400 font-bold">{candidateProfile.name}</div>
            <div>Role: {candidateProfile.title}</div>
            <div>Location: {candidateProfile.location}</div>
            <div>Status: {candidateProfile.status}</div>
            <div className="text-white/60">{candidateProfile.bio}</div>
          </div>
        );
        break;

      case "skills":
        response = (
          <div className="font-mono text-xs space-y-2">
            {candidateProfile.skills.map((cat, i) => (
              <div key={i}>
                <span className="text-purple-300 font-semibold">[{cat.category}]: </span>
                <span className="text-white/80">{cat.items.join(", ")}</span>
              </div>
            ))}
          </div>
        );
        break;

      case "projects":
        response = (
          <div className="font-mono text-xs space-y-2">
            {projectsData.map((p) => (
              <div key={p.id} className="border-l-2 border-emerald-500 pl-2">
                <div className="text-emerald-400 font-bold">{p.title}</div>
                <div className="text-white/70">{p.tagline}</div>
                <div className="text-[10px] text-white/50">Stack: {p.technologies.join(", ")}</div>
              </div>
            ))}
          </div>
        );
        break;

      case "resume":
        response = (
          <div className="font-mono text-xs text-emerald-400">
            Opening Resume Document Previewer window...
          </div>
        );
        if (onOpenApp) onOpenApp("resume");
        break;

      case "ai":
        if (!argStr) {
          response = (
            <div className="font-mono text-xs text-amber-300">
              Usage: ai &lt;your question about candidate or projects&gt;
            </div>
          );
        } else {
          response = (
            <div className="font-mono text-xs text-purple-300">
              [HireMe AI Response]: Grounding inquiry for &quot;{argStr}&quot;...
              <div className="mt-1 text-white/90">
                {candidateProfile.name} is a Full Stack Developer & AI Engineer specializing in custom vector databases, high-performance C++ systems, and modern Next.js applications. Launching AI Digital Twin...
              </div>
            </div>
          );
          if (onOpenApp) onOpenApp("aichat");
        }
        break;

      case "neofetch":
        response = (
          <div className="font-mono text-xs flex gap-4 items-center">
            <pre className="text-cyan-400 font-bold select-none text-[10px] leading-tight">
{`                    'c.
                 ,xNMM.
               .OMMMMo
               OMMM0,
     .;loddo:' loolloddol;.
   cKMMMMMMMMMMNWMMMMMMMMMM0:
 .KMMMMMMMMMMMMMMMMMMMMMMMWd.
 XMMMMMMMMMMMMMMMMMMMMMMMX.
;MMMMMMMMMMMMMMMMMMMMMMMM:
:MMMMMMMMMMMMMMMMMMMMMMMM:
.MMMMMMMMMMMMMMMMMMMMMMMMX.
 kMMMMMMMMMMMMMMMMMMMMMMMMWd.
 .XMMMMMMMMMMMMMMMMMMMMMMMMMMk
  .XMMMMMMMMMMMMMMMMMMMMMMMMK.
    kMMMMMMMMMMMMMMMMMMMMMMd
     ;KMMMMMMMWXXWMMMMMMMk.
       .cooc,.    .,coo:.`}
            </pre>
            <div className="space-y-1 text-white/90">
              <div><span className="text-emerald-400 font-bold">{candidateProfile.handle}</span>@macbook-pro</div>
              <div className="text-white/40">-------------------</div>
              <div><span className="text-purple-300">OS:</span> macOS Sequoia (Portfolio Edition)</div>
              <div><span className="text-purple-300">Host:</span> Apple M3 Max (36GB)</div>
              <div><span className="text-purple-300">Role:</span> {candidateProfile.title}</div>
              <div><span className="text-purple-300">Stack:</span> Next.js, C++17, Python, TypeScript, Spring Boot, PostgreSQL, MongoDB</div>
              <div><span className="text-purple-300">Shell:</span> zsh 5.9 (x86_64-apple-darwin23.0)</div>
              <div><span className="text-purple-300">Uptime:</span> 99.9% Production Reliability</div>
            </div>
          </div>
        );
        break;

      case "sudo":
        if (args[0] === "hire") {
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
          });
          response = (
            <div className="font-mono text-xs text-emerald-400 font-bold p-2 bg-emerald-950/40 border border-emerald-500/40 rounded-lg">
              🎉 OFFER EXTENDED & ACCEPTED! Congratulations! Let&apos;s build incredible AI systems together.
              <div className="mt-1 text-white/80 font-normal">
                Email {candidateProfile.email} to finalize onboarding details.
              </div>
            </div>
          );
        } else {
          response = (
            <div className="font-mono text-xs text-red-400">
              sudo: {args[0]}: command not found. Try &apos;sudo hire&apos; 😉
            </div>
          );
        }
        break;

      case "contact":
        response = (
          <div className="font-mono text-xs text-white/80 space-y-1">
            <div>Email: <span className="text-emerald-400">{candidateProfile.email}</span></div>
            <div>GitHub: <span className="text-blue-400">{candidateProfile.github}</span></div>
            <div>LinkedIn: <span className="text-blue-400">{candidateProfile.linkedin}</span></div>
          </div>
        );
        break;

      case "clear":
        setHistory([]);
        return;

      default:
        response = (
          <div className="font-mono text-xs text-red-400">
            zsh: command not found: {mainCmd}. Type &apos;help&apos; for available commands.
          </div>
        );
    }

    setHistory((prev) => [
      ...prev,
      {
        id: `cmd-${Date.now()}`,
        command: rawCmd,
        response,
      },
    ]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCommand(input);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      const nextIdx = historyIdx + 1 < cmdHistory.length ? historyIdx + 1 : historyIdx;
      setHistoryIdx(nextIdx);
      setInput(cmdHistory[cmdHistory.length - 1 - nextIdx] || "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIdx > 0) {
        const nextIdx = historyIdx - 1;
        setHistoryIdx(nextIdx);
        setInput(cmdHistory[cmdHistory.length - 1 - nextIdx] || "");
      } else {
        setHistoryIdx(-1);
        setInput("");
      }
    }
  };

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className="flex flex-col h-full bg-[#141416] p-4 text-white font-mono text-xs overflow-y-auto cursor-text select-text"
    >
      <div className="space-y-3">
        {history.map((item) => (
          <div key={item.id} className="space-y-1">
            {item.command !== "welcome" && (
              <div className="flex items-center gap-2 text-white/90">
                <span className="text-emerald-400 font-bold">{candidateProfile.handle}@macbook-pro</span>
                <span className="text-white/40">~ %</span>
                <span>{item.command}</span>
              </div>
            )}
            <div>{item.response}</div>
          </div>
        ))}
      </div>

      {/* Active input line */}
      <div className="flex items-center gap-2 text-white/90 mt-2">
        <span className="text-emerald-400 font-bold">{candidateProfile.handle}@macbook-pro</span>
        <span className="text-white/40">~ %</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent border-0 outline-none text-white font-mono text-xs p-0 m-0"
          autoFocus
        />
      </div>

      <div ref={bottomRef} />
    </div>
  );
}
