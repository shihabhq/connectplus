import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-accent-strong text-on-accent hover:brightness-95",
  secondary:
    "border border-border-strong bg-surface text-text shadow-sm hover:bg-bg-subtle",
  ghost: "text-text-2 hover:bg-bg-subtle",
  danger: "bg-danger text-bg hover:brightness-95",
};

export function buttonClass(variant: Variant = "secondary", extra = "") {
  return `inline-flex h-11 items-center justify-center gap-2 rounded-btn px-4 text-sm font-semibold transition-[transform,background-color,filter] duration-200 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 ${VARIANTS[variant]} ${extra}`;
}

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  icon?: ReactNode;
};

export function Button({ variant = "secondary", icon, className = "", children, ...rest }: Props) {
  return (
    <button type="button" className={buttonClass(variant, className)} {...rest}>
      {icon}
      {children}
    </button>
  );
}
