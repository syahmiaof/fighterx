"use client";

import { useEffect } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import "@/components/competitions/competitions.css";

export default function CompetitionsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Competitions view error:", error);
  }, [error]);

  return (
    <div className="competitions-page-wrap public-page-wrap relative min-h-screen bg-[#08090b] text-white flex items-center justify-center p-6">
      <div className="competitions-empty-state max-w-lg w-full">
        <AlertCircle className="empty-state-icon" size={44} />
        <h2 className="empty-state-title">Ralat Memuatkan Takwim</h2>
        <p className="empty-state-text">
          Terdapat masalah teknikal semasa memuatkan data kejohanan. Sila cuba muat semula halaman atau periksa sambungan internet anda.
        </p>
        <button type="button" onClick={() => reset()} className="btn-empty-reset">
          <RotateCcw size={13} />
          <span>Cuba Semula</span>
        </button>
      </div>
    </div>
  );
}
