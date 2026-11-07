"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Building2, ChevronRight, ShieldCheck } from "lucide-react";
import { uiOnlyAuthGateway } from "@/lib/auth/ui-only-auth";

export function ClubAccessGateway() {
  const router = useRouter();
  const [checkingSession, setCheckingSession] = useState(false);

  async function openClubAccess() {
    if (checkingSession) return;
    setCheckingSession(true);
    try {
      const session = await uiOnlyAuthGateway.getSession();
      if (session.status === "authenticated") {
        router.push("/my-club");
        return;
      }
      router.push("/login?returnTo=%2Fmy-club");
    } catch {
      router.push("/login?returnTo=%2Fmy-club");
    } finally {
      setCheckingSession(false);
    }
  }

  return (
    <main className="club-gateway-page">
      <div className="club-gateway-wrap">
        <header className="club-gateway-intro">
          <p className="club-gateway-eyebrow"><span /> FIGHTERX CLUB ACCESS <span /></p>
          <h1>Your Club. <em>Your Journey.</em></h1>
          <p className="club-gateway-lede">Daftarkan kelab silat anda, atau akses ruang kelab sedia ada.</p>
        </header>
        <section className="club-gateway-options" aria-label="Club access options">
          <article className="club-gateway-card club-gateway-card-register">
            <div className="club-gateway-card-top">
              <span className="club-gateway-icon"><Building2 size={23} strokeWidth={1.7} aria-hidden="true" /></span>
              <span className="club-gateway-kicker">30 DAYS FREE TRIAL</span>
            </div>
            <h2>Register New Club</h2>
            <p>Daftarkan kelab atau akademi silat anda dan mulakan perjalanan bersama FighterX.</p>
            <Link className="club-gateway-action club-gateway-action-primary" href="/register-club/new">
              Register Club <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </article>
          <article className="club-gateway-card club-gateway-card-access">
            <div className="club-gateway-card-top">
              <span className="club-gateway-icon"><ShieldCheck size={23} strokeWidth={1.7} aria-hidden="true" /></span>
              <span className="club-gateway-kicker">FOR REGISTERED CLUBS</span>
            </div>
            <h2>My Club</h2>
            <p>Sign in to check access to your club workspace and application status.</p>
            <button className="club-gateway-action club-gateway-action-secondary" type="button" onClick={openClubAccess} disabled={checkingSession}>
              {checkingSession ? "Checking access…" : "Access My Club"}
              {!checkingSession && <ChevronRight size={18} aria-hidden="true" />}
            </button>
          </article>
        </section>
        <p className="club-gateway-boundary">Authentication, membership and management permissions are not connected in this preview. No club data is loaded.</p>
      </div>
    </main>
  );
}
