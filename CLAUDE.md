@AGENTS.md

# CLAUDE.md

Project guide for Claude Code. Read this whole file before writing code. When this file and a prompt disagree, ask.

## 1. What we are building

**CorpoMerch Card** is the web profile that opens when someone taps a CorpoMerch NFC business card with their phone.

The repo has two parts:

1. **Public card page** at `/[slug]` (for example `/shamsul-al-amin`). A fast, mobile-first profile with photo, name, title, company, Save Contact, Call, social links, about, skills, experience, CV download and contact details. On desktop it becomes a two-column layout.
2. **Card Studio** at `/studio`. A demo dashboard where a card owner edits their profile with a live phone preview. For the showcase it runs entirely in the browser (no login, no database). It must be built so a backend can be added later without rewriting the UI.

Also:

- `/` redirects to the demo profile `/shamsul-al-amin`.
- `/[slug]/vcard` returns a `.vcf` file so Save Contact works on every phone.
- A per-profile Open Graph image, so the link looks good when shared on WhatsApp, Messenger or LinkedIn.

Audience: people who just met the card owner, usually on a phone, often standing up, with 5 to 10 seconds of attention. The page's single job is to help them **save the contact** and **remember who this person is**.

## 2. Stack

- **Next.js, latest stable, App Router**, TypeScript `strict: true`. Use `npx create-next-app@latest` defaults (App Router, `src/` directory, Tailwind, ESLint, import alias `@/*`).
- **Tailwind CSS v4** with design tokens defined as CSS variables in `src/app/globals.css` using `@theme`. No hard-coded hex values inside components; always use tokens.
- **@phosphor-icons/react** for all UI icons, `weight="fill"` for section and action icons, `weight="bold"` for small utility icons (copy, arrow, close). Social brand logos are hand-kept SVG components in `src/components/icons/brands.tsx` (Facebook, LinkedIn, WhatsApp, Telegram, Instagram, X, YouTube, GitHub, Website, Email).
- **zod** for the profile schema.
- **@dnd-kit/core + @dnd-kit/sortable** for drag-to-reorder in the Studio (social links).
- **vitest** for unit tests of `lib/color.ts`, `lib/vcard.ts` and date formatting.
- No UI kit (no shadcn, MUI, Chakra). Components are hand-built so the design stays specific.
- No animation library. All motion is CSS keyframes and transitions.
- Package manager: **pnpm** if available, otherwise npm. Pick one and keep the lockfile.

## 3. Folder structure

```
src/
  app/
    layout.tsx               root layout, fonts, metadata base, theme-color
    page.tsx                 redirect("/shamsul-al-amin")
    globals.css              tokens, base styles, keyframes
    [slug]/
      page.tsx               public card (Server Component)
      opengraph-image.tsx    OG image via next/og
      vcard/route.ts         GET -> text/vcard
      not-found.tsx
    studio/
      page.tsx               Card Studio (client)
  components/
    card/                    ProfileCard and its sections (shared by /[slug] and Studio preview)
      ProfileCard.tsx
      Hero.tsx
      ActionBar.tsx
      SocialRow.tsx
      Section.tsx
      AboutSection.tsx
      SkillsSection.tsx
      ExperienceSection.tsx
      CvSection.tsx
      ContactSection.tsx
      CardFooter.tsx
      Backdrop.tsx
    studio/                  Studio panes, nav, preview frame, checkout modal
    icons/brands.tsx
    ui/                      Button, IconButton, Switch, Toast, Field, Select
  content/
    profiles/shamsul-al-amin.json
  lib/
    profile.ts               zod schema, types, getProfile(slug), getAllSlugs()
    color.ts                 contrast math, accent token builder, presets
    vcard.ts                 buildVCard(profile)
    dates.ts                 formatMonth, sortRoles
    studio-store.ts          Studio state (React context + useReducer + localStorage)
public/
  profiles/shamsul-al-amin.jpg
  cv/shamsul-al-amin.pdf     placeholder PDF is fine
```

