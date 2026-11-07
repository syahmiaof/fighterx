export const ORGANIZATION_TYPES = ["CLUB", "ACADEMY", "ASSOCIATION", "OTHER"] as const;
export type OrganizationType = (typeof ORGANIZATION_TYPES)[number];

export type ClubRegistrationRequest = {
  club: {
    name: string;
    type: OrganizationType;
    state: string;
    district: string;
    address: string;
  };
  applicant: {
    fullName: string;
    position: string;
    phoneNumber: string;
    email: string;
    password: string;
  };
  termsAccepted: true;
};

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
  };
};

export type ClubRegistrationResult =
  | { status: "accepted"; receipt: ClubRegistrationReceipt }
  | { status: "preview-only" }
  | { status: "unavailable"; message: string }
  | { status: "error"; message: string };

/** Implement with a trusted backend endpoint; role assignment must stay server-side. */
export interface ClubRegistrationService {
  register(request: ClubRegistrationRequest): Promise<ClubRegistrationResult>;
}
