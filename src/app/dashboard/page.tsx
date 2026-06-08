import type { Metadata } from "next";
import {
  getAthletes, getAthleteBySlug, getSchools, getSupporters,
  computeStandings, computeStats, computeHeatmap, computeRevenueSeries,
} from "@/lib/data";
import { DashboardClient } from "@/components/dashboard-client";

export const metadata: Metadata = {
  title: "Athlete Dashboard",
  description: "Messages, videos, supporter data, and engagement analytics.",
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { athlete?: string };
}) {
  const athletes = await getAthletes();
  const athlete =
    (searchParams.athlete && (await getAthleteBySlug(searchParams.athlete))) || athletes[0];

  const [schools, supporters] = await Promise.all([getSchools(), getSupporters(athlete.id)]);

  return (
    <div className="container-rw py-10">
      <div className="mb-6 rounded-xl border border-electric-500/20 bg-electric-500/5 p-3 text-center text-xs text-electric-300">
        Demo view — in production this dashboard is gated to the authenticated athlete (Supabase Auth + RLS).
      </div>
      <DashboardClient
        athlete={athlete}
        athletes={athletes}
        supporters={supporters}
        schools={schools}
        stats={computeStats(athlete.id)}
        standings={computeStandings(athlete.id)}
        heatmap={computeHeatmap(athlete.id)}
        revenueSeries={computeRevenueSeries(athlete.id)}
      />
    </div>
  );
}