`ProfileCard` is **one component** used in both the public page and the Studio preview. Never duplicate card markup.

## 4. Data model

```ts
type SocialType =
  | "facebook"
  | "linkedin"
  | "whatsapp"
  | "telegram"
  | "instagram"
  | "x"
  | "youtube"
  | "github"
  | "website"
  | "email";

type Role = {
  title: string;
  start: string; // "YYYY-MM"
  end: string | null; // "YYYY-MM", null when current
  current: boolean;
};

type Company = { name: string; roles: Role[] };

type Profile = {
  slug: string;
  name: string;
  title: string;
  company: string;
  location?: string;
  status?: string; // e.g. "Open to new partnerships"; hidden when empty
  photo: string; // path under /public or data URL in Studio
  phone: string; // E.164, e.g. "+8801700000000"
  email?: string;
  website?: string;
  about: string; // max 500 chars
  skills: string[]; // max 8
  experience: Company[];
  socials: { type: SocialType; value: string }[]; // max 6, order is display order
  socialStyle: "brand" | "mono";
  accent: string; // hex, must pass color.ts validation
  cv: { enabled: boolean; file?: string; label?: string; updated?: string };
  sections: {
    about: boolean;
    skills: boolean;
    experience: boolean;
    socials: boolean;
    contact: boolean;
  };
};
```

Validate every JSON file with zod at build time. `generateStaticParams` returns every slug in `content/profiles`. Phone numbers render formatted (`+880 1700-000000`) but links use E.164.

Social `value` is stored as the user typed it. `lib/profile.ts` normalises it into a URL: `facebook.com/x` becomes `https://facebook.com/x`, WhatsApp numbers become `https://wa.me/<digits>`, email becomes `mailto:`.

## 5. Design system (white theme)

The page is **white**. It must look calm, premium and corporate, with one accent colour doing all the emphasis. Think Apple product page restraint, not a template.

### 5.1 Neutral tokens

| Token             | Value     | Use                                                 |
| ----------------- | --------- | --------------------------------------------------- |
| `--bg`            | `#FFFFFF` | page                                                |
| `--bg-subtle`     | `#F7F7F8` | Studio canvas, icon tiles                           |
| `--surface`       | `#FFFFFF` | cards                                               |
| `--border`        | `#E7E7EB` | card borders, dividers                              |
| `--border-strong` | `#D4D4DA` | inputs, chips, secondary button                     |
| `--text`          | `#0E0E12` | headings, name                                      |
| `--text-2`        | `#3F3F46` | body copy                                           |
| `--text-3`        | `#6B6B75` | meta, dates, labels (5.3:1 on white, never lighter) |
| `--success`       | `#059669` | status dot, "Copied"                                |
| `--grid`          | `#EEEEF2` | background grid lines                               |

Shadows:

- `--shadow-sm: 0 1px 2px rgba(16,16,24,.05)`
- `--shadow-md: 0 1px 2px rgba(16,16,24,.04), 0 12px 32px -16px rgba(16,16,24,.16)`
- `--shadow-lg: 0 2px 4px rgba(16,16,24,.04), 0 24px 48px -20px rgba(16,16,24,.22)`

Radii: chips `999px`, buttons `14px`, cards `18px`, photo `26px`, icon tiles `10px`.

### 5.2 Accent system (this is where the old version went wrong)

The owner picks one accent hex. Never use the raw accent for small text on white; bright reds, oranges and yellows fail contrast. `lib/color.ts` builds a full set of accent tokens from the one hex and the card sets them as inline CSS variables on its root element:

| Token             | How it is made                                                                                                            | Use                                                              |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `--accent`        | the picked hex                                                                                                            | fills: dots, icon glyphs, glows, focus ring                      |
| `--accent-ink`    | accent mixed toward black until contrast with white is **≥ 4.5:1**                                                        | any accent-coloured text: name, "Current" pill, links, PDF label |
| `--accent-strong` | if white text on accent is ≥ 4.5:1, the accent itself; otherwise accent darkened up to 25% until white text reaches 4.5:1 | primary button background                                        |
| `--on-accent`     | `#FFFFFF` when `--accent-strong` reached 4.5:1 with white; otherwise `#0E0E12` (for yellows and limes)                    | text/icons on primary buttons                                    |
| `--accent-soft`   | accent mixed 10% into white                                                                                               | pill background, company monogram tile                           |
| `--accent-ring`   | accent at 28% alpha                                                                                                       | soft borders, glows                                              |

