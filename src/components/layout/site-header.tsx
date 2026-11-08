"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  Menu,
  X,
  Shield,
  BookOpen,
  Layers,
  Users,
  Home,
  UserCheck,
  Trophy,
  CalendarDays,
  Handshake,
  BookMarked,
  Sparkles,
} from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export type SiteHeaderPage =
  | "home"
  | "guidelines"
  | "knowledge"
  | "leaderboard"
  | "competitions"
  | "collaboration"
  | "moments"
  | "associations"
  | "disciplines"
  | "login"
  | "register"
  | "my-club"
  | string;

export interface SiteHeaderProps {
  currentPage?: SiteHeaderPage;
}

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon?: typeof Home;
}

const NAV_ITEMS: NavItem[] = [
  { id: "home", label: "Utama", href: "/", icon: Home },
  { id: "guidelines", label: "Guidelines", href: "/guidelines", icon: BookOpen },
  { id: "knowledge", label: "Sport Science", href: "/knowledge", icon: BookMarked },
  { id: "leaderboard", label: "Leaderboard", href: "/leaderboard", icon: Trophy },
  { id: "competitions", label: "Kalendar", href: "/competitions", icon: CalendarDays },
  { id: "moments", label: "Moment", href: "/moments", icon: Sparkles },
  { id: "associations", label: "Persatuan", href: "/associations", icon: Shield },
  { id: "disciplines", label: "Disiplin", href: "/disciplines", icon: Layers },
];

function BrandWordmark() {
  return (
    <Link className="brand" href="/" prefetch={true} aria-label="FighterX homepage">
      <span className="brand-copy">
        <strong>
          FIGHTER<span>X</span>
        </strong>
        <small>SILAT ATHLETE PLATFORM</small>
      </span>
    </Link>
  );
}

