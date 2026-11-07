"use client";

import { useRef, type PropsWithChildren } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export function GuidelinesMotion({ children }: PropsWithChildren) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(".guidelines-title-line",
        { yPercent: 85, autoAlpha: 0, rotateX: -12, transformOrigin: "50% 100%" },
        { yPercent: 0, autoAlpha: 1, rotateX: 0, duration: 0.72, stagger: 0.12, ease: "power3.out", clearProps: "transform" },
      );
    });

    return () => media.revert();
  }, { scope: root });

  return <div ref={root} className="guidelines-motion-root">{children}</div>;
}
