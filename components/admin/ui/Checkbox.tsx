import type { InputHTMLAttributes } from "react";

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: string;
  description?: string;
};

export default function Checkbox({
  label,
  description,
  className = "",
  ...props
}: CheckboxProps) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-slate-300">
      <input
        type="checkbox"
        className={`mt-1 h-4 w-4 shrink-0 rounded border-slate-300 accent-slate-950 ${className}`}
        {...props}
      />

      <span>
        <span className="block text-sm font-bold text-slate-800">
          {label}
        </span>

        {description ? (
          <span className="mt-1 block text-xs leading-5 text-slate-500">
            {description}
          </span>
        ) : null}
      </span>
    </label>
  );
}