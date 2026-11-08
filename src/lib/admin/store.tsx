"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import type {
  AdminState,
  PlatformKPIStats,
  ClubApplication,
  AdminClub,
  SaaSClubSubscription,
  SubscriptionPaymentRecord,
  WeeklyScheduleDay,
  ExerciseDefinition,
  CompetitionEvent,
  KnowledgeArticle,
  LekirBotConfig,
  PlatformAnnouncement,
  AthleteDiscipline,
  AthleteStatus,
  ProgrammeMode,
  ApplicationStatus,
  SaaSClubSubscriptionStatus,
} from "./types";
import { initialMockAdminState } from "./mock-data";

export const ADMIN_LOCAL_STORAGE_KEY = "fighterx_admin_state_v1";

// ============================================================================
// Actions Interface
// ============================================================================

export interface AdminStoreActions {
  /** Review club application; on APPROVED automatically provisions club & 30-day trial */
  reviewApplication: (
    appId: string,
    status: ApplicationStatus,
    auditNotes: string[],
    rejectionReason?: string
  ) => { success: boolean; message: string };

  /** Update club subscription status and append optional payment record */
  updateSubscriptionStatus: (
    clubId: string,
    status: SaaSClubSubscriptionStatus,
    paymentEntry?: Omit<SubscriptionPaymentRecord, "id">
  ) => void;

  /** Switch master training programme active mode */
  updateProgrammeMode: (mode: ProgrammeMode, programmeId?: string) => void;

  /** Update microcycle weekly schedule with mandatory rest day enforcement */
  updateWeeklySchedule: (
    scheduleId: string,
    days: WeeklyScheduleDay[]
  ) => { success: boolean; message?: string; error?: string };

  /** Exercise library management */
  addExercise: (exercise: Omit<ExerciseDefinition, "id">) => void;
  updateExercise: (id: string, updates: Partial<ExerciseDefinition>) => void;
  deleteExercise: (id: string) => void;

  /** Athlete & Coach management */
  assignAthleteCoach: (athleteId: string, coachId: string) => void;
  updateAthleteDiscipline: (
    athleteId: string,
    discipline: AthleteDiscipline
  ) => void;
  updateAthleteStatus: (athleteId: string, status: AthleteStatus) => void;
  updateCoachStatus: (coachId: string, status: "Active" | "Inactive") => void;

  /** Competition readiness review (human clearance only, no automated clearance) */
  updateCompetitionStatus: (
    competitionId: string,
    status: CompetitionEvent["status"]
  ) => void;
  updateAthleteMedicalClearance: (
    competitionId: string,
    athleteId: string,
    isCleared: boolean,
    clearedBy: string,
    clearanceNotes?: string
  ) => void;

  /** Content, Gamification & Lekir Bot */
  updateLekirBotConfig: (configUpdates: Partial<LekirBotConfig>) => void;
  toggleArticleStatus: (articleId: string) => void;
  addArticle: (article: Omit<KnowledgeArticle, "id">) => void;
  updateArticle: (id: string, updates: Partial<KnowledgeArticle>) => void;
  addAnnouncement: (announcement: Omit<PlatformAnnouncement, "id">) => void;
  toggleAnnouncementPin: (announcementId: string) => void;
  deleteAnnouncement: (announcementId: string) => void;
  disqualifyLeaderboardAthlete: (athleteId: string, reason: string) => void;

  /** Reset all admin demo state back to baseline seed */
  resetDemoState: () => void;
}

// ============================================================================
// Context Definitions
// ============================================================================

interface AdminContextValue {
  state: AdminState;
  actions: AdminStoreActions;
}

const AdminContext = createContext<AdminContextValue | null>(null);

// ============================================================================
// Helper Functions
// ============================================================================

function calculateFutureDateISO(daysAhead: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  return date.toISOString();
}

// ============================================================================
// AdminProvider Component
// ============================================================================

