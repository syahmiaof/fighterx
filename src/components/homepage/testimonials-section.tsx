"use client";

import { useRef } from "react";
import { Star, ShieldCheck, CheckCircle2, ChevronLeft, ChevronRight, MessageSquareQuote } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  roleEn?: string;
  club: string;
  association: string;
  avatarText: string;
  discipline: string;
  disciplineEn?: string;
  quote: string;
  quoteEn?: string;
  stats: string;
  statsEn?: string;
}

const testimonials: Testimonial[] = [
  {
    id: "pssgm-selangor",
    name: "Cikgu Azman bin Kassim",
    role: "Ketua Jurulatih Gelanggang",
    roleEn: "Head Dojo Coach",
    club: "Gelanggang Gayong Harimau",
    association: "PSSGM Selangor",
    avatarText: "AK",
    discipline: "Silat Olahraga & Seni",
    disciplineEn: "Silat Olahraga & Seni",
    quote:
      "Dengan FighterX, pemantauan kehadiran dan log latihan fizikal atlet remaja kami kini 100% telus. Kami dapat kenal pasti pesilat paling berdisiplin sebelum menyenaraikan mereka ke Sirkit Remaja Kebangsaan.",
    quoteEn:
      "With FighterX, tracking attendance and physical training logs for our youth athletes is 100% transparent. We can accurately identify disciplined exponents before shortlisting them for the National Youth Circuit.",
    stats: "48 Atlet Aktif · 96% Kehadiran",
    statsEn: "48 Active Athletes · 96% Attendance",
  },
  {
    id: "psslm-johor",
    name: "Guru Muda Shahrul Nizam",
    role: "Pengurus Pasukan & Jurulatih Tanding",
    roleEn: "Team Manager & Sparring Coach",
    club: "Kelab Silat Lincah Selatan",
    association: "PSSLM Johor",
    avatarText: "SN",
    discipline: "Silat Olahraga",
    disciplineEn: "Combat Sparring",
    quote:
      "Modul pemantauan berat badan berjadual dalam FighterX benar-benar menyelamatkan atlet kami daripada dehidrasi melampau menjelang timbang berat rasmi. Ketahanan kardio atlet dalam pusingan ke-3 meningkat ketara.",
    quoteEn:
      "The scheduled weight monitoring module in FighterX protected our athletes from extreme dehydration ahead of official weigh-ins. Athlete cardio stamina in the 3rd round has improved noticeably.",
    stats: "32 Atlet Kombat · 6 Emas",
    statsEn: "32 Combat Athletes · 6 Gold",
  },
  {
    id: "psscm-tengah",
    name: "Ustaz Hafizuddin Omar",
    role: "Ketua Jurulatih Cawangan IPT",
    roleEn: "University Chapter Head Coach",
    club: "Persatuan Silat Cekak Kampus",
    association: "PSSCM Zon Tengah",
    avatarText: "HO",
    discipline: "Silat Seni",
    disciplineEn: "Artistic Silat",
    quote:
      "Struktur log penilaian jurus seni sangat tersusun. Pesilat IPT dapat meneliti rekod masa dan ketepatan kaedah mereka sendiri dengan bimbingan kami. Ini memudahkan penilaian kemajuan kontinjen universiti.",
    quoteEn:
      "The artistic form assessment logs are thoroughly structured. University athletes can review their timing and movement precision under our mentorship, streamlining progress evaluations across our squad.",
    stats: "65 Atlet Mahasiswa · 4 Jurulatih",
    statsEn: "65 University Athletes · 4 Coaches",
  },
  {
    id: "sendeng-melaka",
    name: "Cikgu Rostam Effendi",
    role: "Jurulatih Kanan Gelanggang",
    roleEn: "Senior Dojo Coach",
    club: "Gelanggang Sendeng Warisan",
    association: "Silat Sendeng Melaka",
    avatarText: "RE",
    discipline: "Silat Seni & Olahraga",
    disciplineEn: "Silat Seni & Olahraga",
    quote:
      "Antara muka FighterX sangat garang dan membakar semangat anak-anak murid. Mereka ternanti-nanti markah latihan mingguan mereka bertambah setiap kali kami mengesahkan sesi petang di gelanggang.",
    quoteEn:
      "The FighterX interface is inspiring and ignites our students' motivation. They look forward to their weekly training scores rising each time we certify evening dojo sessions.",
    stats: "40 Pesilat · 100% Verifikasi",
    statsEn: "40 Athletes · 100% Verified",
  },
];

