import Link from "next/link";
import { Package, Plus, Search } from "lucide-react";
import prisma from "@/lib/prisma";
import Badge from "@/components/admin/ui/Badge";
import PageHeader from "@/components/admin/ui/PageHeader";

export const dynamic = "force-dynamic";

function obtenerEstado(
  estado: string,
): "default" | "success" | "warning" | "danger" | "info" {
  switch (estado) {
    case "PUBLICADO":
      return "success";

    case "BORRADOR":
      return "warning";

    case "AGOTADO":
      return "danger";

    case "OCULTO":
      return "info";

    default:
      return "default";
  }
}

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
      <PageHeader
        eyebrow="Catálogo"
        title="Productos"
        description={`${productos.length} producto${
          productos.length === 1 ? "" : "s"
        } registrado${productos.length === 1 ? "" : "s"} en la tienda.`}
        actions={
          <Link
            href="/admin/productos/nuevo"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-slate-800"
          >
            <Plus size={18} />
            Nuevo producto
          </Link>
        }
      />

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-200 p-5 md:flex-row md:items-center">
          <div className="relative w-full max-w-md">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="search"
              placeholder="Buscar por nombre, SKU o categoría..."
              className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-slate-500 focus:ring-4 focus:ring-slate-100"
            />
          </div>

          <select className="h-11 rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 outline-none">
            <option value="">Todos los estados</option>
            <option value="PUBLICADO">Publicados</option>
            <option value="BORRADOR">Borradores</option>
            <option value="OCULTO">Ocultos</option>
            <option value="AGOTADO">Agotados</option>
          </select>
        </div>

        {productos.length === 0 ? (
          <div className="flex min-h-96 flex-col items-center justify-center p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
              <Package size={30} />
            </div>

            <h2 className="mt-5 text-xl font-black text-slate-950">
              Todavía no tienes productos
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
              Crea tu primer producto desde el panel. Al publicarlo aparecerá
              automáticamente en la tienda.
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
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[900px]">
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
  {productos.map((producto) => {
    const hrefEditar = `/admin/productos/${producto.id}/editar`;

    return (
      <tr
        key={producto.id}
        className="cursor-pointer transition hover:bg-slate-50"
      >
        <td className="p-0">
          <Link
            href={hrefEditar}
            className="block px-6 py-4"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                {producto.imagenes[0]?.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={producto.imagenes[0].url}
                    alt={producto.nombre}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Package
                    size={22}
                    className="text-slate-400"
                  />
                )}
              </div>

              <div>
                <p className="font-bold text-slate-950">
                  {producto.nombre}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  /producto/{producto.slug}
                </p>

                {producto.sku && (
                  <p className="mt-1 text-xs text-slate-400">
                    SKU: {producto.sku}
                  </p>
                )}
              </div>
            </div>
          </Link>
        </td>

        <td className="p-0">
          <Link
            href={hrefEditar}
            className="block px-6 py-4 text-sm text-slate-600"
          >
            {producto.categoria?.nombre ??
              "Sin categoría"}
          </Link>
        </td>

        <td className="p-0">
          <Link
            href={hrefEditar}
            className="block px-6 py-4 text-sm text-slate-600"
          >
            {producto.marca?.nombre ??
              "Sin marca"}
          </Link>
        </td>

        <td className="p-0">
          <Link
            href={hrefEditar}
            className="block px-6 py-4 font-bold text-slate-950"
          >
            S/ {Number(producto.precio).toFixed(2)}
          </Link>
        </td>

        <td className="p-0">
          <Link
            href={hrefEditar}
            className="block px-6 py-4 text-sm font-semibold"
          >
            {producto.stock}
          </Link>
        </td>

        <td className="p-0">
          <Link
            href={hrefEditar}
            className="block px-6 py-4"
          >
            <Badge
              variant={obtenerEstado(
                producto.estado,
              )}
            >
              {producto.estado}
            </Badge>
          </Link>
        </td>

        <td className="p-0 text-right">
          <Link
            href={hrefEditar}
            className="block px-6 py-4 text-sm font-bold text-slate-950"
          >
            Editar
          </Link>
        </td>
      </tr>
    );
  })}
</tbody>
            </table>
          </div>
        )}

        {productos.length > 0 && (
          <div className="divide-y divide-slate-200 md:hidden">
            {productos.map((producto) => (
              <Link
                key={producto.id}
                href={`/admin/productos/${producto.id}/editar`}
                className="block p-4 transition active:bg-slate-50"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                    {producto.imagenes[0]?.url ? (
                      <img
                        src={producto.imagenes[0].url}
                        alt={producto.nombre}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Package size={22} className="text-slate-400" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex min-w-0 items-start justify-between gap-2">
                      <p className="min-w-0 flex-1 text-sm font-black leading-5 text-slate-950">
                        {producto.nombre}
                      </p>

                      <Badge variant={obtenerEstado(producto.estado)}>
                        {producto.estado}
                      </Badge>
                    </div>

                    <p className="mt-1 truncate text-[11px] text-slate-400">
                      /producto/{producto.slug}
                    </p>

                    <p className="mt-2 text-xs text-slate-500">
                      {producto.categoria?.nombre ?? "Sin categoría"} · {producto.marca?.nombre ?? "Sin marca"}
                    </p>

                    <div className="mt-3 flex items-center justify-between gap-3">
                      <p className="text-base font-black text-slate-950">
                        S/ {Number(producto.precio).toFixed(2)}
                      </p>

                      <p className="text-xs font-semibold text-slate-500">
                        Stock: {producto.stock}
                      </p>
                    </div>

                    <p className="mt-2 text-xs font-bold text-slate-900">
                      Editar producto →
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}