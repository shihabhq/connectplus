import { useId } from "react";
import { CaretDown } from "@phosphor-icons/react";
import { controlClass } from "./Field";

export type Option = { value: string; label: string };

export function Select({
  label,
  value,
  onChange,
  options,
  placeholder,
  invalid,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder: string;
  invalid?: boolean;
  disabled?: boolean;
}) {
  const id = useId();
  return (
    <div className="relative min-w-0 flex-1">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <select
        id={id}
        value={value}
        disabled={disabled}
        aria-invalid={invalid ? true : undefined}
        onChange={(e) => onChange(e.target.value)}
        className={`${controlClass} h-11 appearance-none pr-9 disabled:opacity-50 ${
          invalid ? "border-danger" : ""
        } ${value === "" ? "text-text-3" : ""}`}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <CaretDown
        size={14}
        weight="bold"
        aria-hidden
        className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-text-3"
      />
    </div>
  );
}
