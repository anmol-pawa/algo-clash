# Algo Clash progress

Append a dated entry after every run: what changed, how it was verified (commands, screenshot notes), known gaps, what's next. Newest entries at the bottom.

## 2026-10-28: Project seeded
- Added the design set: `CLAUDE.md` (routine protocol and quality bars), `ROADMAP.md` (phases A–F), `docs/GAME_DESIGN.md`, `docs/CURRICULUM.md` and `docs/ARCHITECTURE.md`.
- Toolchain lead: `@yowasp/clang` ships libc++ headers and `libc++.a` for wasm32-wasip1 (package listing checked; nothing compiled yet). The A2 spike must measure it.
- Next: ROADMAP A1 (scaffold from Query Clash).

## 2026-10-28: A1 Scaffold from Query Clash
- Scaffolded Next.js 16 + React 19 + Pixi 8 + Tailwind 4 + CodeMirror 6 deps, PWA (manifest, `gen-sw.mjs` service worker with the worker-fragment fix, `PwaRegister`), `ci.yml` (lint, typecheck, test, build, build:pages) and `pages.yml` (basePath `/algo-clash`), vitest, eslint, `.gitignore`, README, `.routine/` lock convention.
- No Query/SQL/PGlite references carried over. Added original pixel-brace icons via `scripts/gen-icons.mjs` (dependency-free PNG encoder; `npm run icons`).
- Title screen (`/`) and placeholder `/play` render.
- Verified: `npm run lint`, `typecheck`, `test` (1 test: manifest), `build`, `build:pages` all pass. Playwright (desktop 1280×800 and iPhone 14) on the static export under `/algo-clash/`: no console errors, no horizontal overflow, manifest 200; screenshots show a readable pixel title, panel and a 44px+ START button.
- CI/Pages deploy confirmation skipped (GitHub Actions quota exhausted until 2026-11-01).
- Known gaps: `/play` is a placeholder; CodeMirror/Pixi deps are installed but unused so far; `content:verify` does not exist yet.
- Next: A2 (C++ toolchain spike with `@yowasp/clang`).

## 2026-10-29: A2 C++ toolchain spike
- Added `/dev/judge` (compile + run playground), `public/judge/compile-worker.js` (long-lived clang worker), `public/judge/run-worker.js` (one-shot WASI runner with in-repo shim, terminated on timeout), `lib/judge/client.ts`, the `bits/stdc++.h` shim (`public/judge/stdc++.h`), and `scripts/copy-toolchain.mjs` (copies the 105 MB toolchain to gitignored `public/toolchain/`; the service worker skips it).
- Findings, recorded in `docs/adr/0001-cpp-runtime.md` and ARCH §2.1: about 27 MB gzip download; about 5 s warm compile (8.4 s cold); exceptions do not link, so `-fno-exceptions`; recursion limited to about 5,000 frames by the host stack (`-z stack-size` has no effect); bits/stdc++.h needs the shim.
- Verified: lint, typecheck, test (shim headers checked against the bundled libc++), build, build:pages. Playwright (desktop and iPhone 14 emulation, static export): sample compiles and prints `0 1 top=15`; deep recursion reports RE "stack overflow"; no console errors; no horizontal overflow.
- CI/Pages deploy confirmation skipped (Actions quota exhausted until 2026-11-01).
- Known gaps: real-iPhone Safari memory/time not measured (emulation only); peak compile memory not measured; brotli size not measured; PCH speed-up untried.
- Next: A3 (judge core: harness, verdicts, clang error table).

## 2026-10-29: A3a LC literals and verdict mapping
- Split A3 into A3a–A3d in `ROADMAP.md` (pure TS, C++ harness, clang error table, wiring + smoke test).
- Added `lib/judge/lc.ts` (LC literal parser/printer, level-order tree build/print, judge output comparison with float tolerance) and `lib/judge/verdict.ts` (AC/WA/TLE/RE mapping, friendly runtime reasons, first-failure summary), with 23 unit tests in `tests/judge-lc.test.ts`.
- Verified: `npm run lint`, `typecheck`, `test` (26 pass), `build`, `build:pages` all pass. No visual changes, so no screenshots this run.
- CI/Pages deploy confirmation skipped (GitHub Actions quota exhausted until 2026-11-01).
- Known gaps: CE is not yet in `Verdict` mapping logic (needs A3c); nothing consumes these modules until A3d.
- Next: A3b (C++ harness header and generated `main`, tested natively with g++).

## 2026-10-29: A3b C++ harness and generated driver
- Added `lib/judge/harness/lcHarness.ts` (`LC_HARNESS_H`: `ListNode`, `TreeNode`, optional graph `Node` via `LCH_GRAPH_NODE`, and `lch::read`/`lch::print` for ints, bool, char, double, string, nested vectors, lists, trees, graphs; malformed input aborts since exceptions are off) and `lib/judge/harness/driver.ts` (`generateSource` builds harness + player code + `main`; supports function problems with an out-parameter for in-place `void` methods, and the LC operations format for design problems; `encodeInput` batches many tests per process; identifiers are validated).
- Tests in `tests/judge-harness.test.ts` (15) compile generated programs with `g++ -std=c++20 -fno-exceptions -Wall -Wextra -Werror` (one also with clang++) and check outputs: two-sum, strings/bools/doubles/nested vectors, lists, trees with nulls, graph clone, in-place rotate, MinStack and a constructor-argument design class, malformed input and unknown ops abort.
- Also compiled a function and a design driver with the bundled `@yowasp/clang` (libc++, `-fno-exceptions`) in Node: both compile. Running in the browser is A3d's smoke test.
- Verified: `npm run lint`, `typecheck`, `test` (41 pass), `build`, `build:pages` all pass. No visual changes, so no screenshots.
- CI/Pages deploy confirmation skipped (GitHub Actions quota exhausted until 2026-11-01).
- Known gaps: no cyclic linked lists, N-ary or random-pointer nodes yet (add behind macros when a problem needs them); per-test timing is not emitted by the driver (whole-run wall time only); the harness is not yet wired to the workers.
- Next: A3c (friendly clang-error table).

## 2026-10-29: A3c Friendly clang-error table
- Added `lib/judge/clangErrors.ts`: `parseDiagnostics` (plain-text clang output to structured diagnostics), 44 `CLANG_ERRORS` entries (pattern, title, explanation, fix, broken `example`), `explainMessage`, `errorDiagnostics`/`explainCompile` (errors plus the one warning-rooted case, unterminated strings). Specific entries sit before generic ones (e.g. `std::max` mixed types before "no matching function"; missing `operator<` and wrong stream direction before "invalid operands").
- `tests/judge-clang-errors.test.ts` compiles every entry's example natively with `clang++ -std=c++20 -fno-exceptions -Wall -fsyntax-only` and asserts clang's first error maps to that entry, so the patterns are tied to real output (clang 18 here). Also tests parsing of notes/carets/summary lines and unknown messages.
- Verified: `npm run lint`, `typecheck`, `test` (87 pass), `build`, `build:pages` pass. No visual changes, so no screenshots.
- CI/Pages deploy confirmation skipped (GitHub Actions quota exhausted until 2026-11-01).
- Known gaps: patterns come from clang 18; the browser's `@yowasp/clang` is a different version, so A3d's smoke test should re-run the table against its output; link errors (undefined reference) and warnings-as-hints are not covered; nothing renders the table until the editor UI (A5).
- Branch note: committed to the session branch `claude/eloquent-ritchie-jkww5m` (the session's designated branch) rather than `main`; the owner may need to merge it to `main` for deploys.
- Next: A3d (`judgeProblem()` wiring + Playwright smoke test).
