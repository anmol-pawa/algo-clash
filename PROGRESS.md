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
- Added `lib/save/autosave.ts` (`DraftAutosaver`: throttled to one write per 5 s with the latest text, skips unchanged code, `flush()` on tab hide/unmount, retries after a storage failure, injectable timers) and wired it into `/dev/problem` (restores the saved draft on load and shows "Draft restored"). 3 unit tests in `tests/autosave.test.ts`.
- Fixed a mobile layout bug from A5b: the `/dev/problem` grid column grew to 680 px on iPhone 14 (zoomed-out layout viewport); added `grid-cols-1`/`min-w-0`. The only remaining wide element is the symbol toolbar, which scrolls inside its own container.
- `scripts/smoke-draft.mjs`: types, waits for autosave, reloads and expects the draft back.
- Verified: `npm run lint`, `typecheck`, `test` (141 pass, includes content:verify), `build`, `build:pages` pass. Playwright on the static export at desktop and iPhone 14: draft restored after reload, no console errors, no horizontal overflow; iPhone screenshot reads well and fits the viewport.
- CI/Pages deploy confirmation skipped (GitHub Actions quota exhausted until 2026-11-01).
- Known gaps: the draft is not cleared on an AC submit yet (battle flow, B-phase); restore can race with very fast typing right after load; editor settings are not yet persisted.
- Next: B1 (art: starter and town).

## 2026-11-02: B1a Arrayling sprites and sprite toolkit
- Added `game/sprites/grid.ts` (palette-index grids, dithered shaded rounded boxes, outlines, silhouette, RGBA conversion; no DOM/Pixi), `game/sprites/arrayling.ts` (64×64 front and back sheets: idle ×4, attack ×3, hurt ×2, faint ×4, evolve ×4; green 5-step ramp, amber index tags 0–3 so it reads as an array), `components/SpriteCanvas.tsx` and `/dev/sprites`. 7 unit tests in `tests/sprites-arrayling.test.ts`. ROADMAP B1 split; B1a ticked.
- Verified: lint, typecheck, test, build, build:pages; Playwright on the static export at desktop and iPhone 14: no console errors, no horizontal overflow; screenshots show readable digits, antennae no longer overlap tags, hurt/evolve are white silhouettes, attack no longer clips.
- CI/Pages deploy: Actions quota note ended 2026-11-01, so confirmation is attempted below if possible.
- Known gaps: art is procedural-shaded and fairly simple (could get more face/limb detail later); evolve is a flat silhouette pulse, no morph yet.
- Next: B1b (trainer 4-direction walk cycle, Professor Iota sprite and portrait), then B1c (Mainville tileset).

## 2026-11-02: B1b Trainer and Professor Iota sprites
- Added `game/sprites/character.ts`: 16x24 overworld sheets (down/up/left walk x4 frames, right = mirror, idle) for the trainer and Professor Iota (silver hair, glasses, lab coat), 48x48 dialogue portraits with blink and talk animations; new grid helpers `outline`, `mirrorH`, `shadedBox`. `/dev/sprites` shows them; 9 unit tests in `tests/sprites-character.test.ts`.
- Verified: lint, typecheck, test, build, build:pages; Playwright on the static export at desktop and iPhone 14: no console errors, no overflow; screenshots read well (walk poses, portraits). Glasses were too heavy in the first pass and were thinned.
- Known gaps: side-view legs are simple; the trainer has no gender/skin options yet (customisation later).
- Next: B1c (Mainville tileset: grass, paths, houses, lab, water, trees).

## 2026-11-02: B1c Mainville tileset
- Added `game/sprites/tiles.ts`: 18 deterministic 16x16 tiles (grass x2, flowers, path, path edge, animated water x4, tree, bush, fence, sign, house wall/roof/door/window, teal lab wall/roof/door, animated tall grass x2) on a shared 36-colour palette, plus a `SOLID` set for the overworld's collision (B2). `components/TileScene.tsx` composes an animated sample village on `/dev/sprites`. 4 unit tests in `tests/sprites-tiles.test.ts`.
- Verified: lint, typecheck, test (161 pass), build, build:pages; Playwright on the static export (served under `/algo-clash`) at desktop and iPhone 14: no console errors, no horizontal overflow; screenshots show readable tiles and a coherent village scene.
- Known gaps: no sand/shore edge tiles or paths turning corners yet; lab building uses the generic door/roof (a dedicated lab sign comes with the map in B2).
- Next: B2 (overworld engine: tile map format, camera, collision, movement, dialogue).

## 2026-11-02: fix flaky TLE check in crate-brackets (CI)
- CI on 691e8dd failed once: `wrong/tle-pair-deletion.cpp` was not rejected on the faster CI runner (the old perf group only just exceeded the 1 s limit locally). Added two perf cases with a long unmatched prefix (`)`x50000 + `()`x25000, `]`x40000 + `(`x30000 + `)`x30000); the wrong solution now takes about 9 s total against the 1 s limit; reference unaffected. Regenerated `tests.json`.
- Verified: lint, typecheck, test (161 pass, includes content:verify).
- Lesson: a TLE wrong solution needs a >=5x margin over the limit, not ~1x.

## 2026-11-02: B2a Overworld and dialogue logic
- Split B2 into B2a–B2c in `ROADMAP.md`. Done: B2a (pure logic, no rendering).
- Added `lib/overworld/map.ts` (map format, `parseMap` validation with readable errors, solid/encounter/readable tile sets, NPCs, warps, signs), `walk.ts` (`step` with turn/move/bump/warp/encounter events and an injected RNG, `interact`, `arrive`, `findPath` BFS for tap-to-move that stops next to and faces blocked targets), `mainville.ts` (sample map built from the B1c tiles). Added `lib/dialogue/script.ts` (pages, choices, flags, revisit variants via `when`, `validateScript`, typewriter `visibleText`) and `mainville.ts` (original sample dialogue). 22 tests in `tests/overworld.test.ts`, including a check that `SOLID_TILES` equals the tileset's `SOLID` and a 2000-step random walk that never enters a blocked tile.
- Verified: `npm run lint`, `typecheck`, `test` (183 pass, includes content:verify), `build`, `build:pages` pass. No UI changes this run, so no screenshots.
- Known gaps: no rendering or input yet; the `faceBack` NPC turn and flag persistence are for B2c; the villager sprite does not exist yet (B2b).
- Next: B2b (`/play` canvas scene, camera, d-pad, tap-to-move, warps).

