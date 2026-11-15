"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { SiteHeader } from "@/components/layout/site-header";
import { AssociationMarquee } from "./association-marquee";
import { AnimatedStats } from "./animated-stats";
import { ValueProposition } from "./value-proposition";
import { PesakaRecognition } from "./pesaka-recognition";
import { AthleteCoachSpotlight } from "./athlete-coach-spotlight";
import { LeaderboardCalendarPreview } from "./leaderboard-calendar-preview";
import { CollaborationPreview } from "./collaboration-preview";
import { TestimonialsSection } from "./testimonials-section";
import { useLanguage } from "@/lib/i18n";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  CalendarCheck2,
  ChartNoAxesColumn,
  ClipboardCheck,
  Dumbbell,
  Ellipsis,
  Home,
  ShieldCheck,
  Users,
} from "lucide-react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const features = [
  { icon: BarChart3, title: "Athlete Analytics", body: "Track progress and performance trends." },
  { icon: CalendarDays, title: "Structured Programmes", body: "Periodised training for Seni and Olahraga." },
  { icon: ClipboardCheck, title: "Monitoring & Evaluation", body: "Assess readiness, workload and development." },
  { icon: Users, title: "Club & Athlete Management", body: "Keep athletes, programmes and training data connected." },
];

const workflow = [
  { title: "Set Up", body: "Create your club, add athletes, and choose Silat Seni or Silat Olahraga.", icon: Users },
  { title: "Plan & Train", body: "Use structured programmes and submit training with evidence.", icon: Dumbbell },
  { title: "Monitor & Grow", body: "Review verified progress and make data-informed decisions.", icon: BarChart3 },
];

function BrandWordmark() {
  const { locale } = useLanguage();
  return (
    <Link className="brand" href="/" aria-label="FighterX home">
      <span className="brand-copy">
        <strong>
          FIGHTER<span>X</span>
        </strong>
        <small>{locale === "bm" ? "PLATFORM ATLET SILAT" : "SILAT ATHLETE PLATFORM"}</small>
      </span>
    </Link>
  );
}

function RevealWords({ text }: { text: string }) {
  const words = text.split(/\s+/);
  return (
    <>
      {words.map((word, index) => (
        <span className="motion-word" key={`${word}-${index}`}>
          {word}
        </span>
      ))}
    </>
  );
}

