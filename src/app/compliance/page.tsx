import type { Metadata } from "next";
import { ShieldCheck, AlertTriangle, Gavel, Eye } from "lucide-react";
import { siteConfig } from "@/../config/site";

export const metadata: Metadata = {
  title: "Compliance & NIL",
  description: "How Recruit Wars stays compliant with NCAA, school, and NIL policies.",
};

export default function CompliancePage() {
  return (
    <div className="container-rw max-w-3xl py-12">
      <p className="label text-brand-400">Compliance & NIL</p>
      <h1 className="mt-1 font-display text-3xl font-700 uppercase tracking-tight sm:text-4xl">
        Built for fan engagement — not recruiting influence
      </h1>

      <div className="mt-6 rounded-2xl border border-gold-500/30 bg-gold-500/5 p-6">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-gold-400" />
          <p className="text-lg leading-relaxed text-gold-100">{siteConfig.complianceStatement}</p>
        </div>
      </div>

      <div className="mt-8 space-y-6">
        <Section icon={Gavel} title="What this platform is">
          {siteConfig.name} is a fan engagement and athlete content experience. Fans purchase
          messages, hype videos, and supporter memberships to celebrate athletes and rally their
          fanbase. Purchases fund content experiences and athlete support — they are not donations
          tied to enrollment decisions and do not influence where any athlete chooses to play.
        </Section>

        <Section icon={AlertTriangle} title="What this platform is not">
          We do not facilitate pay-for-play, recruiting inducements, or any transaction contingent on
          an athlete&apos;s commitment, signing, or enrollment. Leaderboards reflect fan participation
          and enthusiasm only. They carry no official weight with any school, coaching staff, or
          governing body.
        </Section>

        <Section icon={Eye} title="Moderation & enforcement">
          Every message and video passes through moderation tooling. Our admins remove any content
          that violates NCAA rules, individual school policies, state or institutional NIL
          regulations, or our platform guidelines. We can ban users, revoke athlete profiles, and
          refund or reverse non-compliant transactions. Athletes and schools may request content
          removal at any time.
        </Section>
      </div>

      <p className="mt-10 text-sm text-slate-500">
        Questions about compliance? Contact our team — we work with athletes, families, and
        compliance offices to keep participation clean and fun.
      </p>
    </div>
  );
}

function Section({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) {
  return (
    <section className="card p-6">
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-brand-400" />
        <h2 className="font-display text-xl font-700">{title}</h2>
      </div>
      <p className="mt-3 leading-relaxed text-slate-300">{children}</p>
    </section>
  );
}
