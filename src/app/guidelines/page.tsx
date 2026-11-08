import type { Metadata } from "next";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeAlert,
  BookOpenCheck,
  Clock3,
  Check,
  CheckCircle2,
  Flag,
  HandFist,
  Info,
  Medal,
  ShieldCheck,
  Swords,
  Weight,
  X,
  XCircle,
  Sparkles,
  Scale,
} from "lucide-react";
import { GuidelinesMotion } from "@/components/guidelines/guidelines-motion";
import { SiteHeader } from "@/components/site-header";
import { TandingCalculator } from "@/components/guidelines/tanding-calculator";
import { JurusCalculator } from "@/components/guidelines/jurus-calculator";
import { RulebookExplorer } from "@/components/guidelines/rulebook-explorer";
import { OfficialDisclaimer } from "@/components/guidelines/official-disclaimer";

export const metadata: Metadata = {
  title: "Peraturan Pertandingan PERSILAT 2026 · Panduan Rasmi FighterX",
  description:
    "Rujukan interaktif rasmi Peraturan Pertandingan Pencak Silat Antarabangsa PERSILAT 2026: panduan mata tanding, had 5 saat jatuhan, rubrik seni, dan kalkulator pemarkahan.",
};

interface QuickRule {
  badge: string;
  badgeTone: string;
  title: string;
  largeValue: string;
  description: string;
  points: string[];
}

const quickRules: QuickRule[] = [
  {
    badge: "SISTEM MATA",
    badgeTone: "text-[#ffd24c] border-[rgba(240,180,40,0.35)] bg-[rgba(240,180,40,0.12)]",
    title: "Mata Serangan Sah",
    largeValue: "1 · 2 · 3",
    description: "Serangan tepat ke vest dengan kaedah pencak silat.",
    points: [
      "1 Mata: Pukulan tangan tepat ke vest",
      "2 Mata: Sepakan kaki bertenaga & seimbang",
      "3 Mata: Jatuhan sah (sapuan, bantingan)",
    ],
  },
  {
    badge: "PERATURAN EMAS",
    badgeTone: "text-[#ff4d5a] border-[rgba(255,56,69,0.35)] bg-[rgba(255,56,69,0.12)]",
    title: "Had 5 Saat Jatuhan",
    largeValue: "5.0 Saat",
    description: "Masa maksimum menyudahkan teknik jatuhan.",
    points: [
      "Tangkap anggota lawan? Masa bermula",
      "Wajib jatuhkan lawan dalam 5 saat",
      "Lebih 5 saat: Wasit sebut 'TI' & 0 mata",
    ],
  },
  {
    badge: "ZON SASARAN",
    badgeTone: "text-[#e5e5e7] border-white/20 bg-white/[0.08]",
    title: "Kawasan Boleh Pukul",
    largeValue: "Vest Sah",
    description: "Hanya serangan ke sasaran badan yang diberi mata.",
    points: [
      "Dada, abdomen & rusuk kiri/kanan",
      "Belakang badan berlapik vest",
      "Kepala, leher & kemaluan HARAM",
    ],
  },
  {
    badge: "HUKUMAN WASIT",
    badgeTone: "text-[#64b7ff] border-[rgba(60,160,255,0.35)] bg-[rgba(60,160,255,0.12)]",
    title: "Tangga Penalti & DQ",
    largeValue: "-1 ke DQ",
    description: "Hukuman kesalahan ringan hingga pembatalan.",
    points: [
      "Teguran I (-1) & Teguran II (-2 mata)",
      "Peringatan I (-5) & Peringatan II (-10)",
      "Peringatan III = Terus DQ serta-merta",
    ],
  },
];

const matchSteps = [
  {
    step: "01",
    icon: Flag,
    title: "Panggilan & Masuk Gelanggang",
    desc: "Masuk selepas isyarat wasit. Beri salam hormat kepada wasit dan ketua pertandingan.",
  },
  {
    step: "02",
    icon: HandFist,
    title: "Buka Langkah Perguruan",
    desc: "Persembahkan 5–10 gerak jurus bertenaga tradisi sebelum bertarung. Tiada markah diberi.",
  },
  {
    step: "03",
    icon: Swords,
    title: "Bertarung Ikut Isyarat 'MULAI'",
    desc: "Bersalaman dan bertanding dengan kaedah silat. Berhenti serta-merta apabila wasit sebut 'TI'.",
  },
  {
    step: "04",
    icon: Medal,
    title: "Keputusan Rasmi & Hormat",
    desc: "Tunggu pengumuman pemenang di sudut masing-masing. Bersalaman dengan lawan dan pegawai.",
  },
];

