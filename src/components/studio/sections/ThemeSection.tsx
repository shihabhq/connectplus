"use client";

import { useState, type CSSProperties } from "react";
import { Check } from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/components/ui/ThemeToggle";
import { controlClass } from "@/components/ui/Field";
import {
  accentCssVars,
  ACCENT_PRESETS,
  buildAccentTokens,
  contrastRatio,
  NEUTRAL,
  NEUTRAL_DARK,
  normalizeHex,
  validateAccent,
} from "@/lib/color";
import { Panel } from "../SectionShell";
import { useStudio } from "../StudioProvider";


export function ThemeSection() {
  const { state, dispatch } = useStudio();
  const accent = state.profile.accent;
  const [draft, setDraft] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  const shown = draft ?? accent;
  const check = validateAccent(shown);
  const complete = normalizeHex(shown) !== null;
  const rejected = draft !== null && !check.ok && (complete || touched);
  const tokens = buildAccentTokens(accent);
  const dark = useTheme() === "dark";
  const page = dark ? NEUTRAL_DARK.bg : NEUTRAL.bg;
  const themed = dark ? tokens.dark : tokens;
  const ink = themed.accentInk;
  const activePreset = ACCENT_PRESETS.find((p) => p.hex.toUpperCase() === accent.toUpperCase());

  function apply(value: string) {
    setDraft(value);
    const result = validateAccent(value);
    if (result.ok) {
      dispatch({ type: "setAccent", hex: result.hex });
      setDraft(null);
      setTouched(false);
    }
  }

  return (
    <>
      <Panel>
        <p className="text-[15px] font-semibold text-text">Accent colour</p>
        <p className="text-[13px] text-text-3">
          Currently {activePreset ? activePreset.name : "a custom colour"} ({accent.toUpperCase()}).
        </p>
        <ul className="mt-4 grid grid-cols-4 gap-3 min-[520px]:grid-cols-6" aria-label="Colour presets">
          {ACCENT_PRESETS.map((preset) => {
            const selected = preset.hex.toUpperCase() === accent.toUpperCase();
            const on = buildAccentTokens(preset.hex).onAccent;
            return (
              <li key={preset.hex} className="flex justify-center">
                <button
                  type="button"
                  aria-label={preset.name}
                  aria-pressed={selected}
                  title={preset.name}
                  onClick={() => {
                    setDraft(null);
                    setTouched(false);
                    dispatch({ type: "setAccent", hex: preset.hex });
                  }}
                  className={`flex h-11 w-11 items-center justify-center rounded-full transition-transform duration-200 hover:scale-105 ${
                    selected ? "ring-2 ring-text ring-offset-2 ring-offset-surface" : ""
                  }`}
                  style={{ background: preset.hex, color: on }}
                >
                  {selected && <Check size={20} weight="bold" aria-hidden />}
                </button>
              </li>
            );
          })}
        </ul>
      </Panel>

      <Panel className="grid gap-3">
        <div>
          <p className="text-[15px] font-semibold text-text">Custom colour</p>
          <p className="text-[13px] text-text-3">
            Use any colour that is not too light. We adjust it so text stays readable.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label className="relative block h-11 w-11 shrink-0 cursor-pointer overflow-hidden rounded-full border border-border-strong">
            <span className="sr-only">Pick a colour</span>
            <input
              type="color"
              value={normalizeHex(shown)?.toLowerCase() ?? accent.toLowerCase()}
              onChange={(e) => apply(e.target.value)}
              className="absolute -inset-2 h-[calc(100%+16px)] w-[calc(100%+16px)] cursor-pointer border-0 p-0"
            />
          </label>
          <div className="min-w-0 flex-1">
            <label htmlFor="hex-input" className="sr-only">
              Hex colour
            </label>
            <input
              id="hex-input"
              value={shown.toUpperCase()}
              spellCheck={false}
              maxLength={7}
              autoCapitalize="characters"
              aria-invalid={rejected ? true : undefined}
              aria-describedby={rejected ? "hex-error" : undefined}
              onChange={(e) => apply(e.target.value)}
              onBlur={() => setTouched(true)}
              className={`${controlClass} tabular h-11 font-mono uppercase ${rejected ? "border-danger" : ""}`}
            />
          </div>
        </div>
        {rejected && !check.ok && (
          <div id="hex-error" role="alert" className="rounded-btn border border-danger bg-surface p-3">
            <p className="text-[13px] leading-relaxed text-danger">{check.reason}</p>
            {check.suggestion && (
              <Button
                variant="secondary"
                className="mt-2"
                onClick={() => {
                  dispatch({ type: "setAccent", hex: check.suggestion!.hex });
                  setDraft(null);
                  setTouched(false);
                }}
              >
                Use {check.suggestion.name}
              </Button>
            )}
          </div>
        )}
      </Panel>

      <Panel className="grid gap-4">
        <p className="text-[15px] font-semibold text-text">Readability check</p>
        <div
          className="accent-scope flex flex-wrap items-center justify-between gap-4 rounded-btn border border-border bg-bg p-4"
          style={accentCssVars(accent) as CSSProperties}
        >
          <div>
            <p className="text-2xl font-bold tracking-[-0.02em] text-accent-ink">
              {state.profile.name || "Your name"}
            </p>
            <span className="mt-1 inline-block rounded-chip bg-accent-soft px-2 py-0.5 text-[11px] font-semibold text-accent-ink">
              Current
            </span>
          </div>
          <span className="inline-flex h-[52px] items-center rounded-btn bg-accent-strong px-6 text-[15px] font-semibold text-on-accent">
            Call
          </span>
        </div>
        <dl className="tabular grid gap-1.5 text-[13px] text-text-2">
          <div className="flex justify-between gap-4">
            <dt>{dark ? "Name and links on dark" : "Name and links on white"}</dt>
            <dd className="font-semibold text-text">
              {contrastRatio(ink, page).toFixed(1)}:1
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt>Text on the main button</dt>
            <dd className="font-semibold text-text">
              {contrastRatio(themed.accentStrong, themed.onAccent).toFixed(1)}:1
            </dd>
          </div>
        </dl>
        <p className="text-[13px] text-text-3">
          Anything at 4.5:1 or higher is easy to read. Yours passes both checks.
        </p>
      </Panel>
    </>
  );
}
