"use client";

import Link from "next/link";
import { Suspense } from "react";
import { SiteHeader } from "@/components/site-header";
import { RegisterClubForm } from "@/components/register-club/register-club-form";
import { ShieldCheck, Sparkles, Trophy } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export function RegisterClubFormPage() {
  const { dict, locale } = useLanguage();
  const rf = dict.auth.registerForm;

  return (
    <>
      <SiteHeader currentPage="register" />
      <main className="register-page relative min-h-[calc(100svh-64px)] pb-16">
        <div className="register-wrap max-w-4xl mx-auto px-4 pt-10 sm:pt-14">
          <section className="register-intro text-center mb-8" aria-labelledby="register-title">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/30 bg-red-950/30 text-red-400 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles size={13} /> {rf.badge}
            </div>

            <h1
              id="register-title"
              className="text-4xl sm:text-5xl md:text-6xl font-bold uppercase text-white tracking-tight"
              style={{ fontFamily: "var(--font-athletic)" }}
            >
              {locale === "bm" ? "DAFTAR KELAB" : "REGISTER CLUB"}{" "}
              <span className="text-red-600">FIGHTERX</span>
            </h1>

            <p className="mt-3 text-sm sm:text-base text-neutral-300 max-w-2xl mx-auto leading-relaxed">
              {rf.subtitle}
            </p>

            {/* Trial & Pricing Banner */}
            <div
              className="mt-6 mx-auto max-w-xl rounded-lg border border-[#45464b] bg-gradient-to-r from-[#16171d]/90 via-[#101115]/90 to-[#16171d]/90 p-3 sm:p-4 shadow-xl backdrop-blur-sm"
              aria-label="Pakej percubaan dan harga langganan kelab"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-[#2d2e35] gap-3 sm:gap-4 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded bg-emerald-950/60 border border-emerald-600/40 flex items-center justify-center text-emerald-400 flex-none">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <strong className="block text-sm font-bold text-white">{rf.pricingTrial}</strong>
                    <span className="text-[11px] text-neutral-400">
                      {locale === "en" ? "Starts after account verification" : "Bermula selepas pengesahan akaun"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-3 sm:pt-0 sm:pl-4">
                  <div className="w-9 h-9 rounded bg-red-950/60 border border-red-600/40 flex items-center justify-center text-red-400 flex-none">
                    <Trophy size={18} />
                  </div>
                  <div>
                    <strong className="block text-sm font-bold text-white">
                      {rf.pricingRate}
                    </strong>
                    <span className="text-[11px] text-neutral-400">
                      {locale === "en" ? "For 1 club · No upfront payment" : "Untuk 1 kelab · Tiada bayaran awal"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <p className="register-signin mt-4 text-xs text-neutral-400">
              {rf.alreadyRegistered}{" "}
              <Link
                href="/login"
                className="text-white font-semibold underline underline-offset-4 hover:text-red-400 transition-colors"
              >
                {locale === "en" ? "Portal Sign In" : "Log Masuk Portal"}
              </Link>
            </p>
          </section>

          <Suspense
            fallback={
              <div className="text-white text-center py-12">
                <p className="text-sm text-neutral-400">
                  {locale === "en" ? "Loading club registration form..." : "Memuatkan borang pendaftaran kelab..."}
                </p>
              </div>
            }
          >
            <RegisterClubForm />
          </Suspense>
        </div>
      </main>
    </>
  );
}
