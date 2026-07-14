import Link from "next/link";
import { Package, Plus, Search } from "lucide-react";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ProductosPage() {
  const productos = await prisma.producto.findMany({
    include: {
      categoria: true,
      marca: true,
      imagenes: {
        where: {
          esPrincipal: true,
        },
        take: 1,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <section>
      <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-center">
        <div>
          <p className="mb-2 text-sm font-semibold text-slate-500">
            Catálogo
          </p>

          <h1 className="text-3xl font-black tracking-tight">
            Productos
          </h1>

          <p className="mt-2 text-slate-600">
            Administra todos los productos de tu tienda.
          </p>
        </div>

        <Link
          href="/admin/productos/nuevo"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 font-bold text-white transition hover:bg-slate-800"
        >
          <Plus size={19} />
          Nuevo producto
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5">
          <div className="relative max-w-md">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="search"
              placeholder="Buscar productos..."
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
            />
          </div>
        </div>

        {productos.length === 0 ? (
          <div className="flex min-h-96 flex-col items-center justify-center p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
              <Package size={30} />
            </div>

            <h2 className="mt-5 text-xl font-black">
              Todavía no tienes productos
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
              Crea tu primer producto desde el panel. Cuando lo publiques,
              aparecerá automáticamente en tu tienda.
            </p>

            <Link
              href="/admin/productos/nuevo"
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-bold text-white"
            >
              <Plus size={18} />
              Crear primer producto
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px]">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-4">Producto</th>
                  <th className="px-6 py-4">Categoría</th>
                  <th className="px-6 py-4">Marca</th>
                  <th className="px-6 py-4">Precio</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {productos.map((producto) => (
                  <tr key={producto.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-slate-950">
                          {producto.nombre}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          /producto/{producto.slug}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {producto.categoria?.nombre ?? "Sin categoría"}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {producto.marca?.nombre ?? "Sin marca"}
                    </td>

                    <td className="px-6 py-4 font-bold">
                      S/ {Number(producto.precio).toFixed(2)}
                    </td>

                    <td className="px-6 py-4 text-sm">
                      {producto.stock}
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold">
                        {producto.estado}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/productos/${producto.id}/editar`}
                        className="text-sm font-bold text-slate-950 hover:underline"
                      >
                        Editar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}