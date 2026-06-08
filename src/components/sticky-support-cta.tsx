"use client";

import { Flame } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

/**
 * Mobile-only sticky bottom CTA on athlete pages — the single highest-
 * leverage mobile conversion pattern (Cameo/Fanatics). Shows the cheapest
 * tier price and scrolls to the support section.
 */
export function StickySupportCTA({
  athleteFirstName,
  fromPrice,
}: {
  athleteFirstName: string;
  fromPrice: number;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-ink-950/90 p-3 backdrop-blur-xl lg:hidden">
      <div className="container-rw flex items-center gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">Support {athleteFirstName}</p>
          <p className="text-xs text-slate-400">from {formatCurrency(fromPrice)}</p>
        </div>
        <a href="#support" className="btn-primary ml-auto shrink-0">
          <Flame className="h-4 w-4" /> Support now
        </a>
      </div>
    </div>
  );
}
