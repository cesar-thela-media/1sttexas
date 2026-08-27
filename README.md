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
npm install
npm run dev
```

Open http://localhost:3000.

## Build & verify

```bash
npm run build        # production build — must complete with zero errors
npm run typecheck    # TypeScript check
npm run start        # serve the production build locally
```

## Deploy to Vercel

1. Push this repo to GitHub and import it into Vercel.
2. Vercel auto-detects Next.js (`vercel.json` pins `"framework": "nextjs"`).
3. Build command / install command / output directory: leave default (Vercel handles Next.js automatically — do **not** set `dist` or `.next` as output directory).

Production branch: `main`.

Optional environment variables:

- `NEXT_PUBLIC_SITE_URL` — canonical public URL used by metadata, sitemap, and robots.
- `SENTRY_DSN` / `NEXT_PUBLIC_SENTRY_DSN` — enable Sentry.
- `WEBHOOK_URL` or typed variants (`WEBHOOK_URL_CONTACT`, `WEBHOOK_URL_NEWSLETTER`, `WEBHOOK_URL_SCHEDULE`) — receive form submissions through `/api/submit`.

## Railway / Docker

Railway uses `railway.toml` and the multi-stage `Dockerfile` (standalone Next.js output via `output: 'standalone'`). Health endpoint: `/api/health`.

> Image URLs are used as visual placeholders in this recreation. Replace them with licensed project assets before publishing.
