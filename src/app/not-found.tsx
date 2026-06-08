import Link from "next/link";
import { Flame } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container-rw grid min-h-[60vh] place-items-center py-20 text-center">
      <div>
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-500 shadow-glow">
          <Flame className="h-7 w-7 text-white" />
        </span>
        <h1 className="mt-6 font-display text-5xl font-700 uppercase">404</h1>
        <p className="mt-2 text-slate-400">This recruit ran out of bounds.</p>
        <Link href="/" className="btn-primary mx-auto mt-6 w-fit">
          Back to home
        </Link>
      </div>
    </div>
  );
}
