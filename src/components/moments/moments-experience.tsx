"use client";

import React from "react";
import { MomentsProvider, useMoments } from "@/lib/moments/moments-context";
import { MomentsControlBar } from "./moments-control-bar";
import { MomentFeedGrid } from "./moment-feed-grid";
import { MomentLightboxModal } from "./moment-lightbox-modal";
import { MomentUploadModal } from "./moment-upload-modal";
import { CheckCircle2 } from "lucide-react";

function MomentsContent() {
  const { toastMessage } = useMoments();

  return (
    <>
      {/* 1. Minimalist Glass Control Bar */}
      <MomentsControlBar />

      {/* 2. Community Athlete Moments Feed Grid */}
      <MomentFeedGrid />

      {/* 3. Fullscreen Lightbox Modal */}
      <MomentLightboxModal />

      {/* 4. Athlete Upload Modal */}
      <MomentUploadModal />

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#14151a] border border-[#FF3845] text-white text-xs font-medium shadow-[0_10px_30px_rgba(225,6,0,0.3)] animate-in slide-in-from-bottom-4 duration-300">
          <CheckCircle2 size={15} className="text-[#FF3845]" />
          <span>{toastMessage}</span>
        </div>
      )}
    </>
  );
}

export function MomentsExperience() {
  return (
    <MomentsProvider>
      <MomentsContent />
    </MomentsProvider>
  );
}
