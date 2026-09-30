import Link from "next/link";
import { DEMO_SLUG } from "@/lib/profile";

export function NotFoundView() {
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-5 py-16 text-center">
      <div
        aria-hidden
        className="backdrop-grid pointer-events-none absolute inset-0 [--grid-x:50%]"
      />
      <div className="relative flex max-w-sm flex-col items-center">
        <span
          aria-hidden
          className="flex h-14 w-14 items-center justify-center rounded-card bg-accent-soft text-2xl font-bold text-accent-ink"
        >
          C
        </span>
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.12em] text-text-3">
          Error 404
        </p>
        <h1 className="text-balance mt-2 text-[28px] font-bold leading-[1.1] tracking-[-0.02em] text-text">
          This card does not exist
        </h1>
        <p className="mt-3 text-[15px] leading-[1.7] text-text-2">
          The link may be mistyped, or the card may have been removed. Check the
          address, or open the demo card to see what a CorpoMerch Card looks like.
        </p>
        <Link
          href={`/${DEMO_SLUG}`}
          className="mt-7 inline-flex h-[52px] items-center justify-center rounded-btn bg-accent-strong px-6 text-[15px] font-semibold text-on-accent transition-transform duration-200 active:scale-[0.97]"
        >
          Open the demo card
        </Link>
      </div>
    </main>
  );
}
