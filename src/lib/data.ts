import {
  ATHLETES,
  SCHOOLS,
  SUPPORTERS,
  activityForAthlete,
} from "@/lib/demo-data";
import { ENGAGEMENT_WEIGHTS } from "@/../config/tiers";
import type {
  Athlete,
  School,
  Supporter,
  FanbaseStanding,
  AthleteStats,
  ActivityItem,
} from "@/lib/types";

/**
 * Read-side data access. In DEMO MODE this computes everything from the
 * in-memory demo dataset. In production you'd swap these bodies for
 * Supabase queries (see /supabase/schema.sql for the matching views).
 *
 * Kept synchronous-friendly but async-shaped so the swap is drop-in.
 */

export const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL;

export async function getSchools(): Promise<School[]> {
  return SCHOOLS;
}

export function getSchool(id: string): School | undefined {
  return SCHOOLS.find((s) => s.id === id);
}

export async function getAthletes(opts?: { approvedOnly?: boolean }): Promise<Athlete[]> {
  const list = opts?.approvedOnly ? ATHLETES.filter((a) => a.approved) : ATHLETES;
  return list;
}

export async function getAthleteBySlug(slug: string): Promise<Athlete | undefined> {
  return ATHLETES.find((a) => a.slug === slug);
}

export async function getAthlete(id: string): Promise<Athlete | undefined> {
  return ATHLETES.find((a) => a.id === id);
}

export async function getSupporters(athleteId: string): Promise<Supporter[]> {
  return SUPPORTERS.filter((s) => s.athleteId === athleteId);
}

export function computeStandings(athleteId: string): FanbaseStanding[] {
  const supporters = SUPPORTERS.filter(
    (s) => s.athleteId === athleteId && s.status === "approved"
  );
  const map = new Map<string, FanbaseStanding>();
  for (const s of supporters) {
    const cur =
      map.get(s.schoolId) ??
      {
        schoolId: s.schoolId,
        totalDollars: 0,
        supporters: 0,
        messages: 0,
        videos: 0,
        engagementScore: 0,
      };
    cur.totalDollars += s.amount;
    cur.supporters += 1;
    if (s.message) cur.messages += 1;
    if (s.videoUrl) cur.videos += 1;
    cur.engagementScore += ENGAGEMENT_WEIGHTS[s.tier];
    map.set(s.schoolId, cur);
  }
  return [...map.values()].sort((a, b) => b.totalDollars - a.totalDollars);
}

export function computeStats(athleteId: string): AthleteStats {
  const supporters = SUPPORTERS.filter(
    (s) => s.athleteId === athleteId && s.status === "approved"
  );
  return {
    totalSupporters: supporters.length,
    totalMessages: supporters.filter((s) => s.message).length,
    totalVideos: supporters.filter((s) => s.videoUrl).length,
    totalRevenue: supporters.reduce((acc, s) => acc + s.amount, 0),
  };
}

export function getActivity(athleteId: string, limit = 24): ActivityItem[] {
  return activityForAthlete(athleteId, limit);
}

/** State-level heatmap data for the athlete dashboard. */
export function computeHeatmap(athleteId: string): { state: string; supporters: number; dollars: number }[] {
  const supporters = SUPPORTERS.filter(
    (s) => s.athleteId === athleteId && s.status === "approved"
  );
  const map = new Map<string, { state: string; supporters: number; dollars: number }>();
  for (const s of supporters) {
    const st = s.state || "??";
    const cur = map.get(st) ?? { state: st, supporters: 0, dollars: 0 };
    cur.supporters += 1;
    cur.dollars += s.amount;
    map.set(st, cur);
  }
  return [...map.values()].sort((a, b) => b.dollars - a.dollars);
}

/** Daily revenue series for analytics charts. */
export function computeRevenueSeries(athleteId: string, days = 30) {
  const supporters = SUPPORTERS.filter(
    (s) => s.athleteId === athleteId && s.status === "approved"
  );
  const buckets: Record<string, number> = {};
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    buckets[d.toISOString().slice(0, 10)] = 0;
  }
  for (const s of supporters) {
    const key = s.createdAt.slice(0, 10);
    if (key in buckets) buckets[key] += s.amount;
  }
  return Object.entries(buckets).map(([date, dollars]) => ({
    date: date.slice(5),
    dollars,
  }));
}

/** Platform-wide totals for the public leaderboard + landing page. */
export function platformTotals() {
  const approved = SUPPORTERS.filter((s) => s.status === "approved");
  return {
    athletes: ATHLETES.filter((a) => a.approved).length,
    supporters: approved.length,
    revenue: approved.reduce((a, s) => a + s.amount, 0),
    videos: approved.filter((s) => s.videoUrl).length,
    schools: SCHOOLS.length,
  };
}

/** Cross-athlete school standings for the global leaderboard page. */
export function globalSchoolStandings(): (FanbaseStanding & { school: School })[] {
  const approved = SUPPORTERS.filter((s) => s.status === "approved");
  const map = new Map<string, FanbaseStanding>();
  for (const s of approved) {
    const cur =
      map.get(s.schoolId) ??
      { schoolId: s.schoolId, totalDollars: 0, supporters: 0, messages: 0, videos: 0, engagementScore: 0 };
    cur.totalDollars += s.amount;
    cur.supporters += 1;
    if (s.message) cur.messages += 1;
    if (s.videoUrl) cur.videos += 1;
    cur.engagementScore += ENGAGEMENT_WEIGHTS[s.tier];
    map.set(s.schoolId, cur);
  }
  return [...map.values()]
    .map((st) => ({ ...st, school: getSchool(st.schoolId)! }))
    .sort((a, b) => b.totalDollars - a.totalDollars);
}
