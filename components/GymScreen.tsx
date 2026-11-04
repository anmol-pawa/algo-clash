"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import BattleArena, { type ArenaProblem, type ArenaResult } from "@/components/BattleArena";
import { GymScene } from "@/components/GymScene";
import { gymKits, type GymKit } from "@/content/gyms/kits";
import { syntaxShoresGym as gym } from "@/content/gyms/r0";
import { buildWarden } from "@/game/sprites/warden";
import { FOE_MAX_HP } from "@/lib/battle/damage";
import { answerBlitz, battleResult, blitzCorrect, coreFoeHp, shuffledOptions, startGym, SHIELD_START } from "@/lib/gym/machine";
import { EvolutionScene } from "@/components/EvolutionScene";
import { applyGymWin, blitzSecondsLeft, hasBadge } from "@/lib/gym/progress";
import type { GymState } from "@/lib/gym/types";
import type { TestCase } from "@/lib/judge/verdict";
import { IdbBackend } from "@/lib/save/idb";
import { SaveService } from "@/lib/save/service";

const WERROR_FLAGS = ["-O2", "-Wall", "-Wextra", "-Werror"];
const nowMs = (): number => Date.now();
type Screen = "intro" | "play" | "retry" | "end";

function Shield({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`Foe shield ${value}`} data-testid="shield">
      <span className="mr-1 text-xs text-white/60">Shield</span>
      {Array.from({ length: 6 }, (_, i) => (
        <span key={i} className={`h-3 w-3 border border-white/40 ${i < value ? "bg-sky-400" : "bg-transparent"}`} />
      ))}
    </div>
  );
}

function Blitz({ state, onAnswer }: { state: GymState; onAnswer: (choice: string | null, seconds: number) => void }) {
  const item = gym.blitz[state.blitzIndex];
  const options = useMemo(() => shuffledOptions(item, 1), [item]);
  const [startedAt] = useState(nowMs); // the parent remounts this component per item
  const [left, setLeft] = useState(gym.blitzSeconds);
  const [picked, setPicked] = useState<{ choice: string | null; seconds: number } | null>(null);
  useEffect(() => {
    if (picked) return;
    const t = setInterval(() => {
      const l = blitzSecondsLeft(startedAt, nowMs(), gym.blitzSeconds);
      setLeft(l);
      if (l <= 0) setPicked({ choice: null, seconds: gym.blitzSeconds + 1 });
    }, 200);
    return () => clearInterval(t);
  }, [picked, startedAt]);
  const choose = (choice: string) => !picked && setPicked({ choice, seconds: (nowMs() - startedAt) / 1000 });
  const verdict = picked && (picked.choice === item.answer && picked.seconds <= gym.blitzSeconds ? "right" : picked.choice === null ? "timeout" : "wrong");
  return (
    <div className="flex flex-col gap-3" data-testid="blitz">
      <div className="flex items-center justify-between gap-2 text-sm">
        <span>Recognition blitz {state.blitzIndex + 1}/{gym.blitz.length}{item.review ? " · review" : ""}</span>
        <Shield value={state.shield} />
      </div>
      <div className="h-2 w-full border border-white/30" role="progressbar" aria-valuemin={0} aria-valuemax={gym.blitzSeconds} aria-valuenow={left}>
        <div className={`h-full ${left <= 5 ? "bg-red-500" : "bg-emerald-400"}`} style={{ width: `${(left / gym.blitzSeconds) * 100}%`, transition: "width .2s linear" }} />
      </div>
      <p className="panel p-3 text-base">{item.statement}</p>
      <p className="text-xs text-white/60">Which tool or pattern do you reach for? ({left}s)</p>
      <div className="grid gap-2" role="group" aria-label="Options">
        {options.map((o) => {
          const mark = picked && (o === item.answer ? "border-emerald-400 bg-emerald-500/20" : o === picked.choice ? "border-red-400 bg-red-500/20" : "opacity-50");
          return (
            <button key={o} disabled={!!picked} onClick={() => choose(o)} className={`px-btn min-h-11 py-2 text-left text-sm normal-case ${mark ?? ""}`} style={{ fontFamily: "ui-monospace, Menlo, Consolas, monospace" }}>{o}</button>
          );
        })}
      </div>
      {picked && (
        <div className="panel flex flex-col gap-2 p-3" data-testid="blitz-why">
          <p className={verdict === "right" ? "text-emerald-300" : "text-red-300"}>
            {verdict === "right" ? "Broken! The shield cracks." : verdict === "timeout" ? "Too slow: the shield regrows." : "Not that one: the shield regrows."}
          </p>
          <p className="text-sm text-white/80">{item.why}</p>
          <button className="px-btn px-btn-primary min-h-11" onClick={() => onAnswer(picked.choice, picked.seconds)}>
            {state.blitzIndex + 1 >= gym.blitz.length ? "To the lighthouse ▶" : "Next ▶"}
          </button>
        </div>
      )}
    </div>
  );
}

