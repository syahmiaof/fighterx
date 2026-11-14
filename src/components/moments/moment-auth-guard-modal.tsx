"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { X, ShieldAlert, ArrowRight, Zap, UserCheck } from "lucide-react";
import type { AppRole } from "@/types/platform";
import { useLanguage } from "@/lib/i18n";

export interface MomentAuthGuardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBypassAsAthlete?: () => void;
}

export function MomentAuthGuardModal({
  isOpen,
  onClose,
  onBypassAsAthlete,
}: MomentAuthGuardModalProps) {
  const { dict, locale } = useLanguage();
  const am = dict.moments.authModal;
  const [currentRole, setCurrentRole] = useState<AppRole | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      try {
        const stored = window.sessionStorage.getItem("fighterx_session_role") as AppRole | null;
        if (stored && ["ADMIN", "COACH", "ATHLETE"].includes(stored)) {
          setCurrentRole(stored);
        } else {
          setCurrentRole(null);
        }
      } catch {
        setCurrentRole(null);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const isOtherRole = currentRole === "COACH" || currentRole === "ADMIN";

  const handleBypass = () => {
    try {
      window.sessionStorage.setItem("fighterx_session_role", "ATHLETE");
      setCurrentRole("ATHLETE");
    } catch {
      // ignore
    }
    if (onBypassAsAthlete) {
      onBypassAsAthlete();
    } else {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-lg rounded-3xl bg-[#0c0d12]/95 border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.12)] p-6 sm:p-8 text-white backdrop-blur-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 border border-white/10 text-[#C5C6CA] hover:text-white hover:bg-[#E10600] transition-colors flex items-center justify-center cursor-pointer"
          aria-label={locale === "bm" ? "Tutup tetingkap" : "Close modal"}
        >
          <X size={16} />
        </button>

        {/* Shield Icon Badge */}
        <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-[#ff3845] mx-auto mb-4 shadow-[0_0_20px_rgba(225,6,0,0.25)]">
          <ShieldAlert size={28} />
        </div>

        {/* Overline & Heading */}
        <div className="text-center mb-5">
          <div className="text-[10px] font-mono font-bold text-[#ff3845] uppercase tracking-widest mb-1">
            {am?.overline || (locale === "bm" ? "AKSES KHUSUS ATLET SILAT" : "ATHLETE PORTAL ACCESS REQUIRED")}
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-athletic uppercase tracking-wide text-white">
            {isOtherRole
              ? (locale === "bm" ? "Peranan Semasa: " : "Current Role: ") + currentRole
              : am?.title || (locale === "bm" ? "Pengesahan Akaun Atlet Diperlukan" : "Athlete Account Verification Needed")}
          </h3>
          <p className="text-xs sm:text-sm text-[#c5c6ca] mt-2 leading-relaxed max-w-sm mx-auto">
            {isOtherRole
              ? (locale === "bm"
                  ? `Anda sedang log masuk sebagai ${currentRole}. Galeri Moment dikhaskan untuk atlet/pesilat berkongsi detik latihan gelanggang. Anda boleh menukar peranan kepada Atlet untuk menerbitkan foto.`
                  : `You are currently logged in as ${currentRole}. The Moments gallery is reserved for athletes to share training sessions. You can switch role to Athlete to post photos.`)
              : am?.description || (locale === "bm"
                  ? "Galeri Moment merupakan ruang eksklusif untuk pesilat Malaysia berkongsi dedikasi dan keringat latihan gelanggang. Sila log masuk ke akaun atlet anda untuk menerbitkan foto."
                  : "The Moments gallery is an exclusive space for silat athletes to share training dedication. Please login to your athlete profile to post photos.")}
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-3.5 mb-6 text-xs text-[#96989f] space-y-2">
          <div className="flex items-center gap-2">
            <UserCheck size={14} className="text-[#ff3845] shrink-0" />
            <span>
              {locale === "bm"
                ? "Paparan suapan & butang Suka (Like) kekal dibuka kepada semua pelawat."
                : "Feed viewing and Cheering/Like remain open to all visitors."}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-amber-400 shrink-0" />
            <span>
              {locale === "bm"
                ? "Muat naik foto latihan terhad kepada akaun atlet bagi memelihara integriti suapan sukan."
                : "Photo uploads are restricted to athlete accounts to protect sports feed integrity."}
            </span>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="space-y-3">
          {/* Athlete Login Link */}
          <Link
            href="/login/athlete?returnTo=/moments"
            onClick={onClose}
            className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#E10600] to-[#b30500] hover:from-[#ff1a14] hover:to-[#E10600] shadow-[0_4px_16px_rgba(225,6,0,0.4)] transition-all cursor-pointer text-center"
          >
            <span>{am?.loginButton || (locale === "bm" ? "Log Masuk Akaun Atlet" : "Login to Athlete Account")}</span>
            <ArrowRight size={14} />
          </Link>

          {/* Bypass Button for Demo Testing */}
          <button
            type="button"
            onClick={handleBypass}
            className="inline-flex items-center justify-center gap-2 w-full px-5 py-2.5 rounded-xl text-xs font-bold text-[#FF3845] bg-red-950/40 border border-[#FF3845]/40 hover:bg-red-900/50 hover:border-[#FF3845] transition-all cursor-pointer"
          >
            <Zap size={14} />
            <span>{am?.demoButton || (locale === "bm" ? "Bypass Masuk Sebagai Atlet (Mod Demo)" : "Continue as Athlete (Demo)")}</span>
          </button>

          {/* Dismiss Button */}
          <button
            type="button"
            onClick={onClose}
            className="w-full text-center text-xs text-[#96989F] hover:text-white transition-colors cursor-pointer pt-2"
          >
            {locale === "bm" ? "Batal & Teruskan Melayari" : "Cancel & Keep Browsing"}
          </button>
        </div>
      </div>
    </div>
  );
}
