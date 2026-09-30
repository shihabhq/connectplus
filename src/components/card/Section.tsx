import type { CSSProperties, ReactNode } from "react";
import type { Icon } from "@phosphor-icons/react";

type Props = {
  id: string;
  label: string;
  icon: Icon;
  index: number;
  children: ReactNode;
};

export function Section({ id, label, icon: IconCmp, index, children }: Props) {
  return (
    <section
      aria-labelledby={`${id}-label`}
      className="rise"
      style={{ "--i": index } as CSSProperties}
    >
      <div className="mb-3.5 flex items-center gap-2.5">
        <IconCmp
          size={17}
          weight="fill"
          aria-hidden
          className="shrink-0 text-accent drop-shadow-[0_0_6px_var(--accent-ring)]"
        />
        <h2
          id={`${id}-label`}
          className="text-xs font-semibold uppercase tracking-[0.12em] text-text-3"
        >
          {label}
        </h2>
        <span
          aria-hidden
          className="h-px flex-1 bg-linear-to-r from-border-strong to-transparent"
        />
      </div>
      {children}
    </section>
  );
}
