"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  UserCheck,
  FileText,
  AlertTriangle,
} from "lucide-react";
import type { VisibilityMode } from "./types";

export function PrivacySimulator() {
  const [mode, setMode] = useState<VisibilityMode>("PUBLIC");
  const [selectedAthleteProfile, setSelectedAthleteProfile] = useState<"DANIAL" | "AISYAH">("AISYAH");

  const sampleDanial = {
    fullName: "Muhammad Danial Haziq",
    alias: "Kilat Lembah Klang",
    avatarUrl: "/assets/fighterx/hero-silat-olahraga-athlete-lit.png",
    club: "Akademi Pendekar Daeng Kuning",
    association: "PSSGM",
    age: 21,
    under18: false,
    rank: 1,
    points: 2540,
  };

  const sampleAisyah = {
    fullName: "Siti Nurul Aisyah",
    alias: "Bunga Fatani",
    avatarUrl: "/assets/fighterx/hero-silat-seni-athlete-lit.png",
    club: "Akademi Gayung Fatani Nilai",
    association: "PSGFM",
    age: 16,
    under18: true,
    rank: 4,
    points: 2260,
  };

  const activeAthlete = selectedAthleteProfile === "AISYAH" ? sampleAisyah : sampleDanial;

  return (
    <div className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-400 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck size={13} />
            <span>PEMATUHAN AKTA PDPA 2010 &amp; AKTA KANAK-KANAK 2001</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold font-athletic text-white uppercase tracking-wide">
            Privasi &amp; Kawalan Keterlihatan Atlet
          </h3>
          <p className="text-xs sm:text-sm text-[#A0A1AB] mt-1 max-w-xl leading-relaxed">
            FighterX memberi kuasa mutlak kepada setiap atlet dan ibu bapa untuk memilih tahap keterlihatan profil pada papan pendahulu kebangsaan.
          </p>
        </div>

        {/* Profile Switcher */}
        <div className="flex items-center gap-2 p-1.5 rounded-xl bg-white/5 border border-white/10">
          <button
            type="button"
            onClick={() => setSelectedAthleteProfile("AISYAH")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedAthleteProfile === "AISYAH"
                ? "bg-[#FF3845] text-white"
                : "text-[#8E9099] hover:text-white"
            }`}
          >
            Contoh: Atlet Bawah 18 (Aisyah, 16 Thn)
          </button>
          <button
            type="button"
            onClick={() => setSelectedAthleteProfile("DANIAL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedAthleteProfile === "DANIAL"
                ? "bg-[#FF3845] text-white"
                : "text-[#8E9099] hover:text-white"
            }`}
          >
            Contoh: Atlet Dewasa (Danial, 21 Thn)
          </button>
        </div>
      </div>

      {/* Interactive Mode Selector */}
      <div className="mt-6">
        <label className="text-xs font-bold uppercase tracking-wider text-[#A2A3AA] block mb-3">
          Pilih Mod Privasi Untuk Menguji Paparan Awam:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              id: "PUBLIC" as VisibilityMode,
              title: "1. Profil Umum (Public)",
              desc: "Nama rasmi, kelab, mata, dan foto dipaparkan secara telus di papan pendahulu kebangsaan.",
              icon: Eye,
              badgeColor: "text-emerald-400 border-emerald-500/40 bg-emerald-500/10",
            },
            {
              id: "CLUB_ONLY" as VisibilityMode,
              title: "2. Kelab Sahaja (Club-Only)",
              desc: "Hanya jurulatih dan rakan sekelab boleh melihat perincian penuh. Awam hanya melihat nama singkatan.",
              icon: Lock,
              badgeColor: "text-amber-400 border-amber-500/40 bg-amber-500/10",
            },
            {
              id: "ANONYMOUS" as VisibilityMode,
              title: "3. Tanpa Nama (Anonymous)",
              desc: "Nama peribadi dirahsiakan sepenuhnya. Hanya gelaran sukan/alias dan kod kelab dipaparkan.",
              icon: EyeOff,
              badgeColor: "text-sky-400 border-sky-500/40 bg-sky-500/10",
            },
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = mode === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setMode(item.id)}
                className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? "bg-white/[0.08] border-[#FF3845] shadow-[0_0_20px_rgba(255,56,69,0.2)]"
                    : "bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`p-2 rounded-lg border ${item.badgeColor}`}>
                      <Icon size={16} />
                    </span>
                    {isSelected && (
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-[#FF3845] text-white">
                        Aktif
                      </span>
                    )}
                  </div>
                  <strong className="text-sm font-bold text-white block">{item.title}</strong>
                  <p className="text-xs text-[#9DA0AA] mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Live Preview of Athlete Card in this mode */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#A2A3AA]">
            Hasil Paparan Sebenar Pada Leaderboard Awam (Simulasi Langsung):
          </span>
          <span className="text-[10px] text-[#7A7C85] font-mono">Mod Terpilih: {mode}</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl border border-white/10 bg-white/[0.03] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Avatar or Masked Avatar */}
            <div className="relative w-14 h-14 rounded-2xl bg-white/5 border border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
              {mode === "ANONYMOUS" ? (
                <div className="w-full h-full bg-white/5 flex items-center justify-center text-[#868892]">
                  <EyeOff size={22} />
                </div>
              ) : (
                <Image
                  src={activeAthlete.avatarUrl}
                  alt={activeAthlete.fullName}
                  fill
                  className="object-cover object-top"
                />
              )}
              <div className="absolute top-1 left-1 px-1 py-0.2 rounded bg-[#FF3845] text-[9px] font-bold text-white font-athletic">
                #{activeAthlete.rank}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base sm:lg font-bold text-white leading-tight">
                  {mode === "PUBLIC"
                    ? activeAthlete.fullName
                    : mode === "CLUB_ONLY"
                    ? `${activeAthlete.fullName.split(" ")[0]} *** (Kelab Sahaja)`
                    : `[Atlet #${activeAthlete.rank}] · ${activeAthlete.alias}`}
                </h4>

                {activeAthlete.under18 && (
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold text-sky-400 bg-sky-500/10 border border-sky-500/30">
                    Bawah 18
                  </span>
                )}
              </div>

              <p className="text-xs text-[#9DA0AA] mt-0.5">
                {mode === "ANONYMOUS" ? (
                  <span>Kelab Rahsia ({activeAthlete.association})</span>
                ) : (
                  <span>
                    <strong className="text-white">{activeAthlete.club}</strong> ({activeAthlete.association})
                  </span>
                )}
              </p>

              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-mono text-[#FF555C]">
                  Gelaran Sukan: &quot;{activeAthlete.alias}&quot;
                </span>
                <span>·</span>
                <span className="text-[10px] text-emerald-400 font-mono">
                  {activeAthlete.points.toLocaleString()} PTS Terverifikasi
                </span>
              </div>
            </div>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-right sm:text-right w-full sm:w-auto">
            <span className="text-[10px] text-[#868892] block">Keterlihatan Data:</span>
            <strong
              className={`font-mono text-xs ${
                mode === "PUBLIC"
                  ? "text-emerald-400"
                  : mode === "CLUB_ONLY"
                  ? "text-amber-400"
                  : "text-sky-400"
              }`}
            >
              {mode === "PUBLIC" ? "Terbuka Kepada Semua" : mode === "CLUB_ONLY" ? "Dilindungi Kelab" : "Nama Dirahsiakan"}
            </strong>
          </div>
        </div>
      </div>

      {/* 3 Core Principles of Under-18 Protection */}
      <div className="mt-8 pt-6 border-t border-white/10">
        <h4 className="text-sm font-bold font-athletic uppercase text-white tracking-wide mb-3 flex items-center gap-2">
          <Lock size={15} className="text-[#FF3845]" />
          3 Rukun Perlindungan Data Kanak-Kanak &amp; Remaja (Bawah 18 Tahun)
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl border border-white/10 bg-white/[0.02]">
            <strong className="text-white block font-semibold mb-1 flex items-center gap-1.5">
              <UserCheck size={14} className="text-sky-400" />
              1. Persetujuan Ibu Bapa Sah
            </strong>
            <p className="text-[#989AA3] leading-relaxed text-[11px]">
              Setiap akaun pesilat bawah 18 tahun wajib mempunyai perakuan digital penjaga sebelum dibenarkan menyertai sebarang papan markah awam.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-white/10 bg-white/[0.02]">
            <strong className="text-white block font-semibold mb-1 flex items-center gap-1.5">
              <AlertTriangle size={14} className="text-amber-400" />
              2. Tiada Data Sensitif Dipaparkan
            </strong>
            <p className="text-[#989AA3] leading-relaxed text-[11px]">
              Nombor MyKid/MyKad, alamat rumah, nama sekolah harian, dan jejak laluan GPS latihan larian disekat 100% daripada tatapan awam.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-white/10 bg-white/[0.02]">
            <strong className="text-white block font-semibold mb-1 flex items-center gap-1.5">
              <FileText size={14} className="text-emerald-400" />
              3. Hak Menarik Balik Pada Bila-Bila Masa
            </strong>
            <p className="text-[#989AA3] leading-relaxed text-[11px]">
              Ibu bapa atau penjaga boleh menukar mod keterlihatan kepada &apos;Tanpa Nama&apos; atau memadam profil atlet pada bila-bila masa melalui portal penjaga.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
