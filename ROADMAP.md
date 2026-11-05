# Algo Clash roadmap

The hourly routine works top to bottom: take the **first unchecked box**. When you start a big item, split it into sub-boxes (a1, a2…) sized for one run each. Design references: `docs/GAME_DESIGN.md` (GDD §), `docs/CURRICULUM.md` (CUR §), `docs/ARCHITECTURE.md` (ARCH §).

**Definition of done for every box:** it works in the deployed build, it's covered by tests, it's verified by screenshots when visual, and it's noted in PROGRESS.md. A content box is done only when `npm run content:verify` passes for it.

---

## Phase A: Foundation

- [x] A1. **Scaffold from Query Clash** (reference clone at `/home/user/query-clash`):
  - Next.js 16 + React 19 + Pixi 8 + Tailwind 4, the PWA/service worker (keep the worker-fragment fix), the `ci.yml` + `pages.yml` workflows (basePath `/algo-clash`), and lint/typecheck/test/build/build:pages scripts.
  - Remove every Query/SQL/PGlite reference. Add `.gitignore`, the `.routine/` lock convention and a README.
  - The title screen and an empty `/play` render.
- [x] A2. **C++ toolchain spike** (ARCH §2.1): a `/dev/judge` page compiles and runs a STL-heavy LeetCode-style program in a worker using `@yowasp/clang`.
  - Measure download size, cold/warm compile time, memory, exceptions and stack size on desktop Chromium and Playwright iPhone 14 emulation.
  - Write `docs/adr/0001-cpp-runtime.md` with the numbers and the decision (including the mobile policy).
  - If it fails, try the fallbacks listed in ARCH §2.1 before deciding.
- [x] A3. **Judge core** (ARCH §2.2–2.3), split into sub-boxes:
  - [x] A3a. Pure TS: LC literal parser/printer (`lib/judge/lc.ts`) and verdict mapping (`lib/judge/verdict.ts`), unit-tested.
  - [x] A3b. C++ harness header (`ListNode`, `TreeNode`, graph `Node`, LC literal parsers/printers) and a generated `main` per problem, including the design-problem ops format; tested natively with g++ and clang++.
  - [x] A3c. Friendly clang-error table (first 40 errors, generated natively in tests) in `lib/judge/clangErrors.ts`.
  - [x] A3d. `judgeProblem()` wiring compile worker + run worker + verdicts, and a Playwright smoke test that compiles and judges one problem in Chromium.
- [x] A4. **Content pipeline** (GDD §8, ARCH §2.4), split into sub-boxes:
  - [x] A4a. Pattern taxonomy (`content/patterns.ts`), package types (`lib/content/types.ts`) and pure validators for meta, editorial, hints, statement and tests (`lib/content/validate.ts`), unit-tested.
  - [x] A4b. Package loader plus native runner (`lib/content/native.ts`): compile solution/brute/wrong with g++ via the harness, run tests, hash-cached in `.cache/`; seeded RNG for `gen.ts`.
  - [x] A4c. `npm run content:verify` (regenerate `tests.json`, stale check, 200-case stress vs brute, wrong solutions rejected) wired into Vitest.
  - [x] A4d. Three sample problems (E/M/H) that pass the pipeline, full packages.
  - the problem package format
  - `npm run content:verify` (native g++ compile, test generation, stress test reference vs brute, wrong solutions must fail, metadata and editorial validation) wired into Vitest
  - the pattern taxonomy (`content/patterns.ts`, matching CUR §3–5)
  - three sample problems that pass the pipeline
