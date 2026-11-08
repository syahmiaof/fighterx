"use client";

import React, { useState, useEffect } from "react";
import { Search, Plus, MapPin } from "lucide-react";
import { useMoments } from "@/lib/moments/moments-context";
import { ALL_MALAYSIA_STATES } from "@/lib/moments/mock-data";
import { MomentCategoryFilter } from "@/lib/moments/types";
import { MomentAuthGuardModal } from "./moment-auth-guard-modal";

const CATEGORIES: { id: MomentCategoryFilter; label: string }[] = [
  { id: "semua", label: "Semua" },
  { id: "olahraga", label: "Olahraga" },
  { id: "seni", label: "Seni" },
  { id: "fitness", label: "Kecergasan" },
];

export function MomentsControlBar() {
  const {
    activeCategory,
    setActiveCategory,
    activeState,
    setActiveState,
    searchQuery,
    setSearchQuery,
    setIsUploadModalOpen,
  } = useMoments();

  const [isAuthGuardOpen, setIsAuthGuardOpen] = useState(false);

  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const isUploadRequested =
        urlParams.get("upload") === "true" || urlParams.get("action") === "upload";
      if (isUploadRequested) {
        const role = window.sessionStorage.getItem("fighterx_session_role");
        if (role === "ATHLETE") {
          setIsUploadModalOpen(true);
        } else {
          setIsAuthGuardOpen(true);
        }
      }
    } catch {
      // ignore
    }
  }, [setIsUploadModalOpen]);

  const handleUploadClick = () => {
    try {
      const role = window.sessionStorage.getItem("fighterx_session_role");
      if (role === "ATHLETE") {
        setIsUploadModalOpen(true);
      } else {
        setIsAuthGuardOpen(true);
      }
    } catch {
      setIsAuthGuardOpen(true);
    }
  };

  return (
    <div className="sticky top-[64px] z-30 bg-transparent py-4 transition-all">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* 1. Minimalist Crystal-Clear Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer backdrop-blur-md ${
                    isActive
                      ? "bg-[#E10600] text-white shadow-[0_2px_10px_rgba(225,6,0,0.35)]"
                      : "bg-black/30 text-[#C5C6CA] hover:text-white hover:bg-black/50 border border-white/10"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* 2. Controls: State Selector, Search & Upload CTA (Jernih Floating Controls) */}
          <div className="flex items-center gap-2">
            {/* State Filter Dropdown */}
            <div className="relative">
              <select
                value={activeState}
                onChange={(e) => setActiveState(e.target.value)}
                className="pl-3 pr-7 py-1.5 rounded-xl bg-black/30 backdrop-blur-md border border-white/10 text-xs font-medium text-[#C5C6CA] hover:border-white/20 focus:outline-none focus:border-[#FF3845] appearance-none cursor-pointer"
              >
                {ALL_MALAYSIA_STATES.map((st) => (
                  <option key={st} value={st} className="bg-[#121317] text-white">
                    {st}
                  </option>
                ))}
              </select>
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#96989F] text-[9px]">
                ▼
              </div>
            </div>

            {/* Search Input */}
            <div className="relative flex-1 sm:w-48">
              <Search
                size={12}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#96989F]"
              />
              <input
                type="text"
                placeholder="Cari atlet..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-7 pr-2.5 py-1.5 rounded-xl bg-black/30 backdrop-blur-md border border-white/10 text-xs text-white placeholder-[#8C8E96] focus:outline-none focus:border-[#FF3845]"
              />
            </div>

            {/* Kongsi Moment Upload CTA Button */}
            <button
              type="button"
              onClick={handleUploadClick}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-[#E10600] hover:bg-[#FF1A14] shadow-[0_2px_10px_rgba(225,6,0,0.3)] transition-all cursor-pointer whitespace-nowrap active:scale-95 shrink-0"
            >
              <Plus size={13} strokeWidth={2.5} />
              <span>Kongsi Moment</span>
            </button>
          </div>
        </div>
      </div>

      {/* Auth Guard Modal for unauthenticated / non-athlete visitors */}
      <MomentAuthGuardModal
        isOpen={isAuthGuardOpen}
        onClose={() => setIsAuthGuardOpen(false)}
        onBypassAsAthlete={() => {
          setIsAuthGuardOpen(false);
          setIsUploadModalOpen(true);
        }}
      />
    </div>
  );
}
