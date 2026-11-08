/**
 * FighterX Malaysian Silat Competition Calendar Dataset (2026/2027)
 * Authoritative takwim covering Open, SUKMA, SUKIPT, Kebangsaan, Sirkit Negeri, and Club invitationals.
 */

export type CompetitionTier =
  | "sukma"
  | "sukipt"
  | "kebangsaan"
  | "terbuka"
  | "sirkit_negeri"
  | "jemputan_kelab";

export type SanctionStatus =
  | "pesaka_verified"
  | "msn_verified"
  | "under_review"
  | "independent";

export type AgeCategory = "dini" | "pra_remaja" | "remaja" | "dewasa";

export type DisciplineType =
  | "tanding"
  | "tunggal"
  | "ganda"
  | "regu"
  | "solo_kreatif";

export type RegistrationStatus =
  | "open"
  | "closing_soon"
  | "closed"
  | "completed"
  | "upcoming";

export interface ScheduleDay {
  day: number;
  dateLabel: string;
  title: string;
  activities: string[];
}

export interface WeightClassItem {
  category: string;
  gender: "Putera" | "Puteri" | "Terbuka";
  classes: string[];
}

export interface ContactPerson {
  name: string;
  role: string;
  phone: string;
  email: string;
}

export interface CompetitionItem {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  organizer: string;
  organizerLogo?: string;
  state: string;
  venue: string;
  city: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  registrationDeadline: string; // YYYY-MM-DD
  feeAmount: number;
  feeUnit: string;
  totalSlots: number;
  filledSlots: number;
  tier: CompetitionTier;
  sanctionStatus: SanctionStatus;
  sanctionRef?: string;
  ageCategories: AgeCategory[];
  disciplines: DisciplineType[];
  ruleset: string;
  featured: boolean;
  status: RegistrationStatus;
  description: string;
  highlightPrizes?: string;
  scheduleDays: ScheduleDay[];
  weightClasses: WeightClassItem[];
  contactPerson: ContactPerson;
  bulletinFileName?: string;
  posterUrl?: string;
  bulletinUrl?: string;
  organizerWebsite?: string;
}

export const MALAYSIAN_STATES = [
  "Semua Negeri",
  "Selangor",
  "WP Kuala Lumpur",
  "Johor",
  "Kedah",
  "Kelantan",
  "Terengganu",
  "Perak",
  "Pulau Pinang",
  "Pahang",
  "Negeri Sembilan",
  "Melaka",
  "Sabah",
  "Sarawak",
  "Perlis",
  "WP Putrajaya",
] as const;

export const AGE_CATEGORY_CONFIG: Record<
  AgeCategory,
  { label: string; ageRange: string; color: string }
> = {
  dini: {
    label: "Dini",
    ageRange: "7 - 9 Tahun",
    color: "#64b7ff",
  },
  pra_remaja: {
    label: "Pra-Remaja",
    ageRange: "10 - 13 Tahun",
    color: "#e5e5e7",
  },
  remaja: {
    label: "Remaja",
    ageRange: "14 - 17 Tahun",
    color: "#ffd24c",
  },
  dewasa: {
    label: "Dewasa",
    ageRange: "17 - 45 Tahun",
    color: "#ff4d5a",
  },
};

export const DISCIPLINE_CONFIG: Record<
  DisciplineType,
  { label: string; short: string; isSeni: boolean }
> = {
  tanding: { label: "Silat Tanding (Combat)", short: "Tanding", isSeni: false },
  tunggal: { label: "Seni Tunggal Baku", short: "Tunggal", isSeni: true },
  ganda: { label: "Seni Ganda Tempur", short: "Ganda", isSeni: true },
  regu: { label: "Seni Regu Jurus Wajib", short: "Regu", isSeni: true },
  solo_kreatif: { label: "Seni Solo Kreatif / Bebas", short: "Solo Kreatif", isSeni: true },
};

export const TIER_CONFIG: Record<
  CompetitionTier,
  { label: string; badgeClass: string; bg: string; color: string }
> = {
  sukma: {
    label: "Sukan Malaysia (SUKMA)",
    badgeClass: "badge-gold tier-gold",
    bg: "rgba(240, 180, 40, 0.12)",
    color: "#ffd24c",
  },
  sukipt: {
    label: "Kejohanan IPT (SUKIPT)",
    badgeClass: "badge-blue tier-blue",
    bg: "rgba(60, 160, 255, 0.12)",
    color: "#64b7ff",
  },
  kebangsaan: {
    label: "Kejohanan Kebangsaan",
    badgeClass: "badge-crimson tier-crimson",
    bg: "rgba(255, 56, 69, 0.12)",
    color: "#ff4d5a",
  },
  terbuka: {
    label: "Kejohanan Terbuka (Open)",
    badgeClass: "badge-silver tier-silver",
    bg: "rgba(255, 255, 255, 0.08)",
    color: "#e5e5e7",
  },
  sirkit_negeri: {
    label: "Sirkit Remaja Negeri",
    badgeClass: "badge-blue tier-blue",
    bg: "rgba(60, 160, 255, 0.12)",
    color: "#64b7ff",
  },
  jemputan_kelab: {
    label: "Jemputan Kelab Silat",
    badgeClass: "badge-silver tier-silver",
    bg: "rgba(255, 255, 255, 0.08)",
    color: "#e5e5e7",
  },
};

