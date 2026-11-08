import {
  ShieldCheck,
  Info,
  ExternalLink,
  Building2,
} from "lucide-react";
import { OFFICIAL_DISCLAIMER } from "@/lib/guidelines/rules-data";

export function OfficialDisclaimer() {
  return (
    <section
      className="rounded-[14px] sm:rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 sm:p-7 backdrop-blur-[16px] shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)]"
      aria-label="Sumber rasmi dan penafian undang-undang"
    >
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        {/* Left Side: Citations */}
        <div className="flex-1">
          <div className="inline-flex items-center gap-2 rounded-full bg-[rgba(255,56,69,0.12)] border border-[rgba(255,56,69,0.35)] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#ff4d5a] backdrop-blur-sm">
            <ShieldCheck size={14} aria-hidden="true" />
            Badan Induk &amp; Rujukan Rasmi
          </div>

          <h3 className="mt-2.5 text-xl sm:text-2xl font-bold text-white font-[var(--font-athletic)] tracking-wide uppercase">
            {OFFICIAL_DISCLAIMER.effectiveEdition}
          </h3>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 flex items-start gap-3.5 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] hover:bg-white/[0.05] hover:border-white/[0.15] transition-all">
              <div className="w-9 h-9 rounded-xl bg-[rgba(255,56,69,0.12)] border border-[rgba(255,56,69,0.35)] flex items-center justify-center text-[#ff4d5a] shrink-0">
                <Building2 size={17} aria-hidden="true" />
              </div>
              <div>
                <span className="block text-[10px] font-bold uppercase text-[#A6A7AD] tracking-wider">
                  Badan Antarabangsa
                </span>
                <strong className="block text-xs text-white font-semibold mt-0.5">
                  {OFFICIAL_DISCLAIMER.governingBody}
                </strong>
                <a
                  href={OFFICIAL_DISCLAIMER.governingBodyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 inline-flex items-center gap-1 text-[11px] text-[#ff4d5a] hover:underline"
                >
                  worldpencaksilat.org <ExternalLink size={11} aria-hidden="true" />
                </a>
              </div>
            </div>

            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 flex items-start gap-3.5 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] hover:bg-white/[0.05] hover:border-white/[0.15] transition-all">
              <div className="w-9 h-9 rounded-xl bg-[rgba(60,160,255,0.12)] border border-[rgba(60,160,255,0.35)] flex items-center justify-center text-[#64b7ff] shrink-0">
                <ShieldCheck size={17} aria-hidden="true" />
              </div>
              <div>
                <span className="block text-[10px] font-bold uppercase text-[#A6A7AD] tracking-wider">
                  Badan Induk Kebangsaan
                </span>
                <strong className="block text-xs text-white font-semibold mt-0.5">
                  {OFFICIAL_DISCLAIMER.nationalBody}
                </strong>
                <span className="block text-[11px] text-[#64b7ff]/90">
                  Pihak Berkuasa Pencak Silat Malaysia
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Disclaimer Box */}
        <div className="lg:max-w-md rounded-xl border border-[rgba(240,180,40,0.25)] bg-[rgba(240,180,40,0.04)] p-5 flex items-start gap-3.5 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
          <Info size={20} className="text-[#ffd24c] shrink-0 mt-0.5" aria-hidden="true" />
          <div className="text-xs space-y-2">
            <strong className="block text-[#ffd24c] text-xs uppercase tracking-wide">
              Penafian Rasmi &amp; Panduan Kejohanan (Disclaimer)
            </strong>
            <p className="leading-relaxed text-[11px] text-[#C5C6CA]">
              {OFFICIAL_DISCLAIMER.advisoryTextBm}
            </p>
            <p className="leading-relaxed text-[10px] text-[#ffd24c]/70 border-t border-white/[0.08] pt-2 italic">
              {OFFICIAL_DISCLAIMER.advisoryTextEn}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
