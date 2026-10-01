"use client";

import { useEffect } from "react";

export function useWeddingInteractions() {
  useEffect(() => {
    // -------------------------------------------------------------------------
    // 1. LIVE COUNTDOWN TIMER (Target: November 28, 2026 16:00:00 UTC+7)
    // -------------------------------------------------------------------------
    const targetDate = new Date("2026-11-28T16:00:00+07:00").getTime();

    const updateCountdown = () => {
      const now = Date.now();
      const diff = Math.max(0, targetDate - now);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const dayEl = document.querySelector("#COUNTDOWN_ITEM1 span");
      const hourEl = document.querySelector("#COUNTDOWN_ITEM2 span");
      const minEl = document.querySelector("#COUNTDOWN_ITEM3 span");
      const secEl = document.querySelector("#COUNTDOWN_ITEM4 span");

      if (dayEl) dayEl.textContent = String(days).padStart(2, "0");
      if (hourEl) hourEl.textContent = String(hours).padStart(2, "0");
      if (minEl) minEl.textContent = String(minutes).padStart(2, "0");
      if (secEl) secEl.textContent = String(seconds).padStart(2, "0");
    };

    updateCountdown();
    const countdownInterval = setInterval(updateCountdown, 1000);

    // -------------------------------------------------------------------------
    // 2. 100% SEAMLESS CONTINUOUS GALLERY CAROUSEL (NỐI TIẾP NHAU, ZERO JERK)
    // -------------------------------------------------------------------------
    const galleryEl = document.getElementById("GALLERY1");
    let cleanupGallery = () => {};

    if (galleryEl) {
      const viewItems = Array.from(galleryEl.getElementsByClassName("w-gallery-view-item")) as HTMLElement[];
      const controlItems = Array.from(galleryEl.getElementsByClassName("w-gallery-control-item")) as HTMLElement[];
      const controlBox = galleryEl.getElementsByClassName("w-gallery-control-box")[0] as HTMLElement | null;
      const controlViewport = galleryEl.getElementsByClassName("w-gallery-control")[0] as HTMLElement | null;
      const viewContainer = galleryEl.getElementsByClassName("w-gallery-view")[0] as HTMLElement | null;
      const viewArrowLeft = galleryEl.getElementsByClassName("w-gallery-view-arrow-left")[0] as HTMLElement | null;
      const viewArrowRight = galleryEl.getElementsByClassName("w-gallery-view-arrow-right")[0] as HTMLElement | null;
      const controlArrowLeft = galleryEl.getElementsByClassName("w-gallery-control-arrow-left")[0] as HTMLElement | null;
      const controlArrowRight = galleryEl.getElementsByClassName("w-gallery-control-arrow-right")[0] as HTMLElement | null;

      const totalSlides = viewItems.length;
      let currentIndex = 0;
      let isTransitioning = false;
      let transitionTimer: ReturnType<typeof setTimeout> | null = null;

      // Initialize state: slide 0 is selected, thumbnails highlighted
      viewItems.forEach((item, idx) => {
        item.classList.remove("next", "prev", "left", "right");
        if (idx === 0) {
          item.classList.add("selected");
        } else {
          item.classList.remove("selected");
        }
      });

      controlItems.forEach((thumb, idx) => {
        thumb.classList.toggle("selected", idx === 0);
      });

      // Center active thumbnail in control strip
      const updateThumbnailPosition = (idx: number) => {
        controlItems.forEach((thumb, i) => {
          thumb.classList.toggle("selected", i === idx);
        });

        if (controlBox && controlViewport) {
          const itemWidth = 80;
          const gap = 10;
          const viewportWidth = 420;
          const targetOffset = idx * (itemWidth + gap) + itemWidth / 2;
          let h = viewportWidth / 2 - targetOffset;

          const totalWidth = totalSlides * itemWidth + (totalSlides - 1) * gap;
          const minLeft = -(totalWidth - viewportWidth);

          if (h > 0) h = 0;
          if (h < minLeft) h = minLeft;

          controlBox.style.setProperty("left", `${h}px`);
        }
      };

      updateThumbnailPosition(0);

      // Slide transition function: 100% faithful to Ladipage continuous sliding
      const goToSlide = (targetIndex: number, direction?: "next" | "prev") => {
        if (isTransitioning || totalSlides <= 1) return;
        const target = (targetIndex + totalSlides) % totalSlides;
        if (target === currentIndex) return;

        isTransitioning = true;

        const currentSlide = viewItems[currentIndex];
        const incomingSlide = viewItems[target];

        const isNext = direction ? direction === "next" : target > currentIndex;
        const animClass = isNext ? "next" : "prev";
        const dirClass = isNext ? "left" : "right";

        // Step 1: Clean any existing transition classes on other slides
        viewItems.forEach((item, i) => {
          if (i !== currentIndex) {
            item.classList.remove("next", "prev", "left", "right", "selected");
          }
        });

        // Step 2: Position incoming slide at starting point (+100% or -100%)
        incomingSlide.classList.add(animClass);

        // Step 3: Current slide immediately begins sliding
        currentSlide.classList.add(dirClass);

        // Step 4: After a brief 10ms tick, trigger incoming slide to slide in attached
        transitionTimer = setTimeout(() => {
          incomingSlide.classList.add(dirClass);

          // Update active thumbnail and strip scroll smoothly
          updateThumbnailPosition(target);

          // Step 5: After transition ends (300ms), finalize state
          transitionTimer = setTimeout(() => {
            for (let i = 0; i < totalSlides; i++) {
              if (i === target) {
                viewItems[i].classList.add("selected");
              } else {
                viewItems[i].classList.remove("selected");
              }
              viewItems[i].classList.remove(animClass, dirClass);
            }

            currentIndex = target;
            isTransitioning = false;
            transitionTimer = null;
          }, 300);
        }, 10);
      };

      const handleNext = () => goToSlide(currentIndex + 1, "next");
      const handlePrev = () => goToSlide(currentIndex - 1, "prev");

      // Main View Arrow clicks
      const onMainArrowLeft = (e: MouseEvent) => {
        e.stopPropagation();
        handlePrev();
      };

      const onMainArrowRight = (e: MouseEvent) => {
        e.stopPropagation();
        handleNext();
      };

      viewArrowLeft?.addEventListener("click", onMainArrowLeft);
      viewArrowRight?.addEventListener("click", onMainArrowRight);

      // Control Thumbnail Arrow clicks (scrolling the strip)
      const onControlArrowLeft = (e: MouseEvent) => {
        e.stopPropagation();
        if (!controlBox) return;
        const curLeft = parseFloat(controlBox.style.getPropertyValue("left")) || 0;
        let newLeft = curLeft + 90;
        if (newLeft > 0) newLeft = 0;
        controlBox.style.setProperty("left", `${newLeft}px`);
      };

      const onControlArrowRight = (e: MouseEvent) => {
        e.stopPropagation();
        if (!controlBox) return;
        const curLeft = parseFloat(controlBox.style.getPropertyValue("left")) || 0;
        let newLeft = curLeft - 90;
        const totalWidth = totalSlides * 80 + (totalSlides - 1) * 10;
        const minLeft = -(totalWidth - 420);
        if (newLeft < minLeft) newLeft = minLeft;
        controlBox.style.setProperty("left", `${newLeft}px`);
      };

      controlArrowLeft?.addEventListener("click", onControlArrowLeft);
      controlArrowRight?.addEventListener("click", onControlArrowRight);

      // Thumbnail direct clicks
      const thumbListeners = controlItems.map((thumb, idx) => {
        const handler = (e: MouseEvent) => {
          e.stopPropagation();
          goToSlide(idx, idx > currentIndex ? "next" : "prev");
        };
        thumb.addEventListener("click", handler);
        return { thumb, handler };
      });

      // Touch & Mouse Swipe on Gallery View
      let startX = 0;
      let startY = 0;
      let isDragging = false;

      const onSwipeStart = (pageX: number, pageY: number) => {
        startX = pageX;
        startY = pageY;
        isDragging = true;
      };

      const onSwipeEnd = (pageX: number, pageY: number) => {
        if (!isDragging) return;
        isDragging = false;
        const diffX = pageX - startX;
        const diffY = pageY - startY;

        if (Math.abs(diffX) >= 40 && Math.abs(diffX) > Math.abs(diffY)) {
          if (diffX > 0) {
            handlePrev();
          } else {
            handleNext();
          }
        }
      };

      const onTouchStart = (e: TouchEvent) => {
        if (e.touches.length > 0) {
          onSwipeStart(e.touches[0].pageX, e.touches[0].pageY);
        }
      };

      const onTouchEnd = (e: TouchEvent) => {
        if (e.changedTouches.length > 0) {
          onSwipeEnd(e.changedTouches[0].pageX, e.changedTouches[0].pageY);
        }
      };

      const onMouseDown = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.classList.contains("w-gallery-view-arrow")) return;
        onSwipeStart(e.pageX, e.pageY);
      };

      const onMouseUp = (e: MouseEvent) => {
        if (isDragging) {
          onSwipeEnd(e.pageX, e.pageY);
        }
      };

      viewContainer?.addEventListener("touchstart", onTouchStart, { passive: true });
      viewContainer?.addEventListener("touchend", onTouchEnd);
      viewContainer?.addEventListener("mousedown", onMouseDown);
      window.addEventListener("mouseup", onMouseUp);

      cleanupGallery = () => {
        if (transitionTimer) clearTimeout(transitionTimer);

        thumbListeners.forEach(({ thumb, handler }) => {
          thumb.removeEventListener("click", handler);
        });

        viewArrowLeft?.removeEventListener("click", onMainArrowLeft);
        viewArrowRight?.removeEventListener("click", onMainArrowRight);
        controlArrowLeft?.removeEventListener("click", onControlArrowLeft);
        controlArrowRight?.removeEventListener("click", onControlArrowRight);

        viewContainer?.removeEventListener("touchstart", onTouchStart);
        viewContainer?.removeEventListener("touchend", onTouchEnd);
        viewContainer?.removeEventListener("mousedown", onMouseDown);
        window.removeEventListener("mouseup", onMouseUp);
      };
    }

    // -------------------------------------------------------------------------
    // 3. RSVP FORM & POPUP CONFIRMATION
    // -------------------------------------------------------------------------
    const form = document.querySelector("#FORM2 form") as HTMLFormElement | null;
    const popupEl = document.getElementById("POPUP1") as HTMLElement | null;
    const backdrop = document.getElementById("backdrop-popup") as HTMLElement | null;

    const openPopup = () => {
      if (popupEl) {
        popupEl.style.display = "block";
        popupEl.style.position = "fixed";
        popupEl.style.top = "0";
        popupEl.style.left = "0";
        popupEl.style.right = "0";
        popupEl.style.bottom = "0";
        popupEl.style.margin = "auto";
        popupEl.style.zIndex = "90000070";
      }
      if (backdrop) {
        backdrop.style.display = "block";
        backdrop.style.position = "fixed";
        backdrop.style.inset = "0";
        backdrop.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
        backdrop.style.zIndex = "90000060";
      }
    };

    const closePopup = () => {
      if (popupEl) popupEl.style.display = "none";
      if (backdrop) backdrop.style.display = "none";
    };

    const handleSubmit = (e: Event) => {
      e.preventDefault();
      openPopup();
    };

    form?.addEventListener("submit", handleSubmit);
    backdrop?.addEventListener("click", closePopup);

    const closeBtn = popupEl?.querySelector(".w-popup-close");
    closeBtn?.addEventListener("click", closePopup);

    // -------------------------------------------------------------------------
    // CLEANUP
    // -------------------------------------------------------------------------
    return () => {
      clearInterval(countdownInterval);
      cleanupGallery();
      form?.removeEventListener("submit", handleSubmit);
      backdrop?.removeEventListener("click", closePopup);
      closeBtn?.removeEventListener("click", closePopup);
    };
  }, []);
}
