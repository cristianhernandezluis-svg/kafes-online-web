import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCloudinary } from "@/lib/cloudinary";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  _request: Request,
  context: RouteContext,
) {
  try {
    const { id } = await context.params;
    const productoId = Number(id);

    if (!Number.isInteger(productoId)) {
      return NextResponse.json(
        { error: "Producto inválido." },
        { status: 400 },
      );
    }

    const imagenes = await prisma.productoImagen.findMany({
      where: {
        productoId,
      },
      orderBy: {
        orden: "asc",
      },
    });

    return NextResponse.json(imagenes);
  } catch (error) {
    console.error("Error obteniendo imágenes:", error);

    return NextResponse.json(
      { error: "No se pudieron obtener las imágenes." },
      { status: 500 },
    );
  }
}

export async function POST(
  request: Request,
  context: RouteContext,
) {
  try {
    const { id } = await context.params;
    const productoId = Number(id);

    const body = (await request.json()) as {
      url?: string;
      publicId?: string;
      alt?: string;
    };

    if (
      !Number.isInteger(productoId) ||
      !body.url ||
      !body.publicId
    ) {
      return NextResponse.json(
        { error: "Información de imagen incompleta." },
        { status: 400 },
      );
    }

    const producto = await prisma.producto.findUnique({
      where: {
        id: productoId,
      },
      select: {
        id: true,
      },
    });

    if (!producto) {
      return NextResponse.json(
        { error: "El producto no existe." },
        { status: 404 },
      );
    }

    const cantidad = await prisma.productoImagen.count({
      where: {
        productoId,
      },
    });

    const imagen = await prisma.productoImagen.create({
      data: {
        productoId,
        url: body.url,
        publicId: body.publicId,
        alt: body.alt?.trim() || null,
        orden: cantidad,
        esPrincipal: cantidad === 0,
      },
    });

    return NextResponse.json(imagen, { status: 201 });
  } catch (error) {
    console.error("Error guardando imagen:", error);

    return NextResponse.json(
      { error: "No se pudo guardar la imagen." },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  context: RouteContext,
) {
  try {
    const { id } = await context.params;
    const productoId = Number(id);

    const body = (await request.json()) as {
      imagenId?: number;
      accion?: "principal" | "subir" | "bajar";
    };

    const imagenId = Number(body.imagenId);

    if (
      !Number.isInteger(productoId) ||
      !Number.isInteger(imagenId)
    ) {
      return NextResponse.json(
        { error: "Información inválida." },
        { status: 400 },
      );
    }

    const imagen = await prisma.productoImagen.findFirst({
      where: {
        id: imagenId,
        productoId,
      },
    });

    if (!imagen) {
      return NextResponse.json(
        { error: "La imagen no existe." },
        { status: 404 },
      );
    }

    if (body.accion === "principal") {
      await prisma.$transaction([
        prisma.productoImagen.updateMany({
          where: {
            productoId,
          },
          data: {
            esPrincipal: false,
          },
        }),

        prisma.productoImagen.update({
          where: {
            id: imagenId,
          },
          data: {
            esPrincipal: true,
          },
        }),
      ]);
    }

    if (body.accion === "subir" || body.accion === "bajar") {
      const direccion = body.accion === "subir" ? -1 : 1;

      const vecina = await prisma.productoImagen.findFirst({
        where: {
          productoId,
          orden:
            direccion === -1
              ? { lt: imagen.orden }
              : { gt: imagen.orden },
        },
        orderBy: {
          orden: direccion === -1 ? "desc" : "asc",
        },
      });

      if (vecina) {
        await prisma.$transaction([
          prisma.productoImagen.update({
            where: {
              id: imagen.id,
            },
            data: {
              orden: vecina.orden,
            },
          }),

          prisma.productoImagen.update({
            where: {
              id: vecina.id,
            },
            data: {
              orden: imagen.orden,
            },
          }),
        ]);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error actualizando imagen:", error);

    return NextResponse.json(
      { error: "No se pudo actualizar la imagen." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  context: RouteContext,
) {
  try {
    const { id } = await context.params;
    const productoId = Number(id);

    const body = (await request.json()) as {
      imagenId?: number;
    };

    const imagenId = Number(body.imagenId);

    const imagen = await prisma.productoImagen.findFirst({
      where: {
        id: imagenId,
        productoId,
      },
    });

    if (!imagen) {
      return NextResponse.json(
        { error: "La imagen no existe." },
        { status: 404 },
      );
    }

    if (imagen.publicId) {
      const cloudinary = getCloudinary();

await cloudinary.uploader.destroy(imagen.publicId, {
  invalidate: true,
  resource_type: "image",
});
    }

    await prisma.productoImagen.delete({
      where: {
        id: imagen.id,
      },
    });

    if (imagen.esPrincipal) {
      const primeraImagen = await prisma.productoImagen.findFirst({
        where: {
          productoId,
        },
        orderBy: {
          orden: "asc",
        },
      });

      if (primeraImagen) {
        await prisma.productoImagen.update({
          where: {
            id: primeraImagen.id,
          },
          data: {
            esPrincipal: true,
          },
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error eliminando imagen:", error);

    return NextResponse.json(
      { error: "No se pudo eliminar la imagen." },
      { status: 500 },
    );
  }
}