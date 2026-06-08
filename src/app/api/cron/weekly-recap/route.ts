import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { sendWeeklyRecap } from "@/lib/email";
import { globalSchoolStandings, getAthletes } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

export const runtime = "nodejs";

/**
 * Weekly recruiting recap. Scheduled via vercel.json cron.
 * Protected by CRON_SECRET (Vercel sets the Authorization header).
 */
export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const standings = globalSchoolStandings().slice(0, 3);
  const athletes = await getAthletes({ approvedOnly: true });
  const highlights = [
    ...standings.map((s, i) => `#${i + 1} ${s.school.name} — ${formatCurrency(s.totalDollars)} raised`),
    `${athletes.length} recruits are active on the platform this week`,
  ];

  const supabase = createAdminClient();
  let recipients: string[] = [];
  if (supabase) {
    const { data } = await supabase.from("supporters").select("email").eq("status", "approved");
    const emails = ((data ?? []) as { email: string }[]).map((r) => r.email).filter(Boolean);
    recipients = Array.from(new Set<string>(emails));
  }

  await Promise.all(recipients.map((to) => sendWeeklyRecap({ to, highlights })));

  return NextResponse.json({ sent: recipients.length, highlights });
}
