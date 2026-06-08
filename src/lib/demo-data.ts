import type {
  Athlete,
  School,
  Supporter,
  ActivityItem,
} from "@/lib/types";
import { ENGAGEMENT_WEIGHTS } from "@/../config/tiers";

/**
 * Rich, deterministic demo data. This drives the entire UI in DEMO MODE
 * (when Supabase env vars are absent) so the platform is fully explorable
 * with zero external setup. The schema in /supabase/schema.sql mirrors
 * these shapes 1:1.
 */

export const SCHOOLS: School[] = [
  { id: "lsu", name: "LSU", fullName: "Louisiana State University", color: "#461D7C", abbrev: "LSU", state: "LA" },
  { id: "miami", name: "Miami", fullName: "University of Miami", color: "#F47321", abbrev: "MIA", state: "FL" },
  { id: "tennessee", name: "Tennessee", fullName: "University of Tennessee", color: "#FF8200", abbrev: "TENN", state: "TN" },
  { id: "texas", name: "Texas", fullName: "University of Texas", color: "#BF5700", abbrev: "TEX", state: "TX" },
  { id: "georgia", name: "Georgia", fullName: "University of Georgia", color: "#BA0C2F", abbrev: "UGA", state: "GA" },
  { id: "alabama", name: "Alabama", fullName: "University of Alabama", color: "#9E1B32", abbrev: "BAMA", state: "AL" },
  { id: "ohiostate", name: "Ohio State", fullName: "Ohio State University", color: "#BB0000", abbrev: "OSU", state: "OH" },
  { id: "oregon", name: "Oregon", fullName: "University of Oregon", color: "#154733", abbrev: "ORE", state: "OR" },
];

export const ATHLETES: Athlete[] = [
  {
    id: "ath_jamarcus_lee",
    slug: "jamarcus-lee",
    name: "Ja'Marcus Lee",
    position: "QB",
    classYear: "2026",
    hometown: "Baton Rouge, LA",
    state: "LA",
    height: "6'3\"",
    weight: "205 lbs",
    stars: 5,
    rating: 98.4,
    bio: "Dual-threat quarterback with elite arm talent and a 4.5 forty. Two-time state champion leading one of the nation's most explosive offenses. Known for poise in the pocket and a cannon for an arm.",
    photoUrl: "/portraits/qb.svg",
    logoUrl: "/portraits/qb.svg",
    recruitingStatus: "Uncommitted",
    nilValuation: 1_250_000,
    highlightVideoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    offers: ["lsu", "miami", "tennessee", "texas", "georgia", "alabama"],
    socials: { x: "https://x.com", instagram: "https://instagram.com", hudl: "https://hudl.com" },
    approved: true,
    featured: true,
  },
  {
    id: "ath_deshawn_carter",
    slug: "deshawn-carter",
    name: "DeShawn Carter",
    position: "WR",
    classYear: "2026",
    hometown: "Miami, FL",
    state: "FL",
    height: "6'1\"",
    weight: "185 lbs",
    stars: 5,
    rating: 97.1,
    bio: "Explosive route-runner with track speed and elite ball skills. State 100m champion who turns short passes into touchdowns.",
    photoUrl: "/portraits/wr.svg",
    logoUrl: "/portraits/wr.svg",
    recruitingStatus: "Uncommitted",
    nilValuation: 880_000,
    highlightVideoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    offers: ["miami", "texas", "oregon", "ohiostate", "georgia"],
    socials: { x: "https://x.com", instagram: "https://instagram.com" },
    approved: true,
    featured: true,
  },
  {
    id: "ath_tyrell_jackson",
    slug: "tyrell-jackson",
    name: "Tyrell Jackson",
    position: "EDGE",
    classYear: "2027",
    hometown: "Knoxville, TN",
    state: "TN",
    height: "6'5\"",
    weight: "245 lbs",
    stars: 4,
    rating: 94.8,
    bio: "Relentless pass rusher with a 36-inch vertical and a non-stop motor. Disruptive force who lives in opposing backfields.",
    photoUrl: "/portraits/edge.svg",
    logoUrl: "/portraits/edge.svg",
    recruitingStatus: "Uncommitted",
    nilValuation: 540_000,
    highlightVideoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    offers: ["tennessee", "alabama", "georgia", "ohiostate"],
    socials: { x: "https://x.com", hudl: "https://hudl.com" },
    approved: true,
    featured: true,
  },
  {
    id: "ath_malik_rivers",
    slug: "malik-rivers",
    name: "Malik Rivers",
    position: "RB",
    classYear: "2026",
    hometown: "Austin, TX",
    state: "TX",
    height: "5'11\"",
    weight: "210 lbs",
    stars: 4,
    rating: 93.2,
    bio: "Powerful between-the-tackles runner with breakaway speed and soft hands out of the backfield.",
    photoUrl: "/portraits/rb.svg",
    logoUrl: "/portraits/rb.svg",
    recruitingStatus: "Committed",
    committedTo: "texas",
    nilValuation: 420_000,
    highlightVideoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    offers: ["texas", "lsu", "oregon"],
    socials: { x: "https://x.com", instagram: "https://instagram.com" },
    approved: true,
    featured: false,
  },
];

