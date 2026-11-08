"use client";

import { useState } from "react";
import {
  TARGET_ZONES,
  WEIGHT_CLASSES,
} from "@/components/disciplines/disciplines-data";
import {
  Search,
  Shield,
  ShieldAlert,
  Swords,
  Timer,
  Zap,
} from "lucide-react";

export function SilatOlahragaSection() {
  const [selectedZone, setSelectedZone] = useState<string>("dada");
  const [weightSearch, setWeightSearch] = useState("");

  const activeZone = TARGET_ZONES.find((z) => z.id === selectedZone) || TARGET_ZONES[0];

  const filteredWeights = WEIGHT_CLASSES.filter((w) => {
    if (!weightSearch.trim()) return true;
    const query = weightSearch.toLowerCase().trim();
    return (
      w.classCode.toLowerCase().includes(query) ||
      w.name.toLowerCase().includes(query) ||
      w.maleRange.toLowerCase().includes(query) ||
      (w.femaleRange || "").toLowerCase().includes(query)
    );
  });

  return (
    <section id="silat-olahraga" className="py-12 sm:py-16 border-b border-white/[0.08]">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[rgba(255,56,69,0.35)] bg-[rgba(255,56,69,0.12)] text-[#ff4d5a] text-xs font-bold uppercase tracking-wider mb-2">
            <Swords size={13} /> Disiplin Silat Olahraga (Tanding)
          </div>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-display font-bold uppercase text-white tracking-tight"
            style={{ fontFamily: "var(--font-athletic)" }}
          >
            TAKTIKAL PERTARUNGAN &amp; <span className="text-red-600">SISTEM SKOR DIGITAL</span>
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-neutral-400 leading-relaxed">
            Peraturan pertandingan tanding moden PERSILAT 2026 menuntut kepantasan langkah silat, kawalan jarak taktikal, kuasa bantingan sah, dan ketepatan serangan ke atas zon sasaran vest berlapik.
          </p>
        </div>

        {/* 3 Tactical Pillar Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {/* Card 1: Pola Langkah & Jarak */}
          <div className="rounded-[14px] border border-white/[0.08] bg-white/[0.025] backdrop-blur-[16px] p-5 shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)] hover:border-white/[0.18] hover:bg-white/[0.04] transition-all">
            <div className="w-10 h-10 rounded-lg bg-[rgba(255,56,69,0.12)] border border-[rgba(255,56,69,0.35)] flex items-center justify-center text-[#ff4d5a] mb-3">
              <Zap size={20} />
            </div>
            <h3 className="text-base font-bold uppercase text-white tracking-wide">
              Pola Langkah &amp; Kawalan Jarak
            </h3>
            <p className="text-xs text-neutral-300 mt-2 leading-relaxed">
              Mengaplikasikan kaedah <em>Langkah Gergaji</em> (zig-zag), <em>Ladam Kuda</em> (melengkung), dan <em>Tiga Penjuru</em> untuk mengelak garisan lurus serangan lawan dan mencipta sudut serangan terbuka.
            </p>
            <div className="mt-3 text-[11px] font-semibold text-[#ff4d5a] flex items-center gap-1.5">
              <span>Kaedah Elakan Pantas &amp; Tangkisan</span>
            </div>
          </div>

          {/* Card 2: Peraturan 5 Saat Tangkapan */}
          <div className="rounded-[14px] border border-[rgba(255,56,69,0.4)] bg-[rgba(255,56,69,0.04)] backdrop-blur-[16px] p-5 shadow-[0_8px_32px_rgba(0,0,0,0.45),0_0_20px_rgba(225,6,0,0.12),inset_0_1px_0_rgba(255,255,255,0.08)] hover:border-[rgba(255,56,69,0.6)] hover:bg-[rgba(255,56,69,0.06)] transition-all">
            <div className="w-10 h-10 rounded-lg bg-[rgba(255,56,69,0.2)] border border-[rgba(255,56,69,0.5)] flex items-center justify-center text-[#ff4d5a] mb-3">
              <Timer size={20} />
            </div>
            <div className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[rgba(255,56,69,0.18)] border border-[rgba(255,56,69,0.5)] text-[#ff4d5a] mb-1">
              Peraturan Wajib PERSILAT
            </div>
            <h3 className="text-base font-bold uppercase text-white tracking-wide">
              Had Tangkapan 5 Saat (5s Grapple)
            </h3>
            <p className="text-xs text-neutral-300 mt-2 leading-relaxed">
              Sebarang tangkapan anggota badan (kaki tendangan lawan) mestilah disusuli dengan jatuhan dalam tempoh maksimum <strong>5 saat</strong>. Jika gagal atau terhenti, wasit serta-merta menghentikan aksi (*&ldquo;TI&rdquo;*) tanpa sebarang mata diberikan.
            </p>
            <div className="mt-3 text-[11px] font-semibold text-emerald-400 flex items-center gap-1.5">
              <span>Jatuhan Sah = 3 Mata Bersih</span>
            </div>
          </div>

          {/* Card 3: Variasi Bantingan & Sapuan */}
          <div className="rounded-[14px] border border-white/[0.08] bg-white/[0.025] backdrop-blur-[16px] p-5 shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)] hover:border-white/[0.18] hover:bg-white/[0.04] transition-all">
            <div className="w-10 h-10 rounded-lg bg-[rgba(255,56,69,0.12)] border border-[rgba(255,56,69,0.35)] flex items-center justify-center text-[#ff4d5a] mb-3">
              <Shield size={20} />
            </div>
            <h3 className="text-base font-bold uppercase text-white tracking-wide">
              Sistem Jatuhan, Sapuan &amp; Guntingan
            </h3>
            <p className="text-xs text-neutral-300 mt-2 leading-relaxed">
              Jatuhan sah meliputi <em>Sapuan Tegak</em>, <em>Sapuan Rebah Belakang</em>, <em>Guntingan Pinggang/Kaki</em>, dan <em>Kaitan</em>. Menghempas kepala lawan ke matras (*piledriver*) diharamkan sama sekali dan dikenakan diskualifikasi terus.
            </p>
            <div className="mt-3 text-[11px] font-semibold text-[#ffd24c] flex items-center gap-1.5">
              <span>Dilarang Guntingan Leher</span>
            </div>
          </div>
        </div>

        {/* Interactive Target Scoring Zones Explorer */}
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] backdrop-blur-[16px] p-6 sm:p-8 mb-10 shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)]">
          <div className="border-b border-white/[0.08] pb-4 mb-6">
            <span className="text-xs font-bold uppercase tracking-widest text-[#ff4d5a]">
              Peta Anatomi Sasaran Tanding
            </span>
            <h3
              className="text-2xl sm:text-3xl font-display font-bold uppercase text-white mt-0.5"
              style={{ fontFamily: "var(--font-athletic)" }}
            >
              Zon Mata Sah vs. Zon Larangan (Foul)
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              Pilih kawasan anatomi di bawah untuk melihat nilai mata pukulan/tendangan dan status undang-undang pertandingan.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left selector pills */}
            <div className="lg:col-span-5 space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                Zon Sah Mata (Vest Torso):
              </p>
              <div className="grid grid-cols-2 gap-2">
                {TARGET_ZONES.filter((z) => z.status === "LEGAL").map((zone) => (
                  <button
                    key={zone.id}
                    type="button"
                    onClick={() => setSelectedZone(zone.id)}
                    className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                      selectedZone === zone.id
                        ? "border-emerald-500/50 bg-emerald-500/10 text-white shadow-[0_0_14px_rgba(16,185,129,0.25),inset_0_1px_0_rgba(255,255,255,0.1)]"
                        : "border-white/[0.08] bg-white/[0.02] text-[#d1d1d5] hover:border-white/20 hover:bg-white/[0.05] backdrop-blur-sm"
                    }`}
                  >
                    <p className="text-xs font-bold leading-tight">{zone.name}</p>
                    <span className="inline-block mt-1 text-[10px] text-emerald-400 font-semibold">
                      1 pt (Pukulan) · 2 pts (Tendangan)
                    </span>
                  </button>
                ))}
              </div>

              <p className="text-[11px] font-bold uppercase tracking-wider text-[#ff4d5a] pt-3">
                Zon Larangan Mutlak (Penalti &amp; DQ):
              </p>
              <div className="grid grid-cols-2 gap-2">
                {TARGET_ZONES.filter((z) => z.status === "PROHIBITED").map((zone) => (
                  <button
                    key={zone.id}
                    type="button"
                    onClick={() => setSelectedZone(zone.id)}
                    className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                      selectedZone === zone.id
                        ? "border-[rgba(255,56,69,0.5)] bg-[rgba(255,56,69,0.12)] text-white shadow-[0_0_14px_rgba(225,6,0,0.25),inset_0_1px_0_rgba(255,255,255,0.1)]"
                        : "border-white/[0.08] bg-white/[0.02] text-[#d1d1d5] hover:border-white/20 hover:bg-white/[0.05] backdrop-blur-sm"
                    }`}
                  >
                    <p className="text-xs font-bold leading-tight">{zone.name}</p>
                    <span className="inline-block mt-1 text-[10px] text-[#ff4d5a] font-semibold">
                      Dilarang (0 pt) · Penalti
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Right details card */}
            <div className="lg:col-span-7 rounded-xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-[16px] p-5 sm:p-6 shadow-[0_4px_24px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.06)]">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-3.5 h-3.5 rounded-full ${
                      activeZone.status === "LEGAL" ? "bg-emerald-500" : "bg-red-500"
                    }`}
                  />
                  <h4 className="text-lg font-bold text-white uppercase">{activeZone.name}</h4>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    activeZone.status === "LEGAL"
                      ? "bg-emerald-500/12 border border-emerald-500/40 text-emerald-400"
                      : "bg-[rgba(255,56,69,0.12)] border border-[rgba(255,56,69,0.4)] text-[#ff4d5a]"
                  }`}
                >
                  {activeZone.status === "LEGAL" ? "ZON MATA SAH" : "ZON LARANGAN KERAS"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="rounded-lg bg-white/[0.02] border border-white/[0.06] p-3 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                  <span className="text-[10px] uppercase font-bold text-neutral-400">
                    Mata Pukulan Tangan
                  </span>
                  <p className="text-2xl font-mono font-bold text-white mt-0.5">
                    {activeZone.pointsPunch > 0 ? `+${activeZone.pointsPunch} pt` : "0 pt"}
                  </p>
                </div>
                <div className="rounded-lg bg-white/[0.02] border border-white/[0.06] p-3 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                  <span className="text-[10px] uppercase font-bold text-neutral-400">
                    Mata Tendangan Kaki
                  </span>
                  <p className="text-2xl font-mono font-bold text-[#ff4d5a] mt-0.5">
                    {activeZone.pointsKick > 0 ? `+${activeZone.pointsKick} pts` : "0 pt"}
                  </p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-neutral-300">
                <p>
                  <strong>Kawasan Anatomi:</strong> {activeZone.description}
                </p>
                <div
                  className={`p-3 rounded border text-xs leading-relaxed ${
                    activeZone.status === "LEGAL"
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-200"
                      : "bg-[rgba(255,56,69,0.1)] border-[rgba(255,56,69,0.3)] text-[#ff99a0]"
                  }`}
                >
                  <strong>Ketetapan PERSILAT 2026:</strong> {activeZone.ruleNote}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Senior Weight Divisions Section */}
        <div id="weight-classes" className="rounded-2xl border border-white/[0.08] bg-white/[0.025] backdrop-blur-[16px] p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4 mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#ff4d5a]">
                Kategori Tanding Dewasa (Senior)
              </span>
              <h3
                className="text-2xl sm:text-3xl font-display font-bold uppercase text-white mt-0.5"
                style={{ fontFamily: "var(--font-athletic)" }}
              >
                Divisyen Berat Badan (Kelas A hingga Terbuka)
              </h3>
              <p className="text-xs text-neutral-400 mt-1">
                Kategori umur Dewasa (17 hingga 45 tahun) dipertandingkan mengikut braket berat badan piawai.
              </p>
            </div>

            {/* Zero weight tolerance badge */}
            <div className="flex items-center gap-2 rounded-lg border border-[rgba(255,56,69,0.35)] bg-[rgba(255,56,69,0.1)] px-3.5 py-2 text-xs text-[#f0f0f2] backdrop-blur-sm max-w-xs">
              <ShieldAlert size={18} className="text-[#ff4d5a] flex-none" />
              <span>
                <strong>Zero Weight Tolerance:</strong> Tiada toleransi berat pada timbangan rasmi pagi perlawanan. Lebihan 50g membawa kepada pembatalan serta-merta.
              </span>
            </div>
          </div>

          {/* Search Bar for Weight Classes */}
          <div className="mb-4 relative max-w-sm">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
            />
            <input
              type="search"
              value={weightSearch}
              onChange={(e) => setWeightSearch(e.target.value)}
              placeholder="Cari kelas berat (cth: Kelas C, 55kg)..."
              className="w-full min-h-[42px] pl-9 pr-3 rounded-xl border border-white/[0.1] bg-white/[0.03] backdrop-blur-[12px] text-xs text-white placeholder-[#7b7d85] focus:border-[#ff3845] focus:bg-white/[0.05] focus:shadow-[0_0_0_2px_rgba(225,6,0,0.2),0_8px_24px_rgba(0,0,0,0.5)] focus:outline-none transition-all"
            />
          </div>

          {/* Weight Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredWeights.map((wc) => (
              <div
                key={wc.classCode}
                className="rounded-xl border border-white/[0.08] bg-white/[0.025] backdrop-blur-[12px] p-3.5 shadow-[0_4px_16px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.05)] hover:border-[rgba(255,56,69,0.45)] hover:bg-white/[0.045] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.4),0_0_16px_rgba(225,6,0,0.12),inset_0_1px_0_rgba(255,255,255,0.1)] transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-white">{wc.classCode}</span>
                  <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-[rgba(255,56,69,0.12)] text-[#ff4d5a] border border-[rgba(255,56,69,0.35)]">
                    Senior
                  </span>
                </div>
                <div className="space-y-1 text-xs">
                  <p className="text-neutral-300">
                    <strong className="text-white">Lelaki:</strong> {wc.maleRange}
                  </p>
                  <p className="text-neutral-300">
                    <strong className="text-white">Wanita:</strong> {wc.femaleRange || "—"}
                  </p>
                  <p className="text-[11px] text-neutral-400 pt-1 line-clamp-2">
                    {wc.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
