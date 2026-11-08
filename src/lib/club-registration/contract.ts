export const ORGANIZATION_TYPES = ["CLUB", "ACADEMY", "ASSOCIATION", "OTHER"] as const;
export type OrganizationType = (typeof ORGANIZATION_TYPES)[number];

export const TRAINING_VENUE_TYPES = ["DOJO", "OUTDOOR", "SCHOOL", "COMMUNITY_HALL"] as const;
export type TrainingVenueType = (typeof TRAINING_VENUE_TYPES)[number];

export const REGISTRATION_DISCIPLINES = ["SENI", "OLAHRAGA"] as const;
export type RegistrationDiscipline = (typeof REGISTRATION_DISCIPLINES)[number];

export interface ClubRegistrationRequest {
  // Step 1: Club Info
  clubName: string;
  registrationNumber?: string; // ROS / SSM / PJS
  organizationType: OrganizationType;
  state: string;
  city: string;
  address: string;
  postalCode: string;
  // Step 2: PIC Info
  representativeName: string;
  identificationNumber: string; // MyKad / Passport
  email: string;
  phone: string;
  designation: string;
  password?: string;
  // Step 3: Disciplines & Venue
  disciplines: Array<"SENI" | "OLAHRAGA">;
  trainingVenueType: TrainingVenueType;
  weeklySessions: number;
  // Step 4: Affiliation
  associationId: string; // Linked to SilatAssociation.id or "INDEPENDENT"
  // Step 5: Metadata
  agreedToTerms: boolean;
  applicationId?: string; // FX-APP-XXXXX

  // Optional legacy nested format compatibility
  club?: {
    name: string;
    type: OrganizationType;
    state: string;
    district: string;
    address: string;
  };
  applicant?: {
    fullName: string;
    position: string;
    phoneNumber: string;
    email: string;
    password: string;
  };
  termsAccepted?: boolean;
}

export type ClubApplicationStatus = "PENDING_APPROVAL" | "APPROVED" | "REJECTED";
export type ApplicantAccountStatus = "PENDING_ACTIVATION" | "ACTIVE" | "SUSPENDED";
export type ClubSubscriptionStatus = "NOT_STARTED" | "TRIAL_ACTIVE" | "PAID_ACTIVE" | "PAST_DUE" | "CANCELED";

export type ClubRegistrationReceipt = {
  applicationId: string;
  applicationStatus: ClubApplicationStatus;
  organizationId: string | null;
  applicantAccountId: string | null;
  applicantAccountStatus: ApplicantAccountStatus;
  subscription: {
    status: ClubSubscriptionStatus;
    trialStartsAt: string | null;
    monthlyPriceMYR: 20;
    coveredClubCount: 1;
    trialPeriodDays?: number;
  };
  clubName?: string;
  representativeName?: string;
  associationName?: string;
  submittedAt?: string;
};

export type ClubRegistrationResult =
  | { status: "accepted"; receipt: ClubRegistrationReceipt }
  | { status: "preview-only"; receipt?: ClubRegistrationReceipt }
  | { status: "unavailable"; message: string }
  | { status: "error"; message: string };

/** Implement with a trusted backend endpoint; role assignment must stay server-side. */
export interface ClubRegistrationService {
  register(request: ClubRegistrationRequest): Promise<ClubRegistrationResult>;
}
