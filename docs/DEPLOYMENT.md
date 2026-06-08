# Deployment Guide

This guide takes you from the demo to a live, production deployment on **Vercel** with **Supabase**, **Stripe**, and **Resend**.

> The app runs fully in **demo mode** with no setup. Follow these steps only when you're ready to go live with real data and payments.

---

## 0. Prerequisites

- Node 18+ (20+ recommended)
- Accounts: [Vercel](https://vercel.com), [Supabase](https://supabase.com), [Stripe](https://stripe.com), [Resend](https://resend.com)
- This repo cloned locally

```bash
npm install
cp .env.example .env.local
```

---

## 1. Supabase (database + auth + storage)

1. **Create a project** at supabase.com. Note the project URL and keys under **Project Settings → API**.
2. **Run the schema.** In the Supabase **SQL Editor**, paste and run:
   - [`supabase/schema.sql`](../supabase/schema.sql) — tables, views, RLS, triggers
   - [`supabase/seed.sql`](../supabase/seed.sql) — schools + sample athletes
3. **Storage.** Create a public-read bucket named `videos` for fan video uploads (or keep it private and serve via signed URLs). Add an RLS policy allowing authenticated inserts.
4. **Auth.** Email/password and OAuth are enabled by default. The `handle_new_user` trigger auto-creates a `profiles` row per signup.
5. **Make yourself an admin.** After signing up once:
   ```sql
   update profiles set role = 'admin' where email = 'you@example.com';
   ```
6. **Env vars** (`.env.local`):
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...        # server only — never expose
   ```

Adding `NEXT_PUBLIC_SUPABASE_URL` automatically switches the app **out of demo mode**. You then point `src/lib/data.ts` reads at the SQL views (the function bodies are stubbed for this swap — each maps 1:1 to a view).

---

## 2. Stripe (payments)

1. Grab keys from **Developers → API keys**.
2. **Env vars:**
   ```
   STRIPE_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```
3. **Webhook.** Create an endpoint at **Developers → Webhooks** → `https://YOUR-DOMAIN/api/webhooks/stripe`, listening for `checkout.session.completed`. Copy the signing secret:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```
4. **Local testing:**
   ```bash
   stripe login
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
5. **Promo codes.** Enabled on Checkout (`allow_promotion_codes: true`). Create codes in the Stripe dashboard, or track your own in the `promo_codes` table.
6. **Tiers.** Prices come from `config/tiers.ts` (created dynamically as `price_data`). The VIP tier uses `mode: 'subscription'` (monthly); others are one-time. To use fixed Stripe Price IDs instead, swap `price_data` for `price` in `src/app/api/checkout/route.ts`.

---

## 3. Resend (email automation)

1. Verify your sending domain in Resend, create an API key.
2. **Env vars:**
   ```
   RESEND_API_KEY=re_...
   EMAIL_FROM="Recruit Wars <noreply@yourdomain.com>"
   ```
Without a key, emails log to the console (demo). Templates live in `src/lib/email.ts`.

---

## 4. Vercel (hosting + cron)

1. Push to GitHub, **Import** the repo in Vercel.
2. Add **all** env vars from `.env.local` in **Project Settings → Environment Variables**.
3. Set `NEXT_PUBLIC_SITE_URL` to your production URL (used by Stripe redirects, share links, emails).
4. **Cron.** [`vercel.json`](../vercel.json) schedules the weekly recap (`Mon 14:00 UTC`). Add a `CRON_SECRET` env var to protect the endpoint (Vercel sends it as a Bearer token).
5. Deploy. Vercel runs `next build` automatically.

---

## 5. Post-deploy checklist

- [ ] Sign up → confirm a `profiles` row is created
- [ ] Promote yourself to `admin`, confirm `/admin` loads with privileges
- [ ] Create/approve an athlete; confirm it appears on `/athletes`
- [ ] Run a test purchase (Stripe test card `4242 4242 4242 4242`)
- [ ] Confirm the webhook marks the supporter `approved` and the leaderboard updates
- [ ] Confirm the confirmation email sends
- [ ] Verify the compliance disclaimer renders site-wide
- [ ] Trigger `/api/cron/weekly-recap` manually to test the recap

---

## Rebranding

Change the platform name and copy in [`config/site.ts`](../config/site.ts) (or set `NEXT_PUBLIC_SITE_NAME`). Adjust tiers/prices in [`config/tiers.ts`](../config/tiers.ts). Brand colors live in [`tailwind.config.ts`](../tailwind.config.ts).

## Environment variable reference

| Var | Required for | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_NAME` | branding | optional, defaults to "Recruit Wars" |
| `NEXT_PUBLIC_SITE_URL` | redirects/share | set to prod URL |
| `NEXT_PUBLIC_SUPABASE_URL` | live data | toggles demo mode off |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | live data | client-safe |
| `SUPABASE_SERVICE_ROLE_KEY` | webhooks/admin | **server only** |
| `STRIPE_SECRET_KEY` | payments | server only |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | payments | client-safe |
| `STRIPE_WEBHOOK_SECRET` | payments | from webhook endpoint |
| `RESEND_API_KEY` | email | optional |
| `EMAIL_FROM` | email | verified sender |
| `CRON_SECRET` | cron | protects recap endpoint |
