import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

function formatearPrecio(
  valor: { toString(): string } | null,
) {
  if (!valor) return null;

  const numero = Number(valor.toString());

  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits:
      numero % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(numero);
}

export async function GET(request: NextRequest) {
  try {
    const consulta =
      request.nextUrl.searchParams.get("q")?.trim() ??
      "";

    if (consulta.length < 2) {
      return NextResponse.json({
        productos: [],
      });
    }

    const productos =
      await prisma.producto.findMany({
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
    sku: {
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
        select: {
          id: true,
          nombre: true,
          slug: true,
          precio: true,
          precioAntes: true,
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
            createdAt: "desc",
          },
        ],
        take: 6,
      });

    return NextResponse.json({
      productos: productos.map((producto) => ({
        id: producto.id,
        nombre: producto.nombre,
        slug: producto.slug,
        precio: formatearPrecio(producto.precio),
        precioAntes: formatearPrecio(
          producto.precioAntes,
        ),
        imagen: producto.imagenes[0]?.url ?? null,
        categoria:
          producto.categoria?.nombre ?? null,
        marca: producto.marca?.nombre ?? null,
      })),
    });
  } catch (error) {
    console.error(
      "Error buscando productos:",
      error,
    );

    return NextResponse.json(
      {
        productos: [],
        error: "No se pudieron buscar los productos.",
      },
      {
        status: 500,
      },
    );
  }
}