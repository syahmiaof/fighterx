"use client";

import React, { useState } from "react";
import {
  Check,
  Flame,
  Hand,
  Shield,
  ShieldAlert,
  Sparkles,
  Swords,
  Timer,
  Trophy,
  Zap,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export function ScoringMatrixView() {
  const { locale } = useLanguage();
  const isEn = locale === "en";
  const [activeTab, setActiveTab] = useState<"TANDING" | "SENI">("TANDING");

  const tandingScores = [
    {
      points: "1 MATA",
      pointsEn: "1 POINT",
      badgeTone: "border-blue-500/40 bg-blue-500/10 text-blue-400",
      accentColor: "#3b82f6",
      title: isEn ? "Valid Hand Strike (Punch)" : "Pukulan Tangan Sah",
      description: isEn
        ? "Direct punch, palm thrust, or knife-hand strike executed with authentic silat technique into the legal body vest area."
        : "Serangan tangan (lurus, sanggah, bandul) yang bertenaga, mantap, dan tepat pada sasaran vest pelindung tanpa terhalang.",
      criteria: isEn
        ? [
            "Must originate from sikap pasang (guard stance) and pattern steps.",
            "Must impact cleanly on the opponent's protective body vest.",
            "Not deflected or blocked by opponent's arm or hand guard.",
          ]
        : [
            "Mesti berlepas daripada sikap pasang dan pola langkah yang jelas.",
            "Impak tepat dan bersih pada sasaran vest pelindung badan.",
            "Tidak ditepis, ditangkap, atau dihalang oleh anggota lawan.",
          ],
    },
    {
      points: "2 MATA",
      pointsEn: "2 POINTS",
      badgeTone: "border-amber-500/40 bg-amber-500/10 text-amber-400",
      accentColor: "#f59e0b",
      title: isEn ? "Valid Torso Kick" : "Sepakan Sah ke Badan",
      description: isEn
        ? "Roundhouse (sabit), push (jejeg), side, or back spinning kick landing with full power on the scoring vest."
        : "Sepakan (sabit, jejag, sisi, belakang, layang) yang bersih, mempunyai impak jelas, dan mendarat sempurna pada kawasan badan lawan.",
      criteria: isEn
        ? [
            "Strike must use legal foot surfaces (instep, ball of foot, heel).",
            "Visible power, proper follow-through, and immediate posture recovery.",
            "Kicks below the belt or to illegal knee joints are strictly prohibited.",
          ]
        : [
            "Menggunakan permukaan sah kaki (kekura, telapak, tumit kaki).",
            "Mempunyai impak nyata dan pengekalan kestabilan kekuda.",
            "Sepakan di bawah pinggang atau ke sendi lutut dilarang sama sekali.",
          ],
    },
    {
      points: "3 MATA",
      pointsEn: "3 POINTS",
      badgeTone: "border-red-500/40 bg-red-500/10 text-[#ff4d5a]",
      accentColor: "#ff4d5a",
      title: isEn ? "Clean Takedown / Sweep" : "Jatuhan & Sapuan Sah",
      description: isEn
        ? "Successful takedown via sweeping (sapuan tegak/rebah), scissor lock (guntingan), or catching limb completed within 5.0 seconds."
        : "Menjatuhkan lawan secara bersih melalui sapuan, guntingan pinggang, bantingan atau tangkapan sah dalam had masa 5.0 saat.",
      criteria: isEn
        ? [
            "5.0-second clean execution limit from limb contact to opponent falling.",
            "The executing athlete must remain standing (no self-fall or grounding).",
            "Opponent touches the canvas with torso, back, or 3 points of contact.",
          ]
        : [
            "Had masa 5.0 saat bermula dari saat tangkapan anggota lawan.",
            "Pesilat yang menjatuhkan kekal berdiri tanpa ikut rebah ke matras.",
            "Lawan menyentuh matras dengan punggung, belakang, atau 3 titik sentuhan.",
          ],
    },
    {
      points: "1+2 = 3",
      pointsEn: "1+2 = 3",
      badgeTone: "border-purple-500/40 bg-purple-500/10 text-purple-400",
      accentColor: "#a855f7",
      title: isEn ? "Combination Attack Series" : "Rangkaian Serangan Kombinasi",
      description: isEn
        ? "A valid hand strike immediately linked with a clean scoring kick in continuous forward tactical momentum."
        : "Pukulan tangan sah yang disusuli serta-merta dengan sepakan sah yang mendarat bersih dalam satu rangkaian serangan berterusan.",
      criteria: isEn
        ? [
            "Consecutive attacks with zero hesitation or defensive break.",
            "Both strikes must independently satisfy valid scoring rules.",
            "Accumulates separate digital points (1 pt punch + 2 pts kick).",
          ]
        : [
            "Serangan berturutan tanpa jeda atau pemisahan jarak pertahanan.",
            "Kedua-dua teknik wajib memenuhi syarat sah pemarkahan juri.",
            "Terkumpul sebagai mata digital berasingan (1 mata pukulan + 2 mata sepakan).",
          ],
    },
  ];

  const seniRubrics = [
    {
      badge: isEn ? "CORE ACCURACY" : "NILAI KEBENARAN",
      badgeTone: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
      scoreValue: "9.90",
      title: isEn ? "Accuracy Baseline (Nilai Kebenaran)" : "Ketepatan Gerak Baku (Asas 9.90)",
      description: isEn
        ? "Base score evaluating precision in the 100 standardized Jurus Baku movements, posture angles, stances, and weapons."
        : "Skor asas menilai ketepatan 100 urutan gerak baku rasmi PERSILAT, sudut kekuda, kedudukan pasang, dan teknik senjata.",
      points: isEn
        ? [
            "Tunggal & Regu: 100 movements (Barehand 1-40, Golok 41-70, Toya 71-100).",
            "Each missed movement, wrong sequence, or incorrect stance incurs -0.01 point penalty.",
            "Regu Trio: Microsecond synchronisation across all 3 athletes simultaneously.",
          ]
        : [
            "Tunggal & Regu: 100 jurus (Tangan kosong 1-40, Golok 41-70, Toya 71-100).",
            "Setiap kesalahan gerak, urutan terbalik, atau sudut kekuda salah ditolak -0.01 mata.",
            "Regu Trio: Keseragaman mutlak mikro-saat antara ketiga-tiga pesilat serentak.",
          ],
    },
    {
      badge: isEn ? "EXPRESSION & SOUL" : "NILAI KEMANTAPAN",
      badgeTone: "border-amber-500/40 bg-amber-500/10 text-amber-400",
      scoreValue: "0.01 – 0.10",
      title: isEn ? "Expression & Soul (Nilai Kemantapan)" : "Kemantapan & Jiwa Persilatan",
      description: isEn
        ? "Graded on athletic power, rhythm harmony, stamina consistency, warrior spirit, and facial expression."
        : "Dinilai berdasarkan kekuatan tenaga dalaman, keserasian irama, konsistensi stamina, penghayatan gerak, dan ekspresi pahlawan.",
      points: isEn
        ? [
            "Harmony between speed, explosive power (tenaga), and fluid transition.",
            "Ganda: Realistic paired performance choreography, solid impact sounds, and clean weapon disarms.",
            "Solo Bebas: Cultural authenticity, weapon handling flair, and musical synchrony.",
          ]
        : [
            "Keseimbangan antara kepantasan, ledakan tenaga (explosive power), dan transisi lembut.",
            "Ganda: Koreografi persembahan berpasangan yang realistik, bunyi impak tangkisan padu, dan rampasan senjata bersih.",
            "Solo Bebas: Keaslian unsur warisan silat, kelincahan senjata, dan kesepaduan muzik.",
          ],
    },
  ];

  const standardDeductions = [
    {
      category: isEn ? "Time Duration" : "Masa Persembahan",
      penalty: isEn ? "-0.05 / 5 sec" : "-0.05 / 5 saat",
      rule: isEn
        ? "Standard time is exactly 3:00 minutes (180 seconds). A penalty of -0.05 is deducted for every 5-second interval over or under."
        : "Masa rasmi tepat 3:00 minit (180 saat). Penalti -0.05 ditolak bagi setiap kelipatan 5 saat terlebih atau terkurang.",
      badgeTone: "border-yellow-500/40 text-yellow-400",
    },
    {
      category: isEn ? "Dropped Weapon" : "Senjata Terjatuh",
      penalty: "-0.50 mata",
      rule: isEn
        ? "Weapon (Golok / Toya / Keris) slips or drops to the arena canvas during execution."
        : "Senjata (Golok, Toya, Keris, Pisau) terlepas dari pegangan tangan dan jatuh ke atas matras.",
      badgeTone: "border-red-500/40 text-[#ff4d5a]",
    },
    {
      category: isEn ? "Arena Boundary" : "Keluar Garisan",
      penalty: "-0.05 mata",
      rule: isEn
        ? "Stepping or landing completely outside the official 10m x 10m competition boundary."
        : "Mana-mana bahagian tapak kaki memijak atau terkeluar daripada sempadan gelanggang 10m x 10m.",
      badgeTone: "border-blue-500/40 text-blue-400",
    },
    {
      category: isEn ? "Costume & Accessories" : "Pakaian & Aksesori",
      penalty: "-0.05 mata",
      rule: isEn
        ? "Traditional headgear (tanjak), waist sash (samping), or weapon holster comes undone or drops."
        : "Tanjak, samping, bengkung, atau sarung senjata terurai atau terjatuh ke lantai gelanggang.",
      badgeTone: "border-purple-500/40 text-purple-400",
    },
  ];

  return (
    <div className="w-full">
      {/* Tab Switcher */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <button
          type="button"
          onClick={() => setActiveTab("TANDING")}
          className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-athletic text-sm sm:text-base font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === "TANDING"
              ? "bg-[#e10600] text-white shadow-[0_0_24px_rgba(225,6,0,0.4)] border border-[#ff3845]"
              : "bg-white/[0.04] text-[#C5C6CA] hover:text-white hover:bg-white/[0.08] border border-white/[0.08]"
          }`}
        >
          <Swords size={16} />
          <span>{isEn ? "Silat Olahraga Scoring" : "Mata Silat Olahraga"}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("SENI")}
          className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-athletic text-sm sm:text-base font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === "SENI"
              ? "bg-[#e10600] text-white shadow-[0_0_24px_rgba(225,6,0,0.4)] border border-[#ff3845]"
              : "bg-white/[0.04] text-[#C5C6CA] hover:text-white hover:bg-white/[0.08] border border-white/[0.08]"
          }`}
        >
          <Sparkles size={16} />
          <span>{isEn ? "Silat Seni Rubric" : "Rubrik Silat Seni"}</span>
        </button>
      </div>

      {/* TAB CONTENT 1: TANDING SCORING MATRIX */}
      {activeTab === "TANDING" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 guidelines-card-grid">
            {tandingScores.map((item) => (
              <div
                key={item.title}
                className="guidelines-card rounded-2xl border border-white/[0.08] bg-white/[0.025] hover:border-white/[0.15] hover:bg-white/[0.035] p-5 sm:p-6 backdrop-blur-[16px] shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)] flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${item.badgeTone}`}
                    >
                      {isEn ? item.pointsEn : item.points}
                    </span>
                    <span
                      className="font-athletic text-2xl font-black"
                      style={{ color: item.accentColor }}
                    >
                      {isEn ? item.pointsEn : item.points}
                    </span>
                  </div>

                  <h4 className="text-base font-bold font-athletic text-white uppercase mb-2">
                    {item.title}
                  </h4>

                  <p className="text-xs text-[#C5C6CA] leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/[0.08]">
                  <p className="text-[10px] font-mono text-[#96989f] uppercase tracking-wider mb-2 font-bold">
                    {isEn ? "VALID CRITERIA:" : "SYARAT KELULUSAN MATA:"}
                  </p>
                  <ul className="space-y-1.5 text-[11px] text-slate-300">
                    {item.criteria.map((c) => (
                      <li key={c} className="flex items-start gap-1.5">
                        <Check size={12} className="text-[#ff4d5a] shrink-0 mt-0.5" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Clean Summary Note for Tanding */}
          <div className="p-4 rounded-xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#C5C6CA]">
            <div className="flex items-center gap-2">
              <Timer size={16} className="text-[#ff4d5a] shrink-0" />
              <span>
                <strong>{isEn ? "Clean Time Rule:" : "Peraturan Masa Bersih:"}</strong>{" "}
                {isEn
                  ? "A bout comprises 3 rounds of 2 minutes clean time each, with a mandatory 1-minute recovery interval between rounds."
                  : "Satu perlawanan mengandungi 3 pusingan x 2 minit masa bersih, diselangi rehat 1 minit antara pusingan."}
              </span>
            </div>
            <span className="font-mono text-[11px] text-amber-400 font-bold shrink-0">
              PERSILAT Digital Scoring System
            </span>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: SENI RUBRIC & PENALTY TABLE */}
      {activeTab === "SENI" && (
        <div className="space-y-6">
          {/* 2 Core Components (Accuracy vs Expression) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 guidelines-card-grid">
            {seniRubrics.map((rubric) => (
              <div
                key={rubric.title}
                className="guidelines-card rounded-2xl border border-white/[0.08] bg-white/[0.025] hover:border-white/[0.15] hover:bg-white/[0.035] p-6 backdrop-blur-[16px] shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)] transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${rubric.badgeTone}`}
                  >
                    {rubric.badge}
                  </span>
                  <div className="text-right">
                    <span className="text-[10px] text-[#96989f] block uppercase tracking-wider">
                      {isEn ? "SCORE WEIGHT" : "NILAI MARKAH"}
                    </span>
                    <span className="font-athletic text-2xl font-black text-white">
                      {rubric.scoreValue}
                    </span>
                  </div>
                </div>

                <h4 className="text-xl font-bold font-athletic text-white uppercase mb-2">
                  {rubric.title}
                </h4>

                <p className="text-xs text-[#C5C6CA] leading-relaxed mb-4">
                  {rubric.description}
                </p>

                <ul className="space-y-2 pt-3 border-t border-white/[0.08] text-xs text-slate-300">
                  {rubric.points.map((pt) => (
                    <li key={pt} className="flex items-start gap-2">
                      <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Standard Deductions Matrix */}
          <div className="guidelines-card rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 backdrop-blur-[16px] shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)]">
            <h4 className="text-base font-bold font-athletic text-white uppercase mb-1 flex items-center gap-2">
              <ShieldAlert size={16} className="text-[#ff4d5a]" />
              <span>{isEn ? "Standard Technical Deductions (Silat Seni Penalties)" : "Jadual Potongan Rasmi Wasit Juri (Silat Seni)"}</span>
            </h4>
            <p className="text-xs text-[#96989f] mb-4">
              {isEn
                ? "Deductions applied automatically by digital jury systems for technical infractions in Silat Seni (Tunggal, Ganda, Regu, and Solo Kreatif)."
                : "Potongan markah rasmi oleh juri digital sekiranya berlaku kesilapan teknikal dalam Silat Seni (Tunggal, Ganda, Regu, dan Solo Kreatif)."}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {standardDeductions.map((d) => (
                <div
                  key={d.category}
                  className="p-4 rounded-xl bg-black/40 border border-white/[0.06] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-white uppercase">{d.category}</span>
                      <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded border bg-white/5 ${d.badgeTone}`}>
                        {d.penalty}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#A6A7AD] leading-relaxed">{d.rule}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
