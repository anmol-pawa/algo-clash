"use client";

import { useState } from "react";
import { compileCpp, runWasmInWorker } from "@/lib/judge/client";

const SAMPLE = `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
  vector<int> twoSum(const vector<int>& nums, int target) {
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
  int n, target;
  cin >> n >> target;
  vector<int> a(n);
  for (auto& x : a) cin >> x;
  auto r = Solution().twoSum(a, target);
  map<string, priority_queue<int>> m;
  m["k"].push(3); m["k"].push(9);
  cout << r[0] << " " << r[1] << " top=" << m["k"].top() << "\\n";
}
`;

export default function JudgeSpike() {
  const [src, setSrc] = useState(SAMPLE);
  const [stdin, setStdin] = useState("4 9\n2 7 11 15\n");
  const [log, setLog] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const add = (s: string) => setLog((l) => [...l, s]);

  async function go() {
    setBusy(true);
    setLog([]);
    try {
      const c = await compileCpp(src, (d, t) => add(`download ${Math.round((d / t) * 100)}%`));
      add(`compile ${c.ok ? "ok" : "FAILED"} in ${c.ms.toFixed(0)} ms${c.wasm ? `, ${c.wasm.length} B` : ""}`);
      if (c.stderr) add(c.stderr);
      if (c.ok && c.wasm) {
        const r = await runWasmInWorker(c.wasm, stdin, 5000);
        if (r.verdict === "TLE") add(`TLE after ${r.ms.toFixed(0)} ms`);
        else add(`run exit=${r.exitCode} ${r.ms.toFixed(1)} ms${r.trap ? ` trap=${r.trap}` : ""}\nstdout: ${r.stdout}${r.stderr ? `stderr: ${r.stderr}` : ""}`);
      }
    } catch (e) {
      add(`error: ${String(e)}`);
    }
    setBusy(false);
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-3 p-4">
      <h1 className="font-display text-2xl text-[var(--accent)]">Judge spike (A2)</h1>
      <textarea aria-label="source" className="px-window h-72 w-full p-2 font-mono text-xs" value={src} onChange={(e) => setSrc(e.target.value)} />
      <textarea aria-label="stdin" className="px-window h-16 w-full p-2 font-mono text-xs" value={stdin} onChange={(e) => setStdin(e.target.value)} />
      <button className="px-btn min-h-11 px-5" disabled={busy} onClick={go}>{busy ? "Working…" : "Compile & run"}</button>
      <pre data-testid="log" className="px-window overflow-x-auto whitespace-pre-wrap p-2 text-xs">{log.join("\n")}</pre>
    </main>
  );
}
