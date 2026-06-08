import { siteConfig } from "@/../config/site";
import { TIERS_BY_ID, type SupportTierId } from "@/../config/tiers";
import { formatCurrency } from "@/lib/utils";

/**
 * Email automation. Uses Resend when RESEND_API_KEY is set, otherwise logs
 * to the console (demo mode). Swap the transport for SendGrid/Postmark if
 * preferred — the template functions stay the same.
 *
 * Triggers (wire these to cron / webhooks):
 *   - Purchase confirmations        → sendPurchaseConfirmation (Stripe webhook)
 *   - Leaderboard updates           → sendLeaderboardUpdate (on rank change)
 *   - Weekly recruiting recaps      → sendWeeklyRecap (Vercel Cron, weekly)
 *   - Athlete announcements         → sendAthleteAnnouncement (admin action)
 */

const FROM = process.env.EMAIL_FROM || `${siteConfig.name} <noreply@example.com>`;

async function send(to: string, subject: string, html: string) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.log(`[email:demo] to=${to} subject="${subject}"`);
    return { demo: true };
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: FROM, to, subject, html }),
  });
  if (!res.ok) console.error("[email] send failed", await res.text());
  return res.json().catch(() => ({}));
}

function wrap(title: string, body: string) {
  return `<div style="font-family:system-ui,sans-serif;background:#070a12;color:#e2e8f0;padding:32px">
    <div style="max-width:560px;margin:0 auto;background:#0f1626;border-radius:16px;padding:28px">
      <h1 style="font-size:18px;color:#ff5c4d;margin:0 0 12px;text-transform:uppercase">${siteConfig.name}</h1>
      <h2 style="font-size:22px;margin:0 0 16px">${title}</h2>
      ${body}
      <p style="font-size:11px;color:#64748b;margin-top:24px;border-top:1px solid #1c2640;padding-top:16px">
        ${siteConfig.complianceStatement}
      </p>
    </div>
  </div>`;
}

export async function sendPurchaseConfirmation(p: {
  to: string;
  fanName: string;
  tier: SupportTierId;
  amount: number;
  athleteSlug: string;
}) {
  const tier = TIERS_BY_ID[p.tier];
  return send(
    p.to,
    `Your support is confirmed — ${formatCurrency(p.amount)}`,
    wrap(
      `Thanks, ${p.fanName}! 🎉`,
      `<p>Your <strong>${tier?.name ?? p.tier}</strong> (${formatCurrency(p.amount)}) for
       <strong>${p.athleteSlug}</strong> is confirmed and now counts toward your school's leaderboard.</p>
       <p><a href="${siteConfig.url}/athletes/${p.athleteSlug}" style="color:#ff5c4d">View the athlete →</a></p>`
    )
  );
}

export async function sendLeaderboardUpdate(p: { to: string; school: string; rank: number; athleteSlug: string }) {
  return send(
    p.to,
    `${p.school} is now #${p.rank} 🔥`,
    wrap(`${p.school} moved to #${p.rank}`, `<p>Your fanbase just shifted on the leaderboard. Keep the momentum going!</p>
     <p><a href="${siteConfig.url}/athletes/${p.athleteSlug}" style="color:#ff5c4d">See the board →</a></p>`)
  );
}

export async function sendWeeklyRecap(p: { to: string; highlights: string[] }) {
  return send(
    p.to,
    `Your weekly recruiting recap`,
    wrap("This week in Recruit Wars", `<ul>${p.highlights.map((h) => `<li>${h}</li>`).join("")}</ul>`)
  );
}

export async function sendAthleteAnnouncement(p: { to: string; athleteName: string; message: string }) {
  return send(
    p.to,
    `Update from ${p.athleteName}`,
    wrap(`A message from ${p.athleteName}`, `<p>${p.message}</p>`)
  );
}
