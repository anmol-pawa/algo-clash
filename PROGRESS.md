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
- Added `lib/judge/clangErrors.ts`: 41 entries (title, why, fix, pattern, broken snippet) plus `parseClangErrors` (line/column/message with line offset for the injected harness) and `explainFirstError`.
- `tests/judge-clang-errors.test.ts` compiles every snippet with native clang++ (C++20, `-fno-exceptions`, linked) and asserts real clang output maps to the entry's own id, so the table cannot drift from real messages. Free-function arity errors surface from clang as "no matching function", so they share that entry.
- Verified: `npm run lint`, `typecheck`, `test` (84 pass), `build`, `build:pages` all pass. No visual changes, so no screenshots.
- CI/Pages deploy confirmation skipped (GitHub Actions quota exhausted until 2026-11-01).
- Known gaps: matched against native clang 18; the bundled wasm clang version may word a few messages differently (A3d smoke test should compare); not yet shown in any UI.
- Next: A3d (`judgeProblem()` wiring + Playwright smoke test).

## 2026-10-29: A3d judgeProblem() wiring and browser smoke test
- Added `lib/judge/judge.ts`: `judgeProblem(spec, code, tests, opts, deps)` generates the driver source, compiles once, runs all tests in one process, and on a crash or timeout re-runs tests one by one to blame the first failing test (AC/WA/TLE/RE/CE; CE carries raw diagnostics and the friendly first error). Workers are injected via `deps` so it tests natively.
- `tests/judge-judge.test.ts` (5 tests) uses g++ and a native runner as stand-in workers: AC, WA with got/expected, RE blamed on the right test, TLE on the hanging test, CE with friendly first error.
- `/dev/judge` has a "Judge two-sum" button using the real compile and run workers. `scripts/smoke-judge.mjs <baseUrl>` (Playwright, global install) drives it on desktop and iPhone 14 emulation.
- Verified: `npm run lint`, `typecheck`, `test` (89 pass), `build`, `build:pages` pass. Smoke test on the static export: correct solution → AC (3 tests), broken-memo solution → WA, undeclared name → CE with first error "Unknown name" (wasm clang 22 wording matches the table); no console errors, no horizontal overflow on iPhone 14; screenshot is readable with large tap targets.
- CI/Pages deploy confirmation skipped (GitHub Actions quota exhausted until 2026-11-01).
- Known gaps: per-test wall time in batch mode is the average; real-device Safari untested; clang table checked against only one wasm-clang message so far.
- Next: A4 (content pipeline: problem package format and `content:verify`).

## 2026-10-29: A4a Pattern taxonomy and package validators
- Split A4 into A4a–A4d in `ROADMAP.md` (validators, native runner, `content:verify`, three sample problems).
- Added `content/patterns.ts` (37 patterns mapped to regions R0–R22 with signals), `lib/content/types.ts` (`ProblemMeta`, `HiddenTest`, test groups) and `lib/content/validate.ts` (meta, editorial in the eight house-style sections with an O(...) claim in Optimal, 3-rung hints, statement skeleton, hidden-test groups/weights/duplicates, prerequisite-cycle detection). 12 unit tests in `tests/content-validate.test.ts`.
- Verified: `npm run lint`, `typecheck`, `test` (101 pass), `build`, `build:pages` pass. No visual changes, so no screenshots. `content:verify` does not exist yet (A4c).
- CI/Pages deploy confirmation skipped (GitHub Actions quota exhausted until 2026-11-01).
- Known gaps: nothing loads real packages yet; the taxonomy will grow as regions are built.
- Next: A4b (package loader and native g++ runner with seeded RNG and `.cache/`).

## 2026-10-29: A4b Native runner, package loader, seeded RNG
- Added `lib/content/rng.ts` (mulberry32 `Rng` with `int/pick/shuffle/ints`, `seedFor(problemId, label)` for stable per-group seeds), `lib/content/native.ts` (`compileNative` with g++ `-std=c++20 -O2 -fno-exceptions`, binaries cached by source hash in `.cache/native`; `runNative` batch run mapping hang→TLE, crash/bad line count→RE; `GenModule` contract for `gen.ts`; `loadPackage` and `findPackages` for `content/problems/<region>/<slug>/`).
- `tests/content-native.test.ts` (6 tests): RNG determinism/bounds/shuffle, compile + cache hit, compile error, TLE, RE. `.cache/` added to `.gitignore`.
- Verified: `npm run lint`, `typecheck`, `test` (107 pass), `build`, `build:pages` pass. No visual changes, so no screenshots.
- CI/Pages deploy confirmation skipped (GitHub Actions quota exhausted until 2026-11-01).
- Known gaps: `loadPackage` has no test yet (needs a real package; A4d covers it); `GenModule` shape may be adjusted by A4c/A4d.
- Next: A4c (`content:verify`: regenerate tests.json, stale check, 200-case stress vs brute, wrong solutions rejected).

