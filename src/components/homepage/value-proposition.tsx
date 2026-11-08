"use client";

import Link from "next/link";
import { ArrowUpRight, Activity, CalendarCheck, ShieldCheck } from "lucide-react";

const valuePillars = [
  {
    number: "01",
    icon: Activity,
    title: "Analitik Prestasi Digital",
    tagline: "Verifikasi Latihan & Keletihan (RPE)",
    description:
      "Merekod log latihan harian, bukti video teknik, dan skala keletihan kardio secara telus untuk menilai kesiapsiagaan atlet sebelum kejohanan.",
    linkText: "Ketahui Disiplin Silat",
    href: "/disciplines",
  },
  {
    number: "02",
    icon: CalendarCheck,
    title: "Sains Sukan & Periodisasi",
    tagline: "Puncak Prestasi Tanpa Beban Lebih",
    description:
      "Perancangan fasa latihan berstruktur (Umum, Khusus, Pra-Tanding, Kemuncak) digabungkan dengan protokol penurunan berat badan selamat bebas dehidrasi.",
    linkText: "Panduan Sains Sukan",
    href: "/knowledge",
  },
  {
    number: "03",
    icon: ShieldCheck,
    title: "Piawaian PERSILAT 2026",
    tagline: "Pemarkahan Rasmi & Format Digital",
    description:
      "Sistem pemarkahan rasmi tanding (1 Pukulan, 2 Tendangan, 3 Jatuhan), had kuncian 5 saat, dan ketepatan 100 Jurus Baku selaras manual PESAKA.",
    linkText: "Buka Rulebook PERSILAT",
    href: "/guidelines",
  },
];

export function ValueProposition() {
  return (
    <section
      className="relative z-10 py-14 md:py-20 bg-black/25 backdrop-blur-[2px] border-b border-[#26272C]/40 overflow-hidden"
      id="kelebihan"
      aria-labelledby="value-prop-heading"
    >
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Minimalist Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <p className="text-[11px] sm:text-xs font-mono font-semibold tracking-[0.25em] text-[#FF3845] uppercase mb-2">
            — NILAI TERAS FIGHTERX —
          </p>
          <h2
            id="value-prop-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold font-athletic tracking-wider text-white uppercase"
          >
            Sains Sukan Bertemu Warisan Silat
          </h2>
          <p className="text-xs sm:text-sm text-[#96989F] mt-2 max-w-xl mx-auto leading-relaxed">
            Tiga tunjang utama yang memperkasa pengurusan kelab silat moden dan membimbing pesilat mencapai potensi tertinggi di pentas kebangsaan.
          </p>
        </div>

        {/* 3 Balanced Minimalist Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {valuePillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.number}
                className="group relative p-7 sm:p-8 rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent hover:border-[#FF3845]/50 hover:bg-white/[0.06] hover:shadow-[0_12px_40px_rgba(225,6,0,0.12)] transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-[#FF3845] group-hover:scale-105 group-hover:border-[#FF3845]/40 transition-all">
                      <Icon size={24} strokeWidth={2} />
                    </div>
                    <span className="text-xs font-mono font-bold text-white/30 group-hover:text-[#FF3845] transition-colors">
                      {pillar.number}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold font-athletic text-white tracking-wide uppercase mb-1">
                    {pillar.title}
                  </h3>
                  <div className="text-[11px] font-mono text-[#FF3845] uppercase font-semibold mb-3">
                    {pillar.tagline}
                  </div>
                  <p className="text-xs sm:text-sm text-[#C5C6CA] leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-white/10">
                  <Link
                    href={pillar.href}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-white group-hover:text-[#FF3845] transition-colors"
                  >
                    <span>{pillar.linkText}</span>
                    <ArrowUpRight
                      size={14}
                      className="text-[#FF3845] opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                    />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
