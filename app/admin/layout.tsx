import Link from "next/link";
import { requerirAdmin } from "@/lib/auth";
import type { ReactNode } from "react";
import { cerrarSesion } from "@/app/login/actions";
import {
  BarChart3,
  Boxes,
  ImageIcon,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingCart,
  Tags,
  Users,
} from "lucide-react";

const menu = [
  {
    nombre: "Dashboard",
    href: "/admin",
    icono: LayoutDashboard,
  },
  {
    nombre: "Productos",
    href: "/admin/productos",
    icono: Package,
  },
  {
    nombre: "Categorías",
    href: "/admin/categorias",
    icono: Boxes,
  },
  {
    nombre: "Marcas",
    href: "/admin/marcas",
    icono: Tags,
  },
  {
    nombre: "Banners",
    href: "/admin/banners",
    icono: ImageIcon,
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
    nombre: "Ventas",
    href: "/admin/ventas",
    icono: BarChart3,
  },
  {
    nombre: "Configuración",
    href: "/admin/configuracion",
    icono: Settings,
  },
];

export default async function AdminLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  await requerirAdmin();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-slate-200 bg-white lg:block">
        <div className="flex h-20 items-center border-b border-slate-200 px-6">
          <div>
            <p className="text-xl font-black tracking-tight">
              KAFES ONLINE
            </p>

            <p className="text-xs font-medium text-slate-500">
              Administrador de tienda
            </p>
          </div>
        </div>

        <nav className="space-y-1 p-4">
          {menu.map((item) => {
            const Icono = item.icono;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
              >
                <Icono size={19} />
                {item.nombre}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-5 lg:px-8">
          <div>
            <p className="text-sm font-semibold text-slate-500">
              Panel administrativo
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-sm font-bold text-white">
              K
            </div>

            <form action={cerrarSesion}>
              <button
                type="submit"
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
              >
                Cerrar sesión
              </button>
            </form>
          </div>
        </header>

        <main className="p-5 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}