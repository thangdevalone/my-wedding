"use client";

import { useEffect } from "react";

/**
 * Intelligent Scroll Animation Engine
 *
 * Balance:
 * 1. Slow reading scroll ("lướt chậm"): Triggers right at the bottom of viewport (rootMargin: -40px)
 *    with a crisp, visible entrance animation so users clearly see elements swooping in!
 * 2. Rapid flick / swipe ("lướt nhanh"): Velocity tracker immediately detects high-speed scrolling
 *    and reveals visible elements instantly with delay = 0s to eliminate any blank white flashes.
 */
export function useMotionScroll() {
  useEffect(() => {
    const animatedElements = Array.from(
      document.querySelectorAll<HTMLElement>(".w-animation-hidden")
    );
    if (!animatedElements.length) return;

    let observer: IntersectionObserver | null = null;
    let pendingElements: HTMLElement[] = [];
    let batchTimeout: NodeJS.Timeout | null = null;

    // Fast scroll velocity tracker
    let lastScrollY = window.scrollY;
    let lastScrollTime = Date.now();
    let isFastScrolling = false;
    let fastScrollTimeout: NodeJS.Timeout | null = null;

    const onScroll = () => {
      const now = Date.now();
      const dt = now - lastScrollTime;
      if (dt > 12) {
        const dy = Math.abs(window.scrollY - lastScrollY);
        const speed = dy / dt; // px/ms
        if (speed > 2.5) {
          isFastScrolling = true;
          if (fastScrollTimeout) clearTimeout(fastScrollTimeout);
          fastScrollTimeout = setTimeout(() => {
            isFastScrolling = false;
          }, 180);

          // Fast scroll bypass: only reveal elements already visible inside the viewport
          // Never reveal elements that are still off-screen below the viewport!
          animatedElements.forEach((el) => {
            if (!el.classList.contains("w-animation")) {
              const rect = el.getBoundingClientRect();
              if (rect.top < window.innerHeight - 10 && rect.bottom > 0) {
                el.style.setProperty("--anim-delay", "0s");
                el.style.setProperty("animation-delay", "0s", "important");
                el.classList.remove("w-animation-hidden");
                el.classList.add("w-animation");
                observer?.unobserve(el);
              }
            }
          });
        }
        lastScrollY = window.scrollY;
        lastScrollTime = now;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const processBatch = (elementsToAnimate: HTMLElement[]) => {
      if (!elementsToAnimate.length) return;

      const valid = elementsToAnimate.filter(
        (el) => !el.classList.contains("w-animation")
      );
      if (!valid.length) return;

      // Sort elements: top-to-bottom, then left-to-right for same row
      valid.sort((a, b) => {
        const rA = a.getBoundingClientRect();
        const rB = b.getBoundingClientRect();
        if (Math.abs(rA.top - rB.top) > 18) {
          return rA.top - rB.top;
        }
        return rA.left - rB.left;
      });

      // On slow scroll, start at 60ms so animation is clearly visible as it enters the screen!
      const BASE_DELAY_MS = isFastScrolling ? 0 : 60;
      const ROW_STEP_MS = isFastScrolling ? 25 : 140;
      const COL_STEP_MS = isFastScrolling ? 20 : 110;

      let currentDelay = BASE_DELAY_MS;
      let prevTop: number | null = null;

      valid.forEach((el, index) => {
        observer?.unobserve(el);

        const r = el.getBoundingClientRect();
        if (index > 0 && prevTop !== null) {
          const isSameRow = Math.abs(r.top - prevTop) <= 18;
          currentDelay += isSameRow ? COL_STEP_MS : ROW_STEP_MS;
        }
        prevTop = r.top;

        const delaySeconds = (currentDelay / 1000).toFixed(2) + "s";

        el.style.setProperty("--anim-delay", delaySeconds);
        el.style.setProperty("animation-delay", delaySeconds, "important");

        const animChildren = el.querySelectorAll<HTMLElement>(
          ".w-image, .w-headline, .w-group, .w-line, .w-shape, .w-form, .w-paragraph"
        );
        animChildren.forEach((child) => {
          child.style.setProperty("--anim-delay", delaySeconds);
          child.style.setProperty("animation-delay", delaySeconds, "important");
        });

        el.classList.remove("w-animation-hidden");
        el.classList.add("w-animation");

        el.querySelectorAll<HTMLElement>(".w-animation-hidden").forEach((nestedChild) => {
          nestedChild.classList.remove("w-animation-hidden");
          nestedChild.classList.add("w-animation");
          nestedChild.style.setProperty("--anim-delay", delaySeconds);
          nestedChild.style.setProperty("animation-delay", delaySeconds, "important");
        });
      });
    };

    observer = new IntersectionObserver(
      (entries) => {
        const intersecting: HTMLElement[] = [];
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            intersecting.push(entry.target as HTMLElement);
          }
        });

        if (intersecting.length > 0) {
          if (isFastScrolling) {
            processBatch(intersecting);
          } else {
            pendingElements.push(...intersecting);
            if (batchTimeout) clearTimeout(batchTimeout);
            batchTimeout = setTimeout(() => {
              const batch = pendingElements;
              pendingElements = [];
              processBatch(batch);
            }, 15);
          }
        }
      },
      {
        threshold: 0.05,
        rootMargin: "0px 0px -40px 0px", // Triggers 40px inside the bottom of screen so animation is clearly visible!
      }
    );

    // Initial load: reveal visible elements on screen
    const initialInView: HTMLElement[] = [];
    animatedElements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 40 && rect.bottom > 0) {
        initialInView.push(el);
      } else {
        observer?.observe(el);
      }
    });

    if (initialInView.length > 0) {
      processBatch(initialInView);
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (fastScrollTimeout) clearTimeout(fastScrollTimeout);
      observer?.disconnect();
      if (batchTimeout) clearTimeout(batchTimeout);
    };
  }, []);
}
