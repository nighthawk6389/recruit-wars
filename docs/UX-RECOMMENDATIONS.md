# UX/UI Research & Recommendations

Synthesized from research into **Fanatics, Overtime, Rivals, On3, Cameo, Patreon, and Kickstarter** — the platforms Recruit Wars is benchmarked against. This documents what each does well, what we applied, and a prioritized backlog.

> Methodology note: some sites (Fanatics, Patreon, Kickstarter) block automated fetching; those findings draw on documented help-center content, design write-ups, and secondary sources rather than live page inspection.

---

## What each reference does well → our takeaway

| Platform | Strength | Takeaway for Recruit Wars |
| --- | --- | --- |
| **Fanatics** | Team-color identity theming; tight scannable product-card grids | Let fans pick their school and recolor accents; keep recruit cards dense & scannable |
| **Overtime** | Gen-Z energy; vertical-clip-first; scoreboard/LED visual language | Highlight-first, loud athletic type, animated numbers — energy *is* the brand |
| **Rivals** | Star ratings as universal shorthand; live team leaderboard | Keep star ratings; make leaderboards feel live with rank-change motion |
| **On3** | One headline NIL number per athlete + trend; threshold push alerts | One headline stat (total raised + rank + trend); notify on rank/threshold moves |
| **Cameo** | Talent profile = sample content + response time + ratings + colored price CTA; guided checkout; free Fan Club lead capture | Model the athlete page on this; add a free "follow" to capture leads |
| **Patreon** | Cheap entry tier + premium anchor (+~17% rev); scannable perk bullets | Keep the 4-tier ladder with a premium anchor; perks as short bullets |
| **Kickstarter** | Raised / goal / % / backers / time-left trust+urgency stack; $1 entry | Add goal + progress framing; consider a $1 "cheer" entry action |

---

## ✅ Applied in this pass (Quick Wins)

1. **Sticky mobile support CTA** (`StickySupportCTA`) — persistent bottom bar on athlete pages showing the cheapest tier price + "Support now" that jumps to the tier section. The single highest-leverage mobile conversion pattern (Cameo/Fanatics).
2. **Recent Supporters social-proof strip** (`RecentSupporters`) — avatars + city/school of the latest backers on each athlete page (Cameo/Kickstarter social proof).
3. **Momentum stat** — "+$X this week" under Total Raised on the athlete header (On3 trend framing).
4. **Tier model cleanup** — tiers now carry a `recurring` flag (VIP = monthly membership, others one-time), shown as "/mo" vs "one-time" and driving Stripe `mode` — removes hard-coded tier-id branching in checkout.

Existing strengths already aligned with the research: star ratings, animated leaderboard bars, "Top Schools Competing" donut, live activity ticker, auto-generated share graphics, dark scoreboard-style display type, site-wide compliance disclaimers.

---

## 📋 Prioritized backlog (next)

**Quick wins**
- **Athlete hero headline stat**: surface total-raised + current leaderboard *rank across recruits* with a trend arrow above the fold.
- **"+spots" framing at purchase**: in the purchase modal, show "This pushes [School] past [rival]" / "+3 spots" to tie spend to the competitive payoff.
- **Animated count-ups** on hero/stat numbers (scoreboard feel) via a small client `CountUp` component.
- **Progress + goal bar** per recruit (raised vs. a goal, supporter count, optional time-left) — Kickstarter urgency.
- **Free "Join the fanbase" follow** — zero-cost lead capture that opts users into email/push for milestones and rank changes.
- **$1 "cheer" entry action** — a commitment-escalation tier below Message.
- **Team-color theming** — let a fan select their school; recolor accents to their palette.

**Bigger bets**
- **Rivalry Battles** — explicit head-to-head School A vs School B tug-of-war for a shared recruit. An ownable signature hook.
- **Fan-video gallery** on the athlete page — turn paid videos into public content that drives more purchases.
- **Threshold push notifications** ("you got passed for #1", "$500 to retake the lead") — the re-engagement engine (needs web push + Supabase Realtime).
- **Apple/Google Pay + saved payment** for one-tap repeat support.
- **Swipeable recruit discovery** + pull-to-refresh leaderboard on mobile.
- **Milestone/streak mechanics** — fanbase streaks, unlockable badges, "X away from next tier".

---

## Top 10 overall (impact-ordered)
1. Athlete-page hero with total-raised + rank + trend ✅ *(partial: weekly momentum shipped)*
2. Sticky mobile bottom CTA ✅
3. Live leaderboard with rank-change trend arrows
4. 4-tier ladder w/ premium anchor + scannable perks ✅ *(ladder exists; recurring clarified)*
5. Progress bar + goal + supporters (+ vs-rival framing)
6. Threshold push notifications
7. Guided checkout showing the competitive payoff ("+3 spots")
8. Free "Join the fanbase" follow for lead capture
9. Rivalry Battles head-to-head matchups
10. Scoreboard/LED visuals + animated count-ups + checkout-step NIL disclaimer
