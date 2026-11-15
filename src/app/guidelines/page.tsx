import type { Metadata } from "next";
import { GuidelinesView } from "@/components/guidelines/guidelines-view";

export const metadata: Metadata = {
  title: "Peraturan Pertandingan PERSILAT 2026 · Panduan Rasmi FighterX",
  description:
    "Rujukan rasmi Peraturan Pertandingan Pencak Silat Antarabangsa PERSILAT 2026: panduan mata Silat Olahraga, had 5 saat jatuhan, rubrik Silat Seni, dan struktur pemarkahan rasmi.",
};

export default function GuidelinesPage() {
  return <GuidelinesView />;
}
