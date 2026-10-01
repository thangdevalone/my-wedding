"use client";

import { useEffect } from "react";

// Exact animation delays from original redtone site (milliseconds)
const ANIMATION_DELAYS: Record<string, number> = {
  GROUP3: 1000,
  HEADLINE128: 500,
  HEADLINE134: 500,
  HEADLINE135: 500,
  HEADLINE136: 500,
  HEADLINE137: 500,
  IMAGE77: 1000,
  IMAGE78: 1000,
  IMAGE79: 1000,
  HEADLINE108: 1000,
  HEADLINE116: 1000,
  HEADLINE138: 1000,
  HEADLINE139: 1000,
  HEADLINE142: 500,
  HEADLINE143: 500,
  HEADLINE3: 1000,
  GROUP70: 1000,
  SHAPE1: 1000,
  HEADLINE112: 1000,
  HEADLINE111: 1000,
  IMAGE119: 1000,
  HEADLINE67: 1000,
  GROUP18: 1250,
  GROUP19: 1500,
  HEADLINE59: 1000,
  GROUP20: 1000,
  GROUP21: 1000,
  HEADLINE62: 1000,
  HEADLINE63: 1000,
  HEADLINE64: 1150,
  HEADLINE65: 1150,
  GROUP22: 1200,
  HEADLINE66: 1000,
  HEADLINE68: 1150,
  LINE11: 1000,
  LINE12: 1000,
  GROUP49: 1000,
  GROUP47: 1000,
  HEADLINE140: 1000,
  HEADLINE141: 1000,
  HEADLINE117: 1000,
  HEADLINE132: 1000,
  GROUP27: 1000,
  HEADLINE70: 1500,
  HEADLINE71: 1500,
  HEADLINE72: 1500,
  HEADLINE73: 1500,
  HEADLINE80: 1000,
  HEADLINE81: 1000,
  HEADLINE82: 1000,
  HEADLINE83: 1000,
  HEADLINE84: 1000,
  IMAGE88: 1000,
  IMAGE89: 1000,
  IMAGE90: 1000,
  IMAGE91: 1000,
  GROUP71: 1000,
  HEADLINE86: 1000,
  GROUP74: 1000,
  IMAGE82: 1000,
  IMAGE76: 1000,
  GROUP59: 1000,
  HEADLINE119: 1000,
  HEADLINE120: 1000,
  HEADLINE121: 1000,
  HEADLINE122: 1000,
  HEADLINE123: 1000,
  HEADLINE97: 1250,
  PARAGRAPH1: 1000,
  HEADLINE94: 1000,
  FORM2: 1000,
  HEADLINE129: 1000,
  HEADLINE130: 1000,
};

export function useMotionScroll() {
  useEffect(() => {
    const animatedElements = document.querySelectorAll<HTMLElement>(".w-animation-hidden");
    if (!animatedElements.length) return;

    const playElementAnimation = (el: HTMLElement) => {
      // 1. Add w-animation to initiate the CSS keyframe selector
      el.classList.add("w-animation");

      // 2. Keep w-animation-hidden until delay expires (exact redtone behavior)
      const delay = ANIMATION_DELAYS[el.id] ?? 0;

      if (delay > 0) {
        setTimeout(() => {
          el.classList.remove("w-animation-hidden");
        }, delay);
      } else {
        el.classList.remove("w-animation-hidden");
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            observer.unobserve(el);
            playElementAnimation(el);
          }
        });
      },
      {
        threshold: 0.01,
        rootMargin: "0px 0px 40px 0px",
      }
    );

    animatedElements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        // Elements in initial viewport on F5
        playElementAnimation(el);
      } else {
        observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, []);
}
