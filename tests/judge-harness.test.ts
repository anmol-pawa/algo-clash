import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { encodeInput, generateSource, valueType, type DriverSpec } from "@/lib/judge/harness/driver";

const dir = mkdtempSync(join(tmpdir(), "algo-harness-"));
let counter = 0;

/** Compile with the flags the browser uses where possible (-fno-exceptions), warnings are errors here. */
function build(spec: DriverSpec, code: string, compiler = "g++"): string {
  const base = join(dir, `t${counter++}`);
  writeFileSync(`${base}.cpp`, generateSource(spec, code));
  const r = spawnSync(compiler, ["-std=c++20", "-O1", "-fno-exceptions", "-Wall", "-Wextra", "-Werror", `${base}.cpp`, "-o", base], { encoding: "utf8" });
  if (r.status !== 0) throw new Error(`${compiler} failed:\n${r.stderr}`);
  return base;
}

function run(bin: string, tests: string[][]): { stdout: string; status: number | null } {
  const r = spawnSync(bin, [], { input: encodeInput(tests), encoding: "utf8" });
  return { stdout: r.stdout, status: r.status };
}

const lines = (s: string) => s.trim().split("\n");

describe("valueType", () => {
  it("strips const and references", () => {
    expect(valueType("const vector<int>&")).toBe("vector<int>");
    expect(valueType("string &")).toBe("string");
    expect(valueType("vector<vector<char>>&")).toBe("vector<vector<char>>");
  });
});

describe("function driver", () => {
  it("runs many tests in one process (vector<int>, int)", () => {
    const spec: DriverSpec = {
      kind: "function", name: "twoSum", returns: "vector<int>",
      params: [{ type: "vector<int>&", name: "nums" }, { type: "int", name: "target" }],
    };
    const code = `class Solution { public: vector<int> twoSum(vector<int>& nums, int target) {
      unordered_map<int,int> seen;
      for (int i = 0; i < (int)nums.size(); ++i) { auto it = seen.find(target - nums[i]); if (it != seen.end()) return {it->second, i}; seen[nums[i]] = i; }
      return {}; } };`;
    const bin = build(spec, code);
    const out = run(bin, [["[2,7,11,15]", "9"], ["[3, 2, 4]", "6"], ["[]", "1"]]);
    expect(out.status).toBe(0);
    expect(lines(out.stdout)).toEqual(["[0,1]", "[1,2]", "[]"]);
  });

  it("round-trips strings, bools, chars, doubles and nested vectors", () => {
    const spec: DriverSpec = {
      kind: "function", name: "echo", returns: "vector<vector<string>>",
      params: [{ type: "string", name: "s" }, { type: "bool", name: "b" }, { type: "double", name: "d" }, { type: "vector<vector<char>>&", name: "grid" }, { type: "long long", name: "big" }],
    };
    const code = `class Solution { public: vector<vector<string>> echo(string s, bool b, double d, vector<vector<char>>& g, long long big) {
      vector<vector<string>> r{{s, b ? "yes" : "no", to_string(d > 1.4 && d < 1.6), to_string(big * 2)}};
      for (auto& row : g) { string t; for (char c : row) t += c; r.push_back({t}); }
      return r; } };`;
    const bin = build(spec, code);
    const out = run(bin, [[`"a\\"b\\\\c"`, "true", "1.5", `[["x","y"],[],["z"]]`, "4000000000"]]);
    expect(lines(out.stdout)).toEqual([`[["a\\"b\\\\c","yes","1","8000000000"],["xy"],[""],["z"]]`]);
  });

  it("prints doubles with enough precision for the float checker", () => {
    const spec: DriverSpec = { kind: "function", name: "third", returns: "double", params: [{ type: "int", name: "n" }] };
    const bin = build(spec, `class Solution { public: double third(int n) { return n / 3.0; } };`);
    expect(lines(run(bin, [["1"], ["30"]]).stdout)).toEqual(["0.3333333333", "10"]);
  });

  it("builds and prints linked lists", () => {
    const spec: DriverSpec = { kind: "function", name: "reverseList", returns: "ListNode*", params: [{ type: "ListNode*", name: "head" }] };
    const code = `class Solution { public: ListNode* reverseList(ListNode* head) { ListNode* prev = nullptr; while (head) { ListNode* n = head->next; head->next = prev; prev = head; head = n; } return prev; } };`;
    const bin = build(spec, code);
    expect(lines(run(bin, [["[1,2,3,4]"], ["[]"], ["[7]"]]).stdout)).toEqual(["[4,3,2,1]", "[]", "[7]"]);
  });

  it("builds and prints binary trees in level order with nulls", () => {
    const spec: DriverSpec = { kind: "function", name: "invertTree", returns: "TreeNode*", params: [{ type: "TreeNode*", name: "root" }] };
    const code = `class Solution { public: TreeNode* invertTree(TreeNode* r) { if (!r) return nullptr; swap(r->left, r->right); invertTree(r->left); invertTree(r->right); return r; } };`;
    const bin = build(spec, code);
    const out = run(bin, [["[4,2,7,1,3,6,9]"], ["[1,null,2,3]"], ["[]"], ["[1,2,null,3]"]]);
    expect(lines(out.stdout)).toEqual(["[4,7,2,9,6,3,1]", "[1,2,null,null,3]", "[]", "[1,null,2,null,3]"]);
  });

  it("reads and prints graphs as 1-indexed adjacency lists", () => {
    const spec: DriverSpec = { kind: "function", name: "cloneGraph", returns: "Node*", params: [{ type: "Node*", name: "node" }], graphNode: true };
    const code = `class Solution { public: Node* cloneGraph(Node* node) { if (!node) return nullptr; unordered_map<Node*,Node*> m; queue<Node*> q; m[node] = new Node(node->val); q.push(node);
      while (!q.empty()) { Node* u = q.front(); q.pop(); for (Node* v : u->neighbors) { if (!m.count(v)) { m[v] = new Node(v->val); q.push(v); } m[u]->neighbors.push_back(m[v]); } } return m[node]; } };`;
    const bin = build(spec, code);
    expect(lines(run(bin, [["[[2,4],[1,3],[2,4],[1,3]]"], ["[[]]"], ["[]"]]).stdout)).toEqual(["[[2,4],[1,3],[2,4],[1,3]]", "[[]]", "[]"]);
  });

  it("prints the out-parameter for void in-place functions", () => {
    const spec: DriverSpec = { kind: "function", name: "rotate", returns: "void", params: [{ type: "vector<int>&", name: "nums" }, { type: "int", name: "k" }], outParam: "nums" };
    const code = `class Solution { public: void rotate(vector<int>& nums, int k) { if (nums.empty()) return; k %= (int)nums.size(); std::rotate(nums.begin(), nums.end() - k, nums.end()); } };`;
    const bin = build(spec, code);
    expect(lines(run(bin, [["[1,2,3,4,5]", "2"], ["[]", "3"]]).stdout)).toEqual(["[4,5,1,2,3]", "[]"]);
  });

  it("aborts (non-zero exit) on malformed input instead of misreading it", () => {
    const spec: DriverSpec = { kind: "function", name: "id", returns: "vector<int>", params: [{ type: "vector<int>&", name: "a" }] };
    const bin = build(spec, `class Solution { public: vector<int> id(vector<int>& a) { return a; } };`);
    const r = run(bin, [["[1,2"]]);
    expect(r.status).not.toBe(0);
  });

  it("also compiles under clang++", () => {
    const spec: DriverSpec = { kind: "function", name: "reverseList", returns: "ListNode*", params: [{ type: "ListNode*", name: "head" }] };
    const bin = build(spec, `class Solution { public: ListNode* reverseList(ListNode* head) { return head; } };`, "clang++");
    expect(lines(run(bin, [["[1,2]"]]).stdout)).toEqual(["[1,2]"]);
  });
});

