"use client";

import { useState, useRef, useEffect, useCallback } from "react";
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
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCollectionMotion } from "@/hooks/useCollectionMotion";
import { useLanguage } from "@/lib/i18n";

gsap.registerPlugin(ScrollTrigger);

export function SilatOlahragaSection() {
  const { dict, locale } = useLanguage();
  const [selectedZone, setSelectedZone] = useState<string>("dada");
  const [weightSearch, setWeightSearch] = useState("");
  const sectionRef = useRef<HTMLElement>(null);
  const weightMotionRef = useCollectionMotion<HTMLDivElement>(weightSearch);
  const entranceTriggeredRef = useRef(false);

  // Helper to remove inline overrides after GSAP finishes
  const cleanInline = useCallback((elements: HTMLElement[]) => {
    elements.forEach((el) => {
      el.style.removeProperty("clip-path");
      el.style.removeProperty("clipPath");
      el.style.removeProperty("transform");
      el.style.removeProperty("opacity");
      el.style.removeProperty("scale");
      el.style.removeProperty("will-change");
    });
  }, []);

  useEffect(() => {
    if (entranceTriggeredRef.current) return;
    const el = sectionRef.current;
    if (!el) return;

    const isReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced) return;

    const pillarCards = Array.from(el.querySelectorAll<HTMLElement>(".tactical-pillar-card")).slice(0, 3);
    if (!pillarCards.length) return;

    gsap.set(pillarCards, {
      opacity: 0,
      y: 20,
      scale: 0.96,
      clipPath: "inset(0 50% 0 50% round 14px)",
      willChange: "transform, opacity, clip-path",
    });

    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 75%",
      once: true,
      onEnter: () => {
        entranceTriggeredRef.current = true;
        gsap.to(pillarCards, {
          opacity: 1,
          y: 0,
          scale: 1,
          clipPath: "inset(0 0% 0 0% round 14px)",
          duration: 0.95,
          stagger: 0.08,
          ease: "expo.out",
          clearProps: "transform,scale,opacity,clipPath,clip-path,willChange",
          onComplete: () => {
            cleanInline(pillarCards);
          },
        });
      },
    });

    return () => {
      st.kill();
    };
  }, [cleanInline]);

  // Interactive 3D Tactile Physics
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const interactiveSelector = ".zone-toggle-btn, .tactical-pillar-card, .weight-class-card";
    const handlePointerDown = (e: PointerEvent) => {
      const target = (e.target as HTMLElement).closest<HTMLElement>(interactiveSelector);
      if (!target) return;
      gsap.to(target, { scale: 0.97, duration: 0.14, ease: "power2.out", overwrite: "auto" });
    };
    const handlePointerUp = (e: PointerEvent) => {
      const target = (e.target as HTMLElement).closest<HTMLElement>(interactiveSelector);
      if (!target) return;
      gsap.to(target, { scale: 1, duration: 0.28, ease: "back.out(2)", overwrite: "auto", clearProps: "transform,scale" });
    };
    const handlePointerLeave = (e: PointerEvent) => {
      const target = (e.target as HTMLElement).closest<HTMLElement>(interactiveSelector);
      if (!target) return;
      gsap.to(target, { scale: 1, duration: 0.28, ease: "back.out(2)", overwrite: "auto", clearProps: "transform,scale" });
    };

    el.addEventListener("pointerdown", handlePointerDown, { passive: true });
    el.addEventListener("pointerup", handlePointerUp, { passive: true });
    el.addEventListener("pointerleave", handlePointerLeave, { passive: true, capture: true });

    return () => {
      el.removeEventListener("pointerdown", handlePointerDown);
      el.removeEventListener("pointerup", handlePointerUp);
      el.removeEventListener("pointerleave", handlePointerLeave, { capture: true });
    };
  }, []);

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
    <section ref={sectionRef} id="silat-olahraga" className="py-12 sm:py-16 border-b border-white/[0.08]">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[rgba(255,56,69,0.35)] bg-[rgba(255,56,69,0.12)] text-[#ff4d5a] text-xs font-bold uppercase tracking-wider mb-2">
            <Swords size={13} /> {locale === "bm" ? "Disiplin Silat Olahraga (Tanding)" : "Silat Olahraga (Combat Sparring) Discipline"}
          </div>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-display font-bold uppercase text-white tracking-tight"
            style={{ fontFamily: "var(--font-athletic)" }}
          >
            {locale === "bm" ? (
              <>TAKTIKAL PERTARUNGAN &amp; <span className="text-red-600">SISTEM SKOR DIGITAL</span></>
            ) : (
              <>COMBAT TACTICS &amp; <span className="text-red-600">DIGITAL SCORING SYSTEM</span></>
            )}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-neutral-400 leading-relaxed">
            {locale === "bm"
              ? "Peraturan pertandingan tanding moden PERSILAT 2026 menuntut kepantasan langkah silat, kawalan jarak taktikal, kuasa bantingan sah, dan ketepatan serangan ke atas zon sasaran vest berlapik."
              : "Modern PERSILAT 2026 competition rules demand agile footwork, tactical distance control, legal takedown power, and accurate strikes on padded vest target zones."}
          </p>
        </div>

        {/* 3 Tactical Pillar Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {/* Card 1: Pola Langkah & Jarak */}
          <div className="tactical-pillar-card rounded-[14px] border border-white/[0.08] bg-white/[0.025] backdrop-blur-[16px] p-5 shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)] hover:border-white/[0.18] hover:bg-white/[0.04] transition-all">
            <div className="w-10 h-10 rounded-lg bg-[rgba(255,56,69,0.12)] border border-[rgba(255,56,69,0.35)] flex items-center justify-center text-[#ff4d5a] mb-3">
              <Zap size={20} />
            </div>
            <h3 className="text-base font-bold uppercase text-white tracking-wide">
              {locale === "bm" ? "Pola Langkah & Kawalan Jarak" : "Footwork Patterns & Distance Control"}
            </h3>
            <p className="text-xs text-neutral-300 mt-2 leading-relaxed">
              {locale === "bm"
                ? "Mengaplikasikan kaedah Langkah Gergaji, Ladam Kuda, dan Tiga Penjuru untuk mengelak garisan lurus serangan lawan dan mencipta sudut serangan terbuka."
                : "Applies Zig-zag, Horseshoe, and Triangular footwork patterns to evade linear strikes and create open offensive angles."}
            </p>
            <div className="mt-3 text-[11px] font-semibold text-[#ff4d5a] flex items-center gap-1.5">
              <span>{locale === "bm" ? "Kaedah Elakan Pantas & Tangkisan" : "Agile Evading & Parrying Methods"}</span>
            </div>
          </div>

          {/* Card 2: Peraturan 5 Saat Tangkapan */}
          <div className="tactical-pillar-card rounded-[14px] border border-[rgba(255,56,69,0.4)] bg-[rgba(255,56,69,0.04)] backdrop-blur-[16px] p-5 shadow-[0_8px_32px_rgba(0,0,0,0.45),0_0_20px_rgba(225,6,0,0.12),inset_0_1px_0_rgba(255,255,255,0.08)] hover:border-[rgba(255,56,69,0.6)] hover:bg-[rgba(255,56,69,0.06)] transition-all">
            <div className="w-10 h-10 rounded-lg bg-[rgba(255,56,69,0.2)] border border-[rgba(255,56,69,0.5)] flex items-center justify-center text-[#ff4d5a] mb-3">
              <Timer size={20} />
            </div>
            <div className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[rgba(255,56,69,0.18)] border border-[rgba(255,56,69,0.5)] text-[#ff4d5a] mb-1">
              {locale === "bm" ? "Peraturan Wajib PERSILAT" : "PERSILAT Mandatory Rule"}
            </div>
            <h3 className="text-base font-bold uppercase text-white tracking-wide">
              {locale === "bm" ? "Had Tangkapan 5 Saat" : "5-Second Grapple Rule"}
            </h3>
            <p className="text-xs text-neutral-300 mt-2 leading-relaxed">
              {locale === "bm"
                ? "Sebarang tangkapan anggota badan (kaki tendangan lawan) mestilah disusuli dengan jatuhan dalam tempoh maksimum 5 saat. Jika gagal atau terhenti, wasit serta-merta menghentikan aksi (\"TI\") tanpa sebarang mata diberikan."
                : "Any catch of an opponent's limb (such as a kick) must be converted into a takedown within a maximum of 5 seconds. If unsuccessful, the referee immediately halts action (\"TI\") with 0 points awarded."}
            </p>
            <div className="mt-3 text-[11px] font-semibold text-emerald-400 flex items-center gap-1.5">
              <span>{locale === "bm" ? "Jatuhan Sah = 3 Mata Bersih" : "Legal Takedown = 3 Clean Points"}</span>
            </div>
          </div>

          {/* Card 3: Variasi Bantingan & Sapuan */}
          <div className="tactical-pillar-card rounded-[14px] border border-white/[0.08] bg-white/[0.025] backdrop-blur-[16px] p-5 shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)] hover:border-white/[0.18] hover:bg-white/[0.04] transition-all">
            <div className="w-10 h-10 rounded-lg bg-[rgba(255,56,69,0.12)] border border-[rgba(255,56,69,0.35)] flex items-center justify-center text-[#ff4d5a] mb-3">
              <Shield size={20} />
            </div>
            <h3 className="text-base font-bold uppercase text-white tracking-wide">
              {locale === "bm" ? "Sistem Jatuhan, Sapuan & Guntingan" : "Takedowns, Sweeps & Scissor System"}
            </h3>
            <p className="text-xs text-neutral-300 mt-2 leading-relaxed">
              {locale === "bm"
                ? "Jatuhan sah meliputi Sapuan Tegak, Sapuan Rebah Belakang, Guntingan Pinggang/Kaki, dan Kaitan. Menghempas kepala lawan ke matras diharamkan sama sekali dan dikenakan diskualifikasi terus."
                : "Legal takedowns include Standing Sweeps, Back Drop Sweeps, Waist/Leg Scissor Takedowns, and Hooking. Driving an opponent's head into the mat is strictly prohibited and results in immediate disqualification."}
            </p>
            <div className="mt-3 text-[11px] font-semibold text-[#ffd24c] flex items-center gap-1.5">
              <span>{locale === "bm" ? "Dilarang Guntingan Leher" : "Neck Scissors Prohibited"}</span>
            </div>
          </div>
        </div>

        {/* Interactive Target Scoring Zones Explorer */}
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] backdrop-blur-[16px] p-6 sm:p-8 mb-10 shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)]">
          <div className="border-b border-white/[0.08] pb-4 mb-6">
            <span className="text-xs font-bold uppercase tracking-widest text-[#ff4d5a]">
              {locale === "bm" ? "Peta Anatomi Sasaran Tanding" : "Combat Target Anatomy Map"}
            </span>
            <h3
              className="text-2xl sm:text-3xl font-display font-bold uppercase text-white mt-0.5"
              style={{ fontFamily: "var(--font-athletic)" }}
            >
              {locale === "bm" ? "Zon Mata Sah vs. Zon Larangan (Foul)" : "Legal Scoring Zones vs. Prohibited Zones"}
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              {locale === "bm"
                ? "Pilih kawasan anatomi di bawah untuk melihat nilai mata pukulan/tendangan dan status undang-undang pertandingan."
                : "Select an anatomical zone below to view punch/kick point values and regulatory status."}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left selector pills */}
            <div className="lg:col-span-5 space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                {locale === "bm" ? "Zon Sah Mata (Vest Torso):" : "Legal Scoring Zones (Torso Vest):"}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {TARGET_ZONES.filter((z) => z.status === "LEGAL").map((zone) => (
                  <button
                    key={zone.id}
                    type="button"
                    onClick={() => setSelectedZone(zone.id)}
                    className={`zone-toggle-btn p-3 rounded-lg border text-left cursor-pointer transition-all ${
                      selectedZone === zone.id
                        ? "border-emerald-500/50 bg-emerald-500/10 text-white shadow-[0_0_14px_rgba(16,185,129,0.25),inset_0_1px_0_rgba(255,255,255,0.1)]"
                        : "border-white/[0.08] bg-white/[0.02] text-[#d1d1d5] hover:border-white/20 hover:bg-white/[0.05] backdrop-blur-sm"
                    }`}
                  >
                    <p className="text-xs font-bold leading-tight">
                      {locale === "en" ? (zone.nameEn || zone.name) : zone.name}
                    </p>
                    <span className="inline-block mt-1 text-[10px] text-emerald-400 font-semibold">
                      {locale === "bm" ? "1 pt (Pukulan) · 2 pts (Tendangan)" : "1 pt (Punch) · 2 pts (Kick)"}
                    </span>
                  </button>
                ))}
              </div>

              <p className="text-[11px] font-bold uppercase tracking-wider text-[#ff4d5a] pt-3">
                {locale === "bm" ? "Zon Larangan Mutlak (Penalti & DQ):" : "Strictly Prohibited Zones (Penalties & DQ):"}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {TARGET_ZONES.filter((z) => z.status === "PROHIBITED").map((zone) => (
                  <button
                    key={zone.id}
                    type="button"
                    onClick={() => setSelectedZone(zone.id)}
                    className={`zone-toggle-btn p-3 rounded-lg border text-left cursor-pointer transition-all ${
                      selectedZone === zone.id
                        ? "border-[rgba(255,56,69,0.5)] bg-[rgba(255,56,69,0.12)] text-white shadow-[0_0_14px_rgba(225,6,0,0.25),inset_0_1px_0_rgba(255,255,255,0.1)]"
                        : "border-white/[0.08] bg-white/[0.02] text-[#d1d1d5] hover:border-white/20 hover:bg-white/[0.05] backdrop-blur-sm"
                    }`}
                  >
                    <p className="text-xs font-bold leading-tight">
                      {locale === "en" ? (zone.nameEn || zone.name) : zone.name}
                    </p>
                    <span className="inline-block mt-1 text-[10px] text-[#ff4d5a] font-semibold">
                      {locale === "bm" ? "Dilarang (0 pt) · Penalti" : "Prohibited (0 pt) · Penalty"}
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
                  <h4 className="text-lg font-bold text-white uppercase">
                    {locale === "en" ? (activeZone.nameEn || activeZone.name) : activeZone.name}
                  </h4>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    activeZone.status === "LEGAL"
                      ? "bg-emerald-500/12 border border-emerald-500/40 text-emerald-400"
                      : "bg-[rgba(255,56,69,0.12)] border border-[rgba(255,56,69,0.4)] text-[#ff4d5a]"
                  }`}
                >
                  {activeZone.status === "LEGAL"
                    ? (locale === "bm" ? "ZON MATA SAH" : "LEGAL SCORING ZONE")
                    : (locale === "bm" ? "ZON LARANGAN KERAS" : "STRICTLY PROHIBITED ZONE")}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="rounded-lg bg-white/[0.02] border border-white/[0.06] p-3 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                  <span className="text-[10px] uppercase font-bold text-neutral-400">
                    {locale === "bm" ? "Mata Pukulan Tangan" : "Hand Strike Points"}
                  </span>
                  <p className="text-2xl font-mono font-bold text-white mt-0.5">
                    {activeZone.pointsPunch > 0 ? `+${activeZone.pointsPunch} pt` : "0 pt"}
                  </p>
                </div>
                <div className="rounded-lg bg-white/[0.02] border border-white/[0.06] p-3 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                  <span className="text-[10px] uppercase font-bold text-neutral-400">
                    {locale === "bm" ? "Mata Tendangan Kaki" : "Foot Kick Points"}
                  </span>
                  <p className="text-2xl font-mono font-bold text-[#ff4d5a] mt-0.5">
                    {activeZone.pointsKick > 0 ? `+${activeZone.pointsKick} pts` : "0 pt"}
                  </p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-neutral-300">
                <p>
                  <strong>{locale === "bm" ? "Kawasan Anatomi:" : "Anatomical Region:"}</strong>{" "}
                  {locale === "en" ? (activeZone.descriptionEn || activeZone.description) : activeZone.description}
                </p>
                <div
                  className={`p-3 rounded border text-xs leading-relaxed ${
                    activeZone.status === "LEGAL"
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-200"
                      : "bg-[rgba(255,56,69,0.1)] border-[rgba(255,56,69,0.3)] text-[#ff99a0]"
                  }`}
                >
                  <strong>{locale === "bm" ? "Ketetapan PERSILAT 2026:" : "PERSILAT 2026 Regulation:"}</strong>{" "}
                  {locale === "en" ? (activeZone.ruleNoteEn || activeZone.ruleNote) : activeZone.ruleNote}
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
                {locale === "bm" ? "Kategori Tanding Dewasa (Senior)" : "Senior Combat Category"}
              </span>
              <h3
                className="text-2xl sm:text-3xl font-display font-bold uppercase text-white mt-0.5"
                style={{ fontFamily: "var(--font-athletic)" }}
              >
                {locale === "bm" ? "Divisyen Berat Badan (Kelas A hingga Terbuka)" : "Weight Divisions (Class A to Open)"}
              </h3>
              <p className="text-xs text-neutral-400 mt-1">
                {locale === "bm"
                  ? "Kategori umur Dewasa (17 hingga 45 tahun) dipertandingkan mengikut braket berat badan piawai."
                  : "Senior age category (17 to 45 years) contested across standardized weight brackets."}
              </p>
            </div>

            {/* Zero weight tolerance badge */}
            <div className="flex items-center gap-2 rounded-lg border border-[rgba(255,56,69,0.35)] bg-[rgba(255,56,69,0.1)] px-3.5 py-2 text-xs text-[#f0f0f2] backdrop-blur-sm max-w-xs">
              <ShieldAlert size={18} className="text-[#ff4d5a] flex-none" />
              <span>
                <strong>Zero Weight Tolerance:</strong>{" "}
                {locale === "bm"
                  ? "Tiada toleransi berat pada timbangan rasmi pagi perlawanan. Lebihan 50g membawa kepada pembatalan serta-merta."
                  : "Zero weight tolerance on matchday morning weigh-in. Excess of 50g results in immediate disqualification."}
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
              placeholder={locale === "bm" ? "Cari kelas berat (cth: Kelas C, 55kg)..." : "Search weight class (e.g. Class C, 55kg)..."}
              className="w-full min-h-[42px] pl-9 pr-3 rounded-xl border border-white/[0.1] bg-white/[0.03] backdrop-blur-[12px] text-xs text-white placeholder-[#7b7d85] focus:border-[#ff3845] focus:bg-white/[0.05] focus:shadow-[0_0_0_2px_rgba(225,6,0,0.2),0_8px_24px_rgba(0,0,0,0.5)] focus:outline-none transition-all"
            />
          </div>

          {/* Weight Cards Grid */}
          <div ref={weightMotionRef} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredWeights.map((wc) => (
              <div
                key={wc.classCode}
                className="weight-class-card rounded-xl border border-white/[0.08] bg-white/[0.025] backdrop-blur-[12px] p-3.5 shadow-[0_4px_16px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.05)] hover:border-[rgba(255,56,69,0.45)] hover:bg-white/[0.045]"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-white">
                    {locale === "en" ? (wc.classCodeEn || wc.classCode) : wc.classCode}
                  </span>
                  <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-[rgba(255,56,69,0.12)] text-[#ff4d5a] border border-[rgba(255,56,69,0.35)]">
                    Senior
                  </span>
                </div>
                <div className="space-y-1 text-xs">
                  <p className="text-neutral-300">
                    <strong className="text-white">{locale === "bm" ? "Lelaki:" : "Male:"}</strong> {wc.maleRange}
                  </p>
                  <p className="text-neutral-300">
                    <strong className="text-white">{locale === "bm" ? "Wanita:" : "Female:"}</strong>{" "}
                    {wc.femaleRange ? (locale === "en" && wc.femaleRange.includes("Tidak") ? "Not contested" : wc.femaleRange) : "—"}
                  </p>
                  <p className="text-[11px] text-neutral-400 pt-1 line-clamp-2">
                    {locale === "en" ? (wc.descriptionEn || wc.description) : wc.description}
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
