"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "@phosphor-icons/react";

export type Theme = "light" | "dark";

export const THEME_KEY = "corpomerch-theme";

/** Runs before first paint (see layout.tsx) so the page never flashes the wrong theme. */
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem("${THEME_KEY}");if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.dataset.theme=t}catch(e){}})()`;

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

function getTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

/** The theme currently applied to the page. Server renders "light". */
export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, getTheme, () => "light");
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  const theme = useTheme();
  const next: Theme = theme === "dark" ? "light" : "dark";

  function toggle() {
    document.documentElement.dataset.theme = next;
    try {
      window.localStorage.setItem(THEME_KEY, next);
    } catch {
      // Storage can be blocked. The choice still applies until the page closes.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
      className={`inline-flex h-11 w-11 items-center justify-center rounded-full border border-border-strong bg-surface text-text shadow-sm transition-[transform,background-color] duration-200 hover:bg-bg-subtle active:scale-[0.94] ${className}`}
    >
      {theme === "dark" ? (
        <Sun size={20} weight="fill" aria-hidden />
      ) : (
        <Moon size={20} weight="fill" aria-hidden />
      )}
    </button>
  );
}
