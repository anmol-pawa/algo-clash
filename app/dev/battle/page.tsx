"use client";

import { useRef } from "react";
import { BattleStage, type BattleStageHandle } from "@/components/BattleStage";
import { pixelFamily } from "@/app/fonts";
import type { Verdict } from "@/lib/battle/stagefx";

const VERDICTS: Verdict[] = ["AC", "WA", "TLE", "RE", "CE"];

export default function BattleDev() {
  const stage = useRef<BattleStageHandle>(null);
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-3 p-3">
      <h1 className="text-xl font-bold">Battle stage</h1>
      <BattleStage ref={stage} font={`${pixelFamily}, monospace`} />
      <div className="flex flex-wrap gap-2">
        <button className="px-btn px-4" onClick={() => stage.current?.hitFoe(25)}>Hit foe</button>
        <button className="px-btn px-4" onClick={() => stage.current?.hitFoe(60, true)}>Crit</button>
        <button className="px-btn px-4" onClick={() => stage.current?.hitFoe(40, false, "burst")}>Burst</button>
        <button className="px-btn px-4" onClick={() => stage.current?.hitPlayer()}>Foe hits</button>
        <button className="px-btn px-4" onClick={() => stage.current?.say("Wild Bracketeer appeared! Match every opening bracket before it escapes.")}>Say</button>
        <button className="px-btn px-4" onClick={() => stage.current?.advance()}>Next line</button>
        <button className="px-btn px-4" onClick={() => stage.current?.faint("foe")}>Foe faints</button>
        <button className="px-btn px-4" onClick={() => stage.current?.evolve("player")}>Evolve</button>
        {VERDICTS.map((v) => (
          <button key={v} className="px-btn px-4" onClick={() => stage.current?.verdict(v)}>{v}</button>
        ))}
        <button className="px-btn px-4" onClick={() => stage.current?.restart()}>Restart</button>
      </div>
    </main>
  );
}
