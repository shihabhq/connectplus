# CorpoMerch Card

The web profile that opens when someone taps a CorpoMerch NFC business card. It has one job: help the person who just met you **save your contact** and **remember who you are**.

- **Public card** at `/[slug]`, for example `/shamsul-al-amin`. Mobile first, two columns on desktop.
- **Save contact** at `/[slug]/vcard`. A vCard 3.0 file with the photo, so it imports on iOS and Android.
- **Share image** at `/[slug]/opengraph-image`, so links look right on WhatsApp, Messenger and LinkedIn.
- **Card Studio** at `/studio`. A demo dashboard with a live phone preview. It runs entirely in the browser: no login, no database.
- `/` redirects to the demo card.
- **Light and dark themes.** A sun/moon button on the card (and in the Studio top bar) switches theme. The first visit follows the device setting, and the choice is remembered in the browser.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint
npm test         # vitest
```

Node 20.19 or newer is required.

## Stack

Next.js 16 (App Router), React 19, TypeScript strict, Tailwind CSS v4 with tokens in `src/app/globals.css`, Phosphor icons, zod, dnd-kit (drag to reorder), vitest. No UI kit and no animation library: all motion is CSS.

## How it is organised

```
src/
  app/
    [slug]/            public card, OG image, vcard route, 404
    studio/            Card Studio
  components/
    card/              ProfileCard and its sections (one component, used by the page AND the Studio preview)
    studio/            Studio shell, sections, checkout modal
    icons/brands.tsx   social logos and brand colours
    ui/                Button, IconButton, Switch, Toast, Field, Select
  content/profiles/    one JSON file per card
  lib/
    profile.ts         zod schema, getProfile, social link normalising
    color.ts           WCAG contrast maths and the accent token builder
    vcard.ts           buildVCard
    dates.ts           month formatting and role sorting
    studio-store.ts    Studio reducer and storage helpers (no React, fully tested)
public/
  profiles/            photos
  cv/                  CV PDFs
```

`ProfileCard` sizes itself from its own container width, not the window. That is why the Studio preview stays a phone layout on a wide screen without any duplicated markup.

## Add a card

1. Add `src/content/profiles/<slug>.json`. Copy `shamsul-al-amin.json` and edit it.
2. Import it in the `RAW_PROFILES` list in `src/lib/profile.ts`.
3. Put the photo in `public/profiles/` (and a CV in `public/cv/` if enabled).

Every profile is validated with zod when the app builds, so a typo fails the build instead of reaching a client. `generateStaticParams` prerenders each card.

## The accent colour system

The owner picks one hex. `lib/color.ts` derives everything else from it and the card sets the result as CSS variables:

| Token | Purpose |
| --- | --- |
| `--accent` | fills, glows, focus ring |
| `--accent-ink` | any accent coloured text. Darkened until it reaches 4.5:1 on white **and** on the soft tint |
| `--accent-strong` / `--on-accent` | primary button. Darkens up to 25%, otherwise switches to dark text (yellows, ambers) |
| `--accent-soft` | pills and tiles |
| `--accent-ring` | soft borders and glows |

Every token has a dark-theme twin. In dark mode the ink is lightened until it reads on the dark page, surface and soft tint, and the button gets its own fill, so Graphite stays visible. A test loops over all 12 presets and asserts the contrast rules for both themes. Custom colours in the Studio go through the same builder, and colours that are too light are rejected with a suggested preset.

## Themes

Colours live in `src/app/globals.css`. The `[data-theme="dark"]` block overrides the neutrals, and `.accent-scope` picks the light or dark accent values that `lib/color.ts` sets on each card. A small script in `layout.tsx` sets the theme before first paint, so there is no flash. The share image (OG) stays light on purpose.

## Studio limits (it is a demo)

- Data is saved to `localStorage` in the visitor's browser. "Reset demo" restores the starting profile.
- Uploaded photos are resized to 800px and stored as data URLs. Uploaded CV PDFs only last for the current session, because a 5 MB file does not fit in localStorage.
- The CV checkout takes no money and asks for no card details. It is labelled as a demo in the UI.
- **View card** opens the static demo card, not the profile being edited.
- The reducer actions (`updateField`, `addSocial`, `reorderSocials`, `saveRole`, and so on) are shaped like API calls, so a backend can replace localStorage without rewriting the UI.

## Checked before release

- Widths 320, 375, 393, 768, 1024 and 1440: no horizontal scroll, nothing clipped.
- All 12 accent presets on the card.
- Lighthouse mobile on the card: Performance 100, Accessibility 100, Best Practices 100, SEO 100.
- Dark theme: text and accent contrast tested for all 12 presets, and Lighthouse accessibility 100 in dark.
- Keyboard only: every control reachable, visible focus ring, tap targets at least 44px.
- `prefers-reduced-motion` stops every animation and transition.
- No em dashes in UI copy or content, and no hard-coded hex colours in components.

## Deploy on Vercel

1. Push the repo to GitHub.
2. In Vercel choose **Add New, Project**, import the repo. The framework preset is detected as Next.js. Leave the build settings alone.
3. No environment variables are needed for the showcase. Click **Deploy**.
4. After you connect a custom domain, add `NEXT_PUBLIC_SITE_URL` (for example `https://card.corpomerch.com`) in **Settings, Environment Variables** and redeploy. Until then the app uses the `VERCEL_URL` deployment address for share links and the OG image.

After deploying, open `/shamsul-al-amin` on a phone, tap **Save contact**, and paste the link into WhatsApp to check the preview image.

## Before real clients

The demo data is placeholder: the phone number, email, social handles, the portrait and the CV PDF. Replace them. Real accounts, stored photos and CVs, payments, analytics and QR codes are intentionally not built yet.
