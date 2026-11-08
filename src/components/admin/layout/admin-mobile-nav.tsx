"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Bell } from "lucide-react";
import { AdminLogo } from "./admin-logo";
import { ADMIN_NAV_GROUPS } from "./admin-sidebar";
import { useAdminState } from "@/lib/admin/store";

export interface AdminMobileNavProps {
  applicationsBadgeCount?: number;
}

export function AdminMobileNav({
  applicationsBadgeCount: propBadgeCount,
}: AdminMobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const state = useAdminState();

  const applicationsBadgeCount =
    propBadgeCount !== undefined
      ? propBadgeCount
      : state.stats.pendingApplicationsCount;

  // Close drawer on route change
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setIsOpen(false);
  }

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="lg:hidden sticky top-0 z-30 w-full bg-[#0D0E12]/95 backdrop-blur-md border-b border-[#27272A] select-none">
      {/* Mobile Top Header Bar (56px) */}
      <div className="h-14 px-4 flex items-center justify-between gap-3">
        {/* Left: Hamburger Button & Logo */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="Buka Menu Navigasi"
            className="p-2 -ml-2 rounded-lg text-[#E5E5E7] hover:text-white hover:bg-[#202126] transition-colors admin-focus-ring cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <Menu className="w-6 h-6" />
          </button>
          <AdminLogo compact={false} showSubtitle={false} />
        </div>

        {/* Right: Notification Quick Link & Avatar */}
        <div className="flex items-center gap-2">
          <Link
            href="/admin/clubs/applications"
            aria-label="Permohonan Kelab"
            className="relative p-2 rounded-lg text-[#96989F] hover:text-white hover:bg-[#202126] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <Bell className="w-5 h-5" />
            {applicationsBadgeCount > 0 && (
              <span className="absolute top-2 right-2 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E10600] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF3845]" />
              </span>
            )}
          </Link>
          <Link
            href="/admin/settings"
            className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#E10600] to-[#FF3845] flex items-center justify-center text-white font-bold text-xs shadow-md"
          >
            AD
          </Link>
        </div>
      </div>

      {/* Slide-over Drawer Backdrop & Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-[#08090B]/85 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Slide-over Drawer Panel */}
          <div className="relative z-10 w-[85vw] max-w-xs h-full bg-[#0F1015] border-r border-[#27272A] shadow-2xl flex flex-col justify-between overflow-hidden admin-panel-enter">
            {/* Drawer Header */}
            <div className="p-4 border-b border-[#27272A] flex items-center justify-between bg-[#14151B]">
              <AdminLogo showSubtitle={true} />
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Tutup Menu"
                className="p-2 rounded-lg text-[#96989F] hover:text-white hover:bg-[#202126] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Menu List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-5 admin-scrollbar">
              {ADMIN_NAV_GROUPS.map((group) => (
                <div key={group.id} className="space-y-1">
                  <h4 className="px-3 text-[10px] font-bold text-[#87898F] uppercase tracking-[0.16em]">
                    {group.title}
                  </h4>
                  <div className="space-y-0.5 mt-1">
                    {group.items.map((item) => {
                      const IconComponent = item.icon;
                      const isActive =
                        item.href === "/admin"
                          ? pathname === "/admin"
                          : pathname.startsWith(item.href);

                      const badgeValue =
                        item.href === "/admin/clubs/applications"
                          ? applicationsBadgeCount
                          : item.badge;

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className={`relative flex items-center justify-between px-3 py-2.5 text-xs font-semibold rounded-lg transition-colors min-h-[44px] ${
                            isActive
                              ? "bg-[#1E2028] text-white shadow-[inset_0_1px_rgba(255,255,255,0.06)]"
                              : "text-[#C5C6CA] hover:text-white hover:bg-[#17191E]"
                          }`}
                        >
                          {isActive && (
                            <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r bg-[#E10600] shadow-[0_0_8px_#FF3845]" />
                          )}
                          <div className="flex items-center gap-3 truncate">
                            <IconComponent
                              className={`w-4 h-4 flex-shrink-0 ${
                                isActive ? "text-[#FF3845]" : "text-[#96989F]"
                              }`}
                            />
                            <span className="truncate">{item.label}</span>
                          </div>
                          {badgeValue !== undefined && badgeValue !== 0 && (
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                item.badgeVariant === "warning"
                                  ? "bg-[#F59E0B]/20 text-[#FBBF24] border border-[#F59E0B]/40"
                                  : "bg-[#202126] text-[#96989F]"
                              }`}
                            >
                              {badgeValue}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Drawer Footer */}
            <div className="p-3 border-t border-[#27272A] bg-[#0B0C0F] text-center">
              <p
                className="text-[10px] font-bold tracking-[0.16em] text-[#96989F] uppercase"
                style={{ fontFamily: "var(--font-athletic), Teko, sans-serif" }}
              >
                FIGHTERX // ADMIN PORTAL
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
