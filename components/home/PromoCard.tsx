import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";

type PromoCardProps = {
  icon: ReactNode;
  title: string;
  text: string;
  href: string;
  background: string;
};

export default function PromoCard({
  icon,
  title,
  text,
  href,
  background,
}: PromoCardProps) {
  return (
    <a
      href={href}
      className={`${background} group relative min-h-[210px] overflow-hidden rounded-3xl p-7 text-white shadow-lg transition duration-300 hover:-translate-y-1`}
    >
      <div className="absolute -bottom-16 -right-16 h-44 w-44 rounded-full bg-white/10 transition duration-300 group-hover:scale-125" />

      <div className="relative z-10">
        {icon}
        <h3 className="mt-6 text-3xl font-black">{title}</h3>
        <p className="mt-2 max-w-xs text-sm text-white/80">{text}</p>

        <span className="mt-5 inline-flex items-center gap-1 font-black">
          Ver productos
          <ChevronRight size={18} />
        </span>
      </div>
    </a>
  );
}
