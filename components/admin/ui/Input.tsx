import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  description?: string;
};

export default function Input({
  label,
  error,
  description,
  id,
  className = "",
  required,
  ...props
}: InputProps) {
  const inputId = id ?? props.name;

  return (
    <div>
      <label
        htmlFor={inputId}
        className="mb-2 block text-sm font-bold text-slate-800"
      >
        {label}

        {required && <span className="ml-1 text-red-600">*</span>}
      </label>

      <input
        id={inputId}
        required={required}
        className={[
          "h-11 w-full rounded-xl border bg-white px-4 text-sm text-slate-950",
          "outline-none transition placeholder:text-slate-400",
          "focus:ring-4",
          error
            ? "border-red-400 focus:border-red-500 focus:ring-red-100"
            : "border-slate-300 focus:border-slate-500 focus:ring-slate-100",
          className,
        ].join(" ")}
        {...props}
      />

      {description && !error && (
        <p className="mt-2 text-xs leading-5 text-slate-500">
          {description}
        </p>
      )}

      {error && (
        <p className="mt-2 text-xs font-semibold text-red-600">{error}</p>
      )}
    </div>
  );
}