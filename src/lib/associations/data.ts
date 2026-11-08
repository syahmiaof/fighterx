import type { AssociationCategory, CategoryFilterKey, CategoryMetadata, SilatAssociation } from "./types";

export const CATEGORY_METADATA_LIST: CategoryMetadata[] = [
  {
    key: "ALL",
    label: "Semua",
    shortLabel: "Semua",
    description: "Semua 27 badan induk, anggota pengasas teras, perguruan utama dan badan antarabangsa.",
    badgeTone: "silver",
  },
  {
    key: "BADAN_INDUK",
    label: "Badan Induk Kebangsaan",
    shortLabel: "Badan Induk",
    description: "Persekutuan induk rasmi diiktiraf kerajaan Malaysia, KBS, MSN dan cawangan negeri.",
    badgeTone: "gold",
  },
  {
    key: "PENGASAS_TERAS",
    label: "4 Anggota Pengasas Teras",
    shortLabel: "4 Pengasas Teras",
    description: "Empat pertubuhan perguruan silat teras yang mengasaskan PESAKA Malaysia pada tahun 1983.",
    badgeTone: "crimson",
  },
  {
    key: "PERGURUAN_UTAMA",
    label: "Perguruan Utama Malaysia",
    shortLabel: "Perguruan Utama",
    description: "Perguruan dan persatuan silat berprestij dengan legasi latihan, senjata dan bela diri.",
    badgeTone: "silver",
  },
  {
    key: "ANTARABANGSA",
    label: "Badan Antarabangsa / PERSILAT",
    shortLabel: "Antarabangsa / PERSILAT",
    description: "Persekutuan dunia (PERSILAT), badan induk serantau (IPSI) dan perguruan Nusantara.",
    badgeTone: "blue",
  },
];

