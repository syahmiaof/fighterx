# FIGHTERX — SILAT ATHLETE TRAINING & PERFORMANCE FRAMEWORK
**Dokumen Induk • Draf V0.6 (Kemas Kini: 7 November 2026)**  
*Status: UNTUK SEMAKAN CIKGU BADRUL DAN BARISAN JURULATIH • Rujukan Utama Pembangunan Sistem FighterX & Perancangan Latihan Kendiri Atlet.*

---

## 1. TUJUAN & OBJEKTIF UTAMA
1. **Membina Disiplin Latihan Kendiri:** Memastikan atlet menjalankan pengukuhan fizikal dan stamina di luar gelanggang, supaya sesi latihan bersemuka boleh memberi tumpuan 100% kepada teknik, pembetulan kesilapan, dan persediaan pertandingan.
2. **Pemantauan Berasaskan Bukti:** Setiap latihan kendiri disahkan melalui rekod masa, jarak, RPE, dan muat naik foto/video aktiviti yang disemak oleh coach bertauliah.
3. **Pengukuran Prestasi Berkala:** Kemajuan diukur melalui siri masa (Januari -> Mac -> Jun -> September -> Disember), bukan andaian atau satu skor rawak.

---

## 2. SKOP PLATFORM & PERANAN PENGGUNA
* **Skop Disiplin:** Silat Seni dan Silat Olahraga (Pelbagai organisasi & cawangan dengan pengasingan data / multi-tenant).
* **Peranan Pengguna:**
  * **Admin / Penyelaras Teknikal:** Menggubal Master Training Program, fasa tahunan, sasaran, jadual ujian baseline, organisasi & cawangan.
  * **Coach (Jurulatih):** Memantau atlet yang ditugaskan, menilai latihan teknikal, menyemak & mengesahkan bukti aktiviti, memberi maklum balas serta mencadangkan *Training Priority*.
  * **Athlete (Atlet):** Menjalankan tugasan harian, merekod hasil, memuat naik bukti media, dan memantau graf perkembangan diri.
* **Prinsip Keselamatan:** Pelarasan beban untuk atlet beginner, kecederaan, atau umur berbeza. Latihan sparring kontak hanya dijalankan secara terkawal di bawah pengawasan langsung jurulatih.

---

## 3. ALIRAN UTAMA (WORKFLOW ENGINE)
```
[1. Admin] Tetapkan Master Program & Takwim
      ↓
[2. Sistem] Agihkan Tugasan Mengikut Tahap & Disiplin
      ↓
[3. Atlet] Laksana Latihan Kendiri & Rekod Hasil (Masa/Jarak/RPE/HR)
      ↓
[4. Atlet] Muat Naik Bukti (Foto / Video / Screenshot)
      ↓
[5. Coach] Semak: Disahkan (Approved) / Perlu Pembetulan / Ditolak / Dikecualikan
      ↓
[6. Dashboard] Paparan Pematuhan (Compliance), Readiness & Trend Prestasi
```
*Status Tugasan:* `Dijadualkan` → `Belum Hantar` → `Menunggu Semakan` → `Disahkan` / `Perlu Pembetulan` / `Ditolak`. Hari rehat berjadual ditandakan berasingan dan TIDAK dianggap gagal.

---

## 4. STRUKTUR LATIHAN & GAYA HIDUP ATLET

### A. Training Performance (Prestasi Sukan)
1. **Strength & Conditioning (S&C):** Push-up, squat, plank, core, kekuatan kaki, kestabilan sendi dan pendaratan.
2. **Fitness & Cardiovascular Endurance:** Jogging/jalan pantas, interval training, agility, speed, dan daya tahan kardiorespiratori.
3. **Mobility, Flexibility & Joint Stability:** Julat pergerakan (*range of motion*), mobiliti buku lali (*ankle mobility*), kawalan pendaratan selamat.
4. **Plyometric & Explosive Power:** Pergerakan eksplosif secara progresif selepas asas kekuatan dan kestabilan sendi memadai.
5. **Technical Drills:**
   - *Silat Olahraga:* Footwork, serangan balas, pertahanan, tindak balas pantas.
   - *Silat Seni:* Ketepatan jurus, keseimbangan, tempo, keseragaman gerak (Tunggal, Ganda, Regu).
