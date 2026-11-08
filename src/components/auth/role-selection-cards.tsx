"use client";

import Link from "next/link";
import { ArrowRight, ArrowLeft, ClipboardCheck, ShieldCheck, User, Zap } from "lucide-react";
import { ROLE_DESTINATIONS } from "@/lib/auth/auth-contract";
import type { AppRole } from "@/types/platform";

interface RoleCard {
  id: "athlete" | "coach" | "admin";
  role: AppRole;
  title: string;
  tagline: string;
  icon: typeof User;
  destination: string;
  roleHref: string;
  buttonLabel: string;
}

const ROLES: RoleCard[] = [
  {
    id: "athlete",
    role: "ATHLETE",
    title: "ATLET",
    tagline: "Latihan & Prestasi",
    icon: User,
    destination: ROLE_DESTINATIONS.ATHLETE,
    roleHref: "/login/athlete",
    buttonLabel: "BYPASS MASUK",
  },
  {
    id: "coach",
    role: "COACH",
    title: "COACH",
    tagline: "Pengurusan Skuad",
    icon: ClipboardCheck,
    destination: ROLE_DESTINATIONS.COACH,
    roleHref: "/login/coach",
    buttonLabel: "BYPASS MASUK",
  },
  {
    id: "admin",
    role: "ADMIN",
    title: "ADMIN",
    tagline: "Pentadbiran Sistem",
    icon: ShieldCheck,
    destination: ROLE_DESTINATIONS.ADMIN,
    roleHref: "/login/admin",
    buttonLabel: "BYPASS MASUK",
  },
];

export function RoleSelectionCards() {
  function handleSyncSession(role: AppRole) {
    try {
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem("fighterx_session_role", role);
      }
    } catch {
      // ignore
    }
  }

  return (
    <div className="glass-login-stage">
      {/* Minimal Header */}
      <header className="glass-login-header">
        <span className="glass-login-kicker">FIGHTERX</span>
        <h1 className="glass-login-title">Log Masuk</h1>
      </header>

      {/* 3 Glassmorphism Cards */}
      <div className="glass-cards-grid" role="region" aria-label="Pilih Peranan">
        {ROLES.map((role) => {
          const Icon = role.icon;
          return (
            <div
              key={role.id}
              className={`glass-card glass-card-${role.id}`}
            >
              {/* Circular Icon with Subtle Glow */}
              <div className="glass-icon-wrapper" aria-hidden="true">
                <div className="glass-icon-circle">
                  <Icon size={26} strokeWidth={1.9} />
                </div>
              </div>

              {/* Title & Short Tagline */}
              <h2 className="glass-card-title">{role.title}</h2>
              <p className="glass-card-tagline">{role.tagline}</p>

              {/* Direct Bypass Button to Dashboard */}
              <div className="glass-card-cta flex flex-col items-center gap-3">
                <Link
                  href={role.destination}
                  className="glass-card-btn"
                  onClick={() => handleSyncSession(role.role)}
                  aria-label={`Bypass masuk ke dashboard ${role.title}`}
                >
                  <Zap size={14} aria-hidden="true" className="bypass-zap-icon" />
                  <span>{role.buttonLabel}</span>
                  <ArrowRight size={14} aria-hidden="true" className="glass-card-arrow" />
                </Link>
                <Link
                  href={role.roleHref}
                  className="text-xs text-zinc-400 hover:text-white underline"
                >
                  Halaman Login Rasmi
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Minimal Back Action */}
      <footer className="glass-login-footer">
        <Link href="/" className="glass-back-link">
          <ArrowLeft size={14} aria-hidden="true" />
          <span>Kembali ke Homepage</span>
        </Link>
      </footer>
    </div>
  );
}