## 2026-11-02: B2b Overworld rendering
- Added `lib/overworld/mover.ts` (pure world tick: held direction and tap-to-move path, 170 ms tile steps, collisions, warps applied after the step, encounter roll, interpolated draw position), `lib/overworld/route1.ts` (second map so warps work both ways; Mainville warp arrival moved to y=1), a villager look, `game/sprites/canvasFrames.ts`, and `components/WorldCanvas.tsx` on `/play`: 11x9 tile camera with clamping, animated water/tall grass, NPCs, trainer walk cycle, keyboard (arrows/WASD, Z/Enter), 56 px on-screen d-pad and A button, tap-to-move, and a basic dialogue box with choices (so no conversation can soft-lock; B2c restyles it with portraits). 8 tests in `tests/overworld-mover.test.ts`; `scripts/smoke-play.mjs`.
- Verified: `npm run lint`, `typecheck`, `test` (191 pass), `build`, `build:pages`; Playwright smoke on the static export at desktop and iPhone 14: talk to Iota with a choice, walk through the south warp to Route 1, no console errors, no horizontal overflow. Screenshots read well; fixed the map label wrapping on iPhone.
- Known gaps: the overworld uses 2D canvas, not Pixi (noted in ARCH); encounters only show a placeholder note until B3/B4; no portraits or typewriter yet; NPC `faceBack` and flag saving are B2c; no transition fade between maps.
- Next: B2c (pixel dialogue box with portraits and typewriter, flags saved via `SaveService`, `faceBack`).

## 2026-11-03: B2c Dialogue box, flags, NPC turning
- Added `components/DialogueBox.tsx` (handheld window with animated 48x48 portrait that talks while typing, name tag, 45 cps typewriter, first tap/Z/A completes the page and the next advances, choices appear after typing, 44 px choice buttons), `lib/dialogue/flags.ts` (`flagSet`, `raiseFlags`), `faceNpc` in `lib/overworld/mover.ts`. `WorldCanvas` loads the save through `SaveService`, starts dialogue with the saved flags (Iota greets a returning trainer), writes raised flags back when a conversation ends, and the NPC turns to face the player. 2 new tests (193 pass).
- Verified: `npm run lint`, `typecheck`, `test`, `build`, `build:pages` pass. `scripts/smoke-play.mjs` (extended: typewriter, flag survives a reload, warp) passes on the static export at desktop and iPhone 14; screenshots show the portrait, readable text, Iota turned toward the player, no console errors, no horizontal overflow.
- Known gaps: two confirm presses within one frame can skip a page (the confirm handler reads the last rendered state); flags are only saved when a conversation ends; only Mainville dialogues exist.
- Next: B3 (battle stage).

## 2026-11-03: B3a Battle stage canvas
- Split B3 into B3a-B3c in `ROADMAP.md`; done: B3a.
- Added `lib/battle/stagefx.ts` (pure effect state: intro slide-in, 60 ms hit-stop, damage-scaled shake, HP drain tween, poses, damage numbers, verdict stingers; ignores non-positive frame gaps), `game/battle/backdrop.ts` (procedural meadow: sky, drifting clouds, hills, flowers, platforms), `components/BattleStage.tsx` (240x135 logical canvas at 3x, arrayling back sprite vs a purple recolour as the placeholder foe, lunges, HP boxes with hearts, ACCEPTED/WRONG ANSWER/TIME LIMIT/RUNTIME ERROR/COMPILE ERROR stingers) and `/dev/battle` with trigger buttons. 6 tests in `tests/stagefx.test.ts`; `scripts/smoke-battle.mjs`.
- Verified: `npm run lint`, `typecheck`, `test` (199 pass), `build`, `build:pages`. Smoke on the static export at desktop and iPhone 14: no console errors, no horizontal overflow; screenshots show readable HP boxes (hearts moved to their own row after overlapping the level), stinger and sprites. Fixed a flaky crash found by the smoke (a negative first-frame dt gave a negative frame index).
- Known gaps: the foe is a recoloured Arrayling placeholder; no per-move sprite effects, evolve play, text box or wipe (B3b); the layouts with editor and mobile tabs are B3c; no audio yet; the stage is 2D canvas, not Pixi.
- Next: B3b.

## 2026-11-03: B3b Battle text box, move effects, faint/evolve, wipe
- Extended `lib/battle/stagefx.ts` (move effects with expiry, wipe progress, typewriter message queue with skip/advance, `faint`/`evolve` poses) and added `game/battle/effects.ts` (5-frame 32x32 pixel effects: slash, burst, bolt, each with its own palette). `BattleStage` draws effects over the target, a handheld text box (typewriter, blinking advance cue), and a black-bar battle wipe; the player platform and HP box moved up so the text box never covers them. `/dev/battle` has Burst, Say, Next line, Foe faints and Evolve buttons. 7 new tests (206 pass).
- Verified: `npm run lint`, `typecheck`, `test`, `build`, `build:pages`; `scripts/smoke-battle.mjs` on the static export at desktop and iPhone 14: no console errors, no horizontal overflow; screenshots show the wipe opening, effects on the right targets, the evolve silhouette, foe fainting, and a readable text box.
- Known gaps: effects are generic per kind (no per-move art yet); the Arrayling evolve is still a flat silhouette pulse; text box wraps to two lines max and does not paginate; no audio.
- Next: B3c (desktop and mobile battle layouts with statement + editor).

## 2026-11-03: B3c Battle layouts (desktop split, mobile tabs)
- Added `lib/ui/battleTabs.ts` (tab list, `tabAfterJudge`, `stepTab`, `battleOutcome`: Run chips the foe by 25% and never costs a heart, a failed Submit costs one heart, an accepted Submit defeats the foe), `components/BattleLayout.tsx` (desktop: stage on top at 32% viewport height with statement and editor panes below; mobile: Stage/Problem/Code tab bar with ARIA tabs, arrow-key navigation, panes stay mounted so the editor keeps its state, Run/Submit bar always visible, verdict chip on the Code tab), `components/BattleArena.tsx` (stage + statement + editor + verdict wired to the judge and draft autosave) and `/dev/arena`. 8 new tests in `tests/battle-tabs.test.ts`; `scripts/smoke-arena.mjs`.
- Verified: `npm run lint`, `typecheck`, `test` (212 pass incl. content:verify), `build:pages`; smoke on the static export at desktop and iPhone 14: wrong submit shows the stinger, heart loss and text line; on iPhone submit jumps to Stage and the Code tab shows `[WA]`; no console errors, no horizontal overflow. Screenshots read well.
- Known gaps: on mobile the Stage tab has empty space under the stage (could show the verdict summary); the foe is still the placeholder recolour; no encounter flow yet (B4).
- Next: B4 (battle logic state machine).

## 2026-11-03: B4 Battle logic
- Added `lib/battle/damage.ts` (type multiplier x1.5/x1.0/x0.5 via `effectiveness`, rust cap 1.25, time bonus, `submitDamage` with group weights, hints and plan bonus, `rewards` for XP/Bits) and `lib/battle/machine.ts` (immutable Scout → Strategise → Plan → Code → Judging → Debrief machine: Run chips 25% once and never costs a heart, a failing Submit costs a heart, compile errors are free, a correct Plan shields one wrong submit, 0 hearts faints and queues the Rematch list, retreat, hints/editorial assisted flags, illegal transitions throw). Design choice: partial submits never reduce the foe below 1 HP; only a full AC defeats it. 22 tests in `tests/battle-logic.test.ts`.
- Verified: `npm run lint`, `typecheck`, `test` (234 pass), `build`, `build:pages`. No UI changes, so no screenshots.
- Known gaps: the machine is not yet wired into `BattleArena` (encounter flow, strategy picker UI come with B5/B6 content); the rematch list is only a flag until the SRS storage lands; `workable` (neutral) patterns are not yet in problem meta.
- Next: B5 (concept-card battles).

