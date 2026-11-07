import type { Metadata } from "next";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeAlert,
  BookOpenCheck,
  Clock3,
  Check,
  Flag,
  HandFist,
  Info,
  Medal,
  MoveRight,
  ShieldCheck,
  Swords,
  Target,
  Weight,
  X,
} from "lucide-react";
import { GuidelinesMotion } from "@/components/guidelines/guidelines-motion";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Competition Guidelines · FighterX",
  description: "Ringkasan praktikal Peraturan Pertandingan Pencak Silat Antarabangsa 2026 untuk atlet, coach dan kelab.",
};

const quickFacts = [
  { value: "1 / 2 / 3", title: "Mata Tanding", body: "Tangan · kaki · jatuhan sah." },
  { value: "4 zon", title: "Sasaran bernilai", body: "Dada · abdomen · rusuk · belakang." },
  { value: "−1 / −2 / −5 / −10", title: "Potongan mata", body: "Teguran I–II dan Peringatan I–II." },
  { value: "2 + 1 kad", title: "Peluang protes", body: "Tanding 2 setiap match · Jurus 1 setiap persembahan." },
];

const matchFlow = [
  { icon: Flag, title: "Panggilan & masuk gelanggang", body: "Masuk selepas isyarat wasit, beri hormat kepada wasit dan ketua pertandingan." },
  { icon: HandFist, title: "Gerak jurus perguruan", body: "Persembahkan 5–10 gerakan bertenaga; salam perguruan tidak dikira." },
  { icon: Swords, title: "Tanding ikut isyarat", body: "Bersalaman, tunggu semakan aparat dan mula hanya selepas arahan MULAI." },
  { icon: Medal, title: "Keputusan & keluar", body: "Kembali ke sudut ketika rehat. Selepas pusingan akhir, tunggu keputusan, hormat dan bersalaman." },
];

const violationGroups = [
  {
    tone: "low",
    label: "RINGAN",
    title: "Bina disiplin gelanggang",
    examples: ["Pasif lebih 10 saat", "Membelakangi lawan", "Abaikan arahan atau berkomunikasi dengan orang luar", "Keluar gelanggang dengan kedua-dua kaki", "Tidak ikut kaedah Pencak Silat"],
  },
  {
    tone: "mid",
    label: "SEDERHANA",
    title: "Hentikan tindakan taktikal salah",
    examples: ["Memegang lawan sambil menyerang", "Merangkul atau menarik rambut/penutup kepala", "Memijak lawan yang jatuh", "Melengah masa atau menolak lawan keluar", "Menyerang selepas HENTI atau gong"],
  },
  {
    tone: "high",
    label: "BERAT",
    title: "Risiko kecederaan / terus amaran",
    examples: ["Serang kepala, leher atau kemaluan", "Serang terus sendi lutut", "Headbutt, gigit atau cakar", "Pile-drive leher atau serang aparat"],
  },
];

function SectionHeading({ id, title, description }: { id: string; title: string; description?: string }) {
  return (
    <div className="guidelines-section-heading">
      <h2 id={id}>{title}</h2>
      {description ? <p className="guidelines-section-description">{description}</p> : null}
    </div>
  );
}

