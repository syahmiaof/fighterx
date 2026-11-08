"use client";

import { useRef } from "react";
import { Star, ShieldCheck, CheckCircle2, ChevronLeft, ChevronRight, MessageSquareQuote } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  club: string;
  association: string;
  avatarText: string;
  discipline: string;
  quote: string;
  stats: string;
}

const testimonials: Testimonial[] = [
  {
    id: "pssgm-selangor",
    name: "Cikgu Azman bin Kassim",
    role: "Ketua Jurulatih Gelanggang",
    club: "Gelanggang Gayong Harimau",
    association: "PSSGM Selangor",
    avatarText: "AK",
    discipline: "Silat Olahraga & Seni",
    quote:
      "Dengan FighterX, pemantauan kehadiran dan log latihan fizikal atlet remaja kami kini 100% telus. Kami dapat kenal pasti pesilat paling berdisiplin sebelum menyenaraikan mereka ke Sirkit Remaja Kebangsaan.",
    stats: "48 Atlet Aktif · 96% Kehadiran",
  },
  {
    id: "psslm-johor",
    name: "Guru Muda Shahrul Nizam",
    role: "Pengurus Pasukan & Jurulatih Tanding",
    club: "Kelab Silat Lincah Selatan",
    association: "PSSLM Johor",
    avatarText: "SN",
    discipline: "Silat Olahraga (Tanding)",
    quote:
      "Modul pemantauan berat badan berjadual dalam FighterX benar-benar menyelamatkan atlet kami daripada dehidrasi melampau menjelang timbang berat rasmi. Ketahanan kardio atlet dalam pusingan ke-3 meningkat ketara.",
    stats: "32 Atlet Kombat · 6 Emas",
  },
  {
    id: "psscm-tengah",
    name: "Ustaz Hafizuddin Omar",
    role: "Ketua Jurulatih Cawangan IPT",
    club: "Persatuan Silat Cekak Kampus",
    association: "PSSCM Zon Tengah",
    avatarText: "HO",
    discipline: "Silat Seni (Baku & Bela Diri)",
    quote:
      "Struktur log penilaian jurus seni sangat tersusun. Pesilat IPT dapat meneliti rekod masa dan ketepatan kaedah mereka sendiri dengan bimbingan kami. Ini memudahkan penilaian kemajuan kontinjen universiti.",
    stats: "65 Atlet Mahasiswa · 4 Jurulatih",
  },
  {
    id: "sendeng-melaka",
    name: "Cikgu Rostam Effendi",
    role: "Jurulatih Kanan Gelanggang",
    club: "Gelanggang Sendeng Warisan",
    association: "Silat Sendeng Melaka",
    avatarText: "RE",
    discipline: "Silat Seni & Olahraga",
    quote:
      "Antara muka FighterX sangat garang dan membakar semangat anak-anak murid. Mereka ternanti-nanti markah latihan mingguan mereka bertambah setiap kali kami mengesahkan sesi petang di gelanggang.",
    stats: "40 Pesilat · 100% Verifikasi",
  },
];

export function TestimonialsSection() {
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
                MAKLUM BALAS KELAB
              </span>
              <h2
                id="testimonials-heading"
                className="text-2xl sm:text-3xl font-bold font-athletic tracking-wide text-white uppercase leading-none"
              >
                Suara Jurulatih &amp; Gelanggang
              </h2>
            </div>
          </div>

          {/* Minimalist Carousel Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              aria-label="Scroll testimoni ke kiri"
              className="w-8 h-8 rounded-full border border-[#3E4048] bg-[#14151B]/90 hover:border-[#FF3845] hover:bg-[#FF3845]/15 hover:text-[#FF3845] text-white flex items-center justify-center transition-all duration-200"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => scroll("right")}
              aria-label="Scroll testimoni ke kanan"
              className="w-8 h-8 rounded-full border border-[#3E4048] bg-[#14151B]/90 hover:border-[#FF3845] hover:bg-[#FF3845]/15 hover:text-[#FF3845] text-white flex items-center justify-center transition-all duration-200"
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
          aria-label="Koleksi maklum balas jurulatih silat yang boleh diskrol secara mendatar"
          className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth pb-2 pt-1 focus:outline-none focus:ring-1 focus:ring-[#FF3845]/50 rounded-xl"
        >
          {testimonials.map((item) => (
            <article
              key={item.id}
              className="w-[310px] sm:w-[380px] md:w-[420px] shrink-0 snap-start p-5 rounded-xl border border-[#34353D]/80 bg-gradient-to-br from-[#16171D]/90 via-[#111215]/85 to-[#0A0B0E]/90 backdrop-blur-md shadow-lg flex flex-col justify-between hover:border-[#FF3845]/60 transition-all duration-300"
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
                    <span>Disahkan</span>
                  </div>
                </div>

                {/* Quote Text (Compact & Crisp) */}
                <p className="text-xs text-[#D7D8DD] leading-relaxed italic mb-4 line-clamp-3">
                  &ldquo;{item.quote}&rdquo;
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
                      {item.role} · <span className="text-[#FF3845] font-semibold">{item.association}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[9.5px] font-mono text-[#868890] block">
                    {item.stats}
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