## 2026-11-03: B5 Concept-card battles
- Split B5 into B5a (logic + native generation) and B5b (UI); both done.
- Added `lib/cards/` (types for mcq, multi-select, predict, trace, compiler-error, Parsons, cloze; `gradeCard`; `pickDeck`, `parsonsShuffle`, `cardXp`), `lib/content/cardsNative.ts` (g++ compiles and runs each card: predict/trace output, the first real g++ error for compiler-error cards, solved Parsons and cloze programs; every accepted cloze alternative must behave identically; `generated.json` staleness is a test failure; `npm run content:gen` rewrites it), 8 seed R0 cards in `content/cards/R0/syntax.ts`, `components/CardBattle.tsx` (5-step deck, tap-to-place Parsons, inline cloze inputs, explanation after each answer, streak/XP results) and `/dev/cards`. 21 new tests in `tests/cards.test.ts` (255 total).
- Verified: lint, typecheck, test, build, build:pages; `scripts/smoke-cards.mjs` on the static export at desktop and iPhone 14: all card kinds answered, no console errors, no horizontal overflow. Screenshots caught and fixed font ligatures turning `<=` into a single glyph (disabled in code blocks) and an oversized cloze row on iPhone.
- Known gaps: cards are not yet wired into overworld wild encounters or the save/SRS; compiler-error diagnostics are g++ text (the in-browser judge uses clang); no card art or sound; only 8 seed cards (B6/B7 add the real sets).
- Next: B6 (Syntax Shores content, part 1).

## 2026-11-03: B6a Syntax Shores exercises, S1 (5 problems)
- Split B6 into B6a-B6d in `ROADMAP.md`; done: B6a.
- Added five full packages under `content/problems/R0/`: `ledger-digits` (digit sum, negative `%`, 64-bit), `wrap-dial` (floor modulo for negatives), `cargo-total` (`long long` accumulator, `accumulate(..., 0)` trap), `vowel-census` (case folding, `tolower` cast), `safe-midpoint` (`lo + (hi - lo) / 2`). Each has reference, brute, 2-3 wrong solutions, a seeded generator, generated `tests.json`, a 3-rung hint ladder and a house-style editorial.
- Verified: `CONTENT_WRITE=1 npx vitest run tests/content-problems.test.ts` (all 9 pass natively with g++: reference equals brute on random cases, every wrong solution rejected); full lint/typecheck/test/build/build:pages results below in the commit. No UI changes, so no screenshots.
- Known gaps: the problems are not reachable from the game yet (no encounter or lesson wiring); no S2 problems, lessons or cards yet.
- Next: B6b (five S2 exercises).

## 2026-11-03: B6b Syntax Shores exercises, S2 (5 problems)
- Added five full packages under `content/problems/R0/`: `toll-booth` (if/else-if chains with inclusive range boundaries), `charge-meter` (`continue`/early `return`, 64-bit accumulator and limit), `shelf-rank` (pass by `const vector<int>&`; the by-value wrong solution and the linear-scan one both time out on the perf group), `echo-chamber` (recursion that halves the exponent, depth ~60; the one-call-per-bounce recursion overflows the stack at 10^18), `pocket-calendar` (`static` member helper, `static const` table, three-layer leap rule). Each has reference, brute, 3-4 wrong solutions, seeded generator, generated `tests.json`, a 3-rung hint ladder and a house-style editorial.
- Design note: no S2 problem relies on mutable `static` state, because the judge runs all tests of a problem in one process and persistent state would leak between tests; `static` is taught through the static member function and the once-initialised static local table.
- Verified: `CONTENT_WRITE=1 npx vitest run tests/content-problems.test.ts` (14 pass natively with g++: reference equals brute on random cases, every wrong solution rejected), `npm run lint`, `typecheck`, `test` (265 pass), `build`, `build:pages`. No UI changes, so no screenshots.
- Known gaps: the problems are not reachable from the game yet (no encounter or lesson wiring); `echo-chamber` uses `long long` parameters (the harness supports them) but its stack-overflow wrong solution behaves differently under WASM clang than under native g++, which is only a rejection-path concern.
- Next: B6c (S1 lesson screens and 15 S1 cards).

