# Vercel Deployment Guide

## Scope

Deploy the Journey English Vite app from `apps/web`.

This guide does not introduce product changes, AI integration, backend services, or new dependencies.

## Recommended Settings

- Root Directory: `apps/web`
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: `dist`

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

- The app is a static Vite build.
- Current data storage is browser `localStorage`.
- No environment variables are required for `v0.3.0-learning-system`.
- No server functions, API routes, or AI services are required for this deployment.
