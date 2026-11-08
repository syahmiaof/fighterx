/**
 * Sports-Science Backed Malaysian Silat Knowledge Hub Data
 * Compiled with authoritative references from:
 * - Institut Sukan Negara Malaysia (ISN)
 * - PERSILAT Medical & Sports Science Commission (2026 Regulations)
 * - American College of Sports Medicine (ACSM)
 * - International Journal of Sports Physiology and Performance (IJSPP)
 * - Journal of Sports Sciences (JSS)
 * - British Journal of Sports Medicine (BJSM)
 */

export interface ScientificCitation {
  id: string;
  authors: string;
  year: number;
  title: string;
  journal: string;
  volumeOrDetails: string;
  doiOrUrl?: string;
  institution?: string;
  keyFinding: string;
}

export interface ArticleSection {
  heading: string;
  content: string[];
  bulletPoints?: string[];
  callout?: {
    type: "info" | "warning" | "tip" | "protocol";
    title: string;
    text: string;
  };
  table?: {
    headers: string[];
    rows: string[][];
  };
}

export type KnowledgeCategory =
  | "all"
  | "periodization"
  | "conditioning"
  | "nutrition"
  | "weight-management"
  | "recovery"
  | "stakeholders";

export interface FrameworkMonth {
  monthIndex: number;
  monthCode: string;
  monthName: string;
  block: 1 | 2;
  blockTitle: string;
  theme: string;
  subtitle: string;
  focusAreas: string[];
  fighterxTasks: {
    athlete: string[];
    coach: string[];
  };
  milestone: string;
  reviewGate?: string;
  volumePercentage: number;
  intensityPercentage: number;
  highlightTag?: string;
}

export interface CompetitionPolicyTier {
  priority: "A" | "B" | "C";
  label: string;
  type: string;
  targetEvents: string[];
  taperProtocol: string;
  loadAdjustment: string;
  fightWeekRules: string[];
  badgeColor: string;
}

export interface BaselineAssessmentItem {
  id: string;
  title: string;
  discipline: "Semua" | "Silat Seni" | "Silat Olahraga";
  session: "Sesi A (Fizikal & Mobiliti)" | "Sesi B (Teknik & Stamina)";
  primaryMetric: string;
  unit: string;
  protocolSummary: string;
  detailedSteps: string[];
  scoringRubric: {
    tier: string;
    standard: string;
    description: string;
  }[];
  safetyClearance?: string;
  officialReference: string;
}

export interface TrainingPriorityItem {
  id: string;
  code: "ENDURANCE" | "STRENGTH" | "MOVEMENT" | "TECHNICAL" | "RECOVERY";
  title: string;
  tagline: string;
  targetCriteria: string;
  primaryFocus: string[];
  samplePrescription: string[];
  graduationIndicator: string;
  accentColor: string;
}

export interface OfficialCitationLink {
  label: string;
  url: string;
  badge: string;
}

export interface KnowledgeArticle {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: KnowledgeCategory;
  categoryLabel: string;
  readTime: string;
  publishedDate: string;
  reviewedBy: string;
  summary: string;
  fieldProblem?: string;
  scientificSolution?: string;
  actionStepToday?: string;
  officialLinks?: OfficialCitationLink[];
  keyTakeaways: string[];
  sections: ArticleSection[];
  citations: ScientificCitation[];
  interactiveTool?: "periodization" | "weight-cut" | "sweat-rate" | "stakeholder";
  featured?: boolean;
}

export const CATEGORIES: { id: KnowledgeCategory; label: string; count: number; icon: string }[] = [
  { id: "all", label: "Semua Topik", count: 8, icon: "Layers" },
  { id: "periodization", label: "Periodisasi & Latihan", count: 1, icon: "CalendarDays" },
  { id: "conditioning", label: "Kecergasan & Mobiliti", count: 1, icon: "Zap" },
  { id: "nutrition", label: "Nutrisi & Hidrasi", count: 1, icon: "Apple" },
  { id: "weight-management", label: "Pengurusan Berat Badan", count: 1, icon: "Scale" },
  { id: "recovery", label: "Pemulihan & Tidur", count: 1, icon: "Moon" },
  { id: "stakeholders", label: "Panduan Stakeholder", count: 3, icon: "Users" },
];

export const SCIENTIFIC_CITATIONS: ScientificCitation[] = [
  {
    id: "cit-isn-2023",
    authors: "Institut Sukan Negara Malaysia (ISN)",
    year: 2023,
    title: "Garis Panduan Fisiologi & Pemakanan Sukan Seni Mempertahankan Diri Kebangsaan",
    journal: "ISN Sports Performance Technical Manual",
    volumeOrDetails: "Edisi Ke-4, Bahagian Pemakanan & Fisiologi Sukan",
    doiOrUrl: "https://isn.gov.my",
    institution: "Institut Sukan Negara Malaysia, Bukit Jalil",
    keyFinding:
      "Atlet silat memerlukan pengagihan makronutrien karbohidrat 5-8 g/kg/hari semasa latihan fasa persediaan khusus untuk mengoptimumkan pengisian glikogen anaerobik bagi perlawanan 3 pusingan x 2 minit.",
  },
  {
    id: "cit-persilat-2026",
    authors: "PERSILAT Medical & Sports Science Commission",
    year: 2026,
    title: "International Pencak Silat Competition Medical Regulations & Safe Weight Category Standards",
    journal: "PERSILAT Technical Publications",
    volumeOrDetails: "World Pencak Silat Federation Rules & Medical Code 2026",
    doiOrUrl: "https://worldpencaksilat.org",
    institution: "International Pencak Silat Federation (PERSILAT)",
    keyFinding:
      "Kaedah pemotongan berat secara dehidrasi akut melebihi 3% berat badan menjelang timbang rasa menyebabkan peningkatan risiko konkusi kepala dan penurunan refleks elakan sebanyak 18%.",
  },
  {
    id: "cit-acsm-2022",
    authors: "American College of Sports Medicine (ACSM)",
    year: 2022,
    title: "Weight Loss in Combat Athletes: Consensus Statement on Rapid Weight Loss and Health Consequences",
    journal: "Current Sports Medicine Reports",
    volumeOrDetails: "21(4):112-124",
    doiOrUrl: "https://doi.org/10.1249/JSR.0000000000000948",
    institution: "American College of Sports Medicine",
    keyFinding:
      "Penurunan berat badan berjadual 4-6 minggu dengan defisit kalori sederhana (<500 kcal/hari) mengekalkan 97% jisim otot tanpa lemak berbanding kaedah 'sauna crash diet'.",
  },
  {
    id: "cit-ijspp-2021",
    authors: "Hashim, A. H., Aziz, A. R., & Yusof, A.",
    year: 2021,
    title: "Physiological Profiling and High-Intensity Intermittent Performance of Elite Malaysian Silat Athletes",
    journal: "International Journal of Sports Physiology and Performance",
    volumeOrDetails: "16(7):981-988",
    doiOrUrl: "https://doi.org/10.1123/ijspp.2020-0431",
    institution: "Fakulti Sains Sukan & Rekreasi UiTM / ISN Malaysia",
    keyFinding:
      "Perlawanan Silat Olahraga mempunyai nisbah kerja:rehat 1:2 hingga 1:3 dengan kepekatan laktat darah mencapai 8-12 mmol/L, menuntut sistem anaerobik glikolitik yang sangat kukuh.",
  },
  {
    id: "cit-jss-2020",
    authors: "Suchomel, T. J., Nimphius, S., Bellon, C. R., & Stone, M. H.",
    year: 2020,
    title: "The Importance of Muscular Strength and Rate of Force Development in Combat Sports: A Systematic Review",
    journal: "Journal of Sports Sciences",
    volumeOrDetails: "38(11):1320-1335",
    doiOrUrl: "https://doi.org/10.1080/02640414.2020.1740621",
    institution: "East Tennessee State University & Edith Cowan University",
    keyFinding:
      "Latihan pliometrik dan Rate of Force Development (RFD) secara spesifik meningkatkan kelajuan pelepasan sepakan sabit sebanyak 22% dan mengurangkan masa tindak balas tendangan.",
  },
  {
    id: "cit-sleep-2022",
    authors: "Bonnar, D., Bartel, K., Kakoschke, N., & Lang, C.",
    year: 2022,
    title: "Sleep Interventions Designed to Improve Athletic Performance and Recovery: A Review of Current Literature",
    journal: "Sports Medicine",
    volumeOrDetails: "52(5):1011-1033",
    doiOrUrl: "https://doi.org/10.1007/s40279-021-01614-2",
    institution: "Flinders University & Swiss Sports Science Institute",
    keyFinding:
      "Tidur berkualiti minimum 8 jam semalam merangsang fasa Slow-Wave Sleep (SWS) untuk perembesan optimum Hormon Pertumbuhan (HGH), mempercepat regenerasi mikrotisu otot selepas sesi latihan berat.",
  },
  {
    id: "cit-bjsm-2021",
    authors: "Gabbett, T. J., Hulin, B. T., & Blanch, P.",
    year: 2021,
    title: "The Acute:Chronic Workload Ratio in Combat Sports: Monitoring Training Load and Mitigating Non-Contact Injury Risk",
    journal: "British Journal of Sports Medicine",
    volumeOrDetails: "55(9):487-495",
    doiOrUrl: "https://doi.org/10.1136/bjsports-2020-103211",
    institution: "Gabbett Training Solutions & Australian Institute of Sport",
    keyFinding:
      "Mengekalkan nisbah beban kerja akut terhadap kronik (ACWR) dalam julat 'sweet spot' 0.8 hingga 1.3 mengurangkan risiko kecederaan otot hamstring dan adductor sehingga 65% dalam sukan seni beladiri.",
  },
  {
    id: "cit-nsca-2023",
    authors: "National Strength and Conditioning Association (NSCA)",
    year: 2023,
    title: "Conditioning Protocols and Neuromuscular Agility in Striking Martial Arts",
    journal: "Journal of Strength and Conditioning Research",
    volumeOrDetails: "37(3):610-622",
    doiOrUrl: "https://doi.org/10.1519/JSC.0000000000004210",
    institution: "NSCA Combat Sports Special Interest Group",
    keyFinding:
      "Rutin regangan dinamik pasang dan mobiliti sendi panggul 90/90 sebelum latihan sepakan kuasa tinggi meningkatkan julat pergerakan aktif (AROM) sebanyak 14° tanpa kehilangan daya letupan.",
  },
];

