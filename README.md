# Zirak Stream (زیرەک ستریم)

Kurdish (Sorani) streaming platform for movies, series, and anime. Built with Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4, shadcn/ui, Supabase (Postgres + Auth + Storage), and Cloudflare R2 for media.

## Phase 1 — What's in this drop

- Full project scaffold, TypeScript + Tailwind v4 + shadcn/ui configuration
- Supabase client/server/middleware helpers (`@supabase/ssr`)
- Complete PostgreSQL schema + Row Level Security policies (`supabase/migrations`)
- Authentication: email/password + Google OAuth, register, login, forgot password
- Cloudflare R2 client (S3-compatible) with presigned upload/download helpers
- GitHub Actions CI + Vercel deployment config

Later phases add the Home/Movie/Series/Episode pages, the video player, search, and the admin dashboard.

## Tech stack

Next.js 15 · React 19 · TypeScript · Tailwind CSS v4 · Supabase · PostgreSQL · Cloudflare R2 · Vercel · shadcn/ui · Zod · React Hook Form

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Copy the Project URL, anon key, and service role key from **Project Settings > API**.
3. Copy `.env.example` to `.env.local` and fill in the Supabase values.

### 3. Run the database migrations

Using the Supabase CLI (recommended):

```bash
npx supabase login
npx supabase link --project-ref your-project-ref
npx supabase db push
```

This applies everything in `supabase/migrations` in order: schema, then RLS policies, then functions/triggers.

### 4. Create a Cloudflare R2 bucket

1. In the Cloudflare dashboard, go to **R2 > Create bucket** (e.g. `zirak-stream-media`).
2. Create an API token with **Object Read & Write** permission scoped to that bucket.
3. Fill in `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_ENDPOINT` in `.env.local`.
4. Either connect a custom domain to the bucket or enable the public `r2.dev` URL, and set `NEXT_PUBLIC_R2_PUBLIC_URL` accordingly.

### 5. Enable Google OAuth (optional but included)

In Supabase Dashboard > Authentication > Providers > Google, add your `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` and set the redirect URL to:

```
https://your-project-ref.supabase.co/auth/v1/callback
```

### 6. Run the dev server

```bash
npm run dev
```

## Deploying (from a phone — no laptop needed)

1. Push this project to a GitHub repository using the GitHub mobile app or the GitHub web UI's "Upload files" flow.
2. Go to [vercel.com](https://vercel.com), **Add New Project**, and import that repository — Vercel auto-detects Next.js.
3. In Vercel's Environment Variables screen, paste in every value from `.env.example` (with your real values).
4. Deploy. Every future push to `main` redeploys automatically — no local build step required.
5. When something needs to change in the code, send the change here; the updated files can be committed straight to GitHub from the mobile app.

## Project structure

```
src/
  app/                  App Router routes (pages, layouts, route handlers)
    (auth)/             Login, register, forgot-password (route group, no shared URL segment)
    auth/callback/       OAuth / magic-link callback handler
    auth/signout/        Sign-out route handler
    api/health/          Health check endpoint
  components/
    ui/                 shadcn/ui primitives
    auth/               Auth forms
    providers/          Client-side context providers
  lib/
    supabase/           Supabase client/server/middleware/admin helpers
    r2/                 Cloudflare R2 client + presigned URL helpers
    validations/        Zod schemas
  types/                Shared TypeScript types (incl. generated DB types)
supabase/
  migrations/           SQL migrations: schema, RLS policies, functions/triggers
```

## Database schema overview

`profiles` (1:1 with `auth.users`) → `viewer_profiles` (Netflix-style multiple profiles per account) → `watch_history`, `favorites`, `ratings`, `comments`, `notifications`.

Content: `movies`, `series` → `seasons` → `episodes`, all linked to `genres` (many-to-many) and `credits` (cast/director/writer), with `video_sources` (multi-quality playback) and `subtitles` (multi-language) attached to movies or episodes.

Full definitions, constraints, indexes, and RLS policies live in `supabase/migrations`.
