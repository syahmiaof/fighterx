"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Building2, ChevronRight, ShieldCheck } from "lucide-react";
import { uiOnlyAuthGateway } from "@/lib/auth/ui-only-auth";
import { useLanguage } from "@/lib/i18n";

function ClubAccessGatewayContent() {
  const { dict, locale } = useLanguage();
  const gw = dict.auth.gateway;
  const router = useRouter();
  const searchParams = useSearchParams();
  const [checkingSession, setCheckingSession] = useState(false);

  const associationParam = searchParams.get("association");
  const registerHref = associationParam
    ? `/register-club/new?association=${encodeURIComponent(associationParam)}`
    : "/register-club/new";

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
          <p className="club-gateway-eyebrow"><span /> {gw.eyebrow} <span /></p>
          <h1>Your Club. <em>Your Journey.</em></h1>
          <p className="club-gateway-lede">{gw.subtitle}</p>
        </header>
        <section className="club-gateway-options" aria-label="Club access options">
          <article className="club-gateway-card club-gateway-card-register">
            <div className="club-gateway-card-top">
              <span className="club-gateway-icon"><Building2 size={23} strokeWidth={1.7} aria-hidden="true" /></span>
              <span className="club-gateway-kicker">{gw.registerCardTrial}</span>
            </div>
            <h2>{gw.registerCardTitle}</h2>
            <p>{gw.registerCardDesc}</p>
            <Link className="club-gateway-action club-gateway-action-primary" href={registerHref}>
              {gw.registerCardBtn} <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </article>
          <article className="club-gateway-card club-gateway-card-access">
            <div className="club-gateway-card-top">
              <span className="club-gateway-icon"><ShieldCheck size={23} strokeWidth={1.7} aria-hidden="true" /></span>
              <span className="club-gateway-kicker">{gw.myClubCardEyebrow}</span>
            </div>
            <h2>{gw.myClubCardTitle}</h2>
            <p>{gw.myClubCardDesc}</p>
            <button className="club-gateway-action club-gateway-action-secondary" type="button" onClick={openClubAccess} disabled={checkingSession}>
              {checkingSession ? "Checking access..." : gw.myClubCardBtn}
              {!checkingSession && <ChevronRight size={18} aria-hidden="true" />}
            </button>
          </article>
        </section>
        <p className="club-gateway-boundary">{gw.boundaryNote}</p>
      </div>
    </main>
  );
}

export function ClubAccessGateway() {
  return (
    <Suspense
      fallback={
        <main className="club-gateway-page min-h-[50vh] flex items-center justify-center text-white">
          <p>Memuatkan FighterX Club Access...</p>
        </main>
      }
    >
      <ClubAccessGatewayContent />
    </Suspense>
  );
}
