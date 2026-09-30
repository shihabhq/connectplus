export type Rgb = { r: number; g: number; b: number };

export type AccentPreset = { name: string; hex: string };

export const DEFAULT_ACCENT = "#F2323F";

export const ACCENT_PRESETS: AccentPreset[] = [
  { name: "CorpoMerch Red", hex: "#F2323F" },
  { name: "Rose", hex: "#E11D48" },
  { name: "Orange", hex: "#F97316" },
  { name: "Amber", hex: "#F59E0B" },
  { name: "Emerald", hex: "#10B981" },
  { name: "Teal", hex: "#0D9488" },
  { name: "Sky", hex: "#0EA5E9" },
  { name: "Blue", hex: "#2563EB" },
  { name: "Indigo", hex: "#4F46E5" },
  { name: "Violet", hex: "#7C3AED" },
  { name: "Fuchsia", hex: "#C026D3" },
  { name: "Graphite", hex: "#27272A" },
];

const DARK_TEXT_HEX = "#0E0E12";
const WHITE_HEX = "#FFFFFF";

/** Accent colours lighter than this are too pale to build readable tokens from. */
export const MAX_ACCENT_LUMINANCE = 0.7;
const MIN_TEXT_CONTRAST = 4.5;
const MIX_STEP = 0.02;
const MAX_BUTTON_DARKEN = 0.25;

