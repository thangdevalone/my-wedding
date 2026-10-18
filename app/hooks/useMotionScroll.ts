"use client";

import { useEffect } from "react";

/**
 * Sequential Staggered Scroll Animation Engine
 *
 * Rules:
 * 1. "animation lần lượt chứ ko cùng 1 lúc": Elements don't all trigger at the exact same instant.
 * 2. "phần tử ở trên thì animation trước": Elements higher up on screen (smaller rect.top) animate first.
 * 3. "phần tử cùng hàng thì cùng animation sau 1 chút": Elements on the same row (similar top) animate left-to-right staggered by +120ms.
 * 4. Lower rows cascade down (+150ms per vertical step).
 * 5. Base delay starts at 1.0s (1000ms) for the first element in the intersecting cluster, satisfying the user's "delay 1s" request.
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

    const processBatch = (elementsToAnimate: HTMLElement[]) => {
      if (!elementsToAnimate.length) return;

      // Filter out elements already animating/animated
      const valid = elementsToAnimate.filter(
        (el) => !el.classList.contains("w-animation")
      );
      if (!valid.length) return;

      // Sort elements:
      // 1. Elements higher up on screen (smaller rect.top) come first.
      // 2. Elements on the same row (|rect.top - rect.top| <= 18px) are sorted left-to-right.
      valid.sort((a, b) => {
        const rA = a.getBoundingClientRect();
        const rB = b.getBoundingClientRect();
        if (Math.abs(rA.top - rB.top) > 18) {
          return rA.top - rB.top;
        }
        return rA.left - rB.left;
      });

      const BASE_DELAY_MS = 1000; // 1.0s base delay
      const ROW_STEP_MS = 150;    // +150ms for next lower row
      const COL_STEP_MS = 120;    // +120ms for elements on the same row

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

        // Apply staggered animation delay
        el.style.setProperty("--anim-delay", delaySeconds);
        el.style.setProperty("animation-delay", delaySeconds, "important");

        const animChildren = el.querySelectorAll<HTMLElement>(
          ".w-image, .w-headline, .w-group, .w-line, .w-shape, .w-form, .w-paragraph"
        );
        animChildren.forEach((child) => {
          child.style.setProperty("--anim-delay", delaySeconds);
          child.style.setProperty("animation-delay", delaySeconds, "important");
        });

        // Trigger animation
        el.classList.remove("w-animation-hidden");
        el.classList.add("w-animation");

        // Handle nested hidden elements (e.g. #SHAPE1 heart pulse inside calendar)
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
          pendingElements.push(...intersecting);
          if (batchTimeout) clearTimeout(batchTimeout);
          batchTimeout = setTimeout(() => {
            const batch = pendingElements;
            pendingElements = [];
            processBatch(batch);
          }, 30);
        }
      },
      {
        threshold: 0.05,
        rootMargin: "80px 0px 80px 0px",
      }
    );

    // Initial check for elements in viewport on page load
    const initialInView: HTMLElement[] = [];
    animatedElements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight + 80 && rect.bottom > -40) {
        initialInView.push(el);
      } else {
        observer?.observe(el);
      }
    });

    if (initialInView.length > 0) {
      processBatch(initialInView);
    }

    return () => {
      observer?.disconnect();
      if (batchTimeout) clearTimeout(batchTimeout);
    };
  }, []);
}
