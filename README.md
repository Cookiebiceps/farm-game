# 🌾 Farm Game

A cozy browser-based farm game built with **Vite + React + TypeScript**. Buy
seeds, plant them in your field, watch crops grow in real time, harvest them for
coins, and reinvest in pricier crops.

## Gameplay

- Start with **20 coins** and a 4×3 field of soil plots.
- Pick a seed in the **Seed Shop**, then click an empty plot to plant it (the
  seed cost is deducted from your coins).
- Each crop grows through visible stages (🌱 → 🌿 → crop) over a fixed time.
- When a plot glows ✨ it is ready — click it to **harvest** and earn coins.
- Progress is saved automatically in `localStorage`.

| Crop | Seed cost | Sell price | Grow time |
| ---- | --------- | ---------- | --------- |
| 🌾 Wheat | 5 | 12 | 8s |
| 🥕 Carrot | 8 | 20 | 12s |
| 🍅 Tomato | 12 | 30 | 16s |
| 🎃 Pumpkin | 20 | 55 | 24s |

## Getting started

Requires **Node.js 20+** (developed on Node 22).

```bash
npm install       # install dependencies
npm run dev       # start the dev server at http://localhost:5173
```

## Scripts

| Command | Description |
| ------- | ----------- |
| `npm run dev` | Start the Vite dev server (hot reload). |
| `npm run build` | Type-check and build the production bundle to `dist/`. |
| `npm run preview` | Preview the production build locally. |
| `npm run lint` | Run ESLint. |
| `npm run typecheck` | Type-check without emitting output. |

## Project structure

```
index.html            App entry HTML
src/
  main.tsx            React entry point
  App.tsx             Game UI (field, shop, stats)
  App.css             Game styling
  index.css           Global styles
  game/
    types.ts          Shared game types
    crops.ts          Crop definitions + growth helpers
    useFarm.ts        Game state, tick loop, persistence
```
