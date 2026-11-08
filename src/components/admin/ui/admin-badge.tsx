"use client";

import React from "react";

export type AdminBadgeVariant =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral"
  | "accent";

export interface AdminBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: AdminBadgeVariant;
  size?: "sm" | "md";
  dot?: boolean;
  pulseDot?: boolean;
}

const variantStyles: Record<AdminBadgeVariant, { container: string; dot: string }> = {
  success: {
    container:
      "text-[#4ADE80] bg-[#22C55E]/15 border-[#22C55E]/30",
    dot: "bg-[#4ADE80]",
  },
  warning: {
    container:
      "text-[#FBBF24] bg-[#F59E0B]/15 border-[#F59E0B]/35",
    dot: "bg-[#FBBF24]",
  },
  danger: {
    container:
      "text-[#F87171] bg-[#EF4444]/15 border-[#EF4444]/35",
    dot: "bg-[#F87171]",
  },
  info: {
    container:
      "text-[#60A5FA] bg-[#38BDF8]/15 border-[#38BDF8]/35",
    dot: "bg-[#60A5FA]",
  },
  neutral: {
    container:
      "text-[#C5C6CA] bg-[#94A3B8]/15 border-[#94A3B8]/25",
    dot: "bg-[#94A3B8]",
  },
  accent: {
    container:
      "text-[#FF555A] bg-[#E10600]/20 border-[#FF3845]/40 shadow-[0_0_12px_rgba(225,6,0,0.25)]",
    dot: "bg-[#FF3845]",
  },
};

const sizeStyles = {
  sm: "text-[11px] px-2 py-0.5 gap-1.5",
  md: "text-xs px-2.5 py-1 gap-2",
};

export function AdminBadge({
  variant = "neutral",
  size = "sm",
  dot = false,
  pulseDot = false,
  className = "",
  children,
  ...props
}: AdminBadgeProps) {
  const styles = variantStyles[variant] || variantStyles.neutral;

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border leading-none select-none ${
        styles.container
      } ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {dot && (
        <span className="relative flex h-1.5 w-1.5">
          {pulseDot && (
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${styles.dot}`}
            />
          )}
          <span
            className={`relative inline-flex rounded-full h-1.5 w-1.5 ${styles.dot}`}
          />
        </span>
      )}
      <span>{children}</span>
    </span>
  );
}