export function TestimonialsSection() {
  const { d, locale } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const offset = direction === "left" ? -390 : 390;
    scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
  };

  return (
    <section
      className="relative z-10 pt-8 pb-10 sm:pt-9 sm:pb-12 md:pt-10 md:pb-14 bg-black/25 backdrop-blur-[2px] border-b border-[#26272C]/40 overflow-hidden"
      id="testimoni"
      aria-labelledby="testimonials-heading"
    >
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Minimalist Header Row with Title on Left, Controls on Right */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#FF3845]/15 border border-[#FF3845]/40 flex items-center justify-center text-[#FF3845] shrink-0">
              <MessageSquareQuote size={17} />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#FF3845] uppercase block">
                {d.home.testimonials.overline}
              </span>
              <h2
                id="testimonials-heading"
                className="text-2xl sm:text-3xl font-bold font-athletic tracking-wide text-white uppercase leading-none"
              >
                {d.home.testimonials.title}
              </h2>
            </div>
          </div>

          {/* Minimalist Carousel Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              aria-label={locale === "bm" ? "Scroll testimoni ke kiri" : "Scroll testimonials left"}
              className="tactile-btn w-8 h-8 rounded-full border border-[#3E4048] bg-[#14151B]/90 hover:border-[#FF3845] hover:bg-[#FF3845]/15 hover:text-[#FF3845] text-white flex items-center justify-center transition-colors duration-200"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => scroll("right")}
              aria-label={locale === "bm" ? "Scroll testimoni ke kanan" : "Scroll testimonials right"}
              className="tactile-btn w-8 h-8 rounded-full border border-[#3E4048] bg-[#14151B]/90 hover:border-[#FF3845] hover:bg-[#FF3845]/15 hover:text-[#FF3845] text-white flex items-center justify-center transition-colors duration-200"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Minimalist Horizontal Scrolling Container */}
        <div
          ref={scrollRef}
          tabIndex={0}
          role="region"
          aria-label={
            locale === "bm"
              ? "Koleksi maklum balas jurulatih silat yang boleh diskrol secara mendatar"
              : "Horizontally scrollable silat coach feedback collection"
          }
          className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth pb-2 pt-1 focus:outline-none focus:ring-1 focus:ring-[#FF3845]/50 rounded-xl motion-grid"
        >
          {testimonials.map((item) => (
            <article
              key={item.id}
              className="testimonial-card w-[310px] sm:w-[380px] md:w-[420px] shrink-0 snap-start p-5 rounded-xl border border-[#34353D]/80 bg-gradient-to-br from-[#16171D]/90 via-[#111215]/85 to-[#0A0B0E]/90 backdrop-blur-md shadow-lg flex flex-col justify-between hover:border-[#FF3845]/60 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(0,0,0,0.7),0_0_20px_rgba(225,6,0,0.2)] transition-all duration-300"
            >
              <div>
                {/* Header: 5 Stars + Verified Tag */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-0.5 text-[#FFB800]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={13} fill="currentColor" stroke="none" />
                    ))}
                  </div>
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-[#3A3B43] bg-[#0E0F14] text-[9.5px] font-mono text-[#A2A4AC]">
                    <ShieldCheck size={11} className="text-[#FF3845]" />
                    <span>{d.home.testimonials.verified}</span>
                  </div>
                </div>

                {/* Quote Text (Compact & Crisp) */}
                <p className="text-xs text-[#D7D8DD] leading-relaxed italic mb-4 line-clamp-3">
                  &ldquo;{locale === "en" ? (item.quoteEn || item.quote) : item.quote}&rdquo;
                </p>
              </div>

              {/* Minimalist Author Footer */}
              <div className="pt-3 border-t border-[#26272E] flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E10600] to-[#8A0500] flex items-center justify-center font-bold text-[10px] text-white shrink-0 border border-[#FF555A]">
                    {item.avatarText}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white flex items-center gap-1 truncate">
                      <span className="truncate">{item.name}</span>
                      <CheckCircle2 size={11} className="text-[#FF3845] shrink-0" />
                    </h4>
                    <p className="text-[10px] text-[#A0A2AA] truncate">
                      {locale === "en" ? (item.roleEn || item.role) : item.role} ·{" "}
                      <span className="text-[#FF3845] font-semibold">{item.association}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[9.5px] font-mono text-[#868890] block">
                    {locale === "en" ? (item.statsEn || item.stats) : item.stats}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
