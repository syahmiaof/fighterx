import type { Metadata } from "next";
import { AthleteHomeExperience } from "@/components/athlete/athlete-home-experience";

export const metadata: Metadata = {
  title: "Athlete Home | FighterX",
  description: "Ringkasan latihan dan semakan atlet FighterX.",
};

export default function AthleteHomePage() {
  return <AthleteHomeExperience />;
}