function PhonePreview() {
  const { locale } = useLanguage();
  return (
    <div
      className="phone-stage"
      aria-label={
        locale === "bm"
          ? "Pratonton ilustrasi aplikasi atlet FighterX"
          : "Illustrative preview of the FighterX athlete app"
      }
    >
      <span className="preview-disclaimer">
        {locale === "bm" ? "PRATONTON ILUSTRASI" : "ILLUSTRATIVE PREVIEW"}
      </span>
      <div className="phone phone-main">
        <div className="phone-notch" />
        <div className="phone-status">
          <span>9:41</span>
          <span>● ● ▰</span>
        </div>
        <div className="phone-brand">
          FIGHTER<span>X</span>
        </div>
        <p className="phone-greeting">
          {locale === "bm" ? "Selamat pagi," : "Good morning,"}
          <br />
          <b>{locale === "bm" ? "Atlet" : "Athlete"}</b>
        </p>
        <div className="phone-program">
          <span className="phone-icon">
            <CalendarDays size={14} />
          </span>
          <div>
            <small>{locale === "bm" ? "PROGRAM ANDA" : "YOUR PROGRAMME"}</small>
            <b>Silat Olahraga · {locale === "bm" ? "Blok 1" : "Block 1"}</b>
          </div>
        </div>
        <div className="phone-progress">
          <div>
            <span>{locale === "bm" ? "Kemajuan mingguan" : "Weekly progress"}</span>
            <b>72%</b>
          </div>
          <i>
            <i />
          </i>
        </div>
        <div className="phone-row">
          <Dumbbell size={14} /> {locale === "bm" ? "Pelan latihan" : "Training plan"} <ArrowRight size={13} />
        </div>
        <div className="phone-row">
          <BarChart3 size={14} /> {locale === "bm" ? "Prestasi" : "Performance"} <ArrowRight size={13} />
        </div>
        <div className="phone-row">
          <ShieldCheck size={14} /> {locale === "bm" ? "Penilaian" : "Evaluation"} <ArrowRight size={13} />
        </div>
        <div className="phone-nav">
          <Home size={10} />
          <CalendarCheck2 size={10} />
          <ChartNoAxesColumn size={10} />
          <Ellipsis size={10} />
        </div>
      </div>
      <div className="phone phone-back">
        <div className="phone-notch" />
        <div className="phone-status">
          <span>9:41</span>
          <span>● ● ▰</span>
        </div>
        <div className="phone-back-head">
          <span>‹</span> {locale === "bm" ? "Prestasi" : "Performance"}
        </div>
        <div className="discipline-switch">
          <span>Seni</span>
          <b>Olahraga</b>
        </div>
        <div className="radar-wrap">
          <svg viewBox="0 0 190 190" role="img" aria-label={locale === "bm" ? "Carta radar prestasi atlet ilustrasi" : "Illustrative athlete performance radar chart"}>
            <polygon points="95,18 158,63 134,141 56,141 32,63" className="radar-grid" />
            <polygon points="95,39 142,71 124,124 63,133 49,68" className="radar-grid" />
            <polygon points="95,52 132,76 117,116 70,124 58,72" className="radar-data" />
            <path d="M95 18v34m63 11-26 13M134 141l-17-25M56 141l14-17M32 63l26 9" className="radar-lines" />
          </svg>
          <span className="radar-label radar-top">{locale === "bm" ? "Teknik" : "Technique"}</span>
          <span className="radar-label radar-right">{locale === "bm" ? "Kepantasan" : "Speed"}</span>
          <span className="radar-label radar-bottom">{locale === "bm" ? "Daya Tahan" : "Endurance"}</span>
          <span className="radar-label radar-left">{locale === "bm" ? "Kawalan" : "Control"}</span>
        </div>
      </div>
      <span className="phone-light" aria-hidden="true" />
    </div>
  );
}

