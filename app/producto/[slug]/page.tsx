import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import type { ProductoPublico } from "@/components/producto/product-types";
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

      fichaTecnica: {
        orderBy: {
          orden: "asc",
        },
      },

      documentos: {
        where: {
          visible: true,
        },
        orderBy: {
          orden: "asc",
        },
      },
    },
  });

  if (!productoDb || productoDb.estado !== "PUBLICADO") {
    notFound();
  }

  const imagenes = productoDb.imagenes.map(
    (imagen) => imagen.url,
  );

  const producto: ProductoPublico = {
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
      productoDb.stock > 0
        ? "Disponible"
        : "Agotado",
    ].filter(
      (item): item is string => Boolean(item),
    ),

    beneficios: [],

    especificaciones: productoDb.fichaTecnica.map(
      (especificacion) => ({
        id: especificacion.id,
        nombre: especificacion.nombre,
        valor: especificacion.valor,
        orden: especificacion.orden,
      }),
    ),

    documentos: productoDb.documentos.map(
      (documento) => ({
        id: documento.id,
        titulo: documento.titulo,
        tipo: documento.tipo as ProductoPublico["documentos"][number]["tipo"],
        archivoUrl: documento.archivoUrl,
        orden: documento.orden,
        visible: documento.visible,
      }),
    ),
  };

  return <ProductoClient producto={producto} />;
}