## 2026-11-03: B6c S1 lesson screens and 15 S1 cards
- Added `lib/lessons/` (typed blocks: text, code with optional native run, idiom, pitfall, interview; `verifyLessons`), three S1 lessons in `content/lessons/R0/s1.ts` (first program, types/ranges/overflow, division/modulo/conversions; 7 pages), `components/LessonScreen.tsx` (paged handheld window, real compiled output under runnable listings, then the lesson's practice cards and linked exercises) and `/dev/lesson`. 15 new S1 cards in `content/cards/R0/s1.ts` (all seven kinds); outputs and g++ diagnostics are generated natively into `generated.json`. `/dev/cards` now plays only the 8 seed cards so its smoke stays stable. New `tests/lessons.test.ts`; `scripts/smoke-lesson.mjs`.
- Verified: `npm run lint`, `typecheck`, `test` (284 pass, includes native g++ verification of cards, lessons and problems), `build:pages`; smokes on the static export at desktop and iPhone 14: all lessons paged, practice reached, card smoke still passes, no console errors, no horizontal overflow. Screenshots read well (long code comments scroll inside the listing on iPhone).
- Known gaps: lessons and cards are not wired into the overworld/progression yet; card diagnostics are g++ text, not clang; the exercise links are plain labels until the encounter flow exists.
- Next: B6d (S2 lesson screens and 15 S2 cards).

## 2026-11-03: B6d S2 lesson screens and 15 S2 cards (B6 complete)
- Added three S2 lessons in `content/lessons/R0/s2.ts` (branches and loops; functions and how arguments travel; recursion, call stack and static; 6 pages, 6 runnable listings with natively computed output) and 15 S2 cards in `content/cards/R0/s2.ts` (all kinds: switch fallthrough, dangling else, break/continue trace, switch types, jump-over-initialisation and const-ref compiler errors, by-value TLE, reference vs value, overload resolution, default-argument cloze, recursion trace, missing base case, static local, digit-sum Parsons). Outputs and g++ diagnostics regenerated into the `generated.json` files. New tests in `tests/lessons.test.ts` (S2 listing outputs, every S2 card practised by exactly one S2 lesson).
- Verified: `npm run lint`, `typecheck`, `test` (301 pass, includes native g++ checks), `build`, `build:pages`; `scripts/smoke-lesson.mjs` on the static export (served under `/algo-clash`) at desktop and iPhone 14 across all six lessons: no console errors, no horizontal overflow; screenshots show readable listings, computed output panels and practice cards.
- Known gaps: lessons, cards and exercises are not wired into the overworld/progression yet; card diagnostics are g++ text, not clang.
- Next: B7 (Syntax Shores part 2, S3-S4); it is large, so split it into sub-boxes first.

## 2026-11-03: B7a Syntax Shores exercises, S3 (5 problems)
- Split B7 into B7a-B7d in `ROADMAP.md`; done: B7a.
- Added five full packages under `content/problems/R0/`: `grid-turn` (2D `vector` shape, non-square transpose), `run-squash` (erase cost; `erase(unique(...))`; erase-in-loop TLE), `field-split` (`find` + `substr(pos, len)`, empty fields; `getline` drops the trailing empty field), `letter-tally` (`c - 'a'` buckets, `tolower` with `unsigned char`, ASCII neighbours of the letter ranges), `overlap-count` (`find` with a start position, overlap by advancing 1, per-step `substr` copy TLE). Each has reference, brute, 3 wrong solutions, seeded generator, generated `tests.json`, hints and editorial.
- Build fix: the 14 MB `grid-turn` test file made Tailwind's source scan hang Turbopack's PostCSS step (`npm run build` timed out). Added `@source not "../content/problems";` to `app/globals.css` and cut grid-turn perf to 100k cells.
- Verified: `npm run lint`, `typecheck`, `test` (306 pass, includes native g++ verification), `build`, `build:pages`. No visual changes, so no screenshots.
- Known gaps: problems not reachable from the game yet; no S3 lessons/cards (B7c).
- Next: B7b (seven S4 exercises).

## 2026-11-03: B7b Syntax Shores exercises, S4 (7 problems)
- Added seven full packages under `content/problems/R0/`: `rank-roster` (struct with constructor and `operator<`, sort), `drop-negatives` (`ListNode`, dummy head, `nullptr`), `middle-link` (count then walk), `tree-height` and `leaf-sum` (`TreeNode`, null base case), `step-counter` (first design-format problem: member initialiser list, `this->` shadowing bug, clamp), `forge-chain` (`new` plus tail pointer). Each has reference, brute, 3-4 wrong solutions, seeded generator, generated `tests.json`, hints and editorial.
- Added `lib/content/treegen.ts` (seeded random/skewed/complete tree level-order literals for generators).
- Verified: `CONTENT_WRITE=1 npx vitest run tests/content-problems.test.ts` (26 pass natively with g++), `npm run lint` (2 unused-import warnings in gens), `typecheck`, `test` (313 pass), `build`, `build:pages`. No visual changes, so no screenshots. CI/deploy confirmation skipped: not required by the run notes' quota period was over, but not checked this run.
- Known gaps: problems not reachable from the game yet; `step-counter` and `rank-roster` tests.json are 7-11 MB (large; consider trimming perf sizes); S3/S4 lessons and cards pending.
- Next: B7c (S3 lesson screens and 15 S3 cards).

## 2026-11-03: B7c S3 lesson screens and 15 S3 cards
- Added three S3 lessons in `content/lessons/R0/s3.ts` (vectors and grids; strings, characters and costs; splitting text; 5 pages, 10 runnable listings with natively computed output) and 15 S3 cards in `content/cards/R0/s3.ts` (constructor forms, reserve/resize, indexing, unsigned `size()`, 2D init, erase cost, `auto&`, const-ref error, `substr`, `find`/`npos`, char arithmetic, `to_string`/`stoi`, `substr` TLE, cloze, Parsons). Outputs and g++ diagnostics regenerated into the `generated.json` files. New S3 tests in `tests/lessons.test.ts` (listing outputs; each S3 card practised by exactly one S3 lesson). Hand-typed expectations were wrong in three places and the native results corrected them, which is the point of computing them.
- Verified: `npm run lint` (2 existing warnings), `typecheck`, `test` (330 pass, native g++), `build`, `build:pages`; `scripts/smoke-lesson.mjs` on the static export at desktop and iPhone 14 across all nine lessons: no console errors, no horizontal overflow; screenshots readable.
- Known gaps: lessons, cards and exercises are not wired into the overworld/progression yet; card diagnostics are g++ text, not clang.
- Next: B7d (S4 lesson screens and 15 S4 cards).

## 2026-11-03: B7d S4 lesson screens and 15 S4 cards (B7 complete)
- Added three S4 lessons in `content/lessons/R0/s4.ts` (structs, constructors, initialiser lists and `operator<`; ListNode, nullptr, dummy head and `new`; TreeNode, the null base case and `class Solution`; 6 pages, 7 runnable listings with natively computed output) and 15 S4 cards in `content/cards/R0/s4.ts` (all kinds: access defaults, member init order, shadowed parameter, suppressed default constructor, `operator<` cloze, nullptr, list-walk trace, dummy head, `new` assigned to an object, list-append Parsons, tree height, dot vs arrow, missing null base case, leaf cloze, private `Solution` method). Outputs and g++ diagnostics regenerated into the `generated.json` files; the `new` diagnostic differed from my guess until the constructor was made `explicit`, found by the native run. All seven S4 exercises are linked from the lessons; new tests in `tests/lessons.test.ts`.
- Verified: `npm run lint` (2 existing warnings), `typecheck`, `test` (347 pass, native g++), `build`, `build:pages`; `smoke-lesson.mjs` and `smoke-cards.mjs` on the static export at desktop and iPhone 14: no console errors, no horizontal overflow. Screenshots caught raw `**bold**` and backticks in card prompts (the renderer only formats inline backticks in lesson text); removed.
- Known gaps: lessons, cards and exercises are not wired into the overworld/progression yet; card diagnostics are g++ text, not clang.
- Next: B8 (The Forge v1).

## 2026-11-03: B8a Forge logic and the first scroll
- Split B8 into B8a (logic + content, done) and B8b (`/forge` UI).
- Added `lib/forge/` (`types.ts`; `cloze.ts`: seeded tokenizer-based masks at 30 %/70 %, comments/keywords never blanked, `diffFills` hint; `progress.ts`: tier unlocking, Trace pass at 4 of 5, status new → forging → inscribed → ingrained, Ingrained = two Blank passes under par at least two days apart). First scroll `content/scrolls/accumulate.ts` (annotated template, common bugs) judged by the new full package `content/problems/R0/pouch-sum` (reference, brute with `__int128`, 4 wrong solutions, seeded gen, hints, editorial) and 5 trace cards in `content/cards/R0/forge.ts` with g++-computed outputs. GDD §6.4 records the rules and that a scroll is a problem package plus scroll metadata.
- Verified: `CONTENT_WRITE=1` problem and card generation, `npm run lint` (2 existing warnings), `typecheck`, `npm test` (368 pass, native g++; template equals the reference, mask round-trips for 25 seeds x 2 ratios), `build`, `build:pages`. No UI changes, so no screenshots. CI/deploy not checked (Actions status was not queried this run).
- Known gaps: no UI yet, progress not persisted, only one scroll (CUR §4 Core scrolls come with their regions).
- Next: B8b (`/forge` UI).

## 2026-11-03: B8b The Forge UI (B8 complete)
- Added `/forge` (`app/forge/page.tsx`, `components/ForgeScreen.tsx`): scroll list with status chips and tier pips; per scroll the four tiers with unlocking (Trace: annotated template + 5 natively computed trace cards, pass at 4/5, common bugs; Cloze 30 % / 70 %: seeded masks with inputs, judged by the real compiler and hidden tests, red outlines as a hint only; Blank: statement, timer vs par, editor, Submit judged by `judgeProblem`, status Inscribed, Under par flag). Progress persists in the save (`CoreSave.forge`, sanitised; no version bump since absent means `{}`). `content/scrolls/kits.ts` holds spec/statement/starter and lazily imports the 3 MB tests (own chunk); test asserts the statement equals `problem.md`.
- Fixed a mobile layout bug found by the smoke: `CardBattle` panels grew to their code's width (`w-full min-w-0` added).
- Verified: `npm run lint` (2 existing warnings), `typecheck`, `npm test` (369 pass), `build`, `build:pages`; new `scripts/smoke-forge.mjs` on the static export at desktop and iPhone 14: locked tiers, failed trace, passed trace, wrong then right fills in both clozes (judge rejects wrong, accepts reference), Blank AC with the reference, status Inscribed persisted across reload, no console errors, no horizontal overflow. Screenshots read well.
- Known gaps: Forge is not linked from the overworld yet; Ingrained needs two days so is only unit-tested; scroll results do not feed SRS yet (C1); CI/deploy status not checked this run.
- Next: B9 (Mainville Gym).

## 2026-11-03: B9a Gym logic and Syntax Shores gym content
- Split B9 into B9a (logic + content, done), B9b (leader sprite + backdrop) and B9c (gym UI, badge, victory/evolution scenes).
- Added `lib/gym/` (`types.ts`, `machine.ts`): the 8-item recognition blitz (20 s each, late answers count as misses), foe shield (start 4, hit -1, miss +1, max 6), the phase-2 head start (8 HP per shield point broken), core then signature phase flow, faint = retry that phase, retreat = abandon, badge + Compiler Shard reward, seeded `shuffledOptions`. Content `content/gyms/r0.ts`: Warden Brace, Lighthouse Badge, 8 original blitz items (2 review), core `run-squash`, signature `step-counter`, twist "Warnings are errors" (-Wall -Wextra -Werror; applied in B9c). GDD §5.5 records the rules.
- Verified: `npm run lint` (2 existing warnings), `typecheck`, `npm test` (381 pass, incl. 12 new gym tests), `build`, `build:pages`. No UI changes, so no screenshots.
- Known gaps: all R0 problems are Easy, so the gym's core/signature problems are the hardest existing ones, not a true medium/hard; consider a dedicated medium + follow-up for the gym in B9c; the -Werror twist is not wired into the judge yet.
- Next: B9b (Warden Brace sprite and gym backdrop).

## 2026-11-03: B9b Warden Brace sprite and gym backdrop
- Added `game/sprites/warden.ts`: Warden Brace, 96x96 shaded pixel art (navy coat ramp, brass lamp-staff, cap lantern, `{ }` belt buckle) with idle (4), attack (4: wind-up, swing with light beam, flash, recover), hurt (white flash + recoil) and faint (sink, staff drops, fade) animations. Added `drawGymBackdrop` and `GYM_PLATFORMS` in `game/battle/backdrop.ts` (dusk sea, striped lighthouse with sweeping beam, rocky ledges; foe ledge lowered for the 96px leader) and `components/GymScene.tsx`; both are previewed on `/dev/sprites`. New `tests/warden-sprite.test.ts`.
- Verified: `npm run lint` (2 existing warnings), `typecheck`, `npm test` (384 pass), `build`, `build:pages`; Playwright on the static export at desktop and iPhone 14: no console errors, no horizontal overflow; screenshots read well. Fixed a negative-frame-index crash in GymScene found by the smoke. CI/deploy confirmation is normally required now (quota period ended 2026-11-01) but is checked below/next run.
- Known gaps: Warden has a front view only (leaders face the player); no evolve animation (not needed for leaders); the gym battle UI is not built yet.
- Next: B9c (gym UI, badge, victory and evolution scenes).

## 2026-11-03: B9c Gym UI (`/gym`)
- Added `/gym` (`components/GymScreen.tsx`): Warden Brace intro on the lighthouse backdrop, the 8-item recognition blitz (20 s timer bar, shield pips, per-item "why"), a Phase 2 card showing the head start, the core battle (`run-squash`) and the signature battle (`step-counter`) through `BattleArena`, retry after a faint (blitz kept), retreat (two-tap), badge screen with Rematch. The -Werror twist is real: the signature round compiles with `-Wall -Wextra -Werror` in the WASM clang (an unused variable shows as a compile error that costs no heart). A win persists `badge:*`, `gym:*:won` and `compilerShards` in the save flags (`lib/gym/progress.ts`, idempotent). `BattleArena` gained `onResult`/`foeStartHp`/`compileFlags` and tracks hearts; `BattleStage` gained `foeStart`. `content/gyms/kits.ts` holds statements/starters (tested equal to `problem.md`). GDD §5.5 updated.
- **Judge bug fixed:** `public/judge/run-worker.js` capped the whole batch's stdout at 1 MiB and silently dropped the rest, so big problems (Step Counter's perf tests) got empty output and a bogus WA in the browser even with the reference solution. Cap is now 48 MiB and exceeding it is an RE "output limit exceeded". Found by the gym smoke.
- Verified: `npm run lint` (2 existing warnings), `typecheck`, `npm test` (387 pass), `build`, `build:pages`; new `scripts/smoke-gym.mjs` on the static export at desktop and iPhone 14: full run (7/8 blitz, core AC, -Werror CE, signature AC, badge, persisted on reload), no console errors, no horizontal overflow. Screenshots read well (fixed tiny pixel-font option text and an oversized scene during the blitz).
- Known gaps: the battle stage still shows the recoloured Arrayling as the foe (not Warden/lighthouse); no victory/evolution scene; `/gym` is not linked from the title/overworld; the editor shows doubled blank lines when code is inserted via Playwright (not investigated).
- Next: B9d (stage polish, victory + evolution scene, link to `/gym`).