function Hero() {
  const { d } = useLanguage();
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-backdrop" />
      <Image
        className="hero-smoke"
        src="/assets/fighterx/overlay-red-smoke-transparent.png"
        alt=""
        fill
        sizes="100vw"
      />
      <Image
        className="hero-athlete hero-athlete-left"
        src="/assets/fighterx/hero-silat-seni-athlete-lit.png"
        alt="Silat Seni athlete in a traditional kneeling stance"
        width={957}
        height={1024}
        priority
        sizes="(max-width: 700px) 58vw, 35vw"
      />
      <Image
        className="hero-athlete hero-athlete-right"
        src="/assets/fighterx/hero-silat-olahraga-athlete-lit.png"
        alt="Silat Olahraga athlete in a black uniform and red protective chest gear"
        width={1375}
        height={1144}
        priority
        sizes="(max-width: 700px) 70vw, 40vw"
      />

      {/* Hero Athlete Credit Infographics */}
      <aside className="hero-athlete-badge hero-athlete-badge-left" aria-label={`Kredit Atlet Silat Seni: ${d.home.athleteCreditSeni.name}`}>
        <span className="athlete-badge-indicator gold" aria-hidden="true" />
        <div className="athlete-badge-content">
          <strong className="athlete-badge-name">{d.home.athleteCreditSeni.name}</strong>
          <span className="athlete-badge-title">{d.home.athleteCreditSeni.title}</span>
        </div>
      </aside>

      <aside className="hero-athlete-badge hero-athlete-badge-right" aria-label={`Kredit Atlet Silat Olahraga: ${d.home.athleteCreditOlahraga.name}`}>
        <span className="athlete-badge-indicator red" aria-hidden="true" />
        <div className="athlete-badge-content">
          <strong className="athlete-badge-name">{d.home.athleteCreditOlahraga.name}</strong>
          <span className="athlete-badge-title">{d.home.athleteCreditOlahraga.title}</span>
        </div>
      </aside>
      <div className="hero-copy">
        <Image
          className="hero-basmala"
          src="/assets/fighterx/bismillah-calligraphy.png"
          alt="بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ"
          width={2172}
          height={724}
          sizes="(max-width: 760px) 170px, 210px"
          priority
        />
        <div className="hero-overline">
          <span className="hero-overline-rule" />
          {d.home.heroOverline}
          <span className="hero-overline-rule" />
        </div>
        <h1 id="hero-title" className="motion-heading" aria-label={`${d.home.heroTitleLine1} ${d.home.heroTitleLine2}`}>
          <span className="motion-line">
            <RevealWords text={d.home.heroTitleLine1} />
          </span>
          <em className="motion-line">
            <RevealWords text={d.home.heroTitleLine2} />
          </em>
        </h1>
        <p className="motion-intro-copy">
          {d.home.heroDescription}
        </p>

        {/* Exact quote callout element enclosed in red accent rules with italic styling */}
        <div className="hero-quote-callout" role="note" aria-label={`${d.home.heroQuote} ${d.home.heroQuoteHighlight}`}>
          <span className="hero-quote-rule" aria-hidden="true" />
          <blockquote className="hero-quote-text">
            &ldquo;{d.home.heroQuote} <span className="hero-quote-highlight">{d.home.heroQuoteHighlight}</span>&rdquo;
          </blockquote>
          <span className="hero-quote-rule" aria-hidden="true" />
        </div>

      </div>
    </section>
  );
}

function FeatureRail() {
  const { d } = useLanguage();
  const localizedFeatures = [
    { icon: BarChart3, title: d.home.features.analyticsTitle, body: d.home.features.analyticsBody },
    { icon: CalendarDays, title: d.home.features.programmesTitle, body: d.home.features.programmesBody },
    { icon: ClipboardCheck, title: d.home.features.monitoringTitle, body: d.home.features.monitoringBody },
    { icon: Users, title: d.home.features.managementTitle, body: d.home.features.managementBody },
  ];
  return (
    <section className="feature-rail motion-grid" id="features" aria-label="FighterX platform features">
      {localizedFeatures.map(({ icon: Icon, title, body }) => (
        <article className="feature-item" key={title}>
          <span className="feature-icon">
            <Icon size={23} strokeWidth={1.8} />
          </span>
          <div>
            <h2>{title}</h2>
            <p>{body}</p>
          </div>
        </article>
      ))}
    </section>
  );
}

function HowItWorks() {
  const { d, locale } = useLanguage();
  const localizedWorkflow = [
    { title: d.home.workflow.step1Title, body: d.home.workflow.step1Body, icon: Users },
    { title: d.home.workflow.step2Title, body: d.home.workflow.step2Body, icon: Dumbbell },
    { title: d.home.workflow.step3Title, body: d.home.workflow.step3Body, icon: BarChart3 },
  ];
  return (
    <section className="workflow section-wrap" id="how-it-works">
      <div className="workflow-heading">
        <h2 className="motion-heading" aria-label={d.home.workflow.title}>
          <span className="motion-line">
            <RevealWords text={d.home.workflow.title} />
          </span>
        </h2>
        <span className="heading-rule" />
        <p className="workflow-intro motion-copy">
          {locale === "bm"
            ? "Daripada perancangan awal hingga kemajuan yang disahkan, semua pihak melihat langkah seterusnya."
            : "From the first plan to verified progress, everyone sees the next step."}
        </p>
      </div>
      <div className="workflow-steps motion-grid">
        {localizedWorkflow.map(({ title, body, icon: Icon }, index) => (
          <article className="workflow-step" key={title}>
            <span className="step-number">0{index + 1}</span>
            <Icon size={23} strokeWidth={1.7} />
            <h3>{title}</h3>
            <p>{body}</p>
            {index < localizedWorkflow.length - 1 && <ArrowRight className="step-arrow" size={22} aria-hidden="true" />}
          </article>
        ))}
      </div>
      <PhonePreview />
    </section>
  );
}

