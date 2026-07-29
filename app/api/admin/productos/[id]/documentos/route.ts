import { NextResponse } from "next/server";

import { requerirAdmin } from "@/lib/auth";
import { getCloudinary } from "@/lib/cloudinary";
import prisma from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type TipoDocumento =
  | "FICHA_TECNICA"
  | "MANUAL"
  | "CURVA_RENDIMIENTO"
  | "CATALOGO"
  | "CERTIFICADO"
  | "OTRO";

const TIPOS_PERMITIDOS: TipoDocumento[] = [
  "FICHA_TECNICA",
  "MANUAL",
  "CURVA_RENDIMIENTO",
  "CATALOGO",
  "CERTIFICADO",
  "OTRO",
];

function obtenerProductoId(valor: string) {
  const productoId = Number(valor);

  if (!Number.isInteger(productoId) || productoId <= 0) {
    return null;
  }

  return productoId;
}

function obtenerNumero(valor: unknown) {
  const numero = Number(valor);

  if (!Number.isInteger(numero) || numero <= 0) {
    return null;
  }

  return numero;
}

function obtenerTexto(valor: unknown) {
  return typeof valor === "string" ? valor.trim() : "";
}

function obtenerTipoDocumento(valor: unknown): TipoDocumento {
  const tipo = obtenerTexto(valor) as TipoDocumento;

  return TIPOS_PERMITIDOS.includes(tipo) ? tipo : "OTRO";
}

async function verificarProducto(productoId: number) {
  return prisma.producto.findUnique({
    where: {
      id: productoId,
    },
    select: {
      id: true,
      slug: true,
    },
  });
}

