"use client";

import React, { useState } from "react";
import {
  BookOpen,
  User,
  Shield,
  HeartHandshake,
  Clock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { KNOWLEDGE_ARTICLES, KnowledgeArticle } from "./knowledge-data";
import { useLanguage } from "@/lib/i18n";

export interface RoleKnowledgeVaultProps {
  onOpenArticle: (article: KnowledgeArticle) => void;
}

export function RoleKnowledgeVault({ onOpenArticle }: RoleKnowledgeVaultProps) {
  const { locale } = useLanguage();
  const isEn = locale === "en";

  const [activeRole, setActiveRole] = useState<"athlete" | "coach" | "parent">("athlete");

  // Filter articles based on stakeholder relevance
  const athleteArticles = KNOWLEDGE_ARTICLES.filter(
    (a) =>
      a.id === "art-periodization" ||
      a.id === "art-conditioning" ||
      a.id === "art-nutrition" ||
      a.id === "art-weight-management" ||
      a.id === "art-recovery" ||
      a.id === "art-stakeholder-athlete"
  );

  const coachArticles = KNOWLEDGE_ARTICLES.filter(
    (a) =>
      a.id === "art-periodization" ||
      a.id === "art-conditioning" ||
      a.id === "art-stakeholder-coach" ||
      a.id === "art-weight-management"
  );

  const parentArticles = KNOWLEDGE_ARTICLES.filter(
    (a) =>
      a.id === "art-stakeholder-parent" ||
      a.id === "art-nutrition" ||
      a.id === "art-recovery"
  );

  const currentArticles =
    activeRole === "athlete"
      ? athleteArticles
      : activeRole === "coach"
      ? coachArticles
      : parentArticles;

  return (
    <section id="pustaka-panduan" className="py-14 border-b border-white/[0.08] scroll-mt-24">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="inline-block px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold tracking-widest text-[#FF4D5A] bg-[rgba(255,56,69,0.12)] border border-[rgba(255,56,69,0.35)] uppercase mb-2.5">
            {isEn ? "ROLE-BASED KNOWLEDGE VAULT" : "PUSTAKA ILMU MENGIKUT PERANAN"}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-athletic uppercase tracking-wide text-white">
            {isEn ? "Curated Sports Science Guides" : "Panduan Khusus Mengikut Peranan"}
          </h2>
          <p className="text-xs sm:text-sm text-[#A2A3AA] mt-2 leading-relaxed">
            {isEn
              ? "Select your role to access peer-reviewed scientific articles, practical recovery protocols, and tactical blueprints."
              : "Pilih peranan anda untuk membaca modul sains sukan yang relevan dengan tanggungjawab anda."}
          </p>
        </div>

        {/* 3 Role Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          <button
            type="button"
            onClick={() => setActiveRole("athlete")}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-athletic text-sm font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeRole === "athlete"
                ? "bg-[#E10600] text-white shadow-[0_0_20px_rgba(225,6,0,0.3)] border border-[#FF3845]"
                : "bg-white/[0.04] text-[#C5C6CA] hover:text-white border border-white/[0.08]"
            }`}
          >
            <User size={15} />
            <span>{isEn ? "For Silat Athletes" : "Untuk Pesilat (Atlet)"}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveRole("coach")}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-athletic text-sm font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeRole === "coach"
                ? "bg-[#E10600] text-white shadow-[0_0_20px_rgba(225,6,0,0.3)] border border-[#FF3845]"
                : "bg-white/[0.04] text-[#C5C6CA] hover:text-white border border-white/[0.08]"
            }`}
          >
            <Shield size={15} />
            <span>{isEn ? "For Coaches" : "Untuk Jurulatih (Coach)"}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveRole("parent")}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-athletic text-sm font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeRole === "parent"
                ? "bg-[#E10600] text-white shadow-[0_0_20px_rgba(225,6,0,0.3)] border border-[#FF3845]"
                : "bg-white/[0.04] text-[#C5C6CA] hover:text-white border border-white/[0.08]"
            }`}
          >
            <HeartHandshake size={15} />
            <span>{isEn ? "For Parents & Guardians" : "Untuk Ibu Bapa & Penjaga"}</span>
          </button>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentArticles.map((art) => (
            <article
              key={art.id}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.025] hover:border-white/20 hover:bg-white/[0.04] p-6 backdrop-blur-[16px] shadow-lg transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3 text-[11px] text-[#8E9099]">
                  <span className="px-2.5 py-0.5 rounded-full font-mono font-bold uppercase tracking-wider bg-white/5 border border-white/10 text-slate-200">
                    {art.categoryLabel}
                  </span>
                  <span className="flex items-center gap-1 font-medium">
                    <Clock size={12} className="text-[#FF4D5A]" />
                    {art.readTime}
                  </span>
                </div>

                <h3 className="text-base font-bold font-athletic text-white uppercase tracking-wide group-hover:text-[#FF555A] transition-colors mb-2 leading-snug">
                  {art.title}
                </h3>

                <p className="text-xs text-[#A2A3AA] leading-relaxed mb-4 line-clamp-3">
                  {art.summary}
                </p>

                {/* Key Takeaways snippet */}
                <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06] mb-4 space-y-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold block">
                    FAKTA SAINS UTAMA:
                  </span>
                  <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                    {art.keyTakeaways[0]}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-[11px] text-[#8E9099] truncate max-w-[180px]">
                  {art.reviewedBy}
                </span>

                <button
                  type="button"
                  onClick={() => onOpenArticle(art)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#FF4D5A] hover:text-white transition-colors cursor-pointer shrink-0"
                >
                  <span>Baca Modul</span>
                  <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
