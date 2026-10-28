// A2 spike: compile an STL-heavy C++ program with @yowasp/clang under Node and run the WASI output.
import { commands } from "@yowasp/clang";
import { WASI } from "node:wasi";
import { performance } from "node:perf_hooks";
import { writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const [, , optArg = "-O1", variant = "main"] = process.argv;
const programs = {
  main: `#include <vector>
#include <unordered_map>
#include <map>
#include <set>
#include <queue>
#include <string>
#include <algorithm>
#include <iostream>
#include <numeric>
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
  long long dijkstra(int n, const vector<vector<pair<int,int>>>& g) {
    priority_queue<pair<long long,int>, vector<pair<long long,int>>, greater<>> pq;
    vector<long long> d(n, LLONG_MAX); d[0] = 0; pq.push({0,0});
    while (!pq.empty()) { auto [c,u] = pq.top(); pq.pop(); if (c>d[u]) continue;
      for (const auto& [v,w] : g[u]) if (c+w<d[v]) { d[v]=c+w; pq.push({d[v],v}); } }
    return d[n-1];
  }
};
int depth(int n) { return n == 0 ? 0 : 1 + depth(n - 1); }
int main() {
  Solution s; auto r = s.twoSum({2,7,11,15}, 9);
  cout << r[0] << "," << r[1] << "\\n";
  int n = 1000; vector<vector<pair<int,int>>> g(n);
  for (int i = 0; i + 1 < n; ++i) g[i].push_back({i+1, 3});
  cout << s.dijkstra(n, g) << "\\n";
  map<string,int> m; m["a"]=1; set<int> st{3,1,2}; cout << m.size() << st.size() << "\\n";


  cout << "depth " << depth(${variant === "deep" ? 200000 : 1000}) << "\\n";
}
`,
};
programs.deep = programs.main;
const src = programs[variant] ?? programs.main;
const t0 = performance.now();
const files = { "main.cpp": src };
const stderr = [];
const flags = ["-std=c++20", optArg, "-fno-exceptions", "-Wl,-z,stack-size=67108864", "-Wl,--max-memory=1073741824"];
let out;
try {
  out = await commands["clang++"]([...flags, "main.cpp", "-o", "main.wasm"], files, {
    stderr: (b) => b && stderr.push(Buffer.from(b).toString()),
  });
} catch (e) { console.log("compile failed", e.code, stderr.join("").slice(0, 2000)); process.exit(1); }
const t1 = performance.now();
console.log(`compile ${optArg} ${(t1 - t0).toFixed(0)} ms, rss ${(process.memoryUsage().rss / 1e6).toFixed(0)} MB, wasm ${out["main.wasm"].length} bytes`);
if (stderr.length) console.log("stderr:", stderr.join("").slice(0, 800));
const dir = mkdtempSync(join(tmpdir(), "spike-"));
writeFileSync(join(dir, "main.wasm"), out["main.wasm"]);
const wasi = new WASI({ version: "preview1", args: ["main"], returnOnExit: true });
const mod = await WebAssembly.compile(out["main.wasm"]);
const inst = await WebAssembly.instantiate(mod, wasi.getImportObject());
const t2 = performance.now();
const code = wasi.start(inst);
console.log(`run exit=${code} ${(performance.now() - t2).toFixed(0)} ms`);
