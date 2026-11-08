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

interface CitationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CitationsDrawer({ isOpen, onClose }: CitationsDrawerProps) {
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
              <span>Arkib Bibliografi Sains Sukan</span>
            </div>
            <h3 id="citations-drawer-title" className="text-2xl font-bold font-athletic text-white tracking-wide uppercase">
              SUMBER RUJUKAN &amp; KAJIAN SAINTIFIK
            </h3>
            <p className="text-xs text-[#A2A3AA] mt-1">
              Semua panduan di FighterX berlandaskan penerbitan Institut Sukan Negara (ISN), PERSILAT, dan jurnal perubatan sukan antarabangsa.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg bg-white/[0.04] text-[#A2A3AA] border border-white/10 hover:text-white hover:bg-white/[0.08] transition-colors"
            aria-label="Tutup arkib rujukan"
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
              placeholder="Cari rujukan: ISN, PERSILAT, ACSM, laktat, sepakan, tidur..."
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
              Tiada rujukan sepadan dengan carian anda.
            </div>
          ) : (
            filteredCitations.map((cit) => (
              <div
                key={cit.id}
                className="p-4 rounded-xl knowledge-frosted-subcard space-y-2.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    {cit.institution && (
                      <span className="text-[10px] font-mono font-bold text-[#FF555C] uppercase tracking-wider block mb-1">
                        {cit.institution}
                      </span>
                    )}
                    <h4 className="text-xs sm:text-sm font-bold text-white leading-snug">
                      {cit.title}
                    </h4>
                    <p className="text-[11px] text-[#A2A3AA] mt-1">
                      {cit.authors} ({cit.year}). <em>{cit.journal}</em>, {cit.volumeOrDetails}.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopyCitation(cit)}
                    className="p-2 rounded-lg border border-white/10 bg-white/[0.04] text-[#B0B1B8] hover:text-white hover:border-[#FF3845] transition-all shrink-0 text-xs flex items-center gap-1.5"
                    title="Salin rujukan APA format"
                  >
                    {copiedId === cit.id ? (
                      <>
                        <Check size={14} className="text-emerald-400" />
                        <span className="text-[10px] text-emerald-400">Disalin</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        <span className="text-[10px]">Salin</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Key Finding Callout */}
                <div className="p-3 rounded-lg border border-amber-500/20 bg-amber-500/[0.04] text-[11px] text-[#D1D2D7] leading-relaxed">
                  <strong className="text-amber-400 block mb-0.5 text-[10px] uppercase tracking-wider">
                    Dapatan Utama Kajian:
                  </strong>
                  &quot;{cit.keyFinding}&quot;
                </div>

                {cit.doiOrUrl && (
                  <div className="pt-1 flex items-center gap-1 text-[10px] text-[#7A7C85]">
                    <ExternalLink size={11} />
                    <a
                      href={cit.doiOrUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white underline underline-offset-2 truncate"
                    >
                      {cit.doiOrUrl}
                    </a>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/[0.08] bg-white/[0.02] flex items-center justify-between text-xs text-[#8E9099]">
          <span>{filteredCitations.length} rujukan dijumpai</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-bold bg-[#E10600] text-white hover:bg-[#FF3845] transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