- [x] A5. **Editor and battle-code UI:**
  - [x] A5a. CodeMirror 6 C++ editor component (themes, font size, autocomplete toggle, mobile symbol toolbar) with pure settings/insert helpers in `lib/editor/`, unit-tested, shown on `/dev/editor`. (Vim option deferred to a later box.)
  - [x] A5b. Statement panel (markdown, examples, constraints-as-stats) and Run/Submit verdict panels with diffs wired to `judgeProblem`.
  - [x] A5c. Drafts autosave (throttled 5 s, flush on tab hide/unmount, restore on load).
  - CodeMirror 6 C++ editor (themes, font size, vim option, autocomplete toggle per mode, a mobile symbol toolbar)
  - statement panel (markdown, examples, constraints-as-stats)
  - Run (visible + custom tests) and Submit (hidden groups) with verdict panels and diffs
  - drafts autosave to IndexedDB
- [x] A6. **Save system:** IndexedDB schema v1 (profile, party, mastery, attempts, drafts, settings, flags), migrations, JSON export/import, and tests.

## Phase B: Vertical slice (first playable, about 30 minutes of play)

Goal: a new player can start a game, walk Mainville, get the starter, take the first lesson, win concept and coding battles, inscribe a scroll and beat the first gym, on desktop and iPhone.

- [x] B1. **Art: starter and town.** (B1a, B1b, B1c done)
  - [x] B1a. ARRAYLING front/back sprites with idle/attack/hurt/faint/evolve (64×64, shaded, 3–4 ramps), grid toolkit `game/sprites/grid.ts`, `/dev/sprites`
  - [x] B1b. Trainer overworld sprite (4-direction walk cycle) and Professor Iota's overworld sprite and portrait (`game/sprites/character.ts`)
  - [x] B1c. Mainville tileset: grass, paths, houses, lab, water, trees on `/dev/sprites`
- [x] B2. **Overworld engine** (B2a, B2b, B2c done):
  - [x] B2a. Pure logic: map format and validation, grid movement with turn/bump/warp/encounter events, interaction, tap-to-move BFS (`lib/overworld/`), dialogue scripts and runner with typewriter (`lib/dialogue/`), sample Mainville map and dialogue, 22 tests
  - [x] B2b. Rendering: `/play` canvas scene (camera follows player, smooth tile-to-tile walk with the B1b walk cycles, NPC sprites, animated water/tall grass), keyboard + on-screen d-pad + tap-to-move, warps between maps, encounter hook
  - [x] B2c. Pixel dialogue box with portraits (typewriter, tap to advance, choices), flags saved via `SaveService`, `faceBack` NPC turning
- [x] B3. **Battle stage** (ported from Query Clash and restyled):
  - [x] B3a. Stage canvas: meadow backdrop, platforms, slide-ins, HP boxes, hit-stop, shake, damage numbers and verdict stingers (`lib/battle/stagefx.ts`, `components/BattleStage.tsx`, `/dev/battle`)
  - [x] B3b. The typing text box, sprite-based move effects (not only lunges), faint/evolve plays, a battle wipe intro
  - [x] B3c. The desktop layout (stage on top, statement + editor below) and the mobile tab layout
- [x] B4. **Battle logic** (`lib/battle/`, GDD §5.3):
  - the Scout → Strategise → Code → Judge → Debrief state machine
  - the type multiplier from patterns, hearts, damage formula, faint/retreat, rematch list
  - unit tests for every transition
- [x] B5. **Concept-card battles:** MCQ, trace, predict-output, compiler-error, Parsons and cloze card UIs. Cards are graded by tests, and predict-output and compiler-error cards are generated natively.
  - [x] B5a. Card model, grading, deck/XP logic (`lib/cards/`), native g++ generation + verification of predict/trace/compiler-error/Parsons/cloze cards, seed cards in `content/cards/R0/`
  - [x] B5b. Card UIs (`components/CardBattle.tsx`, `/dev/cards`), keyboard and touch, Playwright smoke