Implement WCAG relative luminance and contrast ratio exactly (sRGB linearisation, `(L1+0.05)/(L2+0.05)`). Mixing is done in sRGB in small steps (2%) so results are deterministic and testable.

**Presets** (default is CorpoMerch Red). Every preset must produce `accent-ink ≥ 4.5:1` and a primary button with text contrast ≥ 4.5:1. A vitest test loops over all presets and asserts this.

```
CorpoMerch Red #F2323F   Rose #E11D48     Orange #F97316   Amber #F59E0B
Emerald #10B981          Teal #0D9488     Sky #0EA5E9      Blue #2563EB
Indigo #4F46E5           Violet #7C3AED   Fuchsia #C026D3  Graphite #27272A
```

Custom colours in the Studio run through the same builder. If the raw colour is so light that even `--accent-ink` would look muddy (luminance above 0.7, for example pale yellow), show a warning and suggest the nearest preset instead of saving it.

### 5.3 Typography

- Font stack: `-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", var(--font-inter), system-ui, "Segoe UI", Roboto, sans-serif`. SF Pro shows on Apple devices; everyone else gets Inter. **Do not bundle or self-host SF Pro files** (Apple's licence forbids it). Load Inter with `next/font/google` as the fallback and expose it as `--font-inter`.
- Scale (mobile / desktop):
  - Name: 28 / 36px, weight 700, tracking -0.02em, line-height 1.1, `text-wrap: balance`
  - Role: 16 / 18px, weight 500, `--text`
  - Company line: 14px, `--text-3`
  - Section label: 12px, weight 600, uppercase, tracking 0.12em, `--text-3`
  - Body: 15 / 16px, line-height 1.7, `--text-2`, max 62ch, **left aligned, never justified**
  - Meta (dates, captions): 13px, `--text-3`, `tabular-nums`
- Numbers in dates and phone use `font-variant-numeric: tabular-nums`.

### 5.4 Layout

- **Mobile (default, < 1024px):** single column, `max-width: 440px`, centred, side padding 20px, top padding 48px, section gap 32px.
- **Desktop (≥ 1024px):** container `max-width: 1040px`, two columns `380px | 1fr`, gap 56px. Left column is sticky (`top: 48px`) and holds Hero, ActionBar and SocialRow. Right column holds About, Skills, Experience, CV, Contact. The footer spans both.
- The page must never scroll horizontally at 320px width.

### 5.5 Components

**Backdrop.** Fixed, behind content, `pointer-events: none`. A 44px grid in `--grid` masked by a radial gradient centred behind the photo so it fades out (no hard edge anywhere). Two blurred accent blobs (`filter: blur(80px)`, opacity 0.10 and 0.06) drifting slowly. On desktop the blobs sit behind the left column.

**Hero.**

- Photo 152x164 (desktop 180x196), radius 26px, 1px border `rgba(0,0,0,.06)`, `next/image` with `priority` and `sizes`.
- Behind the photo: a breathing glow (accent, blur 26px, opacity 0.22 to 0.42, scale 0.95 to 1.04, 4.5s).
- Around the photo: a 2px frame with a slow light sweep, made with `conic-gradient(from var(--angle), transparent 0 60%, var(--accent) 78%, #fff 82%, var(--accent) 86%, transparent)` and a registered `@property --angle` animated over 8s.
- Name in `--accent-ink`. Title below in `--text`. Company · location in `--text-3`.
- Optional status pill: white, `--border-strong` border, `--shadow-sm`, green dot with a soft ping animation.

**ActionBar.** Two equal buttons in a 2-column grid, height 52px, radius 14px, 15px/600.

- Save Contact: secondary (white, `--border-strong`, `--shadow-sm`, Phosphor `UserPlus` fill). It links to `/[slug]/vcard`.
- Call: primary (`--accent-strong` background, `--on-accent` text, Phosphor `Phone` fill), `href="tel:"`, with a gentle glow pulse (3.2s).
- Pressed state `scale(.97)`. Visible focus ring in `--accent`.

**SocialRow.** Up to 6 items in a grid (4 per row on mobile, wraps). Each: 52px circle with brand colour (or `#27272A` in mono mode) and white glyph, label underneath in 12px `--text-3`. Hover/focus: lift 3px and a shadow in the brand colour. Links open in a new tab with `rel="noopener"`. The Call button already covers the phone, so "phone" is not a social type.

Brand colours: Facebook `#1877F2`, LinkedIn `#0A66C2`, WhatsApp `#25D366`, Telegram `#229ED9`, Instagram gradient `radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)`, X `#0F1419`, YouTube `#FF0000`, GitHub `#181717`, Website `#52525B`, Email `#EA4335`.

**Section.** Header row: Phosphor fill icon (17px, `--accent`, soft drop-shadow glow in `--accent-ring`), uppercase label, then a 1px line that fades out to the right. Icons: About `UserCircle`, Skills `Lightbulb`, Experience `Briefcase`, CV `FileText`, Contact `AddressBook`.

**Skills.** Chips: white, `--border-strong`, 13.5px/500, `--text-2`, padding 7px 13px. Hover: border and glow in `--accent-ring`.

**Experience.** One card per company (`--surface`, `--border`, `--shadow-md`, radius 18px, padding 18px).

- Header: 40px monogram tile (first letter, `--accent-ink` on `--accent-soft`), company name 16px/600, "2 roles" in `--text-3`.
- Roles as a vertical timeline: 1.5px line, 10px dots. Current role dot is `--accent` with a slow glow pulse; past dots `#C9C9D1`.
- Each role: title 15px/500, a "Current" pill (`--accent-ink` on `--accent-soft`, 11px/600) for current roles, dates on the next line as `Jul 2026 - Present`.
- Roles always sorted: current first, then by end date, newest first. Use `lib/dates.ts`.

**CV.** Only renders when `cv.enabled && cv.file`. A card with a PDF tile (`FilePdf` fill in `--accent-ink` on `--bg-subtle`), title "Full CV", meta "PDF · Updated Sep 2026", and a primary Download button (`DownloadSimple` fill) that links to the file with the `download` attribute. A faint accent sheen sweeps across the card every 6s.

**Contact.** A card with rows for phone and email: icon tile, small label, value as selectable text, and a Copy button (Phosphor `Copy` bold) that turns into "Copied" in `--success` for 1.6s. Use `navigator.clipboard.writeText` with a fallback that selects the text.

**CardFooter.** "Want a card like this for yourself?" and a pill link to `https://www.corpomerch.com` with a globe icon in `--accent-ink`.

### 5.6 Motion

All motion is subtle. Nothing bounces or flashes.

- Entrance: sections rise 10px and fade from opacity 0.35 to 1 over 600ms, `cubic-bezier(.2,.7,.2,1)`, staggered 70ms. Content is readable even before the animation runs; never start from opacity 0.
- Ambient: photo glow (4.5s), photo frame sweep (8s), backdrop blobs (16s and 22s), Call button glow (3.2s), current-role dot (2.6s), status ping (2.4s), CV sheen (6s).
- Hover: 200ms transitions.
- `@media (prefers-reduced-motion: reduce)`: turn off every animation and transition.

### 5.7 Accessibility

- Every interactive element is a real `<a>` or `<button>`, reachable by keyboard, with a visible focus ring.
- Minimum tap target 44x44px.
- Body text contrast ≥ 4.5:1; accent text only via `--accent-ink`.
- Photo `alt` is the person's name. Decorative SVGs are `aria-hidden`.
- Icon-only buttons have `aria-label`.

## 6. Public page details

- Server Component; the only client components are the Copy buttons and the Toast.
- `generateMetadata`: title `"<Name> · <Title> at <Company>"`, description from the first sentence of `about`, canonical URL, `openGraph` and `twitter` card.
- `opengraph-image.tsx`: 1200x630, white background, faint grid, photo on the left in a rounded frame with accent glow, name in `--accent-ink`, title and company, small "corpomerch.com" at the bottom.
- `viewport.themeColor = "#FFFFFF"`.
- `/[slug]/vcard/route.ts`: vCard 3.0 with `N`, `FN`, `ORG`, `TITLE`, `TEL;TYPE=CELL`, `EMAIL`, `URL` (the card page), and `PHOTO;ENCODING=b;TYPE=JPEG` (read the photo from `public`, base64). Headers: `Content-Type: text/vcard; charset=utf-8`, `Content-Disposition: attachment; filename="<slug>.vcf"`. Escape commas, semicolons and newlines.
- Unknown slug: `notFound()` with a simple branded 404.
- Performance target: Lighthouse mobile 95+ in Performance, Accessibility, Best Practices and SEO. Photo served by `next/image` as AVIF/WebP.

## 7. Card Studio (`/studio`)

A demo dashboard. State lives in `lib/studio-store.ts` (context + reducer), saved to `localStorage` with try/catch, seeded from the demo profile. A "Reset demo" button restores the seed. Keep the reducer actions shaped like future API calls (`updateField`, `addSocial`, `reorderSocials`, `saveRole`, and so on) so Supabase can replace localStorage later.

**Layout.**

- Desktop (≥ 1180px): left nav 220px | editor | sticky phone preview 390px. Preview is a phone frame rendering `<ProfileCard>` with live state.
- Tablet (860 to 1179px): nav becomes a wrapping row of pills above the editor; preview stays on the right.
- Mobile (< 860px): opens on a **section hub** (large rows with icon, name and a one-line summary like "4 links" or "Brand Strategy, Sales +2"). Inside a section, a fixed bottom bar shows **All sections | Preview | Next**. Preview opens full screen with a Close button.
- Top bar: CorpoMerch mark, "Card Studio", save status ("Saving..." then "All changes saved"), plan pill ("Basic plan", plus "CV add-on" when active), and "View card" which opens `/shamsul-al-amin` in a new tab.

**Sections**, each with a short plain-English description and, where relevant, a "Show on card" switch:

1. **Profile.** Minimal photo row: the photo (rounded square, click to change, drag-and-drop onto the row) with a small accent camera badge, then "Profile photo", one help line, and two text links "Change photo" and "Remove". Photos are resized client-side to 800px max. Then name, title, company, location, status.
2. **Contact.** Phone, email, website, toggles for Save Contact and Call.
3. **Social links.** One card. Top row: "Icon colours" with a two-option segmented control, **Original colours** and **Monotone**; the icons in the list, the add grid and the preview change the moment it is picked. Then the list: drag handle (also arrow keys), coloured icon, platform label above its input, delete. Under the list, "Add a link" opens a grid of the remaining platforms as icon buttons. Max 6.
4. **About.** Textarea at least 260px tall, 500 character limit, counter turns amber past 420.
5. **Skills.** Input plus Enter to add, removable chips, quick-add suggestions, max 8, no duplicates.
6. **Experience.** Company cards with the name editable inline. Roles shown as timeline rows (title, dates). Clicking a role or its pencil opens an inline form: role name, Started (Month select + Year select), Ended (Month + Year, replaced by "Present" when "I currently work in this role" is ticked), Save and Cancel. Validation messages: missing title, missing start, missing end, end before start. Roles auto-sort newest first. Deleting a company asks for confirmation inline ("Delete DSAT School and its 2 roles?"). Up/down to reorder companies.
7. **CV / Resume.** Locked until paid. Offer card: what the owner gets, pricing **৳500 one-time setup** and **৳100 per year renewal, first renewal one year after setup**, "Due today ৳500", button "Unlock CV for ৳500". Checkout modal: receipt lines, payment method cards (bKash, Nagad, Card), "Pay ৳500", 1.2s processing state, success screen. Label it clearly as a demo checkout that takes no money; never ask for card numbers. After unlocking: PDF upload (5MB max, PDF only), button label, billing panel (setup paid date, next renewal, payment method), "Turn off yearly renewal" with an inline confirm, and a note that an unpaid renewal hides the CV box but keeps the file.
8. **Theme.** The 12 presets as swatches (selected one has a ring and check), a custom colour picker with hex input, and a live contrast readout showing the name and a primary button in the resulting tokens. If a custom colour is rejected, explain why and offer the nearest preset.

Previous/Next buttons at the bottom of every section on desktop. Toasts for saves and errors. No `alert()` or `confirm()`.

## 8. Copy rules

- Plain, honest English. No marketing fluff ("drive results", "elevate", "unlock your potential").
- **Never use em dashes (the U+2014 character) anywhere in UI copy, content or code comments shown to users.** Use a comma, a full stop, or a spaced hyphen for date ranges (`Jan 2026 - Present`).
- Buttons say what they do: "Save contact", "Call", "Download", "Add a link", "Save role".
- Error messages say what is wrong and how to fix it.

## 9. Demo content (`content/profiles/shamsul-al-amin.json`)

- Name: Shamsul Al Amin. Title: Commercial & Creative Manager. Company: CorpoMerch. Location: Dhaka. Status: Open to new partnerships.
- Phone: +8801700000000 (placeholder). Email: shamsul@corpomerch.com (placeholder). Website: https://www.corpomerch.com
- About: "Marketing and finance professional. I lead marketing as Director at SA Trading Corporation and study at Bangladesh University of Professionals. I've also led teams at the BUP Global Affairs Council and the BUP Entrepreneurship & Innovation Club."
- Skills: Brand Strategy, B2B Sales, Content Planning, Team Leadership, Market Research.
- Experience:
  - DSAT School: Sales Executive (2026-07, current); Creative Visualizer (2026-01 to 2026-06).
  - SA Trading Corporation: Director of Marketing (2026-01, current); Marketing Executive (2025-06 to 2025-12).
- Socials: Facebook, LinkedIn, WhatsApp, Telegram (placeholder handles). Style: brand.
- Accent: #F2323F. CV enabled with `/cv/shamsul-al-amin.pdf`, updated 2026-09.

## 10. Commands

```
pnpm dev          # local dev
pnpm build        # must pass with zero errors and zero type errors
pnpm lint         # must pass
pnpm test         # vitest
```

## 11. Deployment (Vercel)

- Push to GitHub, import the repo in Vercel, framework preset Next.js, no environment variables needed for the showcase.
- Set `metadataBase` from `process.env.NEXT_PUBLIC_SITE_URL` with a fallback to `https://${process.env.VERCEL_URL}`.
- Add `NEXT_PUBLIC_SITE_URL` in Vercel once a custom domain is connected.

## 12. Definition of done

Before saying a task is finished:

- [ ] `build`, `lint` and `test` pass.
- [ ] Checked at 320, 375, 393, 768, 1024 and 1440px widths: no horizontal scroll, nothing clipped, nothing overlapping.
- [ ] Every accent preset checked on the card: name, pill and buttons are readable.
- [ ] Keyboard-only pass over the card and Studio.
- [ ] Reduced-motion setting turns every animation off.
- [ ] `/[slug]/vcard` downloads a contact that imports on iOS and Android with the photo.
- [ ] No em dashes in any user-facing string (`grep -rnP "\x{2014}" src content` returns nothing).
- [ ] No hard-coded hex colours in components outside `globals.css`, `lib/color.ts` and `icons/brands.tsx`.

## 13. Later (do not build now)

Supabase auth and Postgres for real profiles, Supabase Storage for photos and CVs, SSLCommerz or bKash payment gateway with webhooks for the CV add-on and renewals, per-card analytics (taps, saves, calls), QR code fallback, custom domains per company.
