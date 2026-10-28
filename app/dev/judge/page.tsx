"use client";

import { useRef, useState } from "react";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const SAMPLE = `#include <vector>
#include <unordered_map>
#include <map>
#include <queue>
#include <string>
#include <algorithm>
#include <iostream>
using namespace std;

class Solution {
public:
  vector<int> twoSum(const vector<int>& nums, int target) {
    unordered_map<int, int> seen;
    for (int i = 0; i < static_cast<int>(nums.size()); ++i) {
      auto it = seen.find(target - nums[i]);
      if (it != seen.end()) return {it->second, i};
      seen[nums[i]] = i;
    }
    return {};
  }
  long long shortest(int n, const vector<vector<pair<int, int>>>& g) {
    priority_queue<pair<long long, int>, vector<pair<long long, int>>, greater<>> pq;
    vector<long long> d(n, LLONG_MAX);
    d[0] = 0;
    pq.push({0, 0});
    while (!pq.empty()) {
      auto [c, u] = pq.top();
      pq.pop();
      if (c > d[u]) continue;
      for (const auto& [v, w] : g[u])
        if (c + w < d[v]) { d[v] = c + w; pq.push({d[v], v}); }
    }
    return d[n - 1];
  }
};

int depth(int n) {
  if (n == 0) return 0;
  volatile int guard = n;  // stops the optimiser turning the recursion into a loop
  return 1 + depth(n - 1) + (guard & 0);
}

int main() {
  Solution s;
  auto r = s.twoSum({2, 7, 11, 15}, 9);
  cout << r[0] << "," << r[1] << "\\n";
  int n = 1000;
  vector<vector<pair<int, int>>> g(n);
  for (int i = 0; i + 1 < n; ++i) g[i].push_back({i + 1, 3});
  cout << s.shortest(n, g) << "\\n";
  cout << "depth " << depth(DEPTH) << "\\n";
}
`;

type Result = Record<string, unknown>;

/** A2 spike page: compile + run a STL-heavy program in a worker and report timings. */
export default function JudgeSpike() {
  const worker = useRef<Worker | null>(null);
  const [log, setLog] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const push = (s: string) => setLog((l) => [...l, s]);

  async function run(opt: string, depth: number) {
    setBusy(true);
    worker.current ??= new Worker(`${BASE}/judge/spike-worker.js`, { type: "module" });
    const w = worker.current;
    const id = crypto.randomUUID();
    const flags = ["-std=c++20", opt, "-fno-exceptions", "-Wl,-z,stack-size=67108864"];
    const result = await new Promise<Result>((resolve) => {
      w.onmessage = (e: MessageEvent<Result>) => {
        if (e.data.type === "result" && e.data.id === id) resolve(e.data);
      };
      w.postMessage({ id, source: SAMPLE.replace("DEPTH", String(depth)), flags });
    });
    push(`${opt} depth=${depth}: ${JSON.stringify(result)}`);
    setBusy(false);
  }

  return (
    <main className="mx-auto max-w-3xl p-4 text-sm">
      <h1 className="font-display text-2xl text-[var(--gold)]">/dev/judge — C++ runtime spike</h1>
      <div className="my-3 flex flex-wrap gap-2">
        {[["-O1", 1000], ["-O2", 1000], ["-O1", 5000], ["-O1", 10000], ["-O1", 20000], ["-O1", 200000]].map(([o, d]) => (
          <button key={`${o}${d}`} id={`run${o}${d}`.replace(/[^A-Za-z0-9]/g, "")} disabled={busy} className="px-btn px-4" onClick={() => run(o as string, d as number)}>
            {o} depth {d}
          </button>
        ))}
      </div>
      <pre id="log" className="whitespace-pre-wrap break-all text-xs text-white/80">{log.join("\n")}</pre>
    </main>
  );
}
