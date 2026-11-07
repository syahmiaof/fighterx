import Link from "next/link";
import type { ReactNode } from "react";
import {
  Activity,
  AlertCircle,
  ArrowRight,
  BarChart3,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Dumbbell,
  Home,
  Megaphone,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import type { AthleteHomeDashboardData, AthleteHomeLoadResult, AthleteHomeTaskStatus } from "@/lib/athlete/athlete-home-contract";
import type { Discipline } from "@/types/platform";

export type AthleteHomeUiState = { status: "loading" } | AthleteHomeLoadResult;

export type AthleteHomeDashboardProps = {
  state: AthleteHomeUiState;
};

const disciplineNames: Record<Discipline, string> = {
  SENI: "Silat Seni",
  OLAHRAGA: "Silat Olahraga",
};

const statusLabels: Record<AthleteHomeTaskStatus, string> = {
  UPCOMING: "Akan datang",
  ASSIGNED: "Ditugaskan",
  IN_PROGRESS: "Sedang dibuat",
  SUBMITTED: "Dihantar · menunggu semakan",
  PENDING_VERIFICATION: "Menunggu semakan coach",
  VERIFIED: "Disahkan coach",
  NEEDS_CORRECTION: "Perlu pembetulan",
  MISSED: "Terlepas tarikh",
  REST_DAY: "Rehat terancang",
  RECOVERY_DAY: "Pemulihan terancang",
  APPROVED_EXEMPTION: "Pengecualian diluluskan",
};

function StatusIcon({ status }: { status: AthleteHomeTaskStatus }) {
  if (status === "VERIFIED") return <CheckCircle2 size={16} aria-hidden="true" />;
  if (status === "PENDING_VERIFICATION" || status === "SUBMITTED") return <Clock3 size={16} aria-hidden="true" />;
  if (status === "NEEDS_CORRECTION" || status === "MISSED") return <AlertCircle size={16} aria-hidden="true" />;
  if (status === "REST_DAY" || status === "RECOVERY_DAY" || status === "APPROVED_EXEMPTION") return <ShieldCheck size={16} aria-hidden="true" />;
  return <Activity size={16} aria-hidden="true" />;
}

function AthleteNavigation({ mobile = false }: { mobile?: boolean }) {
  const navItems = [
    { label: "Home", icon: Home, active: true },
    { label: "Training", icon: Dumbbell, active: false },
    { label: "Progress", icon: BarChart3, active: false },
    { label: "More", icon: BookOpen, active: false },
  ];

  return (
    <nav className={mobile ? "athlete-bottom-nav" : "athlete-side-nav"} aria-label="Athlete portal navigation">
      {navItems.map(({ label, icon: Icon, active }) => active ? (
        <span className="athlete-nav-item is-active" aria-current="page" key={label}>
          <Icon size={18} strokeWidth={1.9} aria-hidden="true" />
          <span>{label}</span>
        </span>
      ) : (
        <button className="athlete-nav-item is-disabled" type="button" disabled title="Available in a later phase" key={label}>
          <Icon size={18} strokeWidth={1.9} aria-hidden="true" />
          <span>{label}</span>
          {!mobile && <small>Later</small>}
        </button>
      ))}
    </nav>
  );
}

function EmptyPanel({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return <div className="athlete-inline-empty">{icon}<p>{children}</p></div>;
}

function StateMessage({ state }: { state: Exclude<AthleteHomeUiState, { status: "demo" }> }) {
  const stateCopy = {
    loading: { title: "Memuatkan dashboard", detail: "Sedang mendapatkan ringkasan latihan anda.", icon: <Activity size={20} aria-hidden="true" /> },
    empty: { title: "Belum ada data latihan", detail: state.status === "empty" ? state.message : "Dashboard akan dipaparkan apabila akaun anda mempunyai tugasan.", icon: <CalendarDays size={20} aria-hidden="true" /> },
    error: { title: "Dashboard tak dapat dimuatkan", detail: state.status === "error" ? state.message : "Cuba muat semula sebentar lagi.", icon: <AlertCircle size={20} aria-hidden="true" /> },
    "access-denied": { title: "Akses atlet diperlukan", detail: state.status === "access-denied" ? state.message : "Sesi ini tidak mempunyai akses ke portal atlet.", icon: <ShieldCheck size={20} aria-hidden="true" /> },
    "inactive-membership": { title: "Keahlian kelab belum aktif", detail: state.status === "inactive-membership" ? state.message : "Hubungi wakil kelab untuk semak status keahlian anda.", icon: <UserRound size={20} aria-hidden="true" /> },
  };
  const copy = stateCopy[state.status];
  const loading = state.status === "loading";

  return (
    <main className="athlete-state-page" aria-live={loading ? "polite" : "assertive"} aria-busy={loading}>
      <section className="athlete-state-card" role={loading ? "status" : "alert"}>
        <span className={`athlete-state-icon${loading ? " is-loading" : ""}`}>{copy.icon}</span>
        <p className="athlete-section-label">ATHLETE PORTAL</p>
        <h1>{copy.title}</h1>
        <p>{copy.detail}</p>
      </section>
    </main>
  );
}

function DemoDashboard({ data }: { data: AthleteHomeDashboardData }) {
  const today = data.today;
  const restStatus = today?.status === "REST_DAY" || today?.status === "RECOVERY_DAY" || today?.status === "APPROVED_EXEMPTION";
  const initials = data.athlete.initials || data.athlete.displayName.slice(0, 1).toLocaleUpperCase();

  return (
    <div className="athlete-app-shell">
      <aside className="athlete-sidebar" aria-label="Athlete portal">
        <div className="athlete-brand" aria-label="FighterX Athlete Portal">
          <strong>FIGHTER<span>X</span></strong>
          <small>ATHLETE PORTAL</small>
        </div>

        <div className="athlete-sidebar-profile">
          <span className="athlete-avatar" aria-hidden="true">{initials}</span>
          <span className="athlete-sidebar-name">{data.athlete.displayName}</span>
          <span className="athlete-sidebar-club">{data.athlete.clubName}</span>
          <span className="athlete-discipline-chip">{disciplineNames[data.athlete.discipline]}</span>
        </div>

        <AthleteNavigation />
        <div className="athlete-sidebar-footer">
          <span className="athlete-sidebar-footer-mark" aria-hidden="true"><UserRound size={15} /></span>
          <span>Preview account<br /><small>DEMO DATA</small></span>
        </div>
      </aside>

      <div className="athlete-main-column">
        <header className="athlete-topbar">
          <span className="athlete-topbar-context">FIGHTERX <span>/</span> ATHLETE</span>
          <div className="athlete-topbar-person">
            <span className="athlete-topbar-club">{data.athlete.clubName}</span>
            <span className="athlete-avatar athlete-avatar-small" aria-hidden="true">{initials}</span>
          </div>
        </header>

        <main className="athlete-dashboard" aria-labelledby="athlete-greeting">
          <div className="athlete-demo-notice" role="status">
            <span className="athlete-demo-dot" aria-hidden="true" />
            <span><strong>DEMO DATA</strong> · Paparan contoh sahaja. Akaun, data kelab dan pengesahan coach belum disambungkan.</span>
          </div>

          <section className="athlete-welcome">
            <div>
              <p className="athlete-date">{data.asOf}</p>
              <h1 id="athlete-greeting">Selamat kembali, <span>{data.athlete.displayName}</span></h1>
              <p className="athlete-welcome-copy">Semak tugasan dan status latihan minggu ini. Pengesahan akhir datang daripada coach.</p>
            </div>
            <span className="athlete-welcome-discipline">{disciplineNames[data.athlete.discipline]}</span>
          </section>

          <section className="athlete-today-panel" aria-labelledby="athlete-today-title">
            <div className="athlete-today-heading">
              <div className="athlete-section-title-row">
                <span className="athlete-section-icon"><CalendarDays size={18} aria-hidden="true" /></span>
                <div>
                  <p className="athlete-section-label">HARI INI</p>
                  <h2 id="athlete-today-title">{today ? restStatus ? "Rehat & pemulihan" : "Tugasan latihan" : "Tiada tugasan hari ini"}</h2>
                </div>
              </div>
              {today && <span className={`athlete-status-chip status-${today.status.toLowerCase().replaceAll("_", "-")}`}><StatusIcon status={today.status} />{statusLabels[today.status]}</span>}
            </div>

            {today ? <>
              <div className="athlete-today-content">
                <div className="athlete-today-task">
                  <span className="athlete-task-category">{today.category}</span>
                  <h3>{today.title}</h3>
                  <p>{today.instructions}</p>
                  {restStatus && <p className="athlete-rest-note">Hari rehat atau pengecualian yang diluluskan tidak dikira sebagai latihan terlepas.</p>}
                </div>
                <dl className="athlete-task-details">
                  {today.durationMinutes > 0 && <div><dt>Tempoh</dt><dd>{today.durationMinutes} min</dd></div>}
                  {today.dueLabel && <div><dt>Tarikh akhir</dt><dd>{today.dueLabel}</dd></div>}
                  {today.requirements.map((requirement) => <div key={`${requirement.label}-${requirement.target}`}><dt>{requirement.label}</dt><dd>{requirement.target}</dd></div>)}
                </dl>
              </div>
              <div className="athlete-evidence-requirement">
                <ShieldCheck size={16} aria-hidden="true" />
                <span><strong>{today.evidence.required ? "Bukti diperlukan" : "Bukti pilihan"}</strong>{today.evidence.note && ` · ${today.evidence.note}`}</span>
              </div>
            </> : <EmptyPanel icon={<CalendarDays size={16} aria-hidden="true" />}>Belum ada tugasan latihan yang dikaitkan untuk hari ini.</EmptyPanel>}

            <div className="athlete-today-footer">
              <p>{today ? "Tugasan dan butiran latihan dipaparkan untuk rujukan; penghantaran belum tersedia dalam gate ini." : "Semak semula kemudian atau rujuk coach jika anda menjangkakan tugasan."}</p>
              <button className="athlete-action-button" type="button" disabled title="Halaman Training dibuka pada gate seterusnya">Lihat latihan <ArrowRight size={16} aria-hidden="true" /><small>Gate seterusnya</small></button>
            </div>
          </section>

          <section className="athlete-week-summary" aria-label="Ringkasan minggu ini">
            <div className="athlete-summary-item summary-verified"><span className="summary-mark"><CheckCircle2 size={17} aria-hidden="true" /></span><span><strong>{data.week.verified}</strong><small>Disahkan</small></span></div>
            <div className="athlete-summary-item summary-pending"><span className="summary-mark"><Clock3 size={17} aria-hidden="true" /></span><span><strong>{data.week.pendingVerification}</strong><small>Dalam semakan</small></span></div>
            <div className="athlete-summary-item summary-assigned"><span className="summary-mark"><Activity size={17} aria-hidden="true" /></span><span><strong>{data.week.scheduledSessions}</strong><small>Sesi dirancang</small></span></div>
            <div className="athlete-summary-item summary-recovery"><span className="summary-mark"><Activity size={17} aria-hidden="true" /></span><span><strong>{data.week.recoveryDays}</strong><small>Pemulihan</small></span></div>
            <div className="athlete-summary-item summary-rest"><span className="summary-mark"><ShieldCheck size={17} aria-hidden="true" /></span><span><strong>{data.week.restDays}</strong><small>Rehat</small></span></div>
            <div className="athlete-summary-item summary-missed"><span className="summary-mark"><AlertCircle size={17} aria-hidden="true" /></span><span><strong>{data.week.missed}</strong><small>Terlepas</small></span></div>
          </section>

          <div className="athlete-dashboard-grid">
            <div className="athlete-dashboard-primary-column">
              <section className="athlete-content-panel athlete-week-panel" aria-labelledby="athlete-week-title">
                <div className="athlete-panel-heading"><div className="athlete-section-title-row"><span className="athlete-section-icon"><CalendarDays size={17} aria-hidden="true" /></span><div><h2 id="athlete-week-title">Pelan minggu ini</h2><p>Bezakan sesi yang disahkan, menunggu dan hari rehat.</p></div></div></div>
                {data.week.days.length ? <ul className="athlete-week-list">{data.week.days.map((day) => <li className={`athlete-week-row week-${day.status.toLowerCase().replaceAll("_", "-")}`} key={day.date}>
                  <span className="athlete-week-date"><strong>{day.dayLabel}</strong><small>{day.dateLabel}</small></span>
                  <span className="athlete-week-task">{day.title ?? "Tiada sesi dijadualkan"}</span>
                  <span className="athlete-week-status"><StatusIcon status={day.status} />{statusLabels[day.status]}</span>
                </li>)}</ul> : <EmptyPanel icon={<CalendarDays size={16} aria-hidden="true" />}>Belum ada jadual mingguan yang tersedia.</EmptyPanel>}
                <p className="athlete-week-footnote">Hari rehat dan pemulihan kekal berasingan daripada sesi yang terlepas.</p>
              </section>

              <section className="athlete-content-panel athlete-verification-panel" aria-labelledby="athlete-verification-title">
                <div className="athlete-panel-heading"><div className="athlete-section-title-row"><span className="athlete-section-icon"><ShieldCheck size={17} aria-hidden="true" /></span><div><h2 id="athlete-verification-title">Semakan coach</h2><p>Penghantaran latihan perlu disemak sebelum dikira disahkan.</p></div></div></div>
                {data.recentSubmissions.length ? <ul className="athlete-verification-list">{data.recentSubmissions.map((item) => <li key={item.id}>
                  <span className={`athlete-verification-mark verification-${item.status.toLowerCase().replaceAll("_", "-")}`}><StatusIcon status={item.status} /></span>
                  <span className="athlete-verification-copy"><strong>{item.title}</strong><small>{item.submittedAt}{item.coachFeedback ? ` · ${item.coachFeedback}` : ""}</small></span>
                  <span className="athlete-verification-state">{statusLabels[item.status]}</span>
                </li>)}</ul> : <EmptyPanel icon={<Clock3 size={16} aria-hidden="true" />}>Belum ada penghantaran untuk disemak.</EmptyPanel>}
              </section>
            </div>

            <div className="athlete-dashboard-secondary-column">
              <section className="athlete-content-panel athlete-progress-panel" aria-labelledby="athlete-progress-title">
                <div className="athlete-panel-heading"><div className="athlete-section-title-row"><span className="athlete-section-icon"><BarChart3 size={17} aria-hidden="true" /></span><div><h2 id="athlete-progress-title">Penilaian terkini</h2><p>Ringkasan penilaian yang direkodkan.</p></div></div></div>
                {data.latestAssessment ? <div className="athlete-assessment-summary"><span className="athlete-assessment-date">{data.latestAssessment.assessedAt}</span><strong>{data.latestAssessment.title}</strong><p>{data.latestAssessment.result}</p>{data.latestAssessment.coachNote && <small>{data.latestAssessment.coachNote}</small>}</div> : <EmptyPanel icon={<Activity size={16} aria-hidden="true" />}>Belum ada penilaian yang direkodkan.</EmptyPanel>}
              </section>

              <section className="athlete-content-panel athlete-competition-panel" aria-labelledby="athlete-competition-title">
                <div className="athlete-panel-heading"><div className="athlete-section-title-row"><span className="athlete-section-icon"><CalendarDays size={17} aria-hidden="true" /></span><div><h2 id="athlete-competition-title">Pertandingan</h2><p>Acara yang dikaitkan dengan atlet.</p></div></div></div>
                {data.upcomingCompetition ? <div className="athlete-competition-details"><strong>{data.upcomingCompetition.name}</strong><span>{data.upcomingCompetition.date}</span>{data.upcomingCompetition.venue && <span>{data.upcomingCompetition.venue}</span>}<span>{disciplineNames[data.upcomingCompetition.discipline]}</span>{data.upcomingCompetition.participationStatus && <small>{data.upcomingCompetition.participationStatus}</small>}</div> : <EmptyPanel icon={<CalendarDays size={16} aria-hidden="true" />}>Tiada pertandingan dikaitkan buat masa ini.</EmptyPanel>}
              </section>

              <section className="athlete-content-panel athlete-announcements-panel" aria-labelledby="athlete-announcements-title">
                <div className="athlete-panel-heading"><div className="athlete-section-title-row"><span className="athlete-section-icon"><Megaphone size={17} aria-hidden="true" /></span><div><h2 id="athlete-announcements-title">Pengumuman</h2><p>Makluman untuk ahli kelab.</p></div></div></div>
                {data.announcements.length ? <ul className="athlete-announcement-list">{data.announcements.map((announcement) => <li key={announcement.id}><div><strong>{announcement.title}</strong><small>{announcement.publishedAt}</small></div><p>{announcement.body}</p></li>)}</ul> : <EmptyPanel icon={<Megaphone size={16} aria-hidden="true" />}>Tiada pengumuman untuk dipaparkan.</EmptyPanel>}
              </section>
            </div>
          </div>

          <section className="athlete-quick-actions" aria-label="Rujukan dan halaman akan datang">
            <div className="athlete-quick-action-intro"><h2>Rujukan</h2><p>Peraturan pertandingan yang berguna untuk persediaan.</p></div>
            <Link href="/guidelines" className="athlete-quick-action is-available"><BookOpen size={17} aria-hidden="true" /><span><strong>Competition Guidelines</strong><small>Semak panduan pertandingan</small></span><ArrowRight size={15} aria-hidden="true" /></Link>
            <button className="athlete-quick-action is-unavailable" type="button" disabled title="Halaman ini belum dibina"><Dumbbell size={17} aria-hidden="true" /><span><strong>Training</strong><small>Gate seterusnya</small></span><Clock3 size={14} aria-hidden="true" /></button>
            <button className="athlete-quick-action is-unavailable" type="button" disabled title="Halaman ini belum dibina"><BarChart3 size={17} aria-hidden="true" /><span><strong>Progress</strong><small>Gate seterusnya</small></span><Clock3 size={14} aria-hidden="true" /></button>
          </section>
        </main>
        <AthleteNavigation mobile />
      </div>
    </div>
  );
}

export function AthleteHomeDashboard({ state }: AthleteHomeDashboardProps) {
  if (state.status !== "demo") return <StateMessage state={state} />;
  return <DemoDashboard data={state.data} />;
}
