"use client";

import { useMemo, useState } from "react";
import { Download, MessageSquare, Video, Mail, MapPin, Filter, BarChart3 } from "lucide-react";
import type { Supporter, School, Athlete, FanbaseStanding, AthleteStats } from "@/lib/types";
import { SchoolBadge } from "@/components/ui/school-badge";
import { StatCard } from "@/components/ui/stat-card";
import { RevenueChart } from "@/components/revenue-chart";
import { FanbaseLeaderboard } from "@/components/fanbase-leaderboard";
import { formatCurrency, timeAgo, cn } from "@/lib/utils";
import { TIERS_BY_ID } from "@/../config/tiers";

function toCsv(rows: Record<string, any>[]) {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const escape = (v: any) => `"${String(v ?? "").replaceAll('"', '""')}"`;
  return [headers.join(","), ...rows.map((r) => headers.map((h) => escape(r[h])).join(","))].join("\n");
}

function download(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

type Tab = "messages" | "videos" | "analytics";

export function AthleteDashboard({
  athlete,
  athletes,
  supporters,
  schools,
  stats,
  standings,
  heatmap,
  revenueSeries,
  onSwitchAthlete,
}: {
  athlete: Athlete;
  athletes: Athlete[];
  supporters: Supporter[];
  schools: School[];
  stats: AthleteStats;
  standings: FanbaseStanding[];
  heatmap: { state: string; supporters: number; dollars: number }[];
  revenueSeries: { date: string; dollars: number }[];
  onSwitchAthlete: (slug: string) => void;
}) {
  const [tab, setTab] = useState<Tab>("messages");
  const [schoolFilter, setSchoolFilter] = useState<string>("all");

  const approved = useMemo(() => supporters.filter((s) => s.status === "approved"), [supporters]);
  const filtered = useMemo(
    () => (schoolFilter === "all" ? approved : approved.filter((s) => s.schoolId === schoolFilter)),
    [approved, schoolFilter]
  );
  const messages = filtered.filter((s) => s.message);
  const videos = filtered.filter((s) => s.videoUrl);
  const maxState = heatmap[0]?.dollars || 1;

  return (
    <div className="space-y-6">
      {/* header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="label text-brand-400">Athlete Dashboard</p>
          <h1 className="mt-1 font-display text-3xl font-700 uppercase tracking-tight">{athlete.name}</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={athlete.slug}
            onChange={(e) => onSwitchAthlete(e.target.value)}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm"
          >
            {athletes.map((a) => (
              <option key={a.id} value={a.slug} className="bg-ink-900">{a.name}</option>
            ))}
          </select>
          <button
            onClick={() =>
              download(
                `${athlete.slug}-supporters.csv`,
                toCsv(approved.map((s) => ({
                  name: s.fanName, email: s.email, school: schools.find((x) => x.id === s.schoolId)?.name,
                  tier: s.tier, amount: s.amount, city: s.city, state: s.state, message: s.message ?? "",
                  date: s.createdAt,
                })))
              )
            }
            className="btn-secondary text-sm"
          >
            <Download className="h-4 w-4" /> Export supporters
          </button>
          <button
            onClick={() =>
              download(
                `${athlete.slug}-emails.csv`,
                toCsv(approved.map((s) => ({ name: s.fanName, email: s.email, school: s.schoolId })))
              )
            }
            className="btn-secondary text-sm"
          >
            <Mail className="h-4 w-4" /> Download emails
          </button>
        </div>
      </div>

      {/* stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total revenue" value={formatCurrency(stats.totalRevenue)} icon={BarChart3} accent="gold" />
        <StatCard label="Supporters" value={stats.totalSupporters.toLocaleString()} accent="electric" />
        <StatCard label="Messages" value={stats.totalMessages.toLocaleString()} icon={MessageSquare} accent="brand" />
        <StatCard label="Videos" value={stats.totalVideos.toLocaleString()} icon={Video} accent="green" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* tabs + filter */}
          <div className="card p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex gap-1 rounded-xl bg-white/5 p-1">
                {(["messages", "videos", "analytics"] as Tab[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={cn(
                      "rounded-lg px-3 py-1.5 text-sm font-semibold capitalize transition-colors",
                      tab === t ? "bg-brand-500 text-white" : "text-slate-400 hover:text-white"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-slate-500" />
                <select
                  value={schoolFilter}
                  onChange={(e) => setSchoolFilter(e.target.value)}
                  className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-sm"
                >
                  <option value="all" className="bg-ink-900">All schools</option>
                  {schools.map((s) => (
                    <option key={s.id} value={s.id} className="bg-ink-900">{s.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {tab === "messages" && (
              <div className="space-y-3">
                {messages.length === 0 && <Empty text="No messages yet for this filter." />}
                {messages.slice(0, 30).map((s) => {
                  const school = schools.find((x) => x.id === s.schoolId)!;
                  return (
                    <div key={s.id} className="flex gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3">
                      <SchoolBadge school={school} size="sm" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{s.fanName}</span>
                          {s.vip && <span className="rounded bg-purple-500/15 px-1.5 py-0.5 text-[10px] font-700 text-purple-400">VIP</span>}
                          <span className="text-xs text-slate-500">· {school.name}</span>
                          <span className="ml-auto text-xs text-slate-500">{timeAgo(s.createdAt)}</span>
                        </div>
                        <p className="mt-1 text-sm text-slate-300">{s.message}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {tab === "videos" && (
              <div className="grid gap-4 sm:grid-cols-2">
                {videos.length === 0 && <Empty text="No videos yet for this filter." />}
                {videos.slice(0, 12).map((s) => {
                  const school = schools.find((x) => x.id === s.schoolId)!;
                  return (
                    <div key={s.id} className="overflow-hidden rounded-xl border border-white/5">
                      <div className="aspect-video w-full bg-black">
                        <iframe src={s.videoUrl} title={`${s.fanName} video`} className="h-full w-full" allowFullScreen />
                      </div>
                      <div className="flex items-center gap-2 p-3">
                        <SchoolBadge school={school} size="sm" />
                        <span className="text-sm font-semibold">{s.fanName}</span>
                        <span className="ml-auto text-xs text-slate-500">{TIERS_BY_ID[s.tier].name}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {tab === "analytics" && (
              <div className="space-y-6">
                <div>
                  <h4 className="label mb-2">Revenue · last 30 days</h4>
                  <RevenueChart data={revenueSeries} />
                </div>
                <div>
                  <h4 className="label mb-3 flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> Support heat map by state</h4>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {heatmap.map((h) => {
                      const intensity = h.dollars / maxState;
                      return (
                        <div
                          key={h.state}
                          className="rounded-xl border border-white/5 p-3 text-center"
                          style={{ background: `rgba(255,45,23,${0.08 + intensity * 0.45})` }}
                        >
                          <div className="font-display text-lg font-700">{h.state}</div>
                          <div className="text-xs text-slate-300">{formatCurrency(h.dollars)}</div>
                          <div className="text-[10px] text-slate-500">{h.supporters} fans</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <FanbaseLeaderboard standings={standings} />
        </div>
      </div>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="py-8 text-center text-sm text-slate-500">{text}</p>;
}