export const SILAT_ASSOCIATIONS: SilatAssociation[] = [
  // ==========================================
  // Category 1: BADAN INDUK KEBANGSAAN (4)
  // ==========================================
  {
    id: "pesaka-malaysia",
    name: "Persekutuan Silat Kebangsaan Malaysia",
    shortName: "PESAKA Malaysia",
    category: "BADAN_INDUK",
    logoUrl: "/assets/silat-logos/pesaka-malaysia.png",
    state: "Kuala Lumpur",
    country: "Malaysia",
    yearEstablished: 1983,
    founders: "Dato' Meor Abdul Rahman, Tan Sri Omardin Mauju, Ustaz Hanafi Ahmad, Tuan Guru Anuar Abdul Wahab",
    headquarters: "Wisma PESAKA Malaysia, Kompleks Sukan Negara, Bukit Jalil, 57000 Kuala Lumpur",
    description: "Badan induk persilatan tunggal yang diiktiraf oleh Kerajaan Malaysia, Kementerian Belia dan Sukan (KBS), Majlis Sukan Negara (MSN), dan Majlis Olimpik Malaysia (MOM). PESAKA Malaysia menyelaras segala aktiviti, kejohanan silat kebangsaan, pentauliahan jurulatih dan wasit juri, serta pemilihan skuad silat negara ke Sukan SEA, Sukan Asia, dan Kejuaraan Pencak Silat Dunia.",
    keyPractices: [
      "Silat Olahraga (Tanding)",
      "Silat Seni (Tunggal, Ganda, Regu, Solo)",
      "Pembangunan Wasit Juri Kebangsaan",
      "Sains Sukan Silat Prestasi Tinggi"
    ],
    disciplines: ["SENI", "OLAHRAGA"],
    pesakaAffiliation: "Badan Induk Rasmi Silat Kebangsaan (Penaung Utama)",
    websiteUrl: "https://www.facebook.com/PesakaMalaysiaOfficial/",
  },
  {
    id: "pesaka-kuala-lumpur",
    name: "Persekutuan Silat Kebangsaan Wilayah Persekutuan Kuala Lumpur",
    shortName: "PESAKA Kuala Lumpur",
    category: "BADAN_INDUK",
    logoUrl: "/assets/silat-logos/pesaka-kuala-lumpur.png",
    state: "Wilayah Persekutuan Kuala Lumpur",
    country: "Malaysia",
    yearEstablished: 1984,
    founders: "Jawatankuasa Penaja & Penggerak Silat WP Kuala Lumpur",
    headquarters: "Kompleks Sukan Wilayah Persekutuan, Jalan Sentul, Kuala Lumpur",
    description: "Cawangan rasmi PESAKA bagi Wilayah Persekutuan Kuala Lumpur. Bertanggungjawab mengurus pembangunan silat bandar raya, melatih kontinjen Wilayah Persekutuan ke Sukan Malaysia (SUKMA), mengendalikan Kejohanan Silat Wilayah, dan membimbing kelab-kelab gabungan daerah.",
    keyPractices: [
      "Program Pembangunan Atlet SUKMA",
      "Silat Olahraga Elit Bandar",
      "Silat Seni Berpasukan",
      "Klinik Bakat Muda Remaja"
    ],
    disciplines: ["SENI", "OLAHRAGA"],
    pesakaAffiliation: "Cawangan Negeri PESAKA Malaysia",
  },
  {
    id: "persekutuan-silat-negeri-johor",
    name: "Persekutuan Silat Kebangsaan Negeri Johor",
    shortName: "PESAKA Johor",
    category: "BADAN_INDUK",
    logoUrl: "/assets/silat-logos/persekutuan-silat-negeri-johor.png",
    state: "Johor",
    country: "Malaysia",
    yearEstablished: 1983,
    founders: "Gabungan Tokoh Pendekar & Guru Silat Negeri Johor",
    headquarters: "Gelanggang Silat Negeri Johor, Johor Bahru, Johor",
    description: "Badan induk persilatan negeri Johor yang menaungi persatuan perguruan di 10 daerah. Johor merupakan kubu kuat persilatan tanah air yang melahirkan ramai juara dunia silat olahraga dan seni, serta mendominasi arena SUKMA secara konsisten.",
    keyPractices: [
      "Silat Olahraga Elit Johor",
      "Silat Tradisional Warisan Johor",
      "Latihan Intensif Atlet Kebangsaan",
      "Kursus Wasit Juri Negeri"
    ],
    disciplines: ["SENI", "OLAHRAGA"],
    pesakaAffiliation: "Cawangan Negeri PESAKA Malaysia",
  },
  {
    id: "rumpun-silat-sarawak",
    name: "Rumpun Silat Sarawak",
    shortName: "RSS / PESAKA Sarawak",
    category: "BADAN_INDUK",
    logoUrl: "/assets/silat-logos/rumpun-silat-sarawak.png",
    state: "Sarawak",
    country: "Malaysia",
    yearEstablished: 1985,
    founders: "Gabungan Pemimpin Perguruan Silat Kepulauan Borneo Sarawak",
    headquarters: "Stadium Tertutup Petrajaya, Kuching, Sarawak",
    description: "Gabungan persatuan silat di seluruh Sarawak yang memartabatkan warisan seni bela diri kepulauan Borneo. Aktif memperkasa program pembangunan atlet sukan prestasi tinggi, kejohanan negeri, dan menghantar wakil berbakat ke pentas kebangsaan dan antarabangsa.",
    keyPractices: [
      "Silat Melayu Borneo & Tradisi Sarawak",
      "Silat Olahraga SUKMA",
      "Silat Seni Regu & Ganda",
      "Program Akar Umbi Sarawak"
    ],
    disciplines: ["SENI", "OLAHRAGA"],
    pesakaAffiliation: "Cawangan Negeri PESAKA Malaysia",
  },

  // ==========================================
  // Category 2: 4 ANGGOTA PENGASAS TERAS (4)
  // ==========================================
  {
    id: "pssgm",
    name: "Pertubuhan Silat Seni Gayong Malaysia",
    shortName: "PSSGM",
    category: "PENGASAS_TERAS",
    logoUrl: "/assets/silat-logos/pertubuhan-silat-seni-gayong-malaysia.png",
    state: "Perak",
    country: "Malaysia",
    yearEstablished: 1942,
    founders: "Mahaguru Dato' Meor Abdul Rahman bin Daeng Uda Mohd Hashim",
    headquarters: "Pusat Latihan Tertinggi Gayong, Air Kuning, Taiping, Perak",
    description: "Perguruan silat berdaftar terawal dan terbesar di Malaysia (didaftarkan rasmi pada 1963 di bawah Pendaftar Pertubuhan). Diasaskan oleh Mahaguru Dato' Meor Abdul Rahman, Gayong mempunyai ratusan ribu pesilat di seluruh Malaysia dan persada dunia. Menggabungkan ketangkasan fizikal, kuncian sendi, ketahanan tempur, senjata Melayu pusaka (keris, parang, lembing, rantai, cindai) serta falsafah kerohanian Islam yang mendalam.",
    keyPractices: [
      "Kunci Patah & Tangkapan Gayong",
      "Permainan Keris, Parang, Lembing & Rantai",
      "Silat Olahraga & Silat Seni",
      "Adab Sandang Kebesaran & Mandi Tapak/Seni"
    ],
    disciplines: ["SENI", "OLAHRAGA"],
    pesakaAffiliation: "Anggota Pengasas Teras PESAKA Malaysia (1983)",
  },
  {
    id: "psslm",
    name: "Pertubuhan Seni Silat Lincah Malaysia",
    shortName: "PSSLM",
    category: "PENGASAS_TERAS",
    logoUrl: "/assets/silat-logos/pertubuhan-seni-silat-lincah-malaysia.png",
    state: "Selangor",
    country: "Malaysia",
    yearEstablished: 1961,
    founders: "Mahaguru Tan Sri Datuk Wira Haji Omardin Mauju",
    headquarters: "Kompleks Lincah Mahaguru Omardin (KLMO), Batu Caves, Selangor",
    description: "Diasaskan oleh Mahaguru Tan Sri Omardin Mauju yang mewarisi aliran daripada Syed Abdul Rahman (Datuk Jebeng). Terkenal dengan prinsip ketahanan fizikal luar biasa, serangan pantas agresif, ketangkasan mengelak dan menyerang serentak, serta falsafah keramat 'pantang berundur walau setapak'. Memainkan peranan penting dalam perpaduan dan benteng pertahanan tanah air.",
    keyPractices: [
      "Gerak Serang Tangkas Tanpa Undur",
      "Latihan Ketahanan Fizikal Ekstrem",
      "Pertempuran Jarak Rapat",
      "Silat Olahraga Prestasi Tinggi"
    ],
    disciplines: ["SENI", "OLAHRAGA"],
    pesakaAffiliation: "Anggota Pengasas Teras PESAKA Malaysia (1983)",
  },
  {
    id: "psscm",
    name: "Persatuan Seni Silat Cekak Malaysia",
    shortName: "PSSCM",
    category: "PENGASAS_TERAS",
    logoUrl: "/assets/silat-logos/persatuan-seni-silat-cekak-malaysia.png",
    state: "Kuala Lumpur",
    country: "Malaysia",
    yearEstablished: 1965,
    founders: "Ustaz Haji Hanafi Ahmad",
    headquarters: "Bangunan Silat Cekak, Sentul, 51000 Kuala Lumpur",
    description: "Dilahirkan semula oleh Ustaz Haji Hanafi Ahmad pada 28 Disember 1965 di Seberang Perai dan berkembang pesat ke seluruh negara. Silat Cekak unik dengan konsep berdiri lurus mengikut gerak fitrah semulajadi manusia, tidak mengelak ke kiri atau kanan ('makan menyuap'), serta menunggu serangan musuh lalu menangkap, mengunci, dan mematahkan dengan cepat.",
    keyPractices: [
      "Konsep Berdiri Lurus (Gerak Semulajadi)",
      "Kaedah A, B, C, D & Buah Jatuh Cekak",
      "Bela Diri Tangan Kosong Pantas",
      "Permainan Senjata Parang Lading"
    ],
    disciplines: ["SENI"],
    pesakaAffiliation: "Anggota Pengasas Teras PESAKA Malaysia (1983)",
  },
  {
    id: "psgfm",
    name: "Pertubuhan Seni Gayung Fatani Malaysia",
    shortName: "PSGFM",
    category: "PENGASAS_TERAS",
    logoUrl: "/assets/silat-logos/pertubuhan-seni-gayung-fatani-malaysia.png",
    state: "Selangor",
    country: "Malaysia",
    yearEstablished: 1976,
    founders: "Tuan Guru Haji Anuar Abdul Wahab AMN",
    headquarters: "Kajang, Selangor",
    description: "Berakar umbi daripada tradisi Silat Melayu Patani kurun ke-19. Di bawah pimpinan Tuan Guru Anuar Abdul Wahab, PSGFM mempelopori metodologi saintifik kurikulum Silat Baku Malaysia, penyusunan pedagogi persilatan moden di peringkat sekolah dan IPT, serta menjadi rujukan utama penggubalan undang-undang antarabangsa PERSILAT.",
    keyPractices: [
      "Kurikulum Silat Pulut & Silat Baku",
      "Jurus Bunga & Senaman Silat Fatani",
      "Teknik Guntingan & Kuncian Patani",
      "Penggubalan Peraturan Pertandingan PERSILAT"
    ],
    disciplines: ["SENI", "OLAHRAGA"],
    pesakaAffiliation: "Anggota Pengasas Teras PESAKA Malaysia (1983)",
  },

  // ==========================================
  // Category 3: PERGURUAN UTAMA MALAYSIA (9)
  // ==========================================
  {
    id: "cekak-hanafi",
    name: "Persatuan Seni Silat Cekak Ustaz Hanafi Malaysia",
    shortName: "Silat Cekak Hanafi",
    category: "PERGURUAN_UTAMA",
    logoUrl: "/assets/silat-logos/persatuan-seni-silat-cekak-ustaz-hanafi-malaysia.png",
    state: "Kuala Lumpur",
    country: "Malaysia",
    yearEstablished: 1993,
    founders: "Pewaris Kepimpinan Mutlak Ustaz Hanafi Ahmad",
    headquarters: "Kuala Lumpur",
    description: "Meneruskan legasi murni perguruan Silat Cekak di bawah pimpinan pewaris rasmi Ustaz Hanafi Ahmad. Sangat aktif di institusi pendidikan tinggi (IPT), kolej, dan sekolah di seluruh Malaysia. Menggabungkan kemahiran beladiri pantas tanpa kuda-kuda dengan pembentukan syahsiah, sahsiah terpuji, dan kecemerlangan adab.",
    keyPractices: [
      "Gerak Serangan Pantas 99% Menangkis & Membalas",
      "Buah Pukul & Kuncian Cekak",
      "Seni Parang Lading",
      "Pembangunan Modal Insan Siswa"
    ],
    disciplines: ["SENI"],
    pesakaAffiliation: "Persatuan Berdaftar & Rakan Silat Kebangsaan",
  },
  {
    id: "pusaka-gayong",
    name: "Pertubuhan Seni Silat Pusaka Gayong Malaysia",
    shortName: "PSSPGM",
    category: "PERGURUAN_UTAMA",
    logoUrl: "/assets/silat-logos/pertubuhan-seni-silat-pusaka-gayong-malaysia.png",
    state: "Selangor",
    country: "Malaysia",
    yearEstablished: 1990,
    founders: "Keluarga Waris & Murid Kanan Mahaguru Dato' Meor Abdul Rahman",
    headquarters: "Klang, Selangor",
    description: "Ditubuhkan bagi memelihara ketulenan sukatan pelajaran asal, adat-istiadat pusaka, dan rahsia jurus tempur Mahaguru Dato' Meor Abdul Rahman. Aktif melatih barisan jurulatih bertauliah dan mengekalkan sistem sandang kebesaran serta tradisi persilatan Gayong tulen.",
    keyPractices: [
      "Jurus Pusaka Dato' Meor Abdul Rahman",
      "Kombinasi Tempur Gelut & Kunci Maut",
      "Permainan Rantai & Tombak",
      "Upacara Mandi Adat Pusaka Gayong"
    ],
    disciplines: ["SENI", "OLAHRAGA"],
    pesakaAffiliation: "Persatuan Sahabat Warisan Silat Kebangsaan",
  },
  {
    id: "daeng-kuning",
    name: "Akademi Persilatan Daeng Kuning",
    shortName: "APDK",
    category: "PERGURUAN_UTAMA",
    logoUrl: "/assets/silat-logos/akademi-persilatan-daeng-kuning.png",
    state: "Selangor",
    country: "Malaysia",
    yearEstablished: 2018,
    founders: "Guru Utama & Majlis Tertinggi Seni Warisan Daeng Kuning",
    headquarters: "Selangor, Malaysia",
    description: "Akademi pembangunan seni silat warisan berpusat kepada pemantapan kemahiran beladiri, taktikal tempur sepasang keris pusaka, serta pembinaan disiplin jati diri pendekar Melayu al-haq. Mendidik generasi muda dengan ketangkasan gelanggang dan keteguhan rohani.",
    keyPractices: [
      "Tempur Taktikal Keris Kembar",
      "Kunci & Patah Sendi Jarak Rapat",
      "Langkah Pahlawan & Bela Diri Taktikal",
      "Pembangunan Disiplin & Adab Pendekar"
    ],
    disciplines: ["SENI", "OLAHRAGA"],
    pesakaAffiliation: "Akademi Persilatan Bersekutu & Rakan Beladiri Warisan",
  },
  {
    id: "sendeng-malaysia",
    name: "Persatuan Seni Silat Sendeng Malaysia",
    shortName: "PSSSM",
    category: "PERGURUAN_UTAMA",
    logoUrl: "/assets/silat-logos/persatuan-seni-silat-sendeng-malaysia.png",
    state: "Johor",
    country: "Malaysia",
    yearEstablished: 1957,
    founders: "Haji Abd Hamid bin Haji Hamzah",
    headquarters: "Sungai Mati, Muar, Johor",
    description: "Aliran persilatan legenda berakar umbi dari Muar, Johor. Berpaksikan kedudukan tubuh menyendeng 45 darjah untuk meminimumkan sasaran serangan musuh, menjimatkan pergerakan, dan memanfaatkan kepantasan pukulan patah sendi serta kuncian kilat jarak rapat.",
    keyPractices: [
      "Posisi Langkah Menyendeng",
      "Pukulan Sendeng Patah Sendi",
      "Tangkapan Kilat & Kuntau Sendeng",
      "Permainan Pedang & Keris Sendeng"
    ],
    disciplines: ["SENI", "OLAHRAGA"],
    pesakaAffiliation: "Persatuan Silat Tradisi Berdaftar Negeri & Kebangsaan",
  },
  {
    id: "singa-berantai",
    name: "Persatuan Seni Silat Gayong Singa Berantai Malaysia",
    shortName: "Gayong Singa Berantai",
    category: "PERGURUAN_UTAMA",
    logoUrl: "/assets/silat-logos/persatuan-seni-silat-gayong-singa-berantai.png",
    state: "Perak",
    country: "Malaysia",
    yearEstablished: 1978,
    founders: "Tuan Guru Ahmad bin Mohd Salleh (Pak Mat Singa)",
    headquarters: "Taiping, Perak",
    description: "Perguruan silat pahlawan beraliran Singa Berantai yang memfokuskan taktikal tempur jarak dekat, ketahanan mental, serta kemahiran tinggi dalam penggunaan senjata tradisional Melayu seperti kerambit, belati, dan rantai besi berpemberat.",
    keyPractices: [
      "Jurus Pukulan Singa Berantai",
      "Pertempuran Jarak Rapat & Kerambit",
      "Permainan Senjata Rantai Berbisa",
      "Ketahanan Mental Medan Tempur"
    ],
    disciplines: ["SENI"],
    pesakaAffiliation: "Perguruan Silat Tradisi Malaysia",
  },
  {
    id: "ikaseka",
    name: "Pertubuhan Seni Silat Gerak Kilat Malaysia (IKASEKA)",
    shortName: "IKASEKA",
    category: "PERGURUAN_UTAMA",
    logoUrl: "/assets/silat-logos/pertubuhan-seni-silat-gerak-kilat-ikaseka.png",
    state: "Selangor",
    country: "Malaysia",
    yearEstablished: 1982,
    founders: "Tok Guru Haji Ismail bin Salleh",
    headquarters: "Shah Alam, Selangor",
    description: "Aliran silat pantas yang mengutamakan refleks kilat dan gerak balas tanpa henti. Memanfaatkan momentum dan tenaga serangan lawan untuk menyekat serta merebahkan musuh dalam pecahan saat sebelum serangan sempat disempurnakan.",
    keyPractices: [
      "Gerak Kilat Reflektif",
      "Sekatan Pantas Awal Serangan",
      "Kuncian Bawah Jatuhan Tanah",
      "Senaman Refleks Pantas Tubuh"
    ],
    disciplines: ["SENI", "OLAHRAGA"],
    pesakaAffiliation: "Perguruan Gabungan Berdaftar",
  },
  {
    id: "pikum",
    name: "Pertubuhan Seni Silat Ikatan Kalam Utama Malaysia",
    shortName: "PIKUM",
    category: "PERGURUAN_UTAMA",
    logoUrl: "/assets/silat-logos/pertubuhan-seni-silat-ikatan-kalam-utama-pikum.png",
    state: "Kelantan",
    country: "Malaysia",
    yearEstablished: 1980,
    founders: "Ustaz Tok Guru Haji Yaacob bin Ismail",
    headquarters: "Kota Bharu, Kelantan",
    description: "Menggabungkan kemahiran beladiri fizikal dengan nilai dakwah Islamiah, adab Melayu, dan disiplin kerohanian. Membimbing para pesilat agar memiliki ketahanan fizikal ampuh yang diiringi kebersihan rohani berlandaskan Tauhid.",
    keyPractices: [
      "Gerak Kalam Utama Berbisa",
      "Kuncian Sendi Kalam",
      "Adab Kerohanian & Pengajian Tauhid",
      "Silat Tanding & Seni Santun"
    ],
    disciplines: ["SENI", "OLAHRAGA"],
    pesakaAffiliation: "Perguruan Gabungan Berdaftar",
  },
  {
    id: "kuntau-tekpi",
    name: "Pertubuhan Seni Silat Kuntau Tekpi Malaysia",
    shortName: "PSSKTM",
    category: "PERGURUAN_UTAMA",
    logoUrl: "/assets/silat-logos/pertubuhan-seni-silat-kuntau-tekpi-malaysia.png",
    state: "Kedah",
    country: "Malaysia",
    yearEstablished: 1970,
    founders: "Tuan Guru Pak Zainal bin Abidin",
    headquarters: "Alor Setar, Kedah",
    description: "Perguruan elit yang pakar dalam penguasaan senjata Tekpi (Trisula / Sai besi tiga cabang). Silat Kuntau Tekpi melatih ketepatan menepis bilah senjata tajam, mengunci senjata lawan, dan melancarkan pukulan tangan kosong Kuntau yang mematikan.",
    keyPractices: [
      "Kemahiran Sepasang Senjata Tekpi",
      "Jurus Kuntau Patah Sendi",
      "Tangkapan Mata Pedang & Parang",
      "Bela Diri Tangan Kosong Pantas"
    ],
    disciplines: ["SENI"],
    pesakaAffiliation: "Perguruan Silat Tradisi Berdaftar",
  },
  {
    id: "silat-melayu-haqq",
    name: "Pertubuhan Silat Melayu Haqq Malaysia",
    shortName: "Silat Melayu Haqq",
    category: "PERGURUAN_UTAMA",
    logoUrl: "/assets/silat-logos/silat-melayu-haqq.png",
    state: "Kuala Lumpur",
    country: "Malaysia",
    yearEstablished: 2005,
    founders: "Pendekar Guru Haji Abdul Rahman",
    headquarters: "Ampang, Kuala Lumpur",
    description: "Aliran Silat Melayu berprinsipkan kebenaran (Haqq), menekankan ketenangan minda, kehalusan bunga tari silat, adab pertempuran, dan pemeliharaan warisan seni beladiri Melayu tradisi Nusantara yang asli.",
    keyPractices: [
      "Langkah Tari Melayu Berbisa",
      "Jurus Pukulan Haqq",
      "Pertahanan Diri Berasaskan Adab",
      "Kefahaman Filosofi Hakiki"
    ],
    disciplines: ["SENI"],
    pesakaAffiliation: "Perguruan Tradisi Berdaftar",
  },
  {
    id: "tempur-keris",
    name: "Sayap Disiplin Tempur Keris PSSGM",
    shortName: "Tempur Keris PSSGM",
    category: "PERGURUAN_UTAMA",
    logoUrl: "/assets/silat-logos/tempur-keris-pssgm.png",
    state: "Perak",
    country: "Malaysia",
    yearEstablished: 1969,
    founders: "Mahaguru Dato' Meor Abdul Rahman",
    headquarters: "Taiping, Perak",
    description: "Sayap latihan khas di bawah Silat Seni Gayong yang mengkhusus dalam penguasaan seni permainan, tikaman, elakan, dan falsafah tempur Keris Melayu berlok dan berpamor sebagai senjata maruah pahlawan Melayu.",
    keyPractices: [
      "Tikaman & Kilasan Bilah Keris",
      "Seni Luk Keris Berpusar",
      "Adab Menghunus & Menyarung Keris",
      "Falsafah Maruah & Daulat Senjata Melayu"
    ],
    disciplines: ["SENI"],
    pesakaAffiliation: "Sayap Disiplin Khas Silat Gayong",
  },

  // ==========================================
  // Category 4: BADAN ANTARABANGSA / PERSILAT (9)
  // ==========================================
  {
    id: "persilat",
    name: "Persekutuan Pencak Silat Antarabangsa",
    shortName: "PERSILAT",
    category: "ANTARABANGSA",
    logoUrl: "/assets/silat-logos/persekutuan-pencak-silat-antarabangsa-persilat.png",
    state: "Jakarta",
    country: "Antarabangsa",
    yearEstablished: 1980,
    founders: "4 Negara Pengasas: Malaysia (PESAKA), Indonesia (IPSI), Singapura (PERSISI), Brunei Darussalam (PERSIB)",
    headquarters: "Padepokan Pencak Silat Indonesia, TMII, Jakarta Timur, Indonesia",
    description: "Badan induk pencak silat tertinggi di dunia yang ditubuhkan pada 11 Mac 1980 di Jakarta. Dianggotai oleh lebih 70 persekutuan kebangsaan di seluruh dunia. PERSILAT menggubal peraturan rasmi kejohanan dunia, mempromosikan pencak silat ke Sukan Olimpik, dan menguruskan Sukan SEA serta Kejuaraan Dunia Pencak Silat.",
    keyPractices: [
      "Peraturan Pertandingan Antarabangsa (Tanding & Jurus)",
      "Pentauliahan Wasit Juri Antarabangsa",
      "Kejuaraan Dunia Pencak Silat",
      "Penyelarasan Sukan Olimpik & Antarabangsa"
    ],
    disciplines: ["SENI", "OLAHRAGA"],
    pesakaAffiliation: "Badan Induk Silat Dunia (PESAKA adalah Pengasas Bersama)",
    websiteUrl: "https://worldpencaksilat.org/",
  },
  {
    id: "ipsi",
    name: "Ikatan Pencak Silat Indonesia",
    shortName: "IPSI",
    category: "ANTARABANGSA",
    logoUrl: "/assets/silat-logos/ikatan-pencak-silat-indonesia-ipsi.png",
    state: "Jakarta",
    country: "Indonesia",
    yearEstablished: 1948,
    founders: "Mr. K.R.M.T. Wongsonegoro",
    headquarters: "Padepokan Pencak Silat Indonesia, TMII, Jakarta Timur",
    description: "Badan induk rasmi pencak silat kebangsaan Indonesia yang diasaskan pada 18 Mei 1948 di Surakarta. Menghimpunkan ribuan perguruan silat di 38 wilayah Indonesia dan merupakan salah satu daripada 4 negara pengasas teras PERSILAT.",
    keyPractices: [
      "Penyelarasan Silat Nasional Indonesia (PON)",
      "Silat Tanding & Seni Antarabangsa",
      "Pusat Latihan Atlet Dunia",
      "Diplomasi Warisan Budaya UNESCO"
    ],
    disciplines: ["SENI", "OLAHRAGA"],
    pesakaAffiliation: "Rakan Pengasas PERSILAT (Indonesia)",
  },
  {
    id: "psht",
    name: "Persaudaraan Setia Hati Terate",
    shortName: "PSHT",
    category: "ANTARABANGSA",
    logoUrl: "/assets/silat-logos/persaudaraan-setia-hati-terate-psht.png",
    state: "Jawa Timur",
    country: "Indonesia",
    yearEstablished: 1922,
    founders: "Ki Hadjar Hardjo Oetomo",
    headquarters: "Padepokan Agung PSHT, Madiun, Jawa Timur, Indonesia",
    description: "Salah satu organisasi pencak silat terbesar di dunia dengan jutaan 'Warga' di puluhan negara. Berteraskan persaudaraan sejati yang kekal abadi, mendidik manusia berbudi luhur tahu benar dan salah, serta berpegang teguh pada prinsip 'Manusia dapat dihancurkan, manusia dapat dimatikan, tetapi manusia tidak dapat dikalahkan selama setia pada hatinya sendiri'.",
    keyPractices: [
      "Sambung Jiwa & Olah Raga PSHT",
      "Jurus Kunci Pukulan Madiun",
      "Pendidikan Budi Pekerti Luhur",
      "Seni Beladiri Tradisi & Tanding"
    ],
    disciplines: ["SENI", "OLAHRAGA"],
    pesakaAffiliation: "Perguruan Historis Antarabangsa Terbesar",
  },
  {
    id: "tapak-suci",
    name: "Perguruan Seni Beladiri Indonesia Tapak Suci Putera Muhammadiyah",
    shortName: "Tapak Suci",
    category: "ANTARABANGSA",
    logoUrl: "/assets/silat-logos/perguruan-seni-beladiri-tapak-suci.png",
    state: "Yogyakarta",
    country: "Indonesia",
    yearEstablished: 1963,
    founders: "Pendekar Mohamad Barie Irsjad & Pimpinan Pusat Muhammadiyah",
    headquarters: "Kauman, Yogyakarta, Indonesia",
    description: "Ditubuhkan pada 31 Julai 1963 dengan semboyan suci 'Dengan Iman dan Akhlak Saya Menjadi Kuat, Tanpa Iman dan Akhlak Saya Menjadi Lemah'. Terkenal dengan kemahiran tendangan akrobatik, jurus bunga mawar dan katak melempar tubuh, serta pencetak ramai juara dunia silat olahraga.",
    keyPractices: [
      "Tendangan Terbang & Akrobatik Silat",
      "Jurus Mawar Berbunga & Naga Terbang",
      "Teknik Bantingan Pantas",
      "Silat Tanding Elit Dunia"
    ],
    disciplines: ["SENI", "OLAHRAGA"],
    pesakaAffiliation: "Perguruan Historis IPSI / Ahli Antarabangsa PERSILAT",
  },
  {
    id: "perisai-diri",
    name: "Keluarga Silat Nasional Indonesia Perisai Diri",
    shortName: "Kelatnas Perisai Diri",
    category: "ANTARABANGSA",
    logoUrl: "/assets/silat-logos/keluarga-silat-nasional-perisai-diri.png",
    state: "Jawa Timur",
    country: "Indonesia",
    yearEstablished: 1955,
    founders: "RM Soebandiman Dirdjoatmodjo",
    headquarters: "Surabaya, Jawa Timur, Indonesia",
    description: "Diasaskan pada 2 Julai 1955 di Surabaya. Mengetengahkan kaedah unik 156 aliran silat yang disaring saintifik berasaskan gerak lentur dan elakan licin tanpa menggunakan tenaga lawan. Mengusung prinsip mulia 'Pandai Silat Tanpa Mencederakan'.",
    keyPractices: [
      "Teknik Serang Hindar & Lenturan Tubuh",
      "Jurus Garuda, Naga, Harimau & Kuntul",
      "Permainan Pedang & Toya Tradisi",
      "Silat Tanding Fleksibel"
    ],
    disciplines: ["SENI", "OLAHRAGA"],
    pesakaAffiliation: "Perguruan Historis IPSI / Ahli Antarabangsa PERSILAT",
  },
  {
    id: "smi",
    name: "Perguruan Pencak Silat Satria Muda Indonesia",
    shortName: "SMI",
    category: "ANTARABANGSA",
    logoUrl: "/assets/silat-logos/perguruan-pencak-silat-satria-muda-indonesia.png",
    state: "Jakarta",
    country: "Indonesia",
    yearEstablished: 1987,
    founders: "Prabowo Subianto & Tokoh Persilatan Nusantara",
    headquarters: "Jakarta, Indonesia",
    description: "Diterajui oleh barisan tokoh patriotik dan pendekar silat, SMI berfokus kepada pembentukan watak kesatria muda yang gagah berani, berdisiplin tinggi, setia kawan, dan berbakti kepada kedaulatan bangsa dan tanah air.",
    keyPractices: [
      "Taktikal Tempur Tentera & Gerak Pantas",
      "Silat Tanding Komprehensif",
      "Latihan Disiplin Ketenteraan Silat",
      "Pembangunan Belia Pahlawan"
    ],
    disciplines: ["SENI", "OLAHRAGA"],
    pesakaAffiliation: "Perguruan Ahli IPSI / PERSILAT",
  },
  {
    id: "merpati-putih",
    name: "Perguruan Pencak Silat Betako Merpati Putih",
    shortName: "Merpati Putih",
    category: "ANTARABANGSA",
    logoUrl: "/assets/silat-logos/perguruan-pencak-silat-merpati-putih.png",
    state: "Yogyakarta",
    country: "Indonesia",
    yearEstablished: 1963,
    founders: "Saring Hadi Poernomo & Poerwoto Hadi Poernomo",
    headquarters: "Yogyakarta, Indonesia",
    description: "Aliran bela diri tangan kosong (Bela Diri Tangan Kosong - Betako) warisan keraton Jawa. Terkenal di seluruh dunia dengan kaedah olah pernafasan khusus yang membangkitkan tenaga dalam, mematahkan besi padu dan batu granit, serta melatih kepekaan deria getaran (vibravision) untuk pengesanan tanpa mata.",
    keyPractices: [
      "Olah Pernafasan Tenaga Dalam",
      "Pematahan Objek Keras Ekstrem (Besi, Granit)",
      "Latihan Deria Getaran (Vibravision)",
      "Silat Tangan Kosong Taktikal"
    ],
    disciplines: ["SENI", "OLAHRAGA"],
    pesakaAffiliation: "Perguruan Historis IPSI / Ahli Antarabangsa PERSILAT",
  },
  {
    id: "pagar-nusa",
    name: "Ikatan Pencak Silat Nahdlatul Ulama Pagar Nusa",
    shortName: "IPSNU Pagar Nusa",
    category: "ANTARABANGSA",
    logoUrl: "/assets/silat-logos/ikatan-pencak-silat-nahdlatul-ulama-pagar-nusa.png",
    state: "Jawa Timur",
    country: "Indonesia",
    yearEstablished: 1986,
    founders: "KH Suharbillah & KH Maksum Jauhari (Gus Maksum)",
    headquarters: "Pondok Pesantren Lirboyo, Kediri, Jawa Timur",
    description: "Wadah pencak silat di bawah naungan Nahdlatul Ulama (NU) yang menghimpunkan jutaan pesilat santri. Berfungsi sebagai 'pagar bangsa dan benteng ulama', menggabungkan jurus beladiri kanuragan, kebatinan Islam, dan ketangkasan fizikal pertahanan kendiri.",
    keyPractices: [
      "Jurus Pukulan Pagar Nusa",
      "Pendidikan Akhlak & Kerohanian Santri",
      "Benteng Pertahanan Ulama & Bangsa",
      "Silat Tanding & Demonstrasi Tradisi"
    ],
    disciplines: ["SENI", "OLAHRAGA"],
    pesakaAffiliation: "Badan Otonom NU / Ahli IPSI / PERSILAT",
  },
  {
    id: "gubug-remaja",
    name: "Perguruan Pencak Silat Gubug Remaja",
    shortName: "Gubug Remaja",
    category: "ANTARABANGSA",
    logoUrl: "/assets/silat-logos/perguruan-pencak-silat-gubug-remaja.png",
    state: "Jawa Timur",
    country: "Indonesia",
    yearEstablished: 1935,
    founders: "Eyang Koestari",
    headquarters: "Ngawi, Jawa Timur, Indonesia",
    description: "Perguruan pencak silat tradisi Nusantara yang membimbing generasi muda ke arah budi pekerti mulia, ketangkasan beladiri, dan kerohanian yang kukuh untuk membina insan berguna kepada masyarakat dan negara.",
    keyPractices: [
      "Jurus Warisan Eyang Koestari",
      "Olah Nafas & Kerohanian Remaja",
      "Kuncian Lembut Pertahanan Diri",
      "Silat Tanding Tradisi"
    ],
    disciplines: ["SENI", "OLAHRAGA"],
    pesakaAffiliation: "Perguruan Silat Tradisi Berdaftar IPSI / PERSILAT",
  },
];

