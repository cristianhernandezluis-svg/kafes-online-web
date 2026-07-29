import Link from "next/link";
import prisma from "@/lib/prisma";
import ProductCard from "@/components/home/ProductCard";
import { Search } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type BuscarPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

function formatearPrecio(valor: { toString(): string } | null) {
  if (!valor) return null;

  const numero = Number(valor.toString());

  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: numero % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(numero);
}

export default async function BuscarPage({
  searchParams,
}: BuscarPageProps) {
  const parametros = await searchParams;
  const consulta = parametros.q?.trim() ?? "";

  const productos = consulta
    ? await prisma.producto.findMany({
        where: {
          estado: "PUBLICADO",
          OR: [
            {
              nombre: {
                contains: consulta,
                mode: "insensitive",
              },
            },
            {
              descripcionCorta: {
                contains: consulta,
                mode: "insensitive",
              },
            },
            {
              slug: {
                contains: consulta,
                mode: "insensitive",
              },
            },
            {
              categoria: {
                nombre: {
                  contains: consulta,
                  mode: "insensitive",
                },
              },
            },
            {
              marca: {
                nombre: {
                  contains: consulta,
                  mode: "insensitive",
                },
              },
            },
          ],
        },
        include: {
          categoria: true,
          marca: true,
          imagenes: {
            orderBy: [
              { esPrincipal: "desc" },
              { orden: "asc" },
            ],
            take: 1,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      })
    : [];

  return (
    <main className="min-h-screen bg-zinc-100 text-black">
      <header className="border-b border-zinc-200 bg-yellow-400">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 md:px-6">
          <Link href="/" className="text-xl font-black">
            KAFES ONLINE
          </Link>

          <Link
            href="/"
            className="rounded-xl bg-black px-5 py-3 text-sm font-black text-yellow-400"
          >
            VOLVER
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <form
          action="/buscar"
          method="GET"
          className="mx-auto flex max-w-2xl items-center gap-3 rounded-2xl bg-white p-3 shadow-sm"
        >
          <Search className="ml-2 text-zinc-500" size={21} />

          <input
            type="search"
            name="q"
            required
            defaultValue={consulta}
            placeholder="Buscar productos..."
            className="min-w-0 flex-1 px-2 py-3 outline-none"
          />

          <button
            type="submit"
            className="rounded-xl bg-black px-5 py-3 font-black text-yellow-400"
          >
            BUSCAR
          </button>
        </form>

        <div className="mt-10">
          <h1 className="text-3xl font-black">
            {consulta
              ? `Resultados para “${consulta}”`
              : "Buscar productos"}
          </h1>

          {consulta && (
            <p className="mt-2 text-zinc-600">
              Se encontraron {productos.length} producto(s).
            </p>
          )}
        </div>

        {consulta && productos.length === 0 ? (
          <div className="mt-8 rounded-3xl bg-white px-6 py-14 text-center shadow-sm">
            <Search
              size={50}
              className="mx-auto text-zinc-300"
            />

            <h2 className="mt-5 text-2xl font-black">
              No encontramos ese producto
            </h2>

            <p className="mt-2 text-zinc-600">
              Prueba escribiendo una palabra más corta, por ejemplo:
              generador, bomba, sierra o amoladora.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {productos.map((producto) => {
              const imagen = producto.imagenes[0];

              return (
                <ProductCard
                  key={producto.id}
                  href={`/producto/${producto.slug}`}
                  image={
                    imagen?.url ??
                    "/categorias/herramientas.png"
                  }
                  alt={imagen?.alt ?? producto.nombre}
                  badge={
                    producto.categoria?.nombre ??
                    producto.marca?.nombre ??
                    "PRODUCTO"
                  }
                  title={producto.nombre}
                  description={
                    producto.descripcionCorta ??
                    "Producto disponible en KAFES ONLINE."
                  }
                  price={
                    formatearPrecio(producto.precio) ??
                    "Consultar"
                  }
                  beforePrice={formatearPrecio(
                    producto.precioAntes,
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