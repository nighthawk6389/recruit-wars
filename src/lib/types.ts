import type { SupportTierId } from "@/../config/tiers";

export type UserRole = "fan" | "athlete" | "admin";

export interface School {
  id: string;
  name: string; // e.g. "LSU"
  fullName: string; // e.g. "Louisiana State University"
  color: string; // hex, primary
  abbrev: string;
  state: string; // 2-letter
}

export interface Athlete {
  id: string;
  slug: string;
  name: string;
  position: string;
  classYear: string; // e.g. "2026"
  hometown: string;
  state: string;
  height: string;
  weight: string;
  stars: number; // 1-5 recruiting stars
  rating: number; // composite 0-100
  bio: string;
  photoUrl: string;
  logoUrl: string;
  recruitingStatus: "Uncommitted" | "Committed" | "Signed" | "Enrolled";
  committedTo?: string; // school id
  nilValuation: number; // USD
  highlightVideoUrl: string;
  offers: string[]; // school ids
  socials: { x?: string; instagram?: string; hudl?: string };
  approved: boolean;
  featured: boolean;
}

export interface FanbaseStanding {
  schoolId: string;
  totalDollars: number;
  supporters: number;
  messages: number;
  videos: number;
  engagementScore: number;
}

export interface Supporter {
  id: string;
  athleteId: string;
  fanName: string;
  schoolId: string;
  tier: SupportTierId;
  amount: number;
  message?: string;
  videoUrl?: string;
  city?: string;
  state?: string;
  email?: string;
  createdAt: string; // ISO
  status: "approved" | "pending" | "removed";
  vip?: boolean;
}

export interface ActivityItem {
  id: string;
  athleteId: string;
  type: "message" | "video" | "vip" | "captain" | "milestone" | "rank_change";
  text: string;
  schoolId?: string;
  createdAt: string;
}

export interface AthleteStats {
  totalSupporters: number;
  totalMessages: number;
  totalVideos: number;
  totalRevenue: number;
}
