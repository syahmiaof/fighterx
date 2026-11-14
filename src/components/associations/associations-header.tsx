"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useLanguage } from "@/lib/i18n";

interface AssociationsHeaderProps {
  totalCount?: number;
}

export function AssociationsHeader({}: AssociationsHeaderProps) {
  const { dict } = useLanguage();
  const ad = dict.associations;
  const headerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = headerRef.current;
      if (!el) return;
      const isReduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (isReduced) {
        gsap.set(
          el.querySelectorAll(
            ".associations-overline, .associations-title, .associations-narrative, .associations-quote"
          ),
          { autoAlpha: 1, y: 0, clearProps: "transform,filter" }
        );
        return;
      }
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        el.querySelector(".associations-overline"),
        { y: -10, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.55 }
      )
        .fromTo(
          el.querySelector(".associations-title"),
          {
            yPercent: 60,
            autoAlpha: 0,
            filter: "blur(10px)",
          },
          {
            yPercent: 0,
            autoAlpha: 1,
            filter: "blur(0px)",
            duration: 1.0,
            clearProps: "filter,transform",
          },
          "-=0.3"
        )
        .fromTo(
          el.querySelector(".associations-narrative"),
          { y: 16, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.65 },
          "-=0.5"
        )
        .fromTo(
          el.querySelector(".associations-quote"),
          { y: 10, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.5 },
          "-=0.4"
        );
    },
    { scope: headerRef }
  );

  return (
    <div ref={headerRef} className="associations-header">
      {/* Overline with red accent rules */}
      <div className="associations-overline">
        <span className="accent-rule" aria-hidden="true" />
        <span className="overline-text">{ad.overline}</span>
        <span className="accent-rule" aria-hidden="true" />
      </div>

      {/* Main Teko Display Title */}
      <h1 className="associations-title">
        <span className="title-white">DIREKTORI BADAN &amp; </span>
        <span className="title-crimson">PERGURUAN SILAT</span>
      </h1>

      {/* Narrative Heritage Paragraph */}
      <p className="associations-narrative">
        {ad.subtitle}
      </p>

      {/* Mandatory National Quote Callout */}
      <div className="associations-quote" role="figure" aria-label="FighterX National Silat Quote">
        <span className="quote-rule" aria-hidden="true" />
        <span className="quote-text">
          &mdash; <span className="quote-red">&ldquo;</span>{ad.quote}<span className="quote-red">&rdquo;</span> &mdash;
        </span>
        <span className="quote-rule" aria-hidden="true" />
      </div>
    </div>
  );
}
