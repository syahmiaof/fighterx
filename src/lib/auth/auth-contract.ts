import type { AppRole } from "@/types/platform";

export type SignInCredentials = {
  email: string;
  password: string;
  role?: AppRole;
};

/**
 * The role in this result must come from a verified server session.
 * It is never accepted from form data, query parameters, or browser storage.
 */
export type SignInResult =
  | { status: "authenticated"; role: AppRole }
  | { status: "invalid-credentials" }
  | { status: "unavailable"; message?: string };

export type AuthSessionResult =
  | { status: "authenticated"; role: AppRole }
  | { status: "unauthenticated" }
  | { status: "unavailable"; message?: string };

export interface AuthGateway {
  signIn(credentials: SignInCredentials): Promise<SignInResult>;
  getSession(): Promise<AuthSessionResult>;
}

export const ROLE_DESTINATIONS: Record<AppRole, string> = {
  ADMIN: "/admin",
  COACH: "/coach",
  ATHLETE: "/athlete",
};
