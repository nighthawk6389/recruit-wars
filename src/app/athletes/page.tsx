import type { Metadata } from "next";
import { getAthletes } from "@/lib/data";
import { AthleteCard } from "@/components/athlete-card";

export const metadata: Metadata = {
  title: "Athletes",
  description: "Browse college football recruits and back your fanbase.",
};

export default async function AthletesPage() {
  const athletes = await getAthletes({ approvedOnly: true });

  return (
    <div className="container-rw py-12">
      <div className="mb-8">
        <p className="label text-brand-400">The Recruits</p>
        <h1 className="mt-1 font-display text-3xl font-700 uppercase tracking-tight sm:text-4xl">
          Back a Recruit
        </h1>
        <p className="mt-2 max-w-2xl text-slate-400">
          Pick an athlete your program is recruiting, rep your school, and climb the fanbase
          leaderboard. Every message and video counts.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {athletes.map((a) => (
          <AthleteCard key={a.id} athlete={a} />
        ))}
      </div>
    </div>
  );
}
