"use client";

import { Check, Star } from "lucide-react";
import { SUPPORT_TIERS, type SupportTier } from "@/../config/tiers";
import { formatCurrency, cn } from "@/lib/utils";

const ACCENT: Record<SupportTier["accent"], string> = {
  brand: "ring-brand-500/40 hover:shadow-glow",
  electric: "ring-electric-500/40",
  gold: "ring-gold-500/40 hover:shadow-glow-gold",
  purple: "ring-purple-500/40",
};
const ICON_BG: Record<SupportTier["accent"], string> = {
  brand: "bg-brand-500/15 text-brand-400",
  electric: "bg-electric-500/15 text-electric-400",
  gold: "bg-gold-500/15 text-gold-400",
  purple: "bg-purple-500/15 text-purple-400",
};

export function SupportTiers({
  onSelect,
}: {
  onSelect?: (tierId: SupportTier["id"]) => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {SUPPORT_TIERS.map((tier) => {
        const Icon = tier.icon;
        return (
          <div
            key={tier.id}
            className={cn(
              "card card-hover relative flex flex-col p-6 ring-1",
              ACCENT[tier.accent]
            )}
          >
            {tier.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-500 px-3 py-1 text-[10px] font-700 uppercase tracking-wider text-white shadow-glow">
                Most Popular
              </span>
            )}
            <span className={cn("grid h-11 w-11 place-items-center rounded-xl", ICON_BG[tier.accent])}>
              <Icon className="h-6 w-6" />
            </span>
            <h3 className="mt-4 font-display text-lg font-700">{tier.name}</h3>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="font-display text-3xl font-700">{formatCurrency(tier.price)}</span>
              {tier.id === "captain" || tier.id === "vip" ? null : (
                <span className="text-xs text-slate-500">one-time</span>
              )}
            </div>
            <p className="mt-2 text-sm text-slate-400">{tier.blurb}</p>

            {tier.limitedPerSchool && (
              <span className="mt-3 inline-flex w-fit items-center gap-1 rounded-full bg-gold-500/10 px-2.5 py-1 text-[11px] font-semibold text-gold-400">
                <Star className="h-3 w-3 fill-current" />
                Limited: {tier.limitedPerSchool} per school
              </span>
            )}

            <ul className="mt-4 flex-1 space-y-2">
              {tier.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  {f}
                </li>
              ))}
            </ul>

            <button
              onClick={() => onSelect?.(tier.id)}
              className={cn(
                "mt-5 w-full",
                tier.accent === "gold" ? "btn-gold" : "btn-primary"
              )}
            >
              Support for {formatCurrency(tier.price)}
            </button>
          </div>
        );
      })}
    </div>
  );
}
