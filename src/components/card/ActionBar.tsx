import type { CSSProperties } from "react";
import { Phone, UserPlus } from "@phosphor-icons/react/dist/ssr";
import { telHref, type Profile } from "@/lib/profile";

const button =
  "inline-flex h-[52px] min-w-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-btn px-2 text-sm font-semibold @[360px]:gap-2 @[360px]:px-4 @[360px]:text-[15px] transition-transform duration-200 active:scale-[0.97]";

export function ActionBar({ profile, index }: { profile: Profile; index: number }) {
  const { saveContact, call } = profile.actions;
  if (!saveContact && !call) return null;
  const both = saveContact && call;

  return (
    <div
      className={`rise grid gap-3 ${both ? "grid-cols-[repeat(2,minmax(0,1fr))]" : "grid-cols-1"}`}
      style={{ "--i": index } as CSSProperties}
    >
      {saveContact && (
        <a
          href={`/${profile.slug}/vcard`}
          className={`${button} border border-border-strong bg-surface text-text shadow-sm hover:bg-bg-subtle`}
        >
          <UserPlus size={20} weight="fill" aria-hidden />
          Save contact
        </a>
      )}
      {call && (
        <a
          href={telHref(profile.phone)}
          className={`${button} call-glow bg-accent-strong text-on-accent`}
        >
          <Phone size={20} weight="fill" aria-hidden />
          Call
        </a>
      )}
    </div>
  );
}
