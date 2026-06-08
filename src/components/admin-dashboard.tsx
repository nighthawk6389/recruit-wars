"use client";

import { useState } from "react";
import {
  ShieldCheck, Check, X, Ban, Trash2, MessageSquare, Video,
  Users, GraduationCap, CreditCard, Download, AlertTriangle,
} from "lucide-react";
import type { Supporter, School, Athlete } from "@/lib/types";
import { SchoolBadge } from "@/components/ui/school-badge";
import { StatCard } from "@/components/ui/stat-card";
import { Stars } from "@/components/ui/stars";
import { formatCurrency, timeAgo, cn } from "@/lib/utils";
import { TIERS_BY_ID } from "@/../config/tiers";

type Tab = "athletes" | "messages" | "videos" | "schools" | "payments" | "users";

const TABS: { id: Tab; label: string; icon: any }[] = [
  { id: "athletes", label: "Approve Athletes", icon: ShieldCheck },
  { id: "messages", label: "Moderate Messages", icon: MessageSquare },
  { id: "videos", label: "Moderate Videos", icon: Video },
  { id: "schools", label: "Manage Schools", icon: GraduationCap },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "users", label: "Users / Bans", icon: Users },
];

export function AdminDashboard({
  athletes: initialAthletes,
  supporters: initialSupporters,
  schools,
  totals,
}: {
  athletes: Athlete[];
  supporters: Supporter[];
  schools: School[];
  totals: { revenue: number; supporters: number; videos: number; pending: number };
}) {
  const [tab, setTab] = useState<Tab>("athletes");
  const [athletes, setAthletes] = useState(initialAthletes);
  const [supporters, setSupporters] = useState(initialSupporters);
  const [banned, setBanned] = useState<Set<string>>(new Set());

  const schoolName = (id: string) => schools.find((s) => s.id === id)?.name ?? id;

  const setSupporterStatus = (id: string, status: Supporter["status"]) =>
    setSupporters((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));

  const pendingMessages = supporters.filter((s) => s.message && s.status === "pending");
  const pendingVideos = supporters.filter((s) => s.videoUrl && s.status === "pending");
  const allMessages = supporters.filter((s) => s.message).slice(0, 40);
  const allVideos = supporters.filter((s) => s.videoUrl).slice(0, 16);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-6 w-6 text-brand-400" />
        <h1 className="font-display text-3xl font-700 uppercase tracking-tight">Admin Control</h1>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Platform revenue" value={formatCurrency(totals.revenue)} accent="gold" />
        <StatCard label="Supporters" value={totals.supporters.toLocaleString()} accent="electric" />
        <StatCard label="Videos" value={totals.videos.toLocaleString()} accent="brand" />
        <StatCard label="Pending review" value={totals.pending} icon={AlertTriangle} accent="green" />
      </div>

      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "btn text-sm",
                tab === t.id ? "bg-brand-500 text-white shadow-glow" : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
              )}
            >
              <Icon className="h-4 w-4" /> {t.label}
            </button>
          );
        })}
      </div>

      <div className="card p-5">
        {tab === "athletes" && (
          <div className="space-y-3">
            {athletes.map((a) => (
              <div key={a.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{a.name}</span>
                    <span className="text-xs text-slate-500">{a.position} · {a.classYear} · {a.hometown}</span>
                    <Stars count={a.stars} size={12} />
                  </div>
                </div>
                {a.approved ? (
                  <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-400">Approved</span>
                ) : (
                  <span className="rounded-full bg-gold-500/15 px-3 py-1 text-xs font-semibold text-gold-400">Pending</span>
                )}
                <button
                  onClick={() => setAthletes((prev) => prev.map((x) => x.id === a.id ? { ...x, approved: !x.approved } : x))}
                  className={cn("btn text-xs", a.approved ? "border border-white/10 bg-white/5" : "bg-emerald-500 text-white")}
                >
                  {a.approved ? <><X className="h-3.5 w-3.5" /> Revoke</> : <><Check className="h-3.5 w-3.5" /> Approve</>}
                </button>
              </div>
            ))}
          </div>
        )}

        {tab === "messages" && (
          <ModerationList
            title={`${pendingMessages.length} pending · showing recent`}
            items={allMessages}
            schoolName={schoolName}
            render={(s) => <p className="text-sm text-slate-300">{s.message}</p>}
            onApprove={(id) => setSupporterStatus(id, "approved")}
            onRemoveLabel="Remove"
            onRemove={(id) => setSupporterStatus(id, "removed")}
          />
        )}

        {tab === "videos" && (
          <div>
            <p className="mb-3 text-sm text-slate-400">{pendingVideos.length} pending review</p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {allVideos.map((s) => (
                <div key={s.id} className="overflow-hidden rounded-xl border border-white/5">
                  <div className="aspect-video w-full bg-black">
                    <iframe src={s.videoUrl} title="video" className="h-full w-full" allowFullScreen />
                  </div>
                  <div className="p-3">
                    <div className="flex items-center gap-2">
                      <SchoolBadge school={schools.find((x) => x.id === s.schoolId)!} size="sm" />
                      <span className="text-sm font-semibold">{s.fanName}</span>
                      <StatusDot status={s.status} />
                    </div>
                    <div className="mt-2 flex gap-2">
                      <button onClick={() => setSupporterStatus(s.id, "approved")} className="btn flex-1 bg-emerald-500/90 text-xs text-white"><Check className="h-3.5 w-3.5" /> Approve</button>
                      <button onClick={() => setSupporterStatus(s.id, "removed")} className="btn flex-1 border border-white/10 bg-white/5 text-xs"><Trash2 className="h-3.5 w-3.5" /> Remove</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "schools" && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {schools.map((s) => (
              <div key={s.id} className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3">
                <SchoolBadge school={s} />
                <div>
                  <div className="font-semibold">{s.name}</div>
                  <div className="text-xs text-slate-500">{s.fullName} · {s.state}</div>
                </div>
              </div>
            ))}
            <button className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-white/10 p-3 text-sm text-slate-400 hover:bg-white/5">
              + Add school
            </button>
          </div>
        )}

        {tab === "payments" && (
          <div className="space-y-3">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5 text-left text-xs uppercase text-slate-500">
                    <th className="py-2">Fan</th><th>School</th><th>Tier</th><th>Amount</th><th>Date</th><th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {supporters.slice(0, 25).map((s) => (
                    <tr key={s.id} className="border-b border-white/5">
                      <td className="py-2">{s.fanName}</td>
                      <td>{schoolName(s.schoolId)}</td>
                      <td>{TIERS_BY_ID[s.tier].name}</td>
                      <td className="font-semibold text-gold-400">{formatCurrency(s.amount)}</td>
                      <td className="text-slate-500">{timeAgo(s.createdAt)}</td>
                      <td><StatusDot status={s.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button className="btn-secondary text-sm"><Download className="h-4 w-4" /> Export payments CSV</button>
          </div>
        )}

        {tab === "users" && (
          <div className="space-y-3">
            {Array.from(new Map(supporters.map((s) => [s.email, s])).values()).slice(0, 20).map((s) => {
              const isBanned = banned.has(s.email!);
              return (
                <div key={s.email} className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3">
                  <div className="flex-1">
                    <span className="font-semibold">{s.fanName}</span>
                    <span className="ml-2 text-xs text-slate-500">{s.email}</span>
                  </div>
                  {isBanned && <span className="rounded-full bg-brand-500/15 px-3 py-1 text-xs font-semibold text-brand-400">Banned</span>}
                  <button
                    onClick={() => setBanned((prev) => {
                      const next = new Set(prev);
                      isBanned ? next.delete(s.email!) : next.add(s.email!);
                      return next;
                    })}
                    className={cn("btn text-xs", isBanned ? "border border-white/10 bg-white/5" : "bg-brand-500 text-white")}
                  >
                    <Ban className="h-3.5 w-3.5" /> {isBanned ? "Unban" : "Ban"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function ModerationList({
  title, items, schoolName, render, onApprove, onRemove, onRemoveLabel,
}: {
  title: string;
  items: Supporter[];
  schoolName: (id: string) => string;
  render: (s: Supporter) => React.ReactNode;
  onApprove: (id: string) => void;
  onRemove: (id: string) => void;
  onRemoveLabel: string;
}) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-400">{title}</p>
      {items.map((s) => (
        <div key={s.id} className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3">
          <div className="flex-1">
            <div className="mb-1 flex items-center gap-2">
              <span className="font-semibold">{s.fanName}</span>
              <span className="text-xs text-slate-500">· {schoolName(s.schoolId)}</span>
              <StatusDot status={s.status} />
              <span className="ml-auto text-xs text-slate-500">{timeAgo(s.createdAt)}</span>
            </div>
            {render(s)}
          </div>
          <div className="flex shrink-0 gap-2">
            <button onClick={() => onApprove(s.id)} className="btn bg-emerald-500/90 text-xs text-white"><Check className="h-3.5 w-3.5" /></button>
            <button onClick={() => onRemove(s.id)} className="btn border border-white/10 bg-white/5 text-xs"><Trash2 className="h-3.5 w-3.5" /> {onRemoveLabel}</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function StatusDot({ status }: { status: Supporter["status"] }) {
  const map = {
    approved: "bg-emerald-500/15 text-emerald-400",
    pending: "bg-gold-500/15 text-gold-400",
    removed: "bg-brand-500/15 text-brand-400",
  };
  return <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize", map[status])}>{status}</span>;
}