6. **Sparring & Tactical Pressure:** Simulasi pertandingan di bawah tekanan, pengurusan jarak dan masa (hanya diselia).

### B. Athlete Lifestyle (Pemantauan Konteks Ringkas)
* **Time Management:** Pematuhan jadual latihan kendiri dan alasan jika tidak laksana.
* **Nutrition & Hydration:** Check-in ringkas pemakanan dan ujian kadar peluh, bukan pengiraan kalori membebankan.
* **Mental & Emotion:** Kesediaan diri dan motivasi secara sukarela (bukan markah disiplin).
* **Rest & Recovery:** Jam tidur, tahap keletihan, kesakitan badan, dan rehat aktif.

---

## 5. ROADMAP TAHUNAN FIGHTERX 2027 (6 + 6 BULAN)

### Blok 1 (Januari – Jun 2027) : Foundation & Physical Development
* **JANUARI (Onboarding & Baseline):** Saringan kesihatan, pendaftaran sistem, 2 sesi ujian baseline, panduan merekod latihan. *(Milestone: Profil & Baseline Lengkap).*
* **FEBRUARI (Aerobic & Structural Base):** Pembinaan daya tahan aerobik asas, core, kekuatan, dan mobiliti buku lali/sendi. *(Milestone: Konsistensi penghantaran bukti).*
* **MAC (Progressive Conditioning):** Daya tahan berterusan, asas teknik Seni/Olahraga, mini-review Q1 dengan protokol seragam. *(Milestone: Laporan Q1 & pelarasan sasaran).*
* **APRIL (Strength & Movement Quality):** Pengukuhan kekuatan, interval terkawal, ketepatan teknik tanpa beban mendadak. *(Milestone: Pematuhan stabil).*
* **MEI (Agility & Intro Plyometrics):** Latihan kelincahan, reaksi, asas plyometrik (bagi atlet melepasi saringan pendaratan). *(Milestone: Peningkatan kualiti pergerakan).*
* **JUN (Mid-Year Reassessment):** Penilaian semula penuh berbanding Januari, semakan coach, laporan 6 bulan, penentuan jurang prestasi. *(Milestone: Baseline vs Pertengahan Tahun).*

### Blok 2 (Julai – Disember 2027) : Specific Performance & Technical Peak
* **JULAI (Program Calibration):** Pelarasan pelan berdasarkan hasil Jun, persediaan khusus disiplin. *(Milestone: Sasaran kuantitatif separuh tahun kedua).*
* **OGOS (Sport-Specific Conditioning):** Seni (tempo, jurus, keseragaman regu); Olahraga (footwork, serangan-pertahanan, usaha eksplosif berulang). *(Milestone: Penilaian rubrik teknik).*
* **SEPTEMBER (Fatigue Management & Tactics):** Aplikasi teknik di bawah keletihan terkawal, tactical decision-making, semakan Q3. *(Milestone: Penilaian mid-block).*
* **OKTOBER (Match Simulation & Pressure):** Simulasi kejohanan di bawah pengawasan, pengendalian tekanan lawan. *(Milestone: Skor kesiapsiagaan relatif).*
* **NOVEMBER (Peak & Taper):** Pengukuhan kemahiran, pelarasan taper jika ada kejohanan sasaran. *(Milestone: Rekod kesiapsiagaan pertandingan).*
* **DISEMBER (Annual Review & Recovery):** Penilaian akhir tahun (Jan vs Jun vs Dis), laporan prestasi tahunan, pemulihan terancang, dan perancangan kitaran 2028. *(Milestone: Annual Athlete Performance Report).*

---