// Seed for deterministic pseudo-random generation.
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const FAN_FIRST = ["John", "Sarah", "Marcus", "Tiffany", "Cody", "Aaliyah", "Brett", "Destiny", "Hunter", "Latoya", "Chase", "Brianna", "Garrett", "Nakia", "Logan", "Jasmine", "Tanner", "Keisha", "Drew", "Monique"];
const CITY_BY_STATE: Record<string, string[]> = {
  LA: ["Baton Rouge", "New Orleans", "Lafayette", "Shreveport"],
  FL: ["Miami", "Tampa", "Orlando", "Jacksonville"],
  TN: ["Knoxville", "Nashville", "Memphis", "Chattanooga"],
  TX: ["Austin", "Houston", "Dallas", "San Antonio"],
  GA: ["Atlanta", "Athens", "Savannah", "Macon"],
  AL: ["Tuscaloosa", "Birmingham", "Mobile", "Montgomery"],
  OH: ["Columbus", "Cleveland", "Cincinnati", "Toledo"],
  OR: ["Eugene", "Portland", "Salem", "Bend"],
};

const TIER_POOL = ["message", "message", "message", "message", "video", "video", "vip", "captain"] as const;
const TIER_AMOUNT = { message: 5, video: 20, vip: 50, captain: 100 } as const;

const MESSAGES = [
  "We need you in {school}! Come build a legacy here!",
  "{school} nation is behind you 100%. Let's run it!",
  "Best fanbase in the country is waiting for you 🐯",
  "Geaux get it! You'd be unstoppable in our system.",
  "Dreamed of seeing a talent like you in our colors.",
  "This is your house if you want it. {school} forever!",
  "Come change the program. We believe in you!",
  "Family. Tradition. Championships. That's {school}.",
];

function buildSupporters(): Supporter[] {
  const rand = mulberry32(42);
  const out: Supporter[] = [];
  let counter = 0;
  for (const ath of ATHLETES) {
    // weight each school's fan volume differently for a realistic spread
    const schoolWeights = ath.offers.map((s, i) => ({ s, w: ath.offers.length - i + rand() * 2 }));
    const total = 120 + Math.floor(rand() * 80);
    for (let i = 0; i < total; i++) {
      // pick school weighted
      const r = rand() * schoolWeights.reduce((a, b) => a + b.w, 0);
      let acc = 0;
      let schoolId = schoolWeights[0].s;
      for (const sw of schoolWeights) {
        acc += sw.w;
        if (r <= acc) { schoolId = sw.s; break; }
      }
      const tier = TIER_POOL[Math.floor(rand() * TIER_POOL.length)];
      const school = SCHOOLS.find((s) => s.id === schoolId)!;
      const cities = CITY_BY_STATE[school.state] || ["Fan City"];
      const city = cities[Math.floor(rand() * cities.length)];
      const fanName = FAN_FIRST[Math.floor(rand() * FAN_FIRST.length)];
      const daysAgo = rand() * 30;
      const createdAt = new Date(Date.now() - daysAgo * 86400000).toISOString();
      const needsMsg = tier !== "video" ? rand() > 0.2 : true;
      out.push({
        id: `sup_${counter++}`,
        athleteId: ath.id,
        fanName,
        schoolId,
        tier,
        amount: TIER_AMOUNT[tier],
        message: needsMsg
          ? MESSAGES[Math.floor(rand() * MESSAGES.length)].replaceAll("{school}", school.name)
          : undefined,
        videoUrl: tier === "video" || tier === "vip" || tier === "captain" ? "https://www.youtube.com/embed/dQw4w9WgXcQ" : undefined,
        city,
        state: school.state,
        email: `${fanName.toLowerCase()}${counter}@example.com`,
        createdAt,
        status: rand() > 0.04 ? "approved" : "pending",
        vip: tier === "vip" || tier === "captain",
      });
    }
  }
  return out;
}

export const SUPPORTERS: Supporter[] = buildSupporters();

export function activityForAthlete(athleteId: string, limit = 24): ActivityItem[] {
  const items = SUPPORTERS.filter((s) => s.athleteId === athleteId && s.status === "approved")
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .slice(0, limit)
    .map<ActivityItem>((s) => {
      const school = SCHOOLS.find((x) => x.id === s.schoolId)!;
      const verb =
        s.tier === "video" ? `uploaded a recruiting video for ${school.name}`
        : s.tier === "vip" ? `joined the ${school.name} VIP Recruiting Committee`
        : s.tier === "captain" ? `became a ${school.name} Fan Captain 👑`
        : `submitted a message`;
      return {
        id: `act_${s.id}`,
        athleteId,
        type: s.tier,
        schoolId: s.schoolId,
        text: `${s.fanName} from ${s.city} ${verb}.`,
        createdAt: s.createdAt,
      };
    });
  return items;
}

export { ENGAGEMENT_WEIGHTS };
