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
- [ ] A3. **Judge core** (ARCH §2.2–2.3; read ADR 0001 first: no exceptions, recursion depth ≤ ~4,000 in tests, `-O1`):
  - compile worker + run worker with timeout
  - the `bits/stdc++.h` shim
  - LeetCode harness (ListNode, TreeNode, graph Node, LC literal parsers and printers, the design-problem operations format)
  - verdicts AC/WA/TLE/RE/CE and the friendly clang-error table (first 40 errors, generated natively in tests)
  - unit tests for the parsers/printers and the verdict mapping, and a Playwright smoke test that compiles and judges one problem in Chromium
- [ ] A4. **Content pipeline** (GDD §8, ARCH §2.4):
  - the problem package format
  - `npm run content:verify` (native g++ compile, test generation, stress test reference vs brute, wrong solutions must fail, metadata and editorial validation) wired into Vitest
  - the pattern taxonomy (`content/patterns.ts`, matching CUR §3–5)
  - three sample problems that pass the pipeline
- [ ] A5. **Editor and battle-code UI:**
  - CodeMirror 6 C++ editor (themes, font size, vim option, autocomplete toggle per mode, a mobile symbol toolbar)
  - statement panel (markdown, examples, constraints-as-stats)
  - Run (visible + custom tests) and Submit (hidden groups) with verdict panels and diffs
  - drafts autosave to IndexedDB
- [ ] A6. **Save system:** IndexedDB schema v1 (profile, party, mastery, attempts, drafts, settings, flags), migrations, JSON export/import, and tests.

## Phase B: Vertical slice (first playable, about 30 minutes of play)

Goal: a new player can start a game, walk Mainville, get the starter, take the first lesson, win concept and coding battles, inscribe a scroll and beat the first gym, on desktop and iPhone.

- [ ] B1. **Art: starter and town.**
  - ARRAYLING front/back sprites with idle/attack/hurt/faint/evolve (64×64, original, shaded, 3–4 ramps)
  - the trainer overworld sprite (4-direction walk cycle)
  - Professor Iota's portrait and overworld sprite
  - the Mainville tileset (grass, paths, houses, lab, water, trees) on `/dev/sprites`
- [ ] B2. **Overworld engine:** tile map format, camera, collision, 4-direction movement (keyboard, d-pad and tap-to-move on mobile), NPC interaction, warps between maps, encounter zones, and a pixel dialogue box with portraits (dialogue scripts in `lib/dialogue/`).
- [ ] B3. **Battle stage** (ported from Query Clash and restyled):
  - platforms, slide-ins, HP boxes, the typing text box, hit-stop, shake, damage numbers and verdict stingers
  - the desktop layout (stage on top, statement + editor below) and the mobile tab layout
- [ ] B4. **Battle logic** (`lib/battle/`, GDD §5.3):
  - the Scout → Strategise → Code → Judge → Debrief state machine
  - the type multiplier from patterns, hearts, damage formula, faint/retreat, rematch list
  - unit tests for every transition
- [ ] B5. **Concept-card battles:** MCQ, trace, predict-output, compiler-error, Parsons and cloze card UIs. Cards are graded by tests, and predict-output and compiler-error cards are generated natively.
- [ ] B6. **Syntax Shores content, part 1** (CUR §2 S1–S2): the lesson screens, 30 cards and 10 judged exercises.
- [ ] B7. **Syntax Shores content, part 2** (CUR §2 S3–S4): the lesson screens, 30 cards and 12 judged exercises.
- [ ] B8. **The Forge, v1** (GDD §6.4): the four tiers and the first scroll ("loop over a vector and accumulate with `long long`"), plus the Scroll UI.
- [ ] B9. **Mainville Gym:** a gym leader sprite (96×96, idle/attack/hurt/faint), the three-phase gym flow (GDD §5.5) with Syntax Shores content, a badge, and the victory and evolution scenes.
- [ ] B10. **Audio v1:** the WebAudio synth, a Mainville theme, a battle theme and SFX (menu, hit, AC, WA, TLE, CE, level-up), with volume settings.
- [ ] B11. **Vertical-slice polish pass:**
  - play the whole slice from a fresh save via Playwright on desktop and iPhone 14, screenshot every screen, fix rough edges
  - record a playthrough GIF or screenshots in `docs/`
  - write a short "slice review" entry in PROGRESS.md (what feels good, what doesn't)

## Phase C: Core systems

- [ ] C1. **SRS and mastery** (`lib/srs/`, GDD §6.2): states, intervals, assisted handling and rust (sprite rust overlay + multiplier cap). Property tests.
- [ ] C2. **Daily Rift** (GDD §6.3): the seeded five-room dungeon, streak counter and rewards.
- [ ] C3. **Party and moves:** a party screen, a move loadout (4 per Structling), and learning moves via lessons + the Forge. The Structdex.
- [ ] C4. **Debrief and Solution Journal:** the editorial renderer (GDD §8.3), elaborative prompt, journal with diffs (yours vs past, yours vs reference).
- [ ] C5. **Hints and items:** the 3-rung hint ladder, the Mart, Bits economy, Debug Lens, Complexity Compass and Rematch Ticket, all with the mastery rules from GDD §6.6.
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
