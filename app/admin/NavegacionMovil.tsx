"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BarChart3,
  Boxes,
  ImageIcon,
  LayoutDashboard,
  Menu,
  MessageSquareText,
  Package,
  Settings,
  ShoppingCart,
  ShoppingBasket,
  Tags,
  Users,
  X,
} from "lucide-react";

const navegacionPrincipal = [
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
];

const opcionesAdicionales = [
  {
    nombre: "Carritos abandonados",
    descripcion: "Recupera ventas pendientes",
    href: "/admin/carritos-abandonados",
    icono: ShoppingBasket,
  },
  {
    nombre: "Categorías",
    descripcion: "Organiza los productos",
    href: "/admin/categorias",
    icono: Boxes,
  },
  {
    nombre: "Marcas",
    descripcion: "Administra las marcas",
    href: "/admin/marcas",
    icono: Tags,
  },
{
  nombre: "Opiniones",
  descripcion: "Testimonios de clientes",
  href: "/admin/opiniones",
  icono: MessageSquareText,
},
  {
    nombre: "Banners",
    descripcion: "Imágenes de la tienda",
    href: "/admin/banners",
    icono: ImageIcon,
  },
  {
    nombre: "Ventas",
    descripcion: "Revisa ingresos y resultados",
    href: "/admin/ventas",
    icono: BarChart3,
  },
  {
    nombre: "Configuración",
    descripcion: "Ajustes generales",
    href: "/admin/configuracion",
    icono: Settings,
  },
];

export default function NavegacionMovil() {
  const pathname = usePathname();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [anchoViewport, setAnchoViewport] = useState<number | null>(null);

  useEffect(() => {
    const actualizarAncho = () => {
      setAnchoViewport(document.documentElement.clientWidth);
    };

    actualizarAncho();
    window.addEventListener("resize", actualizarAncho);
    window.visualViewport?.addEventListener("resize", actualizarAncho);

    return () => {
      window.removeEventListener("resize", actualizarAncho);
      window.visualViewport?.removeEventListener("resize", actualizarAncho);
    };
  }, []);

  function estaActivo(href: string) {
    if (href === "/admin") {
      return pathname === "/admin";
    }

    return pathname.startsWith(href);
  }

  const opcionAdicionalActiva = opcionesAdicionales.some(
    (item) => pathname.startsWith(item.href),
  );

  return (
    <>
      {menuAbierto && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            aria-label="Cerrar menú"
            onClick={() => setMenuAbierto(false)}
            className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
          />

          <div className="absolute inset-x-0 bottom-0 rounded-t-3xl bg-white px-5 pb-[max(24px,env(safe-area-inset-bottom))] pt-4 shadow-2xl">
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-slate-300" />

            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-950">
                  Más opciones
                </h2>

                <p className="text-sm text-slate-500">
                  Administración de KAFES ONLINE
                </p>
              </div>

              <button
                type="button"
                onClick={() => setMenuAbierto(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-2">
              {opcionesAdicionales.map((item) => {
                const Icono = item.icono;
                const activo = estaActivo(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuAbierto(false)}
                    className={`flex items-center gap-4 rounded-2xl border p-4 transition ${
                      activo
                        ? "border-slate-950 bg-slate-950 text-white"
                        : "border-slate-200 bg-white text-slate-900 active:bg-slate-100"
                    }`}
                  >
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                        activo
                          ? "bg-white/15 text-white"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      <Icono size={21} />
                    </div>

                    <div className="min-w-0">
                      <p className="font-bold">
                        {item.nombre}
                      </p>

                      <p
                        className={`text-xs ${
                          activo
                            ? "text-slate-300"
                            : "text-slate-500"
                        }`}
                      >
                        {item.descripcion}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <nav
        style={anchoViewport ? { width: anchoViewport } : undefined}
        className="fixed bottom-0 left-0 z-50 overflow-hidden border-t border-slate-200 bg-white/95 px-2 pb-[max(8px,env(safe-area-inset-bottom))] pt-2 shadow-[0_-8px_30px_rgba(15,23,42,0.08)] backdrop-blur lg:hidden"
      >
        <div className="grid w-full grid-cols-5">
          {navegacionPrincipal.map((item) => {
            const Icono = item.icono;
            const activo = estaActivo(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl px-1 text-[11px] font-semibold transition ${
                  activo
                    ? "bg-slate-950 text-white"
                    : "text-slate-500 active:bg-slate-100"
                }`}
              >
                <Icono
                  size={20}
                  strokeWidth={activo ? 2.5 : 2}
                />

                <span>{item.nombre}</span>
              </Link>
            );
          })}

          <button
            type="button"
            onClick={() => setMenuAbierto(true)}
            className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl px-1 text-[11px] font-semibold transition ${
              menuAbierto || opcionAdicionalActiva
                ? "bg-slate-950 text-white"
                : "text-slate-500 active:bg-slate-100"
            }`}
          >
            <Menu
              size={20}
              strokeWidth={
                menuAbierto || opcionAdicionalActiva
                  ? 2.5
                  : 2
              }
            />

            <span>Más</span>
          </button>
        </div>
      </nav>
    </>
  );
}