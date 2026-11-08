/**
 * FighterX Admin Portal - Service Adapter Layer
 * Asynchronous typed facade for platform administration workflows.
 * Simulates network latency while persisting changes to the central mock state store.
 */

import type {
  PlatformKPIStats,
  ClubApplication,
  AdminClub,
  SaaSClubSubscription,
  SubscriptionPaymentRecord,
  MasterTrainingProgramme,
  ProgrammeWeeklySchedule,
  WeeklyScheduleDay,
  ExerciseDefinition,
  AthleteProfile,
  CoachProfile,
  AssessmentRubric,
  AssessmentRecord,
  CompetitionEvent,
  KnowledgeArticle,
  LekirBotConfig,
  PlatformAnnouncement,
  AdminProfile,
  AdminState,
  AthleteDiscipline,
  AthleteStatus,
  ProgrammeMode,
  ApplicationStatus,
  SaaSClubSubscriptionStatus,
} from "./types";
import { initialMockAdminState } from "./mock-data";
import { ADMIN_LOCAL_STORAGE_KEY } from "./store";

// Helper for simulated network latency
const delay = (ms: number = 150) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

function getLocalState(): AdminState {
  if (typeof window === "undefined") {
    return initialMockAdminState;
  }
  try {
    const raw = localStorage.getItem(ADMIN_LOCAL_STORAGE_KEY);
    if (!raw) return initialMockAdminState;
    return JSON.parse(raw) as AdminState;
  } catch {
    return initialMockAdminState;
  }
}

function setLocalState(nextState: AdminState): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(
        ADMIN_LOCAL_STORAGE_KEY,
        JSON.stringify(nextState)
      );
    } catch (e) {
      console.error("Local storage error:", e);
    }
  }
}

export interface AdminService {
  // Overview & Analytics
  getDashboardKPIs(): Promise<PlatformKPIStats>;

  // Organizations & Applications
  getClubApplications(status?: ApplicationStatus): Promise<ClubApplication[]>;
  getApplicationById(id: string): Promise<ClubApplication | null>;
  reviewApplication(
    id: string,
    status: ApplicationStatus,
    notes: string[],
    rejectionReason?: string
  ): Promise<{ success: boolean; message: string; club?: AdminClub }>;
  getClubs(filter?: { discipline?: string; state?: string }): Promise<AdminClub[]>;
  getClubById(id: string): Promise<AdminClub | null>;

  // SaaS Subscriptions
  getSubscriptions(status?: SaaSClubSubscriptionStatus): Promise<SaaSClubSubscription[]>;
  getSubscriptionByClubId(clubId: string): Promise<SaaSClubSubscription | null>;
  recordSubscriptionPayment(
    clubId: string,
    payment: Omit<SubscriptionPaymentRecord, "id">
  ): Promise<SaaSClubSubscription>;

  // Master Training Programmes
  getMasterProgrammes(): Promise<MasterTrainingProgramme[]>;
  getMasterProgrammeById(id: string): Promise<MasterTrainingProgramme | null>;
  updateProgrammeMode(
    programmeId: string,
    mode: ProgrammeMode
  ): Promise<MasterTrainingProgramme>;
  updateWeeklySchedule(
    programmeId: string,
    scheduleId: string,
    days: WeeklyScheduleDay[]
  ): Promise<ProgrammeWeeklySchedule>;

  // Exercise Library
  getExercises(category?: string): Promise<ExerciseDefinition[]>;
  saveExercise(
    exercise: Omit<ExerciseDefinition, "id"> | ExerciseDefinition
  ): Promise<ExerciseDefinition>;
  deleteExercise(id: string): Promise<boolean>;

  // Athletes & Coaches
  getAthletes(discipline?: AthleteDiscipline, clubId?: string): Promise<AthleteProfile[]>;
  getAthleteById(id: string): Promise<AthleteProfile | null>;
  assignCoachToAthlete(athleteId: string, coachId: string): Promise<boolean>;
  updateAthleteDiscipline(
    athleteId: string,
    discipline: AthleteDiscipline
  ): Promise<AthleteProfile>;
  updateAthleteStatus(
    athleteId: string,
    status: AthleteStatus
  ): Promise<AthleteProfile>;
  getCoaches(clubId?: string): Promise<CoachProfile[]>;
  getCoachById(id: string): Promise<CoachProfile | null>;

