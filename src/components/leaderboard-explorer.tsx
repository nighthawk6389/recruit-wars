"use client";

import { useState } from "react";
import Link from "next/link";
import { DollarSign, Users, Video, Zap } from "lucide-react";
import type { FanbaseStanding, School, Athlete } from "@/lib/types";
import { FanbaseLeaderboard } from "@/components/fanbase-leaderboard";
import { cn, formatCurrency } from "@/lib/utils";

type Metric = "totalDollars" | "supporters" | "videos" | "engagementScore";

const TABS: { id: Metric; label: string; icon: any }[] = [
  { id: "totalDollars", label: "Dollars", icon: DollarSign },
  { id: "supporters", label: "Supporters", icon: Users },
  { id: "videos", label: "Videos", icon: Video },
  { id: "engagementScore", label: "Engagement", icon: Zap },
];

export function LeaderboardExplorer({
  global,
  perAthlete,
}: {
  global: FanbaseStanding[];
  perAthlete: { athlete: Athlete; standings: FanbaseStanding[]; raised: number }[];
}) {
  const [metric, setMetric] = useState<Metric>("totalDollars");

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setMetric(t.id)}
              className={cn(
                "btn text-sm",
                metric === t.id ? "bg-brand-500 text-white shadow-glow" : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
              )}
            >
              <Icon className="h-4 w-4" /> {t.label}
            </button>
          );
        })}
      </div>

      <FanbaseLeaderboard standings={global} metric={metric} title="Top Schools — All Athletes" />

      <div>
        <h2 className="mb-4 font-display text-2xl font-700 uppercase tracking-tight">By Athlete</h2>
        <div className="grid gap-6 lg:grid-cols-2">
          {perAthlete.map(({ athlete, standings, raised }) => (
            <div key={athlete.id}>
              <Link
                href={`/athletes/${athlete.slug}`}
                className="mb-3 flex items-center justify-between text-sm font-semibold text-slate-300 hover:text-white"
              >
                <span>{athlete.name} · {athlete.position}</span>
                <span className="text-gold-400">{formatCurrency(raised)} raised</span>
              </Link>
              <FanbaseLeaderboard standings={standings} metric={metric} title={`Competing for ${athlete.name.split(" ")[0]}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
