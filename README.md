# 1st Texas Realtors

A Next.js 15 / React 19 / TypeScript website with Tailwind CSS v4, GSAP-ready motion, Sentry-ready observability, and local realtor imagery. Built for Vercel deployment, with a Docker setup for Railway.

## Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** styling
- **GSAP** motion primitives
- **Sentry** optional observability (disabled until `SENTRY_DSN` is set)
- Deploy targets: **Vercel** (primary) and Railway via Docker

## Run locally

```bash
npm install   # or: bun install
npm run dev   # or: bun run dev
```

Open http://localhost:3000 (or `npx next dev -p 4000` if 3000 is taken).

**Package manager:** `package-lock.json` is the source of truth for Vercel/npm. `bun.lock` is optional for local Bun / Docker builds.

## Build & verify

```bash
bun run build        # production build — must complete with zero errors
bun run typecheck    # TypeScript check
bun run test         # stack / path contract tests
bun run start        # serve the production build locally (node server.js)
```

`npm run …` works the same if you prefer npm (`package-lock.json` is present).

## Deploy to Vercel

1. Push this repo to GitHub and import it into Vercel.
2. Vercel auto-detects Next.js (`vercel.json` pins `"framework": "nextjs"`).
3. Leave build / install / output directory at Vercel defaults — do **not** set `dist` or `.next` as the output directory.
4. `next.config.ts` skips `output: 'standalone'` when `VERCEL=1` so Vercel uses its native Next runner.

Production branch: `main`.

Optional environment variables:

- `NEXT_PUBLIC_SITE_URL` — canonical public URL used by metadata, sitemap, and robots.
- `SENTRY_DSN` / `NEXT_PUBLIC_SENTRY_DSN` — enable Sentry.
- `WEBHOOK_URL` or typed variants (`WEBHOOK_URL_CONTACT`, `WEBHOOK_URL_NEWSLETTER`, `WEBHOOK_URL_SCHEDULE`) — receive form submissions through `/api/submit`.

## Railway / Docker

Railway uses `railway.toml` and the multi-stage `Dockerfile` (Bun build → Node 20 run with `output: 'standalone'` when not on Vercel). Health endpoint: `/api/health`.
