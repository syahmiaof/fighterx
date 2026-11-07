"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import type {
  Coach,
  Athlete,
  TrainingSubmission,
  Assessment,
  Competition,
  CoachKPIStats,
  CoachState,
  CoachActions,
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

const STORAGE_KEY = "fighterx_coach_state_v1";

interface PersistedData {
  coach: Coach;
  athletes: Athlete[];
  submissions: TrainingSubmission[];
  assessments: Assessment[];
  competitions: Competition[];
}

function computeKPIs(
  athletes: Athlete[],
  submissions: TrainingSubmission[],
  competitions: Competition[]
): CoachKPIStats {
  const totalAthletes = athletes.length;
  const pendingCount = submissions.filter((s) => s.status === "PENDING").length;
  const verifiedCount = submissions.filter((s) => s.status === "VERIFIED").length;

  // Consistency breakdown
  const konsistenCount = athletes.filter((a) => a.consistencyTier === "KONSISTEN").length;
  const sederhanaCount = athletes.filter((a) => a.consistencyTier === "SEDERHANA").length;
  const perluPerhatianCount = athletes.filter(
    (a) => a.consistencyTier === "PERLU_PERHATIAN"
  ).length;

  const konsistenPercent = totalAthletes > 0 ? Math.round((konsistenCount / totalAthletes) * 100) : 0;
  const sederhanaPercent = totalAthletes > 0 ? Math.round((sederhanaCount / totalAthletes) * 100) : 0;
  const perluPerhatianPercent =
    totalAthletes > 0 ? Math.max(0, 100 - konsistenPercent - sederhanaPercent) : 0;

  // Verified this week rate: Base is 76% (19/25). Each new verification increments rate.
  const deltaVerified = Math.max(0, verifiedCount - 3); // initial verified count is 3
  const calculatedVerifiedRate = Math.min(100, 76 + deltaVerified * 2);

  const upcomingCompetitionsCount = competitions.filter(
    (c) => c.status === "Pendaftaran Dibuka" || c.status === "Persiapan"
  ).length;

  return {
    totalAthletes,
    totalAthletesChange: 2,
    pendingVerifications: pendingCount,
    verifiedThisWeekRate: calculatedVerifiedRate,
    verifiedThisWeekChange: 8,
    upcomingCompetitionsCount,
    weeklyExecutionRate: 76,
    consistency: {
      konsistenCount,
      konsistenPercent,
      sederhanaCount,
      sederhanaPercent,
      perluPerhatianCount,
      perluPerhatianPercent,
    },
  };
}

const CoachStateContext = createContext<CoachState | null>(null);
const CoachActionsContext = createContext<CoachActions | null>(null);

