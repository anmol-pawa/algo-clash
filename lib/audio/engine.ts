import { busGains, DEFAULT_AUDIO_PREFS, type AudioPrefs } from "./prefs";
import { SFX, type SfxId, type Tone } from "./sfx";
import { SONGS, type SongId } from "./songs";
import { loopSeconds, songEvents, type NoteEvent, type Wave } from "./tracker";

const LOOKAHEAD_S = 0.4;
const TICK_MS = 100;

/**
 * The WebAudio synth. Browsers only allow audio after a user gesture, so the context is created lazily by
 * `unlock()`; until then every call is remembered (current song, prefs) and does nothing audible.
 */
export class AudioEngine {
  private ctx: AudioContext | null = null;
  private musicBus: GainNode | null = null;
  private sfxBus: GainNode | null = null;
  private noise: AudioBuffer | null = null;
  private prefs: AudioPrefs = { ...DEFAULT_AUDIO_PREFS };
  private song: SongId | null = null;
  private timer: ReturnType<typeof setInterval> | null = null;
  private loopStart = 0;
  private cursor = 0;
  private events: NoteEvent[] = [];
  private loopLen = 0;
  private lastMenu = 0;

  setPrefs(p: AudioPrefs): void {
    this.prefs = p;
    this.applyGains();
  }

  get unlocked(): boolean {
    return this.ctx !== null;
  }

  /** Call from a user gesture. Safe to call repeatedly. */
  unlock(): void {
    if (typeof window === "undefined") return;
    if (!this.ctx) {
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return;
      this.ctx = new Ctor();
      this.musicBus = this.ctx.createGain();
      this.sfxBus = this.ctx.createGain();
      this.musicBus.connect(this.ctx.destination);
      this.sfxBus.connect(this.ctx.destination);
      this.noise = this.makeNoise(this.ctx);
      this.applyGains();
    }
    if (this.ctx.state === "suspended") void this.ctx.resume();
    if (this.song) this.startLoop();
  }

  /** Switches the background music. Passing the song that already plays does nothing; null stops music. */
  playSong(id: SongId | null): void {
    if (id === this.song && (id === null || this.timer !== null || !this.ctx)) return;
    this.stopLoop();
    this.song = id;
    if (id && this.ctx) this.startLoop();
  }

  playSfx(id: SfxId): void {
    const ctx = this.ctx;
    if (!ctx || !this.sfxBus || this.prefs.muted) return;
    if (id === "menu") {
      if (ctx.currentTime - this.lastMenu < 0.04) return;
      this.lastMenu = ctx.currentTime;
    }
    const t0 = ctx.currentTime + 0.01;
    for (const tone of SFX[id]) this.voice(tone.wave, tone.freq, tone.to, t0 + tone.at, tone.dur, tone.gain, this.sfxBus);
  }

  private applyGains(): void {
    if (!this.ctx || !this.musicBus || !this.sfxBus) return;
    const g = busGains(this.prefs);
    const t = this.ctx.currentTime;
    this.musicBus.gain.setTargetAtTime(g.music, t, 0.03);
    this.sfxBus.gain.setTargetAtTime(g.sfx, t, 0.03);
  }

  private startLoop(): void {
    const ctx = this.ctx;
    if (!ctx || !this.song || this.timer !== null) return;
    const song = SONGS[this.song];
    this.events = songEvents(song);
    this.loopLen = loopSeconds(song);
    this.loopStart = ctx.currentTime + 0.08;
    this.cursor = 0;
    this.tick();
    this.timer = setInterval(() => this.tick(), TICK_MS);
  }

  private stopLoop(): void {
    if (this.timer !== null) clearInterval(this.timer);
    this.timer = null;
  }

  /** Schedules every note starting before now + lookahead, wrapping the loop. */
  private tick(): void {
    const ctx = this.ctx;
    if (!ctx || !this.musicBus || this.events.length === 0) return;
    const horizon = ctx.currentTime + LOOKAHEAD_S;
    for (;;) {
      const ev = this.events[this.cursor];
      const at = this.loopStart + ev.t;
      if (at >= horizon) break;
      if (at >= ctx.currentTime - 0.05) this.voice(ev.wave, ev.freq, undefined, at, ev.dur, ev.gain, this.musicBus);
      this.cursor++;
      if (this.cursor >= this.events.length) {
        this.cursor = 0;
        this.loopStart += this.loopLen;
      }
    }
  }

  private voice(wave: Wave, freq: number, to: number | undefined, at: number, dur: number, gain: number, bus: GainNode): void {
    const ctx = this.ctx;
    if (!ctx) return;
    const g = ctx.createGain();
    const end = at + dur;
    // Short attack and release avoid clicks; the held body keeps square leads punchy.
    g.gain.setValueAtTime(0.0001, at);
    g.gain.linearRampToValueAtTime(gain, at + Math.min(0.008, dur / 4));
    g.gain.setValueAtTime(gain, Math.max(at + 0.008, end - 0.03));
    g.gain.linearRampToValueAtTime(0.0001, end);
    g.connect(bus);
    if (wave === "noise" && this.noise) {
      const src = ctx.createBufferSource();
      src.buffer = this.noise;
      src.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = "highpass";
      filter.frequency.value = Math.min(8000, freq);
      src.connect(filter).connect(g);
      src.start(at);
      src.stop(end + 0.02);
      return;
    }
    const osc = ctx.createOscillator();
    osc.type = wave === "noise" ? "square" : wave;
    osc.frequency.setValueAtTime(freq, at);
    if (to !== undefined) osc.frequency.exponentialRampToValueAtTime(Math.max(20, to), end);
    osc.connect(g);
    osc.start(at);
    osc.stop(end + 0.02);
  }

  private makeNoise(ctx: AudioContext): AudioBuffer {
    const buf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const d = buf.getChannelData(0);
    let x = 0x2f6e2b1;
    for (let i = 0; i < d.length; i++) {
      x ^= x << 13;
      x ^= x >>> 17;
      x ^= x << 5;
      d[i] = ((x >>> 0) / 0xffffffff) * 2 - 1;
    }
    return buf;
  }
}

export type { Tone };
export const audio = new AudioEngine();