export async function GET(
  _request: Request,
  context: RouteContext,
) {
  try {
    await requerirAdmin();

    const { id } = await context.params;
    const productoId = obtenerProductoId(id);

    if (!productoId) {
      return NextResponse.json(
        {
          error: "Producto inválido.",
        },
        {
          status: 400,
        },
      );
    }

    const producto = await verificarProducto(productoId);

    if (!producto) {
      return NextResponse.json(
        {
          error: "El producto no existe.",
        },
        {
          status: 404,
        },
      );
    }

    const documentos = await prisma.productoDocumento.findMany({
      where: {
        productoId,
      },
      orderBy: [
        {
          orden: "asc",
        },
        {
          id: "asc",
        },
      ],
    });

    return NextResponse.json(documentos);
  } catch (error) {
    console.error("Error obteniendo documentos:", error);

    return NextResponse.json(
      {
        error: "No se pudieron obtener los documentos.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(
  request: Request,
  context: RouteContext,
) {
  try {
    await requerirAdmin();

    const { id } = await context.params;
    const productoId = obtenerProductoId(id);

    if (!productoId) {
      return NextResponse.json(
        {
          error: "Producto inválido.",
        },
        {
          status: 400,
        },
      );
    }

    const producto = await verificarProducto(productoId);

    if (!producto) {
      return NextResponse.json(
        {
          error: "El producto no existe.",
        },
        {
          status: 404,
        },
      );
    }

    const body = (await request.json()) as {
      titulo?: unknown;
      tipo?: unknown;
      archivoUrl?: unknown;
      publicId?: unknown;
      visible?: unknown;
    };

    const titulo = obtenerTexto(body.titulo);
    const archivoUrl = obtenerTexto(body.archivoUrl);
    const publicId = obtenerTexto(body.publicId);
    const tipo = obtenerTipoDocumento(body.tipo);
    const visible =
      typeof body.visible === "boolean" ? body.visible : true;

    if (!titulo) {
      return NextResponse.json(
        {
          error: "El título del documento es obligatorio.",
        },
        {
          status: 400,
        },
      );
    }

    if (!archivoUrl) {
      return NextResponse.json(
        {
          error: "La URL del documento es obligatoria.",
        },
        {
          status: 400,
        },
      );
    }

    if (!publicId) {
      return NextResponse.json(
        {
          error: "El identificador de Cloudinary es obligatorio.",
        },
        {
          status: 400,
        },
      );
    }

    const ultimoDocumento =
      await prisma.productoDocumento.findFirst({
        where: {
          productoId,
        },
        orderBy: {
          orden: "desc",
        },
        select: {
          orden: true,
        },
      });

    const documento = await prisma.productoDocumento.create({
      data: {
        productoId,
        titulo,
        tipo,
        archivoUrl,
        publicId,
        visible,
        orden: (ultimoDocumento?.orden ?? -1) + 1,
      },
    });

    return NextResponse.json(documento, {
      status: 201,
    });
  } catch (error) {
    console.error("Error guardando documento:", error);

    return NextResponse.json(
      {
        error: "No se pudo guardar el documento.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function PATCH(
  request: Request,
  context: RouteContext,
) {
  try {
    await requerirAdmin();

    const { id } = await context.params;
    const productoId = obtenerProductoId(id);

    if (!productoId) {
      return NextResponse.json(
        {
          error: "Producto inválido.",
        },
        {
          status: 400,
        },
      );
    }

    const body = (await request.json()) as {
      documentoId?: unknown;
      accion?: unknown;
      titulo?: unknown;
      tipo?: unknown;
      visible?: unknown;
    };

    const documentoId = obtenerNumero(body.documentoId);
    const accion = obtenerTexto(body.accion);

    if (!documentoId) {
      return NextResponse.json(
        {
          error: "Documento inválido.",
        },
        {
          status: 400,
        },
      );
    }

    const documento = await prisma.productoDocumento.findFirst({
      where: {
        id: documentoId,
        productoId,
      },
    });

    if (!documento) {
      return NextResponse.json(
        {
          error: "El documento no existe.",
        },
        {
          status: 404,
        },
      );
    }

    if (accion === "editar") {
      const titulo = obtenerTexto(body.titulo);
      const tipo = obtenerTipoDocumento(body.tipo);

      if (!titulo) {
        return NextResponse.json(
          {
            error: "El título del documento es obligatorio.",
          },
          {
            status: 400,
          },
        );
      }

      const documentoActualizado =
        await prisma.productoDocumento.update({
          where: {
            id: documento.id,
          },
          data: {
            titulo,
            tipo,
          },
        });

      return NextResponse.json(documentoActualizado);
    }

    if (accion === "visibilidad") {
      if (typeof body.visible !== "boolean") {
        return NextResponse.json(
          {
            error: "La visibilidad enviada no es válida.",
          },
          {
            status: 400,
          },
        );
      }

      const documentoActualizado =
        await prisma.productoDocumento.update({
          where: {
            id: documento.id,
          },
          data: {
            visible: body.visible,
          },
        });

      return NextResponse.json(documentoActualizado);
    }

    if (accion === "subir" || accion === "bajar") {
      const direccion = accion === "subir" ? -1 : 1;

      const documentoVecino =
        await prisma.productoDocumento.findFirst({
          where: {
            productoId,
            orden:
              direccion === -1
                ? {
                    lt: documento.orden,
                  }
                : {
                    gt: documento.orden,
                  },
          },
          orderBy: {
            orden: direccion === -1 ? "desc" : "asc",
          },
        });

      if (!documentoVecino) {
        return NextResponse.json({
          ok: true,
        });
      }

      await prisma.$transaction([
        prisma.productoDocumento.update({
          where: {
            id: documento.id,
          },
          data: {
            orden: documentoVecino.orden,
          },
        }),

        prisma.productoDocumento.update({
          where: {
            id: documentoVecino.id,
          },
          data: {
            orden: documento.orden,
          },
        }),
      ]);

      return NextResponse.json({
        ok: true,
      });
    }

    return NextResponse.json(
      {
        error: "Acción no válida.",
      },
      {
        status: 400,
      },
    );
  } catch (error) {
    console.error("Error actualizando documento:", error);

    return NextResponse.json(
      {
        error: "No se pudo actualizar el documento.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function DELETE(
  request: Request,
  context: RouteContext,
) {
  try {
    await requerirAdmin();

    const { id } = await context.params;
    const productoId = obtenerProductoId(id);

    if (!productoId) {
      return NextResponse.json(
        {
          error: "Producto inválido.",
        },
        {
          status: 400,
        },
      );
    }

    const body = (await request.json()) as {
      documentoId?: unknown;
    };

    const documentoId = obtenerNumero(body.documentoId);

    if (!documentoId) {
      return NextResponse.json(
        {
          error: "Documento inválido.",
        },
        {
          status: 400,
        },
      );
    }

    const documento = await prisma.productoDocumento.findFirst({
      where: {
        id: documentoId,
        productoId,
      },
    });

    if (!documento) {
      return NextResponse.json(
        {
          error: "El documento no existe.",
        },
        {
          status: 404,
        },
      );
    }

    if (documento.publicId) {
      const cloudinary = getCloudinary();

      try {
        await cloudinary.uploader.destroy(documento.publicId, {
          resource_type: "raw",
          invalidate: true,
        });
      } catch (cloudinaryError) {
        console.error(
          "No se pudo eliminar el documento de Cloudinary:",
          cloudinaryError,
        );
      }
    }

    await prisma.productoDocumento.delete({
      where: {
        id: documento.id,
      },
    });

    const documentosRestantes =
      await prisma.productoDocumento.findMany({
        where: {
          productoId,
        },
        orderBy: [
          {
            orden: "asc",
          },
          {
            id: "asc",
          },
        ],
        select: {
          id: true,
        },
      });

    if (documentosRestantes.length > 0) {
      await prisma.$transaction(
        documentosRestantes.map((item, index) =>
          prisma.productoDocumento.update({
            where: {
              id: item.id,
            },
            data: {
              orden: index,
            },
          }),
        ),
      );
    }

    return NextResponse.json({
      ok: true,
    });
  } catch (error) {
    console.error("Error eliminando documento:", error);

    return NextResponse.json(
      {
        error: "No se pudo eliminar el documento.",
      },
      {
        status: 500,
      },
    );
  }
}