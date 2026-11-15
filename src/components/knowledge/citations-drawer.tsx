"use client";

import { useState } from "react";
import {
  BookOpen,
  Search,
  ExternalLink,
  Copy,
  Check,
  X,
} from "lucide-react";
import { SCIENTIFIC_CITATIONS, ScientificCitation } from "./knowledge-data";
import { useLanguage } from "@/lib/i18n";

interface CitationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CitationsDrawer({ isOpen, onClose }: CitationsDrawerProps) {
  const { locale } = useLanguage();
  const isEn = locale === "en";

  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredCitations = SCIENTIFIC_CITATIONS.filter((cit) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      cit.title.toLowerCase().includes(q) ||
      cit.authors.toLowerCase().includes(q) ||
      cit.journal.toLowerCase().includes(q) ||
      cit.keyFinding.toLowerCase().includes(q) ||
      (cit.institution && cit.institution.toLowerCase().includes(q))
    );
  });

  const handleCopyCitation = (cit: ScientificCitation) => {
    const text = `${cit.authors} (${cit.year}). ${cit.title}. ${cit.journal}, ${cit.volumeOrDetails}.${
      cit.doiOrUrl ? ` ${cit.doiOrUrl}` : ""
    }`;
    navigator.clipboard.writeText(text);
    setCopiedId(cit.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="citations-drawer-title"
    >
      <div className="knowledge-modal-shell relative w-full max-w-3xl max-h-[88vh] rounded-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/[0.08] bg-white/[0.02] flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#E10600]/15 text-[#FF555C] text-[10px] font-bold uppercase tracking-wider mb-2 border border-[#FF3845]/30">
              <BookOpen size={12} />
              <span>
                {isEn ? "Sports Science Bibliographic Archive" : "Arkib Bibliografi Sains Sukan"}
              </span>
            </div>
            <h3 id="citations-drawer-title" className="text-2xl font-bold font-athletic text-white tracking-wide uppercase">
              {isEn ? "SCIENTIFIC REFERENCES & RESEARCH STUDIES" : "SUMBER RUJUKAN & KAJIAN SAINTIFIK"}
            </h3>
            <p className="text-xs text-[#A2A3AA] mt-1">
              {isEn
                ? "All training and physiological frameworks in FighterX are derived from National Sports Institute (ISN), PERSILAT, and international peer-reviewed sports science journals."
                : "Semua panduan di FighterX berlandaskan penerbitan Institut Sukan Negara (ISN), PERSILAT, dan jurnal perubatan sukan antarabangsa."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg bg-white/[0.04] text-[#A2A3AA] border border-white/10 hover:text-white hover:bg-white/[0.08] transition-colors"
            aria-label={isEn ? "Close reference archive" : "Tutup arkib rujukan"}
          >
            <X size={18} />
          </button>
        </div>

        {/* Search Filter */}
        <div className="p-4 border-b border-white/[0.08] bg-white/[0.01]">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7E808A]" size={16} />
            <input
              type="text"
              placeholder={
                isEn
                  ? "Search citations: ISN, PERSILAT, ACSM, lactate, kicks, sleep..."
                  : "Cari rujukan: ISN, PERSILAT, ACSM, laktat, sepakan, tidur..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.04] text-xs text-white placeholder-[#787A82] focus:outline-none focus:border-[#FF3845] focus:bg-white/[0.06] transition-all"
            />
          </div>
        </div>

        {/* Citations List */}
        <div className="p-6 overflow-y-auto space-y-4 knowledge-drawer-scroll">
          {filteredCitations.length === 0 ? (
            <div className="text-center py-12 text-xs text-[#8E9099]">
              {isEn
                ? "No citations found matching your search query."
                : "Tiada rujukan sepadan dengan carian anda."}
            </div>
          ) : (
            filteredCitations.map((cit) => (
              <div
                key={cit.id}
                className="p-4 rounded-xl border border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/20 transition-all group"
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <span className="text-[10px] font-mono font-bold text-[#FF555C] uppercase tracking-wider">
                    {cit.id.toUpperCase()} · {cit.year}
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleCopyCitation(cit)}
                      className="px-2 py-1 rounded-md text-[10px] font-semibold border border-white/10 bg-white/[0.04] text-[#A2A3AA] hover:text-white hover:bg-white/[0.08] flex items-center gap-1 transition-colors"
                      title={isEn ? "Copy citation" : "Salin rujukan"}
                    >
                      {copiedId === cit.id ? (
                        <>
                          <Check size={11} className="text-emerald-400" />
                          <span className="text-emerald-400">{isEn ? "Copied" : "Disalin"}</span>
                        </>
                      ) : (
                        <>
                          <Copy size={11} />
                          <span>{isEn ? "Copy" : "Salin"}</span>
                        </>
                      )}
                    </button>
                    {cit.doiOrUrl && (
                      <a
                        href={cit.doiOrUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 rounded-md text-[#A2A3AA] hover:text-white transition-colors"
                        title={isEn ? "Open source link" : "Buka pautan rujukan"}
                      >
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </div>

                <h4 className="text-sm font-bold text-white mb-1 group-hover:text-[#FF555C] transition-colors leading-snug">
                  {cit.title}
                </h4>

                <div className="text-xs text-[#8E9099] mb-2 leading-relaxed">
                  <span className="text-[#C5C6CA]">{cit.authors}</span> · <em>{cit.journal}</em> ({cit.year}),{" "}
                  {cit.volumeOrDetails}.
                  {cit.institution && (
                    <span className="block text-[11px] text-[#7A7C85] mt-0.5 font-medium">
                      {isEn ? "Affiliation:" : "Institusi:"} {cit.institution}
                    </span>
                  )}
                </div>

                <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04] text-[11px] text-[#D1D2D7] leading-relaxed">
                  <strong className="text-[#FF858B] block mb-0.5">
                    {isEn ? "Key Scientific Finding:" : "Dapatan Utama:"}
                  </strong>
                  &ldquo;{cit.keyFinding}&rdquo;
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
