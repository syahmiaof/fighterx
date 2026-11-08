export interface JurusPhase {
  title: string;
  range: string;
  count: number;
  weapon: string;
  description: string;
  keyTechniques: string[];
}

export interface SeniCategoryData {
  id: "tunggal" | "ganda" | "regu" | "solo-bebas";
  name: string;
  participants: string;
  duration: string;
  tagline: string;
  overview: string;
  rubrics: {
    kebenaran: string;
    kemantapan: string;
    deductions: string[];
  };
  phases?: JurusPhase[];
  highlights: string[];
}

export interface WeightClass {
  classCode: string;
  name: string;
  maleRange: string;
  femaleRange?: string;
  description: string;
}

export interface TargetZone {
  id: string;
  name: string;
  status: "LEGAL" | "PROHIBITED";
  pointsPunch: number;
  pointsKick: number;
  description: string;
  ruleNote: string;
}

export interface EquipmentItem {
  id: string;
  name: string;
  category: "SENI" | "OLAHRAGA";
  type: "WEAPON" | "PROTECTION" | "ATTIRE";
  specs: string;
  purpose: string;
  ruleCitation: string;
  imageUrl?: string;
}

export const SENI_CATEGORIES: SeniCategoryData[] = [
  {
    id: "tunggal",
    name: "Tunggal (Single Individual)",
    participants: "1 Orang Pesilat",
    duration: "Tepat 3:00 Minit",
    tagline: "100 Jurus Baku Tunggal: Gabungan Tangan Kosong, Golok & Toya",
    overview:
      "Kategori Tunggal memperlihatkan penguasaan teknikal tertinggi seorang pesilat solo yang mempersembahkan 100 pergerakan baku wajib PERSILAT dalam tempoh tepat 3 minit tanpa henti. Memerlukan ketepatan geometri, keseimbangan tubuh, dan peralihan senjata yang lancar.",
    rubrics: {
      kebenaran:
        "Nilai Kebenaran (Maksimum 100 mata / 9.90 skala): Menilai ketepatan susunan gerak 1 hingga 100, keteguhan kuda-kuda, sudut serangan, dan arah pandangan. Pemotongan -0.01 mata bagi setiap kesilapan atau pergerakan tertinggal.",
      kemantapan:
        "Nilai Kemantapan & Penghayatan: Menilai daya letus (power snap), irama pergerakan, kelancaran peralihan senjata, penghayatan jiwa pesilat, dan ketahanan stamina sehingga saat terakhir.",
      deductions: [
        "Kurang atau lebih masa persembahan daripada had 3 minit (-0.10 hingga -0.50 mata).",
        "Senjata (Golok atau Toya) terlepas atau terjatuh ke atas matras (-0.50 mata penalti berat).",
        "Terpijak atau melangkah keluar dari perimeter gelanggang 10m x 10m (-0.05 mata).",
        "Kecacatan pakaian: Tengkolok atau samping terjatuh ke matras (-0.05 mata).",
        "Menggunakan senjata yang tidak mematuhi spesifikasi rasmi PERSILAT.",
      ],
    },
    phases: [
      {
        title: "Fasa 1: Tangan Kosong",
        range: "Jurus 1 hingga 40",
        count: 40,
        weapon: "Tiada (Empty Hand)",
        description:
          "Memperagakan 7 rangkaian jurus asas tangan kosong merangkumi keteguhan kuda-kuda (depan, tengah, samping, silang), elakan lincah, pukulan lurus, sodok, tebak, tangkisan rapat, dan tendangan depan/sabit/T.",
        keyTechniques: [
          "Kuda-kuda Rendah & Pasang Mantap",
          "Kombinasi Pukulan & Tangkisan Lurus",
          "Tendangan Sabit & Jejeg Berimbang",
          "Pola Langkah Zig-Zag & Silang",
        ],
      },
      {
        title: "Fasa 2: Senjata Pendek (Golok)",
        range: "Jurus 41 hingga 70",
        count: 30,
        weapon: "Golok / Parang Tradisional",
        description:
          "Peralihan dinamik mengeluarkan golok dari sarung. Mengaplikasikan teknik libasan bilah tajam, tetakan pepet, tikaman berarah, putaran bilah pelindung dada, dan kawalan sarung golok dengan tangan bertentangan.",
        keyTechniques: [
          "Cabut Senjata Pantas Tanpa Sentakan",
          "Tetakan Pepet & Libasan Belakang",
          "Pusingan Golok Mengelilingi Pergelangan",
          "Keseimbangan Melangkah Bersama Bilah",
        ],
      },
      {
        title: "Fasa 3: Senjata Panjang (Toya)",
        range: "Jurus 71 hingga 100",
        count: 30,
        weapon: "Toya / Tongkat Rotan (150-180cm)",
        description:
          "Mengambil toya rotan dan melaksanakan 30 pergerakan bertongkat berkelajuan tinggi merangkumi putaran helikopter, libasan lantai menyapu kaki, tusukan dua hujung, blok silang atas, dan penutup hormat tradisi.",
        keyTechniques: [
          "Putaran Helikopter Dua Belah Tangan",
          "Tusukan Hujung Tongkat Berpola",
          "Libasan Rendah Penyapu Gelanggang",
          "Sikap Hormat Pengunci 3 Minit",
        ],
      },
    ],
    highlights: [
      "100 pergerakan standard yang seragam di seluruh dunia.",
      "Peralihan lancar dari tangan kosong -> golok -> toya.",
      "Toleransi masa yang amat ketat (tepat 180 saat).",
    ],
  },
  {
    id: "ganda",
    name: "Ganda (Double Choreographed Fight)",
    participants: "2 Orang Pesilat (Pasangan)",
    duration: "Tepat 3:00 Minit",
    tagline: "Pertarungan Koreografi Dramatik: Tangan Kosong, Senjata & Lucutan",
    overview:
      "Kategori Ganda memaparkan pertarungan koreografi antara dua pesilat yang dirancang rapi dengan tahap realisme tinggi. Menggabungkan serangan pantas, tangkisan, bantingan ekstrem, dan teknik melucutkan senjata (disarming) secara selamat dan penuh estetika seni tempur.",
    rubrics: {
      kebenaran:
        "Kualiti Teknik & Koreografi: Menilai ketulenan teknik beladiri silat, kekayaan variasi serangan dan tangkisan, logik pertarungan realistik, dan kemahiran melucut senjata.",
      kemantapan:
        "Realisme, Tenaga & Harmoni: Menilai penghayatan ekspresi bertempur sebenar, keserasian tempo sesama pasangan, keberanian aksi jatuhan, dan impak dramatik kepada penonton dan juri.",
      deductions: [
        "Senjata terjatuh di luar plot koreografi (senjata terjatuh secara tidak sengaja: -0.50 mata).",
        "Persembahan terlebih atau terkurang daripada had 3:00 minit.",
        "Senjata mencederakan pasangan akibat kecuaian teknikal (disqualified jika luka serius).",
        "Melangkah keluar gelanggang tanpa unsur koreografi berterusan.",
      ],
    },
    highlights: [
      "Menggunakan senjata tradisional seperti Golok, Toya, Keris, Tekpi, atau Pisau.",
      "Aksi lucut senjata (disarming) yang menuntut kejituan mikro-saat.",
      "Bantingan dan jatuhan akrobatik yang selamat tetapi berimpak tinggi.",
    ],
  },
  {
    id: "regu",
    name: "Regu (Team Synchronized Trio)",
    participants: "3 Orang Pesilat (Trio)",
    duration: "Tepat 3:00 Minit",
    tagline: "Sinkronisasi Mutlak 3 Pesilat: 100 Gerak Tangan Kosong Serentak",
    overview:
      "Kategori Regu menyaksikan tiga orang pesilat mempersembahkan 100 jurus baku tangan kosong dalam keseragaman mutlak (unison). Setiap sudut genggaman, ketinggian tendangan, bunyi hembusan nafas, dan peralihan tapak kaki mesti sejajar tanpa jurang satu milisaat pun.",
    rubrics: {
      kebenaran:
        "Ketepatan Geometri Tiga Pesilat: Menilai keseragaman 100 pergerakan baku wajib tanpa perbezaan sudut antara ketiga-tiga peserta di hadapan dan belakang.",
      kemantapan:
        "Keseragaman (Synchronization), Irama & Jiwa: Menilai kesepaduan tempo gerak, daya letus serentak yang menggegarkan gelanggang, dan disiplin barisan formasi.",
      deductions: [
        "Ketidaksamarataan gerak (seorang pesilat terlewat atau mendahului gerak).",
        "Penyimpangan jurus atau susunan salah oleh mana-mana pesilat.",
        "Kecacatan pakaian seragam atau tengkolok senget/terlucut.",
        "Pelanggaran had masa persembahan 3 minit.",
      ],
    },
    highlights: [
      "Hanya menggunakan tangan kosong tanpa senjata.",
      "Ujian disiplin mental, persefahaman telepati dan latihan beribu jam.",
      "Formasi segi tiga dinamik yang tidak boleh bercelaru.",
    ],
  },
  {
    id: "solo-bebas",
    name: "Solo Bebas (Creative Free Solo)",
    participants: "1 Orang Pesilat Solo",
    duration: "Tepat 3:00 Minit",
    tagline: "Kreativiti Artistik Melayu: Senjata Tradisi Nusantara & Iringan Muzik",
    overview:
      "Kategori terbaharu dalam sukan silat moden yang memberi kebebasan koreografi artistik penuh kepada pesilat solo. Menampilkan gabungan jurus perguruan tradisi, kepelbagaian senjata warisan Nusantara (Keris, Badik, Tekpi, Sewar), kostum warisan indah, dan iringan muzik gamelan/gendang silat rasmi.",
    rubrics: {
      kebenaran:
        "Kreativiti & Kekayaan Khazanah Seni: Menilai originaliti gubahan koreografi, teknik pengawalan senjata tradisi yang rumit, dan keaslian kaedah persilatan Melayu.",
      kemantapan:
        "Penghayatan Estetika & Keserasian Muzik: Menilai keserasian gerak silat dengan rentak gendang silat/serunai, ekspresi wajah pesilat, daya tarik panggung, dan ketangkasan fizikal.",
      deductions: [
        "Senjata terlepas dari tangan dan jatuh ke matras (-0.50 mata).",
        "Masa melebihi atau kurang daripada 3 minit.",
        "Keluar dari gelanggang pertandingan.",
        "Senjata berbahaya tidak menepati peraturan keselamatan PERSILAT.",
      ],
    },
    highlights: [
      "Meraikan keunikan pelbagai aliran perguruan silat Nusantara.",
      "Pilihan senjata tradisi: Keris, Tekpi, Pedang, Parang, Badik, Kerambit.",
      "Diiringi muzik tradisional yang menyemarakkan semangat pahlawan.",
    ],
  },
];

