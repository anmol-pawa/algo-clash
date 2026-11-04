import type { Song } from "./tracker";

/** All music is original, written for this game. 16-step bars at eighth-note resolution. */

/** Mainville: a warm, unhurried walking theme in C major (4 bars, 64 steps). */
export const MAINVILLE_THEME: Song = {
  id: "mainville",
  bpm: 108,
  stepsPerBeat: 2,
  channels: [
    {
      wave: "square",
      gain: 0.5,
      pattern: [
        "E5 _ G5 _ E5 D5 C5 _  D5 _ E5 _ - - - -",
        "F5 _ A5 _ F5 E5 D5 _  E5 _ G5 _ - - - -",
        "G5 _ E5 _ C5 _ E5 _   D5 _ B4 _ G4 _ - -",
        "A4 _ C5 _ E5 _ D5 _   C5 _ _ _ - - - -",
      ].join(" "),
    },
    {
      wave: "triangle",
      gain: 0.8,
      pattern: [
        "C3 - G3 - C3 - G3 -   C3 - G3 - C3 - G3 -",
        "F3 - C4 - F3 - C4 -   C3 - G3 - C3 - G3 -",
        "C3 - G3 - E3 - G3 -   G2 - D3 - G2 - D3 -",
        "A2 - E3 - A2 - E3 -   F2 - C3 - G2 - D3 -",
      ].join(" "),
    },
    {
      wave: "noise",
      gain: 0.12,
      pattern: Array.from({ length: 8 }, () => "- - - - A5 - - -").join(" "),
    },
  ],
};

/** Battle: a faster, tenser A-minor loop (4 bars, 64 steps). */
export const BATTLE_THEME: Song = {
  id: "battle",
  bpm: 150,
  stepsPerBeat: 2,
  channels: [
    {
      wave: "square",
      gain: 0.45,
      pattern: [
        "A4 _ C5 A4 E5 _ C5 A4   B4 _ D5 B4 F5 _ D5 B4",
        "C5 _ E5 C5 G5 _ E5 C5   B4 _ D5 B4 G#4 _ B4 -",
        "A4 _ C5 A4 E5 _ C5 A4   F5 _ E5 D5 C5 _ B4 _",
        "A4 _ E5 _ A5 _ G5 _     E5 _ C5 _ B4 _ G#4 -",
      ].join(" "),
    },
    {
      wave: "sawtooth",
      gain: 0.22,
      pattern: [
        "A2 A2 - A2 A2 - A2 A2   G2 G2 - G2 G2 - G2 G2",
        "F2 F2 - F2 F2 - F2 F2   E2 E2 - E2 E2 - E2 E2",
        "A2 A2 - A2 A2 - A2 A2   D3 D3 - D3 D3 - D3 D3",
        "F2 F2 - F2 F2 - F2 F2   E2 E2 - E2 E2 - E2 E2",
      ].join(" "),
    },
    {
      wave: "noise",
      gain: 0.14,
      pattern: Array.from({ length: 8 }, () => "A5 - - - A5 - A5 -").join(" "),
    },
  ],
};

export const SONGS = { mainville: MAINVILLE_THEME, battle: BATTLE_THEME } as const;
export type SongId = keyof typeof SONGS;
