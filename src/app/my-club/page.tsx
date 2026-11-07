import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "My Club · FighterX",
  description: "FighterX club access preview.",
};

export default function MyClubPage() {
  return (
    <>
      <SiteHeader currentPage="my-club" />
      <main className="club-gateway-page my-club-page">
        <section className="my-club-placeholder" aria-labelledby="my-club-title">
          <span className="my-club-placeholder-icon"><ShieldCheck size={25} aria-hidden="true" /></span>
          <p className="club-gateway-eyebrow"><span /> MY CLUB · PREVIEW ONLY <span /></p>
          <h1 id="my-club-title">Club access is not connected yet.</h1>
          <p>Club profile and application status will appear here after authentication and membership checks are connected.</p>
          <p className="my-club-data-note">No club, application or member information is loaded in this preview.</p>
          <Link href="/register-club" className="my-club-back"><ArrowLeft size={16} aria-hidden="true" /> Back to club access</Link>
        </section>
      </main>
    </>
  );
}
