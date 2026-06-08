import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { TIERS_BY_ID, type SupportTierId } from "@/../config/tiers";
import { siteConfig } from "@/../config/site";
import { createAdminClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

interface CheckoutBody {
  athleteId: string;
  athleteSlug: string;
  tier: SupportTierId;
  fanName: string;
  email: string;
  schoolId: string;
  message?: string;
  promoCode?: string;
}

export async function POST(req: Request) {
  let body: CheckoutBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const tier = TIERS_BY_ID[body.tier];
  if (!tier) return NextResponse.json({ error: "Unknown tier" }, { status: 400 });
  if (!body.fanName || !body.email || !body.schoolId) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const stripe = getStripe();

  // ── DEMO MODE ────────────────────────────────────────────────
  // No Stripe key → simulate a successful purchase so the UX is testable.
  if (!stripe) {
    // In a real app you'd still record a pending order here.
    return NextResponse.json({ demo: true, ok: true });
  }

  // ── LIVE MODE ────────────────────────────────────────────────
  // Optionally pre-create a pending supporter row for reconciliation.
  const supabase = createAdminClient();
  let orderId: string | undefined;
  if (supabase) {
    const { data } = await supabase
      .from("supporters")
      .insert({
        athlete_id: body.athleteId,
        fan_name: body.fanName,
        email: body.email,
        school_id: body.schoolId,
        tier: body.tier,
        amount: tier.price,
        message: body.message ?? null,
        status: "pending",
      })
      .select("id")
      .single();
    orderId = data?.id;
  }

  const session = await stripe.checkout.sessions.create({
    mode: tier.id === "vip" ? "subscription" : "payment",
    line_items: [
      tier.id === "vip"
        ? {
            price_data: {
              currency: "usd",
              product_data: { name: `${tier.name} — ${body.athleteSlug}` },
              recurring: { interval: "month" },
              unit_amount: tier.price * 100,
            },
            quantity: 1,
          }
        : {
            price_data: {
              currency: "usd",
              product_data: { name: `${tier.name} — ${body.athleteSlug}` },
              unit_amount: tier.price * 100,
            },
            quantity: 1,
          },
    ],
    customer_email: body.email,
    allow_promotion_codes: true,
    metadata: {
      athleteId: body.athleteId,
      athleteSlug: body.athleteSlug,
      tier: body.tier,
      fanName: body.fanName,
      schoolId: body.schoolId,
      message: (body.message ?? "").slice(0, 480),
      promoCode: body.promoCode ?? "",
      orderId: orderId ?? "",
    },
    success_url: `${siteConfig.url}/athletes/${body.athleteSlug}?support=success`,
    cancel_url: `${siteConfig.url}/athletes/${body.athleteSlug}?support=cancelled`,
  });

  return NextResponse.json({ url: session.url });
}
