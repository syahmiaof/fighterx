"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { X, Heart, ShieldCheck, MapPin, Share2 } from "lucide-react";
import { useMoments } from "@/lib/moments/moments-context";

export function MomentLightboxModal() {
  const { lightboxMoment, setLightboxMoment, toggleLike, showToast } = useMoments();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!lightboxMoment) return;

    triggerRef.current = (document.activeElement as HTMLElement) || null;
    document.body.style.overflow = "hidden";

    const timer = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 40);

    // GSAP Nemo Iris Entrance for Lightbox Container
    const container = dialogRef.current?.querySelector<HTMLElement>(".moment-lightbox-container");
    if (container) {
      gsap.fromTo(
        container,
        {
          opacity: 0,
          scale: 0.95,
          y: 16,
          clipPath: "inset(0 45% 0 45% round 24px)",
          willChange: "transform, opacity, clip-path",
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          clipPath: "inset(0 0% 0 0% round 24px)",
          duration: 0.55,
          ease: "expo.out",
          clearProps: "transform,scale,opacity,clipPath,clip-path,willChange",
        }
      );
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setLightboxMoment(null);
        return;
      }

      if (e.key === "Tab") {
        if (!dialogRef.current) return;
        const focusables = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        ).filter((el) => el.offsetParent !== null || el.offsetWidth > 0 || el.offsetHeight > 0);

        if (focusables.length === 0) {
          e.preventDefault();
          return;
        }

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first || !dialogRef.current.contains(document.activeElement)) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last || !dialogRef.current.contains(document.activeElement)) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
      triggerRef.current?.focus();
    };
  }, [lightboxMoment, setLightboxMoment]);

  if (!lightboxMoment) return null;

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href);
      showToast("Pautan moment disalin!");
    }
  };

  return (
    <div
      ref={dialogRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/92 backdrop-blur-xl animate-in fade-in duration-200"
      onClick={() => setLightboxMoment(null)}
      role="dialog"
      aria-modal="true"
    >
      {/* Close button */}
      <button
        ref={closeButtonRef}
        type="button"
        onClick={() => setLightboxMoment(null)}
        className="absolute top-4 right-4 z-50 w-11 h-11 rounded-full bg-white/10 hover:bg-[#E10600] text-white flex items-center justify-center transition-colors cursor-pointer"
        aria-label="Tutup Paparan Skrin Penuh"
      >
        <X size={22} />
      </button>

      {/* Lightbox Container */}
      <div
        className="moment-lightbox-container relative max-w-5xl w-full max-h-[92vh] flex flex-col md:flex-row rounded-3xl bg-[#0c0d11] border border-white/15 overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.95)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Large Image Stage */}
        <div className="relative flex-1 min-h-[320px] md:min-h-[560px] bg-black flex items-center justify-center">
          <Image
            src={lightboxMoment.imageUrl}
            alt={lightboxMoment.trainingFocus}
            fill
            className="object-contain"
            sizes="(max-width: 1024px) 100vw, 65vw"
          />
        </div>

        {/* Sidebar Info Stage */}
        <div className="w-full md:w-80 lg:w-96 p-5 sm:p-6 flex flex-col justify-between border-t md:border-t-0 md:border-l border-white/10 bg-[#121318]">
          <div>
            {/* Athlete Profile Header */}
            <div className="flex items-center gap-3 pb-4 border-b border-white/10">
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-black border border-[#FF3845] shrink-0">
                <Image
                  src={lightboxMoment.athleteAvatar}
                  alt={lightboxMoment.athleteName}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-bold text-white leading-tight">
                    {lightboxMoment.athleteName}
                  </h4>
                  <ShieldCheck size={14} className="text-[#FF3845]" />
                </div>
                <div className="text-xs text-[#96989F] font-mono mt-0.5 flex items-center gap-1">
                  <MapPin size={11} className="text-[#FF3845]" />
                  <span>{lightboxMoment.state}</span>
                  <span>•</span>
                  <span>{lightboxMoment.clubName}</span>
                </div>
              </div>
            </div>

            {/* Title & Caption */}
            <div className="mt-4">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#FF3845] px-2 py-0.5 rounded bg-red-950/60 border border-red-500/20">
                {lightboxMoment.discipline}
              </span>
              <h3 className="text-base font-bold font-athletic uppercase text-white mt-2">
                {lightboxMoment.trainingFocus}
              </h3>
              <p className="text-xs text-[#C5C6CA] leading-relaxed mt-2.5">
                &ldquo;{lightboxMoment.caption}&rdquo;
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mt-4">
                {lightboxMoment.tags.map((tag) => (
                  <span key={tag} className="text-[11px] font-mono text-[#96989F]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Bar: Like & Share */}
          <div className="pt-4 mt-6 border-t border-white/10 flex items-center justify-between">
            <button
              type="button"
              onClick={() => toggleLike(lightboxMoment.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                lightboxMoment.userLiked
                  ? "bg-[#E10600] text-white shadow-[0_0_15px_rgba(225,6,0,0.5)]"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              <Heart
                size={15}
                className={lightboxMoment.userLiked ? "fill-white text-white" : ""}
              />
              <span>{lightboxMoment.likesCount} Suka</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="p-2 rounded-full hover:bg-white/10 text-[#C5C6CA] hover:text-white transition-colors cursor-pointer"
              title="Kongsi Pautan"
            >
              <Share2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
