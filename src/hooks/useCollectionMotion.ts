import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

/**
 * Nemo-style collection motion hook.
 * Animates visible child items whenever dependencyKey changes (filter/tab switch).
 * Only animates items currently in viewport (+100px buffer), max 18 items.
 * Skip on first mount — entrance animation is handled separately.
 */
export function useCollectionMotion<T extends HTMLElement>(dependencyKey: string) {
  const containerRef = useRef<T>(null);
  const previousKey = useRef<string | undefined>(undefined);

  useGSAP(
    () => {
      const node = containerRef.current;
      const isFirstMount = previousKey.current === undefined;
      previousKey.current = dependencyKey;

      if (!node || isFirstMount) return;

      const isReduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (isReduced) return;

      const items = Array.from(node.children)
        .filter((child): child is HTMLElement => child instanceof HTMLElement)
        .filter((child) => {
          const bounds = child.getBoundingClientRect();
          return (
            bounds.height > 0 &&
            bounds.top < window.innerHeight + 100 &&
            bounds.bottom > -100
          );
        })
        .slice(0, 18);

      if (!items.length) return;

      gsap.fromTo(
        items,
        { opacity: 0, y: 14, scale: 0.985 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          stagger: 0.03,
          ease: "power3.out",
          clearProps: "opacity,transform",
        }
      );
    },
    {
      scope: containerRef,
      dependencies: [dependencyKey],
      revertOnUpdate: true,
    }
  );

  return containerRef;
}