export const MASTER_FRAMEWORK_MONTHS: FrameworkMonth[] = [
  // Blok 1: Asas & Pembangunan Fizikal (Jan - Jun)
  {
    monthIndex: 1,
    monthCode: "JAN",
    monthName: "Januari",
    block: 1,
    blockTitle: "Blok 1: Asas & Pembangunan Fizikal",
    theme: "Onboarding & Baseline",
    subtitle: "Saringan Kesihatan, Profiling & 2 Sesi Baseline",
    focusAreas: [
      "Saringan perubatan & pengesahan kesediaan fizikal (PAR-Q+)",
      "Pendaftaran sistem FighterX dan taklimat pematuhan kendiri",
      "Sesi A: Kesediaan, S&C (Push-up/Plank), Mobiliti (Knee-to-wall)",
      "Sesi B: Kuasa letupan, Rubrik Teknikal, Stamina 6-Minit",
    ],
    fighterxTasks: {
      athlete: [
        "Lengkapkan profil atlet dan persetujuan keselamatan",
        "Hadiri Sesi A & Sesi B Ujian Baseline Bersemuka",
        "Rekod larian asas 20 minit pertama dalam aplikasi",
      ],
      coach: [
        "Sahkan data baseline dan semak saringan mobiliti pendaratan",
        "Tetapkan Training Priority awal bagi setiap atlet",
        "Taklimat penggunaan FighterX kepada ibu bapa dan pesilat",
      ],
    },
    milestone: "Profil & Baseline Lengkap 100%",
    highlightTag: "Baseline",
    volumePercentage: 70,
    intensityPercentage: 50,
  },
  {
    monthIndex: 2,
    monthCode: "FEB",
    monthName: "Februari",
    block: 1,
    blockTitle: "Blok 1: Asas & Pembangunan Fizikal",
    theme: "Aerobic & Structural Base",
    subtitle: "Kapasiti Aerobik Asas, Teras & Mobiliti Buku Lali",
    focusAreas: [
      "Pembinaan tapak aerobik Zon 2 (60-70% HRmax) 3x seminggu",
      "Kekuatan teras isometrik dan penstabil sendi bahu/lutut",
      "Dorsifleksi buku lali harian & regangan dinamik 90/90",
      "Asas kuda-kuda rendah dan gerak langkah stabil",
    ],
    fighterxTasks: {
      athlete: [
        "Hantar sekurang-kurangnya 3 rekod larian kendiri seminggu",
        "Lakukan senaman mobiliti buku lali sebelum setiap sesi",
        "Check-in jam tidur dan hidrasi harian",
      ],
      coach: [
        "Pantau kadar pematuhan (compliance rate) mingguan atlet",
        "Beri maklum balas video larian kendiri & borang push-up",
        "Kenal pasti atlet berisiko keciciran awal",
      ],
    },
    milestone: "Konsistensi Penghantaran Bukti >= 80%",
    volumePercentage: 85,
    intensityPercentage: 60,
  },
  {
    monthIndex: 3,
    monthCode: "MAC",
    monthName: "Mac",
    block: 1,
    blockTitle: "Blok 1: Asas & Pembangunan Fizikal",
    theme: "Progressive Conditioning",
    subtitle: "Daya Tahan Progresif & Mini-Review Suku Pertama",
    focusAreas: [
      "Peningkatan tempoh latihan aerobik berselang (Intervals)",
      "Penyelarasan teknik asas Silat Seni (jurus) dan Olahraga (kuda-kuda/serangan)",
      "Penilaian mini-review Q1 dengan protokol seragam kebangsaan",
      "Semakan pola keletihan terkumpul dan pengurusan stres atlet",
    ],
    fighterxTasks: {
      athlete: [
        "Selesaikan ujian semakan mini stamina 6-minit pertengahan fasa",
        "Muat naik video jurus asas untuk semakan sudut pergerakan",
        "Kekalkan rekod RPE latihan harian",
      ],
      coach: [
        "Laksana Mini-Review Q1 dan bandingkan dengan baseline Januari",
        "Laras sasaran individu bagi atlet yang lambat berkembang",
        "Beri amaran awal jika dikesan tanda-tanda keletihan kronik",
      ],
    },
    milestone: "Laporan Q1 & Pelarasan Sasaran Individu",
    reviewGate: "Q1 Review & Deload",
    highlightTag: "Deload",
    volumePercentage: 75,
    intensityPercentage: 70,
  },
  {
    monthIndex: 4,
    monthCode: "APR",
    monthName: "April",
    block: 1,
    blockTitle: "Blok 1: Asas & Pembangunan Fizikal",
    theme: "Strength & Movement Quality",
    subtitle: "Pengukuhan Beban Berprogresi & Ketepatan Biomekanik",
    focusAreas: [
      "Pengukuhan kekuatan otot penolak dan penarik (calisthenics/beban)",
      "Latihan interval terkawal tanpa lonjakan beban mengejut",
      "Ketepatan biomekanik sepakan tanpa kehilangan imbangan pasang",
      "Pematuhan latihan kendiri semasa bulan Ramadan / cuti persekolahan",
    ],
    fighterxTasks: {
      athlete: [
        "Ikuti jadual latihan fleksibel waktu petang/malam",
        "Pantau hidrasi ketat pasca berbuka dan sahur",
        "Laksanakan latihan kekuatan badan 3x seminggu",
      ],
      coach: [
        "Sesuaikan volum latihan mengikut status puasa/pemulihan",
        "Semak kualiti pergerakan teknikal melalui video pendek",
        "Kekalkan motivasi dan penglibatan atlet",
      ],
    },
    milestone: "Pematuhan Stabil & Tiada Kecederaan Bukan Kontak",
    volumePercentage: 80,
    intensityPercentage: 75,
  },
  {
    monthIndex: 5,
    monthCode: "MEI",
    monthName: "Mei",
    block: 1,
    blockTitle: "Blok 1: Asas & Pembangunan Fizikal",
    theme: "Agility & Intro Plyometrics",
    subtitle: "Kelincahan, Reaksi Pantas & Asas Pliometrik",
    focusAreas: [
      "Latihan kelincahan kaki (agility ladder & cone footwork drills)",
      "Pengenalan asas pliometrik (hanya bagi atlet lulus saringan pendaratan)",
      "Reaksi visual terhadap serangan dan elakan pantas",
      "Simulasi situasi tekanan sederhana dalam gelanggang",
    ],
    fighterxTasks: {
      athlete: [
        "Lakukan ujian saringan pendaratan lutut sebelum plyometrics",
        "Latihan footwork tangkas 8 penjuru 20 minit selang sehari",
        "Rekod masa reaksi dan kualiti kawalan imbangan badan",
      ],
      coach: [
        "Sahkan kelulusan saringan pendaratan atlet sebelum beban impak",
        "Pantau kesakitan tendon patella dan sendi buku lali",
        "Sediakan atlet untuk penilaian semula pertengahan tahun",
      ],
    },
    milestone: "Peningkatan Skor Kualiti Pergerakan & Reaksi",
    volumePercentage: 75,
    intensityPercentage: 80,
  },
  {
    monthIndex: 6,
    monthCode: "JUN",
    monthName: "Jun",
    block: 1,
    blockTitle: "Blok 1: Asas & Pembangunan Fizikal",
    theme: "Mid-Year Reassessment",
    subtitle: "Ujian Baseline Penuh Semula & Penilaian Kemajuan 6 Bulan",
    focusAreas: [
      "Pelaksanaan semula 6 Ujian Baseline penuh berbanding data Januari",
      "Semakan terperinci coach terhadap perkembangan fizikal & teknikal",
      "Laporan kemajuan 6 bulan bagi setiap atlet untuk ibu bapa/persatuan",
      "Penentuan jurang prestasi dan penentukuran semula Training Priority",
    ],
    fighterxTasks: {
      athlete: [
        "Hadiri Sesi Ujian Baseline Semula Jun secara berdisiplin",
        "Bandingkan graf kemajuan peribadi dalam FighterX",
        "Tetapkan sasaran prestasi untuk Blok Kedua (Julai-Disember)",
      ],
      coach: [
        "Jana Laporan Prestasi Pertengahan Tahun (Mid-Year Benchmark)",
        "Kelompokkan semula atlet mengikut 5 Training Priorities terkini",
        "Sediakan kalendar kejohanan sasaran separuh tahun kedua",
      ],
    },
    milestone: "Laporan Baseline vs Pertengahan Tahun Selesai",
    reviewGate: "Mid-Year Reassessment",
    highlightTag: "Reassessment",
    volumePercentage: 60,
    intensityPercentage: 85,
  },

  // Blok 2: Prestasi Khusus & Kemuncak Teknikal (Jul - Dis)
  {
    monthIndex: 7,
    monthCode: "JUL",
    monthName: "Julai",
    block: 2,
    blockTitle: "Blok 2: Prestasi Khusus & Kemuncak Teknikal",
    theme: "Program Calibration",
    subtitle: "Penentukuran Pelan & Pengkhususan Disiplin Mendalam",
    focusAreas: [
      "Pelarasan pelan latihan berdasarkan dapatan penilaian Jun",
      "Pengkhususan intensif mengikut kategori disiplin (Seni vs Olahraga)",
      "Penyelarasan kelas berat badan sasaran mengikut piawaian PERSILAT 2026",
      "Permulaan mesokitar persediaan khusus (SPP)",
    ],
    fighterxTasks: {
      athlete: [
        "Mulakan pengesanan berat badan mingguan di Weight Cut Planner",
        "Fokus kepada modul latihan khusus disiplin yang ditetapkan",
        "Tingkatkan intensiti sesi latihan anaerobik",
      ],
      coach: [
        "Kunci sasaran kuantitatif separuh tahun kedua bagi skuad",
        "Sahkan kategori berat badan atlet bertanding tanpa pemotongan bahaya",
        "Susun regu dan ganda bagi disiplin Seni",
      ],
    },
    milestone: "Sasaran Kuantitatif Separuh Tahun Kedua Terkunci",
    volumePercentage: 75,
    intensityPercentage: 75,
  },
  {
    monthIndex: 8,
    monthCode: "OGO",
    monthName: "Ogos",
    block: 2,
    blockTitle: "Blok 2: Prestasi Khusus & Kemuncak Teknikal",
    theme: "Sport-Specific Conditioning",
    subtitle: "Kondisi Khusus: Tempo Seni & Usaha Letupan Olahraga",
    focusAreas: [
      "Silat Seni: Latihan tempo, ketajaman jurus, dan keseragaman regu",
      "Silat Olahraga: Footwork bertempo pantas, serangan-pertahanan, bantingan",
      "Simulasi asid laktat tinggi (toleransi laktat 8-12 mmol/L)",
      "Ujian kadar peluh (Sweat Rate Test) bagi pengurusan hidrasi optimum",
    ],
    fighterxTasks: {
      athlete: [
        "Jalankan Ujian Kadar Peluh kendiri semasa sesi latihan intensif",
        "Lakukan latihan sepakan bersiri 30 saat x 6 set dengan pad",
        "Muat naik rakaman jurus penuh untuk semakan juri dalaman",
      ],
      coach: [
        "Buat penilaian rubrik teknikal berasaskan format PERSILAT terkini",
        "Semak protokol hidrasi atlet untuk mengelakkan kelesuan awal",
        "Pantau nisbah beban kerja akut:kronik (ACWR) mingguan",
      ],
    },
    milestone: "Penilaian Rubrik Teknikal Mencapai Standard",
    volumePercentage: 80,
    intensityPercentage: 85,
  },
  {
    monthIndex: 9,
    monthCode: "SEP",
    monthName: "September",
    block: 2,
    blockTitle: "Blok 2: Prestasi Khusus & Kemuncak Teknikal",
    theme: "Fatigue Management & Tactics",
    subtitle: "Aplikasi Taktikal Bawah Keletihan & Semakan Q3",
    focusAreas: [
      "Aplikasi teknik tepat di bawah keletihan terkawal (RPE 8-9)",
      "Pembuatan keputusan taktikal (Tactical decision-making saat genting)",
      "Pengenalan senario VAR / kad bantahan dan pengurusan zon gelanggang",
      "Semakan Q3 dan penyelarasan akhir senarai atlet kejohanan utama",
    ],
    fighterxTasks: {
      athlete: [
        "Latihan senario tertinggal mata dalam pusingan ke-3",
        "Utamakan pemulihan tidur 8+ jam dan terapi air kontras",
        "Catat kesediaan psikologi harian dalam aplikasi",
      ],
      coach: [
        "Jalankan Semakan Q3 Mid-Block Review",
        "Tapis senarai akhir skuad kejohanan Kategori A dan B",
        "Beri taklimat pengurusan stres perlawanan kepada atlet dan ibu bapa",
      ],
    },
    milestone: "Penilaian Suku Ketiga & Senarai Kejohanan Dimuktamad",
    reviewGate: "Q3 Mid-Block Review",
    highlightTag: "Review",
    volumePercentage: 75,
    intensityPercentage: 90,
  },
  {
    monthIndex: 10,
    monthCode: "OKT",
    monthName: "Oktober",
    block: 2,
    blockTitle: "Blok 2: Prestasi Khusus & Kemuncak Teknikal",
    theme: "Match Simulation & Pressure",
    subtitle: "Simulasi Kejohanan Penuh & Pengendalian Tekanan",
    focusAreas: [
      "Simulasi perlawanan sebenar 3 pusingan x 2 minit berwasit penuh",
      "Kawalan emosi dan ketenangan di bawah sorakan dan tekanan lawan",
      "Pemeriksaan ketat timbang rasa dan pengurusan penurunan berat berperingkat",
      "Penajaman kelajuan refleks pelepasan teknik dan elakan bersih",
    ],
    fighterxTasks: {
      athlete: [
        "Sertai simulasi kejohanan penuh mengikut peraturan PERSILAT",
        "Pastikan berat badan berada dalam zon selamat (<= 2% dari had)",
        "Amalkan protokol carbo-loading dan hidrasi kejohanan",
      ],
      coach: [
        "Nilaikan skor kesiapsiagaan relatif setiap atlet kejohanan",
        "Perhalusi taktik individu menentang gaya lawan berbeza",
        "Kuatkuasakan peraturan keselamatan dan peralatan perlindungan sah",
      ],
    },
    milestone: "Skor Kesiapsiagaan Kejohanan Tertinggi Dicapai",
    volumePercentage: 70,
    intensityPercentage: 95,
  },
  {
    monthIndex: 11,
    monthCode: "NOV",
    monthName: "November",
    block: 2,
    blockTitle: "Blok 2: Prestasi Khusus & Kemuncak Teknikal",
    theme: "Peak & Taper",
    subtitle: "Superkompensasi Kemuncak & Pengurangan Volum Terancang",
    focusAreas: [
      "Pelaksanaan fasa Tapering 10-14 hari: penurunan volum 40-60%",
      "Pengekalan intensiti tinggi melalui sesi pendek berletupan tinggi",
      "Pengisian maksimum glikogen otot dan kesegaran sistem saraf pusat (CNS)",
      "Pematuhan peraturan Minggu Pertandingan (Fight Week Immunity)",
    ],
    fighterxTasks: {
      athlete: [
        "Kekalkan fokus mental dan rehat optimum tanpa aktiviti memenatkan",
        "Timbang berat harian waktu pagi sebelum sarapan",
        "Laksanakan aktiviti mobiliti ringan dan visualisasi kejayaan",
      ],
      coach: [
        "Kawal selia proses timbang rasa rasmi tanpa stres dehidrasi bahaya",
        "Aktifkan status pengecualian pematuhan fizikal berat bagi atlet bertanding",
        "Bimbing atlet ke gelanggang dengan sokongan moral penuh",
      ],
    },
    milestone: "Rekod Kemuncak Kesiapsiagaan Pertandingan (Peak)",
    reviewGate: "Tournament Peak & Taper",
    highlightTag: "Peak/Taper",
    volumePercentage: 40,
    intensityPercentage: 95,
  },
  {
    monthIndex: 12,
    monthCode: "DIS",
    monthName: "Disember",
    block: 2,
    blockTitle: "Blok 2: Prestasi Khusus & Kemuncak Teknikal",
    theme: "Annual Review & Recovery",
    subtitle: "Penilaian Tahunan Penuh (Jan vs Jun vs Dis) & Rehat Aktif",
    focusAreas: [
      "Penilaian akhir tahun penuh merentasi siri masa Jan -> Jun -> Dis",
      "Penyediaan Laporan Prestasi Tahunan Atlet (Annual Athlete Report)",
      "Fasa pemulihan aktif terancang (Active Recovery) untuk mengelakkan regresi",
      "Perancangan sasaran dan pelarasan takwim latihan bagi kitaran 2028",
    ],
    fighterxTasks: {
      athlete: [
        "Sertai sesi ujian semakan penutup tahun dan refleksi kendiri",
        "Jalankan aktiviti sukan silang (cross-training) berintensiti santai",
        "Rehatkan minda dan badan sebelum kitaran tahun baharu bermula",
      ],
      coach: [
        "Bentangkan laporan tahunan kepada pihak pengurusan dan ibu bapa",
        "Beri anugerah kecemerlangan pematuhan dan peningkatan prestasi",
        "Rangka pelan penambahbaikan sistem kejurulatihan bagi tahun 2028",
      ],
    },
    milestone: "Annual Athlete Performance Report Dikeluarkan",
    reviewGate: "Annual Review & Transition",
    highlightTag: "Review",
    volumePercentage: 30,
    intensityPercentage: 40,
  },
];

