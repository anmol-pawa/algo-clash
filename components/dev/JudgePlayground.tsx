"use client";

import { useCallback, useRef, useState } from "react";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const JUDGE = `${BASE}/judge`;

const SAMPLE = `#include <algorithm>
#include <iostream>
#include <map>
#include <string>
#include <unordered_map>
#include <vector>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> seen;
        for (int i = 0; i < (int)nums.size(); ++i) {
            auto it = seen.find(target - nums[i]);
            if (it != seen.end()) return {it->second, i};
            seen[nums[i]] = i;
        }
        return {};
    }
};

int main() {
    vector<int> a{2, 7, 11, 15};
    auto r = Solution().twoSum(a, 9);
    map<string, int> m{{"x", 1}};
    cout << r[0] << "," << r[1] << " " << m["x"] << "\\n";
}
`;

interface CompileReply {
  id: number;
  ok: boolean;
  wasm?: Uint8Array;
  diagnostics: string;
  ms: number;
}
interface RunReply {
  stdout: string;
  stderr: string;
  status: string;
  ms: number;
}

/** Dev page for the A2 spike: compile C++ in a worker and run it in a fresh, killable worker. */
export default function JudgePlayground() {
  const [source, setSource] = useState(SAMPLE);
  const [optLevel, setOptLevel] = useState("-O2");
  const [log, setLog] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const compiler = useRef<Worker | null>(null);
  const nextId = useRef(1);

  const say = useCallback((line: string) => setLog((l) => [...l, line]), []);

  const getCompiler = useCallback(async () => {
    if (compiler.current) return compiler.current;
    const t0 = performance.now();
    const w = new Worker(`${JUDGE}/compile-worker.mjs`, { type: "module" });
    await new Promise<void>((resolve, reject) => {
      w.onmessage = (e) => e.data.ready && resolve();
      w.onerror = (e) => reject(new Error(e.message || "compile worker failed to load"));
    });
    say(`toolchain loaded in ${Math.round(performance.now() - t0)} ms`);
    compiler.current = w;
    return w;
  }, [say]);

  const go = useCallback(async () => {
    setBusy(true);
    setLog([]);
    try {
      const w = await getCompiler();
      const id = nextId.current++;
      const reply = await new Promise<CompileReply>((resolve) => {
        w.onmessage = (e) => e.data.id === id && resolve(e.data);
        w.postMessage({ id, source, flags: [optLevel] });
      });
      say(`compile ${reply.ok ? "ok" : "FAILED"} in ${reply.ms} ms${reply.wasm ? `, ${reply.wasm.length} bytes` : ""}`);
      if (reply.diagnostics) say(reply.diagnostics);
      if (!reply.ok || !reply.wasm) return;
      const runner = new Worker(`${JUDGE}/run-worker.mjs`, { type: "module" });
      const out = await new Promise<RunReply | "timeout">((resolve) => {
        const timer = setTimeout(() => {
          runner.terminate();
          resolve("timeout");
        }, 5000);
        runner.onmessage = (e) => {
          clearTimeout(timer);
          runner.terminate();
          resolve(e.data);
        };
        runner.postMessage({ wasm: reply.wasm, stdin: "" });
      });
      if (out === "timeout") say("run: TLE (5000 ms)");
      else say(`run: ${out.status} in ${out.ms} ms\nstdout: ${out.stdout}${out.stderr ? `\nstderr: ${out.stderr}` : ""}`);
    } catch (err) {
      say(`error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setBusy(false);
    }
  }, [getCompiler, optLevel, say, source]);

  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col gap-3 px-4 py-6">
      <h1 className="font-display text-xl text-[var(--gold)]">Judge playground</h1>
      <p className="text-xs text-white/60">
        Compiles C++20 with clang→WASM in a worker (first load downloads about 27 MB compressed, then it is cached).
      </p>
      <textarea
        aria-label="C++ source"
        className="panel h-72 w-full resize-y p-2 font-mono text-xs"
        spellCheck={false}
        value={source}
        onChange={(e) => setSource(e.target.value)}
      />
      <div className="flex items-center gap-3">
        <select aria-label="Optimisation" className="panel px-2 py-2 text-sm" value={optLevel} onChange={(e) => setOptLevel(e.target.value)}>
          <option>-O0</option>
          <option>-O1</option>
          <option>-O2</option>
        </select>
        <button className="px-btn px-5 text-sm" disabled={busy} onClick={go}>
          {busy ? "Working…" : "Compile & run"}
        </button>
      </div>
      <pre data-testid="judge-log" className="panel min-h-24 overflow-x-auto whitespace-pre-wrap break-words p-2 text-xs">
        {log.join("\n")}
      </pre>
    </main>
  );
}
