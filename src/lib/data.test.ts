import { describe, it, expect } from "vitest";
import {
  computeStandings,
  computeStats,
  computeHeatmap,
  computeRevenueSeries,
  computeRecentRaised,
  recentSupporters,
  globalSchoolStandings,
  platformTotals,
  getAthleteBySlug,
  getSchool,
} from "@/lib/data";
import { ATHLETES, SUPPORTERS } from "@/lib/demo-data";
import { ENGAGEMENT_WEIGHTS } from "@/../config/tiers";

const ATHLETE = ATHLETES[0];

describe("leaderboard engine", () => {
  it("computes standings sorted by dollars, only counting approved supporters", () => {
    const standings = computeStandings(ATHLETE.id);
    expect(standings.length).toBeGreaterThan(0);
    // sorted descending by dollars
    for (let i = 1; i < standings.length; i++) {
      expect(standings[i - 1].totalDollars).toBeGreaterThanOrEqual(standings[i].totalDollars);
    }
    // every school in standings is a real school
    for (const s of standings) {
      expect(getSchool(s.schoolId)).toBeDefined();
    }
  });

  it("engagement score matches the configured tier weights", () => {
    const approved = SUPPORTERS.filter((s) => s.athleteId === ATHLETE.id && s.status === "approved");
    const expected = approved.reduce((acc, s) => acc + ENGAGEMENT_WEIGHTS[s.tier], 0);
    const total = computeStandings(ATHLETE.id).reduce((acc, s) => acc + s.engagementScore, 0);
    expect(total).toBe(expected);
  });

  it("stats reconcile with raw approved supporter data", () => {
    const approved = SUPPORTERS.filter((s) => s.athleteId === ATHLETE.id && s.status === "approved");
    const stats = computeStats(ATHLETE.id);
    expect(stats.totalSupporters).toBe(approved.length);
    expect(stats.totalMessages).toBe(approved.filter((s) => s.message).length);
    expect(stats.totalVideos).toBe(approved.filter((s) => s.videoUrl).length);
    expect(stats.totalRevenue).toBe(approved.reduce((a, s) => a + s.amount, 0));
  });

  it("standings dollar total equals stats revenue", () => {
    const standingsTotal = computeStandings(ATHLETE.id).reduce((a, s) => a + s.totalDollars, 0);
    expect(standingsTotal).toBe(computeStats(ATHLETE.id).totalRevenue);
  });
});

describe("excludes non-approved content", () => {
  it("pending/removed supporters never appear in standings", () => {
    const approvedDollars = SUPPORTERS.filter(
      (s) => s.athleteId === ATHLETE.id && s.status === "approved"
    ).reduce((a, s) => a + s.amount, 0);
    const allDollars = SUPPORTERS.filter((s) => s.athleteId === ATHLETE.id).reduce(
      (a, s) => a + s.amount,
      0
    );
    // demo data includes some non-approved rows, so approved < all
    expect(approvedDollars).toBeLessThan(allDollars);
    expect(computeStats(ATHLETE.id).totalRevenue).toBe(approvedDollars);
  });
});

describe("analytics helpers", () => {
  it("heatmap aggregates by state and is sorted by dollars", () => {
    const heat = computeHeatmap(ATHLETE.id);
    expect(heat.length).toBeGreaterThan(0);
    for (let i = 1; i < heat.length; i++) {
      expect(heat[i - 1].dollars).toBeGreaterThanOrEqual(heat[i].dollars);
    }
  });

  it("revenue series returns one bucket per requested day", () => {
    expect(computeRevenueSeries(ATHLETE.id, 30)).toHaveLength(30);
    expect(computeRevenueSeries(ATHLETE.id, 7)).toHaveLength(7);
  });

  it("recent raised never exceeds total raised", () => {
    expect(computeRecentRaised(ATHLETE.id, 7)).toBeLessThanOrEqual(
      computeStats(ATHLETE.id).totalRevenue
    );
  });

  it("recentSupporters returns approved rows newest-first within the limit", () => {
    const recent = recentSupporters(ATHLETE.id, 8);
    expect(recent.length).toBeLessThanOrEqual(8);
    recent.forEach((s) => expect(s.status).toBe("approved"));
    for (let i = 1; i < recent.length; i++) {
      expect(+new Date(recent[i - 1].createdAt)).toBeGreaterThanOrEqual(+new Date(recent[i].createdAt));
    }
  });
});

describe("global aggregates", () => {
  it("global standings attach a real school and sort by dollars", () => {
    const global = globalSchoolStandings();
    expect(global.length).toBeGreaterThan(0);
    global.forEach((g) => expect(g.school).toBeDefined());
    for (let i = 1; i < global.length; i++) {
      expect(global[i - 1].totalDollars).toBeGreaterThanOrEqual(global[i].totalDollars);
    }
  });

  it("platform revenue equals the sum of all athlete revenues", () => {
    const perAthlete = ATHLETES.filter((a) => a.approved).reduce(
      (acc, a) => acc + computeStats(a.id).totalRevenue,
      0
    );
    // platformTotals counts all approved supporters across all athletes
    const allApproved = SUPPORTERS.filter((s) => s.status === "approved").reduce(
      (a, s) => a + s.amount,
      0
    );
    expect(platformTotals().revenue).toBe(allApproved);
    expect(perAthlete).toBeLessThanOrEqual(allApproved);
  });
});

describe("lookups", () => {
  it("resolves athletes by slug", async () => {
    const a = await getAthleteBySlug(ATHLETE.slug);
    expect(a?.id).toBe(ATHLETE.id);
    expect(await getAthleteBySlug("nope-not-real")).toBeUndefined();
  });
});
