"use client";

import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import type { FanbaseStanding } from "@/lib/types";
import { getSchool } from "@/lib/data";
import { SchoolBadge } from "@/components/ui/school-badge";
import { formatCurrency, pct } from "@/lib/utils";

type Metric = "totalDollars" | "supporters" | "videos" | "engagementScore";

const METRIC_LABEL: Record<Metric, string> = {
  totalDollars: "Total Dollars",
  supporters: "Supporters",
  videos: "Videos",
  engagementScore: "Engagement",
};

export function FanbaseLeaderboard({
  standings,
  metric = "totalDollars",
  title = "Fanbase Leaderboard",
}: {
  standings: FanbaseStanding[];
  metric?: Metric;
  title?: string;
}) {
  const sorted = [...standings].sort((a, b) => b[metric] - a[metric]);
  const max = sorted[0]?.[metric] || 1;

  return (
    <div className="card p-6">
      <div className="mb-5 flex items-center gap-2">
        <Trophy className="h-5 w-5 text-gold-400" />
        <h3 className="font-display text-xl font-700 uppercase tracking-tight">{title}</h3>
        <span className="chip ml-auto">{METRIC_LABEL[metric]}</span>
      </div>

      <div className="space-y-3">
        {sorted.map((row, i) => {
          const school = getSchool(row.schoolId);
          if (!school) return null;
          const width = pct(row[metric], max);
          const display =
            metric === "totalDollars"
              ? formatCurrency(row.totalDollars)
              : row[metric].toLocaleString();
          return (
            <div key={row.schoolId} className="group">
              <div className="mb-1 flex items-center gap-3">
                <span className="w-5 shrink-0 text-center font-display text-sm font-700 text-slate-500">
                  {i + 1}
                </span>
                <SchoolBadge school={school} size="sm" />
                <span className="font-semibold text-slate-100">{school.name}</span>
                <span className="ml-auto font-display text-lg font-700 tabular-nums">
                  {display}
                </span>
              </div>
              <div className="ml-8 h-2.5 overflow-hidden rounded-full bg-white/5">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${width}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, ease: "easeOut", delay: i * 0.06 }}
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${school.color}, ${school.color}cc)`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
