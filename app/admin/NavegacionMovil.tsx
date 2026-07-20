"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Menu,
} from "lucide-react";

const items = [
  {
    nombre: "Inicio",
    href: "/admin",
    icono: LayoutDashboard,
  },
  {
    nombre: "Productos",
    href: "/admin/productos",
    icono: Package,
  },
  {
    nombre: "Pedidos",
    href: "/admin/pedidos",
    icono: ShoppingCart,
  },
  {
    nombre: "Clientes",
    href: "/admin/clientes",
    icono: Users,
  },
  {
    nombre: "Más",
    href: "/admin/configuracion",
    icono: Menu,
  },
];

export default function NavegacionMovil() {
  const pathname = usePathname();

  function estaActivo(href: string) {
    if (href === "/admin") {
      return pathname === "/admin";
    }

    return pathname.startsWith(href);
  }

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 px-2 pb-[max(8px,env(safe-area-inset-bottom))] pt-2 shadow-[0_-8px_30px_rgba(15,23,42,0.08)] backdrop-blur lg:hidden">
      <div className="mx-auto grid max-w-lg grid-cols-5">
        {items.map((item) => {
          const Icono = item.icono;
          const activo = estaActivo(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl px-1 text-[11px] font-semibold transition ${
                activo
                  ? "bg-slate-950 text-white"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-950"
              }`}
            >
              <Icono size={20} strokeWidth={activo ? 2.5 : 2} />
              <span>{item.nombre}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}