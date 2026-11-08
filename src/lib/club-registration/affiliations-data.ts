export type AssociationCategory =
  | "BADAN_INDUK"
  | "PENGASAS_TERAS"
  | "PERGURUAN_UTAMA"
  | "ANTARABANGSA";

export interface SilatAffiliationOption {
  id: string;
  aliases?: string[];
  name: string;
  shortName: string;
  category: AssociationCategory | "INDEPENDENT";
  logoUrl: string;
  state?: string;
  country: string;
  description: string;
}

export const SILAT_AFFILIATIONS: SilatAffiliationOption[] = [
  // 1. Badan Induk Kebangsaan
  {
    id: "pesaka-malaysia",
    name: "Persekutuan Silat Kebangsaan Malaysia (PESAKA)",
    shortName: "PESAKA Malaysia",
    category: "BADAN_INDUK",
    logoUrl: "/assets/silat-logos/pesaka-malaysia.png",
    state: "Kuala Lumpur",
    country: "Malaysia",
    description: "Badan induk rasmi yang menyelaras sukan dan persilatan silat di seluruh Malaysia.",
  },
  {
    id: "pesaka-kuala-lumpur",
    name: "Persekutuan Silat Kebangsaan Kuala Lumpur",
    shortName: "PESAKA KL",
    category: "BADAN_INDUK",
    logoUrl: "/assets/silat-logos/pesaka-kuala-lumpur.png",
    state: "WP Kuala Lumpur",
    country: "Malaysia",
    description: "Badan penyelaras silat negeri bagi Wilayah Persekutuan Kuala Lumpur.",
  },
  {
    id: "pesaka-johor",
    aliases: ["persekutuan-silat-negeri-johor"],
    name: "Persekutuan Silat Negeri Johor",
    shortName: "PESAKA Johor",
    category: "BADAN_INDUK",
    logoUrl: "/assets/silat-logos/persekutuan-silat-negeri-johor.png",
    state: "Johor",
    country: "Malaysia",
    description: "Badan induk silat negeri Johor di bawah naungan PESAKA Malaysia.",
  },
  {
    id: "pesaka-sarawak",
    aliases: ["rumpun-silat-sarawak"],
    name: "Rumpun Silat Sarawak",
    shortName: "Rumpun Silat Sarawak",
    category: "BADAN_INDUK",
    logoUrl: "/assets/silat-logos/rumpun-silat-sarawak.png",
    state: "Sarawak",
    country: "Malaysia",
    description: "Badan gabungan persilatan utama negeri Sarawak.",
  },

  // 2. 4 Anggota Pengasas Teras
  {
    id: "pssgm",
    name: "Pertubuhan Silat Seni Gayong Malaysia",
    shortName: "PSSGM (Gayong Malaysia)",
    category: "PENGASAS_TERAS",
    logoUrl: "/assets/silat-logos/pertubuhan-silat-seni-gayong-malaysia.png",
    state: "Kedah / Kebangsaan",
    country: "Malaysia",
    description: "Diasaskan oleh Mahaguru Dato' Meor Abdul Rahman, perguruan pengasas PESAKA.",
  },
  {
    id: "psslm",
    name: "Pertubuhan Seni Silat Lincah Malaysia",
    shortName: "PSSLM (Silat Lincah)",
    category: "PENGASAS_TERAS",
    logoUrl: "/assets/silat-logos/pertubuhan-seni-silat-lincah-malaysia.png",
    state: "Selangor / Kebangsaan",
    country: "Malaysia",
    description: "Diasaskan oleh Mahaguru Tan Sri Omardin Mauju, terkenal dengan kepantasan dan ketahanan.",
  },
  {
    id: "psscm",
    name: "Persatuan Seni Silat Cekak Malaysia",
    shortName: "PSSCM (Silat Cekak)",
    category: "PENGASAS_TERAS",
    logoUrl: "/assets/silat-logos/persatuan-seni-silat-cekak-malaysia.png",
    state: "Kuala Lumpur / Kebangsaan",
    country: "Malaysia",
    description: "Diasaskan oleh Ustaz Haji Hanafi Ahmad, memfokuskan gerak lurus dan kaedah pertahanan diri.",
  },
  {
    id: "psgfm",
    name: "Pertubuhan Seni Gayung Fatani Malaysia",
    shortName: "PSGFM (Gayung Fatani)",
    category: "PENGASAS_TERAS",
    logoUrl: "/assets/silat-logos/pertubuhan-seni-gayung-fatani-malaysia.png",
    state: "Kebangsaan",
    country: "Malaysia",
    description: "Diasaskan oleh Tuan Guru Haji Anuar Abdul Wahab, pelopor kurikulum Silat Baku Malaysia.",
  },

  // 3. Perguruan & Persatuan Silat Utama Malaysia
  {
    id: "cekak-hanafi",
    name: "Persatuan Seni Silat Cekak Ustaz Hanafi Malaysia",
    shortName: "Silat Cekak Hanafi",
    category: "PERGURUAN_UTAMA",
    logoUrl: "/assets/silat-logos/persatuan-seni-silat-cekak-ustaz-hanafi-malaysia.png",
    state: "Kebangsaan",
    country: "Malaysia",
    description: "Perguruan Silat Cekak warisan Ustaz Hanafi Ahmad dengan jangkauan meluas di IPT.",
  },
  {
    id: "pusaka-gayong",
    name: "Pertubuhan Seni Silat Pusaka Gayong Malaysia",
    shortName: "PSSPGM (Pusaka Gayong)",
    category: "PERGURUAN_UTAMA",
    logoUrl: "/assets/silat-logos/pertubuhan-seni-silat-pusaka-gayong-malaysia.png",
    state: "Kebangsaan",
    country: "Malaysia",
    description: "Perguruan warisan Gayong pimpinan amanah keluarga Mahaguru Meor Abdul Rahman.",
  },
  {
    id: "daeng-kuning",
    aliases: ["akademi-persilatan-daeng-kuning", "apdk"],
    name: "Akademi Persilatan Daeng Kuning",
    shortName: "APDK (Daeng Kuning)",
    category: "PERGURUAN_UTAMA",
    logoUrl: "/assets/silat-logos/akademi-persilatan-daeng-kuning.png",
    state: "Selangor / Kebangsaan",
    country: "Malaysia",
    description: "Akademi pembangunan beladiri dan seni silat taktikal warisan Daeng Kuning.",
  },
  {
    id: "silat-sendeng",
    aliases: ["sendeng-malaysia"],
    name: "Persatuan Seni Silat Sendeng Malaysia",
    shortName: "PSSSM (Silat Sendeng)",
    category: "PERGURUAN_UTAMA",
    logoUrl: "/assets/silat-logos/persatuan-seni-silat-sendeng-malaysia.png",
    state: "Johor / Kebangsaan",
    country: "Malaysia",
    description: "Silat Sendeng aliran Muar, terkenal dengan ketangkasan pukulan berjarak rapat.",
  },
  {
    id: "singa-berantai",
    name: "Persatuan Seni Silat Gayong Singa Berantai Malaysia",
    shortName: "Singa Berantai",
    category: "PERGURUAN_UTAMA",
    logoUrl: "/assets/silat-logos/persatuan-seni-silat-gayong-singa-berantai.png",
    state: "Selangor / Kebangsaan",
    country: "Malaysia",
    description: "Aliran persilatan berasaskan ketangkasan pahlawan dan senjata tradisional.",
  },
  {
    id: "ikaseka",
    name: "Pertubuhan Seni Silat Gerak Kilat (IKASEKA)",
    shortName: "IKASEKA",
    category: "PERGURUAN_UTAMA",
    logoUrl: "/assets/silat-logos/pertubuhan-seni-silat-gerak-kilat-ikaseka.png",
    state: "Kebangsaan",
    country: "Malaysia",
    description: "Aliran gerak kilat berfokuskan tindak balas pantas dan pertahanan taktikal.",
  },
  {
    id: "pikum",
    name: "Pertubuhan Seni Silat Ikatan Kalam Utama Malaysia",
    shortName: "PIKUM",
    category: "PERGURUAN_UTAMA",
    logoUrl: "/assets/silat-logos/pertubuhan-seni-silat-ikatan-kalam-utama-pikum.png",
    state: "Kebangsaan",
    country: "Malaysia",
    description: "Persatuan silat berteraskan warisan kerohanian dan bela diri Kalam Utama.",
  },
  {
    id: "kuntau-tekpi",
    name: "Pertubuhan Seni Silat Kuntau Tekpi Malaysia",
    shortName: "PSSKTM (Kuntau Tekpi)",
    category: "PERGURUAN_UTAMA",
    logoUrl: "/assets/silat-logos/pertubuhan-seni-silat-kuntau-tekpi-malaysia.png",
    state: "Kedah / Kebangsaan",
    country: "Malaysia",
    description: "Pakar penggunaan senjata cabang (Tekpi / Sai) dan pertahanan tangan kosong.",
  },
  {
    id: "silat-melayu-haqq",
    name: "Silat Melayu Haqq",
    shortName: "Silat Melayu Haqq",
    category: "PERGURUAN_UTAMA",
    logoUrl: "/assets/silat-logos/silat-melayu-haqq.png",
    state: "Kebangsaan",
    country: "Malaysia",
    description: "Perguruan Silat Melayu berlandaskan adab kerohanian dan beladiri tradisi.",
  },
  {
    id: "tempur-keris-pssgm",
    aliases: ["tempur-keris"],
    name: "Tempur Keris PSSGM",
    shortName: "Tempur Keris PSSGM",
    category: "PERGURUAN_UTAMA",
    logoUrl: "/assets/silat-logos/tempur-keris-pssgm.png",
    state: "Kebangsaan",
    country: "Malaysia",
    description: "Sayap kemahiran bertempur senjata keris tradisi di bawah keluarga Gayong.",
  },

  // 4. Badan Antarabangsa / PERSILAT
  {
    id: "persilat",
    name: "Persekutuan Pencak Silat Antarabangsa (PERSILAT)",
    shortName: "PERSILAT",
    category: "ANTARABANGSA",
    logoUrl: "/assets/silat-logos/persekutuan-pencak-silat-antarabangsa-persilat.png",
    country: "Antarabangsa",
    description: "Badan induk persilatan tertinggi dunia yang mengawal selia peraturan pertandingan silat antarabangsa.",
  },
  {
    id: "ipsi",
    name: "Ikatan Pencak Silat Indonesia (IPSI)",
    shortName: "IPSI",
    category: "ANTARABANGSA",
    logoUrl: "/assets/silat-logos/ikatan-pencak-silat-indonesia-ipsi.png",
    country: "Indonesia",
    description: "Badan induk persilatan kebangsaan Republik Indonesia, anggota pengasas PERSILAT.",
  },
  {
    id: "psht",
    name: "Persaudaraan Setia Hati Terate (PSHT)",
    shortName: "PSHT",
    category: "ANTARABANGSA",
    logoUrl: "/assets/silat-logos/persaudaraan-setia-hati-terate-psht.png",
    country: "Indonesia / Serantau",
    description: "Salah satu organisasi persilatan terbesar dengan jutaan warga pesilat di Nusantara.",
  },
  {
    id: "tapak-suci",
    name: "Perguruan Seni Beladiri Tapak Suci Putera Muhammadiyah",
    shortName: "Tapak Suci",
    category: "ANTARABANGSA",
    logoUrl: "/assets/silat-logos/perguruan-seni-beladiri-tapak-suci.png",
    country: "Indonesia / Global",
    description: "Perguruan silat ortodoks berasaskan sukan dan dakwah dengan cawangan antarabangsa.",
  },
  {
    id: "perisai-diri",
    name: "Keluarga Silat Nasional Indonesia Perisai Diri",
    shortName: "Perisai Diri",
    category: "ANTARABANGSA",
    logoUrl: "/assets/silat-logos/keluarga-silat-nasional-perisai-diri.png",
    country: "Indonesia / Global",
    description: "Terkenal dengan teknik 'Silat Serang Hindar' dan gerak langkah lentur berkesan.",
  },
  {
    id: "smi",
    name: "Perguruan Pencak Silat Satria Muda Indonesia",
    shortName: "Satria Muda Indonesia (SMI)",
    category: "ANTARABANGSA",
    logoUrl: "/assets/silat-logos/perguruan-pencak-silat-satria-muda-indonesia.png",
    country: "Indonesia / Serantau",
    description: "Perguruan pencak silat tanding dan seni dengan barisan atlet kompetitif berprestasi tinggi.",
  },
  {
    id: "merpati-putih",
    name: "Perguruan Pencak Silat Betako Merpati Putih",
    shortName: "Merpati Putih",
    category: "ANTARABANGSA",
    logoUrl: "/assets/silat-logos/perguruan-pencak-silat-merpati-putih.png",
    country: "Indonesia / Global",
    description: "Pakar teknik bela diri tangan kosong (Betako) dan olah pernafasan tenaga dalam.",
  },
  {
    id: "pagar-nusa",
    name: "Ikatan Pencak Silat Nahdlatul Ulama (IPSNU) Pagar Nusa",
    shortName: "Pagar Nusa",
    category: "ANTARABANGSA",
    logoUrl: "/assets/silat-logos/ikatan-pencak-silat-nahdlatul-ulama-pagar-nusa.png",
    country: "Indonesia / Serantau",
    description: "Wadah persilatan di bawah naungan Nahdlatul Ulama yang memelihara tradisi dan benteng pertiwi.",
  },
  {
    id: "gubug-remaja",
    name: "Perguruan Pencak Silat Gubug Remaja",
    shortName: "Gubug Remaja",
    category: "ANTARABANGSA",
    logoUrl: "/assets/silat-logos/perguruan-pencak-silat-gubug-remaja.png",
    country: "Indonesia / Serantau",
    description: "Perguruan pencak silat berasaskan persaudaraan dan pembinaan akhlak belia.",
  },

  // 5. Independent / Kelab Bebas
  {
    id: "INDEPENDENT",
    name: "Kelab / Perguruan Bebas (Independent / Other)",
    shortName: "Bebas / Bebas Gabungan",
    category: "INDEPENDENT",
    logoUrl: "/assets/fighterx/character-duo-hero-transparent.png",
    state: "Seluruh Malaysia",
    country: "Malaysia",
    description: "Pendaftaran terus untuk kelab bebas, akademi persendirian, atau aliran silat yang tidak disenaraikan.",
  },
];

