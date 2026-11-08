"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ClipboardCheck,
  ShieldCheck,
  User,
  Zap,
} from "lucide-react";
import { ROLE_DESTINATIONS } from "@/lib/auth/auth-contract";
import type { AppRole } from "@/types/platform";

interface RoleLoginCardProps {
  role: AppRole;
}

interface RoleConfig {
  role: AppRole;
  title: string;
  icon: typeof User;
  destination: string;
  targetDashboard: string;
}

const ROLE_CONFIGS: Record<AppRole, RoleConfig> = {
  ATHLETE: {
    role: "ATHLETE",
    title: "Log Masuk Atlet",
    icon: User,
    destination: ROLE_DESTINATIONS.ATHLETE,
    targetDashboard: "Dashboard Atlet",
  },
  COACH: {
    role: "COACH",
    title: "Log Masuk Coach",
    icon: ClipboardCheck,
    destination: ROLE_DESTINATIONS.COACH,
    targetDashboard: "Dashboard Coach",
  },
  ADMIN: {
    role: "ADMIN",
    title: "Log Masuk Admin",
    icon: ShieldCheck,
    destination: ROLE_DESTINATIONS.ADMIN,
    targetDashboard: "Dashboard Admin",
  },
};

export function RoleLoginCard({ role }: RoleLoginCardProps) {
  const config = ROLE_CONFIGS[role];
  const Icon = config.icon;

  function syncSession() {
    try {
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem("fighterx_session_role", config.role);
      }
    } catch {
      // ignore
    }
  }

  return (
    <div className="glass-role-container">
      {/* Back Action */}
      <div className="glass-role-back-wrap">
        <Link href="/login" className="glass-role-back">
          <ArrowLeft size={15} aria-hidden="true" />
          <span>Kembali ke Pemilihan</span>
        </Link>
      </div>

      {/* Main Glass Card (Email & Password inputs removed for early development bypass) */}
      <section className="glass-role-card" aria-labelledby="role-login-heading">
        {/* Header Icon & Title */}
        <div className="glass-role-header">
          <div className="glass-role-icon-circle" aria-hidden="true">
            <Icon size={24} strokeWidth={1.9} />
          </div>
          <h1 id="role-login-heading" className="glass-role-title">
            {config.title}
          </h1>
          <p className="glass-role-tagline">{config.targetDashboard}</p>
        </div>

        {/* Development Bypass Box */}
        <div className="glass-bypass-box">
          <Link
            href={config.destination}
            className="glass-bypass-btn"
            onClick={syncSession}
          >
            <Zap size={16} aria-hidden="true" className="bypass-zap-icon" />
            <span>Bypass Masuk</span>
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <span className="glass-bypass-hint">
            Akses terus ke {config.targetDashboard.toLowerCase()}
          </span>
        </div>
      </section>
    </div>
  );
}
