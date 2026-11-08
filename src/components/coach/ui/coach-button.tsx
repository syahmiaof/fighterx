import React from "react";

export type CoachButtonVariant = "primary" | "success" | "outline" | "ghost" | "danger";
export type CoachButtonSize = "sm" | "md" | "lg";

interface CoachButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: CoachButtonVariant;
  size?: CoachButtonSize;
  icon?: React.ReactNode;
  className?: string;
}

export function CoachButton({
  children,
  variant = "outline",
  size = "md",
  icon,
  className = "",
  disabled = false,
  ...props
}: CoachButtonProps) {
  const variantStyles: Record<CoachButtonVariant, string> = {
    primary:
      "bg-gradient-to-r from-[#ed171b] to-[#bb080c] hover:from-[#f02226] hover:to-[#ce090e] text-white border border-[#ff555a] shadow-[0_4px_14px_rgba(225,6,0,0.35)]",
    success:
      "bg-[#22c55e]/15 hover:bg-[#16a34a] text-[#4ade80] hover:text-white border border-[#22c55e]/50",
    outline:
      "bg-[#202126]/70 hover:bg-[#2c2e35] text-[#e5e5e7] hover:text-white border border-[#45464b]",
    ghost:
      "bg-transparent hover:bg-white/5 text-[#c5c6ca] hover:text-white border border-transparent",
    danger:
      "bg-[#e10600]/20 hover:bg-[#e10600] text-[#ff555a] hover:text-white border border-[#e10600]/60",
  };

  const sizeStyles: Record<CoachButtonSize, string> = {
    sm: "text-xs px-2.5 py-1 min-h-[30px] rounded",
    md: "text-xs px-3.5 py-1.5 min-h-[36px] rounded-md font-semibold",
    lg: "text-sm px-5 py-2.5 min-h-[44px] rounded-lg font-bold",
  };

  const disabledStyles = disabled
    ? "opacity-50 cursor-not-allowed pointer-events-none"
    : "active:scale-[0.98] transition-all duration-180";

  return (
    <button
      className={`inline-flex items-center justify-center gap-1.5 ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
}
