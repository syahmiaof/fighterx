"use client";

import React, { forwardRef } from "react";
import { Loader2 } from "lucide-react";

export type AdminButtonVariant =
  | "primary"
  | "secondary"
  | "danger"
  | "ghost"
  | "outline"
  | "success";

export type AdminButtonSize = "xs" | "sm" | "md" | "lg";

export interface AdminButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: AdminButtonVariant;
  size?: AdminButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<AdminButtonVariant, string> = {
  primary:
    "text-white bg-gradient-to-r from-[#E10600] to-[#B30000] border border-[#FF555A] shadow-[0_4px_16px_rgba(225,6,0,0.35)] hover:from-[#EF272B] hover:to-[#C70000] hover:shadow-[0_6px_22px_rgba(225,6,0,0.5)] active:from-[#B30000] active:to-[#900000]",
  secondary:
    "text-[#E5E5E7] bg-[#17191E] border border-[#37383D] hover:bg-[#202126] hover:border-[#E5E5E7]/40 hover:text-white active:bg-[#121316]",
  danger:
    "text-[#F87171] bg-[#EF4444]/15 border border-[#EF4444]/40 hover:bg-[#EF4444]/25 hover:border-[#EF4444]/70 hover:text-white active:bg-[#EF4444]/35",
  ghost:
    "text-[#C5C6CA] bg-transparent border border-transparent hover:bg-[#202126] hover:text-white active:bg-[#17191E]",
  outline:
    "text-white bg-transparent border border-[#45464B] hover:bg-[#17191E] hover:border-[#E5E5E7]/60 active:bg-[#202126]",
  success:
    "text-[#4ADE80] bg-[#22C55E]/15 border border-[#22C55E]/40 hover:bg-[#22C55E]/25 hover:border-[#22C55E]/70 hover:text-white active:bg-[#22C55E]/35",
};

const sizeStyles: Record<AdminButtonSize, string> = {
  xs: "h-7 px-2.5 text-xs gap-1.5 rounded",
  sm: "h-8 px-3 text-xs gap-2 rounded-md font-medium",
  md: "h-10 px-4 text-sm gap-2 rounded-lg font-semibold",
  lg: "h-12 px-6 text-base gap-2.5 rounded-lg font-bold tracking-wide",
};

export const AdminButton = forwardRef<HTMLButtonElement, AdminButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      disabled = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      children,
      className = "",
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        aria-busy={loading}
        className={`inline-flex items-center justify-center select-none transition-all duration-150 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 disabled:pointer-events-none admin-focus-ring ${
          variantStyles[variant]
        } ${sizeStyles[size]} ${fullWidth ? "w-full" : ""} ${className}`}
        {...props}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current" />
        ) : (
          leftIcon && <span className="flex-shrink-0 inline-flex">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!loading && rightIcon && (
          <span className="flex-shrink-0 inline-flex">{rightIcon}</span>
        )}
      </button>
    );
  }
);

AdminButton.displayName = "AdminButton";
