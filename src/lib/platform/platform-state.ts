/**
 * FIGHTERX UNIFIED PLATFORM STATE LAYER
 * Single reactive state coordinating:
 * - Public Club Registration (/register-club)
 * - Admin Club Approvals & Master Training Framework (/admin)
 * - Coach Squad Monitoring, Verifications & Custom Challenges (/coach)
 * - Athlete Home Training Execution & Evidence Submission (/athlete)
 */

export interface ClubTenant {
  id: string;
  name: string;
  affiliation: string;
  state: string;
  representativeName: string;
  phone: string;
  email: string;
  status: "PENDING_APPROVAL" | "ACTIVE" | "REJECTED";
  trialStartsAt: string;
  trialEndsAt: string;
  coachCount: number;
  athleteCount: number;
  appliedAt: string;
}

export interface MasterTrainingTask {
  id: string;
  phase: "BLOK_1_FOUNDATION" | "BLOK_2_SPECIFIC_PEAK";
  category: "STRENGTH" | "ENDURANCE" | "MOBILITY" | "TECHNICAL_SENI" | "TECHNICAL_OLAHRAGA" | "BASELINE_TEST";
  title: string;
  description: string;
  durationMinutes: number;
  evidenceRequirement: "VIDEO" | "PHOTO" | "METRIC_ONLY";
  standardTarget: string;
}

export interface CoachCustomChallenge {
  id: string;
  clubId: string;
  coachId: string;
  coachName: string;
  target: "ALL_SQUAD" | "INDIVIDUAL";
  targetAthleteId?: string;
  targetAthleteName?: string;
  taskType: "DAILY" | "WEEKLY" | "SPECIAL";
  title: string;
  instructions: string;
  dueDate: string;
  evidenceRequirement: "VIDEO" | "PHOTO" | "METRIC_ONLY";
  repsTarget: string;
  createdAt: string;
}

export interface AthleteSubmission {
  id: string;
  clubId: string;
  athleteId: string;
  athleteName: string;
  athleteAvatar?: string;
  discipline: "SENI" | "OLAHRAGA";
  taskId: string;
  taskTitle: string;
  taskSource: "ADMIN_FRAMEWORK" | "COACH_CHALLENGE";
  submittedAt: string;
  evidenceType: "VIDEO_FILE" | "VIDEO_URL" | "PHOTO_FILE" | "METRIC_ONLY";
  evidenceUrl?: string;
  evidenceFileName?: string;
  repsOrDuration: string;
  rpeScore: number; // 1 (Mudah) to 10 (Sangat Penat)
  athleteNotes?: string;
  status: "PENDING_VERIFICATION" | "VERIFIED" | "CORRECTION_NEEDED";
  coachFeedback?: string;
  verifiedAt?: string;
  verifiedBy?: string;
}

export interface PlatformState {
  clubs: ClubTenant[];
  masterTasks: MasterTrainingTask[];
  customChallenges: CoachCustomChallenge[];
  submissions: AthleteSubmission[];
  activeClubId: string;
  activeRole: "ATHLETE" | "COACH" | "ADMIN";
}

const STORAGE_KEY = "fighterx_unified_platform_state_v1";

