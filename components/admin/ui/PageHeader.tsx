import type { ReactNode } from "react";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
};

export default function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: PageHeaderProps) {
  return (
    <header className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-center">
      <div>
        {eyebrow && (
          <p className="mb-2 text-sm font-semibold text-slate-500">
            {eyebrow}
          </p>
        )}

        <h1 className="text-3xl font-black tracking-tight text-slate-950">
          {title}
        </h1>

        {description && (
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {description}
          </p>
        )}
      </div>

      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </header>
  );
}