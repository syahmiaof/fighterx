import type { AuthGateway } from "@/lib/auth/auth-contract";

/** UI-only adapter: replace with the server-backed Antigravity integration. */
export const uiOnlyAuthGateway: AuthGateway = {
  async signIn() {
    // Keep the pending UI perceptible in the local preview; replace with the real request.
    await new Promise((resolve) => window.setTimeout(resolve, 280));
    return { status: "unavailable", message: "Authentication belum disambungkan." };
  },
  async getSession() {
    return { status: "unavailable", message: "Session check belum disambungkan." };
  },
};
