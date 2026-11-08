"use client";

import React, { useEffect, useCallback } from "react";
import { X } from "lucide-react";

export interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "4xl";
  closeOnBackdrop?: boolean;
}

const maxWidthMap = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "4xl": "max-w-4xl",
};

export function AdminModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth = "lg",
  closeOnBackdrop = true,
}: AdminModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#08090B]/85 backdrop-blur-md transition-opacity duration-200"
        onClick={() => closeOnBackdrop && onClose()}
        aria-hidden="true"
      />

      {/* Modal Dialog Content */}
      <div
        className={`relative z-10 w-full ${maxWidthMap[maxWidth]} bg-[#17191E] border border-[#37383D] rounded-xl shadow-[0_16px_50px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-200 admin-panel-enter my-auto`}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-[#27272A] bg-[#1A1C22]">
          <div className="space-y-1 pr-6">
            <h2 className="text-lg font-bold text-white tracking-wide">
              {title}
            </h2>
            {description && (
              <p className="text-xs text-[#96989F] leading-relaxed">
                {description}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup dialog"
            className="flex-shrink-0 p-1.5 rounded-lg text-[#96989F] hover:text-white hover:bg-[#202126] transition-colors admin-focus-ring cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 max-h-[calc(85vh-130px)] overflow-y-auto admin-scrollbar text-[#E5E5E7] text-sm leading-relaxed">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex flex-wrap items-center justify-end gap-3 px-6 py-4 bg-[#141519] border-t border-[#27272A]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