function Programmes() {
  const { d } = useLanguage();
  return (
    <section className="programmes section-wrap" id="disciplines">
      <div className="programmes-heading">
        <div>
          <h2 className="motion-heading" aria-label={d.home.programmes.title}>
            <span className="motion-line">
              <RevealWords text={d.home.programmes.title} />
            </span>
          </h2>
        </div>
        <span className="heading-rule" />
      </div>
      <div className="programme-grid motion-grid">
        <article className="programme-card programme-seni">
          <Image
            className="programme-athlete programme-athlete-seni"
            src="/assets/fighterx/programme-silat-seni-lit.png"
            alt="Silat Seni performer in a traditional sword stance"
            width={1252}
            height={1014}
            sizes="(max-width: 700px) 76vw, 28vw"
          />
          <div className="programme-info">
            <div className="programme-title">
              <span className="discipline-icon discipline-icon-seni" aria-hidden="true" />
              <h3>{d.home.programmes.seniTitle}</h3>
            </div>
            <p>{d.home.programmes.seniDesc}</p>
            <Link href="/disciplines" className="text-link">
              {d.home.programmes.seniCta} <ArrowRight size={15} />
            </Link>
          </div>
        </article>
        <article className="programme-card programme-olahraga">
          <Image
            className="programme-athlete programme-athlete-olahraga"
            src="/assets/fighterx/programme-silat-olahraga-lit.png"
            alt="Silat Olahraga athletes sparring in a kick counter"
            width={1276}
            height={1137}
            sizes="(max-width: 700px) 76vw, 28vw"
          />
          <div className="programme-info">
            <div className="programme-title">
              <span className="discipline-icon discipline-icon-olahraga" aria-hidden="true" />
              <h3>{d.home.programmes.olahragaTitle}</h3>
            </div>
            <p>{d.home.programmes.olahragaDesc}</p>
            <Link href="/disciplines" className="text-link">
              {d.home.programmes.olahragaCta} <ArrowRight size={15} />
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}

function FAQ() {
  const { d } = useLanguage();
  const items = [
    [d.home.faq.q1, d.home.faq.a1],
    [d.home.faq.q2, d.home.faq.a2],
    [d.home.faq.q3, d.home.faq.a3],
  ];
  return (
    <section className="faq section-wrap" id="faq">
      <div>
        <h2 className="motion-heading" aria-label={d.home.faq.title}>
          <RevealWords text={d.home.faq.title} />
        </h2>
      </div>
      <div className="faq-list motion-faq">
        {items.map(([question, answer]) => (
          <details key={question}>
            <summary>
              {question}
              <span aria-hidden="true">+</span>
            </summary>
            <p>{answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function FooterCTA() {
  const { d, locale } = useLanguage();
  return (
    <footer className="footer-cta relative" id="register">
      <Image
        className="footer-smoke"
        src="/assets/fighterx/bg-silat-mountains.webp"
        alt=""
        fill
        sizes="100vw"
      />
      <div className="footer-cta-inner pt-10 pb-8 sm:pt-14 sm:pb-10">
        <span className="footer-silhouette">
          <Image
            src="/assets/fighterx/silhouette-silat-stance-transparent.png"
            alt=""
            width={74}
            height={68}
          />
        </span>
        <h2>
          {d.home.cta.title.split(".")[0]}.
          <br />
          {d.home.cta.title.split(".")[1] ? d.home.cta.title.split(".")[1] + "." : ""}
        </h2>
        <Link href="/register-club" className="button button-primary">
          {d.home.cta.button} <ArrowRight size={17} />
        </Link>
      </div>

      {/* Integrated Footer Bar */}
      <div className="footer-bottom-bar border-t border-white/10 relative z-10 max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="footer-brand-left">
          <BrandWordmark />
        </div>
        <p className="footer-author-right text-xs text-[#96989F] m-0 text-center sm:text-right">
          Built by{" "}
          <a
            href="https://syahmiaof.my"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-[#FF3845] transition-colors font-medium underline-offset-4 hover:underline"
          >
            syahmiaof.my
          </a>
        </p>
      </div>

      {/* Screen Reader Links */}
      <div className="sr-only" aria-hidden="true">
        <Link href="/associations">{locale === "bm" ? "Direktori Persatuan" : "Association Directory"}</Link>
        <Link href="/guidelines">{locale === "bm" ? "Peraturan PERSILAT" : "PERSILAT Rules"}</Link>
        <Link href="/disciplines">{locale === "bm" ? "Kategori Silat" : "Silat Disciplines"}</Link>
      </div>
    </footer>
  );
}

export function HomePage() {
  const { locale } = useLanguage();
  const pageRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const page = pageRef.current;
      if (!page) return;

      const motion = gsap.matchMedia();
      motion.add(
        {
          isDesktop: "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
          isMobile: "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { isDesktop, isMobile, reduceMotion } = context.conditions!;

          if (reduceMotion) {
            // Settle all elements immediately
            gsap.set(
              ".hero .motion-word, .hero-overline, .hero-athlete, .hero-athlete-badge, .motion-intro-copy, .hero-quote-callout, .hero-actions, .motion-heading .motion-word, .motion-grid > *, .motion-copy, .footer-cta-inner, .motion-faq details, .association-marquee-section",
              {
                autoAlpha: 1,
                clearProps: "all",
              }
            );
            return;
          }

          if (isDesktop) {
            // HIGH-IMPACT cinematic desktop hero arrival — slow enough to be clearly perceived
            const intro = gsap.timeline({ defaults: { ease: "power4.out" }, delay: 0.1 });
            intro
              .fromTo(
                page.querySelectorAll(".hero .motion-word"),
                { yPercent: 100, rotateX: -15, autoAlpha: 0 },
                { yPercent: 0, rotateX: 0, autoAlpha: 1, duration: 0.85, stagger: 0.1, clearProps: "transform" }
              )
              .fromTo(
                page.querySelector(".hero-basmala"),
                { y: -20, autoAlpha: 0 },
                { y: 0, autoAlpha: 1, duration: 0.8, ease: "power2.out", clearProps: "transform" },
                "<0.05"
              )
              .fromTo(
                page.querySelector(".hero-overline"),
                { y: 20, autoAlpha: 0, scale: 0.9 },
                { y: 0, autoAlpha: 1, scale: 1, duration: 0.7, clearProps: "transform" },
                "<0.15"
              )
              .fromTo(
                page.querySelectorAll(".hero-athlete"),
                { y: 80, autoAlpha: 0, scale: 0.93 },
                { y: 0, autoAlpha: 1, scale: 1, duration: 1.2, stagger: 0.18, ease: "power3.out", clearProps: "transform" },
                "<0.1"
              )
              .fromTo(
                page.querySelectorAll(".hero-athlete-badge"),
                { y: 24, autoAlpha: 0, scale: 0.82 },
                { y: 0, autoAlpha: 1, scale: 1, duration: 0.65, stagger: 0.12, ease: "back.out(1.6)", clearProps: "transform" },
                "-=0.4"
              )
              .fromTo(
                page.querySelector(".hero-copy > .motion-intro-copy"),
                { y: 24, autoAlpha: 0 },
                { y: 0, autoAlpha: 1, duration: 0.65, clearProps: "transform" },
                "<0.2"
              )
              .fromTo(
                page.querySelector(".hero-quote-callout"),
                { y: 24, autoAlpha: 0 },
                { y: 0, autoAlpha: 1, duration: 0.65, clearProps: "transform" },
                "<0.15"
              );

            const heroActions = page.querySelector(".hero-actions");
            if (heroActions) {
              intro.fromTo(
                heroActions,
                { y: 24, autoAlpha: 0 },
                { y: 0, autoAlpha: 1, duration: 0.65, clearProps: "transform" },
                "<0.15"
              );
            }
          }

          if (isMobile) {
            // Energetic mobile hero arrival: visible kinetic slide & punchy cutouts
            const mobileIntro = gsap.timeline({ defaults: { ease: "power3.out" } });
            mobileIntro
              .fromTo(
                page.querySelectorAll(".hero .motion-word"),
                { yPercent: 65, autoAlpha: 0 },
                { yPercent: 0, autoAlpha: 1, duration: 0.55, stagger: 0.05, clearProps: "transform" }
              )
              .fromTo(
                page.querySelector(".hero-overline"),
                { y: 10, autoAlpha: 0 },
                { y: 0, autoAlpha: 1, duration: 0.35, clearProps: "transform" },
                "<0.05"
              )
              .fromTo(
                page.querySelectorAll(".hero-athlete"),
                { y: 32, autoAlpha: 0, scale: 0.96 },
                { y: 0, autoAlpha: 1, scale: 1, duration: 0.58, stagger: 0.08, clearProps: "transform" },
                "<0.05"
              )
              .fromTo(
                page.querySelector(".hero-copy > .motion-intro-copy"),
                { y: 12, autoAlpha: 0 },
                { y: 0, autoAlpha: 1, duration: 0.4, clearProps: "transform" },
                "<0.1"
              )
              .fromTo(
                page.querySelector(".hero-quote-callout"),
                { y: 12, autoAlpha: 0 },
                { y: 0, autoAlpha: 1, duration: 0.4, clearProps: "transform" },
                "<0.1"
              );

            const mobileHeroActions = page.querySelector(".hero-actions");
            if (mobileHeroActions) {
              mobileIntro.fromTo(
                mobileHeroActions,
                { y: 12, autoAlpha: 0 },
                { y: 0, autoAlpha: 1, duration: 0.4, clearProps: "transform" },
                "<0.1"
              );
            }
          }

          // Below-Fold Section Reveals:
          // Eliminate heavy 3D transforms (rotateX: -16, rotateX: 3, transformPerspective: 900)
          // Trigger once (once: true)
          page.querySelectorAll<HTMLElement>(".motion-heading:not(.hero .motion-heading)").forEach((heading) => {
            const words = heading.querySelectorAll(".motion-word");
            gsap.fromTo(
              words.length > 0 ? words : heading,
              { yPercent: 55, autoAlpha: 0 },
              {
                yPercent: 0,
                autoAlpha: 1,
                duration: isDesktop ? 0.58 : 0.42,
                stagger: isDesktop ? 0.03 : 0.02,
                ease: "power3.out",
                clearProps: "transform",
                scrollTrigger: { trigger: heading, start: "top 78%", once: true },
              }
            );
          });

          // Nemo iris reveal across all homepage cards (horizontal clip-path expand from center + scale depth)
          page.querySelectorAll<HTMLElement>(".motion-grid").forEach((grid) => {
            const items = Array.from(grid.children).filter(
              (c): c is HTMLElement => c instanceof HTMLElement
            );
            if (items.length === 0) return;

            const tl = gsap.timeline({
              scrollTrigger: { trigger: grid, start: "top 78%", once: true },
              onComplete: () => {
                items.forEach((item) => {
                  item.style.removeProperty("clip-path");
                  item.style.removeProperty("-webkit-clip-path");
                  item.style.removeProperty("transform");
                  item.style.removeProperty("scale");
                  item.style.removeProperty("opacity");
                  item.style.removeProperty("will-change");
                });
              },
            });

            items.forEach((item, index) => {
              tl.fromTo(
                item,
                {
                  opacity: 0,
                  y: 22,
                  scale: 0.96,
                  clipPath: "inset(0 50% 0 50% round 24px)",
                  willChange: "transform, opacity, clip-path",
                },
                {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  clipPath: "inset(0 0% 0 0% round 24px)",
                  duration: 0.95,
                  ease: "expo.out",
                  clearProps: "transform,opacity,clipPath,clip-path,willChange",
                  onComplete: () => {
                    item.style.removeProperty("clip-path");
                    item.style.removeProperty("-webkit-clip-path");
                    item.style.removeProperty("transform");
                    item.style.removeProperty("scale");
                    item.style.removeProperty("opacity");
                    item.style.removeProperty("will-change");
                  },
                },
                index * 0.085
              );
            });
          });

          // Tactile 3D button pop on click / interaction (scale pop with elastic/back easing)
          const buttonCleanups: Array<() => void> = [];
          const interactiveButtons = page.querySelectorAll<HTMLElement>(
            ".tactile-btn, .button, .button-primary, .button-outline, .text-link, .faq-list summary"
          );
          interactiveButtons.forEach((btn) => {
            const handleDown = () => {
              gsap.to(btn, { scale: 0.94, duration: 0.08, ease: "power2.out" });
            };
            const handleUp = () => {
              gsap.to(btn, {
                scale: 1,
                duration: 0.36,
                ease: "back.out(2)",
                clearProps: "all",
                onComplete: () => {
                  btn.style.removeProperty("transform");
                  btn.style.removeProperty("scale");
                },
              });
            };
            btn.addEventListener("pointerdown", handleDown);
            btn.addEventListener("pointerup", handleUp);
            btn.addEventListener("pointerleave", handleUp);
            btn.addEventListener("pointercancel", handleUp);
            buttonCleanups.push(() => {
              btn.removeEventListener("pointerdown", handleDown);
              btn.removeEventListener("pointerup", handleUp);
              btn.removeEventListener("pointerleave", handleUp);
              btn.removeEventListener("pointercancel", handleUp);
            });
          });

          // Remaining motion copy, footer CTA and marquee section
          page
            .querySelectorAll<HTMLElement>(".motion-copy, .footer-cta-inner, .association-marquee-section")
            .forEach((item) => {
              gsap.fromTo(
                item,
                { y: 14, autoAlpha: 0 },
                {
                  y: 0,
                  autoAlpha: 1,
                  duration: isDesktop ? 0.42 : 0.32,
                  ease: "power2.out",
                  clearProps: "transform",
                  scrollTrigger: { trigger: item, start: "top 80%", once: true },
                }
              );
            });

          return () => {
            buttonCleanups.forEach((fn) => fn());
          };
        }
      );

      return () => motion.revert();
    },
    { scope: pageRef }
  );

  return (
    <div className="public-page-wrap relative min-h-screen bg-[#08090b] text-white overflow-x-hidden">
      <div className="public-page-wallpaper" aria-hidden="true" />
      <div className="public-page-vignette" aria-hidden="true" />
      <div className="public-page-ambient-smoke" aria-hidden="true" />
      <SiteHeader currentPage="home" />
      <main ref={pageRef} className="relative z-10">
        <Hero />
        <FeatureRail />
        <AssociationMarquee />
        <AnimatedStats />
        <ValueProposition />
        <PesakaRecognition />
        {/* MVP Spotlight & Calendar Preview temporarily hidden per user request */}
        {/* <AthleteCoachSpotlight /> */}
        {/* <LeaderboardCalendarPreview /> */}
        <CollaborationPreview />
        <TestimonialsSection />
        <HowItWorks />
        <Programmes />
        <FAQ />
        <FooterCTA />
      </main>
    </div>
  );
}
