"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ShieldAlert, RotateCcw } from "lucide-react";
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

function DirectoryContent() {
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

  // Dynamic counts for each category
  const categoryCounts = useMemo(() => getCategoryCounts(), []);

  // Filtered associations based on search query and category
  const filteredAssociations = useMemo(() => {
    return searchAssociations(searchQuery, selectedCategory);
  }, [searchQuery, selectedCategory]);

  const hasActiveFilters = searchQuery.trim().length > 0 || selectedCategory !== "ALL";

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("ALL");
  };

  return (
    <div className="associations-directory-container">
      {/* Directory Hero Header */}
      <AssociationsHeader totalCount={SILAT_ASSOCIATIONS.length} />

      {/* Control Panel: Search Bar and Category Filter Tabs */}
      <section className="directory-controls-section" aria-label="Penapis Direktori">
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
          <div className="associations-responsive-grid">
            {filteredAssociations.map((association) => (
              <AssociationCard
                key={association.id}
                association={association}
                onSelect={setSelectedAssociation}
              />
            ))}
          </div>
        ) : (
          /* Empty State when no matches found */
          <div className="directory-empty-state">
            <div className="empty-state-icon" aria-hidden="true">
              <ShieldAlert size={36} />
            </div>
            <h3 className="empty-state-title">Tiada Persatuan Dijumpai</h3>
            <p className="empty-state-message">
              Tiada badan atau perguruan silat yang sepadan dengan carian &ldquo;{searchQuery}&rdquo;
              {selectedCategory !== "ALL" && " dalam kategori ini"}.
            </p>
            <button
              type="button"
              className="empty-state-reset-btn"
              onClick={handleResetFilters}
            >
              <RotateCcw size={15} aria-hidden="true" />
              Set Semula Carian &amp; Penapis
            </button>
          </div>
        )}
      </main>

      {/* Association Profile Detail Modal */}
      <AssociationDetailModal
        association={selectedAssociation}
        onClose={() => setSelectedAssociation(null)}
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
