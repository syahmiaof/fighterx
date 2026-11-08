"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, Upload, Camera, Sparkles, Check, ShieldCheck, AlertCircle } from "lucide-react";
import { useMoments } from "@/lib/moments/moments-context";
import { ALL_MALAYSIA_STATES } from "@/lib/moments/mock-data";
import { DisciplineTag } from "@/lib/moments/types";

const SAMPLE_PHOTO_PRESETS = [
  { id: "p1", url: "/assets/moments/galeri-15.jpg", label: "Sparring Tempur" },
  { id: "p2", url: "/assets/moments/galeri-83.jpg", label: "Seni Bunga" },
  { id: "p3", url: "/assets/moments/galeri-1.jpg", label: "Kecergasan Padang" },
  { id: "p4", url: "/assets/moments/galeri-30.jpg", label: "Senjata Tradisi" },
  { id: "p5", url: "/assets/moments/galeri-18.jpg", label: "Gelanggang Kelab" },
  { id: "p6", url: "/assets/moments/galeri-22.jpg", label: "Kejohanan Emas" },
];

export function MomentUploadModal() {
  const { isUploadModalOpen, setIsUploadModalOpen, addMoment } = useMoments();

  const [athleteName, setAthleteName] = useState("");
  const [clubName, setClubName] = useState("");
  const [state, setState] = useState("Selangor");
  const [discipline, setDiscipline] = useState<DisciplineTag>("olahraga");
  const [trainingFocus, setTrainingFocus] = useState("");
  const [caption, setCaption] = useState("");
  const [tagsInput, setTagsInput] = useState("#SilatMalaysia #LatihanFizikal");
  const [selectedPhoto, setSelectedPhoto] = useState(SAMPLE_PHOTO_PRESETS[0].url);
  const [customPhotoUrl, setCustomPhotoUrl] = useState("");
  const [isVerifiedAthlete, setIsVerifiedAthlete] = useState(false);

  // Inline validation state
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    athleteName?: boolean;
    trainingFocus?: boolean;
    caption?: boolean;
  }>({});

  // Prefill verified athlete info on open
  useEffect(() => {
    if (!isUploadModalOpen) return;
    try {
      const role = window.sessionStorage.getItem("fighterx_session_role");
      if (role === "ATHLETE") {
        setAthleteName("Alya Nabilah");
        setClubName("FighterX Demo Club");
        setState("Selangor");
        setDiscipline("seni");
        setIsVerifiedAthlete(true);
      } else {
        setIsVerifiedAthlete(false);
      }
    } catch {
      setIsVerifiedAthlete(false);
    }
    setErrorMessage(null);
    setFieldErrors({});
  }, [isUploadModalOpen]);

  if (!isUploadModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const errors: { athleteName?: boolean; trainingFocus?: boolean; caption?: boolean } = {};
    if (!athleteName.trim()) errors.athleteName = true;
    if (!trainingFocus.trim()) errors.trainingFocus = true;
    if (!caption.trim()) errors.caption = true;

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setErrorMessage("Sila lengkapkan nama atlet, fokus latihan, dan kapsyen.");
      return;
    }

    const tags = tagsInput
      .split(/\s+/)
      .filter((t) => t.startsWith("#"))
      .slice(0, 5);

    const finalImage = customPhotoUrl.trim() || selectedPhoto;

    addMoment({
      athleteName: athleteName.trim(),
      athleteHandle: `@${athleteName.toLowerCase().replace(/\s+/g, "_")}`,
      athleteAvatar: "/assets/fighterx/hero-silat-seni-athlete-lit.png",
      clubName: clubName.trim() || `Kelab Silat ${state}`,
      state,
      discipline,
      trainingFocus: trainingFocus.trim(),
      imageUrl: finalImage,
      caption: caption.trim(),
      tags: tags.length > 0 ? tags : ["#SilatMalaysia", "#FighterX"],
      viewsCount: 1,
      verifiedAthlete: true,
    });

    setIsUploadModalOpen(false);
    // Reset form
    setAthleteName("");
    setClubName("");
    setTrainingFocus("");
    setCaption("");
    setErrorMessage(null);
    setFieldErrors({});
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setCustomPhotoUrl(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={() => setIsUploadModalOpen(false)}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0c0d12]/95 border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.12)] p-6 sm:p-8 text-white backdrop-blur-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#FF3845] uppercase tracking-wider mb-1">
              <Camera size={14} />
              <span>KONGSI DETIK LATIHAN</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-athletic uppercase tracking-wide">
              Muat Naik Moment Atlet
            </h3>
            <p className="text-xs text-[#96989F] mt-0.5">
              Kongsikan gambar latihan gelanggang untuk tatapan seluruh komuniti silat Malaysia.
            </p>
            {isVerifiedAthlete && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono mt-2">
                <ShieldCheck size={13} />
                <span>Profil Atlet Terverifikasi: {athleteName}</span>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => setIsUploadModalOpen(false)}
            className="w-8 h-8 rounded-full bg-white/5 border border-white/10 text-[#C5C6CA] hover:text-white hover:bg-[#E10600] transition-colors flex items-center justify-center cursor-pointer"
            aria-label="Tutup borang muat naik"
          >
            <X size={16} />
          </button>
        </div>

        {/* Inline Error Feedback Banner */}
        {errorMessage && (
          <div className="flex items-center gap-2 p-3 mt-4 rounded-xl bg-red-950/60 border border-[#ff3845]/50 text-[#ff3845] text-xs font-medium animate-in fade-in">
            <AlertCircle size={15} className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 mt-5">
          {/* Athlete Info Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#C5C6CA] mb-1">
                Nama Penuh Atlet *
              </label>
              <input
                type="text"
                placeholder="Contoh: Amirul Hafiz"
                value={athleteName}
                onChange={(e) => {
                  setAthleteName(e.target.value);
                  if (fieldErrors.athleteName) {
                    setFieldErrors((prev) => ({ ...prev, athleteName: false }));
                    setErrorMessage(null);
                  }
                }}
                className={`w-full px-3.5 py-2 rounded-xl bg-[#181920] border text-xs text-white focus:outline-none transition-colors ${
                  fieldErrors.athleteName
                    ? "border-[#ff3845] focus:border-[#ff3845] ring-1 ring-[#ff3845]/40"
                    : "border-white/10 focus:border-[#FF3845]"
                }`}
              />
              {fieldErrors.athleteName && (
                <span className="text-[10px] text-[#ff3845] font-mono mt-1 block">
                  Nama atlet wajib diisi.
                </span>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#C5C6CA] mb-1">
                Gelanggang / Kelab
              </label>
              <input
                type="text"
                placeholder="Contoh: Gayong Harimau Selangor"
                value={clubName}
                onChange={(e) => setClubName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#181920] border border-white/10 text-xs text-white focus:outline-none focus:border-[#FF3845]"
              />
            </div>
          </div>

          {/* State & Discipline Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#C5C6CA] mb-1">
                Negeri
              </label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#181920] border border-white/10 text-xs text-white focus:outline-none focus:border-[#FF3845] cursor-pointer"
              >
                {ALL_MALAYSIA_STATES.filter((s) => s !== "Semua Negeri").map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#C5C6CA] mb-1">
                Disiplin Silat
              </label>
              <select
                value={discipline}
                onChange={(e) => setDiscipline(e.target.value as DisciplineTag)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#181920] border border-white/10 text-xs text-white focus:outline-none focus:border-[#FF3845] cursor-pointer"
              >
                <option value="olahraga">Silat Olahraga (Tanding)</option>
                <option value="seni">Silat Seni (Tunggal/Ganda/Regu)</option>
                <option value="fitness">Kecergasan &amp; S&amp;C</option>
                <option value="kejohanan">Kem Kejohanan &amp; Sukma</option>
              </select>
            </div>
          </div>

          {/* Training Focus */}
          <div>
            <label className="block text-xs font-semibold text-[#C5C6CA] mb-1">
              Fokus Latihan Hari Ini *
            </label>
            <input
              type="text"
              placeholder="Contoh: Drill Letupan Sepakan Sisi & Jatuhan Wasit"
              value={trainingFocus}
              onChange={(e) => {
                setTrainingFocus(e.target.value);
                if (fieldErrors.trainingFocus) {
                  setFieldErrors((prev) => ({ ...prev, trainingFocus: false }));
                  setErrorMessage(null);
                }
              }}
              className={`w-full px-3.5 py-2 rounded-xl bg-[#181920] border text-xs text-white focus:outline-none transition-colors ${
                fieldErrors.trainingFocus
                  ? "border-[#ff3845] focus:border-[#ff3845] ring-1 ring-[#ff3845]/40"
                  : "border-white/10 focus:border-[#FF3845]"
              }`}
            />
            {fieldErrors.trainingFocus && (
              <span className="text-[10px] text-[#ff3845] font-mono mt-1 block">
                Fokus latihan wajib diisi.
              </span>
            )}
          </div>

          {/* Photo Selection / Upload */}
          <div>
            <label className="block text-xs font-semibold text-[#C5C6CA] mb-1.5">
              Pilih Foto Latihan atau Muat Naik Foto Sendiri
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-3">
              {SAMPLE_PHOTO_PRESETS.map((preset) => (
                <div
                  key={preset.id}
                  onClick={() => {
                    setSelectedPhoto(preset.url);
                    setCustomPhotoUrl("");
                  }}
                  className={`relative aspect-square rounded-xl overflow-hidden border cursor-pointer group ${
                    selectedPhoto === preset.url && !customPhotoUrl
                      ? "border-[#E10600] ring-2 ring-[#E10600]/50"
                      : "border-white/10 hover:border-white/30"
                  }`}
                >
                  <Image
                    src={preset.url}
                    alt={preset.label}
                    fill
                    className="object-cover"
                  />
                  {selectedPhoto === preset.url && !customPhotoUrl && (
                    <div className="absolute inset-0 bg-[#E10600]/30 flex items-center justify-center">
                      <Check size={16} className="text-white drop-shadow" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Local File Upload Input */}
            <div className="flex items-center gap-3">
              <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-[#C5C6CA] hover:text-white hover:border-[#FF3845] transition-colors cursor-pointer">
                <Upload size={13} />
                <span>Pilih Foto dari Peranti</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              {customPhotoUrl && (
                <span className="text-[11px] font-mono text-emerald-400">
                  ✓ Foto tersuai dipilih
                </span>
              )}
            </div>
          </div>

          {/* Caption */}
          <div>
            <label className="block text-xs font-semibold text-[#C5C6CA] mb-1">
              Kapsyen / Catatan Latihan *
            </label>
            <textarea
              rows={3}
              placeholder="Kongsi pengalaman, petua teknikal, atau semangat perjuangan latihan anda..."
              value={caption}
              onChange={(e) => {
                setCaption(e.target.value);
                if (fieldErrors.caption) {
                  setFieldErrors((prev) => ({ ...prev, caption: false }));
                  setErrorMessage(null);
                }
              }}
              className={`w-full px-3.5 py-2 rounded-xl bg-[#181920] border text-xs text-white focus:outline-none transition-colors ${
                fieldErrors.caption
                  ? "border-[#ff3845] focus:border-[#ff3845] ring-1 ring-[#ff3845]/40"
                  : "border-white/10 focus:border-[#FF3845]"
              }`}
            />
            {fieldErrors.caption && (
              <span className="text-[10px] text-[#ff3845] font-mono mt-1 block">
                Kapsyen latihan wajib diisi.
              </span>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold text-[#C5C6CA] mb-1">
              Tanda Pagar (Hashtags)
            </label>
            <input
              type="text"
              placeholder="#SilatOlahraga #LatihanIntensif"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-[#181920] border border-white/10 text-xs text-white focus:outline-none focus:border-[#FF3845]"
            />
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => setIsUploadModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#96989F] hover:text-white transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#E10600] to-[#b30500] hover:from-[#ff1a14] hover:to-[#E10600] shadow-[0_2px_12px_rgba(225,6,0,0.4)] transition-all cursor-pointer active:scale-95"
            >
              <Sparkles size={14} />
              <span>Terbitkan Moment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
