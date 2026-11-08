"use client";

import Image from "next/image";
import Link from "next/link";

export interface PartnerLogo {
  name: string;
  shortName: string;
  category: string;
  src: string;
}

export const partnerLogos: PartnerLogo[] = [
  {
    name: "Persekutuan Silat Kebangsaan Malaysia",
    shortName: "PESAKA Malaysia",
    category: "Badan Induk",
    src: "/assets/silat-logos/pesaka-malaysia.png",
  },
  {
    name: "Pertubuhan Silat Seni Gayong Malaysia",
    shortName: "PSSGM",
    category: "Pengasas Teras",
    src: "/assets/silat-logos/pertubuhan-silat-seni-gayong-malaysia.png",
  },
  {
    name: "Pertubuhan Seni Silat Lincah Malaysia",
    shortName: "PSSLM",
    category: "Pengasas Teras",
    src: "/assets/silat-logos/pertubuhan-seni-silat-lincah-malaysia.png",
  },
  {
    name: "Persatuan Seni Silat Cekak Malaysia",
    shortName: "PSSCM",
    category: "Pengasas Teras",
    src: "/assets/silat-logos/persatuan-seni-silat-cekak-malaysia.png",
  },
  {
    name: "Pertubuhan Seni Gayung Fatani Malaysia",
    shortName: "PSGFM",
    category: "Pengasas Teras",
    src: "/assets/silat-logos/pertubuhan-seni-gayung-fatani-malaysia.png",
  },
  {
    name: "Persatuan Seni Silat Cekak Ustaz Hanafi Malaysia",
    shortName: "Cekak Hanafi",
    category: "Perguruan Utama",
    src: "/assets/silat-logos/persatuan-seni-silat-cekak-ustaz-hanafi-malaysia.png",
  },
  {
    name: "Akademi Persilatan Daeng Kuning",
    shortName: "Daeng Kuning",
    category: "Perguruan Utama",
    src: "/assets/silat-logos/akademi-persilatan-daeng-kuning.png",
  },
  {
    name: "Pertubuhan Seni Silat Pusaka Gayong Malaysia",
    shortName: "Pusaka Gayong",
    category: "Perguruan Utama",
    src: "/assets/silat-logos/pertubuhan-seni-silat-pusaka-gayong-malaysia.png",
  },
  {
    name: "Persatuan Seni Silat Sendeng Malaysia",
    shortName: "Silat Sendeng",
    category: "Perguruan Utama",
    src: "/assets/silat-logos/persatuan-seni-silat-sendeng-malaysia.png",
  },
  {
    name: "Persatuan Seni Silat Gayong Singa Berantai",
    shortName: "Singa Berantai",
    category: "Perguruan Utama",
    src: "/assets/silat-logos/persatuan-seni-silat-gayong-singa-berantai.png",
  },
  {
    name: "Pertubuhan Seni Silat Kuntau Tekpi Malaysia",
    shortName: "Kuntau Tekpi",
    category: "Perguruan Utama",
    src: "/assets/silat-logos/pertubuhan-seni-silat-kuntau-tekpi-malaysia.png",
  },
  {
    name: "PESAKA Wilayah Persekutuan Kuala Lumpur",
    shortName: "PESAKA KL",
    category: "Badan Induk",
    src: "/assets/silat-logos/pesaka-kuala-lumpur.png",
  },
  {
    name: "Persekutuan Silat Negeri Johor",
    shortName: "PESAKA Johor",
    category: "Badan Induk",
    src: "/assets/silat-logos/persekutuan-silat-negeri-johor.png",
  },
  {
    name: "Rumpun Silat Sarawak",
    shortName: "Silat Sarawak",
    category: "Badan Induk",
    src: "/assets/silat-logos/rumpun-silat-sarawak.png",
  },
  {
    name: "Pertubuhan Seni Silat Gerak Kilat",
    shortName: "IKASEKA",
    category: "Perguruan Utama",
    src: "/assets/silat-logos/pertubuhan-seni-silat-gerak-kilat-ikaseka.png",
  },
  {
    name: "Pertubuhan Seni Silat Ikatan Kalam Utama Malaysia",
    shortName: "PIKUM",
    category: "Perguruan Utama",
    src: "/assets/silat-logos/pertubuhan-seni-silat-ikatan-kalam-utama-pikum.png",
  },
  {
    name: "Silat Melayu Haqq",
    shortName: "Melayu Haqq",
    category: "Perguruan Utama",
    src: "/assets/silat-logos/silat-melayu-haqq.png",
  },
  {
    name: "Persekutuan Pencak Silat Antarabangsa",
    shortName: "PERSILAT",
    category: "Antarabangsa",
    src: "/assets/silat-logos/persekutuan-pencak-silat-antarabangsa-persilat.png",
  },
  {
    name: "Persaudaraan Setia Hati Terate",
    shortName: "PSHT",
    category: "Antarabangsa",
    src: "/assets/silat-logos/persaudaraan-setia-hati-terate-psht.png",
  },
  {
    name: "Perguruan Seni Beladiri Tapak Suci",
    shortName: "Tapak Suci",
    category: "Antarabangsa",
    src: "/assets/silat-logos/perguruan-seni-beladiri-tapak-suci.png",
  },
  {
    name: "Keluarga Silat Nasional Indonesia Perisai Diri",
    shortName: "Perisai Diri",
    category: "Antarabangsa",
    src: "/assets/silat-logos/keluarga-silat-nasional-perisai-diri.png",
  },
  {
    name: "Sayap Disiplin Tempur Keris PSSGM",
    shortName: "Tempur Keris",
    category: "Perguruan Utama",
    src: "/assets/silat-logos/tempur-keris-pssgm.png",
  },
  {
    name: "Ikatan Pencak Silat Indonesia",
    shortName: "IPSI",
    category: "Antarabangsa",
    src: "/assets/silat-logos/ikatan-pencak-silat-indonesia-ipsi.png",
  },
  {
    name: "Perguruan Pencak Silat Satria Muda Indonesia",
    shortName: "SMI",
    category: "Antarabangsa",
    src: "/assets/silat-logos/perguruan-pencak-silat-satria-muda-indonesia.png",
  },
  {
    name: "Perguruan Pencak Silat Betako Merpati Putih",
    shortName: "Merpati Putih",
    category: "Antarabangsa",
    src: "/assets/silat-logos/perguruan-pencak-silat-merpati-putih.png",
  },
  {
    name: "Ikatan Pencak Silat Nahdlatul Ulama Pagar Nusa",
    shortName: "Pagar Nusa",
    category: "Antarabangsa",
    src: "/assets/silat-logos/ikatan-pencak-silat-nahdlatul-ulama-pagar-nusa.png",
  },
  {
    name: "Perguruan Pencak Silat Gubug Remaja",
    shortName: "Gubug Remaja",
    category: "Antarabangsa",
    src: "/assets/silat-logos/perguruan-pencak-silat-gubug-remaja.png",
  },
];

