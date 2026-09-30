import { describe, expect, it } from "vitest";
import {
  ACCENT_PRESETS,
  buildAccentTokens,
  contrastRatio,
  DARK,
  NEUTRAL_DARK,
  mix,
  nearestPreset,
  normalizeHex,
  relativeLuminance,
  validateAccent,
} from "./color";

describe("luminance and contrast", () => {
  it("matches the WCAG reference values", () => {
    expect(relativeLuminance("#FFFFFF")).toBeCloseTo(1, 5);
    expect(relativeLuminance("#000000")).toBeCloseTo(0, 5);
    expect(contrastRatio("#FFFFFF", "#000000")).toBeCloseTo(21, 5);
    expect(contrastRatio("#000000", "#FFFFFF")).toBeCloseTo(21, 5);
    expect(contrastRatio("#777777", "#FFFFFF")).toBeCloseTo(4.48, 2);
  });

  it("keeps the neutral text token above 4.5:1 on white", () => {
    expect(contrastRatio("#6B6B75", "#FFFFFF")).toBeGreaterThanOrEqual(4.5);
  });
});

describe("normalizeHex and mix", () => {
  it("normalises short, long and unhashed hex", () => {
    expect(normalizeHex("#abc")).toBe("#AABBCC");
    expect(normalizeHex("f2323f")).toBe("#F2323F");
    expect(normalizeHex(" #F2323F ")).toBe("#F2323F");
    expect(normalizeHex("nope")).toBeNull();
    expect(normalizeHex("#12345")).toBeNull();
  });

  it("mixes deterministically", () => {
    expect(mix("#000000", "#FFFFFF", 0)).toBe("#000000");
    expect(mix("#000000", "#FFFFFF", 1)).toBe("#FFFFFF");
    expect(mix("#000000", "#FFFFFF", 0.5)).toBe("#808080");
  });
});

describe("buildAccentTokens", () => {
  it("keeps the accent as-is when white text already passes", () => {
    const t = buildAccentTokens("#2563EB");
    expect(t.accentStrong).toBe("#2563EB");
    expect(t.onAccent).toBe("#FFFFFF");
  });

  it("darkens the button fill for CorpoMerch Red", () => {
    const t = buildAccentTokens("#F2323F");
    expect(t.accent).toBe("#F2323F");
    expect(t.accentStrong).not.toBe("#F2323F");
    expect(t.onAccent).toBe("#FFFFFF");
    expect(contrastRatio(t.accentStrong, "#FFFFFF")).toBeGreaterThanOrEqual(4.5);
  });

  it("switches to dark text for amber", () => {
    const t = buildAccentTokens("#F59E0B");
    expect(t.onAccent).toBe("#0E0E12");
    expect(t.accentStrong).toBe("#F59E0B");
  });

  it("builds the soft and ring tokens", () => {
    const t = buildAccentTokens("#000000");
    expect(t.accentSoft).toBe("#E6E6E6");
    expect(t.accentRing).toBe("rgba(0, 0, 0, 0.28)");
  });

  it("never darkens the button by more than 25%", () => {
    const t = buildAccentTokens("#F97316");
    const floor = mix("#F97316", "#000000", 0.25);
    expect(contrastRatio(t.accentStrong, "#FFFFFF")).toBeGreaterThanOrEqual(
      Math.min(4.5, contrastRatio(floor, "#FFFFFF")),
    );
  });

  it("is deterministic", () => {
    expect(buildAccentTokens("#0EA5E9")).toEqual(buildAccentTokens("#0ea5e9"));
  });
});

describe.each(ACCENT_PRESETS)("preset $name ($hex)", ({ hex }) => {
  const t = buildAccentTokens(hex);

  it("has accent-ink of at least 4.5:1 on white", () => {
    expect(contrastRatio(t.accentInk, "#FFFFFF")).toBeGreaterThanOrEqual(4.5);
  });

  it("has a primary button with text contrast of at least 4.5:1", () => {
    expect(contrastRatio(t.accentStrong, t.onAccent)).toBeGreaterThanOrEqual(
      4.5,
    );
  });

  it("has ink readable on the soft background", () => {
    expect(contrastRatio(t.accentInk, t.accentSoft)).toBeGreaterThanOrEqual(
      4.5,
    );
  });

  it("passes validation", () => {
    expect(validateAccent(hex).ok).toBe(true);
  });
});

describe("validateAccent", () => {
  it("rejects invalid input", () => {
    expect(validateAccent("blue").ok).toBe(false);
  });

  it("rejects pale colours and suggests a preset", () => {
    const r = validateAccent("#FFF59D");
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.suggestion?.name).toBeDefined();
      expect(r.reason).toContain("too light");
    }
  });

  it("finds the nearest preset", () => {
    expect(nearestPreset("#F0303C").hex).toBe("#F2323F");
  });
});

describe.each(ACCENT_PRESETS)("dark theme, preset $name ($hex)", ({ hex }) => {
  const { dark } = buildAccentTokens(hex);

  it("has ink readable on the dark page, surface and soft tint", () => {
    for (const bg of [DARK.bg, DARK.surface, dark.accentSoft]) {
      expect(contrastRatio(dark.accentInk, bg)).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("has a fill visible on the dark page", () => {
    expect(contrastRatio(dark.accent, DARK.bg)).toBeGreaterThanOrEqual(3);
  });
});

describe("dark neutrals", () => {
  it("keep every text token above 4.5:1 on the dark page and surface", () => {
    for (const fg of [NEUTRAL_DARK.text, NEUTRAL_DARK.text2, NEUTRAL_DARK.text3]) {
      expect(contrastRatio(fg, NEUTRAL_DARK.bg)).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(fg, NEUTRAL_DARK.surface)).toBeGreaterThanOrEqual(4.5);
    }
  });
});

describe.each(ACCENT_PRESETS)("dark buttons, preset $name ($hex)", ({ hex }) => {
  const { dark } = buildAccentTokens(hex);

  it("has button text contrast of at least 4.5:1", () => {
    expect(contrastRatio(dark.accentStrong, dark.onAccent)).toBeGreaterThanOrEqual(4.5);
  });

  it("stands out from the dark page", () => {
    expect(contrastRatio(dark.accentStrong, DARK.bg)).toBeGreaterThanOrEqual(2);
  });
});
