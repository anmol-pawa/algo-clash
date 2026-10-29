"use client";

import { useState } from "react";
import { compileCpp, runWasm } from "@/lib/judge/client";
import { judgeProblem } from "@/lib/judge/judge";
import type { DriverSpec } from "@/lib/judge/harness/driver";

const SAMPLE = `#include <bits/stdc++.h>
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

int depth(int n) { volatile int pad[8]; pad[0] = n; return n == 0 ? 0 : 1 + depth(n - 1) + pad[0] * 0; }

int main(int argc, char** argv) {
    int n; cin >> n;
    vector<int> v(n);
    for (auto& x : v) cin >> x;
    int target; cin >> target;
    Solution s;
    auto r = s.twoSum(v, target);
    priority_queue<int> pq(v.begin(), v.end());
    map<string, int> m; m["top"] = pq.top();
    cout << r[0] << " " << r[1] << " top=" << m["top"] << "\\n";
    if (argc > 1) cout << "depth " << depth(atoi(argv[1])) << "\\n";
}
`;

const TWO_SUM_SPEC: DriverSpec = { kind: "function", name: "twoSum", returns: "vector<int>", params: [{ type: "vector<int>&", name: "nums" }, { type: "int", name: "target" }] };
const TWO_SUM_TESTS = [
  { input: "[2,7,11,15]\n9", expected: "[0,1]" },
  { input: "[3,2,4]\n6", expected: "[1,2]" },
  { input: "[3,3]\n6", expected: "[0,1]" },
];
const TWO_SUM_CODE = `#include <bits/stdc++.h>
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
`;
const WRONG_BODY = "return {0, 1};";

/** Judge playground for the A2 toolchain spike: compile + run C++ in workers and report timings. */
export default function DevJudge() {
  const [src, setSrc] = useState(SAMPLE);
  const [stdin, setStdin] = useState("4\n2 7 11 15\n9\n");
  const [arg, setArg] = useState("");
  const [flag, setFlag] = useState("-O2");
  const [log, setLog] = useState("");
  const [busy, setBusy] = useState(false);

  async function go() {
    setBusy(true);
    setLog("compiling… (first compile downloads ~105 MB of toolchain)");
    const c = await compileCpp(src, [flag]);
    let text = `compile ${c.ok ? "OK" : "FAILED"}  ${JSON.stringify(c.timings)}  wasm=${c.wasm?.length ?? 0} bytes\n${c.diagnostics}\n`;
    if (c.ok && c.wasm) {
      const r = await runWasm(c.wasm, stdin, 5000, arg ? [arg] : []);
      text += `run ${r.status} exit=${r.exitCode} wall=${r.wallMs}ms pages=${r.memPages} ${r.detail}\n--- stdout ---\n${r.stdout}\n--- stderr ---\n${r.stderr}`;
    }
    setLog(text);
    setBusy(false);
  }

  async function judge(code: string) {
    setBusy(true);
    setLog("judging…");
    const r = await judgeProblem({ spec: TWO_SUM_SPEC, code, tests: TWO_SUM_TESTS, timeLimitMs: 2000 });
    setLog(`verdict ${r.verdict} failedAt=${r.failedAt} maxMs=${Math.round(r.maxMs)}\n${r.diagnostics ?? ""}${r.firstError ? `\nfirst error line ${r.firstError.line}: ${r.firstError.entry?.title ?? r.firstError.message}` : ""}\n${JSON.stringify(r.outcomes)}`);
    setBusy(false);
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col gap-3 px-4 py-6">
      <h1 className="font-display text-2xl text-[var(--gold)]">Judge playground</h1>
      <textarea aria-label="source" className="panel h-64 w-full p-2 font-mono text-xs" value={src} onChange={(e) => setSrc(e.target.value)} />
      <textarea aria-label="stdin" className="panel h-16 w-full p-2 font-mono text-xs" value={stdin} onChange={(e) => setStdin(e.target.value)} />
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <label>
          flags{" "}
          <select aria-label="flags" className="panel p-1" value={flag} onChange={(e) => setFlag(e.target.value)}>
            <option>-O0</option>
            <option>-O1</option>
            <option>-O2</option>
          </select>
        </label>
        <label>
          arg <input aria-label="arg" className="panel w-28 p-1" value={arg} onChange={(e) => setArg(e.target.value)} />
        </label>
        <button id="go" className="px-btn px-5" disabled={busy} onClick={go}>
          {busy ? "Running…" : "Compile & run"}
        </button>
        <button id="judge-ac" className="px-btn px-5" disabled={busy} onClick={() => judge(TWO_SUM_CODE)}>
          Judge two-sum
        </button>
        <button id="judge-wa" className="px-btn px-5" disabled={busy} onClick={() => judge(TWO_SUM_CODE.replace("return {it->second, i};", WRONG_BODY))}>
          Judge wrong
        </button>
        <button id="judge-ce" className="px-btn px-5" disabled={busy} onClick={() => judge(TWO_SUM_CODE.replace("return {};", "return {}"))}>
          Judge CE
        </button>
      </div>
      <pre id="log" className="panel min-h-24 overflow-x-auto whitespace-pre-wrap p-2 text-xs">{log}</pre>
    </main>
  );
}
