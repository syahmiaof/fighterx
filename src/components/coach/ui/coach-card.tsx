import React from "react";

interface CoachCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  glow?: boolean;
  as?: "div" | "article" | "section";
}

export function CoachCard({
  children,
  className = "",
  hoverable = false,
  glow = false,
  as: Component = "div",
  ...props
}: CoachCardProps) {
  const glowClass = glow
    ? "border-[#ff3845]/70 shadow-[0_0_18px_rgba(225,6,0,0.22)]"
    : "border-[#45464b]/60";
  const hoverClass = hoverable
    ? "hover:border-[#ff3845]/60 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)] transition-all duration-200"
    : "";

  return (
    <Component
      className={`relative rounded-xl bg-[#17191e]/85 backdrop-blur-md border ${glowClass} ${hoverClass} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
