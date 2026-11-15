"use client";

import { useState } from "react";
import {
  Users,
  ShieldCheck,
  HeartHandshake,
  Award,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export type StakeholderRole = "athlete" | "parent" | "coach";

export function StakeholderGuideSwitcher() {
  const { locale } = useLanguage();
  const isEn = locale === "en";

  const [activeRole, setActiveRole] = useState<StakeholderRole>("athlete");

  return (
    <div className="knowledge-tool-container rounded-2xl p-6 lg:p-8">
      {/* Header */}
      <div className="pb-6 border-b border-white/[0.08]">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#E10600]/15 border border-[#FF3845]/30 text-[#FF555C] text-[11px] font-bold tracking-wider uppercase mb-2">
          <Users size={13} />
          <span>
            {isEn
              ? "National Silat Ecosystem Blueprint"
              : "Panduan Ekosistem Silat Kebangsaan"}
          </span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          {isEn ? "STRUCTURED STAKEHOLDER GUIDE" : "PANDUAN STAKEHOLDER TERSUSUN"}
        </h3>
        <p className="text-xs sm:text-sm text-[#A2A3AA] mt-1 max-w-2xl">
          {isEn
            ? "The success of a silat athlete is forged through the synergy of three pillars: athlete warrior discipline, familial dedication, and authoritative coaching leadership."
            : "Kejayaan seorang pesilat terbina daripada keharmonian tiga pilar: disiplin atlet, sokongan kasih sayang keluarga, dan kepimpinan berwibawa jurulatih."}
        </p>
      </div>

      {/* Role Switcher Tabs */}
      <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 my-6">
        <button
          type="button"
          onClick={() => setActiveRole("athlete")}
          className={`flex-1 py-3 px-4 rounded-xl border text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
            activeRole === "athlete"
              ? "bg-[#E10600] text-white border-[#FF3845] shadow-[0_4px_16px_rgba(225,6,0,0.35)]"
              : "bg-white/[0.04] text-[#A2A3AA] border-white/10 hover:border-white/20 hover:text-white hover:bg-white/[0.07]"
          }`}
        >
          <Award size={16} />
          <span>{isEn ? "For Athletes" : "Untuk Atlet"}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveRole("parent")}
          className={`flex-1 py-3 px-4 rounded-xl border text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
            activeRole === "parent"
              ? "bg-[#E10600] text-white border-[#FF3845] shadow-[0_4px_16px_rgba(225,6,0,0.35)]"
              : "bg-white/[0.04] text-[#A2A3AA] border-white/10 hover:border-white/20 hover:text-white hover:bg-white/[0.07]"
          }`}
        >
          <HeartHandshake size={16} />
          <span>{isEn ? "For Parents" : "Untuk Ibu Bapa"}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveRole("coach")}
          className={`flex-1 py-3 px-4 rounded-xl border text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
            activeRole === "coach"
              ? "bg-[#E10600] text-white border-[#FF3845] shadow-[0_4px_16px_rgba(225,6,0,0.35)]"
              : "bg-white/[0.04] text-[#A2A3AA] border-white/10 hover:border-white/20 hover:text-white hover:bg-white/[0.07]"
          }`}
        >
          <ShieldCheck size={16} />
          <span>{isEn ? "For Coaches" : "Untuk Coach / Jurulatih"}</span>
        </button>
      </div>

      {/* Role Content Panels */}
      <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-md p-6 space-y-6">
        {activeRole === "athlete" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <strong className="text-base font-bold text-white uppercase tracking-wide">
                {isEn
                  ? "Self-Discipline, Ring Etiquette & Combat Mindset"
                  : "Disiplin Kendiri, Etika Gelanggang & Mental Bertanding"}
              </strong>
              <span className="text-xs text-[#FF555C] font-mono">
                {isEn ? "Focus: Character & Composure" : "Fokus: Sahsiah & Fokus"}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl knowledge-frosted-subcard">
                <span className="text-xs font-bold text-[#FF3845] block uppercase mb-1">
                  {isEn ? "1. Arena Etiquette & Respect" : "1. Adab & Hormat Gelanggang"}
                </span>
                <p className="text-xs text-[#A2A3AA] leading-relaxed">
                  {isEn
                    ? "Offer respectful salutation (hormat) to Master, Referees, and opponents. Maintain decorum in victory and defeat. Honor sportsmanship without provocation."
                    : "Beri salam hormat kepada Guru, Wasit Juri, dan lawan. Kekal beradab semasa menang mahupun tewas. Hormati integriti sukan tanpa provokasi."}
                </p>
              </div>
              <div className="p-4 rounded-xl knowledge-frosted-subcard">
                <span className="text-xs font-bold text-[#FF3845] block uppercase mb-1">
                  {isEn ? "2. Mental Box Breathing Practice" : "2. Latihan Mental Box Breathing"}
                </span>
                <p className="text-xs text-[#A2A3AA] leading-relaxed">
                  {isEn
                    ? "Practice 4-4-4-4 second box breathing cycles before stepping onto the arena to mitigate elevated heart rate and anchor tactical focus."
                    : "Amalkan kitaran pernafasan 4-4-4-4 saat sebelum naik gelanggang untuk meredakan degupan jantung kencang dan kekal fokus pada strategi."}
                </p>
              </div>
              <div className="p-4 rounded-xl knowledge-frosted-subcard">
                <span className="text-xs font-bold text-[#FF3845] block uppercase mb-1">
                  {isEn ? "3. Training & Nutrition Logbook" : "3. Diari Latihan & Pemakanan"}
                </span>
                <p className="text-xs text-[#A2A3AA] leading-relaxed">
                  {isEn
                    ? "Log morning body weight, exertion ratings (RPE), 8-hour sleep duration, and weekly technical corrections provided by coaches."
                    : "Catat berat badan harian, skor keletihan, kualiti tidur 8 jam, dan pembetulan teknik daripada jurulatih setiap minggu."}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeRole === "parent" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <strong className="text-base font-bold text-white uppercase tracking-wide">
                {isEn
                  ? "PERSILAT 2026 Safety Standards, Home Nutrition & Emotional Care"
                  : "Keselamatan PERSILAT 2026, Nutrisi Rumah & Sokongan Emosi"}
              </strong>
              <span className="text-xs text-emerald-400 font-mono">
                {isEn ? "Focus: Wellbeing & Protection" : "Fokus: Kasih Sayang & Keselamatan"}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl knowledge-frosted-subcard">
                <span className="text-xs font-bold text-emerald-400 block uppercase mb-1">
                  {isEn ? "1. Approved Protective Equipment" : "1. Piawaian Keselamatan 2026"}
                </span>
                <p className="text-xs text-[#A2A3AA] leading-relaxed">
                  {isEn
                    ? "Ensure the young athlete is equipped with verified body protection (EVA foam 30-40mm), groin guard, shin protectors, and fitted mouthguard."
                    : "Pastikan anak dilengkapi pelindung dada tebal (EVA foam 30-40mm), groin guard, pelindung tulang kering, dan mouthguard yang sah."}
                </p>
              </div>
              <div className="p-4 rounded-xl knowledge-frosted-subcard">
                <span className="text-xs font-bold text-emerald-400 block uppercase mb-1">
                  {isEn ? "2. Balanced Home Nutrition" : "2. Nutrisi Seimbang di Rumah"}
                </span>
                <p className="text-xs text-[#A2A3AA] leading-relaxed">
                  {isEn
                    ? "Serve high-quality protein meals (poultry, eggs, tempeh) alongside clean complex carbohydrates. Provide 1.5L drinking water for each training session."
                    : "Sediakan hidangan berprotein tinggi (ayam, telur, tempe) dan karbohidrat bersih. Bekalkan 1.5L air kosong setiap kali ke sesi gelanggang."}
                </p>
              </div>
              <div className="p-4 rounded-xl knowledge-frosted-subcard">
                <span className="text-xs font-bold text-emerald-400 block uppercase mb-1">
                  {isEn ? "3. Ring-Side Psychological Support" : "3. Psikologi Tepi Gelanggang"}
                </span>
                <p className="text-xs text-[#A2A3AA] leading-relaxed">
                  {isEn
                    ? "Refrain from shouting tactical orders from the spectator stands. Embrace your child with proud support unconditionally regardless of the match verdict."
                    : "Elakkan menjerit arahan taktikal dari tempat duduk penonton. Sambut anak dengan pelukan bangga tanpa mengira menang atau kalah."}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeRole === "coach" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <strong className="text-base font-bold text-white uppercase tracking-wide">
                {isEn
                  ? "Progressive Pedagogy, ACWR Workload & Corner Directives"
                  : "Metodologi Pengajaran Progresif, ACWR & Corner Coaching"}
              </strong>
              <span className="text-xs text-cyan-400 font-mono">
                {isEn ? "Focus: Coaching Science" : "Fokus: Sains Kejurulatihan"}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl knowledge-frosted-subcard">
                <span className="text-xs font-bold text-cyan-400 block uppercase mb-1">
                  {isEn ? "1. Games-Based & Part-Practice" : "1. Games-Based & Part-Practice"}
                </span>
                <p className="text-xs text-[#A2A3AA] leading-relaxed">
                  {isEn
                    ? "Break down advanced techniques (e.g. catch & takedown counters) into discrete phases and employ constraints-led sparring scenarios."
                    : "Pecahkan teknik kompleks (cth: tangkapan & sapuan) kepada pecahan fasa dan gunakan perlawanan bersyarat (constraints-led)."}
                </p>
              </div>
              <div className="p-4 rounded-xl knowledge-frosted-subcard">
                <span className="text-xs font-bold text-cyan-400 block uppercase mb-1">
                  {isEn ? "2. Manage ACWR Ratio (0.8 - 1.3)" : "2. Kawal Beban ACWR (0.8 - 1.3)"}
                </span>
                <p className="text-xs text-[#A2A3AA] leading-relaxed">
                  {isEn
                    ? "Prevent sudden volume spikes leading up to tournaments. Sustain acute-to-chronic workload ratios in the safe zone to avoid tendon and muscle strain."
                    : "Elakkan lonjakan beban mendadak sebelum kejohanan. Kekalkan nisbah beban mingguan dalam zon selamat bagi mengelakkan koyakan otot."}
                </p>
              </div>
              <div className="p-4 rounded-xl knowledge-frosted-subcard">
                <span className="text-xs font-bold text-cyan-400 block uppercase mb-1">
                  {isEn ? "3. Composed Corner Directives" : "3. Arahan Sudut Tenang (Corner)"}
                </span>
                <p className="text-xs text-[#A2A3AA] leading-relaxed">
                  {isEn
                    ? "Deliver at most 2 high-leverage tactical instructions during the 1-minute round intervals. A calm vocal tone keeps athlete panic under control."
                    : "Beri maksimum 2 arahan spesifik dalam rehat 1 minit. Suara yang tenang mengurangkan panik atlet di gelanggang perlawanan."}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
