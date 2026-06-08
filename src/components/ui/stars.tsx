import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function Stars({ count, size = 16 }: { count: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${count} star recruit`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          width={size}
          height={size}
          className={cn(i < count ? "star-filled fill-current" : "star-empty")}
        />
      ))}
    </span>
  );
}
