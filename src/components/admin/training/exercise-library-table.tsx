"use client";

import React, { useState, useMemo } from "react";
import type { ExerciseDefinition, ExerciseCategory } from "@/lib/admin/types";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Video,
  Camera,
  FileText,
  Navigation,
  AlertCircle,
} from "lucide-react";
import { AdminButton } from "@/components/admin/ui/admin-button";
import { ExerciseModal } from "./exercise-modal";

export interface ExerciseLibraryTableProps {
  exercises: ExerciseDefinition[];
  onAddExercise: (data: Omit<ExerciseDefinition, "id">) => void;
  onUpdateExercise: (id: string, updates: Partial<ExerciseDefinition>) => void;
  onDeleteExercise: (id: string) => void;
}

const CATEGORIES: Array<"Semua" | ExerciseCategory> = [
  "Semua",
  "Cardio / Larian",
  "Kekuatan / Strength",
  "Teras / Core",
  "Ketangkasan / Agility",
  "Teknik Seni",
  "Teknik Olahraga",
];

export function ExerciseLibraryTable({
  exercises,
  onAddExercise,
  onUpdateExercise,
  onDeleteExercise,
}: ExerciseLibraryTableProps) {
  const [selectedCategory, setSelectedCategory] = useState<"Semua" | ExerciseCategory>("Semua");
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>("ALL");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState<ExerciseDefinition | null>(null);

  const filteredExercises = useMemo(() => {
    return exercises.filter((ex) => {
      // Category filter
      if (selectedCategory !== "Semua" && ex.category !== selectedCategory) {
        return false;
      }
      // Discipline filter
      if (selectedDiscipline !== "ALL" && ex.discipline !== selectedDiscipline) {
        return false;
      }
      // Difficulty filter
      if (selectedDifficulty !== "ALL" && ex.difficulty !== selectedDifficulty) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const matchName = ex.name.toLowerCase().includes(query);
        const matchCode = ex.code.toLowerCase().includes(query);
        const matchDesc = ex.instructions.toLowerCase().includes(query);
        return matchName || matchCode || matchDesc;
      }
      return true;
    });
  }, [exercises, selectedCategory, selectedDiscipline, selectedDifficulty, searchQuery]);

  const handleOpenCreate = () => {
    setEditingExercise(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (ex: ExerciseDefinition) => {
    setEditingExercise(ex);
    setModalOpen(true);
  };

  const handleSaveExercise = (
    data: Omit<ExerciseDefinition, "id">,
    existingId?: string
  ) => {
    if (existingId) {
      onUpdateExercise(existingId, data);
    } else {
      onAddExercise(data);
    }
  };

  return (
    <div className="space-y-5">
      {/* Search & Actions Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1 max-w-md relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-[#6B7280]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari senaman mengikut nama, kod unik atau teknik..."
            className="w-full bg-[#17191E] border border-[#27272A] rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-[#6B7280] focus:border-[#E10600] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <select
            value={selectedDiscipline}
            onChange={(e) => setSelectedDiscipline(e.target.value)}
            className="bg-[#17191E] border border-[#27272A] rounded-xl px-3 py-2 text-xs text-white focus:border-[#E10600] focus:outline-none"
          >
            <option value="ALL">Semua Disiplin</option>
            <option value="Shared">Shared (Kedua-dua)</option>
            <option value="Silat Seni">Silat Seni</option>
            <option value="Silat Olahraga">Silat Olahraga</option>
          </select>

          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="bg-[#17191E] border border-[#27272A] rounded-xl px-3 py-2 text-xs text-white focus:border-[#E10600] focus:outline-none"
          >
            <option value="ALL">Semua Tahap</option>
            <option value="Asas">Asas</option>
            <option value="Pertengahan">Pertengahan</option>
            <option value="Tinggi">Tinggi</option>
          </select>

          <AdminButton
            variant="primary"
            size="sm"
            onClick={handleOpenCreate}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Tambah Senaman
          </AdminButton>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 admin-scrollbar">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          const count =
            cat === "Semua"
              ? exercises.length
              : exercises.filter((e) => e.category === cat).length;

          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border cursor-pointer flex items-center gap-2 ${
                isSelected
                  ? "bg-[#E10600] text-white border-[#FF4D58] shadow-[0_0_12px_rgba(225,6,0,0.3)]"
                  : "bg-[#17191E] text-[#96989F] border-[#27272A] hover:bg-[#202126] hover:text-white"
              }`}
            >
              <span>{cat}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isSelected ? "bg-white/20 text-white" : "bg-[#27272A] text-[#96989F]"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Exercise Cards Grid */}
      {filteredExercises.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredExercises.map((ex) => {
            const hasVideo = ex.evidenceRequirements?.videoRequired;
            const hasPhoto = ex.evidenceRequirements?.photoRequired;
            const hasNote = ex.evidenceRequirements?.noteRequired;
            const hasGps = ex.evidenceRequirements?.gpsRequired;

            return (
              <div
                key={ex.id}
                className="bg-[#17191E] border border-[#27272A] hover:border-[#37383D] rounded-xl p-5 flex flex-col justify-between transition-all duration-200 group"
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-mono font-bold text-[#E10600] bg-[#E10600]/10 px-2 py-0.5 rounded border border-[#E10600]/25">
                      {ex.code}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#202126] text-[#C5C6CA] border border-[#37383D]">
                        {ex.discipline}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                          ex.difficulty === "Tinggi"
                            ? "bg-[#E10600]/20 text-[#FF4D58] border-[#FF4D58]/40"
                            : ex.difficulty === "Pertengahan"
                            ? "bg-[#F59E0B]/20 text-[#FBBF24] border-[#F59E0B]/40"
                            : "bg-[#38BDF8]/20 text-[#38BDF8] border-[#38BDF8]/40"
                        }`}
                      >
                        {ex.difficulty}
                      </span>
                    </div>
                  </div>

                  {/* Title & Category */}
                  <h4 className="text-base font-bold text-white mb-1 group-hover:text-[#FF4D58] transition-colors">
                    {ex.name}
                  </h4>
                  <div className="text-xs text-[#38BDF8] font-medium mb-2.5">
                    {ex.category}
                  </div>

                  {/* Instructions */}
                  <p className="text-xs text-[#96989F] line-clamp-2 leading-relaxed mb-4">
                    {ex.instructions}
                  </p>

                  {/* Variable Metrics Supported */}
                  <div className="space-y-1.5 mb-4 pt-3 border-t border-[#27272A]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#96989F] block">
                      Metrik Sasaran:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {ex.variableMetrics?.distance && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[#1A1C22] text-[#38BDF8] border border-[#38BDF8]/30">
                          Jarak ({ex.defaultMetrics?.distanceMeters || 1000}m)
                        </span>
                      )}
                      {ex.variableMetrics?.duration && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[#1A1C22] text-[#38BDF8] border border-[#38BDF8]/30">
                          Tempoh ({ex.defaultMetrics?.durationSeconds || 60}s)
                        </span>
                      )}
                      {ex.variableMetrics?.reps && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[#1A1C22] text-[#38BDF8] border border-[#38BDF8]/30">
                          Ulangan ({ex.defaultMetrics?.reps || 20} reps)
                        </span>
                      )}
                      {ex.variableMetrics?.sets && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[#1A1C22] text-[#38BDF8] border border-[#38BDF8]/30">
                          Set ({ex.defaultMetrics?.sets || 3} sets)
                        </span>
                      )}
                      {ex.variableMetrics?.pace && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[#1A1C22] text-[#38BDF8] border border-[#38BDF8]/30">
                          Pace ({ex.defaultMetrics?.paceMinPerKm || 5.5} min/km)
                        </span>
                      )}
                      {ex.variableMetrics?.holdTime && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[#1A1C22] text-[#38BDF8] border border-[#38BDF8]/30">
                          Hold ({ex.defaultMetrics?.holdTimeSeconds || 60}s)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Evidence Requirements */}
                  <div className="space-y-1.5 pt-2 border-t border-[#27272A]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#96989F] block">
                      Bukti Diperlukan:
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                      {hasVideo && (
                        <span className="px-2 py-0.5 rounded bg-[#E10600]/15 text-[#FF4D58] border border-[#FF4D58]/35 flex items-center gap-1">
                          <Video className="w-3 h-3" />
                          Video ({ex.evidenceRequirements?.minVideoDurationSec || 60}s)
                        </span>
                      )}
                      {hasPhoto && (
                        <span className="px-2 py-0.5 rounded bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/35 flex items-center gap-1">
                          <Camera className="w-3 h-3" />
                          Gambar
                        </span>
                      )}
                      {hasNote && (
                        <span className="px-2 py-0.5 rounded bg-[#10B981]/15 text-[#34D399] border border-[#10B981]/35 flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          Refleksi
                        </span>
                      )}
                      {hasGps && (
                        <span className="px-2 py-0.5 rounded bg-[#F59E0B]/15 text-[#FBBF24] border border-[#F59E0B]/35 flex items-center gap-1">
                          <Navigation className="w-3 h-3" />
                          GPS
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#27272A]">
                  <span className="text-[11px] text-[#6B7280]">
                    {ex.isActive !== false ? "Aktif dalam Pustaka" : "Diarkib"}
                  </span>

                  <div className="flex items-center gap-2">
                    <AdminButton
                      variant="secondary"
                      size="xs"
                      onClick={() => handleOpenEdit(ex)}
                      leftIcon={<Edit2 className="w-3 h-3 text-[#E10600]" />}
                    >
                      Sunting
                    </AdminButton>
                    <button
                      type="button"
                      onClick={() => onDeleteExercise(ex.id)}
                      title="Arkib Senaman"
                      className="p-1.5 rounded text-[#96989F] hover:text-[#EF4444] hover:bg-[#EF4444]/15 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-[#17191E] border border-[#27272A] rounded-xl p-10 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#202126] text-[#96989F] flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-white">Tiada Senaman Ditemui</h4>
          <p className="text-xs text-[#96989F] max-w-sm mx-auto">
            Tiada senaman sepadan dengan kriteria carian atau tapisan kategori yang dipilih.
          </p>
          <AdminButton
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedCategory("Semua");
              setSelectedDiscipline("ALL");
              setSelectedDifficulty("ALL");
              setSearchQuery("");
            }}
          >
            Kosongkan Tapisan
          </AdminButton>
        </div>
      )}

      {/* Exercise Modal */}
      <ExerciseModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        exercise={editingExercise}
        onSave={handleSaveExercise}
      />
    </div>
  );
}
