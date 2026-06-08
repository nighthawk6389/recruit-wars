import { ShieldCheck } from "lucide-react";
import { siteConfig } from "@/../config/site";

/** Persistent compliance reminder shown above the footer on every page. */
export function ComplianceBar() {
  return (
    <div className="border-t border-white/5 bg-ink-900/60">
      <div className="container-rw flex items-center justify-center gap-2 py-3 text-center">
        <ShieldCheck className="h-4 w-4 shrink-0 text-electric-400" />
        <p className="text-xs text-slate-400">{siteConfig.complianceStatement}</p>
      </div>
    </div>
  );
}
