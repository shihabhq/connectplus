"use client";

import { STUDIO_SECTIONS, type StudioSectionId } from "./sections";

export function SectionNav({
  active,
  onSelect,
  variant,
}: {
  active: StudioSectionId;
  onSelect: (id: StudioSectionId) => void;
  variant: "list" | "pills";
}) {
  return (
    <nav aria-label="Card sections">
      <ul
        className={
          variant === "list" ? "flex flex-col gap-1" : "flex flex-wrap gap-2"
        }
      >
        {STUDIO_SECTIONS.map(({ id, label, icon: IconCmp }) => {
          const selected = id === active;
          return (
            <li key={id}>
              <button
                type="button"
                aria-current={selected ? "page" : undefined}
                onClick={() => onSelect(id)}
                className={
                  variant === "list"
                    ? `flex min-h-11 w-full items-center gap-3 rounded-btn px-3 text-left text-[15px] font-medium transition-colors duration-200 ${
                        selected
                          ? "bg-surface text-text shadow-sm ring-1 ring-border"
                          : "text-text-2 hover:bg-surface/70"
                      }`
                    : `inline-flex min-h-11 items-center gap-2 rounded-chip border px-4 text-sm font-medium transition-colors duration-200 ${
                        selected
                          ? "border-text bg-text text-bg"
                          : "border-border-strong bg-surface text-text-2 hover:bg-bg-subtle"
                      }`
                }
              >
                <IconCmp
                  size={variant === "list" ? 20 : 16}
                  weight={selected ? "fill" : "regular"}
                  aria-hidden
                  className={variant === "list" && selected ? "text-accent" : ""}
                />
                {label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
