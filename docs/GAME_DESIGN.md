# Algo Clash: Game Design Document

> A handheld-style creature RPG where every battle is a real interview problem. You win by recognising the pattern, choosing the right data structure, and **writing the C++ by hand**, which a real compiler then judges against hidden tests.

Owner: Anmol Pawa. Built by an hourly routine (see `CLAUDE.md`). This document is the source of truth for *what the game is*. `docs/CURRICULUM.md` is the source of truth for *what it teaches*. `docs/ARCHITECTURE.md` covers *how it is built*. When this document and the code disagree, fix the code or update this document in the same commit.

---

## 1. Vision and success criteria

**Player promise.** Finish the main story and the Interview Tower, and you can:

1. Read an unseen LeetCode-style problem and name the pattern(s) and target complexity from its constraints and wording within about 2 minutes.
2. Write a correct, idiomatic C++17/20 solution **from a blank editor with no autocomplete**: medium in ≤ 25 minutes, hard in ≤ 45 minutes.
3. Write every core template (BFS, Dijkstra, DSU, binary search on answer, monotonic stack, sliding window, segment tree…) from memory in under 5 minutes.
4. Test your own code with edge cases, state and defend its complexity, and handle interview follow-ups ("now do it in O(1) space", "now the input is a stream").

**Measurable readiness gates** (shown on the Readiness Report, §9):

| Gate | Threshold |
|---|---|
| Pattern recognition | ≥ 90 % accuracy on 50 unseen statements, ≤ 20 s each |
| Medium solve rate | ≥ 80 % of a fresh 20-medium sample, unassisted, ≤ 25 min each |
| Hard solve rate | ≥ 40 % of a fresh 10-hard sample, unassisted, ≤ 45 min each |
| Templates | every Core scroll at **Ingrained** (§6.4) |
| Mock interviews | three consecutive Interview Tower mocks scored *Hire* or better |

**Design pillars** (every feature must serve at least one, and none may undermine another):

1. **Recognition before recall.** Every coding fight opens with reading the problem and naming the pattern from its signals.
2. **Your hands write the code.** Solutions are never pasted in. Templates are earned by writing them from memory. Ranked modes have no autocomplete.
3. **Honest difficulty, real judge.** Real LC-medium/hard difficulty, compiled C++ with hidden tests, real time limits. No fake success.
4. **Game first in feel, learning first in substance.** Overworld, party, story, bosses, juice, but every mechanic maps to a learning behaviour. Nothing rewards grinding without learning.
5. **Mastery decays unless reviewed.** Spaced repetition is part of the fiction: moves rust.

**Anti-goals.** No pay-to-skip. Currency never buys mastery. No streak guilt mechanics beyond a gentle streak counter. No multiplayer or backend. No copying of LeetCode, GeeksforGeeks or book text.

---

## 2. Target player and session design

- **Primary player:** a working software engineer (C++ beginner to intermediate) preparing for SDE / AI-engineer loops at FAANG, big tech, top startups and remote-first companies, with 1–2 hours a day over about 12 weeks.
- **Platforms:** desktop browser (primary for coding) and iPhone PWA (recognition drills, concept battles, reviews, Parsons and cloze code, reading editorials). Full code battles work on mobile with a symbol toolbar, but the game never *requires* mobile coding.
- **Session shapes:**
  - *10-minute session:* the Daily Rift (review queue plus one fresh problem) → collect rewards.
  - *45-minute session:* one story beat (lesson → 2–3 trainer battles) or one gym.
  - *90-minute session:* Arena contest or a full Interview Tower mock.
- Every screen must be resumable; drafts autosave every 5 seconds.

---

## 3. World, story and tone

**Setting:** the Archipelago of Algor, islands of living data. The **Great Compiler** that keeps the islands consistent has been corrupted by **Team Undefined**, whose grunts embody classic bugs. Tone: warm, witty, handheld-RPG. Dialogue is short, never patronising, and occasionally funny about real engineering pain.

**Cast** (all original):

