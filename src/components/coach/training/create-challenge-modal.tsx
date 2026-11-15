"use client";

import React, { useState } from "react";
import {
  X,
  PlusCircle,
  Zap,
  Calendar,
  Users,
  Video,
  FileCheck,
  CheckCircle2,
} from "lucide-react";
import { platformStore } from "@/lib/platform/platform-state";

export interface CreateChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  clubId?: string;
  coachName?: string;
}

export function CreateChallengeModal({
  isOpen,
  onClose,
  clubId = "club-harimau",
  coachName = "Cikgu Farid",
}: CreateChallengeModalProps) {
  const [title, setTitle] = useState("");
  const [taskType, setTaskType] = useState<"DAILY" | "WEEKLY" | "SPECIAL">("DAILY");
  const [target, setTarget] = useState<"ALL_SQUAD" | "INDIVIDUAL">("ALL_SQUAD");
  const [targetAthleteName, setTargetAthleteName] = useState("Alya Nabilah");
  const [instructions, setInstructions] = useState("");
  const [repsTarget, setRepsTarget] = useState("");
  const [evidenceRequirement, setEvidenceRequirement] = useState<"VIDEO" | "PHOTO" | "METRIC_ONLY">("VIDEO");
  const [dueDate, setDueDate] = useState("Hari Ini, 10:00 PM");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !instructions.trim()) {
      alert("Sila lengkapkan tajuk dan arahan tugasan.");
      return;
    }

    setSubmitting(true);
    try {
      platformStore.createCoachChallenge({
        clubId,
        coachId: "coach-farid",
        coachName,
        target,
        targetAthleteName: target === "INDIVIDUAL" ? targetAthleteName : undefined,
        taskType,
        title: title.trim(),
        instructions: instructions.trim(),
        dueDate,
        evidenceRequirement,
        repsTarget: repsTarget.trim() || "3 set ulangan",
      });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        // Reset form
        setTitle("");
        setInstructions("");
        setRepsTarget("");
      }, 1200);
    } catch {
      alert("Ralat mencipta cabaran. Sila cuba lagi.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#12141a]/95 backdrop-blur-2xl p-6 sm:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.85)] text-white">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Tutup"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5 pb-3 border-b border-white/[0.08]">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#e10600] to-[#800000] flex items-center justify-center text-white shadow-[0_0_15px_rgba(225,6,0,0.4)] border border-[#ff3845]/50 flex-none">
            <Zap size={20} />
          </div>
          <div>
            <h2
              className="text-2xl font-bold uppercase tracking-tight text-white"
              style={{ fontFamily: "var(--font-athletic)", fontStyle: "italic" }}
            >
              Cipta Cabaran Latihan Rumah
            </h2>
            <p className="text-xs text-neutral-400">
              Tugasan khas untuk memantau latihan fizikal atau teknikal kendiri atlet.
            </p>
          </div>
        </div>

        {success ? (
          <div className="py-12 text-center space-y-3">
            <CheckCircle2 size={48} className="mx-auto text-emerald-400 animate-bounce" />
            <h3 className="text-xl font-bold text-white uppercase" style={{ fontFamily: "var(--font-athletic)" }}>
              Cabaran Berjaya Ditugaskan!
            </h3>
            <p className="text-xs text-neutral-300">
              Semua atlet yang disasarkan kini dapat melihat tugasan ini di portal masing-masing.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Target & Task Type Selectors */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-300 font-semibold mb-1 flex items-center gap-1">
                  <Users size={12} className="text-[#ff3845]" /> Sasaran Latihan
                </label>
                <select
                  value={target}
                  onChange={(e) => setTarget(e.target.value as "ALL_SQUAD" | "INDIVIDUAL")}
                  className="w-full h-9 px-2.5 rounded-lg bg-white/[0.03] border border-white/10 text-white focus:border-[#ff3845]/60 focus:outline-none"
                >
                  <option value="ALL_SQUAD" className="bg-[#12141a]">Seluruh Skuad Kelab</option>
                  <option value="INDIVIDUAL" className="bg-[#12141a]">Atlet Individu</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1 flex items-center gap-1">
                  <Calendar size={12} className="text-[#ff3845]" /> Jenis Tempoh
                </label>
                <select
                  value={taskType}
                  onChange={(e) => setTaskType(e.target.value as "DAILY" | "WEEKLY" | "SPECIAL")}
                  className="w-full h-9 px-2.5 rounded-lg bg-white/[0.03] border border-white/10 text-white focus:border-[#ff3845]/60 focus:outline-none"
                >
                  <option value="DAILY" className="bg-[#12141a]">Cabaran Harian (Daily)</option>
                  <option value="WEEKLY" className="bg-[#12141a]">Cabaran Mingguan (Weekly)</option>
                  <option value="SPECIAL" className="bg-[#12141a]">Tugasan Khas Puncak</option>
                </select>
              </div>
            </div>

            {/* Individual Athlete Selector (if INDIVIDUAL) */}
            {target === "INDIVIDUAL" && (
              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Pilih Atlet</label>
                <select
                  value={targetAthleteName}
                  onChange={(e) => setTargetAthleteName(e.target.value)}
                  className="w-full h-9 px-2.5 rounded-lg bg-white/[0.03] border border-white/10 text-white focus:border-[#ff3845]/60 focus:outline-none"
                >
                  <option value="Alya Nabilah" className="bg-[#12141a]">Alya Nabilah (Silat Seni)</option>
                  <option value="Muhammad Danial" className="bg-[#12141a]">Muhammad Danial (Silat Olahraga)</option>
                  <option value="Siti Khadijah" className="bg-[#12141a]">Siti Khadijah (Silat Seni)</option>
                  <option value="Ahmad Zikri" className="bg-[#12141a]">Ahmad Zikri (Silat Olahraga)</option>
                </select>
              </div>
            )}

            {/* Title */}
            <div>
              <label className="block text-neutral-300 font-semibold mb-1">Tajuk Tugasan / Cabaran</label>
              <input
                type="text"
                placeholder="Cth: Cabaran 100 Tendangan T & Kestabilan Kekuda"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full h-9 px-3 rounded-lg bg-white/[0.03] border border-white/10 text-white placeholder-neutral-500 focus:border-[#ff3845]/60 focus:outline-none"
                required
              />
            </div>

            {/* Instructions */}
            <div>
              <label className="block text-neutral-300 font-semibold mb-1">Arahan & Tips Pelaksanaan</label>
              <textarea
                rows={3}
                placeholder="Cth: Lakukan 50 sepak layang kanan dan 50 kiri. Pastikan kekuda tidak goyah. Rakam video 30 saat set terakhir."
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-white/[0.03] border border-white/10 text-white placeholder-neutral-500 focus:border-[#ff3845]/60 focus:outline-none resize-none leading-relaxed"
                required
              />
            </div>

            {/* Reps Target & Due Date */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Sasaran Ulangan / Masa</label>
                <input
                  type="text"
                  placeholder="Cth: 50 reps / 20 minit"
                  value={repsTarget}
                  onChange={(e) => setRepsTarget(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg bg-white/[0.03] border border-white/10 text-white placeholder-neutral-500 focus:border-[#ff3845]/60 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Tarikh / Masa Akhir</label>
                <input
                  type="text"
                  placeholder="Cth: Hari Ini, 10:00 PM"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg bg-white/[0.03] border border-white/10 text-white placeholder-neutral-500 focus:border-[#ff3845]/60 focus:outline-none"
                />
              </div>
            </div>

            {/* Evidence Requirement */}
            <div>
              <label className="block text-neutral-300 font-semibold mb-1 flex items-center gap-1">
                <Video size={12} className="text-[#ff3845]" /> Jenis Bukti Yang Diwajibkan
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setEvidenceRequirement("VIDEO")}
                  className={`py-2 px-2 rounded-lg border text-center transition-all ${
                    evidenceRequirement === "VIDEO"
                      ? "border-red-500 bg-red-950/40 text-white font-bold"
                      : "border-white/10 bg-white/[0.02] text-neutral-400 hover:text-white"
                  }`}
                >
                  Rakam Video
                </button>
                <button
                  type="button"
                  onClick={() => setEvidenceRequirement("PHOTO")}
                  className={`py-2 px-2 rounded-lg border text-center transition-all ${
                    evidenceRequirement === "PHOTO"
                      ? "border-red-500 bg-red-950/40 text-white font-bold"
                      : "border-white/10 bg-white/[0.02] text-neutral-400 hover:text-white"
                  }`}
                >
                  Muat Naik Foto
                </button>
                <button
                  type="button"
                  onClick={() => setEvidenceRequirement("METRIC_ONLY")}
                  className={`py-2 px-2 rounded-lg border text-center transition-all ${
                    evidenceRequirement === "METRIC_ONLY"
                      ? "border-red-500 bg-red-950/40 text-white font-bold"
                      : "border-white/10 bg-white/[0.02] text-neutral-400 hover:text-white"
                  }`}
                >
                  Catatan Sahaja
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 flex items-center justify-end gap-3 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-neutral-400 hover:text-white transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 rounded-lg bg-[#e10600] hover:bg-[#ff1f27] text-white font-bold tracking-wider uppercase flex items-center gap-2 shadow-[0_4px_16px_rgba(225,6,0,0.35)] transition-all cursor-pointer disabled:opacity-50"
              >
                <PlusCircle size={15} />
                <span>{submitting ? "Menugaskan..." : "Tugaskan Sekarang"}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