export function AdminProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AdminState>(() => initialMockAdminState);
  const [isHydrated, setIsHydrated] = useState(false);

  // SSR-safe hydration from LocalStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        if (typeof window !== "undefined") {
          const stored = localStorage.getItem(ADMIN_LOCAL_STORAGE_KEY);
          if (stored) {
            const parsed = JSON.parse(stored) as AdminState;
            setState({
              ...initialMockAdminState,
              ...parsed,
              adminProfile: parsed.adminProfile ?? initialMockAdminState.adminProfile,
              isHydrated: true,
            });
          } else {
            // Initialize fresh local storage with mock seed
            localStorage.setItem(
              ADMIN_LOCAL_STORAGE_KEY,
              JSON.stringify(initialMockAdminState)
            );
            setState((prev) => ({ ...prev, isHydrated: true }));
          }
        }
      } catch (err) {
        console.warn("Failed to read admin state from localStorage:", err);
        setState((prev) => ({ ...prev, isHydrated: true }));
      } finally {
        setIsHydrated(true);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // ==========================================================================
  // Store Actions Implementation
  // ==========================================================================

  const reviewApplication = useCallback(
    (
      appId: string,
      status: ApplicationStatus,
      auditNotes: string[],
      rejectionReason?: string
    ) => {
      let resultMessage = "";
      setState((prev) => {
        const appIndex = prev.applications.findIndex((a) => a.id === appId);
        if (appIndex === -1) {
          resultMessage = "Permohonan tidak ditemui.";
          return prev;
        }

        const currentApp = prev.applications[appIndex];
        const nowISO = new Date().toISOString();
        const updatedNotes = [
          ...currentApp.auditNotes,
          ...auditNotes,
        ];

        const updatedClubs = [...prev.clubs];
        const updatedSubs = [...prev.subscriptions];
        const updatedKPI: PlatformKPIStats = { ...prev.kpiStats };

        if (status === "APPROVED") {
          const newClubId = `club-${Date.now()}`;
          const newSubId = `sub-${Date.now()}`;
          const trialEndISO = calculateFutureDateISO(30);

          // 1. Automatically provision Organization Record in directory
          const newClub: AdminClub = {
            id: newClubId,
            name: currentApp.clubName,
            registrationNumber: `PPM-${Date.now().toString().slice(-6)}`,
            type: currentApp.clubType,
            state: currentApp.state,
            district: currentApp.district,
            address: currentApp.address,
            discipline: "Both",
            status: "Active",
            memberCount: 0,
            coachCount: 0,
            seniAthletesCount: 0,
            olahragaAthletesCount: 0,
            subscriptionId: newSubId,
            subscriptionStatus: "TRIALING",
            contactPerson: currentApp.picFullName,
            email: currentApp.picEmail,
            phone: currentApp.picPhoneNumber,
            joinedAt: nowISO,
            createdAt: nowISO,
          };
          updatedClubs.unshift(newClub);

          // 2. Automatically commence 30-day Free Trial
          const newSub: SaaSClubSubscription = {
            id: newSubId,
            clubId: newClubId,
            clubName: newClub.name,
            status: "TRIALING",
            trialStartDate: nowISO,
            trialEndDate: trialEndISO,
            billingPeriodStart: nowISO,
            billingPeriodEnd: trialEndISO,
            planPrice: 20, // Invariant: RM20 / month
            coveredClubCount: 1,
            nextRenewalDate: trialEndISO,
            paymentHistory: [],
          };
          updatedSubs.unshift(newSub);

          // 3. Update KPI Counters
          updatedKPI.registeredClubsCount += 1;
          updatedKPI.pendingApplicationsCount = Math.max(
            0,
            updatedKPI.pendingApplicationsCount - 1
          );
          updatedKPI.activeSubscriptionsCount += 1;

          resultMessage = `Permohonan ${currentApp.clubName} telah diluluskan. Kelab baharu dan tempoh percubaan 30 hari telah diaktifkan secara automatik.`;
        } else if (status === "REJECTED") {
          updatedKPI.pendingApplicationsCount = Math.max(
            0,
            updatedKPI.pendingApplicationsCount - 1
          );
          resultMessage = `Permohonan ${currentApp.clubName} telah ditolak.`;
        } else {
          resultMessage = `Status permohonan dikemas kini kepada ${status}.`;
        }

        const updatedApp: ClubApplication = {
          ...currentApp,
          status,
          auditNotes: updatedNotes,
          reviewedAt: nowISO,
          reviewerId: prev.adminProfile.id,
          rejectionReason:
            status === "REJECTED" ? rejectionReason : currentApp.rejectionReason,
        };

        const updatedApplications = [...prev.applications];
        updatedApplications[appIndex] = updatedApp;

        const nextState: AdminState = {
          ...prev,
          applications: updatedApplications,
          clubs: updatedClubs,
          subscriptions: updatedSubs,
          stats: updatedKPI,
          kpiStats: updatedKPI,
        };

        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(
              ADMIN_LOCAL_STORAGE_KEY,
              JSON.stringify(nextState)
            );
          } catch (e) {
            console.error("Local storage sync error:", e);
          }
        }
        return nextState;
      });

      return { success: true, message: resultMessage };
    },
    []
  );

  const updateSubscriptionStatus = useCallback(
    (
      clubId: string,
      status: SaaSClubSubscriptionStatus,
      paymentEntry?: Omit<SubscriptionPaymentRecord, "id">
    ) => {
      setState((prev) => {
        const subIndex = prev.subscriptions.findIndex(
          (s) => s.clubId === clubId
        );
        if (subIndex === -1) return prev;

        const currentSub = prev.subscriptions[subIndex];
        const nowISO = new Date().toISOString();

        const updatedHistory = [...currentSub.paymentHistory];
        if (paymentEntry) {
          const newPayment: SubscriptionPaymentRecord = {
            ...paymentEntry,
            id: `inv-${Date.now()}`,
          };
          updatedHistory.unshift(newPayment);
        }

        const updatedSub: SaaSClubSubscription = {
          ...currentSub,
          status,
          lastPaymentDate: paymentEntry ? nowISO : currentSub.lastPaymentDate,
          paymentHistory: updatedHistory,
        };

        const updatedSubscriptions = [...prev.subscriptions];
        updatedSubscriptions[subIndex] = updatedSub;

        // Also update club's subscriptionStatus field
        const updatedClubs = prev.clubs.map((c) =>
          c.id === clubId ? { ...c, subscriptionStatus: status } : c
        );

        // Recalculate monthly revenue
        const activeCount = updatedSubscriptions.filter(
          (s) => s.status === "ACTIVE"
        ).length;
        const updatedKPI: PlatformKPIStats = {
          ...prev.kpiStats,
          activeSubscriptionsCount: activeCount,
          monthlyRevenueRm: activeCount * 20,
        };

        const nextState: AdminState = {
          ...prev,
          subscriptions: updatedSubscriptions,
          clubs: updatedClubs,
          stats: updatedKPI,
          kpiStats: updatedKPI,
        };

        if (typeof window !== "undefined") {
          localStorage.setItem(
            ADMIN_LOCAL_STORAGE_KEY,
            JSON.stringify(nextState)
          );
        }
        return nextState;
      });
    },
    []
  );

  const updateProgrammeMode = useCallback(
    (mode: ProgrammeMode, programmeId?: string) => {
      setState((prev) => {
        const targetId = programmeId || prev.activeProgrammeId;
        const updatedProgrammes = prev.programmes.map((p) =>
          p.id === targetId ? { ...p, activeMode: mode } : p
        );

        const nextState = {
          ...prev,
          programmes: updatedProgrammes,
        };
        if (typeof window !== "undefined") {
          localStorage.setItem(
            ADMIN_LOCAL_STORAGE_KEY,
            JSON.stringify(nextState)
          );
        }
        return nextState;
      });
    },
    []
  );

  const updateWeeklySchedule = useCallback(
    (scheduleId: string, days: WeeklyScheduleDay[]) => {
      // ENFORCED VALIDATION GUARDRAIL:
      // A valid 7-day microcycle must contain at least 1 mandatory rest or recovery day
      const hasRestOrRecoveryDay = days.some(
        (d) => d.isRestDay || d.mode === "Recovery" || d.intensity === "Rest"
      );

      if (!hasRestOrRecoveryDay) {
        return {
          success: false,
          error:
            "Jadual mingguan wajib mengandungi sekurang-kurangnya 1 hari rehat/pemulihan (Rest/Recovery Day) mengikut piawaian sains sukan.",
        };
      }

      setState((prev) => {
        const updatedProgrammes = prev.programmes.map((p) => ({
          ...p,
          weeklySchedules: p.weeklySchedules.map((ws) =>
            ws.id === scheduleId ? { ...ws, days } : ws
          ),
        }));

        const nextState = {
          ...prev,
          programmes: updatedProgrammes,
        };
        if (typeof window !== "undefined") {
          localStorage.setItem(
            ADMIN_LOCAL_STORAGE_KEY,
            JSON.stringify(nextState)
          );
        }
        return nextState;
      });

      return { success: true, message: "Jadual mingguan berjaya dikemas kini." };
    },
    []
  );

  const addExercise = useCallback(
    (exercise: Omit<ExerciseDefinition, "id">) => {
      setState((prev) => {
        const newExercise: ExerciseDefinition = {
          ...exercise,
          id: `ex-${Date.now()}`,
          isActive: true,
        };
        const nextState = {
          ...prev,
          exercises: [newExercise, ...prev.exercises],
        };
        if (typeof window !== "undefined") {
          localStorage.setItem(
            ADMIN_LOCAL_STORAGE_KEY,
            JSON.stringify(nextState)
          );
        }
        return nextState;
      });
    },
    []
  );

  const updateExercise = useCallback(
    (id: string, updates: Partial<ExerciseDefinition>) => {
      setState((prev) => {
        const updatedExercises = prev.exercises.map((e) =>
          e.id === id ? { ...e, ...updates } : e
        );
        const nextState = { ...prev, exercises: updatedExercises };
        if (typeof window !== "undefined") {
          localStorage.setItem(
            ADMIN_LOCAL_STORAGE_KEY,
            JSON.stringify(nextState)
          );
        }
        return nextState;
      });
    },
    []
  );

  const deleteExercise = useCallback((id: string) => {
    setState((prev) => {
      const updatedExercises = prev.exercises.map((e) =>
        e.id === id ? { ...e, isActive: false } : e
      );
      const nextState = { ...prev, exercises: updatedExercises };
      if (typeof window !== "undefined") {
        localStorage.setItem(
          ADMIN_LOCAL_STORAGE_KEY,
          JSON.stringify(nextState)
        );
      }
      return nextState;
    });
  }, []);

  const assignAthleteCoach = useCallback(
    (athleteId: string, coachId: string) => {
      setState((prev) => {
        const coach = prev.coaches.find((c) => c.id === coachId);
        const coachName = coach ? coach.name : "Tiada Jurulatih";

        const updatedAthletes = prev.athletes.map((a) =>
          a.id === athleteId
            ? { ...a, assignedCoachId: coachId, assignedCoachName: coachName }
            : a
        );

        const updatedCoaches = prev.coaches.map((c) => {
          if (c.id === coachId && !c.assignedAthleteIds.includes(athleteId)) {
            return {
              ...c,
              assignedAthleteIds: [...c.assignedAthleteIds, athleteId],
            };
          }
          if (c.id !== coachId && c.assignedAthleteIds.includes(athleteId)) {
            return {
              ...c,
              assignedAthleteIds: c.assignedAthleteIds.filter(
                (id) => id !== athleteId
              ),
            };
          }
          return c;
        });

        const nextState = {
          ...prev,
          athletes: updatedAthletes,
          coaches: updatedCoaches,
        };
        if (typeof window !== "undefined") {
          localStorage.setItem(
            ADMIN_LOCAL_STORAGE_KEY,
            JSON.stringify(nextState)
          );
        }
        return nextState;
      });
    },
    []
  );

  const updateAthleteDiscipline = useCallback(
    (athleteId: string, discipline: AthleteDiscipline) => {
      // INVARIANT ENFORCEMENT:
      // Dual enrollment is strictly prohibited. Single discipline only.
      if (
        discipline !== "Silat Seni" &&
        discipline !== "Silat Olahraga"
      ) {
        throw new Error(
          "Atlet wajib didaftarkan khusus sama ada Silat Seni atau Silat Olahraga sahaja."
        );
      }

      setState((prev) => {
        const updatedAthletes = prev.athletes.map((a) =>
          a.id === athleteId ? { ...a, discipline } : a
        );
        const nextState = { ...prev, athletes: updatedAthletes };
        if (typeof window !== "undefined") {
          localStorage.setItem(
            ADMIN_LOCAL_STORAGE_KEY,
            JSON.stringify(nextState)
          );
        }
        return nextState;
      });
    },
    []
  );

  const updateAthleteStatus = useCallback(
    (athleteId: string, status: AthleteStatus) => {
      setState((prev) => {
        const updatedAthletes = prev.athletes.map((a) =>
          a.id === athleteId ? { ...a, status } : a
        );
        const nextState = { ...prev, athletes: updatedAthletes };
        if (typeof window !== "undefined") {
          localStorage.setItem(
            ADMIN_LOCAL_STORAGE_KEY,
            JSON.stringify(nextState)
          );
        }
        return nextState;
      });
    },
    []
  );

  const updateCoachStatus = useCallback(
    (coachId: string, status: "Active" | "Inactive") => {
      setState((prev) => {
        const updatedCoaches = prev.coaches.map((c) =>
          c.id === coachId ? { ...c, status } : c
        );
        const activeCount = updatedCoaches.filter(
          (c) => c.status === "Active"
        ).length;
        const nextKPI = { ...prev.kpiStats, activeCoachesCount: activeCount };
        const nextState = {
          ...prev,
          coaches: updatedCoaches,
          stats: nextKPI,
          kpiStats: nextKPI,
        };
        if (typeof window !== "undefined") {
          localStorage.setItem(
            ADMIN_LOCAL_STORAGE_KEY,
            JSON.stringify(nextState)
          );
        }
        return nextState;
      });
    },
    []
  );

  const updateCompetitionStatus = useCallback(
    (competitionId: string, status: CompetitionEvent["status"]) => {
      setState((prev) => {
        const updatedCompetitions = prev.competitions.map((c) =>
          c.id === competitionId ? { ...c, status } : c
        );
        const nextState = { ...prev, competitions: updatedCompetitions };
        if (typeof window !== "undefined") {
          localStorage.setItem(
            ADMIN_LOCAL_STORAGE_KEY,
            JSON.stringify(nextState)
          );
        }
        return nextState;
      });
    },
    []
  );

  const updateAthleteMedicalClearance = useCallback(
    (
      competitionId: string,
      athleteId: string,
      isCleared: boolean,
      clearedBy: string,
      clearanceNotes?: string
    ) => {
      // INVARIANT ENFORCEMENT:
      // Human clearance only. Prohibits automated clearance.
      if (!clearedBy || clearedBy.trim() === "") {
        throw new Error(
          "Pelepasan perubatan wajib ditandatangani oleh pegawai perubatan atau jurulatih manusia bertauliah."
        );
      }

      setState((prev) => {
        const nowISO = new Date().toISOString();
        const updatedCompetitions = prev.competitions.map((c) => {
          if (c.id !== competitionId) return c;
          const updatedReview = c.readinessReview.map((r) => {
            if (r.athleteId !== athleteId) return r;
            return {
              ...r,
              isCleared,
              clearedBy,
              clearedAt: nowISO,
              clearanceNotes: clearanceNotes || r.clearanceNotes,
            };
          });
          return { ...c, readinessReview: updatedReview };
        });

        const nextState = { ...prev, competitions: updatedCompetitions };
        if (typeof window !== "undefined") {
          localStorage.setItem(
            ADMIN_LOCAL_STORAGE_KEY,
            JSON.stringify(nextState)
          );
        }
        return nextState;
      });
    },
    []
  );

  const updateLekirBotConfig = useCallback(
    (configUpdates: Partial<LekirBotConfig>) => {
      setState((prev) => {
        // STRICT SECURITY GUARDRAIL:
        // Strip any accidental API keys or bearer tokens
        const safeUpdates = { ...configUpdates };
        delete (safeUpdates as Record<string, unknown>)["apiKey"];
        delete (safeUpdates as Record<string, unknown>)["secretKey"];
        delete (safeUpdates as Record<string, unknown>)["token"];

        const updatedConfig: LekirBotConfig = {
          ...prev.lekirBotConfig,
          ...safeUpdates,
          lastUpdated: new Date().toISOString(),
        };

        const nextState = { ...prev, lekirBotConfig: updatedConfig };
        if (typeof window !== "undefined") {
          localStorage.setItem(
            ADMIN_LOCAL_STORAGE_KEY,
            JSON.stringify(nextState)
          );
        }
        return nextState;
      });
    },
    []
  );

  const toggleArticleStatus = useCallback((articleId: string) => {
    setState((prev) => {
      const updatedArticles = prev.knowledgeArticles.map((art) => {
        if (art.id !== articleId) return art;
        const newStatus = art.status === "DRAFT" ? "PUBLISHED" : "DRAFT";
        return {
          ...art,
          status: newStatus as "DRAFT" | "PUBLISHED",
          publishedAt:
            newStatus === "PUBLISHED"
              ? new Date().toISOString()
              : art.publishedAt,
        };
      });

      const nextState = { ...prev, knowledgeArticles: updatedArticles };
      if (typeof window !== "undefined") {
        localStorage.setItem(
          ADMIN_LOCAL_STORAGE_KEY,
          JSON.stringify(nextState)
        );
      }
      return nextState;
    });
  }, []);

  const addArticle = useCallback(
    (article: Omit<KnowledgeArticle, "id">) => {
      setState((prev) => {
        const newArticle: KnowledgeArticle = {
          ...article,
          id: `art-${Date.now()}`,
          publishedAt:
            article.status === "PUBLISHED"
              ? new Date().toISOString()
              : undefined,
        };
        const nextState = {
          ...prev,
          knowledgeArticles: [newArticle, ...prev.knowledgeArticles],
        };
        if (typeof window !== "undefined") {
          localStorage.setItem(
            ADMIN_LOCAL_STORAGE_KEY,
            JSON.stringify(nextState)
          );
        }
        return nextState;
      });
    },
    []
  );

  const updateArticle = useCallback(
    (id: string, updates: Partial<KnowledgeArticle>) => {
      setState((prev) => {
        const updatedArticles = prev.knowledgeArticles.map((art) =>
          art.id === id ? { ...art, ...updates } : art
        );
        const nextState = { ...prev, knowledgeArticles: updatedArticles };
        if (typeof window !== "undefined") {
          localStorage.setItem(
            ADMIN_LOCAL_STORAGE_KEY,
            JSON.stringify(nextState)
          );
        }
        return nextState;
      });
    },
    []
  );

  const addAnnouncement = useCallback(
    (announcement: Omit<PlatformAnnouncement, "id">) => {
      setState((prev) => {
        const newAnc: PlatformAnnouncement = {
          ...announcement,
          id: `anc-${Date.now()}`,
          publishedAt: announcement.publishedAt || new Date().toISOString(),
          isActive: true,
        };
        const nextState = {
          ...prev,
          announcements: [newAnc, ...prev.announcements],
        };
        if (typeof window !== "undefined") {
          localStorage.setItem(
            ADMIN_LOCAL_STORAGE_KEY,
            JSON.stringify(nextState)
          );
        }
        return nextState;
      });
    },
    []
  );

  const toggleAnnouncementPin = useCallback((announcementId: string) => {
    setState((prev) => {
      const updatedAnc = prev.announcements.map((a) =>
        a.id === announcementId ? { ...a, isPinned: !a.isPinned } : a
      );
      const nextState = { ...prev, announcements: updatedAnc };
      if (typeof window !== "undefined") {
        localStorage.setItem(
          ADMIN_LOCAL_STORAGE_KEY,
          JSON.stringify(nextState)
        );
      }
      return nextState;
    });
  }, []);

  const deleteAnnouncement = useCallback((announcementId: string) => {
    setState((prev) => {
      const updatedAnc = prev.announcements.filter(
        (a) => a.id !== announcementId
      );
      const nextState = { ...prev, announcements: updatedAnc };
      if (typeof window !== "undefined") {
        localStorage.setItem(
          ADMIN_LOCAL_STORAGE_KEY,
          JSON.stringify(nextState)
        );
      }
      return nextState;
    });
  }, []);

  const disqualifyLeaderboardAthlete = useCallback(
    (athleteId: string, reason: string) => {
      if (!reason || reason.trim() === "") {
        throw new Error(
          "Sila masukkan sebab pembatalan penyertaan atlet dalam papan pendahulu."
        );
      }

      setState((prev) => {
        const updatedLeaderboard = prev.weeklyLeaderboard.map((entry) =>
          entry.athleteId === athleteId
            ? { ...entry, isDisqualified: true, disqualificationReason: reason }
            : entry
        );
        const nextState = {
          ...prev,
          weeklyLeaderboard: updatedLeaderboard,
        };
        if (typeof window !== "undefined") {
          localStorage.setItem(
            ADMIN_LOCAL_STORAGE_KEY,
            JSON.stringify(nextState)
          );
        }
        return nextState;
      });
    },
    []
  );

  const resetDemoState = useCallback(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(ADMIN_LOCAL_STORAGE_KEY);
        localStorage.setItem(
          ADMIN_LOCAL_STORAGE_KEY,
          JSON.stringify(initialMockAdminState)
        );
      } catch (e) {
        console.error("Failed to reset localStorage demo state:", e);
      }
    }
    setState({ ...initialMockAdminState, isHydrated: true });
  }, []);

  // Memoize actions
  const actions: AdminStoreActions = useMemo(
    () => ({
      reviewApplication,
      updateSubscriptionStatus,
      updateProgrammeMode,
      updateWeeklySchedule,
      addExercise,
      updateExercise,
      deleteExercise,
      assignAthleteCoach,
      updateAthleteDiscipline,
      updateAthleteStatus,
      updateCoachStatus,
      updateCompetitionStatus,
      updateAthleteMedicalClearance,
      updateLekirBotConfig,
      toggleArticleStatus,
      addArticle,
      updateArticle,
      addAnnouncement,
      toggleAnnouncementPin,
      deleteAnnouncement,
      disqualifyLeaderboardAthlete,
      resetDemoState,
    }),
    [
      reviewApplication,
      updateSubscriptionStatus,
      updateProgrammeMode,
      updateWeeklySchedule,
      addExercise,
      updateExercise,
      deleteExercise,
      assignAthleteCoach,
      updateAthleteDiscipline,
      updateAthleteStatus,
      updateCoachStatus,
      updateCompetitionStatus,
      updateAthleteMedicalClearance,
      updateLekirBotConfig,
      toggleArticleStatus,
      addArticle,
      updateArticle,
      addAnnouncement,
      toggleAnnouncementPin,
      deleteAnnouncement,
      disqualifyLeaderboardAthlete,
      resetDemoState,
    ]
  );

  const contextValue = useMemo(
    () => ({
      state: { ...state, isHydrated },
      actions,
    }),
    [state, isHydrated, actions]
  );

  return (
    <AdminContext.Provider value={contextValue}>
      {children}
    </AdminContext.Provider>
  );
}

// ============================================================================
// Custom Hooks
// ============================================================================

export function useAdminState(): AdminState {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdminState must be used within an <AdminProvider>");
  }
  return context.state;
}

export function useAdminActions(): AdminStoreActions {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdminActions must be used within an <AdminProvider>");
  }
  return context.actions;
}

export function useAdmin(): AdminContextValue {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an <AdminProvider>");
  }
  return context;
}
