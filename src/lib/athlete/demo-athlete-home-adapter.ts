import type { AthleteHomeLoadResult, AthleteHomeService, AthleteHomeTaskStatus, AthleteWeekDay } from "@/lib/athlete/athlete-home-contract";

const DAY_MS = 24 * 60 * 60 * 1000;

function atLocalMidnight(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function getMonday(date: Date): Date {
  const monday = atLocalMidnight(date);
  const daysSinceMonday = (monday.getDay() + 6) % 7;
  monday.setDate(monday.getDate() - daysSinceMonday);
  return monday;
}

function formatDay(date: Date, options: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat("ms-MY", options).format(date);
}

function formatDate(date: Date): string {
  return formatDay(date, { day: "numeric", month: "short", year: "numeric" });
}

function buildWeek(now: Date): AthleteWeekDay[] {
  const monday = getMonday(now);
  const today = atLocalMidnight(now);

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday.getTime() + index * DAY_MS);
    const dayOffset = Math.round((date.getTime() - today.getTime()) / DAY_MS);
    let status: AthleteHomeTaskStatus;
    let title: string | undefined;

    if (dayOffset === 0) {
      status = "ASSIGNED";
      title = "Mobiliti & keseimbangan";
    } else if (dayOffset < 0) {
      const daysBack = Math.abs(dayOffset);
      if (daysBack === 3) {
        status = "PENDING_VERIFICATION";
        title = "Larian asas";
      } else if (daysBack === 4) {
        status = "REST_DAY";
        title = "Rehat terancang";
      } else if (daysBack === 2) {
        status = "RECOVERY_DAY";
        title = "Pemulihan aktif";
      } else {
        status = "VERIFIED";
        title = daysBack % 2 === 0 ? "Kekuatan asas" : "Stamina";
      }
    } else if (date.getDay() === 0) {
      status = "REST_DAY";
      title = "Rehat terancang";
    } else {
      status = "UPCOMING";
      title = "Sesi latihan berjadual";
    }

    return {
      date: date.toISOString(),
      dayLabel: formatDay(date, { weekday: "short" }),
      dateLabel: formatDay(date, { day: "numeric", month: "short" }),
      status,
      title,
    };
  });
}

function buildDemoHome(now: Date) {
  const days = buildWeek(now);
  return {
    mode: "DEMO" as const,
    asOf: formatDay(now, { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
    athlete: {
      displayName: "Alya Nabilah",
      initials: "AN",
      clubName: "FighterX Demo Club",
      discipline: "SENI" as const,
    },
    today: {
      id: "demo-today-mobility",
      title: "Mobiliti & keseimbangan",
      category: "Mobiliti",
      status: "ASSIGNED" as const,
      durationMinutes: 15,
      dueLabel: "Selesaikan hari ini",
      instructions: "Ikut arahan program yang diberikan coach. Buat pergerakan secara terkawal dan berhenti jika arahan menimbulkan rasa sakit.",
      requirements: [
        { label: "Set", target: "2 pusingan" },
        { label: "Tempoh", target: "15 minit" },
      ],
      evidence: {
        required: true,
        accepted: ["VIDEO", "IMAGE"] as Array<"VIDEO" | "IMAGE">,
        note: "Video ringkas diperlukan untuk semakan coach.",
      },
    },
    week: {
      scheduledSessions: days.filter((day) => !["REST_DAY", "RECOVERY_DAY", "APPROVED_EXEMPTION"].includes(day.status)).length,
      verified: days.filter((day) => day.status === "VERIFIED").length,
      pendingVerification: days.filter((day) => day.status === "PENDING_VERIFICATION").length,
      missed: days.filter((day) => day.status === "MISSED").length,
      recoveryDays: days.filter((day) => day.status === "RECOVERY_DAY").length,
      restDays: days.filter((day) => day.status === "REST_DAY").length,
      days,
    },
    latestAssessment: null,
    recentSubmissions: [
      {
        id: "demo-submission-run",
        title: "Larian asas",
        submittedAt: formatDate(new Date(atLocalMidnight(now).getTime() - 2 * DAY_MS)),
        status: "PENDING_VERIFICATION" as const,
      },
      {
        id: "demo-submission-strength",
        title: "Kekuatan asas",
        submittedAt: formatDate(new Date(atLocalMidnight(now).getTime() - 4 * DAY_MS)),
        status: "VERIFIED" as const,
        coachFeedback: "Teknik terkawal. Kekalkan kualiti pergerakan.",
      },
    ],
    upcomingCompetition: null,
    announcements: [],
  };
}

/** Preview-only adapter. Replace with authenticated, tenant-scoped backend service later. */
export const demoAthleteHomeAdapter: AthleteHomeService = {
  async loadHome(): Promise<AthleteHomeLoadResult> {
    await new Promise((resolve) => window.setTimeout(resolve, 220));
    return { status: "demo", data: buildDemoHome(new Date()) };
  },
};
