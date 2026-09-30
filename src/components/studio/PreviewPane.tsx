"use client";

import { X } from "@phosphor-icons/react";
import { ProfileCard } from "@/components/card/ProfileCard";
import { Button } from "@/components/ui/Button";
import { useStudio } from "./StudioProvider";

/** A phone frame around the live card. Desktop and tablet only. */
export function PhonePreview() {
  const { state } = useStudio();
  return (
    <aside
      aria-label="Live preview"
      className="sticky top-[72px] hidden self-start min-[860px]:block"
    >
      <p className="mb-3 text-center text-[13px] font-medium text-text-3">Live preview</p>
      <div className="relative rounded-[46px] bg-(--bezel) p-[10px] shadow-lg">
        <span
          aria-hidden
          className="absolute left-1/2 top-[18px] z-10 h-[22px] w-[92px] -translate-x-1/2 rounded-full bg-(--bezel)"
        />
        <div className="thin-scroll h-[calc(100dvh-170px)] max-h-[780px] min-h-[520px] overflow-y-auto overflow-x-hidden rounded-[36px] bg-bg">
          <ProfileCard profile={state.profile} />
        </div>
      </div>
    </aside>
  );
}

/** Full-screen preview for phones. */
export function FullPreview({ onClose }: { onClose: () => void }) {
  const { state } = useStudio();
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Card preview"
      className="fade-in fixed inset-0 z-50 flex flex-col bg-bg min-[860px]:hidden"
    >
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-surface px-4">
        <p className="text-[15px] font-semibold text-text">Preview</p>
        <Button variant="secondary" className="h-10 px-3.5" onClick={onClose} icon={<X size={14} weight="bold" aria-hidden />}>
          Close
        </Button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <ProfileCard profile={state.profile} />
      </div>
    </div>
  );
}
