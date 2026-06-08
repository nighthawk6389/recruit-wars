import { Sparkles } from "lucide-react";
import { isDemoMode } from "@/lib/data";

/** Visible only when running without Supabase/Stripe credentials. */
export function DemoBanner() {
  if (!isDemoMode) return null;
  return (
    <div className="bg-gradient-to-r from-brand-600 via-brand-500 to-gold-500 text-center">
      <div className="container-rw flex items-center justify-center gap-2 py-1.5">
        <Sparkles className="h-3.5 w-3.5 text-white" />
        <p className="text-xs font-semibold text-white">
          Demo mode — fully interactive with sample data. Add Supabase &amp; Stripe keys to go live.
        </p>
      </div>
    </div>
  );
}
