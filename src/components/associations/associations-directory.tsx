"use client";

import { Suspense, useMemo, useState, useRef, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { ShieldAlert, RotateCcw } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useCollectionMotion } from "@/hooks/useCollectionMotion";
gsap.registerPlugin(ScrollTrigger, useGSAP);
import {
  SILAT_ASSOCIATIONS,
  getCategoryCounts,
  searchAssociations,
  getAssociationById,
} from "@/lib/associations/data";
import type { CategoryFilterKey, SilatAssociation } from "@/lib/associations/types";
import { AssociationsHeader } from "./associations-header";
import { CategoryFilterPills } from "./category-filter-pills";
import { AssociationSearchBar } from "./association-search-bar";
import { AssociationCard } from "./association-card";
import { AssociationDetailModal } from "./association-detail-modal";
import { useLanguage } from "@/lib/i18n";

function DirectoryContent() {
  const { dict, locale } = useLanguage();
  const searchParams = useSearchParams();

  // Read initial values from URL query parameters if present
  const initialCategory = (searchParams.get("category") as CategoryFilterKey) || "ALL";
  const initialQuery = searchParams.get("q") || "";
  const initialId = searchParams.get("id") || "";

  const [selectedCategory, setSelectedCategory] = useState<CategoryFilterKey>(
    ["ALL", "BADAN_INDUK", "PENGASAS_TERAS", "PERGURUAN_UTAMA", "ANTARABANGSA"].includes(initialCategory)
      ? initialCategory
      : "ALL"
  );
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  // Initialize selectedAssociation directly from URL ?id= if present
  const [selectedAssociation, setSelectedAssociation] = useState<SilatAssociation | null>(() => {
    return initialId ? (getAssociationById(initialId) ?? null) : null;
  });

  const triggerRef = useRef<HTMLElement | null>(null);

  // Dynamic counts for each category
  const categoryCounts = useMemo(() => getCategoryCounts(), []);

  // Filtered associations based on search query and category
  const filteredAssociations = useMemo(() => {
    return searchAssociations(searchQuery, selectedCategory);
  }, [searchQuery, selectedCategory]);

  // Nemo-style collection motion — animate individual visible cards on filter change
  const filterKey = `${selectedCategory}|${searchQuery}`;
  const gridMotionRef = useCollectionMotion<HTMLDivElement>(filterKey);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const controlsRef = useRef<HTMLElement | null>(null);

  // Helper to remove inline overrides after GSAP finishes
  const cleanInline = useCallback((elements: HTMLElement[]) => {
    elements.forEach((el) => {
      el.style.removeProperty("clip-path");
      el.style.removeProperty("clipPath");
      el.style.removeProperty("transform");
      el.style.removeProperty("opacity");
      el.style.removeProperty("scale");
      el.style.removeProperty("will-change");
    });
  }, []);

  // Controls Iris Reveal
  useGSAP(
    () => {
      if (!controlsRef.current) return;
      const isReduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (isReduced) return;

      gsap.fromTo(
        controlsRef.current,
        {
          opacity: 0,
          y: 16,
          scale: 0.98,
          clipPath: "inset(0 50% 0 50% round 16px)",
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          clipPath: "inset(0 0% 0 0% round 16px)",
          duration: 0.85,
          delay: 0.15,
          ease: "expo.out",
          clearProps: "transform,scale,opacity,clipPath,clip-path",
        }
      );
    },
    { scope: controlsRef }
  );

  // Nemo iris reveal — initial card entrance on first scroll into view
  const entranceTriggeredRef = useRef(false);
  useEffect(() => {
    if (entranceTriggeredRef.current) return;
    const grid = gridMotionRef.current;
    if (!grid) return;
    const isReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced) return;

    const cards = Array.from(grid.querySelectorAll<HTMLElement>(".association-card")).slice(0, 24);
    if (!cards.length) return;

    // Set initial hidden state with Iris clip-path
    gsap.set(cards, {
      opacity: 0,
      y: 20,
      scale: 0.96,
      clipPath: "inset(0 50% 0 50% round 14px)",
      willChange: "transform, opacity, clip-path",
    });

    const st = ScrollTrigger.create({
      trigger: grid,
      start: "top 78%",
      once: true,
      onEnter: () => {
        entranceTriggeredRef.current = true;
        gsap.to(cards, {
          opacity: 1,
          y: 0,
          scale: 1,
          clipPath: "inset(0 0% 0 0% round 14px)",
          duration: 0.95,
          stagger: 0.075,
          ease: "expo.out",
          clearProps: "transform,scale,opacity,clipPath,clip-path,willChange",
          onComplete: () => {
            cleanInline(cards);
          },
        });
      },
    });

    return () => {
      st.kill();
    };
  }, [gridMotionRef, cleanInline]);

  // Interactive 3D Tactile Physics
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const interactiveSelector = ".category-pill, .association-card, .search-reset-btn, .empty-state-reset-btn, .search-clear-btn";

    const handlePointerDown = (e: PointerEvent) => {
      const target = (e.target as HTMLElement).closest<HTMLElement>(interactiveSelector);
      if (!target) return;
      gsap.to(target, { scale: 0.97, duration: 0.14, ease: "power2.out", overwrite: "auto" });
    };

    const handlePointerUp = (e: PointerEvent) => {
      const target = (e.target as HTMLElement).closest<HTMLElement>(interactiveSelector);
      if (!target) return;
      gsap.to(target, { scale: 1, duration: 0.28, ease: "back.out(2)", overwrite: "auto", clearProps: "transform,scale" });
    };

    const handlePointerLeave = (e: PointerEvent) => {
      const target = (e.target as HTMLElement).closest<HTMLElement>(interactiveSelector);
      if (!target) return;
      gsap.to(target, { scale: 1, duration: 0.28, ease: "back.out(2)", overwrite: "auto", clearProps: "transform,scale" });
    };

    container.addEventListener("pointerdown", handlePointerDown, { passive: true });
    container.addEventListener("pointerup", handlePointerUp, { passive: true });
    container.addEventListener("pointerleave", handlePointerLeave, { passive: true, capture: true });

    return () => {
      container.removeEventListener("pointerdown", handlePointerDown);
      container.removeEventListener("pointerup", handlePointerUp);
      container.removeEventListener("pointerleave", handlePointerLeave, { capture: true });
    };
  }, []);

  const handleSelectAssociation = (association: SilatAssociation) => {
    triggerRef.current = (document.activeElement as HTMLElement) || null;
    setSelectedAssociation(association);
  };

  const hasActiveFilters = searchQuery.trim().length > 0 || selectedCategory !== "ALL";

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("ALL");
  };

  return (
    <div ref={containerRef} className="associations-directory-container">
      {/* Directory Hero Header */}
      <AssociationsHeader totalCount={SILAT_ASSOCIATIONS.length} />

      {/* Control Panel: Search Bar and Category Filter Tabs */}
      <section ref={controlsRef} className="directory-controls-section" aria-label="Penapis Direktori">
        <AssociationSearchBar
          query={searchQuery}
          onQueryChange={setSearchQuery}
          resultCount={filteredAssociations.length}
          totalCount={SILAT_ASSOCIATIONS.length}
          onResetFilters={handleResetFilters}
          hasActiveFilters={hasActiveFilters}
        />

        <CategoryFilterPills
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          categoryCounts={categoryCounts}
        />
      </section>

      {/* Associations Grid / Results */}
      <main className="directory-grid-main" aria-label="Senarai Badan & Perguruan">
        {filteredAssociations.length > 0 ? (
          <div ref={gridMotionRef} className="associations-responsive-grid">
            {filteredAssociations.map((association) => (
              <AssociationCard
                key={association.id}
                association={association}
                onSelect={handleSelectAssociation}
              />
            ))}
          </div>
        ) : (
          /* Empty State when no matches found */
          <div className="directory-empty-state">
            <div className="empty-state-icon" aria-hidden="true">
              <ShieldAlert size={36} />
            </div>
            <h3 className="empty-state-title">
              {locale === "bm" ? "Tiada Persatuan Dijumpai" : "No Associations Found"}
            </h3>
            <p className="empty-state-message">
              {locale === "bm"
                ? `Tiada badan atau perguruan silat yang sepadan dengan carian "${searchQuery}"${selectedCategory !== "ALL" ? " dalam kategori ini" : ""}.`
                : `No silat bodies or lineages matching "${searchQuery}"${selectedCategory !== "ALL" ? " in this category" : ""}.`}
            </p>
            <button
              type="button"
              className="empty-state-reset-btn"
              onClick={handleResetFilters}
            >
              <RotateCcw size={15} aria-hidden="true" />
              {locale === "bm" ? "Set Semula Carian & Penapis" : "Reset Search & Filter"}
            </button>
          </div>
        )}
      </main>

      {/* Association Profile Detail Modal */}
      <AssociationDetailModal
        association={selectedAssociation}
        onClose={() => {
          setSelectedAssociation(null);
          triggerRef.current?.focus();
        }}
      />
    </div>
  );
}

export function AssociationsDirectory() {
  return (
    <Suspense
      fallback={
        <div className="associations-loading-fallback">
          <div className="loading-spinner" />
          <p>Memuat Direktori Badan &amp; Perguruan Silat...</p>
        </div>
      }
    >
      <DirectoryContent />
    </Suspense>
  );
}
