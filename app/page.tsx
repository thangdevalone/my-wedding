"use client";

import WeddingContent from "./components/WeddingContent";
import MusicToggle from "./components/MusicToggle";

export default function HomePage() {
  return (
    <main>
      <WeddingContent />
      <MusicToggle />
      <div id="backdrop-popup" className="backdrop-popup" />
      <div id="backdrop-dropbox" className="backdrop-dropbox" />
      <div id="lightbox-screen" className="lightbox-screen" />
    </main>
  );
}
