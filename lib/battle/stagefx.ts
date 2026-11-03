// Pure battle-stage effect state: slide-ins, shake, hit-stop, damage numbers,
// HP tweening and verdict stingers. No DOM or Pixi; the renderer reads `StageFx`.

export type Side = "player" | "foe";
export type Verdict = "AC" | "WA" | "TLE" | "RE" | "CE";
export type Pose = "idle" | "attack" | "hurt" | "faint" | "evolve";
export type EffectKind = "slash" | "burst" | "bolt";

export interface DamageNumber { id: number; side: Side; text: string; age: number; crit: boolean }
export interface Stinger { verdict: Verdict; age: number }
/** A sprite move effect playing over `side` (frames live in game/battle/effects.ts). */
export interface MoveEffect { id: number; kind: EffectKind; side: Side; age: number }
export interface Message { text: string; age: number }

export interface StageFx {
  time: number; // animation clock (ms); frozen during hit-stop
  intro: number; // 0..1 slide-in progress
  shake: number; // current amplitude in logical px
  hitstop: number; // ms remaining
  pose: Record<Side, { name: Pose; age: number }>;
  hp: Record<Side, { shown: number; target: number; max: number }>;
  numbers: DamageNumber[];
  stinger: Stinger | null;
  effects: MoveEffect[];
  /** battle-wipe progress 0..1 (black bars opening) */
  wipe: number;
  message: Message | null;
  queue: string[];
  nextId: number;
}

export const INTRO_MS = 900;
export const HITSTOP_MS = 60;
export const NUMBER_MS = 900;
export const STINGER_MS = 1400;
export const WIPE_MS = 650;
export const EFFECT_FRAME_MS = 70;
export const EFFECT_FRAMES = 5;
export const EFFECT_MS = EFFECT_FRAME_MS * EFFECT_FRAMES;
export const CHAR_MS = 28; // typewriter speed (about 36 characters per second)
export const LINGER_MS = 750; // how long a fully typed message stays before the next one
const HP_RATE = 0.06; // hp points per ms the bar drains at (scaled by max)
const POSE_MS: Record<Pose, number> = { idle: Infinity, attack: 360, hurt: 220, faint: Infinity, evolve: 1100 };

export function createFx(playerMax = 5, foeMax = 100): StageFx {
  return {
    time: 0, intro: 0, shake: 0, hitstop: 0,
    pose: { player: { name: "idle", age: 0 }, foe: { name: "idle", age: 0 } },
    hp: {
      player: { shown: playerMax, target: playerMax, max: playerMax },
      foe: { shown: foeMax, target: foeMax, max: foeMax },
    },
    numbers: [], stinger: null, effects: [], wipe: 0, message: null, queue: [], nextId: 1,
  };
}

/** Screen-shake amplitude for a hit, as a share of foe max HP. */
export function shakeFor(damage: number, max: number): number {
  const share = Math.max(0, Math.min(1, damage / Math.max(1, max)));
  return 1 + Math.round(share * 5);
}

export function setPose(fx: StageFx, side: Side, name: Pose): void {
  fx.pose[side] = { name, age: 0 };
}

/** The player's code landed `damage` on the foe. */
export function hitFoe(fx: StageFx, damage: number, crit = false, kind: EffectKind = crit ? "burst" : "slash"): void {
  const h = fx.hp.foe;
  h.target = Math.max(0, h.target - damage);
  setPose(fx, "player", "attack");
  setPose(fx, "foe", h.target <= 0 ? "faint" : "hurt");
  fx.hitstop = HITSTOP_MS;
  fx.shake = Math.max(fx.shake, shakeFor(damage, h.max));
  fx.numbers.push({ id: fx.nextId++, side: "foe", text: String(damage), age: 0, crit });
  addEffect(fx, kind, "foe");
}

export function addEffect(fx: StageFx, kind: EffectKind, side: Side): void {
  fx.effects.push({ id: fx.nextId++, kind, side, age: 0 });
}

/** Play the faint animation (the sprite sinks and fades, then stays down). */
export function faint(fx: StageFx, side: Side): void {
  setPose(fx, side, "faint");
}

/** Play the evolve animation (white silhouette morph), then return to idle. */
export function evolve(fx: StageFx, side: Side): void {
  setPose(fx, side, "evolve");
}

