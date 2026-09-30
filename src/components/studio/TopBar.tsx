"use client";

import { ArrowCounterClockwise, ArrowUpRight, Check } from "@phosphor-icons/react";
import { buttonClass } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useToast } from "@/components/ui/Toast";
import { DEMO_SLUG } from "@/lib/profile";
import { useStudio } from "./StudioProvider";

export function TopBar() {
  const { state, dispatch } = useStudio();
  const toast = useToast();
  const saving = state.saveStatus === "saving";

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-[1500px] items-center gap-3 px-4 min-[860px]:px-6">
        <div className="flex min-w-0 items-center gap-2.5">
          <span
            aria-hidden
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-tile bg-accent-strong text-[15px] font-bold text-on-accent"
          >
            C
          </span>
          <span className="hidden text-[15px] font-semibold text-text min-[480px]:inline">
            CorpoMerch
          </span>
          <span aria-hidden className="hidden h-4 w-px bg-border-strong min-[480px]:inline-block" />
          <h1 className="whitespace-nowrap text-[15px] font-medium text-text-2">Card Studio</h1>
        </div>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <p
            role="status"
            aria-live="polite"
            className="flex items-center gap-1.5 text-[13px] text-text-3"
          >
            {saving ? (
              <>
                <span aria-hidden className="h-3.5 w-3.5 spin rounded-full border-2 border-border-strong border-t-text-3" />
                <span className="hidden sm:inline">Saving...</span>
                <span className="sr-only sm:hidden">Saving</span>
              </>
            ) : (
              <>
                <Check size={14} weight="bold" className="text-success" aria-hidden />
                <span className="hidden sm:inline">All changes saved</span>
                <span className="sr-only sm:hidden">All changes saved</span>
              </>
            )}
          </p>

          <div className="hidden items-center gap-1.5 md:flex">
            <span className="rounded-chip border border-border-strong px-2.5 py-1 text-xs font-semibold text-text-2">
              Basic plan
            </span>
            {state.cvUnlocked && (
              <span className="rounded-chip bg-accent-soft px-2.5 py-1 text-xs font-semibold text-accent-ink">
                CV add-on
              </span>
            )}
          </div>

          <span className="hidden min-[860px]:inline-flex">
            <IconButton
              label="Reset demo"
              onClick={() => {
                dispatch({ type: "reset" });
                toast("Demo reset to the starting profile");
              }}
            >
              <ArrowCounterClockwise size={18} weight="bold" aria-hidden />
            </IconButton>
          </span>

          <ThemeToggle />

          <a
            href={`/${DEMO_SLUG}`}
            target="_blank"
            rel="noopener"
            className={buttonClass("secondary", "h-10 whitespace-nowrap px-3.5")}
          >
            View card
            <ArrowUpRight size={14} weight="bold" aria-hidden />
          </a>
        </div>
      </div>
    </header>
  );
}