/**
 * Bidirectional alias mapping between Directory IDs and Registration Affiliation IDs
 */
export const AFFILIATION_ID_ALIASES: Record<string, string> = {
  // Directory ID -> Registration Affiliation ID
  "persekutuan-silat-negeri-johor": "pesaka-johor",
  "rumpun-silat-sarawak": "pesaka-sarawak",
  "sendeng-malaysia": "silat-sendeng",
  "tempur-keris": "tempur-keris-pssgm",

  // Registration Affiliation ID -> Directory ID
  "pesaka-johor": "persekutuan-silat-negeri-johor",
  "pesaka-sarawak": "rumpun-silat-sarawak",
  "silat-sendeng": "sendeng-malaysia",
  "tempur-keris-pssgm": "tempur-keris",
};

export function resolveAffiliationId(idOrAlias: string): string {
  if (!idOrAlias) return "";
  const normalized = idOrAlias.trim().toLowerCase();
  const direct = SILAT_AFFILIATIONS.find((a) => a.id.toLowerCase() === normalized);
  if (direct) return direct.id;
  const canonicalId = AFFILIATION_ID_ALIASES[normalized];
  if (canonicalId) {
    const aliased = SILAT_AFFILIATIONS.find((a) => a.id.toLowerCase() === canonicalId.toLowerCase());
    if (aliased) return aliased.id;
  }
  return idOrAlias;
}

export function getAffiliationById(idOrAlias: string): SilatAffiliationOption | undefined {
  if (!idOrAlias) return undefined;
  const normalized = idOrAlias.trim().toLowerCase();
  const direct = SILAT_AFFILIATIONS.find((a) => a.id.toLowerCase() === normalized);
  if (direct) return direct;
  const canonicalId = AFFILIATION_ID_ALIASES[normalized];
  if (canonicalId) {
    return SILAT_AFFILIATIONS.find((a) => a.id.toLowerCase() === canonicalId.toLowerCase());
  }
  return undefined;
}
