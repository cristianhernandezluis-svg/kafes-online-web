import Link from "next/link";
import {
  BadgeCheck,
  Eye,
  EyeOff,
  MessageSquareText,
  Pencil,
  Plus,
  Star,
} from "lucide-react";

import prisma from "@/lib/prisma";
import PageHeader from "@/components/admin/ui/PageHeader";

import { cambiarEstadoOpinion } from "./actions";

export const dynamic = "force-dynamic";

function formatearFecha(fecha: Date) {
  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(fecha);
}

export default async function OpinionesPage() {
  const opiniones = await prisma.opinion.findMany({
    select: {
      id: true,
      clienteNombre: true,
      ciudad: true,
      comentario: true,
      calificacion: true,
      imagenUrl: true,
      compraVerificada: true,
      visible: true,
      orden: true,
      fecha: true,
      producto: {
        select: {
          nombre: true,
          slug: true,
          imagenes: {
            select: {
              url: true,
            },
            orderBy: [
              {
                esPrincipal: "desc",
              },
              {
                orden: "asc",
              },
            ],
            take: 1,
          },
        },
      },
    },
    orderBy: [
      {
        visible: "desc",
      },
      {
        orden: "asc",
      },
      {
        fecha: "desc",
      },
    ],
  });

  const opinionesVisibles = opiniones.filter(
    (opinion) => opinion.visible
  ).length;

  return (
    <section>
      <PageHeader
        eyebrow="Catálogo"
        title="Opiniones"
        description={`${opiniones.length} opinión${
          opiniones.length === 1 ? "" : "es"
        } registrada${
          opiniones.length === 1 ? "" : "s"
        }. ${opinionesVisibles} visible${
          opinionesVisibles === 1 ? "" : "s"
        }.`}
        actions={
          <Link
            href="/admin/opiniones/nueva"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-slate-800"
          >
            <Plus size={18} />
            Nueva opinión
          </Link>
        }
      />

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {opiniones.length === 0 ? (
          <div className="flex min-h-96 flex-col items-center justify-center p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
              <MessageSquareText
                size={30}
                className="text-slate-500"
              />
            </div>

            <h2 className="mt-5 text-xl font-black text-slate-950">
              Todavía no tienes opiniones
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
              Agrega testimonios reales de clientes y
              relaciónalos con los productos para aumentar
              la confianza en la tienda.
            </p>

            <Link
              href="/admin/opiniones/nueva"
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-bold text-white"
            >
              <Plus size={18} />
              Crear primera opinión
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px]">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-4">
                    Cliente
                  </th>

                  <th className="px-6 py-4">
                    Producto
                  </th>

                  <th className="px-6 py-4">
                    Calificación
                  </th>

                  <th className="px-6 py-4">
                    Fecha
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
                {opiniones.map((opinion) => {
                  const imagenProducto =
                    opinion.producto.imagenes[0]?.url;

                  return (
                    <tr
                      key={opinion.id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                            {opinion.imagenUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={opinion.imagenUrl}
                                alt={opinion.clienteNombre}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <span className="text-lg font-black text-slate-500">
                                {opinion.clienteNombre
                                  .charAt(0)
                                  .toUpperCase()}
                              </span>
                            )}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-slate-950">
                                {opinion.clienteNombre}
                              </p>

                              {opinion.compraVerificada && (
                                <BadgeCheck
                                  size={17}
                                  className="shrink-0 text-emerald-600"
                                />
                              )}
                            </div>

                            {opinion.ciudad && (
                              <p className="mt-1 text-xs text-slate-500">
                                {opinion.ciudad}
                              </p>
                            )}

                            <p className="mt-1 line-clamp-2 max-w-sm text-xs leading-5 text-slate-400">
                              {opinion.comentario}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                            {imagenProducto ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={imagenProducto}
                                alt={opinion.producto.nombre}
                                className="h-full w-full object-contain"
                              />
                            ) : (
                              <MessageSquareText
                                size={19}
                                className="text-slate-400"
                              />
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="max-w-56 truncate text-sm font-bold text-slate-900">
                              {opinion.producto.nombre}
                            </p>

                            <Link
                              href={`/producto/${opinion.producto.slug}`}
                              target="_blank"
                              className="mt-1 block text-xs font-semibold text-blue-600 hover:underline"
                            >
                              Ver producto
                            </Link>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          {Array.from({
                            length: 5,
                          }).map((_, indice) => (
                            <Star
                              key={indice}
                              size={16}
                              className={
                                indice <
                                opinion.calificacion
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-slate-300"
                              }
                            />
                          ))}
                        </div>

                        <p className="mt-1 text-xs font-bold text-slate-500">
                          {opinion.calificacion} de 5
                        </p>
                      </td>

                      <td className="px-6 py-4 text-sm font-semibold text-slate-600">
                        {formatearFecha(opinion.fecha)}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${
                            opinion.visible
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {opinion.visible
                            ? "VISIBLE"
                            : "OCULTA"}
                        </span>

                        {opinion.compraVerificada && (
                          <p className="mt-2 text-xs font-bold text-emerald-600">
                            Compra verificada
                          </p>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <form
                            action={cambiarEstadoOpinion}
                          >
                            <input
                              type="hidden"
                              name="opinionId"
                              value={opinion.id}
                            />

                            <input
                              type="hidden"
                              name="visible"
                              value={String(
                                !opinion.visible
                              )}
                            />

                            <button
                              type="submit"
                              title={
                                opinion.visible
                                  ? "Ocultar opinión"
                                  : "Mostrar opinión"
                              }
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-100"
                            >
                              {opinion.visible ? (
                                <EyeOff size={17} />
                              ) : (
                                <Eye size={17} />
                              )}
                            </button>
                          </form>

                          <Link
                            href={`/admin/opiniones/${opinion.id}/editar`}
                            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 text-sm font-bold text-white transition hover:bg-slate-800"
                          >
                            <Pencil size={16} />
                            Editar
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}