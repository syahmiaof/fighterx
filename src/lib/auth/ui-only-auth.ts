import type { AuthGateway, SignInCredentials, SignInResult, AuthSessionResult } from "@/lib/auth/auth-contract";
import type { AppRole } from "@/types/platform";

const SESSION_STORAGE_KEY = "fighterx_session_role";

/** UI-only adapter with role-aware preview session support. */
export const uiOnlyAuthGateway: AuthGateway = {
  async signIn(credentials: SignInCredentials): Promise<SignInResult> {
    await new Promise((resolve) => window.setTimeout(resolve, 320));

    const email = credentials.email.trim().toLowerCase();
    const password = credentials.password;

    if (!email || !password) {
      return { status: "invalid-credentials" };
    }

    let resolvedRole: AppRole = credentials.role ?? "ATHLETE";

    if (!credentials.role) {
      if (email.includes("admin")) {
        resolvedRole = "ADMIN";
      } else if (email.includes("coach") || email.includes("cikgu")) {
        resolvedRole = "COACH";
      } else {
        resolvedRole = "ATHLETE";
      }
    }

    try {
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(SESSION_STORAGE_KEY, resolvedRole);
      }
    } catch {
      // ignore storage unavailability in restrictive browser contexts
    }

    return { status: "authenticated", role: resolvedRole };
  },

  async getSession(): Promise<AuthSessionResult> {
    try {
      if (typeof window !== "undefined") {
        const storedRole = window.sessionStorage.getItem(SESSION_STORAGE_KEY) as AppRole | null;
        if (storedRole && ["ADMIN", "COACH", "ATHLETE"].includes(storedRole)) {
          return { status: "authenticated", role: storedRole };
        }
      }
    } catch {
      // ignore
    }
    return { status: "unauthenticated" };
  },
};
