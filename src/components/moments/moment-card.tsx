"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Heart, MessageCircle, Share2, ZoomIn, ShieldCheck, Eye } from "lucide-react";
import { AthleteMoment } from "@/lib/moments/types";
import { useMoments } from "@/lib/moments/moments-context";

interface MomentCardProps {
  moment: AthleteMoment;
}

export function MomentCard({ moment }: MomentCardProps) {
  const { toggleLike, setLightboxMoment, showToast } = useMoments();
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = () => {
    setIsLiking(true);
    toggleLike(moment.id);
    setTimeout(() => setIsLiking(false), 300);
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href);
      showToast("Pautan moment disalin!");
    }
  };

  const getDisciplineLabel = () => {
    switch (moment.discipline) {
      case "olahraga":
        return "Silat Olahraga";
      case "seni":
        return "Silat Seni";
      case "fitness":
        return "Kecergasan";
      case "kejohanan":
        return "Kejohanan";
      default:
        return "Umum";
    }
  };

  return (
    <article className="group relative flex flex-col rounded-2xl border border-white/10 hover:border-white/30 bg-transparent hover:bg-white/[0.03] backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.12)] hover:-translate-y-1.5 transition-all duration-300 overflow-hidden">
      {/* 1. Minimalist Athlete Header (Jernih Transparent Glass) */}
      <div className="p-3.5 sm:p-4 flex items-center justify-between border-b border-white/[0.08]">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative w-8 h-8 rounded-full overflow-hidden bg-black/60 border border-[#FF3845]/40 shrink-0 shadow-[0_0_8px_rgba(225,6,0,0.25)]">
            <Image
              src={moment.athleteAvatar}
              alt={moment.athleteName}
              fill
              className="object-cover"
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-[#FF3845] transition-colors leading-tight truncate">
                {moment.athleteName}
              </h3>
              <ShieldCheck size={12} className="text-[#FF3845] shrink-0" />
            </div>
            <p className="text-[10px] text-[#96989F] truncate mt-0.5">
              <span className="text-white/80 font-medium">{moment.state}</span>
              <span className="mx-1 text-white/20">•</span>
              <span className="truncate">{moment.clubName}</span>
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono text-[#73757F] shrink-0">
          {moment.timestamp}
        </span>
      </div>

      {/* 2. Photo Stage with Clean Frosted Glass Pill & Lightbox Trigger */}
      <div
        className="relative w-full aspect-[4/3] bg-black/80 overflow-hidden cursor-pointer"
        onClick={() => setLightboxMoment(moment)}
      >
        <Image
          src={moment.imageUrl}
          alt={moment.trainingFocus}
          fill
          className="object-cover filter brightness-[0.94] contrast-[1.05] group-hover:scale-105 group-hover:brightness-105 transition-all duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />

        {/* Minimalist Floating Pill Badge */}
        <div className="absolute top-2.5 left-2.5">
          <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono font-semibold uppercase bg-black/60 border border-white/15 text-[#C5C6CA] backdrop-blur-md">
            {getDisciplineLabel()}
          </span>
        </div>

        {/* Zoom Hint Icon */}
        <div className="absolute bottom-2.5 right-2.5 w-7 h-7 rounded-full bg-black/60 border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-md">
          <ZoomIn size={13} />
        </div>
      </div>

      {/* 3. Content Body: Focus & Caption */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          <h4 className="text-xs sm:text-sm font-bold font-athletic text-white uppercase tracking-wide line-clamp-1">
            {moment.trainingFocus}
          </h4>

          <p className="text-[11px] sm:text-xs text-[#96989F] mt-1.5 leading-relaxed line-clamp-2">
            {moment.caption}
          </p>
        </div>

        {/* 4. Interactive Glass Action Bar */}
        <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/[0.06] text-xs text-[#96989F]">
          <div className="flex items-center gap-3">
            {/* Like Button */}
            <button
              type="button"
              onClick={handleLike}
              className={`inline-flex items-center gap-1 font-semibold transition-all duration-200 cursor-pointer ${
                moment.userLiked ? "text-[#FF3845]" : "text-[#96989F] hover:text-white"
              } ${isLiking ? "scale-125" : "scale-100"}`}
              title="Suka Moment ini"
            >
              <Heart
                size={14}
                className={moment.userLiked ? "fill-[#FF3845] text-[#FF3845]" : ""}
              />
              <span className="font-mono text-[11px]">{moment.likesCount}</span>
            </button>

            {/* Comments Counter */}
            <div className="inline-flex items-center gap-1 text-[#73757F]">
              <MessageCircle size={13} />
              <span className="font-mono text-[11px]">{moment.commentsCount}</span>
            </div>

            {/* Views Counter */}
            <div className="inline-flex items-center gap-1 text-[#73757F]" title="Tontonan">
              <Eye size={13} />
              <span className="font-mono text-[11px]">
                {moment.viewsCount ? moment.viewsCount.toLocaleString() : "850"}
              </span>
            </div>
          </div>

          {/* Share Button */}
          <button
            type="button"
            onClick={handleShare}
            className="p-1 text-[#73757F] hover:text-white transition-colors cursor-pointer"
            title="Kongsi Pautan"
          >
            <Share2 size={13} />
          </button>
        </div>
      </div>
    </article>
  );
}