  // Assessments & Competitions
  getAssessmentRubrics(type?: string): Promise<AssessmentRubric[]>;
  getAssessments(athleteId?: string): Promise<AssessmentRecord[]>;
  getCompetitions(): Promise<CompetitionEvent[]>;
  getCompetitionById(id: string): Promise<CompetitionEvent | null>;
  updateAthleteMedicalClearance(
    competitionId: string,
    athleteId: string,
    isCleared: boolean,
    clearedBy: string,
    clearanceNotes?: string
  ): Promise<boolean>;

  // Content, AI & Settings
  getKnowledgeArticles(status?: "DRAFT" | "PUBLISHED"): Promise<KnowledgeArticle[]>;
  saveKnowledgeArticle(
    article: Omit<KnowledgeArticle, "id"> | KnowledgeArticle
  ): Promise<KnowledgeArticle>;
  toggleArticleStatus(id: string): Promise<KnowledgeArticle>;
  getLekirBotConfig(): Promise<LekirBotConfig>;
  updateLekirBotConfig(config: Partial<LekirBotConfig>): Promise<LekirBotConfig>;
  getAnnouncements(): Promise<PlatformAnnouncement[]>;
  publishAnnouncement(
    announcement: Omit<PlatformAnnouncement, "id">
  ): Promise<PlatformAnnouncement>;
  getAdminProfile(): Promise<AdminProfile>;
  resetDemoState(): Promise<void>;
}

