import type { ReactNode } from "react";

type CardProps = {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export default function Card({
  title,
  description,
  children,
  className = "",
}: CardProps) {
  return (
    <section
      className={[
        "overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm",
        className,
      ].join(" ")}
    >
      {(title || description) && (
        <div className="border-b border-slate-200 px-6 py-5">
          {title && (
            <h2 className="text-base font-black text-slate-950">{title}</h2>
          )}

          {description && (
            <p className="mt-1 text-sm leading-6 text-slate-500">
              {description}
            </p>
          )}
        </div>
      )}

      <div className="p-6">{children}</div>
    </section>
  );
}