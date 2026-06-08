import Stripe from "stripe";

/**
 * Server-side Stripe client. Returns null in demo mode (no secret key),
 * which lets the checkout route fall back to a simulated success flow so
 * the purchase UX is fully testable without Stripe credentials.
 */
export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key, { apiVersion: "2024-06-20" });
}

export const stripeEnabled = !!process.env.STRIPE_SECRET_KEY;
