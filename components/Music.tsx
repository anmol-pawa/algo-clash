"use client";

import { useEffect } from "react";
import { audio } from "@/lib/audio/engine";
import type { SongId } from "@/lib/audio/songs";

/** Songs claimed by mounted components, newest last. The newest claim plays; releasing it falls back to the previous one. */
const claims: { id: SongId }[] = [];

function sync(): void {
  audio.playSong(claims.length ? claims[claims.length - 1].id : null);
}

/** Plays a background song while mounted. Nested claims (a battle inside the gym) hand back to the outer song on unmount. */
export function useMusic(song: SongId | null): void {
  useEffect(() => {
    if (song === null) return;
    const claim = { id: song };
    claims.push(claim);
    sync();
    return () => {
      claims.splice(claims.indexOf(claim), 1);
      sync();
    };
  }, [song]);
}

/** Declarative form of `useMusic` for server-rendered pages. */
export function Music({ song }: { song: SongId }) {
  useMusic(song);
  return null;
}
