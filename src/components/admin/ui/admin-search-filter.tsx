"use client";

import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";

export interface FilterChip {
  id: string;
  label: string;
  count?: number;
}

export interface AdminSearchFilterProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  debounceMs?: number;
  chips?: FilterChip[];
  activeChip?: string;
  onChipChange?: (chipId: string) => void;
  children?: React.ReactNode;
  className?: string;
}

export function AdminSearchFilter({
  placeholder = "Cari mengikut nama, ID, kelab...",
  onSearch,
  debounceMs = 250,
  chips,
  activeChip,
  onChipChange,
  children,
  className = "",
}: AdminSearchFilterProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(query);
    }, debounceMs);

    return () => {
      clearTimeout(handler);
    };
  }, [query, debounceMs, onSearch]);

  const handleClear = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <div
      className={`flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-3.5 bg-[#17191E] border border-[#27272A] rounded-xl shadow-md ${className}`}
    >
      {/* Search Input Field */}
      <div className="relative flex-1 min-w-[240px]">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#96989F]" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full h-10 pl-10 pr-9 bg-[#202126] border border-[#37383D] rounded-lg text-sm text-[#E5E5E7] placeholder-[#96989F] transition-colors focus:border-[#FF3845] focus:outline-none focus:ring-1 focus:ring-[#FF3845]"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Kosongkan carian"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded text-[#96989F] hover:text-white hover:bg-[#37383D] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter Chips / Category Pills */}
      {chips && chips.length > 0 && onChipChange && (
        <div className="flex items-center gap-1.5 overflow-x-auto admin-scrollbar py-0.5">
          {chips.map((chip) => {
            const isActive = chip.id === activeChip;
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => onChipChange(chip.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer border ${
                  isActive
                    ? "bg-[#E10600] text-white border-[#FF3845] shadow-[0_0_10px_rgba(225,6,0,0.4)]"
                    : "bg-[#202126] text-[#C5C6CA] border-[#37383D] hover:bg-[#2A2B32] hover:text-white"
                }`}
              >
                <span>{chip.label}</span>
                {chip.count !== undefined && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isActive
                        ? "bg-black/30 text-white"
                        : "bg-[#17191E] text-[#96989F]"
                    }`}
                  >
                    {chip.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Extra Action/Filter Slot */}
      {children && (
        <div className="flex items-center gap-2 flex-shrink-0">{children}</div>
      )}
    </div>
  );
}