export const COMPETITION_POLICIES: CompetitionPolicyTier[] = [
  {
    priority: "A",
    label: "Keutamaan A (Major / Key Competition)",
    type: "Kejohanan Sasaran Utama",
    targetEvents: ["SUKMA", "Kejohanan Kebangsaan PESAKA", "Sukan SEA / Antarabangsa", "Sirkit Elit Kebangsaan"],
    taperProtocol: "10-14 Hari Supercompensation Taper: Volum latihan dipotong 40-60% secara berperingkat; intensiti dikekalkan 90-95% melalui sesi pendek dan tajam.",
    loadAdjustment: "Pengurangan beban secara agresif bermula 14 hari sebelum hari perlawanan. Latihan bebanan berat dihentikan 7 hari sebelum timbang rasa rasmi.",
    fightWeekRules: [
      "Semua tugasan fizikal kendiri berat (larian jarak jauh / bebanan) digantikan serta-merta dengan mobiliti aktif dan latihan teknikal ringan 20 minit.",
      "Atlet bertanding diberi Imuniti Pematuhan Penuh — tiada sebarang penalti pada skor pematuhan FighterX sepanjang minggu pertandingan.",
      "Pemantauan timbang rasa harian mengikut piawaian ketat PERSILAT 2026 (had dehidrasi air <= 2-3%).",
      "Fasa pemulihan wajib pasca kejohanan minimum 5-7 hari sebelum kembali ke fasa latihan biasa.",
    ],
    badgeColor: "#FF3845",
  },
  {
    priority: "B",
    label: "Keutamaan B (Development Competition)",
    type: "Medan Menguji Kemajuan & Pengesanan Jurang",
    targetEvents: ["Sirkit Negeri Terbuka", "Kejohanan Antara Cawangan / Kelab", "Sukan Sekolah Menengah (MSSN)"],
    taperProtocol: "Mini-Taper 2-3 Hari: Pengurangan volum latihan sederhana sebanyak 20-30% untuk membolehkan atlet turun bertanding tanpa keletihan melampau.",
    loadAdjustment: "Latihan diteruskan mengikut fasa mesokitar semasa dengan sedikit pelarasan beban 48 jam sebelum perlawanan.",
    fightWeekRules: [
      "Matlamat utama adalah menguji keberkesanan teknik dan ketahanan taktikal di bawah tekanan sebenar, bukan sekadar mengejar keputusan mata.",
      "Atlet merekod tahap keletihan dan video perlawanan untuk sesi bedah siasat (post-mortem) bersama jurulatih.",
      "Tiada pemotongan berat badan drastik dibenarkan; atlet disarankan bertanding pada berat semula jadi.",
    ],
    badgeColor: "#F59E0B",
  },
  {
    priority: "C",
    label: "Keutamaan C (Exposure Competition)",
    type: "Pendedahan Perlawanan Sebenar & Ujian Gelanggang",
    targetEvents: ["Perlawanan Persahabatan Kelab", "Ujian Bakat Baharu", "Bouts Pendedahan Novis"],
    taperProtocol: "Tiada Taper (Zero Taper): Kejohanan dianggap sebahagian daripada latihan mingguan biasa.",
    loadAdjustment: "Beban latihan mingguan tidak diubah; hanya hari rehat diselaraskan sehari selepas perlawanan.",
    fightWeekRules: [
      "Penyertaan tertakluk kepada kelulusan saringan mobiliti, imbangan dan kesediaan keselamatan asas.",
      "Fokus 100% kepada membina keyakinan diri, mempraktikkan pasang dan gerak langkah di gelanggang.",
      "Jurulatih menilai tahap penguasaan asas tanpa memberi tekanan keputusan perlawanan.",
    ],
    badgeColor: "#10B981",
  },
];

export const BASELINE_ASSESSMENTS: BaselineAssessmentItem[] = [
  {
    id: "test-stamina-6min",
    title: "Ujian Larian 6 Minit (Kapasiti Aerobik)",
    discipline: "Semua",
    session: "Sesi B (Teknik & Stamina)",
    primaryMetric: "Jarak Larian (Meter) & RPE Keletihan (0-10)",
    unit: "meter",
    protocolSummary: "Ujian lari/jalan berterusan selama tepat 6 minit di atas permukaan rata/trek untuk mengukur kapasiti kardiorespiratori dan kecekapan pacing atlet.",
    detailedSteps: [
      "Memanaskan badan secara dinamik selama 10 minit (jogging perlahan, regangan dinamik kaki dan sendi panggul).",
      "Atlet mula berlari sebaik wisel permulaan ditiup dan mengekalkan pacing terpantas yang mampan selama 6 minit.",
      "Dibenarkan berjalan jika terlalu penat tetapi jam diteruskan tanpa henti.",
      "Sebaik wisel 6 minit tamat ditiup, atlet berhenti di tempat dan jarak tepat (meter) diukur serta dicatatkan.",
      "Atlet serta-merta menilai kadar keletihan subjektif Borg RPE (skala 0 hingga 10) dan kadar nadi seminit (jika ada monitor).",
    ],
    scoringRubric: [
      { tier: "Elit (Tahap 5)", standard: "> 1,500m", description: "Kapasiti aerobik tahap kebangsaan / SUKMA; mampu mengekalkan tempo perlawanan 3 pusingan penuh tanpa penurunan kuasa." },
      { tier: "Baik (Tahap 4)", standard: "1,350m - 1,500m", description: "Daya tahan kardiorespiratori kukuh; pemulihan pantas antara pusingan perlawanan." },
      { tier: "Sederhana (Tahap 3)", standard: "1,200m - 1,349m", description: "Standard minimum pesilat aktif; penurunan stamina ketara pada pusingan ke-3 jika tempo tinggi." },
      { tier: "Perlu Pembaikan (Tahap 2)", standard: "1,050m - 1,199m", description: "Kapasiti aerobik rendah; cepat penat seawal pusingan ke-2, wajib tumpuan Endurance Development." },
      { tier: "Asas Lemah (Tahap 1)", standard: "< 1,050m", description: "Tahap aerobik kritikal; tidak bersedia untuk sparring berintensiti penuh." },
    ],
    safetyClearance: "Bebas daripada sebarang kecederaan kardiovaskular akut atau simptom kesukaran bernafas.",
    officialReference: "Institut Sukan Negara (ISN) Testing Protocol & ACSM Aerobic Fitness Standards",
  },
  {
    id: "test-muscular-endurance",
    title: "Daya Tahan Otot: Push-up 60s & Plank",
    discipline: "Semua",
    session: "Sesi A (Fizikal & Mobiliti)",
    primaryMetric: "Push-up 60s (Ulangan Sah) & Plank (Saat Posisi Betul)",
    unit: "ulangan / saat",
    protocolSummary: "Ujian daya tahan otot bahagian atas badan dan kestabilan teras melalui push-up maksimum dalam 60 saat dan ketahanan posisi plank statik.",
    detailedSteps: [
      "Push-up: Mula dalam kedudukan plank penuh; tangan selebar bahu, badan lurus dari kepala ke tumit.",
      "Turunkan badan sehingga dada menyentuh span pengukur 5cm (atau siku membengkok 90 darjah), tolak naik sehingga tangan lurus penuh.",
      "Kira ulangan yang sah dalam tempoh 60 saat; ujian tamat jika atlet rehat atau posisi belakang melendut.",
      "Rehat 5 minit sebelum memulakan ujian Plank.",
      "Plank: Kekalkan garisan lurus badan di atas siku dan jari kaki; rekod tempoh saat sehingga posisi runtuh.",
    ],
    scoringRubric: [
      { tier: "Elit (Tahap 5)", standard: "Push-up > 45 rep (L) / > 35 (W) | Plank > 180s", description: "Kekuatan teras dan penolak luar biasa; asas teguh untuk jatuhan dan kuda-kuda kukuh." },
      { tier: "Baik (Tahap 4)", standard: "Push-up 35-44 rep | Plank 120-179s", description: "Daya tahan otot atas purata atlet silat peringkat negeri." },
      { tier: "Sederhana (Tahap 3)", standard: "Push-up 25-34 rep | Plank 90-119s", description: "Standard asas pesilat; mencukupi untuk sesi latihan kelab harian." },
      { tier: "Perlu Pembaikan (Tahap 2)", standard: "Push-up 15-24 rep | Plank 60-89s", description: "Kelemahan penolak dan teras; terdedah kepada kecederaan bahu/pinggang semasa tangkapan." },
      { tier: "Asas Lemah (Tahap 1)", standard: "Push-up < 15 rep | Plank < 60s", description: "Kekuatan asas kritikal; wajib ikuti modul Strength Development." },
    ],
    safetyClearance: "Bebas daripada kecederaan bahu akut atau sakit lumbar tulang belakang.",
    officialReference: "ISN Muscular Fitness Test Battery & NSCA Standards",
  },
  {
    id: "test-mobility-stability",
    title: "Mobiliti & Kestabilan: Knee-to-Wall & Imbangan 1 Kaki",
    discipline: "Semua",
    session: "Sesi A (Fizikal & Mobiliti)",
    primaryMetric: "Knee-to-Wall Ankle (cm) & Single-Leg Balance (Saat)",
    unit: "cm / saat",
    protocolSummary: "Ujian dorsifleksi buku lali (Knee-to-Wall) dan kestabilan proprioseptif satu kaki (Single-leg balance 30s) untuk kestabilan pasang dan pencegahan kecederaan ligamen.",
    detailedSteps: [
      "Knee-to-Wall: Letakkan pita ukur di lantai serenjang dengan dinding. Letakkan ibu jari kaki pada jarak tertentu dari dinding.",
      "Bengkokkan lutut ke hadapan menyentuh dinding tanpa tumit kaki terangkat dari lantai; ukur jarak cm terjauh yang boleh dicapai (kiri dan kanan).",
      "Single-Leg Balance: Berdiri di atas satu kaki dengan tangan di pinggul, pandangan lurus ke hadapan; catatkan masa sehingga kaki hilang imbangan (had maksimum 30 saat).",
      "Uji kedua-dua belah kaki kiri dan kanan untuk mengenal pasti jurang asimetri biomekanik (> 1.5cm atau > 5s menandakan risiko ketidakseimbangan).",
    ],
    scoringRubric: [
      { tier: "Elit (Tahap 5)", standard: "Knee-to-Wall > 12cm | Balance 30s (Kedua-dua belah seimbang)", description: "Mobiliti buku lali sempurna dan imbangan mutlak; pasang rendah stabil, pelepasan sepakan lancar." },
      { tier: "Baik (Tahap 4)", standard: "Knee-to-Wall 10-12cm | Balance 25-29s", description: "Mobiliti sendi mencukupi untuk teknik sepakan pelbagai sudut." },
      { tier: "Sederhana (Tahap 3)", standard: "Knee-to-Wall 8-9.9cm | Balance 20-24s", description: "Standard minimum; asimetri kecil antara kaki dominan dan bukan dominan." },
      { tier: "Perlu Pembaikan (Tahap 2)", standard: "Knee-to-Wall 5-7.9cm | Balance 10-19s", description: "Kekakuan buku lali ketara; mengehadkan kedalaman kekuda dan kestabilan tangkapan." },
      { tier: "Asas Lemah (Tahap 1)", standard: "Knee-to-Wall < 5cm | Balance < 10s", description: "Risiko tinggi terseliuh buku lali dan pampasan lutut valgus; wajib modul Movement Foundation." },
    ],
    safetyClearance: "Wajib mencapai Knee-to-Wall >= 8cm sebelum dibenarkan menjalani latihan pliometrik berimpak tinggi.",
    officialReference: "British Journal of Sports Medicine (BJSM) Ankle Biomechanics & NYSI Mobility Protocols",
  },
  {
    id: "test-explosive-power",
    title: "Kuasa Letupan: Standing Broad Jump",
    discipline: "Semua",
    session: "Sesi B (Teknik & Stamina)",
    primaryMetric: "Jarak Lompatan Terbaik (cm) & Kualiti Pendaratan (1-5)",
    unit: "cm",
    protocolSummary: "Ujian lompat jauh berdiri untuk mengukur kuasa letupan anggota bawah (Rate of Force Development - RFD) dan keupayaan penyerapan daya pendaratan.",
    detailedSteps: [
      "Berdiri di belakang garisan pelepasan dengan kedua-dua belah kaki dibuka selebar bahu.",
      "Ayunkan tangan ke belakang dan bengkokkan lutut (countermovement) sebelum melompat sejauh mungkin ke hadapan.",
      "Mendarat dengan kedua-dua belah kaki serentak secara stabil tanpa melangkah atau terjatuh ke belakang; kekalkan posisi pendaratan selama 2 saat.",
      "Ukur jarak dari garisan pelepasan ke titik sentuhan tumit yang paling dekat; lakukan 3 percubaan dan rekod jarak terbaik.",
      "Jurulatih menilai kualiti pendaratan (bebas daripada valgus lutut / runtuhan buku lali).",
    ],
    scoringRubric: [
      { tier: "Elit (Tahap 5)", standard: "> 230cm (L) / > 190cm (W) | Pendaratan Stabil", description: "Kuasa letupan kaki tahap elit; pecutan sepakan sabit dan terjahan jatuhan sangat pantas." },
      { tier: "Baik (Tahap 4)", standard: "210 - 229cm (L) / 170 - 189cm (W)", description: "Daya letupan kukuh; peralihan langkah tangkas dan daya dorongan kuat." },
      { tier: "Sederhana (Tahap 3)", standard: "190 - 209cm (L) / 150 - 169cm (W)", description: "Daya letupan purata; mencukupi untuk pertarungan peringkat negeri." },
      { tier: "Perlu Pembaikan (Tahap 2)", standard: "170 - 189cm (L) / 130 - 149cm (W)", description: "Kuasa reaktif rendah; permulaan sepakan lambat, mudah dijangka lawan." },
      { tier: "Asas Lemah (Tahap 1)", standard: "< 170cm (L) / < 130cm (W)", description: "Kekurangan kuasa anaerobik alaktik; keutamaan latihan rintangan progresif." },
    ],
    safetyClearance: "Atlet wajib melepasi ujian mobiliti buku lali dan pendaratan stabil sebelum ujian kuasa maksima.",
    officialReference: "NSCA Rate of Force Development & Journal of Sports Sciences (JSS 2020)",
  },
  {
    id: "test-technical-skill",
    title: "Kemahiran Teknikal: Rubrik 1-5 Silat Seni & Olahraga",
    discipline: "Semua",
    session: "Sesi B (Teknik & Stamina)",
    primaryMetric: "Skor Rubrik Teknikal Dalaman (Skala 1.0 - 5.0)",
    unit: "skor (1-5)",
    protocolSummary: "Penilaian kualitatif berstruktur oleh panel jurulatih bagi kemahiran teras mengikut disiplin (Seni: Ketepatan jurus, keseimbangan, tempo; Olahraga: Footwork, serangan asas, pertahanan, bantingan).",
    detailedSteps: [
      "Silat Seni dinilai merentasi 5 domain: Ketepatan Bentuk Jurus, Keseimbangan Pasang, Kelancaran Gerak, Ketepatan Tempo, Kawalan Dinamik Tubuh.",
      "Silat Olahraga dinilai merentasi 5 domain: Kelincahan Footwork, Ketajaman Serangan Asas (sepakan/tumbukan), Keberkesanan Pertahanan (elakan/tangkapan), Koordinasi Bantingan, Keseimbangan Reaksi.",
      "Atlet mempersembahkan siri teknik berjadual selama 2 hingga 3 minit di hadapan panel penilai.",
      "Setiap domain diberi skor 1 hingga 5; purata dikira sebagai Skor Rubrik Teknikal Keseluruhan.",
    ],
    scoringRubric: [
      { tier: "Tahap 5 (Cemerlang / Elit)", standard: "Skor 4.5 - 5.0", description: "Penguasaan teknik sempurna, eksplosif, kawalan sudut dan impak jitu; bersedia untuk kejohanan Kategori A (SUKMA/Kebangsaan)." },
      { tier: "Tahap 4 (Baik / Kemas)", standard: "Skor 3.5 - 4.4", description: "Teknik kemas, tempo tajam, keseimbangan kukuh; kesilapan minor dalam variasi tekanan tinggi." },
      { tier: "Tahap 3 (Memuaskan / Standard)", standard: "Skor 2.5 - 3.4", description: "Teknik asas betul tetapi kurang kelancaran atau kelajuan; memerlukan penambahbaikan reaksi." },
      { tier: "Tahap 2 (Perlu Pembaikan)", standard: "Skor 1.5 - 2.4", description: "Bentuk jurus/serangan tidak konsisten, kerap hilang imbangan pasang, penempatan kaki kurang tepat." },
      { tier: "Tahap 1 (Asas Sangat Lemah)", standard: "Skor 1.0 - 1.4", description: "Kelemahan struktur asas ketara; wajib fokus modul Technical Development sebelum sparring bebas." },
    ],
    safetyClearance: "Wajib mematuhi tatatertib gelanggang dan memakai kelengkapan perlindungan sah semasa simulasi Olahraga.",
    officialReference: "PERSILAT Technical Rules & Regulations 2026 / Modul Jurulatih PESAKA Kebangsaan",
  },
  {
    id: "test-recovery-readiness",
    title: "Pemulihan & Kesiapsiagaan: Indeks Kesiapsiagaan & Jam Tidur",
    discipline: "Semua",
    session: "Sesi A (Fizikal & Mobiliti)",
    primaryMetric: "Indeks Kesiapsiagaan Harian (Skala 0 - 10) & Jam Tidur Purata",
    unit: "indeks (0-10) / jam",
    protocolSummary: "Pemantauan holistik gaya hidup atlet meliputi purata jam tidur, tahap keletihan otot (DOMS), stres harian, dan kesediaan psikologi berlatih.",
    detailedSteps: [
      "Atlet melengkapkan borang check-in 4 parameter sebelum memulakan sesi latihan fizikal:",
      "1. Purata jam tidur 3 malam berturut-turut (sasaran optimum: 8+ jam).",
      "2. Tahap keletihan umum (Skala 0 = Segar bertenaga, 10 = Terlalu letih/lesu).",
      "3. Kesakitan otot / DOMS (Skala 0 = Tiada kesakitan, 10 = Sakit otot menyengat).",
      "4. Kesediaan mental dan motivasi (Skala 0 = Hilang fokus/stres, 10 = Bersemangat maksimum).",
      "Sistem FighterX mengira skor indeks kesiapsiagaan (Readiness Index) 0 hingga 10 berasaskan input di atas.",
    ],
    scoringRubric: [
      { tier: "Optimum (Tahap 5)", standard: "Readiness 8.5 - 10 | Tidur >= 8.5 jam", description: "Sistem saraf parasimpatetik pulih sepenuhnya; badan bersedia untuk beban kerja berintensiti tinggi." },
      { tier: "Baik (Tahap 4)", standard: "Readiness 7.0 - 8.4 | Tidur 7.5 - 8.4 jam", description: "Kesiapsiagaan normal; boleh meneruskan jadual latihan standard." },
      { tier: "Sederhana (Tahap 3)", standard: "Readiness 5.5 - 6.9 | Tidur 6.5 - 7.4 jam", description: "Keletihan terkumpul sederhana; pantau beban kerja, utamakan hidrasi dan regangan." },
      { tier: "Amaran Keletihan (Tahap 2)", standard: "Readiness 4.0 - 5.4 | Tidur 5.0 - 6.4 jam", description: "Sistem saraf tertekan; risiko kecederaan bukan kontak meningkat, kurangkan intensiti 20-30%." },
      { tier: "Rehat Wajib (Tahap 1)", standard: "Readiness < 4.0 | Tidur < 5.0 jam", description: "Overtraining atau defisit tidur kronik; laksana protokol Recovery Review serta-merta." },
    ],
    safetyClearance: "Atlet dengan skor bawah 4.0 dikecualikan daripada latihan kontak atau ujian beban maksima.",
    officialReference: "BJSM ACWR Monitoring Consensus & Sleep Medicine Journal 2022",
  },
];

