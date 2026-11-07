import type { ClubRegistrationService } from "@/lib/club-registration/contract";

/**
 * Frontend preview only. This adapter deliberately sends, persists, or returns
 * no applicant/club data. Replace it with the approved backend integration.
 */
export const uiOnlyClubRegistrationService: ClubRegistrationService = {
  async register() {
    await new Promise((resolve) => setTimeout(resolve, 320));
    return { status: "preview-only" };
  },
};
