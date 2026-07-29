import type { ReactNode } from "react";

type BenefitProps = {
  icon: ReactNode;
  title: string;
  text: string;
};

export default function Benefit({ icon, title, text }: BenefitProps) {
  return (
    <div className="flex items-center gap-4 border-b border-zinc-200 p-6 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-yellow-400 text-black">
        {icon}
      </div>

      <div>
        <h3 className="font-black">{title}</h3>
        <p className="mt-1 text-sm text-zinc-500">{text}</p>
      </div>
    </div>
  );
}
