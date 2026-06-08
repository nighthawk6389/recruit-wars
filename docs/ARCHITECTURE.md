# Architecture

## Overview

Recruit Wars is a **Next.js 14 (App Router)** application backed by **Supabase** (Postgres + Auth + Storage) and **Stripe** (payments). It is designed to run in two modes:

- **Demo mode** (default, no env vars): all reads resolve against a deterministic in-memory dataset (`src/lib/demo-data.ts`). The entire UI — leaderboards, charts, dashboards, purchase flow, admin tools — is fully interactive with zero setup.
- **Live mode** (env vars present): reads/writes go through Supabase; payments through Stripe; email through Resend.

The data-access layer (`src/lib/data.ts`) is the single seam between the two. Swapping demo functions for Supabase queries is drop-in because every function is already async-shaped and the SQL views in `supabase/schema.sql` mirror the computed shapes exactly.

```
Browser ──► Next.js (RSC + Route Handlers)
                 │
                 ├─ src/lib/data.ts  ──► demo-data.ts   (demo)
                 │                   └─► Supabase views  (live)
                 ├─ /api/checkout    ──► Stripe Checkout
                 ├─ /api/webhooks/stripe ──► Supabase + Resend
                 └─ /api/cron/weekly-recap ──► Resend
```

## User types & roles

Roles live on `profiles.role` (`fan | athlete | admin`), created automatically on signup by the `handle_new_user` trigger.

| Role | Capabilities |
| --- | --- |
| **Fan** | Browse athletes, purchase tiers, appear on leaderboards, share graphics |
| **Athlete** | Everything fans can do + their dashboard (messages, videos, exports, analytics) — gated to `athletes.user_id = auth.uid()` |
| **Admin** | Approvals, moderation, school management, payments, bans, analytics — gated by `is_admin()` |

Row-Level Security enforces these boundaries at the database (see `schema.sql`). The dashboard/admin pages ship as open demo views; in production you wrap them with a Supabase auth + role check.

## Data model

Core tables (full DDL in [`supabase/schema.sql`](../supabase/schema.sql)):

- **`profiles`** — extends `auth.users` with `role`, `banned`.
- **`schools`** — id, name, full_name, abbrev, color, state.
- **`athletes`** — profile fields + `offers text[]`, `socials jsonb`, `nil_valuation`, `approved`, `featured`, `committed_to`.
- **`supporters`** — every purchase/engagement: `tier`, `amount`, `message`, `video_url`, `school_id`, `status` (pending/approved/removed), Stripe ids.
- **`activity`** — feed events.
- **`promo_codes`**, **`referrals`** — growth tooling.

### Computed leaderboard views

Rather than denormalized counters, standings are computed by SQL views for correctness and live updates:

- `fanbase_standings` — per athlete × school: dollars, supporters, messages, videos, engagement_score
- `global_school_standings` — cross-athlete school rankings
- `athlete_stats` — headline totals per athlete
- `supporter_heatmap` — per athlete × state

**Engagement score** weights tiers: message ×1, video ×2, VIP ×5, captain ×10 (see `config/tiers.ts` `ENGAGEMENT_WEIGHTS`, mirrored in the SQL `case` expressions). Keep these two in sync.

## Key user flows

### Fan purchase
1. Fan opens an athlete profile → picks a tier (`PurchasePanel`).
2. Fills name / email / school / message (+ promo code). Video tiers prompt for upload post-payment.
3. `POST /api/checkout` → creates a `supporters` row (`pending`) + a Stripe Checkout Session (subscription for VIP, one-time otherwise). In demo mode it returns a simulated success.
4. Stripe redirects back; `checkout.session.completed` webhook → marks row `approved`, writes `activity`, sends confirmation email.
5. Leaderboards & activity feed reflect the new support.

### Athlete onboarding
Athlete signs up → row created `approved=false` → admin approves in the Admin dashboard → profile becomes public.

### Moderation
Messages/videos default to `pending` (or `approved` post-payment for non-video). Admins approve/remove from the Admin dashboard; removed content disappears from all public surfaces (filtered by `status='approved'`).

## Real-time & "addictive" feel

- The activity feed (`ActivityFeed`) animates new events with Framer Motion and injects synthetic live events in demo mode. In production, subscribe to Supabase Realtime on the `activity` table and push rows in.
- Leaderboard bars and the "Top Schools Competing" donut animate on mount and re-animate on data change.

## Viral graphics

`ShareCard` renders an on-brand graphic whose headline is derived from live standings ("LSU Fanbase Takes The Lead", "1,000 Fans Have Supported This Recruit"). Share buttons open X/Facebook intents and copy an Instagram caption. For server-rendered OG images, add a `next/og` route using the same headline logic.

## Design system

- **Dark, mobile-first**, premium sports-tech aesthetic.
- Tailwind tokens in `tailwind.config.ts`: `ink` (backgrounds), `brand` (fiery red/orange), `gold`, `electric`; `display` font = Oswald, body = Inter.
- Reusable component classes in `globals.css`: `.card`, `.btn-primary/secondary/gold`, `.chip`, `.label`, `.gradient-text`.
- Compliance disclaimer is a layout-level component (`ComplianceBar`) rendered on every page, plus a dedicated `/compliance` route.

## Configuration

- **Site name / branding / compliance copy** → `config/site.ts` (or `NEXT_PUBLIC_SITE_NAME`).
- **Support tiers / prices / perks / weights** → `config/tiers.ts`.

Changing these propagates across nav, footer, metadata, purchase UI, emails, and share graphics.

## Testing

The leaderboard/stats engine is the most logic-heavy part of the app and is unit-tested with **Vitest** (`src/lib/data.test.ts`, run via `npm test`). Tests assert that:

- standings and global rankings are sorted by dollars and reference real schools,
- engagement scores equal the configured tier weights (`ENGAGEMENT_WEIGHTS`),
- headline stats reconcile with the raw approved-supporter data,
- pending/removed content is excluded everywhere,
- heatmap/revenue-series/recent-raised/recent-supporters helpers behave (bucketing, ordering, bounds),
- platform totals equal the sum of approved supporter amounts.

Because all reads flow through `src/lib/data.ts`, these tests guard the contract the UI depends on regardless of whether data comes from the demo dataset or Supabase views.
