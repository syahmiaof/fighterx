"use client";

import React from "react";
import { MomentCard } from "./moment-card";
import { useMoments } from "@/lib/moments/moments-context";
import { CameraOff, RotateCcw } from "lucide-react";

export function MomentFeedGrid() {
  const { filteredMoments, setActiveCategory, setActiveState, setSearchQuery } = useMoments();

  const handleResetFilters = () => {
    setActiveCategory("semua");
    setActiveState("Semua Negeri");
    setSearchQuery("");
  };

  if (filteredMoments.length === 0) {
    return (
      <div className="py-20 text-center max-w-md mx-auto px-4">
        <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto text-[#FF3845] mb-3">
          <CameraOff size={24} />
        </div>
        <h3 className="text-base font-bold font-athletic uppercase text-white tracking-wide">
          Tiada Moment Ditemui
        </h3>
        <p className="text-xs text-[#96989F] mt-1 leading-relaxed">
          Tiada foto atau rekod latihan atlet yang sepadan dengan penapis yang dipilih.
        </p>
        <button
          type="button"
          onClick={handleResetFilters}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 mt-4 rounded-xl bg-white/[0.05] border border-white/10 hover:border-[#FF3845] text-xs font-semibold text-white transition-all cursor-pointer"
        >
          <RotateCcw size={12} />
          <span>Set Semula</span>
        </button>
      </div>
    );
  }

  return (
    <section className="py-8 max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
      {/* Grid of Clean Minimalist Glass Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMoments.map((moment) => (
          <MomentCard key={moment.id} moment={moment} />
        ))}
      </div>
    </section>
  );
}