export const INITIAL_COMPETITIONS: CompetitionItem[] = [
  {
    id: "FX-2026-001",
    slug: "kejohanan-silat-kebangsaan-pesaka-2026",
    title: "Kejohanan Pencak Silat Kebangsaan PESAKA Malaysia Ke-24",
    subtitle: "Pentas Pemilihan Skuad Elit Negara & Kelayakan SUKMA",
    organizer: "Persekutuan Silat Kebangsaan Malaysia (PESAKA Malaysia)",
    organizerLogo: "/assets/silat-logos/pesaka-malaysia.png",
    state: "WP Kuala Lumpur",
    venue: "Stadium Titiwangsa",
    city: "Kuala Lumpur",
    startDate: "2026-04-16",
    endDate: "2026-04-20",
    registrationDeadline: "2026-03-31",
    feeAmount: 120,
    feeUnit: "RM / atlet",
    totalSlots: 650,
    filledSlots: 540,
    tier: "kebangsaan",
    sanctionStatus: "pesaka_verified",
    sanctionRef: "PESAKA/KEB/2026/04-001",
    ageCategories: ["remaja", "dewasa"],
    disciplines: ["tanding", "tunggal", "ganda", "regu", "solo_kreatif"],
    ruleset: "PERSILAT 2026 (Edisi Rasmi 69 Halaman)",
    featured: true,
    status: "open",
    description:
      "Kejohanan rasmi tertinggi persilatan kebangsaan mengumpulkan jaguh dari seluruh 14 buah negeri dan kontinjen badan pengasas teras. Kejohanan ini menjadi kayu ukur utama bagi pemilihan atlet ke Sukan SEA dan Kejohanan Dunia.",
    highlightPrizes: "Piala Pusingan YAB Perdana Menteri, Pingat Emas/Perak/Gangsa & Hadiah Wang Tunai Keseluruhan RM50,000",
    scheduleDays: [
      {
        day: 1,
        dateLabel: "16 April 2026",
        title: "Pendaftaran Kontinjen & Timbang Berat Rasmi",
        activities: [
          "08:30 - Pendaftaran kontinjen negeri & semakan borang M01",
          "10:00 - Taklimat Pengurus Pasukan & Undian Kategori (Drawing)",
          "14:00 - Timbang berat rasmi pusingan pertama & pemeriksaan perubatan",
          "17:00 - Taklimat Wasit Juri PERSILAT 2026",
          "20:00 - Majlis Pembukaan Rasmi & Pertunjukan Seni Warisan",
        ],
      },
      {
        day: 2,
        dateLabel: "17 April 2026",
        title: "Pusingan Awal Silat Seni & Pusingan 1 Tanding",
        activities: [
          "08:30 - Saringan Seni Tunggal & Regu (Gelanggang 1 & 2)",
          "14:00 - Pusingan Pertama Silat Tanding Kelas A, B, C Dewasa",
          "17:30 - Rehat & Timbang Berat Harian",
          "20:00 - Pusingan Malam Tanding Kelas D, E, F Dewasa",
        ],
      },
      {
        day: 3,
        dateLabel: "18 April 2026",
        title: "Suku Akhir & Separuh Akhir Silat Seni",
        activities: [
          "09:00 - Separuh Akhir Silat Seni Ganda & Solo Kreatif",
          "14:00 - Suku Akhir Silat Tanding Remaja & Dewasa",
          "19:30 - Sesi Analisis VAR / Semakan Video Bantahan Wasit",
        ],
      },
      {
        day: 4,
        dateLabel: "19 April 2026",
        title: "Separuh Akhir Silat Tanding",
        activities: [
          "09:00 - Separuh Akhir Silat Tanding Semua Kelas",
          "15:00 - Pertandingan Akhir Silat Seni Tunggal, Ganda, Regu",
          "20:00 - Penentuan Tempat Ketiga Silat Tanding",
        ],
      },
      {
        day: 5,
        dateLabel: "20 April 2026",
        title: "Pertandingan Akhir & Upacara Penutup",
        activities: [
          "09:00 - Pertandingan Akhir Silat Tanding Remaja",
          "14:30 - Pertandingan Akhir Silat Tanding Dewasa",
          "17:30 - Upacara Penyampaian Pingat & Penutupan Rasmi PESAKA",
        ],
      },
    ],
    weightClasses: [
      {
        category: "Dewasa Putera",
        gender: "Putera",
        classes: [
          "Kelas A (45 - 50 kg)",
          "Kelas B (50 - 55 kg)",
          "Kelas C (55 - 60 kg)",
          "Kelas D (60 - 65 kg)",
          "Kelas E (65 - 70 kg)",
          "Kelas F (70 - 75 kg)",
          "Kelas G (75 - 80 kg)",
          "Kelas H (80 - 85 kg)",
          "Kelas I (85 - 90 kg)",
          "Kelas J (90 - 95 kg)",
          "Bebas 1 (95 - 110 kg)",
        ],
      },
      {
        category: "Dewasa Puteri",
        gender: "Puteri",
        classes: [
          "Kelas A (45 - 50 kg)",
          "Kelas B (50 - 55 kg)",
          "Kelas C (55 - 60 kg)",
          "Kelas D (60 - 65 kg)",
          "Kelas E (65 - 70 kg)",
          "Kelas F (70 - 75 kg)",
          "Kelas G (75 - 80 kg)",
          "Kelas H (80 - 85 kg)",
          "Bebas (85 - 100 kg)",
        ],
      },
      {
        category: "Remaja Putera & Puteri",
        gender: "Terbuka",
        classes: [
          "Kelas A (39 - 43 kg)",
          "Kelas B (43 - 47 kg)",
          "Kelas C (47 - 51 kg)",
          "Kelas D (51 - 55 kg)",
          "Kelas E (55 - 59 kg)",
          "Kelas F (59 - 63 kg)",
          "Kelas G (63 - 67 kg)",
        ],
      },
    ],
    contactPerson: {
      name: "Tuan Haji Megat Zulkarnain",
      role: "Setiausaha Agung Jawatankuasa Teknikal",
      phone: "+603-2710 4455",
      email: "pertandingan@pesaka.org.my",
    },
    posterUrl: "https://pesaka.org.my/buletin/pesaka-kebangsaan-2026.pdf",
    bulletinFileName: "Buletin_Rasmi_Kejohanan_PESAKA_2026.pdf",
    organizerWebsite: "https://pesaka.org.my",
  },
  {
    id: "FX-2026-002",
    slug: "sukma-2026-pencak-silat",
    title: "Sukan Malaysia (SUKMA XXII) Selangor 2026 — Acara Pencak Silat",
    subtitle: "Temasya Dwi-Tahunan Berprestij Peringkat Kebangsaan",
    organizer: "Majlis Sukan Negara (MSN), Kerajaan Negeri Selangor & PESAKA",
    organizerLogo: "/assets/silat-logos/rumpun-silat-sarawak.png",
    state: "Selangor",
    venue: "Dewan Seri Sarjana, UNITEN",
    city: "Kajang",
    startDate: "2026-08-14",
    endDate: "2026-08-19",
    registrationDeadline: "2026-07-01",
    feeAmount: 0,
    feeUnit: "Ditaja Sepenuhnya MSN & Kerajaan Negeri",
    totalSlots: 520,
    filledSlots: 520,
    tier: "sukma",
    sanctionStatus: "msn_verified",
    sanctionRef: "MSN/SUKMA2026/SILAT-08",
    ageCategories: ["remaja", "dewasa"],
    disciplines: ["tanding", "tunggal", "ganda", "regu", "solo_kreatif"],
    ruleset: "PERSILAT 2026 (Sistem Elektronik & VAR Rasmi)",
    featured: true,
    status: "upcoming",
    description:
      "Pertarungan kemuncak atlet muda terbaik mewakili 14 kontinjen negeri dan Wilayah Persekutuan bagi memburu pingat emas temasya sukan dwi-tahunan terbesar negara di UNITEN Kajang.",
    highlightPrizes: "Pingat Emas Rasmi Temasya SUKMA XXII & Skim Hadiah Kemenangan Sukan Kebangsaan (SHAKAM)",
    scheduleDays: [
      {
        day: 1,
        dateLabel: "14 Ogos 2026",
        title: "Pendaftaran Kontinjen, Mesyuarat Pengurus & Ujian Doping",
        activities: [
          "09:00 - Pengesahan akhir senarai atlet bersama delegasi teknikal MSN & PESAKA",
          "14:00 - Taklimat perubatan & kawalan anti-doping (ADAMAS)",
          "16:00 - Majlis Undian Rasmi Disiplin Tanding & Seni (Live Stream)",
        ],
      },
      {
        day: 2,
        dateLabel: "15 Ogos 2026",
        title: "Pertandingan Saringan & Suku Akhir Silat Seni",
        activities: [
          "08:30 - Saringan Seni Tunggal & Ganda Putera/Puteri",
          "14:00 - Pusingan Akhir Seni Regu & Penyampaian Pingat Sesi 1",
        ],
      },
      {
        day: 3,
        dateLabel: "16 Ogos 2026",
        title: "Pusingan Awal Tanding",
        activities: [
          "08:30 - Timbang berat harian rasmi (toleransi 0.0 kg)",
          "09:30 - Pusingan Pertama Tanding Lelaki & Wanita Kelas B, C, D, E",
        ],
      },
      {
        day: 4,
        dateLabel: "17 Ogos 2026",
        title: "Suku Akhir Tanding",
        activities: [
          "09:00 - Pusingan Suku Akhir Silat Tanding 4 Gelanggang",
          "20:00 - Sidang Video Adjudikasi Wasit & Panel Juri",
        ],
      },
      {
        day: 5,
        dateLabel: "18 Ogos 2026",
        title: "Separuh Akhir Tanding",
        activities: ["09:00 - Pertarungan Separuh Akhir Merebut Tempat ke Pentas Final"],
      },
      {
        day: 6,
        dateLabel: "19 Ogos 2026",
        title: "Hari Kemuncak Akhir Tanding & Upacara Pingat Emas",
        activities: [
          "09:00 - Pertarungan Akhir Kelas A hingga E Putera & Puteri",
          "14:30 - Pertarungan Akhir Kelas F hingga Bebas",
          "17:00 - Upacara Pengurniaan Pingat Emas & Majlis Penutupan Rasmi",
        ],
      },
    ],
    weightClasses: [
      {
        category: "SUKMA Bawah 21 Tahun",
        gender: "Terbuka",
        classes: [
          "Kelas A (45 - 50 kg)",
          "Kelas B (50 - 55 kg)",
          "Kelas C (55 - 60 kg)",
          "Kelas D (60 - 65 kg)",
          "Kelas E (65 - 70 kg)",
          "Kelas F (70 - 75 kg)",
          "Kelas G (75 - 80 kg)",
          "Kelas Bebas (Open)",
        ],
      },
    ],
    contactPerson: {
      name: "Sekretariat SUKMA Selangor 2026",
      role: "Delegasi Teknikal Silat MSN",
      phone: "+603-8992 9600",
      email: "silat@selangor2026.com",
    },
    posterUrl: "https://selangor2026.com/poster-rasmi-silat-sukma.pdf",
    bulletinFileName: "Buku_Teknikal_SUKMA_Selangor_2026_Silat.pdf",
    organizerWebsite: "https://selangor2026.com",
  },
  {
    id: "FX-2026-003",
    slug: "sukipt-2026-silat",
    title: "Sukan Institusi Pengajian Tinggi (SUKIPT Ke-7) 2026 — Pencak Silat",
    subtitle: "Pentas Atlet Mahasiswa Universiti & IPT Seluruh Malaysia",
    organizer: "Kementerian Pendidikan Tinggi (KPT) & Universiti Malaya (UM)",
    organizerLogo: "/assets/silat-logos/pertubuhan-seni-gayung-fatani-malaysia.png",
    state: "WP Kuala Lumpur",
    venue: "Dewan Peperiksaan 2, Universiti Malaya",
    city: "Kuala Lumpur",
    startDate: "2026-08-28",
    endDate: "2026-09-06",
    registrationDeadline: "2026-07-20",
    feeAmount: 60,
    feeUnit: "RM / atlet (Disubsidi KPT)",
    totalSlots: 550,
    filledSlots: 410,
    tier: "sukipt",
    sanctionStatus: "pesaka_verified",
    sanctionRef: "KPT/SUKIPT2026/SILAT-08",
    ageCategories: ["dewasa"],
    disciplines: ["tanding", "tunggal", "ganda", "regu", "solo_kreatif"],
    ruleset: "PERSILAT 2026 (Format Mahasiswa Kebangsaan)",
    featured: true,
    status: "open",
    description:
      "Temasya silat paling berprestij bagi penuntut universiti awam, universiti swasta, politeknik, dan kolej komuniti bertempat di Universiti Malaya. Menampilkan pesilat berstatus atlet kebangsaan dan bakat mahasiswa IPT.",
    highlightPrizes: "Piala Juara Keseluruhan IPT, Biasiswa Kecemerlangan Atlet & Hadiah Tajaan",
    scheduleDays: [
      {
        day: 1,
        dateLabel: "11 Jun 2026",
        title: "Pendaftaran Kontinjen IPT & Timbang Awal",
        activities: ["Semakan kad pelajar & kad matrik", "Pemeriksaan kesihatan", "Undian Gelanggang"],
      },
      {
        day: 2,
        dateLabel: "12 Jun 2026",
        title: "Pusingan Awal Seni & Tanding",
        activities: ["Saringan Seni Tunggal & Solo Kreatif", "Pusingan 1 Tanding Kelas Ringan"],
      },
      {
        day: 3,
        dateLabel: "13 Jun 2026",
        title: "Suku Akhir",
        activities: ["Pertarungan Suku Akhir Tanding Lelaki & Wanita"],
      },
      {
        day: 4,
        dateLabel: "14 Jun 2026",
        title: "Separuh Akhir & Akhir Seni",
        activities: ["Akhir Silat Seni Ganda & Regu", "Separuh Akhir Tanding"],
      },
      {
        day: 5,
        dateLabel: "15 Jun 2026",
        title: "Hari Kemuncak Akhir Tanding",
        activities: ["Perlawanan Akhir 14 Kategori Tanding", "Upacara Penutup & Juara Kontinjen IPT"],
      },
    ],
    weightClasses: [
      {
        category: "Mahasiswa Terbuka (18-25 Tahun)",
        gender: "Terbuka",
        classes: [
          "Kelas A (45 - 50 kg)",
          "Kelas B (50 - 55 kg)",
          "Kelas C (55 - 60 kg)",
          "Kelas D (60 - 65 kg)",
          "Kelas E (65 - 70 kg)",
          "Kelas F (70 - 75 kg)",
          "Kelas G (75 - 80 kg)",
          "Kelas H (80 - 85 kg)",
        ],
      },
    ],
    contactPerson: {
      name: "Sekretariat SUKIPT 2026 (Zon Silat)",
      role: "Pusat Sukan Universiti Malaya & KPT",
      phone: "+603-8870 6000",
      email: "sukipt2026@um.edu.my",
    },
    bulletinUrl: "https://sukipt.com.my/dokumen/buletin-silat-2026.pdf",
    bulletinFileName: "Buletin_Teknikal_SUKIPT_2026_Silat.pdf",
    organizerWebsite: "https://sukipt.com.my",
  },
  {
    id: "FX-2026-004",
    slug: "kejohanan-silat-terbuka-antarabangsa-pendekar-selat-2026",
    title: "Kejohanan Silat Terbuka Antarabangsa Pendekar Selat 2026",
    subtitle: "Piala Sumbangsih Selatan & Jemputan ASEAN",
    organizer: "Persekutuan Silat Negeri Johor (PESAKA Johor)",
    organizerLogo: "/assets/silat-logos/persekutuan-silat-negeri-johor.png",
    state: "Johor",
    venue: "Arena Larkin",
    city: "Johor Bahru",
    startDate: "2026-05-22",
    endDate: "2026-05-26",
    registrationDeadline: "2026-05-05",
    feeAmount: 95,
    feeUnit: "RM / peserta",
    totalSlots: 700,
    filledSlots: 620,
    tier: "terbuka",
    sanctionStatus: "pesaka_verified",
    sanctionRef: "PESAKA-JHR/TERBUKA/2026-004",
    ageCategories: ["pra_remaja", "remaja", "dewasa"],
    disciplines: ["tanding", "tunggal", "ganda", "solo_kreatif"],
    ruleset: "PERSILAT 2026 (Sistem Pemarkahan Digital)",
    featured: true,
    status: "closing_soon",
    description:
      "Kejohanan terbuka terbesar di selatan tanah air yang turut disertai kontinjen jemputan dari Singapura, Indonesia (Riau & Kepri), dan Brunei. Terbuka kepada semua kelab, persatuan, dan sekolah berdaftar.",
    highlightPrizes: "Hadiah Terkumpul RM35,000 + Keris Warisan bagi Olahragawan & Olahragawati Terbaik",
    scheduleDays: [
      {
        day: 1,
        dateLabel: "22 Mei 2026",
        title: "Pendaftaran & Pemeriksaan Berat",
        activities: ["Pendaftaran kontinjen antarabangsa & kelab", "Pemeriksaan pelindung dada homologated"],
      },
      {
        day: 2,
        dateLabel: "23 Mei 2026",
        title: "Pusingan Awal Pra-Remaja & Remaja",
        activities: ["Saringan Tanding Pra-Remaja", "Saringan Seni Tunggal & Solo Kreatif"],
      },
      {
        day: 3,
        dateLabel: "24 Mei 2026",
        title: "Pusingan Awal Dewasa & Suku Akhir",
        activities: ["Tanding Dewasa Terbuka", "Peringkat Suku Akhir Pra-Remaja"],
      },
      {
        day: 4,
        dateLabel: "25 Mei 2026",
        title: "Separuh Akhir Semua Kategori",
        activities: ["Separuh Akhir Silat Tanding & Pertandingan Akhir Silat Seni"],
      },
      {
        day: 5,
        dateLabel: "26 Mei 2026",
        title: "Pertandingan Akhir & Malam Gala Pendekar",
        activities: ["Perlawanan Akhir Silat Tanding Dewasa", "Malam Gala Penganugerahan & Persembahan Pendekar"],
      },
    ],
    weightClasses: [
      {
        category: "Dewasa Terbuka (Putera / Puteri)",
        gender: "Terbuka",
        classes: ["Kelas A hingga H"],
      },
      {
        category: "Pra-Remaja & Remaja",
        gender: "Terbuka",
        classes: ["Kelas A hingga G"],
      },
    ],
    contactPerson: {
      name: "Tuan Haji Daing Sulaiman",
      role: "Pengarah Pertandingan PESAKA Johor",
      phone: "+607-224 8899",
      email: "info@pesakajohor.org",
    },
    bulletinUrl: "https://pesakajohor.org/buletin/pendekar-selat-2026.pdf",
    bulletinFileName: "Buletin_Pendekar_Selat_Johor_2026.pdf",
    organizerWebsite: "https://pesakajohor.org",
  },
  {
    id: "FX-2026-005",
    slug: "sirkit-remaja-kebangsaan-zon-timur-2026",
    title: "Sirkit Remaja Kebangsaan 2026 — Siri 1 Zon Timur",
    subtitle: "Pembangunan Bakat Bawah 17 Tahun Terengganu, Kelantan & Pahang",
    organizer: "PESAKA Terengganu & Majlis Sukan Negeri Terengganu (MSNT)",
    organizerLogo: "/assets/silat-logos/pertubuhan-silat-seni-gayong-malaysia.png",
    state: "Terengganu",
    venue: "Stadium Tertutup Kompleks Sukan Gong Badak",
    city: "Kuala Terengganu",
    startDate: "2026-06-25",
    endDate: "2026-06-28",
    registrationDeadline: "2026-06-10",
    feeAmount: 50,
    feeUnit: "RM / atlet",
    totalSlots: 450,
    filledSlots: 280,
    tier: "sirkit_negeri",
    sanctionStatus: "pesaka_verified",
    sanctionRef: "PESAKA-TRG/SIRKIT/2026-01",
    ageCategories: ["pra_remaja", "remaja"],
    disciplines: ["tanding", "tunggal", "regu"],
    ruleset: "PERSILAT 2026 (Standard Bakat Remaja)",
    featured: false,
    status: "open",
    description:
      "Siri jelajah pencarian bakat muda Pantai Timur anjuran bersama PESAKA Terengganu dan MSNT. Menjadi medan utama mengasah atlet muda sebelum Kejohanan Remaja Kebangsaan.",
    highlightPrizes: "Piala Pusingan Presiden PESAKA Negeri & Sijil Pengiktirafan Peringkat Kebangsaan",
    scheduleDays: [
      {
        day: 1,
        dateLabel: "25 Jun 2026",
        title: "Timbang Berat & Saringan Seni",
        activities: ["Timbang berat atlet remaja", "Pertandingan Seni Tunggal & Regu"],
      },
      {
        day: 2,
        dateLabel: "26 Jun 2026",
        title: "Pusingan 1 & Suku Akhir Tanding",
        activities: ["Perlawanan Pusingan Awal Silat Tanding Remaja Putera & Puteri"],
      },
      {
        day: 3,
        dateLabel: "27 Jun 2026",
        title: "Separuh Akhir Tanding",
        activities: ["Separuh Akhir Tanding Pra-Remaja dan Remaja"],
      },
      {
        day: 4,
        dateLabel: "28 Jun 2026",
        title: "Pusingan Akhir & Penyampaian Hadiah",
        activities: ["Final Silat Tanding Remaja & Upacara Pingat"],
      },
    ],
    weightClasses: [
      {
        category: "Remaja (14-17 Tahun)",
        gender: "Terbuka",
        classes: ["Kelas A (39-43kg)", "Kelas B (43-47kg)", "Kelas C (47-51kg)", "Kelas D (51-55kg)", "Kelas E (55-59kg)"],
      },
      {
        category: "Pra-Remaja (10-13 Tahun)",
        gender: "Terbuka",
        classes: ["Kelas A (28-31kg)", "Kelas B (31-34kg)", "Kelas C (34-37kg)", "Kelas D (37-40kg)"],
      },
    ],
    contactPerson: {
      name: "Cikgu Wan Harun Wan Ali",
      role: "Pengerusi Teknikal Zon Timur",
      phone: "+609-667 3344",
      email: "sirkit.timur@pesakaterengganu.my",
    },
  },
  {
    id: "FX-2026-006",
    slug: "kejohanan-silat-terbuka-shah-alam-piala-datuk-bandar-2026",
    title: "Kejohanan Silat Terbuka Shah Alam & Piala Datuk Bandar 2026",
    subtitle: "Kejohanan Terbuka Kelab & Sekolah Peringkat Kebangsaan",
    organizer: "Majlis Bandaraya Shah Alam (MBSA) & Kelab Silat Lembah Klang",
    organizerLogo: "/assets/silat-logos/persatuan-seni-silat-cekak-malaysia.png",
    state: "Selangor",
    venue: "Stadium Tertutup Malawati",
    city: "Shah Alam",
    startDate: "2026-07-09",
    endDate: "2026-07-12",
    registrationDeadline: "2026-06-25",
    feeAmount: 80,
    feeUnit: "RM / atlet",
    totalSlots: 800,
    filledSlots: 710,
    tier: "terbuka",
    sanctionStatus: "pesaka_verified",
    sanctionRef: "PESAKA-SEL/2026/07-112",
    ageCategories: ["dini", "pra_remaja", "remaja", "dewasa"],
    disciplines: ["tanding", "tunggal", "ganda", "regu", "solo_kreatif"],
    ruleset: "PERSILAT 2026 (Semua Kategori Umur)",
    featured: true,
    status: "closing_soon",
    description:
      "Kejohanan berprestij di Lembah Klang yang merangkumi semua peringkat umur dari usia Dini (7 tahun) hingga Dewasa. Sangat popular di kalangan akademi silat swasta dan kelab persilatan.",
    highlightPrizes: "Piala Pusingan Datuk Bandar Shah Alam, Tunai Keseluruhan RM25,000 & Baucar Alatan Sukan",
    scheduleDays: [
      {
        day: 1,
        dateLabel: "9 Julai 2026",
        title: "Kategori Dini & Pra-Remaja",
        activities: ["Pendaftaran & timbang berat kategori cilik", "Pertandingan Silat Seni Cilik & Tanding Dini"],
      },
      {
        day: 2,
        dateLabel: "10 Julai 2026",
        title: "Kategori Remaja",
        activities: ["Saringan & suku akhir Tanding Remaja", "Pertandingan Seni Tunggal & Solo Kreatif"],
      },
      {
        day: 3,
        dateLabel: "11 Julai 2026",
        title: "Kategori Dewasa & Separuh Akhir Remaja",
        activities: ["Pusingan awal Tanding Dewasa", "Separuh akhir Remaja"],
      },
      {
        day: 4,
        dateLabel: "12 Julai 2026",
        title: "Perlawanan Akhir & Penutupan",
        activities: ["Final Silat Tanding Semua Kategori", "Upacara Penyampaian Piala Datuk Bandar"],
      },
    ],
    weightClasses: [
      {
        category: "Kategori Dini & Pra-Remaja",
        gender: "Terbuka",
        classes: ["Kelas Bebas Dini", "Pra-Remaja Kelas A hingga E"],
      },
      {
        category: "Kategori Remaja & Dewasa",
        gender: "Terbuka",
        classes: ["Remaja Kelas A hingga G", "Dewasa Kelas A hingga H"],
      },
    ],
    contactPerson: {
      name: "Ustaz Azlan bin Kamaruddin",
      role: "Pengurus Acara Silat MBSA",
      phone: "+603-5510 5133",
      email: "silat@mbsa.gov.my",
    },
    bulletinUrl: "https://mbsa.gov.my/dokumen/buletin-silat-shah-alam-2026.pdf",
    bulletinFileName: "Buletin_Silat_Shah_Alam_2026.pdf",
  },
  {
    id: "FX-2026-007",
    slug: "sirkit-remaja-negeri-sembilan-2026",
    title: "Sirkit Bakat Silat Remaja Negeri Sembilan 2026 — Pusingan 1",
    subtitle: "Pentas Kelayakan Atlet SUKMA 2026 Negeri Sembilan",
    organizer: "PESAKA Negeri Sembilan & Majlis Sukan Negeri Sembilan",
    organizerLogo: "/assets/silat-logos/pertubuhan-seni-silat-lincah-malaysia.png",
    state: "Negeri Sembilan",
    venue: "Dewan Tuanku Jaafar",
    city: "Seremban",
    startDate: "2026-05-08",
    endDate: "2026-05-10",
    registrationDeadline: "2026-04-26",
    feeAmount: 40,
    feeUnit: "RM / atlet",
    totalSlots: 350,
    filledSlots: 310,
    tier: "sirkit_negeri",
    sanctionStatus: "pesaka_verified",
    sanctionRef: "PESAKA-NS/SIRKIT/2026-01",
    ageCategories: ["pra_remaja", "remaja"],
    disciplines: ["tanding", "tunggal"],
    ruleset: "PERSILAT 2026",
    featured: false,
    status: "closing_soon",
    description:
      "Kejohanan peringkat negeri bagi mengasah kemahiran atlet daerah (Seremban, Jempol, Tampin, Port Dickson, Rembau, Jelebu, Kuala Pilah) dengan bimbingan panel wasit juri bertauliah.",
    highlightPrizes: "Medal Kejohanan & Tiket Ujian Pemilihan Skuad SUKMA Negeri Sembilan",
    scheduleDays: [
      {
        day: 1,
        dateLabel: "8 Mei 2026",
        title: "Timbang Berat & Saringan Seni",
        activities: ["Timbang berat rasmi & semakan kad pengenalan", "Pertandingan Seni Tunggal"],
      },
      {
        day: 2,
        dateLabel: "9 Mei 2026",
        title: "Pusingan Awal & Suku Akhir Tanding",
        activities: ["Pusingan kalah mati Silat Tanding"],
      },
      {
        day: 3,
        dateLabel: "10 Mei 2026",
        title: "Separuh Akhir & Akhir",
        activities: ["Perlawanan Akhir & Penutup"],
      },
    ],
    weightClasses: [
      {
        category: "Remaja Putera & Puteri",
        gender: "Terbuka",
        classes: ["Kelas A (39-43kg)", "Kelas B (43-47kg)", "Kelas C (47-51kg)", "Kelas D (51-55kg)"],
      },
    ],
    contactPerson: {
      name: "Tuan Bakhtiar bin Hussin",
      role: "Setiausaha Kerja PESAKA NS",
      phone: "+606-762 1100",
      email: "pesakans@gmail.com",
    },
  },
  {
    id: "FX-2026-008",
    slug: "kejohanan-silat-seni-kebangsaan-mahaguru-meor-2026",
    title: "Kejohanan Silat Seni Warisan Mahaguru Dato' Meor Abdul Rahman 2026",
    subtitle: "Kejuaraan Khusus Silat Seni Tradisional & Jurus Wajib Antarabangsa",
    organizer: "Pertubuhan Silat Seni Gayong Malaysia Kebangsaan (PSSGM)",
    organizerLogo: "/assets/silat-logos/pertubuhan-silat-seni-gayong-malaysia.png",
    state: "Perak",
    venue: "Stadium Indera Mulia",
    city: "Ipoh",
    startDate: "2026-09-04",
    endDate: "2026-09-07",
    registrationDeadline: "2026-08-20",
    feeAmount: 75,
    feeUnit: "RM / acara",
    totalSlots: 500,
    filledSlots: 180,
    tier: "jemputan_kelab",
    sanctionStatus: "pesaka_verified",
    sanctionRef: "PSSGM/WARISAN/2026-09",
    ageCategories: ["dini", "pra_remaja", "remaja", "dewasa"],
    disciplines: ["tunggal", "ganda", "regu", "solo_kreatif"],
    ruleset: "PERSILAT 2026 Seni & Format Jurus Warisan",
    featured: true,
    status: "open",
    description:
      "Kejohanan berprestij yang memfokuskan sepenuhnya kepada disiplin Silat Seni (Tunggal, Ganda, Regu, dan Solo Kreatif Senjata Tradisional: Keris, Parang, Tongkat, Tekpi). Terbuka kepada semua cawangan dan perguruan silat.",
    highlightPrizes: "Keris Agong PSSGM, Pingat Warisan Emas & Anugerah Pendekar Seni Terbaik 2026",
    scheduleDays: [
      {
        day: 1,
        dateLabel: "4 September 2026",
        title: "Pendaftaran Kontinjen & Ujian Senjata",
        activities: ["Pemeriksaan keselamatan bilah senjata tradisional", "Taklimat juri seni"],
      },
      {
        day: 2,
        dateLabel: "5 September 2026",
        title: "Seni Tunggal Baku & Solo Kreatif",
        activities: ["Kategori Dini & Pra-Remaja", "Saringan Remaja & Dewasa"],
      },
      {
        day: 3,
        dateLabel: "6 September 2026",
        title: "Seni Ganda Tempur & Regu",
        activities: ["Persembahan Ganda Bersenjata & Bertangan Kosong", "Seni Regu Jurus Wajib"],
      },
      {
        day: 4,
        dateLabel: "7 September 2026",
        title: "Kemuncak Persembahan & Penutup",
        activities: ["Akhir Solo Bebas Berirama", "Malam Serikandi & Pendekar Warisan"],
      },
    ],
    weightClasses: [
      {
        category: "Disiplin Seni (Semua Kategori Umur)",
        gender: "Terbuka",
        classes: ["Tunggal Baku", "Ganda Tempur", "Regu Jurus Wajib", "Solo Kreatif Muzik"],
      },
    ],
    contactPerson: {
      name: "Tuan Guru Ahmad bin Meor",
      role: "Penyelaras Kejohanan Warisan PSSGM",
      phone: "+605-241 7788",
      email: "seniwarisan@gayongmalaysia.org",
    },
    bulletinUrl: "https://gayongmalaysia.org/buletin-mahaguru-meor-2026.pdf",
    bulletinFileName: "Buletin_Kejohanan_Seni_Mahaguru_2026.pdf",
    organizerWebsite: "https://gayongmalaysia.org",
  },
  {
    id: "FX-2026-009",
    slug: "kejohanan-silat-terbuka-hang-tuah-melaka-2026",
    title: "Kejohanan Silat Terbuka Antarabangsa Hang Tuah Melaka 2026",
    subtitle: "Piala Yang di-Pertua Negeri Melaka Bandaraya Bersejarah",
    organizer: "PESAKA Negeri Melaka & Kerajaan Negeri Melaka",
    organizerLogo: "/assets/silat-logos/persatuan-seni-silat-sendeng-malaysia.png",
    state: "Melaka",
    venue: "Stadium Hang Jebat",
    city: "Ayer Keroh",
    startDate: "2026-10-15",
    endDate: "2026-10-19",
    registrationDeadline: "2026-09-30",
    feeAmount: 110,
    feeUnit: "RM / atlet",
    totalSlots: 750,
    filledSlots: 220,
    tier: "terbuka",
    sanctionStatus: "pesaka_verified",
    sanctionRef: "PESAKA-MLK/HT/2026-10",
    ageCategories: ["pra_remaja", "remaja", "dewasa"],
    disciplines: ["tanding", "tunggal", "ganda", "regu", "solo_kreatif"],
    ruleset: "PERSILAT 2026 (Format Lengkap)",
    featured: false,
    status: "open",
    description:
      "Kejohanan gilang-gemilang bersempena sambutan Tahun Melawat Melaka. Menampilkan penyertaan atlet kebangsaan serta kelab jemputan dari Indonesia, Thailand, dan Brunei Darussalam.",
    highlightPrizes: "Piala Pusingan Hang Tuah, Hadiah Tunai RM40,000 & Baucar Penginapan Pelancongan Melaka",
    scheduleDays: [
      {
        day: 1,
        dateLabel: "15 Oktober 2026",
        title: "Pendaftaran & Pembukaan",
        activities: ["Pendaftaran kontinjen", "Perbarisan 50 kontinjen persilatan", "Persembahan Tempur Keris Melaka"],
      },
      {
        day: 2,
        dateLabel: "16 Oktober 2026",
        title: "Pusingan Awal",
        activities: ["Saringan Silat Seni & Pusingan 1 Silat Tanding"],
      },
      {
        day: 3,
        dateLabel: "17 Oktober 2026",
        title: "Suku Akhir Tanding",
        activities: ["Suku Akhir Tanding 4 Gelanggang"],
      },
      {
        day: 4,
        dateLabel: "18 Oktober 2026",
        title: "Separuh Akhir & Akhir Seni",
        activities: ["Separuh Akhir Tanding", "Akhir Silat Seni"],
      },
      {
        day: 5,
        dateLabel: "19 Oktober 2026",
        title: "Pertarungan Akhir & Penutupan",
        activities: ["Final Silat Tanding Dewasa", "Malam Kemuncak Anugerah Hang Tuah"],
      },
    ],
    weightClasses: [
      {
        category: "Kategori Dewasa & Remaja",
        gender: "Terbuka",
        classes: ["Kelas A hingga J (Dewasa)", "Kelas A hingga G (Remaja)"],
      },
    ],
    contactPerson: {
      name: "Datuk Wira Zulkifli bin Hashim",
      role: "Yang Dipertua PESAKA Melaka",
      phone: "+606-232 5566",
      email: "info@pesakamelaka.gov.my",
    },
    posterUrl: "https://pesakamelaka.gov.my/poster-hang-tuah-2026.pdf",
    bulletinFileName: "Buletin_Hang_Tuah_Melaka_2026.pdf",
  },
  {
    id: "FX-2026-010",
    slug: "kejohanan-silat-terbuka-borneo-piala-sabah-2026",
    title: "Kejohanan Silat Terbuka Borneo & Piala Sabah Maju Jaya 2026",
    subtitle: "Pentas Persilatan Pulau Borneo — Malaysia, Brunei & Kalimantan",
    organizer: "Persekutuan Silat Kebangsaan Negeri Sabah (PESAKA Sabah)",
    organizerLogo: "/assets/silat-logos/rumpun-silat-sarawak.png",
    state: "Sabah",
    venue: "Kompleks Sukan Likas",
    city: "Kota Kinabalu",
    startDate: "2026-11-12",
    endDate: "2026-11-16",
    registrationDeadline: "2026-10-25",
    feeAmount: 85,
    feeUnit: "RM / peserta",
    totalSlots: 600,
    filledSlots: 150,
    tier: "terbuka",
    sanctionStatus: "pesaka_verified",
    sanctionRef: "PESAKA-SBH/BORNEO/2026-11",
    ageCategories: ["pra_remaja", "remaja", "dewasa"],
    disciplines: ["tanding", "tunggal", "ganda", "regu"],
    ruleset: "PERSILAT 2026",
    featured: false,
    status: "open",
    description:
      "Kejohanan terbuka tahunan menghimpunkan pendekar dari seluruh Sabah, Sarawak, Wilayah Persekutuan Labuan, Brunei Darussalam, dan wilayah Kalimantan Utara & Timur, Indonesia.",
    highlightPrizes: "Piala Pusingan Borneo, Pingat Emas Bersalut & Hadiah Tunai RM30,000",
    scheduleDays: [
      {
        day: 1,
        dateLabel: "12 November 2026",
        title: "Pendaftaran & Mesyuarat Teknikal",
        activities: ["Pendaftaran pasukan borneo", "Drawing & timbang rasmi"],
      },
      {
        day: 2,
        dateLabel: "13 November 2026",
        title: "Pusingan Saringan",
        activities: ["Silat Seni Tunggal & Regu", "Pusingan 1 Tanding"],
      },
      {
        day: 3,
        dateLabel: "14 November 2026",
        title: "Suku Akhir",
        activities: ["Suku Akhir Silat Tanding"],
      },
      {
        day: 4,
        dateLabel: "15 November 2026",
        title: "Separuh Akhir",
        activities: ["Separuh Akhir Tanding & Final Seni"],
      },
      {
        day: 5,
        dateLabel: "16 November 2026",
        title: "Final & Upacara Penutup",
        activities: ["Pertarungan Akhir Silat Tanding & Jamuan Muhibah Borneo"],
      },
    ],
    weightClasses: [
      {
        category: "Dewasa & Remaja",
        gender: "Terbuka",
        classes: ["Kelas A hingga H"],
      },
    ],
    contactPerson: {
      name: "Tuan Mansur bin Asmat",
      role: "Pengurus Pertandingan PESAKA Sabah",
      phone: "+6088-251 4400",
      email: "pesakasabah.borneo@gmail.com",
    },
    posterUrl: "https://pesakasabah.org.my/poster-borneo-2026.pdf",
    bulletinFileName: "Buletin_Silat_Borneo_Sabah_2026.pdf",
  },
  {
    id: "FX-2026-011",
    slug: "sirkit-remaja-kebangsaan-zon-utara-kedah-2026",
    title: "Sirkit Remaja Kebangsaan 2026 — Siri 2 Zon Utara",
    subtitle: "Pencarian Bakat Kedah, Perlis, Pulau Pinang & Perak Utara",
    organizer: "PESAKA Negeri Kedah & Majlis Sukan Negeri Kedah",
    organizerLogo: "/assets/silat-logos/persatuan-seni-silat-cekak-ustaz-hanafi-malaysia.png",
    state: "Kedah",
    venue: "Stadium Sultan Abdul Halim",
    city: "Alor Setar",
    startDate: "2026-08-06",
    endDate: "2026-08-09",
    registrationDeadline: "2026-07-22",
    feeAmount: 50,
    feeUnit: "RM / atlet",
    totalSlots: 400,
    filledSlots: 95,
    tier: "sirkit_negeri",
    sanctionStatus: "pesaka_verified",
    sanctionRef: "PESAKA-KDH/SIRKIT/2026-02",
    ageCategories: ["pra_remaja", "remaja"],
    disciplines: ["tanding", "tunggal", "ganda"],
    ruleset: "PERSILAT 2026 (Siri Remaja Kebangsaan)",
    featured: false,
    status: "open",
    description:
      "Sirkit kedua Zon Utara bagi melengkapkan siri pencarian bakat kebangsaan. Mengetengahkan atlet sekolah menengah dan pusat latihan daerah bagi persediaan ke SUKMA akan datang.",
    highlightPrizes: "Piala Pusingan Juara Zon Utara & Pengiktirafan Peringkat Kebangsaan",
    scheduleDays: [
      {
        day: 1,
        dateLabel: "6 Ogos 2026",
        title: "Timbang Berat & Saringan Seni",
        activities: ["Timbang berat", "Saringan Seni"],
      },
      {
        day: 2,
        dateLabel: "7 Ogos 2026",
        title: "Pusingan Awal Tanding",
        activities: ["Pusingan 1 & 2 Silat Tanding"],
      },
      {
        day: 3,
        dateLabel: "8 Ogos 2026",
        title: "Suku Akhir & Separuh Akhir",
        activities: ["Suku Akhir dan Separuh Akhir Tanding"],
      },
      {
        day: 4,
        dateLabel: "9 Ogos 2026",
        title: "Final & Majlis Penutup",
        activities: ["Pertandingan Akhir & Penyampaian Pingat"],
      },
    ],
    weightClasses: [
      {
        category: "Remaja Bawah 17 Tahun",
        gender: "Terbuka",
        classes: ["Kelas A (39-43kg)", "Kelas B (43-47kg)", "Kelas C (47-51kg)", "Kelas D (51-55kg)", "Kelas E (55-59kg)"],
      },
    ],
    contactPerson: {
      name: "Cikgu Suhaimi bin Saad",
      role: "Pengarah Pertandingan PESAKA Kedah",
      phone: "+604-733 6611",
      email: "sirkit.utara@pesakakedah.my",
    },
  },
  {
    id: "FX-2026-012",
    slug: "kejohanan-silat-dini-pra-remaja-bakat-harapan-2026",
    title: "Kejohanan Silat Cilik & Pra-Remaja Bakat Harapan Kebangsaan 2026",
    subtitle: "Pentas Tunas Pendekar 7 hingga 13 Tahun Seluruh Malaysia",
    organizer: "Akademi Silat Tunas Bangsa & PESAKA WP Kuala Lumpur",
    organizerLogo: "/assets/silat-logos/pesaka-kuala-lumpur.png",
    state: "WP Kuala Lumpur",
    venue: "Dewan MSN Taman Keramat",
    city: "Kuala Lumpur",
    startDate: "2026-05-30",
    endDate: "2026-06-01",
    registrationDeadline: "2026-05-18",
    feeAmount: 65,
    feeUnit: "RM / peserta",
    totalSlots: 450,
    filledSlots: 410,
    tier: "terbuka",
    sanctionStatus: "pesaka_verified",
    sanctionRef: "PESAKA-KL/DINI/2026-05",
    ageCategories: ["dini", "pra_remaja"],
    disciplines: ["tanding", "tunggal", "solo_kreatif"],
    ruleset: "PERSILAT 2026 (Protokol Keselamatan Tunas Kanak-kanak)",
    featured: true,
    status: "closing_soon",
    description:
      "Kejohanan khas kanak-kanak berteraskan pembangunan akhlak, disiplin gelanggang, dan asas teknik beladiri yang selamat. Menggunakan pelindung muka dan dada ekstra tebal dengan kawalan ketat wasit berpengalaman.",
    highlightPrizes: "Piala Tunas Harapan, Pingat Penyertaan Rasmi Semua Peserta & Sijil Khas Kokurikulum KPM",
    scheduleDays: [
      {
        day: 1,
        dateLabel: "30 Mei 2026",
        title: "Kategori Dini (7-9 Tahun)",
        activities: ["Timbang berat mesra kanak-kanak", "Seni Tunggal Cilik & Tanding Dini", "Penyampaian Pingat Dini"],
      },
      {
        day: 2,
        dateLabel: "31 Mei 2026",
        title: "Kategori Pra-Remaja (10-11 Tahun)",
        activities: ["Saringan & suku akhir Pra-Remaja Bawah 11"],
      },
      {
        day: 3,
        dateLabel: "1 Jun 2026",
        title: "Kategori Pra-Remaja (12-13 Tahun) & Final",
        activities: ["Pertarungan akhir semua kategori Pra-Remaja", "Upacara Penutup & Anugerah Tunas Pendekar"],
      },
    ],
    weightClasses: [
      {
        category: "Dini (7-9 Tahun)",
        gender: "Terbuka",
        classes: ["Kelas Dini 1 (Bawah 22kg)", "Kelas Dini 2 (22-25kg)", "Kelas Dini 3 (25-28kg)"],
      },
      {
        category: "Pra-Remaja (10-13 Tahun)",
        gender: "Terbuka",
        classes: ["Kelas A (28-31kg)", "Kelas B (31-34kg)", "Kelas C (34-37kg)", "Kelas D (37-40kg)", "Kelas E (40-43kg)"],
      },
    ],
    contactPerson: {
      name: "Puan Norazlina binti Md Yusof",
      role: "Penyelaras Pembangunan Tunas Silat",
      phone: "+603-4252 8811",
      email: "tunasharapan@fighterx.my",
    },
  },
  {
    id: "FX-2027-001",
    slug: "kejohanan-silat-jemputan-nusantara-pantai-timur-2027",
    title: "Kejohanan Silat Jemputan Antara Kelab Nusantara 2027",
    subtitle: "Piala Presiden FighterX & Pertarungan Silat Elit",
    organizer: "FighterX Platform & Gabungan Kelab Silat Pantai Timur",
    organizerLogo: "/assets/silat-logos/pertubuhan-seni-silat-gerak-kilat-ikaseka.png",
    state: "Pahang",
    venue: "Stadium Tertutup SUKPA",
    city: "Kuantan",
    startDate: "2027-01-22",
    endDate: "2027-01-25",
    registrationDeadline: "2026-12-31",
    feeAmount: 100,
    feeUnit: "RM / atlet",
    totalSlots: 600,
    filledSlots: 80,
    tier: "terbuka",
    sanctionStatus: "under_review",
    sanctionRef: "FX-REV-2027-001 (Dalam Semakan PESAKA)",
    ageCategories: ["remaja", "dewasa"],
    disciplines: ["tanding", "tunggal", "ganda", "solo_kreatif"],
    ruleset: "PERSILAT 2026 (Live Streaming & Sensor Skor Digital)",
    featured: false,
    status: "upcoming",
    description:
      "Kejohanan pembuka tirai 2027 menampilkan teknologi pengesanan mata digital FighterX, siaran langsung multi-kamera, dan hadiah wang tunai tertinggi untuk kelab juara keseluruhan.",
    highlightPrizes: "Piala Kejuaraan FighterX 2027, Hadiah Tunai RM60,000 & Tajaan Set Lengkap Kelab Juara",
    scheduleDays: [
      {
        day: 1,
        dateLabel: "22 Januari 2027",
        title: "Pendaftaran Digital & Timbang Berat Pintar",
        activities: ["Pendaftaran dengan FighterX ID", "Timbang berat digital bersepadu", "Undian algoritma automatik"],
      },
      {
        day: 2,
        dateLabel: "23 Januari 2027",
        title: "Pusingan Awal Seni & Tanding",
        activities: ["Saringan Silat Seni", "Pusingan 1 Tanding Remaja & Dewasa"],
      },
      {
        day: 3,
        dateLabel: "24 Januari 2027",
        title: "Suku Akhir & Separuh Akhir",
        activities: ["Suku Akhir & Separuh Akhir Tanding (Siaran Langsung HD)"],
      },
      {
        day: 4,
        dateLabel: "25 Januari 2027",
        title: "Malam Kemuncak Kejuaraan",
        activities: ["Perlawanan Akhir 12 Kategori", "Upacara Penyampaian Hadiah & Piala Pusingan FighterX"],
      },
    ],
    weightClasses: [
      {
        category: "Kategori Terbuka Remaja & Dewasa",
        gender: "Terbuka",
        classes: ["Kelas A hingga H"],
      },
    ],
    contactPerson: {
      name: "Kapten (B) Shamsul Bahari",
      role: "Pengarah Operasi Kejohanan FighterX",
      phone: "+609-567 8900",
      email: "tournaments@fighterx.my",
    },
    bulletinUrl: "https://fighterx.my/bulletins/prospektus-nusantara-2027.pdf",
    bulletinFileName: "Prospektus_Kejohanan_Nusantara_2027.pdf",
    organizerWebsite: "https://fighterx.my/competitions",
  },
  {
    id: "FX-2026-013",
    slug: "kejohanan-silat-remaja-bakat-kelantan-2026",
    title: "Kejohanan Silat Remaja & Bakat Pantai Timur Kelantan 2026",
    subtitle: "Pentas Pemilihan Atlet Skuad Remaja Negeri Kelantan",
    organizer: "PESAKA Negeri Kelantan & Majlis Sukan Negeri Kelantan (MSNK)",
    organizerLogo: "/assets/silat-logos/pertubuhan-silat-seni-gayong-malaysia.png",
    state: "Kelantan",
    venue: "Kompleks Belia & Sukan Panji",
    city: "Kota Bharu",
    startDate: "2026-07-23",
    endDate: "2026-07-26",
    registrationDeadline: "2026-07-08",
    feeAmount: 45,
    feeUnit: "RM / atlet",
    totalSlots: 400,
    filledSlots: 310,
    tier: "sirkit_negeri",
    sanctionStatus: "pesaka_verified",
    sanctionRef: "PESAKA-KTN/SIRKIT/2026-07",
    ageCategories: ["pra_remaja", "remaja"],
    disciplines: ["tanding", "tunggal", "ganda"],
    ruleset: "PERSILAT 2026 (Remaja Negeri)",
    featured: false,
    status: "open",
    description:
      "Kejohanan pemilihan bakat muda peringkat negeri Kelantan bagi mengumpulkan pesilat berpotensi tinggi dari jajahan Kota Bharu, Pasir Mas, Tumpat, Machang, Tanah Merah dan Bachok ke peringkat kebangsaan.",
    highlightPrizes: "Piala Presiden PESAKA Kelantan & Biasiswa Latihan Majlis Sukan Negeri Kelantan",
    scheduleDays: [
      {
        day: 1,
        dateLabel: "23 Julai 2026",
        title: "Timbang Berat Rasmi & Taklimat Juri",
        activities: ["Timbang berat atlet", "Pengesahan status sekolah/kelab", "Taklimat wasit"],
      },
      {
        day: 2,
        dateLabel: "24 Julai 2026",
        title: "Pusingan Awal Tanding & Seni",
        activities: ["Saringan Seni Tunggal & Ganda", "Pusingan 1 Silat Tanding"],
      },
      {
        day: 3,
        dateLabel: "25 Julai 2026",
        title: "Suku Akhir & Separuh Akhir",
        activities: ["Suku akhir Silat Tanding 3 Gelanggang", "Separuh akhir"],
      },
      {
        day: 4,
        dateLabel: "26 Julai 2026",
        title: "Pertandingan Akhir & Penutupan",
        activities: ["Pertarungan akhir semua kelas", "Upacara Penyampaian Pingat"],
      },
    ],
    weightClasses: [
      {
        category: "Remaja Putera & Puteri",
        gender: "Terbuka",
        classes: ["Kelas A (39-43kg)", "Kelas B (43-47kg)", "Kelas C (47-51kg)", "Kelas D (51-55kg)"],
      },
    ],
    contactPerson: {
      name: "Tuan Nik Rosdi bin Nik Hassan",
      role: "Setiausaha Pertandingan PESAKA Kelantan",
      phone: "+609-748 1122",
      email: "pertandingan@pesakakelantan.org",
    },
  },
  {
    id: "FX-2026-014",
    slug: "kejohanan-silat-terbuka-pendekar-mutiara-pulau-pinang-2026",
    title: "Kejohanan Silat Terbuka Antarabangsa Pendekar Mutiara Pulau Pinang 2026",
    subtitle: "Piala Ketua Menteri Pulau Pinang & Jemputan Kelab ASEAN",
    organizer: "PESAKA Negeri Pulau Pinang & Kerajaan Negeri Pulau Pinang",
    organizerLogo: "/assets/silat-logos/pertubuhan-seni-silat-lincah-malaysia.png",
    state: "Pulau Pinang",
    venue: "SPICE Arena",
    city: "Bayan Lepas",
    startDate: "2026-09-18",
    endDate: "2026-09-21",
    registrationDeadline: "2026-09-02",
    feeAmount: 90,
    feeUnit: "RM / atlet",
    totalSlots: 650,
    filledSlots: 180,
    tier: "terbuka",
    sanctionStatus: "pesaka_verified",
    sanctionRef: "PESAKA-PNG/MUTIARA/2026-09",
    ageCategories: ["pra_remaja", "remaja", "dewasa"],
    disciplines: ["tanding", "tunggal", "ganda", "regu", "solo_kreatif"],
    ruleset: "PERSILAT 2026 (Digital Scoreboard)",
    featured: true,
    status: "open",
    description:
      "Kejohanan berprestij di Pulau Pinang bertempat di SPICE Arena dengan kemudahan gelanggang antarabangsa. Menampilkan kategori lengkap Silat Tanding dan Silat Seni berirama.",
    highlightPrizes: "Piala Pusingan Pendekar Mutiara, Tunai RM30,000 & Hadiah Khas Persembahan Terbaik",
    scheduleDays: [
      {
        day: 1,
        dateLabel: "18 September 2026",
        title: "Pendaftaran & Undian Rasmi",
        activities: ["Pemeriksaan kontinjen", "Undian digital kategori", "Timbang berat pertama"],
      },
      {
        day: 2,
        dateLabel: "19 September 2026",
        title: "Pusingan Saringan Seni & Tanding",
        activities: ["Saringan Seni Tunggal & Solo Kreatif", "Pusingan awal Tanding"],
      },
      {
        day: 3,
        dateLabel: "20 September 2026",
        title: "Suku Akhir & Separuh Akhir",
        activities: ["Suku akhir dan separuh akhir semua kategori"],
      },
      {
        day: 4,
        dateLabel: "21 September 2026",
        title: "Kemuncak Akhir & Malam Mutiara",
        activities: ["Perlawanan Akhir Silat Tanding", "Malam Penghargaan Pendekar Mutiara"],
      },
    ],
    weightClasses: [
      {
        category: "Kategori Dewasa & Remaja",
        gender: "Terbuka",
        classes: ["Kelas A hingga H"],
      },
    ],
    contactPerson: {
      name: "Tuan Haji Shahrir bin Othman",
      role: "Pengarah Teknikal PESAKA Pulau Pinang",
      phone: "+604-643 8877",
      email: "info@pesakapenang.my",
    },
    posterUrl: "https://pesakapenang.my/poster-mutiara-2026.pdf",
    bulletinFileName: "Buletin_Pendekar_Mutiara_2026.pdf",
    organizerWebsite: "https://pesakapenang.my",
  },
];