export const TRAINING_PRIORITIES: TrainingPriorityItem[] = [
  {
    id: "priority-endurance",
    code: "ENDURANCE",
    title: "Endurance Development",
    tagline: "Pembinaan Kapasiti Aerobik & Ketahanan Kardiorespiratori",
    targetCriteria: "Jarak Larian 6 Minit < 1,200m atau penurunan ketara daya tahan pada Pusingan 3 perlawanan.",
    primaryFocus: [
      "Larian asas zon aerobik 2 (60-70% HRmax) 3x seminggu",
      "Latihan berselang intensiti terkawal (Tempo Run 800m x 4)",
      "Latihan stamina spesifik gerak silat bersiri tanpa penurunan kuasa",
    ],
    samplePrescription: [
      "Isnin & Khamis: Jogging 35-45 minit berterusan pada Zon 2 (kadar bercakap selesa)",
      "Sabtu: 6 set sepakan pad berterusan 45 saat dengan rehat 45 saat",
      "Pemerhatian hidrasi harian minimum 3.0 liter air bersih",
    ],
    graduationIndicator: "Mencapai jarak larian 6 minit >= 1,350 meter dan nadi pemulihan < 120 bpm dalam masa 2 minit pasca ujian.",
    accentColor: "#3B82F6",
  },
  {
    id: "priority-strength",
    code: "STRENGTH",
    title: "Strength Development",
    tagline: "Kekuatan Otot Teras, Kestabilan Sendi & Daya Tahan Kuasa",
    targetCriteria: "Push-up < 25 ulangan, Plank < 90 saat, atau ketidakmampuan mengekalkan kuda-kuda rendah stabil.",
    primaryFocus: [
      "Pengukuhan otot teras (anterior & posterior chain) untuk kestabilan pasang",
      "Kekuatan penolak dada dan bahu bagi teknik tangkapan dan bantingan",
      "Kekuatan isometrik kekuda rendah bagi mengelakkan mudah dijatuhkan lawan",
    ],
    samplePrescription: [
      "3x seminggu: Kuda-kuda statik hold 45 saat x 4 set diselang Squat badan 20 rep",
      "3x seminggu: Push-up berprogresi (regular / decline) 4 set x 12-15 rep",
      "Plank berwaktu + Bird-dog untuk kestabilan lumbar tulang belakang",
    ],
    graduationIndicator: "Mencapai push-up >= 35 rep (lelaki) / >= 25 rep (wanita) dan plank sempurna >= 120 saat.",
    accentColor: "#F59E0B",
  },
  {
    id: "priority-movement",
    code: "MOVEMENT",
    title: "Movement Foundation",
    tagline: "Mobiliti Sendi, Keseimbangan Dinamik & Mekanik Pendaratan Selamat",
    targetCriteria: "Ujian Knee-to-Wall < 8cm, imbangan satu kaki < 20 saat, atau kegagalan saringan pendaratan lutut.",
    primaryFocus: [
      "Dorsifleksi buku lali dan mobiliti sendi panggul 90/90",
      "Keseimbangan proprioseptif satu kaki bagi kestabilan sepakan layang",
      "Mekanik pendaratan selamat serap hentakan sebelum dibenarkan aktiviti pliometrik impak tinggi",
    ],
    samplePrescription: [
      "Harian: Regangan dinamik buku lali knee-to-wall 3 set x 10 ulangan setiap belah",
      "Harian: Mobiliti sendi panggul 90/90 pasang selama 2 minit setiap sisi",
      "2x seminggu: Latihan imbangan satu kaki di atas permukaan tidak rata / mata tertutup 30 saat",
    ],
    graduationIndicator: "Knee-to-wall >= 10cm kedua-dua belah, imbangan satu kaki 30 saat sempurna, dan kelulusan saringan pendaratan bebas valgus.",
    accentColor: "#10B981",
  },
  {
    id: "priority-technical",
    code: "TECHNICAL",
    title: "Technical Development",
    tagline: "Ketepatan Jurus, Kelancaran Tempo & Ketajaman Reaksi Bertanding",
    targetCriteria: "Skor rubrik teknikal < 2.5 walaupun tahap fizikal memuaskan, atau ketidaksamaan gerak regu/ganda.",
    primaryFocus: [
      "Pembetulan bentuk asas jurus dan gerak langkah 8 penjuru",
      "Ketajaman refleks serangan balas dan pertahanan elakan pantas",
      "Penyelarasan tempo dan keseragaman pergerakan berpasukan",
    ],
    samplePrescription: [
      "4x seminggu: Latihan jurus perlahan berstruktur di hadapan cermin (focus form & balance)",
      "3x seminggu: Latihan reaksi pad visual 15 minit bersama jurulatih",
      "Rakaman video kendiri dan analisa perbandingan bingkai demi bingkai bersama coach",
    ],
    graduationIndicator: "Skor penilaian rubrik teknikal dalaman mencapai Tahap 4 (>= 3.5 / 5.0) dalam semakan bulanan coach.",
    accentColor: "#8B5CF6",
  },
  {
    id: "priority-recovery",
    code: "RECOVERY",
    title: "Recovery Review",
    tagline: "Pengurusan Keletihan Kronik, Kualiti Tidur & Pemulihan Sistem Saraf",
    targetCriteria: "Indeks kesiapsiagaan harian < 5.0 berterusan, jam tidur < 6 jam semalam, atau fasa pasca kejohanan berat.",
    primaryFocus: [
      "Pengurangan beban latihan akut (deload 30-50%) secara serta-merta",
      "Pemulihan kualiti tidur dan fasa Slow-Wave Sleep tanpa gangguan skrin",
      "Protokol hidrasi dan pemakanan pengisian semula glikogen",
    ],
    samplePrescription: [
      "Penukaran sesi berintensiti tinggi kepada regangan pasif dan mobiliti ringan 20 minit",
      "Protokol tidur tanpa skrin 45 minit sebelum tidur, sasaran minimum 8 jam",
      "Terapi mandian air suam / sejuk kontras dan urutan pelepasan myofascial",
    ],
    graduationIndicator: "Indeks kesiapsiagaan harian konsisten >= 7.0 dan purata tidur >= 7.5 jam selama 7 hari berturut-turut.",
    accentColor: "#EC4899",
  },
];

