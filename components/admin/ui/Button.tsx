import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
  loading?: boolean;
};

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-slate-950 text-white hover:bg-slate-800 focus:ring-slate-300",
  secondary:
    "border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 focus:ring-slate-200",
  danger:
    "bg-red-600 text-white hover:bg-red-700 focus:ring-red-200",
  ghost:
    "bg-transparent text-slate-700 hover:bg-slate-100 focus:ring-slate-200",
};

export default function Button({
  children,
  variant = "primary",
  loading = false,
  disabled,
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={[
        "inline-flex h-11 items-center justify-center gap-2 rounded-xl px-5",
        "text-sm font-bold transition",
        "focus:outline-none focus:ring-4",
        "disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        className,
      ].join(" ")}
      {...props}
    >
      {loading ? "Procesando..." : children}
    </button>
  );
}