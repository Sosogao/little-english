# Vercel Deployment Guide

## Scope

Deploy the Journey English Vite app from `apps/web`.

This guide deploys the Journey English Vite app and its Vercel API route for
OpenAI voice playback.

## Recommended Settings

- Root Directory: `apps/web`
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: `dist`

The repository also includes a root `vercel.json` fallback for projects that are
created with the repository root as the Vercel Root Directory:

- Install Command: `npm install --prefix apps/web`
- Build Command: `npm run build --prefix apps/web`
- Output Directory: `apps/web/dist`

## Steps

1. Create a new Vercel project from the GitHub repository.
2. Set the project Root Directory to `apps/web`.
3. Confirm the install, build, and output settings match the recommended settings above.
4. Deploy.

## Local Verification

Before deploying, verify the app from the repo root:

```bash
cd apps/web
npm install
npm run build
```

The production build should generate `apps/web/dist`.

## Runtime Notes

- The app is a Vite build with a Vercel API route at `/api/tts`.
- Current data storage is browser `localStorage`.
- Browser voice works without environment variables.
- OpenAI voice requires `OPENAI_API_KEY` in Vercel Project Settings ->
  Environment Variables.
- Do not expose the OpenAI API key as a `VITE_` variable.

## Troubleshooting

If Vercel deploys successfully but the domain returns `404: NOT_FOUND`, check the
build log. A correct deployment should run the web app build and mention Vite.

If the log only says `Build Completed in /vercel/output` without running
`npm install` or `npm run build`, Vercel is building the repository root without
finding the Vite app. Either set Root Directory to `apps/web`, or keep the root
`vercel.json` in place so Vercel builds `apps/web/dist`.
