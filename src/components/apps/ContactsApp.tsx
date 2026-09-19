"use client";

import React, { useState } from "react";
import { candidateProfile } from "@/data/candidate";
import { 
  Mail, 
  FileText, 
  Send, 
  CheckCircle2, 
  Star, 
  MessageSquarePlus,
  Loader2
} from "lucide-react";
import { sounds } from "@/utils/sound";
import { AppId } from "@/types";

interface ContactsAppProps {
  onOpenApp?: (appId: AppId) => void;
}

export function ContactsApp({ onOpenApp }: ContactsAppProps) {
  const [selectedTab, setSelectedTab] = useState<"card" | "message">("card");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    role: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmitMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setErrorMsg("Please fill in your name, email, and message.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from_email: formData.email,
          recruiter_email: formData.email,
          recruiter_name: formData.name,
          company: formData.company || "Not specified",
          role_title: formData.role || "Full Stack / AI Role",
          subject: formData.role
            ? `${formData.role} - ${formData.company || formData.name}`
            : `Contact from ${formData.name}`,
          message: formData.message,
          job_link: "",
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.error || "Failed to send message.");
      }

      setIsSubmitted(true);
      sounds.playChime();
      setFormData({ name: "", email: "", company: "", role: "", message: "" });
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row h-full w-full bg-[#1c1c1e] text-white select-none overflow-hidden text-sm">
      {/* Top Segmented Tabs on Mobile */}
      <div className="sm:hidden flex items-center p-2 border-b border-white/10 bg-[#252528] shrink-0">
        <div className="flex w-full bg-white/10 p-0.5 rounded-xl">
          <button
            onClick={() => setSelectedTab("card")}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedTab === "card" ? "bg-[#0A84FF] text-white shadow-sm" : "text-white/70"
            }`}
          >
            Candidate Card
          </button>
          <button
            onClick={() => setSelectedTab("message")}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedTab === "message" ? "bg-[#0A84FF] text-white shadow-sm" : "text-white/70"
            }`}
          >
            Send Message
          </button>
        </div>
      </div>

      {/* Sidebar: Contact List - Hidden on Mobile */}
      <div className="hidden sm:flex w-56 md:w-64 border-r border-white/10 bg-[#252528] flex-col shrink-0">
        {/* Search header */}
        <div className="p-3 border-b border-white/10">
          <div className="text-[12px] font-semibold text-white/50 mb-2 px-1">CONTACTS</div>
          <div className="relative">
            <input 
              type="text" 
              readOnly
              value="Pranshu Rajan"
              className="w-full px-3 py-1.5 rounded-md bg-white/10 text-xs text-white/90 border border-white/10 outline-none"
            />
          </div>
        </div>

        {/* Contact entries */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          <button
            onClick={() => setSelectedTab("card")}
            className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 transition-colors ${
              selectedTab === "card"
                ? "bg-[#0A84FF] text-white shadow-sm"
                : "hover:bg-white/5 text-white/80"
            }`}
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
              PR
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 font-semibold text-[13px] truncate">
                <span>Pranshu Rajan</span>
                <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
              </div>
              <p className="text-[11px] opacity-75 truncate">Full Stack & AI Engineer</p>
            </div>
          </button>

          <button
            onClick={() => setSelectedTab("message")}
            className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 transition-colors ${
              selectedTab === "message"
                ? "bg-[#0A84FF] text-white shadow-sm"
                : "hover:bg-white/5 text-white/80"
            }`}
          >
            <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <MessageSquarePlus className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-[13px] truncate">Send a Message</div>
              <p className="text-[11px] opacity-75 truncate">Recruiter outreach / email</p>
            </div>
          </button>
        </div>

        {/* Bottom card footer */}
        <div className="p-3 border-t border-white/10 text-[11px] text-white/40 flex items-center justify-between">
          <span>1 Contact Card</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto bg-[#1c1c1e] p-4 sm:p-6 min-w-0">
        {selectedTab === "card" ? (
          <div className="max-w-xl mx-auto space-y-6">
            {/* Header Hero */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-5 pb-5 sm:pb-6 border-b border-white/10">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-xl sm:text-2xl font-bold text-white shadow-xl ring-2 ring-white/20 shrink-0">
                PR
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Pranshu Rajan</h1>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#0A84FF]/20 text-[#0A84FF] border border-[#0A84FF]/30">
                    Candidate
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-white/70 mt-0.5">
                  Full Stack Developer · AI Engineer
                </p>
                <p className="text-xs text-emerald-400 font-medium flex items-center justify-center sm:justify-start gap-1.5 mt-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Available for Full-Time Roles & Internships
                </p>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              <a
                href={`mailto:${candidateProfile.email}`}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 transition-all group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-[#0A84FF]/20 text-[#0A84FF] flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-medium text-white/90">Email</span>
              </a>

              <a
                href={candidateProfile.github}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 transition-all group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                  <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                  </svg>
                </div>
                <span className="text-[10px] font-medium text-white/90">GitHub</span>
              </a>

              <a
                href={candidateProfile.linkedin}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 transition-all group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-[#0A66C2]/20 text-[#0A84FF] flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                  <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect x="2" y="9" width="4" height="12" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </div>
                <span className="text-[10px] font-medium text-white/90">LinkedIn</span>
              </a>

              <a
                href="https://leetcode.com/u/PranshuRajan/"
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 transition-all group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform font-bold text-xs">
                  LC
                </div>
                <span className="text-[10px] font-medium text-white/90">LeetCode</span>
              </a>

              <a
                href="/Pranshu_Rajan_Resume.pdf"
                onClick={(e) => {
                  if (onOpenApp) {
                    e.preventDefault();
                    onOpenApp("resume");
                  }
                }}
                download="Pranshu_Rajan_Resume.pdf"
                className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 transition-all group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-medium text-white/90">Resume</span>
              </a>
            </div>

            {/* Information Cards */}
            <div className="space-y-3">
              <div className="bg-white/[0.04] border border-white/10 rounded-xl p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs">
                  <div className="text-white/40 w-24 shrink-0">Email</div>
                  <a href={`mailto:${candidateProfile.email}`} className="text-[#0A84FF] hover:underline font-mono truncate">
                    {candidateProfile.email}
                  </a>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs border-t border-white/[0.07] pt-2.5">
                  <div className="text-white/40 w-24 shrink-0">Target Roles</div>
                  <span className="text-white/90 font-medium">Software Roles Only (SDE, Full-Stack, AI/ML, Backend)</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs border-t border-white/[0.07] pt-2.5">
                  <div className="text-white/40 w-24 shrink-0">Seeking</div>
                  <span className="text-white/90 font-medium">Winter &amp; Summer Internships · All Modes (Remote / Hybrid / On-site)</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs border-t border-white/[0.07] pt-2.5">
                  <div className="text-white/40 w-24 shrink-0">Location</div>
                  <span className="text-white/90">India · Open to Relocation across India &amp; Worldwide</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3 text-xs border-t border-white/[0.07] pt-2.5">
                  <div className="text-white/40 w-24 shrink-0">Education</div>
                  <span className="text-white/90">Nirma University, Ahmedabad · B.Tech Electronics &amp; Instrumentation (2024–2028, 3rd Year, CGPA: 7.88)</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs border-t border-white/[0.07] pt-2.5">
                  <div className="text-white/40 w-24 shrink-0">Focus Areas</div>
                  <span className="text-white/90">Full Stack, AI Agents, MongoDB, FastAPI, Next.js</span>
                </div>
              </div>

              {/* Bio summary */}
              <div className="bg-white/[0.04] border border-white/10 rounded-xl p-4">
                <div className="text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">Note</div>
                <p className="text-xs text-white/80 leading-relaxed">
                  {candidateProfile.bio}
                </p>
              </div>

              {/* Bottom quick CTA */}
              <button
                onClick={() => setSelectedTab("message")}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:brightness-110 text-white font-medium text-xs shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Pranshu a Direct Note (Saved in Database)</span>
              </button>
            </div>
          </div>
        ) : (
          /* Message / Recruiter Outreach Tab */
          <div className="max-w-xl mx-auto space-y-4">
            <div>
              <h2 className="text-lg font-bold text-white">Send a Message to Pranshu</h2>
              <p className="text-xs text-white/60 mt-1">
                Your message is stored in MongoDB Atlas and notifies Pranshu directly.
              </p>
            </div>

            {isSubmitted ? (
              <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h3 className="text-sm font-bold text-white">Message Delivered!</h3>
                <p className="text-xs text-white/70">
                  Thank you for reaching out! Your message was recorded in MongoDB Atlas. Pranshu will reply shortly.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-white font-medium transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitMessage} className="space-y-3">
                {errorMsg && (
                  <div className="p-2.5 rounded-lg bg-red-500/20 border border-red-500/30 text-red-300 text-xs">
                    {errorMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-white/60 mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-white/[0.05] border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-white/60 mb-1">Your Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="jane@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-white/[0.05] border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-white/60 mb-1">Company / Organization</label>
                    <input
                      type="text"
                      placeholder="Acme AI"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-white/[0.05] border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-white/60 mb-1">Role / Subject</label>
                    <input
                      type="text"
                      placeholder="Software Engineer Role"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-white/[0.05] border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-white/60 mb-1">Message *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Hi Pranshu, we were impressed by your projects and would love to chat..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white/[0.05] border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-2 rounded-lg bg-[#0A84FF] hover:bg-[#0071e3] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Sending to Atlas DB...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedTab("card")}
                    className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white/80 text-xs transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
