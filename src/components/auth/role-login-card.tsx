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
import { useLanguage } from "@/lib/i18n";

interface RoleLoginCardProps {
  role: AppRole;
}

interface RoleConfig {
  role: AppRole;
  titleBm: string;
  titleEn: string;
  icon: typeof User;
  destination: string;
  targetDashboardBm: string;
  targetDashboardEn: string;
}

const ROLE_CONFIGS: Record<AppRole, RoleConfig> = {
  ATHLETE: {
    role: "ATHLETE",
    titleBm: "Log Masuk Atlet",
    titleEn: "Athlete Sign In",
    icon: User,
    destination: ROLE_DESTINATIONS.ATHLETE,
    targetDashboardBm: "Dashboard Atlet",
    targetDashboardEn: "Athlete Dashboard",
  },
  COACH: {
    role: "COACH",
    titleBm: "Log Masuk Coach",
    titleEn: "Coach Sign In",
    icon: ClipboardCheck,
    destination: ROLE_DESTINATIONS.COACH,
    targetDashboardBm: "Dashboard Coach",
    targetDashboardEn: "Coach Dashboard",
  },
  ADMIN: {
    role: "ADMIN",
    titleBm: "Log Masuk Admin",
    titleEn: "Admin Sign In",
    icon: ShieldCheck,
    destination: ROLE_DESTINATIONS.ADMIN,
    targetDashboardBm: "Dashboard Admin",
    targetDashboardEn: "Admin Dashboard",
  },
};

export function RoleLoginCard({ role }: RoleLoginCardProps) {
  const { locale } = useLanguage();
  const config = ROLE_CONFIGS[role];
  const Icon = config.icon;
  const title = locale === "en" ? config.titleEn : config.titleBm;
  const targetDashboard = locale === "en" ? config.targetDashboardEn : config.targetDashboardBm;

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
          <span>{locale === "bm" ? "Kembali ke Pemilihan" : "Back to Selection"}</span>
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
            {title}
          </h1>
          <p className="glass-role-tagline">{targetDashboard}</p>
        </div>

        {/* Development Bypass Box */}
        <div className="glass-bypass-box">
          <Link
            href={config.destination}
            className="glass-bypass-btn"
            onClick={syncSession}
          >
            <Zap size={16} aria-hidden="true" className="bypass-zap-icon" />
            <span>{locale === "bm" ? "Pintas Masuk" : "Bypass Login"}</span>
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <span className="glass-bypass-hint">
            {locale === "bm"
              ? `Akses terus ke ${targetDashboard.toLowerCase()}`
              : `Direct access to ${targetDashboard.toLowerCase()}`}
          </span>
        </div>
      </section>
    </div>
  );
}
