"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Account = {
  role: string;
  bank: string;
  number: string;
  holder: string;
  qr: string;
};

// QR là VietQR tĩnh (NAPAS 247) — quét bằng app ngân hàng bất kỳ, tự điền STK + nội dung "Mung cuoi Thang Lan"
const ACCOUNTS: Account[] = [
  {
    role: "Chú rể",
    bank: "Vietcombank",
    number: "9965204955",
    holder: "NGUYEN QUANG THANG",
    qr: "/images/qr/qr-chure.svg",
  },
  {
    role: "Cô dâu",
    bank: "Vietcombank",
    number: "1384835866",
    holder: "NGUYEN TUONG LAN",
    qr: "/images/qr/qr-codau.svg",
  },
];

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback cho trình duyệt in-app (Zalo, Messenger) không cho dùng Clipboard API
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
}

export default function GiftSection() {
  const [copied, setCopied] = useState<string | null>(null);
  const [zoom, setZoom] = useState<Account | null>(null);
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
      { threshold: 0.02, rootMargin: "0px 0px -30px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!zoom) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setZoom(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoom]);

  const onCopy = async (number: string) => {
    if (await copyText(number)) {
      setCopied(number);
      setTimeout(() => setCopied((c) => (c === number ? null : c)), 1600);
    }
  };

  return (
    <div id="SECTION_GIFT" className="w-section gift-section">
      <div className="w-section-background"></div>
      <div className="w-container">
        <div ref={wrapperRef} className="gift-wrapper">
          <div className="gift-header">
            <span className="flourish-line"></span>
            <h3 className="gift-title">Hộp mừng cưới</h3>
            <span className="flourish-line"></span>
          </div>

          <div className="gift-grid">
            {ACCOUNTS.map((a) => (
              <div key={a.number} className="gift-card">
                <span className="gift-role">{a.role}</span>
                <button
                  type="button"
                  className="gift-qr"
                  onClick={() => setZoom(a)}
                  aria-label={`Phóng to mã QR của ${a.role}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={a.qr} alt={`QR chuyển khoản ${a.role}`} width={104} height={104} />
                </button>
                <span className="gift-bank">{a.bank}</span>
                <button
                  type="button"
                  className="gift-number"
                  onClick={() => onCopy(a.number)}
                  aria-label={`Sao chép số tài khoản ${a.number}`}
                >
                  <span>{a.number}</span>
                  {copied === a.number ? (
                    <svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true">
                      <path fill="currentColor" d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true">
                      <path
                        fill="currentColor"
                        d="M16 1H4a2 2 0 0 0-2 2v14h2V3h12V1zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H8V7h11v14z"
                      />
                    </svg>
                  )}
                </button>
                <span className="gift-holder">{a.holder}</span>
              </div>
            ))}
          </div>

          <p className="gift-hint">
            {copied ? "Đã sao chép số tài khoản ✓" : "Chạm vào mã QR để phóng to · chạm số TK để sao chép"}
          </p>
        </div>
      </div>

      {zoom &&
        createPortal(
        <div className="gift-zoom" role="dialog" aria-modal="true" onClick={() => setZoom(null)}>
          <div className="gift-zoom-card" onClick={(e) => e.stopPropagation()}>
            <span className="gift-role">{zoom.role}</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={zoom.qr} alt={`QR chuyển khoản ${zoom.role}`} width={240} height={240} />
            <span className="gift-bank">
              {zoom.bank} · {zoom.number}
            </span>
            <span className="gift-holder">{zoom.holder}</span>
            <button type="button" className="gift-zoom-close" onClick={() => setZoom(null)}>
              Đóng
            </button>
          </div>
        </div>,
          document.body
        )}
    </div>
  );
}
