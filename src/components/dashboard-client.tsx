"use client";

import { useRouter } from "next/navigation";
import { AthleteDashboard } from "@/components/athlete-dashboard";
import type { Supporter, School, Athlete, FanbaseStanding, AthleteStats } from "@/lib/types";

export function DashboardClient(props: {
  athlete: Athlete;
  athletes: Athlete[];
  supporters: Supporter[];
  schools: School[];
  stats: AthleteStats;
  standings: FanbaseStanding[];
  heatmap: { state: string; supporters: number; dollars: number }[];
  revenueSeries: { date: string; dollars: number }[];
}) {
  const router = useRouter();
  return (
    <AthleteDashboard
      {...props}
      onSwitchAthlete={(slug) => router.push(`/dashboard?athlete=${slug}`)}
    />
  );
}
