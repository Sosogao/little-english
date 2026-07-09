# Journey AI

A local-first family AI learning platform.

The first product is **Journey English**: an AI companion that helps children practice English every day through adventures, conversation, vocabulary, stories, shadowing, memory review, and family progress.

## Quick Start for Codex

Read files in this order:

1. `MANIFESTO.md`
2. `CODEX.md`
3. `TODO.md`
4. `docs/01_PRD.md`
5. `docs/04_DATABASE.md`
6. `docs/06_TECH_ARCHITECTURE.md`
7. `docs/09_MILESTONES.md`

Do not start coding before reading `CODEX.md`.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Zustand
- React Router
- Local-first storage

## V1 Principle

Build a usable local-first prototype first.

AI integration comes after the core learning flow works.

## Web App

The deployable Vite app lives in `apps/web`.

Local commands:

```bash
cd apps/web
npm install
npm run dev
npm run build
```

## Vercel Deployment

Use these Vercel project settings:

- Root Directory: `apps/web`
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: `dist`

See [docs/10_VERCEL_DEPLOYMENT.md](docs/10_VERCEL_DEPLOYMENT.md) for the deployment checklist.