/** Queue a line for the typewriter text box. */
export function say(fx: StageFx, text: string): void {
  if (fx.message === null) fx.message = { text, age: 0 };
  else fx.queue.push(text);
}

/** What the text box shows right now: the typed prefix and whether typing has finished. */
export function messageView(fx: StageFx): { text: string; done: boolean } | null {
  const m = fx.message;
  if (!m) return null;
  const n = Math.min(m.text.length, Math.floor(m.age / CHAR_MS));
  return { text: m.text.slice(0, n), done: n >= m.text.length };
}

/** Skip the typewriter to the end of the current line; a second call moves to the next line. */
export function advanceMessage(fx: StageFx): void {
  const m = fx.message;
  if (!m) return;
  if (m.age < m.text.length * CHAR_MS) m.age = m.text.length * CHAR_MS;
  else nextMessage(fx);
}

function nextMessage(fx: StageFx): void {
  const t = fx.queue.shift();
  fx.message = t === undefined ? null : { text: t, age: 0 };
}

/** A failing submission: the foe counterattacks and the player loses hearts. */
export function hitPlayer(fx: StageFx, hearts = 1): void {
  const h = fx.hp.player;
  h.target = Math.max(0, h.target - hearts);
  setPose(fx, "foe", "attack");
  setPose(fx, "player", h.target <= 0 ? "faint" : "hurt");
  fx.hitstop = HITSTOP_MS;
  fx.shake = Math.max(fx.shake, 3);
  addEffect(fx, "bolt", "player");
  fx.numbers.push({ id: fx.nextId++, side: "player", text: `-${hearts}`, age: 0, crit: false });
}

export function showVerdict(fx: StageFx, verdict: Verdict): void {
  fx.stinger = { verdict, age: 0 };
}

/** Advance by `dt` ms. Hit-stop freezes the animation clock but not the stinger-free timers. */
export function tick(fx: StageFx, dt: number): void {
  if (!(dt > 0)) return; // ignore zero, negative or NaN frame gaps
  if (fx.hitstop > 0) {
    fx.hitstop = Math.max(0, fx.hitstop - dt);
    return;
  }
  fx.time += dt;
  fx.intro = Math.min(1, fx.intro + dt / INTRO_MS);
  fx.wipe = Math.min(1, fx.wipe + dt / WIPE_MS);
  for (const e of fx.effects) e.age += dt;
  fx.effects = fx.effects.filter((e) => e.age < EFFECT_MS);
  if (fx.message) {
    fx.message.age += dt;
    if (fx.message.age >= fx.message.text.length * CHAR_MS + LINGER_MS) nextMessage(fx);
  }
  fx.shake = Math.max(0, fx.shake - dt * 0.012);
  for (const side of ["player", "foe"] as const) {
    const p = fx.pose[side];
    p.age += dt;
    if (p.age >= POSE_MS[p.name]) fx.pose[side] = { name: "idle", age: 0 };
    const h = fx.hp[side];
    if (h.shown > h.target) h.shown = Math.max(h.target, h.shown - dt * HP_RATE * (h.max / 100 + 0.05));
    else if (h.shown < h.target) h.shown = Math.min(h.target, h.shown + dt * HP_RATE);
  }
  for (const n of fx.numbers) n.age += dt;
  fx.numbers = fx.numbers.filter((n) => n.age < NUMBER_MS);
  if (fx.stinger) {
    fx.stinger.age += dt;
    if (fx.stinger.age >= STINGER_MS) fx.stinger = null;
  }
}

/** Ease-out slide offset: 1 = fully off-screen, 0 = in place. */
export function slideOffset(intro: number, delay = 0): number {
  const t = Math.max(0, Math.min(1, (intro - delay) / (1 - delay)));
  return Math.pow(1 - t, 3);
}

/** Deterministic shake offset for the current clock. */
export function shakeOffset(fx: StageFx): { x: number; y: number } {
  if (fx.shake <= 0) return { x: 0, y: 0 };
  const t = fx.time / 16;
  return { x: Math.round(Math.sin(t * 2.7) * fx.shake), y: Math.round(Math.cos(t * 3.1) * fx.shake * 0.6) };
}
