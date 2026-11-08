"use client";

import React, { forwardRef } from "react";

export interface AdminCardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: "none" | "red" | "subtle";
  variant?: "default" | "elevated" | "interactive";
}

export const AdminCard = forwardRef<HTMLDivElement, AdminCardProps>(
  (
    {
      glow = "none",
      variant = "default",
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const glowClass =
      glow === "red"
        ? "shadow-[0_0_24px_rgba(225,6,0,0.25)] border-[#FF3845]/40"
        : glow === "subtle"
        ? "shadow-[0_4px_20px_rgba(0,0,0,0.5)] border-[#37383D]"
        : "border-[#27272A]";

    const variantClass =
      variant === "elevated"
        ? "bg-[#202126]"
        : variant === "interactive"
        ? "bg-[#17191E] hover:bg-[#1D1F25] hover:border-[#45464B] transition-all duration-200 cursor-pointer hover:-translate-y-0.5"
        : "bg-[#17191E]";

    return (
      <div
        ref={ref}
        className={`rounded-xl border ${variantClass} ${glowClass} p-5 text-[#E5E5E7] ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);
AdminCard.displayName = "AdminCard";

export function AdminCardHeader({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`flex flex-col space-y-1.5 pb-4 border-b border-[#27272A] mb-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function AdminCardTitle({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={`text-lg font-bold tracking-tight text-white flex items-center justify-between gap-2 ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
}

export function AdminCardDescription({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={`text-xs text-[#96989F] leading-relaxed ${className}`} {...props}>
      {children}
    </p>
  );
}

export function AdminCardContent({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`space-y-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function AdminCardFooter({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`flex items-center justify-between pt-4 mt-4 border-t border-[#27272A] text-xs text-[#96989F] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