/** Accepts "#abc", "abc", "#aabbcc" or "aabbcc". Returns "#AABBCC" or null. */
export function normalizeHex(input: string): string | null {
  const raw = input.trim().replace(/^#/, "");
  if (/^[0-9a-fA-F]{3}$/.test(raw)) {
    return (
      "#" +
      raw
        .split("")
        .map((c) => c + c)
        .join("")
        .toUpperCase()
    );
  }
  if (/^[0-9a-fA-F]{6}$/.test(raw)) return "#" + raw.toUpperCase();
  return null;
}

export function hexToRgb(hex: string): Rgb {
  const n = normalizeHex(hex);
  if (!n) throw new Error(`Invalid hex colour: ${hex}`);
  return {
    r: parseInt(n.slice(1, 3), 16),
    g: parseInt(n.slice(3, 5), 16),
    b: parseInt(n.slice(5, 7), 16),
  };
}

export function rgbToHex({ r, g, b }: Rgb): string {
  const h = (v: number) =>
    Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0");
  return ("#" + h(r) + h(g) + h(b)).toUpperCase();
}

function linearise(channel: number): number {
  const c = channel / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

/** WCAG 2.x relative luminance, 0 (black) to 1 (white). */
export function relativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  return 0.2126 * linearise(r) + 0.7152 * linearise(g) + 0.0722 * linearise(b);
}

/** WCAG contrast ratio, 1 to 21. */
export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const [hi, lo] = la >= lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

/** Linear mix in sRGB. t = 0 returns `from`, t = 1 returns `to`. */
export function mix(from: string, to: string, t: number): string {
  const a = hexToRgb(from);
  const b = hexToRgb(to);
  return rgbToHex({
    r: a.r + (b.r - a.r) * t,
    g: a.g + (b.g - a.g) * t,
    b: a.b + (b.b - a.b) * t,
  });
}

/** Steps `from` toward `to` in 2% increments until `ok` passes or `limit` is reached. */
function stepMix(
  from: string,
  to: string,
  limit: number,
  ok: (hex: string) => boolean,
): { hex: string; reached: boolean } {
  const steps = Math.round(limit / MIX_STEP);
  for (let i = 0; i <= steps; i++) {
    const hex = mix(from, to, i * MIX_STEP);
    if (ok(hex)) return { hex, reached: true };
  }
  return { hex: mix(from, to, limit), reached: false };
}

/** Dark theme surfaces. Kept here so contrast maths and CSS agree. */
export const DARK = { bg: "#0B0B0F", surface: "#16161C" } as const;
const MIN_FILL_CONTRAST = 3;
const DARK_SOFT_MIX = 0.16;

export type ThemedAccent = {
  accent: string;
  accentInk: string;
  accentStrong: string;
  onAccent: string;
  accentSoft: string;
  accentRing: string;
};

export type AccentTokens = ThemedAccent & {
  /** The same accent, rebuilt for the dark theme. */
  dark: ThemedAccent;
};

/** Primary button colours: the accent, or a darker one that still carries white text. */
function buildButton(accent: string): { accentStrong: string; onAccent: string } {
  const whiteOk = (hex: string) => contrastRatio(hex, WHITE_HEX) >= MIN_TEXT_CONTRAST;
  if (whiteOk(accent)) return { accentStrong: accent, onAccent: WHITE_HEX };
  const darkened = stepMix(accent, "#000000", MAX_BUTTON_DARKEN, whiteOk);
  return darkened.reached
    ? { accentStrong: darkened.hex, onAccent: WHITE_HEX }
    : { accentStrong: accent, onAccent: DARK_TEXT_HEX };
}

function buildDarkAccent(accent: string): ThemedAccent {
  // Fills (dots, glows, focus ring) need 3:1 against the dark page.
  const fill = stepMix(
    accent,
    WHITE_HEX,
    1,
    (hex) => contrastRatio(hex, DARK.bg) >= MIN_FILL_CONTRAST,
  ).hex;
  const soft = mix(DARK.surface, fill, DARK_SOFT_MIX);
  // Accent coloured text is lightened until it reads on every dark surface it sits on.
  const ink = stepMix(
    accent,
    WHITE_HEX,
    1,
    (hex) =>
      contrastRatio(hex, DARK.bg) >= MIN_TEXT_CONTRAST &&
      contrastRatio(hex, DARK.surface) >= MIN_TEXT_CONTRAST &&
      contrastRatio(hex, soft) >= MIN_TEXT_CONTRAST,
  ).hex;
  const { r, g, b } = hexToRgb(fill);
  return {
    accent: fill,
    accentInk: ink,
    ...buildButton(fill),
    accentSoft: soft,
    accentRing: `rgba(${r}, ${g}, ${b}, 0.38)`,
  };
}

export function buildAccentTokens(input: string): AccentTokens {
  const accent = normalizeHex(input);
  if (!accent) throw new Error(`Invalid hex colour: ${input}`);
  const whiteOk = (hex: string) =>
    contrastRatio(hex, WHITE_HEX) >= MIN_TEXT_CONTRAST;

  // Text colour for anything accent coloured: darken until it passes on white
  // and on the soft tint used behind pills and monogram tiles.
  const accentSoft = mix(WHITE_HEX, accent, 0.1);
  const accentInk = stepMix(
    accent,
    "#000000",
    1,
    (hex) =>
      whiteOk(hex) && contrastRatio(hex, accentSoft) >= MIN_TEXT_CONTRAST,
  ).hex;

  const { accentStrong, onAccent } = buildButton(accent);

  const { r, g, b } = hexToRgb(accent);
  return {
    accent,
    accentInk,
    accentStrong,
    onAccent,
    accentSoft,
    accentRing: `rgba(${r}, ${g}, ${b}, 0.28)`,
    dark: buildDarkAccent(accent),
  };
}

/** Inline style object for the card root. */
export function accentCssVars(input: string): Record<string, string> {
  const t = buildAccentTokens(input);
  // Light and dark values are both set. globals.css picks one with .accent-scope.
  return {
    "--accent-l": t.accent,
    "--accent-ink-l": t.accentInk,
    "--accent-soft-l": t.accentSoft,
    "--accent-ring-l": t.accentRing,
    "--accent-d": t.dark.accent,
    "--accent-ink-d": t.dark.accentInk,
    "--accent-soft-d": t.dark.accentSoft,
    "--accent-ring-d": t.dark.accentRing,
    "--accent-strong-l": t.accentStrong,
    "--on-accent-l": t.onAccent,
    "--accent-strong-d": t.dark.accentStrong,
    "--on-accent-d": t.dark.onAccent,
  };
}

export function nearestPreset(input: string): AccentPreset {
  const target = hexToRgb(input);
  let best = ACCENT_PRESETS[0];
  let bestDist = Infinity;
  for (const preset of ACCENT_PRESETS) {
    const p = hexToRgb(preset.hex);
    const d =
      (p.r - target.r) ** 2 + (p.g - target.g) ** 2 + (p.b - target.b) ** 2;
    if (d < bestDist) {
      bestDist = d;
      best = preset;
    }
  }
  return best;
}

export type AccentCheck =
  | { ok: true; hex: string; tokens: AccentTokens }
  | { ok: false; reason: string; suggestion?: AccentPreset };

export function validateAccent(input: string): AccentCheck {
  const hex = normalizeHex(input);
  if (!hex) {
    return {
      ok: false,
      reason: "That is not a valid colour. Use a hex code such as #F2323F.",
    };
  }
  if (relativeLuminance(hex) > MAX_ACCENT_LUMINANCE) {
    const suggestion = nearestPreset(hex);
    return {
      ok: false,
      reason: `${hex} is too light. Text and buttons made from it would be hard to read on a white card. Try ${suggestion.name} (${suggestion.hex}) or pick a deeper shade.`,
      suggestion,
    };
  }
  return { ok: true, hex, tokens: buildAccentTokens(hex) };
}

/** Neutral palette for places that cannot read CSS variables, such as the OG image. */
export const NEUTRAL = {
  bg: "#FFFFFF",
  text: "#0E0E12",
  text2: "#3F3F46",
  text3: "#6B6B75",
  border: "#E7E7EB",
  grid: "#EEEEF2",
} as const;

/** Dark neutrals, mirrored in the [data-theme="dark"] block of globals.css. */
export const NEUTRAL_DARK = {
  bg: DARK.bg,
  surface: DARK.surface,
  text: "#F4F4F6",
  text2: "#C9C9D1",
  text3: "#9A9AA6",
} as const;
