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

/** Array Atoll: a breezy, lilting G-major island theme (4 bars, 64 steps). */
export const ATOLL_THEME: Song = {
  id: "atoll",
  bpm: 96,
  stepsPerBeat: 2,
  channels: [
    {
      wave: "triangle",
      gain: 0.7,
      pattern: [
        "B4 _ D5 _ G5 _ D5 _   B4 _ A4 _ G4 - - -",
        "C5 _ E5 _ A5 _ E5 _   C5 _ B4 _ A4 - - -",
        "D5 _ F#5 _ A5 _ F#5 _  D5 _ E5 _ F#5 _ E5 _",
        "D5 _ B4 _ G4 _ A4 _   G4 - - - - - - -",
      ].join(" "),
    },
    {
      wave: "square",
      gain: 0.18,
      pattern: [
        "- - G4 - - - B4 -   - - G4 - - - B4 -",
        "- - A4 - - - C5 -   - - A4 - - - C5 -",
        "- - A4 - - - D5 -   - - A4 - - - D5 -",
        "- - G4 - - - B4 -   - - G4 - - - - -",
      ].join(" "),
    },
    {
      wave: "triangle",
      gain: 0.8,
      pattern: [
        "G2 - - - D3 - - -   G2 - - - D3 - - -",
        "A2 - - - E3 - - -   A2 - - - E3 - - -",
        "D3 - - - A3 - - -   D3 - - - A3 - - -",
        "G2 - - - D3 - - -   G2 - - - - - - -",
      ].join(" "),
    },
    {
      wave: "noise",
      gain: 0.08,
      pattern: Array.from({ length: 8 }, () => "- - - - A5 - - -").join(" "),
    },
  ],
};

/** Window Woods: a hushed, rustling E-minor forest theme with a sliding two-note motif (4 bars, 64 steps). */
export const WOODS_THEME: Song = {
  id: "woods",
  bpm: 88,
  stepsPerBeat: 2,
  channels: [
    {
      wave: "triangle",
      gain: 0.7,
      pattern: [
        "E5 _ G5 _ B5 _ G5 _   E5 _ F#5 _ G5 - - -",
        "D5 _ F#5 _ A5 _ F#5 _  D5 _ E5 _ F#5 - - -",
        "C5 _ E5 _ G5 _ E5 _   C5 _ D5 _ E5 _ D5 _",
        "B4 _ D5 _ F#5 _ E5 _  D5 _ B4 _ E5 - - -",
      ].join(" "),
    },
    {
      wave: "square",
      gain: 0.14,
      pattern: [
        "- - B4 - - - E5 -   - - B4 - - - E5 -",
        "- - A4 - - - D5 -   - - A4 - - - D5 -",
        "- - G4 - - - C5 -   - - G4 - - - C5 -",
        "- - F#4 - - - B4 -  - - G4 - - - B4 -",
      ].join(" "),
    },
    {
      wave: "triangle",
      gain: 0.8,
      pattern: [
        "E2 - - - B2 - - -   E2 - - - B2 - - -",
        "D2 - - - A2 - - -   D2 - - - A2 - - -",
        "C2 - - - G2 - - -   C2 - - - G2 - - -",
        "B1 - - - F#2 - - -  E2 - - - - - - -",
      ].join(" "),
    },
    {
      wave: "noise",
      gain: 0.06,
      pattern: Array.from({ length: 8 }, () => "- - - - - - A5 -").join(" "),
    },
  ],
};

/** Hashwood Harbor: a swaying D-mixolydian sea shanty over a rolling bass (4 bars, 64 steps). */
export const HARBOR_THEME: Song = {
  id: "harbor",
  bpm: 108,
  stepsPerBeat: 2,
  channels: [
    {
      wave: "square",
      gain: 0.2,
      pattern: [
        "D5 _ F#5 _ A5 - F#5 _  D5 _ E5 _ F#5 - - -",
        "G5 _ B5 _ A5 - F#5 _  E5 _ F#5 _ G5 - - -",
        "A5 _ C6 _ B5 - G5 _   F#5 _ A5 _ E5 - - -",
        "D5 _ F#5 _ A5 - F#5 _  E5 _ C5 _ D5 - - -",
      ].join(" "),
    },
    {
      wave: "triangle",
      gain: 0.45,
      pattern: [
        "- - A4 - - - A4 -   - - A4 - - - A4 -",
        "- - B4 - - - B4 -   - - A4 - - - A4 -",
        "- - C5 - - - B4 -   - - A4 - - - G4 -",
        "- - A4 - - - A4 -   - - G4 - - - A4 -",
      ].join(" "),
    },
    {
      wave: "triangle",
      gain: 0.8,
      pattern: [
        "D2 - - - A2 - - -   D2 - - - A2 - - -",
        "G2 - - - D3 - - -   A2 - - - E2 - - -",
        "A2 - - - E3 - - -   D2 - - - A2 - - -",
        "D2 - - - A2 - - -   G2 - - - A2 - - -",
      ].join(" "),
    },
    {
      wave: "noise",
      gain: 0.05,
      pattern: Array.from({ length: 8 }, () => "- - A5 - - - - -").join(" "),
    },
  ],
};

export const SONGS = { mainville: MAINVILLE_THEME, atoll: ATOLL_THEME, woods: WOODS_THEME, harbor: HARBOR_THEME, battle: BATTLE_THEME } as const;
export type SongId = keyof typeof SONGS;
