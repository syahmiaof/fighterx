"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useCollectionMotion } from "@/hooks/useCollectionMotion";
gsap.registerPlugin(ScrollTrigger, useGSAP);
import Link from "next/link";
import dynamic from "next/dynamic";
import { useLanguage } from "@/lib/i18n";
import {
  Search,
  CalendarDays,
  Clock,
  ShieldCheck,
  ExternalLink,
  Scale,
  Users,
  CheckCircle2,
  ArrowRight,
  Info,
  AlertTriangle,
  BookMarked,
  Droplets,
  Zap,
  Award,
  Activity,
  Sparkles,
  Target,
  Check,
} from "lucide-react";
import {
  CATEGORIES,
  KNOWLEDGE_ARTICLES,
  SCIENTIFIC_CITATIONS,
  WEIGHT_CATEGORIES_PERSILAT,
  MASTER_FRAMEWORK_MONTHS,
  COMPETITION_POLICIES,
  BASELINE_ASSESSMENTS,
  TRAINING_PRIORITIES,
  KnowledgeArticle,
  KnowledgeCategory,
  FrameworkMonth,
} from "./knowledge-data";
import { CitationsDrawer } from "./citations-drawer";

// Code-splitting: lazily load interactive calculation tools on demand
const PeriodizationMatrix = dynamic(
  () => import("./periodization-matrix").then((mod) => mod.PeriodizationMatrix),
  {
    loading: () => (
      <div className="p-8 text-center text-sm text-[#A2A3AA] animate-pulse">
        Memuatkan Matriks Periodisasi...
      </div>
    ),
  }
);

const WeightCutPlanner = dynamic(
  () => import("./weight-cut-planner").then((mod) => mod.WeightCutPlanner),
  {
    loading: () => (
      <div className="p-8 text-center text-sm text-[#A2A3AA] animate-pulse">
        Memuatkan Kalkulator Weight Cut...
      </div>
    ),
  }
);

const SweatRateCalculator = dynamic(
  () => import("./sweat-rate-calculator").then((mod) => mod.SweatRateCalculator),
  {
    loading: () => (
      <div className="p-8 text-center text-sm text-[#A2A3AA] animate-pulse">
        Memuatkan Kalkulator Kadar Peluh...
      </div>
    ),
  }
);

const StakeholderGuideSwitcher = dynamic(
  () => import("./stakeholder-guide-switcher").then((mod) => mod.StakeholderGuideSwitcher),
  {
    loading: () => (
      <div className="p-8 text-center text-sm text-[#A2A3AA] animate-pulse">
        Memuatkan Panduan Stakeholder...
      </div>
    ),
  }
);