## 2026-11-04: B9d1 Gym stage uses Warden Brace and the lighthouse
- Split B9d into B9d1 (done) and B9d2 (victory scene + Arrayling evolution animation).
- `BattleStage` gained `scene: "meadow" | "gym"`: the gym scene draws the lighthouse backdrop and `GYM_PLATFORMS`, shows Warden Brace (96x96) as the foe with idle/attack/hurt/faint (falls back to idle for missing poses), anchors effects and damage numbers to the leader, and moves the player's HP box under the foe's box so it no longer covers the leader. `BattleArena` takes `scene` and uses a gym intro line; `GymScreen` passes `scene="gym"`. The title page links to `/gym/` and `/forge/`.
- Verified: `npm run lint` (2 existing warnings), `typecheck`, `npm test` (387 pass, native g++), `build`, `build:pages`; `smoke-gym.mjs` on the static export at desktop and iPhone 14 (battle-stage screenshot added; full gym run still passes), no console errors, no horizontal overflow. Screenshots: Warden on the ledge with the lighthouse behind, HP boxes clear of the sprite, readable on mobile. Screenshot-driven fixes: HP box overlap, wild-creature intro text.
- CI/deploy: quota period is over; confirmation attempted below by the routine (no `gh`; see final summary).
- Known gaps: the intro message box hides the lower half of the Arrayling until it fades; no victory/evolution scene yet; title links are plain buttons.
- Next: B9d2.

