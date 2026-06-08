import type { Metadata } from "next";
import { getAthletes, globalSchoolStandings, computeStandings, computeStats } from "@/lib/data";
import { LeaderboardExplorer } from "@/components/leaderboard-explorer";

export const metadata: Metadata = {
  title: "Leaderboards",
  description: "Public fanbase rankings by dollars, supporters, videos, and engagement.",
};

export default async function LeaderboardPage() {
  const athletes = await getAthletes({ approvedOnly: true });
  const global = globalSchoolStandings();
  const perAthlete = athletes.map((athlete) => ({
    athlete,
    standings: computeStandings(athlete.id),
    raised: computeStats(athlete.id).totalRevenue,
  }));

  return (
    <div className="container-rw py-12">
      <div className="mb-8">
        <p className="label text-brand-400">Live Rankings</p>
        <h1 className="mt-1 font-display text-3xl font-700 uppercase tracking-tight sm:text-4xl">
          Fanbase Leaderboards
        </h1>
        <p className="mt-2 max-w-2xl text-slate-400">
          Public rankings update in real time. Switch between total dollars, number of supporters,
          videos submitted, and overall engagement score.
        </p>
      </div>

      <LeaderboardExplorer global={global} perAthlete={perAthlete} />
    </div>
  );
}