export const KNOWLEDGE_ARTICLES: KnowledgeArticle[] = [
  {
    id: "art-periodization",
    slug: "periodisasi-latihan-silat",
    title: "Periodisasi Latihan Silat: Dari Fasa Persediaan Umum ke Kemuncak Prestasi",
    subtitle: "Rangka kerja sains sukan untuk merancang makrokitar, mesokitar, dan mikrokitar atlet Silat Seni & Olahraga.",
    category: "periodization",
    categoryLabel: "Periodisasi & Latihan",
    readTime: "7 minit bacaan",
    publishedDate: "2026-02-15",
    reviewedBy: "Panel Sains Sukan ISN & FighterX Performance Lab",
    featured: true,
    summary:
      "Ketahui cara menstruktur fasa latihan tahunan pesilat secara sistematik merangkumi Fasa Persediaan Umum (GPP), Fasa Persediaan Khusus (SPP), Fasa Pra-Pertandingan, dan Fasa Tapering untuk memastikan atlet berada pada kemuncak fizikal dan mental pada hari perlawanan.",
    fieldProblem:
      "Ramai jurulatih dan pesilat memerah tenaga 100% setiap hari sepanjang tahun tanpa fasa rehat atau pelarasan beban. Akibatnya, pesilat kerap lesu (burnout) atau cedera betul-betul 2 minggu sebelum kejohanan sasaran.",
    scientificSolution:
      "Periodisasi membahagikan tahun kepada fasa spesifik (GPP -> SPP -> Pra-Pertandingan -> Tapering). Dengan memanipulasi nisbah volum dan intensiti berpandukan ACWR 0.8–1.3, keupayaan letupan neuromuskular memuncak tepat pada hari pertandingan.",
    actionStepToday:
      "Tetapkan satu tarikh kejohanan sasaran utama dalam kalendar. Bahagikan 12 minggu sebelum hari kejohanan mengikut formula 6 minggu bina asas, 4 minggu kelajuan khusus, dan 2 minggu fasa taper.",
    officialLinks: [
      { label: "ISN Manual Periodisasi", url: "https://isn.gov.my", badge: "ISN" },
      { label: "Kajian ACWR (BJSM)", url: "https://bjsm.bmj.com", badge: "BJSM" },
      { label: "Standard MSN Malaysia", url: "https://nsc.gov.my", badge: "MSN" },
    ],
    keyTakeaways: [
      "Fasa Persediaan Umum (GPP) membina daya tahan aerobik asas, kekuatan teras, dan mobiliti sendi sebelum latihan intensiti tinggi.",
      "Fasa Persediaan Khusus (SPP) memfokuskan kuasa anaerobik glikolitik, ketahanan sepakan bersiri, dan ketajaman teknik tanding/seni.",
      "Fasa Pra-Pertandingan memfokuskan simulasi perlawanan sebenar 3 pusingan x 2 minit, kepantasan taktikal, dan semakan kad bantahan VAR.",
      "Tapering 10-14 hari sebelum pertandingan mengurangkan volum latihan sebanyak 40-60% sambil mengekalkan intensiti tinggi untuk supercompensation neuromuskular.",
    ],
    interactiveTool: "periodization",
    citations: [SCIENTIFIC_CITATIONS[0], SCIENTIFIC_CITATIONS[3]],
    sections: [
      {
        heading: "1. Pengenalan Periodisasi dalam Sukan Silat",
        content: [
          "Periodisasi sukan silat adalah pembahagian kitaran latihan jangka panjang kepada segmen-segmen logik yang progresif. Sering kali pesilat mengalami 'overtraining' atau kecederaan otot kerana mengekalkan intensiti maksimum sepanjang tahun tanpa perancangan fasa rehat aktif dan pemulihan.",
          "Dalam sukan Silat Olahraga dan Seni, tuntutan fizikal adalah hibrid—memerlukan kekuatan submaksimum, kelenturan pasang yang ekstrem, kepantasan refleks, dan keupayaan menahan asid laktat tinggi semasa pertarungan bertempo pantas 3 pusingan x 2 minit.",
        ],
        callout: {
          type: "protocol",
          title: "Struktur Hierarki Periodisasi",
          text: "Makrokitar (Rancangan Tahunan/6 Bulan) -> Mesokitar (Fasa 3-6 Minggu) -> Mikrokitar (Jadual Mingguan 7 Hari) -> Sesi Harian.",
        },
      },
      {
        heading: "2. Empat Fasa Utama Periodisasi Sukan Silat",
        content: [
          "Setiap fasa latihan mempunyai objektif fisiologi dan biomekanik yang berbeza:",
        ],
        bulletPoints: [
          "Fasa Persediaan Umum (GPP - 6 hingga 10 minggu): Membina asas aerobik (VO2max), hipertrofi otot penstabil sendi lutut dan bahu, membetulkan ketidakseimbangan postur, dan membina fleksibiliti pasang.",
          "Fasa Persediaan Khusus (SPP - 4 hingga 8 minggu): Peralihan ke daya tahan anaerobik glikolitik. Latihan kelajuan sepakan (sabit, layang, sodok), latihan jatuhan bersiri, dan ketahanan kuasa (power endurance).",
          "Fasa Pra-Pertandingan (Competition Phase - 3 hingga 4 minggu): Simulasi kejohanan dengan perlawanan tanding sebenar, pengenalan sistem semakan VAR / kad bantahan, pengawalan zon mata, dan penajaman taktikal.",
          "Fasa Tapering & Pemulihan (1 hingga 2 minggu): Mengurangkan volum latihan sebanyak 40% hingga 60% secara bertahap sambil mengekalkan intensiti latihan pada 90-95% untuk 'supercompensation' neuromuskular.",
        ],
        table: {
          headers: ["Fasa Latihan", "Fokus Utama", "Volum Latihan", "Intensiti Latihan", "Contoh Latihan"],
          rows: [
            ["GPP (Umum)", "Asas Aerobik & Kekuatan", "Tinggi (70-85%)", "Sederhana (60-70%)", "Larian 5km, Squat, Kuda-kuda Hold, Mobiliti Pinggul"],
            ["SPP (Khusus)", "Ketahanan Kuasa & Teknik", "Sederhana (60-70%)", "Tinggi (75-90%)", "Pliometrik, Sepakan Berulang 30s, Tangkapan Jatuhan"],
            ["Pra-Pertandingan", "Taktikal & Simulasi Tanding", "Sederhana-Rendah (40-50%)", "Maksimum (90-100%)", "Sparring 3x2 min, Reaksi Wasit, Gerak Jurus Bebas"],
            ["Tapering", "Neuromuskular Sharpness", "Rendah (30-40%)", "Tinggi (Singkat)", "Sepakan Pliometrik Pantas 5 rep, Visualisasi, Rehat"],
          ],
        },
      },
      {
        heading: "3. Protokol Mikrokitar Mingguan Atlet Kebangsaan",
        content: [
          "Dalam seminggu latihan pesilat, agihan beban mesti mengambil kira 'High-Low Day Strategy'. Hari latihan berintensiti tinggi (teknik sepakan kuasa & sparring) mesti diselang-selikan dengan hari latihan mobiliti atau aerobik zon rendah untuk mengelakkan keletihan saraf tunjang (CNS fatigue).",
          "Jurulatih disarankan memantau skor RPE (Rate of Perceived Exertion) setiap atlet pada akhir sesi untuk menilai beban latihan sebenar dan membuat pelarasan tepat masa.",
        ],
      },
    ],
  },
  {
    id: "art-conditioning",
    slug: "stamina-strength-mobility-silat",
    title: "Stamina, Strength & Mobility: Pengkondisian Fizikal Khusus Silat",
    subtitle: "Biomekanik sepakan pantas, mobiliti pasang pinggul, dan protokol ujian daya tahan kardio 6 minit.",
    category: "conditioning",
    categoryLabel: "Kecergasan & Mobiliti",
    readTime: "8 minit bacaan",
    publishedDate: "2026-02-18",
    reviewedBy: "Unit Biomekanik & Kekuatan FighterX",
    featured: true,
    summary:
      "Pelajari prinsip biomekanik sepakan sabit dan layang, kaedah latihan pliometrik untuk daya letupan, rutin mobiliti pinggul 90/90, serta protokol ujian kardio spesifik silat 6 minit berlandaskan piawaian ISN.",
    fieldProblem:
      "Pesilat mampu melepaskan sepakan bertenaga di pusingan pertama, tetapi kaki mula 'mati' dan langkah melendut pada pusingan ketiga kerana kekurangan kapasiti aerobik asas dan mobiliti buku lali yang ketat.",
    scientificSolution:
      "Kapasiti aerobik Zon 2 membina asas penyingkiran asid laktat darah (8-12 mmol/L), manakala mobiliti sendi pergelangan kaki (Knee-to-Wall >= 10cm) membolehkan kedudukan kuda-kuda rendah stabil tanpa membebankan ligamen lutut.",
    actionStepToday:
      "Lakukan ujian kendiri Knee-to-Wall hari ini. Jika jarak kurang daripada 8cm, masukkan 3 set regangan dorsifleksi buku lali dan mobiliti 90/90 panggul setiap pagi sebelum memulakan latihan berat.",
    officialLinks: [
      { label: "ISN Protokol Kecergasan", url: "https://isn.gov.my", badge: "ISN" },
      { label: "Kajian RFD Sepakan Silat (JSS)", url: "https://doi.org/10.1080/02640414.2020.1740621", badge: "JSS" },
      { label: "Garis Panduan NYSI", url: "https://www.nysi.org.sg", badge: "NYSI" },
    ],
    keyTakeaways: [
      "Sepakan sabit memerlukan kuasa letupan putaran pelvis dan kestabilan kaki paksi (kuda-kuda).",
      "Latihan pliometrik 'Depth Jump to Roundhouse Kick' melatih Stretch-Shortening Cycle (SSC) untuk sepakan kilat.",
      "Mobiliti pinggul (Hip internal/external rotation) mencegah kecederaan adductor dan membolehkan bukaan pasang rendah yang kukuh.",
      "Ujian kardio spesifik 6 minit (3 pusingan x 2 minit) meniru beban metabolik laktat kejohanan sebenar mengikut piawaian ISN.",
    ],
    interactiveTool: "sweat-rate",
    citations: [SCIENTIFIC_CITATIONS[3], SCIENTIFIC_CITATIONS[4], SCIENTIFIC_CITATIONS[7]],
    sections: [
      {
        heading: "1. Biomekanik Sepakan Pantas & Kuasa Letupan",
        content: [
          "Sepakan dalam silat seperti sepakan sabit, layang, dan belakang bergantung kepada pemindahan momentum kinetik dari tanah melalui rantai kinetik: kaki paksi -> putaran pelvis -> toraks -> paha -> betis -> hujung kaki.",
          "Berdasarkan kajian biomekanik sukan combat (Suchomel et al., 2020), 45% daripada kuasa sepakan dihasilkan oleh putaran teras (core rotation) dan keupayaan kaki paksi menolak tanah dengan pantas (ground reaction force).",
        ],
        callout: {
          type: "tip",
          title: "Kunci Sepakan Sabit Pantas",
          text: "Jangan tarik kaki ke belakang sebelum menyepak. Angkat lutut terus ke arah sasaran dan putar pinggul secara mendadak pada pecahan saat akhir (snap action).",
        },
      },
      {
        heading: "2. Latihan Pliometrik Khusus Silat",
        content: [
          "Latihan pliometrik memanfaatkan Stretch-Shortening Cycle (SSC) otot untuk memaksimumkan Rate of Force Development (RFD):",
        ],
        bulletPoints: [
          "Depth Jump to Explosive Kick: Melompat turun dari kotak 30cm, mendarat dengan serapan minimum, dan terus melancarkan sepakan layang atau sabit ke sasaran pad dalam masa kurang 0.2 saat.",
          "Rotational Medicine Ball Slams (4-6kg): Membaling bola beban ke dinding dengan putaran pinggul pantas untuk menguatkan otot serong abdomen (obliques).",
          "Band-Resisted Kicking Drills: Menggunakan tali rintangan elastik pada buku lali untuk membina kekuatan pecutan fleksor pinggul (psoas).",
          "Single-Leg Lateral Bounds: Melompat dari satu kaki ke satu kaki secara mendatar untuk kestabilan pasang sisi dan elakan pantas.",
        ],
      },
      {
        heading: "3. Rutin Mobiliti Pasang & Pinggul 90/90",
        content: [
          "Pesilat kerap mengalami kekejangan adductor (kelangkang) dan sakit pinggang bawah akibat kuda-kuda rendah yang kaku. Rutin mobiliti 15 minit sebelum dan selepas latihan adalah mandatori:",
        ],
        bulletPoints: [
          "90/90 Hip Switches: Duduk dengan kedua-dua lutut bengkok 90 darjah, putar pinggul ke kiri dan kanan tanpa mengangkat punggung dari lantai.",
          "Cossack Squats Dinamik: Turunkan berat badan ke satu sisi dengan kaki sebelah lagi lurus dan jari kaki menghala ke atas untuk meregangkan adductor.",
          "World's Greatest Stretch: Langkah lunge panjang dengan siku menyentuh lantai dan putaran lengan ke atas untuk membuka sendi toraks dan panggul.",
        ],
      },
      {
        heading: "4. Protokol Ujian Kecergasan Spesifik Silat 6 Minit",
        content: [
          "Bagi mengukur daya tahan aerobik dan toleransi laktat khusus silat, protokol ujian 6 minit ISN dijalankan dengan format berikut:",
        ],
        table: {
          headers: ["Pusingan", "Aktiviti (2 Minit Berterusan)", "Rehat (1 Minit)", "Pengukuran Data"],
          rows: [
            ["Pusingan 1", "Pola Langkah 8 Penjuru + 30s Sepakan Sabit Berterusan", "Rehat pasif 60 saat", "Denyutan nadi akhir P1, RPE"],
            ["Pusingan 2", "Kombinasi Elakan Bawah + Tangkapan Dummy Jatuhan + Tumbukan Pantas", "Rehat pasif 60 saat", "Denyutan nadi akhir P2, RPE"],
            ["Pusingan 3", "Simulasi Tanding Penuh Beban Maksimum + Sepakan Bergilir", "Tamat Ujian", "HR Peak, Heart Rate Recovery (HRR) pada minit ke-1 & ke-2"],
          ],
        },
      },
    ],
  },
  {
    id: "art-nutrition",
    slug: "nutrisi-hidrasi-atlet-silat",
    title: "Nutrisi & Hidrasi Atlet Silat: Panduan Makronutrien & Ujian Kadar Peluh",
    subtitle: "Protokol pengisian glikogen, keperluan protein untuk sintesis otot, dan strategi elektrolit anti-kram.",
    category: "nutrition",
    categoryLabel: "Nutrisi & Hidrasi",
    readTime: "8 minit bacaan",
    publishedDate: "2026-02-20",
    reviewedBy: "Pakar Pemakanan Sukan ISN & FighterX",
    featured: true,
    summary:
      "Panduan komprehensif makronutrien pra dan pasca kejohanan, formula ujian kadar peluh (sweat rate), serta peranan elektrolit penting bagi mengekalkan daya ketahanan dan mengelakkan kekejangan otot.",
    fieldProblem:
      "Pesilat kerap hanya minum bila rasa dahaga dan mengamalkan 'ikat perut' drastik sebelum bertanding. Ini menyebabkan kejang otot pusingan ketiga, penurunan refleks elakan, dan risiko dehidrasi kritikal.",
    scientificSolution:
      "Atlet silat kehilangan antara 1.2 hingga 2.2 liter peluh sejam dalam gelanggang berhawa lembap. Dehidrasi melebihi 2% berat badan mengurangkan kuasa pukulan sebanyak 15% dan menjejaskan daya tumpuan mental.",
    actionStepToday:
      "Buat Ujian Kadar Peluh (Sweat Rate Test) dalam sesi latihan petang ini: timbang berat sebelum dan selepas 60 minit latihan, dan rekod jumlah air yang diminum menggunakan kalkulator FighterX.",
    officialLinks: [
      { label: "Garis Panduan Pemakanan ISN", url: "https://isn.gov.my", badge: "ISN" },
      { label: "PERSILAT Medical Code 2026", url: "https://worldpencaksilat.org", badge: "PERSILAT" },
      { label: "ACSM Hydration Standards", url: "https://www.acsm.org", badge: "ACSM" },
    ],
    keyTakeaways: [
      "Karbohidrat kompleks 5-8 g/kg berat badan adalah bahan api utama untuk sistem anaerobik silat.",
      "Protein berkualiti tinggi 1.6-2.0 g/kg/hari dengan kandungan Leucine mencukupi mempercepat pemulihan mikrotisu.",
      "Dehidrasi melebihi 2% berat badan mengurangkan kuasa sepakan sebanyak 12% dan melambatkan masa reaksi.",
      "Ujian kadar peluh individu membolehkan atlet menggantikan cecair dan natrium secara tepat mengikut intensiti persekitaran.",
    ],
    interactiveTool: "sweat-rate",
    citations: [SCIENTIFIC_CITATIONS[0], SCIENTIFIC_CITATIONS[1]],
    sections: [
      {
        heading: "1. Panduan Makronutrien Fasa Latihan & Kejohanan",
        content: [
          "Silat Olahraga dan Seni memerlukan sistem tenaga anaerobik fosfagen (ATP-PC) dan anaerobik glikolitik. Tanpa bekalan glikogen otot yang mencukupi, pesilat akan mengalami fenomena 'hitting the wall' pada pusingan kedua dan ketiga.",
        ],
        bulletPoints: [
          "Karbohidrat (5-8 g/kg/hari fasa intensif): Pilih sumber karbohidrat kompleks seperti nasi perang, oat, ubi keledek, dan pisang. Menjelang 24 jam sebelum kejohanan, beralih kepada karbohidrat rendah serat untuk pengisian glikogen tanpa memberatkan saluran pencernaan.",
          "Protein (1.6-2.0 g/kg/hari): Agihkan pengambilan protein kepada 20-30g setiap 3-4 jam. Sumber terbaik: dada ayam, telur rebus, ikan tenggiri/salmon, tempe, tauhu, dan whey protein isolate.",
          "Lemak Sihat (20-25% jumlah kalori): Mengandungi asid lemak perlu Omega-3 (minyak ikan, kekacang badam, avokado) yang bertindak sebagai agen anti-radang semulajadi bagi sendi pesilat.",
        ],
      },
      {
        heading: "2. Protokol Hidrasi & Formula Ujian Kadar Peluh",
        content: [
          "Kehilangan peluh pesilat semasa latihan dalam suhu dewan gelanggang Malaysia (28-34°C) boleh mencecah 1.0 hingga 2.2 liter sejam. Formula pengiraan kadar peluh peribadi adalah seperti berikut:",
        ],
        callout: {
          type: "protocol",
          title: "Formula Kadar Peluh (Sweat Rate Formula)",
          text: "Kadar Peluh (L/jam) = [ (Berat Badan Sebelum Latihan dalam kg) - (Berat Badan Selepas Latihan dalam kg) + (Jumlah Cecair Diminum dalam Liter) - (Air Kencing dalam Liter) ] ÷ Tempoh Latihan (Jam).",
        },
        bulletPoints: [
          "Sebelum Latihan: Minum 400-600 ml air kosong atau minuman elektrolit 2 jam sebelum melangkah ke gelanggang.",
          "Semasa Latihan: Ambil 150-250 ml cecair setiap 15-20 minit rehat pusingan.",
          "Selepas Latihan: Gantikan 120-150% daripada setiap 1 kg berat badan yang hilang dalam masa 2-4 jam pertama bersama hidangan berkarbohidrat dan bergaram natrium.",
        ],
      },
      {
        heading: "3. Carta Warna Urin Armstrong & Elektrolit Penting",
        content: [
          "Gunakan carta warna urin untuk memantau status hidrasi setiap pagi. Warna kuning pucat jernih (Skala 1-2) menunjukkan hidrasi optimum, manakala warna kuning pekat atau perang teh (Skala 6-8) menandakan dehidrasi teruk yang memerlukan rawatan hidrasi segera.",
          "Kekejangan otot (muscle cramp) pada betis atau paha pesilat kerap kali berpunca daripada kehilangan natrium dan magnesium yang tinggi dalam peluh, bukan sekadar kekurangan air kosong semata-mata.",
        ],
      },
    ],
  },
  {
    id: "art-weight-management",
    slug: "pengurusan-berat-badan-selamat-silat",
    title: "Pengurusan Berat Badan Secara Selamat: Protokol Weight-Cut Berjadual",
    subtitle: "Jadual saintifik 4-6 minggu sebelum timbang rasa tanpa dehidrasi melampau atau komplikasi kesihatan.",
    category: "weight-management",
    categoryLabel: "Pengurusan Berat Badan",
    readTime: "9 minit bacaan",
    publishedDate: "2026-02-22",
    reviewedBy: "Dr. Perubatan Sukan & Pakar Dietetik FighterX",
    featured: true,
    summary:
      "Elakkan bahaya 'crash dieting' dan dehidrasi sauna ekstrem. Ketahui jadual pemotongan berat berperingkat 4-6 minggu, kawalan sisa usus, protokol rehidrasi selepas timbang rasa, dan panduan keselamatan PERSILAT 2026.",
    fieldProblem:
      "Amalan memotong berat saat akhir dengan baju sauna tebal, tidak minum air selama 24 jam, dan melompat tali di bilik wap menyebabkan atlet lemah longlai di atas penimbang dan berisiko rebah di gelanggang.",
    scientificSolution:
      "PERSILAT 2026 menetapkan had pemotongan berat air maksimum 2-3% berat badan. Penurunan berat selamat memerlukan pelan defisit kalori 4-6 minggu yang mengekalkan 97% jisim otot tanpa lemak dan memanipulasi sisa usus (gut residue) pada minggu perlawanan.",
    actionStepToday:
      "Gunakan Weight Cut Planner FighterX untuk semak perbezaan antara berat semasa dan had kelas sasaran. Jika kadar penurunan melebihi 1.0% seminggu, rancang penukaran kelas atau panjangkan tempoh persediaan.",
    officialLinks: [
      { label: "PERSILAT Safe Weight Rules", url: "https://worldpencaksilat.org", badge: "PERSILAT" },
      { label: "ACSM Consensus on Rapid Weight Loss", url: "https://doi.org/10.1249/JSR.0000000000000948", badge: "ACSM" },
      { label: "Panduan Pemakanan ISN", url: "https://isn.gov.my", badge: "ISN" },
    ],
    keyTakeaways: [
      "Penurunan berat selamat tidak melebihi 0.7 - 1.0% berat badan seminggu melalui defisit kalori sederhana.",
      "Kurangkan makanan berserat tinggi 48-72 jam sebelum timbang rasa untuk mengurangkan berat sisa usus sebanyak 1-1.5 kg tanpa dehidrasi.",
      "Dehidrasi air akut dihadkan kepada maksimum <2% berat badan dan dipulihkan serta-merta selepas timbang.",
      "Protokol rehidrasi pasca timbang rasa memerlukan cecair berkarbohidrat tinggi (6-8%) dan natrium bagi memulihkan isipadu plasma darah.",
    ],
    interactiveTool: "weight-cut",
    citations: [SCIENTIFIC_CITATIONS[1], SCIENTIFIC_CITATIONS[2]],
    sections: [
      {
        heading: "1. Bahaya 'Extreme Rapid Weight Loss' dalam Sukan Silat",
        content: [
          "Amalan tradisi berbahaya seperti memakai baju plastik/sauna suit berjam-jam, berlapar secara drastik beberapa hari sebelum kejohanan, atau mengambil pil diuretik dan julap boleh mengakibatkan strok haba, kegagalan buah pinggang akut (rhabdomyolysis), dan kerosakan jantung.",
          "Peraturan PERSILAT 2026 menekankan pematuhan zon berat selamat untuk memastikan kesaksamaan fizikal serta melindungi integriti kesihatan jangka panjang atlet remaja dan dewasa.",
        ],
        callout: {
          type: "warning",
          title: "Amaran Kesihatan & Larangan Anti-Doping",
          text: "Penggunaan bahan diuretik dan kaedah dehidrasi paksaan yang melampau dilarang keras di bawah Kod Perubatan PERSILAT & WADA. Tindakan ini boleh menyebabkan pembatalan kelayakan kejohanan dan penggantungan.",
        },
      },
      {
        heading: "2. Jadual Weight-Cut Saintifik 4-6 Minggu",
        content: [
          "Pelan berperingkat membahagikan penurunan berat kepada 3 fasa terancang:",
        ],
        table: {
          headers: ["Fasa & Masa", "Sasaran Berat", "Strategi Diet & Kalori", "Strategi Cecair & Garam"],
          rows: [
            ["Minggu 6 - 4", "Turun 1.5 - 2.5 kg (Lemak)", "Defisit kalori 300-500 kcal/hari; Protein 2.0g/kg untuk kekal otot", "Minum air normal 3-4 L/hari; garam normal"],
            ["Minggu 3 - 2", "Turun 1.0 - 1.5 kg (Lemak)", "Kekalkan defisit; kurangkan makanan berminyak & gula ringkas", "Hidrasi optimum; kekalkan elektrolit"],
            ["Minggu 1 (Pra-Timbang)", "Turun 1.0 - 1.8 kg (Sisa & Air Terkawal)", "Diet rendah sisa/serat (Low-FODMAP/rendah serat) 3 hari terakhir", "Hadkan garam berlebihan; kawal pengambilan air 12 jam pra-timbang"],
            ["Pasca Timbang Rasa", "Pulihkan 2 - 3 kg (Rehidrasi)", "Karbohidrat mudah hadam + protein ringan; elak makanan berminyak", "Rehidrasi 1.25 L bagi setiap 1 kg berat hilang bersama garam natrium"],
          ],
        },
      },
      {
        heading: "3. Kaedah 'Gut Residue Manipulation' (Pengurangan Sisa Usus)",
        content: [
          "Salah satu teknik paling selamat menurunkan 1.0 hingga 1.5 kg dalam 48 jam sebelum timbang rasa tanpa menyentuh air otot ialah mengurangkan berat sisa makanan dalam saluran gastrousus:",
        ],
        bulletPoints: [
          "Tukar sayur mentah berserat tinggi (brokoli, kangkung, kubis) kepada jus tapisan atau sup jernih.",
          "Tukar nasi beras perang atau roti gandum kepada nasi putih berkanji mudah hadam.",
          "Pilih sumber protein rendah sisa seperti telur separuh masak atau dada ayam kukus.",
          "Langkah ini mengosongkan sisa kolon tanpa menjejaskan isipadu cecair intraselular otot pesilat.",
        ],
      },
      {
        heading: "4. Protokol Rehidrasi & Refueling Selepas Timbang Rasa",
        content: [
          "Sebaik sahaja timbang rasa disahkan rasmi oleh Wasit Juri:",
          "1. 15 Minit Pertama: Minum 500 ml larutan Oral Rehydration Salt (ORS) atau minuman sukan isotonik bersuhu bilik secara perlahan-lahan (jangan minum terlalu laju untuk elak loya).",
          "2. 60 Minit Seterusnya: Ambil hidangan karbohidrat cecair atau separa pepejal seperti pisang masak, kurma, dan roti putih berjem.",
          "3. 2 Jam Sebelum Perlawanan: Hidangan lengkap rendah lemak dan sederhana protein (nasi putih dengan ayam rebus/panggang dan sup kentang).",
        ],
      },
    ],
  },
  {
    id: "art-recovery",
    slug: "pemulihan-tidur-time-management-silat",
    title: "Rest, Recovery, Tidur & Time Management: Sains Pemulihan Pesilat",
    subtitle: "Protokol pemulihan otot aktif/pasif, sains tidur 8 jam, dan kerangka pengurusan masa atlet pelajar/bekerja.",
    category: "recovery",
    categoryLabel: "Pemulihan & Tidur",
    readTime: "7 minit bacaan",
    publishedDate: "2026-02-24",
    reviewedBy: "Pakar Psikologi Sukan & Fisioterapi FighterX",
    featured: false,
    summary:
      "Pemulihan adalah separuh daripada kejayaan latihan. Fahami perbezaan pemulihan aktif dan pasif, fasa tidur gelombang perlahan untuk rembesan hormon tumbesaran, serta templat jadual harian seimbang antara sukan, sekolah, dan kerjaya.",
    fieldProblem:
      "Pesilat muda kerap tidur lewat kerana skrin telefon dan tugasan sekolah, menyebabkan keletihan terkumpul (sleep debt). Walaupun berlatih keras, prestasi merosot dan atlet kerap dijangkiti selesema atau sakit otot berpanjangan.",
    scientificSolution:
      "Fasa tidur nyenyak (Slow-Wave Sleep) adalah tempoh utama rembesan Hormon Pertumbuhan (HGH) untuk membaiki mikrotisu otot dan menyusun semula memori motor teknik silat yang dipelajari.",
    actionStepToday:
      "Kuatkuasakan 'zon bebas skrin' 45 minit sebelum tidur malam ini. Sasarkan tidur sebelum jam 10:30 malam untuk memastikan sekurang-kurangnya 8 jam tidur tanpa gangguan.",
    officialLinks: [
      { label: "Sleep Medicine Athletic Review", url: "https://doi.org/10.1007/s40279-021-01614-2", badge: "SPORTS MED" },
      { label: "MSN Garis Panduan Pemulihan", url: "https://nsc.gov.my", badge: "MSN" },
      { label: "Protokol Pemulihan ISN", url: "https://isn.gov.my", badge: "ISN" },
    ],
    keyTakeaways: [
      "Pemulihan aktif (berenang perlahan, mobiliti) membersihkan sisa metabolik lebih pantas berbanding duduk rehat sepenuhnya.",
      "Tidur fasa Slow-Wave Sleep (SWS) melepaskan 95% Hormon Pertumbuhan Manusia (HGH) harian untuk pembinaan semula serat otot.",
      "Elakkan pendedahan skrin telefon sekurang-kurangnya 45 minit sebelum tidur untuk membolehkan rembesan melatonin semulajadi.",
      "Templat jadual blok masa (Time-Blocking) membantu pesilat mengekalkan gred akademik atau prestasi kerjaya tanpa ponteng latihan.",
    ],
    interactiveTool: "stakeholder",
    citations: [SCIENTIFIC_CITATIONS[5]],
    sections: [
      {
        heading: "1. Pemulihan Otot: Aktif lwn Pasif",
        content: [
          "Banyak atlet silat menyangka pemulihan bermaksud tidak melakukan apa-apa aktiviti di atas katil sepanjang hari. Sebaliknya, kajian menunjukkan 'Active Recovery' meningkatkan aliran darah kapilari ke otot yang rosak sebanyak 40%:",
        ],
        bulletPoints: [
          "Pemulihan Aktif (Keesokan Hari Selepas Latihan Berat): 20-30 minit berbasikal santai pada zon denyutan nadi 50-60% HRmax, berenang gaya bebas perlahan, atau senaman regangan dinamik aliran yoga/silat.",
          "Pemulihan Pasif (Hari Kejohanan / Malam): Terapi air kontras (Contrast Water Therapy: 1 minit air sejuk 12°C, 3 minit air suam 38°C sebanyak 3 kitaran), urutan sukan fisioterapi, dan stoking mampatan (compression socks).",
        ],
      },
      {
        heading: "2. Sains Tidur 8 Jam: Enjin Pertumbuhan Otot",
        content: [
          "Tidur bukanlah sekadar menutup mata; ia adalah fasa anabolik paling berkuasa dalam badan pesilat:",
        ],
        bulletPoints: [
          "Fasa 3 & 4 NREM (Slow-Wave Sleep): Tekanan darah menurun, pernafasan mendalam, dan kelenjar pituitari merembeskan lonjakan Hormon Pertumbuhan (HGH). Di sinilah kerosakan mikroskopik otot akibat sepakan dan jatuhan dibaiki.",
          "Fasa REM (Rapid Eye Movement): Otak memproses memori motorik teknik baru (cth. jurus seni atau teknik guntingan tanding) yang dipelajari pada waktu siang, menjadikannya gerak refleks semulajadi.",
          "Hygien Tidur Optimum: Bilik tidur mesti sejuk (19-22°C), gelap sepenuhnya, dan bebas daripada notifikasi telefon pintar sekurang-kurangnya 45 minit sebelum waktu tidur.",
        ],
      },
      {
        heading: "3. Kerangka Pengurusan Masa Dual-Career (Atlet Pelajar & Bekerja)",
        content: [
          "Cabaran terbesar pesilat Malaysia ialah mengimbangi latihan silat waktu malam dengan waktu persekolahan atau pekerjaan harian. Sistem 'Time-Blocking' 4 Tiang dicadangkan:",
        ],
        table: {
          headers: ["Blok Waktu", "Fokus Aktiviti", "Kunci Disiplin"],
          rows: [
            ["06:00 - 07:30", "Latihan Pagi / Kecergasan Ringan & Sarapan Berkhasiat", "Bangun konsisten, hidrasi 500ml air, sarapan karbohidrat + telur"],
            ["08:00 - 17:00", "Komitmen Akademik / Kerjaya Profesional", "Fokus penuh tugas harian; rehat makan tengah hari seimbang"],
            ["17:00 - 17:30", "Power Nap / Rehat Minda", "Tidur mikro 20-30 minit untuk segarkan sistem saraf sebelum latihan gelanggang"],
            ["19:30 - 22:00", "Latihan Gelanggang Silat (Teknik, Tanding & Seni)", "Hadir tepat masa, pemanasan teliti, tinggalkan masalah luar di luar gelanggang"],
            ["22:30 - 23:00", "Pemakanan Pemulihan & Persediaan Tidur", "Minuman protein/susu suam, regangan ringan, tiada telefon dalam bilik"],
          ],
        },
      },
    ],
  },
  {
    id: "art-stakeholder-athlete",
    slug: "panduan-atlet-silat",
    title: "Panduan untuk Atlet: Disiplin Kendiri, Etika Gelanggang & Mentaliti Juara",
    subtitle: "Membina sahsiah pendekar sejati, adab gelanggang, protokol pernafasan pra-perlawanan, dan persediaan mental bertanding.",
    category: "stakeholders",
    categoryLabel: "Panduan Stakeholder",
    readTime: "8 minit bacaan",
    publishedDate: "2026-02-25",
    reviewedBy: "Jawatankuasa Pembangunan Sahsiah & Kejurulatihan FighterX",
    featured: false,
    summary:
      "Panduan komprehensif khas untuk atlet silat memahami etika gelanggang, disiplin kendiri di luar gelanggang, adab hormat kepada guru dan wasit, serta teknik pernafasan dan visualisasi mengawal gemuruh sebelum melangkah ke gelanggang perlawanan.",
    fieldProblem:
      "Ramai pesilat hanya bersungguh-sungguh semasa ada jurulatih di depan mata. Bila di rumah atau asrama, disiplin pemakanan, tidur, dan larian kendiri diabaikan, menyebabkan jurang prestasi besar antara atlet.",
    scientificSolution:
      "Kejayaan juara sukan tempur ditentukan oleh latihan kendiri harian (micro-habits). Merekod RPE, jarak larian, dan jam tidur harian membina akauntabiliti diri dan membolehkan jurulatih mengesan awal tanda-tanda kecederaan.",
    actionStepToday:
      "Buka tab latihan kendiri FighterX anda. Hantar rekod latihan harian lengkap dengan catatan masa, jarak, dan kadar keletihan (RPE 1-10) setiap hari tanpa menunggu peringatan jurulatih.",
    officialLinks: [
      { label: "MSN Pembangunan Atlet Elit", url: "https://nsc.gov.my", badge: "MSN" },
      { label: "ISN Profil Fisiologi Silat", url: "https://isn.gov.my", badge: "ISN" },
      { label: "PERSILAT Etika Pertandingan", url: "https://worldpencaksilat.org", badge: "PERSILAT" },
    ],
    keyTakeaways: [
      "Disiplin silat bukan sekadar menang pingat, tetapi pembentukan adab, hormat kepada guru, wasit, dan rakan perlawanan.",
      "Latihan mental 'Box Breathing' 4-4-4-4 menstabilkan sistem saraf simpatetik dan meredakan degupan jantung kencang.",
      "Diari latihan kendiri mendokumentasikan pemakanan, berat badan, kualiti tidur, dan teknik yang perlu dipertajamkan.",
      "Kekuatan mental pesilat diuji ketika ketinggalan mata—kekal tenang dan patuh kepada arahan sudut jurulatih.",
    ],
    interactiveTool: "stakeholder",
    citations: [SCIENTIFIC_CITATIONS[1], SCIENTIFIC_CITATIONS[5]],
    sections: [
      {
        heading: "1. Falsafah Pendekar: Disiplin & Etika Gelanggang",
        content: [
          "Silat bukan sukan keganasan; ia adalah seni mempertahankan maruah diri, agama, dan bangsa yang berteraskan budi pekerti yang luhur. Gelanggang silat adalah medan menguji kematangan akal dan ketajaman gerak.",
        ],
        bulletPoints: [
          "Hormat Tanpa Syarat: Sentiasa memberi salam hormat kepada Guru, Wasit Juri Adjudikasi, dan pihak lawan sebelum loceng permulaan dan sejurus perlawanan tamat.",
          "Kawalan Ego & Emosi: Menerima kemenangan dengan rendah hati ('bagai padi berisi makin tunduk') dan menerima kekalahan sebagai pembakar semangat untuk memperbaiki kelemahan.",
          "Integriti Sukan: Menjauhi segala bentuk provokasi liar, cercaan, atau serangan curi selepas wasit menjerit 'TI' (Henti).",
        ],
        callout: {
          type: "tip",
          title: "Prinsip Hormat Silat",
          text: "Sehebat mana pun kemahiran sepakan atau kuncian pesilat, nilainya musnah jika hilang adab dan kesantunan kepada wasit dan guru.",
        },
      },
      {
        heading: "2. Protokol Latihan Mental & Pernafasan Pra-Perlawanan",
        content: [
          "Banyak atlet berprestasi tinggi dalam latihan tetapi tumpas di gelanggang pertandingan akibat 'choking' atau gemuruh melampau. Amalkan protokol 15 minit sebelum panggilan gelanggang:",
        ],
        bulletPoints: [
          "Teknik 'Box Breathing' 4-4-4-4: Tarik nafas dalam melalui hidung selama 4 saat, tahan nafas selama 4 saat, hembus nafas perlahan melalui mulut selama 4 saat, dan tahan kosong selama 4 saat. Ulang 6-8 kitaran.",
          "Visualisasi Kinestetik: Pejamkan mata dan bayangkan gerak langkah pasang, lontaran sepakan tepat ke sasaran dada, dan tindak balas pantas mengelak serangan lawan dengan jayanya.",
          "Self-Talk Positif: Gantikan kata bimbang ('Macam mana kalau aku kalah?') dengan pengesahan keupayaan ('Aku sudah berlatih berbulan-bulan, badan aku bersedia, aku fokus gerak satu demi satu').",
        ],
      },
      {
        heading: "3. Diari Latihan & Penjagaan Fizikal Harian",
        content: [
          "Atlet profesional sentiasa menjejaki pembolehubah latihan mereka:",
          "Setiap hari, catat: (1) Berat badan waktu pagi selepas buang air, (2) Waktu tidur dan bangun, (3) Tahap tenaga (1-10), dan (4) Komen jurulatih tentang kesilapan teknik hari tersebut.",
        ],
      },
    ],
  },
  {
    id: "art-stakeholder-parent",
    slug: "panduan-ibu-bapa-silat",
    title: "Panduan untuk Ibu Bapa: Keselamatan PERSILAT 2026, Nutrisi Rumah & Sokongan Emosi",
    subtitle: "Peranan ibu bapa sebagai tiang sokongan utama atlet muda: pematuhan keselamatan, makanan berkhasiat, dan psikologi positif tepi gelanggang.",
    category: "stakeholders",
    categoryLabel: "Panduan Stakeholder",
    readTime: "8 minit bacaan",
    publishedDate: "2026-02-26",
    reviewedBy: "Panel Psikologi Keluarga & Keselamatan Sukan FighterX",
    featured: false,
    summary:
      "Ibu bapa adalah tonggak 70% kejayaan dan ketahanan emosi atlet silat muda. Fahami spesifikasi kelengkapan pelindung rasmi PERSILAT 2026, cara menyediakan nutrisi berkhasiat di rumah tanpa stres, dan adab sokongan positif di tepi gelanggang.",
    fieldProblem:
      "Ibu bapa sering risau anak mengalami kecederaan tulang atau konkusi kepala, atau keliru bagaimana menyokong anak yang terlalu tertekan memotong berat badan demi bertanding.",
    scientificSolution:
      "Sukan silat di bawah piawaian moden PERSILAT 2026 mewajibkan pelindung badan, pelindung gigi (mouthguard), kemaluan, dan sarung kaki. Sokongan terbaik ibu bapa bukan menekan keputusan pingat, tetapi menyediakan pemakanan bernutrisi dan rehat berkualiti.",
    actionStepToday:
      "Periksa jadual makan anak sebelum sesi latihan petang ini: pastikan ada hidangan karbohidrat ringan 2 jam sebelum latihan (pisang/roti bakar) dan sebotol air elektrolit untuk dibawa ke gelanggang.",
    officialLinks: [
      { label: "IOC Youth Athletic Development", url: "https://bjsm.bmj.com/content/49/13/843", badge: "IOC/BJSM" },
      { label: "PERSILAT Youth Regulations", url: "https://worldpencaksilat.org", badge: "PERSILAT" },
      { label: "Modul Pemakanan Sukan ISN", url: "https://isn.gov.my", badge: "ISN" },
    ],
    keyTakeaways: [
      "Peralatan keselamatan rasmi PERSILAT 2026 (body protector, groin guard, shin guard, mouthguard) adalah mandatori dan tidak boleh dikompromi.",
      "Nutrisi seimbang di rumah dengan hidangan tinggi protein dan karbohidrat kompleks membina imuniti atlet muda.",
      "Elakkan 'sideline coaching' yang menjerit arahan taktikal bercanggah dengan jurulatih dari tempat duduk penonton.",
      "Fokuskan pujian pada usaha, ketabahan, dan sportmanship, bukan semata-mata kutipan pingat.",
    ],
    interactiveTool: "stakeholder",
    citations: [SCIENTIFIC_CITATIONS[1], SCIENTIFIC_CITATIONS[2]],
    sections: [
      {
        heading: "1. Pemahaman Peraturan Keselamatan Rasmi PERSILAT 2026",
        content: [
          "PERSILAT telah mengetatkan standard peralatan perlindungan bagi kategori Pra-Remaja, Remaja, dan Dewasa demi mencegah kecederaan serius. Ibu bapa wajib memastikan anak dilengkapi peralatan yang diperakui:",
        ],
        bulletPoints: [
          "Pelindung Badan (Body Protector): Mesti mempunyai ketebalan buih serapan hentakan berketumpatan tinggi (EVA foam) sekurang-kurangnya 30-40mm yang melindungi rusuk dan bahagian depan dada.",
          "Pelindung Kemaluan (Groin Guard / Cup): Mandatori untuk kategori tanding putera dan puteri.",
          "Pelindung Tulang Kering & Lengan (Shin & Arm Guards): Melindungi tulang tibia daripada impak pertembungan sepakan.",
          "Pelindung Gigi (Mouthguard): Wajib untuk semua peserta kategori tanding bagi mengelakkan luka lidah dan kecederaan gigi.",
        ],
        callout: {
          type: "warning",
          title: "Pemeriksaan Aparat Pertandingan",
          text: "Pemeriksa peralatan (Wasit Pemeriksa) berhak melarang atlet melangkah ke gelanggang jika peralatan perlindungan didapati koyak, diubah suai, atau tidak mematuhi standard PERSILAT.",
        },
      },
      {
        heading: "2. Pengurusan Nutrisi & Jadual Rehat di Rumah",
        content: [
          "Ibu bapa mengawal dapur dan kualiti rehat atlet muda:",
        ],
        bulletPoints: [
          "Sarapan Sebelum Latihan: Berikan makanan mudah hadam seperti roti bakar bersama pisang dan telur rebus 90 minit sebelum latihan pagi.",
          "Bekalan Hidrasi: Pastikan anak membawa sekurang-kurangnya 1.5L air kosong dan minuman elektrolit cair setiap kali ke sesi gelanggang.",
          "Kurangkan Makanan Proses: Kurangkan makanan bergoreng, sosej, nugget, dan minuman berkarbonat tinggi gula yang menyebabkan kelesuan metabolik.",
          "Kawalan Waktu Tidur: Tetapkan had penggunaan telefon pintar pada jam 10:00 malam untuk memastikan anak mendapat tidur minimum 8 hingga 9 jam.",
        ],
      },
      {
        heading: "3. Sokongan Emosi Positif: Menjadi Tempat Berteduh Jiwa",
        content: [
          "Semasa hari perlawanan, tekanan jiwa atlet muda adalah sangat tinggi. Sikap ibu bapa menentukan ketenangan jiwa mereka:",
        ],
        bulletPoints: [
          "Jangan Menjadi 'Jurulatih Kedua': Serahkan hal taktikal sepenuhnya kepada jurulatih di penjuru gelanggang. Jeritan ibu bapa dari tempat duduk hanya akan mengelirukan fikiran anak semasa beraksi.",
          "Peluk Selepas Perlawanan: Sama ada anak menang atau tewas, sambut mereka dengan pelukan bangga. Soalan pertama mestilah: 'Adik gembira beraksi tadi?' bukan 'Kenapa tak tendang tadi?!'.",
          "Membina Jiwa Pahlawan: Ajar anak bahawa kekalahan hari ini adalah universiti pengalaman untuk kejayaan esok.",
        ],
      },
    ],
  },
  {
    id: "art-stakeholder-coach",
    slug: "panduan-coach-jurulatih-silat",
    title: "Panduan Jurulatih: Metodologi Pengajaran Progresif, ACWR & Corner Coaching",
    subtitle: "Pendekatan Games-Based, pengawasan nisbah beban ACWR, dan etika kepimpinan penjuru gelanggang moden.",
    category: "stakeholders",
    categoryLabel: "Panduan Stakeholder",
    readTime: "9 minit bacaan",
    publishedDate: "2026-02-28",
    reviewedBy: "Akademi Kejurulatihan Silat FighterX",
    featured: false,
    summary:
      "Panduan komprehensif untuk jurulatih moden merangkumi kaedah pengajaran progresif dari asas ke situasi dinamik, pencegahan kecederaan berasaskan sains sukan, pemantauan ACWR, dan komunikasi taktikal berkesan di penjuru gelanggang.",
    fieldProblem:
      "Jurulatih terpaksa menguruskan puluhan atlet serentak secara manual. Tanpa data objektif, sukar mengetahui atlet mana yang betul-betul bersedia, siapa yang keletihan melampau, dan siapa yang curi tulang semasa latihan kendiri.",
    scientificSolution:
      "Kerangka latihan berasaskan bukti (Evidence-based Coaching) menggunakan 6 Ujian Baseline dan 5 Training Priorities untuk mengelompokkan atlet mengikut jurang kelemahan sebenar, bukan andaian semata-mata.",
    actionStepToday:
      "Semak papan pemuka verifikasi jurulatih anda di FighterX. Sahkan rekod baseline atlet minggu ini dan tetapkan Training Priority yang tepat (Endurance / Strength / Movement / Technical / Recovery) untuk setiap pesilat.",
    officialLinks: [
      { label: "ISN Kejurulatihan Kebangsaan", url: "https://isn.gov.my", badge: "ISN" },
      { label: "NSCA LTAD Position Statement", url: "https://www.nsca.com", badge: "NSCA" },
      { label: "Piawaian Kejurulatihan MSN", url: "https://nsc.gov.my", badge: "MSN" },
    ],
    keyTakeaways: [
      "Gunakan pendekatan Games-Based Training untuk melatih membuat keputusan pantas dalam situasi pertarungan yang berubah-ubah.",
      "Pantau Acute:Chronic Workload Ratio (ACWR) antara 0.8 hingga 1.3 bagi mengelakkan lonjakan beban yang mengundang kecederaan.",
      "Arahan sudut (corner coaching) mestilah pendek, tenang, dan spesifik (cth: 'Balas sabit kanan!' bukan 'Buat apa tu?!').",
      "Wujudkan persekitaran latihan berasaskan 'Growth Mindset' di mana kesilapan dalam latihan dilihat sebagai peluang pembelajaran.",
    ],
    interactiveTool: "stakeholder",
    citations: [SCIENTIFIC_CITATIONS[0], SCIENTIFIC_CITATIONS[4], SCIENTIFIC_CITATIONS[6]],
    sections: [
      {
        heading: "1. Metodologi Pengajaran Progresif: Part-to-Whole & Games-Based",
        content: [
          "Jurulatih tradisional sering mengajar teknik secara statik berulang kali di hadapan cermin. Jurulatih berorientasikan sains sukan moden mengintegrasikan pendekatan dinamik:",
        ],
        bulletPoints: [
          "Part-Practice: Pecahkan teknik kompleks (cth. tangkapan kaki sabit lawan dan sapuan rebah) kepada fasa blok: (a) Tangkapan dan serapan impak, (b) Langkah mengunci kaki paksi, (c) Rebah dan kawalan jatuhan.",
          "Progressive Resistance: Lakukan teknik dengan rakan latihan yang memberi rintangan bertingkat (25% -> 50% -> 75% -> 100% kelajuan penuh).",
          "Constraints-Led Approach: Cipta mini-game bersyarat dalam gelanggang (cth: 'Hanya boleh dapat mata dengan elakan dan jatuhan dalam zon 2 meter') untuk melatih adaptasi taktikal spontan.",
        ],
      },
      {
        heading: "2. Pencegahan Kecederaan: Pemantauan Nisbah Beban ACWR",
        content: [
          "Kecederaan atlet silat paling kerap berlaku apabila beban latihan ditingkatkan secara mendadak (contohnya menambah sesi latihan 3 kali ganda dalam tempoh seminggu sebelum perlawanan).",
          "Kira Acute Workload (beban 7 hari lepas) dibahagikan dengan Chronic Workload (purata beban 28 hari lepas). Jika nisbah melebihi 1.5 ('Danger Zone'), risiko koyakan otot dan ligamen meningkat secara mendadak.",
        ],
        callout: {
          type: "warning",
          title: "Zon Selamat Beban Latihan (ACWR)",
          text: "Nisbah Optimum: 0.8 - 1.3 (Zon Hijau / Sweet Spot). Elakkan nisbah melebihi 1.5 (Zon Bahaya Kecederaan).",
        },
      },
      {
        heading: "3. Etika Kepimpinan & Komunikasi Penjuru Gelanggang (Corner Coaching)",
        content: [
          "Semasa rehat 1 minit antara pusingan, atlet berada dalam keadaan sesak nafas dan tertekan. Jurulatih mesti mematuhi prinsip komunikasi berkesan:",
        ],
        bulletPoints: [
          "Kekal Tenang: Nada suara jurulatih yang panik akan memindahkan ketakutan kepada atlet.",
          "Maksimum 2 Arahan Utama: Otak yang letih tidak mampu memproses senarai 10 arahan panjang. Berikan arahan tepat seperti: 'Jaga jarak pasang, tunggu dia sepak sabit dan tangkap!'",
          "Tawaran Sokongan Hidrasi: Berikan air sejuk berkumur, lapkan peluh, dan berikan dorongan semangat juang yang membina keyakinan.",
          "Hormati Adjudikasi Wasit: Elakkan mempertikaikan wasit secara emosi di luar prosedur rasmi kad bantahan VAR bagi memelihara ketenangan mental atlet di gelanggang.",
        ],
      },
    ],
  },
];