- **You:** a new Trainer from Mainville.
- **Professor Iota:** mentor and lesson-giver. Her lab is the hub.
- **Vex:** the rival. Appears at story beats with a "ghost run" of the same problem (§5.4).
- **Gym Masters:** one per region, each a personality built around a pattern (e.g. the Pane Warden of Window Woods, impatient and obsessed with O(n)).
- **Team Undefined:** grunts *Off-By-One*, *Overflow*, *Dangler* and *Iterator Invalidator*; admins *Segfault* and *Data Race*; leader *The Undefined*.
- **The Panel:** the final boss inside the Interview Tower. Five interviewers, each with a rubric.

**Story arc (main quest):** Mainville → restore the Compiler Shards held by Gym Masters (one badge per region) → defeat Team Undefined's admins in two mid-game set pieces → the Advanced Citadel → the Interview Tower (five floors: phone screen, two coding onsites, one AI-assisted onsite, bar raiser) → ending: "The Offer". Post-game: Contest Ladder seasons, Hard Mode New Game+, and the Endless Rift.

---

## 4. Core loops

```
MICRO (one battle, 1–45 min):   Scout → Strategise → (Plan) → Code → Judge → Debrief
SESSION (10–90 min):           Daily Rift reviews → story beat / gym / forge / arena → rewards
META (weeks):                  regions & badges → pattern mastery map → Tower floors → Offer → NG+
```

The **micro loop is the game**, and it is specified in §5. The session loop is driven by the **Daily Rift** (§6.3). The meta loop is driven by the **Region DAG** (§7) and the **Readiness Report** (§9).

---

## 5. Battles

### 5.1 Encounter types

| Type | Length | Content | Purpose |
|---|---|---|---|
| **Wild encounter** | 30–90 s | Concept card: MCQ, trace-the-output, complexity, predict-output, spot-the-bug, read-the-compiler-error, Parsons (order lines), cloze (fill blanks in code) | Fast retrieval practice; XP |
| **Trainer battle** | 10–45 min | One coding problem (full micro loop) | Core skill |
| **Gym battle** | 30–60 min | Three phases (§5.5) | Region mastery gate |
| **Rival battle** | 15–45 min | Coding problem vs Vex's ghost run | Speed and benchmark |
| **Team Undefined battle** | 5–20 min | Debugging: buggy C++ to fix until the tests pass | Debugging fluency |
| **Arena** | 90 min | Contest: 4 problems (E/M/M/H), rating | Interleaving under time pressure |
| **Interview Tower** | 45–60 min | Mock interview (§5.6) | Transfer to real interviews |

### 5.2 Party, moves and the type chart

- **Structlings** are creatures that embody data structures: *Arrayling* (starter: array/string), *Hashkit* (hash map/set), *Chainwyrm* (linked list), *Stackbeetle* (stack/queue/deque), *Heapling* (heap), *Sproutree* (tree/BST), *Triebloom* (trie), *Webweaver* (graph), *Unislime* (DSU), *Memoth* (DP), plus *Bitimp* (bits) and *Segtitan* (segment tree), unlocked in the late game.
- A party holds up to **6 Structlings**, each with up to **4 equipped moves**. Moves are algorithms or patterns (*Two Pointers*, *Sliding Window*, *Prefix Hash*, *Monotonic Stack*, *BFS*, *Topo Sort*, *Dijkstra*, *Binary Search on Answer*, *Knapsack*, *Backtrack*…).
- **The limited loadout is pedagogical:** before a gym you must choose which patterns to carry, which is itself a pattern-recognition exercise.
- **Learning a move:** finish the regional lesson (Professor Iota or the Gym Master), then **inscribe the scroll at the Forge** (§6.4). An uninscribed move can't be equipped.
- **Type chart:** each problem carries hidden *pattern types* (from `meta.patterns`) and *signals*. Choosing a Structling + move that matches a correct pattern is **super effective (×1.5)**, a valid but suboptimal approach is **neutral (×1.0)**, and a non-working approach is **not very effective (×0.5)**. The foe then shows a counterexample input on which that approach fails, which is a teaching moment. Multiple correct patterns are allowed (e.g. a heap or quickselect for k-th largest).

