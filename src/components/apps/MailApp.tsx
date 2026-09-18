"use client";

import React, { useState } from "react";
import { Send, Mail, Inbox, SendHorizontal, Check, Copy } from "lucide-react";
import { LinkedinIcon, GithubIcon, TwitterIcon } from "@/components/icons/BrandIcons";
import { candidateProfile } from "@/data/candidate";
import { sounds } from "@/utils/sound";

export function MailApp() {
  const [fromEmail, setFromEmail] = useState("");
  const [subject, setSubject] = useState("Exciting AI Engineering Role @ Our Team");
  const [message, setMessage] = useState(
    `Hi ${candidateProfile.name},\n\nWe came across your portfolio and were impressed by your work on UPI Offline Mesh, Pranshu's AI Vector Database, and your full-stack engineering experience. We'd love to connect for an introductory conversation regarding opportunities on our team.\n\nBest regards,`
  );
  const [isSent, setIsSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dbPersisted, setDbPersisted] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    sounds.playClick();

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from_email: fromEmail,
          subject,
          message,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setDbPersisted(data.storedInDatabase ?? false);
      }
    } catch {
      // Fallback
    } finally {
      setIsSubmitting(false);
      sounds.playChime();
      setIsSent(true);

      // Trigger native mail client for convenience
      const mailtoUrl = `mailto:${candidateProfile.email}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(message + `\n\nFrom: ${fromEmail}`)}`;
      window.location.href = mailtoUrl;

      setTimeout(() => {
        setIsSent(false);
        setDbPersisted(false);
      }, 7000);
    }
  };


  const handleCopyEmail = () => {
    navigator.clipboard.writeText(candidateProfile.email);
    setCopiedEmail(true);
    sounds.playClick();
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div className="flex h-full bg-[#18181c] text-white">
      {/* Mailbox Sidebar */}
      <div className="w-48 border-r border-white/10 bg-[#1e1e24] p-3 flex flex-col justify-between select-none shrink-0">
        <div>
          <div className="text-[10px] uppercase font-bold text-white/40 mb-2">Mailboxes</div>
          <div className="space-y-1 text-xs">
            <button className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-blue-600 text-white font-medium">
              <div className="flex items-center gap-2">
                <SendHorizontal className="w-3.5 h-3.5" />
                <span>New Message</span>
              </div>
            </button>
            <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-white/50 cursor-not-allowed">
              <div className="flex items-center gap-2">
                <Inbox className="w-3.5 h-3.5" />
                <span>Inbox</span>
              </div>
              <span className="text-[10px] bg-white/10 px-1.5 rounded-full">1</span>
            </div>
          </div>
        </div>

        {/* Social Quick Links */}
        <div className="space-y-2 pt-4 border-t border-white/10">
          <div className="text-[10px] font-bold text-white/40 uppercase">Direct Connect</div>
          <div className="flex items-center gap-2">
            <a
              href={candidateProfile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-lg bg-white/5 hover:bg-blue-600/30 border border-white/10 text-white/70 hover:text-white transition-colors"
              title="LinkedIn"
            >
              <LinkedinIcon className="w-4 h-4 text-blue-400" />
            </a>
            <a
              href={candidateProfile.github}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-white/70 hover:text-white transition-colors"
              title="GitHub"
            >
              <GithubIcon className="w-4 h-4 text-white" />
            </a>
            <a
              href={candidateProfile.twitter}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-lg bg-white/5 hover:bg-sky-500/30 border border-white/10 text-white/70 hover:text-white transition-colors"
              title="Twitter / X"
            >
              <TwitterIcon className="w-4 h-4 text-sky-400" />
            </a>
          </div>
        </div>
      </div>

      {/* Compose Pane */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#16161a]">
        {/* Toolbar */}
        <div className="h-11 border-b border-white/10 px-4 flex items-center justify-between bg-[#202026] shrink-0">
          <div className="text-xs font-semibold text-white/90 flex items-center gap-2">
            <Mail className="w-4 h-4 text-blue-400" />
            <span>New Recruiter / Hiring Inquiry</span>
          </div>

          <button
            onClick={handleCopyEmail}
            className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-medium flex items-center gap-1.5 transition-colors"
          >
            {copiedEmail ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">Email Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy Email Address</span>
              </>
            )}
          </button>
        </div>

        {/* Message Form */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col p-4 space-y-3 overflow-y-auto">
          {/* To */}
          <div className="flex items-center gap-3 border-b border-white/10 pb-2 text-xs">
            <span className="w-16 text-white/40 font-medium">To:</span>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 font-semibold">
              {candidateProfile.name} &lt;{candidateProfile.email}&gt;
            </span>
          </div>

          {/* From */}
          <div className="flex items-center gap-3 border-b border-white/10 pb-2 text-xs">
            <span className="w-16 text-white/40 font-medium">From:</span>
            <input
              type="email"
              required
              value={fromEmail}
              onChange={(e) => setFromEmail(e.target.value)}
              placeholder="recruiter@company.com"
              className="flex-1 bg-transparent text-white outline-none placeholder:text-white/30"
            />
          </div>

          {/* Subject */}
          <div className="flex items-center gap-3 border-b border-white/10 pb-2 text-xs">
            <span className="w-16 text-white/40 font-medium">Subject:</span>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="flex-1 bg-transparent text-white outline-none"
            />
          </div>

          {/* Body */}
          <div className="flex-1 flex flex-col min-h-36">
            <textarea
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 bg-transparent text-white text-xs leading-relaxed outline-none resize-none placeholder:text-white/30 font-sans"
              placeholder="Type your message here..."
            />
          </div>

          {/* Bottom Action */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between">
            <div className="text-[11px] text-white/40 flex items-center gap-2">
              <span>⚡ Dispatches to {candidateProfile.email}</span>
              {dbPersisted && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold">
                  ✓ Recorded in MongoDB
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Logging to MongoDB...</span>
                </>
              ) : isSent ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>{dbPersisted ? "Saved & Mail Opened!" : "Mail Client Opened!"}</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Inquiry</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

