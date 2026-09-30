export function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className="group inline-flex h-11 shrink-0 items-center"
    >
      <span
        className={`relative h-6 w-11 rounded-full transition-colors duration-200 ${
          checked ? "bg-accent-strong" : "bg-border-strong"
        }`}
      >
        <span
          className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-surface shadow-sm transition-transform duration-200 ${
            checked ? "translate-x-5" : ""
          }`}
        />
      </span>
    </button>
  );
}
