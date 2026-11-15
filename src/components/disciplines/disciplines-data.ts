export interface JurusPhase {
  title: string;
  titleEn?: string;
  range: string;
  rangeEn?: string;
  count: number;
  weapon: string;
  weaponEn?: string;
  description: string;
  descriptionEn?: string;
  keyTechniques: string[];
  keyTechniquesEn?: string[];
}

export interface SeniCategoryData {
  id: "tunggal" | "ganda" | "regu" | "solo-bebas";
  name: string;
  nameEn?: string;
  participants: string;
  participantsEn?: string;
  duration: string;
  durationEn?: string;
  tagline: string;
  taglineEn?: string;
  overview: string;
  overviewEn?: string;
  rubrics: {
    kebenaran: string;
    kebenaranEn?: string;
    kemantapan: string;
    kemantapanEn?: string;
    deductions: string[];
    deductionsEn?: string[];
  };
  phases?: JurusPhase[];
  highlights: string[];
  highlightsEn?: string[];
}

export interface WeightClass {
  classCode: string;
  classCodeEn?: string;
  name: string;
  nameEn?: string;
  maleRange: string;
  femaleRange?: string;
  description: string;
  descriptionEn?: string;
}

export interface TargetZone {
  id: string;
  name: string;
  nameEn?: string;
  status: "LEGAL" | "PROHIBITED";
  pointsPunch: number;
  pointsKick: number;
  description: string;
  descriptionEn?: string;
  ruleNote: string;
  ruleNoteEn?: string;
}

export interface EquipmentItem {
  id: string;
  name: string;
  nameEn?: string;
  category: "SENI" | "OLAHRAGA";
  type: "WEAPON" | "PROTECTION" | "ATTIRE";
  specs: string;
  specsEn?: string;
  purpose: string;
  purposeEn?: string;
  ruleCitation: string;
  ruleCitationEn?: string;
  imageUrl?: string;
}

