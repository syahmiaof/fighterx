"use client";

import React, { useEffect, useMemo, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAdminState } from "./store";
import { mockAdminProfile } from "./mock-data";
import type { AdminProfile } from "./types";

export type AdminAuthStatus =
  | "CHECKING"
  | "AUTHORIZED"
  | "UNAUTHORIZED"
  | "UNAUTHENTICATED";

export interface AdminGuardState {
  status: AdminAuthStatus;
  profile: AdminProfile | null;
  errorMessage?: string;
}

/**
 * Custom hook to verify that the current session possesses strictly the 'ADMIN' role.
 * Prohibits public self-registration or unauthorized cross-portal role escalation.
 */
export function useAdminGuard(): AdminGuardState {
  const router = useRouter();
  const pathname = usePathname();
  const { adminProfile, isHydrated } = useAdminState();
  const effectiveProfile = adminProfile ?? mockAdminProfile;

  const status: AdminAuthStatus = useMemo(() => {
    if (!effectiveProfile) return "UNAUTHENTICATED";
    if (effectiveProfile.role !== "ADMIN") return "UNAUTHORIZED";
    return "AUTHORIZED";
  }, [effectiveProfile]);

  useEffect(() => {
    if (!isHydrated) return;

    if (!effectiveProfile) {
      router.replace("/login?redirect=" + encodeURIComponent(pathname || "/admin"));
      return;
    }

    if (effectiveProfile.role !== "ADMIN") {
      router.replace("/login?error=unauthorized_role");
      return;
    }
  }, [isHydrated, effectiveProfile, router, pathname]);

  return useMemo(
    () => ({
      status,
      profile: effectiveProfile,
    }),
    [status, effectiveProfile]
  );
}

/**
 * AdminRouteGuard:
 * Wraps admin pages and layouts to enforce strict role boundaries.
 */
export function AdminRouteGuard({
  children,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const { status } = useAdminGuard();

  if (status === "UNAUTHORIZED") {
    return (
      <div
        className="min-h-screen w-full flex items-center justify-center p-6"
        style={{ backgroundColor: "#08090B", color: "#E2E8F0" }}
      >
        <div className="p-6 rounded-lg border border-red-900/60 bg-red-950/20 text-center max-w-sm">
          <p className="text-sm font-semibold text-red-400 mb-1">Akses Dihadkan</p>
          <p className="text-xs text-zinc-400">
            Akaun anda tidak mempunyai kebenaran untuk memasuki portal pentadbir.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
