import Link from "next/link";
import { ArrowRight, BookOpen, Building2, Flame } from "lucide-react";

export function DisciplinesCTA() {
  return (
    <section className="py-14 sm:py-20 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <div className="rounded-2xl border border-white/[0.1] bg-white/[0.025] backdrop-blur-[20px] p-8 sm:p-12 shadow-[0_16px_48px_rgba(0,0,0,0.5),0_0_30px_rgba(225,6,0,0.15),inset_0_1px_0_rgba(255,255,255,0.08)] relative overflow-hidden">
          {/* Subtle decorative glow */}
          <div
            className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-red-600/10 blur-3xl pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-red-600/10 blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[rgba(255,56,69,0.35)] bg-[rgba(255,56,69,0.12)] text-[#ff4d5a] text-xs font-bold uppercase tracking-widest mb-3">
              <Flame size={13} className="text-red-500" /> Sertai Ekosistem Silat Kebangsaan
            </div>

            <h2
              className="text-3xl sm:text-5xl font-display font-bold uppercase text-white tracking-tight"
              style={{ fontFamily: "var(--font-athletic)" }}
            >
              SEDIA MEMPERKASA <span className="text-red-600">GELANGGANG ANDA?</span>
            </h2>

            <p className="mt-3 text-sm sm:text-base text-neutral-300 max-w-2xl mx-auto leading-relaxed">
              Daftarkan kelab anda di platform FighterX untuk akses penuh modul kurikulum latihan Seni &amp; Olahraga, penjejakan KPI atlet, dan penyertaan kejohanan rasmi.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/register-club"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#e10600] border border-[#ff3845] px-6 py-3 text-xs font-bold text-white hover:bg-red-600 shadow-[0_0_20px_rgba(225,6,0,0.4)] transition-all cursor-pointer"
              >
                <Building2 size={15} /> Daftar Kelab Sekarang (30 Hari Percuma)
                <ArrowRight size={15} />
              </Link>
              <Link
                href="/guidelines"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-white/[0.15] bg-white/[0.04] backdrop-blur-sm px-5 py-3 text-xs font-bold text-[#e5e5e7] hover:bg-white/[0.08] hover:border-white/30 hover:text-white transition-all cursor-pointer"
              >
                <BookOpen size={15} /> Terokai Panduan Peraturan PERSILAT 2026
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
