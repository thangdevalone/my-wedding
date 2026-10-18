"use client";

import WeddingContent from "./WeddingContent";
import MusicToggle from "./MusicToggle";
import FloatingHearts from "./FloatingHearts";
import type { WishItem } from "../lib/db";

export default function HomeClient({
  guestName,
  initialWishes = [],
}: {
  guestName: string;
  initialWishes?: WishItem[];
}) {
  return (
    <main>
      <WeddingContent guestName={guestName} initialWishes={initialWishes} />
      <FloatingHearts />
      <MusicToggle />
      <div id="backdrop-popup" className="backdrop-popup" />
      <div id="backdrop-dropbox" className="backdrop-dropbox" />
      <div id="lightbox-screen" className="lightbox-screen" />
    </main>
  );
}