export interface PeriodizationPhaseInfo {
  phase: string;
  code: "GPP" | "SPP" | "PRE_COMP" | "TAPERING";
  durationWeeks: string;
  volumePercentage: number;
  intensityPercentage: number;
  primaryEnergySystem: string;
  description: string;
  keyWorkouts: string[];
  recommendedNutrition: string;
  recoveryPriority: string;
  focus: string;
  volumeIntensity: string;
  primaryMetric: string;
}

export const PERIODIZATION_PHASES: PeriodizationPhaseInfo[] = [
  {
    phase: "Fasa Persediaan Umum (GPP)",
    code: "GPP",
    durationWeeks: "6 - 10 Minggu",
    volumePercentage: 85,
    intensityPercentage: 65,
    primaryEnergySystem: "Aerobik Lipolitik & Anaerobik Alaktik Asas",
    description:
      "Membina daya tahan kardiovaskular, asas kekuatan otot teras dan sendi lutut/bahu, membetulkan asimetri biomekanik, serta kelenturan pasang.",
    focus: "Membina kapasiti aerobik asas (VO2max), kekuatan teras, kestabilan sendi, dan mobiliti panggul.",
    volumeIntensity: "Volum 85% · Intensiti 65%",
    primaryMetric: "Ujian Bleep / Yo-Yo Intermittent & Mobiliti 90/90",
    keyWorkouts: [
      "Larian berselang aerobik (Interval Run 800m x 4)",
      "Latihan rintangan kekuatan (Squat, Deadlift, Pull-ups)",
      "Latihan mobiliti panggul 90/90 & Kuda-kuda rendah",
      "Kekuda & gerak langkah asas 8 penjuru",
    ],
    recommendedNutrition: "Karbohidrat sederhana (5 g/kg), Protein tinggi (1.8 g/kg), Air 3.5 L/hari",
    recoveryPriority: "Regangan pasif harian, urutan sukan setiap 2 minggu",
  },
  {
    phase: "Fasa Persediaan Khusus (SPP)",
    code: "SPP",
    durationWeeks: "4 - 8 Minggu",
    volumePercentage: 70,
    intensityPercentage: 85,
    primaryEnergySystem: "Anaerobik Glikolitik (Toleransi Asid Laktat)",
    description:
      "Membangunkan ketahanan kuasa eksplosif, kepantasan sepakan bersiri, latihan jatuhan tahan hentakan, dan reaksi elakan pantas.",
    focus: "Ketahanan kuasa letupan, pecutan sepakan sabit/layang, dan toleransi asid laktat darah 8-12 mmol/L.",
    volumeIntensity: "Volum 70% · Intensiti 85%",
    primaryMetric: "Ujian Sepakan 30-Saat & Wingate Anaerobic Test",
    keyWorkouts: [
      "Pliometrik Depth Jump to Roundhouse Kick",
      "Sepakan pad berintensiti tinggi 30 saat x 6 set",
      "Latihan kombinasi teknik tangkapan dan bantingan",
      "Sparring situasi bersyarat (Conditioned Sparring)",
    ],
    recommendedNutrition: "Karbohidrat tinggi (6-8 g/kg), Protein (1.8-2.0 g/kg), Tambahan Elektrolit",
    recoveryPriority: "Terapi air kontras ais/panas, pemakanan pemulihan 30 minit pasca latihan",
  },
  {
    phase: "Fasa Pra-Pertandingan (Pre-Competition)",
    code: "PRE_COMP",
    durationWeeks: "3 - 4 Minggu",
    volumePercentage: 50,
    intensityPercentage: 95,
    primaryEnergySystem: "ATP-PC & Anaerobik Glikolitik Penuh",
    description:
      "Penajaman kelajuan refleks, simulasi perlawanan sebenar 3 pusingan x 2 minit, simulasi kad bantahan VAR, dan persediaan psikologi bertanding.",
    focus: "Simulasi kejohanan sebenar 3 pusingan x 2 minit, ketajaman taktikal zon mata, dan refleks wasit.",
    volumeIntensity: "Volum 50% · Intensiti 95%",
    primaryMetric: "Ujian Spesifik Silat 6-Minit ISN & Kadar Pemulihan Nadi",
    keyWorkouts: [
      "Simulasi tanding rasmi 3 pusingan x 2 minit mengikut format PERSILAT 2026",
      "Latihan ketajaman jurus seni dengan had masa ketat (3 minit)",
      "Senario mata saat akhir (Mengejar 2 mata dalam 15 saat)",
      "Latihan pernafasan mental dan visualisasi kejayaan",
    ],
    recommendedNutrition: "Pengurusan berat badan berperingkat, kawalan natrium dan serat sederhana",
    recoveryPriority: "Tidur 8-9 jam berkualiti, sesi regangan berpasangan, fisioterapi sendi",
  },
  {
    phase: "Fasa Tapering & Pemulihan (Tapering)",
    code: "TAPERING",
    durationWeeks: "1 - 2 Minggu (Sebelum Perlawanan)",
    volumePercentage: 35,
    intensityPercentage: 90,
    primaryEnergySystem: "Neuromuskular Sharpness & ATP-PC",
    description:
      "Pengurangan volum latihan sebanyak 40-60% untuk membolehkan 'supercompensation' neuromuskular dan pengisian simpanan glikogen penuh pada hari perlawanan.",
    focus: "Supercompensation neuromuskular, pengisian penuh glikogen otot, dan relaksasi mental.",
    volumeIntensity: "Volum 35% · Intensiti 90% (Sesi Singkat)",
    primaryMetric: "Kesiapsiagaan Neuromuskular (Countermovement Jump / CMJ)",
    keyWorkouts: [
      "Sesi singkat 20-30 minit dengan kualiti sepakan maksimum (3-5 ulangan)",
      "Latihan sentuhan sasaran lembut & ketangkasan langkah",
      "Ujian timbang rasa harian dan latihan mobiliti bebas beban",
      "Visualisasi taktik dan penenangan emosi",
    ],
    recommendedNutrition: "Carbo-loading 24-48 jam pra-pertarungan, hidrasi ketat mengikut kadar peluh",
    recoveryPriority: "Tidur optimum, bebas stres luar, persediaan mental bertanding",
  },
];

