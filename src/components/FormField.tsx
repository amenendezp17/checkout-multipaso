import type { InputHTMLAttributes } from "react";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  registration: object;
}

export function FormField({ label, error, registration, ...rest }: FormFieldProps) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <input
        {...registration}
        {...rest}
        aria-invalid={!!error}
        className={`rounded-xl border px-3.5 py-2.5 text-foreground outline-none transition placeholder:text-foreground/30 focus:ring-2 ${
          error
            ? "border-danger bg-danger/5 focus:border-danger focus:ring-danger/30"
            : "border-border bg-surface focus:border-brand focus:ring-brand/30"
        }`}
      />
      {error && <span className="text-xs font-medium text-danger">{error}</span>}
    </label>
  );
}
