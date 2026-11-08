"use client";

import { useEffect, useRef } from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";

interface AssociationSearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  resultCount: number;
  totalCount: number;
  onResetFilters?: () => void;
  hasActiveFilters: boolean;
}

export function AssociationSearchBar({
  query,
  onQueryChange,
  resultCount,
  totalCount,
  onResetFilters,
  hasActiveFilters,
}: AssociationSearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut: pressing '/' focuses the search bar if not typing in an input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="search-bar-wrap">
      <div className="search-input-box">
        <Search className="search-icon" size={18} aria-hidden="true" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Cari nama persatuan, akronim (PSSGM, PESAKA, PSHT), negeri, pengasas..."
          className="search-input"
          aria-label="Cari badan atau perguruan silat"
        />

        {query ? (
          <button
            type="button"
            className="search-clear-btn"
            onClick={() => {
              onQueryChange("");
              inputRef.current?.focus();
            }}
            aria-label="Padam carian"
          >
            <X size={16} />
          </button>
        ) : (
          <kbd className="search-kbd" title="Tekan / untuk mencari">
            /
          </kbd>
        )}
      </div>

      {hasActiveFilters && (
        <div className="search-meta-bar">
          <span className="search-result-count">
            {resultCount} keputusan dijumpai
          </span>

          {onResetFilters && (
            <button
              type="button"
              className="search-reset-btn"
              onClick={onResetFilters}
            >
              <SlidersHorizontal size={13} aria-hidden="true" />
              Set Semula Penapis
            </button>
          )}
        </div>
      )}
    </div>
  );
}