/** The Syntax Shores gym (GDD §5.5): intro, recognition blitz, core battle, signature battle (-Werror twist), badge. */
export default function GymScreen() {
  const warden = useMemo(() => buildWarden(), []);
  const [state, setState] = useState<GymState>(() => startGym(gym));
  const [screen, setScreen] = useState<Screen>("intro");
  const [owned, setOwned] = useState(false);
  const [evolved, setEvolved] = useState(false);
  const [loaded, setLoaded] = useState<{ key: string; problem: ArenaProblem } | null>(null);
  const [loadErr, setLoadErr] = useState("");
  const svc = useRef<SaveService | null>(null);

  useEffect(() => {
    svc.current = new SaveService(new IdbBackend());
    svc.current.load().then((c) => setOwned(hasBadge(c, gym))).catch(() => {});
  }, []);

  const battlePhase = state.phase === "core" || state.phase === "signature";
  const kit: GymKit | undefined = battlePhase ? gymKits[state.phase === "core" ? gym.coreProblemId : gym.signatureProblemId] : undefined;
  const attempt = state.phase === "core" ? state.coreFaints : state.signatureFaints;

  // Load the hidden tests of the current battle phase.
  useEffect(() => {
    if (!kit || screen !== "play") return;
    let alive = true;
    const id = state.phase === "core" ? gym.coreProblemId : gym.signatureProblemId;
    kit.loadTests().then((tests: TestCase[]) => {
      if (!alive) return;
      setLoaded({ key: `${state.phase}`, problem: { id, title: kit.title, difficulty: kit.difficulty, statement: kit.statement, starter: kit.starter, spec: kit.spec, timeLimitMs: kit.timeLimitMs, tests, foeName: kit.foeName, foeLevel: kit.foeLevel } });
    }).catch((e) => alive && setLoadErr(String(e)));
    return () => { alive = false; };
  }, [kit, screen, state.phase]);

  const win = useCallback(async (s: GymState) => {
    if (!s.reward) return;
    try {
      const sv = svc.current ?? new SaveService(new IdbBackend());
      const core = await sv.load();
      await sv.save(applyGymWin(core, gym));
      setOwned(true);
    } catch { /* the win still shows; saving is retried on the next win */ }
  }, []);

  function onBlitz(choice: string | null, seconds: number) {
    const next = answerBlitz(gym, state, choice, seconds);
    setState(next);
    if (next.phase === "core") setScreen("retry"); // the "phase 2" card
  }

  function onBattle(r: ArenaResult) {
    const next = battleResult(gym, state, r);
    setState(next);
    if (next.phase === "won") { setScreen("end"); void win(next); }
    else if (next.phase === "abandoned") setScreen("end");
    else setScreen("retry");
  }

  const problem = loaded && loaded.key === state.phase ? loaded.problem : null;
  const headStart = FOE_MAX_HP - coreFoeHp(state);
  const shell = "mx-auto flex w-full max-w-3xl flex-col gap-3 p-3";

  if (screen === "play" && battlePhase) {
    return problem ? (
      <BattleArena key={`${state.phase}-${attempt}`} problem={problem}
        scene="gym"
        foeStartHp={state.phase === "core" ? coreFoeHp(state) : undefined}
        compileFlags={state.phase === "signature" ? WERROR_FLAGS : undefined}
        onResult={onBattle} />
    ) : <main className={shell}><p role="status">{loadErr || "Loading the battle…"}</p></main>;
  }

  return (
    <main className={shell}>
      <header className="flex items-center justify-between gap-2">
        <h1 className="font-display text-2xl text-[var(--gold)]">{gym.name}</h1>
        <Link href="/" className="px-btn flex min-h-11 items-center px-3 text-sm">Leave</Link>
      </header>
      <div className={screen === "play" ? "mx-auto w-full max-w-xs" : "w-full"}>
        <GymScene sheet={warden} anim={state.phase === "won" ? "faint" : "idle"} scale={3} />
      </div>

      {screen === "intro" && (
        <section className="panel flex flex-col gap-3 p-4" data-testid="gym-intro">
          <p className="font-display text-lg">{gym.leader.name} <span className="text-sm text-white/60">· {gym.leader.title}</span></p>
          <p>“{gym.leader.lines.intro}”</p>
          <ol className="list-decimal pl-5 text-sm text-white/80">
            <li>Recognition blitz: {gym.blitz.length} problems, {gym.blitzSeconds}s each. Every shield point you break takes {8} HP off Warden Brace in round 2.</li>
            <li>Core battle: <b>{gymKits[gym.coreProblemId].title}</b>.</li>
            <li>Signature battle: <b>{gymKits[gym.signatureProblemId].title}</b>. Twist, <b>{gym.twist.title}</b>: {gym.twist.rule}</li>
          </ol>
          {owned && <p className="text-sm text-emerald-300">You already hold the {gym.badge.name}. A rematch pays no second shard.</p>}
          <button className="px-btn px-btn-primary min-h-11" onClick={() => setScreen("play")}>Challenge the Warden ▶</button>
        </section>
      )}

      {screen === "play" && state.phase === "blitz" && <Blitz key={state.blitzIndex} state={state} onAnswer={onBlitz} />}

      {screen === "retry" && battlePhase && (
        <section className="panel flex flex-col gap-3 p-4" data-testid="gym-interstitial">
          {attempt > 0 ? (
            <>
              <p>“{gym.leader.lines.lose}”</p>
              <p className="text-sm text-white/70">Fainted {attempt}×. Your blitz result is kept. Try the {state.phase} battle again.</p>
            </>
          ) : state.phase === "core" ? (
            <>
              <p className="font-display text-lg">Blitz cleared: {blitzCorrect(state)}/{gym.blitz.length} on time</p>
              <p className="text-sm text-white/80">Shield {state.shield}/{SHIELD_START} start. {headStart > 0 ? `You bit ${headStart} HP off the Warden before round 2.` : "No head start this time."}</p>
            </>
          ) : (
            <>
              <p className="font-display text-lg">Core round won!</p>
              <p className="text-sm text-white/80">Signature round. <b>{gym.twist.title}</b>: {gym.twist.rule}</p>
            </>
          )}
          <p className="text-sm">Next: <b>{kit?.title}</b> ({state.phase} battle)</p>
          <button className="px-btn px-btn-primary min-h-11" onClick={() => setScreen("play")}>{attempt > 0 ? "Retry ▶" : "Begin ▶"}</button>
        </section>
      )}

      {screen === "end" && (
        <section className="panel flex flex-col gap-3 p-4" data-testid="gym-end">
          {state.phase === "won" ? (
            <>
              <p className="font-display text-xl text-[var(--gold)]">★ {gym.badge.name} earned!</p>
              <p>“{gym.leader.lines.win}”</p>
              <p className="text-sm text-white/80">Reward: {gym.badge.name} and {state.reward?.shards ?? 0} Compiler Shard. Saved to your profile.</p>
              <div className="mx-auto w-full max-w-sm" data-testid="gym-evolution">
                <EvolutionScene scale={4} onDone={() => setEvolved(true)} />
                <p className="mt-2 min-h-6 text-center text-sm" role="status">
                  {evolved ? <>Your Arrayling evolved into <b className="text-[var(--gold)]">Vectorling</b>! It grows with capacity to spare.</> : "What? Your Arrayling is changing…"}
                </p>
              </div>
            </>
          ) : (
            <p>You retreated from the lighthouse. The badge waits; the blitz starts fresh next time.</p>
          )}
          <div className="flex gap-2">
            <button className="px-btn min-h-11 flex-1" onClick={() => { setState(startGym(gym)); setScreen("intro"); }}>Rematch</button>
            <Link href="/" className="px-btn px-btn-primary flex min-h-11 flex-1 items-center justify-center">Done</Link>
          </div>
        </section>
      )}
    </main>
  );
}
