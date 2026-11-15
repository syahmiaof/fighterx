"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, ArrowLeft, ClipboardCheck, ShieldCheck, User, Zap } from "lucide-react";
import gsap from "gsap";
import { ROLE_DESTINATIONS } from "@/lib/auth/auth-contract";
import type { AppRole } from "@/types/platform";
import { useLanguage } from "@/lib/i18n";
import "./login-portal.css";

export function RoleSelectionCards() {
  const { dict, locale } = useLanguage();
  const ad = dict.auth;
  const headerRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);

  const roles = [
    {
      id: "athlete" as const,
      role: "ATHLETE" as AppRole,
      title: ad.roleAthleteTitle,
      icon: User,
      destination: ROLE_DESTINATIONS.ATHLETE,
      buttonLabel: ad.bypassButton,
    },
    {
      id: "coach" as const,
      role: "COACH" as AppRole,
      title: ad.roleCoachTitle,
      icon: ClipboardCheck,
      destination: ROLE_DESTINATIONS.COACH,
      buttonLabel: ad.bypassButton,
    },
    {
      id: "admin" as const,
      role: "ADMIN" as AppRole,
      title: ad.roleAdminTitle,
      icon: ShieldCheck,
      destination: ROLE_DESTINATIONS.ADMIN,
      buttonLabel: ad.bypassButton,
    },
  ];

  function handleSyncSession(role: AppRole) {
    try {
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem("fighterx_session_role", role);
      }
    } catch {
      // ignore
    }
  }

  // Nemo Iris Entrance Physics (matches Public Zone Motion System)
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: -16, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.65, ease: "power2.out", clearProps: "all" }
      );
    }

    if (gridRef.current) {
      const cards = gridRef.current.querySelectorAll<HTMLElement>(".glass-card");
      if (cards.length > 0) {
        gsap.fromTo(
          cards,
          {
            opacity: 0,
            y: 22,
            scale: 0.96,
            clipPath: "inset(0 50% 0 50% round 14px)",
            willChange: "transform, opacity, clip-path",
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            clipPath: "inset(0 0% 0 0% round 14px)",
            duration: 0.85,
            ease: "expo.out",
            stagger: 0.1,
            clearProps: "transform,scale,opacity,clipPath,clip-path,willChange",
          }
        );
      }
    }

    if (footerRef.current) {
      gsap.fromTo(
        footerRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.5, delay: 0.3, ease: "power2.out", clearProps: "all" }
      );
    }
  }, []);

  // Dual-tone header title: e.g. "LOGIN" (white) + "PORTAL" (crimson) or "LOG MASUK" (white) + "PORTAL" (crimson)
  const rawTitle = ad.loginTitle || "Login Portal";
  const words = rawTitle.trim().split(/\s+/);
  const lastWord = words.length > 1 ? words.pop() : "";
  const firstWords = words.join(" ");

  return (
    <div className="glass-login-stage">
      {/* Minimal Header — Public Hero Display Dual-Tone Typography, no red kicker */}
      <header ref={headerRef} className="glass-login-header">
        <h1 className="hero-display-title">
          <span className="title-white">{firstWords} </span>
          {lastWord && <span className="title-crimson">{lastWord}</span>}
        </h1>
      </header>

      {/* 3 Crystal Glassmorphism Cards Grid (Minimalist: Icon + Athletic Italic Title + Bypass CTA) */}
      <div
        ref={gridRef}
        className="glass-cards-grid"
        role="region"
        aria-label={locale === "bm" ? "Pilih Peranan" : "Select Role"}
      >
        {roles.map((role) => {
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

              {/* Role Title in Teko Athletic Italic (matching Silat Seni & Silat Olahraga) */}
              <h2 className="glass-card-title">{role.title}</h2>

              {/* Direct Bypass Button to Dashboard (No tagline, no official login text) */}
              <div className="glass-card-cta">
                <Link
                  href={role.destination}
                  className="glass-card-btn"
                  onClick={() => handleSyncSession(role.role)}
                  aria-label={
                    locale === "bm"
                      ? `Pintas masuk ke papan pemuka ${role.title}`
                      : `Bypass login to ${role.title} dashboard`
                  }
                >
                  <Zap size={14} aria-hidden="true" className="bypass-zap-icon" />
                  <span>{role.buttonLabel}</span>
                  <ArrowRight size={14} aria-hidden="true" className="glass-card-arrow" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Minimal Back Action */}
      <footer ref={footerRef} className="glass-login-footer">
        <Link href="/" className="glass-back-link">
          <ArrowLeft size={14} aria-hidden="true" />
          <span>{ad.backHome}</span>
        </Link>
      </footer>
    </div>
  );
}
