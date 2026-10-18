"use client";

import { useEffect, useRef } from "react";

interface Heart {
  x: number;
  y: number;
  baseX: number;
  size: number;
  speedY: number;
  swaySpeed: number;
  swayRadius: number;
  angle: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  opacity: number;
  scale: number;
  isBurst?: boolean;
  vx?: number;
  vy?: number;
  life?: number;
  maxLife?: number;
}

const WEDDING_HEART_PALETTE = [
  "rgba(179, 57, 57, ",   // Deep rose / burgundy
  "rgba(214, 69, 80, ",   // Romantic wine red
  "rgba(244, 114, 182, ", // Soft blush pink
  "rgba(251, 146, 60, ",  // Warm apricot / coral
  "rgba(225, 112, 85, ",  // Warm rose coral
  "rgba(217, 119, 6, ",   // Golden champagne accent
];

export default function FloatingHearts() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Handle high DPI screens
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    const hearts: Heart[] = [];
    const isMobile = width < 600;
    const maxHearts = isMobile ? 26 : 42;

    const createHeart = (initialY?: number): Heart => {
      const size = Math.random() * (isMobile ? 12 : 16) + (isMobile ? 9 : 11);
      const baseX = Math.random() * width;
      const colorBase =
        WEDDING_HEART_PALETTE[
          Math.floor(Math.random() * WEDDING_HEART_PALETTE.length)
        ];
      const opacity = Math.random() * 0.45 + 0.35; // 0.35 to 0.8

      return {
        x: baseX,
        y: initialY !== undefined ? initialY : height + Math.random() * 80,
        baseX,
        size,
        speedY: Math.random() * 0.75 + 0.55, // smooth upward drift
        swaySpeed: Math.random() * 0.02 + 0.015,
        swayRadius: Math.random() * 22 + 10,
        angle: Math.random() * Math.PI * 2,
        rotation: (Math.random() - 0.5) * 0.4,
        rotationSpeed: (Math.random() - 0.5) * 0.015,
        color: `${colorBase}${opacity.toFixed(2)})`,
        opacity,
        scale: 1,
      };
    };

    // Pre-populate across the screen on first load so user immediately sees gentle floating hearts
    for (let i = 0; i < maxHearts; i++) {
      hearts.push(createHeart(Math.random() * height));
    }

    // Helper to draw a heart shape using cubic bezier curves
    const drawHeart = (
      c: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      color: string,
      rotation: number
    ) => {
      c.save();
      c.translate(x, y);
      c.rotate(rotation);

      c.beginPath();
      const topCurveHeight = size * 0.3;
      c.moveTo(0, topCurveHeight);

      // Top-left curve
      c.bezierCurveTo(
        -size / 2,
        -topCurveHeight,
        -size,
        size / 3,
        0,
        size
      );

      // Top-right curve
      c.bezierCurveTo(
        size,
        size / 3,
        size / 2,
        -topCurveHeight,
        0,
        topCurveHeight
      );

      c.closePath();
      c.fillStyle = color;
      c.fill();
      c.restore();
    };

    // Burst of hearts when tapping or clicking (excluding typing inputs)
    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT")
      ) {
        return; // Don't trigger bursts while user is typing in form
      }

      const clientX =
        "touches" in e && e.touches.length > 0
          ? e.touches[0].clientX
          : (e as MouseEvent).clientX;
      const clientY =
        "touches" in e && e.touches.length > 0
          ? e.touches[0].clientY
          : (e as MouseEvent).clientY;

      if (clientX === undefined || clientY === undefined) return;

      const burstCount = Math.floor(Math.random() * 3) + 4; // 4 to 6 hearts
      for (let i = 0; i < burstCount; i++) {
        const size = Math.random() * 10 + 10;
        const colorBase =
          WEDDING_HEART_PALETTE[
            Math.floor(Math.random() * WEDDING_HEART_PALETTE.length)
          ];
        const angle = (Math.PI * 2 * i) / burstCount + (Math.random() - 0.5) * 0.4;
        const speed = Math.random() * 2.5 + 1.5;

        hearts.push({
          x: clientX,
          y: clientY,
          baseX: clientX,
          size,
          speedY: 0,
          swaySpeed: 0.03,
          swayRadius: 5,
          angle: 0,
          rotation: (Math.random() - 0.5) * 0.5,
          rotationSpeed: (Math.random() - 0.5) * 0.04,
          color: `${colorBase}0.85)`,
          opacity: 0.85,
          scale: 1,
          isBurst: true,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.2, // bias upwards
          life: 0,
          maxLife: Math.floor(Math.random() * 30) + 45, // ~1 second
        });
      }
    };

    window.addEventListener("pointerdown", handlePointerDown, { passive: true });

    // Animation Loop
    let isRunning = true;
    const render = () => {
      if (!isRunning) return;

      ctx.clearRect(0, 0, width, height);

      for (let i = hearts.length - 1; i >= 0; i--) {
        const h = hearts[i];

        if (h.isBurst) {
          // Burst heart physics
          h.life = (h.life || 0) + 1;
          h.x += h.vx || 0;
          h.y += h.vy || 0;
          if (h.vy) h.vy += 0.04; // subtle gravity after burst
          h.rotation += h.rotationSpeed;

          const progress = h.life / (h.maxLife || 60);
          const currentOpacity = Math.max(0, (1 - progress) * h.opacity);
          const currentScale = Math.max(0.2, 1 - progress * 0.4);

          if (progress >= 1 || currentOpacity <= 0.01) {
            hearts.splice(i, 1);
            continue;
          }

          // Render burst heart
          drawHeart(
            ctx,
            h.x,
            h.y,
            h.size * currentScale,
            h.color.replace(/[\d\.]+\)$/, `${currentOpacity.toFixed(2)})`),
            h.rotation
          );
        } else {
          // Ambient floating heart physics
          h.y -= h.speedY;
          h.angle += h.swaySpeed;
          h.x = h.baseX + Math.sin(h.angle) * h.swayRadius;
          h.rotation = Math.sin(h.angle * 0.8) * 0.25;

          // Recycle when it floats past the top
          if (h.y < -h.size * 2) {
            h.y = height + Math.random() * 40;
            h.baseX = Math.random() * width;
            h.x = h.baseX;
            h.angle = Math.random() * Math.PI * 2;
          }

          drawHeart(ctx, h.x, h.y, h.size, h.color, h.rotation);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Pause when tab is inactive to save battery
    const handleVisibilityChange = () => {
      if (document.hidden) {
        isRunning = false;
        cancelAnimationFrame(animationFrameId);
      } else {
        if (!isRunning) {
          isRunning = true;
          render();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 35, // Floating gently above page background & content, below popups/lightbox
      }}
    />
  );
}