export function KnowledgeHubClient() {
  const { dict, locale } = useLanguage();
  const kd = dict.knowledge;
  const [selectedCategory, setSelectedCategory] = useState<KnowledgeCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const articleFilterKey = `${selectedCategory}|${searchQuery}`;
  const articlesMotionRef = useCollectionMotion<HTMLDivElement>(articleFilterKey);
  const [activeArticle, setActiveArticle] = useState<KnowledgeArticle | null>(null);
  const [citationsDrawerOpen, setCitationsDrawerOpen] = useState(false);
  const [activeToolTab, setActiveToolTab] = useState<"periodization" | "weight" | "sweat" | "stakeholder">("periodization");

  const articleModalRef = useRef<HTMLDivElement>(null);
  const articleCloseBtnRef = useRef<HTMLButtonElement>(null);
  const articleTriggerRef = useRef<HTMLElement | null>(null);

  // Focus trap, Escape key, and trigger restoration for Article Reader modal
  useEffect(() => {
    if (!activeArticle) return;

    document.body.style.overflow = "hidden";
    const timer = setTimeout(() => {
      articleCloseBtnRef.current?.focus();
    }, 40);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setActiveArticle(null);
        return;
      }

      if (e.key === "Tab") {
        if (!articleModalRef.current) return;
        const focusables = Array.from(
          articleModalRef.current.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        ).filter((el) => el.offsetParent !== null || el.offsetWidth > 0 || el.offsetHeight > 0);

        if (focusables.length === 0) {
          e.preventDefault();
          return;
        }

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first || !articleModalRef.current.contains(document.activeElement)) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last || !articleModalRef.current.contains(document.activeElement)) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
      articleTriggerRef.current?.focus();
    };
  }, [activeArticle]);

  const handleOpenArticle = (article: KnowledgeArticle) => {
    articleTriggerRef.current = (document.activeElement as HTMLElement) || null;
    setActiveArticle(article);
  };

  // Master Annual Training Framework state
  const [selectedBlock, setSelectedBlock] = useState<1 | 2>(1);
  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number>(1);
  const [frameworkViewTab, setFrameworkViewTab] = useState<"calendar" | "competition" | "baseline" | "priorities">("calendar");
  const [baselineSessionFilter, setBaselineSessionFilter] = useState<"all" | "Sesi A (Fizikal & Mobiliti)" | "Sesi B (Teknik & Stamina)">("all");

  const filteredArticles = useMemo(() => {
    return KNOWLEDGE_ARTICLES.filter((article) => {
      const matchesCat = selectedCategory === "all" || article.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        article.title.toLowerCase().includes(q) ||
        article.subtitle.toLowerCase().includes(q) ||
        article.summary.toLowerCase().includes(q) ||
        article.categoryLabel.toLowerCase().includes(q) ||
        (article.fieldProblem?.toLowerCase().includes(q) ?? false) ||
        (article.scientificSolution?.toLowerCase().includes(q) ?? false) ||
        (article.actionStepToday?.toLowerCase().includes(q) ?? false) ||
        article.keyTakeaways.some((t) => t.toLowerCase().includes(q));
      return matchesCat && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const blockMonths = useMemo(() => {
    return MASTER_FRAMEWORK_MONTHS.filter((m) => m.block === selectedBlock);
  }, [selectedBlock]);

  const activeMonthData = useMemo<FrameworkMonth>(() => {
    const found = MASTER_FRAMEWORK_MONTHS.find((m) => m.monthIndex === selectedMonthIndex);
    return found || MASTER_FRAMEWORK_MONTHS[0];
  }, [selectedMonthIndex]);

  const filteredBaselineTests = useMemo(() => {
    if (baselineSessionFilter === "all") return BASELINE_ASSESSMENTS;
    return BASELINE_ASSESSMENTS.filter((t) => t.session === baselineSessionFilter);
  }, [baselineSessionFilter]);

  const heroRef = useRef<HTMLDivElement>(null);
  const isFirstFrameworkTabMount = useRef(true);
  const isFirstToolMount = useRef(true);
  const isFirstMonthMount = useRef(true);

  // Helper to remove all temporary animation inline properties so hover micro-interactions work cleanly
  const cleanInline = (el: HTMLElement) => {
    el.style.removeProperty("clip-path");
    el.style.removeProperty("-webkit-clip-path");
    el.style.removeProperty("transform");
    el.style.removeProperty("scale");
    el.style.removeProperty("opacity");
    el.style.removeProperty("will-change");
  };

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        // 1. Hero title cinematic sweep & text reveals
        gsap.fromTo(
          ".knowledge-hero-title",
          { y: 50, autoAlpha: 0, filter: "blur(6px)" },
          { y: 0, autoAlpha: 1, filter: "blur(0px)", duration: 1.0, ease: "power4.out", clearProps: "transform,filter", delay: 0.05 }
        );
        gsap.fromTo(
          ".knowledge-hero-overline",
          { y: -16, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.7, ease: "power2.out", clearProps: "transform", delay: 0.15 }
        );
        gsap.fromTo(
          ".knowledge-hero-desc",
          { y: 20, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.75, ease: "power2.out", clearProps: "transform", delay: 0.25 }
        );
        gsap.fromTo(
          ".hero-quote-callout",
          { y: 20, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.75, ease: "power2.out", clearProps: "transform", delay: 0.35 }
        );
        gsap.fromTo(
          ".knowledge-hero-actions",
          { y: 18, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.7, ease: "power2.out", clearProps: "transform", delay: 0.45 }
        );
        gsap.fromTo(
          ".accreditation-pill",
          { y: 14, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.06, ease: "power2.out", clearProps: "transform", delay: 0.55 }
        );

        // 2. Hero 4 KPI Stat Cards - Nemo Iris Reveal Physics
        const statCards = gsap.utils.toArray<HTMLElement>(".knowledge-stat-card");
        if (statCards.length > 0) {
          gsap.fromTo(
            statCards,
            {
              opacity: 0,
              y: 22,
              scale: 0.96,
              clipPath: "inset(0 50% 0 50% round 14px)",
              willChange: "transform, opacity, clip-path",
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              clipPath: "inset(0 0% 0 0% round 14px)",
              duration: 0.95,
              stagger: 0.085,
              ease: "expo.out",
              delay: 0.35,
              clearProps: "transform,scale,opacity,clipPath,clip-path,willChange",
              onComplete: () => {
                statCards.forEach(cleanInline);
              },
            }
          );
        }

        // 3. Master Annual Training Framework 2027 Section Scroll Reveal
        const frameworkSection = document.getElementById("master-framework");
        if (frameworkSection) {
          gsap.fromTo(
            "#master-framework .framework-header-content",
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: "power2.out",
              clearProps: "transform,opacity",
              scrollTrigger: { trigger: "#master-framework", start: "top 78%", once: true },
            }
          );

          const blockCards = gsap.utils.toArray<HTMLElement>(".framework-block-card");
          if (blockCards.length > 0) {
            gsap.fromTo(
              blockCards,
              {
                opacity: 0,
                y: 20,
                scale: 0.96,
                clipPath: "inset(0 50% 0 50% round 14px)",
                willChange: "transform, opacity, clip-path",
              },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                clipPath: "inset(0 0% 0 0% round 14px)",
                duration: 0.9,
                stagger: 0.085,
                ease: "expo.out",
                clearProps: "transform,scale,opacity,clipPath,clip-path,willChange",
                scrollTrigger: { trigger: "#master-framework", start: "top 78%", once: true },
                onComplete: () => {
                  blockCards.forEach(cleanInline);
                },
              }
            );
          }

          const monthButtons = gsap.utils.toArray<HTMLElement>(".timeline-month-btn");
          if (monthButtons.length > 0) {
            gsap.fromTo(
              monthButtons,
              {
                opacity: 0,
                scale: 0.92,
                y: 12,
                willChange: "transform, opacity",
              },
              {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.045,
                ease: "back.out(1.6)",
                clearProps: "transform,scale,opacity,willChange",
                scrollTrigger: { trigger: ".timeline-month-btn", start: "top 80%", once: true },
                onComplete: () => {
                  monthButtons.forEach(cleanInline);
                },
              }
            );
          }

          const detailCard = document.querySelector<HTMLElement>(".framework-detail-card");
          if (detailCard) {
            gsap.fromTo(
              detailCard,
              {
                opacity: 0,
                y: 22,
                scale: 0.97,
                clipPath: "inset(0 50% 0 50% round 16px)",
                willChange: "transform, opacity, clip-path",
              },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                clipPath: "inset(0 0% 0 0% round 16px)",
                duration: 0.95,
                ease: "expo.out",
                clearProps: "transform,scale,opacity,clipPath,clip-path,willChange",
                scrollTrigger: { trigger: detailCard, start: "top 80%", once: true },
                onComplete: () => {
                  cleanInline(detailCard);
                },
              }
            );
          }
        }

        // 4. Main Practical Articles Grid - Nemo Iris Reveal Physics
        const articleCards = gsap.utils.toArray<HTMLElement>(".knowledge-article-card");
        if (articleCards.length > 0) {
          gsap.fromTo(
            articleCards,
            {
              opacity: 0,
              y: 22,
              scale: 0.96,
              clipPath: "inset(0 50% 0 50% round 16px)",
              willChange: "transform, opacity, clip-path",
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              clipPath: "inset(0 0% 0 0% round 16px)",
              duration: 0.95,
              stagger: 0.085,
              ease: "expo.out",
              clearProps: "transform,scale,opacity,clipPath,clip-path,willChange",
              scrollTrigger: {
                trigger: "#articles-section",
                start: "top 82%",
                once: true,
              },
              onComplete: () => {
                articleCards.forEach(cleanInline);
              },
            }
          );
        }

        // 5. Interactive Sports-Science Tools Suite Entrance
        const toolsSection = document.getElementById("interactive-tools");
        if (toolsSection) {
          gsap.fromTo(
            "#interactive-tools .tools-header-anim",
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: "power2.out",
              clearProps: "transform,opacity",
              scrollTrigger: { trigger: "#interactive-tools", start: "top 78%", once: true },
            }
          );

          const toolTabs = gsap.utils.toArray<HTMLElement>("#interactive-tools .tool-tab-btn");
          if (toolTabs.length > 0) {
            gsap.fromTo(
              toolTabs,
              { opacity: 0, scale: 0.92, y: 12 },
              {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.06,
                ease: "back.out(1.6)",
                clearProps: "transform,scale,opacity",
                scrollTrigger: { trigger: "#interactive-tools", start: "top 78%", once: true },
                onComplete: () => {
                  toolTabs.forEach(cleanInline);
                },
              }
            );
          }

          const toolContainer = document.querySelector<HTMLElement>(".knowledge-tool-container");
          if (toolContainer) {
            gsap.fromTo(
              toolContainer,
              {
                opacity: 0,
                y: 22,
                scale: 0.97,
                clipPath: "inset(0 50% 0 50% round 16px)",
                willChange: "transform, opacity, clip-path",
              },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                clipPath: "inset(0 0% 0 0% round 16px)",
                duration: 0.95,
                ease: "expo.out",
                clearProps: "transform,scale,opacity,clipPath,clip-path,willChange",
                scrollTrigger: { trigger: "#interactive-tools", start: "top 78%", once: true },
                onComplete: () => {
                  cleanInline(toolContainer);
                },
              }
            );
          }
        }

        // 6. PERSILAT 2026 Weight Categories Reference Strip Entrance
        const weightSection = document.getElementById("weight-categories");
        if (weightSection) {
          gsap.fromTo(
            "#weight-categories .weight-header-anim",
            { opacity: 0, y: 16 },
            {
              opacity: 1,
              y: 0,
              duration: 0.65,
              ease: "power2.out",
              clearProps: "transform,opacity",
              scrollTrigger: { trigger: "#weight-categories", start: "top 80%", once: true },
            }
          );

          const weightCards = gsap.utils.toArray<HTMLElement>(".weight-category-card");
          if (weightCards.length > 0) {
            gsap.fromTo(
              weightCards,
              {
                opacity: 0,
                scale: 0.92,
                y: 16,
                willChange: "transform, opacity",
              },
              {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.65,
                stagger: 0.045,
                ease: "back.out(1.5)",
                clearProps: "transform,scale,opacity,willChange",
                scrollTrigger: { trigger: "#weight-categories", start: "top 80%", once: true },
                onComplete: () => {
                  weightCards.forEach(cleanInline);
                },
              }
            );
          }

          const weightNotice = document.querySelector<HTMLElement>("#weight-categories .weight-notice-anim");
          if (weightNotice) {
            gsap.fromTo(
              weightNotice,
              { opacity: 0, y: 14 },
              {
                opacity: 1,
                y: 0,
                duration: 0.65,
                ease: "power2.out",
                delay: 0.35,
                clearProps: "transform,opacity",
                scrollTrigger: { trigger: "#weight-categories", start: "top 80%", once: true },
              }
            );
          }
        }

        // 7. Tactile 3D Button & Chip Spring Interactions
        const interactiveBtns = Array.from(
          document.querySelectorAll<HTMLElement>(
            ".btn-crimson, .timeline-month-btn, .framework-block-card, .accreditation-pill, .tool-tab-btn, .knowledge-pill-switcher button"
          )
        );
        const handleDown = (e: Event) => {
          const target = e.currentTarget as HTMLElement;
          gsap.to(target, { scale: 0.96, duration: 0.08, ease: "power2.out" });
        };
        const handleUp = (e: Event) => {
          const target = e.currentTarget as HTMLElement;
          gsap.to(target, {
            scale: 1,
            duration: 0.34,
            ease: "back.out(2)",
            clearProps: "transform,scale",
            onComplete: () => {
              target.style.removeProperty("transform");
              target.style.removeProperty("scale");
            },
          });
        };
        interactiveBtns.forEach((btn) => {
          btn.addEventListener("pointerdown", handleDown);
          btn.addEventListener("pointerup", handleUp);
          btn.addEventListener("pointercancel", handleUp);
          btn.addEventListener("pointerleave", handleUp);
        });
      });

      media.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(
          ".knowledge-hero-title, .knowledge-hero-overline, .knowledge-hero-desc, .hero-quote-callout, .knowledge-hero-actions, .accreditation-pill, .knowledge-stat-card, .framework-block-card, .timeline-month-btn, .framework-detail-card, .framework-policy-card, .framework-baseline-card, .framework-priority-card, .knowledge-article-card, .knowledge-tool-container, .weight-category-card, .fight-week-banner",
          { autoAlpha: 1, opacity: 1, y: 0, scale: 1, clearProps: "all" }
        );
      });

      return () => media.revert();
    },
    { scope: heroRef }
  );

  // Framework Sub-View Tab Switches Transition
  useGSAP(
    () => {
      if (isFirstFrameworkTabMount.current) {
        isFirstFrameworkTabMount.current = false;
        return;
      }

      const isReduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (isReduced) return;

      if (frameworkViewTab === "competition") {
        const policyCards = gsap.utils.toArray<HTMLElement>(".framework-policy-card");
        if (policyCards.length > 0) {
          gsap.fromTo(
            policyCards,
            {
              opacity: 0,
              y: 22,
              scale: 0.96,
              clipPath: "inset(0 50% 0 50% round 16px)",
              willChange: "transform, opacity, clip-path",
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              clipPath: "inset(0 0% 0 0% round 16px)",
              duration: 0.85,
              stagger: 0.085,
              ease: "expo.out",
              clearProps: "transform,scale,opacity,clipPath,clip-path,willChange",
              onComplete: () => {
                policyCards.forEach(cleanInline);
              },
            }
          );
        }
      } else if (frameworkViewTab === "baseline") {
        const baselineCards = gsap.utils.toArray<HTMLElement>(".framework-baseline-card");
        if (baselineCards.length > 0) {
          gsap.fromTo(
            baselineCards,
            {
              opacity: 0,
              y: 22,
              scale: 0.96,
              clipPath: "inset(0 50% 0 50% round 16px)",
              willChange: "transform, opacity, clip-path",
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              clipPath: "inset(0 0% 0 0% round 16px)",
              duration: 0.85,
              stagger: 0.07,
              ease: "expo.out",
              clearProps: "transform,scale,opacity,clipPath,clip-path,willChange",
              onComplete: () => {
                baselineCards.forEach(cleanInline);
              },
            }
          );
        }
      } else if (frameworkViewTab === "priorities") {
        const priorityCards = gsap.utils.toArray<HTMLElement>(".framework-priority-card");
        if (priorityCards.length > 0) {
          gsap.fromTo(
            priorityCards,
            {
              opacity: 0,
              y: 22,
              scale: 0.96,
              clipPath: "inset(0 50% 0 50% round 16px)",
              willChange: "transform, opacity, clip-path",
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              clipPath: "inset(0 0% 0 0% round 16px)",
              duration: 0.85,
              stagger: 0.07,
              ease: "expo.out",
              clearProps: "transform,scale,opacity,clipPath,clip-path,willChange",
              onComplete: () => {
                priorityCards.forEach(cleanInline);
              },
            }
          );
        }
      } else if (frameworkViewTab === "calendar") {
        const blockCards = gsap.utils.toArray<HTMLElement>(".framework-block-card");
        if (blockCards.length > 0) {
          gsap.fromTo(
            blockCards,
            {
              opacity: 0,
              y: 18,
              scale: 0.97,
              clipPath: "inset(0 50% 0 50% round 14px)",
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              clipPath: "inset(0 0% 0 0% round 14px)",
              duration: 0.8,
              stagger: 0.08,
              ease: "expo.out",
              clearProps: "transform,scale,opacity,clipPath,clip-path,willChange",
              onComplete: () => {
                blockCards.forEach(cleanInline);
              },
            }
          );
        }
      }

      // Recalculate ScrollTrigger markers after sub-tab height changes
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 120);
    },
    { dependencies: [frameworkViewTab], scope: heroRef }
  );

  // Active Tool Tab Switch Transition
  useGSAP(
    () => {
      if (isFirstToolMount.current) {
        isFirstToolMount.current = false;
        return;
      }
      const isReduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (isReduced) return;

      const toolContainer = document.querySelector<HTMLElement>(".knowledge-tool-container");
      if (toolContainer) {
        gsap.fromTo(
          toolContainer,
          {
            opacity: 0,
            scale: 0.97,
            y: 16,
            clipPath: "inset(0 50% 0 50% round 16px)",
            willChange: "transform, opacity, clip-path",
          },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            clipPath: "inset(0 0% 0 0% round 16px)",
            duration: 0.85,
            ease: "expo.out",
            clearProps: "transform,scale,opacity,clipPath,clip-path,willChange",
            onComplete: () => {
              cleanInline(toolContainer);
            },
          }
        );
      }
    },
    { dependencies: [activeToolTab], scope: heroRef }
  );

  // Selected Month Switch Transition
  useGSAP(
    () => {
      if (isFirstMonthMount.current) {
        isFirstMonthMount.current = false;
        return;
      }
      const isReduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (isReduced) return;

      const detailCard = document.querySelector<HTMLElement>(".framework-detail-card");
      if (detailCard) {
        gsap.fromTo(
          detailCard,
          { opacity: 0.85, y: 10, scale: 0.985 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.45,
            ease: "power2.out",
            clearProps: "transform,scale,opacity",
            onComplete: () => {
              cleanInline(detailCard);
            },
          }
        );
      }
    },
    { dependencies: [selectedMonthIndex], scope: heroRef }
  );

  return (
    <div ref={heroRef} className="min-h-screen text-white pb-24">
      {/* Executive Hero Header */}
      <section className="relative pt-12 pb-16 md:pt-16 md:pb-20 lg:pt-20 lg:pb-24 border-b border-white/[0.08] overflow-hidden">
        {/* Atmospheric ambient glow */}
        <div
          className="pointer-events-none absolute -top-28 left-1/2 -translate-x-1/2 w-[920px] h-[480px] bg-[radial-gradient(ellipse_at_center,rgba(225,6,0,0.14),transparent_70%)] blur-3xl opacity-70"
          aria-hidden="true"
        />

        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Title, Subtitle, Description, Accreditation Badges */}
            <div className="lg:col-span-7">
              <div className="knowledge-hero-overline">
                <span className="accent-rule" aria-hidden="true" />
                <span className="overline-text">{kd.overline}</span>
                <span className="accent-rule" aria-hidden="true" />
              </div>

              <h1 className="knowledge-hero-title mb-4" aria-label="Sport Science">
                <span className="title-white">SPORT</span>{" "}
                <em className="title-crimson">SCIENCE</em>
              </h1>

              <div className="text-sm sm:text-base font-semibold text-[#FF555C] tracking-wide mb-3 flex items-center gap-2">
                <Sparkles size={16} className="text-[#FF3845]" />
                <span>{kd.subtitle}</span>
              </div>

              <p className="knowledge-hero-desc text-sm sm:text-base text-[#D1D1D6] mt-1 leading-relaxed max-w-2xl font-normal">
                {kd.description}
              </p>

              {/* Exact quote callout matching homepage athletic design language */}
              <div className="hero-quote-callout mt-4 mb-6" role="note" aria-label={kd.quote}>
                <span className="hero-quote-rule" aria-hidden="true" />
                <blockquote className="hero-quote-text">
                  &ldquo;{kd.quote}&rdquo;
                </blockquote>
                <span className="hero-quote-rule" aria-hidden="true" />
              </div>

              {/* Action Buttons */}
              <div className="knowledge-hero-actions mt-6 flex flex-wrap items-center gap-3">
                <a
                  href="#master-framework"
                  className="btn-crimson px-5 py-2.5 text-xs font-bold uppercase tracking-wider"
                >
                  <CalendarDays size={14} />
                  <span>{kd.ctaFramework}</span>
                </a>

                <button
                  type="button"
                  onClick={() => setCitationsDrawerOpen(true)}
                  className="px-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] hover:border-[#FF3845]/60 text-xs font-bold text-white flex items-center gap-2 transition-all backdrop-blur-sm"
                >
                  <BookMarked size={14} className="text-[#FF3845]" />
                  <span>{kd.ctaCitations}</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#E10600]/20 text-[#FF555C] font-mono">
                    {SCIENTIFIC_CITATIONS.length}
                  </span>
                </button>
              </div>

              {/* Official Scientific Accreditation Badges */}
              <div className="mt-7 pt-5 border-t border-white/[0.08]">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#8A8C95] block mb-2.5">
                  Diperakui Berdasarkan Standard Rasmi:
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href="https://isn.gov.my"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="accreditation-pill inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-[#E1E2E6] hover:text-white"
                  >
                    <Award size={12} className="text-[#FF3845]" />
                    <span>ISN Bukit Jalil</span>
                    <ExternalLink size={10} className="text-[#8E9099]" />
                  </a>

                  <a
                    href="https://worldpencaksilat.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="accreditation-pill inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-[#E1E2E6] hover:text-white"
                  >
                    <ShieldCheck size={12} className="text-[#FF3845]" />
                    <span>PERSILAT Medical Code 2026</span>
                    <ExternalLink size={10} className="text-[#8E9099]" />
                  </a>

                  <a
                    href="https://bjsm.bmj.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="accreditation-pill inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-[#E1E2E6] hover:text-white"
                  >
                    <Activity size={12} className="text-[#FF3845]" />
                    <span>IOC &amp; BJSM Consensus</span>
                    <ExternalLink size={10} className="text-[#8E9099]" />
                  </a>

                  <a
                    href="https://nsc.gov.my"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="accreditation-pill inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-[#E1E2E6] hover:text-white"
                  >
                    <Target size={12} className="text-[#FF3845]" />
                    <span>MSN Malaysia</span>
                    <ExternalLink size={10} className="text-[#8E9099]" />
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: 4-Metric Performance Statistics Matrix */}
            <div className="lg:col-span-5">
              <div className="grid grid-cols-2 gap-3.5 sm:gap-4">
                {/* Metric 1 */}
                <div className="knowledge-stat-card kpi-matrix-card p-4 sm:p-5">
                  <div className="flex items-center justify-between text-[#ff4d5a] mb-2.5">
                    <CalendarDays size={20} />
                    <span className="category-tag badge-crimson font-mono font-bold">
                      6 + 6 Bulan
                    </span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold font-athletic text-white tracking-wide">
                    52 MINGGU
                  </div>
                  <div className="text-xs font-bold text-[#E5E6EB] mt-0.5">
                    Periodisasi Tahunan
                  </div>
                  <p className="text-[11px] text-[#9EA0A8] mt-1 leading-snug">
                    Blok 1 (Asas Fizikal) &amp; Blok 2 (Kemuncak Prestasi).
                  </p>
                </div>

                {/* Metric 2 */}
                <div className="knowledge-stat-card kpi-matrix-card p-4 sm:p-5">
                  <div className="flex items-center justify-between text-[#e5e5e7] mb-2.5">
                    <Activity size={20} />
                    <span className="category-tag badge-silver font-mono font-bold">
                      2 Sesi
                    </span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold font-athletic text-white tracking-wide">
                    6 BASELINE
                  </div>
                  <div className="text-xs font-bold text-[#E5E6EB] mt-0.5">
                    Ujian Penilaian Fizikal
                  </div>
                  <p className="text-[11px] text-[#9EA0A8] mt-1 leading-snug">
                    Stamina, Teras, Mobiliti, Letupan, Teknik, Readiness.
                  </p>
                </div>

                {/* Metric 3 */}
                <div className="knowledge-stat-card kpi-matrix-card p-4 sm:p-5">
                  <div className="flex items-center justify-between text-[#64b7ff] mb-2.5">
                    <Users size={20} />
                    <span className="category-tag badge-blue font-mono font-bold">
                      Bukan Rawak
                    </span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold font-athletic text-white tracking-wide">
                    5 PRIORITI
                  </div>
                  <div className="text-xs font-bold text-[#E5E6EB] mt-0.5">
                    Pengelompokan Atlet
                  </div>
                  <p className="text-[11px] text-[#9EA0A8] mt-1 leading-snug">
                    Endurance, Strength, Movement, Tech, Recovery.
                  </p>
                </div>

                {/* Metric 4 */}
                <div className="knowledge-stat-card kpi-matrix-card p-4 sm:p-5">
                  <div className="flex items-center justify-between text-[#ffd24c] mb-2.5">
                    <ShieldCheck size={20} />
                    <span className="category-tag badge-gold font-mono font-bold">
                      Peer-Reviewed
                    </span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold font-athletic text-white tracking-wide">
                    100% LEGIT
                  </div>
                  <div className="text-xs font-bold text-[#E5E6EB] mt-0.5">
                    Bukti Saintifik
                  </div>
                  <p className="text-[11px] text-[#9EA0A8] mt-1 leading-snug">
                    Garis panduan rasmi ISN, PERSILAT 2026 &amp; BJSM/IOC.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar & Instant Counter */}
          <div className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#858790]" size={18} />
              <input
                type="text"
                placeholder={kd.articles.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input-glow w-full pl-11 pr-4 py-3 rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-md text-sm text-white placeholder-[#787A82] focus:outline-none focus:border-[#FF3845] transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#858790] hover:text-white"
                >
                  {locale === "en" ? "Clear" : "Padam"}
                </button>
              )}
            </div>
            <div className="px-4 py-3 rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-md text-xs text-[#A2A3AA] flex items-center justify-center gap-1.5 whitespace-nowrap">
              <span className="font-bold text-white">{filteredArticles.length}</span> {locale === "en" ? "articles found" : "artikel dijumpai"}
            </div>
          </div>

          {/* Glowing Category Filter Tabs */}
          <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 border ${
                    active
                      ? "pill-active-glow"
                      : "bg-white/[0.04] border-white/10 text-[#B0B1B7] hover:text-white hover:bg-white/[0.08] backdrop-blur-sm"
                  }`}
                >
                  {cat.label}
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      active ? "bg-black/40 text-white" : "bg-white/10 text-[#868892]"
                    }`}
                  >
                    {cat.id === "all" ? KNOWLEDGE_ARTICLES.length : cat.count}
                  </span>
                </button>
              );
            })}

            <a
              href="#master-framework"
              className="px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 border border-[#FF3845]/40 bg-[#FF3845]/15 text-[#FF555C] hover:bg-[#FF3845]/25 backdrop-blur-sm"
            >
              <CalendarDays size={13} />
              <span>Kerangka 2027</span>
            </a>
          </div>
        </div>
      </section>

      {/* Master Annual Training Framework 2027 Section */}
      <section id="master-framework" className="py-14 md:py-20 border-b border-white/[0.08] relative">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="framework-header-content flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#FF3845]/40 bg-[#FF3845]/10 text-[#FF3845] text-xs font-bold tracking-wider uppercase mb-2">
                <Target size={13} />
                <span>KERANGKA PROGRAM LATIHAN TAHUNAN 2027</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold font-athletic text-white uppercase tracking-wide">
                MASTER ANNUAL TRAINING FRAMEWORK 2027
              </h2>
              <p className="text-xs sm:text-sm text-[#A2A3AA] mt-1">
                Kitaran 52 Minggu (6 + 6 Bulan) diselaraskan bersama Piawaian ISN, Kod Perubatan PERSILAT 2026, dan Majlis Sukan Negara (MSN).
              </p>
            </div>

            {/* Framework Sub-View Switcher */}
            <div className="knowledge-pill-switcher flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl">
              <button
                type="button"
                onClick={() => setFrameworkViewTab("calendar")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  frameworkViewTab === "calendar"
                    ? "bg-[#E10600] text-white shadow-sm"
                    : "text-[#8E9099] hover:text-white"
                }`}
              >
                1. {kd.framework.subtabCalendar}
              </button>
              <button
                type="button"
                onClick={() => setFrameworkViewTab("competition")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  frameworkViewTab === "competition"
                    ? "bg-[#E10600] text-white shadow-sm"
                    : "text-[#8E9099] hover:text-white"
                }`}
              >
                2. {kd.framework.subtabPolicy}
              </button>
              <button
                type="button"
                onClick={() => setFrameworkViewTab("baseline")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  frameworkViewTab === "baseline"
                    ? "bg-[#E10600] text-white shadow-sm"
                    : "text-[#8E9099] hover:text-white"
                }`}
              >
                3. {kd.framework.subtabTests}
              </button>
              <button
                type="button"
                onClick={() => setFrameworkViewTab("priorities")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  frameworkViewTab === "priorities"
                    ? "bg-[#E10600] text-white shadow-sm"
                    : "text-[#8E9099] hover:text-white"
                }`}
              >
                4. {kd.framework.subtabPriorities}
              </button>
            </div>
          </div>

          {/* VIEW 1: 12-Month Periodization Roadmap */}
          {frameworkViewTab === "calendar" && (
            <div className="space-y-6">
              {/* Block Switcher (Blok 1 vs Blok 2) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedBlock(1);
                    if (selectedMonthIndex > 6) setSelectedMonthIndex(1);
                  }}
                  className={`framework-block-card p-4 rounded-xl border text-left transition-all ${
                    selectedBlock === 1
                      ? "active"
                      : "text-[#8E9099]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#FF555C]">
                      Fasa 1 (Januari – Jun 2027)
                    </span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#FF3845]/15 text-[#FF555C] font-bold">
                      Blok 1
                    </span>
                  </div>
                  <div className="text-lg font-bold font-athletic text-white uppercase tracking-wide">
                    FOUNDATION &amp; PHYSICAL DEVELOPMENT
                  </div>
                  <p className="text-xs text-[#9698A0] mt-1">
                    Pembinaan asas aerobik, kekuatan teras, mobiliti buku lali, dan penilaian semula Jun.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedBlock(2);
                    if (selectedMonthIndex <= 6) setSelectedMonthIndex(7);
                  }}
                  className={`framework-block-card p-4 rounded-xl border text-left transition-all ${
                    selectedBlock === 2
                      ? "active"
                      : "text-[#8E9099]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#FF555C]">
                      Fasa 2 (Julai – Disember 2027)
                    </span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#FF3845]/15 text-[#FF555C] font-bold">
                      Blok 2
                    </span>
                  </div>
                  <div className="text-lg font-bold font-athletic text-white uppercase tracking-wide">
                    SPECIFIC PERFORMANCE &amp; TECHNICAL PEAK
                  </div>
                  <p className="text-xs text-[#9698A0] mt-1">
                    Kondisi khusus disiplin, simulasi kejohanan, fasa taper kemuncak, dan laporan tahunan.
                  </p>
                </button>
              </div>

              {/* Monthly Selector Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                {blockMonths.map((month) => {
                  const isActive = selectedMonthIndex === month.monthIndex;
                  return (
                    <button
                      key={month.monthCode}
                      type="button"
                      onClick={() => setSelectedMonthIndex(month.monthIndex)}
                      className={`timeline-month-btn p-3 rounded-xl border text-left flex flex-col justify-between ${
                        isActive
                          ? "active"
                          : "text-[#8E9099]"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className={`text-xs font-bold font-mono ${isActive ? "text-white" : "text-[#FF555C]"}`}>
                            {month.monthCode}
                          </span>
                          {month.highlightTag && (
                            <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                              isActive ? "bg-black/30 text-white" : "bg-[#FF3845]/20 text-[#FF858B]"
                            }`}>
                              {month.highlightTag}
                            </span>
                          )}
                        </div>
                        <div className={`text-sm font-bold font-athletic uppercase tracking-wide ${isActive ? "text-white" : "text-[#E1E2E6]"}`}>
                          {month.monthName}
                        </div>
                        <div className={`text-[11px] font-medium truncate mt-0.5 ${isActive ? "text-white/90" : "text-[#9E9FA7]"}`}>
                          {month.theme}
                        </div>
                      </div>

                      <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[10px]">
                        <span>V: {month.volumePercentage}%</span>
                        <span>I: {month.intensityPercentage}%</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Active Month Detail Card */}
              <div className="framework-detail-card p-6 sm:p-8 rounded-2xl shadow-xl">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#E10600]/20 text-[#FF555C] border border-[#FF3845]/40">
                        {activeMonthData.blockTitle}
                      </span>
                      <span className="text-xs text-[#8E9099] font-mono">
                        Bulan #{activeMonthData.monthIndex} · 2027
                      </span>
                      {activeMonthData.reviewGate && (
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                          <AlertTriangle size={11} /> {activeMonthData.reviewGate}
                        </span>
                      )}
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-bold font-athletic text-white uppercase tracking-wide">
                      {activeMonthData.monthName}: {activeMonthData.theme}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#A2A3AA] mt-0.5">
                      {activeMonthData.subtitle}
                    </p>
                  </div>

                  {/* Volume vs Intensity Dual Progress Bars */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 bg-white/[0.03] p-3.5 rounded-xl border border-white/[0.07] backdrop-blur-sm min-w-[280px]">
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-[11px] mb-1 font-bold">
                        <span className="text-[#3B82F6]">Volum Latihan</span>
                        <span className="text-white font-mono">{activeMonthData.volumePercentage}%</span>
                      </div>
                      <div className="w-full bg-white/[0.08] h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[#3B82F6] h-full rounded-full transition-all duration-500"
                          style={{ width: `${activeMonthData.volumePercentage}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between text-[11px] mb-1 font-bold">
                        <span className="text-[#FF3845]">Intensiti Sesi</span>
                        <span className="text-white font-mono">{activeMonthData.intensityPercentage}%</span>
                      </div>
                      <div className="w-full bg-white/[0.08] h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[#FF3845] h-full rounded-full transition-all duration-500"
                          style={{ width: `${activeMonthData.intensityPercentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Focus Areas & Milestone Badge */}
                <div className="py-6 border-b border-white/[0.08]">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                    <span className="text-xs font-bold text-[#E5E6EB] uppercase tracking-wider block">
                      Fokus Latihan Utama ({activeMonthData.monthName}):
                    </span>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#FF3845]/15 border border-[#FF3845]/30 text-xs font-bold text-[#FF858B]">
                      <Award size={13} />
                      <span>Milestone: {activeMonthData.milestone}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {activeMonthData.focusAreas.map((focus, idx) => (
                      <div key={idx} className="p-3 rounded-lg border border-white/[0.06] bg-white/[0.02] flex items-start gap-2">
                        <CheckCircle2 size={14} className="text-[#FF3845] shrink-0 mt-0.5" />
                        <span className="text-xs text-[#D1D2D7] leading-relaxed">{focus}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2-Column Task Grid: Athlete Tasks vs Coach Tasks */}
                <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Athlete Tasks */}
                  <div className="knowledge-frosted-subcard p-4 sm:p-5 rounded-xl">
                    <div className="flex items-center gap-2 mb-3 text-white">
                      <Users size={16} className="text-[#3B82F6]" />
                      <h4 className="text-sm font-bold uppercase tracking-wider">
                        Tugasan Atlet (Kendiri &amp; Aplikasi)
                      </h4>
                    </div>
                    <ul className="space-y-2">
                      {activeMonthData.fighterxTasks.athlete.map((task, idx) => (
                        <li key={idx} className="text-xs text-[#C5C6CA] flex items-start gap-2 leading-relaxed">
                          <span className="w-4 h-4 rounded-full bg-blue-500/20 text-blue-400 font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5 font-bold">
                            {idx + 1}
                          </span>
                          <span>{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Coach Responsibilities */}
                  <div className="knowledge-frosted-subcard p-4 sm:p-5 rounded-xl">
                    <div className="flex items-center gap-2 mb-3 text-white">
                      <ShieldCheck size={16} className="text-[#FF3845]" />
                      <h4 className="text-sm font-bold uppercase tracking-wider">
                        Tanggungjawab Coach (Semakan &amp; Pengesahan)
                      </h4>
                    </div>
                    <ul className="space-y-2">
                      {activeMonthData.fighterxTasks.coach.map((task, idx) => (
                        <li key={idx} className="text-xs text-[#C5C6CA] flex items-start gap-2 leading-relaxed">
                          <span className="w-4 h-4 rounded-full bg-[#E10600]/20 text-[#FF555C] font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5 font-bold">
                            {idx + 1}
                          </span>
                          <span>{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: Dasar Pertandingan Sepanjang Tahun (Priority A, B, C) */}
          {frameworkViewTab === "competition" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {COMPETITION_POLICIES.map((policy) => {
                  const badgeClass =
                    policy.priority === "A"
                      ? "badge-crimson"
                      : policy.priority === "B"
                      ? "badge-blue"
                      : "badge-gold";

                  return (
                    <div
                      key={policy.priority}
                      className="framework-policy-card p-6 rounded-2xl flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className={`category-tag ${badgeClass} font-mono font-bold text-xs`}>
                            KEUTAMAAN {policy.priority}
                          </span>
                          <span className="text-[11px] text-[#8E9099] font-medium">{policy.type}</span>
                        </div>

                        <h3 className="text-xl font-bold font-athletic text-white uppercase tracking-wide mb-2">
                          {policy.label}
                        </h3>

                        {/* Target Events */}
                        <div className="mb-4">
                          <span className="text-[10px] font-bold text-[#8A8C95] uppercase tracking-wider block mb-1">
                            Sasaran Kejohanan:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {policy.targetEvents.map((evt, idx) => (
                              <span key={idx} className="px-2 py-0.5 rounded text-[10px] bg-white/[0.04] text-[#C5C6CA] border border-white/[0.08]">
                                {evt}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Taper Protocol */}
                        <div className="p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm mb-3">
                          <span className="text-[10px] font-bold text-[#ff4d5a] uppercase tracking-wider block mb-1">
                            Protokol Tapering:
                          </span>
                          <p className="text-xs text-[#D1D2D7] leading-relaxed">
                            {policy.taperProtocol}
                          </p>
                        </div>

                        {/* Load Adjustment */}
                        <div className="p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm mb-4">
                          <span className="text-[10px] font-bold text-[#64b7ff] uppercase tracking-wider block mb-1">
                            Pelarasan Beban Latihan:
                          </span>
                          <p className="text-xs text-[#D1D2D7] leading-relaxed">
                            {policy.loadAdjustment}
                          </p>
                        </div>
                      </div>

                      {/* Fight Week Rules */}
                      <div className="pt-4 border-t border-white/[0.08]">
                        <span className="text-[10px] font-bold text-[#E5E6EB] uppercase tracking-wider block mb-2">
                          Peraturan Minggu Pertandingan:
                        </span>
                        <ul className="space-y-1.5">
                          {policy.fightWeekRules.map((rule, idx) => (
                            <li key={idx} className="text-[11px] text-[#A2A3AA] flex items-start gap-1.5 leading-tight">
                              <Check size={12} className="text-[#ff4d5a] shrink-0 mt-0.5" />
                              <span>{rule}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Fight Week Compliance Immunity Banner */}
              <div className="fight-week-banner p-5 rounded-2xl border border-white/[0.08] bg-white/[0.025] backdrop-blur-[16px] shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck size={24} className="text-[#ffd24c] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-wide">
                      Dasar Imuniti Pematuhan Minggu Pertandingan (Fight Week Immunity)
                    </h4>
                    <p className="text-xs text-[#C5C6CA] mt-0.5 leading-relaxed">
                      Sistem FighterX secara automatik mengecualikan atlet bertanding daripada tugasan fizikal kendiri berat sepanjang minggu pertandingan. Atlet tidak akan dikenakan sebarang penalti pematuhan untuk rehat terancang demi keselamatan dan pemulihan maksimum.
                    </p>
                  </div>
                </div>

                <a
                  href="#interactive-tools"
                  onClick={() => setActiveToolTab("weight")}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#10B981] text-black hover:bg-[#34D399] transition-colors shrink-0"
                >
                  Kira Berat Selamat
                </a>
              </div>
            </div>
          )}

          {/* VIEW 3: 6 Baseline Assessments Explorer */}
          {frameworkViewTab === "baseline" && (
            <div className="space-y-6">
              {/* Session Filter */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                <button
                  type="button"
                  onClick={() => setBaselineSessionFilter("all")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    baselineSessionFilter === "all"
                      ? "bg-[#E10600] text-white shadow-sm"
                      : "bg-white/[0.04] text-[#8E9099] border border-white/[0.08] hover:text-white hover:bg-white/[0.08] backdrop-blur-sm"
                  }`}
                >
                  Semua Sesi ({BASELINE_ASSESSMENTS.length})
                </button>
                <button
                  type="button"
                  onClick={() => setBaselineSessionFilter("Sesi A (Fizikal & Mobiliti)")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    baselineSessionFilter === "Sesi A (Fizikal & Mobiliti)"
                      ? "bg-[#E10600] text-white shadow-sm"
                      : "bg-white/[0.04] text-[#8E9099] border border-white/[0.08] hover:text-white hover:bg-white/[0.08] backdrop-blur-sm"
                  }`}
                >
                  Sesi A: Fizikal &amp; Mobiliti
                </button>
                <button
                  type="button"
                  onClick={() => setBaselineSessionFilter("Sesi B (Teknik & Stamina)")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    baselineSessionFilter === "Sesi B (Teknik & Stamina)"
                      ? "bg-[#E10600] text-white shadow-sm"
                      : "bg-white/[0.04] text-[#8E9099] border border-white/[0.08] hover:text-white hover:bg-white/[0.08] backdrop-blur-sm"
                  }`}
                >
                  Sesi B: Teknik &amp; Stamina
                </button>
              </div>

              {/* Grid of Baseline Assessments */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredBaselineTests.map((test) => (
                  <div
                    key={test.id}
                    className="framework-baseline-card p-6 rounded-2xl flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#FF3845]/15 text-[#FF555C] border border-[#FF3845]/30">
                          {test.session}
                        </span>
                        <span className="text-[11px] text-[#8E9099] font-mono">Disiplin: {test.discipline}</span>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-bold font-athletic text-white uppercase tracking-wide mb-1">
                        {test.title}
                      </h3>

                      <div className="text-xs font-bold text-[#FF555C] font-mono mb-3">
                        Metrik Utama: {test.primaryMetric}
                      </div>

                      <p className="text-xs text-[#C5C6CA] leading-relaxed mb-4">
                        {test.protocolSummary}
                      </p>

                      {/* Detailed Steps */}
                      <div className="p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02] mb-4">
                        <span className="text-[10px] font-bold text-[#E5E6EB] uppercase tracking-wider block mb-2">
                          Langkah Pelaksanaan Protokol:
                        </span>
                        <ol className="space-y-1.5 list-decimal pl-4 text-[11px] text-[#A2A3AA]">
                          {test.detailedSteps.map((step, idx) => (
                            <li key={idx} className="leading-snug">{step}</li>
                          ))}
                        </ol>
                      </div>

                      {/* Scoring Rubric Table */}
                      <div className="rounded-xl border border-white/[0.08] overflow-hidden mb-4 bg-white/[0.02]">
                        <div className="bg-white/[0.05] px-3 py-2 text-[11px] font-bold text-white uppercase tracking-wider">
                          Rubrik Skor Prestasi
                        </div>
                        <div className="divide-y divide-white/[0.05] text-[11px]">
                          {test.scoringRubric.map((r, rIdx) => (
                            <div key={rIdx} className="p-2.5 flex items-start justify-between gap-2">
                              <span className="font-bold text-[#FF555C] shrink-0 min-w-[90px]">{r.tier}</span>
                              <span className="text-white font-mono shrink-0">{r.standard}</span>
                              <span className="text-[#8E9099] text-[10px] text-right">{r.description}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Safety Clearance Note if any */}
                      {test.safetyClearance && (
                        <div className="p-2.5 rounded-lg border border-amber-500/30 bg-amber-500/10 text-[11px] text-amber-200 flex items-start gap-2 mb-3">
                          <AlertTriangle size={13} className="shrink-0 text-amber-400 mt-0.5" />
                          <span><strong>Saringan Keselamatan:</strong> {test.safetyClearance}</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-white/[0.08] text-[10px] text-[#7A7C85] font-mono flex items-center justify-between">
                      <span>Rujukan: {test.officialReference}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW 4: 5 Training Priorities Matrix */}
          {frameworkViewTab === "priorities" && (
            <div className="space-y-6">
              <div className="text-center max-w-2xl mx-auto mb-4">
                <span className="text-xs font-bold text-[#FF555C] uppercase tracking-wider block mb-1">
                  Sistem Pengelompokan Saintifik Atlet
                </span>
                <p className="text-xs sm:text-sm text-[#A2A3AA]">
                  FighterX menolak agregat markah rawak. Setiap atlet dikelompokkan ke dalam trek pembangunan mengikut jurang kelemahan sebenar yang dikesan melalui 6 Ujian Baseline.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {TRAINING_PRIORITIES.map((priority) => {
                  const badgeClass =
                    priority.code === "ENDURANCE"
                      ? "badge-crimson"
                      : priority.code === "STRENGTH"
                      ? "badge-silver"
                      : priority.code === "MOVEMENT"
                      ? "badge-blue"
                      : priority.code === "TECHNICAL"
                      ? "badge-silver"
                      : "badge-gold";

                  return (
                    <div
                      key={priority.id}
                      className="framework-priority-card p-6 rounded-2xl flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className={`category-tag ${badgeClass} font-mono font-bold text-[10px]`}>
                            {priority.code}
                          </span>
                          <span className="text-[10px] text-[#8E9099] font-mono">Trek #2027</span>
                        </div>

                        <h3 className="text-xl font-bold font-athletic text-white uppercase tracking-wide mb-1">
                          {priority.title}
                        </h3>

                        <div className="text-xs font-medium text-[#FF858B] mb-3">
                          {priority.tagline}
                        </div>

                        {/* Target Criteria */}
                        <div className="p-3 rounded-xl border border-white/[0.06] bg-white/[0.02] mb-3">
                          <span className="text-[10px] font-bold text-[#E5E6EB] uppercase tracking-wider block mb-1">
                            Kriteria Kelayakan:
                          </span>
                          <p className="text-xs text-[#C5C6CA] leading-snug">
                            {priority.targetCriteria}
                          </p>
                        </div>

                        {/* Primary Focus */}
                        <div className="mb-3">
                          <span className="text-[10px] font-bold text-[#8A8C95] uppercase tracking-wider block mb-1.5">
                            Tumpuan Utama:
                          </span>
                          <ul className="space-y-1">
                            {priority.primaryFocus.map((foc, idx) => (
                              <li key={idx} className="text-[11px] text-[#B5B6BD] flex items-start gap-1.5 leading-snug">
                                <CheckCircle2 size={12} className="text-[#ff4d5a] shrink-0 mt-0.5" />
                                <span>{foc}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Sample Prescription */}
                        <div className="p-3 rounded-xl border border-white/[0.06] bg-white/[0.02] mb-4">
                          <span className="text-[10px] font-bold text-[#64b7ff] uppercase tracking-wider block mb-1.5">
                            Contoh Preskripsi Latihan Mingguan:
                          </span>
                          <ul className="space-y-1">
                            {priority.samplePrescription.map((rx, idx) => (
                              <li key={idx} className="text-[11px] text-[#C5C6CA] leading-snug">
                                • {rx}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Graduation Indicator */}
                      <div className="pt-3 border-t border-white/[0.08]">
                        <span className="text-[10px] font-bold text-[#ffd24c] uppercase tracking-wider block mb-1">
                          Syarat Tamat / Naik Taraf:
                        </span>
                        <p className="text-xs text-[#A2A3AA] leading-snug">
                          {priority.graduationIndicator}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Main Articles Grid Section (Practical 3-Tier Structure & Official Links) */}
      <section id="articles-section" className="py-12 md:py-16">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold text-[#FF555C] uppercase tracking-wider block mb-1">
                Koleksi Rujukan Praktikal Sains Sukan
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-athletic text-white uppercase tracking-wide">
                ARTIKEL &amp; PANDUAN PRAKTIKAL SAINS SUKAN
              </h2>
              <p className="text-xs text-[#8E9099] mt-0.5">
                Struktur 3-tahap ringkas: Masalah Lapangan, Solusi Saintifik, dan Tindakan Praktikal Hari Ini.
              </p>
            </div>
            <span className="text-xs text-[#7A7C85] hidden sm:block">
              Semua artikel disahkan oleh panel pakar sukan bertauliah
            </span>
          </div>

          {filteredArticles.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-white/[0.12] rounded-2xl bg-white/[0.025] backdrop-blur-[16px] shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)]">
              <Search size={36} className="mx-auto text-[#686A72] mb-3" />
              <h3 className="text-lg font-bold text-white">Tiada artikel sepadan</h3>
              <p className="text-xs text-[#8E9099] mt-1 max-w-sm mx-auto">
                Cuba kata kunci carian lain atau pilih kategori &quot;Semua Topik&quot;.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="mt-4 px-4 py-2 rounded-lg text-xs font-bold text-[#FF555C] border border-[#FF3845]/40 bg-[#FF3845]/10 hover:bg-[#FF3845]/20 backdrop-blur-sm transition-all"
              >
                Reset Penapis
              </button>
            </div>
          ) : (
            <div ref={articlesMotionRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredArticles.map((article) => (
                <article
                  key={article.id}
                  className="knowledge-article-card rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Top Meta Bar */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="category-tag badge-crimson">
                        {article.categoryLabel}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-[#8C8E98]">
                        <Clock size={12} /> {article.readTime}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold font-athletic text-white tracking-wide group-hover:text-[#FF555C] transition-colors leading-snug">
                      {article.title}
                    </h3>
                    <p className="text-xs font-semibold text-[#B0B1B8] mt-1 mb-3 line-clamp-1">
                      {article.subtitle}
                    </p>

                    {/* 3-Tier Practical Content Boxes */}
                    <div className="space-y-2.5 mb-5">
                      {/* Tier 1: Real Field Problem */}
                      <div className="p-3 rounded-xl tier-problem-box">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#ff4d5a] mb-1">
                          <AlertTriangle size={13} className="shrink-0" />
                          <span>Masalah Lapangan:</span>
                        </div>
                        <p className="text-xs text-[#E5E6EB] leading-relaxed line-clamp-2">
                          {article.fieldProblem}
                        </p>
                      </div>

                      {/* Tier 2: Scientific Solution */}
                      <div className="p-3 rounded-xl tier-solution-box">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#64b7ff] mb-1">
                          <Zap size={13} className="shrink-0" />
                          <span>Solusi Saintifik:</span>
                        </div>
                        <p className="text-xs text-[#E5E6EB] leading-relaxed line-clamp-2">
                          {article.scientificSolution}
                        </p>
                      </div>

                      {/* Tier 3: Action Step Today */}
                      <div className="p-3 rounded-xl tier-action-box">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#ffd24c] mb-1">
                          <CheckCircle2 size={13} className="shrink-0" />
                          <span>Tindakan Hari Ini:</span>
                        </div>
                        <p className="text-xs text-[#E5E6EB] leading-relaxed line-clamp-2">
                          {article.actionStepToday}
                        </p>
                      </div>
                    </div>

                    {/* Official Citation Links Buttons */}
                    {article.officialLinks && article.officialLinks.length > 0 && (
                      <div className="mb-4 pt-3 border-t border-white/[0.08]">
                        <span className="text-[10px] font-bold text-[#8A8C95] uppercase tracking-wider block mb-1.5">
                          Rujukan Rasmi:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {article.officialLinks.map((link, idx) => (
                            <a
                              key={idx}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2 py-1 rounded text-[10px] font-bold bg-white/[0.04] border border-white/[0.08] hover:border-[#FF3845] text-[#C5C6CA] hover:text-white inline-flex items-center gap-1 transition-colors"
                            >
                              <span>{link.label}</span>
                              <ExternalLink size={9} className="text-[#8E9099]" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Actions Footer */}
                  <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
                    <Link
                      href={`/knowledge/${article.slug}`}
                      className="text-[11px] text-[#A2A3AA] hover:text-white transition-colors"
                    >
                      Laman Penuh
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleOpenArticle(article)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF555C] group-hover:translate-x-1 transition-all"
                    >
                      Baca Penuh <ArrowRight size={14} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Interactive Sports-Science Tools Suite */}
      <section id="interactive-tools" className="py-14 border-t border-white/[0.08] relative">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="tools-header-anim text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold text-[#FF3845] uppercase tracking-wider block mb-1">
              {kd.tools.title}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-athletic text-white tracking-wide uppercase">
              {kd.tools.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#A2A3AA] mt-1">
              {kd.tools.subtitle}
            </p>
          </div>

          {/* Tool Switcher Tabs */}
          <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-8">
            <button
              type="button"
              onClick={() => setActiveToolTab("periodization")}
              className={`tool-tab-btn px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
                activeToolTab === "periodization"
                  ? "bg-[#E10600] text-white shadow-[0_4px_16px_rgba(225,6,0,0.35)] border border-[#FF3845]"
                  : "bg-white/[0.04] text-[#A2A3AA] border border-white/[0.08] hover:text-white hover:bg-white/[0.08] backdrop-blur-sm"
              }`}
            >
              <CalendarDays size={14} />
              <span>1. {kd.tools.tabPeriodization}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveToolTab("weight")}
              className={`tool-tab-btn px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
                activeToolTab === "weight"
                  ? "bg-[#E10600] text-white shadow-[0_4px_16px_rgba(225,6,0,0.35)] border border-[#FF3845]"
                  : "bg-white/[0.04] text-[#A2A3AA] border border-white/[0.08] hover:text-white hover:bg-white/[0.08] backdrop-blur-sm"
              }`}
            >
              <Scale size={14} />
              <span>2. {kd.tools.tabWeightCut}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveToolTab("sweat")}
              className={`tool-tab-btn px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
                activeToolTab === "sweat"
                  ? "bg-[#E10600] text-white shadow-[0_4px_16px_rgba(225,6,0,0.35)] border border-[#FF3845]"
                  : "bg-white/[0.04] text-[#A2A3AA] border border-white/[0.08] hover:text-white hover:bg-white/[0.08] backdrop-blur-sm"
              }`}
            >
              <Droplets size={14} />
              <span>3. {kd.tools.tabSweatRate}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveToolTab("stakeholder")}
              className={`tool-tab-btn px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
                activeToolTab === "stakeholder"
                  ? "bg-[#E10600] text-white shadow-[0_4px_16px_rgba(225,6,0,0.35)] border border-[#FF3845]"
                  : "bg-white/[0.04] text-[#A2A3AA] border border-white/[0.08] hover:text-white hover:bg-white/[0.08] backdrop-blur-sm"
              }`}
            >
              <Users size={14} />
              <span>4. {kd.tools.tabStakeholders}</span>
            </button>
          </div>

          {/* Active Tool View */}
          {activeToolTab === "periodization" && <PeriodizationMatrix />}
          {activeToolTab === "weight" && <WeightCutPlanner />}
          {activeToolTab === "sweat" && <SweatRateCalculator />}
          {activeToolTab === "stakeholder" && <StakeholderGuideSwitcher />}
        </div>
      </section>

      {/* PERSILAT 2026 Weight Categories Reference Strip */}
      <section id="weight-categories" className="py-12 border-t border-white/[0.08] bg-transparent">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="weight-header-anim flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-bold text-[#FF555C] uppercase tracking-wider block mb-0.5">
                Piawaian Rasmi Pertandingan
              </span>
              <h3 className="text-xl sm:text-2xl font-bold font-athletic text-white uppercase tracking-wide">
                STANDARD KELAS BERAT TANDING PERSILAT 2026
              </h3>
            </div>
            <span className="text-xs text-[#8E9099]">Kategori Dewasa (Putera &amp; Puteri)</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {WEIGHT_CATEGORIES_PERSILAT.map((wc) => (
              <div
                key={wc.code}
                className="weight-category-card p-3.5 rounded-xl text-center"
              >
                <span className="text-xs font-bold font-athletic text-[#FF3845] block">
                  KELAS {wc.code}
                </span>
                <span className="text-xs text-white font-mono block mt-1 font-bold">
                  {wc.minKg} - {wc.maxKg} kg
                </span>
                <span className="text-[10px] text-[#7A7C85] block mt-0.5">{wc.gender}</span>
              </div>
            ))}
          </div>

          <div className="weight-notice-anim mt-4 p-3.5 rounded-xl border border-[rgba(255,56,69,0.3)] bg-[rgba(255,56,69,0.05)] backdrop-blur-md flex items-center gap-2.5 text-xs text-[#FF858B]">
            <ShieldCheck size={16} className="shrink-0 text-[#FF3845]" />
            <span>
              PERSILAT 2026: Timbang berat rasmi dilakukan 1 hari sebelum kejohanan bermula dengan toleransi 0.00 kg. Pematuhan had berat badan selamat adalah mandatori.
            </span>
          </div>
        </div>
      </section>

      {/* Full Article Reader Modal / Drawer */}
      {activeArticle && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="article-reader-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveArticle(null);
          }}
        >
          <div
            ref={articleModalRef}
            className="knowledge-modal-shell relative w-full max-w-4xl max-h-[92vh] rounded-2xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-white/[0.08] bg-white/[0.02] flex items-start justify-between gap-4 sticky top-0 z-10 backdrop-blur-md">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="category-tag badge-crimson">
                    {activeArticle.categoryLabel}
                  </span>
                  <span className="text-[11px] text-[#8E9099] flex items-center gap-1">
                    <Clock size={12} /> {activeArticle.readTime}
                  </span>
                  <span className="text-[11px] text-[#8E9099]">· Semakan: {activeArticle.reviewedBy}</span>
                </div>
                <h2 id="article-reader-title" className="text-2xl sm:text-3xl font-bold font-athletic text-white uppercase tracking-wide">
                  {activeArticle.title}
                </h2>
                <p className="text-xs text-[#A8A9B2] mt-1">{activeArticle.subtitle}</p>
              </div>
              <button
                ref={articleCloseBtnRef}
                type="button"
                onClick={() => setActiveArticle(null)}
                className="p-2 rounded-lg bg-white/10 text-[#A2A3AA] hover:text-white hover:bg-white/15 transition-colors shrink-0 cursor-pointer"
                aria-label="Tutup artikel"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-8 text-xs sm:text-sm text-[#D1D2D7] leading-relaxed knowledge-drawer-scroll">
              {/* Summary Callout */}
              <div className="p-4 rounded-xl border border-white/10 bg-white/[0.03] text-[#E0E0E4]">
                <strong className="block text-xs font-bold text-[#FF555C] uppercase tracking-wider mb-1">
                  Ringkasan Eksekutif
                </strong>
                <p>{activeArticle.summary}</p>
              </div>

              {/* 3-Tier Practical Content Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl tier-problem-box">
                  <strong className="text-xs font-bold text-[#ff4d5a] block mb-1">
                    ⚠️ Masalah Lapangan
                  </strong>
                  <p className="text-xs text-[#D1D2D7]">{activeArticle.fieldProblem}</p>
                </div>

                <div className="p-3.5 rounded-xl tier-solution-box">
                  <strong className="text-xs font-bold text-[#64b7ff] block mb-1">
                    🔬 Solusi Saintifik
                  </strong>
                  <p className="text-xs text-[#D1D2D7]">{activeArticle.scientificSolution}</p>
                </div>

                <div className="p-3.5 rounded-xl tier-action-box">
                  <strong className="text-xs font-bold text-[#ffd24c] block mb-1">
                    ⚡ Tindakan Hari Ini
                  </strong>
                  <p className="text-xs text-[#D1D2D7]">{activeArticle.actionStepToday}</p>
                </div>
              </div>

              {/* Key Takeaways */}
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
                  Poin Kunci &amp; Prinsip Utama
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activeArticle.keyTakeaways.map((point, idx) => (
                    <div key={idx} className="p-3 rounded-lg border border-white/[0.06] bg-white/[0.02] flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-[#FF3845] shrink-0 mt-0.5" />
                      <span className="text-xs text-[#C5C6CA]">{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sections */}
              {activeArticle.sections.map((section, sIdx) => (
                <div key={sIdx} className="space-y-3 pt-4 border-t border-white/[0.08]">
                  <h4 className="text-lg font-bold font-athletic text-white uppercase tracking-wide">
                    {section.heading}
                  </h4>
                  {section.content.map((p, pIdx) => (
                    <p key={pIdx} className="text-xs sm:text-sm text-[#C5C6CA] leading-relaxed">
                      {p}
                    </p>
                  ))}

                  {/* Bullet points if any */}
                  {section.bulletPoints && section.bulletPoints.length > 0 && (
                    <ul className="list-disc pl-5 space-y-1 text-xs text-[#B5B6BD]">
                      {section.bulletPoints.map((bp, bpIdx) => (
                        <li key={bpIdx}>{bp}</li>
                      ))}
                    </ul>
                  )}

                  {/* Callout if any */}
                  {section.callout && (
                    <div
                      className={`p-4 rounded-xl border flex items-start gap-3 ${
                        section.callout.type === "warning"
                          ? "border-amber-500/40 bg-amber-500/10 text-amber-200"
                          : section.callout.type === "tip"
                          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
                          : "border-[#FF3845]/40 bg-[#FF3845]/10 text-[#FFD5D7]"
                      }`}
                    >
                      {section.callout.type === "warning" ? (
                        <AlertTriangle size={18} className="text-amber-400 shrink-0 mt-0.5" />
                      ) : (
                        <Info size={18} className="text-[#FF3845] shrink-0 mt-0.5" />
                      )}
                      <div>
                        <strong className="block text-xs font-bold uppercase tracking-wider mb-0.5">
                          {section.callout.title}
                        </strong>
                        <p className="text-xs leading-normal">{section.callout.text}</p>
                      </div>
                    </div>
                  )}

                  {/* Table if any */}
                  {section.table && (
                    <div className="overflow-x-auto rounded-xl border border-white/10">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-white/[0.05] text-white">
                          <tr>
                            {section.table.headers.map((h, hIdx) => (
                              <th key={hIdx} className="p-3 font-bold border-b border-white/10">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.05] bg-white/[0.02]">
                          {section.table.rows.map((row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-white/[0.05]">
                              {row.map((cell, cIdx) => (
                                <td key={cIdx} className="p-3 text-[#B0B1B8]">
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ))}

              {/* Citations List */}
              {activeArticle.citations.length > 0 && (
                <div className="pt-6 border-t border-white/[0.08]">
                  <h4 className="text-xs font-bold text-[#8E9099] uppercase tracking-wider mb-3">
                    Sumber Rujukan Saintifik &amp; Teknikal
                  </h4>
                  <div className="space-y-2">
                    {activeArticle.citations.map((cit) => (
                      <div key={cit.id} className="p-3.5 rounded-lg border border-white/[0.06] bg-white/[0.02] text-[11px] text-[#8E9099]">
                        <strong className="text-white block">{cit.title}</strong>
                        <span>
                          {cit.authors} ({cit.year}). <em>{cit.journal}</em>. {cit.volumeOrDetails}.
                        </span>
                        <p className="mt-1 text-[#FF858B] italic">&ldquo;{cit.keyFinding}&rdquo;</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-white/[0.08] bg-white/[0.02] flex items-center justify-between">
              <Link
                href={`/knowledge/${activeArticle.slug}`}
                className="text-xs text-[#A2A3AA] hover:text-white flex items-center gap-1.5"
              >
                <span>Buka dalam halaman berasingan</span>
                <ExternalLink size={12} />
              </Link>
              <button
                type="button"
                onClick={() => setActiveArticle(null)}
                className="px-5 py-2 rounded-lg text-xs font-bold bg-[#E10600] text-white hover:bg-[#FF3845] transition-colors"
              >
                Selesai Membaca
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Citations Drawer */}
      <CitationsDrawer
        isOpen={citationsDrawerOpen}
        onClose={() => setCitationsDrawerOpen(false)}
      />
    </div>
  );
}
