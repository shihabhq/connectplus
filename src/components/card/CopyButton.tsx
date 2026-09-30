"use client";

import { useEffect, useRef, useState } from "react";
import { Copy } from "@phosphor-icons/react";

/** Selects the text of the element with the given id so the person can copy it by hand. */
function selectText(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const range = document.createRange();
  range.selectNodeContents(el);
  const selection = window.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);
}

export function CopyButton({
  text,
  targetId,
  label,
}: {
  text: string;
  /** Id of the element that shows the value, used by the fallback. */
  targetId: string;
  label: string;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function handleCopy() {
    let ok = false;
    try {
      await navigator.clipboard.writeText(text);
      ok = true;
    } catch {
      selectText(targetId);
      try {
        ok = document.execCommand("copy");
      } catch {
        ok = false;
      }
    }
    if (ok) {
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 1600);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? `${label} copied` : `Copy ${label}`}
      className={`inline-flex h-11 min-w-11 shrink-0 items-center justify-center gap-1.5 rounded-btn px-3 text-[13px] font-semibold transition-colors duration-200 ${
        copied ? "text-success" : "text-text-2 hover:bg-bg-subtle"
      }`}
    >
      {copied ? (
        <span role="status">Copied</span>
      ) : (
        <Copy size={18} weight="bold" aria-hidden />
      )}
    </button>
  );
}