// Helper functions & Alias Mapping
export const ASSOCIATION_ID_ALIASES: Record<string, string> = {
  // Registration Affiliation ID -> Directory ID
  "pesaka-johor": "persekutuan-silat-negeri-johor",
  "pesaka-sarawak": "rumpun-silat-sarawak",
  "silat-sendeng": "sendeng-malaysia",
  "tempur-keris-pssgm": "tempur-keris",

  // Directory ID -> Registration Affiliation ID
  "persekutuan-silat-negeri-johor": "pesaka-johor",
  "rumpun-silat-sarawak": "pesaka-sarawak",
  "sendeng-malaysia": "silat-sendeng",
  "tempur-keris": "tempur-keris-pssgm",
};

export function getAssociationById(id: string): SilatAssociation | undefined {
  if (!id) return undefined;
  const normalized = id.toLowerCase();
  const direct = SILAT_ASSOCIATIONS.find((assoc) => assoc.id.toLowerCase() === normalized);
  if (direct) return direct;
  const aliased = ASSOCIATION_ID_ALIASES[normalized];
  if (aliased) {
    return SILAT_ASSOCIATIONS.find((assoc) => assoc.id.toLowerCase() === aliased.toLowerCase());
  }
  return undefined;
}

export function getAssociationsByCategory(category: AssociationCategory): SilatAssociation[] {
  return SILAT_ASSOCIATIONS.filter((assoc) => assoc.category === category);
}