export const SENI_CATEGORIES: SeniCategoryData[] = [
  {
    id: "tunggal",
    name: "Tunggal",
    nameEn: "Solo",
    participants: "1 Orang Pesilat",
    participantsEn: "1 Solo Athlete",
    duration: "Tepat 3:00 Minit",
    durationEn: "Exactly 3:00 Minutes",
    tagline: "100 Jurus Baku Tunggal: Gabungan Tangan Kosong, Golok & Toya",
    taglineEn: "100 Standardized Solo Forms: Barehand, Machete & Rattan Staff",
    overview:
      "Kategori Tunggal memperlihatkan penguasaan teknikal tertinggi seorang pesilat solo yang mempersembahkan 100 pergerakan baku wajib PERSILAT dalam tempoh tepat 3 minit tanpa henti. Memerlukan ketepatan geometri, keseimbangan tubuh, dan peralihan senjata yang lancar.",
    overviewEn:
      "The Solo category showcases the pinnacle of technical mastery as a single athlete performs 100 mandatory PERSILAT standardized movements in exactly 3 minutes without pause. It demands geometric precision, bodily balance, and seamless weapon transitions.",
    rubrics: {
      kebenaran:
        "Nilai Kebenaran (Maksimum 100 mata / 9.90 skala): Menilai ketepatan susunan gerak 1 hingga 100, keteguhan kuda-kuda, sudut serangan, dan arah pandangan. Pemotongan -0.01 mata bagi setiap kesilapan atau pergerakan tertinggal.",
      kebenaranEn:
        "Accuracy Standard (Max 100 pts / 9.90 scale): Evaluates precision of movements 1 to 100, stance stability, strike angles, and focus. -0.01 pt penalty per mistake or omitted movement.",
      kemantapan:
        "Nilai Kemantapan & Penghayatan: Menilai daya letus, irama pergerakan, kelancaran peralihan senjata, penghayatan jiwa pesilat, dan ketahanan stamina sehingga saat terakhir.",
      kemantapanEn:
        "Firmness & Expression: Evaluates explosive power, motion rhythm, weapon transition fluidity, warrior spirit, and cardiovascular stamina until the final second.",
      deductions: [
        "Kurang atau lebih masa persembahan daripada had 3 minit (-0.10 hingga -0.50 mata).",
        "Senjata (Golok atau Toya) terlepas atau terjatuh ke atas matras (-0.50 mata penalti berat).",
        "Terpijak atau melangkah keluar dari perimeter gelanggang 10m x 10m (-0.05 mata).",
        "Kecacatan pakaian: Tengkolok atau samping terjatuh ke matras (-0.05 mata).",
        "Menggunakan senjata yang tidak mematuhi spesifikasi rasmi PERSILAT.",
      ],
      deductionsEn: [
        "Performance time under or over the 3-minute limit (-0.10 to -0.50 pts).",
        "Weapon (machete or staff) dropped onto the arena mat (-0.50 pt severe penalty).",
        "Stepping outside the 10m x 10m arena boundary perimeter (-0.05 pt).",
        "Attire malfunction: Headdress or sash falling onto the mat (-0.05 pt).",
        "Employing non-compliant equipment violating official PERSILAT specifications.",
      ],
    },
    phases: [
      {
        title: "Fasa 1: Tangan Kosong",
        titleEn: "Phase 1: Barehand",
        range: "Jurus 1 hingga 40",
        rangeEn: "Movements 1 to 40",
        count: 40,
        weapon: "Tiada Senjata",
        weaponEn: "Unarmed / Barehand",
        description:
          "Memperagakan 7 rangkaian jurus asas tangan kosong merangkumi keteguhan kuda-kuda, elakan lincah, pukulan lurus, sodok, tebak, tangkisan rapat, dan pelbagai tendangan.",
        descriptionEn:
          "Demonstrates 7 core barehand sequences encompassing solid stances, agile evasions, straight punches, palm thrusts, close blocks, and versatile kicks.",
        keyTechniques: [
          "Kuda-kuda Rendah & Pasang Mantap",
          "Kombinasi Pukulan & Tangkisan Lurus",
          "Tendangan Sabit & Jejeg Berimbang",
          "Pola Langkah Zig-Zag & Silang",
        ],
        keyTechniquesEn: [
          "Low Solid Stances & Stable Guard",
          "Linear Punch & Block Combinations",
          "Balanced Crescent & Stomp Kicks",
          "Zig-zag & Cross Stepping Patterns",
        ],
      },
      {
        title: "Fasa 2: Senjata Pendek (Golok)",
        titleEn: "Phase 2: Short Weapon (Machete)",
        range: "Jurus 41 hingga 70",
        rangeEn: "Movements 41 to 70",
        count: 30,
        weapon: "Golok Tradisional",
        weaponEn: "Traditional Machete",
        description:
          "Peralihan dinamik mengeluarkan golok dari sarung. Mengaplikasikan teknik libasan bilah tajam, tetakan pepet, tikaman berarah, putaran bilah pelindung dada, dan kawalan sarung.",
        descriptionEn:
          "Dynamic unsheathing transition. Executes swift blade slashes, close hacking, directed thrusts, chest-guarding spins, and off-hand scabbard control.",
        keyTechniques: [
          "Cabut Senjata Pantas Tanpa Sentakan",
          "Tetakan Pepet & Libasan Belakang",
          "Pusingan Golok Mengelilingi Pergelangan",
          "Keseimbangan Melangkah Bersama Bilah",
        ],
        keyTechniquesEn: [
          "Smooth Rapid Weapon Unsheathing",
          "Close Chops & Reverse Slashes",
          "Wrist-centered Blade Rotations",
          "Balanced Footwork with Blade Trajectory",
        ],
      },
      {
        title: "Fasa 3: Senjata Panjang (Toya)",
        titleEn: "Phase 3: Long Weapon (Rattan Staff)",
        range: "Jurus 71 hingga 100",
        rangeEn: "Movements 71 to 100",
        count: 30,
        weapon: "Toya Rotan (150-180cm)",
        weaponEn: "Rattan Staff (150-180cm)",
        description:
          "Mengambil toya rotan dan melaksanakan 30 pergerakan bertongkat berkelajuan tinggi merangkumi putaran helikopter, libasan lantai, tusukan dua hujung, dan penutup hormat.",
        descriptionEn:
          "Draws the rattan staff to perform 30 high-velocity movements including helicopter spins, ground sweep sweeps, dual-ended thrusts, and final ceremonial salutes.",
        keyTechniques: [
          "Putaran Helikopter Dua Belah Tangan",
          "Tusukan Hujung Tongkat Berpola",
          "Libasan Rendah Penyapu Gelanggang",
          "Sikap Hormat Pengunci 3 Minit",
        ],
        keyTechniquesEn: [
          "Dual-handed Overhead Helicopter Spins",
          "Patterned Dual-ended Staff Thrusts",
          "Low Ground Sweeping Strikes",
          "3-Minute Concluding Ceremonial Bow",
        ],
      },
    ],
    highlights: [
      "100 pergerakan standard yang seragam di seluruh dunia.",
      "Peralihan lancar dari tangan kosong -> golok -> toya.",
      "Toleransi masa yang amat ketat (tepat 180 saat).",
    ],
    highlightsEn: [
      "100 globally standardized movements recognized by PERSILAT.",
      "Fluid transitions from barehand -> machete -> rattan staff.",
      "Strict timing window (exactly 180 seconds).",
    ],
  },
  {
    id: "ganda",
    name: "Ganda",
    nameEn: "Choreographed Doubles",
    participants: "2 Orang Pesilat",
    participantsEn: "2 Paired Athletes",
    duration: "Tepat 3:00 Minit",
    durationEn: "Exactly 3:00 Minutes",
    tagline: "Pertarungan Koreografi Dramatik: Tangan Kosong, Senjata & Lucutan",
    taglineEn: "Dramatic Choreographed Combat: Barehand, Weapons & Disarms",
    overview:
      "Kategori Ganda memaparkan pertarungan koreografi antara dua pesilat yang dirancang rapi dengan tahap realisme tinggi. Menggabungkan serangan pantas, tangkisan, bantingan ekstrem, dan teknik melucutkan senjata secara selamat dan penuh estetika seni tempur.",
    overviewEn:
      "The Choreographed Doubles category presents highly realistic choreographed combat between two athletes. It weaves rapid strikes, parries, extreme takedowns, and disarming techniques with martial aesthetic elegance.",
    rubrics: {
      kebenaran:
        "Kualiti Teknik & Koreografi: Menilai ketulenan teknik beladiri silat, kekayaan variasi serangan dan tangkisan, logik pertarungan realistik, dan kemahiran melucut senjata.",
      kebenaranEn:
        "Technical & Choreographic Quality: Evaluates martial authenticity, richness of striking/blocking variations, realistic combat logic, and disarming mastery.",
      kemantapan:
        "Realisme, Tenaga & Harmoni: Menilai penghayatan ekspresi bertempur sebenar, keserasian tempo sesama pasangan, keberanian aksi jatuhan, dan impak dramatik.",
      kemantapanEn:
        "Realism, Power & Harmony: Evaluates authentic combat expression, partner tempo synchrony, confident acrobatic falls, and dramatic spectator impact.",
      deductions: [
        "Senjata terjatuh di luar plot koreografi (-0.50 mata).",
        "Persembahan terlebih atau terkurang daripada had 3:00 minit.",
        "Senjata mencederakan pasangan akibat kecuaian teknikal.",
        "Melangkah keluar gelanggang tanpa unsur koreografi berterusan.",
      ],
      deductionsEn: [
        "Weapon dropped outside choreographed storyline (-0.50 pt).",
        "Performance time under or over the 3:00 minute threshold.",
        "Injury inflicted upon partner due to technical negligence.",
        "Stepping out of bounds without narrative continuity.",
      ],
    },
    highlights: [
      "Menggunakan senjata tradisional seperti Golok, Toya, Keris, Tekpi, atau Pisau.",
      "Aksi lucut senjata yang menuntut kejituan mikro-saat.",
      "Bantingan dan jatuhan akrobatik yang selamat tetapi berimpak tinggi.",
    ],
    highlightsEn: [
      "Showcases traditional weapons such as Machete, Staff, Keris, Tekpi, or Knife.",
      "Precision disarming requiring split-second execution.",
      "Safe high-impact acrobatic throws and falls.",
    ],
  },
  {
    id: "regu",
    name: "Regu",
    nameEn: "Synchronised Trio",
    participants: "3 Orang Pesilat",
    participantsEn: "3 Synchronised Athletes",
    duration: "Tepat 3:00 Minit",
    durationEn: "Exactly 3:00 Minutes",
    tagline: "Sinkronisasi Mutlak 3 Pesilat: 100 Gerak Tangan Kosong Serentak",
    taglineEn: "Absolute Trio Synchronization: 100 Barehand Movements in Unison",
    overview:
      "Kategori Regu menyaksikan tiga orang pesilat mempersembahkan 100 jurus baku tangan kosong dalam keseragaman mutlak. Setiap sudut genggaman, ketinggian tendangan, bunyi hembusan nafas, dan peralihan tapak kaki mesti sejajar tanpa jurang satu milisaat pun.",
    overviewEn:
      "The Synchronised Trio category features three athletes performing the 100 standardized barehand movements in total unison. Every fist angle, kick elevation, breathing cadence, and footwork transition must align without a millisecond of disparity.",
    rubrics: {
      kebenaran:
        "Ketepatan Geometri Tiga Pesilat: Menilai keseragaman 100 pergerakan baku wajib tanpa perbezaan sudut antara ketiga-tiga peserta di hadapan dan belakang.",
      kebenaranEn:
        "Geometric Alignment of Trio: Evaluates strict uniformity of 100 compulsory forms with zero angular discrepancy among all three athletes.",
      kemantapan:
        "Keseragaman, Irama & Jiwa: Menilai kesepaduan tempo gerak, daya letus serentak yang menggegarkan gelanggang, dan disiplin barisan formasi.",
      kemantapanEn:
        "Synchronization, Rhythm & Spirit: Evaluates harmonious tempo, simultaneous explosive power, and precise geometric formation discipline.",
      deductions: [
        "Ketidaksamarataan gerak (seorang pesilat terlewat atau mendahului gerak).",
        "Penyimpangan jurus atau susunan salah oleh mana-mana pesilat.",
        "Kecacatan pakaian seragam atau tengkolok senget/terlucut.",
        "Pelanggaran had masa persembahan 3 minit.",
      ],
      deductionsEn: [
        "Desynchronization (an athlete trailing or leading ahead).",
        "Form deviation or incorrect order by any member.",
        "Attire defect, skewed sash, or loose headdress.",
        "Infringement of the strict 3-minute performance window.",
      ],
    },
    highlights: [
      "Hanya menggunakan tangan kosong tanpa senjata.",
      "Ujian disiplin mental, persefahaman telepati dan latihan beribu jam.",
      "Formasi segi tiga dinamik yang tidak boleh bercelaru.",
    ],
    highlightsEn: [
      "Exclusively unarmed barehand execution.",
      "Supreme test of mental unity and thousands of training hours.",
      "Dynamic triangular formations maintained flawlessly.",
    ],
  },
  {
    id: "solo-bebas",
    name: "Solo Bebas",
    nameEn: "Creative Solo",
    participants: "1 Orang Pesilat Solo",
    participantsEn: "1 Solo Performer",
    duration: "Tepat 3:00 Minit",
    durationEn: "Exactly 3:00 Minutes",
    tagline: "Kreativiti Artistik Melayu: Senjata Tradisi Nusantara & Iringan Muzik",
    taglineEn: "Artistic Creative Showcase: Traditional Heritage Weapons & Music",
    overview:
      "Kategori terbaharu dalam sukan silat moden yang memberi kebebasan koreografi artistik penuh kepada pesilat solo. Menampilkan gabungan jurus perguruan tradisi, kepelbagaian senjata warisan Nusantara, kostum warisan indah, dan iringan muzik gamelan rasmi.",
    overviewEn:
      "The newest category in modern competitive silat offering complete artistic choreographic freedom to a solo athlete. It blends traditional dojo styles, diverse heritage weapons, authentic garments, and live musical accompaniment.",
    rubrics: {
      kebenaran:
        "Kreativiti & Kekayaan Khazanah Seni: Menilai originaliti gubahan koreografi, teknik pengawalan senjata tradisi yang rumit, dan keaslian kaedah persilatan.",
      kebenaranEn:
        "Creativity & Heritage Richness: Evaluates compositional originality, complex traditional weapon mastery, and authentic martial execution.",
      kemantapan:
        "Penghayatan Estetika & Keserasian Muzik: Menilai keserasian gerak silat dengan rentak gendang silat, ekspresi wajah pesilat, daya tarik panggung, dan ketangkasan fizikal.",
      kemantapanEn:
        "Aesthetic Delivery & Musical Harmony: Evaluates choreography rhythm with percussion, martial facial expression, stage charisma, and agility.",
      deductions: [
        "Senjata terlepas dari tangan dan jatuh ke matras (-0.50 mata).",
        "Masa melebihi atau kurang daripada 3 minit.",
        "Keluar dari gelanggang pertandingan.",
        "Senjata berbahaya tidak menepati peraturan keselamatan PERSILAT.",
      ],
      deductionsEn: [
        "Weapon dropped onto the mat (-0.50 pt).",
        "Performance under or over 3:00 minutes.",
        "Stepping outside the official arena bounds.",
        "Hazardous weapons failing PERSILAT safety standards.",
      ],
    },
    highlights: [
      "Meraikan keunikan pelbagai aliran perguruan silat Nusantara.",
      "Pilihan senjata tradisi: Keris, Tekpi, Pedang, Parang, Badik, Kerambit.",
      "Diiringi muzik tradisional yang menyemarakkan semangat pahlawan.",
    ],
    highlightsEn: [
      "Celebrates the diverse traditions and schools across the region.",
      "Traditional weapon choices: Keris, Tekpi, Sword, Parang, Dagger, Karambit.",
      "Accompanied by traditional musical percussion.",
    ],
  },
];

