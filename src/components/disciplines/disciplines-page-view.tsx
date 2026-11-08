"use client";

import { useState } from "react";
import { DisciplinesHero } from "@/components/disciplines/disciplines-hero";
import { CategoryComparisonMatrix } from "@/components/disciplines/category-comparison-matrix";
import { SilatSeniSection } from "@/components/disciplines/silat-seni-section";
import { SilatOlahragaSection } from "@/components/disciplines/silat-olahraga-section";
import { EquipmentBreakdown } from "@/components/disciplines/equipment-breakdown";
import { DisciplinesCTA } from "@/components/disciplines/disciplines-cta";

export function DisciplinesPageView() {
  const [activeSection, setActiveSection] = useState("overview");

  function handleNavigate(sectionId: string) {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <div className="disciplines-content">
      <DisciplinesHero
        activeSection={activeSection}
        onNavigateSection={handleNavigate}
      />
      <CategoryComparisonMatrix />
      <SilatSeniSection />
      <SilatOlahragaSection />
      <EquipmentBreakdown />
      <DisciplinesCTA />
    </div>
  );
}
