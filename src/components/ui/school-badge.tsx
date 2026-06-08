import type { School } from "@/lib/types";
import { cn } from "@/lib/utils";

export function SchoolBadge({
  school,
  size = "md",
}: {
  school: School;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: "h-6 w-6 text-[10px]",
    md: "h-9 w-9 text-xs",
    lg: "h-12 w-12 text-sm",
  };
  return (
    <span
      className={cn(
        "grid place-items-center rounded-lg font-display font-700 text-white shadow-inner ring-1 ring-white/10",
        sizes[size]
      )}
      style={{ backgroundColor: school.color }}
      title={school.fullName}
    >
      {school.abbrev}
    </span>
  );
}
