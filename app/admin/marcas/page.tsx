import Link from "next/link";
import {
  Eye,
  EyeOff,
  Pencil,
  Plus,
  Tags,
} from "lucide-react";

import prisma from "@/lib/prisma";
import PageHeader from "@/components/admin/ui/PageHeader";

import { cambiarEstadoMarca } from "./actions";

export const dynamic = "force-dynamic";

export default async function MarcasPage() {
  const marcas = await prisma.marca.findMany({
    select: {
      id: true,
      nombre: true,
      slug: true,
      descripcion: true,
      logoUrl: true,
      activa: true,
      _count: {
        select: {
          productos: true,
        },
      },
    },
    orderBy: {
      nombre: "asc",
    },
  });

  const marcasActivas = marcas.filter(
    (marca) => marca.activa
  ).length;

  return (
    <section>
      <PageHeader
        eyebrow="Catálogo"
        title="Marcas"
        description={`${marcas.length} marca${
          marcas.length === 1 ? "" : "s"
        } registrada${
          marcas.length === 1 ? "" : "s"
        }. ${marcasActivas} activa${
          marcasActivas === 1 ? "" : "s"
        }.`}
        actions={
          <Link
            href="/admin/marcas/nueva"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-slate-800"
          >
            <Plus size={18} />
            Nueva marca
          </Link>
        }
      />

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {marcas.length === 0 ? (
          <div className="flex min-h-96 flex-col items-center justify-center p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
              <Tags
                size={30}
                className="text-slate-500"
              />
            </div>

            <h2 className="mt-5 text-xl font-black text-slate-950">
              Todavía no tienes marcas
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
              Crea marcas como BOMVINK, BOMDER, XTD o
              POWFULL para organizar mejor tus productos.
            </p>

            <Link
              href="/admin/marcas/nueva"
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-bold text-white"
            >
              <Plus size={18} />
              Crear primera marca
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px]">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-4">
                    Marca
                  </th>

                  <th className="px-6 py-4">
                    Productos
                  </th>

                  <th className="px-6 py-4">
                    Estado
                  </th>

                  <th className="px-6 py-4 text-right">
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {marcas.map((marca) => (
                  <tr
                    key={marca.id}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                          {marca.logoUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={marca.logoUrl}
                              alt={marca.nombre}
                              className="h-full w-full object-contain p-1"
                            />
                          ) : (
                            <Tags
                              size={22}
                              className="text-slate-400"
                            />
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="font-bold text-slate-950">
                            {marca.nombre}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {marca.slug}
                          </p>

                          {marca.descripcion && (
                            <p className="mt-1 line-clamp-1 max-w-md text-xs text-slate-400">
                              {marca.descripcion}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700">
                        {marca._count.productos}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${
                          marca.activa
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {marca.activa
                          ? "ACTIVA"
                          : "OCULTA"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <form
                          action={cambiarEstadoMarca}
                        >
                          <input
                            type="hidden"
                            name="marcaId"
                            value={marca.id}
                          />

                          <input
                            type="hidden"
                            name="activa"
                            value={String(
                              !marca.activa
                            )}
                          />

                          <button
                            type="submit"
                            title={
                              marca.activa
                                ? "Ocultar marca"
                                : "Activar marca"
                            }
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-100"
                          >
                            {marca.activa ? (
                              <EyeOff size={17} />
                            ) : (
                              <Eye size={17} />
                            )}
                          </button>
                        </form>

                        <Link
                          href={`/admin/marcas/${marca.id}/editar`}
                          className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 text-sm font-bold text-white transition hover:bg-slate-800"
                        >
                          <Pencil size={16} />
                          Editar
                        </Link>
                      </div>
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