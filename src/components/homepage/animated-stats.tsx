"use client";

import { useState } from "react";
import {
  Building2,
  Users,
  Award,
  Activity,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

interface Milestone {
  month: string;
  label: string;
  sessions: number;
  athletes: number;
  note: string;
  x: number;
  y: number;
}

const milestones: Milestone[] = [
  {
    month: "Jan 2025",
    label: "Pelancaran Rintis",
    sessions: 1200,
    athletes: 180,
    note: "12 Kelab perintis Selangor & KL",
    x: 50,
    y: 195,
  },
  {
    month: "Apr 2025",
    label: "Ekspansi Zon",
    sessions: 3400,
    athletes: 390,
    note: "Penyertaan Zon Utara & Selatan",
    x: 166,
    y: 170,
  },
  {
    month: "Jul 2025",
    label: "Fasa Kejohanan",
    sessions: 6100,
    athletes: 620,
    note: "Persediaan Sirkit Remaja Kebangsaan",
    x: 283,
    y: 138,
  },
  {
    month: "Okt 2025",
    label: "Standard SKK",
    sessions: 9200,
    athletes: 890,
    note: "Akreditasi 85+ jurulatih bertauliah",
    x: 400,
    y: 102,
  },
  {
    month: "Jan 2026",
    label: "Peraturan PERSILAT",
    sessions: 11800,
    athletes: 1100,
    note: "Penguatkuasaan format digital 2026",
    x: 516,
    y: 72,
  },
  {
    month: "Mac 2026",
    label: "Ujian Timbang & Fizikal",
    sessions: 13100,
    athletes: 1190,
    note: "98% pematuhan rekod pemakanan & berat",
    x: 633,
    y: 54,
  },
  {
    month: "Kini (2026)",
    label: "Skala Kebangsaan",
    sessions: 14250,
    athletes: 1250,
    note: "Liputan penuh 14 negeri seluruh Malaysia",
    x: 750,
    y: 38,
  },
];

export function AnimatedStats() {
  const [activeIdx, setActiveIdx] = useState<number>(milestones.length - 1);
  const activePoint = milestones[activeIdx];

  // SVG dimensions
  const svgWidth = 800;
  const svgHeight = 240;

  // Path data for smooth line and area fill
  const linePath =
    "M 50,195 C 110,188 120,175 166,170 C 220,162 230,145 283,138 C 340,128 350,110 400,102 C 455,92 470,78 516,72 C 570,64 585,58 633,54 C 690,48 705,40 750,38";
  const areaPath = `${linePath} L 750,225 L 50,225 Z`;

  return (
    <section
      className="relative z-10 py-14 md:py-20 bg-black/25 backdrop-blur-[2px] border-y border-[#26272C]/40 overflow-hidden"
      id="telemetri-prestasi"
      aria-label="Statistik dan aktiviti latihan platform FighterX"
    >
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <p className="text-[11px] sm:text-xs font-mono font-semibold tracking-[0.25em] text-[#FF3845] uppercase mb-2">
            — PRESTASI &amp; PERTUMBUHAN KEBANGSAAN —
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-athletic tracking-wider text-white uppercase">
            Aktiviti Latihan &amp; Impak Komuniti
          </h2>
          <p className="text-xs sm:text-sm text-[#96989F] mt-2 max-w-xl mx-auto leading-relaxed">
            Data latihan berprestasi tinggi yang disahkan oleh jurulatih bertauliah merentasi seluruh 14 negeri di Malaysia.
          </p>
        </div>

        {/* Sports-Science Dashboard Container */}
        <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] via-black/40 to-black/60 shadow-[0_16px_50px_rgba(0,0,0,0.5)] overflow-hidden">
          
          {/* 4 Clean Metric KPIs Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 border-b border-white/10 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
            {/* KPI 1: Kelab */}
            <div className="p-5 sm:p-6 flex items-center gap-4 hover:bg-white/[0.02] transition-colors">
              <div className="w-11 h-11 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-[#FF3845] shrink-0">
                <Building2 size={22} strokeWidth={2} />
              </div>
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="font-athletic text-3xl sm:text-4xl font-bold text-white tracking-tight">
                    52
                  </span>
                  <span className="text-[#FF3845] font-athletic text-xl font-bold">+</span>
                </div>
                <div className="text-xs font-bold text-white">Kelab &amp; Gelanggang</div>
                <div className="text-[10px] text-[#8C8E97]">14 Negeri Seluruh Negara</div>
              </div>
            </div>

            {/* KPI 2: Pesilat */}
            <div className="p-5 sm:p-6 flex items-center gap-4 hover:bg-white/[0.02] transition-colors">
              <div className="w-11 h-11 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-[#FF3845] shrink-0">
                <Users size={22} strokeWidth={2} />
              </div>
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="font-athletic text-3xl sm:text-4xl font-bold text-white tracking-tight">
                    1,250
                  </span>
                  <span className="text-[#FF3845] font-athletic text-xl font-bold">+</span>
                </div>
                <div className="text-xs font-bold text-white">Pesilat Berdaftar</div>
                <div className="text-[10px] text-[#8C8E97]">Olahraga &amp; Silat Seni</div>
              </div>
            </div>

            {/* KPI 3: Jurulatih */}
            <div className="p-5 sm:p-6 flex items-center gap-4 hover:bg-white/[0.02] transition-colors">
              <div className="w-11 h-11 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-[#FF3845] shrink-0">
                <Award size={22} strokeWidth={2} />
              </div>
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="font-athletic text-3xl sm:text-4xl font-bold text-white tracking-tight">
                    85
                  </span>
                  <span className="text-[#FF3845] font-athletic text-xl font-bold">+</span>
                </div>
                <div className="text-xs font-bold text-white">Jurulatih Bertauliah</div>
                <div className="text-[10px] text-[#8C8E97]">Pensijilan SKK &amp; PESAKA</div>
              </div>
            </div>

            {/* KPI 4: Sesi Latihan */}
            <div className="p-5 sm:p-6 flex items-center gap-4 bg-[#FF3845]/[0.03] hover:bg-[#FF3845]/[0.06] transition-colors">
              <div className="w-11 h-11 rounded-xl bg-[#FF3845]/15 border border-[#FF3845]/30 flex items-center justify-center text-[#FF3845] shrink-0">
                <Activity size={22} strokeWidth={2} />
              </div>
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="font-athletic text-3xl sm:text-4xl font-bold text-white tracking-tight">
                    14,250
                  </span>
                  <span className="text-[#FF3845] font-athletic text-xl font-bold">+</span>
                </div>
                <div className="text-xs font-bold text-white">Sesi Latihan Disahkan</div>
                <div className="text-[10px] text-[#22C55E] flex items-center gap-1 font-mono">
                  <CheckCircle2 size={10} />
                  <span>98.4% Integriti Bukti Log</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Activity Chart Panel */}
          <div className="p-5 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} className="text-[#FF3845]" />
                  <h3 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                    Trajektori Aktiviti Sesi Latihan Silat (2025 — 2026)
                  </h3>
                </div>
                <p className="text-xs text-[#8C8E97] mt-0.5">
                  Layarkan tetikus pada titik graf untuk melihat perincian fasa latihan
                </p>
              </div>

              {/* Active Milestone Card / Pill */}
              <div className="px-3.5 py-1.5 rounded-xl border border-white/10 bg-white/[0.04] flex items-center gap-3">
                <div className="text-right">
                  <div className="text-[10px] font-mono uppercase text-[#8C8E97]">
                    {activePoint.month}
                  </div>
                  <div className="text-xs font-bold text-white">
                    {activePoint.sessions.toLocaleString()} Sesi
                  </div>
                </div>
                <div className="h-6 w-px bg-white/10" />
                <div className="text-left">
                  <div className="text-[10px] font-bold text-[#FF3845] uppercase">
                    {activePoint.label}
                  </div>
                  <div className="text-[10px] text-[#A0A2AB] max-w-[150px] truncate">
                    {activePoint.note}
                  </div>
                </div>
              </div>
            </div>

            {/* SVG Smooth Area Chart */}
            <div className="relative w-full overflow-hidden">
              <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="w-full h-48 sm:h-64 overflow-visible"
                preserveAspectRatio="none"
              >
                <defs>
                  {/* Area fill gradient */}
                  <linearGradient id="trainingGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FF3845" stopOpacity="0.32" />
                    <stop offset="70%" stopColor="#FF3845" stopOpacity="0.05" />
                    <stop offset="100%" stopColor="#FF3845" stopOpacity="0" />
                  </linearGradient>

                  {/* Line glow filter */}
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#FF3845" floodOpacity="0.5" />
                  </filter>
                </defs>

                {/* Subtle horizontal grid lines */}
                <line x1="40" y1="50" x2="760" y2="50" stroke="#FFFFFF" strokeOpacity="0.05" strokeDasharray="3 3" />
                <line x1="40" y1="105" x2="760" y2="105" stroke="#FFFFFF" strokeOpacity="0.05" strokeDasharray="3 3" />
                <line x1="40" y1="165" x2="760" y2="165" stroke="#FFFFFF" strokeOpacity="0.05" strokeDasharray="3 3" />
                <line x1="40" y1="225" x2="760" y2="225" stroke="#FFFFFF" strokeOpacity="0.1" />

                {/* Y-axis micro labels */}
                <text x="32" y="54" fill="#6B7280" fontSize="9" textAnchor="end" fontFamily="monospace">14k</text>
                <text x="32" y="109" fill="#6B7280" fontSize="9" textAnchor="end" fontFamily="monospace">9k</text>
                <text x="32" y="169" fill="#6B7280" fontSize="9" textAnchor="end" fontFamily="monospace">4k</text>

                {/* Area Gradient Fill */}
                <path d={areaPath} fill="url(#trainingGrad)" />

                {/* Smooth Crimson Curve */}
                <path
                  d={linePath}
                  fill="none"
                  stroke="#FF3845"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  filter="url(#glow)"
                />

                {/* Interactive Data Points */}
                {milestones.map((point, idx) => {
                  const isActive = idx === activeIdx;
                  return (
                    <g
                      key={point.month}
                      className="cursor-pointer transition-transform duration-200"
                      onMouseEnter={() => setActiveIdx(idx)}
                      onClick={() => setActiveIdx(idx)}
                    >
                      {/* Active halo */}
                      {isActive && (
                        <circle
                          cx={point.x}
                          cy={point.y}
                          r="12"
                          fill="#FF3845"
                          fillOpacity="0.25"
                          className="animate-pulse"
                        />
                      )}

                      {/* Main node point */}
                      <circle
                        cx={point.x}
                        cy={point.y}
                        r={isActive ? "6" : "4"}
                        fill={isActive ? "#FFFFFF" : "#FF3845"}
                        stroke="#FF3845"
                        strokeWidth={isActive ? "3" : "1.5"}
                        className="transition-all duration-200"
                      />

                      {/* X-axis Month Label */}
                      <text
                        x={point.x}
                        y="238"
                        textAnchor="middle"
                        fill={isActive ? "#FFFFFF" : "#71747F"}
                        fontSize={isActive ? "10" : "9"}
                        fontWeight={isActive ? "bold" : "normal"}
                        fontFamily="monospace"
                      >
                        {point.month}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Dashboard Footer: Discipline Breakdown & Verification Note */}
            <div className="mt-6 pt-5 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
              {/* Discipline Breakdown */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full md:w-auto">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#8C8E97]">
                  Pecahan Disiplin:
                </span>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF3845]" />
                    <span className="font-semibold text-white">Silat Olahraga</span>
                    <span className="text-[#8C8E97] font-mono">(68%)</span>
                  </div>
                  <span className="text-white/20">•</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#E5A93C]" />
                    <span className="font-semibold text-white">Silat Seni</span>
                    <span className="text-[#8C8E97] font-mono">(32%)</span>
                  </div>
                </div>
              </div>

              {/* Verified Platform Badge */}
              <div className="flex items-center gap-2 text-[11px] font-mono text-[#8C8E97] shrink-0">
                <ShieldCheck size={14} className="text-[#22C55E]" />
                <span>Piawaian Sukan Berprestasi Tinggi &bull; Standard PERSILAT 2026</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
