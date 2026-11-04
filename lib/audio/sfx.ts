import { noteFreq, type Wave } from "./tracker";

export interface Tone {
  /** Start offset in seconds. */
  at: number;
  dur: number;
  freq: number;
  /** Optional end frequency for a slide. */
  to?: number;
  wave: Wave;
  gain: number;
}

export type SfxId = "menu" | "hit" | "hurt" | "ac" | "wa" | "tle" | "ce" | "levelup";

const f = (n: string): number => {
  const v = noteFreq(n);
  if (v === null) throw new Error(`bad note ${n}`);
  return v;
};

/** Short, original sound effects. Verdict stingers: AC rising fanfare, WA low thud, TLE clock ticks, CE glitch. */
export const SFX: Record<SfxId, Tone[]> = {
  menu: [{ at: 0, dur: 0.05, freq: f("E6"), wave: "square", gain: 0.5 }],
  hit: [
    { at: 0, dur: 0.12, freq: 220, to: 60, wave: "square", gain: 0.6 },
    { at: 0, dur: 0.1, freq: 900, wave: "noise", gain: 0.5 },
  ],
  hurt: [
    { at: 0, dur: 0.22, freq: 160, to: 50, wave: "sawtooth", gain: 0.55 },
    { at: 0, dur: 0.12, freq: 600, wave: "noise", gain: 0.4 },
  ],
  ac: [
    { at: 0, dur: 0.12, freq: f("C5"), wave: "square", gain: 0.5 },
    { at: 0.12, dur: 0.12, freq: f("E5"), wave: "square", gain: 0.5 },
    { at: 0.24, dur: 0.12, freq: f("G5"), wave: "square", gain: 0.5 },
    { at: 0.36, dur: 0.4, freq: f("C6"), wave: "square", gain: 0.55 },
    { at: 0.36, dur: 0.4, freq: f("E5"), wave: "triangle", gain: 0.6 },
  ],
  wa: [
    { at: 0, dur: 0.28, freq: 110, to: 70, wave: "triangle", gain: 0.9 },
    { at: 0, dur: 0.08, freq: 400, wave: "noise", gain: 0.35 },
  ],
  tle: [0, 0.18, 0.36, 0.54].map((at) => ({ at, dur: 0.05, freq: at < 0.5 ? f("A5") : f("A4"), wave: "square" as Wave, gain: 0.45 })),
  ce: [
    { at: 0, dur: 0.06, freq: 1200, to: 200, wave: "sawtooth", gain: 0.4 },
    { at: 0.07, dur: 0.06, freq: 300, to: 1500, wave: "square", gain: 0.35 },
    { at: 0.14, dur: 0.1, freq: 800, wave: "noise", gain: 0.45 },
  ],
  levelup: [f("G4"), f("C5"), f("E5"), f("G5"), f("C6")].map((freq, i) => ({ at: i * 0.09, dur: 0.1, freq, wave: "square" as Wave, gain: 0.5 })),
};

export function sfxDuration(id: SfxId): number {
  return Math.max(...SFX[id].map((t) => t.at + t.dur));
}

/** Which stinger a judge verdict plays. A runtime error is a wrong answer to the ear. */
export function verdictSfx(v: "AC" | "WA" | "TLE" | "RE" | "CE"): SfxId {
  return v === "AC" ? "ac" : v === "TLE" ? "tle" : v === "CE" ? "ce" : "wa";
}
