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
      
      beneficios: {
  orderBy: [
    {
      orden: "asc",
    },
    {
      id: "asc",
    },
  ],
},

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
opiniones: {
  where: {
    visible: true,
  },
  orderBy: [
    {
      orden: "asc",
    },
    {
      fecha: "desc",
    },
  ],
},
    },
  });

  if (!productoDb || productoDb.estado !== "PUBLICADO") {
    notFound();
  }

  const relacionadosMismaCategoria =
  productoDb.categoriaId
    ? await prisma.producto.findMany({
        where: {
          categoriaId: productoDb.categoriaId,
          estado: "PUBLICADO",
          id: {
            not: productoDb.id,
          },
        },
        include: {
          imagenes: {
            orderBy: [
              {
                esPrincipal: "desc",
              },
              {
                orden: "asc",
              },
            ],
          },
        },
        orderBy: [
          {
            destacado: "desc",
          },
          {
            createdAt: "desc",
          },
        ],
        take: 4,
      })
    : [];

const cantidadFaltante = Math.max(
  0,
  4 - relacionadosMismaCategoria.length,
);

const idsExcluidos = [
  productoDb.id,
  ...relacionadosMismaCategoria.map(
    (producto) => producto.id,
  ),
];

const relacionadosComplementarios =
  cantidadFaltante > 0
    ? await prisma.producto.findMany({
        where: {
          estado: "PUBLICADO",
          id: {
            notIn: idsExcluidos,
          },
        },
        include: {
          imagenes: {
            orderBy: [
              {
                esPrincipal: "desc",
              },
              {
                orden: "asc",
              },
            ],
          },
        },
        orderBy: [
          {
            destacado: "desc",
          },
          {
            createdAt: "desc",
          },
        ],
        take: cantidadFaltante,
      })
    : [];

const relacionadosDb = [
  ...relacionadosMismaCategoria,
  ...relacionadosComplementarios,
];

  const relacionados = relacionadosDb.map((item) => {
    const imagenPrincipal =
      item.imagenes.find(
        (imagen) => imagen.esPrincipal,
      )?.url ??
      item.imagenes[0]?.url ??
      "/placeholder-producto.jpg";

    return {
      nombre: item.nombre,
      precio: Number(item.precio),
      imagen: imagenPrincipal,
      href: `/producto/${item.slug}`,
    };
  });

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

    beneficios: productoDb.beneficios.map(
  (beneficio) =>
    beneficio.descripcion
      ? `${beneficio.titulo}: ${beneficio.descripcion}`
      : beneficio.titulo
),

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
        tipo:
          documento.tipo as ProductoPublico["documentos"][number]["tipo"],
        archivoUrl: documento.archivoUrl,
        orden: documento.orden,
        visible: documento.visible,
      }),
    ),

opiniones: productoDb.opiniones.map(
  (opinion) => ({
    id: opinion.id,
    clienteNombre: opinion.clienteNombre,
    ciudad: opinion.ciudad,
    comentario: opinion.comentario,
    calificacion: opinion.calificacion,
    imagenUrl: opinion.imagenUrl,
    compraVerificada:
      opinion.compraVerificada,
    fecha: opinion.fecha.toISOString(),
  })
),

    relacionados,
  };

  return <ProductoClient producto={producto} />;
}