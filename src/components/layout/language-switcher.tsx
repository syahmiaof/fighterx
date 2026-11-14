"use client";

import React from "react";
import { useLanguage } from "@/lib/i18n";
import { Globe } from "lucide-react";

interface LanguageSwitcherProps {
  className?: string;
  showIcon?: boolean;
}

export function LanguageSwitcher({ className = "", showIcon = true }: LanguageSwitcherProps) {
  const { locale, setLocale } = useLanguage();

  return (
    <div
      className={`header-lang-switcher ${className}`}
      role="group"
      aria-label="Language selection"
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "2px",
        backgroundColor: "rgba(18, 19, 23, 0.85)",
        border: "1px solid rgba(255, 255, 255, 0.12)",
        borderRadius: "9999px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.4)",
        gap: "2px",
        flexShrink: 0,
      }}
    >
      {showIcon && (
        <span
          style={{
            display: "flex",
            alignItems: "center",
            paddingLeft: "7px",
            paddingRight: "2px",
            color: "#8b8c94",
          }}
          aria-hidden="true"
        >
          <Globe size={13} strokeWidth={2} />
        </span>
      )}
      <button
        type="button"
        onClick={() => setLocale("en")}
        aria-pressed={locale === "en"}
        aria-label="Switch to English"
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "4px 9px",
          fontSize: "11px",
          fontWeight: locale === "en" ? 700 : 500,
          letterSpacing: "0.03em",
          color: locale === "en" ? "#ffffff" : "#a1a1aa",
          backgroundColor:
            locale === "en" ? "#e10600" : "transparent",
          backgroundImage:
            locale === "en"
              ? "linear-gradient(135deg, #e10600 0%, #b30000 100%)"
              : "none",
          boxShadow:
            locale === "en" ? "0 1px 6px rgba(225, 6, 0, 0.45)" : "none",
          borderRadius: "9999px",
          border: "none",
          cursor: "pointer",
          transition: "all 0.15s ease",
          lineHeight: 1,
        }}
      >
        ENG
      </button>
      <button
        type="button"
        onClick={() => setLocale("bm")}
        aria-pressed={locale === "bm"}
        aria-label="Tukar ke Bahasa Melayu"
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "4px 9px",
          fontSize: "11px",
          fontWeight: locale === "bm" ? 700 : 500,
          letterSpacing: "0.03em",
          color: locale === "bm" ? "#ffffff" : "#a1a1aa",
          backgroundColor:
            locale === "bm" ? "#e10600" : "transparent",
          backgroundImage:
            locale === "bm"
              ? "linear-gradient(135deg, #e10600 0%, #b30000 100%)"
              : "none",
          boxShadow:
            locale === "bm" ? "0 1px 6px rgba(225, 6, 0, 0.45)" : "none",
          borderRadius: "9999px",
          border: "none",
          cursor: "pointer",
          transition: "all 0.15s ease",
          lineHeight: 1,
        }}
      >
        BM
      </button>
    </div>
  );
}