export const WEIGHT_CLASSES: WeightClass[] = [
  {
    classCode: "Bawah 45 kg",
    classCodeEn: "Under 45 kg",
    name: "Kelas Bawah 45",
    nameEn: "Under 45 Class",
    maleRange: "< 45.0 kg",
    femaleRange: "< 45.0 kg",
    description: "Kategori paling ringan, menuntut kepantasan langkah kilat dan serangan balas tangkas.",
    descriptionEn: "Lightest division, demanding lightning-fast footwork and razor-sharp counter-strikes.",
  },
  {
    classCode: "Kelas A",
    classCodeEn: "Class A",
    name: "Kelas A",
    nameEn: "Class A",
    maleRange: "45.0 kg - 50.0 kg",
    femaleRange: "45.0 kg - 50.0 kg",
    description: "Pertarungan berintensiti tinggi dengan kepantasan kombinasi pukulan dan tendangan sabit.",
    descriptionEn: "High-intensity bouts with rapid punch and roundhouse kick combinations.",
  },
  {
    classCode: "Kelas B",
    classCodeEn: "Class B",
    name: "Kelas B",
    nameEn: "Class B",
    maleRange: "50.0 kg - 55.0 kg",
    femaleRange: "50.0 kg - 55.0 kg",
    description: "Kategori paling kompetitif di peringkat antarabangsa; imbangan ideal kepantasan dan kuasa.",
    descriptionEn: "Highly contested international bracket; optimal balance of agility and power.",
  },
  {
    classCode: "Kelas C",
    classCodeEn: "Class C",
    name: "Kelas C",
    nameEn: "Class C",
    maleRange: "55.0 kg - 60.0 kg",
    femaleRange: "55.0 kg - 60.0 kg",
    description: "Kategori utama Sukan SEA dan Kejohanan Dunia; dominasi teknik tangkapan dan sapuan rebah.",
    descriptionEn: "Premier division at SEA Games and World Championships; dominated by catches and sweeps.",
  },
  {
    classCode: "Kelas D",
    classCodeEn: "Class D",
    name: "Kelas D",
    nameEn: "Class D",
    maleRange: "60.0 kg - 65.0 kg",
    femaleRange: "60.0 kg - 65.0 kg",
    description: "Pertarungan taktikal dengan aplikasi bantingan pinggang dan tendangan jejeg bertenaga.",
    descriptionEn: "Tactical battles featuring hip throws and powerful front stomp kicks.",
  },
  {
    classCode: "Kelas E",
    classCodeEn: "Class E",
    name: "Kelas E",
    nameEn: "Class E",
    maleRange: "65.0 kg - 70.0 kg",
    femaleRange: "65.0 kg - 70.0 kg",
    description: "Kuasa hentaman padu pada vest pelindung dada dan teknik kunci tangkapan 5 saat.",
    descriptionEn: "Heavy chest-protector strikes and assertive 5-second grapple-to-throw setups.",
  },
  {
    classCode: "Kelas F",
    classCodeEn: "Class F",
    name: "Kelas F",
    nameEn: "Class F",
    maleRange: "70.0 kg - 75.0 kg",
    femaleRange: "70.0 kg - 75.0 kg",
    description: "Kategori pertengahan berat dengan penekanan daya tahan anaerobik dan kawalan gelanggang.",
    descriptionEn: "Middle-heavy division emphasizing anaerobic lactic conditioning and ring dominance.",
  },
  {
    classCode: "Kelas G",
    classCodeEn: "Class G",
    name: "Kelas G",
    nameEn: "Class G",
    maleRange: "75.0 kg - 80.0 kg",
    femaleRange: "75.0 kg - 80.0 kg",
    description: "Kategori berat dengan kuasa bantingan maksima dan pertahanan badan yang tegap.",
    descriptionEn: "Heavy category built around maximum takedown leverage and defensive stances.",
  },
  {
    classCode: "Kelas H",
    classCodeEn: "Class H",
    name: "Kelas H",
    nameEn: "Class H",
    maleRange: "80.0 kg - 85.0 kg",
    femaleRange: "80.0 kg - 85.0 kg",
    description: "Impak serangan tinggi; pesilat memerlukan ketahanan otot teras dan pernafasan padu.",
    descriptionEn: "Substantial impact; demands strong core stability and regulated breathing under pressure.",
  },
  {
    classCode: "Kelas I & J",
    classCodeEn: "Class I & J",
    name: "Kelas I & J",
    nameEn: "Class I & J",
    maleRange: "85.0 kg - 95.0 kg",
    femaleRange: "Tidak dipertandingkan",
    description: "Kategori berat khusus lelaki; pertembungan kuasa fizik dan jatuhan berat gelanggang.",
    descriptionEn: "Men-only heavy division; physical power encounters and mat-shaking takedowns.",
  },
  {
    classCode: "Bebas",
    classCodeEn: "Open",
    name: "Kelas Terbuka",
    nameEn: "Open Division",
    maleRange: "Open 1: 95-110 kg | Open 2: > 110 kg",
    femaleRange: "> 85.0 kg",
    description: "Kategori divisyen terbuka tanpa had berat maksima, menguji ketahanan fizikal mutlak.",
    descriptionEn: "Open weight bracket with no maximum cap, testing absolute endurance and ring fortitude.",
  },
];