## 2026-10-29: A4c content:verify pipeline
- Added `lib/content/verify.ts` (`verifyPackage`, `generateInputs`): validates meta/statement/hints/editorial, compiles solution/brute/wrong with g++, regenerates hidden tests from the seeded `gen.ts` with reference outputs, checks `tests.json` is fresh (missing or stale fails; `write: true` rewrites), stress-tests reference vs brute on 200 small cases, and requires every `wrong/*.cpp` to be rejected (WA, RE or TLE within the time limit). Mediums/hards need a `wrong/*tle*.cpp`.
- `npm run content:verify` runs `tests/content-problems.test.ts` over `content/problems/**` (no real problems yet, so it checks only ids/cycles); `npm run content:gen` does the same with `CONTENT_WRITE=1` to regenerate `tests.json`.
- `tests/content-verify.test.ts` exercises the whole pipeline on a fixture package (`tests/fixtures/problems/R2/pair-count`, counting pairs with hash lookup; wrong: int overflow, self-pair) and checks the negative paths: missing/stale tests.json, a "wrong" solution that is secretly right, reference disagreeing with brute.
- Verified: `npm run lint` (clean), `typecheck`, `test` (113 pass), `content:verify`, `build`, `build:pages` pass. No visual changes, so no screenshots.
- CI/Pages deploy confirmation skipped (GitHub Actions quota exhausted until 2026-11-01).
- Known gaps: the whole-batch TLE rule means a wrong solution is "rejected by TLE" only if the full hidden batch exceeds `timeLimitMs`; custom checkers (multiple valid answers) are not wired in yet; `loadPackage` is covered only through the fixture.
- Next: A4d (three real sample problems E/M/H as full packages).

## 2026-10-29: A4d Three sample problems (E/M/H)
- Added full packages under `content/problems/`: `R6/crate-brackets` (E, stack), `R3/calm-window` (M, sliding window, at most k distinct), `R6/skyline-hall` (H, monotonic stack, largest histogram area, 64-bit). Each has original statement, reference, brute, 3-4 wrong solutions (including a TLE one for M/H), seeded `gen.ts`, generated `tests.json`, 3-rung hints and an 8-section editorial.
- `content:verify` now checks 3 real problems: reference matches brute on 200 random cases and every wrong solution is rejected. It caught one bad "wrong" solution in calm-window (the `if` instead of `while` shrink is actually correct, the non-shrinking window trick), which I replaced with a real bug and fixed the editorial/hints that had claimed otherwise.
- Verified: `npm run lint`, `typecheck`, `test` (116 pass), `content:verify`, `build`, `build:pages` pass. No visual changes, so no screenshots.
- CI/Pages deploy confirmation skipped (GitHub Actions quota exhausted until 2026-11-01).
- Known gaps: skyline-hall `tests.json` is 3.6 MB (perf arrays); consider storing perf tests as generator seeds before shipping to the client (A5/A6). Problems are not yet playable in a UI.
- Next: A5 (CodeMirror editor and battle-code UI).

## 2026-10-29: A5a CodeMirror C++ editor component
- Split A5 into A5a–A5c in `ROADMAP.md`. Done: A5a.
- Added `components/CodeEditor.tsx` (CodeMirror 6, C++ highlighting, night/paper themes, font size, autocomplete toggle via compartments, closeBrackets, history, Tab indent, mobile symbol toolbar with ≥44 px keys that does not steal focus), pure helpers in `lib/editor/settings.ts` (`sanitizeSettings`, `SYMBOL_KEYS`, `applySymbol`) with 4 unit tests, `/dev/editor` playground and `scripts/smoke-editor.mjs`.
- Verified: `npm run lint`, `typecheck`, `test` (120 pass), `build`, `build:pages` pass. `content:verify` is part of `npm test` and passes. Playwright smoke on the static export at desktop and iPhone 14: typing plus symbol-bar insert works (`int x()`), theme/font toggles work, no console errors, no horizontal overflow; screenshots read well (long lines scroll inside the editor).
- CI/Pages deploy confirmation skipped (GitHub Actions quota exhausted until 2026-11-01).
- Known gaps: vim mode not added (needs `@replit/codemirror-vim`, deferred); settings are not persisted until A6; the symbol bar is always shown (should hide on keyboard-attached desktops later).
- Next: A5b (statement panel, Run/Submit verdict panels wired to `judgeProblem`).

