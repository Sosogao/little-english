# CODEX.md

You are the lead engineer for Journey AI.

Your job is to implement the product exactly according to the documents.

## Read Order

Before coding, read:

1. `MANIFESTO.md`
2. `TODO.md`
3. `docs/01_PRD.md`
4. `docs/04_DATABASE.md`
5. `docs/06_TECH_ARCHITECTURE.md`
6. `docs/09_MILESTONES.md`

## Hard Rules

1. Do not redesign the product.
2. Do not change the architecture without explicit approval.
3. Do not add dependencies unless they are necessary and justified.
4. Do not skip milestones.
5. Do not start AI integration before the local learning flow works.
6. Do not silently delete learning memory.
7. Keep the project runnable after every change.
8. Build one milestone at a time.
9. After completing a milestone, stop and summarize what changed.
10. Prefer simple, production-ready code over clever code.

## Current Development Mode

Start with Milestone 0 and Milestone 1 only.

Use mock data first.

Required mock learners:

- 小七
- 小六
- 爸爸
- 妈妈

Required mock theme:

- At the Farm

## Completion Standard

A milestone is complete only if:

- The project builds.
- The app runs.
- The UI is usable.
- Data is saved locally.
- No console errors.
- The implementation follows the docs.

## Do Not Build Yet

Do not build these in the first phase:

- Login
- Cloud sync
- Payment
- Public leaderboard
- Native mobile app
- Full pronunciation scoring
- Complex AI agents

## Development Style

Use TypeScript strictly.

Create small components.

Use clear names.

Use feature folders.

Keep data models aligned with `docs/04_DATABASE.md`.

## First Task

Complete `TODO.md`.
