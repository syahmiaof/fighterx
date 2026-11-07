"use client";

import React, { useEffect, useCallback } from "react";
import { X } from "lucide-react";

interface CoachModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl";
}

export function CoachModal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "md",
}: CoachModalProps) {
  // ESC key listener
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const maxWidthStyles = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div
      className="coach-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "coach-modal-title" : undefined}
    >
      <div className={`coach-modal-container ${maxWidthStyles[maxWidth]} w-full`}>
        {title && (
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#45464b]/60 bg-[#1f2127]">
            <h3 id="coach-modal-title" className="text-base font-bold text-white tracking-wide">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-[#96989f] hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Tutup modal"
            >
              <X size={18} />
            </button>
          </div>
        )}
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
