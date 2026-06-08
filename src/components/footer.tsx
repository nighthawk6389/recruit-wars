import Link from "next/link";
import { Flame } from "lucide-react";
import { siteConfig } from "@/../config/site";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-ink-950">
      <div className="container-rw py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-500">
                <Flame className="h-4 w-4 text-white" />
              </span>
              <span className="font-display text-lg font-700 uppercase">{siteConfig.name}</span>
            </Link>
            <p className="mt-3 max-w-sm text-sm text-slate-400">{siteConfig.description}</p>
          </div>
          <div>
            <h4 className="label mb-3">Platform</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="/athletes" className="hover:text-white">Athletes</Link></li>
              <li><Link href="/leaderboard" className="hover:text-white">Leaderboard</Link></li>
              <li><Link href="/dashboard" className="hover:text-white">Athlete Dashboard</Link></li>
              <li><Link href="/admin" className="hover:text-white">Admin</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="label mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="/compliance" className="hover:text-white">Compliance & NIL</Link></li>
              <li><a href={siteConfig.social.x} className="hover:text-white">X / Twitter</a></li>
              <li><a href={siteConfig.social.instagram} className="hover:text-white">Instagram</a></li>
              <li><a href={siteConfig.social.facebook} className="hover:text-white">Facebook</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 rounded-xl border border-gold-500/20 bg-gold-500/5 p-4">
          <p className="text-xs leading-relaxed text-gold-400/90">
            <strong className="font-semibold">Compliance notice:</strong> {siteConfig.complianceStatement}
          </p>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-white/5 pt-6 text-xs text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
          <p>For fan engagement & athlete community building only.</p>
        </div>
      </div>
    </footer>
  );
}
