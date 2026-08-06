import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Save,
} from "lucide-react";

import prisma from "@/lib/prisma";
import Card from "@/components/admin/ui/Card";
import Input from "@/components/admin/ui/Input";
import Textarea from "@/components/admin/ui/Textarea";
import PageHeader from "@/components/admin/ui/PageHeader";

import { actualizarMarca } from "../../actions";

export const dynamic = "force-dynamic";

type EditarMarcaPageProps = {
  params: Promise<{
    id: string;
  }>;

  searchParams: Promise<{
    guardado?: string;
  }>;
};

export default async function EditarMarcaPage({
  params,
  searchParams,
}: EditarMarcaPageProps) {
  const { id } = await params;
  const query = await searchParams;

  const marcaId = Number(id);

  if (
    !Number.isInteger(marcaId) ||
    marcaId <= 0
  ) {
    notFound();
  }

  const marca = await prisma.marca.findUnique({
    where: {
      id: marcaId,
    },
    include: {
      _count: {
        select: {
          productos: true,
        },
      },
    },
  });

  if (!marca) {
    notFound();
  }

  return (
    <section>
      <PageHeader
        eyebrow="Catálogo / Marcas"
        title={marca.nombre}
        description={`Edita la información de esta marca. Actualmente tiene ${marca._count.productos} producto${
          marca._count.productos === 1 ? "" : "s"
        } relacionado${
          marca._count.productos === 1 ? "" : "s"
        }.`}
        actions={
          <Link
            href="/admin/marcas"
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
          >
            <ArrowLeft size={17} />
            Marcas
          </Link>
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
              Marca actualizada
            </p>

            <p className="mt-1 text-sm">
              Los cambios se guardaron correctamente.
            </p>
          </div>
        </div>
      )}

      <form action={actualizarMarca}>
        <input
          type="hidden"
          name="marcaId"
          value={marca.id}
        />

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <Card
              title="Información de la marca"
              description="Modifica los datos principales de la marca."
            >
              <div className="space-y-5">
                <Input
                  label="Nombre"
                  name="nombre"
                  defaultValue={marca.nombre}
                  placeholder="Ejemplo: BOMVINK"
                  required
                />

                <Input
                  label="Slug"
                  name="slug"
                  defaultValue={marca.slug}
                  placeholder="bomvink"
                  description={`Identificador actual: ${marca.slug}`}
                  required
                />

                <Textarea
                  label="Descripción"
                  name="descripcion"
                  defaultValue={
                    marca.descripcion ?? ""
                  }
                  placeholder="Describe brevemente esta marca."
                />
              </div>
            </Card>

            <Card
              title="Logo de la marca"
              description="Logo que ayudará a identificar la marca dentro del administrador."
            >
              <div className="space-y-5">
                <Input
                  label="URL del logo"
                  name="logoUrl"
                  type="url"
                  defaultValue={
                    marca.logoUrl ?? ""
                  }
                  placeholder="https://res.cloudinary.com/..."
                  description="Pega una URL pública de Cloudinary o déjala vacía."
                />

                <div className="flex min-h-56 items-center justify-center overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6">
                  {marca.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={marca.logoUrl}
                      alt={marca.nombre}
                      className="max-h-48 max-w-full object-contain"
                    />
                  ) : (
                    <div className="text-center">
                      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-yellow-400 text-3xl font-black text-black">
                        {marca.nombre
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <p className="mt-4 text-sm text-slate-500">
                        Esta marca todavía no tiene logo.
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
              description="Controla la visibilidad de la marca."
            >
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-slate-400">
                <input
                  type="checkbox"
                  name="activa"
                  defaultChecked={marca.activa}
                  className="mt-1 h-4 w-4 rounded border-slate-300"
                />

                <span>
                  <span className="block text-sm font-black text-slate-900">
                    Marca activa
                  </span>

                  <span className="mt-1 block text-xs leading-5 text-slate-500">
                    Estará disponible para asignarla a
                    los productos de la tienda.
                  </span>
                </span>
              </label>
            </Card>

            <Card title="Resumen">
              <dl className="space-y-4 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-slate-500">
                    Productos
                  </dt>

                  <dd className="font-black text-slate-950">
                    {marca._count.productos}
                  </dd>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <dt className="text-slate-500">
                    Estado
                  </dt>

                  <dd
                    className={`rounded-full px-3 py-1 text-xs font-black ${
                      marca.activa
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {marca.activa
                      ? "ACTIVA"
                      : "OCULTA"}
                  </dd>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <dt className="text-slate-500">
                    Slug
                  </dt>

                  <dd className="max-w-44 truncate font-black text-slate-950">
                    {marca.slug}
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