describe("design driver", () => {
  const spec: DriverSpec = {
    kind: "design", className: "MinStack", ctor: [],
    methods: [
      { name: "push", params: [{ type: "int", name: "val" }], returns: "void" },
      { name: "pop", params: [], returns: "void" },
      { name: "top", params: [], returns: "int" },
      { name: "getMin", params: [], returns: "int" },
    ],
  };
  const code = `class MinStack { vector<pair<int,int>> st; public:
    MinStack() {}
    void push(int val) { st.push_back({val, st.empty() ? val : min(val, st.back().second)}); }
    void pop() { st.pop_back(); }
    int top() { return st.back().first; }
    int getMin() { return st.back().second; } };`;

  it("replays the LC operations format", () => {
    const bin = build(spec, code);
    const ops = `["MinStack","push","push","push","getMin","pop","top","getMin"]`;
    const args = `[[],[-2],[0],[-3],[],[],[],[]]`;
    expect(lines(run(bin, [[ops, args]]).stdout)).toEqual(["[null,null,null,null,-3,null,0,-2]"]);
  });

  it("passes constructor arguments and several tests per run", () => {
    const cap: DriverSpec = {
      kind: "design", className: "Cap", ctor: [{ type: "int", name: "limit" }],
      methods: [{ name: "add", params: [{ type: "const string&", name: "key" }, { type: "int", name: "n" }], returns: "bool" }],
    };
    const bin = build(cap, `class Cap { int left; public: Cap(int limit) : left(limit) {} bool add(const string& key, int n) { if (key.empty() || n > left) return false; left -= n; return true; } };`);
    const out = run(bin, [
      [`["Cap","add","add","add"]`, `[[5],["a",3],["b",3],["",1]]`],
      [`["Cap"]`, `[[1]]`],
    ]);
    expect(lines(out.stdout)).toEqual(["[null,true,false,false]", "[null]"]);
  });

  it("aborts on an unknown operation", () => {
    const bin = build(spec, code);
    expect(run(bin, [[`["MinStack","nope"]`, `[[],[]]`]]).status).not.toBe(0);
  });
});

describe("generateSource validation", () => {
  it("rejects identifiers that could inject code", () => {
    expect(() => generateSource({ kind: "function", name: "f(){}", returns: "int", params: [] }, "")).toThrow(/bad identifier/);
  });
  it("requires an out-parameter for void functions", () => {
    expect(() => generateSource({ kind: "function", name: "f", returns: "void", params: [] }, "")).toThrow(/outParam/);
  });
});