export default function GuidelinesPage() {
  return (
    <main className="guidelines-page">
      <SiteHeader currentPage="guidelines" />

      <GuidelinesMotion>
        <div className="guidelines-wrap">
          <section className="guidelines-hero" aria-labelledby="guidelines-title">
            <div className="guidelines-hero-copy">
              <h1 id="guidelines-title"><span className="guidelines-title-line">COMPETITION</span><span className="guidelines-title-line"><em>GUIDELINES</em></span></h1>
              <p>Peraturan utama untuk atlet dan coach — ringkas, tepat, senang semak sebelum masuk gelanggang.</p>
              <div className="guidelines-source-chips">
                <span><ShieldCheck size={14} aria-hidden="true" /> Rules 2026</span>
                <span><Swords size={14} aria-hidden="true" /> Tanding &amp; Jurus</span>
                <span><Clock3 size={14} aria-hidden="true" /> Effective date: tidak dinyatakan</span>
              </div>
              <aside className="guidelines-source-card" aria-label="Document source details">
                <span className="source-card-icon"><Info size={17} aria-hidden="true" /></span>
                <div>
                  <strong>Rujukan dokumen</strong>
                  <p>International Pencak Silat Competition Regulations Year 2026</p>
                  <small>worldpencaksilat.org · fail menyebut Feb 2026</small>
                </div>
              </aside>
            </div>
            <figure className="guidelines-hero-visual">
              <Image src="/assets/fighterx/guidelines-referee.png" alt="Wasit pertandingan pencak silat" width={1012} height={1554} priority sizes="(max-width: 760px) 210px, (max-width: 900px) 250px, 320px" />
            </figure>
          </section>

          <section className="guidelines-brief" aria-label="Document date note">
            <Info size={17} aria-hidden="true" />
            <p><strong>Semak tarikh dengan penganjur.</strong> PDF tidak menyatakan tarikh kuat kuasa; metadata fail menunjukkan 3 Mei 2026. Nama fail pula menyebut “FEB 2026”. Jadual dwibahasa juga berbeza pada label kategori umur untuk tempoh pusingan muda.</p>
          </section>

          <section className="guidelines-quick" aria-label="Peraturan utama secara ringkas">
            <dl className="guidelines-quick-grid">
              {quickFacts.map(({ value, title, body }) => (
                <div className="guidelines-quick-fact" key={value}>
                  <dt>{title}</dt><dd>{value}</dd><p>{body}</p>
                </div>
              ))}
            </dl>
          </section>

          <section className="guidelines-section" aria-labelledby="format-title">
            <SectionHeading id="format-title" title="Dua kategori, cara bertanding berbeza" description="Tanding dan Jurus ada format, syarat masuk dan cara menang yang berbeza." />
            <div className="guidelines-format-grid">
              <article className="format-panel format-tanding">
                <div className="format-panel-icon"><Swords size={21} aria-hidden="true" /></div>
                <div className="format-panel-heading"><h3>Tanding</h3></div>
                <p>Dua pesilat berlawan dalam format kalah mati, melainkan IPSF menetapkan sebaliknya. Serangan, elakan dan jatuhan dinilai sepanjang pusingan.</p>
                <div className="format-detail"><Clock3 size={16} aria-hidden="true" /><span>Tempoh ikut kategori umur; rujuk jadual penganjur.</span></div>
                <div className="format-detail"><Weight size={16} aria-hidden="true" /><span>Wajib timbang ikut kelas; tiada toleransi berat.</span></div>
              </article>
              <article className="format-panel format-jurus">
                <div className="format-panel-icon"><MoveRight size={21} aria-hidden="true" /></div>
                <div className="format-panel-heading"><h3>Jurus</h3></div>
                <p>Persembahan teknikal dalam format kalah mati. Pemenang mara ke pusingan seterusnya; yang kalah di separuh akhir berkongsi gangsa.</p>
                <p className="format-detail-copy">Maksimum dua persembahan sehari jika mara. Tidak hadir ketika dipanggil menggugurkan acara; DQ dalam satu acara tidak automatik menggugurkan acara lain.</p>
                <div className="jurus-types" aria-label="Jurus categories">
                  <span>Tunggal</span><span>Tunggal Bebas</span><span>Ganda</span><span>Regu · 3 pesilat</span>
                </div>
              </article>
            </div>

            <div className="guidelines-flow-panel">
              <div className="guidelines-flow-heading"><h3>Aliran satu perlawanan</h3><p>Ikut turutan wasit — jangan mula atau sambung sendiri.</p></div>
              <ol className="guidelines-flow">
                {matchFlow.map(({ icon: Icon, title, body }, index) => (
                  <li key={title}>
                    <span className="flow-step-number">0{index + 1}</span>
                    <Icon size={20} aria-hidden="true" />
                    <h3>{title}</h3><p>{body}</p>
                    {index < matchFlow.length - 1 ? <ArrowRight className="flow-arrow" size={15} aria-hidden="true" /> : null}
                  </li>
                ))}
              </ol>
              <p className="flow-rule-note"><strong>Jatuhan berpegangan:</strong> jika tak selesai dalam 5 saat, wasit hentikan dan jatuhan tidak diberi.</p>
            </div>
          </section>

          <section className="guidelines-section guidelines-scoring" aria-labelledby="scoring-title">
            <SectionHeading id="scoring-title" title="Mata datang daripada serangan yang sah" description="Serangan mesti tepat pada sasaran, bertenaga, tidak ditangkis dan ikut kaedah Pencak Silat." />
            <div className="scoring-layout">
              <div className="score-values">
                <article className="score-card"><strong>1 mata</strong><h3>Serangan tangan</h3><p>Tepat pada sasaran sah.</p></article>
                <article className="score-card"><strong>2 mata</strong><h3>Serangan kaki</h3><p>Tepat dengan kaedah yang betul.</p></article>
                <article className="score-card score-card-highlight"><strong>3 mata</strong><h3>Jatuhan sah</h3><p>Guna teknik yang dibenarkan.</p></article>
              </div>
              <aside className="target-panel">
                <div className="target-panel-heading"><Target size={19} aria-hidden="true" /><h3>Sasaran bernilai</h3></div>
                <div className="target-list"><span>Dada</span><span>Abdomen atas pusat</span><span>Rusuk kiri &amp; kanan</span><span>Belakang badan</span></div>
                <div className="target-no-score"><X size={16} aria-hidden="true" /><p>Lengan dan kaki boleh jadi sasaran antara, tetapi <strong>tidak memberi mata sentuhan.</strong></p></div>
                <div className="tie-break"><strong>Jika seri</strong><p>Hukuman terendah → mata teknik tertinggi → pusingan tambahan → berat lebih ringan → undian rasmi.</p></div>
              </aside>
            </div>
          </section>

          <section className="guidelines-section guidelines-penalties" aria-labelledby="penalties-title">
            <SectionHeading id="penalties-title" title="Kesalahan dan potongan mata" description="Contoh di bawah membantu persediaan. Wasit menentukan tahap berdasarkan situasi sebenar." />
            <div className="violation-grid">
              {violationGroups.map((group) => (
                <article className={`violation-card violation-${group.tone}`} key={group.label}>
                  <span className="violation-label">{group.label}</span>
                  <h3>{group.title}</h3>
                  <ul>{group.examples.map((example) => <li key={example}><Check size={14} aria-hidden="true" />{example}</li>)}</ul>
                </article>
              ))}
            </div>
            <div className="penalty-ladder" aria-label="Ringkasan hukuman Tanding">
              <h3>Potongan Tanding</h3>
              <div className="penalty-ladder-steps">
                <div><span>BIMBINGAN</span><strong>0 mata</strong><small>Pelanggaran ringan</small></div><ArrowRight size={15} aria-hidden="true" />
                <div><span>TEGURAN I</span><strong>−1</strong><small>Potongan mata</small></div><ArrowRight size={15} aria-hidden="true" />
                <div><span>TEGURAN II</span><strong>−2</strong><small>Potongan mata</small></div><ArrowRight size={15} aria-hidden="true" />
                <div><span>PERINGATAN I</span><strong>−5</strong><small>Potongan mata</small></div><ArrowRight size={15} aria-hidden="true" />
                <div><span>PERINGATAN II</span><strong>−10</strong><small>Potongan mata</small></div><ArrowRight size={15} aria-hidden="true" />
                <div className="penalty-dq"><span>PERINGATAN III</span><strong>DQ</strong><small>Keluar pertandingan</small></div>
              </div>
              <p className="penalty-rule-note">Bimbingan wasit terkumpul tanpa potongan. Teguran ke-3, teguran ke-2 dalam pusingan yang sama, atau satu kesalahan serius boleh membawa terus kepada Peringatan I. Peringatan III selepas Peringatan II bermaksud DQ.</p>
            </div>
            <aside className="dq-alert">
              <span><BadgeAlert size={21} aria-hidden="true" /></span>
              <div><strong>DQ terus untuk pelanggaran berat tertentu</strong><p>Contohnya tindakan serius yang disengajakan, kecederaan yang menyebabkan doktor melarang lawan sambung, atau sengaja menghempas kepala lawan ke matras. Gagal timbang dan positif doping juga boleh menggugurkan atlet.</p></div>
            </aside>
          </section>

          <section className="guidelines-section guidelines-reminders" aria-labelledby="reminders-title">
            <SectionHeading id="reminders-title" title="Semakan sebelum masuk gelanggang" description="Gunakan sebagai checklist ringkas; arahan penganjur untuk kejohanan tetap mengatasi ringkasan ini." />
            <div className="reminder-columns">
              <article className="reminder-panel">
                <div className="reminder-heading"><div><small>ATLET</small><h3>Dokumen &amp; kelengkapan</h3></div></div>
                <ul>
                  <li><Check size={15} aria-hidden="true" />Bawa kad pengenalan atau pasport asal untuk pengesahan umur.</li>
                  <li><Check size={15} aria-hidden="true" />Sediakan sijil kesihatan yang sah; kegagalan mematuhi syarat boleh menyebabkan DQ. Atlet wanita kategori Junior dan Senior perlu deklarasi tidak hamil.</li>
                  <li><Check size={15} aria-hidden="true" />Untuk Tanding, patuhi kelas berat; dokumen menyatakan tiada toleransi.</li>
                  <li><Check size={15} aria-hidden="true" />Jika memakai pendakap gigi, gunakan mouthguard. Cermin mata tidak dibenarkan; kanta lekap perlukan sijil pakar mata.</li>
                  <li><Check size={15} aria-hidden="true" />Kuku mesti pendek; balutan/taping perlu kelulusan wasit atau doktor.</li>
                  <li><Check size={15} aria-hidden="true" />Kembali ke sudut setiap kali rehat dan berhenti sebaik arahan HENTI.</li>
                  <li><Check size={15} aria-hidden="true" />Untuk Jurus, hadir ketika dipanggil; tidak hadir menggugurkan acara itu.</li>
                </ul>
              </article>
              <article className="reminder-panel coach-panel">
                <div className="reminder-heading"><div><small>COACH</small><h3>Protokol corner &amp; protes</h3></div></div>
                <ul>
                  <li><Check size={15} aria-hidden="true" />Maksimum dua coach bersijil di sudut Tanding.</li>
                  <li><Check size={15} aria-hidden="true" />Arahan kepada atlet diberi ketika rehat antara pusingan.</li>
                  <li><Check size={15} aria-hidden="true" />Tanding: 2 kad protes sepanjang 3 pusingan; kad dipulangkan jika semakan berjaya.</li>
                  <li><Check size={15} aria-hidden="true" />Jurus: 1 kad selepas persembahan, sebelum pemenang diumumkan; VAR untuk hukuman sahaja.</li>
                </ul>
              </article>
            </div>
            <div className="duration-note">
              <Clock3 size={18} aria-hidden="true" />
              <p><strong>Tempoh Tanding berbeza ikut umur.</strong> Dokumen menyenaraikan 3 pusingan × 1:30 untuk kategori muda dan 3 × 2:00 untuk kumpulan berikutnya; Master A: 2 × 1:30; Master B: 2 × 1:00. Label kumpulan muda tidak selari antara teks Bahasa Indonesia dan English dalam PDF — sahkan dengan bulletin/technical meeting acara.</p>
            </div>
          </section>

          <footer className="guidelines-source-footer">
            <div className="source-footer-icon"><BookOpenCheck size={20} aria-hidden="true" /></div>
            <div className="source-footer-copy">
              <span>SUMBER &amp; SKOP</span>
              <h2>International Pencak Silat Competition Regulations Year 2026</h2>
              <p>Rujukan: worldpencaksilat.org · tajuk peraturan dicetak pada halaman 8. Tarikh kuat kuasa tidak dinyatakan dalam PDF. Nama fail yang diterima: “VER FEB 2026”; metadata fail: 3 Mei 2026.</p>
              <small>Ini ringkasan praktikal, bukan pengganti dokumen penuh. Semak peraturan dan arahan teknikal terkini dengan penganjur pertandingan.</small>
            </div>
            <a href="https://www.worldpencaksilat.org" target="_blank" rel="noreferrer" aria-label="Open World Pencak Silat website"><ArrowUpRight size={18} aria-hidden="true" /></a>
          </footer>
        </div>
      </GuidelinesMotion>
    </main>
  );
}