export const TARGET_ZONES: TargetZone[] = [
  {
    id: "dada",
    name: "Dada",
    nameEn: "Chest",
    status: "LEGAL",
    pointsPunch: 1,
    pointsKick: 2,
    description: "Kawasan permukaan hadapan vest pelindung dada di atas paras pusat.",
    descriptionEn: "Front surface of the protective torso vest above navel level.",
    ruleNote: "Pukulan lurus atau tendangan padu yang menggegarkan vest mengikut kaedah pencak silat.",
    ruleNoteEn: "Clean punch or kick making audible firm contact in accordance with martial principles.",
  },
  {
    id: "rusuk",
    name: "Rusuk Kiri & Kanan",
    nameEn: "Left & Right Flanks",
    status: "LEGAL",
    pointsPunch: 1,
    pointsKick: 2,
    description: "Kawasan rusuk sisi badan yang dilindungi oleh padding vest pelindung.",
    descriptionEn: "Lateral rib areas covered by the side padding of the body protector.",
    ruleNote: "Sasaran utama bagi tendangan sabit dan pukulan sisi.",
    ruleNoteEn: "Primary scoring zone for roundhouse kicks and lateral fist strikes.",
  },
  {
    id: "abdomen",
    name: "Abdomen",
    nameEn: "Abdomen",
    status: "LEGAL",
    pointsPunch: 1,
    pointsKick: 2,
    description: "Kawasan perut atas tali pinggang yang diliputi vest pelindung.",
    descriptionEn: "Upper abdominal area above the waist sash covered by the protector.",
    ruleNote: "Sasaran efektif bagi tendangan lurus dan jejeg.",
    ruleNoteEn: "Effective target for front snap kicks and linear stomp kicks.",
  },
  {
    id: "belakang",
    name: "Belakang Badan",
    nameEn: "Back Torso",
    status: "LEGAL",
    pointsPunch: 1,
    pointsKick: 2,
    description: "Bahagian belakang torso yang dilindungi oleh vest pelindung badan.",
    descriptionEn: "Posterior torso covered by the back plate of the body vest.",
    ruleNote: "Sah mendapat mata, namun serangan sengaja ke tulang belakang dilarang keras.",
    ruleNoteEn: "Legal for points; however, deliberate strikes to the bare spine are strictly forbidden.",
  },
  {
    id: "kepala",
    name: "Kepala & Muka",
    nameEn: "Head & Face",
    status: "PROHIBITED",
    pointsPunch: 0,
    pointsKick: 0,
    description: "Zon larangan mutlak merangkumi muka, telinga, leher dan tengkorak.",
    descriptionEn: "Strictly prohibited zone comprising face, ears, neck, and cranium.",
    ruleNote: "Pelanggaran Berat: Peringatan 1 (-5 mata), Peringatan 2 (-10 mata) atau Diskualifikasi terus.",
    ruleNoteEn: "Severe Foul: Warning 1 (-5 pts), Warning 2 (-10 pts), or immediate disqualification.",
  },
  {
    id: "leher",
    name: "Leher & Kerongkong",
    nameEn: "Neck & Throat",
    status: "PROHIBITED",
    pointsPunch: 0,
    pointsKick: 0,
    description: "Zon anatomi leher, halkum dan pangkal tengkuk.",
    descriptionEn: "Anatomical region of neck, larynx, and cervical base.",
    ruleNote: "Dilarang memukul, mencekik atau mengunci leher. Tindakan disiplin serta-merta.",
    ruleNoteEn: "Striking, choking, or neck locks strictly banned. Triggers immediate disciplinary action.",
  },
  {
    id: "kemaluan",
    name: "Kemaluan",
    nameEn: "Groin",
    status: "PROHIBITED",
    pointsPunch: 0,
    pointsKick: 0,
    description: "Zon sulit bawah pelvis.",
    descriptionEn: "Lower pelvic region.",
    ruleNote: "Pelanggaran Berat. Jika lawan cedera dan tidak dapat meneruskan pertarungan, pesilat dibatalkan penyertaan.",
    ruleNoteEn: "Severe Foul. If opponent cannot continue due to injury, the offending athlete is disqualified.",
  },
  {
    id: "lutut",
    name: "Sendi Lutut",
    nameEn: "Knee Joint",
    status: "PROHIBITED",
    pointsPunch: 0,
    pointsKick: 0,
    description: "Tendangan pematah sendi lutut.",
    descriptionEn: "Direct hyperextending kicks targeting the knee joint.",
    ruleNote: "Tindakan berbahaya yang dilarang bagi melindungi keselamatan atlet.",
    ruleNoteEn: "Dangerous conduct strictly banned to preserve athlete joint integrity.",
  },
];