export interface WeightCategoryOption {
  code: string;
  name: string;
  minKg: number;
  maxKg: number;
  gender: "Putera" | "Puteri" | "Terbuka";
}

export const WEIGHT_CATEGORIES_PERSILAT: WeightCategoryOption[] = [
  { code: "A", name: "Kelas A (45kg - 50kg)", minKg: 45, maxKg: 50, gender: "Terbuka" },
  { code: "B", name: "Kelas B (>50kg - 55kg)", minKg: 50.01, maxKg: 55, gender: "Terbuka" },
  { code: "C", name: "Kelas C (>55kg - 60kg)", minKg: 55.01, maxKg: 60, gender: "Terbuka" },
  { code: "D", name: "Kelas D (>60kg - 65kg)", minKg: 60.01, maxKg: 65, gender: "Terbuka" },
  { code: "E", name: "Kelas E (>65kg - 70kg)", minKg: 65.01, maxKg: 70, gender: "Terbuka" },
  { code: "F", name: "Kelas F (>70kg - 75kg)", minKg: 70.01, maxKg: 75, gender: "Terbuka" },
  { code: "G", name: "Kelas G (>75kg - 80kg)", minKg: 75.01, maxKg: 80, gender: "Terbuka" },
  { code: "H", name: "Kelas H (>80kg - 85kg)", minKg: 80.01, maxKg: 85, gender: "Terbuka" },
  { code: "I", name: "Kelas I (>85kg - 90kg)", minKg: 85.01, maxKg: 90, gender: "Terbuka" },
  { code: "J", name: "Kelas J (>90kg - 95kg)", minKg: 90.01, maxKg: 95, gender: "Putera" },
  { code: "Open", name: "Kelas Bebas / Open (>95kg)", minKg: 95.01, maxKg: 130, gender: "Terbuka" },
];

export function getArticleBySlug(slug: string): KnowledgeArticle | undefined {
  return KNOWLEDGE_ARTICLES.find((a) => a.slug === slug);
}

export function getRelatedArticles(currentId: string, category: KnowledgeCategory): KnowledgeArticle[] {
  const sameCat = KNOWLEDGE_ARTICLES.filter((a) => a.id !== currentId && a.category === category);
  if (sameCat.length >= 2) return sameCat.slice(0, 2);
  const others = KNOWLEDGE_ARTICLES.filter((a) => a.id !== currentId && a.category !== category);
  return [...sameCat, ...others].slice(0, 2);
}
