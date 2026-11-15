"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Home,
  LogOut,
  Shield,
  User,
  RotateCcw,
  Building2,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { platformStore } from "@/lib/platform/platform-state";

export interface PortalHeaderProps {
  role: "ATHLETE" | "COACH" | "ADMIN";
  userName?: string;
  clubName?: string;
  avatarText?: string;
}

export function PortalHeader({
  role,
  userName,
  clubName = "Kelab Silat Harimau Berantai",
  avatarText,
}: PortalHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  // Defaults per role
  const defaultNames = {
    ATHLETE: "Alya Nabilah",
    COACH: "Cikgu Farid",
    ADMIN: "Pentadbir Utama",
  };

  const defaultInitials = {
    ATHLETE: "AN",
    COACH: "CF",
    ADMIN: "AD",
  };

  const rolePillStyles = {
    ATHLETE: "border-blue-500/40 bg-blue-950/40 text-blue-300",
    COACH: "border-amber-500/40 bg-amber-950/40 text-amber-300",
    ADMIN: "border-red-500/40 bg-red-950/40 text-red-300",
  };

  const roleLabels = {
    ATHLETE: "PORTAL ATLET",
    COACH: "PORTAL JURULATIH",
    ADMIN: "PORTAL PENTADBIR",
  };

  const displayName = userName || defaultNames[role];
  const displayAvatar = avatarText || defaultInitials[role];

  return (
    <header className="sticky top-0 z-40 h-16 w-full border-b border-white/[0.08] bg-[#08090b]/92 backdrop-blur-[20px] select-none">
      <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left: Brand Lockup & Role Pill */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href={role === "ATHLETE" ? "/athlete" : role === "COACH" ? "/coach" : "/admin"}
            className="flex items-center gap-2 group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#e10600] to-[#800000] flex items-center justify-center font-black text-white text-xs tracking-wider shadow-[0_0_12px_rgba(225,6,0,0.45)] border border-[#ff3845]/50 group-hover:scale-105 transition-transform">
              FX
            </div>
            <div className="flex flex-col">
              <span
                className="font-bold text-lg sm:text-xl leading-none tracking-tight text-white uppercase"
                style={{ fontFamily: "var(--font-athletic)", fontStyle: "italic" }}
              >
                FIGHTER<span className="text-[#f51c25]">X</span>
              </span>
              <span className="text-[8.5px] font-bold tracking-[0.18em] text-[#96989f] uppercase">
                {role === "ADMIN" ? "NATIONAL ADMIN" : "SILAT ATHLETE PLATFORM"}
              </span>
            </div>
          </Link>

          {/* Role Badge */}
          <span
            className={`hidden xs:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[10px] font-bold tracking-wider uppercase ${rolePillStyles[role]}`}
          >
            <Sparkles size={11} />
            {roleLabels[role]}
          </span>
        </div>

        {/* Right Navigation & Utility Cluster */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Direct Link to Public Homepage */}
          <Link
            href="/"
            title="Kembali ke Laman Utama Awam"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#c5c6ca] hover:text-white bg-white/[0.025] hover:bg-white/[0.06] border border-white/[0.08] hover:border-white/20 transition-all duration-200"
          >
            <Home size={14} className="text-[#ff3845]" />
            <span className="hidden sm:inline">Laman Utama</span>
          </Link>

          {/* User Profile Pill & Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-white/20 transition-all cursor-pointer"
              aria-label="Menu Pengguna"
            >
              {/* Circular Avatar */}
              <div className="w-7 h-7 rounded-full bg-[#1e2027] border border-white/20 flex items-center justify-center text-xs font-bold text-white shadow-inner">
                {displayAvatar}
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-bold text-white leading-tight">{displayName}</span>
                <span className="text-[10px] text-neutral-400 leading-tight truncate max-w-[140px]">
                  {clubName}
                </span>
              </div>
              <ChevronDown size={14} className="text-neutral-400" />
            </button>

            {/* Dropdown Menu */}
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl border border-white/10 bg-[#12141a]/95 backdrop-blur-xl p-2 text-xs shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-2 border-b border-white/[0.08] mb-1">
                  <p className="font-bold text-white text-sm">{displayName}</p>
                  <p className="text-[11px] text-[#ff3845] font-semibold">{roleLabels[role]}</p>
                  <p className="text-[10px] text-neutral-400 mt-0.5 flex items-center gap-1">
                    <Building2 size={11} /> {clubName}
                  </p>
                </div>

                {/* Role Switcher Shortcuts */}
                <div className="py-1">
                  <p className="px-3 py-1 text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                    Pintas Peranan (Demo)
                  </p>
                  <Link
                    href="/athlete"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-neutral-300 hover:text-white hover:bg-white/[0.05] transition-colors"
                  >
                    <User size={13} className="text-blue-400" />
                    <span>Portal Atlet</span>
                  </Link>
                  <Link
                    href="/coach"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-neutral-300 hover:text-white hover:bg-white/[0.05] transition-colors"
                  >
                    <Shield size={13} className="text-amber-400" />
                    <span>Portal Jurulatih</span>
                  </Link>
                  <Link
                    href="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-neutral-300 hover:text-white hover:bg-white/[0.05] transition-colors"
                  >
                    <Shield size={13} className="text-red-400" />
                    <span>Portal Admin</span>
                  </Link>
                </div>

                <div className="my-1 border-t border-white/[0.08]" />

                {/* Reset Demo Data Button */}
                <button
                  type="button"
                  onClick={() => {
                    platformStore.resetToDefault();
                    setMenuOpen(false);
                    alert("Data demo berjaya di-reset kepada keadaan asal.");
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-amber-400 hover:bg-amber-950/30 transition-colors text-left"
                >
                  <RotateCcw size={13} />
                  <span>Reset Data Demo</span>
                </button>

                {/* Logout to Login Page */}
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-red-400 hover:bg-red-950/30 transition-colors"
                >
                  <LogOut size={13} />
                  <span>Tukar Peranan / Log Keluar</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
