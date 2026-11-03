"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { DialogueState, awaitingChoice, currentNode, visibleText } from "@/lib/dialogue/script";
import { IOTA, TRAINER, VILLAGER, CharacterLook, buildPortrait } from "@/game/sprites/character";
import { sheetToCanvases } from "@/game/sprites/canvasFrames";

const LOOKS: Record<string, CharacterLook> = { iota: IOTA, trainer: TRAINER, villager: VILLAGER };
const CPS = 45;
export const DIALOGUE_CONFIRM = "algo-dialogue-confirm";

/** Animated 48x48 portrait: idles with blinks, and talks while the typewriter is running. */
function Portrait({ id, talking }: { id: string; talking: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const frames = useMemo(() => (LOOKS[id] ? sheetToCanvases(buildPortrait(LOOKS[id])) : null), [id]);
  useEffect(() => {
    const ctx = ref.current?.getContext("2d");
    if (!ctx || !frames) return;
    ctx.imageSmoothingEnabled = false;
    const anim = frames[talking ? "talk" : "idle"];
    let i = 0;
    const paint = () => {
      ctx.clearRect(0, 0, 48, 48);
      ctx.drawImage(anim[i % anim.length], 0, 0);
      i++;
    };
    paint();
    const t = setInterval(paint, talking ? 140 : 600);
    return () => clearInterval(t);
  }, [frames, talking]);
  if (!frames) return null;
  return (
    <canvas ref={ref} width={48} height={48} aria-hidden
      className="h-16 w-16 shrink-0 rounded border-2 border-[#2a2540] bg-[#14101c]" style={{ imageRendering: "pixelated" }} />
  );
}

/**
 * Handheld-style dialogue window: portrait, name tag, typewriter text and choices.
 * First tap/Enter completes the current page; the next one advances.
 */
export function DialogueBox({ talk, onAdvance, onChoose }: {
  talk: DialogueState;
  onAdvance: () => void;
  onChoose: (i: number) => void;
}) {
  const node = currentNode(talk);
  const text = node.pages[talk.page];
  const key = `${talk.nodeId}:${talk.page}`;
  const [elapsed, setElapsed] = useState(0);
  const [lastKey, setLastKey] = useState(key);
  if (lastKey !== key) { setLastKey(key); setElapsed(0); }
  const total = [...text].length;
  const typing = elapsed < (total / CPS) * 1000;
  useEffect(() => {
    if (!typing) return;
    const start = performance.now() - elapsed;
    const t = setInterval(() => setElapsed(performance.now() - start), 33);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, typing]);

  const tap = () => {
    if (typing) setElapsed(Number.MAX_SAFE_INTEGER);
    else onAdvance();
  };
  // Keyboard / A-button confirm arrives as a window event so it shares the tap logic (skip typing, then advance).
  const tapRef = useRef(tap);
  useEffect(() => { tapRef.current = tap; });
  useEffect(() => {
    const h = () => tapRef.current();
    window.addEventListener(DIALOGUE_CONFIRM, h);
    return () => window.removeEventListener(DIALOGUE_CONFIRM, h);
  }, []);
  return (
    <div role="dialog" aria-label={node.speaker ?? "Narration"} data-typing={typing} onPointerDown={tap}
      className="panel absolute inset-x-2 bottom-2 flex bg-[#0e0b18] min-h-24 cursor-pointer gap-3 px-3 py-2 text-sm">
      {node.portrait && <Portrait id={node.portrait} talking={typing} />}
      <div className="min-w-0 flex-1">
        {node.speaker && <p className="font-display text-[var(--gold)]">{node.speaker}</p>}
        <p aria-label={text}>{visibleText(text, elapsed, CPS)}</p>
        {!typing && awaitingChoice(talk) ? (
          <div className="mt-2 flex flex-wrap gap-2">
            {node.choices!.map((c, i) => (
              <button key={c.text} className="px-btn min-h-11 px-3 text-sm"
                onPointerDown={(e) => { e.stopPropagation(); onChoose(i); }}>
                {c.text}
              </button>
            ))}
          </div>
        ) : !typing ? (
          <p className="mt-1 text-right text-xs text-white/40">tap ▶</p>
        ) : null}
      </div>
    </div>
  );
}