export const EQUIPMENT_LIST: EquipmentItem[] = [
  // Seni Equipment
  {
    id: "golok-seni",
    name: "Golok Pertandingan",
    nameEn: "Competition Machete",
    category: "SENI",
    type: "WEAPON",
    specs: "Bilah keluli tidak berkarat (tumpul), panjang 30-40cm, lebar 2.5-4cm. Berat seimbang dengan hulu kayu kukuh.",
    specsEn: "Blunt stainless steel blade, 30-40cm length, 2.5-4cm width. Balanced heft with solid hardwood hilt.",
    purpose: "Digunakan dalam kategori Tunggal (jurus 41-70), Ganda, dan Solo Bebas untuk teknik libasan dan tetakan.",
    purposeEn: "Used in Solo (movements 41-70), Doubles, and Creative Solo for slash and hack mechanics.",
    ruleCitation: "PERSILAT 2026 Peraturan Teknikal Seni - Bab Peralatan Rasmi",
    ruleCitationEn: "PERSILAT 2026 Artistic Technical Code - Official Equipment Chapter",
  },
  {
    id: "toya-seni",
    name: "Toya Rotan",
    nameEn: "Rattan Staff",
    category: "SENI",
    type: "WEAPON",
    specs: "Rotan asli terpilih berdiameter 2.5-3.5cm, panjang 150-180cm mengikut ketinggian rasmi pesilat.",
    specsEn: "Selected natural rattan, 2.5-3.5cm diameter, 150-180cm length suited to athlete height.",
    purpose: "Digunakan dalam Tunggal (jurus 71-100) dan Ganda bagi putaran kelajuan tinggi dan libasan penyapu.",
    purposeEn: "Used in Solo (movements 71-100) and Doubles for high-speed spins and low ground sweeps.",
    ruleCitation: "PERSILAT 2026 Peraturan Teknikal Seni - Bab Peralatan Rasmi",
    ruleCitationEn: "PERSILAT 2026 Artistic Technical Code - Official Equipment Chapter",
  },
  {
    id: "pakaian-seni",
    name: "Pakaian Silat Seni Tradisi",
    nameEn: "Traditional Seni Attire",
    category: "SENI",
    type: "ATTIRE",
    specs: "Baju hitam potongan Melayu asli lengkap dengan Samping Songket tenunan tradisi dan Tengkolok berikat kemas.",
    specsEn: "Black traditional cut tunic complete with woven songket sash and firmly tied headpiece.",
    purpose: "Memelihara maruah dan warisan persilatan; mestilah kemas agar tidak terlucut sewaktu persembahan.",
    purposeEn: "Honours martial cultural heritage; must be securely fastened during performances.",
    ruleCitation: "PERSILAT 2026 Kod Pakaian Seni Baku & Solo Bebas",
    ruleCitationEn: "PERSILAT 2026 Standard & Creative Dress Code",
  },

  // Olahraga Equipment
  {
    id: "body-protector",
    name: "Pelindung Badan",
    nameEn: "Body Protector",
    category: "OLAHRAGA",
    type: "PROTECTION",
    specs: "Busa EVA berketumpatan tinggi bersalut PU tahan lasak. Disediakan dalam sudut Merah dan Biru dengan tali pengikat sisi.",
    specsEn: "High-density EVA foam encased in heavy-duty PU. Designated in Red and Blue corners with lateral straps.",
    purpose: "Menyerap daya hentaman pukulan dan tendangan ke bahagian dada, rusuk, dan belakang badan atlet.",
    purposeEn: "Absorbs impact from legal punches and kicks across the chest, flanks, and back.",
    ruleCitation: "PERSILAT 2026 Standard Peralatan Keselamatan Tanding",
    ruleCitationEn: "PERSILAT 2026 Combat Safety Equipment Standards",
  },
  {
    id: "groin-guard",
    name: "Pelindung Kemaluan",
    nameEn: "Groin Guard",
    category: "OLAHRAGA",
    type: "PROTECTION",
    specs: "Cawan polimer tegar kalis pecah dengan pelapik busa lembut dan tali sokongan elastik. Wajib bagi lelaki dan wanita.",
    specsEn: "Shatterproof rigid polymer cup with padded lining and elastic support straps. Mandatory for all competitors.",
    purpose: "Melindungi kawasan sensitif pelvis daripada sebarang tendangan atau hentaman tidak sengaja.",
    purposeEn: "Protects sensitive pelvic regions against stray strikes and accidental impact.",
    ruleCitation: "PERSILAT 2026 Peraturan Wajib Tanding - Bab Pemeriksaan Atlet",
    ruleCitationEn: "PERSILAT 2026 Mandatory Combat Rules - Athlete Inspection Chapter",
  },
  {
    id: "shin-guard",
    name: "Pelindung Tulang Kering & Kura Kaki",
    nameEn: "Shin & Instep Guard",
    category: "OLAHRAGA",
    type: "PROTECTION",
    specs: "Sarung pelindung busa lembut berlapik kain elastik hitam yang dipakai di bahagian dalam seluar silat.",
    specsEn: "Soft foam protector encased in black elastic sleeve worn concealed underneath trousers.",
    purpose: "Melindungi tulang tibia dan metatarsal kaki semasa melaksanakan tendangan sabit dan menyekat serangan.",
    purposeEn: "Protects tibial bone and metatarsal joints during kicks and defensive checks.",
    ruleCitation: "PERSILAT 2026 Standard Pelindung Kaki Rasmi",
    ruleCitationEn: "PERSILAT 2026 Official Limb Protection Standards",
  },
  {
    id: "gumshield",
    name: "Pelindung Gigi",
    nameEn: "Mouthguard",
    category: "OLAHRAGA",
    type: "PROTECTION",
    specs: "Silikon termoplastik gred perubatan yang dibentuk mengikut susunan gigi pesilat. Tidak berwarna cerah merah.",
    specsEn: "Medical-grade boil-and-bite thermoplastic moulded to dental arch. Solid red colours prohibited.",
    purpose: "Wajib bagi atlet bertindik atau berpendakap gigi; disyorkan untuk semua atlet tanding bagi melindungi rahang.",
    purposeEn: "Mandatory for athletes with dental braces; recommended for all competitors to shield jaw and teeth.",
    ruleCitation: "PERSILAT 2026 Panduan Perubatan Pertandingan",
    ruleCitationEn: "PERSILAT 2026 Tournament Medical Guidelines",
  },
  {
    id: "baju-tanding",
    name: "Pakaian Silat Tanding",
    nameEn: "Combat Uniform",
    category: "OLAHRAGA",
    type: "ATTIRE",
    specs: "Kain kapas hitam tahan lasak tanpa butang logam atau zip tajam. Lencana persatuan di dada kiri dan jalur bendera di lengan.",
    specsEn: "Durable black cotton uniform free of metal buttons or zippers. Club crest on left chest, national flag on sleeve.",
    purpose: "Membolehkan pergerakan bebas, cengkaman tangkapan selamat, dan perlawanan tanpa risiko calar perkakasan.",
    purposeEn: "Enables unhindered movement, secure gripping, and safe contact free of hardware abrasions.",
    ruleCitation: "PERSILAT 2026 Kod Pakaian Tanding",
    ruleCitationEn: "PERSILAT 2026 Combat Dress Code",
  },
];

