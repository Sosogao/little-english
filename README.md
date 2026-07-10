# Journey English

A local-first family English adventure app.

**Journey English** is a daily English adventure companion for families. It helps children practice English through adventures, conversation, vocabulary, stories, shadowing, memory review, and family missions.

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

## Voice Settings

The app supports three voice providers:

- `Edge`: default provider, backed by the app's `/api/tts` server endpoint.
- `Browser`: uses the browser and operating system English voices.
- `OpenAI`: optional provider, also backed by `/api/tts`.

To use the default Edge voice:

1. Open the app.
2. Go to `Voice` in the top navigation.
3. Keep `Edge` selected.
4. Pick a voice and speed, then use `Test Voice`.

To use optional OpenAI voice:

1. Copy `apps/web/.env.local.example` to `apps/web/.env.local`.
2. Set `OPENAI_API_KEY` in `apps/web/.env.local`.
3. For Vercel, add `OPENAI_API_KEY` in Project Settings -> Environment Variables.
4. Select `OpenAI` in Voice Settings and test it.

API keys are read only by the server endpoint and are not exposed to the browser.
Do not commit API keys to the repository.

Generated provider audio is cached locally with this key shape:

```text
provider + voice + speed + text
```

The app reuses cached audio for repeated playback of the same word or sentence.
Audio is generated lazily only when the learner presses a play button. If Edge
or OpenAI is unavailable, playback automatically falls back to the Browser
provider.

Local note: `npm run dev` starts Vite only. To test `/api/tts` locally, run the
app with Vercel's local dev server from `apps/web` so the serverless function can
read `OPENAI_API_KEY`.

## Vercel Deployment

Use these Vercel project settings:

- Root Directory: `apps/web`
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: `dist`

See [docs/10_VERCEL_DEPLOYMENT.md](docs/10_VERCEL_DEPLOYMENT.md) for the deployment checklist.
