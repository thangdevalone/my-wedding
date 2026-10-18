"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";

export interface GalleryPhoto {
  id: string;
  conceptId: string;
  conceptName: string;
  thumb: string;
  full: string;
  alt: string;
}

export const GALLERY_PHOTOS: GalleryPhoto[] = [
  // 1. Cổ Điển Hoàng Gia (Phòng chụp Châu Âu cổ điển)
  {
    id: "4775",
    conceptId: "classic",
    conceptName: "Cổ Điển Hoàng Gia",
    thumb: "/images/gallery/dsc-4775-thumb.jpg",
    full: "/images/gallery/dsc-4775.jpg",
    alt: "Cô dâu Tường Lan - Váy cưới công chúa cổ điển",
  },
  {
    id: "4797",
    conceptId: "classic",
    conceptName: "Cổ Điển Hoàng Gia",
    thumb: "/images/gallery/dsc-4797-thumb.jpg",
    full: "/images/gallery/dsc-4797.jpg",
    alt: "Quang Thắng & Tường Lan - Ánh nhìn tình tứ",
  },
  {
    id: "4898",
    conceptId: "classic",
    conceptName: "Cổ Điển Hoàng Gia",
    thumb: "/images/gallery/dsc-4898-thumb.jpg",
    full: "/images/gallery/dsc-4898.jpg",
    alt: "Quang Thắng & Tường Lan - Nụ cười hạnh phúc",
  },
  {
    id: "4927",
    conceptId: "classic",
    conceptName: "Cổ Điển Hoàng Gia",
    thumb: "/images/gallery/dsc-4927-thumb.jpg",
    full: "/images/gallery/dsc-4927.jpg",
    alt: "Quang Thắng & Tường Lan - Dịu dàng sánh bước",
  },
  {
    id: "4937",
    conceptId: "classic",
    conceptName: "Cổ Điển Hoàng Gia",
    thumb: "/images/gallery/dsc-4937-thumb.jpg",
    full: "/images/gallery/dsc-4937.jpg",
    alt: "Cô dâu Tường Lan - Rạng rỡ cùng hoa rum trắng",
  },
  {
    id: "5017",
    conceptId: "classic",
    conceptName: "Cổ Điển Hoàng Gia",
    thumb: "/images/gallery/dsc-5017-thumb.jpg",
    full: "/images/gallery/dsc-5017.jpg",
    alt: "Chú rể Quang Thắng - Lịch lãm và phong độ",
  },

  // 2. Tinh Khôi & Rạng Rỡ (Studio Trắng Vui Tươi)
  {
    id: "5047",
    conceptId: "white",
    conceptName: "Tinh Khôi & Rạng Rỡ",
    thumb: "/images/gallery/dsc-5047-thumb.jpg",
    full: "/images/gallery/dsc-5047.jpg",
    alt: "Quang Thắng & Tường Lan - Phong cách trẻ trung",
  },
  {
    id: "5063",
    conceptId: "white",
    conceptName: "Tinh Khôi & Rạng Rỡ",
    thumb: "/images/gallery/dsc-5063-thumb.jpg",
    full: "/images/gallery/dsc-5063.jpg",
    alt: "Quang Thắng & Tường Lan - Vẫy tay chào yêu thương",
  },
  {
    id: "5084",
    conceptId: "white",
    conceptName: "Tinh Khôi & Rạng Rỡ",
    thumb: "/images/gallery/dsc-5084-thumb.jpg",
    full: "/images/gallery/dsc-5084.jpg",
    alt: "Quang Thắng & Tường Lan - Năng động và đáng yêu",
  },
  {
    id: "5122",
    conceptId: "white",
    conceptName: "Tinh Khôi & Rạng Rỡ",
    thumb: "/images/gallery/dsc-5122-thumb.jpg",
    full: "/images/gallery/dsc-5122.jpg",
    alt: "Quang Thắng & Tường Lan - Khoảnh khắc trọn vẹn",
  },
  {
    id: "5126",
    conceptId: "white",
    conceptName: "Tinh Khôi & Rạng Rỡ",
    thumb: "/images/gallery/dsc-5126-thumb.jpg",
    full: "/images/gallery/dsc-5126.jpg",
    alt: "Quang Thắng & Tường Lan - Ánh mắt trao nhau",
  },
  {
    id: "5329",
    conceptId: "white",
    conceptName: "Tinh Khôi & Rạng Rỡ",
    thumb: "/images/gallery/dsc-5329-thumb.jpg",
    full: "/images/gallery/dsc-5329.jpg",
    alt: "Quang Thắng & Tường Lan - Lời hứa trọn đời",
  },

  // 3. Sâu Lắng & Thời Thượng (Studio Xám Sang Trọng)
  {
    id: "5210",
    conceptId: "grey",
    conceptName: "Sâu Lắng & Thời Thượng",
    thumb: "/images/gallery/dsc-5210-thumb.jpg",
    full: "/images/gallery/dsc-5210.jpg",
    alt: "Cô dâu Tường Lan - Nét đẹp thanh tú kiêu sa",
  },
  {
    id: "5363",
    conceptId: "grey",
    conceptName: "Sâu Lắng & Thời Thượng",
    thumb: "/images/gallery/dsc-5363-thumb.jpg",
    full: "/images/gallery/dsc-5363.jpg",
    alt: "Quang Thắng & Tường Lan - Nhẫn cưới hẹn ước",
  },
  {
    id: "5411",
    conceptId: "grey",
    conceptName: "Sâu Lắng & Thời Thượng",
    thumb: "/images/gallery/dsc-5411-thumb.jpg",
    full: "/images/gallery/dsc-5411.jpg",
    alt: "Quang Thắng & Tường Lan - Sánh bước bên nhau",
  },
  {
    id: "5436",
    conceptId: "grey",
    conceptName: "Sâu Lắng & Thời Thượng",
    thumb: "/images/gallery/dsc-5436-thumb.jpg",
    full: "/images/gallery/dsc-5436.jpg",
    alt: "Quang Thắng & Tường Lan - Khung hình kỷ niệm",
  },

  // 4. Lãng Mạn Nghệ Thuật (Tone Hoa Hồng)
  {
    id: "5513",
    conceptId: "rose",
    conceptName: "Lãng Mạn Nghệ Thuật",
    thumb: "/images/gallery/dsc-5513-thumb.jpg",
    full: "/images/gallery/dsc-5513.jpg",
    alt: "Quang Thắng & Tường Lan - Sắc hoa tình yêu",
  },
  {
    id: "5595",
    conceptId: "rose",
    conceptName: "Lãng Mạn Nghệ Thuật",
    thumb: "/images/gallery/dsc-5595-thumb.jpg",
    full: "/images/gallery/dsc-5595.jpg",
    alt: "Quang Thắng & Tường Lan - Niềm vui ngập tràn",
  },

  // 5. Thanh Lịch & Quyến Rũ (Tuxedo Trắng & Váy Đuôi Cá)
  {
    id: "5861",
    conceptId: "mermaid",
    conceptName: "Thanh Lịch & Quyến Rũ",
    thumb: "/images/gallery/dsc-5861-thumb.jpg",
    full: "/images/gallery/dsc-5861.jpg",
    alt: "Quang Thắng & Tường Lan - Nụ hôn trên tay nàng",
  },
  {
    id: "5872",
    conceptId: "mermaid",
    conceptName: "Thanh Lịch & Quyến Rũ",
    thumb: "/images/gallery/dsc-5872-thumb.jpg",
    full: "/images/gallery/dsc-5872.jpg",
    alt: "Quang Thắng & Tường Lan - Rạng ngời bên hoa tươi",
  },
  {
    id: "5940",
    conceptId: "mermaid",
    conceptName: "Thanh Lịch & Quyến Rũ",
    thumb: "/images/gallery/dsc-5940-thumb.jpg",
    full: "/images/gallery/dsc-5940.jpg",
    alt: "Quang Thắng & Tường Lan - Say đắm trong mắt nhau",
  },
  {
    id: "6090",
    conceptId: "mermaid",
    conceptName: "Thanh Lịch & Quyến Rũ",
    thumb: "/images/gallery/dsc-6090-thumb.jpg",
    full: "/images/gallery/dsc-6090.jpg",
    alt: "Quang Thắng & Tường Lan - Điệu khiêu vũ hạnh phúc",
  },

  // 6. Duyên Dáng Truyền Thống (Cổ Phục Áo Tấc Đỏ)
  {
    id: "5699",
    conceptId: "traditional",
    conceptName: "Cổ Phục Truyền Thống",
    thumb: "/images/gallery/dsc-5699-thumb.jpg",
    full: "/images/gallery/dsc-5699.jpg",
    alt: "Quang Thắng & Tường Lan - Cổ phục Việt truyền thống",
  },
  {
    id: "5769",
    conceptId: "traditional",
    conceptName: "Cổ Phục Truyền Thống",
    thumb: "/images/gallery/dsc-5769-thumb.jpg",
    full: "/images/gallery/dsc-5769.jpg",
    alt: "Quang Thắng & Tường Lan - Nụ hôn ngọt ngào cổ phục",
  },
];