export const COMPARISON_MATRIX = [
  {
    feature: "Objektif Utama",
    featureEn: "Primary Objective",
    seni: "Menghidupkan keindahan seni warisan, kejituan teknikal 100 jurus baku, ketangkasan senjata, dan penghayatan jiwa pesilat.",
    seniEn: "Celebrates heritage martial artistry, technical precision of 100 standardized forms, weapon agility, and inner warrior expression.",
    olahraga: "Pertarungan sukan sentuhan penuh berjarak kiraan mata, menguji kepantasan tindak balas, kekuatan bantingan, dan taktik gelanggang.",
    olahragaEn: "Full-contact point sparring testing reaction velocity, takedown leverage, and ring strategy under electronic scoring.",
  },
  {
    feature: "Kategori Bertanding",
    featureEn: "Competition Divisions",
    seni: "Tunggal, Ganda, Regu, dan Solo Bebas.",
    seniEn: "Solo, Choreographed Doubles, Synchronised Trio, and Creative Solo.",
    olahraga: "Divisyen Berat Badan: Kelas A (45-50kg) hingga Kelas J (90-95kg) dan Kelas Terbuka.",
    olahragaEn: "Weight Classes: Class A (45-50kg) through Class J (90-95kg) and Open Division.",
  },
  {
    feature: "Format & Masa Perlawanan",
    featureEn: "Match Format & Duration",
    seni: "Satu persembahan berterusan selama tepat 3:00 minit (180 saat) dengan pemotongan mata bagi setiap saat terkurang atau terlebih.",
    seniEn: "One continuous performance of exactly 3:00 minutes (180 seconds) with point deductions for any time variance.",
    olahraga: "3 pusingan x 2:00 minit waktu bersih diselang 1:00 minit rehat antara setiap pusingan.",
    olahragaEn: "3 rounds x 2:00 minutes clean active combat time with 1:00 minute rest interval between rounds.",
  },
  {
    feature: "Kaedah Penilaian & Skor",
    featureEn: "Scoring & Judging System",
    seni: "Panel juri menilai Nilai Kebenaran (ketepatan geometri & urutan gerak) dan Nilai Kemantapan (daya letus, irama & jiwa).",
    seniEn: "Judges evaluate Accuracy Standard (geometric precision & order) and Firmness & Expression (power, tempo & spirit).",
    olahraga: "Sistem digital masa nyata: Pukulan (1 mata), Tendangan (2 mata), Jatuhan (3 mata) beserta Cabaran VAR.",
    olahragaEn: "Real-time digital scoring: Punch (1 pt), Kick (2 pts), Takedown (3 pts) plus VAR Video Review.",
  },
  {
    feature: "Peralatan & Senjata",
    featureEn: "Equipment & Weapons",
    seni: "Golok tradisional tumpul, Toya rotan 150-180cm, Keris, Tekpi, Samping Songket dan Tengkolok warisan.",
    seniEn: "Blunt competition machete, rattan staff (150-180cm), traditional Keris/Tekpi, woven sash, and headpiece.",
    olahraga: "Pelindung badan (vest merah atau biru), pelindung kemaluan, pelindung kaki, pelindung gigi, baju hitam tanding standard.",
    olahragaEn: "Body protector (red or blue corner vest), groin guard, shin guard, mouthguard, standard black uniform.",
  },
  {
    feature: "Keperluan Fizikal & Fisiologi",
    featureEn: "Physical & Physiological Demands",
    seni: "Kelenturan ekstrem, imbangan statik dan dinamik, ketahanan isometrik, memori motor kompleks, dan nafas sekata.",
    seniEn: "Extreme flexibility, static and dynamic balance, isometric endurance, complex motor memory, and breathing control.",
    olahraga: "Kecergasan kardiovaskular anaerobik laktat, daya letus sepakan, kuasa cengkaman bantingan, dan kelajuan refleks.",
    olahragaEn: "Lactic anaerobic endurance, explosive kicking power, grappling grip strength, and reflexive reaction speed.",
  },
  {
    feature: "Kawasan Sasaran",
    featureEn: "Target Zones",
    seni: "Seluruh gelanggang 10m x 10m untuk pergerakan artistik dan formasi langkah berirama.",
    seniEn: "Full 10m x 10m arena mat utilized for artistic positioning and rhythmic footwork choreography.",
    olahraga: "Sasaran mata sah hanya pada vest pelindung (dada, rusuk, belakang, abdomen). Kepala dan kemaluan dilarang sama sekali.",
    olahragaEn: "Legal targets exclusively on protective vest (chest, flanks, back, abdomen). Head and groin strictly prohibited.",
  },
];
