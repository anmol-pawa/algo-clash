# Algo Clash

A handheld-style creature RPG that teaches data structures and algorithms in C++. Every battle is a real interview problem: recognise the pattern, pick the data structure and write the C++ by hand.

Play: https://anmol-pawa.github.io/algo-clash/

Stack: Next.js 16, React 19, PixiJS 8, Tailwind 4. See `docs/` for the game design, curriculum and architecture, and `ROADMAP.md` / `PROGRESS.md` for status.

## Develop

```
npm ci
npm run dev          # http://localhost:3000
npm run lint && npm run typecheck && npm test && npm run build && npm run build:pages
```

The repo is built by an hourly routine; `.routine/lock` stops two runs overlapping (see `CLAUDE.md`).
