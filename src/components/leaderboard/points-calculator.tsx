"use client";

import { useState } from "react";
import {
  Calculator,
  CalendarCheck,
  Video,
  Activity,
  Award,
  Sparkles,
  Info,
} from "lucide-react";

export function PointsCalculator() {
  const [sessions, setSessions] = useState<number>(4); // default 4 sesi
  const [drills, setDrills] = useState<number>(3); // default 3 drills
  const [runMeters, setRunMeters] = useState<number>(1500); // 1500m
  const [pushUps, setPushUps] = useState<number>(45); // 45 reps
  const [plankSecs, setPlankSecs] = useState<number>(180); // 180s = 3 mins
  const [selectedBadgeBonus, setSelectedBadgeBonus] = useState<number>(200); // Pejuang subuh

  // Calculations
  const attendancePoints = sessions * 20; // 20 pts per verified session (max 1/day)
  const videoDrillPoints = drills * 30; // 30 pts per verified drill (max 1/day)

  // Baseline formulas
  const runScore = Math.round(150 + Math.max(0, (runMeters - 1000) / 800) * 170); // 150 to 320
  const pushUpScore = Math.round(100 + Math.max(0, (pushUps - 20) / 50) * 160); // 100 to 260
  const plankScore = Math.round(100 + Math.max(0, (plankSecs - 60) / 240) * 180); // 100 to 280
  const baselineTotal = runScore + pushUpScore + plankScore;

  const totalProjected = attendancePoints + videoDrillPoints + baselineTotal + selectedBadgeBonus;

  return (
    <div className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF3845]/15 border border-[#FF3845]/30 text-[#FF555C] text-xs font-bold uppercase tracking-wider mb-2">
            <Calculator size={13} />
            <span>SIMULASI PEMARKAHAN LATIHAN RASMI</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold font-athletic text-white uppercase tracking-wide">
            Kalkulator Potensi Mata Mingguan
          </h3>
          <p className="text-xs sm:text-sm text-[#A0A1AB] mt-1 max-w-xl leading-relaxed">
            Kira anggaran mata rasmi yang boleh diraih berdasarkan kehadiran berdisiplin, video drill yang diluluskan jurulatih, dan catatan ujian baseline kecergasan.
          </p>
        </div>

        {/* Projected Score Badge */}
        <div className="p-4 rounded-2xl bg-black/40 border-2 border-[#FF3845]/60 text-right shrink-0 shadow-[0_0_25px_rgba(255,56,69,0.2)]">
          <span className="text-[10px] uppercase font-bold text-[#868892] tracking-wider block">
            Anggaran Skor Mingguan Anda
          </span>
          <div className="text-3xl sm:text-4xl font-bold font-athletic text-[#FF3845] mt-0.5">
            {totalProjected.toLocaleString()} <small className="text-xs text-[#868892]">PTS</small>
          </div>
          <span className="text-[10px] text-emerald-400 font-medium block mt-0.5">
            {totalProjected >= 1800
              ? "🔥 Kelayakan Top 10 Kebangsaan"
              : totalProjected >= 1200
              ? "⚡ Zon Prestasi Tinggi (Emas)"
              : "📈 Peningkatan Konsisten (Perak)"}
          </span>
        </div>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Pillar 1: Kehadiran Gelanggang */}
        <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02]">
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="input-sessions" className="text-xs font-bold text-white flex items-center gap-2">
              <CalendarCheck size={14} className="text-[#FF555C]" />
              Kehadiran Sesi Latihan Gelanggang
            </label>
            <span className="font-athletic font-bold text-base text-[#FF3845]">
              {sessions} Sesi ({attendancePoints} PTS)
            </span>
          </div>
          <input
            id="input-sessions"
            type="range"
            min={0}
            max={6}
            step={1}
            value={sessions}
            onChange={(e) => setSessions(Number(e.target.value))}
            className="w-full accent-[#FF3845] h-1.5 bg-white/10 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-[#7A7C85] mt-1.5">
            <span>0 Sesi (0 pts)</span>
            <span>Had Selamat: Maksimum 6 sesi/minggu (120 pts)</span>
          </div>
        </div>

        {/* Pillar 2: Video Drill Disahkan */}
        <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02]">
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="input-drills" className="text-xs font-bold text-white flex items-center gap-2">
              <Video size={14} className="text-amber-400" />
              Video Drill Teknik Disahkan Jurulatih
            </label>
            <span className="font-athletic font-bold text-base text-amber-400">
              {drills} Video ({videoDrillPoints} PTS)
            </span>
          </div>
          <input
            id="input-drills"
            type="range"
            min={0}
            max={6}
            step={1}
            value={drills}
            onChange={(e) => setDrills(Number(e.target.value))}
            className="w-full accent-amber-500 h-1.5 bg-white/10 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-[#7A7C85] mt-1.5">
            <span>0 Video (0 pts)</span>
            <span>+30 pts setiap video diluluskan jurulatih (Maks 1/hari)</span>
          </div>
        </div>

        {/* Pillar 3: Larian 6 Minit */}
        <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02]">
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="input-run" className="text-xs font-bold text-white flex items-center gap-2">
              <Activity size={14} className="text-emerald-400" />
              Catatan Ujian Larian 6-Minit (Jarak)
            </label>
            <span className="font-athletic font-bold text-base text-emerald-400">
              {runMeters}m ({runScore} PTS)
            </span>
          </div>
          <input
            id="input-run"
            type="range"
            min={1000}
            max={1800}
            step={20}
            value={runMeters}
            onChange={(e) => setRunMeters(Number(e.target.value))}
            className="w-full accent-emerald-500 h-1.5 bg-white/10 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-[#7A7C85] mt-1.5">
            <span>1,000 meter (150 pts)</span>
            <span>1,800 meter (320 pts max)</span>
          </div>
        </div>

        {/* Pillar 4: Push-Up & Plank Core */}
        <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02]">
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="input-pushups" className="text-xs font-bold text-white flex items-center gap-2">
              <Sparkles size={14} className="text-sky-400" />
              Push-Up ({pushUps} reps) &amp; Plank ({Math.floor(plankSecs / 60)}m {plankSecs % 60}s)
            </label>
            <span className="font-athletic font-bold text-base text-sky-400">
              {pushUpScore + plankScore} PTS
            </span>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-[10px] text-[#868892] mb-1">
                <span>Push-up 1 Minit: {pushUps} ulangan</span>
                <span>+{pushUpScore} pts</span>
              </div>
              <input
                id="input-pushups"
                type="range"
                min={20}
                max={70}
                step={2}
                value={pushUps}
                onChange={(e) => setPushUps(Number(e.target.value))}
                className="w-full accent-sky-500 h-1.5 bg-white/10 rounded-lg cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between text-[10px] text-[#868892] mb-1">
                <span>Plank Teras: {plankSecs} saat</span>
                <span>+{plankScore} pts</span>
              </div>
              <input
                id="input-plank"
                type="range"
                min={60}
                max={300}
                step={10}
                value={plankSecs}
                onChange={(e) => setPlankSecs(Number(e.target.value))}
                className="w-full accent-indigo-500 h-1.5 bg-white/10 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bonus Lencana Selector */}
      <div className="mt-5 p-4 rounded-xl border border-white/10 bg-white/[0.02]">
        <span className="text-xs font-bold text-white flex items-center gap-2 mb-3">
          <Award size={14} className="text-purple-400" />
          Pilih Sasaran Bonus Lencana Minggu Ini:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { label: "Tiada Lencana Baru", pts: 0 },
            { label: "Pejuang Subuh (+200)", pts: 200 },
            { label: "100% Kehadiran (+350)", pts: 350 },
            { label: "Pendekar Kuda-kuda (+400)", pts: 400 },
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => setSelectedBadgeBonus(item.pts)}
              className={`p-2.5 rounded-lg text-xs font-bold transition-all text-left ${
                selectedBadgeBonus === item.pts
                  ? "bg-[#FF3845] text-white border border-[#FF3845]"
                  : "bg-white/5 text-[#9EA0AA] border border-white/10 hover:text-white"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Anti-Fraud Disclaimer Rule */}
      <div className="mt-5 p-3.5 rounded-xl border border-white/10 bg-white/[0.02] flex items-start gap-3 text-xs text-[#8E9099]">
        <Info size={16} className="text-[#FF555C] shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <strong className="text-white block">Kawalan Perlindungan Anti-Spam (Fair Play Safeguards):</strong>
          <p>
            Mata kehadiran dihadkan kepada maksimum 1 sesi sehari (20 pts), video drill 1 semakan sehari (30 pts), dan ujian baseline kecergasan hanya boleh direkodkan 1 kali setiap kitaran 14 hari bagi mengelakkan perbuatan manipulasi atau kepalsuan data.
          </p>
        </div>
      </div>
    </div>
  );
}