- [x] B6. **Syntax Shores content, part 1** (CUR §2 S1–S2): the lesson screens, 30 cards and 10 judged exercises. Split:
  - [x] B6a. Five S1 judged exercises under `content/problems/R0/` (ledger-digits, wrap-dial, cargo-total, vowel-census, safe-midpoint), full packages.
  - [x] B6b. Five S2 judged exercises (toll-booth, charge-meter, shelf-rank, echo-chamber, pocket-calendar: control flow, break/continue, pass by const reference, recursion basics, `static`), full packages.
  - [x] B6c. S1 lesson screens (model + UI) and 15 S1 cards (generated natively).
  - [x] B6d. S2 lesson screens and 15 S2 cards.
- [x] B7. **Syntax Shores content, part 2** (CUR §2 S3–S4): the lesson screens, 30 cards and 12 judged exercises. Split:
  - [x] B7a. Five S3 judged exercises (grid-turn, run-squash, field-split, letter-tally, overlap-count: 2D vector shape, erase cost, split/substr, `c - 'a'` counting, `find` with a start position), full packages.
  - [x] B7b. Seven S4 judged exercises (struct with constructor and `operator<`, `ListNode`, `TreeNode`, `nullptr`, `class Solution`), full packages.
  - [x] B7c. S3 lesson screens and 15 S3 cards.
  - [x] B7d. S4 lesson screens and 15 S4 cards.
- [x] B8. **The Forge, v1** (GDD §6.4): the four tiers and the first scroll ("loop over a vector and accumulate with `long long`"), plus the Scroll UI. Split:
  - [x] B8a. Pure logic `lib/forge/` (scroll type, seeded cloze masks at 30 %/70 %, tier unlocking, trace pass rule, Ingrained rule), the first scroll (`content/scrolls/accumulate.ts`, judged by the `pouch-sum` package) with 5 natively computed trace cards, tests.
  - [x] B8b. `/forge` UI: scroll list with status, annotated Trace tier + 5 trace cards, Cloze 30/70 editors and the timed Blank tier judged by `judgeProblem`, progress saved via `SaveService`, smoke test at desktop and iPhone 14.
- [x] B9. **Mainville Gym:** a gym leader sprite (96×96, idle/attack/hurt/faint), the three-phase gym flow (GDD §5.5) with Syntax Shores content, a badge, and the victory and evolution scenes. Split:
  - [x] B9a. Pure logic `lib/gym/` (blitz, shield, head start, phase flow, retry/abandon) and the Syntax Shores gym content `content/gyms/r0.ts`, with tests.
  - [x] B9b. Warden Brace leader sprite (96×96, idle/attack/hurt/faint) on `/dev/sprites`, plus the gym backdrop.
  - [x] B9c. Gym UI (`/gym`): intro, blitz screen with 20 s timer and shield, phases 2 and 3 via the coding battle (twist: -Werror), retry/retreat, badge persisted in the save, smoke test.
  - [x] B9d1. Warden Brace and the lighthouse backdrop on the battle stage itself (`BattleStage scene="gym"`), and links to `/gym` and `/forge` from the title.
  - [x] B9d2. The victory scene and the Arrayling evolution animation (white-silhouette morph) after the badge.
  - (original B9d text) Gym polish: Warden Brace and the lighthouse backdrop on the battle stage itself (replace the recoloured Arrayling foe), the victory scene and the Arrayling evolution animation, a link to `/gym` from the title/overworld.
