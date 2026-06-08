import type { LucideIcon } from "lucide-react";
import { MessageSquare, Video, Crown, Shield } from "lucide-react";

export type SupportTierId = "message" | "video" | "vip" | "captain";

export interface SupportTier {
  id: SupportTierId;
  name: string;
  /** price in whole US dollars */
  price: number;
  blurb: string;
  features: string[];
  icon: LucideIcon;
  accent: "brand" | "electric" | "gold" | "purple";
  /** captain tier is limited per school */
  limitedPerSchool?: number;
  popular?: boolean;
  /** billed monthly (membership) vs. a one-time payment */
  recurring?: boolean;
}

export const SUPPORT_TIERS: SupportTier[] = [
  {
    id: "message",
    name: "Message Supporter",
    price: 5,
    blurb: "Drop a written message your recruit will actually read.",
    features: [
      "Personalized written message",
      "Name + school affiliation",
      "Appears in athlete dashboard",
      "Counts toward your school's leaderboard",
    ],
    icon: MessageSquare,
    accent: "electric",
  },
  {
    id: "video",
    name: "Video Supporter",
    price: 20,
    blurb: "Record a 30–60s hype video straight to the athlete.",
    features: [
      "30–60 second video upload",
      "School affiliation + message",
      "Securely stored, athlete-visible",
      "2x leaderboard engagement points",
    ],
    icon: Video,
    accent: "brand",
    popular: true,
  },
  {
    id: "vip",
    name: "VIP Recruiting Committee",
    price: 50,
    blurb: "Everything in Video, plus a VIP badge & featured spot.",
    features: [
      "Includes video submission",
      "VIP supporter badge",
      "Featured supporter section",
      "5x leaderboard engagement points",
    ],
    icon: Shield,
    accent: "purple",
    recurring: true,
  },
  {
    id: "captain",
    name: "Fan Captain",
    price: 100,
    blurb: "Lead your fanbase. Limited seats per school.",
    features: [
      "Named Top Fan Captain slot",
      "All VIP perks included",
      "Profile shown on athlete page",
      "10x leaderboard engagement points",
    ],
    icon: Crown,
    accent: "gold",
    limitedPerSchool: 25,
  },
];

export const TIERS_BY_ID = Object.fromEntries(
  SUPPORT_TIERS.map((t) => [t.id, t])
) as Record<SupportTierId, SupportTier>;

/** Engagement-score weighting used by the leaderboard engine. */
export const ENGAGEMENT_WEIGHTS: Record<SupportTierId, number> = {
  message: 1,
  video: 2,
  vip: 5,
  captain: 10,
};
