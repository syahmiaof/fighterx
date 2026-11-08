"use client";

import React, { useState } from "react";

// ============================================================================
// 1. Line Chart Component: Training Completion & Attendance Trends (M1-M6)
// ============================================================================

export interface LineChartPoint {
  label: string; // e.g. "M1", "M2", "M3", "M4", "M5", "M6"
  value: number; // 0 to 100 percentage
  subtext?: string;
}

export interface AdminLineChartProps {
  data?: LineChartPoint[];
  title?: string;
  subtitle?: string;
  averageValue?: number;
  height?: number;
  className?: string;
}

const defaultLineData: LineChartPoint[] = [
  { label: "M1", value: 58, subtext: "Jan" },
  { label: "M2", value: 64, subtext: "Feb" },
  { label: "M3", value: 70, subtext: "Mac" },
  { label: "M4", value: 72, subtext: "Apr" },
  { label: "M5", value: 78, subtext: "Mei" },
  { label: "M6", value: 84, subtext: "Jun" },
];

export function AdminLineChart({
  data = defaultLineData,
  title = "Statistik Penyempurnaan Latihan & Kehadiran",
  subtitle = "Trend 6 Bulan Terkini (M1 - M6 2027)",
  averageValue = 76,
  height = 220,
  className = "",
}: AdminLineChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const svgWidth = 540;
  const svgHeight = height;
  const paddingLeft = 45;
  const paddingRight = 25;
  const paddingTop = 25;
  const paddingBottom = 40;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  // Compute coordinates for data points
  const points = data.map((d, i) => {
    const x =
      paddingLeft + (i / Math.max(data.length - 1, 1)) * chartWidth;
    const y =
      paddingTop + chartHeight - (d.value / 100) * chartHeight;
    return { ...d, x, y };
  });

  // Build SVG path string with smooth curves (cardinal spline / bezier approximation)
  const pathD = points.reduce((acc, curr, idx, arr) => {
    if (idx === 0) return `M ${curr.x} ${curr.y}`;
    const prev = arr[idx - 1];
    const cp1x = prev.x + (curr.x - prev.x) / 2;
    const cp1y = prev.y;
    const cp2x = prev.x + (curr.x - prev.x) / 2;
    const cp2y = curr.y;
    return `${acc} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
  }, "");

  // Area under the curve
  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];
  const baselineY = paddingTop + chartHeight;
  const areaD = `${pathD} L ${lastPoint.x} ${baselineY} L ${firstPoint.x} ${baselineY} Z`;

  return (
    <div
      className={`p-5 bg-[#17191E] border border-[#27272A] rounded-xl shadow-lg ${className}`}
    >
      {/* Header with Title and Average Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-[#27272A]">
        <div>
          <h4 className="text-base font-bold text-white tracking-wide">
            {title}
          </h4>
          <p className="text-xs text-[#96989F] mt-0.5">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-[#202126] border border-[#37383D] rounded-full">
            <span className="w-2 h-2 rounded-full bg-[#FF3845] animate-pulse" />
            <span className="text-xs text-[#C5C6CA]">
              Purata:{" "}
              <strong className="text-white font-bold">{averageValue}%</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Responsive SVG Chart */}
      <div className="w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto overflow-visible select-none"
        >
          <defs>
            {/* Linear gradient for area fill */}
            <linearGradient id="adminChartAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E10600" stopOpacity="0.35" />
              <stop offset="60%" stopColor="#E10600" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#E10600" stopOpacity="0.0" />
            </linearGradient>

            {/* Glowing filter for red curve */}
            <filter id="adminGlowFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#E10600" floodOpacity="0.6" />
            </filter>
          </defs>

          {/* Grid lines & Y-axis labels (0%, 25%, 50%, 75%, 100%) */}
          {[0, 25, 50, 75, 100].map((val) => {
            const y = paddingTop + chartHeight - (val / 100) * chartHeight;
            return (
              <g key={val}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={svgWidth - paddingRight}
                  y2={y}
                  stroke="#27272A"
                  strokeDasharray={val === 0 ? "none" : "3 3"}
                  strokeWidth="1"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 3}
                  textAnchor="end"
                  fill="#96989F"
                  fontSize="10"
                  fontFamily="monospace"
                >
                  {val}%
                </text>
              </g>
            );
          })}

          {/* Area fill */}
          <path d={areaD} fill="url(#adminChartAreaGrad)" />

          {/* Stroke path with crimson glow */}
          <path
            d={pathD}
            fill="none"
            stroke="#FF3845"
            strokeWidth="3"
            filter="url(#adminGlowFilter)"
            strokeLinecap="round"
          />

          {/* Data points & X-axis labels */}
          {points.map((pt, idx) => {
            const isHovered = hoveredIdx === idx;

            return (
              <g
                key={pt.label}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="cursor-pointer"
              >
                {/* Vertical hover guide */}
                {isHovered && (
                  <line
                    x1={pt.x}
                    y1={paddingTop}
                    x2={pt.x}
                    y2={baselineY}
                    stroke="#FF3845"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                    opacity="0.7"
                  />
                )}

                {/* Outer halo */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 8 : 5}
                  fill="#08090B"
                  stroke="#FF3845"
                  strokeWidth={isHovered ? "3" : "2"}
                  className="transition-all duration-150"
                />

                {/* Inner white core */}
                <circle cx={pt.x} cy={pt.y} r="2.5" fill="#FFFFFF" />

                {/* Hover Tooltip Value Callout */}
                {isHovered ? (
                  <g>
                    <rect
                      x={pt.x - 24}
                      y={pt.y - 28}
                      width="48"
                      height="20"
                      rx="4"
                      fill="#202126"
                      stroke="#FF3845"
                      strokeWidth="1"
                    />
                    <text
                      x={pt.x}
                      y={pt.y - 15}
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize="11"
                      fontWeight="bold"
                    >
                      {pt.value}%
                    </text>
                  </g>
                ) : null}

                {/* X-axis Label */}
                <text
                  x={pt.x}
                  y={baselineY + 18}
                  textAnchor="middle"
                  fill={isHovered ? "#FFFFFF" : "#E5E5E7"}
                  fontSize="11"
                  fontWeight="600"
                >
                  {pt.label}
                </text>
                {pt.subtext && (
                  <text
                    x={pt.x}
                    y={baselineY + 30}
                    textAnchor="middle"
                    fill="#96989F"
                    fontSize="9"
                  >
                    {pt.subtext}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

// ============================================================================
// 2. Donut Distribution Chart (Silat Seni vs Silat Olahraga / Subscriptions)
// ============================================================================

export interface DonutSegment {
  label: string;
  value: number;
  color: string;
  sublabel?: string;
}

export interface AdminDonutChartProps {
  segments?: DonutSegment[];
  title?: string;
  subtitle?: string;
  centerNumber?: string | number;
  centerLabel?: string;
  size?: number;
  className?: string;
}

const defaultDonutSegments: DonutSegment[] = [
  { label: "Silat Seni", value: 16, color: "#E10600", sublabel: "57.1%" },
  { label: "Silat Olahraga", value: 12, color: "#38BDF8", sublabel: "42.9%" },
];

export function AdminDonutChart({
  segments = defaultDonutSegments,
  title = "Pecahan Atlet Mengikut Disiplin",
  subtitle = "Pendaftaran Disiplin Tunggal",
  centerNumber = 28,
  centerLabel = "Jumlah Atlet",
  size = 180,
  className = "",
}: AdminDonutChartProps) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);

  const radius = 64;
  const strokeWidth = 18;
  const circumference = 2 * Math.PI * radius;

  // Compute strokeDasharray and offsets
  const arcSegments: Array<(typeof segments)[number] & {
    percent: number;
    strokeDasharray: string;
    strokeDashoffset: number;
  }> = [];
  let runningPercent = 0;
  for (const seg of segments) {
    const percent = total > 0 ? seg.value / total : 0;
    const strokeDasharray = `${percent * circumference} ${circumference}`;
    const strokeDashoffset = -(runningPercent * circumference);
    runningPercent += percent;
    arcSegments.push({
      ...seg,
      percent: Math.round(percent * 100),
      strokeDasharray,
      strokeDashoffset,
    });
  }

  return (
    <div
      className={`p-5 bg-[#17191E] border border-[#27272A] rounded-xl shadow-lg flex flex-col justify-between ${className}`}
    >
      {/* Header */}
      <div className="mb-4 pb-3 border-b border-[#27272A]">
        <h4 className="text-base font-bold text-white tracking-wide">{title}</h4>
        {subtitle && (
          <p className="text-xs text-[#96989F] mt-0.5">{subtitle}</p>
        )}
      </div>

      {/* Chart Center and SVG */}
      <div className="flex flex-col sm:flex-row items-center justify-around gap-6 my-2">
        <div className="relative flex items-center justify-center">
          <svg
            width={size}
            height={size}
            viewBox="0 0 160 160"
            className="transform -rotate-90 overflow-visible"
          >
            {/* Background track */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="transparent"
              stroke="#202126"
              strokeWidth={strokeWidth}
            />

            {/* Arcs */}
            {arcSegments.map((arc) => (
              <circle
                key={arc.label}
                cx="80"
                cy="80"
                r={radius}
                fill="transparent"
                stroke={arc.color}
                strokeWidth={strokeWidth}
                strokeDasharray={arc.strokeDasharray}
                strokeDashoffset={arc.strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-300"
              />
            ))}
          </svg>

          {/* Central Statistics Pillar */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="text-2xl font-black text-white leading-none">
              {centerNumber}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-[#96989F] font-semibold mt-1">
              {centerLabel}
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-3 w-full sm:w-auto">
          {arcSegments.map((seg) => (
            <div
              key={seg.label}
              className="flex items-center justify-between sm:justify-start gap-4 p-2 rounded-lg bg-[#202126]/60 border border-[#27272A]"
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: seg.color }}
                />
                <span className="text-xs font-semibold text-[#E5E5E7]">
                  {seg.label}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-white mr-2">
                  {seg.value}
                </span>
                <span className="text-[11px] text-[#96989F]">
                  ({seg.percent}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
