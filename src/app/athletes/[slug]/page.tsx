import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  MapPin, TrendingUp, Twitter, Instagram, Film, Trophy, Users,
  MessageSquare, Video, DollarSign, Crown, ExternalLink,
} from "lucide-react";
import {
  getAthleteBySlug, getAthletes, getSchools, getSchool,
  computeStandings, computeStats, getActivity, getSupporters,
} from "@/lib/data";
import { Stars } from "@/components/ui/stars";
import { SchoolBadge } from "@/components/ui/school-badge";
import { StatCard } from "@/components/ui/stat-card";
import { FanbaseLeaderboard } from "@/components/fanbase-leaderboard";
import { SchoolShareChart } from "@/components/school-share-chart";
import { ActivityFeed } from "@/components/activity-feed";
import { PurchasePanel } from "@/components/purchase-panel";
import { ShareCard } from "@/components/share-card";
import { formatCurrency } from "@/lib/utils";
import { siteConfig } from "@/../config/site";

export async function generateStaticParams() {
  const athletes = await getAthletes();
  return athletes.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const athlete = await getAthleteBySlug(params.slug);
  if (!athlete) return { title: "Athlete not found" };
  return {
    title: `${athlete.name} · ${athlete.position}`,
    description: `Support ${athlete.name} and put your fanbase on top. ${athlete.bio.slice(0, 120)}`,
  };
}

