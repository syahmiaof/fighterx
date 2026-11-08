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
  return (
    <Link className="brand" href="/" aria-label="FighterX home">
      <span className="brand-copy">
        <strong>
          FIGHTER<span>X</span>
        </strong>
        <small>SILAT ATHLETE PLATFORM</small>
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
  return (
    <div className="phone-stage" aria-label="Illustrative preview of the FighterX athlete app">
      <span className="preview-disclaimer">ILLUSTRATIVE PREVIEW</span>
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
          Good morning,
          <br />
          <b>Athlete</b>
        </p>
        <div className="phone-program">
          <span className="phone-icon">
            <CalendarDays size={14} />
          </span>
          <div>
            <small>YOUR PROGRAMME</small>
            <b>Silat Olahraga · Block 1</b>
          </div>
        </div>
        <div className="phone-progress">
          <div>
            <span>Weekly progress</span>
            <b>72%</b>
          </div>
          <i>
            <i />
          </i>
        </div>
        <div className="phone-row">
          <Dumbbell size={14} /> Training plan <ArrowRight size={13} />
        </div>
        <div className="phone-row">
          <BarChart3 size={14} /> Performance <ArrowRight size={13} />
        </div>
        <div className="phone-row">
          <ShieldCheck size={14} /> Evaluation <ArrowRight size={13} />
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
          <span>‹</span> Performance
        </div>
        <div className="discipline-switch">
          <span>Seni</span>
          <b>Olahraga</b>
        </div>
        <div className="radar-wrap">
          <svg viewBox="0 0 190 190" role="img" aria-label="Illustrative athlete performance radar chart">
            <polygon points="95,18 158,63 134,141 56,141 32,63" className="radar-grid" />
            <polygon points="95,39 142,71 124,124 63,133 49,68" className="radar-grid" />
            <polygon points="95,52 132,76 117,116 70,124 58,72" className="radar-data" />
            <path d="M95 18v34m63 11-26 13M134 141l-17-25M56 141l14-17M32 63l26 9" className="radar-lines" />
          </svg>
          <span className="radar-label radar-top">Technique</span>
          <span className="radar-label radar-right">Speed</span>
          <span className="radar-label radar-bottom">Endurance</span>
          <span className="radar-label radar-left">Control</span>
        </div>
      </div>
      <span className="phone-light" aria-hidden="true" />
    </div>
  );
}

function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-backdrop" />
      <Image
        className="hero-smoke"
        src="/assets/fighterx/overlay-red-smoke-transparent.png"
        alt=""
        fill
        priority
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
      <aside className="hero-athlete-badge hero-athlete-badge-left" aria-label="Kredit Atlet Silat Seni: Merrywati Manuil">
        <span className="athlete-badge-indicator gold" aria-hidden="true" />
        <div className="athlete-badge-content">
          <strong className="athlete-badge-name">Merrywati Manuil</strong>
          <span className="athlete-badge-title">Gold Medalist · 2022 World Pencak Silat Championship</span>
        </div>
      </aside>

      <aside className="hero-athlete-badge hero-athlete-badge-right" aria-label="Kredit Atlet Silat Olahraga: Mohd Al Jufferi Jamari">
        <span className="athlete-badge-indicator red" aria-hidden="true" />
        <div className="athlete-badge-content">
          <strong className="athlete-badge-name">Mohd Al Jufferi Jamari</strong>
          <span className="athlete-badge-title">National Silat Champion</span>
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
          — THE SILAT ATHLETE PLATFORM —
          <span className="hero-overline-rule" />
        </div>
        <h1 id="hero-title" className="motion-heading" aria-label="Train smarter. Fight stronger.">
          <span className="motion-line">
            <RevealWords text="TRAIN SMARTER." />
          </span>
          <em className="motion-line">
            <RevealWords text="FIGHT STRONGER." />
          </em>
        </h1>
        <p className="motion-intro-copy">
          A dedicated sports-science platform for Silat Seni and Silat Olahraga. Plan, train,
          monitor, and develop Silat athletes with structured programmes and verified progress beyond the training hall.
        </p>

        {/* Exact quote callout element enclosed in red accent rules with italic styling */}
        <div className="hero-quote-callout" role="note" aria-label="Semangat Juang. Jiwa Malaysia.">
          <span className="hero-quote-rule" aria-hidden="true" />
          <blockquote className="hero-quote-text">
            &ldquo;Semangat Juang. <span className="hero-quote-highlight">Jiwa Malaysia.</span>&rdquo;
          </blockquote>
          <span className="hero-quote-rule" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}