### 5.3 The coding battle (micro loop, precisely)

1. **Scout (free).** The foe's sprite and nameplate show the problem title. The **statement panel** shows the original problem text, examples and **constraints as the foe's stats** (e.g. `n ≤ 10⁵` rendered as an HP-like bar labelled "Size", with the complexity budget hint unlocked by the *Complexity Compass* item or by Scout School mastery).
2. **Strategise (≤ 2 min, optional in Practice).** Pick a Structling, a move and a target complexity (O(n), O(n log n), …). Then rate your **confidence** (1–5), which feeds calibration stats. The result is the multiplier from §5.2. Skipping strategy is allowed but forfeits the multiplier and gives ×1.0.
3. **Plan (hards and DP only).** A short structured step: e.g. for DP, define the state, transition, base case and answer cell (picked from options or typed in a constrained form). For greedy, choose the exchange-argument claim. Correct plan = +10 % damage and protects against one wrong submission.
4. **Code.** A CodeMirror 6 C++ editor shows the LeetCode-style signature (`class Solution { public: … };`). TreeNode and ListNode are provided, and `#include <bits/stdc++.h>` works via a shim.
   - **Run** compiles and runs the visible examples plus *your own custom tests*. Runs are free in Practice and Standard. In Interview mode the number of runs is tracked.
   - **Submit** runs the hidden test groups.
5. **Judge.** Real verdicts: **AC, WA, TLE, RE (with signal or abort reason), MLE (if measurable), CE**. Compiler errors are shown raw *and* with a friendly explanation for the 40 most common clang errors.
   - Each hidden **test group** (basic, edge, adversarial, performance) that passes deals damage weighted by group (e.g. 25/25/20/30) × multiplier × hint factor.
   - A failing submission is the **foe's counterattack**: you lose 1 of your **5 hearts**, and the first failing input is revealed (Standard), or only its group and a one-line description (Interview/Hard Mode: *"WA on edge group: all elements equal"*).
   - **0 hearts = faint:** you retreat, the problem goes to the **Rematch list** (due tomorrow in the SRS), and the editorial becomes available. Reading it marks the problem *assisted*.
6. **Debrief.** The victory screen shows XP, Bits, mastery change, time vs **par**, hearts left and multiplier, followed by the **editorial** (§8.3): brute force → better → optimal, why the pattern fits (signals), complexity proof sketch, C++ notes, common bugs, follow-ups and similar problems.
   - The player answers a single **elaborative prompt** ("Why can't a plain hash map give O(1) for *ordered* queries here?") by picking from options. This is cheap and reinforces understanding.
   - The solution is saved to the **Solution Journal** (with the date, time taken and whether assisted).

**Damage formula** (tune in one module `lib/battle/damage.ts`, unit-tested):

`damage = Σ_passed_groups(weight) × typeMultiplier × (1 − 0.15·hintsUsed) × timeBonus` with `timeBonus = 1.1` if under par, `1.0` if under 2× par, otherwise `0.9`. A foe at ≤ 0 HP faints. Full AC always defeats the foe regardless of multipliers (correctness is never punished). The multipliers affect XP, Bits and mastery, not whether you can win.

### 5.4 Rival ghost runs

Vex's "ghost" is a timeline built from the reference metadata: read (30 s), plan (2 min), first run, submit, AC at par. It's shown as a progress bar racing yours. Beating the ghost gives a cosmetic reward and a rivalry dialogue beat. The ghost is honest: it uses the problem's par time and never claims to be human.

### 5.5 Gym battles (three phases)