## 2026-11-04: B9d2 Evolution scene and Vectorling (B9 complete)
- Added the Arrayling's stage-2 form `game/sprites/vectorling.ts` (64x64, front + back, idle/attack/hurt/faint/evolve: five cells with a dashed ghost "capacity" slot, gold three-spike crest, teal ramp), the pure evolution timeline `lib/evolution/timeline.ts` (intro, accelerating silhouette flips, flash, reveal; reduced-motion skips to the end) and `lib/evolution/progress.ts` (`stage:<species>` save flag, idempotent, never lowers). `components/EvolutionScene.tsx` draws it on a canvas (night sky, rings, sparkles, Skip/Continue). `GymScreen` saves the win plus stage 2 together and shows the scene only on the first badge; the end screen reports the new form. Vectorling and the scene are on `/dev/sprites`. GDD §5.5 updated.
- Verified: `npm run lint` (2 existing warnings), `typecheck`, `npm test` (395 pass, native g++), `npm run build`, `build:pages`; `smoke-gym.mjs` extended (evolution morph + finished screens) on the static export at desktop and iPhone 14: full gym run, no console errors, no horizontal overflow. Screenshots read well. The smoke caught a real bug: rAF timestamps earlier than `t0` made the frame index negative (`drawImage` TypeError); clamped.
- Known gaps: the Vectorling is not yet used in battles or the party UI (the party/overworld integration comes with C-phase systems); the scene has no audio (B10).
- Next: B10 (Audio v1).

## 2026-11-04: B10 Audio v1
- Added `lib/audio/`: tracker format and expander (`tracker.ts`), two original songs (Mainville theme in C major, battle theme in A minor, 4 bars x 16 steps, square lead + triangle/saw bass + noise hat), SFX data (menu, hit, hurt, AC fanfare, WA thud, TLE ticks, CE glitch, level-up), device prefs with sanitising (`prefs.ts`) and the lazy WebAudio engine (`engine.ts`: created on the first gesture, look-ahead scheduler, music and SFX buses, no clicks). UI: `AudioDock` (speaker button on every page with Sound switch and Master/Music/Effects sliders, 44 px targets; every `.px-btn` press plays the menu blip), `useMusic`/`Music` (stacked claims). Wired: title and overworld play Mainville; battles and the gym play the battle theme; submit plays the verdict stinger, hits and hurts play effects; badge win and evolution reveal play the level-up jingle. GDD §10 updated.
- Verified: `npm run lint` (2 existing warnings), `typecheck`, `npm test` (405 pass, 10 new audio tests), `build`, `build:pages`; new `scripts/smoke-audio.mjs` with a spy AudioContext on the static export at desktop and iPhone 14 (no context before a gesture, music keeps scheduling, mute zeroes both buses and persists across reload, menu blip on press, no console errors, no overflow); `smoke-gym.mjs` still passes. Screenshots of the sound panel read well after fixing a see-through background.
- Known gaps: sound was verified through a spy context and unit tests, not by ear; no region-specific songs yet (one per region comes with later regions); no tab-hidden auto-pause; SFX volume is not normalised by listening tests.
- CI/deploy: Actions quota note ended 2026-11-01, but `gh` is unavailable here, so CI/deploy status was not confirmed this run.
- Next: B11 (vertical-slice polish pass).

## 2026-11-04: B11a Slice screenshot tour and header overlap fix
- Split B11 into B11a (done), B11b (play the slice end to end and fix the flow gaps) and B11c (slice review entry).
- Added `scripts/tour.mjs` (screenshots title, `/play`, `/forge`, `/gym` and the dev pages at desktop and iPhone 14, reports console errors and horizontal overflow). Reference shots are in `docs/slice/`.
- Slice observations so far: the title, overworld, gym intro and forge list read well and have 44 px targets. Rough edge found and fixed: on iPhone the fixed sound button covered the "Back to the map" link (Forge), the Leave button (Gym) and the Mainville bar. Those headers now reserve 3.5 rem on the right.
- Observed for B11b: the overworld has only Mainville with no door or NPC leading to the lesson, forge or gym (they are reachable only through title buttons); the forge screen is a single scroll; lessons and cards are not wired into progression.
- Verified: `npm run lint` (2 existing warnings), `typecheck`, `npm test` (405 pass), `npm run build`, `build:pages`; `tour.mjs` on the static export: no console errors, no horizontal overflow at either size; screenshots reviewed.
- CI/deploy: `gh` is unavailable in this environment, so CI and the Pages deploy were not confirmed (the Actions quota period ended 2026-11-01).
- Next: B11b.

## 2026-11-04: B11b1 Overworld doors to Forge and Gym
- Split B11b into B11b1 (done) and B11b2 (lesson entry, progression wiring). Maps gained `doors` (`DoorDef`: tile, href, label, tag; validated by `parseMap`); `tickWorld` raises a `door` event when a step ends on a door tile; `WorldCanvas` shows the toast, navigates with the router and draws FORGE/GYM tags above the doors. Mainville: north house door -> `/forge/`, west house door -> `/gym/`. GDD unchanged.
- Verified: `npm run lint` (2 existing warnings), `typecheck`, `npm test` (407 pass), `build`, `build:pages`; new `scripts/smoke-doors.mjs` on the static export at desktop and iPhone 14: both doors navigate, no page errors. Screenshots: tags readable, doors visible.
- CI/deploy: `gh` is unavailable here, so not confirmed.
- Known gaps: no lesson entry point yet; Forge/Gym have no door back to the map beyond their own links.
- Next: B11b2.

## 2026-11-04: B11b2 The Academy (`/learn`) and lesson progress
- Added a third Mainville building (east house, LEARN door at 12,5) leading to `/learn/`; the villager moved to keep the path clear; a LEARN button on the title. `components/LessonsScreen.tsx` lists the 12 lessons (section, summary, Read/Next/New chip, "N of 12 lessons read · up next") and opens `LessonScreen`; reaching the practice page fires the new `onComplete` and persists `lesson:<id>:done` in the core save flags via pure `lib/lessons/progress.ts` (idempotent; `nextLesson` follows curriculum order).
- Verified: `npm run lint` (2 existing warnings), `typecheck`, `npm test` (409 pass, native g++), `npm run build`, `build:pages`; new `scripts/smoke-learn.mjs` on the static export at desktop and iPhone 14 (walk to the door, read a lesson through, progress survives reload, no console errors, no overflow); `smoke-doors.mjs` still passes. Screenshots: LEARN tag and door readable, list readable on mobile.
- CI/deploy: `gh` is unavailable here, so Actions status was not confirmed.
- Known gaps: cards practised inside lessons and the forge do not feed SRS yet (C1); the gym is not gated on lessons.
- Next: B11c (slice review entry in PROGRESS.md).

