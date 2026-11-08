"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { AthleteMoment, MomentCategoryFilter } from "./types";
import { INITIAL_MOMENTS } from "./mock-data";

interface MomentsContextValue {
  moments: AthleteMoment[];
  activeCategory: MomentCategoryFilter;
  activeState: string;
  searchQuery: string;
  setActiveCategory: (category: MomentCategoryFilter) => void;
  setActiveState: (state: string) => void;
  setSearchQuery: (query: string) => void;
  toggleLike: (momentId: string) => void;
  addMoment: (
    data: Omit<AthleteMoment, "id" | "likesCount" | "userLiked" | "commentsCount" | "timestamp">
  ) => void;
  lightboxMoment: AthleteMoment | null;
  setLightboxMoment: (moment: AthleteMoment | null) => void;
  isUploadModalOpen: boolean;
  setIsUploadModalOpen: (open: boolean) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  featuredMoments: AthleteMoment[];
  filteredMoments: AthleteMoment[];
}

const MomentsContext = createContext<MomentsContextValue | null>(null);

const STORAGE_KEY = "fighterx_athlete_moments_v1";

export function MomentsProvider({ children }: { children: React.ReactNode }) {
  const [moments, setMoments] = useState<AthleteMoment[]>(INITIAL_MOMENTS);
  const [activeCategory, setActiveCategory] = useState<MomentCategoryFilter>("semua");
  const [activeState, setActiveState] = useState<string>("Semua Negeri");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [lightboxMoment, setLightboxMoment] = useState<AthleteMoment | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load from local storage if available
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMoments(parsed);
        }
      }
    } catch {
      // ignore JSON parse errors
    }
  }, []);

  // Save to local storage on change
  const saveMoments = (newMoments: AthleteMoment[]) => {
    setMoments(newMoments);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newMoments));
    } catch {
      // ignore storage errors
    }
  };

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  }, []);

  const toggleLike = useCallback(
    (momentId: string) => {
      setMoments((prev) => {
        const updated = prev.map((item) => {
          if (item.id === momentId) {
            const isLiked = !item.userLiked;
            return {
              ...item,
              userLiked: isLiked,
              likesCount: isLiked ? item.likesCount + 1 : Math.max(0, item.likesCount - 1),
            };
          }
          return item;
        });
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch {
          // ignore
        }
        return updated;
      });

      // Keep lightbox synchronized if currently open
      setLightboxMoment((current) => {
        if (current && current.id === momentId) {
          const isLiked = !current.userLiked;
          return {
            ...current,
            userLiked: isLiked,
            likesCount: isLiked ? current.likesCount + 1 : Math.max(0, current.likesCount - 1),
          };
        }
        return current;
      });
    },
    []
  );

  const addMoment = useCallback(
    (
      data: Omit<AthleteMoment, "id" | "likesCount" | "userLiked" | "commentsCount" | "timestamp">
    ) => {
      const newEntry: AthleteMoment = {
        ...data,
        id: `moment-${Date.now()}`,
        timestamp: "Baru sahaja",
        likesCount: 1,
        userLiked: true,
        commentsCount: 0,
      };

      setMoments((prev) => {
        const updated = [newEntry, ...prev];
        saveMoments(updated);
        return updated;
      });

      showToast("Moment berjaya diterbitkan ke galeri atlet Malaysia!");
    },
    [showToast]
  );

  const featuredMoments = useMemo(() => {
    return moments.filter((m) => m.isFeatured);
  }, [moments]);

  const filteredMoments = useMemo(() => {
    return moments.filter((item) => {
      // Category filter
      if (activeCategory !== "semua" && item.discipline !== activeCategory) {
        return false;
      }
      // State filter
      if (activeState !== "Semua Negeri" && item.state.toLowerCase() !== activeState.toLowerCase()) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.athleteName.toLowerCase().includes(q);
        const matchesClub = item.clubName.toLowerCase().includes(q);
        const matchesFocus = item.trainingFocus.toLowerCase().includes(q);
        const matchesCaption = item.caption.toLowerCase().includes(q);
        const matchesTag = item.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesName && !matchesClub && !matchesFocus && !matchesCaption && !matchesTag) {
          return false;
        }
      }
      return true;
    });
  }, [moments, activeCategory, activeState, searchQuery]);

  return (
    <MomentsContext.Provider
      value={{
        moments,
        activeCategory,
        activeState,
        searchQuery,
        setActiveCategory,
        setActiveState,
        setSearchQuery,
        toggleLike,
        addMoment,
        lightboxMoment,
        setLightboxMoment,
        isUploadModalOpen,
        setIsUploadModalOpen,
        toastMessage,
        showToast,
        featuredMoments,
        filteredMoments,
      }}
    >
      {children}
    </MomentsContext.Provider>
  );
}

export function useMoments() {
  const ctx = useContext(MomentsContext);
  if (!ctx) {
    throw new Error("useMoments must be used within a MomentsProvider");
  }
  return ctx;
}
