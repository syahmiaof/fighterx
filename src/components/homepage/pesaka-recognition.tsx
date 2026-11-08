"use client";

import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, ArrowRight, FileText, CheckCircle2 } from "lucide-react";

const foundingBodies = [
  {
    name: "Pertubuhan Silat Seni Gayong Malaysia",
    shortName: "PSSGM",
    logo: "/assets/silat-logos/pertubuhan-silat-seni-gayong-malaysia.png",
    founder: "Mahaguru Dato' Meor Abdul Rahman",
    est: "1940-an",
  },
  {
    name: "Pertubuhan Seni Silat Lincah Malaysia",
    shortName: "PSSLM",
    logo: "/assets/silat-logos/pertubuhan-seni-silat-lincah-malaysia.png",
    founder: "Mahaguru Tan Sri Omardin Mauju",
    est: "1960-an",
  },
  {
    name: "Persatuan Seni Silat Cekak Malaysia",
    shortName: "PSSCM",
    logo: "/assets/silat-logos/persatuan-seni-silat-cekak-malaysia.png",
    founder: "Ustaz Haji Hanafi Ahmad",
    est: "1965",
  },
  {
    name: "Pertubuhan Seni Gayung Fatani Malaysia",
    shortName: "PSGFM",
    logo: "/assets/silat-logos/pertubuhan-seni-gayung-fatani-malaysia.png",
    founder: "Tuan Guru Hj Anuar Abdul Wahab AMN",
    est: "1976",
  },
];

export function PesakaRecognition() {
  return (
    <section
      className="relative z-10 py-14 md:py-20 bg-black/25 backdrop-blur-[2px] border-b border-[#26272C]/40 overflow-hidden"
      id="pesaka"
      aria-labelledby="pesaka-heading"
    >
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Minimalist Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <p className="text-[11px] sm:text-xs font-mono font-semibold tracking-[0.25em] text-[#FF3845] uppercase mb-2">
            — PENGIKTIRAFAN BADAN INDUK KEBANGSAAN —
          </p>
          <h2
            id="pesaka-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold font-athletic tracking-wider text-white uppercase"
          >
            Piawaian Rasmi PESAKA &amp; PERSILAT
          </h2>
          <p className="text-xs sm:text-sm text-[#96989F] mt-2 max-w-xl mx-auto leading-relaxed">
            Platform pengurusan latihan silat yang berlandaskan tatakelola kebangsaan PESAKA Malaysia dan piawaian antarabangsa PERSILAT.
          </p>
        </div>

        {/* Prestige Executive Endorsement Card */}
        <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-6 sm:p-8 lg:p-10 mb-12 shadow-[0_16px_50px_rgba(0,0,0,0.5)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* PESAKA Emblem Column */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center text-center">
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 mb-3 flex items-center justify-center">
                <Image
                  src="/assets/silat-logos/pesaka-malaysia.png"
                  alt="Persekutuan Silat Kebangsaan Malaysia (PESAKA)"
                  width={160}
                  height={160}
                  className="object-contain max-h-36 w-auto drop-shadow-[0_8px_24px_rgba(225,6,0,0.35)]"
                  priority
                />
              </div>
              <span className="px-3 py-1 rounded-full border border-[#FF3845]/40 bg-[#FF3845]/10 text-[#FF3845] text-[10px] font-bold tracking-wider uppercase">
                Badan Induk Rasmi
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white mt-2">
                PESAKA MALAYSIA
              </h3>
              <p className="text-[11px] font-mono text-[#8C8E97] mt-0.5">
                Dinaungi KBS, MSN &amp; MOM
              </p>
            </div>

            {/* Endorsement Content Column */}
            <div className="lg:col-span-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#FF3845] uppercase tracking-wider mb-2">
                  <ShieldCheck size={16} />
                  <span>Jaminan Piawaian &amp; Keselarasan Kurikulum</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold font-athletic text-white tracking-wide uppercase mb-3">
                  Sokongan Penuh Terhadap Ekosistem Digital Pesilat
                </h3>
                <p className="text-xs sm:text-sm text-[#C5C6CA] leading-relaxed mb-5 italic border-l-2 border-[#FF3845] pl-3.5">
                  &ldquo;Pembangunan pesilat berdaya saing di peringkat dunia menuntut sinergi padu antara disiplin warisan pendekar dan aplikasi teknologi sains sukan semasa. FighterX membuka lembaran baharu pengesahan bakat dan ketelusan prestasi silat negara.&rdquo;
                </p>

                {/* 3 Status Pills */}
                <div className="flex flex-wrap items-center gap-2.5 mb-6">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] text-xs font-mono text-[#D8DAE0]">
                    <CheckCircle2 size={13} className="text-[#22C55E]" />
                    <span>Standard PERSILAT 2026</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] text-xs font-mono text-[#D8DAE0]">
                    <CheckCircle2 size={13} className="text-[#22C55E]" />
                    <span>Akreditasi SKK &amp; MSN</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] text-xs font-mono text-[#D8DAE0]">
                    <CheckCircle2 size={13} className="text-[#22C55E]" />
                    <span>Integriti 100 Jurus Baku</span>
                  </span>
                </div>
              </div>

              {/* Action Links */}
              <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/10">
                <Link
                  href="/guidelines"
                  className="button button-outline text-xs px-4 py-2 hover:border-[#FF3845]"
                >
                  <FileText size={14} className="text-[#FF3845]" />
                  <span>Semak Format PERSILAT 2026</span>
                </Link>
                <Link
                  href="/associations"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-white hover:text-[#FF3845] transition-colors"
                >
                  <span>Lihat Direktori 26 Persatuan</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Founding Bodies Showcase */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <p className="text-[10px] font-mono font-bold tracking-widest text-[#FF3845] uppercase">
                TONGGAK SEJARAH PERSILATAN NEGARA
              </p>
              <h3 className="text-xl sm:text-2xl font-bold font-athletic text-white tracking-wide uppercase">
                Empat (4) Anggota Pengasas Teras PESAKA Malaysia
              </h3>
            </div>
            <Link
              href="/associations"
              className="text-xs font-semibold text-[#8C8E97] hover:text-white inline-flex items-center gap-1 transition-colors"
            >
              <span>Lihat Semua 26 Persatuan</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {foundingBodies.map((body) => (
              <div
                key={body.shortName}
                className="group relative p-6 rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent hover:border-[#FF3845]/50 hover:bg-white/[0.06] hover:shadow-[0_12px_36px_rgba(225,6,0,0.12)] transition-all duration-300 flex flex-col items-center text-center justify-between"
              >
                {/* Logo in Full Color */}
                <div className="h-24 w-full flex items-center justify-center mb-3">
                  <Image
                    src={body.logo}
                    alt={body.name}
                    width={90}
                    height={90}
                    unoptimized
                    className="max-h-20 w-auto object-contain filter drop-shadow-[0_4px_16px_rgba(0,0,0,0.7)] group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Details */}
                <div className="w-full">
                  <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-mono font-bold text-[#FF3845] bg-[#FF3845]/10 border border-[#FF3845]/30">
                    {body.shortName}
                  </span>
                  <h4 className="text-xs font-bold text-white mt-2 leading-snug line-clamp-2">
                    {body.name}
                  </h4>
                  <p className="text-[11px] text-[#8C8E97] mt-1">
                    {body.founder}
                  </p>
                </div>

                {/* Metadata Line */}
                <div className="mt-4 pt-3 border-t border-white/10 w-full text-[10px] font-mono text-[#71737B] flex justify-between">
                  <span>Asal Penubuhan</span>
                  <span className="text-[#C5C6CA] font-bold">{body.est}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
