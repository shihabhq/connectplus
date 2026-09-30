import type { CSSProperties } from "react";
import Image from "next/image";
import type { Profile } from "@/lib/profile";

export function Hero({ profile, index }: { profile: Profile; index: number }) {
  const meta = [profile.company, profile.location].filter(Boolean).join(" · ");
  const status = profile.status?.trim();

  return (
    <header
      className="rise flex flex-col items-center text-center"
      style={{ "--i": index } as CSSProperties}
    >
      <div className="relative h-[164px] w-[152px] @5xl:h-[196px] @5xl:w-[180px]">
        <div
          aria-hidden
          className="photo-glow absolute inset-2 rounded-photo bg-accent blur-[26px]"
        />
        <div
          aria-hidden
          className="photo-frame absolute -inset-[2px] rounded-[28px]"
        />
        <div className="absolute inset-0 overflow-hidden rounded-photo border border-(--photo-edge) bg-bg-subtle">
          <Image
            src={profile.photo}
            alt={profile.name}
            width={360}
            height={392}
            priority
            sizes="(min-width: 1024px) 180px, 152px"
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      <h1 className="text-balance mt-6 max-w-full [overflow-wrap:anywhere] text-[28px] font-bold leading-[1.1] tracking-[-0.02em] text-accent-ink @5xl:text-[36px]">
        {profile.name}
      </h1>
      <p className="mt-2 max-w-full text-base font-medium text-text [overflow-wrap:anywhere] @5xl:text-lg">
        {profile.title}
      </p>
      {meta && (
        <p className="mt-1 max-w-full text-sm text-text-3 [overflow-wrap:anywhere]">{meta}</p>
      )}

      {status && (
        <p className="mt-4 inline-flex items-center gap-2 rounded-chip border border-border-strong bg-surface px-3.5 py-1.5 text-[13px] font-medium text-text-2 shadow-sm">
          <span className="relative flex h-2 w-2" aria-hidden>
            <span className="status-ping absolute inset-0 rounded-full bg-success" />
            <span className="relative h-2 w-2 rounded-full bg-success" />
          </span>
          {status}
        </p>
      )}
    </header>
  );
}
