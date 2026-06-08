"use client";

import { Share2, Twitter, Instagram, Facebook, Flame } from "lucide-react";
import type { Athlete, FanbaseStanding } from "@/lib/types";
import { getSchool } from "@/lib/data";
import { siteConfig } from "@/../config/site";
import { formatCurrency, formatCompact } from "@/lib/utils";

/**
 * Auto-generated shareable graphic. Headlines are derived from live
 * standings (e.g. "LSU Fanbase Takes The Lead"). One-click sharing to
 * X / Instagram / Facebook.
 */
export function ShareCard({
  athlete,
  standings,
  totalSupporters,
}: {
  athlete: Athlete;
  standings: FanbaseStanding[];
  totalSupporters: number;
}) {
  const leader = standings[0] ? getSchool(standings[0].schoolId) : null;
  const headline = leader
    ? `${leader.name} Fanbase Takes The Lead`
    : `Support ${athlete.name}`;
  const sub = `${formatCompact(totalSupporters)} fans have backed this recruit`;

  const shareUrl = `${siteConfig.url}/athletes/${athlete.slug}`;
  const shareText = `${headline} — ${sub} on ${siteConfig.name}! ${shareUrl}`;

  const share = (platform: "x" | "facebook" | "instagram") => {
    if (platform === "x") {
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
        "_blank"
      );
    } else if (platform === "facebook") {
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
        "_blank"
      );
    } else {
      // Instagram has no web share intent — copy caption to clipboard.
      navigator.clipboard?.writeText(shareText);
      alert("Caption copied! Paste it into your Instagram post.");
    }
  };

  return (
    <div className="card overflow-hidden">
      {/* The generated graphic */}
      <div
        className="relative aspect-[16/9] w-full overflow-hidden p-6"
        style={{
          background: leader
            ? `radial-gradient(120% 120% at 0% 0%, ${leader.color}cc, #070a12 70%)`
            : "linear-gradient(135deg,#ff2d17,#070a12)",
        }}
      >
        <div className="absolute inset-0 bg-grid-faint [background-size:24px_24px] opacity-30" />
        <div className="relative flex h-full flex-col justify-between">
          <div className="flex items-center gap-2 text-white/90">
            <Flame className="h-5 w-5" />
            <span className="font-display text-sm font-700 uppercase tracking-widest">
              {siteConfig.name}
            </span>
          </div>
          <div>
            <h3 className="font-display text-2xl font-700 uppercase leading-tight text-white sm:text-3xl">
              {headline}
            </h3>
            <p className="mt-1 text-sm text-white/80">{sub}</p>
          </div>
          <div className="flex items-center justify-between text-xs text-white/70">
            <span>{athlete.name} · {athlete.position} · {athlete.classYear}</span>
            {standings[0] && (
              <span className="font-display font-700 text-white">
                {formatCurrency(standings[0].totalDollars)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Share controls */}
      <div className="flex items-center gap-2 p-4">
        <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-300">
          <Share2 className="h-4 w-4" /> Share
        </span>
        <div className="ml-auto flex gap-2">
          <ShareBtn onClick={() => share("x")} label="X">
            <Twitter className="h-4 w-4" />
          </ShareBtn>
          <ShareBtn onClick={() => share("instagram")} label="Instagram">
            <Instagram className="h-4 w-4" />
          </ShareBtn>
          <ShareBtn onClick={() => share("facebook")} label="Facebook">
            <Facebook className="h-4 w-4" />
          </ShareBtn>
        </div>
      </div>
    </div>
  );
}

function ShareBtn({
  children,
  onClick,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={`Share to ${label}`}
      className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/5 text-slate-200 transition-colors hover:bg-white/10 hover:text-white"
    >
      {children}
    </button>
  );
}
