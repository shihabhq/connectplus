import type { ButtonHTMLAttributes, ReactNode } from "react";

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-label"> & {
  label: string;
  children: ReactNode;
};

/** Icon-only button. `label` is required so it always has an accessible name. */
export function IconButton({ label, className = "", children, ...rest }: Props) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-btn text-text-2 transition-[transform,background-color] duration-200 hover:bg-bg-subtle active:scale-[0.95] disabled:pointer-events-none disabled:opacity-40 ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