export function AssociationMarquee() {
  return (
    <section
      className="association-marquee-section relative py-12 md:py-16 overflow-hidden bg-black/25 backdrop-blur-[2px] border-y border-[#26272C]/40"
      aria-labelledby="marquee-heading"
    >
      {/* Side Edge Fade Gradients */}
      <div
        className="marquee-edge-gradient marquee-edge-left"
        aria-hidden="true"
      />
      <div
        className="marquee-edge-gradient marquee-edge-right"
        aria-hidden="true"
      />

      {/* Section Header */}
      <div className="association-marquee-header text-center mb-8 relative z-30">
        <p className="marquee-eyebrow text-xs tracking-[0.3em] text-[#FF3845] uppercase mb-2 font-semibold">
          — RANGKAIAN KELAB &amp; PERSILATAN —
        </p>
        <h2 id="marquee-heading" className="marquee-title font-athletic text-2xl md:text-3xl font-bold text-white tracking-wide">
          Kelab &amp; Badan Perguruan Berdaftar
        </h2>
        <p className="marquee-subtitle text-xs md:text-sm text-[#C5C6CA] max-w-2xl mx-auto mt-2">
          Dinaungi oleh PESAKA Malaysia bersama empat anggota pengasas teras, perguruan utama kebangsaan, dan persekutuan antarabangsa PERSILAT.
        </p>
      </div>

      {/* Infinite Scrolling Logo Marquee */}
      <div
        className="partner-scroll-wrapper relative w-full items-center overflow-hidden"
        tabIndex={0}
        role="region"
        aria-label="Marquee logo kelab dan badan perguruan silat bersekutu"
      >
        {/* Track 1 */}
        <div className="partner-scroll-track flex items-center shrink-0">
          {partnerLogos.map((item, index) => (
            <Link
              key={`track1-${item.shortName}-${index}`}
              href="/associations"
              className="partner-logo-link focus:outline-none"
              title={`${item.name} (${item.category})`}
            >
              <Image
                src={item.src}
                alt={item.name}
                width={170}
                height={80}
                unoptimized
                className="partner-logo"
                loading="lazy"
              />
            </Link>
          ))}
        </div>

        {/* Track 2 (Duplicated for Seamless Loop) */}
        <div className="partner-scroll-track flex items-center shrink-0" aria-hidden="true">
          {partnerLogos.map((item, index) => (
            <Link
              key={`track2-${item.shortName}-${index}`}
              href="/associations"
              tabIndex={-1}
              className="partner-logo-link focus:outline-none"
              title={`${item.name} (${item.category})`}
            >
              <Image
                src={item.src}
                alt=""
                width={170}
                height={80}
                unoptimized
                className="partner-logo"
                loading="lazy"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