- [x] B10. **Audio v1:** the WebAudio synth, a Mainville theme, a battle theme and SFX (menu, hit, AC, WA, TLE, CE, level-up), with volume settings.
- [x] B11. **Vertical-slice polish pass:**
  - [x] B11a. Screenshot tour of every player-facing screen (`scripts/tour.mjs`, desktop + iPhone 14), fix overlap of the sound button with page headers, save reference shots in `docs/slice/`.
  - [x] B11b1. Mainville doors lead to the Forge and the Gym (`doors` in map defs, FORGE/GYM tags, `scripts/smoke-doors.mjs`).
  - [x] B11b2. Academy (`/learn`) with a Mainville LEARN door, lesson progress saved in flags. (rest of B11b: lesson door/NPC and wiring lessons and cards into progression.) Original: play the slice end to end from a fresh save (title → Mainville → lesson → forge → gym → evolution) and fix flow gaps: link the overworld to the lesson, forge and gym; wire lessons and cards into progression.
  - [x] B11c. Slice review entry in PROGRESS.md after B11b.
  - play the whole slice from a fresh save via Playwright on desktop and iPhone 14, screenshot every screen, fix rough edges
  - record a playthrough GIF or screenshots in `docs/`
  - write a short "slice review" entry in PROGRESS.md (what feels good, what doesn't)

## Phase C: Core systems

- [x] C1. **SRS and mastery** (`lib/srs/`, GDD §6.2): states, intervals, assisted handling and rust (sprite rust overlay + multiplier cap). Property tests.
- [x] C2a. **Daily Rift planner** (GDD §6.3): pure `lib/rift/` seeded five-room plan, streak and rewards, with tests.
- [x] C2b. **Daily Rift screen:** `/rift` page (room list, play each item via the existing battle/card screens, streak counter, rewards written to the save), a door or title button, and applying `applyAttempt` to the SRS state.
- [x] C2c. **Rift problem catalog:** a bundled catalog of every R0/R3/R6 problem (statement, starter, spec, lazy tests) so Rift rooms 1, 3 and 5 can serve more than the two gym kits; Interview-style timing passed to `applyRiftProblem`.
- [x] C3. **Party and moves:** `/party` screen with a 4-slot move loadout per Structling, moves learned by inscribing Forge scrolls, and the Structdex. (Lesson-gated moves and multi-Structling parties land when more species and scrolls exist.)
- [x] C4. **Debrief and Solution Journal:** the editorial renderer (GDD §8.3), elaborative prompt, journal with diffs (yours vs past, yours vs reference).
  - [x] C4a. Pure `lib/journal/` (editorial parser, line diff, journal entry sanitiser), a `journal` store in the save backend (IndexedDB v2, export/import), with tests.
  - [x] C4b. Catalog embeds editorial + reference solution; Debrief screen after a win (editorial, elaborative prompt, journal save) in `BattleArena`.
  - [x] C4c. `/journal` screen: search by pattern, diff yours vs past attempt and vs reference.
- [x] C5. **Hints and items:** the 3-rung hint ladder, the Mart, Bits economy, Debug Lens, Complexity Compass and Rematch Ticket, all with the mastery rules from GDD §6.6.
  - [x] C5a. Pure `lib/items/` (hint parser, item catalog, buy/consume, starter kit, assisted rule, Compass penalty, Rematch), save `inventory`, tests.
  - [x] C5b. Hint ladder in the battle (Hint Tokens spent from the save, assisted wiring to the Rift SRS and the journal), `HintPanel`, `smoke-hints.mjs`.
  - [x] C5c. `/mart` screen (buy items with Bits, inventory) and a title button.
  - [x] C5d. Per-problem `complexity` in `meta.ts` (validated against the editorial's Optimal section) and the Complexity Compass in the battle (cuts the tier gained by one in the Rift's SRS write). The Gym has no mastery write yet, so nothing to wire there.
  - [x] C5e. Debug Lens: reveal one failing input (from the last failed test), marks the win assisted; Rematch Ticket use on the Rift screen.
- [ ] C6. **Scaffolding modes** (GDD §6.5): Guided, Standard, Interview and Contest, including "write your own tests before submitting" in Interview mode and the edge-case-class coverage scoring.
- [ ] C7. **Scout School** (CUR R1 + §5): lessons, the constraint table, recognition blitz cards (first 60 statements), and the complexity/recurrence solver with tests.
- [ ] C8. **Trainer Card / Readiness Report** (GDD §9): gates, radar, calibration, WA-cause histogram and "next best action".
- [ ] C9. **Visualiser framework** (CUR §6), plus the first two: the array/sort stepper and the two-pointer/window animator.

## Phase D: Regions (repeat the region recipe for each)

**Region recipe.** Split each region into these boxes as you reach it:
1. Art: the region's Structling/evolution, 2 trainer sprites, the gym leader (96×96), tileset, battle backdrop, overworld map.
2. Lesson screens + C++ Corner.
3. Cards: about 40, including a recognition blitz set.
4. Problems, in batches of 4–6 (E → M → H ladder from CUR §3), each passing `content:verify`.
5. Forge scrolls for the region (CUR §4).
6. Visualiser(s).
7. Gym with its signature mechanic (GDD §5.5).
8. Dialogue, story beat and region music.

- [ ] D1. Array Atoll (CUR R2)
- [ ] D2. Window Woods (R3)
- [ ] D3. Hashwood Harbor (R4)
- [ ] D4. Stackspire (R6)
- [ ] D5. Chainlink Caves (R5), with LRU Cache
- [ ] D6. Recursion Ruins (R7)
- [ ] D7. Bisect Bay (R8), with the interactive-judge mode for the Bisect Sage
- [ ] D8. Sorting Steppes (R9)
- [ ] D9. Treetop Grove (R10)
- [ ] D10. Heap Highlands (R11)
- [ ] D11. Mid-game set piece: Team Undefined admin *Segfault* (a debugging gauntlet) and the Team Undefined debugging encounter type (GDD §5.1)
- [ ] D12. Trie Thicket (R12)
- [ ] D13. Web Wilds (R13), with the graph editor visualiser
- [ ] D14. Union Isles (R14)
- [ ] D15. Pathfinder Plains (R15)
- [ ] D16. Backtrack Labyrinth (R16)
- [ ] D17. Memo Mountains I–III (R17), with the DP table visualiser and the "state before code" mechanic
- [ ] D18. Memo Mountains IV–V (R17)
- [ ] D19. Greedy Gulch (R18), with counterexample-hunting battles
- [ ] D20. Interval Isthmus (R19)
- [ ] D21. Bitwise Barrens (R20)
- [ ] D22. Mid-game set piece: admin *Data Race*
- [ ] D23. Advanced Citadel (R21)
- [ ] D24. Design-flavoured DS side quests (R22)

## Phase E: Endgame and interview transfer

- [ ] E1. **Rival ghost runs** (GDD §5.4) and Vex's story beats.
- [ ] E2. **Arena:** contest generator (E/M/M/H from mastered regions), 90-minute timer, rating system with tests, seasons.
- [ ] E3. **Interview Tower floors 1–3** (GDD §5.6): clarify menu with constraint reveals, think-aloud checkpoints, blank editor, own-tests coverage, follow-ups, a four-dimension scorecard with hire decisions.
- [ ] E4. **Interview Tower floor 4, the AI-assisted onsite:** a multi-file C++ codebase viewer, the scripted deterministic assistant panel (labelled simulated), phases bug-fix → implement → optimise, scored on verification.
- [ ] E5. **Interview Tower floor 5 (bar raiser) and the ending:** The Panel boss, credits, "The Offer".
- [ ] E6. **New Game+ (Hard Mode):** Interview-mode only, hidden-only verdicts, tighter pars. The Endless Rift.
- [ ] E7. **Study plans:** 4/8/12-week tracks mapped to regions, with daily targets on the title screen.
- [ ] E8. **Cheat-sheet library:** printable pattern sheets and C++ STL reference, generated from the scroll references.

## Phase F: Polish and depth (ongoing once A–E are done)

- [ ] F1. Accessibility audit (keyboard paths, ARIA, colour contrast, reduced motion), with fixes.
- [ ] F2. Performance pass (bundle size, texture atlases, toolchain caching, compile speed-ups from ARCH §2.1).
- [ ] F3. README with screenshots of every region and boss, plus a content-authoring guide.
- [ ] F4. Content depth: top up every pattern to at least 12 problems and every region to 60 cards, using weak-pattern data from playtesting notes.
- [ ] F5. Revisit the art of early regions against the latest quality bar.