## 6. DASAR PERTANDINGAN SEPANJANG TAHUN (KEUTAMAAN A / B / C)
Atlet dibenarkan bertanding sepanjang tahun mengikut kesediaan, tanpa perlu menunggu kitaran 1 tahun tamat.
* **Kategori A (Major / Key Competition):** Kejohanan sasaran utama (cth. SUKMA, Kebangsaan). Disediakan fasa *taper* khusus dan pengurangan beban latihan.
* **Kategori B (Development Competition):** Medan menguji kemajuan latihan dan mengenal pasti jurang prestasi dengan sedikit pelarasan beban.
* **Kategori C (Exposure Competition):** Pendedahan perlawanan sebenar untuk atlet yang telah disahkan selamat dan bersedia.
* *Peraturan Minggu Pertandingan:* Tugasan fizikal berat digantikan dengan teknik ringan, mobiliti dan rehat. Atlet bertanding tidak dikenakan penalti pematuhan.

---

## 7. PROTOKOL BASELINE ASSESSMENT (6 KOMPONEN)
Ujian dijalankan dalam 2 sesi bersemuka (Sesi A: Kesediaan, S&C, Mobiliti; Sesi B: Teknik & Stamina):
1. **STAMINA:** Ujian Lari/Jalan 6 Minit di laluan rata. Rekod: Jarak (meter), RPE (0–10), HR purata/puncak (opsyenal).
2. **MUSCULAR ENDURANCE:** Push-up maksimum dalam 60 saat (teknik sah) & Plank (tempoh saat posisi betul).
3. **MOBILITY & STABILITY:** Knee-to-wall ankle mobility (cm kiri & kanan) & Single-leg balance (saat kiri & kanan, had 30s).
4. **EXPLOSIVE POWER:** Standing broad jump (jarak terbaik cm & kualiti pendaratan; tertakluk kepada keupayaan atlet).
5. **TECHNICAL SKILL:** Rubrik 1–5 dalaman:
   - *Silat Seni:* Ketepatan jurus, keseimbangan, kelancaran, tempo, kawalan badan.
   - *Silat Olahraga:* Footwork, serangan asas, pertahanan, koordinasi, keseimbangan.
6. **RECOVERY & READINESS:** Purata jam tidur, tahap keletihan, kesakitan otot, kesediaan psikologi (0–10).

---

## 8. LIMA (5) TRAINING PRIORITIES (PENGELOMPOKAN ATLET)
FighterX tidak menggunakan satu skor agregat rawak (beginner/advanced). Atlet dikelompokkan mengikut keperluan latihan sebenar:
1. **Endurance Development:** Fokus pembinaan kapasiti aerobik dan daya tahan kardiorespiratori.
2. **Strength Development:** Fokus kekuatan otot teras, kestabilan sendi dan daya tahan otot.
3. **Movement Foundation:** Fokus mobiliti buku lali, imbangan satu kaki dan kawalan pendaratan selamat sebelum aktiviti impak tinggi.
4. **Technical Development:** Fokus pembetulan ketepatan jurus (Seni) atau reaksi dan serangan balas (Olahraga).
5. **Recovery Review:** Pemantauan pola keletihan melampau, kualiti tidur rendah, atau fasa pemulihan selepas kejohanan.

---

## 9. RUJUKAN SAINTIFIK & DOKUMEN RASMI
1. **Aziz, A. R., Tan, B. & Teh, K. C. (2002):** *Physiological Responses During Matches and Profile of Elite Pencak Silat Exponents*, Journal of Sports Science and Medicine, 1, 147–155.
2. **Institut Sukan Negara Malaysia (ISN):** Garis Panduan Fisiologi & Pemakanan Sukan Seni Mempertahankan Diri Kebangsaan (2023).
3. **PERSILAT Medical & Sports Science Commission (2026):** *International Pencak Silat Competition Medical Regulations & Safe Weight Category Standards*.
4. **IOC Consensus Statement on Youth Athletic Development (BJSM 2015 & 2024):** https://bjsm.bmj.com/content/49/13/843 & https://bjsm.bmj.com/content/58/17/946
5. **NSCA Long-Term Athletic Development (LTAD) Position Statement:** https://www.nsca.com/about-us/position-statements/youth-training-and-long-term-athletic-development/long-term-athletic-development-position-statement/
6. **National Youth Sports Institute (NYSI) Guidelines on Youth Plyometric Progression:** https://www.nysi.org.sg/