export default function PhotoGallery() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const touchStartXRef = useRef<number>(0);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
    document.body.style.removeProperty("overflow");
  }, []);

  const nextPhoto = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev! + 1) % GALLERY_PHOTOS.length);
  }, [lightboxIndex]);

  const prevPhoto = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex(
      (prev) => (prev! - 1 + GALLERY_PHOTOS.length) % GALLERY_PHOTOS.length
    );
  }, [lightboxIndex]);

  // Keyboard navigation
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowRight") nextPhoto();
      else if (e.key === "ArrowLeft") prevPhoto();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, nextPhoto, prevPhoto, closeLightbox]);

  // Scroll reveal animation for gallery cards (Sequential: Top-to-bottom, Left-then-Right)
  useEffect(() => {
    const cards = Array.from(document.querySelectorAll<HTMLElement>(".gallery-card"));
    if (!cards.length) return;

    let pendingCards: HTMLElement[] = [];
    let timeout: NodeJS.Timeout | null = null;

    const processCardBatch = (batch: HTMLElement[]) => {
      if (!batch.length) return;

      // Filter cards not yet in view
      const valid = batch.filter((c) => !c.classList.contains("in-view"));
      if (!valid.length) return;

      // Sort: elements higher up first; same row (|topA - topB| <= 20px) sorted left-to-right
      valid.sort((a, b) => {
        const rA = a.getBoundingClientRect();
        const rB = b.getBoundingClientRect();
        if (Math.abs(rA.top - rB.top) > 20) {
          return rA.top - rB.top;
        }
        return rA.left - rB.left;
      });

      // When scrolling normally into the row:
      // Start immediately with a crisp, noticeable stagger right before user's eyes!
      // First card in row: 50ms (0.05s)
      // Second card in same row: +140ms (0.19s)
      // Next row: +180ms
      const ROW_STEP_MS = 180;
      const COL_STEP_MS = 140;

      let currentDelay = 50;
      let prevTop: number | null = null;

      valid.forEach((card, idx) => {
        const r = card.getBoundingClientRect();
        if (idx > 0 && prevTop !== null) {
          const isSameRow = Math.abs(r.top - prevTop) <= 20;
          currentDelay += isSameRow ? COL_STEP_MS : ROW_STEP_MS;
        }
        prevTop = r.top;

        const delaySec = (currentDelay / 1000).toFixed(2) + "s";
        card.style.setProperty("--gallery-delay", delaySec);
        card.style.transitionDelay = delaySec;
        card.classList.add("in-view");
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const newlyIntersecting: HTMLElement[] = [];
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const card = entry.target as HTMLElement;
            observer.unobserve(card);
            newlyIntersecting.push(card);
          }
        });

        if (newlyIntersecting.length > 0) {
          pendingCards.push(...newlyIntersecting);
          if (timeout) clearTimeout(timeout);
          timeout = setTimeout(() => {
            const batch = pendingCards;
            pendingCards = [];
            processCardBatch(batch);
          }, 15);
        }
      },
      {
        threshold: 0.05,
        rootMargin: "0px 0px -30px 0px", // Triggers right when the card enters the viewport so animation is clearly visible!
      }
    );

    // Fast scroll detection: if user swipes rapidly, immediately reveal cards to avoid blank screen
    let lastScrollY = window.scrollY;
    let lastScrollTime = Date.now();
    const handleScroll = () => {
      const now = Date.now();
      const dt = now - lastScrollTime;
      if (dt > 12) {
        const dy = Math.abs(window.scrollY - lastScrollY);
        const speed = dy / dt;
        if (speed > 0.75) {
          // Fast flick: reveal any cards within 150px immediately
          cards.forEach((card) => {
            if (!card.classList.contains("in-view")) {
              const rect = card.getBoundingClientRect();
              if (rect.top < window.innerHeight + 150 && rect.bottom > -50) {
                card.style.setProperty("--gallery-delay", "0s");
                card.style.transitionDelay = "0s";
                card.classList.add("in-view");
                observer.unobserve(card);
              }
            }
          });
        }
        lastScrollY = window.scrollY;
        lastScrollTime = now;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    const initialInView: HTMLElement[] = [];
    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      if (rect.top < window.innerHeight - 30 && rect.bottom > 0) {
        initialInView.push(card);
      } else {
        observer.observe(card);
      }
    });

    if (initialInView.length > 0) {
      processCardBatch(initialInView);
    }

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
      if (timeout) clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="wedding-gallery-wrapper">
      {/* 2-Column Mobile Grid - Seamless, No Gap, No Rounded Corners */}
      <div className="gallery-grid">
        {GALLERY_PHOTOS.map((photo, idx) => (
          <div
            key={photo.id}
            className="gallery-card"
            onClick={() => openLightbox(idx)}
            role="button"
            tabIndex={0}
            aria-label={`Xem ảnh ${photo.alt}`}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") openLightbox(idx);
            }}
          >
            <div className="gallery-card-inner">
              <img
                src={photo.thumb}
                alt={photo.alt}
                loading={idx < 4 ? "eager" : "lazy"}
                decoding="async"
                className="gallery-img"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen Lightbox Zoom Modal */}
      {lightboxIndex !== null && GALLERY_PHOTOS[lightboxIndex] && (
        <div
          className="wedding-lightbox"
          onClick={closeLightbox}
          onTouchStart={(e) => {
            touchStartXRef.current = e.touches[0].clientX;
          }}
          onTouchEnd={(e) => {
            const diffX = e.changedTouches[0].clientX - touchStartXRef.current;
            if (Math.abs(diffX) > 40) {
              if (diffX > 0) prevPhoto();
              else nextPhoto();
            }
          }}
        >
          {/* Top Bar with Close */}
          <div
            className="lightbox-topbar"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="lightbox-close-btn"
              onClick={closeLightbox}
              aria-label="Đóng"
            >
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* Main Image Container */}
          <div
            className="lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={GALLERY_PHOTOS[lightboxIndex].full}
              alt={GALLERY_PHOTOS[lightboxIndex].alt}
              className="lightbox-img"
              draggable={false}
            />
          </div>

          {/* Navigation Arrows */}
          <button
            type="button"
            className="lightbox-nav lightbox-prev"
            onClick={(e) => {
              e.stopPropagation();
              prevPhoto();
            }}
            aria-label="Ảnh trước"
          >
            <svg
              viewBox="0 0 24 24"
              width="26"
              height="26"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          <button
            type="button"
            className="lightbox-nav lightbox-next"
            onClick={(e) => {
              e.stopPropagation();
              nextPhoto();
            }}
            aria-label="Ảnh sau"
          >
            <svg
              viewBox="0 0 24 24"
              width="26"
              height="26"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
