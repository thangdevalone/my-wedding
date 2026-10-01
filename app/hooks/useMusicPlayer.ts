"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export function useMusicPlayer(src: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const musicStartedRef = useRef(false);

  useEffect(() => {
    const audio = new Audio(src);
    audio.preload = "auto";
    audio.volume = 0.65;
    audio.loop = true;
    audioRef.current = audio;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);

    // Auto-play on first user gesture (matching live site behavior)
    const startMusicOnFirstGesture = (e: Event) => {
      if (musicStartedRef.current) return;
      const target = e.target as HTMLElement | null;
      if (target && target.closest("#music-toggle")) return;

      audio
        .play()
        .then(() => {
          musicStartedRef.current = true;
          removeAutoPlayEvents();
        })
        .catch(() => {});
    };

    const addAutoPlayEvents = () => {
      document.addEventListener("wheel", startMusicOnFirstGesture, { passive: true });
      document.addEventListener("scroll", startMusicOnFirstGesture, { passive: true });
      document.addEventListener("mousemove", startMusicOnFirstGesture, { passive: true });
      document.addEventListener("touchstart", startMusicOnFirstGesture, { passive: true });
      document.addEventListener("touchmove", startMusicOnFirstGesture, { passive: true });
    };

    const removeAutoPlayEvents = () => {
      document.removeEventListener("wheel", startMusicOnFirstGesture);
      document.removeEventListener("scroll", startMusicOnFirstGesture);
      document.removeEventListener("mousemove", startMusicOnFirstGesture);
      document.removeEventListener("touchstart", startMusicOnFirstGesture);
      document.removeEventListener("touchmove", startMusicOnFirstGesture);
    };

    addAutoPlayEvents();

    return () => {
      removeAutoPlayEvents();
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.pause();
      audio.src = "";
    };
  }, [src]);

  const toggle = useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio
        .play()
        .then(() => {
          musicStartedRef.current = true;
        })
        .catch(() => {});
    }
  }, [isPlaying]);

  return { isPlaying, toggle };
}
