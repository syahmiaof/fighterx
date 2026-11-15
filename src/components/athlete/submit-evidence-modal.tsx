"use client";

import React, { useState } from "react";
import {
  X,
  Upload,
  Link as LinkIcon,
  Video,
  Camera,
  CheckCircle2,
  Clock,
  Sparkles,
  Activity,
} from "lucide-react";
import { platformStore } from "@/lib/platform/platform-state";

export interface SubmitEvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: string;
  taskTitle: string;
  taskSource?: "ADMIN_FRAMEWORK" | "COACH_CHALLENGE";
  discipline?: "SENI" | "OLAHRAGA";
  athleteName?: string;
  clubId?: string;
}

export function SubmitEvidenceModal({
  isOpen,
  onClose,
  taskId,
  taskTitle,
  taskSource = "ADMIN_FRAMEWORK",
  discipline = "SENI",
  athleteName = "Alya Nabilah",
  clubId = "club-harimau",
}: SubmitEvidenceModalProps) {
  const [evidenceMethod, setEvidenceMethod] = useState<"FILE" | "URL">("FILE");
  const [videoUrl, setVideoUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [repsOrDuration, setRepsOrDuration] = useState("3 set x 15 reps (15 minit)");
  const [rpeScore, setRpeScore] = useState(7);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (evidenceMethod === "URL" && !videoUrl.trim()) {
      alert("Sila masukkan pautan video latihan anda (YouTube / Google Drive / TikTok unlisted).");
      return;
    }

    setSubmitting(true);
    try {
      platformStore.submitAthleteEvidence({
        clubId,
        athleteId: "ath-alya",
        athleteName,
        discipline,
        taskId,
        taskTitle,
        taskSource,
        evidenceType: evidenceMethod === "URL" ? "VIDEO_URL" : "VIDEO_FILE",
        evidenceUrl: evidenceMethod === "URL" ? videoUrl.trim() : undefined,
        evidenceFileName: evidenceMethod === "FILE" ? (fileName || "video-latihan-kendiri.mp4") : undefined,
        repsOrDuration: repsOrDuration.trim() || "Sesi Lengkap",
        rpeScore,
        athleteNotes: notes.trim() || "Latihan kendiri selesai mengikut jadual.",
      });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1400);
    } catch {
      alert("Ralat menghantar bukti latihan. Sila cuba lagi.");
    } finally {
      setSubmitting(false);
    }
  }

  // Label for RPE
  const getRpeLabel = (score: number) => {
    if (score <= 3) return "Ringan / Sangat Mudah";
    if (score <= 6) return "Sederhana / Terkawal";
    if (score <= 8) return "Sukar / Mencabar";
    return "Maksimum / Sangat Penat";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
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
            <Upload size={19} />
          </div>
          <div>
            <span className="text-[10px] font-bold tracking-wider uppercase text-[#ff3845]">
              {taskSource === "COACH_CHALLENGE" ? "CABARAN KHAS COACH" : "MASTER FRAMEWORK"}
            </span>
            <h2
              className="text-2xl font-bold uppercase tracking-tight text-white line-clamp-1"
              style={{ fontFamily: "var(--font-athletic)", fontStyle: "italic" }}
            >
              Hantar Bukti: {taskTitle}
            </h2>
          </div>
        </div>

        {success ? (
          <div className="py-12 text-center space-y-3">
            <CheckCircle2 size={48} className="mx-auto text-emerald-400 animate-bounce" />
            <h3 className="text-xl font-bold text-white uppercase" style={{ fontFamily: "var(--font-athletic)" }}>
              Bukti Berjaya Dihantar!
            </h3>
            <p className="text-xs text-neutral-300">
              Video latihan anda kini berada dalam peti semakan Coach untuk verifikasi dan maklum balas.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Evidence Mode Switcher: File Upload vs Video URL */}
            <div>
              <label className="block text-neutral-300 font-semibold mb-1.5">
                Kaedah Bukti Latihan
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setEvidenceMethod("FILE")}
                  className={`py-2.5 px-3 rounded-lg border text-center flex items-center justify-center gap-2 transition-all ${
                    evidenceMethod === "FILE"
                      ? "border-red-500 bg-red-950/40 text-white font-bold"
                      : "border-white/10 bg-white/[0.02] text-neutral-400 hover:text-white"
                  }`}
                >
                  <Video size={14} className="text-[#ff3845]" />
                  <span>Muat Naik Fail (MP4/JPG)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEvidenceMethod("URL")}
                  className={`py-2.5 px-3 rounded-lg border text-center flex items-center justify-center gap-2 transition-all ${
                    evidenceMethod === "URL"
                      ? "border-red-500 bg-red-950/40 text-white font-bold"
                      : "border-white/10 bg-white/[0.02] text-neutral-400 hover:text-white"
                  }`}
                >
                  <LinkIcon size={14} className="text-[#ff3845]" />
                  <span>Pautan Video (YouTube/Drive)</span>
                </button>
              </div>
            </div>

            {/* Input by chosen method */}
            {evidenceMethod === "FILE" ? (
              <div>
                <label className="block text-neutral-300 font-semibold mb-1">
                  Pilih Fail Rakaman Latihan
                </label>
                <label className="flex flex-col items-center justify-center w-full h-24 rounded-xl border-2 border-dashed border-white/15 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/25 cursor-pointer transition-all">
                  <div className="flex flex-col items-center justify-center pt-2 pb-2">
                    <Camera size={20} className="text-neutral-400 mb-1" />
                    <p className="text-xs text-neutral-300 font-medium">
                      {fileName ? (
                        <span className="text-emerald-400 font-bold">{fileName}</span>
                      ) : (
                        <span>Klik untuk pilih video / foto dari telefon atau laptop</span>
                      )}
                    </p>
                    <p className="text-[10px] text-neutral-400">MP4, MOV, atau JPG (Maksimum 50MB)</p>
                  </div>
                  <input
                    type="file"
                    accept="video/*,image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <div>
                <label className="block text-neutral-300 font-semibold mb-1">
                  Pautan URL Video Latihan
                </label>
                <input
                  type="url"
                  placeholder="https://youtu.be/... atau link Google Drive unlisted"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg bg-white/[0.03] border border-white/10 text-white placeholder-neutral-500 focus:border-[#ff3845]/60 focus:outline-none"
                  required={evidenceMethod === "URL"}
                />
              </div>
            )}

            {/* Repetitions or Duration Recorded */}
            <div>
              <label className="block text-neutral-300 font-semibold mb-1">
                Hasil Latihan (Catatan Ulangan / Tempoh Masa)
              </label>
              <input
                type="text"
                placeholder="Cth: 3 set x 15 reps push-up + 45 saat plank"
                value={repsOrDuration}
                onChange={(e) => setRepsOrDuration(e.target.value)}
                className="w-full h-9 px-3 rounded-lg bg-white/[0.03] border border-white/10 text-white placeholder-neutral-500 focus:border-[#ff3845]/60 focus:outline-none"
                required
              />
            </div>

            {/* RPE Fatigue Rating Slider (1 to 10) */}
            <div className="p-3 rounded-xl border border-white/[0.08] bg-white/[0.02]">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-semibold text-neutral-300 flex items-center gap-1.5">
                  <Activity size={13} className="text-[#ff3845]" />
                  Tahap Keletihan (RPE Score: {rpeScore}/10)
                </span>
                <span className="text-[11px] font-bold text-amber-400">
                  {getRpeLabel(rpeScore)}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={rpeScore}
                onChange={(e) => setRpeScore(parseInt(e.target.value, 10))}
                className="w-full accent-[#e10600] cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-neutral-400 mt-1">
                <span>1 (Sangat Mudah)</span>
                <span>5 (Sederhana)</span>
                <span>10 (Maksimum)</span>
              </div>
            </div>

            {/* Notes to Coach */}
            <div>
              <label className="block text-neutral-300 font-semibold mb-1">
                Nota Tambahan Kepada Coach
              </label>
              <textarea
                rows={2}
                placeholder="Cth: Kekuda rendah stabil, pernafasan lancar. Tiada kesakitan sendi."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-white/[0.03] border border-white/10 text-white placeholder-neutral-500 focus:border-[#ff3845]/60 focus:outline-none resize-none leading-relaxed"
              />
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
                <Upload size={14} />
                <span>{submitting ? "Menghantar..." : "Hantar Untuk Semakan Coach"}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
