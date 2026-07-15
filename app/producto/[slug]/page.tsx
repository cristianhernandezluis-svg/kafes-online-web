import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import ProductoClient from "./ProductoClient";

type ProductoPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function ProductoPage({
  params,
}: ProductoPageProps) {
  const { slug } = await params;

  const productoDb = await prisma.producto.findUnique({
    where: {
      slug,
    },
    include: {
      imagenes: {
        orderBy: {
          orden: "asc",
        },
      },
      categoria: true,
      marca: true,
    },
  });

  if (!productoDb || productoDb.estado !== "PUBLICADO") {
    notFound();
  }

  const imagenes = productoDb.imagenes.map(
    (imagen) => imagen.url,
  );

  const producto = {
    id: productoDb.id,
    slug: productoDb.slug,
    nombre: productoDb.nombre,
    nombreCorto: productoDb.nombre,

    precio: Number(productoDb.precio),

    precioAntes: productoDb.precioAntes
      ? Number(productoDb.precioAntes)
      : null,

    imagen:
      imagenes.find(
        (_, index) =>
          productoDb.imagenes[index]?.esPrincipal,
      ) ??
      imagenes[0] ??
      "/placeholder-producto.jpg",

    imagenes,

    etiqueta: productoDb.destacado
      ? "MÁS VENDIDO"
      : "OFERTA",

    modoGempages: false,

    descripcion:
      productoDb.descripcionCorta ||
      productoDb.descripcion ||
      "",

    contenidoHtml: productoDb.contenidoHtml,

    stock: productoDb.stock,

    mini: [
      productoDb.marca?.nombre,
      productoDb.categoria?.nombre,
      productoDb.stock > 0 ? "Disponible" : "Agotado",
    ].filter((item): item is string => Boolean(item)),

    beneficios: [],
  };

  return <ProductoClient producto={producto} />;
}