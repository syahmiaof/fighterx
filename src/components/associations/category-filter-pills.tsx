"use client";

import { CATEGORY_METADATA_LIST } from "@/lib/associations/data";
import type { CategoryFilterKey } from "@/lib/associations/types";

interface CategoryFilterPillsProps {
  selectedCategory: CategoryFilterKey;
  onSelectCategory: (category: CategoryFilterKey) => void;
  categoryCounts?: Record<CategoryFilterKey, number>;
}

export function CategoryFilterPills({
  selectedCategory,
  onSelectCategory,
}: CategoryFilterPillsProps) {
  const activeMeta = CATEGORY_METADATA_LIST.find((m) => m.key === selectedCategory);

  return (
    <div className="category-filter-container">
      {/* Category Pills Tablist */}
      <div
        className="category-filter-pills"
        role="tablist"
        aria-label="Kategori Badan & Perguruan Silat"
      >
        {CATEGORY_METADATA_LIST.map((meta) => {
          const isSelected = selectedCategory === meta.key;

          return (
            <button
              key={meta.key}
              type="button"
              role="tab"
              aria-selected={isSelected}
              className={`category-pill${isSelected ? " is-active" : ""}`}
              onClick={() => onSelectCategory(meta.key)}
            >
              <span className="pill-label">{meta.label}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Category Description Context */}
      {activeMeta && (
        <p className="category-context-description">
          <span className="context-bullet" aria-hidden="true">&bull;</span>
          {activeMeta.description}
        </p>
      )}
    </div>
  );
}
