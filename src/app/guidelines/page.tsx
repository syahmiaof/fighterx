import type { Metadata } from "next";
import { GuidelinesView } from "@/components/guidelines/guidelines-view";

export const metadata: Metadata = {
  title: "Peraturan Pertandingan PERSILAT 2026 · Panduan Rasmi FighterX",
  description:
    "Rujukan interaktif rasmi Peraturan Pertandingan Pencak Silat Antarabangsa PERSILAT 2026: panduan mata tanding, had 5 saat jatuhan, rubrik seni, dan kalkulator pemarkahan.",
};

export default function GuidelinesPage() {
  return <GuidelinesView />;
}
