import Link from "next/link";
import { ArrowRight, Flame, Trophy, Video, Users, ShieldCheck, Zap, Share2, BarChart3 } from "lucide-react";
import { siteConfig } from "@/../config/site";
import { getAthletes, platformTotals, globalSchoolStandings } from "@/lib/data";
import { AthleteCard } from "@/components/athlete-card";
import { FanbaseLeaderboard } from "@/components/fanbase-leaderboard";
import { SupportTiers } from "@/components/support-tiers";
import { StatCard } from "@/components/ui/stat-card";
import { formatCurrency, formatCompact } from "@/lib/utils";

export default async function HomePage() {
  const athletes = (await getAthletes({ approvedOnly: true })).filter((a) => a.featured);
  const totals = platformTotals();
  const standings = globalSchoolStandings();

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-faint [background-size:32px_32px] opacity-40" />
        <div className="container-rw relative py-20 sm:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <span className="chip mx-auto mb-6 animate-fade-up">
              <Flame className="h-3.5 w-3.5 text-brand-400" />
              Fan engagement &amp; NIL — built for recruiting season
            </span>
            <h1 className="font-display text-4xl font-700 uppercase leading-[1.05] tracking-tight sm:text-6xl animate-fade-up">
              Rally your fanbase.
              <br />
              <span className="gradient-text">Power your recruit.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg text-slate-300 animate-fade-up">
              {siteConfig.name} lets college football fanbases compete to support the athletes they
              love — through messages, hype videos, and premium memberships. Climb the leaderboard.
              Go viral.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row animate-fade-up">
              <Link href="/athletes" className="btn-primary px-7 py-3.5 text-base">
                Support a Recruit <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/leaderboard" className="btn-secondary px-7 py-3.5 text-base">
                View Leaderboards
              </Link>
            </div>
            <p className="mt-6 text-xs text-slate-500">{siteConfig.complianceStatement}</p>
          </div>

          {/* Live stat strip */}
          <div className="mx-auto mt-14 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard label="Raised for athletes" value={formatCurrency(totals.revenue)} icon={Trophy} accent="gold" />
            <StatCard label="Total supporters" value={formatCompact(totals.supporters)} icon={Users} accent="electric" />
            <StatCard label="Hype videos" value={formatCompact(totals.videos)} icon={Video} accent="brand" />
            <StatCard label="Schools competing" value={totals.schools} icon={Flame} accent="green" />
          </div>
        </div>
      </section>

      {/* FEATURED ATHLETES */}
      <section className="container-rw py-16">
        <SectionHeader
          eyebrow="Featured Recruits"
          title="Back the next generation"
          cta={{ href: "/athletes", label: "All athletes" }}
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {athletes.map((a) => (
            <AthleteCard key={a.id} athlete={a} />
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-y border-white/5 bg-ink-900/40 py-16">
        <div className="container-rw">
          <SectionHeader eyebrow="How it works" title="Three steps to lead the board" />
          <div className="grid gap-6 md:grid-cols-3">
            <HowStep n="01" icon={Users} title="Pick your recruit & school" text="Find an athlete your program is recruiting and rep your fanbase." />
            <HowStep n="02" icon={Zap} title="Show your support" text="Send a message, upload a hype video, or claim a VIP / Fan Captain spot." />
            <HowStep n="03" icon={Trophy} title="Climb & go viral" text="Every dollar moves your school up the public leaderboard. Share the win." />
          </div>
        </div>
      </section>

      {/* TIERS */}
      <section className="container-rw py-16">
        <SectionHeader eyebrow="Support Tiers" title="Choose how you show up" />
        <SupportTiers />
        <p className="mt-6 text-center text-sm text-slate-500">
          Want to support an athlete now? <Link href="/athletes" className="text-brand-400 hover:underline">Browse recruits →</Link>
        </p>
      </section>

      {/* LEADERBOARD PREVIEW */}
      <section className="border-t border-white/5 bg-ink-900/40 py-16">
        <div className="container-rw grid gap-8 lg:grid-cols-2">
          <div>
            <SectionHeader eyebrow="Live Leaderboard" title="Which fanbase is winning?" />
            <FanbaseLeaderboard standings={standings} title="Top Schools (All Athletes)" />
          </div>
          <div className="flex flex-col justify-center gap-5">
            <Feature icon={BarChart3} title="Live animated charts" text="Real-time rankings by dollars, supporters, videos, and engagement score." />
            <Feature icon={Share2} title="Auto-generated share graphics" text="One-click viral cards: 'LSU Takes The Lead', '1,000 Fans Supported This Recruit'." />
            <Feature icon={ShieldCheck} title="Compliance-first" text="Clear NIL/NCAA disclaimers and full moderation tools across the platform." />
            <Link href="/leaderboard" className="btn-primary w-fit">
              Explore leaderboards <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-rw py-20">
        <div className="card relative overflow-hidden bg-brand-radial p-10 text-center sm:p-16">
          <div className="absolute inset-0 bg-grid-faint [background-size:28px_28px] opacity-30" />
          <div className="relative">
            <h2 className="font-display text-3xl font-700 uppercase sm:text-4xl">
              Your fanbase vs. the world
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-300">
              Join thousands of fans turning passion into support. Find your recruit and put your
              school on top.
            </p>
            <Link href="/athletes" className="btn-primary mx-auto mt-6 w-fit px-8 py-3.5 text-base">
              Get started <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function SectionHeader({
  eyebrow,
  title,
  cta,
}: {
  eyebrow: string;
  title: string;
  cta?: { href: string; label: string };
}) {
  return (
    <div className="mb-8 flex items-end justify-between">
      <div>
        <p className="label text-brand-400">{eyebrow}</p>
        <h2 className="mt-1 font-display text-2xl font-700 uppercase tracking-tight sm:text-3xl">
          {title}
        </h2>
      </div>
      {cta && (
        <Link href={cta.href} className="hidden items-center gap-1 text-sm font-semibold text-slate-300 hover:text-white sm:flex">
          {cta.label} <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}

function HowStep({ n, icon: Icon, title, text }: { n: string; icon: any; title: string; text: string }) {
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-500/15 text-brand-400">
          <Icon className="h-6 w-6" />
        </span>
        <span className="font-display text-3xl font-700 text-white/10">{n}</span>
      </div>
      <h3 className="mt-4 font-display text-lg font-700">{title}</h3>
      <p className="mt-1 text-sm text-slate-400">{text}</p>
    </div>
  );
}

function Feature({ icon: Icon, title, text }: { icon: any; title: string; text: string }) {
  return (
    <div className="flex gap-4">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/5 text-brand-400">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-slate-400">{text}</p>
      </div>
    </div>
  );
}
