import type {
  ClubRegistrationRequest,
  ClubRegistrationReceipt,
  ClubRegistrationResult,
  ClubRegistrationService,
} from "@/lib/club-registration/contract";
import { SILAT_AFFILIATIONS } from "@/lib/club-registration/affiliations-data";

/**
 * Client-side mock adapter for public club onboarding preview.
 * Simulates async processing and generates a structured confirmation receipt
 * without requiring live database or backend persistence.
 */
export const uiOnlyClubRegistrationService: ClubRegistrationService = {
  async register(request: ClubRegistrationRequest): Promise<ClubRegistrationResult> {
    // Simulate short network latency
    await new Promise((resolve) => setTimeout(resolve, 450));

    // Generate random 5-digit application identifier FX-APP-2026-XXXXX
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const applicationId = request.applicationId || `FX-APP-2026-${randomSuffix}`;

    const affiliation = SILAT_AFFILIATIONS.find((a) => a.id === request.associationId);
    const associationName = affiliation ? affiliation.shortName : "Kelab Bebas";

    const receipt: ClubRegistrationReceipt = {
      applicationId,
      applicationStatus: "PENDING_APPROVAL",
      organizationId: `org-mock-${randomSuffix}`,
      applicantAccountId: `acc-mock-${randomSuffix}`,
      applicantAccountStatus: "PENDING_ACTIVATION",
      subscription: {
        status: "TRIAL_ACTIVE",
        trialStartsAt: new Date().toISOString(),
        monthlyPriceMYR: 20,
        coveredClubCount: 1,
        trialPeriodDays: 30,
      },
      clubName: request.clubName || request.club?.name || "Kelab Silat",
      representativeName:
        request.representativeName || request.applicant?.fullName || "Wakil Kelab",
      associationName,
      submittedAt: new Date().toISOString(),
    };

    return {
      status: "accepted",
      receipt,
    };
  },
};
