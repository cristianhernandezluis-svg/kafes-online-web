import type { TextareaHTMLAttributes } from "react";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  description?: string;
};

export default function Textarea({
  label,
  description,
  id,
  name,
  className = "",
  required,
  ...props
}: TextareaProps) {
  const textareaId = id ?? name;

  return (
    <div>
      <label
        htmlFor={textareaId}
        className="mb-2 block text-sm font-bold text-slate-800"
      >
        {label}

        {required && <span className="ml-1 text-red-600">*</span>}
      </label>

      <textarea
        id={textareaId}
        name={name}
        required={required}
        className={[
          "min-h-32 w-full resize-y rounded-xl border border-slate-300",
          "bg-white px-4 py-3 text-sm text-slate-950 outline-none transition",
          "placeholder:text-slate-400 focus:border-slate-500 focus:ring-4",
          "focus:ring-slate-100",
          className,
        ].join(" ")}
        {...props}
      />

      {description && (
        <p className="mt-2 text-xs leading-5 text-slate-500">
          {description}
        </p>
      )}
    </div>
  );
}