## 2026-11-04: B11c Slice review (B11 complete)
- `scripts/tour.mjs` now includes `/learn`; reference shots in `docs/slice/` refreshed (title, play, learn, forge, gym, dev pages; desktop and iPhone 14), shot from the static export served under `/algo-clash`.
- **Slice review.** Feels good: the title's Start/Learn/Gym/Forge hub; Mainville with FORGE/GYM/LEARN doors; the pixel UI and 44 px targets on iPhone; the gym with Warden Brace and the evolution scene; audio dock on every page.
- Feels weak / next: lesson, forge and gym progress are not yet linked (the gym is not gated on lessons; cards do not feed SRS, so C1 is next); the party and Vectorling are not used in battles; one region only; the overworld has no NPC quest pointing at the Academy; audio unverified by ear; the Forge is one long scroll.
- Verified: `npm run lint` (2 existing warnings), `typecheck`, `npm test` (409 pass, native g++), `npm run build`, `build:pages`; `tour.mjs`: no console errors, no horizontal overflow at either size; screenshots reviewed. No new content, so `content:verify` unchanged.
- CI/deploy: `gh` is unavailable here, so not confirmed.
- Next: C1 (SRS and mastery).

## 2026-11-04: C1 SRS and mastery
- Added `lib/srs/` (pure, clock-free): `scheduler.ts` (six tiers unseen→ingrained, `applyAttempt`, `markSeen`, `dueItems`; only due unassisted solves count as spaced, assisted solves reschedule +1 day without advancing, failed reviews lapse one tier), `rust.ts` (rust levels 0-2, ×1.25 multiplier cap), `aggregate.ts` (item score, weighted pattern mastery, Structling level = avg move mastery × 10). Save schema: `MasteryState` widened (legacy `solved`/`rusty` normalised by `tierOf`), optional `spacedSolves`/`firstSolvedAt` sanitised; no version bump needed. GDD §6.2 updated with the exact rules.
- Verified: `npm run lint` (2 existing warnings), `typecheck`, `npm test` (424 pass, 15 new in `tests/srs.test.ts` incl. 300 seeded random-history property runs), `npm run build`, `build:pages`. No visual change, so no screenshots; `content:verify` unchanged (no content).
- CI/deploy: `gh` is unavailable here, so Actions/Pages status was not confirmed.
- Known gaps: nothing calls `applyAttempt` yet (battle/forge/lesson wiring and the sprite rust overlay land with C2/C3/C5); the Interview ×1.25 mastery weight is not modelled.
- Next: C2 (Daily Rift).

## 2026-11-04: C2a Daily Rift planner
- Added pure `lib/rift/` (`planRift`, `advanceStreak`, `visibleStreak`, `riftReward`, cleared-room bitmask helpers): a deterministic five-room plan seeded by the UTC day (round-robin due reviews, blitz cards, frontier problem, debug card, optional bonus hard). GDD §6.3 updated with the exact rules. Split C2 into C2a (done) and C2b (the `/rift` screen).
- Verified: `npm run lint` (2 existing warnings), `typecheck`, `npm test` (433 pass, 9 new in `tests/rift.test.ts`), `npm run build`, `build:pages`. No visual change, so no screenshots; no new content, so `content:verify` unchanged.
- CI/deploy: `gh` is unavailable here, so Actions/Pages status was not confirmed.
- Known gaps: no UI yet; the card catalog has no `debug` cards tagged, so room 4 is empty until C2b tags the compilerError cards.
- Next: C2b.

