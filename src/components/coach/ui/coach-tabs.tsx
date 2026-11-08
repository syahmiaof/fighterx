import React from "react";

export interface CoachTabItem {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

interface CoachTabsProps {
  tabs: CoachTabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export function CoachTabs({
  tabs,
  activeTab,
  onChange,
  className = "",
}: CoachTabsProps) {
  return (
    <div
      className={`flex items-center gap-1.5 p-1 bg-[#121316] border border-[#45464b]/60 rounded-lg overflow-x-auto scrollbar-none ${className}`}
      role="tablist"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition-all duration-180 ${
              isActive
                ? "bg-[#25272e] text-white shadow-sm border border-[#ff3845]/40"
                : "text-[#96989f] hover:text-[#e5e5e7] hover:bg-white/5 border border-transparent"
            }`}
          >
            {tab.icon && <span className="flex-shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {typeof tab.count === "number" && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive
                    ? "bg-[#e10600] text-white"
                    : "bg-[#202126] text-[#c5c6ca]"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
