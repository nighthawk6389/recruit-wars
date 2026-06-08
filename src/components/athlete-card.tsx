import Link from "next/link";
import Image from "next/image";
import { MapPin, TrendingUp } from "lucide-react";
import type { Athlete } from "@/lib/types";
import { Stars } from "@/components/ui/stars";
import { computeStats } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

export function AthleteCard({ athlete }: { athlete: Athlete }) {
  const stats = computeStats(athlete.id);
  return (
    <Link
      href={`/athletes/${athlete.slug}`}
      className="card card-hover group block overflow-hidden"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={athlete.photoUrl}
          alt={athlete.name}
          fill
          sizes="(max-width:768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/30 to-transparent" />
        <div className="absolute left-3 top-3 flex items-center gap-2">
          <span className="rounded-lg bg-black/50 px-2 py-1 text-xs font-700 text-white backdrop-blur">
            {athlete.position}
          </span>
          <span className="rounded-lg bg-black/50 px-2 py-1 text-xs font-medium text-white backdrop-blur">
            {athlete.classYear}
          </span>
        </div>
        {athlete.recruitingStatus === "Committed" && (
          <span className="absolute right-3 top-3 rounded-lg bg-emerald-500/90 px-2 py-1 text-xs font-700 text-white">
            Committed
          </span>
        )}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="font-display text-xl font-700 text-white">{athlete.name}</h3>
          <div className="mt-1 flex items-center gap-2">
            <Stars count={athlete.stars} size={14} />
            <span className="text-xs text-slate-300">{athlete.rating}</span>
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between text-sm text-slate-400">
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" /> {athlete.hometown}
          </span>
          <span className="flex items-center gap-1 text-emerald-400">
            <TrendingUp className="h-3.5 w-3.5" /> {formatCurrency(athlete.nilValuation)}
          </span>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          <Mini label="Raised" value={formatCurrency(stats.totalRevenue)} />
          <Mini label="Fans" value={stats.totalSupporters.toLocaleString()} />
          <Mini label="Videos" value={stats.totalVideos.toLocaleString()} />
        </div>
      </div>
    </Link>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white/[0.03] py-2">
      <div className="font-display text-sm font-700">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-slate-500">{label}</div>
    </div>
  );
}