export const TOURNAMENT_MONTHS = [
  { value: "ALL", label: "Semua Bulan" },
  { value: "2026-04", label: "April 2026" },
  { value: "2026-05", label: "Mei 2026" },
  { value: "2026-06", label: "Jun 2026" },
  { value: "2026-07", label: "Julai 2026" },
  { value: "2026-08", label: "Ogos 2026" },
  { value: "2026-09", label: "September 2026" },
  { value: "2026-10", label: "Oktober 2026" },
  { value: "2026-11", label: "November 2026" },
  { value: "2027-01", label: "Januari 2027" },
] as const;

/**
 * Generate a direct WhatsApp click-to-chat URL for an organizer contact
 */
export function getWhatsAppUrl(phone?: string | null, compTitle?: string | null): string {
  const safePhone = typeof phone === "string" ? phone : "";
  const safeTitle = typeof compTitle === "string" ? compTitle : "Kejohanan Silat";
  const digits = safePhone.replace(/\D/g, "");
  const formattedDigits = digits.startsWith("0") ? `6${digits}` : digits.startsWith("60") ? digits : `60${digits}`;
  const message = `Salam Urus Setia, saya ingin bertanya berkenaan pendaftaran untuk: ${safeTitle} (Rujukan FighterX)`;
  return `https://wa.me/${formattedDigits}?text=${encodeURIComponent(message)}`;
}

