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

import ProductosDestacadosSelector from "./ProductosDestacadosSelector";
import { guardarProductosDestacados } from "./actions";

export const dynamic = "force-dynamic";

const TIPO_SECCION = "PRODUCTOS_DESTACADOS";

type ConfiguracionProductosDestacados = {
  cantidad: number;
  textoBoton: string;
  hrefBoton: string;
  productoIds: number[];
};

type ProductosDestacadosPageProps = {
  searchParams: Promise<{
    guardado?: string;
  }>;
};

function leerConfiguracion(
  valor: unknown
): ConfiguracionProductosDestacados {
  const predeterminado: ConfiguracionProductosDestacados = {
    cantidad: 8,
    textoBoton: "Ver todos los productos",
    hrefBoton: "/productos",
    productoIds: [],
  };

  if (!valor || typeof valor !== "object" || Array.isArray(valor)) {
    return predeterminado;
  }

  const configuracion = valor as Record<string, unknown>;

  const cantidad =
    typeof configuracion.cantidad === "number" &&
    Number.isFinite(configuracion.cantidad)
      ? Math.min(Math.max(Math.trunc(configuracion.cantidad), 1), 12)
      : predeterminado.cantidad;

  const textoBoton =
    typeof configuracion.textoBoton === "string" &&
    configuracion.textoBoton.trim()
      ? configuracion.textoBoton
      : predeterminado.textoBoton;

  const hrefBoton =
    typeof configuracion.hrefBoton === "string" &&
    configuracion.hrefBoton.trim()
      ? configuracion.hrefBoton
      : predeterminado.hrefBoton;

  const productoIds = Array.isArray(configuracion.productoIds)
    ? configuracion.productoIds.filter(
        (id): id is number =>
          typeof id === "number" &&
          Number.isInteger(id) &&
          id > 0
      )
    : [];

  return {
    cantidad,
    textoBoton,
    hrefBoton,
    productoIds,
  };
}

export default async function ProductosDestacadosPage({
  searchParams,
}: ProductosDestacadosPageProps) {
  const query = await searchParams;

  const [seccion, productosPublicados] = await Promise.all([
    prisma.homeSection.findFirst({
      where: {
        tipo: TIPO_SECCION,
      },
      orderBy: {
        id: "asc",
      },
    }),

    prisma.producto.findMany({
      where: {
        estado: "PUBLICADO",
      },
      select: {
        id: true,
        nombre: true,
        slug: true,
        destacado: true,
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
      orderBy: [
        {
          destacado: "desc",
        },
        {
          nombre: "asc",
        },
      ],
    }),
  ]);

  const configuracion = leerConfiguracion(seccion?.configuracion);

  const idsDestacadosActuales = productosPublicados
    .filter((producto) => producto.destacado)
    .slice(0, configuracion.cantidad)
    .map((producto) => producto.id);

  const seleccionInicial =
    configuracion.productoIds.length > 0
      ? configuracion.productoIds
      : idsDestacadosActuales;

  const productosSelector = productosPublicados.map((producto) => ({
    id: producto.id,
    nombre: producto.nombre,
    slug: producto.slug,
    imagenUrl: producto.imagenes[0]?.url ?? null,
    categoria: producto.categoria?.nombre ?? null,
    marca: producto.marca?.nombre ?? null,
  }));

  return (
    <form action={guardarProductosDestacados}>
      <PageHeader
        eyebrow="Página de inicio"
        title="Productos destacados"
        description="Elige los productos que aparecerán en la portada y configura el contenido de la sección."
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
          <CheckCircle2 size={21} className="mt-0.5 shrink-0" />

          <div>
            <p className="font-black">Cambios guardados</p>

            <p className="mt-1 text-sm">
              La configuración de Productos destacados se actualizó
              correctamente.
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <Card
            title="Contenido de la sección"
            description="Personaliza el encabezado que verá el cliente."
          >
            <div className="space-y-5">
              <Input
                label="Título"
                name="titulo"
                defaultValue={
                  seccion?.titulo ?? "Productos destacados"
                }
                placeholder="Productos destacados"
                required
              />

              <Textarea
                label="Subtítulo"
                name="subtitulo"
                defaultValue={seccion?.subtitulo ?? ""}
                placeholder="Descubre nuestras herramientas más vendidas."
              />

              <div className="grid gap-5 md:grid-cols-2">
                <Input
                  label="Texto del botón"
                  name="textoBoton"
                  defaultValue={configuracion.textoBoton}
                  placeholder="Ver todos los productos"
                />

                <Input
                  label="Enlace del botón"
                  name="hrefBoton"
                  defaultValue={configuracion.hrefBoton}
                  placeholder="/productos"
                  description="Ejemplo: /productos o /categoria/sierras"
                />
              </div>
            </div>
          </Card>

          <Card
            title="Seleccionar productos"
            description="Selecciona y ordena manualmente los productos que aparecerán en esta sección."
          >
            <ProductosDestacadosSelector
              productos={productosSelector}
              seleccionInicial={seleccionInicial}
            />
          </Card>
        </div>

        <aside className="space-y-6">
          <Card
            title="Configuración"
            description="Controla la visibilidad y cantidad de productos."
          >
            <div className="space-y-5">
              <Input
                label="Cantidad máxima"
                name="cantidad"
                type="number"
                min="1"
                max="12"
                step="1"
                defaultValue={String(configuracion.cantidad)}
                description="Puedes mostrar entre 1 y 12 productos."
              />

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
                    Desmarca esta opción para ocultarla temporalmente de la
                    portada.
                  </span>
                </span>
              </label>
            </div>
          </Card>

          <Card
            title="Resumen"
            description="Estado actual de esta sección."
          >
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-500">
                  Productos publicados
                </span>

                <span className="font-black text-slate-950">
                  {productosPublicados.length}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-500">
                  Productos seleccionados
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
                  {seccion?.activo ?? true ? "ACTIVO" : "OCULTO"}
                </span>
              </div>
            </div>
          </Card>
        </aside>
      </div>
    </form>
  );
}