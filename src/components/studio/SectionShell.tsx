"use client";

import type { ReactNode } from "react";
import { Switch } from "@/components/ui/Switch";
import { useStudio } from "./StudioProvider";
import type { StudioSectionMeta } from "./sections";

export function SectionShell({
  meta,
  children,
}: {
  meta: StudioSectionMeta;
  children: ReactNode;
}) {
  const { state, dispatch } = useStudio();
  const { toggle } = meta;

  return (
    <section aria-labelledby={`studio-${meta.id}`} className="fade-in">
      <header className="mb-5 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2
            id={`studio-${meta.id}`}
            className="text-[22px] font-bold leading-tight tracking-[-0.02em] text-text"
          >
            {meta.label}
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-text-3">{meta.description}</p>
        </div>
        {toggle && (
          <div className="flex shrink-0 items-center gap-2.5">
            <span className="hidden text-[13px] font-medium text-text-2 sm:inline">
              Show on card
            </span>
            <Switch
              label={`Show ${meta.label} on card`}
              checked={state.profile.sections[toggle]}
              onChange={(value) => dispatch({ type: "toggleSection", section: toggle, value })}
            />
          </div>
        )}
      </header>
      <div className="flex flex-col gap-5">{children}</div>
    </section>
  );
}

/** White panel used inside a section. */
export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-card border border-border bg-surface p-4 shadow-sm min-[520px]:p-5 ${className}`}
    >
      {children}
    </div>
  );
}
