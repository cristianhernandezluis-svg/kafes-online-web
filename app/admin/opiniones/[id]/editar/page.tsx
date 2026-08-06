import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Save,
  Star,
} from "lucide-react";

import prisma from "@/lib/prisma";
import Card from "@/components/admin/ui/Card";
import Input from "@/components/admin/ui/Input";
import Textarea from "@/components/admin/ui/Textarea";
import PageHeader from "@/components/admin/ui/PageHeader";
import SingleImageUploader from "@/components/admin/media/SingleImageUploader";

import { actualizarOpinion } from "../../actions";

export const dynamic = "force-dynamic";

type EditarOpinionPageProps = {
  params: Promise<{
    id: string;
  }>;

  searchParams: Promise<{
    guardado?: string;
  }>;
};

export default async function EditarOpinionPage({
  params,
  searchParams,
}: EditarOpinionPageProps) {
  const { id } = await params;
  const query = await searchParams;

  const opinionId = Number(id);

  if (
    !Number.isInteger(opinionId) ||
    opinionId <= 0
  ) {
    notFound();
  }

  const [opinion, productos] = await Promise.all([
    prisma.opinion.findUnique({
      where: {
        id: opinionId,
      },
      include: {
        producto: {
          select: {
            nombre: true,
            slug: true,
          },
        },
      },
    }),

    prisma.producto.findMany({
      select: {
        id: true,
        nombre: true,
        estado: true,
        categoria: {
          select: {
            nombre: true,
          },
        },
        marca: {
          select: {
            nombre: true,
          },
        },
      },
      orderBy: {
        nombre: "asc",
      },
    }),
  ]);

  if (!opinion) {
    notFound();
  }

  const fechaOpinion = opinion.fecha
    .toISOString()
    .slice(0, 10);

  return (
    <section>
      <PageHeader
        eyebrow="Catálogo / Opiniones"
        title={opinion.clienteNombre}
        description={`Edita la opinión relacionada con ${opinion.producto.nombre}.`}
        actions={
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/opiniones"
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            >
              <ArrowLeft size={17} />
              Opiniones
            </Link>

            <Link
              href={`/producto/${opinion.producto.slug}`}
              target="_blank"
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              Ver producto
            </Link>
          </div>
        }
      />

      {query.guardado === "1" && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
          <CheckCircle2
            size={21}
            className="mt-0.5 shrink-0"
          />

          <div>
            <p className="font-black">
              Opinión actualizada
            </p>

            <p className="mt-1 text-sm">
              Los cambios se guardaron correctamente.
            </p>
          </div>
        </div>
      )}

      <form action={actualizarOpinion}>
        <input
          type="hidden"
          name="opinionId"
          value={opinion.id}
        />

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <Card
              title="Producto"
              description="Cambia el producto relacionado con esta opinión."
            >
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-800">
                  Producto relacionado
                </span>

                <select
                  name="productoId"
                  required
                  defaultValue={String(
                    opinion.productoId
                  )}
                  className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none transition focus:border-slate-500 focus:ring-4 focus:ring-slate-100"
                >
                  {productos.map((producto) => {
                    const detalles = [
                      producto.marca?.nombre,
                      producto.categoria?.nombre,
                    ]
                      .filter(Boolean)
                      .join(" · ");

                    return (
                      <option
                        key={producto.id}
                        value={producto.id}
                      >
                        {producto.nombre}
                        {detalles
                          ? ` — ${detalles}`
                          : ""}
                        {producto.estado !== "PUBLICADO"
                          ? " — BORRADOR"
                          : ""}
                      </option>
                    );
                  })}
                </select>
              </label>
            </Card>

            <Card
              title="Datos del cliente"
              description="Información mostrada junto al testimonio."
            >
              <div className="grid gap-5 md:grid-cols-2">
                <Input
                  label="Nombre del cliente"
                  name="clienteNombre"
                  defaultValue={
                    opinion.clienteNombre
                  }
                  required
                />

                <Input
                  label="Ciudad"
                  name="ciudad"
                  defaultValue={
                    opinion.ciudad ?? ""
                  }
                  placeholder="Ejemplo: Arequipa"
                />
              </div>
            </Card>

            <Card
              title="Testimonio"
              description="Modifica el comentario, la calificación y la fecha."
            >
              <div className="space-y-5">
                <Textarea
                  label="Comentario"
                  name="comentario"
                  defaultValue={
                    opinion.comentario
                  }
                  required
                />

                <div className="grid gap-5 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-bold text-slate-800">
                      Calificación
                    </span>

                    <select
                      name="calificacion"
                      defaultValue={String(
                        opinion.calificacion
                      )}
                      className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none transition focus:border-slate-500 focus:ring-4 focus:ring-slate-100"
                    >
                      <option value="5">
                        5 estrellas
                      </option>
                      <option value="4">
                        4 estrellas
                      </option>
                      <option value="3">
                        3 estrellas
                      </option>
                      <option value="2">
                        2 estrellas
                      </option>
                      <option value="1">
                        1 estrella
                      </option>
                    </select>

                    <div className="mt-3 flex gap-1">
                      {Array.from({
                        length: 5,
                      }).map((_, indice) => (
                        <Star
                          key={indice}
                          size={18}
                          className={
                            indice <
                            opinion.calificacion
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-slate-300"
                          }
                        />
                      ))}
                    </div>
                  </label>

                  <Input
                    label="Fecha de la opinión"
                    name="fecha"
                    type="date"
                    defaultValue={fechaOpinion}
                    required
                  />
                </div>
              </div>
            </Card>

            <Card
              title="Foto del cliente"
              description="Cambia o elimina la fotografía asociada a la opinión."
            >
              <SingleImageUploader
                nameUrl="imagenUrl"
                namePublicId="imagenPublicId"
                initialUrl={
                  opinion.imagenUrl ?? ""
                }
                initialPublicId={
                  opinion.imagenPublicId ?? ""
                }
                altText={`Foto de ${opinion.clienteNombre}`}
                signaturePayload={{
                  tipo: "opinion",
                  opinionId: opinion.id,
                }}
              />
            </Card>
          </div>

          <aside className="space-y-6">
            <Card
              title="Configuración"
              description="Controla el orden y la publicación."
            >
              <div className="space-y-4">
                <Input
                  label="Orden"
                  name="orden"
                  type="number"
                  min="0"
                  step="1"
                  defaultValue={String(
                    opinion.orden
                  )}
                  description="Los números menores aparecen primero."
                />

                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-slate-400">
                  <input
                    type="checkbox"
                    name="compraVerificada"
                    defaultChecked={
                      opinion.compraVerificada
                    }
                    className="mt-1 h-4 w-4 rounded border-slate-300"
                  />

                  <span>
                    <span className="block text-sm font-black text-slate-900">
                      Compra verificada
                    </span>

                    <span className="mt-1 block text-xs leading-5 text-slate-500">
                      Mostrará la insignia de compra
                      verificada.
                    </span>
                  </span>
                </label>

                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-slate-400">
                  <input
                    type="checkbox"
                    name="visible"
                    defaultChecked={
                      opinion.visible
                    }
                    className="mt-1 h-4 w-4 rounded border-slate-300"
                  />

                  <span>
                    <span className="block text-sm font-black text-slate-900">
                      Opinión visible
                    </span>

                    <span className="mt-1 block text-xs leading-5 text-slate-500">
                      Aparecerá públicamente en la página
                      del producto.
                    </span>
                  </span>
                </label>
              </div>
            </Card>

            <Card title="Resumen">
              <dl className="space-y-4 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-slate-500">
                    Calificación
                  </dt>

                  <dd className="font-black text-slate-950">
                    {opinion.calificacion}/5
                  </dd>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <dt className="text-slate-500">
                    Estado
                  </dt>

                  <dd
                    className={`rounded-full px-3 py-1 text-xs font-black ${
                      opinion.visible
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {opinion.visible
                      ? "VISIBLE"
                      : "OCULTA"}
                  </dd>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <dt className="text-slate-500">
                    Verificada
                  </dt>

                  <dd className="font-black text-slate-950">
                    {opinion.compraVerificada
                      ? "Sí"
                      : "No"}
                  </dd>
                </div>
              </dl>
            </Card>

            <Card title="Guardar cambios">
              <button
                type="submit"
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-slate-800"
              >
                <Save size={18} />
                Guardar cambios
              </button>
            </Card>
          </aside>
        </div>
      </form>
    </section>
  );
}