const dosList = [
  "Pukulan lurus, sanggah, atau layang ke kawasan pelindung vest.",
  "Sepakan sabit, jejag, atau belakang yang bertenaga dan seimbang.",
  "Sapuan kaki rebah/tegak dan guntingan pinggang yang sempurna.",
  "Tangkapan anggota lawan dan sempurnakan jatuhan dalam masa 5 saat.",
  "Menangkis dan mengelak serangan dengan kaedah pasang silat.",
  "Patuhi setiap arahan wasit dan kembali ke sudut semasa rehat 1 minit.",
];

const dontsList = [
  "Sebarang serangan ke kepala, muka, leher atau kemaluan (Potongan keras / DQ).",
  "Menghempas kepala lawan terus ke matras (Pile-driver — Terus DQ).",
  "Memukul, menendang, atau memijak lawan yang sudah jatuh ke matras.",
  "Menyerang selepas wasit menyebut 'TI' atau selepas gong pusingan berbunyi.",
  "Menyerang sendi lutut lawan secara terus (Hyperextension kick).",
  "Pasif lebih 10 saat tanpa inisiatif serangan (Teguran lisan wasit).",
];

function SectionTitle({
  id,
  badge,
  title,
  subtitle,
}: {
  id?: string;
  badge: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-8 sm:mb-10 text-center max-w-2xl mx-auto">
      <span className="inline-block px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold tracking-widest text-[#ff4d5a] bg-[rgba(255,56,69,0.12)] border border-[rgba(255,56,69,0.35)] uppercase mb-2">
        {badge}
      </span>
      <h2
        id={id}
        className="text-2xl sm:text-3xl lg:text-4xl font-bold font-athletic tracking-wide text-white uppercase"
      >
        {title}
      </h2>
      {subtitle && (
        <p className="text-xs sm:text-sm text-[#C5C6CA] mt-2 font-medium leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default function GuidelinesPage() {
  return (
    <main className="guidelines-page min-h-screen relative text-slate-100">
      <SiteHeader currentPage="guidelines" />

      <GuidelinesMotion>
        <div className="guidelines-wrap max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 pt-1 sm:pt-2 pb-12">
          
          {/* ============================================================== */}
          {/* HERO SECTION: PREMIER COMPETITION RULES EXPLORER (CENTERED)    */}
          {/* ============================================================== */}
          <section
            className="relative pt-2 sm:pt-4 pb-6 sm:pb-8 border-b border-white/[0.08] mb-8 sm:mb-10 overflow-visible flex flex-col items-center justify-center min-h-[460px] lg:min-h-[500px]"
            aria-labelledby="guidelines-title"
          >
            {/* Centered Main Editorial: Overline, 3D Title, Subtitle, Actions, & Endorsement (Adjusted to the right) */}
            <div className="relative z-20 w-full max-w-3xl mx-auto lg:translate-x-32 xl:translate-x-44 2xl:translate-x-48 flex flex-col items-center text-center px-2 sm:px-4">
              
              {/* Kicker Overline: Homepage Style (Centered with Flanking Red Rules) */}
              <div className="flex items-center justify-center gap-3 sm:gap-4 mb-3 text-[#f3f2f3] text-[10px] sm:text-xs font-bold tracking-[0.38em] uppercase">
                <span className="w-10 sm:w-16 h-[1.5px] bg-[#FF3845] shrink-0" />
                <span>— PERATURAN RASMI PERSILAT 2026 —</span>
                <span className="w-10 sm:w-16 h-[1.5px] bg-[#FF3845] shrink-0" />
              </div>

              {/* Epic 3D Headline: Large & Centered */}
              <h1 id="guidelines-title" className="hero-display-title text-center mb-3">
                <span className="block title-white text-5xl sm:text-6xl md:text-7xl lg:text-[76px] font-athletic uppercase italic font-black tracking-tight leading-[0.88]">
                  COMPETITION RULES
                </span>
                <span className="block title-crimson text-5xl sm:text-6xl md:text-7xl lg:text-[76px] font-athletic uppercase italic font-black tracking-tight leading-[0.88] mt-1">
                  EXPLORER
                </span>
              </h1>

              {/* Subtitle in Clean Plain Language (Centered with Breathing Room) */}
              <p className="text-sm sm:text-base text-[#D4D5D9] max-w-lg mx-auto font-normal leading-relaxed text-center">
                Rujukan interaktif rasmi Peraturan Pertandingan Pencak Silat Antarabangsa PERSILAT 2026. Ketahui cara kira mata, had jatuhan 5 saat, tangga hukuman wasit, dan rubrik Seni secara mudah dan pantas.
              </p>
            </div>

            {/* Desktop Flank: Enlarged 3D Waist-Up Wasit Character on the Left Side */}
            <div className="hidden lg:flex absolute -left-4 xl:-left-6 2xl:left-0 bottom-0 h-[420px] lg:h-[460px] xl:h-[490px] w-auto flex-col items-center justify-end z-10 pointer-events-none select-none">
              <div className="relative h-full w-auto flex items-end justify-center">
                {/* 3D Volumetric Red Aura Behind Character */}
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(225,6,0,0.5)_0%,_rgba(255,56,69,0.18)_45%,_transparent_72%)] blur-2xl"
                  aria-hidden="true"
                />

                {/* Ground Contact Shadow */}
                <div
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-8 rounded-full bg-black/95 blur-md"
                  aria-hidden="true"
                />
                <div
                  className="absolute bottom-1 left-1/2 -translate-x-1/2 w-3/4 h-5 rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(225,6,0,0.6)_0%,_transparent_75%)] blur-sm"
                  aria-hidden="true"
                />

                {/* Enlarged 3D Waist-Up Wasit Cutout with Soft Base Fade */}
                <Image
                  src="/assets/fighterx/referee-waist-large.png"
                  alt="Wasit Rasmi PERSILAT 2026"
                  width={1012}
                  height={900}
                  priority
                  className="relative z-10 object-contain h-full w-auto drop-shadow-[0_20px_35px_rgba(0,0,0,0.95)] drop-shadow-[0_0_25px_rgba(225,6,0,0.45)]"
                />
              </div>
            </div>

            {/* Mobile/Tablet Fallback: Wasit positioned neatly below centered content */}
            <div className="lg:hidden mt-8 flex flex-col items-center justify-center z-10 select-none">
              <div className="relative h-[320px] sm:h-[360px] w-auto flex items-end justify-center">
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(225,6,0,0.45)_0%,_transparent_70%)] blur-2xl pointer-events-none"
                  aria-hidden="true"
                />
                <div
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-6 rounded-full bg-black/90 blur-md pointer-events-none"
                  aria-hidden="true"
                />
                <Image
                  src="/assets/fighterx/referee-waist-large.png"
                  alt="Wasit Rasmi PERSILAT 2026"
                  width={1012}
                  height={900}
                  priority
                  className="relative z-10 object-contain h-full w-auto drop-shadow-[0_20px_35px_rgba(0,0,0,0.95)]"
                />
              </div>
            </div>

          </section>

          {/* ============================================================== */}
          {/* QUICK NOTICE: MANAGERS' MEETING & BULLETIN NOTE                */}
          {/* ============================================================== */}
          <div className="mb-12 rounded-xl border border-[rgba(240,180,40,0.25)] bg-[rgba(240,180,40,0.04)] p-4 sm:p-5 backdrop-blur-[16px] shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)] flex items-start gap-3.5 text-[#ffd24c]">
            <Info size={18} className="text-[#ffd24c] shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm leading-relaxed text-[#ffd24c]/90">
              <strong className="text-white font-semibold">Peringatan Buletin Kejohanan:</strong> Peraturan di bawah adalah berpandukan Buku Peraturan Rasmi PERSILAT 2026. Atlet dan jurulatih wajib menyemak taklimat pengurus pasukan (managers&apos; meeting) dan buletin teknikal kejohanan (contoh: SUKMA, Sirkit Remaja, Sukan SEA) bagi sebarang ketetapan penganjur khusus.
            </p>
          </div>

          {/* ============================================================== */}
          {/* SECTION 1: 4 PERATURAN TERAS WAJIB TAHU (FROSTED GLASS)        */}
          {/* ============================================================== */}
          <section id="asas-mata" className="mb-16 scroll-mt-24">
            <SectionTitle
              badge="PERATURAN ASAS"
              title="4 Perkara Wajib Tahu Dalam Gelanggang"
              subtitle="Pecahan mata, had masa tangkapan, zon sasaran vest, dan tangga hukuman wasit secara ringkas dan tepat."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {quickRules.map((rule) => (
                <div
                  key={rule.title}
                  className="rounded-[14px] sm:rounded-2xl border border-white/[0.08] bg-white/[0.025] hover:bg-white/[0.045] hover:border-[rgba(255,56,69,0.45)] hover:-translate-y-1 p-5 sm:p-6 backdrop-blur-[16px] shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)] hover:shadow-[0_14px_32px_rgba(0,0,0,0.5),0_0_20px_rgba(225,6,0,0.15),inset_0_1px_0_rgba(255,255,255,0.12)] transition-all group flex flex-col justify-between"
                >
                  <div>
                    {/* Badge */}
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase border mb-3 ${rule.badgeTone}`}
                    >
                      {rule.badge}
                    </span>

                    {/* Title & Big Value */}
                    <h3 className="text-base font-bold text-white font-athletic uppercase tracking-wide">
                      {rule.title}
                    </h3>
                    <div className="my-2.5 text-2xl sm:text-3xl font-extrabold text-white font-athletic tracking-wide">
                      {rule.largeValue}
                    </div>
                    <p className="text-[11px] text-[#A6A7AD] leading-relaxed mb-4">
                      {rule.description}
                    </p>
                  </div>

                  {/* Bullet points */}
                  <div className="space-y-1.5 pt-3 border-t border-white/[0.08]">
                    {rule.points.map((pt) => (
                      <div key={pt} className="flex items-start gap-2 text-[11px] text-slate-300">
                        <CheckCircle2 size={13} className="text-[#e5e5e7] shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ============================================================== */}
          {/* SECTION 2: DUA FORMAT ACARA (TANDING VS SENI)                  */}
          {/* ============================================================== */}
          <section id="format-acara" className="mb-16 scroll-mt-24">
            <SectionTitle
              badge="STRUKTUR PERTANDINGAN"
              title="Dua Kategori Pertandingan Utama"
              subtitle="Tanding dan Seni mempunyai masa, peraturan gelanggang, dan sistem penilaian juri yang berbeza."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card 1: Tanding */}
              <div className="rounded-[14px] sm:rounded-2xl border border-white/[0.08] bg-white/[0.025] hover:bg-white/[0.035] hover:border-white/[0.15] p-5 sm:p-7 backdrop-blur-[16px] shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)] transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[rgba(255,56,69,0.12)] border border-[rgba(255,56,69,0.35)] flex items-center justify-center text-[#ff4d5a]">
                    <Swords size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[#ff4d5a] font-bold tracking-wider uppercase block">
                      KATEGORI TEMPUR
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-white font-athletic uppercase">
                      Tanding (Combat Sport)
                    </h3>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#C5C6CA] leading-relaxed mb-5">
                  Dua pesilat bertarung 1 lawan 1 dalam pusingan masa bersih. Pukulan, sepakan, dan jatuhan dinilai secara mata digital oleh juri perlawanan.
                </p>

                <div className="space-y-2.5 pt-4 border-t border-white/[0.08] text-xs">
                  <div className="flex items-start gap-2.5 text-slate-200">
                    <Clock3 size={15} className="text-[#ff4d5a] shrink-0 mt-0.5" />
                    <span><strong>Masa Bersih:</strong> 3 pusingan × 2:00 minit (Senior &amp; Junior). Jam berhenti waktu rehat atau arahan &quot;TI&quot;.</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-slate-200">
                    <Weight size={15} className="text-[#ffd24c] shrink-0 mt-0.5" />
                    <span><strong>Timbang Berat:</strong> Setiap pagi perlawanan wajib timbang; tiada toleransi lebihan berat (0.00 kg).</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-slate-200">
                    <ShieldCheck size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Pelindung Wajib:</strong> Vest pelindung badan, pelindung kemaluan (groin guard), dan pelindung tulang kering (shin guard).</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Seni */}
              <div className="rounded-[14px] sm:rounded-2xl border border-white/[0.08] bg-white/[0.025] hover:bg-white/[0.035] hover:border-white/[0.15] p-5 sm:p-7 backdrop-blur-[16px] shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)] transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.08] border border-white/20 flex items-center justify-center text-[#e5e5e7]">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[#e5e5e7] font-bold tracking-wider uppercase block">
                      KATEGORI WARISAN
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-white font-athletic uppercase">
                      Jurus &amp; Seni (Artistic)
                    </h3>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#C5C6CA] leading-relaxed mb-5">
                  Persembahan teknikal dalam format kalah mati. Menilai Nilai Kebenaran (ketepatan gerak baku) dan Nilai Kemantapan (tenaga, irama, dan penghayatan).
                </p>

                <div className="flex flex-wrap gap-1.5 mb-5">
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-white/[0.04] text-white/90 border border-white/[0.08] backdrop-blur-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                    Tunggal (100 Jurus Baku)
                  </span>
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-white/[0.04] text-white/90 border border-white/[0.08] backdrop-blur-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                    Ganda (Koreografi 2 Pesilat)
                  </span>
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-white/[0.04] text-white/90 border border-white/[0.08] backdrop-blur-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                    Regu (3 Pesilat Segerak)
                  </span>
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-white/[0.04] text-white/90 border border-white/[0.08] backdrop-blur-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                    Solo Bebas (Kreatif Muzik)
                  </span>
                </div>

                <div className="space-y-2.5 pt-4 border-t border-white/[0.08] text-xs">
                  <div className="flex items-start gap-2.5 text-slate-200">
                    <Clock3 size={15} className="text-[#64b7ff] shrink-0 mt-0.5" />
                    <span><strong>Masa Tepat:</strong> 3:00 minit. Setiap 5 saat terlebih atau terkurang ditolak <strong>−0.05 mata</strong>.</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-slate-200">
                    <Scale size={15} className="text-[#ffd24c] shrink-0 mt-0.5" />
                    <span><strong>Potongan Senjata:</strong> Senjata terlepas atau jatuh ke lantai gelanggang ditolak <strong>−0.50 mata</strong>.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Match Step Flow */}
            <div className="mt-8 rounded-[14px] sm:rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 sm:p-7 backdrop-blur-[16px] shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)]">
              <div className="pb-4 mb-5 border-b border-white/[0.08] flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#ff4d5a] font-semibold">
                    LANGKAH DEMI LANGKAH
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-white font-athletic uppercase">
                    Aliran Satu Perlawanan Tanding
                  </h3>
                </div>
                <span className="text-xs text-[#A6A7AD] hidden sm:block">
                  Patuhi arahan wasit setiap masa
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {matchSteps.map((s, idx) => {
                  const Icon = s.icon;
                  return (
                    <div
                      key={s.step}
                      className="p-4.5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.15] backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-all relative flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-athletic text-2xl font-bold text-[#ff4d5a]">
                            {s.step}
                          </span>
                          <Icon size={18} className="text-[#C5C6CA]" />
                        </div>
                        <h4 className="text-sm font-bold text-white mb-1.5 font-athletic uppercase">
                          {s.title}
                        </h4>
                        <p className="text-[11px] text-[#A6A7AD] leading-relaxed">
                          {s.desc}
                        </p>
                      </div>
                      {idx < matchSteps.length - 1 && (
                        <div className="hidden lg:block absolute -right-2.5 top-1/2 -translate-y-1/2 text-white/30 z-10 pointer-events-none">
                          <ArrowRight size={14} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ============================================================== */}
          {/* SECTION 3: SIMULATOR INTERAKTIF GELANGGANG                    */}
          {/* ============================================================== */}
          <section id="simulators" className="mb-16 scroll-mt-24">
            <SectionTitle
              badge="ALAT INTERAKTIF"
              title="Kalkulator Mata Tanding &amp; Rubrik Seni"
              subtitle="Uji pengiraan mata serangan, tangga potongan hukuman wasit, dan pemasa jatuhan 5 saat secara langsung."
            />

            <div className="space-y-8">
              {/* Tanding Calculator */}
              <div id="tanding-simulator" className="scroll-mt-28">
                <TandingCalculator />
              </div>

              {/* Jurus Calculator */}
              <div id="jurus-simulator" className="scroll-mt-28">
                <JurusCalculator />
              </div>
            </div>
          </section>

          {/* ============================================================== */}
          {/* SECTION 4: APA BOLEH VS APA DILARANG (DOS & DON'TS)            */}
          {/* ============================================================== */}
          <section id="zon-sasaran" className="mb-16 scroll-mt-24">
            <SectionTitle
              badge="TATATERTIB GELANGGANG"
              title="Apa Yang Boleh &amp; Apa Yang Dilarang?"
              subtitle="Panduan jelas dan tepat agar pesilat tidak kehilangan mata atau dibatalkan penyertaan (DQ)."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* DOS (Translucent Glass with Subtle Emerald Accent) */}
              <div className="rounded-[14px] sm:rounded-2xl border border-white/[0.08] bg-white/[0.025] hover:border-white/[0.15] hover:bg-white/[0.035] p-5 sm:p-7 backdrop-blur-[16px] shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)] transition-all">
                <div className="flex items-center gap-3 mb-5 pb-3 border-b border-white/[0.08]">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/12 border border-emerald-500/35 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold tracking-wider text-emerald-400 uppercase block">
                      TINDAKAN SAH
                    </span>
                    <h3 className="text-xl font-bold text-white font-athletic uppercase">
                      Dibenarkan &amp; Diberi Mata
                    </h3>
                  </div>
                </div>

                <ul className="space-y-3">
                  {dosList.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-xs text-slate-200 leading-relaxed">
                      <Check size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* DON'TS (Translucent Glass with Subtle Crimson Accent) */}
              <div className="rounded-[14px] sm:rounded-2xl border border-white/[0.08] bg-white/[0.025] hover:border-white/[0.15] hover:bg-white/[0.035] p-5 sm:p-7 backdrop-blur-[16px] shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)] transition-all">
                <div className="flex items-center gap-3 mb-5 pb-3 border-b border-white/[0.08]">
                  <div className="w-9 h-9 rounded-xl bg-[rgba(255,56,69,0.12)] border border-[rgba(255,56,69,0.35)] flex items-center justify-center text-[#ff4d5a]">
                    <XCircle size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold tracking-wider text-[#ff4d5a] uppercase block">
                      PELANGGARAN KERAS
                    </span>
                    <h3 className="text-xl font-bold text-white font-athletic uppercase">
                      Dilarang &amp; Dikenakan Hukuman
                    </h3>
                  </div>
                </div>

                <ul className="space-y-3">
                  {dontsList.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-xs text-slate-200 leading-relaxed">
                      <X size={15} className="text-[#ff4d5a] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* ============================================================== */}
          {/* SECTION 5: TANGGA POTONGAN HUKUMAN & AMARAN DIRECT DQ          */}
          {/* ============================================================== */}
          <section id="tatatertib-wasit" className="mb-16 scroll-mt-24">
            <SectionTitle
              badge="TINDAKAN WASIT"
              title="Tangga Hukuman &amp; Syarat Terus DQ"
              subtitle="Peringkat hukuman wasit daripada teguran lisan hingga pembatalan penyertaan automatik."
            />

            <div className="rounded-[14px] sm:rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 sm:p-7 backdrop-blur-[16px] shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)]">
              <h3 className="text-lg font-bold text-white font-athletic uppercase mb-4">
                Tangga Potongan Mata Tanding PERSILAT 2026
              </h3>

              {/* Step Flow (Frosted Glass Chips) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
                <div className="p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] text-center transition-all">
                  <span className="text-[9px] font-bold tracking-wider text-[#A6A7AD] uppercase block">
                    BIMBINGAN
                  </span>
                  <div className="font-athletic text-2xl font-bold text-white my-1">
                    0 mata
                  </div>
                  <small className="text-[10px] text-[#A6A7AD] block">Nasihat lisan</small>
                </div>

                <div className="p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] text-center transition-all">
                  <span className="text-[9px] font-bold tracking-wider text-[#ffd24c] uppercase block">
                    TEGURAN I
                  </span>
                  <div className="font-athletic text-2xl font-bold text-[#ffd24c] my-1">
                    −1 mata
                  </div>
                  <small className="text-[10px] text-[#A6A7AD] block">Potongan kecil</small>
                </div>

                <div className="p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] text-center transition-all">
                  <span className="text-[9px] font-bold tracking-wider text-[#ffd24c] uppercase block">
                    TEGURAN II
                  </span>
                  <div className="font-athletic text-2xl font-bold text-[#ffd24c] my-1">
                    −2 mata
                  </div>
                  <small className="text-[10px] text-[#A6A7AD] block">Potongan kedua</small>
                </div>

                <div className="p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] text-center transition-all">
                  <span className="text-[9px] font-bold tracking-wider text-[#ff9e42] uppercase block">
                    PERINGATAN I
                  </span>
                  <div className="font-athletic text-2xl font-bold text-[#ff9e42] my-1">
                    −5 mata
                  </div>
                  <small className="text-[10px] text-[#A6A7AD] block">Kesalahan taktikal</small>
                </div>

                <div className="p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] text-center transition-all">
                  <span className="text-[9px] font-bold tracking-wider text-[#ff6b76] uppercase block">
                    PERINGATAN II
                  </span>
                  <div className="font-athletic text-2xl font-bold text-[#ff6b76] my-1">
                    −10 mata
                  </div>
                  <small className="text-[10px] text-[#A6A7AD] block">Amaran terakhir</small>
                </div>

                <div className="p-3.5 rounded-xl border border-[rgba(255,56,69,0.4)] bg-[rgba(255,56,69,0.08)] hover:bg-[rgba(255,56,69,0.12)] backdrop-blur-md text-center shadow-[0_0_20px_rgba(225,6,0,0.15),inset_0_1px_0_rgba(255,255,255,0.08)] transition-all">
                  <span className="text-[9px] font-bold tracking-wider text-[#ff8088] uppercase block">
                    PERINGATAN III
                  </span>
                  <div className="font-athletic text-2xl font-extrabold text-[#ff4d5a] my-1">
                    DQ
                  </div>
                  <small className="text-[10px] text-[#ff8088] block font-semibold">Dibatalkan</small>
                </div>
              </div>

              {/* Direct DQ Alert Box */}
              <div className="rounded-xl border border-[rgba(255,56,69,0.35)] bg-[rgba(255,56,69,0.05)] p-4 sm:p-5 flex items-start gap-3.5 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)]">
                <BadgeAlert size={22} className="text-[#ff4d5a] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white text-xs sm:text-sm font-bold block mb-1">
                    Diskualifikasi Terus (Direct DQ) Bagi Kesalahan Berat
                  </strong>
                  <p className="text-[11px] sm:text-xs text-[#ffccd0] leading-relaxed">
                    Serangan dengan niat mencederakan lawan ke kepala/leher, menghempas kepala lawan terus ke matras (pile-driver), kegagalan sesi timbang berat (walaupun lebihan 50g), kelakuan biadab terhadap wasit/aparat, atau keputusan positif ujian doping membawa DQ serta-merta tanpa perlu melalui tangga teguran.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ============================================================== */}
          {/* SECTION 6: CARIAN PERATURAN & KELAS BERAT                      */}
          {/* ============================================================== */}
          <section id="carian-peraturan" className="mb-16 scroll-mt-24">
            <SectionTitle
              badge="PANGKALAN DATA PERSILAT"
              title="Carian Peraturan Kejohanan &amp; Kelas Berat"
              subtitle="Cari secara pantas mana-mana ketetapan undang-undang, protokol kad protes VAR, dan jadual had berat rasmi."
            />
            <RulebookExplorer />
          </section>

          {/* ============================================================== */}
          {/* SECTION 7: SENARAI SEMAK HARI KEJOHANAN (CHECKLIST)            */}
          {/* ============================================================== */}
          <section id="senarai-semak" className="mb-16 scroll-mt-24">
            <SectionTitle
              badge="SENARAI SEMAK GELANGGANG"
              title="Semakan Sebelum Masuk Gelanggang"
              subtitle="Senarai semak kelayakan atlet dan protokol sudut jurulatih sebelum loceng perlawanan berbunyi."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Checklist Atlet (Frosted Glass) */}
              <div className="rounded-[14px] sm:rounded-2xl border border-white/[0.08] bg-white/[0.025] hover:bg-white/[0.035] hover:border-white/[0.15] p-5 sm:p-7 backdrop-blur-[16px] shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)] transition-all">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/[0.08]">
                  <span className="text-xs font-mono text-[#ff4d5a] font-bold uppercase">
                    UNTUK ATLET
                  </span>
                  <h3 className="text-lg font-bold text-white font-athletic uppercase">
                    Dokumen &amp; Kelengkapan Keselamatan
                  </h3>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span>Bawa kad pengenalan (MyKad) atau pasport asal untuk pengesahan identiti dan umur.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span>Sediakan sijil perubatan sah. Atlet wanita Senior &amp; Junior wajib deklarasi tidak hamil.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span>Wajib timbang berat setiap pagi perlawanan; tiada sebarang toleransi berat (0.00 kg).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span>Gunakan pelindung kemaluan (groin guard), pelindung tulang kering (shin guards), dan mouthguard jika berpendakap gigi.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span>Kuku mesti pendek; sebarang taping jari mesti mendapat kebenaran doktor kejohanan.</span>
                  </li>
                </ul>
              </div>

              {/* Checklist Coach & VAR (Frosted Glass) */}
              <div className="rounded-[14px] sm:rounded-2xl border border-white/[0.08] bg-white/[0.025] hover:bg-white/[0.035] hover:border-white/[0.15] p-5 sm:p-7 backdrop-blur-[16px] shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)] transition-all">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/[0.08]">
                  <span className="text-xs font-mono text-[#ffd24c] font-bold uppercase">
                    UNTUK JURULATIH (COACH)
                  </span>
                  <h3 className="text-lg font-bold text-white font-athletic uppercase">
                    Protokol Sudut &amp; Kad Protes VAR
                  </h3>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span>Maksimum 2 jurulatih bertauliah di sudut Tanding berpakaian seragam hitam rasmi silat.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span>Arahan teknikal hanya boleh disampaikan ketika rehat 1 minit antara pusingan.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Tanding VAR:</strong> 2 kad protes setiap perlawanan (3 pusingan); kad dipulangkan jika semakan video berjaya.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Jurus VAR:</strong> 1 kad protes bagi setiap persembahan sebelum pemenang diumumkan; hanya untuk semakan fakta hukuman.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span>Kad mesti diangkat serta-merta selepas kejadian sebelum perlawanan dimulakan semula dengan arahan MULAI.</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* ============================================================== */}
          {/* SECTION 8: PENAFIAN RASMI & SUMBER DOKUMEN                     */}
          {/* ============================================================== */}
          <div className="mb-12">
            <OfficialDisclaimer />
          </div>

          {/* Footer Citation (Frosted Glass) */}
          <footer className="rounded-[14px] sm:rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 sm:p-6 backdrop-blur-[16px] shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[rgba(255,56,69,0.12)] border border-[rgba(255,56,69,0.35)] flex items-center justify-center text-[#ff4d5a] shrink-0">
                <BookOpenCheck size={20} />
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#ff4d5a] font-bold tracking-wider uppercase block">
                  SUMBER &amp; SKOP RASMI
                </span>
                <h4 className="text-sm font-bold text-white font-athletic uppercase">
                  International Pencak Silat Competition Regulations Year 2026
                </h4>
                <p className="text-[11px] text-[#A6A7AD]">
                  worldpencaksilat.org · Persekutuan Pencak Silat Antarabangsa (PERSILAT) &amp; PESAKA Malaysia.
                </p>
              </div>
            </div>

            <a
              href="https://www.worldpencaksilat.org"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-white/[0.12] bg-white/[0.04] text-xs font-semibold text-white hover:border-[rgba(255,56,69,0.45)] hover:bg-[rgba(255,56,69,0.15)] backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-all shrink-0"
            >
              <span>Layari World Pencak Silat</span>
              <ArrowUpRight size={14} className="text-[#ff4d5a]" />
            </a>
          </footer>

        </div>
      </GuidelinesMotion>
    </main>
  );
}