/**
 * Format start and end date to professional athletic calendar badge format
 */
export function formatEventDates(startDate?: string | null, endDate?: string | null): {
  days: string;
  month: string;
  year: string;
  durationLabel: string;
} {
  const s = typeof startDate === "string" ? startDate.trim() : "";
  const e = typeof endDate === "string" ? endDate.trim() : s;

  const monthsMap = [
    "JAN", "FEB", "MAC", "APR", "MEI", "JUN",
    "JUL", "OGOS", "SEPT", "OKT", "NOV", "DIS"
  ];

  const defaultResult = {
    days: s || "--",
    month: "OGOS",
    year: String(new Date().getFullYear()),
    durationLabel: "1 Hari",
  };

  if (!s) return defaultResult;

  const startParts = s.split("-").map(Number);
  if (startParts.length !== 3 || startParts.some(isNaN)) {
    return defaultResult;
  }
  const [startYear, startMonth, startDay] = startParts;

  const endParts = e.split("-").map(Number);
  const endMonth = endParts.length === 3 && !isNaN(endParts[1]) ? endParts[1] : startMonth;
  const endDay = endParts.length === 3 && !isNaN(endParts[2]) ? endParts[2] : startDay;

  const monthLabel = monthsMap[startMonth - 1] || "OGOS";
  const startDayStr = String(startDay).padStart(2, "0");
  const endDayStr = String(endDay).padStart(2, "0");

  let days = `${startDayStr} - ${endDayStr}`;
  if (startMonth !== endMonth) {
    const endMonthLabel = monthsMap[endMonth - 1] || "";
    days = `${startDayStr} ${monthLabel} - ${endDayStr} ${endMonthLabel}`;
  }

  const start = new Date(s);
  const end = new Date(e);
  let durationLabel = "1 Hari";
  if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    durationLabel = `${diffDays} Hari`;
  }

  return {
    days,
    month: monthLabel,
    year: String(startYear),
    durationLabel,
  };
}

