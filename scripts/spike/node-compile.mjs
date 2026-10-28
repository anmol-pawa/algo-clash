// A2 spike: compile an STL-heavy program with @yowasp/clang in Node and run it under WASI.
import { commands } from "@yowasp/clang";
import { WASI } from "node:wasi";
import { performance } from "node:perf_hooks";

const src = `
#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
  vector<int> twoSum(const vector<int>& nums, int target) {
    unordered_map<int,int> seen;
    for (int i = 0; i < (int)nums.size(); ++i) {
      auto it = seen.find(target - nums[i]);
      if (it != seen.end()) return {it->second, i};
      seen[nums[i]] = i;
    }
    return {};
  }
  int deep(volatile int n) { volatile int pad[4] = {n,n,n,n}; return n == 0 ? 0 : 1 + deep(n - 1) + pad[0] * 0; }
};
int main() {
  Solution s; auto r = s.twoSum({2,7,11,15}, 9);
  map<string,priority_queue<int>> m; m["a"].push(3); m["a"].push(9);
  set<pair<int,int>> st{{1,2},{0,5}};
  string out = to_string(r[0]) + "," + to_string(r[1]) + " top=" + to_string(m["a"].top()) + " first=" + to_string(st.begin()->first);
  cout << out << "\\n";
  cout << "depth " << s.deep(1000000) << "\\n";
}
`;
const shim = `#pragma once
#include <algorithm>
#include <array>
#include <bitset>
#include <cassert>
#include <climits>
#include <cmath>
#include <cstdint>
#include <cstdio>
#include <cstdlib>
#include <cstring>
#include <deque>
#include <functional>
#include <iostream>
#include <iterator>
#include <limits>
#include <list>
#include <map>
#include <memory>
#include <numeric>
#include <optional>
#include <queue>
#include <set>
#include <sstream>
#include <stack>
#include <string>
#include <tuple>
#include <unordered_map>
#include <unordered_set>
#include <utility>
#include <vector>
`;
const [opt = "-O2", stack = "16777216", exc = "-fno-exceptions"] = process.argv.slice(2);
for (let round = 0; round < 1; round++) {
  const t0 = performance.now();
  let stderr = "";
  const files = await commands["clang++"](
    ["--target=wasm32-wasip1", "-std=c++20", opt, exc, "-isystem", "shim", `-Wl,-z,stack-size=${stack}`, "main.cc", "-o", "a.wasm"],
    { "main.cc": src, shim: { "bits": { "stdc++.h": shim } } },
    { stderr: (b) => { if (b) stderr += new TextDecoder().decode(b); } },
  ).catch((e) => { console.log("compile failed", e.code, stderr.slice(0, 2000)); process.exit(1); });
  const t1 = performance.now();
  const wasm = files["a.wasm"];
  const wasi = new WASI({ version: "preview1", returnOnExit: true });
  const mod = await WebAssembly.compile(wasm);
  const inst = await WebAssembly.instantiate(mod, { wasi_snapshot_preview1: wasi.wasiImport });
  const t2 = performance.now();
  const code = wasi.start(inst);
  const t3 = performance.now();
  console.log(`round ${round}: compile ${(t1 - t0).toFixed(0)} ms, wasm ${wasm.length} B, instantiate ${(t2 - t1).toFixed(0)} ms, run ${(t3 - t2).toFixed(0)} ms, exit ${code}, rss ${(process.memoryUsage().rss / 1e6).toFixed(0)} MB`);
  if (stderr) console.log("stderr:", stderr.slice(0, 500));
}