1. **Phase 1, Recognition blitz:** 6 unseen problem statements from the region (plus 2 from earlier regions for interleaving). Name the pattern in ≤ 20 s each. Every miss costs the foe a shield regeneration.
2. **Phase 2, Core medium:** a full coding battle.
3. **Phase 3, Signature mechanic:** a hard problem *or* an interview follow-up on the phase 2 problem (O(1) space, streaming, larger constraints, an online version).
   - Each gym has a unique twist that teaches something real:
     - **Pane Warden (sliding window):** the time limit halves after the first TLE, because brute force must be abandoned early.
     - **Hydra of Hashwood:** adversarial anti-hash tests for `unordered_map` with a naive key. Teaches custom hashes and when to use `map`.
     - **Grotto Weaver (graphs):** a disconnected-graph trap in the hidden tests.
     - **Memoth Elder (DP):** you must submit the state and transition before the editor unlocks.
     - **Bisect Sage:** the answer must be found with ≤ log₂(n) "probes" in an interactive problem.
- Winning grants the badge, a Compiler Shard, a new region and a Structling evolution checkpoint.

### 5.6 Interview Tower (mock interviews)

Each floor is a scripted interview with an NPC interviewer:

- **Clarify (≤ 5 min):** choose clarifying questions from a menu. Good questions reveal hidden constraints (e.g. "Can values be negative?" → yes, so sliding window breaks). Asking nothing is penalised, and asking irrelevant questions wastes time.
- **Approach (≤ 8 min):** state brute force, then optimal, with complexity, by choosing statements in order (a think-aloud checkpoint).
- **Code (≤ 25 min):** blank editor, no autocomplete, limited runs.
- **Test (≤ 5 min):** write your own test inputs *before* the hidden judge runs. The game classifies your tests into edge-case classes (empty, single element, duplicates, negatives, overflow, max size, sorted/reverse-sorted, disconnected…) and scores coverage.
- **Follow-up (≤ 5 min):** a variation question (MCQ or quick code change).
- **Scorecard:** four dimensions, as used in real big-tech rubrics, each rated 1–4: **Problem Solving, Coding, Verification, Communication**. The overall result is *Strong Hire / Hire / Lean Hire / Lean No Hire / No Hire*, with an explanation per dimension and a "what a strong candidate did differently" note.
- **Floor 4 (AI-assisted onsite):** a Meta-style round in a small multi-file C++ codebase with a *scripted, deterministic* assistant panel (clearly labelled simulated) whose suggestions are sometimes wrong. Phases: fix the bug → implement the feature → optimise. Scored on verification discipline (did you run the tests before accepting a suggestion?).

---

## 6. Progression systems

### 6.1 XP and levels
Trainer level 1–60 drives cosmetic unlocks and the Arena bracket. Structling levels follow the mastery of their moves, not grinding: a Structling's level is the average mastery of its equipped moves × 10.

### 6.2 Mastery (per problem, per pattern, per scroll)

| State | Meaning | Rule |
|---|---|---|
| Unseen | – | – |
| Seen | encountered, not solved unassisted | – |
| Learning | solved unassisted once | interval 1 day |
| Practiced | 2 spaced unassisted solves | 3 → 7 days |
| Mastered | 3+ spaced solves, under 2× par | 16 days |
| Ingrained | solved from blank under par after ≥ 30 days | 35+ days |

- **Pattern mastery** is aggregated from its problems (weighted towards mediums and hards). Shown on the **Mastery Map** (a constellation per region).
- **Assisted solves** (editorial read, more than 2 hints, Guided mode) never advance a state. They reschedule the problem for 1 day later.
- **Rust:** an overdue item shows a rust overlay. The move's icon and the Structling's sprite gain rust pixels, and the type multiplier caps at ×1.25 until it's reviewed. This is a visible, fictional reason to review.

### 6.3 Daily Rift (the review engine)
A seeded daily dungeon with five rooms:
1. Due reviews, with problems and scrolls interleaved across regions.
2. One recognition blitz.
3. One fresh problem at the player's frontier.
4. One Team Undefined debugging encounter.
5. An optional bonus hard.

Rewards scale with completion. A streak counter is shown with no punishment beyond losing the counter. The Rift is the primary 10-minute session.

### 6.4 The Forge (template inscription)
Scrolls are the reusable templates listed in `docs/CURRICULUM.md` §4. Each scroll has four tiers:

1. **Trace:** the template shown and annotated, then 5 trace questions.
2. **Cloze 30 %:** about 30 % of tokens blanked (identifiers and key lines).
3. **Cloze 70 %.**
4. **Blank:** write it from scratch against a spec plus tests, timed.

A tier passes when the template compiles and passes its tests. **Ingrained** = Blank under par time on two spaced occasions. Scrolls feed the SRS like problems.

### 6.5 Scaffolding modes (honest difficulty dial)

| Mode | Editor | Help | Counts for mastery |
|---|---|---|---|
| Guided | skeleton + approach card | unlimited hints | no |
| Standard | signature only, autocomplete on | 3-hint ladder | yes |
| Interview | no autocomplete, no snippets, limited runs, must write own tests | none | yes (×1.25 mastery) |
| Contest | as Interview, timed | none | yes |

### 6.6 Economy
- **Bits** are earned from battles, the Rift and achievements. They are spent at the **Mart** on:
  - Hint Tokens
  - Debug Lens (reveals one failing input in Interview mode; marks the problem assisted)
  - Complexity Compass (shows the target complexity; reduces mastery gain by one tier)
  - Rematch Ticket
  - Cosmetics: trainer outfits, palette swaps, title badges
- **Rule:** nothing purchasable advances mastery or skips content. Shiny palette variants of Structlings are awarded only for *unassisted, under-par, first-try* solves.

### 6.7 Achievements
About 60 achievements, e.g. "No Off-By-One" (10 ACs with zero WA), "Template Smith" (all Core scrolls Ingrained), "Constraint Reader" (100 % Scout accuracy in a gym), "Night Owl" (cosmetic only). Avoid achievements that reward volume without quality.

---

## 7. World structure: the Region DAG

