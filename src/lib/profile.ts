import { z } from "zod";
import { validateAccent } from "./color";
import shamsulAlAmin from "@/content/profiles/shamsul-al-amin.json";

export const SOCIAL_TYPES = [
  "facebook",
  "linkedin",
  "whatsapp",
  "telegram",
  "instagram",
  "x",
  "youtube",
  "github",
  "website",
  "email",
] as const;

export type SocialType = (typeof SOCIAL_TYPES)[number];

export const LIMITS = {
  about: 500,
  aboutWarn: 420,
  skills: 8,
  socials: 6,
} as const;

const monthString = z
  .string()
  .regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Use the format YYYY-MM.");

const roleSchema = z.object({
  title: z.string().min(1),
  start: monthString,
  end: monthString.nullable(),
  current: z.boolean(),
});

const companySchema = z.object({
  name: z.string().min(1),
  roles: z.array(roleSchema),
});

export const profileSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  name: z.string().min(1),
  title: z.string().min(1),
  company: z.string().min(1),
  location: z.string().optional(),
  status: z.string().optional(),
  photo: z.string().min(1),
  phone: z.string().regex(/^\+[1-9]\d{6,14}$/, "Use E.164, for example +8801700000000."),
  email: z.string().optional(),
  website: z.string().optional(),
  about: z.string().max(LIMITS.about),
  skills: z.array(z.string().min(1)).max(LIMITS.skills),
  experience: z.array(companySchema),
  socials: z
    .array(z.object({ type: z.enum(SOCIAL_TYPES), value: z.string() }))
    .max(LIMITS.socials),
  socialStyle: z.enum(["brand", "mono"]),
  accent: z.string().refine((v) => validateAccent(v).ok, {
    message: "Accent colour must be a valid, not too light, hex colour.",
  }),
  cv: z.object({
    enabled: z.boolean(),
    file: z.string().optional(),
    label: z.string().optional(),
    updated: monthString.optional(),
  }),
  actions: z
    .object({ saveContact: z.boolean(), call: z.boolean() })
    .default({ saveContact: true, call: true }),
  sections: z.object({
    about: z.boolean(),
    skills: z.boolean(),
    experience: z.boolean(),
    socials: z.boolean(),
    contact: z.boolean(),
  }),
});

/** Same as profileSchema, but lets the Studio keep a half-typed phone number. */
export const storedProfileSchema = profileSchema.extend({ phone: z.string() });

export type Role = z.infer<typeof roleSchema>;
export type Company = z.infer<typeof companySchema>;
export type Profile = z.infer<typeof profileSchema>;
export type SectionKey = keyof Profile["sections"];

/** Every JSON file in content/profiles, validated when this module loads (so at build time). */
const RAW_PROFILES: unknown[] = [shamsulAlAmin];

const PROFILES: Profile[] = RAW_PROFILES.map((raw) => profileSchema.parse(raw));

export function getAllSlugs(): string[] {
  return PROFILES.map((p) => p.slug);
}

export function getProfile(slug: string): Profile | null {
  return PROFILES.find((p) => p.slug === slug) ?? null;
}

export const DEMO_SLUG = "shamsul-al-amin";

export function getDemoProfile(): Profile {
  const p = getProfile(DEMO_SLUG);
  if (!p) throw new Error(`Demo profile "${DEMO_SLUG}" is missing.`);
  return p;
}

// ---------------------------------------------------------------- phone

/** "+8801700000000" -> "+880 1700-000000". Other numbers are shown as stored. */
export function formatPhone(e164: string): string {
  const m = /^\+880(\d{4})(\d{6})$/.exec(e164);
  return m ? `+880 ${m[1]}-${m[2]}` : e164;
}

export function telHref(e164: string): string {
  return `tel:${e164}`;
}

// -------------------------------------------------------------- socials

export type SocialMeta = {
  label: string;
  placeholder: string;
  hint: string;
};