export function SiteHeader({ currentPage = "home" }: SiteHeaderProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [optimisticHref, setOptimisticHref] = useState<string | null>(null);

  const headerRef = useRef<HTMLElement>(null);
  const headerInnerRef = useRef<HTMLDivElement>(null);
  const toggleBtnRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLElement>(null);

  // Clear optimistic active indicator whenever route changes
  useEffect(() => {
    setOptimisticHref(null);
  }, [pathname]);

  const isPageActive = useCallback(
    (item: NavItem): boolean => {
      if (optimisticHref) {
        return optimisticHref === item.href;
      }
      if (item.href === "/") {
        return pathname === "/" || (!pathname && currentPage === "home") || currentPage === "home";
      }
      if (pathname === item.href || pathname.startsWith(item.href + "/")) {
        return true;
      }
      if (
        item.id === "competitions" &&
        (pathname.includes("calendar") ||
          pathname.includes("competitions") ||
          currentPage === "calendar" ||
          currentPage === "competitions")
      ) {
        return true;
      }
      if (
        item.id === "knowledge" &&
        (pathname.includes("knowledge") || currentPage === "knowledge")
      ) {
        return true;
      }
      if (currentPage === item.id) {
        return true;
      }
      return false;
    },
    [pathname, currentPage, optimisticHref]
  );

  // Close mobile drawer on ESC or outside click
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && menuOpen) {
        setMenuOpen(false);
        toggleBtnRef.current?.focus();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuOpen &&
        headerRef.current &&
        !headerRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  // GSAP: Animate Mobile Drawer
  useEffect(() => {
    if (!mobileMenuRef.current) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (menuOpen) {
      if (prefersReduced) {
        gsap.set(mobileMenuRef.current, { opacity: 1, y: 0, display: "grid" });
      } else {
        gsap.killTweensOf(mobileMenuRef.current);
        gsap.set(mobileMenuRef.current, { display: "grid" });
        gsap.fromTo(
          mobileMenuRef.current,
          { opacity: 0, y: -12 },
          { opacity: 1, y: 0, duration: 0.2, ease: "power3.out" }
        );
        gsap.fromTo(
          mobileMenuRef.current.querySelectorAll(".mobile-nav-link"),
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.18, stagger: 0.02, ease: "power2.out", delay: 0.03 }
        );
      }
    } else {
      if (prefersReduced) {
        gsap.set(mobileMenuRef.current, { opacity: 0, display: "none" });
      } else {
        gsap.to(mobileMenuRef.current, {
          opacity: 0,
          y: -8,
          duration: 0.15,
          ease: "power2.in",
          onComplete: () => {
            if (mobileMenuRef.current) mobileMenuRef.current.style.display = "none";
          },
        });
      }
    }
  }, [menuOpen]);

  return (
    <header
      ref={headerRef}
      className="site-header site-header-glass"
      id={currentPage === "home" ? "top" : undefined}
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        height: "64px",
        backgroundColor: "rgba(9, 10, 12, 0.92)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      <div
        className="header-inner"
        ref={headerInnerRef}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "100%",
          width: "min(100% - 32px, 1440px)",
          margin: "0 auto",
          gap: "12px",
        }}
      >
        <BrandWordmark />

        {/* Desktop All 8 Modules Nav Bar with CSS Hover & Glowing Active Pill */}
        <nav
          className="header-nav-container"
          aria-label="Primary navigation"
        >
          {/* Accessible Static Route Mesh */}
          <span className="sr-only" aria-hidden="true">
            <Link href="/" prefetch={true}>Utama</Link>
            <Link href="/guidelines" prefetch={true}>Guidelines</Link>
            <Link href="/knowledge" prefetch={true}>Sport Science</Link>
            <Link href="/leaderboard" prefetch={true}>Leaderboard</Link>
            <Link href="/competitions" prefetch={true}>Kalendar</Link>
            <Link href="/moments" prefetch={true}>Moment</Link>
            <Link href="/associations" prefetch={true}>Persatuan</Link>
            <Link href="/disciplines" prefetch={true}>Disiplin</Link>
          </span>

          {NAV_ITEMS.map((item) => {
            const active = isPageActive(item);
            return (
              <Link
                key={item.id}
                href={item.href}
                prefetch={true}
                data-nav-id={item.id}
                onClick={() => setOptimisticHref(item.href)}
                className={`nav-item-btn ${active ? "is-active" : ""}`}
                aria-current={active ? "page" : undefined}
              >
                <span>{item.label}</span>
                {active && (
                  <span
                    className="active-glow-dot"
                    aria-hidden="true"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls (Login & Register Club) */}
        <div
          className="header-actions"
          style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}
        >
          <div
            className="header-action-pill"
            role="group"
            aria-label="Akaun dan Pendaftaran Kelab"
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "3px",
              backgroundColor: "rgba(18, 19, 23, 0.85)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "9999px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.4)",
            }}
          >
            <Link
              href="/login"
              prefetch={true}
              className="pill-action-login"
              aria-current={currentPage === "login" ? "page" : undefined}
              style={{
                padding: "5px 12px",
                fontSize: "12px",
                fontWeight: 600,
                color: "#c5c6ca",
                textDecoration: "none",
                borderRadius: "9999px",
                transition: "color 0.15s ease",
              }}
            >
              Login
            </Link>
            <div
              className="pill-action-divider"
              aria-hidden="true"
              style={{
                width: "1px",
                height: "16px",
                backgroundColor: "rgba(255, 255, 255, 0.15)",
              }}
            />
            <Link
              href="/register-club"
              prefetch={true}
              className="pill-action-register button-primary"
              aria-current={
                currentPage === "register" || currentPage === "register-club"
                  ? "page"
                  : undefined
              }
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                padding: "5px 13px",
                fontSize: "11.5px",
                fontWeight: 700,
                color: "#ffffff",
                textDecoration: "none",
                borderRadius: "9999px",
                background: "linear-gradient(135deg, #e10600 0%, #a80000 100%)",
                boxShadow: "0 2px 10px rgba(225, 6, 0, 0.35)",
              }}
            >
              <span>Register Club</span>
              <ArrowRight size={13} aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <button
          ref={toggleBtnRef}
          className="mobile-menu-toggle"
          type="button"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? (
            <X size={20} aria-hidden="true" />
          ) : (
            <Menu size={20} aria-hidden="true" />
          )}
        </button>

        {/* Mobile Drawer Menu */}
        <nav
          ref={mobileMenuRef}
          id="mobile-nav"
          className={`mobile-menu ${menuOpen ? "is-open" : ""}`}
          aria-label="Mobile navigation"
          aria-hidden={!menuOpen}
          style={{ display: "none" }}
        >
          <div className="mobile-section-label">Semua Modul FighterX</div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon || Home;
            const active = isPageActive(item);
            return (
              <Link
                key={item.id}
                href={item.href}
                prefetch={true}
                aria-current={active ? "page" : undefined}
                onClick={() => setMenuOpen(false)}
                className={`mobile-nav-link ${active ? "is-active" : ""}`}
              >
                <Icon size={16} className="mobile-nav-icon" aria-hidden="true" />
                <span className="mobile-nav-text">{item.label}</span>
                {active && (
                  <span className="mobile-active-dot" aria-hidden="true">
                    <Sparkles size={12} />
                  </span>
                )}
              </Link>
            );
          })}

          <div className="mobile-actions-divider" />
          <div className="mobile-actions-row">
            <Link
              href="/login"
              prefetch={true}
              aria-current={currentPage === "login" ? "page" : undefined}
              onClick={() => setMenuOpen(false)}
              className="mobile-btn-login"
            >
              <UserCheck size={16} aria-hidden="true" />
              <span>Login</span>
            </Link>
            <Link
              href="/register-club"
              prefetch={true}
              aria-current={
                currentPage === "register" || currentPage === "register-club"
                  ? "page"
                  : undefined
              }
              onClick={() => setMenuOpen(false)}
              className="mobile-btn-register"
            >
              <Users size={16} aria-hidden="true" />
              <span>Register Club</span>
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
