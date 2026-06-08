/**
 * ──────────────────────────────────────────────────────────────
 *  SITE CONFIG  —  the platform name is EDITABLE here.
 *  Change `name` (or set NEXT_PUBLIC_SITE_NAME) to rebrand the
 *  entire app: nav, footer, metadata, share graphics, emails.
 * ──────────────────────────────────────────────────────────────
 */

export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "Recruit Wars",
  tagline: "Rally your fanbase. Power your recruit.",
  description:
    "Recruit Wars is a fan engagement & NIL platform where college football fanbases compete to support the athletes they love — through messages, videos, and premium memberships.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  // Shown across the entire platform — NCAA / NIL compliance.
  complianceStatement:
    "Participation on this platform does not influence recruiting decisions. Purchases are for fan engagement and athlete content experiences only.",
  social: {
    x: "https://x.com",
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
  },
  // Demo mode is auto-detected when Supabase/Stripe env vars are missing.
  demoBanner: true,
} as const;

export type SiteConfig = typeof siteConfig;
