"use client";

import React, { useState } from "react";
import { Plus, Trash2, Save, Sparkles, CheckCircle2 } from "lucide-react";
import type { AssessmentRubric, AssessmentCriterion } from "@/lib/admin/types";
import { AdminModal } from "@/components/admin/ui/admin-modal";
import { AdminButton } from "@/components/admin/ui/admin-button";

export interface RubricEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  rubric: AssessmentRubric | null;
  onSave: (updatedRubric: AssessmentRubric) => void;
}

export function RubricEditorModal({
  isOpen,
  onClose,
  rubric,
  onSave,
}: RubricEditorModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [criteria, setCriteria] = useState<AssessmentCriterion[]>([]);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [prevRubric, setPrevRubric] = useState<AssessmentRubric | null>(null);
  if (rubric && rubric !== prevRubric) {
    setPrevRubric(rubric);
    setTitle(rubric.title);
    setDescription(rubric.description);
    setCriteria(JSON.parse(JSON.stringify(rubric.criteria)));
    setSavedSuccess(false);
  }

  if (!rubric) return null;

  const handleUpdateCriterion = (
    index: number,
    field: keyof AssessmentCriterion,
    value: unknown
  ) => {
    setCriteria((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleUpdateBenchmark = (
    critIdx: number,
    tier: "cemerlang" | "baik" | "memuaskan" | "perluBimbingan",
    val: string
  ) => {
    setCriteria((prev) => {
      const copy = [...prev];
      const crit = copy[critIdx];
      const benchmarks = crit.benchmarkValues || {
        cemerlang: "",
        baik: "",
        memuaskan: "",
        perluBimbingan: "",
      };
      copy[critIdx] = {
        ...crit,
        benchmarkValues: { ...benchmarks, [tier]: val },
      };
      return copy;
    });
  };

  const handleAddCriterion = () => {
    const newCrit: AssessmentCriterion = {
      id: `crit-custom-${Date.now()}`,
      name: "Kriteria Baharu",
      description: "Penerangan tatacara dan penilaian kriteria",
      maxScore: 100,
      unit: "skor",
      benchmarkValues: {
        cemerlang: ">= 85%",
        baik: "70% - 84%",
        memuaskan: "50% - 69%",
        perluBimbingan: "< 50%",
      },
    };
    setCriteria((prev) => [...prev, newCrit]);
  };

  const handleDeleteCriterion = (index: number) => {
    setCriteria((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSave = () => {
    const updated: AssessmentRubric = {
      ...rubric,
      title,
      description,
      criteria,
    };
    onSave(updated);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <AdminModal isOpen={isOpen} onClose={onClose} title={`Kemaskini Rubrik: ${rubric.title}`}>
      <div className="space-y-6 max-h-[75vh] overflow-y-auto pr-1">
        {savedSuccess && (
          <div className="p-3 rounded-lg bg-[#22C55E]/15 border border-[#22C55E]/40 text-[#4ADE80] text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Rubrik berjaya disimpan dan dikemas kini!</span>
          </div>
        )}

        {/* Rubric Info Fields */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-[#E5E5E7] mb-1">
              Nama Rubrik / Standard Ujian
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-[#202126] border border-[#37383D] rounded-lg text-xs text-white focus:outline-none focus:border-[#FF3845]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#E5E5E7] mb-1">
              Penerangan & Sumber Piawaian (ISN / PERSILAT)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-[#202126] border border-[#37383D] rounded-lg text-xs text-white focus:outline-none focus:border-[#FF3845]"
            />
          </div>
        </div>

        {/* Criteria Management */}
        <div className="space-y-4 pt-2 border-t border-[#27272A]">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#FF3845]" />
              Kriteria Penilaian ({criteria.length})
            </h4>

            <AdminButton
              variant="outline"
              size="sm"
              onClick={handleAddCriterion}
              className="flex items-center gap-1.5 text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              Tambah Kriteria
            </AdminButton>
          </div>

          <div className="space-y-3">
            {criteria.map((crit, idx) => (
              <div
                key={crit.id}
                className="p-3.5 rounded-xl bg-[#202126] border border-[#27272A] space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div className="sm:col-span-2">
                        <label className="text-[10px] text-[#96989F] uppercase font-bold">
                          Nama Kriteria #{idx + 1}
                        </label>
                        <input
                          type="text"
                          value={crit.name}
                          onChange={(e) =>
                            handleUpdateCriterion(idx, "name", e.target.value)
                          }
                          className="w-full px-2.5 py-1.5 bg-[#17191E] border border-[#37383D] rounded text-xs text-white focus:outline-none focus:border-[#FF3845]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-[#96989F] uppercase font-bold">
                          Unit / Metrik
                        </label>
                        <input
                          type="text"
                          value={crit.unit || ""}
                          placeholder="e.g. meter, reps, saat"
                          onChange={(e) =>
                            handleUpdateCriterion(idx, "unit", e.target.value)
                          }
                          className="w-full px-2.5 py-1.5 bg-[#17191E] border border-[#37383D] rounded text-xs text-white focus:outline-none focus:border-[#FF3845]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] text-[#96989F] uppercase font-bold">
                        Penerangan Teknikal
                      </label>
                      <input
                        type="text"
                        value={crit.description}
                        onChange={(e) =>
                          handleUpdateCriterion(idx, "description", e.target.value)
                        }
                        className="w-full px-2.5 py-1.5 bg-[#17191E] border border-[#37383D] rounded text-xs text-[#C5C6CA] focus:outline-none focus:border-[#FF3845]"
                      />
                    </div>

                    {/* Benchmark Tiers Inputs */}
                    <div className="pt-2 border-t border-[#27272A]/70">
                      <div className="text-[10px] font-bold text-[#96989F] mb-1.5 uppercase">
                        Penanda Aras Prestasi (Benchmarks)
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <div>
                          <span className="text-[10px] text-[#4ADE80] font-bold block mb-0.5">
                            Cemerlang (&gt;=85%)
                          </span>
                          <input
                            type="text"
                            value={crit.benchmarkValues?.cemerlang || ""}
                            onChange={(e) =>
                              handleUpdateBenchmark(idx, "cemerlang", e.target.value)
                            }
                            placeholder="e.g. >= 1,500m"
                            className="w-full px-2 py-1 bg-[#17191E] border border-[#37383D] rounded text-[11px] text-white"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] text-[#60A5FA] font-bold block mb-0.5">
                            Baik (70-84%)
                          </span>
                          <input
                            type="text"
                            value={crit.benchmarkValues?.baik || ""}
                            onChange={(e) =>
                              handleUpdateBenchmark(idx, "baik", e.target.value)
                            }
                            placeholder="e.g. 1,350m - 1,499m"
                            className="w-full px-2 py-1 bg-[#17191E] border border-[#37383D] rounded text-[11px] text-white"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] text-[#FBBF24] font-bold block mb-0.5">
                            Memuaskan (50-69%)
                          </span>
                          <input
                            type="text"
                            value={crit.benchmarkValues?.memuaskan || ""}
                            onChange={(e) =>
                              handleUpdateBenchmark(idx, "memuaskan", e.target.value)
                            }
                            placeholder="e.g. 1,200m - 1,349m"
                            className="w-full px-2 py-1 bg-[#17191E] border border-[#37383D] rounded text-[11px] text-white"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] text-[#F87171] font-bold block mb-0.5">
                            Perlu Bimbingan (&lt;50%)
                          </span>
                          <input
                            type="text"
                            value={crit.benchmarkValues?.perluBimbingan || ""}
                            onChange={(e) =>
                              handleUpdateBenchmark(idx, "perluBimbingan", e.target.value)
                            }
                            placeholder="e.g. < 1,200m"
                            className="w-full px-2 py-1 bg-[#17191E] border border-[#37383D] rounded text-[11px] text-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {criteria.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleDeleteCriterion(idx)}
                      className="p-1.5 rounded text-[#96989F] hover:text-[#F87171] hover:bg-[#EF4444]/15 transition-colors"
                      title="Padam kriteria ini"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#27272A]">
          <AdminButton variant="outline" size="sm" onClick={onClose}>
            Batal
          </AdminButton>
          <AdminButton
            variant="primary"
            size="sm"
            onClick={handleSave}
            className="flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            Simpan Perubahan Rubrik
          </AdminButton>
        </div>
      </div>
    </AdminModal>
  );
}
