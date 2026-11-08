"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Check, Search, Shield, Globe, Award, Sparkles } from "lucide-react";
import {
  SILAT_AFFILIATIONS,
  AFFILIATION_ID_ALIASES,
  type AssociationCategory,
  type SilatAffiliationOption,
} from "@/lib/club-registration/affiliations-data";

interface AssociationSelectorProps {
  selectedId: string;
  onSelect: (id: string) => void;
  error?: string;
}

type FilterCategory = "ALL" | AssociationCategory | "INDEPENDENT";

const CATEGORY_TABS: { id: FilterCategory; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { id: "ALL", label: "Semua (27)", icon: Sparkles },
  { id: "BADAN_INDUK", label: "Badan Induk", icon: Award },
  { id: "PENGASAS_TERAS", label: "Pengasas Teras", icon: Shield },
  { id: "PERGURUAN_UTAMA", label: "Perguruan Utama", icon: Shield },
  { id: "ANTARABANGSA", label: "Antarabangsa", icon: Globe },
  { id: "INDEPENDENT", label: "Kelab Bebas", icon: Sparkles },
];

export function AssociationSelector({
  selectedId,
  onSelect,
  error,
}: AssociationSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<FilterCategory>("ALL");

  const filteredAffiliations = useMemo(() => {
    return SILAT_AFFILIATIONS.filter((item) => {
      // Category filter
      if (activeCategory !== "ALL" && item.category !== activeCategory) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesShort = item.shortName.toLowerCase().includes(query);
        const matchesState = (item.state || "").toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        return matchesName || matchesShort || matchesState || matchesDesc;
      }
      return true;
    });
  }, [activeCategory, searchQuery]);

  const selectedAffiliation = useMemo(() => {
    return (
      SILAT_AFFILIATIONS.find((a) => a.id === selectedId) ||
      (AFFILIATION_ID_ALIASES[selectedId]
        ? SILAT_AFFILIATIONS.find((a) => a.id === AFFILIATION_ID_ALIASES[selectedId])
        : undefined) ||
      SILAT_AFFILIATIONS.find((a) => a.aliases && a.aliases.includes(selectedId))
    );
  }, [selectedId]);

  return (
    <div className="association-selector-wrap space-y-4">
      {/* Selected Affiliation Quick Banner */}
      {selectedAffiliation && (
        <div className="flex items-center gap-3.5 p-3 rounded-lg border border-red-500/40 bg-red-950/20 text-white">
          <div className="relative w-12 h-12 flex-none rounded bg-[#0b0c0f] border border-[#3e3f44] flex items-center justify-center p-1 overflow-hidden">
            <Image
              src={selectedAffiliation.logoUrl}
              alt={selectedAffiliation.shortName}
              width={44}
              height={44}
              className="object-contain max-h-full max-w-full"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
                Gabungan Dipilih
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-red-600/30 text-red-200">
                <Check size={11} className="mr-1" /> Terpilih
              </span>
            </div>
            <p className="text-sm font-semibold truncate text-white">
              {selectedAffiliation.name}
            </p>
            <p className="text-xs text-neutral-400 truncate">
              {selectedAffiliation.state || selectedAffiliation.country}
            </p>
          </div>
        </div>
      )}

      {/* Search & Filter Controls */}
      <div className="space-y-3">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari persatuan mengikut nama, negeri atau kata kunci..."
            className="w-full min-h-[44px] pl-10 pr-4 rounded-md border border-[#45464b] bg-[#0b0c0f] text-sm text-white placeholder-neutral-500 focus:border-red-500 focus:outline-none transition-colors"
            aria-label="Cari persatuan atau perguruan silat"
          />
        </div>

        {/* Category Pill Tabs */}
        <div
          className="flex flex-wrap gap-1.5 pb-1"
          role="tablist"
          aria-label="Tapis kategori persatuan"
        >
          {CATEGORY_TABS.map((tab) => {
            const isActive = activeCategory === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveCategory(tab.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-red-600 text-white shadow-sm shadow-red-900/50"
                    : "bg-[#17191e] border border-[#3e3f44] text-neutral-300 hover:text-white hover:bg-[#202126]"
                }`}
              >
                <Icon size={12} aria-hidden="true" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Affiliation Cards Grid */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar"
        role="radiogroup"
        aria-label="Senarai persatuan silat"
      >
        {filteredAffiliations.map((item: SilatAffiliationOption) => {
          const isSelected =
            selectedId === item.id ||
            AFFILIATION_ID_ALIASES[selectedId] === item.id ||
            Boolean(item.aliases && item.aliases.includes(selectedId));
          return (
            <div
              key={item.id}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              onClick={() => onSelect(item.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect(item.id);
                }
              }}
              className={`group relative flex items-start gap-3 p-3 rounded-lg border text-left cursor-pointer transition-all ${
                isSelected
                  ? "border-red-500 bg-red-950/20 shadow-md shadow-red-950/40 ring-1 ring-red-500"
                  : "border-[#3e3f44] bg-[#121316] hover:border-neutral-500 hover:bg-[#1a1c22]"
              }`}
            >
              <div className="relative w-11 h-11 flex-none rounded bg-[#0b0c0f] border border-[#303136] flex items-center justify-center p-1 overflow-hidden group-hover:border-neutral-500 transition-colors">
                <Image
                  src={item.logoUrl}
                  alt={item.shortName}
                  width={38}
                  height={38}
                  className="object-contain max-h-full max-w-full"
                />
              </div>

              <div className="flex-1 min-w-0 pr-5">
                <p
                  className={`text-xs font-bold leading-tight truncate transition-colors ${
                    isSelected ? "text-red-300" : "text-white group-hover:text-red-200"
                  }`}
                >
                  {item.shortName}
                </p>
                <p className="text-[11px] text-neutral-400 line-clamp-1 mt-0.5">
                  {item.name}
                </p>
                <div className="mt-1 flex items-center gap-1.5 text-[10px] text-neutral-400">
                  <span className="truncate">{item.state || item.country}</span>
                </div>
              </div>

              <div
                className={`absolute top-2.5 right-2.5 w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                  isSelected
                    ? "border-red-500 bg-red-600 text-white"
                    : "border-neutral-600 bg-transparent text-transparent group-hover:border-neutral-400"
                }`}
                aria-hidden="true"
              >
                {isSelected && <Check size={10} strokeWidth={3} />}
              </div>
            </div>
          );
        })}
      </div>

      {filteredAffiliations.length === 0 && (
        <div className="text-center py-8 px-4 rounded-lg border border-dashed border-[#45464b] bg-[#0e0f13]">
          <p className="text-sm text-neutral-300 font-medium">
            Tiada persatuan dijumpai untuk carian &ldquo;{searchQuery}&rdquo;.
          </p>
          <p className="text-xs text-neutral-400 mt-1">
            Anda boleh memilih pilihan &ldquo;Kelab / Perguruan Bebas&rdquo; jika perguruan anda tiada dalam senarai.
          </p>
          <button
            type="button"
            onClick={() => onSelect("INDEPENDENT")}
            className="mt-3 px-3 py-1.5 rounded bg-red-600 hover:bg-red-700 text-white text-xs font-semibold cursor-pointer"
          >
            Pilih Kelab Bebas
          </button>
        </div>
      )}

      {error && (
        <p className="text-xs text-red-400 mt-1.5 font-medium" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
