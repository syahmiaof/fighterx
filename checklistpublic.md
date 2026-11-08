# FIGHTERX PUBLIC EXPANSION CHECKLIST (`checklistpublic.md`)

Design System & Consistency Requirements:
- **Background**: Jalur Gemilang dark cinematic wallpaper blended at 72% opacity over `#08090B` base across all public pages.
- **Color Tokens**: Crimson red (`#E10600`, `#FF3845`), Metallic Silver/White (`#FFFFFF`, `#E5E5E7`), Dark Surface (`#17191E`, `#0F1013`).
- **Typography**: Display/Athletic headings in `Teko` (`var(--font-athletic)`), Body in `Inter` (`var(--font-ui)`).
- **Navigation**: Persistent `SiteHeader` with sliding red pill active indicator.

---

## 1. Homepage
- [x] Hero FighterX + background Jalur Gemilang (72% opacity, Bismillah, dual athletes, quote "Semangat Juang. Jiwa Malaysia.")
- [x] Pengenalan & kelebihan FighterX (Detailed value proposition & ecosystem overview)
- [x] Statistik animated — kelab berdaftar, atlet aktif, jurulatih bertauliah
- [x] Logo kelab berdaftar bergerak kanan ke kiri (Infinite marquee 26 persatuan + rakan kerjasama)
- [x] Pengiktirafan PESAKA (Badan induk rasmi kebangsaan showcase)
- [x] Collaboration preview — Fifty7K & Jiwa Fighter
- [x] Testimoni & feedback kelab (Jurulatih & pengurus kelab silat)
- [x] Athlete & Coach Spotlight (Sorotan atlet kebangsaan & jurulatih cemerlang)
- [x] Preview Weekly Top 10 & kalendar pertandingan terdekat
- [x] CTA Register Club — trial 30 hari, RM20/bulan

## 2. Guidelines
- [x] Format pertandingan terkini berdasarkan PDF PERSILAT Feb 2026
- [x] Infografik interaktif pemarkahan (Kalkulator Tanding & Jurus Seni)
- [x] Kesalahan, penalti & disqualification (Teguran I/II, Peringatan I/II, DQ langsung)
- [x] Perbezaan Silat Seni dan Olahraga (Kategori & zon sasaran)
- [x] Animasi CSS + sumber/versi dokumen (Wasit 3D kiri, tajuk 3D kanan, rujukan 69 halaman)

## 3. Knowledge Hub (`/knowledge`)
- [x] Cara training & jenis latihan (Periodisasi, fasa persediaan umum & khusus)
- [x] Stamina, strength, mobility & teknik silat (Latihan pliometrik, kelenturan pasang, daya tahan kardio)
- [x] Nutrisi & hidrasi atlet (Makronutrien pra-kejohanan & protokol hidrasi)
- [x] Pengurusan berat badan secara selamat (Weight-cut berjadual tanpa dehidrasi melampau)
- [x] Rest, recovery, tidur & time management (Protokol pemulihan otot, tidur 8 jam, jadual latihan sekolah/pejabat)
- [x] Panduan untuk atlet, ibu bapa & coach (Etika gelanggang, sokongan mental, peranan penjaga)
- [x] Artikel lengkap dengan sumber rujukan saintifik & sukan (ISN, PERSILAT Medical, ACSM)

## 4. Leaderboard & Gamification (`/leaderboard`)
- [x] Weekly Top 10 atlet (Mata kehadiran, ujian kecergasan, aktiviti disahkan)
- [x] Ranking kelab kebangsaan
- [x] Paparan atlet + kelab yang diwakili
- [x] Badge & achievements (Lencana kehadiran 100%, Pejuang Subuh, Juara Sirkit)
- [x] Ranking berdasarkan latihan disahkan dan kaedah yang adil (Anti-fraud verification)
- [x] Privasi & opt-in atlet (Kawalan keterlihatan profil atlet mengikut PDPA & persetujuan ibu bapa)

## 5. Competition Calendar (`/competitions` & `/calendar`)
- [x] Takwim pertandingan seluruh Malaysia (Jadual kejohanan tahunan 2026/2027)
- [x] Open, SUKMA, SUKIPT, IPT, negeri & kelab
- [x] Filter negeri, tarikh, kategori (Pra-Remaja, Remaja, Dewasa) dan disiplin (Tanding, Seni)
- [x] Detail pertandingan, poster & link pendaftaran
- [x] Are You an Organizer? — Submit an Event (Borang penganjur kejohanan)
- [x] Semakan dan pengesahan acara sebelum diterbitkan

## 6. Collaboration (`/collaboration`)
- [x] Fifty7K — cadangan jersi rasmi FighterX & booth promotion kejohanan
- [x] Jiwa Fighter — brand showcase pakaian & kelengkapan silat
- [x] Senarai rakan kerjasama yang disahkan (Official partners directory)
- [x] Become a Partner — borang tawaran kolaborasi & penajaan

## 7. Public Access & QA
- [x] Navbar semua modul + effect asal (Sliding red underline pill indicator)
- [x] Sign In — 3 kad role (Atlet, Jurulatih, Admin)
- [x] Register Club & My Club gateway
- [x] Responsive desktop dan mobile (Drawer navigation & fluid typography)
- [x] Semua button/link berfungsi ke setiap modul awam
- [x] Performance, accessibility & final testing (4-Tier E2E 30/30 passed, 0 typecheck/lint errors)
