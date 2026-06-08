import { Users } from "lucide-react";
import type { Supporter } from "@/lib/types";
import { getSchool } from "@/lib/data";
import { timeAgo } from "@/lib/utils";

/** Social-proof strip: who just backed this recruit. */
export function RecentSupporters({ supporters }: { supporters: Supporter[] }) {
  if (!supporters.length) return null;
  return (
    <div className="card p-5">
      <div className="mb-3 flex items-center gap-2">
        <Users className="h-5 w-5 text-electric-400" />
        <h3 className="font-display text-lg font-700 uppercase">Recent Supporters</h3>
      </div>
      <ul className="space-y-2">
        {supporters.map((s) => {
          const school = getSchool(s.schoolId);
          return (
            <li key={s.id} className="flex items-center gap-3">
              <span
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-700 text-white ring-1 ring-white/10"
                style={{ backgroundColor: school?.color ?? "#1c2640" }}
              >
                {s.fanName.slice(0, 1)}
              </span>
              <span className="truncate text-sm">
                <span className="font-semibold">{s.fanName}</span>
                <span className="text-slate-400"> · {s.city ?? school?.name}</span>
              </span>
              {s.vip && (
                <span className="rounded bg-purple-500/15 px-1.5 py-0.5 text-[10px] font-700 text-purple-400">VIP</span>
              )}
              <span className="ml-auto shrink-0 text-xs text-slate-500">{timeAgo(s.createdAt)}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
