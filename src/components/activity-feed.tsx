"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageSquare, Video, Crown, Shield, TrendingUp, Trophy, Radio } from "lucide-react";
import type { ActivityItem } from "@/lib/types";
import { timeAgo } from "@/lib/utils";

const ICONS = {
  message: MessageSquare,
  video: Video,
  vip: Shield,
  captain: Crown,
  milestone: Trophy,
  rank_change: TrendingUp,
} as const;

const ICON_COLOR = {
  message: "text-electric-400 bg-electric-500/10",
  video: "text-brand-400 bg-brand-500/10",
  vip: "text-purple-400 bg-purple-500/10",
  captain: "text-gold-400 bg-gold-500/10",
  milestone: "text-emerald-400 bg-emerald-500/10",
  rank_change: "text-pink-400 bg-pink-500/10",
} as const;

// Synthetic live events injected periodically in demo mode for that
// "dynamic and addictive" feel.
const LIVE_TEMPLATES: { type: ActivityItem["type"]; text: string }[] = [
  { type: "rank_change", text: "Miami fans just moved into second place. 🔥" },
  { type: "video", text: "Sarah from Knoxville uploaded a recruiting video for Tennessee." },
  { type: "message", text: "John from Baton Rouge submitted a message." },
  { type: "captain", text: "A new Fan Captain joined the LSU committee. 👑" },
  { type: "milestone", text: "1,000 fans have now supported this recruit!" },
  { type: "rank_change", text: "Texas just passed Georgia on the leaderboard." },
  { type: "vip", text: "Destiny from Atlanta joined the Georgia VIP Committee." },
];

export function ActivityFeed({
  initial,
  live = true,
}: {
  initial: ActivityItem[];
  live?: boolean;
}) {
  const [items, setItems] = useState<ActivityItem[]>(initial.slice(0, 14));
  const idx = useRef(0);

  useEffect(() => {
    if (!live) return;
    const t = setInterval(() => {
      const tpl = LIVE_TEMPLATES[idx.current % LIVE_TEMPLATES.length];
      idx.current += 1;
      setItems((prev) =>
        [
          {
            id: `live_${Date.now()}`,
            athleteId: prev[0]?.athleteId ?? "",
            type: tpl.type,
            text: tpl.text,
            createdAt: new Date().toISOString(),
          },
          ...prev,
        ].slice(0, 14)
      );
    }, 4500);
    return () => clearInterval(t);
  }, [live]);

  return (
    <div className="card p-6">
      <div className="mb-4 flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-500 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-brand-500" />
        </span>
        <h3 className="font-display text-xl font-700 uppercase tracking-tight">Live Activity</h3>
        <Radio className="ml-auto h-4 w-4 text-slate-500" />
      </div>

      <div className="space-y-2">
        <AnimatePresence initial={false}>
          {items.map((item) => {
            const Icon = ICONS[item.type];
            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: -12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3"
              >
                <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${ICON_COLOR[item.type]}`}>
                  <Icon className="h-4 w-4" />
                </span>
                <p className="text-sm text-slate-200">{item.text}</p>
                <span className="ml-auto shrink-0 text-xs text-slate-500">{timeAgo(item.createdAt)}</span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