export const WEIGHT_CLASSES: WeightClass[] = [
  {
    classCode: "Bawah 45 kg",
    name: "Kelas Bawah 45",
    maleRange: "< 45.0 kg",
    femaleRange: "< 45.0 kg",
    description: "Kategori paling ringan, menuntut kepantasan langkah kilat dan serangan balas tangkas.",
  },
  {
    classCode: "Kelas A",
    name: "Kelas A (Senior)",
    maleRange: "45.0 kg - 50.0 kg",
    femaleRange: "45.0 kg - 50.0 kg",
    description: "Pertarungan berintensiti tinggi dengan kepantasan kombinasi pukulan dan tendangan sabit.",
  },
  {
    classCode: "Kelas B",
    name: "Kelas B (Senior)",
    maleRange: "50.0 kg - 55.0 kg",
    femaleRange: "50.0 kg - 55.0 kg",
    description: "Kategori paling kompetitif di peringkat antarabangsa; imbangan ideal kepantasan dan kuasa.",
  },
  {
    classCode: "Kelas C",
    name: "Kelas C (Senior)",
    maleRange: "55.0 kg - 60.0 kg",
    femaleRange: "55.0 kg - 60.0 kg",
    description: "Kategori utama Sukan SEA dan Kejohanan Dunia; dominasi teknik tangkapan dan sapuan rebah.",
  },
  {
    classCode: "Kelas D",
    name: "Kelas D (Senior)",
    maleRange: "60.0 kg - 65.0 kg",
    femaleRange: "60.0 kg - 65.0 kg",
    description: "Pertarungan taktikal dengan aplikasi bantingan pinggang dan tendangan jejeg bertenaga.",
  },
  {
    classCode: "Kelas E",
    name: "Kelas E (Senior)",
    maleRange: "65.0 kg - 70.0 kg",
    femaleRange: "65.0 kg - 70.0 kg",
    description: "Kuasa hentaman padu pada vest pelindung dada dan teknik kunci tangkapan 5 saat.",
  },
  {
    classCode: "Kelas F",
    name: "Kelas F (Senior)",
    maleRange: "70.0 kg - 75.0 kg",
    femaleRange: "70.0 kg - 75.0 kg",
    description: "Kategori pertengahan berat dengan penekanan daya tahan anaerobik dan kawalan gelanggang.",
  },
  {
    classCode: "Kelas G",
    name: "Kelas G (Senior)",
    maleRange: "75.0 kg - 80.0 kg",
    femaleRange: "75.0 kg - 80.0 kg",
    description: "Kategori berat dengan kuasa bantingan maksima dan pertahanan badan yang tegap.",
  },
  {
    classCode: "Kelas H",
    name: "Kelas H (Senior)",
    maleRange: "80.0 kg - 85.0 kg",
    femaleRange: "80.0 kg - 85.0 kg",
    description: "Impak serangan tinggi; pesilat memerlukan ketahanan otot teras dan pernafasan padu.",
  },
  {
    classCode: "Kelas I & J",
    name: "Kelas I & J (Lelaki)",
    maleRange: "85.0 kg - 95.0 kg",
    femaleRange: "Tidak dipertandingkan",
    description: "Kategori berat khusus lelaki; pertembungan kuasa fizik dan jatuhan berat gelanggang.",
  },
  {
    classCode: "Bebas (Open 1 & 2)",
    name: "Kelas Terbuka (Open)",
    maleRange: "Open 1: 95-110 kg | Open 2: > 110 kg",
    femaleRange: "> 85.0 kg",
    description: "Kategori divisyen terbuka tanpa had berat maksima, menguji ketahanan fizikal mutlak.",
  },
];

