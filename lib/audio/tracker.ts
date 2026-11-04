/** A tiny tracker format: each channel is a row of step tokens. Pure data and maths, no WebAudio. */

export type Wave = "square" | "triangle" | "sawtooth" | "noise";

export interface Channel {
  wave: Wave;
  gain: number;
  /** Space-separated steps: a note ("C4", "F#3", "Bb2"), "-" for a rest, "_" to hold the previous note. */
  pattern: string;
}

export interface Song {
  id: string;
  bpm: number;
  /** Steps per beat (2 = eighth notes at the given bpm). */
  stepsPerBeat: number;
  channels: Channel[];
}

export interface NoteEvent {
  /** Seconds from the start of the loop. */
  t: number;
  dur: number;
  freq: number;
  wave: Wave;
  gain: number;
}

const SEMITONES: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

/** Frequency in Hz of a note name, A4 = 440. Returns null for anything that is not a valid note. */
export function noteFreq(name: string): number | null {
  const m = /^([A-G])([#b]?)(-?\d)$/.exec(name);
  if (!m) return null;
  const semis = SEMITONES[m[1]] + (m[2] === "#" ? 1 : m[2] === "b" ? -1 : 0);
  const midi = (Number(m[3]) + 1) * 12 + semis;
  return 440 * Math.pow(2, (midi - 69) / 12);
}

export function stepSeconds(song: Song): number {
  return 60 / song.bpm / song.stepsPerBeat;
}

export function stepCount(song: Song): number {
  return song.channels.length === 0 ? 0 : song.channels[0].pattern.trim().split(/\s+/).length;
}

export function loopSeconds(song: Song): number {
  return stepCount(song) * stepSeconds(song);
}

/** Throws if channels disagree on length or contain a bad token. Used by tests so a typo cannot ship. */
export function validateSong(song: Song): void {
  if (song.bpm <= 0 || song.stepsPerBeat <= 0) throw new Error(`${song.id}: bad tempo`);
  const n = stepCount(song);
  song.channels.forEach((ch, i) => {
    const toks = ch.pattern.trim().split(/\s+/);
    if (toks.length !== n) throw new Error(`${song.id}: channel ${i} has ${toks.length} steps, expected ${n}`);
    toks.forEach((tk, j) => {
      if (tk === "-" || tk === "_") return;
      if (j === 0 && tk === "_") throw new Error(`${song.id}: channel ${i} starts with a hold`);
      if (noteFreq(tk) === null) throw new Error(`${song.id}: channel ${i} step ${j}: bad token "${tk}"`);
    });
    if (toks[0] === "_") throw new Error(`${song.id}: channel ${i} starts with a hold`);
  });
}

/** Expands a song into note events for one pass of the loop. Holds extend the previous note. */
export function songEvents(song: Song): NoteEvent[] {
  const step = stepSeconds(song);
  const out: NoteEvent[] = [];
  for (const ch of song.channels) {
    let last: NoteEvent | null = null;
    ch.pattern.trim().split(/\s+/).forEach((tk, i) => {
      if (tk === "_") {
        if (last) last.dur += step;
        return;
      }
      last = null;
      if (tk === "-") return;
      const freq = noteFreq(tk);
      if (freq === null) return;
      last = { t: i * step, dur: step, freq, wave: ch.wave, gain: ch.gain };
      out.push(last);
    });
  }
  return out.sort((a, b) => a.t - b.t);
}