export function getCategoryCounts(): Record<CategoryFilterKey, number> {
  const counts: Record<CategoryFilterKey, number> = {
    ALL: SILAT_ASSOCIATIONS.length,
    BADAN_INDUK: 0,
    PENGASAS_TERAS: 0,
    PERGURUAN_UTAMA: 0,
    ANTARABANGSA: 0,
  };

  for (const assoc of SILAT_ASSOCIATIONS) {
    counts[assoc.category]++;
  }

  return counts;
}

export function searchAssociations(query: string, category: CategoryFilterKey = "ALL"): SilatAssociation[] {
  const normalizedQuery = query.trim().toLowerCase();

  return SILAT_ASSOCIATIONS.filter((assoc) => {
    // Category match
    if (category !== "ALL" && assoc.category !== category) {
      return false;
    }

    // Query match
    if (!normalizedQuery) {
      return true;
    }

    const matchesName = assoc.name.toLowerCase().includes(normalizedQuery);
    const matchesShortName = assoc.shortName.toLowerCase().includes(normalizedQuery);
    const matchesState = assoc.state ? assoc.state.toLowerCase().includes(normalizedQuery) : false;
    const matchesCountry = assoc.country.toLowerCase().includes(normalizedQuery);
    const matchesFounders = assoc.founders ? assoc.founders.toLowerCase().includes(normalizedQuery) : false;
    const matchesDescription = assoc.description.toLowerCase().includes(normalizedQuery);
    const matchesHeadquarters = assoc.headquarters ? assoc.headquarters.toLowerCase().includes(normalizedQuery) : false;
    const matchesPractices = assoc.keyPractices ? assoc.keyPractices.some((p) => p.toLowerCase().includes(normalizedQuery)) : false;

    return (
      matchesName ||
      matchesShortName ||
      matchesState ||
      matchesCountry ||
      matchesFounders ||
      matchesDescription ||
      matchesHeadquarters ||
      matchesPractices
    );
  });
}
