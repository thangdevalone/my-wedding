"use client";

import { useEffect } from "react";

// Exact animation delays from https://www.nawngswedding.online/redtone (milliseconds)
const ANIMATION_DELAYS: Record<string, number> = {
  LINE11: 1000,
  HEADLINE128: 500,
  HEADLINE134: 500,
  HEADLINE135: 500,
  HEADLINE136: 500,
  HEADLINE137: 500,
  HEADLINE142: 500,
  HEADLINE143: 500,
  IMAGE77: 1000,
  IMAGE79: 1000,
  GROUP21: 1000,
  GROUP47: 1000,
  HEADLINE82: 1000,
  IMAGE90: 1000,
  GROUP71: 1000,
  IMAGE82: 1000,
  IMAGE76: 1000,
  HEADLINE123: 1000,
  IMAGE78: 1000,
  GROUP20: 1000,
  GROUP49: 1000,
  HEADLINE81: 1000,
  HEADLINE83: 1000,
  HEADLINE84: 1000,
  IMAGE88: 1000,
  IMAGE89: 1000,
  IMAGE91: 1000,
  HEADLINE122: 1000,
  HEADLINE108: 1000,
  HEADLINE116: 1000,
  HEADLINE138: 1000,
  HEADLINE139: 1000,
  HEADLINE3: 1000,
  GROUP70: 1000,
  HEADLINE112: 1000,
  HEADLINE111: 1000,
  HEADLINE67: 1000,
  HEADLINE59: 1000,
  HEADLINE62: 1000,
  HEADLINE63: 1000,
  HEADLINE66: 1000,
  LINE12: 1000,
  HEADLINE140: 1000,
  HEADLINE141: 1000,
  HEADLINE117: 1000,
  HEADLINE132: 1000,
  GROUP27: 1000,
  HEADLINE80: 1000,
  HEADLINE86: 1000,
  GROUP74: 1000,
  GROUP59: 1000,
  HEADLINE119: 1000,
  HEADLINE120: 1000,
  HEADLINE121: 1000,
  PARAGRAPH1: 1000,
  HEADLINE94: 1000,
  FORM2: 1000,
  HEADLINE129: 1000,
  HEADLINE130: 1000,
  SHAPE1: 1000,
  IMAGE119: 1000,
  GROUP18: 1250,
  HEADLINE97: 1250,
  GROUP19: 1500,
  HEADLINE70: 1500,
  HEADLINE71: 1500,
  HEADLINE72: 1500,
  HEADLINE73: 1500,
  HEADLINE64: 1150,
  HEADLINE65: 1150,
  HEADLINE68: 1150,
  GROUP22: 1200,
  HEADLINE85: 1200,
  GROUP72: 1200,
  MAP_GIRL: 1200,
  MAP_BOY: 1200,
};

/**
 * 100% Faithful scroll animation engine matching https://www.nawngswedding.online/redtone
 *
 * Flow:
 * 1. Elements start with .w-animation-hidden (opacity: 0, visibility: hidden).
 * 2. When an element approaches or enters the viewport:
 *    - .w-animation is added to match the CSS keyframe selectors.
 *    - Child animated elements (e.g. #SHAPE1 heart pulse inside #GROUP70 calendar) are triggered.
 *    - When the exact redtone animation-delay expires, .w-animation-hidden is removed.
 *    - The CSS keyframe (fadeInUp, fadeInDown, fadeInLeft, fadeInRight, fadeIn, pulse) plays smoothly for 1s.
 * 3. Continuous component animations (#SHAPE1 heart, #GROUP22 rings, #MAP_GIRL/BOY buttons) pulse infinitely!
 */
export function useMotionScroll() {
  useEffect(() => {
    const animatedElements = document.querySelectorAll<HTMLElement>(".w-animation-hidden");
    if (!animatedElements.length) return;

    let observer: IntersectionObserver | null = null;

    const playElementAnimation = (el: HTMLElement) => {
      if (el.classList.contains("w-animation")) return;
      observer?.unobserve(el);

      // 1. Add w-animation to initiate the CSS selector
      el.classList.add("w-animation");

      // 2. Trigger any nested animated children (e.g. #SHAPE1 heart inside #GROUP70)
      el.querySelectorAll<HTMLElement>(".w-animation-hidden").forEach((child) => {
        playElementAnimation(child);
      });

      // 3. Remove hidden class when the exact redtone delay expires
      const delay = ANIMATION_DELAYS[el.id] ?? 0;
      if (delay > 0) {
        setTimeout(() => {
          el.classList.remove("w-animation-hidden");
        }, delay);
      } else {
        el.classList.remove("w-animation-hidden");
      }
    };

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            playElementAnimation(el);
          }
        });
      },
      {
        threshold: 0.01,
        // Start detecting when element approaches viewport (identical to LadiPage viewport overlap check)
        rootMargin: "0px 0px 50px 0px",
      }
    );

    animatedElements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        // Elements in initial viewport on F5 (Section 1 hero)
        playElementAnimation(el);
      } else {
        observer?.observe(el);
      }
    });

    return () => observer?.disconnect();
  }, []);
}
