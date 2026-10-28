# Algo Clash

A handheld-style creature RPG where every battle is a real interview problem. Recognise the pattern, pick the data structure, and **write the C++ by hand**; a real in-browser C++ compiler judges your code against hidden tests. It runs from C++ syntax and the STL up to LeetCode medium and hard, for FAANG / big-tech / startup / remote SDE loops.

Play: https://anmol-pawa.github.io/algo-clash/ (installable PWA; on iPhone use Share → Add to Home Screen).

**Stack:** Next.js 16 · React 19 · TypeScript · Tailwind 4 · PixiJS 8 · CodeMirror 6 · clang→WASM · Vitest

## Develop

```
npm ci
npm run dev          # http://localhost:3000
npm run lint && npm run typecheck && npm test
npm run build        # normal build
npm run build:pages  # static export for GitHub Pages + service worker
```

The design set lives in `docs/` (game design, curriculum, architecture); `ROADMAP.md` is the work queue and `PROGRESS.md` the log. The project is built by an hourly routine; see `CLAUDE.md`.
