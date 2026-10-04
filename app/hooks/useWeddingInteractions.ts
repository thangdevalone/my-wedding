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
      // -----------------------------------------------------------------------
      // Click a slide -> open full-screen lightbox (uses the .lightbox-* styles)
      // -----------------------------------------------------------------------
      const lightboxScreen = document.getElementById("lightbox-screen");
      const imageUrls = viewItems.map((item) => {
        const match = getComputedStyle(item).backgroundImage.match(/url\(["']?(.*?)["']?\)/);
        return match ? match[1] : "";
      });
      let lightboxIndex = 0;
      let lightboxImg: HTMLImageElement | null = null;
      let lightboxSwipeX = 0;

      let lightboxCounter: HTMLDivElement | null = null;

      const showLightboxImage = (idx: number) => {
        lightboxIndex = (idx + totalSlides) % totalSlides;
        if (lightboxImg) lightboxImg.src = imageUrls[lightboxIndex];
        if (lightboxCounter) lightboxCounter.textContent = `${lightboxIndex + 1} / ${totalSlides}`;
      };

      const onLightboxKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") closeLightbox();
        else if (e.key === "ArrowRight") showLightboxImage(lightboxIndex + 1);
        else if (e.key === "ArrowLeft") showLightboxImage(lightboxIndex - 1);
      };

      function closeLightbox() {
        if (!lightboxScreen) return;
        lightboxScreen.style.display = "none";
        lightboxScreen.innerHTML = "";
        lightboxImg = null;
        document.body.style.removeProperty("overflow");
        document.removeEventListener("keydown", onLightboxKey);
      }

      const openLightbox = (idx: number) => {
        if (!lightboxScreen) return;
        lightboxScreen.innerHTML = "";

        const closeBtn = document.createElement("div");
        closeBtn.className = "lightbox-close";
        closeBtn.style.cssText = "top:0;right:0;";
        closeBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          closeLightbox();
        });

        const track = document.createElement("div");
        track.className = "lightbox-gallery-track";
        track.style.cssText = "position:absolute;inset:0;";
        lightboxImg = document.createElement("img");
        lightboxImg.className = "lightbox-item";
        lightboxImg.alt = "";
        lightboxImg.draggable = false;
        lightboxImg.style.cssText =
          "max-width:100%;max-height:100%;width:auto;height:auto;object-fit:contain;transform:translate(-50%,-50%);";
        track.appendChild(lightboxImg);

        const CHEVRON_PATHS: Record<string, string> = {
          "lightbox-prev": "M15 5l-7 7 7 7",
          "lightbox-next": "M9 5l7 7-7 7",
        };
        const makeNav = (cls: string, step: number) => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = `lightbox-nav-btn ${cls}`;
          btn.setAttribute("aria-label", step < 0 ? "Ảnh trước" : "Ảnh sau");
          btn.innerHTML = `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${CHEVRON_PATHS[cls]}"/></svg>`;
          btn.addEventListener("click", (e) => {
            e.stopPropagation();
            showLightboxImage(lightboxIndex + step);
          });
          return btn;
        };

        lightboxCounter = document.createElement("div");
        lightboxCounter.className = "lightbox-counter";

        track.addEventListener("touchstart", (e) => {
          lightboxSwipeX = e.touches[0].pageX;
        }, { passive: true });
        track.addEventListener("touchend", (e) => {
          const diff = e.changedTouches[0].pageX - lightboxSwipeX;
          if (Math.abs(diff) >= 40) showLightboxImage(lightboxIndex + (diff > 0 ? -1 : 1));
        });
        // Click on the empty area around the photo closes the lightbox
        track.addEventListener("click", (e) => {
          if (e.target === track) closeLightbox();
        });

        lightboxScreen.append(track, closeBtn, makeNav("lightbox-prev", -1), makeNav("lightbox-next", 1), lightboxCounter);
        showLightboxImage(idx);
        lightboxScreen.style.display = "block";
        document.body.style.overflow = "hidden";
        document.addEventListener("keydown", onLightboxKey);
      };

      const onViewClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.classList.contains("w-gallery-view-arrow")) return;
        // Ignore the click that ends a swipe/drag
        if (Math.abs(e.pageX - startX) > 10 || Math.abs(e.pageY - startY) > 10) return;
        openLightbox(currentIndex);
      };
      viewContainer?.addEventListener("click", onViewClick);


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
        closeLightbox();
        viewContainer?.removeEventListener("click", onViewClick);

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

    const submitBtn = document.getElementById("BUTTON2") as HTMLElement | null;
    const submitLabel = submitBtn?.querySelector<HTMLElement>(".w-headline") ?? null;
    const defaultLabel = submitLabel?.textContent ?? "XÁC NHẬN";
    let submitting = false;
    let labelTimer: ReturnType<typeof setTimeout> | undefined;

    const setLabel = (text: string, resetAfterMs = 0) => {
      if (!submitLabel) return;
      submitLabel.textContent = text;
      clearTimeout(labelTimer);
      if (resetAfterMs) labelTimer = setTimeout(() => (submitLabel.textContent = defaultLabel), resetAfterMs);
    };

    const handleSubmit = async (e: Event) => {
      e.preventDefault();
      if (!form || submitting) return;
      submitting = true;
      if (submitBtn) submitBtn.style.pointerEvents = "none";
      setLabel("ĐANG GỬI...");

      const data = new FormData(form);
      const payload = {
        name: data.get("name"),
        attendance: data.get("form_item8"),
        companions: data.get("form_item9"),
        side: data.get("form_item10"),
        message: data.get("message"),
        invite: data.get("invite"),
        website: data.get("website"), // honeypot
      };

      try {
        const res = await fetch("/api/rsvp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.status === 422) {
          setLabel("TỪ NGỮ KHÔNG PHÙ HỢP", 3500);
          return;
        }
        if (!res.ok) throw new Error(String(res.status));

        // keep the invited guest's name, clear everything else
        const keepName = (form.elements.namedItem("name") as HTMLInputElement | null)?.defaultValue ?? "";
        form.reset();
        const nameInput = form.elements.namedItem("name") as HTMLInputElement | null;
        if (nameInput) nameInput.value = keepName;

        setLabel(defaultLabel);
        openPopup();
        // show the new wish in the bottom feed right away (with animation)
        const sent = await res.json().catch(() => null);
        const wishText = typeof payload.message === "string" ? payload.message.trim() : "";
        window.dispatchEvent(
          new CustomEvent("wishes:refresh", {
            detail:
              wishText && sent?.id
                ? { wish: { id: sent.id, name: String(payload.name ?? "").trim(), message: wishText, createdAt: new Date().toISOString() } }
                : undefined,
          })
        );
      } catch {
        setLabel("GỬI LỖI - THỬ LẠI", 3500);
      } finally {
        submitting = false;
        if (submitBtn) submitBtn.style.pointerEvents = "auto";
      }
    };

    // The red XÁC NHẬN "button" is a styled div: make it submit the form
    const onButtonClick = () => form?.requestSubmit();
    submitBtn?.addEventListener("click", onButtonClick);

    form?.addEventListener("submit", handleSubmit);
    backdrop?.addEventListener("click", closePopup);

    const closeBtn = popupEl?.querySelector(".w-popup-close, .popup-back");
    closeBtn?.addEventListener("click", closePopup);

    // -------------------------------------------------------------------------
    // CLEANUP
    // -------------------------------------------------------------------------
    return () => {
      clearInterval(countdownInterval);
      cleanupGallery();
      form?.removeEventListener("submit", handleSubmit);
      submitBtn?.removeEventListener("click", onButtonClick);
      clearTimeout(labelTimer);
      backdrop?.removeEventListener("click", closePopup);
      closeBtn?.removeEventListener("click", closePopup);
    };
  }, []);
}
