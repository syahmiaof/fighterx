"use client";

import { useState } from "react";
import {
  Users,
  ShieldCheck,
  HeartHandshake,
  Award,
} from "lucide-react";

export type StakeholderRole = "athlete" | "parent" | "coach";

export function StakeholderGuideSwitcher() {
  const [activeRole, setActiveRole] = useState<StakeholderRole>("athlete");

  return (
    <div className="knowledge-tool-container rounded-2xl p-6 lg:p-8">
      {/* Header */}
      <div className="pb-6 border-b border-white/[0.08]">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#E10600]/15 border border-[#FF3845]/30 text-[#FF555C] text-[11px] font-bold tracking-wider uppercase mb-2">
          <Users size={13} />
          <span>Panduan Ekosistem Silat Kebangsaan</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold font-athletic text-white tracking-wide uppercase">
          PANDUAN STAKEHOLDER TERSUSUN
        </h3>
        <p className="text-xs sm:text-sm text-[#A2A3AA] mt-1 max-w-2xl">
          Kejayaan seorang pesilat terbina daripada keharmonian tiga pilar: disiplin atlet, sokongan kasih sayang keluarga, dan kepimpinan berwibawa jurulatih.
        </p>
      </div>

      {/* Role Switcher Tabs */}
      <div className="flex items-center gap-3 my-6">
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
          <span>Untuk Atlet</span>
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
          <span>Untuk Ibu Bapa</span>
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
          <span>Untuk Coach / Jurulatih</span>
        </button>
      </div>

      {/* Role Content Panels */}
      <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-md p-6 space-y-6">
        {activeRole === "athlete" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <strong className="text-base font-bold text-white uppercase tracking-wide">
                Disiplin Kendiri, Etika Gelanggang &amp; Mental Bertanding
              </strong>
              <span className="text-xs text-[#FF555C] font-mono">Fokus: Sahsiah &amp; Fokus</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl knowledge-frosted-subcard">
                <span className="text-xs font-bold text-[#FF3845] block uppercase mb-1">
                  1. Adab &amp; Hormat Gelanggang
                </span>
                <p className="text-xs text-[#A2A3AA] leading-relaxed">
                  Beri salam hormat kepada Guru, Wasit Juri, dan lawan. Kekal beradab semasa menang mahupun tewas. Hormati integriti sukan tanpa provokasi.
                </p>
              </div>
              <div className="p-4 rounded-xl knowledge-frosted-subcard">
                <span className="text-xs font-bold text-[#FF3845] block uppercase mb-1">
                  2. Latihan Mental Box Breathing
                </span>
                <p className="text-xs text-[#A2A3AA] leading-relaxed">
                  Amalkan kitaran pernafasan 4-4-4-4 saat sebelum naik gelanggang untuk meredakan degupan jantung kencang dan kekal fokus pada strategi.
                </p>
              </div>
              <div className="p-4 rounded-xl knowledge-frosted-subcard">
                <span className="text-xs font-bold text-[#FF3845] block uppercase mb-1">
                  3. Diari Latihan &amp; Pemakanan
                </span>
                <p className="text-xs text-[#A2A3AA] leading-relaxed">
                  Catat berat badan harian, skor keletihan, kualiti tidur 8 jam, dan pembetulan teknik daripada jurulatih setiap minggu.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeRole === "parent" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <strong className="text-base font-bold text-white uppercase tracking-wide">
                Keselamatan PERSILAT 2026, Nutrisi Rumah &amp; Sokongan Emosi
              </strong>
              <span className="text-xs text-emerald-400 font-mono">Fokus: Kasih Sayang &amp; Keselamatan</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl knowledge-frosted-subcard">
                <span className="text-xs font-bold text-emerald-400 block uppercase mb-1">
                  1. Piawaian Keselamatan 2026
                </span>
                <p className="text-xs text-[#A2A3AA] leading-relaxed">
                  Pastikan anak dilengkapi pelindung dada tebal (EVA foam 30-40mm), groin guard, pelindung tulang kering, dan mouthguard yang sah.
                </p>
              </div>
              <div className="p-4 rounded-xl knowledge-frosted-subcard">
                <span className="text-xs font-bold text-emerald-400 block uppercase mb-1">
                  2. Nutrisi Seimbang di Rumah
                </span>
                <p className="text-xs text-[#A2A3AA] leading-relaxed">
                  Sediakan hidangan berprotein tinggi (ayam, telur, tempe) dan karbohidrat bersih. Bekalkan 1.5L air kosong setiap kali ke sesi gelanggang.
                </p>
              </div>
              <div className="p-4 rounded-xl knowledge-frosted-subcard">
                <span className="text-xs font-bold text-emerald-400 block uppercase mb-1">
                  3. Psikologi Tepi Gelanggang
                </span>
                <p className="text-xs text-[#A2A3AA] leading-relaxed">
                  Elakkan menjerit arahan taktikal dari tempat duduk penonton. Sambut anak dengan pelukan bangga tanpa mengira menang atau kalah.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeRole === "coach" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <strong className="text-base font-bold text-white uppercase tracking-wide">
                Metodologi Pengajaran Progresif, ACWR &amp; Corner Coaching
              </strong>
              <span className="text-xs text-cyan-400 font-mono">Fokus: Sains Kejurulatihan</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl knowledge-frosted-subcard">
                <span className="text-xs font-bold text-cyan-400 block uppercase mb-1">
                  1. Games-Based &amp; Part-Practice
                </span>
                <p className="text-xs text-[#A2A3AA] leading-relaxed">
                  Pecahkan teknik kompleks (cth: tangkapan &amp; sapuan) kepada pecahan fasa dan gunakan perlawanan bersyarat (constraints-led).
                </p>
              </div>
              <div className="p-4 rounded-xl knowledge-frosted-subcard">
                <span className="text-xs font-bold text-cyan-400 block uppercase mb-1">
                  2. Kawal Beban ACWR (0.8 - 1.3)
                </span>
                <p className="text-xs text-[#A2A3AA] leading-relaxed">
                  Elakkan lonjakan beban mendadak sebelum kejohanan. Kekalkan nisbah beban mingguan dalam zon selamat bagi mengelakkan koyakan otot.
                </p>
              </div>
              <div className="p-4 rounded-xl knowledge-frosted-subcard">
                <span className="text-xs font-bold text-cyan-400 block uppercase mb-1">
                  3. Arahan Sudut Tenang (Corner)
                </span>
                <p className="text-xs text-[#A2A3AA] leading-relaxed">
                  Beri maksimum 2 arahan spesifik dalam rehat 1 minit. Suara yang tenang mengurangkan panik atlet di gelanggang perlawanan.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
