"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Heart, ChevronLeft, ChevronRight, Sparkles, MapPin, Shield } from "lucide-react";
import { useMoments } from "@/lib/moments/moments-context";
import { AthleteMoment } from "@/lib/moments/types";

export function MomentsHeroCarousel() {
  const { featuredMoments, toggleLike, setLightboxMoment } = useMoments();
  const [items, setItems] = useState<AthleteMoment[]>([]);

  useEffect(() => {
    if (featuredMoments.length > 0) {
      setItems(featuredMoments);
    }
  }, [featuredMoments]);

  if (items.length === 0) return null;

  const currentItem = items[0];

  const handleNext = () => {
    setItems((prev) => {
      if (prev.length <= 1) return prev;
      const [first, ...rest] = prev;
      return [...rest, first];
    });
  };

  const handlePrev = () => {
    setItems((prev) => {
      if (prev.length <= 1) return prev;
      const last = prev[prev.length - 1];
      const rest = prev.slice(0, prev.length - 1);
      return [last, ...rest];
    });
  };

  const handleSelectCard = (index: number) => {
    if (index === 0) return;
    setItems((prev) => {
      const selected = prev.slice(index);
      const before = prev.slice(0, index);
      return [...selected, ...before];
    });
  };

  return (
    <section
      className="relative w-full h-[78vh] min-h-[580px] max-h-[820px] bg-[#050608] overflow-hidden select-none border-b border-[#26272C]/60"
      aria-label="Koleksi Pilihan Moment Atlet Kebangsaan"
    >
      {/* Background Hero Stage (Current Item) */}
      <div className="absolute inset-0 z-0">
        <Image
          src={currentItem.imageUrl}
          alt={currentItem.trainingFocus}
          fill
          priority
          className="object-cover object-center filter brightness-[0.78] contrast-[1.08] transition-all duration-700 ease-out"
          sizes="100vw"
        />

        {/* Ambient Dark Gradients & Red Athletic Glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#08090b] via-[#08090b]/40 to-black/60 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#08090b] via-[#08090b]/70 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-[#08090b] to-transparent pointer-events-none" />
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-[#E10600]/10 rounded-full blur-[140px] pointer-events-none" />
      </div>

      {/* Main Content Info (Active Slide) */}
      <div className="relative z-10 h-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
        <div className="max-w-2xl pt-10 pb-20">
          {/* Technical Overline Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#0c0d10]/85 border-l-2 border-l-[#ff3845] border border-white/10 backdrop-blur-md shadow-md mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff3845] shadow-[0_0_6px_#ff3845]" />
            <span className="text-[11px] font-bold tracking-wider text-white uppercase font-sans">
              MOMENT TUMPUAN MALAYSIA
            </span>
            <span className="text-[10px] font-mono text-[#96989f]">· {currentItem.state}</span>
          </div>

          {/* Title */}
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-athletic italic uppercase tracking-tight text-white leading-[0.92] drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]">
            {currentItem.featuredTitle || currentItem.trainingFocus}
          </h2>

          {/* Subtitle / Focus */}
          <p className="text-base sm:text-lg font-medium text-[#FF3845] mt-2.5 font-athletic uppercase tracking-wider">
            {currentItem.featuredSubtitle || currentItem.trainingFocus}
          </p>

          {/* Caption */}
          <p className="text-xs sm:text-sm text-[#C5C6CA] mt-3 leading-relaxed max-w-xl line-clamp-3 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            &ldquo;{currentItem.caption}&rdquo;
          </p>

          {/* Athlete Profile & Interactive Like Bar */}
          <div className="flex flex-wrap items-center gap-4 mt-6">
            {/* Technical Athlete Badge */}
            <aside className="inline-flex items-center gap-3 px-3.5 py-2 rounded-lg bg-[#0c0d10]/80 border-l-[3px] border-l-[#ff3845] border border-white/10 backdrop-blur-xl shadow-[0_4px_16px_rgba(0,0,0,0.5)]">
              <div className="relative w-9 h-9 rounded-full overflow-hidden bg-black/90 border border-[#ff3845]/50 shrink-0">
                <Image
                  src={currentItem.athleteAvatar}
                  alt={currentItem.athleteName}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <span>{currentItem.athleteName}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff3845] shadow-[0_0_6px_#ff3845]" />
                </div>
                <div className="text-[10px] text-[#c5c6ca] font-medium flex items-center gap-1">
                  <span>{currentItem.clubName}</span>
                </div>
              </div>
            </aside>

            {/* Like Button */}
            <button
              type="button"
              onClick={() => toggleLike(currentItem.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-semibold backdrop-blur-md transition-all duration-200 cursor-pointer ${
                currentItem.userLiked
                  ? "bg-[#E10600] border-[#FF3845] text-white shadow-[0_0_20px_rgba(225,6,0,0.5)] scale-105"
                  : "bg-black/60 border-white/15 text-[#C5C6CA] hover:text-white hover:border-[#FF3845]"
              }`}
              title="Like Moment ini"
            >
              <Heart
                size={14}
                className={currentItem.userLiked ? "fill-white text-white" : "text-[#FF3845]"}
              />
              <span>{currentItem.likesCount} Suka</span>
            </button>

            {/* View Fullscreen */}
            <button
              type="button"
              onClick={() => setLightboxMoment(currentItem)}
              className="text-xs font-mono text-[#96989F] hover:text-white underline underline-offset-4 transition-colors cursor-pointer"
            >
              Lihat Skrin Penuh
            </button>
          </div>
        </div>
      </div>

      {/* Queued Stacked Cards (Bottom Right - Daeng Kuning Inspiration) */}
      <div className="absolute right-4 sm:right-8 lg:right-12 bottom-6 sm:bottom-10 z-20 hidden md:flex items-center gap-4">
        {items.slice(1, 4).map((item, idx) => (
          <div
            key={item.id}
            onClick={() => handleSelectCard(idx + 1)}
            className="group relative w-36 lg:w-44 h-52 lg:h-64 rounded-2xl overflow-hidden border border-white/15 bg-black/50 backdrop-blur-md shadow-[0_12px_32px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.15)] cursor-pointer transform hover:-translate-y-2 hover:scale-105 hover:border-[#FF3845] hover:shadow-[0_16px_40px_rgba(225,6,0,0.35)] transition-all duration-300"
          >
            <Image
              src={item.imageUrl}
              alt={item.athleteName}
              fill
              className="object-cover filter grayscale contrast-125 brightness-90 group-hover:grayscale-0 group-hover:brightness-105 transition-all duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

            <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-black/70 border border-white/20 text-[9px] font-mono text-white">
              {item.state}
            </div>

            <div className="absolute bottom-3 left-3 right-3 text-left">
              <span className="text-[10px] font-mono font-bold text-[#FF3845] block uppercase">
                {item.discipline}
              </span>
              <p className="text-xs font-bold text-white line-clamp-1 group-hover:text-[#FF3845] transition-colors">
                {item.athleteName}
              </p>
              <p className="text-[10px] text-[#C5C6CA] line-clamp-1 mt-0.5">
                {item.featuredTitle || item.trainingFocus}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrow Controls (Bottom Left) */}
      <div className="absolute bottom-6 left-4 sm:left-8 lg:left-12 z-20 flex items-center gap-3">
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Moment sebelumnya"
          className="w-11 h-11 rounded-full border border-white/20 bg-black/60 text-white flex items-center justify-center hover:bg-[#E10600] hover:border-[#FF3845] hover:scale-110 active:scale-95 transition-all duration-200 backdrop-blur-md cursor-pointer shadow-lg"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          type="button"
          onClick={handleNext}
          aria-label="Moment seterusnya"
          className="w-11 h-11 rounded-full border border-white/20 bg-black/60 text-white flex items-center justify-center hover:bg-[#E10600] hover:border-[#FF3845] hover:scale-110 active:scale-95 transition-all duration-200 backdrop-blur-md cursor-pointer shadow-lg"
        >
          <ChevronRight size={20} />
        </button>

        <span className="text-xs font-mono text-[#96989F] ml-2 tracking-widest uppercase hidden sm:inline-block">
          Detik Latihan Terkini
        </span>
      </div>
    </section>
  );
}
