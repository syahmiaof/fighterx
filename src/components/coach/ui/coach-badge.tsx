import React from "react";

export type CoachBadgeVariant = "red" | "green" | "yellow" | "gray" | "blue";
export type CoachBadgeSize = "sm" | "md";

interface CoachBadgeProps {
  children: React.ReactNode;
  variant?: CoachBadgeVariant;
  size?: CoachBadgeSize;
  className?: string;
}

export function CoachBadge({
  children,
  variant = "gray",
  size = "md",
  className = "",
}: CoachBadgeProps) {
  const variantStyles: Record<CoachBadgeVariant, string> = {
    red: "bg-[#e10600]/20 text-[#ff555a] border-[#e10600]/50",
    green: "bg-[#22c55e]/15 text-[#4ade80] border-[#22c55e]/40",
    yellow: "bg-[#f59e0b]/15 text-[#fbbf24] border-[#f59e0b]/40",
    gray: "bg-[#96989f]/15 text-[#c5c6ca] border-[#45464b]/60",
    blue: "bg-[#3b82f6]/15 text-[#60a5fa] border-[#3b82f6]/40",
  };

  const sizeStyles: Record<CoachBadgeSize, string> = {
    sm: "text-[10px] px-1.5 py-0.5",
    md: "text-xs px-2.5 py-0.5",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full border leading-tight ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
}
