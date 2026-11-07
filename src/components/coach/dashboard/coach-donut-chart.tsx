"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useCoachState } from "@/lib/coach/store";
import { CoachCard } from "../ui/coach-card";

export function CoachDonutChart() {
  const { kpis } = useCoachState();
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);

  const total = kpis.totalAthletes || 0;
  const konsisten = kpis.consistency?.konsistenCount ?? 17;
  const sederhana = kpis.consistency?.sederhanaCount ?? 7;
  const perluPerhatian = kpis.consistency?.perluPerhatianCount ?? 4;

  const pctKonsisten =
    total > 0 ? Math.round((konsisten / total) * 100) : 0;
  const pctSederhana =
    total > 0 ? Math.round((sederhana / total) * 100) : 0;
  const pctPerluPerhatian =
    total > 0 ? Math.max(0, 100 - pctKonsisten - pctSederhana) : 0;

  // Geometry: radius = 45, circumference C = 2 * PI * 45
  const r = 45;
  const C = 2 * Math.PI * r;

  const arcKonsisten = total > 0 ? (konsisten / total) * C : 0;
  const arcSederhana = total > 0 ? (sederhana / total) * C : 0;
  const arcPerluPerhatian = total > 0 ? (perluPerhatian / total) * C : 0;

  const segments = [
    {
      id: "konsisten",
      label: "Konsisten",
      count: konsisten,
      pct: pctKonsisten,
      color: "#22c55e",
      strokeDasharray: `${arcKonsisten} ${C}`,
      strokeDashoffset: 0,
      description: "Kedatangan & latihan konsisten",
    },
    {
      id: "sederhana",
      label: "Sederhana",
      count: sederhana,
      pct: pctSederhana,
      color: "#f59e0b",
      strokeDasharray: `${arcSederhana} ${C}`,
      strokeDashoffset: -arcKonsisten,
      description: "Perlu dorongan latihan berjadual",
    },
    {
      id: "perluPerhatian",
      label: "Perlu Perhatian",
      count: perluPerhatian,
      pct: pctPerluPerhatian,
      color: "#e10600",
      strokeDasharray: `${arcPerluPerhatian} ${C}`,
      strokeDashoffset: -(arcKonsisten + arcSederhana),
      description: "Kerap ponteng atau tidak hantar tugasan",
    },
  ];

  const activeSegmentData = hoveredSegment
    ? segments.find((s) => s.id === hoveredSegment)
    : null;

  return (
    <CoachCard className="p-5 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
        <div>
          <h3 className="text-sm font-bold text-white tracking-wide">
            Gambaran Atlet
          </h3>
          <p className="text-[11px] text-[#96989f]">
            Status konsistensi kehadiran latihan
          </p>
        </div>
        <Link
          href="/coach/athletes"
          className="group inline-flex items-center gap-1 text-xs font-semibold text-[#ff555a] hover:text-white transition-colors"
        >
          <span>Lihat Semua</span>
          <ArrowRight
            size={13}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      </div>

      {/* Donut Chart & Legend */}
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-around gap-6">
        {/* SVG Donut */}
        <div className="relative h-36 w-36 flex-shrink-0 flex items-center justify-center">
          <svg
            viewBox="0 0 120 120"
            className="h-full w-full transform -rotate-90"
            role="img"
            aria-label={`Gambaran Konsistensi Atlet: ${konsisten} Konsisten, ${sederhana} Sederhana, ${perluPerhatian} Perlu Perhatian`}
          >
            {/* Background base track */}
            <circle
              cx="60"
              cy="60"
              r={r}
              fill="transparent"
              stroke="#202126"
              strokeWidth="14"
            />

            {/* Zero state single ring */}
            {total === 0 ? (
              <circle
                cx="60"
                cy="60"
                r={r}
                fill="transparent"
                stroke="#45464b"
                strokeWidth="14"
              />
            ) : (
              /* Color Segments */
              segments.map((seg) => {
                const isHovered = hoveredSegment === seg.id;
                return (
                  <circle
                    key={seg.id}
                    cx="60"
                    cy="60"
                    r={r}
                    fill="transparent"
                    stroke={seg.color}
                    strokeWidth={isHovered ? "17" : "14"}
                    strokeDasharray={seg.strokeDasharray}
                    strokeDashoffset={seg.strokeDashoffset}
                    strokeLinecap="butt"
                    className="cursor-pointer transition-all duration-200"
                    onMouseEnter={() => setHoveredSegment(seg.id)}
                    onMouseLeave={() => setHoveredSegment(null)}
                    style={{
                      filter: isHovered
                        ? `drop-shadow(0 0 6px ${seg.color})`
                        : undefined,
                    }}
                  />
                );
              })
            )}
          </svg>

          {/* Center Hole Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            {activeSegmentData ? (
              <>
                <span className="font-teko text-2xl font-bold leading-none text-white">
                  {activeSegmentData.count}
                </span>
                <span className="text-[10px] font-semibold text-[#c5c6ca] leading-tight">
                  {activeSegmentData.pct}%
                </span>
              </>
            ) : (
              <>
                <span className="font-teko text-3xl font-bold leading-none text-white">
                  {total}
                </span>
                <span className="text-[11px] font-semibold text-[#96989f] uppercase tracking-wider">
                  Atlet
                </span>
              </>
            )}
          </div>
        </div>

        {/* Legend List */}
        <div className="w-full sm:w-auto flex-1 space-y-2.5">
          {segments.map((seg) => {
            const isHovered = hoveredSegment === seg.id;
            return (
              <div
                key={seg.id}
                onMouseEnter={() => setHoveredSegment(seg.id)}
                onMouseLeave={() => setHoveredSegment(null)}
                className={`flex items-center justify-between rounded-lg p-2 transition-all cursor-pointer ${
                  isHovered
                    ? "bg-white/10 scale-[1.02]"
                    : "hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: seg.color }}
                  />
                  <span className="text-xs font-medium text-[#c5c6ca]">
                    {seg.label}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-white">
                    {seg.count}
                  </span>{" "}
                  <span className="text-[11px] text-[#96989f]">
                    ({seg.pct}%)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </CoachCard>
  );
}
