"use client";

import { useMusicPlayer } from "../hooks/useMusicPlayer";

export default function MusicToggle() {
  const { isPlaying, toggle } = useMusicPlayer("/music/music.mp3");

  return (
    <button
      id="music-toggle"
      type="button"
      aria-label="Bật/tắt nhạc"
      title={isPlaying ? "Tắt nhạc" : "Bật nhạc"}
      aria-pressed={isPlaying}
      onClick={toggle}
      className={isPlaying ? "playing" : ""}
    >
      <svg
        id="music-icon"
        viewBox="0 0 64 64"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M42 9.5c1.2-.35 2.4.55 2.4 1.8v27.15c0 5.15-4.35 9.35-9.7 9.35-4.65 0-8.4-3.1-8.4-6.95s3.75-6.95 8.4-6.95c1.75 0 3.4.45 4.75 1.25V21.2l-18.9 5.35v19.1c0 5.15-4.35 9.35-9.7 9.35-4.65 0-8.4-3.1-8.4-6.95s3.75-6.95 8.4-6.95c1.75 0 3.4.45 4.75 1.25V20.3c0-1.05.7-2 1.7-2.3L42 9.5Z" />
        <path
          d="M51.7 18.2c1.1-2 4-2 5.1 0 .65 1.2.45 2.7-.55 3.7l-4.55 4.45-4.55-4.45c-1-.95-1.2-2.5-.55-3.7 1.1-2 4-2 5.1 0Z"
          opacity="0.9"
        />
      </svg>

      <span id="music-slash" />
    </button>
  );
}
