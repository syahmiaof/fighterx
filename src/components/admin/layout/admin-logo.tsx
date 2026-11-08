"use client";

import React from "react";
import Link from "next/link";

export interface AdminLogoProps {
  compact?: boolean;
  showSubtitle?: boolean;
  href?: string;
  className?: string;
}

export function AdminLogo({
  compact = false,
  showSubtitle = true,
  href = "/admin",
  className = "",
}: AdminLogoProps) {
  const content = (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Dynamic Geometric Vector Mark (Metallic Silver F + Sharp Crimson X) */}
      <svg
        className="w-8 h-8 flex-shrink-0"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="fxSilverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#E5E5E7" />
            <stop offset="100%" stopColor="#96989F" />
          </linearGradient>
          <linearGradient id="fxRedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF3845" />
            <stop offset="100%" stopColor="#E10600" />
          </linearGradient>
          <filter id="fxRedGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#E10600" floodOpacity="0.7" />
          </filter>
        </defs>

        {/* Slanted Metallic Silver 'F' */}
        <path
          d="M6 7H24L20.5 14H14.5L13 17H21L17.5 24H10.5L6.5 32H2L10 16L14 8H6V7Z"
          fill="url(#fxSilverGrad)"
        />

        {/* Sharp Crimson Red 'X' Primary Stroke */}
        <path
          d="M18 7H24L36 31H30L18 7Z"
          fill="url(#fxRedGrad)"
          filter="url(#fxRedGlow)"
        />

        {/* Sharp Crimson Red 'X' Secondary Slash */}
        <path
          d="M34 7H40L26 21L23 17L34 7Z"
          fill="#FF3845"
          filter="url(#fxRedGlow)"
        />
      </svg>

      {/* Typography: "FIGHTER" in white + "X" in crimson red */}
      {!compact && (
        <div className="flex flex-col">
          <span
            className="font-athletic font-bold text-2xl leading-none tracking-wider text-white"
            style={{ fontFamily: "var(--font-athletic), Teko, sans-serif" }}
          >
            FIGHTER<span className="text-[#FF3845]">X</span>
          </span>
          {showSubtitle && (
            <span className="text-[9px] font-bold tracking-[0.18em] text-[#C5C6CA] uppercase mt-0.5">
              Admin Panel
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="group focus:outline-none">
        {content}
      </Link>
    );
  }

  return content;
}
