import Link from "next/link";
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

import CategoriasSelector from "./CategoriasSelector";
import { guardarCategoriasHome } from "./actions";

export const dynamic = "force-dynamic";

const TIPO_SECCION = "CATEGORIAS";

type ConfiguracionCategorias = {
  categoriaIds: number[] | null;
};

type CategoriasPageProps = {
  searchParams: Promise<{
    guardado?: string;
  }>;
};

function leerConfiguracion(
  valor: unknown
): ConfiguracionCategorias {
  if (
    !valor ||
    typeof valor !== "object" ||
    Array.isArray(valor)
  ) {
    return {
      categoriaIds: null,
    };
  }

  const configuracion = valor as Record<string, unknown>;

  if (!Array.isArray(configuracion.categoriaIds)) {
    return {
      categoriaIds: null,
    };
  }

  const categoriaIds = configuracion.categoriaIds.filter(
    (id): id is number =>
      typeof id === "number" &&
      Number.isInteger(id) &&
      id > 0
  );

  return {
    categoriaIds,
  };
}

export default async function CategoriasHomePage({
  searchParams,
}: CategoriasPageProps) {
  const query = await searchParams;

  const [seccion, categoriasActivas] = await Promise.all([
    prisma.homeSection.findFirst({
      where: {
        tipo: TIPO_SECCION,
      },
      orderBy: {
        id: "asc",
      },
    }),

    prisma.categoria.findMany({
      where: {
        activa: true,
      },
      select: {
        id: true,
        nombre: true,
        slug: true,
        imagenUrl: true,
        orden: true,
      },
      orderBy: [
        {
          orden: "asc",
        },
        {
          nombre: "asc",
        },
      ],
    }),
  ]);

  const configuracion = leerConfiguracion(
    seccion?.configuracion
  );

  const seleccionInicial =
    configuracion.categoriaIds ??
    categoriasActivas.map((categoria) => categoria.id);

  const categoriasSelector = categoriasActivas.map(
    (categoria) => ({
      id: categoria.id,
      nombre: categoria.nombre,
      slug: categoria.slug,
      imagenUrl: categoria.imagenUrl,
    })
  );

  return (
    <form action={guardarCategoriasHome}>
      <PageHeader
        eyebrow="Página de inicio"
        title="Categorías principales"
        description="Elige y ordena las categorías que aparecerán en la parte superior de la portada."
        actions={
          <>
            <Link
              href="/admin/home"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            >
              <ArrowLeft size={18} />
              Volver
            </Link>

            <Link
              href="/"
              target="_blank"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            >
              <ExternalLink size={18} />
              Ver portada
            </Link>

            <button
              type="submit"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              <Save size={18} />
              Guardar cambios
            </button>
          </>
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
              Cambios guardados
            </p>

            <p className="mt-1 text-sm">
              La configuración de Categorías se actualizó
              correctamente.
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <Card
            title="Contenido de la sección"
            description="Personaliza el título y el texto que verá el cliente."
          >
            <div className="space-y-5">
              <Input
                label="Título"
                name="titulo"
                defaultValue={
                  seccion?.titulo ??
                  "Categorías principales"
                }
                placeholder="Categorías principales"
                required
              />

              <Textarea
                label="Subtítulo"
                name="subtitulo"
                defaultValue={seccion?.subtitulo ?? ""}
                placeholder="Encuentra rápidamente las herramientas que necesitas."
              />
            </div>
          </Card>

          <Card
            title="Seleccionar categorías"
            description="Selecciona y ordena las categorías visibles en la portada."
          >
            <CategoriasSelector
              categorias={categoriasSelector}
              seleccionInicial={seleccionInicial}
            />
          </Card>
        </div>

        <aside className="space-y-6">
          <Card
            title="Configuración"
            description="Controla la visibilidad de esta sección."
          >
            <div className="space-y-5">
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-slate-400">
                <input
                  type="checkbox"
                  name="activo"
                  defaultChecked={seccion?.activo ?? true}
                  className="mt-1 h-4 w-4 rounded border-slate-300"
                />

                <span>
                  <span className="block text-sm font-black text-slate-900">
                    Mostrar sección
                  </span>

                  <span className="mt-1 block text-xs leading-5 text-slate-500">
                    Desmarca esta opción para ocultar las
                    categorías de la portada.
                  </span>
                </span>
              </label>

              <Link
                href="/admin/categorias"
                className="block rounded-xl border border-slate-200 p-4 text-sm font-bold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
              >
                Administrar nombres e imágenes →
              </Link>
            </div>
          </Card>

          <Card
            title="Resumen"
            description="Estado actual de esta sección."
          >
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-500">
                  Categorías activas
                </span>

                <span className="font-black text-slate-950">
                  {categoriasActivas.length}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-500">
                  Seleccionadas
                </span>

                <span className="font-black text-slate-950">
                  {seleccionInicial.length}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-500">
                  Estado
                </span>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-black ${
                    seccion?.activo ?? true
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {seccion?.activo ?? true
                    ? "ACTIVO"
                    : "OCULTO"}
                </span>
              </div>
            </div>
          </Card>
        </aside>
      </div>
    </form>
  );
}