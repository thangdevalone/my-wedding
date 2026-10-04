"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Wish = { id: number; name: string; message: string; createdAt: string };

const STORAGE_KEY = "wishes-dock-open";

/**
 * Live-comment guestbook dock, pinned to the bottom of the screen (1/4 screen height).
 * - Initial wishes loaded via SSR from SQLite DB (zero initial API calls).
 * - Zero double calls: submitting an RSVP sends 1 POST, and the created wish is immediately
 *   added to state without triggering any redundant GET calls.
 * - The list scrolls smoothly through the entire list from first to last, then loops cleanly.
 * - Controls are sized 50px (identical to the floating music toggle button).
 */
export default function WishesDock({ initialWishes = [] }: { initialWishes?: Wish[] }) {
  const [wishes, setWishes] = useState<Wish[]>(initialWishes);
  const [open, setOpen] = useState(true);
  const [freshId, setFreshId] = useState<number | null>(null);
  const freshTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const inFlightRef = useRef(false);

  // Background polling every 30s to pick up wishes from other guests.
  // Guarded so it never runs concurrently or duplicates requests.
  const load = useCallback(async () => {
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
    // DO NOT call load() on mount: initialWishes was already provided by SSR from SQLite!
    const onRefresh = (e: Event) => {
      const wish = (e as CustomEvent<{ wish?: Wish }>).detail?.wish;
      if (wish) {
        // Add new wish directly from the POST response with an animated highlight
        setWishes((prev) => [wish, ...prev.filter((w) => w.id !== wish.id)]);
        setOpen(true);
        setFreshId(wish.id);
        clearTimeout(freshTimer.current);
        freshTimer.current = setTimeout(() => {
          setFreshId(null);
        }, 4000);
        // Do NOT call load() here: avoids any duplicate API calls!
      }
    };

    window.addEventListener("wishes:refresh", onRefresh);
    const timer = setInterval(load, 30_000);

    return () => {
      window.removeEventListener("wishes:refresh", onRefresh);
      clearInterval(timer);
      clearTimeout(freshTimer.current);
    };
  }, [load]);

  // Remember guest preference (open / collapsed)
  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === "0") setOpen(false);
    } catch {}
  }, []);

  const toggle = () => {
    setOpen((v) => {
      try {
        localStorage.setItem(STORAGE_KEY, v ? "0" : "1");
      } catch {}
      return !v;
    });
  };

  // Oldest first -> newest at the end, so it scrolls from the beginning of the list to the end
  const ordered = [...wishes].reverse();

  // Auto-scroll loop runs when there are 2 or more wishes
  const loop = ordered.length >= 2;
  // Comfortable reading pace: ~4.5s per wish + 3s spacer pause
  const duration = Math.max(16, ordered.length * 4.5 + 4);

  // The pill scrolls down to the message textarea in the RSVP form
  const goToForm = () => {
    const form = document.getElementById("FORM2");
    const field = form?.querySelector<HTMLTextAreaElement>("textarea[name='message']");
    form?.scrollIntoView({ behavior: "smooth", block: "center" });
    window.setTimeout(() => field?.focus({ preventScroll: true }), 450);
  };

  const renderGroup = (prefix: string) => (
    <div className="wishes-group" aria-hidden={prefix === "b" ? true : undefined}>
      {ordered.map((w) => (
        <div
          className="wish-bubble"
          key={`${prefix}-${w.id}`}
          data-fresh={prefix === "a" && w.id === freshId ? true : undefined}
        >
          <b>{w.name}</b>: {w.message}
        </div>
      ))}
    </div>
  );

  return (
    <aside className="wishes-dock" data-open={open} aria-label="Lời chúc từ khách mời">
      {open && (
        <div className="wishes-feed" data-scrolling={loop}>
          {ordered.length === 0 ? (
            <p className="wishes-empty">Hãy là người đầu tiên gửi lời chúc đến cô dâu chú rể ♥</p>
          ) : (
            <div
              className="wishes-track"
              style={loop ? ({ "--wishes-dur": `${duration}s` } as React.CSSProperties) : undefined}
            >
              {renderGroup("a")}
              {loop && (
                <>
                  {/* Spacer equal to feed viewport so all of group A exits before group B starts */}
                  <div className="wishes-spacer" aria-hidden="true" />
                  {renderGroup("b")}
                  <div className="wishes-spacer" aria-hidden="true" />
                </>
              )}
            </div>
          )}
        </div>
      )}

      <div className="wishes-bar">
        <button
          type="button"
          className="wishes-toggle"
          onClick={toggle}
          aria-pressed={open}
          aria-label={open ? "Ẩn lời chúc" : "Hiện lời chúc"}
          title={open ? "Ẩn lời chúc" : "Hiện lời chúc"}
        >
          <svg
            viewBox="0 0 24 24"
            width="22"
            height="22"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z" />
            <path d="M8.5 12h.01M12 12h.01M15.5 12h.01" />
            {open && <path d="M3 3l18 18" />}
          </svg>
          {!open && wishes.length > 0 && <span className="wishes-count">{wishes.length}</span>}
        </button>

        {open && (
          <button type="button" className="wishes-pill" onClick={goToForm}>
            <span>Gửi lời chúc...</span>
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </button>
        )}
      </div>
    </aside>
  );
}
