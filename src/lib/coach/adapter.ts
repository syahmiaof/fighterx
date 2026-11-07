import type {
  Coach,
  Athlete,
  TrainingSubmission,
  Assessment,
  Competition,
  CoachKPIStats,
  SubmissionStatus,
} from "./types";
import {
  MOCK_COACH,
  MOCK_ATHLETES,
  MOCK_SUBMISSIONS,
  MOCK_ASSESSMENTS,
  MOCK_COMPETITIONS,
  INITIAL_KPI_STATS,
} from "./mock-data";

/**
 * CoachService defines the typed boundary for coach data fetching and mutations.
 * In V1, it operates against in-memory/mock state and provides an async Promise contract
 * for clean future substitution with REST or Supabase RPC without touching UI components.
 */
export interface CoachService {
  getCoachProfile(): Promise<Coach>;
  getAthletes(discipline?: string): Promise<Athlete[]>;
  getAthleteById(athleteId: string): Promise<Athlete | undefined>;
  getSubmissions(status?: SubmissionStatus): Promise<TrainingSubmission[]>;
  getSubmissionById(submissionId: string): Promise<TrainingSubmission | undefined>;
  getAssessments(athleteId?: string): Promise<Assessment[]>;
  getCompetitions(): Promise<Competition[]>;
  getCompetitionById(competitionId: string): Promise<Competition | undefined>;
  getKPIStats(): Promise<CoachKPIStats>;
  reviewSubmission(
    submissionId: string,
    status: "VERIFIED" | "CORRECTION" | "REJECTED",
    feedback?: string
  ): Promise<TrainingSubmission>;
  registerAssessment(
    assessmentData: Omit<Assessment, "id"> & { id?: string }
  ): Promise<Assessment>;
  updateRosterSelection(
    competitionId: string,
    athleteId: string,
    isSelected: boolean
  ): Promise<Competition>;
  resetDemoState(): Promise<void>;
}

export class MockCoachService implements CoachService {
  private coach: Coach = { ...MOCK_COACH };
  private athletes: Athlete[] = [...MOCK_ATHLETES];
  private submissions: TrainingSubmission[] = [...MOCK_SUBMISSIONS];
  private assessments: Assessment[] = [...MOCK_ASSESSMENTS];
  private competitions: Competition[] = [...MOCK_COMPETITIONS];

  async getCoachProfile(): Promise<Coach> {
    return { ...this.coach };
  }

  async getAthletes(discipline?: string): Promise<Athlete[]> {
    if (!discipline) return [...this.athletes];
    return this.athletes.filter((a) => a.discipline === discipline);
  }

  async getAthleteById(athleteId: string): Promise<Athlete | undefined> {
    return this.athletes.find((a) => a.id === athleteId);
  }

  async getSubmissions(status?: SubmissionStatus): Promise<TrainingSubmission[]> {
    if (!status) return [...this.submissions];
    return this.submissions.filter((s) => s.status === status);
  }

  async getSubmissionById(submissionId: string): Promise<TrainingSubmission | undefined> {
    return this.submissions.find((s) => s.id === submissionId);
  }

  async getAssessments(athleteId?: string): Promise<Assessment[]> {
    if (!athleteId) return [...this.assessments];
    return this.assessments.filter((a) => a.athleteId === athleteId);
  }

  async getCompetitions(): Promise<Competition[]> {
    return [...this.competitions];
  }

  async getCompetitionById(competitionId: string): Promise<Competition | undefined> {
    return this.competitions.find((c) => c.id === competitionId);
  }

  async getKPIStats(): Promise<CoachKPIStats> {
    const totalAthletes = this.athletes.length;
    const pendingCount = this.submissions.filter((s) => s.status === "PENDING").length;
    const verifiedCount = this.submissions.filter((s) => s.status === "VERIFIED").length;
    const konsistenCount = this.athletes.filter((a) => a.consistencyTier === "KONSISTEN").length;
    const sederhanaCount = this.athletes.filter((a) => a.consistencyTier === "SEDERHANA").length;
    const perluPerhatianCount = this.athletes.filter(
      (a) => a.consistencyTier === "PERLU_PERHATIAN"
    ).length;

    return {
      ...INITIAL_KPI_STATS,
      totalAthletes,
      pendingVerifications: pendingCount,
      verifiedThisWeekRate:
        this.submissions.length > 0
          ? Math.round((verifiedCount / this.submissions.length) * 100)
          : 76,
      consistency: {
        konsistenCount,
        konsistenPercent:
          totalAthletes > 0
            ? Math.round((konsistenCount / totalAthletes) * 100)
            : 0,
        sederhanaCount,
        sederhanaPercent:
          totalAthletes > 0
            ? Math.round((sederhanaCount / totalAthletes) * 100)
            : 0,
        perluPerhatianCount,
        perluPerhatianPercent:
          totalAthletes > 0
            ? 100 -
              Math.round((konsistenCount / totalAthletes) * 100) -
              Math.round((sederhanaCount / totalAthletes) * 100)
            : 0,
      },
    };
  }

  async reviewSubmission(
    submissionId: string,
    status: "VERIFIED" | "CORRECTION" | "REJECTED",
    feedback?: string
  ): Promise<TrainingSubmission> {
    const idx = this.submissions.findIndex((s) => s.id === submissionId);
    if (idx === -1) throw new Error(`Submission ${submissionId} not found`);

    const updated: TrainingSubmission = {
      ...this.submissions[idx],
      status,
      coachFeedback: feedback || this.submissions[idx].coachFeedback,
      reviewedAt: new Date().toLocaleDateString("ms-MY"),
    };
    this.submissions[idx] = updated;
    return updated;
  }

  async registerAssessment(
    assessmentData: Omit<Assessment, "id"> & { id?: string }
  ): Promise<Assessment> {
    const newRecord: Assessment = {
      ...assessmentData,
      id: assessmentData.id || `asm-${Date.now()}`,
    };
    this.assessments = [newRecord, ...this.assessments];
    return newRecord;
  }

  async updateRosterSelection(
    competitionId: string,
    athleteId: string,
    isSelected: boolean
  ): Promise<Competition> {
    const compIdx = this.competitions.findIndex((c) => c.id === competitionId);
    if (compIdx === -1) throw new Error(`Competition ${competitionId} not found`);

    const comp = this.competitions[compIdx];
    const updatedRoster = comp.roster.map((item) => {
      if (item.athleteId === athleteId) {
        return { ...item, isSelected };
      }
      return item;
    });

    const updatedComp = { ...comp, roster: updatedRoster };
    this.competitions[compIdx] = updatedComp;
    return updatedComp;
  }

  async resetDemoState(): Promise<void> {
    this.coach = { ...MOCK_COACH };
    this.athletes = [...MOCK_ATHLETES];
    this.submissions = [...MOCK_SUBMISSIONS];
    this.assessments = [...MOCK_ASSESSMENTS];
    this.competitions = [...MOCK_COMPETITIONS];
  }
}

export const coachService: CoachService = new MockCoachService();
