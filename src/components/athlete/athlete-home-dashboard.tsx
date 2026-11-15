"use client";

import React, { useState, type ReactNode } from "react";
import Link from "next/link";
import {
  Activity,
  AlertCircle,
  ArrowRight,
  BarChart3,
  BookOpen,
  CalendarDays,
  Camera,
  CheckCircle2,
  Clock3,
  Dumbbell,
  Flame,
  Home,
  Megaphone,
  ShieldCheck,
  Upload,
  UserRound,
} from "lucide-react";
import type {
  AthleteHomeDashboardData,
  AthleteHomeLoadResult,
  AthleteHomeTaskStatus,
} from "@/lib/athlete/athlete-home-contract";
import type { Discipline } from "@/types/platform";
import { usePlatformState } from "@/lib/platform/platform-state";
import { SubmitEvidenceModal } from "./submit-evidence-modal";

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
    { label: "Home", href: "/athlete", icon: Home, active: true },
    { label: "Guidelines", href: "/guidelines", icon: BookOpen, active: false },
    { label: "Moments", href: "/moments", icon: Camera, active: false },
    { label: "Sains Sukan", href: "/sport-science", icon: Dumbbell, active: false },
  ];

  return (
    <nav className={mobile ? "athlete-bottom-nav" : "athlete-side-nav"} aria-label="Athlete portal navigation">
      {navItems.map(({ label, href, icon: Icon, active }) =>
        active ? (
          <span className="athlete-nav-item is-active" aria-current="page" key={label}>
            <Icon size={18} strokeWidth={1.9} aria-hidden="true" />
            <span>{label}</span>
          </span>
        ) : (
          <Link className="athlete-nav-item" href={href} key={label}>
            <Icon size={18} strokeWidth={1.9} aria-hidden="true" />
            <span>{label}</span>
          </Link>
        )
      )}
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
  const [platformState] = usePlatformState();
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<{
    id: string;
    title: string;
    source: "ADMIN_FRAMEWORK" | "COACH_CHALLENGE";
  }>({
    id: "mst-04",
    title: "Latih Tubi Jurus Baku 1-3 (Silat Seni)",
    source: "ADMIN_FRAMEWORK",
  });

  const today = data.today;
  const restStatus = today?.status === "REST_DAY" || today?.status === "RECOVERY_DAY" || today?.status === "APPROVED_EXEMPTION";
  const initials = data.athlete.initials || data.athlete.displayName.slice(0, 1).toLocaleUpperCase();

  // Filter submissions for this athlete
  const submissions = platformState.submissions;

  // Check if today's master task has already been submitted
  const hasSubmittedToday = submissions.some(
    (s) => s.taskId === "mst-04" || s.taskTitle.includes(today?.title || "Latih Tubi")
  );

  return (
    <div className="athlete-app-shell">
      {/* Side Profile Navigation */}
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
          <span>Akaun Atlet Aktif<br /><small>KELAB SILAT HARIMAU</small></span>
        </div>
      </aside>

      <div className="athlete-main-column">
        {/* Context Strip */}
        <header className="athlete-topbar">
          <span className="athlete-topbar-context">FIGHTERX <span>/</span> ATHLETE PORTAL</span>
          <div className="athlete-topbar-person">
            <span className="athlete-topbar-club">{data.athlete.clubName}</span>
            <span className="athlete-avatar athlete-avatar-small" aria-hidden="true">{initials}</span>
          </div>
        </header>

        <main className="athlete-dashboard" aria-labelledby="athlete-greeting">
          {/* Synchronized Platform Banner */}
          <div className="athlete-demo-notice border-[#e10600]/30 bg-[#e10600]/10" role="status">
            <span className="athlete-demo-dot bg-[#e10600]" aria-hidden="true" />
            <span>
              <strong>SISTEM TERPADU</strong> · Latihan dipadankan secara langsung dengan Kerangka Kebangsaan 2027 &amp; Pengesahan Coach Cikgu Farid.
            </span>
          </div>

          {/* Welcome greeting */}
          <section className="athlete-welcome">
            <div>
              <p className="athlete-date">{data.asOf}</p>
              <h1 id="athlete-greeting">Selamat kembali, <span>{data.athlete.displayName}</span></h1>
              <p className="athlete-welcome-copy">
                Laksanakan program latihan di rumah, rakam bukti video atau catat ulangan/RPE untuk semakan jurulatih kelab anda.
              </p>
            </div>
            <span className="athlete-welcome-discipline">{disciplineNames[data.athlete.discipline]}</span>
          </section>

          {/* Master Framework Training Task Today */}
          <section className="athlete-today-panel" aria-labelledby="athlete-today-title">
            <div className="athlete-today-heading">
              <div className="athlete-section-title-row">
                <span className="athlete-section-icon"><CalendarDays size={18} aria-hidden="true" /></span>
                <div>
                  <p className="athlete-section-label">KERANGKA LATIHAN KEBANGSAAN 2027</p>
                  <h2 id="athlete-today-title">{today ? restStatus ? "Rehat & pemulihan" : "Tugasan Latihan Hari Ini" : "Tiada tugasan hari ini"}</h2>
                </div>
              </div>
              {today && (
                <span className={`athlete-status-chip ${hasSubmittedToday ? "status-pending-verification" : "status-assigned"}`}>
                  <StatusIcon status={hasSubmittedToday ? "PENDING_VERIFICATION" : today.status} />
                  {hasSubmittedToday ? "Menunggu Semakan Coach" : statusLabels[today.status]}
                </span>
              )}
            </div>

            {today ? (
              <>
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
                    {today.requirements.map((requirement) => (
                      <div key={`${requirement.label}-${requirement.target}`}>
                        <dt>{requirement.label}</dt>
                        <dd>{requirement.target}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
                <div className="athlete-evidence-requirement">
                  <ShieldCheck size={16} aria-hidden="true" />
                  <span>
                    <strong>{today.evidence.required ? "Bukti video diperlukan" : "Bukti pilihan"}</strong>
                    {today.evidence.note && ` · ${today.evidence.note}`}
                  </span>
                </div>
              </>
            ) : (
              <EmptyPanel icon={<CalendarDays size={16} aria-hidden="true" />}>
                Belum ada tugasan latihan yang dikaitkan untuk hari ini.
              </EmptyPanel>
            )}

            <div className="athlete-today-footer">
              <p>
                {hasSubmittedToday
                  ? "✅ Bukti latihan telah dihantar. Menunggu semakan dan penilaian RPE daripada Cikgu Farid."
                  : "Rakam video latihan atau salin pautan YouTube/Drive serta catat RPE untuk dinilai coach."}
              </p>
              <button
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#e10600] to-[#b30000] hover:from-[#ff3845] hover:to-[#e10600] text-white font-bold text-xs shadow-lg shadow-red-950/40 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
                type="button"
                onClick={() => {
                  setSelectedTask({
                    id: "mst-04",
                    title: today?.title || "Latih Tubi Jurus Baku 1-3 (Silat Seni)",
                    source: "ADMIN_FRAMEWORK",
                  });
                  setIsSubmitModalOpen(true);
                }}
              >
                <Upload size={16} aria-hidden="true" />
                <span>{hasSubmittedToday ? "Hantar Bukti Tambahan" : "Hantar Bukti Latihan"}</span>
              </button>
            </div>
          </section>

          {/* Coach Custom Challenges Section */}
          {platformState.customChallenges.length > 0 && (
            <section
              className="athlete-content-panel mt-6 p-5 border border-[#e10600]/30 bg-gradient-to-r from-[#e10600]/10 via-[#17191e]/80 to-[#0c0d10]/90 rounded-2xl backdrop-blur-md shadow-xl"
              aria-labelledby="coach-challenges-title"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-[#e10600]/25 text-[#ff555a] border border-[#e10600]/40">
                    <Flame size={18} />
                  </span>
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-widest text-[#ff555a]">
                      TUGASAN KHAS JURULATIH
                    </p>
                    <h3 id="coach-challenges-title" className="text-sm font-bold text-white tracking-wide">
                      Cabaran Latihan Cikgu Farid ({platformState.customChallenges.length})
                    </h3>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-amber-300 bg-amber-950/60 border border-amber-500/40 px-3 py-1 rounded-full shadow-sm">
                  ⚡ Skuad Kelab
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {platformState.customChallenges.map((challenge) => {
                  const challengeSubmitted = submissions.some((s) => s.taskId === challenge.id);

                  return (
                    <div
                      key={challenge.id}
                      className="p-4 rounded-xl bg-black/50 border border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[#e10600]/40 transition-colors"
                    >
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/10 text-[#E5E5E7] uppercase tracking-wider">
                            {challenge.taskType === "DAILY" ? "Cabaran Harian" : challenge.taskType === "WEEKLY" ? "Cabaran Mingguan" : "Khas"}
                          </span>
                          <h4 className="text-sm font-bold text-white truncate">{challenge.title}</h4>
                        </div>
                        <p className="text-xs text-[#96989f] leading-relaxed">{challenge.instructions}</p>
                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#c5c6ca] pt-1">
                          <span>Sasaran: <strong className="text-white font-semibold">{challenge.repsTarget}</strong></span>
                          <span>•</span>
                          <span>Tarikh Akhir: <strong className="text-white font-semibold">{challenge.dueDate}</strong></span>
                        </div>
                      </div>

                      <div className="flex-shrink-0 flex items-center gap-3">
                        {challengeSubmitted ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#22c55e]/15 border border-[#22c55e]/40 text-[#4ade80] text-xs font-bold">
                            <CheckCircle2 size={13} />
                            <span>Dihantar</span>
                          </span>
                        ) : null}

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedTask({
                              id: challenge.id,
                              title: challenge.title,
                              source: "COACH_CHALLENGE",
                            });
                            setIsSubmitModalOpen(true);
                          }}
                          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#e10600] hover:bg-[#ff3845] text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
                        >
                          <Upload size={14} />
                          <span>{challengeSubmitted ? "Hantar Semula" : "Hantar Bukti"}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Week Summary Stats */}
          <section className="athlete-week-summary" aria-label="Ringkasan minggu ini">
            <div className="athlete-summary-item summary-verified">
              <span className="summary-mark"><CheckCircle2 size={17} aria-hidden="true" /></span>
              <span><strong>{submissions.filter(s => s.status === "VERIFIED").length || data.week.verified}</strong><small>Disahkan</small></span>
            </div>
            <div className="athlete-summary-item summary-pending">
              <span className="summary-mark"><Clock3 size={17} aria-hidden="true" /></span>
              <span><strong>{submissions.filter(s => s.status === "PENDING_VERIFICATION").length || data.week.pendingVerification}</strong><small>Dalam semakan</small></span>
            </div>
            <div className="athlete-summary-item summary-assigned">
              <span className="summary-mark"><Activity size={17} aria-hidden="true" /></span>
              <span><strong>{data.week.scheduledSessions}</strong><small>Sesi dirancang</small></span>
            </div>
            <div className="athlete-summary-item summary-recovery">
              <span className="summary-mark"><Activity size={17} aria-hidden="true" /></span>
              <span><strong>{data.week.recoveryDays}</strong><small>Pemulihan</small></span>
            </div>
            <div className="athlete-summary-item summary-rest">
              <span className="summary-mark"><ShieldCheck size={17} aria-hidden="true" /></span>
              <span><strong>{data.week.restDays}</strong><small>Rehat</small></span>
            </div>
            <div className="athlete-summary-item summary-missed">
              <span className="summary-mark"><AlertCircle size={17} aria-hidden="true" /></span>
              <span><strong>{data.week.missed}</strong><small>Terlepas</small></span>
            </div>
          </section>

          {/* Main Grid: Weekly Plan & Coach Verification Feedback */}
          <div className="athlete-dashboard-grid">
            <div className="athlete-dashboard-primary-column">
              {/* Weekly Schedule */}
              <section className="athlete-content-panel athlete-week-panel" aria-labelledby="athlete-week-title">
                <div className="athlete-panel-heading">
                  <div className="athlete-section-title-row">
                    <span className="athlete-section-icon"><CalendarDays size={17} aria-hidden="true" /></span>
                    <div>
                      <h2 id="athlete-week-title">Pelan Minggu Ini</h2>
                      <p>Jadual modular Kerangka Kebangsaan mengikut disiplin silat.</p>
                    </div>
                  </div>
                </div>
                {data.week.days.length ? (
                  <ul className="athlete-week-list">
                    {data.week.days.map((day) => (
                      <li className={`athlete-week-row week-${day.status.toLowerCase().replaceAll("_", "-")}`} key={day.date}>
                        <span className="athlete-week-date"><strong>{day.dayLabel}</strong><small>{day.dateLabel}</small></span>
                        <span className="athlete-week-task">{day.title ?? "Tiada sesi dijadualkan"}</span>
                        <span className="athlete-week-status"><StatusIcon status={day.status} />{statusLabels[day.status]}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <EmptyPanel icon={<CalendarDays size={16} aria-hidden="true" />}>Belum ada jadual mingguan yang tersedia.</EmptyPanel>
                )}
                <p className="athlete-week-footnote">Hari rehat dan pemulihan kekal berasingan daripada sesi yang terlepas.</p>
              </section>

              {/* Real-time Coach Verification Panel */}
              <section className="athlete-content-panel athlete-verification-panel" aria-labelledby="athlete-verification-title">
                <div className="athlete-panel-heading">
                  <div className="athlete-section-title-row">
                    <span className="athlete-section-icon"><ShieldCheck size={17} aria-hidden="true" /></span>
                    <div>
                      <h2 id="athlete-verification-title">Semakan Coach &amp; Status Latihan</h2>
                      <p>Penghantaran bukti video &amp; skor RPE latihan di rumah.</p>
                    </div>
                  </div>
                </div>

                {submissions.length > 0 ? (
                  <ul className="athlete-verification-list space-y-2.5 mt-2">
                    {submissions.map((sub) => {
                      const isVerified = sub.status === "VERIFIED";
                      const isCorrection = sub.status === "CORRECTION_NEEDED";
                      const badgeClass = isVerified
                        ? "bg-[#22c55e]/15 border-[#22c55e]/40 text-[#4ade80]"
                        : isCorrection
                        ? "bg-[#f59e0b]/15 border-[#f59e0b]/40 text-[#fbbf24]"
                        : "bg-[#e10600]/15 border-[#e10600]/40 text-[#ff555a]";
                      const label = isVerified ? "Disahkan Coach" : isCorrection ? "Perlu Pembetulan" : "Menunggu Semakan";

                      return (
                        <li key={sub.id} className="p-3.5 rounded-xl bg-black/40 border border-white/[0.08] flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <strong className="text-white text-xs font-bold">{sub.taskTitle}</strong>
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[10px] font-bold ${badgeClass}`}>
                              {isVerified ? <CheckCircle2 size={11} /> : <Clock3 size={11} />}
                              {label}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#96989f]">
                            <span>{sub.repsOrDuration}</span>
                            <span>•</span>
                            <span>Skor RPE: <strong className="text-white font-semibold">{sub.rpeScore}/10</strong></span>
                            <span>•</span>
                            <span className="text-[#ff555a] font-medium">
                              {sub.evidenceType === "VIDEO_URL" ? "URL Video (Pautan)" : sub.evidenceFileName || "Fail Video"}
                            </span>
                          </div>

                          {sub.athleteNotes && (
                            <p className="text-[11px] text-[#868890] italic">
                              Nota atlet: &ldquo;{sub.athleteNotes}&rdquo;
                            </p>
                          )}

                          {sub.coachFeedback && (
                            <div className="mt-1 p-2.5 rounded-lg bg-amber-950/30 border border-amber-500/30 text-amber-200 text-xs">
                              <span className="font-bold text-amber-400">Maklum Balas ({sub.verifiedBy || "Cikgu Farid"}): </span>
                              &ldquo;{sub.coachFeedback}&rdquo;
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <EmptyPanel icon={<Clock3 size={16} aria-hidden="true" />}>
                    Belum ada penghantaran latihan untuk disemak.
                  </EmptyPanel>
                )}
              </section>
            </div>

            {/* Secondary Column: Assessment, Competition, Announcements */}
            <div className="athlete-dashboard-secondary-column">
              <section className="athlete-content-panel athlete-progress-panel" aria-labelledby="athlete-progress-title">
                <div className="athlete-panel-heading">
                  <div className="athlete-section-title-row">
                    <span className="athlete-section-icon"><BarChart3 size={17} aria-hidden="true" /></span>
                    <div>
                      <h2 id="athlete-progress-title">Penilaian Terkini</h2>
                      <p>Piawaian ujian asas kecergasan &amp; seni.</p>
                    </div>
                  </div>
                </div>
                {data.latestAssessment ? (
                  <div className="athlete-assessment-summary">
                    <span className="athlete-assessment-date">{data.latestAssessment.assessedAt}</span>
                    <strong>{data.latestAssessment.title}</strong>
                    <p>{data.latestAssessment.result}</p>
                    {data.latestAssessment.coachNote && <small>{data.latestAssessment.coachNote}</small>}
                  </div>
                ) : (
                  <EmptyPanel icon={<Activity size={16} aria-hidden="true" />}>Belum ada penilaian yang direkodkan.</EmptyPanel>
                )}
              </section>

              <section className="athlete-content-panel athlete-competition-panel" aria-labelledby="athlete-competition-title">
                <div className="athlete-panel-heading">
                  <div className="athlete-section-title-row">
                    <span className="athlete-section-icon"><CalendarDays size={17} aria-hidden="true" /></span>
                    <div>
                      <h2 id="athlete-competition-title">Pertandingan</h2>
                      <p>Sasaran kejohanan kebangsaan &amp; jemputan.</p>
                    </div>
                  </div>
                </div>
                {data.upcomingCompetition ? (
                  <div className="athlete-competition-details">
                    <strong>{data.upcomingCompetition.name}</strong>
                    <span>{data.upcomingCompetition.date}</span>
                    {data.upcomingCompetition.venue && <span>{data.upcomingCompetition.venue}</span>}
                    <span>{disciplineNames[data.upcomingCompetition.discipline]}</span>
                    {data.upcomingCompetition.participationStatus && <small>{data.upcomingCompetition.participationStatus}</small>}
                  </div>
                ) : (
                  <EmptyPanel icon={<CalendarDays size={16} aria-hidden="true" />}>Tiada pertandingan dikaitkan buat masa ini.</EmptyPanel>
                )}
              </section>

              <section className="athlete-content-panel athlete-announcements-panel" aria-labelledby="athlete-announcements-title">
                <div className="athlete-panel-heading">
                  <div className="athlete-section-title-row">
                    <span className="athlete-section-icon"><Megaphone size={17} aria-hidden="true" /></span>
                    <div>
                      <h2 id="athlete-announcements-title">Pengumuman Kelab</h2>
                      <p>Makluman pengurusan untuk pesilat.</p>
                    </div>
                  </div>
                </div>
                {data.announcements.length ? (
                  <ul className="athlete-announcement-list">
                    {data.announcements.map((announcement) => (
                      <li key={announcement.id}>
                        <div>
                          <strong>{announcement.title}</strong>
                          <small>{announcement.publishedAt}</small>
                        </div>
                        <p>{announcement.body}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <EmptyPanel icon={<Megaphone size={16} aria-hidden="true" />}>Tiada pengumuman untuk dipaparkan.</EmptyPanel>
                )}
              </section>
            </div>
          </div>

          {/* Quick Action Ecosystem Links */}
          <section className="athlete-quick-actions" aria-label="Rujukan dan modul sokongan">
            <div className="athlete-quick-action-intro">
              <h2>Rujukan &amp; Komuniti</h2>
              <p>Akses pantas ke modul pertandingan dan sains sukan.</p>
            </div>
            <Link
              href="/moments?upload=true"
              className="athlete-quick-action is-available"
              style={{ borderColor: "rgba(225, 6, 0, 0.4)" }}
            >
              <Camera size={17} aria-hidden="true" className="text-[#FF3845]" />
              <span>
                <strong>Kongsi Moment Latihan</strong>
                <small>Muat naik foto gelanggang ke galeri atlet</small>
              </span>
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
            <Link href="/guidelines" className="athlete-quick-action is-available">
              <BookOpen size={17} aria-hidden="true" />
              <span>
                <strong>Panduan Pertandingan PERSILAT</strong>
                <small>Semak undang-undang dan peraturan 2026</small>
              </span>
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
            <Link href="/disciplines" className="athlete-quick-action is-available">
              <ShieldCheck size={17} aria-hidden="true" />
              <span>
                <strong>Disiplin Seni &amp; Olahraga</strong>
                <small>Kategori pertandingan dan spesifikasi</small>
              </span>
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
            <Link href="/sport-science" className="athlete-quick-action is-available">
              <Dumbbell size={17} aria-hidden="true" />
              <span>
                <strong>Modul Sains Sukan</strong>
                <small>Periodisasi dan pengurusan beban latihan</small>
              </span>
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </section>
        </main>

        <AthleteNavigation mobile />
      </div>

      {/* Interactive Evidence Submission Modal */}
      <SubmitEvidenceModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        taskId={selectedTask.id}
        taskTitle={selectedTask.title}
        taskSource={selectedTask.source}
        discipline={data.athlete.discipline}
        athleteName={data.athlete.displayName}
        clubId={platformState.activeClubId || "club-harimau"}
      />
    </div>
  );
}

export function AthleteHomeDashboard({ state }: AthleteHomeDashboardProps) {
  if (state.status !== "demo") return <StateMessage state={state} />;
  return <DemoDashboard data={state.data} />;
}
