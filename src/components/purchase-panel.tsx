"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Loader2, CheckCircle2, Tag } from "lucide-react";
import { SUPPORT_TIERS, TIERS_BY_ID, type SupportTierId } from "@/../config/tiers";
import { SupportTiers } from "@/components/support-tiers";
import { formatCurrency, cn } from "@/lib/utils";
import type { School, Athlete } from "@/lib/types";
import { siteConfig } from "@/../config/site";

type Step = "tiers" | "form" | "redirecting" | "success";

export function PurchasePanel({
  athlete,
  schools,
}: {
  athlete: Athlete;
  schools: School[];
}) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("tiers");
  const [tier, setTier] = useState<SupportTierId | null>(null);
  const [form, setForm] = useState({
    fanName: "",
    schoolId: athlete.offers[0] ?? schools[0]?.id ?? "",
    message: "",
    email: "",
    promoCode: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selected = tier ? TIERS_BY_ID[tier] : null;
  const needsVideo = tier === "video" || tier === "vip" || tier === "captain";

  function start(tierId: SupportTierId) {
    setTier(tierId);
    setStep("form");
    setOpen(true);
  }

  async function submit() {
    setError(null);
    if (!form.fanName.trim() || !form.email.trim() || !form.schoolId) {
      setError("Please fill in your name, email, and school.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          athleteId: athlete.id,
          athleteSlug: athlete.slug,
          tier,
          ...form,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");

      if (data.url) {
        // Real Stripe Checkout
        setStep("redirecting");
        window.location.href = data.url;
      } else {
        // Demo mode — simulated success
        setStep("success");
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setOpen(false);
    setTimeout(() => {
      setStep("tiers");
      setTier(null);
      setForm((f) => ({ ...f, message: "", promoCode: "" }));
      setError(null);
    }, 250);
  }

  return (
    <>
      <SupportTiers onSelect={start} />

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] grid place-items-center bg-black/70 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={reset}
          >
            <motion.div
              className="card w-full max-w-md p-6"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="font-display text-xl font-700">{selected?.name}</h3>
                  <p className="text-sm text-slate-400">
                    Supporting <span className="text-white">{athlete.name}</span>
                  </p>
                </div>
                <button onClick={reset} className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {step === "form" && (
                <div className="space-y-3">
                  <Field label="Your name">
                    <input
                      className="rw-input"
                      value={form.fanName}
                      onChange={(e) => setForm({ ...form, fanName: e.target.value })}
                      placeholder="John Doe"
                    />
                  </Field>
                  <Field label="Email (for receipt)">
                    <input
                      className="rw-input"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@email.com"
                    />
                  </Field>
                  <Field label="School affiliation">
                    <select
                      className="rw-input"
                      value={form.schoolId}
                      onChange={(e) => setForm({ ...form, schoolId: e.target.value })}
                    >
                      {schools.map((s) => (
                        <option key={s.id} value={s.id} className="bg-ink-900">
                          {s.fullName}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label={`Message${needsVideo ? "" : ""}`}>
                    <textarea
                      className="rw-input min-h-20 resize-none"
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder={`Tell ${athlete.name.split(" ")[0]} why your school is the one...`}
                    />
                  </Field>

                  {needsVideo && (
                    <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] p-4 text-center text-sm text-slate-400">
                      🎥 After payment you&apos;ll be prompted to upload your 30–60s video.
                    </div>
                  )}

                  <Field label="Promo code (optional)">
                    <div className="relative">
                      <Tag className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                      <input
                        className="rw-input pl-9"
                        value={form.promoCode}
                        onChange={(e) => setForm({ ...form, promoCode: e.target.value })}
                        placeholder="GEAUX10"
                      />
                    </div>
                  </Field>

                  {error && <p className="text-sm text-brand-400">{error}</p>}

                  <button onClick={submit} disabled={loading} className="btn-primary mt-1 w-full">
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>Pay {formatCurrency(selected?.price ?? 0)}</>
                    )}
                  </button>
                  <p className="text-center text-[11px] text-slate-500">{siteConfig.complianceStatement}</p>
                </div>
              )}

              {step === "redirecting" && (
                <div className="py-10 text-center">
                  <Loader2 className="mx-auto h-8 w-8 animate-spin text-brand-400" />
                  <p className="mt-3 text-sm text-slate-400">Redirecting to secure checkout…</p>
                </div>
              )}

              {step === "success" && (
                <div className="py-8 text-center">
                  <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-400" />
                  <h4 className="mt-3 font-display text-xl font-700">You&apos;re in! 🎉</h4>
                  <p className="mt-1 text-sm text-slate-400">
                    Your {selected?.name} for {athlete.name} is confirmed (demo). It now counts toward
                    your school&apos;s leaderboard.
                  </p>
                  <button onClick={reset} className="btn-secondary mt-5 w-full">
                    Done
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .rw-input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.03);
          padding: 0.625rem 0.875rem;
          font-size: 0.875rem;
          color: white;
          outline: none;
        }
        .rw-input:focus {
          border-color: rgba(255, 45, 23, 0.5);
          box-shadow: 0 0 0 3px rgba(255, 45, 23, 0.15);
        }
        .rw-input::placeholder {
          color: #64748b;
        }
      `}</style>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="label mb-1.5 block">{label}</span>
      {children}
    </label>
  );
}
