# Backboard Ambassador Portal

A redesign of the Backboard.io ambassador portal, built for the **Portal Redesign**
challenge. Eight panels ride a single horizontal rail with a coverflow tilt — drag,
scroll, arrow-key, or `⌘K` your way between them.

Implemented from the `D-Rail-Coverflow v3` design canvas.

## Running it

```bash
npm install
npm run dev      # http://localhost:5173
```

## Other scripts

| Script              | What it does                       |
| ------------------- | ---------------------------------- |
| `npm run build`     | Type-check and build to `dist/`    |
| `npm run preview`   | Serve the production build         |
| `npm run typecheck` | Type-check only                    |
| `npm test`          | Run the unit tests once            |
| `npm run test:watch`| Run the unit tests in watch mode   |

## Stack

React 18 + TypeScript, built with Vite. No UI framework — the design is a bespoke
dark canvas, so styles are colocated with the components that own them and driven
by shared tokens.
