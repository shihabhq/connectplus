import type { ReactNode } from "react";
import { AddressBook, Envelope, Globe, Phone } from "@phosphor-icons/react/dist/ssr";
import { formatPhone, type Profile } from "@/lib/profile";
import { CopyButton } from "./CopyButton";
import { Section } from "./Section";

function Row({
  id,
  icon,
  label,
  value,
  copy,
}: {
  id: string;
  icon: ReactNode;
  label: string;
  value: string;
  copy: string;
}) {
  return (
    <li className="flex items-center gap-2.5 p-3 @[360px]:gap-3 @[360px]:p-3.5">
      <span
        aria-hidden
        className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-tile bg-bg-subtle text-accent-ink @[360px]:flex"
      >
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-text-3">{label}</p>
        <p
          id={id}
          className="tabular select-all text-[15px] [overflow-wrap:anywhere] font-medium text-text"
        >
          {value}
        </p>
      </div>
      <CopyButton text={copy} targetId={id} label={label.toLowerCase()} />
    </li>
  );
}

export function ContactSection({ profile, index }: { profile: Profile; index: number }) {
  const website = profile.website?.trim();
  const email = profile.email?.trim();
  if (!profile.phone && !email && !website) return null;

  return (
    <Section id="contact" label="Contact" icon={AddressBook} index={index}>
      <ul className="divide-y divide-border overflow-hidden rounded-card border border-border bg-surface shadow-md">
        {profile.phone && (
          <Row
            id="contact-phone"
            icon={<Phone size={20} weight="fill" />}
            label="Phone"
            value={formatPhone(profile.phone)}
            copy={profile.phone}
          />
        )}
        {email && (
          <Row
            id="contact-email"
            icon={<Envelope size={20} weight="fill" />}
            label="Email"
            value={email}
            copy={email}
          />
        )}
        {website && (
          <Row
            id="contact-website"
            icon={<Globe size={20} weight="fill" />}
            label="Website"
            value={website.replace(/^https?:\/\//i, "")}
            copy={website}
          />
        )}
      </ul>
    </Section>
  );
}
