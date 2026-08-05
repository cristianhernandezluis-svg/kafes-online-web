import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  Save,
} from "lucide-react";

import prisma from "@/lib/prisma";
import Card from "@/components/admin/ui/Card";
import Input from "@/components/admin/ui/Input";
import Textarea from "@/components/admin/ui/Textarea";
import PageHeader from "@/components/admin/ui/PageHeader";

import { actualizarCategoria } from "../../actions";

export const dynamic = "force-dynamic";

type EditarCategoriaPageProps = {
  params: Promise<{
    id: string;
  }>;

  searchParams: Promise<{
    guardado?: string;
  }>;
};

export default async function EditarCategoriaPage({
  params,
  searchParams,
}: EditarCategoriaPageProps) {
  const { id } = await params;
  const query = await searchParams;

  const categoriaId = Number(id);

  if (
    !Number.isInteger(categoriaId) ||
    categoriaId <= 0
  ) {
    notFound();
  }

  const categoria = await prisma.categoria.findUnique({
    where: {
      id: categoriaId,
    },
    include: {
      _count: {
        select: {
          productos: true,
        },
      },
    },
  });

  if (!categoria) {
    notFound();
  }

  return (
    <section>
      <PageHeader
        eyebrow="Catálogo / Categorías"
        title={categoria.nombre}
        description={`Edita la información de esta categoría. Actualmente tiene ${categoria._count.productos} producto${
          categoria._count.productos === 1 ? "" : "s"
        } relacionado${
          categoria._count.productos === 1 ? "" : "s"
        }.`}
        actions={
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/categorias"
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            >
              <ArrowLeft size={17} />
              Categorías
            </Link>

            {categoria.activa && (
              <Link
                href={`/categoria/${categoria.slug}`}
                target="_blank"
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-bold text-white transition hover:bg-slate-800"
              >
                <ExternalLink size={17} />
                Ver categoría
              </Link>
            )}
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
              Categoría actualizada
            </p>

            <p className="mt-1 text-sm">
              Los cambios se guardaron correctamente.
            </p>
          </div>
        </div>
      )}

      <form action={actualizarCategoria}>
        <input
          type="hidden"
          name="categoriaId"
          value={categoria.id}
        />

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <Card
              title="Información de la categoría"
              description="Modifica los datos principales que verá el cliente."
            >
              <div className="space-y-5">
                <Input
                  label="Nombre"
                  name="nombre"
                  defaultValue={categoria.nombre}
                  placeholder="Ejemplo: Sierras"
                  required
                />

                <Input
                  label="Slug"
                  name="slug"
                  defaultValue={categoria.slug}
                  placeholder="sierras"
                  description={`Dirección actual: /categoria/${categoria.slug}`}
                  required
                />

                <Textarea
                  label="Descripción"
                  name="descripcion"
                  defaultValue={
                    categoria.descripcion ?? ""
                  }
                  placeholder="Describe brevemente esta categoría."
                />
              </div>
            </Card>

            <Card
              title="Imagen"
              description="Imagen que aparecerá en la sección de categorías de la portada."
            >
              <div className="space-y-5">
                <Input
                  label="URL de la imagen"
                  name="imagenUrl"
                  type="url"
                  defaultValue={
                    categoria.imagenUrl ?? ""
                  }
                  placeholder="https://res.cloudinary.com/..."
                  description="Pega una URL pública de Cloudinary."
                />

                <div className="flex min-h-56 items-center justify-center overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6">
                  {categoria.imagenUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={categoria.imagenUrl}
                      alt={categoria.nombre}
                      className="max-h-52 max-w-full object-contain"
                    />
                  ) : (
                    <div className="text-center">
                      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-yellow-400 text-3xl font-black text-black">
                        {categoria.nombre
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <p className="mt-4 text-sm text-slate-500">
                        Esta categoría todavía no tiene imagen.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>

          <aside className="space-y-6">
            <Card
              title="Configuración"
              description="Controla la posición y visibilidad."
            >
              <div className="space-y-5">
                <Input
                  label="Orden"
                  name="orden"
                  type="number"
                  min="0"
                  step="1"
                  defaultValue={String(
                    categoria.orden
                  )}
                  description="Los números menores aparecen primero."
                />

                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-slate-400">
                  <input
                    type="checkbox"
                    name="activa"
                    defaultChecked={
                      categoria.activa
                    }
                    className="mt-1 h-4 w-4 rounded border-slate-300"
                  />

                  <span>
                    <span className="block text-sm font-black text-slate-900">
                      Categoría activa
                    </span>

                    <span className="mt-1 block text-xs leading-5 text-slate-500">
                      Estará disponible para mostrarla en la portada y asignarla a productos.
                    </span>
                  </span>
                </label>
              </div>
            </Card>

            <Card title="Resumen">
              <dl className="space-y-4 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-slate-500">
                    Productos
                  </dt>

                  <dd className="font-black text-slate-950">
                    {categoria._count.productos}
                  </dd>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <dt className="text-slate-500">
                    Estado
                  </dt>

                  <dd
                    className={`rounded-full px-3 py-1 text-xs font-black ${
                      categoria.activa
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {categoria.activa
                      ? "ACTIVA"
                      : "OCULTA"}
                  </dd>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <dt className="text-slate-500">
                    Orden
                  </dt>

                  <dd className="font-black text-slate-950">
                    {categoria.orden}
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