export const TARGET_ZONES: TargetZone[] = [
  {
    id: "dada",
    name: "Dada (Chest)",
    status: "LEGAL",
    pointsPunch: 1,
    pointsKick: 2,
    description: "Kawasan permukaan hadapan vest pelindung dada di atas paras pusat.",
    ruleNote: "Pukulan lurus atau tendangan padu yang menggegarkan vest mengikut kaedah pencak silat.",
  },
  {
    id: "rusuk",
    name: "Rusuk Kiri & Kanan (Flanks)",
    status: "LEGAL",
    pointsPunch: 1,
    pointsKick: 2,
    description: "Kawasan rusuk sisi badan yang dilindungi oleh padding vest pelindung.",
    ruleNote: "Sasaran utama bagi tendangan sabit (roundhouse kick) dan pukulan sisi.",
  },
  {
    id: "abdomen",
    name: "Abdomen (Perut Atas)",
    status: "LEGAL",
    pointsPunch: 1,
    pointsKick: 2,
    description: "Kawasan perut atas tali pinggang (bengkung) yang diliputi vest pelindung.",
    ruleNote: "Sasaran efektif bagi tendangan lurus (front kick) dan jejeg (stomp).",
  },
  {
    id: "belakang",
    name: "Belakang Badan (Back Vest)",
    status: "LEGAL",
    pointsPunch: 1,
    pointsKick: 2,
    description: "Bahagian belakang torso yang dilindungi oleh vest pelindung badan.",
    ruleNote: "Sah mendapat mata, namun serangan sengaja ke tulang belakang (vertebra) dilarang keras.",
  },
  {
    id: "kepala",
    name: "Kepala & Muka (Head / Face)",
    status: "PROHIBITED",
    pointsPunch: 0,
    pointsKick: 0,
    description: "Zon larangan mutlak merangkumi muka, telinga, leher dan tengkorak.",
    ruleNote: "Pelanggaran Berat (Severe Foul): Peringatan 1 (-5 mata), Peringatan 2 (-10 mata) atau Diskualifikasi terus.",
  },
  {
    id: "leher",
    name: "Leher & Kerongkong (Neck / Throat)",
    status: "PROHIBITED",
    pointsPunch: 0,
    pointsKick: 0,
    description: "Zon anatomi leher, halkum dan pangkal tengkuk.",
    ruleNote: "Dilarang memukul, mencekik atau mengunci leher. Menyebabkan tindakan disiplin segera.",
  },
  {
    id: "kemaluan",
    name: "Kemaluan / Celah Kangkang (Groin)",
    status: "PROHIBITED",
    pointsPunch: 0,
    pointsKick: 0,
    description: "Zon sulit bawah pelvis.",
    ruleNote: "Pelanggaran Berat. Jika lawan cedera dan tidak dapat meneruskan pertarungan, pesilat dibatalkan penyertaan.",
  },
  {
    id: "lutut",
    name: "Sendi Lutut (Knee Joint)",
    status: "PROHIBITED",
    pointsPunch: 0,
    pointsKick: 0,
    description: "Tendangan pematah sendi lutut (hyperextension stomp).",
    ruleNote: "Tindakan berbahaya yang dilarang bagi melindungi keselamatan dan karier atlet.",
  },
];

