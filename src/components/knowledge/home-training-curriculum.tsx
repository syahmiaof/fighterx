"use client";

import { useState } from "react";
import {
  Flame,
  Scale,
  Utensils,
  Dumbbell,
  HeartPulse,
  Award,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Info,
  Clock,
  Zap,
  Target,
  Video,
  ChevronRight,
  Sparkles,
  BookOpen,
} from "lucide-react";

type CurriculumTab =
  | "falsafah"
  | "modul1"
  | "modul2"
  | "modul3"
  | "modul4"
  | "modul5"
  | "pelan";

export function HomeTrainingCurriculum() {
  const [activeTab, setActiveTab] = useState<CurriculumTab>("falsafah");

  const tabs: { id: CurriculumTab; label: string; icon: any; short: string }[] = [
    { id: "falsafah", label: "Falsafah & Prinsip SAID", icon: BookOpen, short: "Falsafah" },
    { id: "modul1", label: "Modul 1: Pengurusan Berat Badan", icon: Scale, short: "M1: Berat Badan" },
    { id: "modul2", label: "Modul 2: Pemakanan & Hidrasi", icon: Utensils, short: "M2: Pemakanan" },
    { id: "modul3", label: "Modul 3: Latihan Fizikal & S&C", icon: Dumbbell, short: "M3: Fizikal & S&C" },
    { id: "modul4", label: "Modul 4: Pemulihan & Prehab", icon: HeartPulse, short: "M4: Pemulihan" },
    { id: "modul5", label: "Modul 5: Sistem KPI & Pantauan", icon: Award, short: "M5: KPI & Pantauan" },
    { id: "pelan", label: "Pelan Fasa & Jadual Mingguan", icon: Calendar, short: "Pelan & Jadual" },
  ];

  return (
    <section id="silibus-latihan-rumah" className="py-14 md:py-20 border-t border-white/[0.08] relative">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#FF3845]/40 bg-[#FF3845]/10 text-[#FF3845] text-xs font-bold tracking-wider uppercase mb-3">
            <Sparkles size={13} />
            <span>PANDUAN LENGKAP LATIHAN DI RUMAH UNTUK ATLET & IBU BAPA</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-athletic text-white uppercase tracking-wide">
            5 MODUL TERAS SAINS SUKAN SILAT
          </h2>
          <p className="text-sm text-[#A2A3AA] mt-2">
            Disusun mengikut prinsip <em>Quality Over Sweat</em> berasaskan sains sukan moden supaya atlet dan ibu bapa boleh memantau serta melaksanakan latihan berkualiti tinggi terus dari rumah.
          </p>
        </div>

        {/* Tab Switcher Pills */}
        <div className="flex items-center justify-start lg:justify-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                  isActive
                    ? "bg-[#E10600] text-white border-[#E10600] shadow-[0_4px_16px_rgba(225,6,0,0.4)]"
                    : "bg-white/[0.03] text-[#A2A3AA] border-white/10 hover:border-white/20 hover:text-white"
                }`}
              >
                <Icon size={14} className={isActive ? "text-white" : "text-[#FF3845]"} />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.short}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: FALSAFAH & PRINSIP TERAS */}
        {activeTab === "falsafah" && (
          <div className="space-y-6">
            <div className="rounded-2xl p-6 sm:p-8 bg-[#121316] border border-white/10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#FF3845]/30 bg-[#FF3845]/10 text-[#FF555C] text-xs font-bold uppercase mb-4">
                <Target size={13} />
                <span>ASAS SISTEM & FALSAFAH LATIHAN</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold font-athletic text-white uppercase mb-4">
                Falsafah Latihan: SAID Principle & Quality Over Sweat
              </h3>

              <div className="prose prose-invert max-w-none text-sm sm:text-base text-[#D4D5D9] leading-relaxed space-y-4">
                <p>
                  Falsafah latihan yang menjadi teras sistem ini selari sepenuhnya dengan prinsip asas <em>Sport Science</em> moden iaitu <strong>SAID Principle</strong> (<em>Specific Adaptation to Imposed Demands</em>). Secara ringkas, tubuh manusia adalah mesin adaptasi yang sangat spesifik—badan hanya akan berubah dan menjadi kuat mengikut jenis tekanan (<em>stimulus</em>) tepat yang diberikan kepadanya.
                </p>

                <div className="p-4 sm:p-5 rounded-xl bg-red-950/20 border border-red-500/20 my-4 text-slate-200">
                  <p className="font-semibold text-white mb-2 flex items-center gap-2">
                    <AlertTriangle size={16} className="text-[#FF3845]" />
                    Mengapa Joging Perlahan 10km Tidak Mencukupi Untuk Pesilat?
                  </p>
                  <p className="text-xs sm:text-sm text-[#D4D5D9] leading-relaxed">
                    Jika atlet hanya berjoging perlahan sejauh 10km setiap hari, sistem tenaga dan gentian otot mereka hanya dilatih untuk berlari perlahan secara berterusan. Apabila masuk ke gelanggang <strong>Silat Olahraga</strong> yang menuntut ledakan kuasa (<em>explosive burst</em>) selama 1 hingga 5 saat, pertukaran arah mengejut dalam ruang sempit, impak tendangan tinggi, serta keupayaan <em>recovery</em> pantas dalam masa rehat 1 minit antara pusingan, sistem badan mereka akan gagal berfungsi dengan efisien.
                  </p>
                </div>

                <p>
                  Oleh itu, silibus ini dibina atas prinsip <strong>Kualiti Mengatasi Kuantiti (<em>Quality Over Sweat</em>)</strong>. Penat dan berpeluh lencun bukan bukti kemajuan (<em>progress</em>). Kemajuan sebenar hanya berlaku apabila setiap sesi latihan mempunyai satu sasaran jelas, mempunyai ukuran KPI, dan berjaya diterjemahkan (<em>transfer</em>) menjadi keputusan taktikal yang tajam dalam gelanggang. Panduan lengkap <strong>5 Modul Teras</strong> di bawah direka khusus supaya atlet dan ibu bapa boleh memantau serta melaksanakan latihan berkualiti tinggi terus dari rumah.
                </p>
              </div>

              {/* 5 Modules Overview Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/10">
                <div
                  onClick={() => setActiveTab("modul1")}
                  className="p-4 rounded-xl bg-white/[0.02] border border-white/10 hover:border-red-500/40 cursor-pointer transition-all group"
                >
                  <span className="text-xs font-mono text-[#FF3845] font-bold">MODUL 1</span>
                  <h4 className="text-sm font-bold text-white group-hover:text-[#FF3845] transition-colors mt-1">
                    Pengurusan Berat Badan
                  </h4>
                  <p className="text-xs text-[#8E9099] mt-1">
                    Maintain, Fat Loss vs Water Cut, dan Amaran Keselamatan Ibu Bapa.
                  </p>
                </div>

                <div
                  onClick={() => setActiveTab("modul2")}
                  className="p-4 rounded-xl bg-white/[0.02] border border-white/10 hover:border-red-500/40 cursor-pointer transition-all group"
                >
                  <span className="text-xs font-mono text-[#FF3845] font-bold">MODUL 2</span>
                  <h4 className="text-sm font-bold text-white group-hover:text-[#FF3845] transition-colors mt-1">
                    Pemakanan & Hidrasi Prestasi
                  </h4>
                  <p className="text-xs text-[#8E9099] mt-1">
                    Jadual Bahan Api, Sukatan Pinggan Tangan, dan Masa Makan.
                  </p>
                </div>

                <div
                  onClick={() => setActiveTab("modul3")}
                  className="p-4 rounded-xl bg-white/[0.02] border border-white/10 hover:border-red-500/40 cursor-pointer transition-all group"
                >
                  <span className="text-xs font-mono text-[#FF3845] font-bold">MODUL 3</span>
                  <h4 className="text-sm font-bold text-white group-hover:text-[#FF3845] transition-colors mt-1">
                    Latihan Fizikal & S&C Silat
                  </h4>
                  <p className="text-xs text-[#8E9099] mt-1">
                    4 Komponen Fizikal, Blueprint A–G, dan Template Sesi Rumah.
                  </p>
                </div>

                <div
                  onClick={() => setActiveTab("modul4")}
                  className="p-4 rounded-xl bg-white/[0.02] border border-white/10 hover:border-red-500/40 cursor-pointer transition-all group"
                >
                  <span className="text-xs font-mono text-[#FF3845] font-bold">MODUL 4</span>
                  <h4 className="text-sm font-bold text-white group-hover:text-[#FF3845] transition-colors mt-1">
                    Pemulihan & Prehab Sendi
                  </h4>
                  <p className="text-xs text-[#8E9099] mt-1">
                    Dynamic Warm-Up, Prehab ACL/Ankle, Tidur HGH, dan Deload.
                  </p>
                </div>

                <div
                  onClick={() => setActiveTab("modul5")}
                  className="p-4 rounded-xl bg-white/[0.02] border border-white/10 hover:border-red-500/40 cursor-pointer transition-all group"
                >
                  <span className="text-xs font-mono text-[#FF3845] font-bold">MODUL 5</span>
                  <h4 className="text-sm font-bold text-white group-hover:text-[#FF3845] transition-colors mt-1">
                    Sistem Pantauan Kemajuan & KPI
                  </h4>
                  <p className="text-xs text-[#8E9099] mt-1">
                    Lapis A Ujian Fizikal & Lapis B Taktikal Video Review.
                  </p>
                </div>

                <div
                  onClick={() => setActiveTab("pelan")}
                  className="p-4 rounded-xl bg-white/[0.02] border border-white/10 hover:border-red-500/40 cursor-pointer transition-all group"
                >
                  <span className="text-xs font-mono text-[#FF3845] font-bold">PELAN INDUK</span>
                  <h4 className="text-sm font-bold text-white group-hover:text-[#FF3845] transition-colors mt-1">
                    Susunan Silibus Ikut Fasa
                  </h4>
                  <p className="text-xs text-[#8E9099] mt-1">
                    General Prep, Specific Prep, Tapering, & Jadual Mingguan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MODUL 1 (PENGURUSAN BERAT BADAN) */}
        {activeTab === "modul1" && (
          <div className="space-y-6">
            <div className="rounded-2xl p-6 sm:p-8 bg-[#121316] border border-white/10 shadow-2xl space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-bold uppercase mb-2">
                  <Scale size={13} />
                  <span>MODUL 1: WEIGHT MANAGEMENT</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold font-athletic text-white uppercase">
                  Pengurusan Berat Badan & Komposisi Badan (Weight Management)
                </h3>
                <p className="text-sm text-[#D4D5D9] mt-2 leading-relaxed">
                  Dalam sukan tempur berkelas berat seperti silat, matlamat utama bukan sekadar menjadi &quot;kurus&quot; atau menurunkan angka pada penimbang semata-mata, tetapi mencapai <strong>nisbah kuasa-ke-berat (<em>power-to-weight ratio</em>) paling optimum</strong> tanpa mengorbankan jisim otot (<em>lean muscle mass</em>), kelajuan, dan tenaga pada hari pertandingan.
                </p>
              </div>

              {/* Fasa 1: Maintain */}
              <div className="p-5 rounded-xl bg-white/[0.025] border border-white/10 space-y-3">
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-400" />
                  Fasa Maintain (Pengekalan Off-Season):
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-[#C5C6CA] list-disc list-inside">
                  <li>
                    Pastikan berat badan harian atlet sentiasa berada dalam lingkungan <strong>3% hingga 5% sahaja daripada berat kelas pertandingan</strong> semasa <em>off-season</em> (contoh: jika bertanding kelas 60kg, berat luar musim tidak boleh melebihi 61.8kg – 63kg).
                  </li>
                  <li>
                    Elakkan budaya <em>yo-yo dieting</em> (berat naik mencanak lepas kejohanan akibat makan tanpa kawalan, kemudian menyeksa diri berlapar secara mendadak bila dekat tarikh kejohanan). Perubahan berat yang ekstrem merosakkan metabolisme dan hormon tumbesaran atlet remaja.
                  </li>
                  <li>
                    <strong>Panduan Pantauan di Rumah:</strong> Timbang berat setiap pagi sebaik sahaja bangun tidur dan selepas ke tandas (sebelum makan atau minum). Rekodkan berat setiap hari dan ambil <strong>purata mingguan</strong> untuk melihat trend sebenar, kerana berat harian boleh turun naik 0.5kg–1.0kg disebabkan kandungan air dan makanan dalam perut.
                  </li>
                </ul>
              </div>

              {/* Fasa 2: Turun Berat */}
              <div className="p-5 rounded-xl bg-white/[0.025] border border-white/10 space-y-3">
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <Flame size={16} className="text-[#FF3845]" />
                  Fasa Turun Berat (Fat Loss vs Acute Water Cut):
                </h4>
                <ul className="space-y-2.5 text-xs sm:text-sm text-[#C5C6CA] list-disc list-inside">
                  <li>
                    <strong>4–8 Minggu Sebelum Kejohanan (Fasa Fat Loss):</strong> Lakukan defisit kalori ringan sekitar <strong>300–500 kcal sehari</strong> daripada keperluan harian (<em>maintenance calories</em>). Kekalkan pengambilan protein yang tinggi (1.6g–2.0g bagi setiap kilogram berat badan) supaya badan hanya membakar lemak simpanan, manakala otot serta <em>explosive power</em> kekal terpelihara.
                  </li>
                  <li>
                    <strong>3–5 Hari Sebelum Timbang (Acute Water Cut — Hanya Jika Perlu & Selamat):</strong> Protokol ini hanya dibenarkan jika baki berat tinggal 1%–2% sahaja lagi (contoh: tinggal 0.5kg–1.0kg). Kurangkan pengambilan garam (<em>sodium</em>), kicap, sos, dan karbohidrat berserat tinggi selama 48–72 jam sebelum timbang untuk membuang lebihan air subkutaneus (<em>water retention</em>).
                  </li>
                </ul>

                {/* Amaran Keselamatan Ibu Bapa */}
                <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/40 text-red-200 mt-3">
                  <div className="flex items-center gap-2 font-bold text-red-400 mb-1 text-sm">
                    <ShieldAlert size={16} />
                    <span>Amaran Keselamatan untuk Ibu Bapa:</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#ffccd0] leading-relaxed">
                    Dilarang sama sekali memaksa atlet memakai baju hujan/plastik (<em>sauna suit</em>) untuk berlari di tengah panas terik atau berpuasa air berhari-hari. Dehidrasi melampau (&gt;3% berat badan) akan mengecutkan isipadu cecair otak, melambatkan <em>reflex</em> saraf, menyebabkan kekejangan otot (<em>cramp</em>), serta meningkatkan risiko kecederaan kepala dan buah pinggang.
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-emerald-200 mt-3 text-xs sm:text-sm">
                  <strong>Protokol Rehydration Serta-Merta Lepas Timbang:</strong> Sebaik sahaja selesai sesi timbang rasmi, atlet mesti minum larutan elektrolit (ORS atau air kelapa + secubit garam) secara sikit-sikit (200ml setiap 15–20 minit) dan bukan meneguk sekali gus supaya perut tidak memulas.
                </div>
              </div>

              {/* Fasa 3: Naik Berat */}
              <div className="p-5 rounded-xl bg-white/[0.025] border border-white/10 space-y-3">
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <Dumbbell size={16} className="text-blue-400" />
                  Fasa Naik Berat (Lean Muscle Gain):
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-[#C5C6CA] list-disc list-inside">
                  <li>Khusus untuk atlet yang terlalu kurus atau ingin naik ke kelas berat yang lebih tinggi.</li>
                  <li>
                    Tambah <strong>300–400 kcal sehari</strong> (<em>caloric surplus</em>) daripada sumber protein berkualiti dan karbohidrat kompleks, digabungkan dengan latihan rintangan/bebanan (<em>hypertrophy</em> &amp; <em>strength</em>).
                  </li>
                  <li>
                    <strong>Peranan Ibu Bapa di Rumah:</strong> Jangan naikkan berat anak dengan makanan segera, air manis, atau kek. Tambah saiz hidangan sebenar seperti menambah 1–2 biji telur rebus setiap hari, segelas susu penuh krim sebelum tidur, roti bakar mentega kacang (<em>peanut butter</em>), atau menambah sukatan nasi dan lauk protein pada waktu makan utama.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: MODUL 2 (PEMAKANAN & HIDRASI) */}
        {activeTab === "modul2" && (
          <div className="space-y-6">
            <div className="rounded-2xl p-6 sm:p-8 bg-[#121316] border border-white/10 shadow-2xl space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase mb-2">
                  <Utensils size={13} />
                  <span>MODUL 2: SPORTS NUTRITION</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold font-athletic text-white uppercase">
                  Pemakanan Prestasi & Hidrasi (Sports Nutrition)
                </h3>
                <p className="text-sm text-[#D4D5D9] mt-2 leading-relaxed">
                  Makanan ialah bahan api biologi. Jika atlet mempunyai teknik bertaraf juara tetapi mengisi badan dengan makanan yang salah, enjin badan akan mengalami <em>overheating</em> dan kehabisan tenaga (<em>bonking</em>) seawal pusingan kedua.
                </p>
              </div>

              {/* Table of Food Types */}
              <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-white/[0.05] text-white font-bold border-b border-white/10">
                    <tr>
                      <th className="p-3 sm:p-4 w-1/4">Kategori</th>
                      <th className="p-3 sm:p-4 w-1/3">Jenis Makanan (Pilihan Harian di Rumah)</th>
                      <th className="p-3 sm:p-4">Tujuan Prestasi & Kesan Fisiologi Atlet</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.06] text-[#C5C6CA]">
                    <tr className="bg-emerald-950/10">
                      <td className="p-3 sm:p-4 font-bold text-emerald-400">
                        Makan Lebih<br /><span className="text-[10px] text-[#A2A3AA] font-normal">(Asas Harian)</span>
                      </td>
                      <td className="p-3 sm:p-4 space-y-1.5">
                        <p><strong>Karbohidrat kompleks:</strong> Nasi putih, nasi perang, oat, ubi keledek, pisang (emas/berangan), roti <em>wholemeal</em>, pasta.</p>
                        <p><strong>Protein tanpa lemak:</strong> Dada/isi ayam (buang kulit), ikan (kembung, selar, tongkol, siakap), telur, daging tanpa lemak, tauhu, tempeh.</p>
                        <p><strong>Sayur &amp; buah:</strong> Bayam, brokoli, sawi, lobak merah, oren, tembikai, betik.</p>
                      </td>
                      <td className="p-3 sm:p-4 text-xs leading-relaxed">
                        Mengisi tangki <em>glycogen</em> di dalam otot dan hati sebagai sumber tenaga utama untuk serangan pantas, membaiki gentian otot yang koyak mikro (<em>micro-tears</em>) selepas sparring, serta membekalkan antioksidan untuk mengawal keradangan sendi (<em>inflammation</em>).
                      </td>
                    </tr>
                    <tr className="bg-amber-950/10">
                      <td className="p-3 sm:p-4 font-bold text-amber-400">
                        Makan Sederhana<br /><span className="text-[10px] text-[#A2A3AA] font-normal">(Kawalan)</span>
                      </td>
                      <td className="p-3 sm:p-4 space-y-1.5">
                        <p><strong>Lemak sihat:</strong> Kekacang (badam, gajus), avokado, minyak zaitun, minyak kelapa dara, kuning telur.</p>
                        <p><strong>Karbohidrat ringkas:</strong> Madu asli, kurma, minuman isotonik, kismis <em>(hanya diambil sekitar waktu latihan atau kejohanan)</em>.</p>
                      </td>
                      <td className="p-3 sm:p-4 text-xs leading-relaxed">
                        Menyokong penghasilan hormon (seperti testosteron untuk pemulihan otot), melancarkan penyerapan vitamin larut lemak (A, D, E, K), dan memberi tenaga segera tanpa membuatkan badan terasa berat atau lembap.
                      </td>
                    </tr>
                    <tr className="bg-red-950/15">
                      <td className="p-3 sm:p-4 font-bold text-[#FF3845]">
                        Jangan Makan Langsung<br /><span className="text-[10px] text-[#A2A3AA] font-normal">(Pantang Larang)</span>
                      </td>
                      <td className="p-3 sm:p-4 text-xs leading-relaxed">
                        Air manis/boba/karbonat/kordial pekat, makanan bergoreng penuh minyak (<em>deep fried</em> seperti ayam goreng tepung, pisang goreng), <em>fast food</em> (burger, kentang goreng), makanan proses (sosej, nuget, bebola, mi segera), serta makanan terlalu pedas/berasid 48 jam sebelum kejohanan.
                      </td>
                      <td className="p-3 sm:p-4 text-xs leading-relaxed">
                        Melambatkan proses pengosongan perut (<em>gastric emptying</em>), menyebabkan perut sebu (<em>bloating</em>) dan senak ketika melakukan tendangan tinggi atau elakan, meningkatkan keradangan dalaman, serta menyebabkan lonjakan gula mendadak (<em>sugar crash</em>) yang buat stamina jatuh merudum.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Hand Portion Method */}
              <div className="p-5 rounded-xl bg-white/[0.025] border border-white/10 space-y-3">
                <h4 className="text-base font-bold text-white">
                  Panduan Sukatan Pinggan di Rumah (Hand Portion Method):
                </h4>
                <p className="text-xs text-[#A2A3AA]">
                  Supaya atlet dan ibu bapa tidak perlu menimbang setiap gram makanan, gunakan ukuran tangan atlet sendiri untuk setiap hidangan utama (3–4 kali sehari):
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-white/[0.03] border border-white/10">
                    <span className="text-emerald-400 font-bold block mb-1">Karbohidrat:</span>
                    <span className="text-white font-medium">1 hingga 2 genggam penumbuk</span> atlet (naikkan kepada 2 genggam pada hari latihan berat).
                  </div>
                  <div className="p-3 rounded-lg bg-white/[0.03] border border-white/10">
                    <span className="text-blue-400 font-bold block mb-1">Protein:</span>
                    <span className="text-white font-medium">1 hingga 2 tapak tangan penuh</span> (ketebalan dan saiz tapak tangan tanpa jari).
                  </div>
                  <div className="p-3 rounded-lg bg-white/[0.03] border border-white/10">
                    <span className="text-teal-400 font-bold block mb-1">Sayur-sayuran:</span>
                    <span className="text-white font-medium">1 hingga 2 genggam terbuka</span>.
                  </div>
                  <div className="p-3 rounded-lg bg-white/[0.03] border border-white/10">
                    <span className="text-amber-400 font-bold block mb-1">Lemak Sihat:</span>
                    <span className="text-white font-medium">1 ibu jari</span> (contoh: minyak masakan atau mentega kacang).
                  </div>
                </div>
              </div>

              {/* Nutrient Timing Protocols */}
              <div className="p-5 rounded-xl bg-white/[0.025] border border-white/10 space-y-3">
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <Clock size={16} className="text-[#FF3845]" />
                  Protokol Masa Makan (Nutrient Timing):
                </h4>
                <ol className="space-y-3 text-xs sm:text-sm text-[#C5C6CA] list-decimal list-inside">
                  <li>
                    <strong>2–3 jam sebelum latihan/sparring (Pre-Training Meal):</strong> Hidangan lengkap berfokuskan karbohidrat + protein sederhana, tetapi rendah lemak dan serat supaya mudah dihadam (contoh: sepinggan nasi + ikan bakar/sup ayam + sebiji pisang).
                  </li>
                  <li>
                    <strong>Semasa latihan (&gt;60 minit):</strong> Minum air kosong secara berkala (3–4 teguk setiap 15–20 minit). Jika cuaca panas atau peluh sangat banyak, campurkan elektrolit atau secubit garam bukit + sedikit perahan limau.
                  </li>
                  <li>
                    <strong>30–45 minit selepas latihan (Anabolic Recovery Window):</strong> Waktu kritikal otot menyerap nutrien paling pantas. Wajib ambil gabungan protein + karbohidrat cepat serap (contoh: sekotak susu coklat rendah lemak, 2 biji telur separuh masak + 2 keping roti, atau <em>whey protein</em> + pisang) untuk menghentikan penyusutan otot (<em>muscle breakdown</em>).
                  </li>
                  <li>
                    <strong>Hari Kejohanan (Competition Day Fueling):</strong>
                    <ul className="pl-6 mt-1.5 space-y-1 list-disc text-slate-300">
                      <li><em>Jarak antara perlawanan &gt; 2 jam:</em> Makan hidangan ringan rendah lemak (contoh: bubur ayam, roti tuna, atau pasta kosong dengan isi ayam).</li>
                      <li><em>Jarak antara perlawanan &lt; 60 minit:</em> Elakkan makanan pejal yang berat. Ambil tenaga cecair atau separa pepejal sahaja seperti kurma (2–3 biji), pisang, madu, atau minuman isotonik.</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Pantauan Hidrasi Kendiri:</strong> Semak warna air kencing sebelum latihan. Warna <strong>jernih atau kuning jerami pucat</strong> bermaksud hidrasi optimum. Warna <strong>kuning pekat seperti teh O</strong> bermaksud atlet sedang mengalami dehidrasi dan berisiko tinggi mengalami <em>cramp</em> serta prestasi merosot.
                  </li>
                </ol>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: MODUL 3 (LATIHAN FIZIKAL & S&C) */}
        {activeTab === "modul3" && (
          <div className="space-y-6">
            <div className="rounded-2xl p-6 sm:p-8 bg-[#121316] border border-white/10 shadow-2xl space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-bold uppercase mb-2">
                  <Dumbbell size={13} />
                  <span>MODUL 3: STRENGTH &amp; CONDITIONING</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold font-athletic text-white uppercase">
                  Latihan Fizikal &amp; Neuromuskular Spesifik Silat (S&amp;C)
                </h3>
                <p className="text-sm text-[#D4D5D9] mt-2 leading-relaxed">
                  Setiap pergerakan senaman di rumah wajib berkhidmat untuk mekanik pertempuran di dalam gelanggang. Pecahkan latihan fizikal kepada 4 komponen utama yang boleh dilakukan di ruang tamu atau halaman rumah dengan peralatan minimum (kerusi, beg galas diisi buku/botol air, tuala, dan <em>resistance band</em>):
                </p>
              </div>

              {/* Sub-section 1: Strength & Core */}
              <div className="p-5 rounded-xl bg-white/[0.025] border border-white/10 space-y-3">
                <h4 className="text-base font-bold text-white flex items-center justify-between">
                  <span>1. Strength &amp; Core Stability (Kestabilan Kuda-Kuda &amp; Anti-Sapuan)</span>
                  <span className="text-xs font-mono text-[#FF3845] font-normal">3–4 Set | Rehat 60–90 Saat</span>
                </h4>
                <p className="text-xs text-[#A2A3AA]">
                  <strong>Fokus:</strong> Kekuatan kaki sebelah (<em>unilateral strength</em>), rantaian otot belakang pinggul (<em>posterior chain</em>), dan ketahanan <em>core</em> melawan daya putaran (<em>anti-rotation</em>).
                </p>
                <p className="text-xs text-[#D4D5D9] bg-white/[0.03] p-3 rounded-lg border border-white/10">
                  <strong>Kenapa Penting dalam Silat:</strong> Ketika atlet berdiri menggunakan sebelah kaki untuk melancarkan tendangan sabit/sisi tinggi, atau ketika pihak lawan cuba melakukan teknik sapuan dan bantingan, kestabilan <em>core</em>, pinggul, dan buku lali menentukan sama ada atlet jatuh menyembah gelanggang atau kekal teguh berdiri.
                </p>
                <div className="space-y-2 text-xs sm:text-sm text-[#C5C6CA]">
                  <p><strong>1. Bulgarian Split Squat (8–10 reps setiap kaki):</strong> Letakkan kekura kaki belakang di atas kerusi atau sofa, turun perlahan (3 saat) sehingga paha hadapan selari dengan lantai, kemudian tolak naik dengan kuat. <em>Form Cue:</em> Pastikan lutut hadapan selari dengan jari kaki dan tidak terlipat ke dalam (<em>knee valgus</em>).</p>
                  <p><strong>2. Single-Leg Romanian Deadlift / RDL (8–10 reps setiap kaki):</strong> Berdiri sebelah kaki, pegang beg galas berisi beban di tangan bertentangan, bongkokkan badan ke hadapan dari sendi pinggul sambil kaki belakang lurus ke belakang seperti huruf &quot;T&quot;. Menguatkan otot <em>hamstring</em> untuk kawalan tendangan.</p>
                  <p><strong>3. Pallof Press (10–12 reps setiap sisi):</strong> Ikat <em>resistance band</em> (atau tuala/tiub basikal lama) pada tiang/grill rumah separas dada. Berdiri mengiring, tarik getah ke tengah dada, kemudian tolak lurus ke hadapan tanpa membenarkan badan berpusing ditarik getah. Tahan 2 saat di hadapan.</p>
                  <p><strong>4. Plank with Shoulder Taps (20 sentuhan bergilir):</strong> Posisi <em>push-up</em> dengan kaki dibuka seluas bahu. Sentuh bahu kiri menggunakan tangan kanan secara perlahan tanpa menggoyangkan pinggul ke kiri atau ke kanan.</p>
                </div>
              </div>

              {/* Sub-section 2: Explosive Power */}
              <div className="p-5 rounded-xl bg-white/[0.025] border border-white/10 space-y-3">
                <h4 className="text-base font-bold text-white flex items-center justify-between">
                  <span>2. Explosive Power &amp; Plyometrics (Kelajuan Entry &amp; Sentapan Tendangan)</span>
                  <span className="text-xs font-mono text-amber-400 font-normal">3–4 Set | Rehat 90–120 Saat (Wajib Rehat Penuh)</span>
                </h4>
                <p className="text-xs text-[#A2A3AA]">
                  <strong>Fokus:</strong> Kadar penghasilan daya pantas (<em>Rate of Force Development - RFD</em>) dan kitaran regangan-pendekan otot (<em>Stretch-Shortening Cycle - SSC</em>).
                </p>
                <p className="text-xs text-[#D4D5D9] bg-white/[0.03] p-3 rounded-lg border border-white/10">
                  <strong>Kenapa Penting dalam Silat:</strong> Tendangan dan tumbukan silat bukan memerlukan otot besar yang lambat seperti ahli bina badan, tetapi memerlukan sentapan (<em>snap</em>) pinggul dan lonjakan kaki yang meletup dalam masa kurang daripada 0.2 saat untuk menembusi pertahanan lawan.
                </p>
                <div className="space-y-2 text-xs sm:text-sm text-[#C5C6CA]">
                  <p><strong>1. Lateral Bounds / Skater Jumps (6–8 lompatan setiap sisi):</strong> Lompat sisi sejauh mungkin dari kaki kanan ke kaki kiri, mendarat dengan lutut sedikit bengkok dalam keadaan stabil selama 1 saat sebelum melompat balas. Melatih pergerakan mengelak serangan dan masuk sudut (<em>angle entry</em>).</p>
                  <p><strong>2. Broad Jump to Stance (5–6 reps):</strong> Lompat ke hadapan sejauh mungkin menggunakan kedua-dua belah kaki dan terus mendarat dalam posisi <em>stance</em> silat (kuda-kuda sedia bertempur).</p>
                  <p><strong>3. Explosive Clapping / Push-Up (6–8 reps):</strong> Turun perlahan ke lantai, kemudian tolak badan naik sekuat dan sepantas mungkin sehingga tapak tangan terangkat dari lantai.</p>
                  <p><strong>4. Band-Resisted Hip Flexion / Knee Drive (10 reps pantas setiap kaki):</strong> Sangkut <em>resistance band</em> pada pergelangan kaki (hujung satu lagi diikat pada tiang belakang), tarik lutut naik ke dada sepantas kilat seperti fasa permulaan tendangan depan/sabit.</p>
                </div>
              </div>

              {/* Sub-section 3: Energy System Conditioning */}
              <div className="p-5 rounded-xl bg-white/[0.025] border border-white/10 space-y-3">
                <h4 className="text-base font-bold text-white flex items-center justify-between">
                  <span>3. Energy System Conditioning (Stamina Ikut Format Gelanggang)</span>
                  <span className="text-xs font-mono text-emerald-400 font-normal">Silat-Specific HIIT (3–5 Pusingan)</span>
                </h4>
                <p className="text-xs text-[#A2A3AA]">
                  <strong>Fokus:</strong> Melatih ketiga-tiga sistem tenaga mengikut nisbah sebenar perlawanan silat: <em>Anaerobic Alactic</em> (ledakan serangan 1–5 saat), <em>Anaerobic Lactic</em> (pertukaran serangan bertubi-tubi 15–30 saat), dan <em>Aerobic Recovery</em> (keupayaan menurunkan kadar degupan jantung dalam masa 1 minit rehat antara pusingan).
                </p>
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 text-xs sm:text-sm text-[#C5C6CA] space-y-2">
                  <p className="font-bold text-white">Pelaksanaan di Rumah (Ganti Joging Perlahan kepada Silat-Specific HIIT):</p>
                  <p>• <strong>Format Pusingan:</strong> 3 minit kerja berintensiti tinggi, 1 minit rehat aktif (berjalan setempat sambil tarik nafas dalam melalui hidung), ulang sebanyak <strong>3 hingga 5 pusingan</strong>.</p>
                  <p className="font-semibold text-slate-200 mt-2">Struktur dalam 1 Pusingan (3 Minit):</p>
                  <ul className="pl-4 space-y-1 list-disc">
                    <li><em>0:00 – 0:20 (20 saat):</em> Langkah masuk-keluar (<em>in-and-out footwork</em>) sepantas mungkin.</li>
                    <li><em>0:20 – 0:30 (10 saat):</em> Elak sisi (<em>slip/duck</em>) dan tangkis bertubi-tubi.</li>
                    <li><em>0:30 – 1:00 (30 saat):</em> <em>Shadow sparring</em> berintensiti tinggi (gabungan tumbukan, tendangan, dan elakan).</li>
                    <li><em>Ulang kitaran 1 minit ini sebanyak 3 kali tanpa henti</em> untuk melengkapkan 1 pusingan 3 minit penuh.</li>
                  </ul>
                </div>
              </div>

              {/* Sub-section 4: Reflex & Agility */}
              <div className="p-5 rounded-xl bg-white/[0.025] border border-white/10 space-y-3">
                <h4 className="text-base font-bold text-white">
                  4. Reflex, Agility &amp; Body Conditioning (Tindak Balas Saraf &amp; Ketahanan Impak)
                </h4>
                <p className="text-xs text-[#A2A3AA]">
                  <strong>Fokus:</strong> Kelajuan pemprosesan otak-ke-otot (<em>neuro-reaction</em>) dan ketahanan tisu terhadap impak fizikal.
                </p>
                <div className="space-y-3 text-xs sm:text-sm text-[#C5C6CA]">
                  <div className="p-3.5 rounded-lg bg-white/[0.03] border border-white/10">
                    <p className="font-bold text-white mb-1">1. Visual/Audio Reaction Drill (4 set x 30 saat):</p>
                    <p className="mb-2">Atlet berada dalam posisi <em>stance</em> sedia. Ibu bapa atau pasangan berdiri di hadapan memegang dua objek berbeza warna (contoh: botol merah di tangan kiri, botol biru di tangan kanan) atau memberi isyarat suara:</p>
                    <ul className="pl-4 space-y-1 list-disc text-slate-300">
                      <li><em>Angkat Merah:</em> Atlet terus buat <em>step-in</em> + tumbukan lurus + <em>exit</em> ke belakang.</li>
                      <li><em>Angkat Biru:</em> Atlet buat elakan sisi + tendangan sabit balas.</li>
                      <li><em>Tepuk Tangan:</em> Atlet buat <em>sprawl</em> / tangkis bawah (pertahanan anti-sapuan).</li>
                    </ul>
                  </div>

                  <p><strong>2. Footwork Agility Grid (4 set x 20 saat):</strong> Lukis bentuk &quot;+&quot; (tambah) di lantai menggunakan <em>masking tape</em>. Atlet melompat masuk-keluar petak dengan langkah kaki ringan dan berakhir dengan posisi <em>stance</em> silat.</p>
                  
                  <div className="space-y-1.5">
                    <p><strong>3. Body Conditioning (3 set):</strong></p>
                    <p className="pl-4">• <em>Abdomen Impact Conditioning:</em> Atlet melakukan posisi <em>hollow body hold</em> atau <em>crunch</em> separuh, manakala pasangan menepuk/menumbuk ringan bahagian otot perut secara berkala untuk melatih otot <em>core</em> mengetat secara automatik apabila menerima impak.</p>
                    <p className="pl-4">• <em>Grip Strength:</em> Pulas tuala basah sekuat tenaga (10 kali setiap arah) atau bergayut pada palang (<em>dead hang</em> 30–45 saat) untuk menguatkan cengkaman bagi teknik tangkapan kaki dan bantingan.</p>
                  </div>
                </div>
              </div>

              {/* Sub-section 5: Integrasi Taktikal (Blueprint A-G) */}
              <div className="p-5 rounded-xl bg-white/[0.025] border border-white/10 space-y-4">
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <Target size={16} className="text-[#FF3845]" />
                  <span>5. Integrasi ke Latihan Taktikal (Blueprint A–G &amp; Template Sesi Rumah)</span>
                </h4>
                <p className="text-xs sm:text-sm text-[#D4D5D9] leading-relaxed">
                  Setiap latihan fizikal di atas mesti diikat dengan peraturan emas: <strong>Satu Sesi, Satu Fokus Taktikal</strong>. Jangan campur semua teknik dalam satu hari sehingga semuanya menjadi separuh masak. Jika latihan di rumah dilakukan berpasangan atau menggunakan <em>heavy bag</em> / bantal tebal yang dipegang ahli keluarga, ikuti struktur latihan spesifik berikut:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-lg bg-white/[0.03] border border-white/10">
                    <span className="font-bold text-[#FF3845] block mb-1">Drill A — Conditioning yang Transfer Jadi Skill:</span>
                    Ikut protokol HIIT 3 minit kerja / 1 minit rehat di atas. Fokus utama: apabila masuk minit ke-3 dalam keadaan penat, tangan <em>guard</em> tidak boleh jatuh ke bawah dan kaki tidak boleh bersilang semasa melangkah.
                  </div>

                  <div className="p-3.5 rounded-lg bg-white/[0.03] border border-white/10">
                    <span className="font-bold text-[#FF3845] block mb-1">Drill B — Distance &amp; Timing (Step-and-Entry &amp; Exit-After-Attack):</span>
                    Pasangan melangkah kecil ke hadapan; atlet mesti membaca pergerakan tersebut dan masuk menyerang pada saat kaki pasangan belum mendarat sepenuhnya. Setiap kali selesai melancarkan serangan, atlet <strong>wajib keluar (<em>exit</em>) atau tukar sudut</strong> dalam masa kurang 0.5 saat. Jika atlet berdiri kaku selepas menendang, ulang semula dari awal.<br />
                    <em>KPI Sesi:</em> Dalam 2 minit, berapa kali <em>entry</em> bersih berjaya dilakukan? Berapa kali atlet &quot;terkena&quot; serangan balas sebab lambat keluar?
                  </div>

                  <div className="p-3.5 rounded-lg bg-white/[0.03] border border-white/10">
                    <span className="font-bold text-[#FF3845] block mb-1">Drill C — Defense-Counter:</span>
                    Pasangan memberi serangan tetap (lurus, pukulan sisi, atau tendangan sabit menggunakan bantal/pad). Atlet mesti melakukan tangkisan atau elakan bersih, diikuti serangan balas (<em>counter</em>) serta-merta. Mula dengan kelajuan 50% untuk ketepatan mekanik, kemudian naikkan kepada 80%–100%.<br />
                    <em>KPI Sesi:</em> Daripada 10 serangan, berapa kali berjaya <em>defend</em> dan <em>counter</em> dengan bersih tanpa hilang keseimbangan?
                  </div>

                  <div className="p-3.5 rounded-lg bg-white/[0.03] border border-white/10">
                    <span className="font-bold text-[#FF3845] block mb-1">Drill D — Constraint Sparring (Sparring Bersyarat):</span>
                    Letakkan sekatan taktikal untuk memaksa otak atlet berfikir di bawah tekanan (contoh: Atlet A hanya dibenarkan menyerang selepas melakukan elakan kepala/badan; atau Atlet B hanya dibenarkan menggunakan tendangan sabit hadapan sahaja sepanjang pusingan).
                  </div>

                  <div className="p-3.5 rounded-lg bg-white/[0.03] border border-white/10">
                    <span className="font-bold text-[#FF3845] block mb-1">Drill E — Scenario Sparring:</span>
                    Lakukan sparring ringan berintensiti terkawal selama 30–45 saat, rehat 1 minit, ulang 4–6 set. Setiap set diberi tema spesifik (Set 1: Fokus cari ruang masuk; Set 2: Fokus pertahanan; Set 3: Fokus <em>counter</em> pantas). Selepas setiap set, atlet mesti menjawab 3 soalan: <em>Apa yang berjaya? Apa yang rosak? Apa yang perlu diubah seterusnya?</em>
                  </div>

                  <div className="p-3.5 rounded-lg bg-white/[0.03] border border-white/10">
                    <span className="font-bold text-[#FF3845] block mb-1">Drill F — Pad Work Spesifik Sparring:</span>
                    Pemegang pad/bantal tidak boleh sekadar berdiri diam seperti patung. Pemegang pad mesti bergerak, melangkah masuk, dan melibas serangan rawak supaya atlet terpaksa membaca jarak (<em>distance management</em>) sebelum bertindak.
                  </div>

                  <div className="p-3.5 rounded-lg bg-white/[0.03] border border-white/10 md:col-span-2">
                    <span className="font-bold text-[#FF3845] block mb-1">Drill G — Video Review Wajib:</span>
                    Rakam sesi latihan atau sparring menggunakan telefon pintar. Tonton semula dan cari <strong>2 kesilapan teknikal sahaja</strong> (contoh: dagu terangkat masa menendang, atau kaki belakang terseret lambat semasa masuk). Jadikan 2 kesilapan ini sebagai sasaran utama latihan minggu hadapan.
                  </div>
                </div>

                {/* Template Lengkap 1 Sesi */}
                <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30 text-xs sm:text-sm text-slate-200 mt-4 space-y-2">
                  <p className="font-bold text-white text-base">
                    Template Lengkap 1 Sesi Latihan di Rumah (60–75 Minit):
                  </p>
                  <p>1. <strong>Warm-Up &amp; Dynamic Mobility (10–15 minit):</strong> Buka sendi pinggul, buku lali, dan tulang belakang.</p>
                  <p>2. <strong>Drill Spesifik Fokus Hari Ini (20–25 minit):</strong> Pilih SATU fokus sahaja (contoh: hari ini fokus <em>Drill B: Exit-After-Attack</em> atau <em>Explosive Power</em>).</p>
                  <p>3. <strong>Simulasi Tekanan / Constraint Drill (15–20 minit):</strong> 3–5 pusingan latihan berpasangan, <em>pad work</em> rawak, atau <em>shadow sparring</em> bertema.</p>
                  <p>4. <strong>Conditioning Ikut Pattern Sparring (10–15 minit):</strong> HIIT spesifik silat (3 minit kerja, 1 minit rehat x 3 pusingan).</p>
                  <p>5. <strong>Cool Down &amp; Refleksi Kendiri (5–10 minit):</strong> Regangan statik dan rekodkan KPI sesi hari ini di dalam buku log/portal.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: MODUL 4 (PEMULIHAN & PREHAB) */}
        {activeTab === "modul4" && (
          <div className="space-y-6">
            <div className="rounded-2xl p-6 sm:p-8 bg-[#121316] border border-white/10 shadow-2xl space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-400 text-xs font-bold uppercase mb-2">
                  <HeartPulse size={13} />
                  <span>MODUL 4: RECOVERY &amp; PREHAB</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold font-athletic text-white uppercase">
                  Pemulihan, Mobiliti &amp; Pencegahan Kecederaan (Recovery &amp; Prehab)
                </h3>
                <p className="text-sm text-[#D4D5D9] mt-2 leading-relaxed">
                  Kecederaan paling kerap berlaku dalam Silat Olahraga melibatkan koyak ligamen lutut (<strong>ACL/MCL</strong>), terseliuh buku lali (<strong>Ankle Sprain</strong>), dan koyak otot belakang paha (<strong>Hamstring Strain</strong>). Modul ini wajib dipatuhi oleh atlet dan dipantau ibu bapa di rumah supaya karier atlet tidak terhenti awal akibat kecederaan yang sepatutnya boleh dielakkan.
                </p>
              </div>

              {/* Dynamic Warmup */}
              <div className="p-5 rounded-xl bg-white/[0.025] border border-white/10 space-y-3">
                <h4 className="text-base font-bold text-white">
                  Protokol Dynamic Warm-Up &amp; Mobility (10–15 Minit Sebelum Setiap Sesi):
                </h4>
                <p className="text-xs text-[#FF858B] bg-red-950/20 p-3 rounded-lg border border-red-500/20">
                  Dilarang melakukan regangan statik yang lama (tahan 30 saat) sebelum latihan kerana ia &quot;menidurkan&quot; sistem saraf dan mengurangkan kuasa letupan otot. Lakukan regangan dinamik:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-[#C5C6CA]">
                  <div className="p-3 rounded-lg bg-white/[0.03] border border-white/10">
                    <strong>World’s Greatest Stretch (5 reps setiap sisi):</strong> Langkah luas ke hadapan (<em>lunge</em>), letak satu tangan di lantai, dan pusingkan badan ke atas membuka dada (<em>thoracic rotation</em>).
                  </div>
                  <div className="p-3 rounded-lg bg-white/[0.03] border border-white/10">
                    <strong>Leg Swings (15 hayunan setiap kaki):</strong> Hayun kaki ke hadapan-belakang dan ke kiri-kanan untuk melonggarkan kapsul sendi pinggul sebelum tendangan tinggi.
                  </div>
                  <div className="p-3 rounded-lg bg-white/[0.03] border border-white/10">
                    <strong>Hip 90/90 Switches (10 reps):</strong> Duduk di lantai dengan kedua-dua lutut dibengkokkan 90 darjah, tukar arah lutut ke kiri dan kanan tanpa mengangkat tumit untuk meningkatkan fleksibiliti pinggul.
                  </div>
                  <div className="p-3 rounded-lg bg-white/[0.03] border border-white/10">
                    <strong>Ankle Rockers (15 reps setiap kaki):</strong> Posisi melutut sebelah kaki, tolak lutut ke hadapan melepasi hujung jari kaki tanpa mengangkat tumit dari lantai.
                  </div>
                </div>
              </div>

              {/* Prehab Silat */}
              <div className="p-5 rounded-xl bg-white/[0.025] border border-white/10 space-y-3">
                <h4 className="text-base font-bold text-white">
                  Latihan Prehab Khusus Silat (3 Kali Seminggu — Boleh Buat Sambil Menonton TV):
                </h4>
                <div className="space-y-2 text-xs sm:text-sm text-[#C5C6CA]">
                  <p><strong>1. Spanish Squat / Wall Sit Isometric (3 set x 45 saat):</strong> Sandar belakang rapat ke dinding dengan lutut bengkok 90 darjah. Latihan isometrik ini terbukti secara klinikal menguatkan tendon patela lutut dan mengurangkan sakit lutut akibat hentakan mendarat.</p>
                  <p><strong>2. Eccentric Calf Raises (3 set x 12 reps setiap kaki):</strong> Berdiri di hujung anak tangga, naik menggunakan dua kaki, kemudian turun menggunakan <strong>sebelah kaki sahaja</strong> secara sangat perlahan (4 saat) untuk menguatkan tendon Achilles dan buku lali daripada terseliuh.</p>
                  <p><strong>3. Single-Leg Balance on Unstable Surface (3 set x 30 saat setiap kaki):</strong> Berdiri sebelah kaki di atas bantal lipat atau tilam lembut dengan mata tertutup untuk melatih sistem <em>proprioception</em> (keseimbangan refleks sendi).</p>
                </div>
              </div>

              {/* Cool Down */}
              <div className="p-5 rounded-xl bg-white/[0.025] border border-white/10 space-y-2">
                <h4 className="text-base font-bold text-white">
                  Protokol Cool Down (Lepas Sesi):
                </h4>
                <p className="text-xs sm:text-sm text-[#C5C6CA] leading-relaxed">
                  Lakukan <em>static stretching</em> (tahan setiap regangan 20–30 saat pada otot <em>hamstring</em>, <em>quadriceps</em>, <em>hip flexor</em>, dan betis) sambil menarik nafas dalam (4 saat tarik hidung, 6 saat hembus mulut) untuk menukar sistem saraf badan daripada mod tempur (<em>sympathetic</em>) kepada mod pemulihan (<em>parasympathetic</em>).
                </p>
              </div>

              {/* Load Management & Overtraining */}
              <div className="p-5 rounded-xl bg-white/[0.025] border border-white/10 space-y-3">
                <h4 className="text-base font-bold text-white">
                  Pengurusan Beban (Load Management) &amp; Tanda Amaran Overtraining:
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-[#C5C6CA] list-disc list-inside">
                  <li>
                    <strong>Tidur Berkualiti:</strong> Atlet remaja dan dewasa wajib tidur <strong>7.5 hingga 9 jam setiap malam</strong>. Hormon tumbesaran (<em>Human Growth Hormone</em>) untuk membaiki otot dan menyimpan memori teknik hanya dirembeskan secara maksimum semasa fasa tidur nyenyak (<em>deep sleep</em>).
                  </li>
                  <li>
                    <strong>Pantauan Skala RPE (Rate of Perceived Exertion):</strong> Selepas setiap latihan, atlet mesti menilai tahap kepenatan sesi dari skala <strong>1 (sangat ringan)</strong> hingga <strong>10 (maksimum/hampir pengsan)</strong>.
                  </li>
                  <li>
                    <strong>Sistem Lampu Isyarat untuk Ibu Bapa:</strong> Jika anak menunjukkan tanda-tanda berikut selama 3 hari berturut-turut, kurangkan beban latihan serta-merta: (1) Kadar degupan jantung waktu pagi sebaik bangun tidur meningkat &gt;10 denyutan seminit daripada biasa, (2) Kaki terasa berat walaupun hanya melakukan warm-up, (3) Hilang selera makan, sukar tidur, atau cepat marah.
                  </li>
                  <li>
                    <strong>Minggu Deload (Setiap Minggu ke-4):</strong> Selepas 3 minggu berlatih keras, wajib lakukan 1 minggu <em>deload</em> dengan mengurangkan jumlah set dan tempoh latihan sebanyak <strong>30% hingga 40%</strong> (kekalkan kelajuan/kualiti pergerakan, kurangkan kuantiti). Ini membolehkan badan melakukan <em>supercompensation</em>—iaitu fasa di mana badan bangkit menjadi lebih kuat dan pantas berbanding sebelumnya.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: MODUL 5 (SISTEM PANTAUAN & KPI) */}
        {activeTab === "modul5" && (
          <div className="space-y-6">
            <div className="rounded-2xl p-6 sm:p-8 bg-[#121316] border border-white/10 shadow-2xl space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-400 text-xs font-bold uppercase mb-2">
                  <Award size={13} />
                  <span>MODUL 5: KPI &amp; MONITORING</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold font-athletic text-white uppercase">
                  Sistem Pantauan Kemajuan &amp; KPI (Anti-Latihan Kosong)
                </h3>
                <p className="text-sm text-[#D4D5D9] mt-2 leading-relaxed">
                  Untuk menghapuskan budaya &quot;latihan nampak rajin tapi kosong hasil&quot;, setiap atlet wajib merekodkan data mereka di dalam portal menggunakan sistem penilaian 2 lapisan:
                </p>
              </div>

              {/* Lapis A */}
              <div className="p-5 rounded-xl bg-white/[0.025] border border-white/10 space-y-4">
                <h4 className="text-base font-bold text-white flex items-center justify-between">
                  <span>Lapis A: Ujian Kecergasan Fizikal (Dilakukan Setiap 4–6 Minggu di Rumah)</span>
                  <span className="text-xs text-purple-400 font-mono">Ujian Setiap 4–6 Minggu</span>
                </h4>
                <p className="text-xs text-[#A2A3AA]">
                  Tujuan ujian ini adalah untuk membuktikan secara saintifik bahawa program fizikal berjaya meningkatkan kuasa dan stamina atlet:
                </p>

                <div className="space-y-3 text-xs sm:text-sm text-[#C5C6CA]">
                  <div className="p-3.5 rounded-lg bg-white/[0.03] border border-white/10">
                    <p className="font-bold text-white mb-1">1. Ujian Kuasa Letupan Kaki (Standing Broad Jump):</p>
                    <p>• <em>Cara Ujian:</em> Lekatkan pita ukur di lantai. Atlet berdiri di belakang garisan mula, hayun tangan dan lompat ke hadapan sejauh mungkin menggunakan dua belah kaki. Ukur jarak dari garisan mula ke tumit paling belakang yang mendarat. Ambil bacaan terbaik daripada 3 percubaan.</p>
                    <p className="text-emerald-400 mt-1">• <em>Sasaran Kemajuan:</em> Peningkatan jarak sekurang-kurangnya 3cm – 5cm setiap 6 minggu.</p>
                  </div>

                  <div className="p-3.5 rounded-lg bg-white/[0.03] border border-white/10">
                    <p className="font-bold text-white mb-1">2. Ujian Ketangkasan &amp; Footwork (Hexagon Agility Test):</p>
                    <p>• <em>Cara Ujian:</em> Lukis bentuk heksagon (6 sisi, panjang setiap sisi 60cm) menggunakan <em>masking tape</em> di lantai. Atlet berdiri di tengah, lompat keluar melepasi setiap garisan dan kembali ke tengah mengikut pusingan jam sehingga lengkap 3 pusingan penuh. Rekod masa menggunakan <em>stopwatch</em>.</p>
                    <p className="text-emerald-400 mt-1">• <em>Sasaran Kemajuan:</em> Masa semakin pantas tanpa memijak garisan pita.</p>
                  </div>

                  <div className="p-3.5 rounded-lg bg-white/[0.03] border border-white/10">
                    <p className="font-bold text-white mb-1">3. Ujian Keseimbangan &amp; Anti-Sapuan (Single-Leg Stance Eyes Closed):</p>
                    <p>• <em>Cara Ujian:</em> Berdiri sebelah kaki (kaki satu lagi diangkat ke paras lutut seperti bersedia menendang), cekak pinggang, dan tutup mata. Mulakan <em>stopwatch</em>. Masa dihentikan sebaik sahaja kaki terangkat menyentuh lantai, tangan terlepas dari pinggang, atau mata terbuka.</p>
                    <p className="text-emerald-400 mt-1">• <em>Sasaran Kemajuan:</em> Mampu bertahan melebihi 30 saat untuk kedua-dua belah kaki.</p>
                  </div>

                  <div className="p-3.5 rounded-lg bg-white/[0.03] border border-white/10">
                    <p className="font-bold text-white mb-1">4. Ujian Stamina Tendangan (Silat Kick Fatigue Index):</p>
                    <p>• <em>Cara Ujian:</em> Atlet melakukan tendangan sabit bertubi-tubi pada bantal/pad/sasaran pada ketinggian perut dengan kelajuan dan kuasa maksimum selama <strong>30 saat</strong>, rehat <strong>1 minit</strong>, dan ulang sebanyak <strong>3 set</strong>. Rekodkan jumlah tendangan setiap set.</p>
                    
                    {/* Math formula */}
                    <div className="my-2.5 p-3 rounded-lg bg-[#08090b] border border-white/10 text-center font-mono text-xs sm:text-sm text-yellow-400">
                      Fatigue Index (%) = [ (Tendangan Set 1 − Tendangan Set 3) ÷ (Tendangan Set 1) ] × 100
                    </div>

                    <p className="text-emerald-400">• <em>Sasaran Kemajuan:</em> Bilangan tendangan Set 1 semakin meningkat, dan peratusan penurunan pada Set 3 semakin kecil (bawah 15% dianggap cemerlang).</p>
                  </div>
                </div>
              </div>

              {/* Lapis B */}
              <div className="p-5 rounded-xl bg-white/[0.025] border border-white/10 space-y-4">
                <h4 className="text-base font-bold text-white flex items-center justify-between">
                  <span>Lapis B: KPI Teknikal &amp; Taktikal Gelanggang (Dilakukan Setiap 2 Minggu — Blueprint G)</span>
                  <span className="text-xs text-blue-400 font-mono">Setiap 2 Minggu</span>
                </h4>
                <p className="text-xs text-[#A2A3AA]">
                  Tujuan lapisan ini adalah memastikan segala kecergasan fizikal di atas berjaya <em>transfer</em> menjadi kemahiran bertempur:
                </p>

                <ul className="space-y-2 text-xs sm:text-sm text-[#C5C6CA] list-disc list-inside">
                  <li><strong>Clean Entry Rate:</strong> Bilangan kemasukan serangan yang bersih tanpa terkena <em>counter</em> dalam tempoh 2 minit sparring.</li>
                  <li><strong>Exit Efficiency:</strong> Berapa kali atlet terkena serangan balas lawan berpunca daripada kelewatan keluar atau berdiri kaku selepas menyerang.</li>
                  <li><strong>Defense-to-Counter Ratio:</strong> Daripada 10 serangan lawan, berapa kali atlet berjaya menangkis/mengelak dan terus membalas dengan mata bersih.</li>
                </ul>

                <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/30 text-xs sm:text-sm text-slate-200 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-blue-400 mb-1">
                    <Video size={16} />
                    <span>SOP Video Review 5 Minit:</span>
                  </div>
                  <p>• Letakkan telefon pintar pada sudut menyerong (45 darjah) supaya keseluruhan badan atlet (dari hujung kaki hingga kepala) jelas kelihatan dalam bingkai video.</p>
                  <p>• Tonton rakaman sparring dan wajib kenal pasti <strong>2 kesilapan paling kritikal sahaja</strong> (contoh: <em>Kesilapan 1:</em> Tangan kiri jatuh ke pinggang setiap kali melancarkan tendangan kanan; <em>Kesilapan 2:</em> Kaki belakang lambat ditarik selepas menyerang).</p>
                  <p>• Gunakan 2 kesilapan ini sebagai sasaran utama <em>drill</em> spesifik untuk 2 minggu berikutnya, kemudian bandingkan video <em>before</em> dan <em>after</em>.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: PELAN INDUK & JADUAL MINGGUAN */}
        {activeTab === "pelan" && (
          <div className="space-y-6">
            <div className="rounded-2xl p-6 sm:p-8 bg-[#121316] border border-white/10 shadow-2xl space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#FF3845]/30 bg-[#FF3845]/10 text-[#FF555C] text-xs font-bold uppercase mb-2">
                  <Calendar size={13} />
                  <span>PERIODIZATION &amp; HOME MICROCYCLE</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold font-athletic text-white uppercase">
                  Pelan Pelaksanaan: Susunan Silibus Ikut Fasa (Periodization)
                </h3>
                <p className="text-sm text-[#D4D5D9] mt-2 leading-relaxed">
                  Supaya atlet tidak mengalami kecederaan atau keletihan melampau (<em>burnout</em>) menjelang kejohanan, susunan latihan mesti mengikut fasa kalendar berikut:
                </p>
              </div>

              {/* Table of Periodization Phases */}
              <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-white/[0.05] text-white font-bold border-b border-white/10">
                    <tr>
                      <th className="p-3 sm:p-4">Fasa Latihan</th>
                      <th className="p-3 sm:p-4">Tempoh</th>
                      <th className="p-3 sm:p-4">Fokus Utama Modul</th>
                      <th className="p-3 sm:p-4">Nisbah Latihan (Fizikal : Teknikal/Sparring)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.06] text-[#C5C6CA]">
                    <tr>
                      <td className="p-3 sm:p-4 font-bold text-white">
                        1. General Prep<br /><span className="text-[10px] text-[#A2A3AA] font-normal">(Fasa Persediaan Umum)</span>
                      </td>
                      <td className="p-3 sm:p-4 text-xs font-mono">4–6 Minggu</td>
                      <td className="p-3 sm:p-4 text-xs leading-relaxed">
                        Bina asas <em>strength</em>, kestabilan <em>core</em> &amp; buku lali (<em>prehab</em>), perbetul komposisi badan/lemak (<em>fat loss</em> secara sihat), dan perkemas mekanik asas langkah serta tendangan.
                      </td>
                      <td className="p-3 sm:p-4 text-xs font-bold text-emerald-400">
                        60% Fizikal : 40% Teknikal
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 sm:p-4 font-bold text-white">
                        2. Specific Prep<br /><span className="text-[10px] text-[#A2A3AA] font-normal">(Fasa Persediaan Khusus)</span>
                      </td>
                      <td className="p-3 sm:p-4 text-xs font-mono">4–6 Minggu</td>
                      <td className="p-3 sm:p-4 text-xs leading-relaxed">
                        Tukar <em>strength</em> kepada <em>explosive power &amp; plyometrics</em>, mula <em>conditioning</em> HIIT ikut pattern sparring, naikkan intensiti <em>Drill</em> B, C, dan F.
                      </td>
                      <td className="p-3 sm:p-4 text-xs font-bold text-blue-400">
                        40% Fizikal : 60% Teknikal/Drill
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 sm:p-4 font-bold text-white">
                        3. Pre-Competition<br /><span className="text-[10px] text-[#A2A3AA] font-normal">(Fasa Pra-Kejohanan)</span>
                      </td>
                      <td className="p-3 sm:p-4 text-xs font-mono">2–3 Minggu</td>
                      <td className="p-3 sm:p-4 text-xs leading-relaxed">
                        <em>Constraint &amp; scenario sparring</em> berintensiti tinggi, tajamkan <em>neuro-reflex</em>, pantau berat badan menghampiri berat kelas (2%–3% dari sasaran), dan jalankan <em>video review</em> intensif setiap 2 minggu.
                      </td>
                      <td className="p-3 sm:p-4 text-xs font-bold text-amber-400">
                        20% Fizikal : 80% Taktikal &amp; Sparring
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 sm:p-4 font-bold text-white">
                        4. Competition &amp; Taper<br /><span className="text-[10px] text-[#A2A3AA] font-normal">(Minggu Kejohanan)</span>
                      </td>
                      <td className="p-3 sm:p-4 text-xs font-mono">1–2 Minggu</td>
                      <td className="p-3 sm:p-4 text-xs leading-relaxed">
                        Kurangkan isipadu latihan (<em>tapering</em> sebanyak 40%–50%) supaya sistem saraf dan otot pulih sepenuhnya untuk kuasa letupan 100%. Kekalkan <em>speed drill</em> pendek, fokus protokol nutrisi, hidrasi, dan <em>weight cut</em> selamat.
                      </td>
                      <td className="p-3 sm:p-4 text-xs font-bold text-[#FF3845]">
                        10% Fizikal (Maintenance) : 90% Taktikal Ringan &amp; Recovery
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Home Microcycle Weekly Schedule */}
              <div className="p-5 rounded-xl bg-white/[0.025] border border-white/10 space-y-3">
                <h4 className="text-base font-bold text-white">
                  Contoh Struktur Jadual Mingguan di Rumah (Home Microcycle — Fasa Specific Prep):
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
                    <div>
                      <span className="font-bold text-[#FF3845] block">Isnin</span>
                      <span className="text-slate-300 block mt-1">Explosive Power &amp; Plyometrics</span>
                    </div>
                    <span className="text-[10px] text-[#8E9099] mt-2 block">+ Drill B (Distance &amp; Timing: Step-and-Entry)</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
                    <div>
                      <span className="font-bold text-blue-400 block">Selasa</span>
                      <span className="text-slate-300 block mt-1">Latihan Pasukan di Gelanggang</span>
                    </div>
                    <span className="text-[10px] text-[#8E9099] mt-2 block">/ Pad Work Spesifik (Drill F)</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
                    <div>
                      <span className="font-bold text-emerald-400 block">Rabu</span>
                      <span className="text-slate-300 block mt-1">Strength &amp; Core Stability</span>
                    </div>
                    <span className="text-[10px] text-[#8E9099] mt-2 block">+ Prehab Lutut/Buku Lali (Sesi ringan-sederhana)</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
                    <div>
                      <span className="font-bold text-blue-400 block">Khamis</span>
                      <span className="text-slate-300 block mt-1">Latihan Pasukan di Gelanggang</span>
                    </div>
                    <span className="text-[10px] text-[#8E9099] mt-2 block">/ Drill C (Defense-Counter) &amp; Constraint Sparring (Drill D)</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
                    <div>
                      <span className="font-bold text-teal-400 block">Jumaat</span>
                      <span className="text-slate-300 block mt-1">Recovery Aktif</span>
                    </div>
                    <span className="text-[10px] text-[#8E9099] mt-2 block">Mobiliti 15 minit + Video Review 2 kesilapan minggu ini</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
                    <div>
                      <span className="font-bold text-amber-400 block">Sabtu</span>
                      <span className="text-slate-300 block mt-1">Scenario Sparring (Drill E)</span>
                    </div>
                    <span className="text-[10px] text-[#8E9099] mt-2 block">+ Energy System Conditioning (HIIT 3 minit x 4 pusingan)</span>
                  </div>

                  <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/30 flex flex-col justify-between">
                    <div>
                      <span className="font-bold text-purple-400 block">Ahad</span>
                      <span className="text-white block mt-1">Rehat Penuh (Complete Rest)</span>
                    </div>
                    <span className="text-[10px] text-[#C5C6CA] mt-2 block">Fokus tidur berkualiti dan pemakanan pemulihan bersama keluarga</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