export const SOCIAL_META: Record<SocialType, SocialMeta> = {
  facebook: { label: "Facebook", placeholder: "facebook.com/yourname", hint: "Profile or page link" },
  linkedin: { label: "LinkedIn", placeholder: "linkedin.com/in/yourname", hint: "Profile link" },
  whatsapp: { label: "WhatsApp", placeholder: "+8801700000000", hint: "Phone number with country code" },
  telegram: { label: "Telegram", placeholder: "@yourname", hint: "Username or link" },
  instagram: { label: "Instagram", placeholder: "@yourname", hint: "Username or link" },
  x: { label: "X", placeholder: "@yourname", hint: "Username or link" },
  youtube: { label: "YouTube", placeholder: "youtube.com/@yourchannel", hint: "Channel link" },
  github: { label: "GitHub", placeholder: "github.com/yourname", hint: "Username or link" },
  website: { label: "Website", placeholder: "yourcompany.com", hint: "Web address" },
  email: { label: "Email", placeholder: "you@company.com", hint: "Email address" },
};

/** Where a bare handle points, for platforms where that makes sense. */
const HANDLE_BASE: Partial<Record<SocialType, string>> = {
  facebook: "https://facebook.com/",
  linkedin: "https://linkedin.com/in/",
  telegram: "https://t.me/",
  instagram: "https://instagram.com/",
  x: "https://x.com/",
  youtube: "https://youtube.com/@",
  github: "https://github.com/",
};

const SCHEME_RE = /^[a-z][a-z0-9+.-]*:/i;

/**
 * Turns what the owner typed into a safe link. Returns null when the value is empty
 * or cannot be turned into an http(s), mailto or wa.me link.
 */
export function socialHref(type: SocialType, value: string): string | null {
  const v = value.trim();
  if (!v) return null;

  if (type === "email") {
    const address = v.replace(/^mailto:/i, "").trim();
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address) ? `mailto:${address}` : null;
  }

  if (type === "whatsapp") {
    if (/^https?:\/\//i.test(v)) return v;
    if (/^(wa\.me|api\.whatsapp\.com)\//i.test(v)) return `https://${v}`;
    const digits = v.replace(/\D/g, "");
    return digits.length >= 7 ? `https://wa.me/${digits}` : null;
  }

  if (/^https?:\/\//i.test(v)) return v;
  // Any other scheme (javascript:, data:, tel: and so on) is refused.
  if (SCHEME_RE.test(v) && !/^[^/\s]+:\d+/.test(v)) return null;

  const looksLikeDomain =
    /^(www\.)?[a-z0-9-]+(\.[a-z0-9-]+)+([/?#].*)?$/i.test(v) && !v.startsWith("@");
  if (looksLikeDomain) return `https://${v}`;

  const base = HANDLE_BASE[type];
  if (base && /^@?[\w.-]+$/.test(v)) return `${base}${v.replace(/^@/, "")}`;
  return null;
}

export function normaliseWebsite(value: string | undefined): string | null {
  return value ? socialHref("website", value) : null;
}

export type ResolvedSocial = {
  type: SocialType;
  label: string;
  href: string;
};

export function resolveSocials(profile: Profile): ResolvedSocial[] {
  const out: ResolvedSocial[] = [];
  for (const s of profile.socials) {
    const href = socialHref(s.type, s.value);
    if (href) out.push({ type: s.type, label: SOCIAL_META[s.type].label, href });
  }
  return out;
}

// ---------------------------------------------------------------- about

/** First sentence of the about text, for meta descriptions. */
export function firstSentence(text: string): string {
  const t = text.trim();
  const m = /^[\s\S]+?[.!?](?=\s|$)/.exec(t);
  return (m ? m[0] : t).slice(0, 200);
}

export function initialOf(name: string): string {
  return name.trim().charAt(0).toUpperCase() || "?";
}

export function plural(n: number, one: string, many = `${one}s`): string {
  return `${n} ${n === 1 ? one : many}`;
}
