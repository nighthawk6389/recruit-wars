"use client";

import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import type { FanbaseStanding } from "@/lib/types";
import { getSchool } from "@/lib/data";
import { pct } from "@/lib/utils";

/**
 * "Top Schools Competing For Athlete" — animated donut + share-of-support
 * bars. Live-update friendly (re-renders when standings change).
 */
export function SchoolShareChart({ standings }: { standings: FanbaseStanding[] }) {
  const top = [...standings]
    .sort((a, b) => b.totalDollars - a.totalDollars)
    .slice(0, 5);
  const total = top.reduce((a, s) => a + s.totalDollars, 0) || 1;

  const data = top.map((s) => {
    const school = getSchool(s.schoolId)!;
    return {
      name: school.name,
      value: s.totalDollars,
      color: school.color,
      share: pct(s.totalDollars, total),
    };
  });

  return (
    <div className="card p-6">
      <h3 className="mb-1 font-display text-xl font-700 uppercase tracking-tight">
        Top Schools Competing
      </h3>
      <p className="mb-4 text-sm text-slate-400">Share of total fan support · live</p>

      <div className="grid items-center gap-6 sm:grid-cols-2">
        <div className="relative mx-auto h-48 w-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                innerRadius={62}
                outerRadius={90}
                paddingAngle={3}
                stroke="none"
                startAngle={90}
                endAngle={-270}
              >
                {data.map((d, i) => (
                  <Cell key={i} fill={d.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <div className="text-center">
              <div className="font-display text-2xl font-700">{data[0]?.share ?? 0}%</div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400">
                {data[0]?.name ?? "—"} leads
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {data.map((d, i) => (
            <div key={d.name}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 font-medium">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} />
                  {d.name}
                </span>
                <span className="font-display font-700">{d.share}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${d.share}%` }}
                  transition={{ duration: 0.8, delay: i * 0.08 }}
                  className="h-full rounded-full"
                  style={{ background: d.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
