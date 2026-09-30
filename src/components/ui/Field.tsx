import { useId, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from "react";

export const controlClass =
  "w-full rounded-btn border border-border-strong bg-surface px-3.5 text-[15px] text-text shadow-sm placeholder:text-text-3 transition-[border-color,box-shadow] duration-200 hover:border-text-3 focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent-ring";

type FieldShellProps = {
  id: string;
  label: string;
  help?: string;
  error?: string;
  aside?: ReactNode;
  children: ReactNode;
};

export function FieldShell({ id, label, help, error, aside, children }: FieldShellProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-[13px] font-semibold text-text">
          {label}
        </label>
        {aside}
      </div>
      {children}
      {error ? (
        <p id={`${id}-msg`} role="alert" className="text-[13px] text-danger">
          {error}
        </p>
      ) : help ? (
        <p id={`${id}-msg`} className="text-[13px] text-text-3">
          {help}
        </p>
      ) : null}
    </div>
  );
}

type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "id"> & {
  label: string;
  value: string;
  onChange: (value: string) => void;
  help?: string;
  error?: string;
};

export function TextField({ label, value, onChange, help, error, className = "", ...rest }: TextFieldProps) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} help={help} error={error}>
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error || help ? `${id}-msg` : undefined}
        className={`${controlClass} h-11 ${error ? "border-danger" : ""} ${className}`}
        {...rest}
      />
    </FieldShell>
  );
}

type TextAreaProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange" | "id"> & {
  label: string;
  value: string;
  onChange: (value: string) => void;
  help?: string;
  error?: string;
  aside?: ReactNode;
};

export function TextAreaField({ label, value, onChange, help, error, aside, className = "", ...rest }: TextAreaProps) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} help={help} error={error} aside={aside}>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-describedby={error || help ? `${id}-msg` : undefined}
        className={`${controlClass} py-3 leading-relaxed ${className}`}
        {...rest}
      />
    </FieldShell>
  );
}