const INITIAL_CLUBS: ClubTenant[] = [
  {
    id: "club-harimau",
    name: "Kelab Silat Harimau Berantai",
    affiliation: "Persekutuan Silat Kebangsaan (PESAKA)",
    state: "Selangor",
    representativeName: "Cikgu Farid",
    phone: "012-3456789",
    email: "farid@harimauberantai.com",
    status: "ACTIVE",
    trialStartsAt: "2026-11-01T00:00:00.000Z",
    trialEndsAt: "2026-12-01T00:00:00.000Z",
    coachCount: 2,
    athleteCount: 28,
    appliedAt: "2026-11-01T08:30:00.000Z",
  },
  {
    id: "club-gayong-warisan",
    name: "Akademi Gayong Warisan Perkasa",
    affiliation: "Silat Seni Gayong Malaysia",
    state: "Kuala Lumpur",
    representativeName: "Cikgu Azlan",
    phone: "013-9876543",
    email: "azlan@gayongwarisan.my",
    status: "ACTIVE",
    trialStartsAt: "2026-10-15T00:00:00.000Z",
    trialEndsAt: "2026-11-15T00:00:00.000Z",
    coachCount: 3,
    athleteCount: 42,
    appliedAt: "2026-10-15T10:15:00.000Z",
  },
  {
    id: "club-cekak-pusaka",
    name: "Persatuan Silat Cekak Pusaka Gombak",
    affiliation: "Silat Cekak Hanafi",
    state: "Selangor",
    representativeName: "Ustaz Hamdan",
    phone: "019-2233445",
    email: "hamdan@cekakgombak.org",
    status: "PENDING_APPROVAL",
    trialStartsAt: "",
    trialEndsAt: "",
    coachCount: 1,
    athleteCount: 18,
    appliedAt: "2026-11-14T14:20:00.000Z",
  },
  {
    id: "club-olahraga-bintang",
    name: "Pusat Latihan Olahraga Silat Bintang Timur",
    affiliation: "Kelab Bebas",
    state: "Kelantan",
    representativeName: "Cikgu Syukri",
    phone: "011-5566778",
    email: "syukri@bintangtimur.com",
    status: "PENDING_APPROVAL",
    trialStartsAt: "",
    trialEndsAt: "",
    coachCount: 2,
    athleteCount: 25,
    appliedAt: "2026-11-15T07:10:00.000Z",
  },
];

const INITIAL_MASTER_TASKS: MasterTrainingTask[] = [
  {
    id: "mst-01",
    phase: "BLOK_1_FOUNDATION",
    category: "STRENGTH",
    title: "Kekuatan Teras & Push-up Asas",
    description: "Latihan asas kekuatan bahagian atas dan teras badan: 3 set push-up terkawal (15 reps) dan 3 set plank 45 saat.",
    durationMinutes: 15,
    evidenceRequirement: "VIDEO",
    standardTarget: "3 set x 15 reps push-up + 45s plank",
  },
  {
    id: "mst-02",
    phase: "BLOK_1_FOUNDATION",
    category: "ENDURANCE",
    title: "Larian Asas 6-Minit & Kardiovaskular",
    description: "Ujian lari/jalan pantas 6 minit di laluan rata untuk membina kapasiti aerobik asas di luar gelanggang.",
    durationMinutes: 20,
    evidenceRequirement: "METRIC_ONLY",
    standardTarget: "Minimum 1,200m dalam 6 minit",
  },
  {
    id: "mst-03",
    phase: "BLOK_1_FOUNDATION",
    category: "MOBILITY",
    title: "Mobiliti Buku Lali & Keseimbangan Lutut",
    description: "Knee-to-wall ankle mobility (cm kiri & kanan) serta single-leg balance untuk pendaratan dan kekuda selamat.",
    durationMinutes: 15,
    evidenceRequirement: "VIDEO",
    standardTarget: "10 cm jarak lutut ke dinding tanpa angkat tumit",
  },
  {
    id: "mst-04",
    phase: "BLOK_1_FOUNDATION",
    category: "TECHNICAL_SENI",
    title: "Latih Tubi Jurus Baku 1-3 (Silat Seni)",
    description: "Latihan ketepatan jurus tangan kosong, pernafasan, dan penguncian gerak secara konsisten.",
    durationMinutes: 25,
    evidenceRequirement: "VIDEO",
    standardTarget: "Kelancaran gerak tempo sederhana, 3 ulangan penuh",
  },
  {
    id: "mst-05",
    phase: "BLOK_1_FOUNDATION",
    category: "TECHNICAL_OLAHRAGA",
    title: "Footwork Lincah & Kombinasi Tendangan T",
    description: "Footwork pertahanan mundur 3 langkah diikuti tendangan balas T pantas menggunakan sasaran pad atau bayangan.",
    durationMinutes: 20,
    evidenceRequirement: "VIDEO",
    standardTarget: "5 set x 10 kombinasi (kiri & kanan)",
  },
];