function FeatureRail() {
  return (
    <section className="feature-rail motion-grid" id="features" aria-label="FighterX platform features">
      {features.map(({ icon: Icon, title, body }) => (
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
  return (
    <section className="workflow section-wrap" id="how-it-works">
      <div className="workflow-heading">
        <h2 className="motion-heading" aria-label="A smarter training flow for Silat">
          <span className="motion-line">
            <RevealWords text="A SMARTER" />
          </span>
          <span className="motion-line">
            <RevealWords text="TRAINING FLOW" />
          </span>
          <span className="motion-line">
            <RevealWords text="FOR SILAT" />
          </span>
        </h2>
        <span className="heading-rule" />
        <p className="workflow-intro motion-copy">From the first plan to verified progress, everyone sees the next step.</p>
      </div>
      <div className="workflow-steps motion-grid">
        {workflow.map(({ title, body, icon: Icon }, index) => (
          <article className="workflow-step" key={title}>
            <span className="step-number">0{index + 1}</span>
            <Icon size={23} strokeWidth={1.7} />
            <h3>{title}</h3>
            <p>{body}</p>
            {index < workflow.length - 1 && <ArrowRight className="step-arrow" size={22} aria-hidden="true" />}
          </article>
        ))}
      </div>
      <PhonePreview />
    </section>
  );
}

function Programmes() {
  return (
    <section className="programmes section-wrap" id="disciplines">
      <div className="programmes-heading">
        <div>
          <h2 className="motion-heading" aria-label="Dedicated programmes for every Silat athlete">
            <span className="motion-line">
              <RevealWords text="DEDICATED PROGRAMMES" />
            </span>
            <span className="motion-line">
              <RevealWords text="FOR EVERY SILAT ATHLETE" />
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
              <h3>SILAT SENI</h3>
            </div>
            <p>Build technique, artistry, and movement quality through structured training and performance tracking.</p>
            <Link href="/disciplines" className="text-link">
              Explore Silat Seni <ArrowRight size={15} />
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
              <h3>SILAT OLAHRAGA</h3>
            </div>
            <p>Build physical, technical, and tactical readiness through sport-specific programmes.</p>
            <Link href="/disciplines" className="text-link">
              Explore Silat Olahraga <ArrowRight size={15} />
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}

function FAQ() {
  const items = [
    ["Who is FighterX for?", "For Silat clubs, coaches, and athletes who need a shared training and performance workflow."],
    ["Does FighterX support both disciplines?", "Yes. The platform is designed for Silat Seni and Silat Olahraga."],
    ["Can coaches change the master programme?", "The central administrator owns the master programme. Coaches can review assigned athletes and suggest adjustments."],
  ];
  return (
    <section className="faq section-wrap" id="faq">
      <div>
        <h2 className="motion-heading" aria-label="Common questions.">
          <RevealWords text="Common questions." />
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
  return (
    <section className="footer-cta" id="register">
      <Image
        className="footer-smoke"
        src="/assets/fighterx/bg-silat-mountains.webp"
        alt=""
        fill
        sizes="100vw"
      />
      <div className="footer-cta-inner">
        <span className="footer-silhouette">
          <Image
            src="/assets/fighterx/silhouette-silat-stance-transparent.png"
            alt=""
            width={74}
            height={68}
          />
        </span>
        <h2>
          BUILT FOR <em>SILAT.</em>
          <br />
          BUILT FOR <em>ATHLETES.</em>
        </h2>
        <Link href="/register-club" className="button button-primary">
          Register Club <ArrowRight size={17} />
        </Link>
      </div>
    </section>
  );
}

export function HomePage() {
  const pageRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const page = pageRef.current;
      if (!page) return;

      const motion = gsap.matchMedia();
      motion.add("(prefers-reduced-motion: no-preference)", () => {
        const intro = gsap.timeline({ defaults: { ease: "power4.out" } });
        intro
          .fromTo(
            page.querySelectorAll(".hero .motion-word"),
            { yPercent: 115, rotateX: -28, autoAlpha: 0, filter: "blur(8px)" },
            { yPercent: 0, rotateX: 0, autoAlpha: 1, filter: "blur(0px)", duration: 0.82, stagger: 0.065 }
          )
          .fromTo(
            page.querySelector(".hero-overline"),
            { clipPath: "inset(0 50% 0 50%)", autoAlpha: 0.5 },
            { clipPath: "inset(0 0% 0 0%)", autoAlpha: 1, duration: 0.55 },
            "<0.12"
          )
          .fromTo(
            page.querySelectorAll(".hero-athlete"),
            { y: 44, autoAlpha: 0, scale: 0.97 },
            { y: 0, autoAlpha: 1, scale: 1, duration: 0.8, stagger: 0.12 },
            "<0.04"
          )
          .fromTo(
            page.querySelectorAll(".hero-athlete-badge"),
            { y: 16, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.1 },
            "-=0.3"
          )
          .fromTo(
            page.querySelector(".hero-copy > .motion-intro-copy"),
            { y: 14, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.42 },
            "<0.24"
          )
          .fromTo(
            page.querySelector(".hero-quote-callout"),
            { y: 14, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.45 },
            "<0.15"
          )
          .fromTo(
            page.querySelector(".hero-actions"),
            { y: 14, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.45 },
            "<0.15"
          );

        page.querySelectorAll<HTMLElement>(".motion-heading:not(.hero .motion-heading)").forEach((heading) => {
          const words = heading.querySelectorAll(".motion-word");
          gsap.fromTo(
            words,
            { yPercent: 70, rotateX: -16, autoAlpha: 0 },
            {
              yPercent: 0,
              rotateX: 0,
              autoAlpha: 1,
              duration: 0.58,
              stagger: 0.035,
              ease: "power3.out",
              scrollTrigger: { trigger: heading, start: "top 86%", once: true },
            }
          );
        });

        page.querySelectorAll<HTMLElement>(".motion-grid").forEach((grid) => {
          gsap.fromTo(
            Array.from(grid.children),
            { y: 24, rotateX: 3, autoAlpha: 0, transformPerspective: 900 },
            {
              y: 0,
              rotateX: 0,
              autoAlpha: 1,
              duration: 0.62,
              stagger: 0.1,
              ease: "power3.out",
              scrollTrigger: { trigger: grid, start: "top 88%", once: true },
            }
          );
        });

        page
          .querySelectorAll<HTMLElement>(
            ".motion-copy, .motion-faq details, .footer-cta-inner, .association-marquee-section"
          )
          .forEach((item) => {
            gsap.fromTo(
              item,
              { y: 15, autoAlpha: 0 },
              {
                y: 0,
                autoAlpha: 1,
                duration: 0.48,
                ease: "power3.out",
                scrollTrigger: { trigger: item, start: "top 90%", once: true },
              }
            );
          });
      });

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
        <AthleteCoachSpotlight />
        <LeaderboardCalendarPreview />
        <CollaborationPreview />
        <TestimonialsSection />
        <HowItWorks />
        <Programmes />
        <FAQ />
        <FooterCTA />
      </main>
      <footer className="site-footer relative">
        <BrandWordmark />
        <p className="site-footer-author sm:absolute sm:left-1/2 sm:-translate-x-1/2 text-center">
          Built by{" "}
          <a href="https://syahmiaof.my" target="_blank" rel="noopener noreferrer">
            syahmiaof.my
          </a>
        </p>
        <div className="sr-only" aria-hidden="true">
          <Link href="/associations">Direktori Persatuan</Link>
          <Link href="/guidelines">PERSILAT Rules</Link>
          <Link href="/disciplines">Disiplin Silat</Link>
        </div>
      </footer>
    </div>
  );
}
