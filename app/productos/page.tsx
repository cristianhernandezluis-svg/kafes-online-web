import Link from "next/link";
import {
  ArrowLeft,
  PackageSearch,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import prisma from "@/lib/prisma";
import ProductCard from "@/components/home/ProductCard";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type ProductosPageProps = {
  searchParams: Promise<{
    buscar?: string;
    categoria?: string;
  }>;
};

function formatearPrecio(
  valor: { toString(): string } | null
) {
  if (!valor) {
    return null;
  }

  const numero = Number(valor.toString());

  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits:
      numero % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(numero);
}

export default async function ProductosPage({
  searchParams,
}: ProductosPageProps) {
  const query = await searchParams;

  const buscar =
    typeof query.buscar === "string"
      ? query.buscar.trim()
      : "";

  const categoriaSlug =
    typeof query.categoria === "string"
      ? query.categoria.trim()
      : "";

  const [productos, categorias] =
    await Promise.all([
      prisma.producto.findMany({
        where: {
          estado: "PUBLICADO",

          ...(categoriaSlug
            ? {
                categoria: {
                  slug: categoriaSlug,
                  activa: true,
                },
              }
            : {}),

          ...(buscar
            ? {
                OR: [
                  {
                    nombre: {
                      contains: buscar,
                      mode: "insensitive",
                    },
                  },
                  {
                    descripcionCorta: {
                      contains: buscar,
                      mode: "insensitive",
                    },
                  },
                  {
                    sku: {
                      contains: buscar,
                      mode: "insensitive",
                    },
                  },
                  {
                    categoria: {
                      nombre: {
                        contains: buscar,
                        mode: "insensitive",
                      },
                    },
                  },
                  {
                    marca: {
                      nombre: {
                        contains: buscar,
                        mode: "insensitive",
                      },
                    },
                  },
                ],
              }
            : {}),
        },

        select: {
          id: true,
          nombre: true,
          slug: true,
          descripcionCorta: true,
          descripcion: true,
          precio: true,
          precioAntes: true,
          stock: true,
          destacado: true,

          categoria: {
            select: {
              nombre: true,
              slug: true,
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
              alt: true,
              esPrincipal: true,
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
            publishedAt: "desc",
          },
          {
            createdAt: "desc",
          },
        ],
      }),

      prisma.categoria.findMany({
        where: {
          activa: true,
        },
        select: {
          id: true,
          nombre: true,
          slug: true,
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

  const categoriaSeleccionada =
    categorias.find(
      (categoria) =>
        categoria.slug === categoriaSlug
    );

  return (
    <main className="min-h-screen bg-[#f7f7f7] text-black">
      <div className="bg-black px-4 py-2 text-center text-xs font-bold text-white md:text-sm">
        Envíos rápidos a todo el Perú
      </div>

      <header className="border-b border-zinc-200 bg-yellow-400">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5 md:px-6">
          <Link
            href="/"
            className="text-xl font-black tracking-tight"
          >
            KAFES
            <span className="text-white">
              ONLINE
            </span>
          </Link>

          <Link
            href="/"
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-black px-4 text-sm font-bold text-white transition hover:bg-zinc-800"
          >
            <ArrowLeft size={17} />
            Volver a la tienda
          </Link>
        </div>
      </header>

      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
          <p className="text-sm font-black uppercase tracking-widest text-yellow-600">
            Catálogo KAFES
          </p>

          <h1 className="mt-2 text-3xl font-black md:text-5xl">
            {categoriaSeleccionada
              ? categoriaSeleccionada.nombre
              : "Todos los productos"}
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600 md:text-base">
            Encuentra herramientas, bombas de agua,
            generadores y equipos para trabajos
            profesionales.
          </p>

          <p className="mt-4 text-sm font-bold text-zinc-500">
            {productos.length} producto
            {productos.length === 1 ? "" : "s"} encontrado
            {productos.length === 1 ? "" : "s"}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <form
          method="GET"
          className="grid gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm md:grid-cols-[minmax(0,1fr)_280px_auto]"
        >
          <label className="relative block">
            <span className="sr-only">
              Buscar productos
            </span>

            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
            />

            <input
              type="search"
              name="buscar"
              defaultValue={buscar}
              placeholder="Buscar por nombre, marca o categoría..."
              className="h-12 w-full rounded-xl border border-zinc-300 bg-white pl-12 pr-4 text-sm outline-none transition focus:border-yellow-500 focus:ring-4 focus:ring-yellow-100"
            />
          </label>

          <label className="relative block">
            <span className="sr-only">
              Filtrar por categoría
            </span>

            <SlidersHorizontal
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
            />

            <select
              name="categoria"
              defaultValue={categoriaSlug}
              className="h-12 w-full appearance-none rounded-xl border border-zinc-300 bg-white pl-12 pr-4 text-sm font-bold outline-none transition focus:border-yellow-500 focus:ring-4 focus:ring-yellow-100"
            >
              <option value="">
                Todas las categorías
              </option>

              {categorias.map((categoria) => (
                <option
                  key={categoria.id}
                  value={categoria.slug}
                >
                  {categoria.nombre}
                </option>
              ))}
            </select>
          </label>

          <button
            type="submit"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-black px-6 text-sm font-black text-white transition hover:bg-zinc-800"
          >
            <Search size={18} />
            Buscar
          </button>
        </form>

        {(buscar || categoriaSlug) && (
          <div className="mt-4">
            <Link
              href="/productos"
              className="text-sm font-bold text-zinc-600 underline transition hover:text-black"
            >
              Limpiar filtros
            </Link>
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-6">
        {productos.length === 0 ? (
          <div className="flex min-h-80 flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-300 bg-white p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100">
              <PackageSearch
                size={30}
                className="text-zinc-500"
              />
            </div>

            <h2 className="mt-5 text-xl font-black">
              No encontramos productos
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-zinc-500">
              Prueba con otra búsqueda o selecciona
              una categoría diferente.
            </p>

            <Link
              href="/productos"
              className="mt-6 inline-flex h-11 items-center rounded-xl bg-black px-5 text-sm font-bold text-white"
            >
              Ver todo el catálogo
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {productos.map((producto) => {
              const imagen =
                producto.imagenes[0];

              return (
                <ProductCard
                  key={producto.id}
                  href={`/producto/${producto.slug}`}
                  image={
                    imagen?.url ??
                    "/placeholder-producto.jpg"
                  }
                  alt={
                    imagen?.alt ||
                    producto.nombre
                  }
                  badge={
                    producto.destacado
                      ? "MÁS VENDIDO"
                      : producto.categoria?.nombre ||
                        "PRODUCTO"
                  }
                  title={producto.nombre}
                  description={
                    producto.descripcionCorta ||
                    producto.descripcion ||
                    "Producto seleccionado por KAFES ONLINE."
                  }
                  price={
                    formatearPrecio(
                      producto.precio
                    ) ?? "Consultar"
                  }
                  beforePrice={formatearPrecio(
                    producto.precioAntes
                  )}
                  available={producto.stock > 0}
                />
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}