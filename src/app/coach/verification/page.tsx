"use client";

import React, { useState, useMemo } from "react";
import { Search, ClipboardCheck } from "lucide-react";
import { useCoachState } from "@/lib/coach/store";
import { CoachTabs, type CoachTabItem } from "@/components/coach/ui/coach-tabs";
import { VerificationQueueTable } from "@/components/coach/verification/verification-queue-table";

export default function VerificationQueuePage() {
  const { submissions } = useCoachState();
  const [activeTab, setActiveTab] = useState<string>("PENDING");
  const [searchQuery, setSearchQuery] = useState("");
  const [disciplineFilter, setDisciplineFilter] = useState<string>("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");

  // Tab counts
  const pendingCount = submissions.filter((s) => s.status === "PENDING").length;
  const verifiedCount = submissions.filter((s) => s.status === "VERIFIED").length;
  const correctionCount = submissions.filter((s) => s.status === "CORRECTION").length;
  const rejectedCount = submissions.filter((s) => s.status === "REJECTED").length;

  const tabs: CoachTabItem[] = [
    { id: "ALL", label: "Semua", count: submissions.length },
    { id: "PENDING", label: "Menunggu Semakan", count: pendingCount },
    { id: "VERIFIED", label: "Disahkan", count: verifiedCount },
    { id: "CORRECTION", label: "Perlu Pembetulan", count: correctionCount },
    { id: "REJECTED", label: "Ditolak", count: rejectedCount },
  ];

  // Categories list
  const categories = ["ALL", "Push-up", "Larian 6 Minit", "Plank", "Knee to Wall", "Teknik Seni", "Teknik Olahraga"];

  // Filtered submissions
  const filteredSubmissions = useMemo(() => {
    return submissions.filter((sub) => {
      // Tab filter
      if (activeTab !== "ALL" && sub.status !== activeTab) {
        return false;
      }

      // Search query (athlete name, exercise name)
      if (
        searchQuery &&
        !sub.athleteName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !sub.exerciseName.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Discipline filter
      if (disciplineFilter !== "ALL" && sub.discipline !== disciplineFilter) {
        return false;
      }

      // Category filter
      if (categoryFilter !== "ALL" && sub.category !== categoryFilter) {
        return false;
      }

      return true;
    });
  }, [submissions, activeTab, searchQuery, disciplineFilter, categoryFilter]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <ClipboardCheck size={26} className="text-[#ff3845]" />
            Verifikasi Latihan
          </h1>
          <p className="text-xs text-[#96989f] mt-1">
            Semak, beri maklum balas, dan sahkan video latihan atlet
          </p>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <CoachTabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={(tabId) => setActiveTab(tabId)}
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#96989f]"
          />
          <input
            type="text"
            placeholder="Cari nama atlet atau nama latihan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-[#45464b]/60 bg-[#17191e] py-2 pl-10 pr-4 text-xs text-white placeholder-[#96989f] focus:border-[#ff3845] focus:outline-none focus:ring-1 focus:ring-[#ff3845]"
          />
        </div>

        {/* Discipline Filter */}
        <div className="flex items-center gap-2">
          <select
            value={disciplineFilter}
            onChange={(e) => setDisciplineFilter(e.target.value)}
            className="rounded-lg border border-[#45464b]/60 bg-[#17191e] py-2 px-3 text-xs text-white focus:border-[#ff3845] focus:outline-none"
          >
            <option value="ALL">Semua Disiplin</option>
            <option value="Silat Olahraga">Silat Olahraga</option>
            <option value="Silat Seni">Silat Seni</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-lg border border-[#45464b]/60 bg-[#17191e] py-2 px-3 text-xs text-white focus:border-[#ff3845] focus:outline-none"
          >
            <option value="ALL">Semua Kategori</option>
            {categories.slice(1).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Submissions Queue Table */}
      <VerificationQueueTable submissions={filteredSubmissions} />
    </div>
  );
}