const INITIAL_CHALLENGES: CoachCustomChallenge[] = [
  {
    id: "ch-01",
    clubId: "club-harimau",
    coachId: "coach-farid",
    coachName: "Cikgu Farid",
    target: "ALL_SQUAD",
    taskType: "DAILY",
    title: "Cabaran 50 Sepak Layang Kiri & Kanan",
    instructions: "Buat 25 sepak layang kanan dan 25 kiri. Fokus pada ketinggian aras dada dan pemulihan kekuda pantas. Rakam video 30 saat untuk set terakhir.",
    dueDate: "Hari Ini, 10:00 PM",
    evidenceRequirement: "VIDEO",
    repsTarget: "50 reps total (25L + 25R)",
    createdAt: "2026-11-15T06:00:00.000Z",
  },
  {
    id: "ch-02",
    clubId: "club-harimau",
    coachId: "coach-farid",
    coachName: "Cikgu Farid",
    target: "ALL_SQUAD",
    taskType: "WEEKLY",
    title: "Sasaran 300 Ulangan Kekuda Samping & Depan",
    instructions: "Lengkapkan 300 saat kumulatif kekuda rendah sepanjang minggu ini. Catatkan masa harian dalam rekod latihan.",
    dueDate: "Ahad Ini, 11:59 PM",
    evidenceRequirement: "METRIC_ONLY",
    repsTarget: "300 saat kumulatif",
    createdAt: "2026-11-10T08:00:00.000Z",
  },
];

const INITIAL_SUBMISSIONS: AthleteSubmission[] = [
  {
    id: "sub-01",
    clubId: "club-harimau",
    athleteId: "ath-alya",
    athleteName: "Alya Nabilah",
    athleteAvatar: "AN",
    discipline: "SENI",
    taskId: "mst-04",
    taskTitle: "Latih Tubi Jurus Baku 1-3 (Silat Seni)",
    taskSource: "ADMIN_FRAMEWORK",
    submittedAt: "2026-11-15T07:45:00.000Z",
    evidenceType: "VIDEO_URL",
    evidenceUrl: "https://youtu.be/demo-jurus-baku-alya",
    evidenceFileName: "jurus-baku-set3.mp4",
    repsOrDuration: "3 pusingan penuh (18 minit)",
    rpeScore: 7,
    athleteNotes: "Pusingan ke-3 rasa lebih seimbang, kekuda rendah kekal stabil.",
    status: "PENDING_VERIFICATION",
  },
  {
    id: "sub-02",
    clubId: "club-harimau",
    athleteId: "ath-danial",
    athleteName: "Muhammad Danial",
    athleteAvatar: "MD",
    discipline: "OLAHRAGA",
    taskId: "ch-01",
    taskTitle: "Cabaran 50 Sepak Layang Kiri & Kanan",
    taskSource: "COACH_CHALLENGE",
    submittedAt: "2026-11-15T08:15:00.000Z",
    evidenceType: "VIDEO_FILE",
    evidenceFileName: "danial-sepak-layang.mp4",
    repsOrDuration: "50 reps lengkap",
    rpeScore: 8,
    athleteNotes: "Tendangan kanan sampai aras leher, kaki kiri perlukan sedikit regangan lagi.",
    status: "PENDING_VERIFICATION",
  },
  {
    id: "sub-03",
    clubId: "club-harimau",
    athleteId: "ath-khadijah",
    athleteName: "Siti Khadijah",
    athleteAvatar: "SK",
    discipline: "SENI",
    taskId: "mst-03",
    taskTitle: "Mobiliti Buku Lali & Keseimbangan Lutut",
    taskSource: "ADMIN_FRAMEWORK",
    submittedAt: "2026-11-14T18:30:00.000Z",
    evidenceType: "PHOTO_FILE",
    evidenceFileName: "ankle-knee-wall-test.jpg",
    repsOrDuration: "12 cm kiri, 11 cm kanan",
    rpeScore: 5,
    athleteNotes: "Tiada sakit pada buku lali.",
    status: "VERIFIED",
    coachFeedback: "Bagus Siti, sudut buku lali sangat memuaskan. Kekalkan latihan mobiliti setiap pagi.",
    verifiedAt: "2026-11-14T20:10:00.000Z",
    verifiedBy: "Cikgu Farid",
  },
];