## 2026-10-29: A5b Statement panel and verdict panels
- Added `lib/ui/statement.ts` (safe minimal markdown to blocks, constraints as stat chips), `lib/ui/verdictView.ts` (JudgeResult to headline/tone/per-test chips, WA input/expected/got diff with first differing char, CE friendly explanation), `components/StatementPanel.tsx`, `components/VerdictPanel.tsx`, and `/dev/problem` (statement + editor + Run on the basic tests / Submit on all hidden tests via `judgeProblem`). 5 unit tests in `tests/ui-statement-verdict.test.ts`, including parsing a real `problem.md`.
- Verified: `npm run lint`, `typecheck`, `test` (125 pass, includes content:verify), `build`, `build:pages` pass. Playwright on the static export at desktop and iPhone 14: layout reads well, no console errors, no horizontal overflow. The WASM toolchain was not exercised in the browser this run (large download), so Run/Submit verdict rendering is covered by unit tests only.
- CI/Pages deploy confirmation skipped (GitHub Actions quota exhausted until 2026-11-01).
- Known gaps: dev page hardcodes crate-brackets (a bundled catalogue comes with A7); no hint/editorial UI yet.
- Next: A5c is blocked on A6, so A6 (IndexedDB save system) is the next box.

## 2026-10-29: A6 Save system
- Added `lib/save/`: `schema.ts` (v1 `CoreSave`: profile, party, mastery, settings, flags, plus `Attempt` and `Draft`, with never-throwing sanitisers), `migrations.ts` (versioned chain with a v0 prototype migration; a save from a newer version is refused and never overwritten), `backend.ts` (`SaveBackend` contract and `MemoryBackend`), `idb.ts` (IndexedDB stores `core`, `attempts` indexed by problem, `drafts`), `service.ts` (`SaveService`: load/migrate/rewrite, attempts, drafts, JSON export/import that validates before replacing anything, reset).
- `tests/save.test.ts` (13 tests): sanitising, idempotence, v0 migration, future-version refusal, corrupt fallback, attempts, drafts, export/import round trip, bad imports leave storage untouched.
- `/dev/save` and `scripts/smoke-save.mjs` run a real IndexedDB round trip (save, attempt, draft, export, reset, import) in Chromium.
- Verified: `npm run lint`, `typecheck`, `test` (138 pass, includes content:verify), `build`, `build:pages` pass. Smoke test on the static export at desktop and iPhone 14: round trip OK, no console errors, no horizontal overflow (dev page is a single button and a text line, no art changes).
- CI/Pages deploy confirmation skipped (GitHub Actions quota exhausted until 2026-11-01).
- Known gaps: the SRS fields in `ProblemMastery` are placeholders until `lib/srs/` (a later box); no UI for export/import yet (Settings screen); `/dev/save` is not linked from anywhere.
- Next: A5c (drafts autosave in the editor, every 5 s, using `SaveService`).

## 2026-10-29: A5c Drafts autosave
- Added `lib/editor/autosave.ts` (`DraftAutosaver`: saves the latest code every 5 s only when changed, serialised writes, a failed write stays dirty and retries, `dispose()` flushes; `restoreDraft` falls back to starter on missing/blank/error) and wired it into `/dev/problem` via `SaveService` + IndexedDB. 4 unit tests in `tests/editor-autosave.test.ts`; `scripts/smoke-draft.mjs` types, waits for autosave, reloads and checks the text returns.
- Verified: `npm run lint`, `typecheck`, `test` (142 pass, includes content:verify), `build`, `build:pages` pass. Smoke on the static export at desktop and iPhone 14: draft restored, no console errors, no scrollWidth overflow. The iPhone screenshot looked horizontally offset (page scrolled left after the editor click), though `scrollWidth` reported no overflow; to recheck when the real battle screen replaces this dev page.
- CI/Pages deploy confirmation skipped (GitHub Actions quota exhausted until 2026-11-01).
- Note: this run was pinned to branch `claude/eloquent-ritchie-k1w9pw` by the session, so commits went there rather than `main`; merge to `main` for the Pages deploy.
- Known gaps: drafts are only wired to the dev page; clearing the draft after an AC comes with the battle screen.
- Next: B1 (art: starter and town).
