"use client";

import { useEffect } from "react";

export function useWeddingInteractions() {
  useEffect(() => {
    const syncZoom = (window as unknown as { __syncWeddingZoom?: () => void }).__syncWeddingZoom;
    if (syncZoom) {
      syncZoom();
      requestAnimationFrame(syncZoom);
    }

    // -------------------------------------------------------------------------
    // 1. LIVE COUNTDOWN TIMER (Target: November 28, 2026 10:00:00 UTC+7)
    // -------------------------------------------------------------------------
    const targetDate = new Date("2026-11-28T10:00:00+07:00").getTime();

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
      const name = String(data.get("name") ?? "").trim();
      const message = String(data.get("message") ?? "").trim();

      if (!name || !message) {
        setLabel("VUI LÒNG ĐIỀN ĐỦ", 2500);
        submitting = false;
        if (submitBtn) submitBtn.style.pointerEvents = "auto";
        return;
      }

      const payload = {
        name,
        message,
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

        // keep the invited guest's name, clear message
        const keepName = (form.elements.namedItem("name") as HTMLInputElement | null)?.defaultValue ?? name;
        form.reset();
        const nameInput = form.elements.namedItem("name") as HTMLInputElement | null;
        if (nameInput) nameInput.value = keepName;

        setLabel(defaultLabel);
        openPopup();
        // show the new wish in the wishes list section right away
        const sent = await res.json().catch(() => null);
        window.dispatchEvent(
          new CustomEvent("wishes:refresh", {
            detail:
              sent?.wish
                ? { wish: sent.wish }
                : { wish: { id: Date.now(), name, message, createdAt: new Date().toISOString() } },
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
      form?.removeEventListener("submit", handleSubmit);
      submitBtn?.removeEventListener("click", onButtonClick);
      clearTimeout(labelTimer);
      backdrop?.removeEventListener("click", closePopup);
      closeBtn?.removeEventListener("click", closePopup);
    };
  }, []);
}