Regions unlock along a prerequisite graph rather than a straight line, so after the basics the player chooses a route. Each region has:
- a **town** (mentor, Mart, Forge terminal, healing),
- **routes** with wild encounters,
- **3–8 trainer battles** (the core problem ladder),
- a **gym**,
- a **library corner** (visualisers for that region's structures),
- optional **side quests** (bonus problems with lore).

```
Syntax Shores ─► Scout School ─► Array Atoll ─┬─► Window Woods ─────────────┐
                                             ├─► Hashwood Harbor ──────────┤
                                             └─► Stackspire ───────────────┤
Chainlink Caves (needs Array Atoll) ─────────────────────────────────────────┤
Recursion Ruins (needs Stackspire) ─► Bisect Bay ─► Sorting Steppes ─────────┤
Treetop Grove (needs Recursion Ruins) ─► Heap Highlands ─► Trie Thicket ─────┤
Web Wilds (needs Treetop Grove) ─► Union Isles ─► Pathfinder Plains ─────────┤
Backtrack Labyrinth (needs Recursion Ruins) ─────────────────────────────────┤
Memo Mountains I–V (needs Recursion Ruins + Array Atoll) ────────────────────┤
Greedy Gulch, Interval Isthmus, Bitwise Barrens (need Sorting Steppes) ──────┤
Advanced Citadel (needs 12 badges) ─► Interview Tower (needs Citadel) ───────┘
```

Region-to-curriculum mapping lives in `docs/CURRICULUM.md` §3.

---

## 8. Content model

### 8.1 Problem package (`content/problems/<region>/<slug>/`)

| File | Contents |
|---|---|
| `problem.md` | Original title (themed) and **original statement**, examples, constraints |
| `meta.ts` | `id, region, difficulty (E/M/H), patterns[], signals[], prerequisites[], parSeconds, timeLimitMs, testWeights, similar: [{ name, lcNumber?, url? }]` (a pointer for real-LeetCode practice; only when verified) |
| `solution.cpp` | Reference optimal solution: idiomatic, commented, `class Solution` |
| `brute.cpp` | Simple correct brute force (used for stress tests) |
| `wrong/*.cpp` | Known-wrong solutions: off-by-one, overflow, greedy that fails, TLE brute on large input. **Each must be rejected** by the hidden tests |
| `gen.ts` | Seeded generator for random small cases and max-size cases |
| `tests.json` | Generated hidden test groups (basic/edge/adversarial/perf) with outputs from the reference |
| `hints.md` | A 3-rung ladder: nudge → approach → key insight |
| `editorial.md` | §8.3 |
| `harness` (optional) | Custom checker for multiple valid answers (e.g. any valid topological order) |

### 8.2 Concept card (`content/cards/<region>/*.ts`)
Typed cards (MCQ, multi-select, trace, predict-output, spot-the-bug, compiler-error, Parsons, cloze, complexity, recognition-statement), each with an explanation and tags. **Every answer is checked by a test.** Trace, predict-output and compiler-error cards are generated by actually compiling and running the C++ with native g++/clang in tests, never typed by hand.

### 8.3 Editorial structure (house style)
1. **Signals:** which words or constraints point to the pattern.
2. **Brute force:** idea, complexity, why it's too slow.
3. **Key insight:** the one-sentence unlock.
4. **Optimal:** algorithm, invariant, a proof sketch (why it's correct), complexity (time and space).
5. **C++ walkthrough:** the reference code with line notes on idioms (e.g. why `long long`, why `reserve`, why `const auto&`).
6. **Common bugs:** a list from the `wrong/` folder.
7. **Follow-ups:** what interviewers ask next, with brief answers.
8. **Similar problems:** in-game links, plus an optional real-LeetCode pointer.

---

## 9. Meta screens

- **Trainer Card / Readiness Report:** the gates from §1 with progress bars; per-pattern strength radar; calibration (confidence vs actual); median time vs par per difficulty; WA-cause histogram (off-by-one, overflow, edge cases…); "next best action" recommendation.
- **Mastery Map:** a constellation per region; nodes are problems and scrolls coloured by state, with rust visible.
- **Solution Journal:** every AC, searchable by pattern; diff your current solution against your past attempt and against the reference.
- **Library:** codex of lessons, cheat sheets (printable), and the visualisers (`docs/CURRICULUM.md` §6).
- **Settings:** text speed, audio, reduce motion, editor (font size, keymap including vim, tab width, theme), mode defaults, save export/import.

---

## 10. Presentation

- **Art:** see the Art quality bar in `CLAUDE.md`. Regions have distinct biome palettes and battle backdrops. Structlings evolve in three stages tied to mastery milestones.
- **Battle juice:** sprite slide-ins, attack lunges, hit-stop (60 ms), screen shake scaled to damage, damage numbers, "super effective" text, verdict stingers (AC fanfare, WA thud, TLE clock-tick, CE "glitch" effect).
- **The editor in battle:** in desktop battle layout the battle stage sits on top (compact 30 % height) with the editor and statement in split panes below; the stage reacts live to Run and Submit. On mobile a tab switcher swaps between Stage, Problem and Code.
- **Audio:** all original, generated with WebAudio. One chiptune loop per region (a small in-repo tracker format), with SFX for menu, hit, verdicts and level-up. Master, music and SFX volume. Muted by default until the first user interaction.
- **UI:** pixel font, handheld-style windows, a blinking cursor, everything keyboard-navigable, with tap targets ≥ 44 px.

---

## 11. Accessibility, performance and offline

- Keyboard-only play, an ARIA live region for battle text, colour-blind-safe type colours with symbols, and reduced motion (no shake or flashes).
- Initial load (menu) ≤ 300 KB of gzipped JS. The C++ toolchain is downloaded **only** on first code battle, with a progress bar and size shown. After that it's cached for offline use.
- 60 fps overworld on an iPhone 14. Compile + run of a typical solution ≤ 4 s warm on desktop (measured, see ARCHITECTURE).

---

## 12. Telemetry (local only)

Everything stays in the browser save file (IndexedDB) and is never sent anywhere: attempts, verdicts, time per phase, hints, confidence, runs, WA causes. This data drives the SRS, the Readiness Report and the "next best action" recommendation.
