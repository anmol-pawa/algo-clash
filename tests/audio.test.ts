import { describe, expect, it } from "vitest";
import { loopSeconds, noteFreq, songEvents, stepCount, validateSong, type Song } from "@/lib/audio/tracker";
import { SONGS } from "@/lib/audio/songs";
import { SFX, sfxDuration, verdictSfx } from "@/lib/audio/sfx";
import { AUDIO_PREFS_KEY, busGains, DEFAULT_AUDIO_PREFS, loadPrefs, sanitizePrefs, savePrefs } from "@/lib/audio/prefs";

describe("tracker", () => {
  it("maps note names to equal-tempered frequencies", () => {
    expect(noteFreq("A4")).toBeCloseTo(440, 6);
    expect(noteFreq("C4")).toBeCloseTo(261.6256, 3);
    expect(noteFreq("A5")! / noteFreq("A4")!).toBeCloseTo(2, 9);
    expect(noteFreq("Bb3")).toBeCloseTo(noteFreq("A#3")!, 9);
    expect(noteFreq("H4")).toBeNull();
    expect(noteFreq("C")).toBeNull();
  });

  it("expands holds into longer notes and skips rests", () => {
    const song: Song = { id: "t", bpm: 120, stepsPerBeat: 2, channels: [{ wave: "square", gain: 1, pattern: "C4 _ - E4" }] };
    expect(songEvents(song).map((e) => [e.t, e.dur])).toEqual([[0, 0.5], [0.75, 0.25]]);
    expect(loopSeconds(song)).toBeCloseTo(1, 9);
  });

  it("rejects ragged channels, bad tokens and a leading hold", () => {
    const mk = (a: string, b: string): Song => ({ id: "x", bpm: 100, stepsPerBeat: 2, channels: [{ wave: "square", gain: 1, pattern: a }, { wave: "triangle", gain: 1, pattern: b }] });
    expect(() => validateSong(mk("C4 D4", "C3"))).toThrow(/steps/);
    expect(() => validateSong(mk("C4 Q9", "C3 C3"))).toThrow(/bad token/);
    expect(() => validateSong(mk("_ C4", "C3 C3"))).toThrow(/hold/);
    expect(() => validateSong(mk("C4 D4", "C3 C3"))).not.toThrow();
  });

  it.each(Object.values(SONGS))("shipped song $id is valid, loops in 8-40 s and is non-empty", (song) => {
    validateSong(song);
    expect(stepCount(song)).toBe(64);
    const len = loopSeconds(song);
    expect(len).toBeGreaterThan(8);
    expect(len).toBeLessThan(40);
    const ev = songEvents(song);
    expect(ev.length).toBeGreaterThan(30);
    for (const e of ev) {
      expect(e.t).toBeGreaterThanOrEqual(0);
      expect(e.t + e.dur).toBeLessThanOrEqual(len + 1e-9);
    }
  });
});

describe("sfx", () => {
  it("every effect is short and well-formed", () => {
    for (const [id, tones] of Object.entries(SFX)) {
      expect(tones.length).toBeGreaterThan(0);
      for (const t of tones) {
        expect(t.dur).toBeGreaterThan(0);
        expect(t.freq).toBeGreaterThan(20);
        expect(t.gain).toBeGreaterThan(0);
        expect(t.gain).toBeLessThanOrEqual(1);
      }
      expect(sfxDuration(id as keyof typeof SFX)).toBeLessThan(1.2);
    }
  });

  it("maps verdicts to distinct stingers", () => {
    expect(verdictSfx("AC")).toBe("ac");
    expect(verdictSfx("WA")).toBe("wa");
    expect(verdictSfx("RE")).toBe("wa");
    expect(verdictSfx("TLE")).toBe("tle");
    expect(verdictSfx("CE")).toBe("ce");
  });
});

describe("prefs", () => {
  it("sanitises junk and clamps volumes", () => {
    expect(sanitizePrefs(null)).toEqual(DEFAULT_AUDIO_PREFS);
    expect(sanitizePrefs({ muted: "yes", master: 5, music: -1, sfx: NaN })).toEqual({ ...DEFAULT_AUDIO_PREFS, master: 1, music: 0 });
  });

  it("round-trips through storage and survives a throwing or broken store", () => {
    const mem = new Map<string, string>();
    const st = { getItem: (k: string) => mem.get(k) ?? null, setItem: (k: string, v: string) => void mem.set(k, v) };
    savePrefs(st, { muted: true, master: 0.3, music: 0.2, sfx: 0.9 });
    expect(loadPrefs(st)).toEqual({ muted: true, master: 0.3, music: 0.2, sfx: 0.9 });
    mem.set(AUDIO_PREFS_KEY, "{not json");
    expect(loadPrefs(st)).toEqual(DEFAULT_AUDIO_PREFS);
    expect(() => savePrefs({ setItem: () => { throw new Error("quota"); } }, DEFAULT_AUDIO_PREFS)).not.toThrow();
    expect(loadPrefs(undefined)).toEqual(DEFAULT_AUDIO_PREFS);
  });

  it("mute silences both buses and volumes scale them", () => {
    expect(busGains({ ...DEFAULT_AUDIO_PREFS, muted: true })).toEqual({ music: 0, sfx: 0 });
    const a = busGains({ muted: false, master: 1, music: 1, sfx: 1 });
    const b = busGains({ muted: false, master: 0.5, music: 1, sfx: 1 });
    expect(b.music).toBeCloseTo(a.music / 2, 9);
    expect(a.sfx).toBeGreaterThan(0);
  });
});
