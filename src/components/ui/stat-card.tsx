import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon: Icon,
  accent = "brand",
  sub,
}: {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  accent?: "brand" | "electric" | "gold" | "green";
  sub?: string;
}) {
  const accents = {
    brand: "text-brand-400 bg-brand-500/10",
    electric: "text-electric-400 bg-electric-500/10",
    gold: "text-gold-400 bg-gold-500/10",
    green: "text-emerald-400 bg-emerald-500/10",
  };
  return (
    <div className="card card-hover p-5">
      <div className="flex items-center justify-between">
        <span className="label">{label}</span>
        {Icon && (
          <span className={cn("grid h-9 w-9 place-items-center rounded-lg", accents[accent])}>
            <Icon className="h-5 w-5" />
          </span>
        )}
      </div>
      <div className="mt-3 font-display text-3xl font-700 tracking-tight">{value}</div>
      {sub && <p className="mt-1 text-xs text-slate-400">{sub}</p>}
    </div>
  );
}