export const adminService: AdminService = {
  async getDashboardKPIs(): Promise<PlatformKPIStats> {
    await delay(100);
    return getLocalState().kpiStats;
  },

  async getClubApplications(status?: ApplicationStatus): Promise<ClubApplication[]> {
    await delay(120);
    const apps = getLocalState().applications;
    if (status) {
      return apps.filter((a) => a.status === status);
    }
    return apps;
  },

  async getApplicationById(id: string): Promise<ClubApplication | null> {
    await delay(80);
    const found = getLocalState().applications.find((a) => a.id === id);
    return found || null;
  },

  async reviewApplication(
    id: string,
    status: ApplicationStatus,
    notes: string[],
    rejectionReason?: string
  ): Promise<{ success: boolean; message: string; club?: AdminClub }> {
    await delay(200);
    const state = getLocalState();
    const appIndex = state.applications.findIndex((a) => a.id === id);
    if (appIndex === -1) {
      return { success: false, message: "Permohonan tidak ditemui." };
    }

    const app = state.applications[appIndex];
    const nowISO = new Date().toISOString();
    let newClub: AdminClub | undefined;

    const updatedApp: ClubApplication = {
      ...app,
      status,
      auditNotes: [...app.auditNotes, ...notes],
      reviewedAt: nowISO,
      reviewerId: state.adminProfile.id,
      rejectionReason: status === "REJECTED" ? rejectionReason : app.rejectionReason,
    };

    const nextApplications = [...state.applications];
    nextApplications[appIndex] = updatedApp;

    const nextClubs = [...state.clubs];
    const nextSubs = [...state.subscriptions];
    const nextKPI = { ...state.kpiStats };

    if (status === "APPROVED") {
      const newClubId = `club-${Date.now()}`;
      const newSubId = `sub-${Date.now()}`;
      const trialEndDate = new Date();
      trialEndDate.setDate(trialEndDate.getDate() + 30);

      newClub = {
        id: newClubId,
        name: app.clubName,
        registrationNumber: `PPM-${Date.now().toString().slice(-6)}`,
        type: app.clubType,
        state: app.state,
        district: app.district,
        address: app.address,
        discipline: "Both",
        status: "Active",
        memberCount: 0,
        coachCount: 0,
        seniAthletesCount: 0,
        olahragaAthletesCount: 0,
        subscriptionId: newSubId,
        subscriptionStatus: "TRIALING",
        contactPerson: app.picFullName,
        email: app.picEmail,
        phone: app.picPhoneNumber,
        joinedAt: nowISO,
        createdAt: nowISO,
      };
      nextClubs.unshift(newClub);

      const newSub: SaaSClubSubscription = {
        id: newSubId,
        clubId: newClubId,
        clubName: newClub.name,
        status: "TRIALING",
        trialStartDate: nowISO,
        trialEndDate: trialEndDate.toISOString(),
        billingPeriodStart: nowISO,
        billingPeriodEnd: trialEndDate.toISOString(),
        planPrice: 20,
        coveredClubCount: 1,
        nextRenewalDate: trialEndDate.toISOString(),
        paymentHistory: [],
      };
      nextSubs.unshift(newSub);

      nextKPI.registeredClubsCount += 1;
      nextKPI.pendingApplicationsCount = Math.max(0, nextKPI.pendingApplicationsCount - 1);
      nextKPI.activeSubscriptionsCount += 1;
    } else if (status === "REJECTED") {
      nextKPI.pendingApplicationsCount = Math.max(0, nextKPI.pendingApplicationsCount - 1);
    }

    setLocalState({
      ...state,
      applications: nextApplications,
      clubs: nextClubs,
      subscriptions: nextSubs,
      stats: nextKPI,
      kpiStats: nextKPI,
    });

    return {
      success: true,
      message:
        status === "APPROVED"
          ? `Kelab ${app.clubName} diluluskan dan percubaan 30 hari telah dimulakan.`
          : `Status permohonan dikemas kini kepada ${status}.`,
      club: newClub,
    };
  },

  async getClubs(filter?: { discipline?: string; state?: string }): Promise<AdminClub[]> {
    await delay(120);
    let clubs = getLocalState().clubs;
    if (filter?.discipline) {
      clubs = clubs.filter(
        (c) => c.discipline === filter.discipline || c.discipline === "Both"
      );
    }
    if (filter?.state) {
      clubs = clubs.filter((c) => c.state.toLowerCase() === filter.state?.toLowerCase());
    }
    return clubs;
  },

  async getClubById(id: string): Promise<AdminClub | null> {
    await delay(80);
    return getLocalState().clubs.find((c) => c.id === id) || null;
  },

  async getSubscriptions(status?: SaaSClubSubscriptionStatus): Promise<SaaSClubSubscription[]> {
    await delay(100);
    const subs = getLocalState().subscriptions;
    if (status) {
      return subs.filter((s) => s.status === status);
    }
    return subs;
  },

  async getSubscriptionByClubId(clubId: string): Promise<SaaSClubSubscription | null> {
    await delay(80);
    return getLocalState().subscriptions.find((s) => s.clubId === clubId) || null;
  },

  async recordSubscriptionPayment(
    clubId: string,
    payment: Omit<SubscriptionPaymentRecord, "id">
  ): Promise<SaaSClubSubscription> {
    await delay(180);
    const state = getLocalState();
    const subIndex = state.subscriptions.findIndex((s) => s.clubId === clubId);
    if (subIndex === -1) {
      throw new Error("Langganan tidak ditemui.");
    }

    const currentSub = state.subscriptions[subIndex];
    const newPaymentRecord: SubscriptionPaymentRecord = {
      ...payment,
      id: `inv-${Date.now()}`,
    };

    const updatedSub: SaaSClubSubscription = {
      ...currentSub,
      status: "ACTIVE",
      lastPaymentDate: new Date().toISOString(),
      paymentHistory: [newPaymentRecord, ...currentSub.paymentHistory],
    };

    const nextSubs = [...state.subscriptions];
    nextSubs[subIndex] = updatedSub;

    const nextClubs = state.clubs.map((c) =>
      c.id === clubId ? { ...c, subscriptionStatus: "ACTIVE" as const } : c
    );

    setLocalState({
      ...state,
      subscriptions: nextSubs,
      clubs: nextClubs,
    });

    return updatedSub;
  },

  async getMasterProgrammes(): Promise<MasterTrainingProgramme[]> {
    await delay(100);
    return getLocalState().programmes;
  },

  async getMasterProgrammeById(id: string): Promise<MasterTrainingProgramme | null> {
    await delay(80);
    return getLocalState().programmes.find((p) => p.id === id) || null;
  },

  async updateProgrammeMode(
    programmeId: string,
    mode: ProgrammeMode
  ): Promise<MasterTrainingProgramme> {
    await delay(150);
    const state = getLocalState();
    const progIndex = state.programmes.findIndex((p) => p.id === programmeId);
    if (progIndex === -1) {
      throw new Error("Program latihan tidak ditemui.");
    }

    const updated = { ...state.programmes[progIndex], activeMode: mode };
    const nextProgs = [...state.programmes];
    nextProgs[progIndex] = updated;

    setLocalState({ ...state, programmes: nextProgs });
    return updated;
  },

  async updateWeeklySchedule(
    programmeId: string,
    scheduleId: string,
    days: WeeklyScheduleDay[]
  ): Promise<ProgrammeWeeklySchedule> {
    await delay(180);
    // Mandatory rest/recovery day guardrail check
    const hasRest = days.some(
      (d) => d.isRestDay || d.mode === "Recovery" || d.intensity === "Rest"
    );
    if (!hasRest) {
      throw new Error(
        "Jadual mingguan wajib mengandungi sekurang-kurangnya 1 hari rehat/pemulihan (Rest/Recovery Day)."
      );
    }

    const state = getLocalState();
    const prog = state.programmes.find((p) => p.id === programmeId);
    if (!prog) throw new Error("Program latihan tidak ditemui.");

    const schedIndex = prog.weeklySchedules.findIndex((ws) => ws.id === scheduleId);
    if (schedIndex === -1) throw new Error("Jadual mingguan tidak ditemui.");

    const updatedSchedule = { ...prog.weeklySchedules[schedIndex], days };
    const updatedWeekly = [...prog.weeklySchedules];
    updatedWeekly[schedIndex] = updatedSchedule;

    const updatedProg = { ...prog, weeklySchedules: updatedWeekly };
    const nextProgrammes = state.programmes.map((p) =>
      p.id === programmeId ? updatedProg : p
    );

    setLocalState({ ...state, programmes: nextProgrammes });
    return updatedSchedule;
  },

  async getExercises(category?: string): Promise<ExerciseDefinition[]> {
    await delay(100);
    const exercises = getLocalState().exercises;
    if (category) {
      return exercises.filter((e) => e.category === category && e.isActive !== false);
    }
    return exercises.filter((e) => e.isActive !== false);
  },

  async saveExercise(
    exercise: Omit<ExerciseDefinition, "id"> | ExerciseDefinition
  ): Promise<ExerciseDefinition> {
    await delay(150);
    const state = getLocalState();
    let saved: ExerciseDefinition;

    if ("id" in exercise && exercise.id) {
      // Update
      const index = state.exercises.findIndex((e) => e.id === exercise.id);
      if (index === -1) throw new Error("Latihan tidak ditemui.");
      saved = { ...state.exercises[index], ...exercise };
      const nextExercises = [...state.exercises];
      nextExercises[index] = saved;
      setLocalState({ ...state, exercises: nextExercises });
    } else {
      // Add
      saved = {
        ...exercise,
        id: `ex-${Date.now()}`,
        isActive: true,
      };
      setLocalState({ ...state, exercises: [saved, ...state.exercises] });
    }
    return saved;
  },

  async deleteExercise(id: string): Promise<boolean> {
    await delay(120);
    const state = getLocalState();
    const nextExercises = state.exercises.map((e) =>
      e.id === id ? { ...e, isActive: false } : e
    );
    setLocalState({ ...state, exercises: nextExercises });
    return true;
  },

  async getAthletes(discipline?: AthleteDiscipline, clubId?: string): Promise<AthleteProfile[]> {
    await delay(100);
    let athletes = getLocalState().athletes;
    if (discipline) {
      athletes = athletes.filter((a) => a.discipline === discipline);
    }
    if (clubId) {
      athletes = athletes.filter((a) => a.clubId === clubId);
    }
    return athletes;
  },

  async getAthleteById(id: string): Promise<AthleteProfile | null> {
    await delay(80);
    return getLocalState().athletes.find((a) => a.id === id) || null;
  },

  async assignCoachToAthlete(athleteId: string, coachId: string): Promise<boolean> {
    await delay(150);
    const state = getLocalState();
    const coach = state.coaches.find((c) => c.id === coachId);
    if (!coach) throw new Error("Jurulatih tidak ditemui.");

    const nextAthletes = state.athletes.map((a) =>
      a.id === athleteId
        ? { ...a, assignedCoachId: coachId, assignedCoachName: coach.name }
        : a
    );

    const nextCoaches = state.coaches.map((c) => {
      if (c.id === coachId && !c.assignedAthleteIds.includes(athleteId)) {
        return { ...c, assignedAthleteIds: [...c.assignedAthleteIds, athleteId] };
      }
      if (c.id !== coachId && c.assignedAthleteIds.includes(athleteId)) {
        return {
          ...c,
          assignedAthleteIds: c.assignedAthleteIds.filter((id) => id !== athleteId),
        };
      }
      return c;
    });

    setLocalState({ ...state, athletes: nextAthletes, coaches: nextCoaches });
    return true;
  },

  async updateAthleteDiscipline(
    athleteId: string,
    discipline: AthleteDiscipline
  ): Promise<AthleteProfile> {
    await delay(120);
    if (discipline !== "Silat Seni" && discipline !== "Silat Olahraga") {
      throw new Error("Disiplin atlet wajib sama ada Silat Seni atau Silat Olahraga sahaja.");
    }
    const state = getLocalState();
    const index = state.athletes.findIndex((a) => a.id === athleteId);
    if (index === -1) throw new Error("Atlet tidak ditemui.");

    const updated = { ...state.athletes[index], discipline };
    const nextAthletes = [...state.athletes];
    nextAthletes[index] = updated;

    setLocalState({ ...state, athletes: nextAthletes });
    return updated;
  },

  async updateAthleteStatus(
    athleteId: string,
    status: AthleteStatus
  ): Promise<AthleteProfile> {
    await delay(120);
    const state = getLocalState();
    const index = state.athletes.findIndex((a) => a.id === athleteId);
    if (index === -1) throw new Error("Atlet tidak ditemui.");

    const updated = { ...state.athletes[index], status };
    const nextAthletes = [...state.athletes];
    nextAthletes[index] = updated;

    setLocalState({ ...state, athletes: nextAthletes });
    return updated;
  },

  async getCoaches(clubId?: string): Promise<CoachProfile[]> {
    await delay(100);
    let coaches = getLocalState().coaches;
    if (clubId) {
      coaches = coaches.filter((c) => c.clubId === clubId);
    }
    return coaches;
  },

  async getCoachById(id: string): Promise<CoachProfile | null> {
    await delay(80);
    return getLocalState().coaches.find((c) => c.id === id) || null;
  },

  async getAssessmentRubrics(type?: string): Promise<AssessmentRubric[]> {
    await delay(100);
    const rubrics = getLocalState().rubrics;
    if (type) {
      return rubrics.filter((r) => r.type === type);
    }
    return rubrics;
  },

  async getAssessments(athleteId?: string): Promise<AssessmentRecord[]> {
    await delay(100);
    const records = getLocalState().assessments;
    if (athleteId) {
      return records.filter((r) => r.athleteId === athleteId);
    }
    return records;
  },

  async getCompetitions(): Promise<CompetitionEvent[]> {
    await delay(120);
    return getLocalState().competitions;
  },

  async getCompetitionById(id: string): Promise<CompetitionEvent | null> {
    await delay(80);
    return getLocalState().competitions.find((c) => c.id === id) || null;
  },

  async updateAthleteMedicalClearance(
    competitionId: string,
    athleteId: string,
    isCleared: boolean,
    clearedBy: string,
    clearanceNotes?: string
  ): Promise<boolean> {
    await delay(150);
    if (!clearedBy || clearedBy.trim() === "") {
      throw new Error(
        "Pelepasan perubatan wajib ditandatangani oleh pegawai perubatan atau jurulatih manusia bertauliah."
      );
    }

    const state = getLocalState();
    const compIndex = state.competitions.findIndex((c) => c.id === competitionId);
    if (compIndex === -1) throw new Error("Pertandingan tidak ditemui.");

    const comp = state.competitions[compIndex];
    const nowISO = new Date().toISOString();

    const updatedReviews = comp.readinessReview.map((r) => {
      if (r.athleteId !== athleteId) return r;
      return {
        ...r,
        isCleared,
        clearedBy,
        clearedAt: nowISO,
        clearanceNotes: clearanceNotes || r.clearanceNotes,
      };
    });

    const updatedComp = { ...comp, readinessReview: updatedReviews };
    const nextCompetitions = [...state.competitions];
    nextCompetitions[compIndex] = updatedComp;

    setLocalState({ ...state, competitions: nextCompetitions });
    return true;
  },

  async getKnowledgeArticles(status?: "DRAFT" | "PUBLISHED"): Promise<KnowledgeArticle[]> {
    await delay(100);
    const articles = getLocalState().knowledgeArticles;
    if (status) {
      return articles.filter((a) => a.status === status);
    }
    return articles;
  },

  async saveKnowledgeArticle(
    article: Omit<KnowledgeArticle, "id"> | KnowledgeArticle
  ): Promise<KnowledgeArticle> {
    await delay(150);
    const state = getLocalState();
    let saved: KnowledgeArticle;

    if ("id" in article && article.id) {
      const index = state.knowledgeArticles.findIndex((a) => a.id === article.id);
      if (index === -1) throw new Error("Artikel tidak ditemui.");
      saved = { ...state.knowledgeArticles[index], ...article };
      const nextArticles = [...state.knowledgeArticles];
      nextArticles[index] = saved;
      setLocalState({ ...state, knowledgeArticles: nextArticles });
    } else {
      saved = {
        ...article,
        id: `art-${Date.now()}`,
        publishedAt:
          article.status === "PUBLISHED" ? new Date().toISOString() : undefined,
      };
      setLocalState({
        ...state,
        knowledgeArticles: [saved, ...state.knowledgeArticles],
      });
    }
    return saved;
  },

  async toggleArticleStatus(id: string): Promise<KnowledgeArticle> {
    await delay(120);
    const state = getLocalState();
    const index = state.knowledgeArticles.findIndex((a) => a.id === id);
    if (index === -1) throw new Error("Artikel tidak ditemui.");

    const current = state.knowledgeArticles[index];
    const newStatus = current.status === "DRAFT" ? "PUBLISHED" : "DRAFT";
    const updated: KnowledgeArticle = {
      ...current,
      status: newStatus as "DRAFT" | "PUBLISHED",
      publishedAt:
        newStatus === "PUBLISHED" ? new Date().toISOString() : current.publishedAt,
    };

    const nextArticles = [...state.knowledgeArticles];
    nextArticles[index] = updated;
    setLocalState({ ...state, knowledgeArticles: nextArticles });
    return updated;
  },

  async getLekirBotConfig(): Promise<LekirBotConfig> {
    await delay(80);
    return getLocalState().lekirBotConfig;
  },

  async updateLekirBotConfig(config: Partial<LekirBotConfig>): Promise<LekirBotConfig> {
    await delay(150);
    const state = getLocalState();

    // STRICT GUARDRAIL: Strip sensitive keys
    const safeUpdates = { ...config };
    delete (safeUpdates as Record<string, unknown>)["apiKey"];
    delete (safeUpdates as Record<string, unknown>)["secretKey"];

    const updated: LekirBotConfig = {
      ...state.lekirBotConfig,
      ...safeUpdates,
      lastUpdated: new Date().toISOString(),
    };

    setLocalState({ ...state, lekirBotConfig: updated });
    return updated;
  },

  async getAnnouncements(): Promise<PlatformAnnouncement[]> {
    await delay(100);
    return getLocalState().announcements;
  },

  async publishAnnouncement(
    announcement: Omit<PlatformAnnouncement, "id">
  ): Promise<PlatformAnnouncement> {
    await delay(150);
    const state = getLocalState();
    const newAnc: PlatformAnnouncement = {
      ...announcement,
      id: `anc-${Date.now()}`,
      publishedAt: announcement.publishedAt || new Date().toISOString(),
      isActive: true,
    };

    setLocalState({
      ...state,
      announcements: [newAnc, ...state.announcements],
    });
    return newAnc;
  },

  async getAdminProfile(): Promise<AdminProfile> {
    await delay(80);
    return getLocalState().adminProfile;
  },

  async resetDemoState(): Promise<void> {
    await delay(150);
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(ADMIN_LOCAL_STORAGE_KEY);
        localStorage.setItem(
          ADMIN_LOCAL_STORAGE_KEY,
          JSON.stringify(initialMockAdminState)
        );
      } catch (e) {
        console.error("Local storage reset error:", e);
      }
    }
  },
};
