import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/server";
import { sendPurchaseConfirmation } from "@/lib/email";

export const runtime = "nodejs";

/**
 * Stripe webhook. Records completed purchases, marks the supporter row
 * approved (pending moderation), updates leaderboard totals, and fires the
 * purchase-confirmation email.
 *
 * Configure in Stripe Dashboard → Developers → Webhooks pointing at
 * /api/webhooks/stripe, listening for `checkout.session.completed`.
 * Locally: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
 */
export async function POST(req: Request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const body = await req.text();
  const sig = headers().get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook error: ${err.message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;
    const m = session.metadata ?? {};
    const amount = (session.amount_total ?? 0) / 100;
    const supabase = createAdminClient();

    if (supabase) {
      const row = {
        athlete_id: m.athleteId,
        fan_name: m.fanName,
        email: session.customer_email ?? m.email,
        school_id: m.schoolId,
        tier: m.tier,
        amount,
        message: m.message || null,
        stripe_session_id: session.id,
        status: "approved", // becomes visible; videos still need moderation
      };
      if (m.orderId) {
        await supabase.from("supporters").update(row).eq("id", m.orderId);
      } else {
        await supabase.from("supporters").insert(row);
      }
      // Record activity + payment for analytics.
      await supabase.from("activity").insert({
        athlete_id: m.athleteId,
        type: m.tier,
        school_id: m.schoolId,
        text: `${m.fanName} supported via ${m.tier}.`,
      });
    }

    await sendPurchaseConfirmation({
      to: session.customer_email ?? m.email,
      fanName: m.fanName,
      tier: m.tier,
      amount,
      athleteSlug: m.athleteSlug,
    });
  }

  return NextResponse.json({ received: true });
}
