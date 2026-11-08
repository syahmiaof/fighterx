"use client";

import React, { useState } from "react";
import {
  ClipboardCheck,
  Activity,
  Sparkles,
  Swords,
  ChevronDown,
  ChevronUp,
  Edit,
  Award,
} from "lucide-react";
import type { AssessmentRubric, RubricType } from "@/lib/admin/types";
import { useAdminState } from "@/lib/admin/store";
import { AdminBadge } from "@/components/admin/ui/admin-badge";
import { AdminButton } from "@/components/admin/ui/admin-button";
import { RubricEditorModal } from "./rubric-editor-modal";

export function AssessmentRubricsManager() {
  const { rubrics: initialRubrics, assessments } = useAdminState();

  // Local state for modified rubrics so admin can edit criteria live
  const [rubrics, setRubrics] = useState<AssessmentRubric[]>(initialRubrics);
  const [activeCategory, setActiveCategory] = useState<"ALL" | RubricType>("ALL");
  const [expandedRubricId, setExpandedRubricId] = useState<string | null>(
    rubrics[0]?.id || null
  );

  // Editor Modal state
  const [editingRubric, setEditingRubric] = useState<AssessmentRubric | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // Save updated rubric
  const handleSaveRubric = (updated: AssessmentRubric) => {
    setRubrics((prev) =>
      prev.map((r) => (r.id === updated.id ? updated : r))
    );
  };

  const filteredRubrics = rubrics.filter((r) => {
    if (activeCategory === "ALL") return true;
    return r.type === activeCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#27272A]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E10600]/15 border border-[#FF3845]/30 text-[#FF555A] text-xs font-semibold mb-2">
            <ClipboardCheck className="w-3.5 h-3.5" />
            <span>Rubrik & Bateri Ujian Prestasi Silat Kebangsaan</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Pengurusan Rubrik Penilaian & Ujian Standard
          </h1>
          <p className="text-xs sm:text-sm text-[#96989F] mt-1">
            Penetapan standard bateri ujian fizikal asas ISN dan rubrik pemarkahan teknikal PERSILAT 2027.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <AdminBadge variant="accent" size="md">
            Piawaian ISN & PERSILAT 2027
          </AdminBadge>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setActiveCategory("ALL")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeCategory === "ALL"
              ? "bg-[#E10600] text-white shadow-lg"
              : "bg-[#17191E] border border-[#27272A] text-[#96989F] hover:text-white"
          }`}
        >
          Semua Rubrik ({rubrics.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveCategory("BASELINE_PHYSICAL")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeCategory === "BASELINE_PHYSICAL"
              ? "bg-[#E10600] text-white shadow-lg"
              : "bg-[#17191E] border border-[#27272A] text-[#96989F] hover:text-white"
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          Fizikal Asas ISN (4 Ujian)
        </button>

        <button
          type="button"
          onClick={() => setActiveCategory("TECHNICAL_SENI")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeCategory === "TECHNICAL_SENI"
              ? "bg-[#E10600] text-white shadow-lg"
              : "bg-[#17191E] border border-[#27272A] text-[#96989F] hover:text-white"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#FF555A]" />
          Teknikal Silat Seni
        </button>

        <button
          type="button"
          onClick={() => setActiveCategory("TECHNICAL_OLAHRAGA")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeCategory === "TECHNICAL_OLAHRAGA"
              ? "bg-[#E10600] text-white shadow-lg"
              : "bg-[#17191E] border border-[#27272A] text-[#96989F] hover:text-white"
          }`}
        >
          <Swords className="w-3.5 h-3.5 text-[#38BDF8]" />
          Teknikal Silat Olahraga
        </button>
      </div>

      {/* Rubrics Grid */}
      <div className="space-y-4">
        {filteredRubrics.map((rubric) => {
          const isExpanded = expandedRubricId === rubric.id;
          const isPhysical = rubric.type === "BASELINE_PHYSICAL";
          const isSeni = rubric.type === "TECHNICAL_SENI";

          return (
            <div
              key={rubric.id}
              className="rounded-xl bg-[#17191E] border border-[#27272A] overflow-hidden shadow-lg transition-all"
            >
              {/* Card Header Bar */}
              <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#17191E] to-[#1E2027]">
                <div className="flex items-start gap-3.5 min-w-0">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 border ${
                      isPhysical
                        ? "bg-[#E10600]/20 text-[#FF555A] border-[#FF3845]/40"
                        : isSeni
                        ? "bg-[#F59E0B]/20 text-[#FBBF24] border-[#F59E0B]/40"
                        : "bg-[#38BDF8]/20 text-[#60A5FA] border-[#38BDF8]/40"
                    }`}
                  >
                    {isPhysical ? (
                      <Activity className="w-5 h-5" />
                    ) : isSeni ? (
                      <Sparkles className="w-5 h-5" />
                    ) : (
                      <Swords className="w-5 h-5" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="text-base font-bold text-white truncate">
                        {rubric.title}
                      </h3>
                      <AdminBadge
                        variant={isPhysical ? "accent" : isSeni ? "warning" : "info"}
                        size="sm"
                      >
                        {rubric.type}
                      </AdminBadge>
                    </div>
                    <p className="text-xs text-[#96989F] leading-relaxed">
                      {rubric.description}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2.5 self-end md:self-auto flex-shrink-0">
                  <AdminButton
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingRubric(rubric);
                      setIsEditorOpen(true);
                    }}
                    className="flex items-center gap-1.5 text-xs"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    Kemaskini Kriteria
                  </AdminButton>

                  <button
                    type="button"
                    onClick={() =>
                      setExpandedRubricId(isExpanded ? null : rubric.id)
                    }
                    className="p-2 rounded-lg bg-[#202126] hover:bg-[#282A32] text-[#C5C6CA] border border-[#27272A] transition-colors"
                    aria-label={isExpanded ? "Tutup kriteria" : "Buka kriteria"}
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Criteria Expandable Section */}
              {isExpanded && (
                <div className="p-5 border-t border-[#27272A] bg-[#121317]/80 space-y-4">
                  <div className="flex items-center justify-between text-xs text-[#96989F] pb-2 border-b border-[#27272A]/70">
                    <span className="font-bold text-white uppercase tracking-wider">
                      Senarai Kriteria & Penanda Aras ({rubric.criteria.length})
                    </span>
                    <span className="font-mono">Skor Maksimum: 100 Mata</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {rubric.criteria.map((crit, idx) => (
                      <div
                        key={crit.id}
                        className="p-4 rounded-xl bg-[#1A1C23] border border-[#27272A] space-y-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="text-xs font-bold text-white flex items-center gap-1.5">
                              <span className="w-5 h-5 rounded-full bg-[#E10600]/20 text-[#FF555A] font-mono inline-flex items-center justify-center text-[11px] font-bold">
                                {idx + 1}
                              </span>
                              {crit.name}
                            </div>
                            <div className="text-[11px] text-[#96989F] mt-1">
                              {crit.description}
                            </div>
                          </div>
                          {crit.unit && (
                            <span className="px-2 py-0.5 rounded bg-[#202126] border border-[#37383D] text-[10px] font-mono text-[#C5C6CA] flex-shrink-0">
                              Unit: {crit.unit}
                            </span>
                          )}
                        </div>

                        {/* Benchmark Values Tier List */}
                        {crit.benchmarkValues && (
                          <div className="pt-2 border-t border-[#27272A]/70">
                            <div className="text-[10px] font-bold text-[#96989F] uppercase mb-1.5">
                              Penanda Aras Penilaian:
                            </div>
                            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                              <div className="p-1.5 rounded bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#4ADE80]">
                                <strong>Cemerlang:</strong> {crit.benchmarkValues.cemerlang}
                              </div>
                              <div className="p-1.5 rounded bg-[#38BDF8]/10 border border-[#38BDF8]/20 text-[#60A5FA]">
                                <strong>Baik:</strong> {crit.benchmarkValues.baik}
                              </div>
                              <div className="p-1.5 rounded bg-[#F59E0B]/10 border border-[#F59E0B]/20 text-[#FBBF24]">
                                <strong>Memuaskan:</strong> {crit.benchmarkValues.memuaskan}
                              </div>
                              <div className="p-1.5 rounded bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#F87171]">
                                <strong>Perlu Bimbingan:</strong> {crit.benchmarkValues.perluBimbingan}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Recent Athlete Assessment Records Table */}
      <div className="rounded-xl bg-[#17191E] border border-[#27272A] p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#27272A]">
          <div>
            <h3 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
              <Award className="w-4 h-4 text-[#FF3845]" />
              Rekod Ujian & Penilaian Terkini Atlet
            </h3>
            <p className="text-xs text-[#96989F]">
              Keputusan ujian fizikal asas dan teknikal yang dinilai oleh jurulatih
            </p>
          </div>
          <span className="text-xs text-[#96989F] font-mono">
            {assessments.length} Rekod Tersimpan
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#27272A] text-[#96989F] uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-3">Nama Atlet</th>
                <th className="py-2.5 px-3">Kelab & Disiplin</th>
                <th className="py-2.5 px-3">Rubrik Ujian</th>
                <th className="py-2.5 px-3 text-center">Skor</th>
                <th className="py-2.5 px-3 text-center">Taraf</th>
                <th className="py-2.5 px-3">Catatan Jurulatih</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272A]/60 text-[#E5E5E7]">
              {assessments.map((ass) => (
                <tr key={ass.id} className="hover:bg-[#202126]/60 transition-colors">
                  <td className="py-2.5 px-3">
                    <div className="font-bold text-white">{ass.athleteName}</div>
                    <div className="text-[10px] text-[#96989F]">
                      {new Date(ass.date).toLocaleDateString("ms-MY", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                  </td>
                  <td className="py-2.5 px-3">
                    <div>{ass.clubName}</div>
                    <AdminBadge
                      variant={ass.discipline === "Silat Seni" ? "warning" : "info"}
                      size="sm"
                      className="mt-0.5"
                    >
                      {ass.discipline}
                    </AdminBadge>
                  </td>
                  <td className="py-2.5 px-3 font-medium text-[#C5C6CA]">
                    {ass.rubricTitle}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono font-black text-sm text-white">
                    {ass.score}/100
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <AdminBadge
                      variant={
                        ass.ratingTier === "Cemerlang"
                          ? "success"
                          : ass.ratingTier === "Baik"
                          ? "info"
                          : ass.ratingTier === "Memuaskan"
                          ? "warning"
                          : "danger"
                      }
                      size="sm"
                    >
                      {ass.ratingTier}
                    </AdminBadge>
                  </td>
                  <td className="py-2.5 px-3 text-xs text-[#96989F] italic max-w-xs truncate">
                    {ass.coachNotes || "Tiada catatan"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Editor Modal */}
      <RubricEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        rubric={editingRubric}
        onSave={handleSaveRubric}
      />
    </div>
  );
}
