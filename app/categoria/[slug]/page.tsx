import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Package,
  ShoppingCart,
} from "lucide-react";

import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type CategoriaPageProps = {
  params: Promise<{
    slug: string;
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
    minimumFractionDigits: numero % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(numero);
}

export default async function CategoriaPage({
  params,
}: CategoriaPageProps) {
  const { slug } = await params;

  const categoria = await prisma.categoria.findUnique({
    where: {
      slug,
    },
    select: {
      id: true,
      nombre: true,
      slug: true,
      descripcion: true,
      imagenUrl: true,
      activa: true,

      productos: {
        where: {
          estado: "PUBLICADO",
        },
        select: {
          id: true,
          nombre: true,
          slug: true,
          descripcionCorta: true,
          precio: true,
          precioAntes: true,
          stock: true,
          destacado: true,

          marca: {
            select: {
              nombre: true,
            },
          },

          imagenes: {
            select: {
              url: true,
              alt: true,
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
      },
    },
  });

  if (!categoria || !categoria.activa) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#f7f7f7] text-black">
      <div className="bg-black px-4 py-2 text-center text-xs font-bold text-white md:text-sm">
        Envíos rápidos a todo el Perú
      </div>

      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5 md:px-6">
          <Link
            href="/"
            className="text-xl font-black tracking-tight text-black"
          >
            KAFES
            <span className="text-yellow-500">
              ONLINE
            </span>
          </Link>

          <Link
            href="/"
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-zinc-300 px-4 text-sm font-bold transition hover:bg-zinc-100"
          >
            <ArrowLeft size={17} />
            Volver a la tienda
          </Link>
        </div>
      </header>

      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 md:flex-row md:items-center md:px-6">
          <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-50 p-4">
            {categoria.imagenUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={categoria.imagenUrl}
                alt={categoria.nombre}
                className="h-full w-full object-contain"
              />
            ) : (
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-yellow-400 text-4xl font-black text-black">
                {categoria.nombre
                  .charAt(0)
                  .toUpperCase()}
              </span>
            )}
          </div>

          <div>
            <p className="text-sm font-black uppercase tracking-wider text-yellow-600">
              Categoría
            </p>

            <h1 className="mt-2 text-3xl font-black text-zinc-950 md:text-5xl">
              {categoria.nombre}
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600 md:text-base">
              {categoria.descripcion ||
                `Encuentra los mejores productos de ${categoria.nombre}.`}
            </p>

            <p className="mt-3 text-sm font-bold text-zinc-500">
              {categoria.productos.length} producto
              {categoria.productos.length === 1
                ? ""
                : "s"}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        {categoria.productos.length === 0 ? (
          <div className="flex min-h-80 flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-300 bg-white p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100">
              <Package
                size={30}
                className="text-zinc-500"
              />
            </div>

            <h2 className="mt-5 text-xl font-black text-zinc-950">
              Todavía no hay productos
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-zinc-500">
              La categoría está creada correctamente,
              pero todavía no tiene productos publicados
              asignados.
            </p>

            <Link
              href="/"
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-black px-5 text-sm font-bold text-white"
            >
              Ver otros productos
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-7 flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-black uppercase tracking-wider text-yellow-600">
                  Catálogo
                </p>

                <h2 className="mt-1 text-2xl font-black md:text-3xl">
                  Productos de {categoria.nombre}
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
              {categoria.productos.map((producto) => {
                const precio =
                  formatearPrecio(producto.precio);

                const precioAntes =
                  formatearPrecio(
                    producto.precioAntes
                  );

                return (
                  <article
                    key={producto.id}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    <Link
                      href={`/producto/${producto.slug}`}
                      className="relative flex aspect-square items-center justify-center overflow-hidden bg-zinc-50 p-4"
                    >
                      {producto.destacado && (
                        <span className="absolute left-3 top-3 z-10 rounded-full bg-yellow-400 px-3 py-1 text-[10px] font-black text-black">
                          MÁS VENDIDO
                        </span>
                      )}

                      {producto.imagenes[0]?.url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={
                            producto.imagenes[0].url
                          }
                          alt={
                            producto.imagenes[0].alt ||
                            producto.nombre
                          }
                          className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <Package
                          size={48}
                          className="text-zinc-300"
                        />
                      )}
                    </Link>

                    <div className="flex flex-1 flex-col p-4">
                      {producto.marca?.nombre && (
                        <p className="text-[10px] font-black uppercase tracking-wider text-zinc-400">
                          {producto.marca.nombre}
                        </p>
                      )}

                      <Link
                        href={`/producto/${producto.slug}`}
                      >
                        <h3 className="mt-1 text-sm font-black leading-5 text-zinc-950 md:text-base">
                          {producto.nombre}
                        </h3>
                      </Link>

                      {producto.descripcionCorta && (
                        <p className="mt-2 hidden text-xs leading-5 text-zinc-500 md:block">
                          {producto.descripcionCorta}
                        </p>
                      )}

                      <div className="mt-auto pt-4">
                        {precioAntes && (
                          <p className="text-xs text-zinc-400 line-through">
                            {precioAntes}
                          </p>
                        )}

                        <p className="text-xl font-black text-zinc-950">
                          {precio}
                        </p>

                        <Link
                          href={`/producto/${producto.slug}`}
                          className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-yellow-400 px-3 text-xs font-black text-black transition hover:bg-yellow-300 md:text-sm"
                        >
                          <ShoppingCart size={16} />
                          Ver producto
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </section>
    </main>
  );
}