export const EQUIPMENT_LIST: EquipmentItem[] = [
  // Seni Equipment
  {
    id: "golok-seni",
    name: "Golok Pertandingan (Machete)",
    category: "SENI",
    type: "WEAPON",
    specs: "Bilah keluli tidak berkarat (tumpul), panjang 30-40cm, lebar 2.5-4cm. Berat seimbang dengan hulu kayu kukuh.",
    purpose: "Digunakan dalam kategori Tunggal (jurus 41-70), Ganda, dan Solo Bebas untuk teknik libasan dan tetakan.",
    ruleCitation: "PERSILAT 2026 Peraturan Teknikal Seni - Bab Peralatan Rasmi",
  },
  {
    id: "toya-seni",
    name: "Toya Rotan (Rattan Staff)",
    category: "SENI",
    type: "WEAPON",
    specs: "Rotan asli terpilih berdiameter 2.5-3.5cm, panjang 150-180cm mengikut ketinggian rasmi pesilat.",
    purpose: "Digunakan dalam Tunggal (jurus 71-100) dan Ganda bagi putaran kelajuan tinggi dan libasan penyapu.",
    ruleCitation: "PERSILAT 2026 Peraturan Teknikal Seni - Bab Peralatan Rasmi",
  },
  {
    id: "pakaian-seni",
    name: "Pakaian Silat Seni Tradisi",
    category: "SENI",
    type: "ATTIRE",
    specs: "Baju hitam potongan Melayu asli lengkap dengan Samping Songket tenunan tradisi dan Tengkolok berikat kemas.",
    purpose: "Memelihara maruah dan warisan persilatan Melayu; mestilah kemas agar tidak terlucut sewaktu persembahan.",
    ruleCitation: "PERSILAT 2026 Kod Pakaian Seni Baku & Solo Bebas",
  },

  // Olahraga Equipment
  {
    id: "body-protector",
    name: "Pelindung Badan (Body Protector)",
    category: "OLAHRAGA",
    type: "PROTECTION",
    specs: "Busa EVA berketumpatan tinggi bersalut PU tahan lasak. Disediakan dalam sudut Merah dan Biru dengan tali pengikat sisi.",
    purpose: "Menyerap daya hentaman pukulan dan tendangan ke bahagian dada, rusuk, dan belakang badan atlet.",
    ruleCitation: "PERSILAT 2026 Standard Peralatan Keselamatan Tanding",
  },
  {
    id: "groin-guard",
    name: "Pelindung Kemaluan (Groin Guard)",
    category: "OLAHRAGA",
    type: "PROTECTION",
    specs: "Cawan polimer tegar kalis pecah dengan pelapik busa lembut dan tali sokongan elastik. Wajib bagi lelaki dan wanita.",
    purpose: "Melindungi kawasan sensitif pelvis daripada sebarang tendangan atau hentaman tidak sengaja.",
    ruleCitation: "PERSILAT 2026 Peraturan Wajib Tanding - Bab Pemeriksaan Atlet",
  },
  {
    id: "shin-guard",
    name: "Pelindung Tulang Kering & Kura Kaki",
    category: "OLAHRAGA",
    type: "PROTECTION",
    specs: "Sarung pelindung busa lembut berlapik kain elastik hitam yang dipakai di bahagian dalam seluar silat.",
    purpose: "Melindungi tulang tibia dan metatarsal kaki semasa melaksanakan tendangan sabit dan menyekat serangan.",
    ruleCitation: "PERSILAT 2026 Standard Pelindung Kaki Rasmi",
  },
  {
    id: "gumshield",
    name: "Pelindung Gigi (Gumshield / Mouthguard)",
    category: "OLAHRAGA",
    type: "PROTECTION",
    specs: "Silikon termoplastik gred perubatan yang dibentuk mengikut susunan gigi pesilat. Tidak berwarna cerah merah.",
    purpose: "Wajib bagi atlet bertindik/pendakap gigi (braces); disyorkan untuk semua atlet tanding bagi melindungi rahang.",
    ruleCitation: "PERSILAT 2026 Panduan Perubatan Pertandingan",
  },
  {
    id: "baju-tanding",
    name: "Pakaian Silat Tanding (Baju Silat)",
    category: "OLAHRAGA",
    type: "ATTIRE",
    specs: "Kain kapas hitam tahan lasak tanpa butang logam atau zip tajam. Lencana persatuan di dada kiri dan jalur bendera di lengan.",
    purpose: "Membolehkan pergerakan bebas, cengkaman tangkapan selamat, dan perlawanan tanpa risiko calar perkakasan.",
    ruleCitation: "PERSILAT 2026 Kod Pakaian Tanding",
  },
];

