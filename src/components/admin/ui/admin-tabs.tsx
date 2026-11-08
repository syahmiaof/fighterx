"use client";

import React, { useRef } from "react";

export interface TabItem {
  id: string;
  label: string;
  count?: number | string;
  icon?: React.ReactNode;
  badgeVariant?: "default" | "accent" | "warning";
}

export interface AdminTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export function AdminTabs({
  tabs,
  activeTab,
  onChange,
  className = "",
}: AdminTabsProps) {
  const tabListRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      const nextIndex = (index + 1) % tabs.length;
      onChange(tabs[nextIndex].id);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prevIndex = (index - 1 + tabs.length) % tabs.length;
      onChange(tabs[prevIndex].id);
    }
  };

  return (
    <div
      ref={tabListRef}
      role="tablist"
      aria-orientation="horizontal"
      className={`flex items-center space-x-1 border-b border-[#27272A] overflow-x-auto admin-scrollbar pb-px ${className}`}
    >
      {tabs.map((tab, idx) => {
        const isActive = tab.id === activeTab;

        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className={`group relative flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer select-none admin-focus-ring rounded-t-lg ${
              isActive
                ? "text-white"
                : "text-[#96989F] hover:text-[#E5E5E7] hover:bg-[#1A1C22]/60"
            }`}
          >
            {tab.icon && (
              <span
                className={`transition-colors ${
                  isActive ? "text-[#FF3845]" : "text-[#96989F] group-hover:text-white"
                }`}
              >
                {tab.icon}
              </span>
            )}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`px-2 py-0.5 text-xs rounded-full font-bold transition-colors ${
                  isActive
                    ? "bg-[#E10600] text-white shadow-[0_0_8px_rgba(225,6,0,0.5)]"
                    : tab.badgeVariant === "accent"
                    ? "bg-[#E10600]/20 text-[#FF555A] border border-[#FF3845]/30"
                    : tab.badgeVariant === "warning"
                    ? "bg-[#F59E0B]/20 text-[#FBBF24] border border-[#F59E0B]/30"
                    : "bg-[#202126] text-[#96989F] border border-[#37383D]"
                }`}
              >
                {tab.count}
              </span>
            )}

            {/* Active crimson indicator bar */}
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#FF3845] shadow-[0_0_10px_#E10600]" />
            )}
          </button>
        );
      })}
    </div>
  );
}
