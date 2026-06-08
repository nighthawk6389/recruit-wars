"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Flame } from "lucide-react";
import { siteConfig } from "@/../config/site";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/athletes", label: "Athletes" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/dashboard", label: "Athlete Dashboard" },
  { href: "/admin", label: "Admin" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-ink-950/80 backdrop-blur-xl">
      <nav className="container-rw flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-500 shadow-glow transition-transform group-hover:scale-105">
            <Flame className="h-5 w-5 text-white" />
          </span>
          <span className="font-display text-xl font-700 uppercase tracking-tight">
            {siteConfig.name}
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
          <Link href="/athletes" className="btn-primary ml-2">
            Support a Recruit
          </Link>
        </div>

        <button
          className="md:hidden rounded-lg p-2 text-slate-300 hover:bg-white/5"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      <div
        className={cn(
          "md:hidden overflow-hidden border-t border-white/5 transition-[max-height] duration-300",
          open ? "max-h-96" : "max-h-0"
        )}
      >
        <div className="container-rw flex flex-col gap-1 py-3">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
          <Link href="/athletes" onClick={() => setOpen(false)} className="btn-primary mt-2">
            Support a Recruit
          </Link>
        </div>
      </div>
    </header>
  );
}