export const COMPARISON_MATRIX = [
  {
    feature: "Objektif Utama",
    seni: "Menghidupkan keindahan seni warisan, kejituan teknikal 100 jurus baku, ketangkasan senjata, dan penghayatan jiwa pesilat.",
    olahraga: "Pertarungan sukan sentuhan penuh berjarak kiraan mata, menguji kepantasan tindak balas, kekuatan bantingan, dan taktik gelanggang.",
  },
  {
    feature: "Kategori Bertanding",
    seni: "Tunggal (Solo), Ganda (Pasangan Koreografi), Regu (Trio Sinkronisasi), Solo Bebas (Artistik Tradisi).",
    olahraga: "Divisyen Berat Badan: Kelas A (45-50kg) hingga Kelas J (90-95kg) dan Kelas Terbuka (Open).",
  },
  {
    feature: "Format & Masa Perlawanan",
    seni: "Satu persembahan berterusan selama tepat 3:00 minit (180 saat) dengan pemotongan mata bagi setiap saat terkurang/terlebih.",
    olahraga: "3 pusingan x 2:00 minit waktu bersih (actual combat time) diselang 1:00 minit rehat antara setiap pusingan.",
  },
  {
    feature: "Kaedah Penilaian & Skor",
    seni: "Panel juri menilai Nilai Kebenaran (ketepatan geometri & urutan gerak) dan Nilai Kemantapan (daya letus, irama & jiwa).",
    olahraga: "Sistem digital masa nyata: Pukulan (1 mata), Tendangan (2 mata), Jatuhan/Bantingan (3 mata) + Cabaran VAR.",
  },
  {
    feature: "Peralatan & Senjata",
    seni: "Golok tradisional tumpul, Toya rotan 150-180cm, Keris, Tekpi, Samping Songket dan Tengkolok warisan.",
    olahraga: "Pelindung badan (vest merah/biru), groin guard, shin guard, mouthguard, baju hitam tanding standard.",
  },
  {
    feature: "Keperluan Fizikal & Fisiologi",
    seni: "Kelenturan ekstrem, imbangan statik dan dinamik, ketahanan isometrik, memori motor kompleks, dan nafas sekata.",
    olahraga: "Kecergasan kardiovaskular anaerobik laktat, daya letus sepakan, kuasa cengkaman bantingan, dan kelajuan refleks.",
  },
  {
    feature: "Kawasan Sasaran",
    seni: "Seluruh gelanggang 10m x 10m untuk pergerakan artistik dan formasi langkah berirama.",
    olahraga: "Sasaran mata sah hanya pada vest pelindung (dada, rusuk, belakang, abdomen). Kepala dan kemaluan dilarang sama sekali.",
  },
];
