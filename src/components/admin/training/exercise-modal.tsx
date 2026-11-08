"use client";

import React, { useState } from "react";
import type {
  ExerciseDefinition,
  ExerciseCategory,
  VariableMetricsConfig,
  DefaultMetricValues,
  EvidenceRequirements,
} from "@/lib/admin/types";
import { AdminModal } from "@/components/admin/ui/admin-modal";
import { AdminButton } from "@/components/admin/ui/admin-button";
import {
  Dumbbell,
  Video,
  Camera,
  FileText,
  Navigation,
  Layers,
} from "lucide-react";

export interface ExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  exercise: ExerciseDefinition | null; // null for Create mode
  onSave: (data: Omit<ExerciseDefinition, "id">, existingId?: string) => void;
}

const CATEGORIES: ExerciseCategory[] = [
  "Cardio / Larian",
  "Kekuatan / Strength",
  "Teras / Core",
  "Ketangkasan / Agility",
  "Teknik Seni",
  "Teknik Olahraga",
];

export function ExerciseModal({
  isOpen,
  onClose,
  exercise,
  onSave,
}: ExerciseModalProps) {
  const isEditing = Boolean(exercise);

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [category, setCategory] = useState<ExerciseCategory>("Cardio / Larian");
  const [discipline, setDiscipline] = useState<"Silat Seni" | "Silat Olahraga" | "Shared">("Shared");
  const [difficulty, setDifficulty] = useState<"Asas" | "Pertengahan" | "Tinggi">("Asas");
  const [instructions, setInstructions] = useState("");

  // Variable Metrics Config
  const [metricsConfig, setMetricsConfig] = useState<VariableMetricsConfig>({
    distance: false,
    duration: true,
    reps: false,
    sets: false,
    pace: false,
    holdTime: false,
  });

  // Default Metric Values
  const [defaultMetrics, setDefaultMetrics] = useState<DefaultMetricValues>({
    distanceMeters: 1000,
    durationSeconds: 300,
    reps: 20,
    sets: 3,
    paceMinPerKm: 5.5,
    holdTimeSeconds: 60,
  });

  // Evidence Requirements
  const [evidence, setEvidence] = useState<EvidenceRequirements>({
    videoRequired: true,
    minVideoDurationSec: 60,
    photoRequired: false,
    noteRequired: true,
    gpsRequired: false,
  });

  const [prevExerciseId, setPrevExerciseId] = useState<string | null>(null);
  const currentKey = isOpen ? (exercise ? exercise.id : "new") : null;
  if (currentKey !== null && currentKey !== prevExerciseId) {
    setPrevExerciseId(currentKey);
    if (exercise) {
      setName(exercise.name);
      setCode(exercise.code);
      setCategory(exercise.category);
      setDiscipline(exercise.discipline);
      setDifficulty(exercise.difficulty);
      setInstructions(exercise.instructions);
      setMetricsConfig(exercise.variableMetrics || {});
      setDefaultMetrics(exercise.defaultMetrics || {});
      setEvidence(exercise.evidenceRequirements || {
        videoRequired: false,
        photoRequired: false,
        noteRequired: false,
        gpsRequired: false,
      });
    } else {
      setName("");
      setCode("");
      setCategory("Cardio / Larian");
      setDiscipline("Shared");
      setDifficulty("Asas");
      setInstructions("");
      setMetricsConfig({
        distance: false,
        duration: true,
        reps: false,
        sets: false,
        pace: false,
        holdTime: false,
      });
      setDefaultMetrics({
        distanceMeters: 1000,
        durationSeconds: 300,
        reps: 20,
        sets: 3,
        paceMinPerKm: 5.5,
        holdTimeSeconds: 60,
      });
      setEvidence({
        videoRequired: false,
        minVideoDurationSec: 60,
        photoRequired: true,
        noteRequired: true,
        gpsRequired: false,
      });
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code) return;

    const payload: Omit<ExerciseDefinition, "id"> = {
      name,
      code,
      category,
      discipline,
      difficulty,
      instructions,
      variableMetrics: metricsConfig,
      defaultMetrics,
      evidenceRequirements: evidence,
      isActive: true,
    };

    onSave(payload, exercise?.id);
    onClose();
  };

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Dumbbell className="w-5 h-5 text-[#E10600]" />
          <span>{isEditing ? "Kemaskini Definisi Senaman" : "Daftar Senaman Baharu"}</span>
        </div>
      }
      description="Konfigurasikan metrik boleh ubah (jarak, masa, ulangan) dan syarat bukti rakaman untuk modul latihan."
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name & Code */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-[#96989F] mb-1.5 uppercase">
              Nama Senaman / Modul
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="cth. Tendangan Sabit Papan Pad"
              className="w-full bg-[#1A1C22] border border-[#37383D] rounded-lg px-3.5 py-2 text-sm text-white placeholder-[#6B7280] focus:border-[#E10600] focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#96989F] mb-1.5 uppercase">
              Kod Unik Modul
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="cth. OLAH-KICK-02"
              className="w-full bg-[#1A1C22] border border-[#37383D] rounded-lg px-3.5 py-2 text-sm text-white placeholder-[#6B7280] focus:border-[#E10600] focus:outline-none font-mono"
              required
            />
          </div>
        </div>

        {/* Category, Discipline & Difficulty */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#96989F] mb-1.5 uppercase">
              Kategori Senaman
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ExerciseCategory)}
              className="w-full bg-[#1A1C22] border border-[#37383D] rounded-lg px-3 py-2 text-sm text-white focus:border-[#E10600] focus:outline-none"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#96989F] mb-1.5 uppercase">
              Disiplin Silat
            </label>
            <select
              value={discipline}
              onChange={(e) =>
                setDiscipline(
                  e.target.value as "Silat Seni" | "Silat Olahraga" | "Shared"
                )
              }
              className="w-full bg-[#1A1C22] border border-[#37383D] rounded-lg px-3 py-2 text-sm text-white focus:border-[#E10600] focus:outline-none"
            >
              <option value="Shared">Shared (Seni & Olahraga)</option>
              <option value="Silat Seni">Silat Seni Sahaja</option>
              <option value="Silat Olahraga">Silat Olahraga Sahaja</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#96989F] mb-1.5 uppercase">
              Tahap Kesukaran
            </label>
            <select
              value={difficulty}
              onChange={(e) =>
                setDifficulty(e.target.value as "Asas" | "Pertengahan" | "Tinggi")
              }
              className="w-full bg-[#1A1C22] border border-[#37383D] rounded-lg px-3 py-2 text-sm text-white focus:border-[#E10600] focus:outline-none"
            >
              <option value="Asas">Asas (Foundational)</option>
              <option value="Pertengahan">Pertengahan (Intermediate)</option>
              <option value="Tinggi">Tinggi (Advanced / Elite)</option>
            </select>
          </div>
        </div>

        {/* Instructions */}
        <div>
          <label className="block text-xs font-semibold text-[#96989F] mb-1.5 uppercase">
            Arahan Pelaksanaan & Penekanan Teknik
          </label>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            rows={3}
            placeholder="Terangkan postur, imbangan, keselamatan sendi, dan kriteria kualiti pergerakan atlet..."
            className="w-full bg-[#1A1C22] border border-[#37383D] rounded-lg px-3.5 py-2 text-sm text-white placeholder-[#6B7280] focus:border-[#E10600] focus:outline-none leading-relaxed"
            required
          />
        </div>

        {/* Variable Metrics Configuration */}
        <div className="bg-[#121316] border border-[#27272A] rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-[#27272A] pb-2.5">
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#38BDF8]" />
                Konfigurasi Metrik Boleh Ubah (Variable Metrics)
              </h4>
              <p className="text-[11px] text-[#96989F]">
                Tandakan metrik yang diperlukan untuk latihan ini dan tetapkan nilai sasaran asas.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {/* Distance */}
            <div
              className={`p-3 rounded-lg border transition-all ${
                metricsConfig.distance
                  ? "bg-[#38BDF8]/10 border-[#38BDF8]/50"
                  : "bg-[#1A1C22] border-[#27272A]"
              }`}
            >
              <label className="flex items-center gap-2 text-xs font-semibold text-white cursor-pointer mb-2">
                <input
                  type="checkbox"
                  checked={Boolean(metricsConfig.distance)}
                  onChange={(e) =>
                    setMetricsConfig((p) => ({ ...p, distance: e.target.checked }))
                  }
                  className="rounded border-[#37383D] text-[#38BDF8] focus:ring-0"
                />
                <span>Jarak (Meter)</span>
              </label>
              {metricsConfig.distance && (
                <input
                  type="number"
                  value={defaultMetrics.distanceMeters || ""}
                  onChange={(e) =>
                    setDefaultMetrics((p) => ({
                      ...p,
                      distanceMeters: Number(e.target.value),
                    }))
                  }
                  placeholder="Nilai (m)"
                  className="w-full bg-[#121316] border border-[#37383D] rounded px-2 py-1 text-xs text-white"
                />
              )}
            </div>

            {/* Duration */}
            <div
              className={`p-3 rounded-lg border transition-all ${
                metricsConfig.duration
                  ? "bg-[#38BDF8]/10 border-[#38BDF8]/50"
                  : "bg-[#1A1C22] border-[#27272A]"
              }`}
            >
              <label className="flex items-center gap-2 text-xs font-semibold text-white cursor-pointer mb-2">
                <input
                  type="checkbox"
                  checked={Boolean(metricsConfig.duration)}
                  onChange={(e) =>
                    setMetricsConfig((p) => ({ ...p, duration: e.target.checked }))
                  }
                  className="rounded border-[#37383D] text-[#38BDF8] focus:ring-0"
                />
                <span>Tempoh (Saat)</span>
              </label>
              {metricsConfig.duration && (
                <input
                  type="number"
                  value={defaultMetrics.durationSeconds || ""}
                  onChange={(e) =>
                    setDefaultMetrics((p) => ({
                      ...p,
                      durationSeconds: Number(e.target.value),
                    }))
                  }
                  placeholder="Nilai (saat)"
                  className="w-full bg-[#121316] border border-[#37383D] rounded px-2 py-1 text-xs text-white"
                />
              )}
            </div>

            {/* Reps */}
            <div
              className={`p-3 rounded-lg border transition-all ${
                metricsConfig.reps
                  ? "bg-[#38BDF8]/10 border-[#38BDF8]/50"
                  : "bg-[#1A1C22] border-[#27272A]"
              }`}
            >
              <label className="flex items-center gap-2 text-xs font-semibold text-white cursor-pointer mb-2">
                <input
                  type="checkbox"
                  checked={Boolean(metricsConfig.reps)}
                  onChange={(e) =>
                    setMetricsConfig((p) => ({ ...p, reps: e.target.checked }))
                  }
                  className="rounded border-[#37383D] text-[#38BDF8] focus:ring-0"
                />
                <span>Ulangan (Reps)</span>
              </label>
              {metricsConfig.reps && (
                <input
                  type="number"
                  value={defaultMetrics.reps || ""}
                  onChange={(e) =>
                    setDefaultMetrics((p) => ({
                      ...p,
                      reps: Number(e.target.value),
                    }))
                  }
                  placeholder="Nilai (reps)"
                  className="w-full bg-[#121316] border border-[#37383D] rounded px-2 py-1 text-xs text-white"
                />
              )}
            </div>

            {/* Sets */}
            <div
              className={`p-3 rounded-lg border transition-all ${
                metricsConfig.sets
                  ? "bg-[#38BDF8]/10 border-[#38BDF8]/50"
                  : "bg-[#1A1C22] border-[#27272A]"
              }`}
            >
              <label className="flex items-center gap-2 text-xs font-semibold text-white cursor-pointer mb-2">
                <input
                  type="checkbox"
                  checked={Boolean(metricsConfig.sets)}
                  onChange={(e) =>
                    setMetricsConfig((p) => ({ ...p, sets: e.target.checked }))
                  }
                  className="rounded border-[#37383D] text-[#38BDF8] focus:ring-0"
                />
                <span>Set (Sets)</span>
              </label>
              {metricsConfig.sets && (
                <input
                  type="number"
                  value={defaultMetrics.sets || ""}
                  onChange={(e) =>
                    setDefaultMetrics((p) => ({
                      ...p,
                      sets: Number(e.target.value),
                    }))
                  }
                  placeholder="Nilai (set)"
                  className="w-full bg-[#121316] border border-[#37383D] rounded px-2 py-1 text-xs text-white"
                />
              )}
            </div>

            {/* Pace */}
            <div
              className={`p-3 rounded-lg border transition-all ${
                metricsConfig.pace
                  ? "bg-[#38BDF8]/10 border-[#38BDF8]/50"
                  : "bg-[#1A1C22] border-[#27272A]"
              }`}
            >
              <label className="flex items-center gap-2 text-xs font-semibold text-white cursor-pointer mb-2">
                <input
                  type="checkbox"
                  checked={Boolean(metricsConfig.pace)}
                  onChange={(e) =>
                    setMetricsConfig((p) => ({ ...p, pace: e.target.checked }))
                  }
                  className="rounded border-[#37383D] text-[#38BDF8] focus:ring-0"
                />
                <span>Kadar Pace (min/km)</span>
              </label>
              {metricsConfig.pace && (
                <input
                  type="number"
                  step="0.1"
                  value={defaultMetrics.paceMinPerKm || ""}
                  onChange={(e) =>
                    setDefaultMetrics((p) => ({
                      ...p,
                      paceMinPerKm: Number(e.target.value),
                    }))
                  }
                  placeholder="cth. 5.5"
                  className="w-full bg-[#121316] border border-[#37383D] rounded px-2 py-1 text-xs text-white"
                />
              )}
            </div>

            {/* Hold Time */}
            <div
              className={`p-3 rounded-lg border transition-all ${
                metricsConfig.holdTime
                  ? "bg-[#38BDF8]/10 border-[#38BDF8]/50"
                  : "bg-[#1A1C22] border-[#27272A]"
              }`}
            >
              <label className="flex items-center gap-2 text-xs font-semibold text-white cursor-pointer mb-2">
                <input
                  type="checkbox"
                  checked={Boolean(metricsConfig.holdTime)}
                  onChange={(e) =>
                    setMetricsConfig((p) => ({ ...p, holdTime: e.target.checked }))
                  }
                  className="rounded border-[#37383D] text-[#38BDF8] focus:ring-0"
                />
                <span>Masa Bertahan (Saat)</span>
              </label>
              {metricsConfig.holdTime && (
                <input
                  type="number"
                  value={defaultMetrics.holdTimeSeconds || ""}
                  onChange={(e) =>
                    setDefaultMetrics((p) => ({
                      ...p,
                      holdTimeSeconds: Number(e.target.value),
                    }))
                  }
                  placeholder="cth. 90"
                  className="w-full bg-[#121316] border border-[#37383D] rounded px-2 py-1 text-xs text-white"
                />
              )}
            </div>
          </div>
        </div>

        {/* Evidence Requirements Configuration */}
        <div className="bg-[#121316] border border-[#27272A] rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-[#27272A] pb-2.5">
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Video className="w-4 h-4 text-[#E10600]" />
                Keperluan Bukti Latihan (Evidence Requirements)
              </h4>
              <p className="text-[11px] text-[#96989F]">
                Tentukan syarat pengesahan rakaman video, gambar, log GPS dan catatan refleksi atlet.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Video Required */}
            <div
              className={`p-3.5 rounded-lg border flex flex-col justify-between gap-2 ${
                evidence.videoRequired
                  ? "bg-[#E10600]/10 border-[#FF4D58]/40"
                  : "bg-[#1A1C22] border-[#27272A]"
              }`}
            >
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-bold text-white cursor-pointer">
                  <Video className="w-4 h-4 text-[#FF4D58]" />
                  <span>Wajib Rakaman Video</span>
                </label>
                <input
                  type="checkbox"
                  checked={evidence.videoRequired}
                  onChange={(e) =>
                    setEvidence((p) => ({ ...p, videoRequired: e.target.checked }))
                  }
                  className="rounded border-[#37383D] text-[#E10600] focus:ring-0"
                />
              </div>

              {evidence.videoRequired && (
                <div className="pt-2 border-t border-[#27272A]">
                  <label className="block text-[10px] text-[#96989F] mb-1">
                    Tempoh Minimum Video (Saat):
                  </label>
                  <input
                    type="number"
                    value={evidence.minVideoDurationSec || 60}
                    onChange={(e) =>
                      setEvidence((p) => ({
                        ...p,
                        minVideoDurationSec: Number(e.target.value),
                      }))
                    }
                    placeholder="cth. 60"
                    className="w-full bg-[#121316] border border-[#37383D] rounded px-2.5 py-1 text-xs text-white"
                  />
                </div>
              )}
            </div>

            {/* Photo Required */}
            <div
              className={`p-3.5 rounded-lg border flex items-center justify-between ${
                evidence.photoRequired
                  ? "bg-[#38BDF8]/10 border-[#38BDF8]/40"
                  : "bg-[#1A1C22] border-[#27272A]"
              }`}
            >
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <Camera className="w-4 h-4 text-[#38BDF8]" />
                  <span>Wajib Bukti Gambar / Foto</span>
                </div>
                <p className="text-[10px] text-[#96989F] mt-0.5">
                  Foto bacaan jam sukan atau kedudukan gelanggang
                </p>
              </div>
              <input
                type="checkbox"
                checked={evidence.photoRequired}
                onChange={(e) =>
                  setEvidence((p) => ({ ...p, photoRequired: e.target.checked }))
                }
                className="rounded border-[#37383D] text-[#38BDF8] focus:ring-0"
              />
            </div>

            {/* Coach / Athlete Notes */}
            <div
              className={`p-3.5 rounded-lg border flex items-center justify-between ${
                evidence.noteRequired
                  ? "bg-[#10B981]/10 border-[#10B981]/40"
                  : "bg-[#1A1C22] border-[#27272A]"
              }`}
            >
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <FileText className="w-4 h-4 text-[#10B981]" />
                  <span>Wajib Catatan Refleksi Diri</span>
                </div>
                <p className="text-[10px] text-[#96989F] mt-0.5">
                  Catatan RPE (kadar penat) & maklum balas atlet
                </p>
              </div>
              <input
                type="checkbox"
                checked={evidence.noteRequired}
                onChange={(e) =>
                  setEvidence((p) => ({ ...p, noteRequired: e.target.checked }))
                }
                className="rounded border-[#37383D] text-[#10B981] focus:ring-0"
              />
            </div>

            {/* GPS Required */}
            <div
              className={`p-3.5 rounded-lg border flex items-center justify-between ${
                evidence.gpsRequired
                  ? "bg-[#F59E0B]/10 border-[#F59E0B]/40"
                  : "bg-[#1A1C22] border-[#27272A]"
              }`}
            >
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <Navigation className="w-4 h-4 text-[#F59E0B]" />
                  <span>Wajib Log Laluan GPS (Larian)</span>
                </div>
                <p className="text-[10px] text-[#96989F] mt-0.5">
                  Tangkapan skrin laluan peta Strava / Garmin
                </p>
              </div>
              <input
                type="checkbox"
                checked={Boolean(evidence.gpsRequired)}
                onChange={(e) =>
                  setEvidence((p) => ({ ...p, gpsRequired: e.target.checked }))
                }
                className="rounded border-[#37383D] text-[#F59E0B] focus:ring-0"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#27272A]">
          <AdminButton type="button" variant="ghost" size="sm" onClick={onClose}>
            Batal
          </AdminButton>
          <AdminButton type="submit" variant="primary" size="sm">
            {isEditing ? "Simpan Perubahan Senaman" : "Daftar Senaman"}
          </AdminButton>
        </div>
      </form>
    </AdminModal>
  );
}