export default async function AthleteProfile({ params }: { params: { slug: string } }) {
  const athlete = await getAthleteBySlug(params.slug);
  if (!athlete) notFound();

  const [schools, supporters] = await Promise.all([getSchools(), getSupporters(athlete.id)]);
  const standings = computeStandings(athlete.id);
  const stats = computeStats(athlete.id);
  const activity = getActivity(athlete.id, 14);
  const captains = supporters
    .filter((s) => s.tier === "captain" && s.status === "approved")
    .slice(0, 8);

  return (
    <div className="container-rw py-8">
      {/* HEADER */}
      <div className="card overflow-hidden">
        <div className="relative h-40 w-full sm:h-56">
          <Image src={athlete.photoUrl} alt="" fill className="object-cover opacity-40" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900 to-transparent" />
        </div>
        <div className="relative px-6 pb-6">
          <div className="-mt-16 flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-2xl border-4 border-ink-900 shadow-card">
              <Image src={athlete.photoUrl} alt={athlete.name} fill className="object-cover" sizes="128px" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-3xl font-700 uppercase tracking-tight">{athlete.name}</h1>
                <span className="chip">{athlete.position}</span>
                <span className="chip">Class of {athlete.classYear}</span>
                <StatusPill status={athlete.recruitingStatus} committedTo={athlete.committedTo} />
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-slate-400">
                <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {athlete.hometown}</span>
                <span>{athlete.height} · {athlete.weight}</span>
                <span className="flex items-center gap-2"><Stars count={athlete.stars} size={15} /> {athlete.rating}</span>
              </div>
            </div>
            <div className="flex gap-2">
              {athlete.socials.x && <SocialLink href={athlete.socials.x}><Twitter className="h-4 w-4" /></SocialLink>}
              {athlete.socials.instagram && <SocialLink href={athlete.socials.instagram}><Instagram className="h-4 w-4" /></SocialLink>}
              {athlete.socials.hudl && <SocialLink href={athlete.socials.hudl}><Film className="h-4 w-4" /></SocialLink>}
            </div>
          </div>
          <p className="mt-4 max-w-3xl text-slate-300">{athlete.bio}</p>
        </div>
      </div>

      {/* STATS */}
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total raised" value={formatCurrency(stats.totalRevenue)} icon={DollarSign} accent="gold" />
        <StatCard label="Supporters" value={stats.totalSupporters.toLocaleString()} icon={Users} accent="electric" />
        <StatCard label="Messages" value={stats.totalMessages.toLocaleString()} icon={MessageSquare} accent="brand" />
        <StatCard label="Videos" value={stats.totalVideos.toLocaleString()} icon={Video} accent="green" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* LEFT — main */}
        <div className="space-y-6 lg:col-span-2">
          {/* highlight video */}
          <div className="card overflow-hidden">
            <div className="flex items-center gap-2 p-4">
              <Film className="h-5 w-5 text-brand-400" />
              <h2 className="font-display text-lg font-700 uppercase">Highlight Reel</h2>
            </div>
            <div className="aspect-video w-full bg-black">
              <iframe
                src={athlete.highlightVideoUrl}
                title={`${athlete.name} highlights`}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>

          <SchoolShareChart standings={standings} />
          <FanbaseLeaderboard standings={standings} />

          {/* PURCHASE */}
          <div id="support" className="scroll-mt-20">
            <div className="mb-4">
              <p className="label text-brand-400">Show Your Support</p>
              <h2 className="mt-1 font-display text-2xl font-700 uppercase tracking-tight">
                Put {athlete.name.split(" ")[0]} in your colors
              </h2>
            </div>
            <PurchasePanel athlete={athlete} schools={schools} />
          </div>
        </div>

        {/* RIGHT — sidebar */}
        <div className="space-y-6">
          <ShareCard athlete={athlete} standings={standings} totalSupporters={stats.totalSupporters} />

          {/* NIL + interest tracker */}
          <div className="card p-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
              <h3 className="font-display text-lg font-700 uppercase">NIL Valuation</h3>
            </div>
            <div className="mt-2 font-display text-3xl font-700 text-emerald-400">
              {formatCurrency(athlete.nilValuation)}
            </div>
            <p className="mt-1 text-xs text-slate-500">Estimated NIL value · for informational purposes</p>

            <h4 className="label mt-6 mb-3">School Interest Tracker</h4>
            <div className="space-y-2">
              {standings.slice(0, 6).map((s) => {
                const school = getSchool(s.schoolId)!;
                const max = standings[0].engagementScore || 1;
                const w = Math.round((s.engagementScore / max) * 100);
                return (
                  <div key={s.schoolId} className="flex items-center gap-2">
                    <SchoolBadge school={school} size="sm" />
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/5">
                      <div className="h-full rounded-full" style={{ width: `${w}%`, background: school.color }} />
                    </div>
                    <span className="w-10 text-right text-xs font-semibold text-slate-400">{w}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Offer list */}
          <div className="card p-6">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-gold-400" />
              <h3 className="font-display text-lg font-700 uppercase">Offer List</h3>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {athlete.offers.map((id) => {
                const s = getSchool(id);
                if (!s) return null;
                return (
                  <span key={id} className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-sm">
                    <SchoolBadge school={s} size="sm" /> {s.name}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Top Fan Captains */}
          <div className="card p-6">
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-gold-400" />
              <h3 className="font-display text-lg font-700 uppercase">Top Fan Captains</h3>
            </div>
            {captains.length === 0 ? (
              <p className="mt-3 text-sm text-slate-400">No Fan Captains yet — claim the first spot!</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {captains.map((c) => {
                  const s = getSchool(c.schoolId)!;
                  return (
                    <li key={c.id} className="flex items-center gap-3 rounded-lg bg-white/[0.03] p-2.5">
                      <SchoolBadge school={s} size="sm" />
                      <span className="font-semibold">{c.fanName}</span>
                      <span className="ml-auto text-xs text-slate-500">{c.city}</span>
                      <Crown className="h-4 w-4 text-gold-400" />
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <ActivityFeed initial={activity} />
        </div>
      </div>
    </div>
  );
}

function StatusPill({ status, committedTo }: { status: string; committedTo?: string }) {
  const school = committedTo ? getSchool(committedTo) : null;
  const color =
    status === "Uncommitted" ? "bg-electric-500/15 text-electric-400"
    : status === "Committed" ? "bg-emerald-500/15 text-emerald-400"
    : "bg-gold-500/15 text-gold-400";
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${color}`}>
      {status}{school ? ` · ${school.name}` : ""}
    </span>
  );
}

function SocialLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white"
    >
      {children}
    </a>
  );
}
