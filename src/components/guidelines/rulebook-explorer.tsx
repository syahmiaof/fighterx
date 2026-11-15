"use client";

import { useState, useMemo } from "react";
import {
  Search,
  X,
  BookOpen,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Tag,
  Scale,
  Users,
  Video,
  Target,
  Swords,
  Sparkles,
} from "lucide-react";
import {
  RULE_ENTRIES,
  SENIOR_WEIGHT_DIVISIONS,
  AGE_DIVISIONS,
} from "@/lib/guidelines/rules-data";
import type { RuleCategory, RuleEntry } from "@/lib/guidelines/types";
import { useLanguage } from "@/lib/i18n";

export function RulebookExplorer() {
  const { locale } = useLanguage();
  const isEn = locale === "en";

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<RuleCategory>("ALL");
  const [expandedRuleId, setExpandedRuleId] = useState<string | null>(null);

  const categoryTabs: { id: RuleCategory; label: string; icon: typeof Swords }[] = [
    { id: "ALL", label: isEn ? "All Rules" : "Semua Peraturan", icon: BookOpen },
    { id: "TANDING_SCORING", label: isEn ? "Silat Olahraga Scoring" : "Mata Silat Olahraga", icon: Swords },
    { id: "JURUS_RUBRICS", label: isEn ? "Silat Seni Rubrics" : "Rubrik Silat Seni", icon: Sparkles },
    { id: "TARGET_ZONES_FOULS", label: isEn ? "Targets & Fouls" : "Sasaran & Kesalahan", icon: Target },
    { id: "VAR_PROTOCOL", label: isEn ? "VAR Protocol" : "Protokol VAR", icon: Video },
    { id: "WEIGHT_AGE_CLASSES", label: isEn ? "Weight & Age Classes" : "Kelas Berat & Umur", icon: Scale },
  ];

  // Filtered rules
  const filteredRules = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return RULE_ENTRIES.filter((rule) => {
      // Category filter
      if (activeCategory !== "ALL" && rule.category !== activeCategory) {
        return false;
      }

      // Search query filter
      if (!q) return true;

      const titleMatch = rule.title.toLowerCase().includes(q);
      const titleEnMatch = rule.titleEn?.toLowerCase().includes(q);
      const summaryMatch = rule.summary.toLowerCase().includes(q);
      const summaryEnMatch = rule.summaryEn?.toLowerCase().includes(q);
      const citationMatch = rule.citation.toLowerCase().includes(q);
      const citationEnMatch = rule.citationEn?.toLowerCase().includes(q);
      const detailsMatch = rule.details.some((d) => d.toLowerCase().includes(q));
      const detailsEnMatch = rule.detailsEn?.some((d) => d.toLowerCase().includes(q));
      const tagsMatch = rule.tags.some((t) => t.toLowerCase().includes(q));

      return (
        titleMatch ||
        titleEnMatch ||
        summaryMatch ||
        summaryEnMatch ||
        citationMatch ||
        citationEnMatch ||
        detailsMatch ||
        detailsEnMatch ||
        tagsMatch
      );
    });
  }, [searchQuery, activeCategory]);

  const toggleExpand = (id: string) => {
    setExpandedRuleId((prev) => (prev === id ? null : id));
  };

  const getSeverityBadge = (severity?: RuleEntry["severity"]) => {
    switch (severity) {
      case "critical":
        return {
          bg: "bg-[rgba(255,56,69,0.16)] text-[#ff4d5a] border-[rgba(255,56,69,0.4)]",
          label: "KRITIKAL / DQ",
        };
      case "danger":
        return {
          bg: "bg-[rgba(255,56,69,0.10)] text-[#ff8088] border-[rgba(255,56,69,0.25)]",
          label: isEn ? "SEVERE FOUL" : "PELANGGARAN BERAT",
        };
      case "warning":
        return {
          bg: "bg-[rgba(240,180,40,0.12)] text-[#ffd24c] border-[rgba(240,180,40,0.35)]",
          label: isEn ? "WARNING / DEDUCTION" : "AMARAN / POTONGAN",
        };
      case "info":
      default:
        return {
          bg: "bg-[rgba(60,160,255,0.12)] text-[#64b7ff] border-[rgba(60,160,255,0.35)]",
          label: isEn ? "OFFICIAL RULE" : "PERATURAN RASMI",
        };
    }
  };

  return (
    <div className="rounded-[14px] sm:rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 sm:p-7 backdrop-blur-[16px] shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-5 border-b border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-[rgba(255,56,69,0.12)] border border-[rgba(255,56,69,0.35)] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#ff4d5a] backdrop-blur-sm">
            <BookOpen size={13} aria-hidden="true" />
            {isEn ? "PERSILAT 2026 Database" : "Pangkalan Data PERSILAT 2026"}
          </div>
          <h3 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-white font-[var(--font-athletic)] uppercase">
            {isEn ? "Interactive Tournament Rules Reference" : "Rujukan Peraturan Kejohanan Interaktif"}
          </h3>
          <p className="text-xs text-[#a3a4ab] max-w-xl">
            {isEn
              ? "Search rules by keyword, official clause, scoring target, disciplinary infractions, and VAR challenge protocols."
              : "Cari peraturan mengikut kata kunci, klausa rasmi, sasaran serangan, kesalahan disiplin, dan protokol cabaran VAR."}
          </p>
        </div>

        <div className="text-right self-start sm:self-auto">
          <span className="text-xs text-[#A6A7AD]">
            {isEn ? "Matching Rules" : "Ketetapan Padanan"}
          </span>
          <div className="text-xl sm:text-2xl font-bold text-white font-[var(--font-athletic)]">
            {filteredRules.length} / {RULE_ENTRIES.length} {isEn ? "Rules" : "Peraturan"}
          </div>
        </div>
      </div>

      {/* Search Bar (Frosted Glass) */}
      <div className="mt-5 relative">
        <div className="relative flex items-center">
          <Search
            size={18}
            className="absolute left-3.5 text-white/40 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              isEn
                ? "Search rules (e.g. takedown, var, reprimand, 5 seconds, head, golok, toya, weigh-in)..."
                : "Cari peraturan (contoh: bantingan, var, teguran, 5 saat, kepala, golok, toya, timbang)..."
            }
            className="w-full rounded-xl border border-white/[0.08] bg-white/[0.035] pl-10 pr-10 py-3 text-sm text-white placeholder-white/30 focus:border-[rgba(255,56,69,0.5)] focus:bg-white/[0.05] focus:outline-none focus:ring-1 focus:ring-[#ff3845] backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-colors"
            aria-label={isEn ? "Search rulebook" : "Cari buku peraturan"}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 text-white/50 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              aria-label={isEn ? "Clear search" : "Kosongkan carian"}
            >
              <X size={16} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Pills (Glass) */}
      <div className="mt-4 flex flex-wrap gap-2">
        {categoryTabs.map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeCategory === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveCategory(tab.id)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer backdrop-blur-md ${
                isSelected
                  ? "bg-[#e10600] border border-[#ff3845] text-white shadow-[0_0_16px_rgba(225,6,0,0.4)]"
                  : "border border-white/[0.08] bg-white/[0.035] text-[#b5b6bc] hover:bg-white/[0.08] hover:border-white/20 hover:text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
              }`}
            >
              <Icon size={14} aria-hidden="true" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Rule Cards Grid */}
      <div className="mt-6 space-y-3.5">
        {filteredRules.length > 0 ? (
          filteredRules.map((rule) => {
            const isExpanded = expandedRuleId === rule.id;
            const badge = getSeverityBadge(rule.severity);
            const title = isEn ? (rule.titleEn || rule.title) : rule.title;
            const summary = isEn ? (rule.summaryEn || rule.summary) : rule.summary;
            const citation = isEn ? (rule.citationEn || rule.citation) : rule.citation;
            const details = isEn && rule.detailsEn ? rule.detailsEn : rule.details;

            return (
              <article
                key={rule.id}
                className="rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.15] p-4 sm:p-5 transition-colors backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span
                        className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border backdrop-blur-sm ${badge.bg}`}
                      >
                        {badge.label}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] text-[#A6A7AD]">
                        <Tag size={11} aria-hidden="true" />
                        {citation}
                      </span>
                    </div>

                    <h4 className="text-lg sm:text-xl font-bold text-white font-[var(--font-athletic)] tracking-wide">
                      {title}
                    </h4>

                    <p className="mt-2 text-xs text-[#C5C6CA] leading-relaxed">{summary}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleExpand(rule.id)}
                    className="self-start sm:self-center inline-flex items-center gap-1.5 rounded-xl border border-white/[0.12] bg-white/[0.04] hover:bg-white/[0.08] text-white px-3.5 py-1.5 text-xs font-semibold backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-colors cursor-pointer shrink-0"
                    aria-expanded={isExpanded}
                  >
                    {isExpanded ? (
                      <>
                        {isEn ? "Collapse" : "Ringkaskan"} <ChevronUp size={14} aria-hidden="true" />
                      </>
                    ) : (
                      <>
                        {isEn ? "Official Details" : "Perincian Sah"} <ChevronDown size={14} aria-hidden="true" />
                      </>
                    )}
                  </button>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="mt-4 pt-3.5 border-t border-white/[0.08] text-xs space-y-2">
                    <strong className="block text-[11px] font-bold text-[#ffd24c] uppercase tracking-wider">
                      {isEn ? "Official Clauses & Execution Stipulations:" : "Klausa & Syarat Pelaksanaan Rasmi:"}
                    </strong>
                    <ul className="space-y-1.5 pl-4 list-disc text-slate-200">
                      {details.map((point, index) => (
                        <li key={index} className="leading-relaxed">
                          {point}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-3 flex flex-wrap gap-1.5 pt-2">
                      {rule.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md bg-white/[0.04] border border-white/[0.08] px-2 py-0.5 text-[10px] text-white/70 backdrop-blur-sm"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </article>
            );
          })
        ) : (
          <div className="rounded-xl border border-dashed border-white/[0.15] p-8 text-center bg-white/[0.015] backdrop-blur-md">
            <BookOpen size={32} className="mx-auto text-white/30" aria-hidden="true" />
            <h5 className="mt-2 text-base font-bold text-white font-[var(--font-athletic)] uppercase">
              {isEn ? "No Rules Found" : "Tiada Peraturan Dijumpai"}
            </h5>
            <p className="mt-1 text-xs text-[#A6A7AD] max-w-sm mx-auto">
              {isEn
                ? `Search for "${searchQuery}" yielded no results. Try keywords such as "takedown", "var", "reprimand", "toya", or "weigh-in".`
                : `Carian bagi "${searchQuery}" tidak menemui sebarang padanan. Cuba kata kunci seperti "bantingan", "var", "teguran", "toya", atau "timbang".`}
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("ALL");
              }}
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[#e10600] border border-[#ff3845] px-4 py-2 text-xs font-semibold text-white shadow-[0_0_16px_rgba(225,6,0,0.4)] transition-colors cursor-pointer"
            >
              {isEn ? "Show All Rules" : "Papar Semua Peraturan"}
            </button>
          </div>
        )}
      </div>

      {/* Tables: Weight Categories & Age Divisions (when Category is WEIGHT_AGE_CLASSES or ALL) */}
      {(activeCategory === "WEIGHT_AGE_CLASSES" || activeCategory === "ALL") && (
        <div className="mt-10 pt-8 border-t border-white/[0.08] space-y-8">
          {/* Weight Divisions Table (Frosted Glass) */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <Scale size={18} className="text-[#ff4d5a]" aria-hidden="true" />
                <h4 className="text-lg font-bold text-white font-[var(--font-athletic)] uppercase tracking-wide">
                  {isEn ? "Senior Weight Divisions Table" : "Jadual Kategori Berat Dewasa (Senior)"}
                </h4>
              </div>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#ff4d5a] bg-[rgba(255,56,69,0.12)] border border-[rgba(255,56,69,0.35)] px-3 py-1 rounded-full backdrop-blur-sm">
                <ShieldAlert size={12} aria-hidden="true" />
                {isEn ? "Zero Weigh-In Tolerance (0.00 kg)" : "Sifar Toleransi Berat (0.00 kg)"}
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-white/[0.08] backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)]">
              <table className="w-full text-left text-xs text-slate-200">
                <thead className="bg-white/[0.04] text-white/70 uppercase text-[10px] font-bold tracking-wider border-b border-white/[0.08] backdrop-blur-md">
                  <tr>
                    <th scope="col" className="px-4 py-3">{isEn ? "Class" : "Kelas"}</th>
                    <th scope="col" className="px-4 py-3">{isEn ? "Category Name" : "Nama Kategori"}</th>
                    <th scope="col" className="px-4 py-3">{isEn ? "Male Weight Limit" : "Had Berat Lelaki"}</th>
                    <th scope="col" className="px-4 py-3">{isEn ? "Female Weight Limit" : "Had Berat Wanita"}</th>
                    <th scope="col" className="px-4 py-3">{isEn ? "Tournament Notes" : "Catatan Kejohanan"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05] bg-white/[0.015] backdrop-blur-md">
                  {SENIOR_WEIGHT_DIVISIONS.map((row) => (
                    <tr key={row.classLetter} className="hover:bg-white/[0.04] transition-colors">
                      <td className="px-4 py-2.5 font-bold text-white">{row.classLetter}</td>
                      <td className="px-4 py-2.5 text-white/90">{isEn && row.nameEn ? row.nameEn : row.name}</td>
                      <td className="px-4 py-2.5 font-mono text-[#ffd24c] font-semibold">{row.maleRange}</td>
                      <td className="px-4 py-2.5 font-mono text-[#64b7ff] font-semibold">{row.femaleRange || "—"}</td>
                      <td className="px-4 py-2.5 text-[11px] text-[#A6A7AD]">{isEn && row.notesEn ? row.notesEn : row.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Age Divisions Table (Frosted Glass) */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Users size={18} className="text-[#64b7ff]" aria-hidden="true" />
              <h4 className="text-lg font-bold text-white font-[var(--font-athletic)] uppercase tracking-wide">
                {isEn ? "Age Divisions & Round Standards" : "Kategori Umur & Format Pusingan"}
              </h4>
            </div>

            <div className="overflow-x-auto rounded-xl border border-white/[0.08] backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)]">
              <table className="w-full text-left text-xs text-slate-200">
                <thead className="bg-white/[0.04] text-white/70 uppercase text-[10px] font-bold tracking-wider border-b border-white/[0.08] backdrop-blur-md">
                  <tr>
                    <th scope="col" className="px-4 py-3">{isEn ? "Age Division" : "Kategori Umur"}</th>
                    <th scope="col" className="px-4 py-3">{isEn ? "Age Span" : "Had Umur"}</th>
                    <th scope="col" className="px-4 py-3">{isEn ? "Round Format" : "Format Pusingan"}</th>
                    <th scope="col" className="px-4 py-3">{isEn ? "Execution Notes" : "Syarat Pelaksanaan"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05] bg-white/[0.015] backdrop-blur-md">
                  {AGE_DIVISIONS.map((row) => (
                    <tr key={row.division} className="hover:bg-white/[0.04] transition-colors">
                      <td className="px-4 py-2.5 font-bold text-white">{isEn && row.divisionEn ? row.divisionEn : row.division}</td>
                      <td className="px-4 py-2.5 text-[#ffd24c] font-semibold">
                        {isEn ? row.ageSpan.replace("Bawah", "Under").replace("tahun ke atas", "years & above").replace("tahun", "years") : row.ageSpan}
                      </td>
                      <td className="px-4 py-2.5 text-white/90">{isEn && row.roundFormatEn ? row.roundFormatEn : row.roundFormat}</td>
                      <td className="px-4 py-2.5 text-[11px] text-[#A6A7AD]">{isEn && row.notesEn ? row.notesEn : row.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
