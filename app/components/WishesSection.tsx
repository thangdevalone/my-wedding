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
      { threshold: 0.01, rootMargin: "450px 0px 450px 0px" }
    );

    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 250 && rect.bottom > -80) {
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
          {/* Họa tiết trang trí & lời cảm ơn kết nối từ nút gửi */}
          <div className="guestbook-transition-block">
            <div className="guestbook-flourish">
              <span className="flourish-line"></span>
              <svg
                className="flourish-icon"
                viewBox="0 0 32 20"
                width="26"
                height="16"
                fill="rgb(127, 6, 6)"
                style={{ display: "inline-block", verticalAlign: "middle" }}
                aria-hidden="true"
              >
                <path
                  d="M9 16.5l-1.05-.95C4.2 12.15 1.75 9.9 1.75 7.15 1.75 4.9 3.5 3.15 5.75 3.15c1.28 0 2.5.6 3.25 1.53.75-.93 1.97-1.53 3.25-1.53 2.25 0 4 1.75 4 4 0 2.75-2.45 5-6.2 8.4L9 16.5z"
                  opacity="0.95"
                />
                <path
                  d="M20.5 17.5l-1.05-.95C15.7 13.15 13.25 10.9 13.25 8.15c0-2.25 1.75-4 4-4 1.28 0 2.5.6 3.25 1.53.75-.93 1.97-1.53 3.25-1.53 2.25 0 4 1.75 4 4 0 2.75-2.45 5-6.2 8.4L20.5 17.5z"
                  opacity="0.65"
                />
              </svg>
              <span className="flourish-line"></span>
            </div>
            <p className="guestbook-intro-quote">
              Mỗi lời chúc phúc là một món quà ý nghĩa tiếp thêm hạnh phúc cho tình yêu của chúng mình!
            </p>
          </div>

          {wishes.length === 0 ? (
            <div className="guestbook-empty-wrap">
              <span className="guestbook-empty-heart">💌</span>
              <p className="guestbook-empty">
                Chưa có lời chúc nào. Hãy là người đầu tiên gửi lời chúc yêu thương đến cô dâu &amp; chú rể nhé!
              </p>
            </div>
          ) : (
            <>
              <div ref={containerRef} className="guestbook-list">
                {displayedWishes.map((wish) => (
                  <div key={wish.id} className="guestbook-item">
                    <div className="guestbook-item-header">
                      <div className="guestbook-author-wrap">
                        <span className="guestbook-heart-badge">
                          <svg
                            viewBox="0 0 24 24"
                            width="12"
                            height="12"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                          </svg>
                        </span>
                        <span className="guestbook-author">{wish.name}</span>
                      </div>
                      {wish.createdAt && (
                        <span className="guestbook-time">
                          {formatTime(wish.createdAt)}
                        </span>
                      )}
                    </div>
                    <p className="guestbook-message">
                      <span className="guestbook-quote">“</span>
                      {wish.message}
                      <span className="guestbook-quote">”</span>
                    </p>
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
