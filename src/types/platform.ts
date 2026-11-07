export const APP_ROLES = ["ADMIN", "COACH", "ATHLETE"] as const;
export type AppRole = (typeof APP_ROLES)[number];

export const DISCIPLINES = ["SENI", "OLAHRAGA"] as const;
export type Discipline = (typeof DISCIPLINES)[number];

export type UUID = string & { readonly __brand: "UUID" };
export type ISODateTime = string & { readonly __brand: "ISODateTime" };

export interface Organization {
  id: UUID;
  name: string;
  createdAt: ISODateTime;
}

export interface AccountProfile {
  id: UUID;
  organizationId: UUID | null;
  role: AppRole;
  displayName: string;
  discipline: Discipline | null;
  createdAt: ISODateTime;
}

export interface TrainingProgramme {
  id: UUID;
  organizationId: UUID | null;
  ownerProfileId: UUID;
  title: string;
  discipline: Discipline;
  version: number;
  isPublished: boolean;
}

export interface TrainingAssignment {
  id: UUID;
  programmeId: UUID;
  athleteProfileId: UUID;
  coachProfileId: UUID;
  dueAt: ISODateTime | null;
  status: "ASSIGNED" | "IN_PROGRESS" | "SUBMITTED" | "COMPLETE";
}

export interface TrainingSubmission {
  id: UUID;
  assignmentId: UUID;
  athleteProfileId: UUID;
  completedAt: ISODateTime;
  metrics: Record<string, number | string | boolean>;
  evidence: EvidenceReference[];
  status: "PENDING" | "VERIFIED" | "CORRECTION_REQUIRED";
}

export interface EvidenceReference {
  id: UUID;
  storagePath: string;
  mediaType: "IMAGE" | "VIDEO" | "DOCUMENT";
  uploadedAt: ISODateTime;
}

export interface CoachVerification {
  id: UUID;
  submissionId: UUID;
  coachProfileId: UUID;
  decision: "VERIFIED" | "CORRECTION_REQUIRED";
  feedback: string | null;
  reviewedAt: ISODateTime;
}
