"use client";

import React from "react";
import type { AthleteDiscipline, MultiDiscipline } from "@/lib/admin/types";
import { Sparkles, Swords, Layers } from "lucide-react";

interface DisciplineBadgeProps {
  discipline: AthleteDiscipline | MultiDiscipline | string;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  className?: string;
}

export function DisciplineBadge({
  discipline,
  size = "sm",
  showIcon = true,
  className = "",
}: DisciplineBadgeProps) {
  const isSeni = discipline === "Silat Seni";
  const isOlahraga = discipline === "Silat Olahraga";
  const isBoth = discipline === "Both";

  const sizeClasses = {
    sm: "text-[11px] px-2 py-0.5 gap-1.5 font-medium",
    md: "text-xs px-2.5 py-1 gap-1.5 font-semibold",
    lg: "text-sm px-3.5 py-1.5 gap-2 font-bold",
  };

  if (isSeni) {
    return (
      <span
        title="Disiplin Tunggal: Silat Seni (Jurus Tunggal, Ganda, Regu)"
        className={`inline-flex items-center rounded-full border border-[#818CF8]/40 bg-[#6366F1]/15 text-[#A5B4FC] select-none ${sizeClasses[size]} ${className}`}
      >
        {showIcon && <Sparkles className="w-3 h-3 text-[#A5B4FC] flex-shrink-0" />}
        <span>Silat Seni</span>
      </span>
    );
  }

  if (isOlahraga) {
    return (
      <span
        title="Disiplin Tunggal: Silat Olahraga (Tanding Kelas A-J)"
        className={`inline-flex items-center rounded-full border border-[#FF3845]/40 bg-[#E10600]/15 text-[#FF555A] shadow-[0_0_10px_rgba(225,6,0,0.25)] select-none ${sizeClasses[size]} ${className}`}
      >
        {showIcon && <Swords className="w-3 h-3 text-[#FF555A] flex-shrink-0" />}
        <span>Silat Olahraga</span>
      </span>
    );
  }

  if (isBoth) {
    return (
      <span
        title="Merangkumi Kedua-dua Disiplin (Seni & Olahraga)"
        className={`inline-flex items-center rounded-full border border-[#38BDF8]/40 bg-[#0284C7]/15 text-[#38BDF8] select-none ${sizeClasses[size]} ${className}`}
      >
        {showIcon && <Layers className="w-3 h-3 text-[#38BDF8] flex-shrink-0" />}
        <span>Seni & Olahraga</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center rounded-full border border-[#45464B] bg-[#202126] text-[#C5C6CA] select-none ${sizeClasses[size]} ${className}`}
    >
      <span>{discipline}</span>
    </span>
  );
}