export function CoachProvider({ children }: { children: React.ReactNode }) {
  const [coach, setCoach] = useState<Coach>(MOCK_COACH);
  const [athletes, setAthletes] = useState<Athlete[]>(MOCK_ATHLETES);
  const [submissions, setSubmissions] = useState<TrainingSubmission[]>(MOCK_SUBMISSIONS);
  const [assessments, setAssessments] = useState<Assessment[]>(MOCK_ASSESSMENTS);
  const [competitions, setCompetitions] = useState<Competition[]>(MOCK_COMPETITIONS);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage on client mount asynchronously
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const saved = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
        if (saved) {
          const parsed: PersistedData = JSON.parse(saved);
          if (parsed.coach) setCoach(parsed.coach);
          if (parsed.athletes && Array.isArray(parsed.athletes)) setAthletes(parsed.athletes);
          if (parsed.submissions && Array.isArray(parsed.submissions)) setSubmissions(parsed.submissions);
          if (parsed.assessments && Array.isArray(parsed.assessments)) setAssessments(parsed.assessments);
          if (parsed.competitions && Array.isArray(parsed.competitions)) setCompetitions(parsed.competitions);
        }
      } catch (err) {
        console.warn("FighterX CoachProvider: Failed to load state from localStorage", err);
      } finally {
        setIsHydrated(true);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // Helper to persist state to localStorage
  const saveState = useCallback(
    (data: {
      coach?: Coach;
      athletes?: Athlete[];
      submissions?: TrainingSubmission[];
      assessments?: Assessment[];
      competitions?: Competition[];
    }) => {
      try {
        const currentData: PersistedData = {
          coach: data.coach ?? coach,
          athletes: data.athletes ?? athletes,
          submissions: data.submissions ?? submissions,
          assessments: data.assessments ?? assessments,
          competitions: data.competitions ?? competitions,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(currentData));
      } catch (err) {
        console.warn("FighterX CoachProvider: Failed to save state to localStorage", err);
      }
    },
    [coach, athletes, submissions, assessments, competitions]
  );

  // Action: Review submission (Verify, Correction, Reject)
  const reviewSubmission = useCallback(
    (
      submissionId: string,
      status: "VERIFIED" | "CORRECTION" | "REJECTED",
      feedback?: string
    ) => {
      const today = new Date();
      const dateStr = today.toLocaleDateString("ms-MY", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

      setSubmissions((prev) => {
        const updated = prev.map((sub) => {
          if (sub.id === submissionId) {
            return {
              ...sub,
              status: status as SubmissionStatus,
              coachFeedback: feedback || sub.coachFeedback,
              reviewedAt: dateStr,
            };
          }
          return sub;
        });
        saveState({ submissions: updated });
        return updated;
      });
    },
    [saveState]
  );

  // Action: Register or update assessment
  const registerAssessment = useCallback(
    (assessmentData: Omit<Assessment, "id"> & { id?: string }) => {
      const id = assessmentData.id || `asm-${Date.now()}`;
      const newAssessment: Assessment = {
        ...assessmentData,
        id,
      };

      setAssessments((prevAssessments) => {
        const nextAssessments = [newAssessment, ...prevAssessments.filter((a) => a.id !== id)];
        if (assessmentData.totalScore !== undefined && assessmentData.athleteId) {
          setAthletes((prevAthletes) => {
            const nextAthletes = prevAthletes.map((ath) => {
              if (ath.id === assessmentData.athleteId) {
                return {
                  ...ath,
                  readinessScore: Math.round(assessmentData.totalScore!),
                };
              }
              return ath;
            });
            saveState({ assessments: nextAssessments, athletes: nextAthletes });
            return nextAthletes;
          });
        } else {
          saveState({ assessments: nextAssessments });
        }
        return nextAssessments;
      });
    },
    [saveState]
  );

  // Action: Update competition roster selection
  const updateCompetitionRoster = useCallback(
    (competitionId: string, athleteId: string, selected: boolean) => {
      setCompetitions((prev) => {
        const updated = prev.map((comp) => {
          if (comp.id === competitionId) {
            return {
              ...comp,
              roster: comp.roster.map((item) => {
                if (item.athleteId === athleteId) {
                  return { ...item, isSelected: selected };
                }
                return item;
              }),
            };
          }
          return comp;
        });
        saveState({ competitions: updated });
        return updated;
      });
    },
    [saveState]
  );

  // Action: Reset demo state to initial mock data
  const resetDemoState = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setCoach(MOCK_COACH);
    setAthletes(MOCK_ATHLETES);
    setSubmissions(MOCK_SUBMISSIONS);
    setAssessments(MOCK_ASSESSMENTS);
    setCompetitions(MOCK_COMPETITIONS);
  }, []);

  // Compute dynamic KPIs
  const kpis: CoachKPIStats = useMemo(() => {
    if (!isHydrated) return INITIAL_KPI_STATS;
    return computeKPIs(athletes, submissions, competitions);
  }, [athletes, submissions, competitions, isHydrated]);

  const stateValue: CoachState = useMemo(
    () => ({
      coach,
      athletes,
      submissions,
      assessments,
      competitions,
      kpis,
      isHydrated,
    }),
    [coach, athletes, submissions, assessments, competitions, kpis, isHydrated]
  );

  const actionsValue: CoachActions = useMemo(
    () => ({
      reviewSubmission,
      registerAssessment,
      updateCompetitionRoster,
      resetDemoState,
    }),
    [reviewSubmission, registerAssessment, updateCompetitionRoster, resetDemoState]
  );

  return (
    <CoachStateContext.Provider value={stateValue}>
      <CoachActionsContext.Provider value={actionsValue}>
        {children}
      </CoachActionsContext.Provider>
    </CoachStateContext.Provider>
  );
}

export function useCoachState(): CoachState {
  const context = useContext(CoachStateContext);
  if (!context) {
    throw new Error("useCoachState must be used within a CoachProvider");
  }
  return context;
}

export function useCoachActions(): CoachActions {
  const context = useContext(CoachActionsContext);
  if (!context) {
    throw new Error("useCoachActions must be used within a CoachProvider");
  }
  return context;
}