## 2026-11-04: C2b Daily Rift screen
- Added `lib/rift/progress.ts` (`applyRoomClear` pays the Bits difference once and advances the streak on completion; `applyRiftProblem` feeds `applyAttempt`), `components/RiftScreen.tsx` + `app/rift/page.tsx` (day, streak, today's earnings, five room cards, Enter/Cleared/skipped states; card rooms via `CardBattle`, problem rooms via `BattleArena`), and a DAILY RIFT button on the title. Debug room = the `compilerError` cards. GDD §6.3 updated; new box C2c (full problem catalog).
- Verified: `npm run lint` (2 existing warnings), `typecheck`, `npm test` (436 pass), `npm run build`, `build:pages`; new `scripts/smoke-rift.mjs` on the static export at desktop and iPhone 14 (blitz room cleared with all five card kinds, 10 Bits paid, persisted over reload, no console errors, no overflow). Screenshots reviewed: readable, 44 px targets.
- Known gaps: the problem rooms (fresh/reviews/bonus) were not driven end to end in the browser (they need the WASM compiler) and can only serve the two gym-kit problems until C2c; no completion fanfare screen yet; per-problem seconds are passed as 0.
- CI/deploy: `gh` is unavailable here, so CI and the Pages deploy were not confirmed.
- Next: C2c.

## 2026-11-04: C2c Rift problem catalog
- `npm run catalog:gen` (`scripts/gen-catalog.mjs`) writes `content/gyms/catalog.ts`: every problem package (26 across R0/R3/R6) with its meta, embedded `problem.md` statement and lazy `tests.json`. New pure `lib/judge/starter.ts` builds editor starters from the driver spec. `RiftScreen` now plans from the full catalog (real region, difficulty, prerequisites), builds the battle from it, and passes real elapsed seconds and the problem's `parSeconds` to `applyRiftProblem`. Foe level follows difficulty (E 8, M 18, H 30). Gym kits are unchanged.
- Verified: `npm run lint` (2 existing warnings), `typecheck`, `npm test` (440 pass, 4 new in `tests/catalog.test.ts` incl. a stale-catalog check), `npm run build`, `build:pages`; `smoke-rift.mjs` on the static export at desktop and iPhone 14: all checks ok, no console errors, no overflow; iPhone screenshot reviewed. `content:verify` unchanged (no new content).
- CI/deploy: Actions quota note no longer applies (after 2026-11-01), but `gh` is unavailable here, so CI/Pages status was not confirmed.
- Known gaps: problem rooms still not driven end to end in the browser (need WASM compile); after adding a problem, run `npm run catalog:gen` (the test fails if stale).
- Next: C3 (party and moves).

## 2026-11-04: C3 Party, move loadouts and Structdex
- Added `content/moves.ts` (one move per scroll, mastery tied to the scroll's problem), `content/structlings.ts` (Arrayling, Vectorling), pure `lib/party/loadout.ts` (equip/unequip, max 4 moves, unlearned moves refused, ghost moves ignored) and `lib/party/dex.ts` (evolution lines, current form, Structdex status). Save gained optional `loadouts` (sanitised, no version bump). New `/party` screen (party & moves tab with sprite, level from `structlingLevel`, 4 slots; Structdex tab with silhouettes for unmet species) and a PARTY & DEX title button. GDD §5.2 notes the saved loadout.
- Verified: `npm run lint` (2 existing warnings), `typecheck`, `npm test` (450 pass), `npm run build`, `build:pages`; new `scripts/smoke-party.mjs` on the static export at desktop and iPhone 14: all ok, no console errors, no overflow; screenshots reviewed (readable, 44 px targets). No new problems, so `content:verify` unchanged.
- CI/deploy: `gh` is unavailable here, so Actions/Pages status was not confirmed.
- Known gaps: equipping was not driven in the browser (needs an inscribed scroll in IndexedDB; covered by unit tests); only one move and one party member exist so far; moves are not yet used in battle Strategise.
- Next: C4 (Debrief and Solution Journal).

## 2026-11-04: C4a Journal logic and storage
- Split C4 into C4a (done), C4b (catalog embeds editorial + reference; Debrief after a win) and C4c (`/journal` screen). New pure `lib/journal/`: `editorial.ts` (section parser, debrief ordering, innerHTML-free inline tokenizer), `diff.ts` (LCS line diff + stats), `entry.ts` (`JournalEntry`, sanitiser, search by id/title/pattern/code, `previousEntry`). Save: `journal` store (IndexedDB v2 upgrade branch, `addJournal`/`listJournal` on the backend, `SaveService.recordJournal/journal`, included in export/import; older exports without it still import).
- Verified: `npm run lint` (2 existing warnings), `typecheck`, `npm test` (462 pass; new `tests/journal.test.ts` parses all 26 shipped editorials into the 8 house sections, 200-case diff reconstruction property test, persistence round trip), `npm run build`, `build:pages`. No visual change, so no screenshots; no new content, so `content:verify` unchanged.
- CI/deploy: `gh` is unavailable here, so Actions/Pages status was not confirmed.
- Known gaps: nothing writes journal entries yet (C4b); elaborative-prompt content format still to be defined (plan: optional `prompt.json` per problem, validated by a test).
- Next: C4b.

## 2026-11-04: C4b Debrief after a win
- Catalog now embeds each problem's `editorial.md`, reference `solution.cpp` and an optional `prompt.json` (elaborative question; authored for `cargo-total` and `crate-brackets`, validated by `promptIssues`). New pure `lib/journal/prompt.ts`. New `components/DebriefPanel.tsx`: time vs par, hearts left, quick-check question with explanation, collapsible line diff of your code vs the reference, and the editorial in debrief order. `BattleArena` shows the Debrief after a win for any catalog problem; Continue writes the journal entry (hints/assisted are 0/false until C5) and then reports the win to Gym/Rift.
- Verified: `npm run lint` (2 existing warnings), `typecheck`, `npm test` (466 pass), `npm run build:pages`; `smoke-gym.mjs` (updated to click through the Debrief) on the static export at desktop and iPhone 14: all pass, no console errors, no overflow; both Debrief screenshots reviewed (readable, 44 px targets). `content:verify` unchanged (no new problems).
- Env note: `npm ci` here installed only the musl SWC binary; `npm install --no-save --no-package-lock @next/swc-linux-x64-gnu@16.4.3` fixes `next build` locally.
- CI/deploy: `gh` is unavailable here, so Actions/Pages status was not confirmed.
- Known gaps: only 2 of 26 problems have an elaborative prompt; the Debrief is not shown for non-catalog problems; the journal entry is saved on Continue only.
- Next: C4c (`/journal` screen).

## 2026-11-04: C4c Solution Journal screen (C4 complete)
- New `/journal` page (`components/JournalScreen.tsx`): newest-first list of accepted solutions (title, UTC date, time, hints, assisted, patterns), search by problem/pattern/code, and per entry three views: your code, diff vs your previous attempt of the same problem, diff vs the reference. Empty state links to Gym/Rift. Shared `components/DiffView.tsx` now also renders the Debrief diff. JOURNAL button on the title.
- Verified: `npm run lint` (2 existing warnings), `typecheck`, `npm test` (466 pass), `build:pages`; new `scripts/smoke-journal.mjs` (seeds IndexedDB, checks list/search/both diffs/first-attempt note, no console errors, no overflow) and `smoke-gym.mjs` on the static export at desktop and iPhone 14: all pass; iPhone screenshot reviewed (readable, 44 px targets). No new content, so `content:verify` unchanged.
- CI/deploy: `gh` is unavailable here, so Actions/Pages status was not confirmed.
- Known gaps: journal entries have no delete/export button (export exists in the save service); no link from Debrief or map to the journal; no pagination for very long journals.
- Next: C5 (hints and items).

## 2026-11-05: C5a/C5b Items, Mart logic and the hint ladder
- New pure `lib/items/`: `hints.ts` (parse `hints.md` into the 3 rungs), `items.ts` (four items with prices and carry caps, `buy`/`consume`, one-time starter kit of 3 Hint Tokens, `isAssisted` rule, `applyCompassPenalty`, `rematchNow`). Save gained a sanitised `inventory` (no version bump). The catalog now embeds `hints.md`. `BattleArena` shows a `HintPanel` (collapsed by default; each rung costs one token read-modify-written to the save; the 3rd rung warns that the win becomes assisted) and reports `{hintsUsed, assisted}` to its caller and the journal. The Rift reloads the save after a battle (so spent tokens are not overwritten) and passes `assisted` into `applyRiftProblem`. GDD §6.6 updated.
- Verified: `npm run lint` (2 existing warnings), `typecheck`, `npm test` (477 pass incl. 11 new in `tests/items.test.ts`, which also asserts all shipped problems have a full ladder), `build:pages`; new `scripts/smoke-hints.mjs` (starter kit, 3 reveals, tokens persist over reload, no console errors, no overflow) and `smoke-rift.mjs`, `smoke-journal.mjs` on the static export at desktop and iPhone 14. The first screenshot showed the open ladder squeezing the editor to one line, so revealed hints now scroll in an 18dvh box; re-checked on iPhone. `smoke-rift.mjs` selector widened (today's card used `aria-label=choices` with `role=radiogroup`).
- CI/deploy: `gh` is unavailable here, so Actions/Pages status was not confirmed.
- Known gaps: Debug Lens and Complexity Compass are logic-only (no per-problem complexity data yet); Gym does not yet pass `assisted` into its mastery write; no Mart screen; the 3 starter tokens do not refill except via the Mart (C5c).
- Next: C5c (`/mart`).

## 2026-11-05: C5c Mart screen
- New `/mart` page (`components/MartScreen.tsx`): Bits balance, the four items with owned/cap, blurb, honest mastery cost and a buy button (disabled when too poor or full, with a status line explaining refusals). Persists the one-time starter kit on first visit; every purchase re-reads the save so tokens spent in a battle are not overwritten. MART button on the title. GDD §6.6 updated.
- Verified: `npm run lint` (2 existing warnings), `typecheck`, `npm test` (477 pass), `build:pages`; new `scripts/smoke-mart.mjs` on the static export at desktop and iPhone 14 (starter kit 3 tokens, seeded 100 Bits, three purchases, disabled states, persistence over reload, no console errors, no overflow). Both screenshots reviewed: readable, 44 px targets. No new content, so `content:verify` unchanged.
- CI/deploy: `gh` is unavailable here, so Actions/Pages status was not confirmed. Work was pushed to the session branch `claude/eloquent-ritchie-3toihf` (equal to main before this run).
- Known gaps: no Mart entry from the overworld town yet; Rematch Ticket has no UI to use it; items bought here are not yet consumed by Lens/Compass (C5d).
- Next: C5d (Debug Lens, Complexity Compass).
