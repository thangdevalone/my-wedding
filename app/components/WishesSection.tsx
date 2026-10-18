"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import type { WishItem } from "../lib/db";

function formatTime(isoString?: string): string {
  if (!isoString) return "";
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes} - ${day}/${month}/${year}`;
  } catch {
    return "";
  }
}

export default function WishesSection({
  initialWishes = [],
}: {
  initialWishes?: WishItem[];
}) {
  const [wishes, setWishes] = useState<WishItem[]>(initialWishes);
  const [showAll, setShowAll] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inFlightRef = useRef(false);

  // Background polling every 30s
  const loadWishes = useCallback(async () => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    try {
      const res = await fetch("/api/rsvp", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data.wishes)) {
        setWishes(data.wishes);
      }
    } catch {
      // keep existing state
    } finally {
      inFlightRef.current = false;
    }
  }, []);

  useEffect(() => {
    const onRefresh = (e: Event) => {
      const wish = (e as CustomEvent<{ wish?: WishItem }>).detail?.wish;
      if (wish) {
        setWishes((prev) => [wish, ...prev.filter((w) => w.id !== wish.id)]);
      }
    };

    window.addEventListener("wishes:refresh", onRefresh);
    const interval = setInterval(loadWishes, 30_000);

    return () => {
      window.removeEventListener("wishes:refresh", onRefresh);
      clearInterval(interval);
    };
  }, [loadWishes]);

  // Scroll reveal animation
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add("in-view");
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px -40px 0px" }
    );

    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 40 && rect.bottom > 0) {
      el.classList.add("in-view");
    } else {
      observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  const displayedWishes = showAll ? wishes : wishes.slice(0, 4);

  return (
    <div id="SECTION_WISHES" className="w-section guestbook-section">
      <div className="w-section-background"></div>
      <div className="w-container">
        <div ref={wrapperRef} className="guestbook-wrapper">
          <div className="guestbook-header">
            <h3 className="guestbook-title">LỜI CHÚC TỪ KHÁCH MỜI</h3>
            <div className="guestbook-line"></div>
          </div>

          {wishes.length === 0 ? (
            <p className="guestbook-empty">
              Chưa có lời chúc nào. Hãy là người đầu tiên gửi lời chúc đến cô dâu &amp; chú rể nhé!
            </p>
          ) : (
            <>
              <div ref={containerRef} className="guestbook-list">
                {displayedWishes.map((wish) => (
                  <div key={wish.id} className="guestbook-item">
                    <div className="guestbook-item-header">
                      <span className="guestbook-author">{wish.name}</span>
                      {wish.createdAt && (
                        <span className="guestbook-time">
                          {formatTime(wish.createdAt)}
                        </span>
                      )}
                    </div>
                    <p className="guestbook-message">{wish.message}</p>
                  </div>
                ))}
              </div>

              {wishes.length > 4 && (
                <button
                  type="button"
                  className="guestbook-more-btn"
                  onClick={() => setShowAll(!showAll)}
                >
                  {showAll
                    ? "Thu gọn lời chúc"
                    : `Xem thêm ${wishes.length - 4} lời chúc`}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
