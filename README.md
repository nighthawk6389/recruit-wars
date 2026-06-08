# 🔥 Recruit Wars

> **Rally your fanbase. Power your recruit.**
> A fan-engagement & NIL platform where college football fanbases compete to support the athletes they love — through messages, hype videos, and premium supporter memberships.

Think **Kickstarter × Fanatics × Rivals × On3 × Cameo × Patreon**, focused entirely on recruiting, NIL, fan engagement, and athlete community building.

> **Compliance:** Participation on this platform does not influence recruiting decisions. Purchases are for fan engagement and athlete content experiences only.

---

## ✨ Features

| Area | What's built |
| --- | --- |
| **Landing** | Animated hero, live platform stats, featured recruits, how-it-works, tier preview, leaderboard preview |
| **Athlete profiles** | Photo, bio, recruiting status, offer list, social links, highlight video, NIL valuation, school interest tracker, fanbase leaderboard, "Top Schools Competing" animated donut, total supporters/messages/videos/revenue, Top Fan Captains, live activity feed, auto-generated share graphic |
| **Fan purchases** | 4 tiers — Message ($5), Video ($20), VIP Committee ($50), Fan Captain ($100, limited per school). Modal flow with name / school / message / promo code |
| **Leaderboards** | Public rankings by dollars, supporters, videos, engagement score — global + per athlete, animated bars/charts, live updates |
| **Activity feed** | Real-time, addictive ticker ("John from Baton Rouge submitted a message", "Miami fans moved into second place") |
| **Athlete dashboard** | View/filter messages & videos by school, export supporter CSV, download emails, revenue chart, state heat map, engagement analytics |
| **Admin dashboard** | Approve athletes, moderate messages/videos, manage schools, view payments, ban users, export analytics |
| **Payments** | Stripe Checkout — one-time + subscription tiers, promo codes, referral support, webhook → DB + email |
| **Viral** | Auto-generated shareable graphics + one-click share to X / Instagram / Facebook |
| **Email** | Purchase confirmations, leaderboard updates, weekly recaps (Vercel Cron), athlete announcements (Resend) |
| **Compliance** | Persistent disclaimer on every page + dedicated compliance page + full moderation tooling |

The platform name is **editable** in [`config/site.ts`](./config/site.ts) (or via `NEXT_PUBLIC_SITE_NAME`). Support tiers are configured in [`config/tiers.ts`](./config/tiers.ts).

---

## 🚀 Quick start

```bash
npm install
npm run dev      # → http://localhost:3000
```

That's it. The app boots in **demo mode** with rich, deterministic sample data — every page, chart, leaderboard, purchase flow, dashboard, and admin tool is fully interactive **without any external services or network access** (athlete imagery is bundled as local SVG portraits). A banner indicates demo mode. The purchase flow simulates a successful Stripe checkout so it's fully demoable.

To go live, copy `.env.example` → `.env.local` and add Supabase + Stripe keys. See **[docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md)**.

---

## 🧱 Tech stack

- **Next.js 14** (App Router, RSC) + **React 18** + **TypeScript**
- **Tailwind CSS** — dark, mobile-first, premium sports-tech design system
- **Supabase** — Postgres, Auth, RLS, Storage (videos), realtime
- **Stripe** — Checkout, subscriptions, promo codes, webhooks
- **Resend** — transactional + automated email
- **Recharts** + **Framer Motion** — animated charts & micro-interactions
- **Vercel** — hosting + Cron

---

## 📁 Project structure

```
config/            # EDITABLE site name + support tiers
src/
  app/             # routes (landing, athletes, leaderboard, dashboard, admin, api)
    api/           # checkout, stripe webhook, weekly-recap cron
  components/      # UI + feature components
  lib/             # data access, types, utils, supabase, stripe, email
supabase/
  schema.sql       # tables, views, RLS, triggers
  seed.sql         # schools + sample athletes
docs/
  ARCHITECTURE.md  # data model, flows, design decisions
  DEPLOYMENT.md    # step-by-step Supabase + Stripe + Vercel setup
```

---

## 📜 Scripts

```bash
npm run dev        # local dev
npm run build      # production build
npm run start      # serve production build
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
```

## 📄 Docs

- **[Architecture](./docs/ARCHITECTURE.md)** — data model, user flows, leaderboard engine, design system
- **[Deployment](./docs/DEPLOYMENT.md)** — Supabase, Stripe, Resend, Vercel, env vars
- **[UX Recommendations](./docs/UX-RECOMMENDATIONS.md)** — research vs. Fanatics/Overtime/Rivals/On3/Cameo/Patreon/Kickstarter + backlog

---

_For fan engagement & athlete community building only._