class PlatformStore {
  private state: PlatformState;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.state = this.loadState();
  }

  private loadState(): PlatformState {
    if (typeof window === "undefined") {
      return {
        clubs: INITIAL_CLUBS,
        masterTasks: INITIAL_MASTER_TASKS,
        customChallenges: INITIAL_CHALLENGES,
        submissions: INITIAL_SUBMISSIONS,
        activeClubId: "club-harimau",
        activeRole: "ATHLETE",
      };
    }

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          clubs: parsed.clubs?.length ? parsed.clubs : INITIAL_CLUBS,
          masterTasks: parsed.masterTasks?.length ? parsed.masterTasks : INITIAL_MASTER_TASKS,
          customChallenges: parsed.customChallenges || INITIAL_CHALLENGES,
          submissions: parsed.submissions?.length ? parsed.submissions : INITIAL_SUBMISSIONS,
          activeClubId: parsed.activeClubId || "club-harimau",
          activeRole: parsed.activeRole || "ATHLETE",
        };
      }
    } catch {
      // ignore
    }

    return {
      clubs: INITIAL_CLUBS,
      masterTasks: INITIAL_MASTER_TASKS,
      customChallenges: INITIAL_CHALLENGES,
      submissions: INITIAL_SUBMISSIONS,
      activeClubId: "club-harimau",
      activeRole: "ATHLETE",
    };
  }

  private saveState() {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch {
      // ignore
    }
    this.notify();
  }

  private notify() {
    for (const listener of this.listeners) {
      listener();
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public getState(): PlatformState {
    return this.state;
  }

  // Action: Register a new club from /register-club
  public registerClub(data: {
    name: string;
    affiliation?: string;
    state?: string;
    representativeName: string;
    phone: string;
    email: string;
  }): ClubTenant {
    const randomId = `club-${Math.floor(1000 + Math.random() * 9000)}`;
    const newClub: ClubTenant = {
      id: randomId,
      name: data.name,
      affiliation: data.affiliation || "Kelab Bebas",
      state: data.state || "Malaysia",
      representativeName: data.representativeName,
      phone: data.phone,
      email: data.email,
      status: "PENDING_APPROVAL",
      trialStartsAt: "",
      trialEndsAt: "",
      coachCount: 1,
      athleteCount: 0,
      appliedAt: new Date().toISOString(),
    };

    this.state.clubs = [newClub, ...this.state.clubs];
    this.saveState();
    return newClub;
  }

  // Action: Admin approves club -> activates 30-day trial
  public approveClub(clubId: string) {
    const now = new Date();
    const trialEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    this.state.clubs = this.state.clubs.map((club) => {
      if (club.id === clubId) {
        return {
          ...club,
          status: "ACTIVE",
          trialStartsAt: now.toISOString(),
          trialEndsAt: trialEnd.toISOString(),
        };
      }
      return club;
    });
    this.saveState();
  }

  // Action: Admin rejects club
  public rejectClub(clubId: string) {
    this.state.clubs = this.state.clubs.map((club) => {
      if (club.id === clubId) {
        return { ...club, status: "REJECTED" };
      }
      return club;
    });
    this.saveState();
  }

  // Action: Coach creates custom challenge for squad or athlete
  public createCoachChallenge(challenge: {
    clubId: string;
    coachId: string;
    coachName: string;
    target: "ALL_SQUAD" | "INDIVIDUAL";
    targetAthleteId?: string;
    targetAthleteName?: string;
    taskType: "DAILY" | "WEEKLY" | "SPECIAL";
    title: string;
    instructions: string;
    dueDate: string;
    evidenceRequirement: "VIDEO" | "PHOTO" | "METRIC_ONLY";
    repsTarget: string;
  }): CoachCustomChallenge {
    const newChallenge: CoachCustomChallenge = {
      ...challenge,
      id: `ch-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    this.state.customChallenges = [newChallenge, ...this.state.customChallenges];
    this.saveState();
    return newChallenge;
  }

  // Action: Coach deletes a custom challenge
  public deleteCoachChallenge(challengeId: string) {
    this.state.customChallenges = this.state.customChallenges.filter((c) => c.id !== challengeId);
    this.saveState();
  }

  // Action: Athlete submits home training evidence
  public submitAthleteEvidence(sub: {
    clubId: string;
    athleteId: string;
    athleteName: string;
    discipline: "SENI" | "OLAHRAGA";
    taskId: string;
    taskTitle: string;
    taskSource: "ADMIN_FRAMEWORK" | "COACH_CHALLENGE";
    evidenceType: "VIDEO_FILE" | "VIDEO_URL" | "PHOTO_FILE" | "METRIC_ONLY";
    evidenceUrl?: string;
    evidenceFileName?: string;
    repsOrDuration: string;
    rpeScore: number;
    athleteNotes?: string;
  }): AthleteSubmission {
    const newSubmission: AthleteSubmission = {
      ...sub,
      id: `sub-${Date.now()}`,
      athleteAvatar: sub.athleteName
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase(),
      submittedAt: new Date().toISOString(),
      status: "PENDING_VERIFICATION",
    };

    this.state.submissions = [newSubmission, ...this.state.submissions];
    this.saveState();
    return newSubmission;
  }

  // Action: Coach verifies or requests correction for submission
  public verifySubmission(
    submissionId: string,
    status: "VERIFIED" | "CORRECTION_NEEDED",
    feedback: string,
    coachName: string = "Cikgu Farid"
  ) {
    this.state.submissions = this.state.submissions.map((sub) => {
      if (sub.id === submissionId) {
        return {
          ...sub,
          status,
          coachFeedback: feedback,
          verifiedAt: new Date().toISOString(),
          verifiedBy: coachName,
        };
      }
      return sub;
    });
    this.saveState();
  }

  // Action: Admin updates Master Training Task
  public updateMasterTask(taskId: string, updates: Partial<MasterTrainingTask>) {
    this.state.masterTasks = this.state.masterTasks.map((t) => (t.id === taskId ? { ...t, ...updates } : t));
    this.saveState();
  }

  // Action: Reset demo state to clean seeds
  public resetToDefault() {
    this.state = {
      clubs: INITIAL_CLUBS,
      masterTasks: INITIAL_MASTER_TASKS,
      customChallenges: INITIAL_CHALLENGES,
      submissions: INITIAL_SUBMISSIONS,
      activeClubId: "club-harimau",
      activeRole: "ATHLETE",
    };
    this.saveState();
  }
}

// Global Singleton Export
export const platformStore = new PlatformStore();

// React Hook for effortless component consumption
export function usePlatformState(): [PlatformState, typeof platformStore] {
  if (typeof window === "undefined") {
    return [platformStore.getState(), platformStore];
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks, @typescript-eslint/no-explicit-any
  const React = require("react") as any;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [state, setState] = (React.useState as <T>(fn: () => T) => [T, (val: T) => void])<PlatformState>(() => platformStore.getState());

  // eslint-disable-next-line react-hooks/rules-of-hooks
  React.useEffect(() => {
    setState(platformStore.getState());
    return platformStore.subscribe(() => {
      setState({ ...platformStore.getState() });
    });
  }, []);

  return [state, platformStore];
}
