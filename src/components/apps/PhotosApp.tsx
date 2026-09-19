"use client";

import React, { useState } from "react";
import Image from "next/image";
import { 
  Award, 
  CheckCircle2, 
  ExternalLink, 
  Search, 
  X, 
  ZoomIn, 
  ZoomOut, 
  ChevronLeft, 
  ChevronRight, 
  ShieldCheck,
  GraduationCap,
  Cloud,
  FileBadge
} from "lucide-react";
import { certificationsData, CertificationItem } from "@/data/certifications";
import { sounds } from "@/utils/sound";

type AlbumCategory = "all" | "AI & Cloud" | "Academic & Honors" | "Specialized" | "Industry Vendor";

export function PhotosApp() {
  const [selectedCategory, setSelectedCategory] = useState<AlbumCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCert, setActiveCert] = useState<CertificationItem | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const filteredCerts = certificationsData.filter((c) => {
    const matchCat = selectedCategory === "all" || c.issuerCategory === selectedCategory;
    const matchQuery =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.issuer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchQuery;
  });

  const handleOpenCert = (cert: CertificationItem) => {
    sounds.playClick();
    setActiveCert(cert);
    setZoomLevel(1);
  };

  const handleCloseModal = () => {
    sounds.playClick();
    setActiveCert(null);
    setZoomLevel(1);
  };

  const handlePrevCert = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activeCert) return;
    const currentIndex = filteredCerts.findIndex((c) => c.id === activeCert.id);
    const prevIndex = (currentIndex - 1 + filteredCerts.length) % filteredCerts.length;
    sounds.playClick();
    setActiveCert(filteredCerts[prevIndex]);
    setZoomLevel(1);
  };

  const handleNextCert = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activeCert) return;
    const currentIndex = filteredCerts.findIndex((c) => c.id === activeCert.id);
    const nextIndex = (currentIndex + 1) % filteredCerts.length;
    sounds.playClick();
    setActiveCert(filteredCerts[nextIndex]);
    setZoomLevel(1);
  };

  return (
    <div className="flex h-full bg-[#1c1c20] text-white select-none">
      {/* Photos Sidebar */}
      <div className="w-56 border-r border-white/10 bg-[#222228]/80 backdrop-blur-md p-3 flex flex-col justify-between shrink-0">
        <div>
          {/* Library Section */}
          <div className="text-[10px] font-bold uppercase tracking-wider text-white/40 px-2 mb-2">
            Photos Library
          </div>
          <div className="space-y-0.5">
            <button
              onClick={() => {
                sounds.playClick();
                setSelectedCategory("all");
              }}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedCategory === "all"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2">
                <FileBadge className="w-3.5 h-3.5 text-blue-400" />
                <span>All Certifications</span>
              </div>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${selectedCategory === "all" ? "bg-white/20" : "bg-white/5 text-white/40"}`}>
                {certificationsData.length}
              </span>
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                setSelectedCategory("AI & Cloud");
              }}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedCategory === "AI & Cloud"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2">
                <Cloud className="w-3.5 h-3.5 text-purple-400" />
                <span>AI & Cloud</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/5 text-white/40">
                {certificationsData.filter((c) => c.issuerCategory === "AI & Cloud").length}
              </span>
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                setSelectedCategory("Industry Vendor");
              }}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedCategory === "Industry Vendor"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Oracle & Enterprise</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/5 text-white/40">
                {certificationsData.filter((c) => c.issuerCategory === "Industry Vendor").length}
              </span>
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                setSelectedCategory("Academic & Honors");
              }}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedCategory === "Academic & Honors"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2">
                <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                <span>Nirma University</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/5 text-white/40">
                {certificationsData.filter((c) => c.issuerCategory === "Academic & Honors").length}
              </span>
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                setSelectedCategory("Specialized");
              }}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedCategory === "Specialized"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2">
                <Award className="w-3.5 h-3.5 text-rose-400" />
                <span>Specialized Skills</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/5 text-white/40">
                {certificationsData.filter((c) => c.issuerCategory === "Specialized").length}
              </span>
            </button>
          </div>
        </div>

        {/* Verification Guarantee Badge */}
        <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-left">
          <div className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1.5 mb-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>100% Verified Credentials</span>
          </div>
          <p className="text-[10px] text-white/50 leading-relaxed">
            All certifications, scholar awards, and course completions are genuine and verified through Credly, Oracle, and Nirma University.
          </p>
        </div>
      </div>

      {/* Main Photos Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#17171a]">
        {/* Top Photos Toolbar */}
        <div className="h-11 border-b border-white/10 px-4 flex items-center justify-between bg-[#1f1f25]/80 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white/90">
              {selectedCategory === "all" ? "All Certifications" : selectedCategory}
            </span>
            <span className="text-[11px] text-white/40">({filteredCerts.length} items)</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 text-white/40 absolute left-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search credentials & skills..."
                className="w-52 bg-[#121215] border border-white/10 rounded-lg pl-8 pr-2.5 py-1 text-xs text-white placeholder:text-white/40 outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Grid of Photo / Certificate Cards */}
        <div className="flex-1 overflow-y-auto p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCerts.map((cert) => (
              <div
                key={cert.id}
                onClick={() => handleOpenCert(cert)}
                className="group relative rounded-2xl bg-[#222228] border border-white/10 hover:border-blue-500/50 hover:shadow-2xl transition-all duration-200 overflow-hidden cursor-pointer flex flex-col"
              >
                {/* Image Canvas */}
                <div className="relative aspect-[4/3] bg-zinc-900 overflow-hidden flex items-center justify-center p-2">
                  <Image
                    src={cert.imageSrc}
                    alt={cert.title}
                    width={400}
                    height={300}
                    className="object-contain w-full h-full rounded-lg group-hover:scale-105 transition-transform duration-300"
                    unoptimized
                  />

                  {/* Top Overlay Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20">
                      {cert.issuer}
                    </span>
                  </div>

                  {cert.badgeSrc && (
                    <div className="absolute top-3 right-3 w-7 h-7 rounded-lg bg-black/50 p-0.5 border border-white/20 backdrop-blur-md">
                      <Image
                        src={cert.badgeSrc}
                        alt="Badge"
                        width={28}
                        height={28}
                        className="object-contain rounded"
                        unoptimized
                      />
                    </div>
                  )}
                </div>

                {/* Card Information */}
                <div className="p-3.5 flex-1 flex flex-col justify-between bg-[#1e1e24] border-t border-white/5 space-y-2">
                  <div>
                    <h3 className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                      {cert.title}
                    </h3>
                    <p className="text-[11px] text-white/50 mt-0.5">
                      Issued: {cert.issueDate}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {cert.skills.slice(0, 3).map((skill, i) => (
                      <span
                        key={i}
                        className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-white/60 font-mono"
                      >
                        {skill}
                      </span>
                    ))}
                    {cert.skills.length > 3 && (
                      <span className="text-[9px] px-1 py-0.5 text-white/40">
                        +{cert.skills.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive macOS Photo Inspection Modal */}
      {activeCert && (
        <div
          className="fixed inset-0 z-[10000] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={handleCloseModal}
        >
          <div
            className="w-full max-w-4xl h-[85vh] bg-[#1a1a20] border border-white/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row text-white animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left: Certificate Image Viewer */}
            <div className="flex-1 bg-black/60 relative flex items-center justify-center p-4 overflow-hidden select-none">
              {/* Previous / Next Arrows */}
              <button
                onClick={handlePrevCert}
                className="absolute left-3 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white/70 hover:text-white border border-white/10 transition-colors z-20"
                title="Previous certificate"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNextCert}
                className="absolute right-3 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white/70 hover:text-white border border-white/10 transition-colors z-20"
                title="Next certificate"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Certificate Image */}
              <div 
                className="w-full h-full flex items-center justify-center overflow-auto p-2"
                style={{ transform: `scale(${zoomLevel})`, transition: "transform 0.2s ease" }}
              >
                <Image
                  src={activeCert.imageSrc}
                  alt={activeCert.title}
                  width={1200}
                  height={900}
                  className="max-h-full max-w-full object-contain rounded-lg shadow-2xl"
                  unoptimized
                />
              </div>

              {/* Zoom Controls */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 z-20">
                <button
                  onClick={() => setZoomLevel((z) => Math.max(0.75, z - 0.25))}
                  className="p-1 text-white/70 hover:text-white"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[10px] font-mono w-10 text-center">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.25))}
                  className="p-1 text-white/70 hover:text-white"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right: Inspector Details Sidebar */}
            <div className="w-full md:w-80 bg-[#222228] border-l border-white/10 flex flex-col justify-between p-5 overflow-y-auto">
              <div className="space-y-4">
                {/* Header & Close */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      {activeCert.issuer}
                    </span>
                    <h2 className="text-base font-bold text-white mt-2 leading-snug">
                      {activeCert.title}
                    </h2>
                  </div>
                  <button
                    onClick={handleCloseModal}
                    className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Metadata Fields */}
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-2 text-xs">
                  <div>
                    <span className="text-white/40 block text-[10px] uppercase font-semibold">Issue Date</span>
                    <span className="text-white/90">{activeCert.issueDate}</span>
                  </div>
                  {activeCert.expiryDate && (
                    <div>
                      <span className="text-white/40 block text-[10px] uppercase font-semibold">Expiration Date</span>
                      <span className="text-white/90">{activeCert.expiryDate}</span>
                    </div>
                  )}
                  {activeCert.credentialId && (
                    <div>
                      <span className="text-white/40 block text-[10px] uppercase font-semibold">Credential ID</span>
                      <span className="font-mono text-emerald-400 text-[11px] select-all break-all">
                        {activeCert.credentialId}
                      </span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <h4 className="text-[11px] font-bold uppercase text-white/40 mb-1">
                    Credential Scope
                  </h4>
                  <p className="text-xs text-white/70 leading-relaxed">
                    {activeCert.description}
                  </p>
                </div>

                {/* Skills Badges */}
                <div>
                  <h4 className="text-[11px] font-bold uppercase text-white/40 mb-1.5">
                    Skills Validated
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {activeCert.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-white/80 font-mono"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-white/10 space-y-2">
                {activeCert.verifyUrl && (
                  <a
                    href={activeCert.verifyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4 text-white" />
                    <span>Verify on Official Issuer ↗</span>
                  </a>
                )}
                <a
                  href={activeCert.imageSrc}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-1.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white text-xs font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>View Full Certificate File</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
