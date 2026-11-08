"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Bell,
  HelpCircle,
  Shield,
  User,
  Settings,
  LogOut,
  ExternalLink,
  ChevronDown,
  RotateCcw,
} from "lucide-react";
import { AdminLogo } from "./admin-logo";
import { useAdminState, useAdminActions } from "@/lib/admin/store";

export interface AdminHeaderProps {
  onResetDemo?: () => void;
  pendingCount?: number;
}

export function AdminHeader({
  onResetDemo: propOnResetDemo,
  pendingCount: propPendingCount,
}: AdminHeaderProps) {
  const state = useAdminState();
  const actions = useAdminActions();

  const pendingCount =
    propPendingCount !== undefined
      ? propPendingCount
      : state.stats.pendingApplicationsCount;

  const onResetDemo = propOnResetDemo ?? (() => actions.resetDemoState());
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setUserMenuOpen(false);
      }
      if (
        notifRef.current &&
        !notifRef.current.contains(e.target as Node)
      ) {
        setNotificationOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-30 h-16 w-full bg-[#0D0E12]/95 backdrop-blur-md border-b border-[#27272A] select-none">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left: Brand Logo & System Subtitle Badge */}
        <div className="flex items-center gap-3 sm:gap-4">
          <AdminLogo showSubtitle={false} />
          <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-[#27272A]">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#202126] border border-[#37383D] text-[11px] font-semibold text-[#E5E5E7]">
              <Shield className="w-3.5 h-3.5 text-[#FF3845]" />
              <span>Admin Panel</span>
              <span className="text-[#96989F] font-normal">{"//"} Pengurusan Sistem</span>
            </span>
          </div>
        </div>

        {/* Right: Quick Actions, Notification Bell, Help, Admin User Pill */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* External View Link to Main App */}
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            title="Lihat Laman Utama"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#96989F] hover:text-white hover:bg-[#202126] rounded-lg transition-colors border border-transparent hover:border-[#37383D]"
          >
            <span>Laman Utama</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          {/* Help Button */}
          <Link
            href="/admin/knowledge"
            title="Pusat Bantuan & Panduan"
            className="p-2 rounded-lg text-[#96989F] hover:text-white hover:bg-[#202126] transition-colors admin-focus-ring cursor-pointer"
          >
            <HelpCircle className="w-5 h-5" />
          </Link>

          {/* Notification Bell with Red Badge Dot */}
          <div ref={notifRef} className="relative">
            <button
              type="button"
              onClick={() => setNotificationOpen(!notificationOpen)}
              aria-label="Pemberitahuan Sistem"
              className="relative p-2 rounded-lg text-[#96989F] hover:text-white hover:bg-[#202126] transition-colors admin-focus-ring cursor-pointer"
            >
              <Bell className="w-5 h-5" />
              {pendingCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E10600] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FF3845]" />
                </span>
              )}
            </button>

            {/* Notification Dropdown Panel */}
            {notificationOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-[#17191E] border border-[#37383D] rounded-xl shadow-[0_12px_36px_rgba(0,0,0,0.85)] p-4 text-xs admin-panel-enter z-50">
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#27272A]">
                  <span className="font-bold text-white uppercase tracking-wider">
                    Pemberitahuan Sistem
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#E10600]/20 text-[#FF555A] font-bold text-[10px]">
                    {pendingCount} Tindakan
                  </span>
                </div>
                <div className="space-y-2.5">
                  <Link
                    href="/admin/clubs/applications"
                    onClick={() => setNotificationOpen(false)}
                    className="block p-2.5 rounded-lg bg-[#202126] hover:bg-[#282A32] border border-[#37383D] transition-colors"
                  >
                    <p className="font-semibold text-white">
                      12 Permohonan Kelab Baharu
                    </p>
                    <p className="text-[11px] text-[#96989F] mt-0.5">
                      Memerlukan semakan kelulusan & pengaktifan percubaan 30 hari.
                    </p>
                  </Link>
                  <Link
                    href="/admin/schedules"
                    onClick={() => setNotificationOpen(false)}
                    className="block p-2.5 rounded-lg bg-[#202126] hover:bg-[#282A32] border border-[#37383D] transition-colors"
                  >
                    <p className="font-semibold text-white">
                      Jadual Mingguan M06 Sedia Disahkan
                    </p>
                    <p className="text-[11px] text-[#96989F] mt-0.5">
                      Fasa Asas (Jan-Jun) beroperasi pada Mod Normal.
                    </p>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Admin User Avatar Pill with Dropdown */}
          <div ref={userMenuRef} className="relative">
            <button
              type="button"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-[#17191E] hover:bg-[#202126] border border-[#27272A] hover:border-[#37383D] transition-colors cursor-pointer admin-focus-ring"
            >
              {/* Avatar Icon */}
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#E10600] to-[#FF3845] flex items-center justify-center text-white font-bold text-xs shadow-md">
                AD
              </div>
              {/* Name & Role Text */}
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-bold text-white leading-tight">
                  Pentadbir Utama
                </span>
                <span className="text-[10px] text-[#FF555A] font-semibold tracking-wider uppercase">
                  Super Admin
                </span>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 text-[#96989F] hidden sm:block transition-transform duration-200 ${
                  userMenuOpen ? "rotate-180 text-white" : ""
                }`}
              />
            </button>

            {/* User Dropdown Menu */}
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-[#17191E] border border-[#37383D] rounded-xl shadow-[0_12px_36px_rgba(0,0,0,0.85)] p-2 text-xs admin-panel-enter z-50">
                <div className="px-3 py-2 border-b border-[#27272A] mb-1">
                  <p className="font-bold text-white">FighterX System Admin</p>
                  <p className="text-[10px] text-[#96989F] truncate">
                    admin@fighterx.com
                  </p>
                </div>

                <Link
                  href="/admin/settings"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[#C5C6CA] hover:text-white hover:bg-[#202126] transition-colors"
                >
                  <Settings className="w-4 h-4 text-[#96989F]" />
                  <span>Tetapan Sistem</span>
                </Link>

                <Link
                  href="/admin"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[#C5C6CA] hover:text-white hover:bg-[#202126] transition-colors"
                >
                  <User className="w-4 h-4 text-[#96989F]" />
                  <span>Profil Pentadbir</span>
                </Link>

                {onResetDemo && (
                  <button
                    type="button"
                    onClick={() => {
                      onResetDemo();
                      setUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[#FBBF24] hover:bg-[#F59E0B]/15 transition-colors cursor-pointer text-left"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset Data Demo</span>
                  </button>
                )}

                <div className="my-1 border-t border-[#27272A]" />

                <Link
                  href="/login"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[#F87171] hover:bg-[#EF4444]/15 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Keluar</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
