import type { Metadata } from "next";
import { getAthletes, getSchools } from "@/lib/data";
import { SUPPORTERS } from "@/lib/demo-data";
import { AdminDashboard } from "@/components/admin-dashboard";

export const metadata: Metadata = {
  title: "Admin",
  description: "Moderation, approvals, payments, and platform analytics.",
};

export default async function AdminPage() {
  const [athletes, schools] = await Promise.all([getAthletes(), getSchools()]);
  const supporters = SUPPORTERS;
  const approved = supporters.filter((s) => s.status === "approved");
  const totals = {
    revenue: approved.reduce((a, s) => a + s.amount, 0),
    supporters: approved.length,
    videos: approved.filter((s) => s.videoUrl).length,
    pending: supporters.filter((s) => s.status === "pending").length,
  };

  return (
    <div className="container-rw py-10">
      <div className="mb-6 rounded-xl border border-brand-500/20 bg-brand-500/5 p-3 text-center text-xs text-brand-300">
        Demo view — in production this is gated to users with the <code>admin</code> role (Supabase Auth + RLS policies).
      </div>
      <AdminDashboard athletes={athletes} supporters={supporters} schools={schools} totals={totals} />
    </div>
  );
}
