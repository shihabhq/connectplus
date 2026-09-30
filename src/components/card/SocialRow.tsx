import type { CSSProperties } from "react";
import { BrandIcon, socialCircleStyle } from "@/components/icons/brands";
import { resolveSocials, type Profile } from "@/lib/profile";

export function SocialRow({ profile, index }: { profile: Profile; index: number }) {
  const socials = resolveSocials(profile);
  if (!profile.sections.socials || socials.length === 0) return null;

  return (
    <nav
      aria-label="Social links"
      className="rise"
      style={{ "--i": index } as CSSProperties}
    >
      <ul className="grid grid-cols-4 gap-x-2 gap-y-4">
        {socials.map((s) => {
          const external = !s.href.startsWith("mailto:");
          return (
            <li key={`${s.type}-${s.href}`}>
              <a
                href={s.href}
                {...(external ? { target: "_blank", rel: "noopener" } : {})}
                className="social-link flex min-h-11 flex-col items-center gap-1.5 rounded-btn py-1 text-xs text-text-3"
              >
                <span
                  className="social-icon flex h-[52px] w-[52px] items-center justify-center rounded-full"
                  style={socialCircleStyle(s.type, profile.socialStyle)}
                >
                  <BrandIcon type={s.type} width={24} height={24} />
                </span>
                {s.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