export interface PosterOrBulletinInfo {
  type: "poster" | "bulletin";
  url: string;
  label: string;
}

/**
 * Safely validate and sanitize document URLs to ensure:
 * 1. Valid URL format.
 * 2. Secure protocol (strictly https: or http: to block dangerous javascript: or data: URIs).
 */
export function isValidDocumentUrl(rawUrl?: string | null): boolean {
  if (!rawUrl || typeof rawUrl !== "string") return false;
  const trimmed = rawUrl.trim();
  if (!trimmed) return false;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

/**
 * Resolve official competition poster or bulletin resource where available.
 * Returns a typed descriptor with direct URL, or null if tournament lacks a poster/bulletin link.
 */
export function getPosterOrBulletin(comp?: CompetitionItem | null): PosterOrBulletinInfo | null {
  if (!comp) return null;
  if (typeof comp.posterUrl === "string" && isValidDocumentUrl(comp.posterUrl)) {
    return { type: "poster", url: comp.posterUrl.trim(), label: "Poster Rasmi" };
  }
  if (typeof comp.bulletinUrl === "string" && isValidDocumentUrl(comp.bulletinUrl)) {
    return { type: "bulletin", url: comp.bulletinUrl.trim(), label: "Buletin Rasmi" };
  }
  return null;
}

/**
 * Format start and end date into clean, human-readable Malaysian date range
 * e.g., "16 – 20 April 2026" or "28 Ogos – 6 September 2026"
 */
export function formatDisplayDateRange(startDate?: string | null, endDate?: string | null): string {
  if (!startDate || typeof startDate !== "string") return "";
  const s = startDate.trim();
  const e = endDate && typeof endDate === "string" ? endDate.trim() : s;
  if (!s) return "";

  const startParts = s.split("-").map(Number);
  if (startParts.length !== 3 || startParts.some(isNaN)) {
    return s;
  }
  const [startYear, startMonth, startDay] = startParts;
  if (startMonth < 1 || startMonth > 12) {
    return s;
  }

  const months = [
    "Januari", "Februari", "Mac", "April", "Mei", "Jun",
    "Julai", "Ogos", "September", "Oktober", "November", "Disember"
  ];

  const startMonthName = months[startMonth - 1] || "";

  if (!e || s === e) {
    return `${startDay} ${startMonthName} ${startYear}`.trim();
  }

  const endParts = e.split("-").map(Number);
  if (endParts.length !== 3 || endParts.some(isNaN)) {
    return `${startDay} ${startMonthName} ${startYear}`.trim();
  }
  const [endYear, endMonth, endDay] = endParts;
  if (endMonth < 1 || endMonth > 12) {
    return `${startDay} ${startMonthName} ${startYear}`.trim();
  }
  const endMonthName = months[endMonth - 1] || "";

  if (startMonth === endMonth && startYear === endYear) {
    return `${startDay} – ${endDay} ${startMonthName} ${startYear}`;
  }
  if (startYear === endYear) {
    return `${startDay} ${startMonthName} – ${endDay} ${endMonthName} ${startYear}`;
  }
  return `${startDay} ${startMonthName} ${startYear} – ${endDay} ${endMonthName} ${endYear}`;
}




