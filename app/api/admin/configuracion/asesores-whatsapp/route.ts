import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { requerirAdmin } from "@/lib/auth";
import { getCloudinary } from "@/lib/cloudinary";
import prisma from "@/lib/prisma";

function obtenerTexto(valor: unknown) {
  return typeof valor === "string"
    ? valor.trim()
    : "";
}

function limpiarTelefono(valor: string) {
  return valor.replace(/\D/g, "");
}

function obtenerBooleano(
  valor: unknown,
  predeterminado = true
) {
  return typeof valor === "boolean"
    ? valor
    : predeterminado;
}

function revalidar() {
  revalidatePath("/");
  revalidatePath("/productos");
  revalidatePath("/admin/configuracion");
}

async function eliminarImagenCloudinary(
  publicId: string | null
) {
  if (!publicId) {
    return;
  }

  try {
    await getCloudinary().api.delete_resources(
      [publicId],
      {
        resource_type: "image",
      }
    );
  } catch (error) {
    console.error(
      "No se pudo eliminar la imagen del asesor:",
      error
    );
  }
}

export async function GET() {
  try {
    await requerirAdmin();

    const asesores =
      await prisma.asesorWhatsApp.findMany({
        orderBy: [
          {
            orden: "asc",
          },
          {
            id: "asc",
          },
        ],
      });

    return NextResponse.json(asesores);
  } catch (error) {
    console.error(
      "Error cargando asesores de WhatsApp:",
      error
    );

    return NextResponse.json(
      {
        error:
          "No se pudieron cargar los asesores.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(
  request: Request
) {
  try {
    await requerirAdmin();

    const body = (await request.json()) as {
      nombre?: unknown;
      cargo?: unknown;
      telefono?: unknown;
      imagenUrl?: unknown;
      imagenPublicId?: unknown;
      activo?: unknown;
    };

    const nombre = obtenerTexto(
      body.nombre
    );

    const cargo = obtenerTexto(
      body.cargo
    );

    const telefono = limpiarTelefono(
      obtenerTexto(body.telefono)
    );

    const imagenUrl = obtenerTexto(
      body.imagenUrl
    );

    const imagenPublicId = obtenerTexto(
      body.imagenPublicId
    );

    const activo = obtenerBooleano(
      body.activo
    );

    if (!nombre) {
      return NextResponse.json(
        {
          error:
            "El nombre del asesor es obligatorio.",
        },
        {
          status: 400,
        }
      );
    }

    if (!telefono) {
      return NextResponse.json(
        {
          error:
            "El número de WhatsApp es obligatorio.",
        },
        {
          status: 400,
        }
      );
    }

    const ultimo =
      await prisma.asesorWhatsApp.findFirst({
        orderBy: {
          orden: "desc",
        },
        select: {
          orden: true,
        },
      });

    const asesor =
      await prisma.asesorWhatsApp.create({
        data: {
          nombre,
          cargo: cargo || null,
          telefono,
          imagenUrl: imagenUrl || null,
          imagenPublicId:
            imagenPublicId || null,
          activo,
          orden: (ultimo?.orden ?? -1) + 1,
        },
      });

    revalidar();

    return NextResponse.json(asesor, {
      status: 201,
    });
  } catch (error) {
    console.error(
      "Error creando asesor de WhatsApp:",
      error
    );

    return NextResponse.json(
      {
        error:
          "No se pudo crear el asesor.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PATCH(
  request: Request
) {
  try {
    await requerirAdmin();

    const body = (await request.json()) as {
      asesorId?: unknown;
      accion?: unknown;
      nombre?: unknown;
      cargo?: unknown;
      telefono?: unknown;
      imagenUrl?: unknown;
      imagenPublicId?: unknown;
      activo?: unknown;
    };

    const asesorId = Number(
      body.asesorId
    );

    const accion = obtenerTexto(
      body.accion
    );

    if (
      !Number.isInteger(asesorId) ||
      asesorId <= 0
    ) {
      return NextResponse.json(
        {
          error: "Asesor inválido.",
        },
        {
          status: 400,
        }
      );
    }

    const asesorActual =
      await prisma.asesorWhatsApp.findUnique({
        where: {
          id: asesorId,
        },
      });

    if (!asesorActual) {
      return NextResponse.json(
        {
          error: "El asesor no existe.",
        },
        {
          status: 404,
        }
      );
    }

    if (accion === "editar") {
      const nombre = obtenerTexto(
        body.nombre
      );

      const cargo = obtenerTexto(
        body.cargo
      );

      const telefono = limpiarTelefono(
        obtenerTexto(body.telefono)
      );

      const imagenUrl = obtenerTexto(
        body.imagenUrl
      );

      const imagenPublicId =
        obtenerTexto(
          body.imagenPublicId
        );

      const activo = obtenerBooleano(
        body.activo,
        asesorActual.activo
      );

      if (!nombre) {
        return NextResponse.json(
          {
            error:
              "El nombre del asesor es obligatorio.",
          },
          {
            status: 400,
          }
        );
      }

      if (!telefono) {
        return NextResponse.json(
          {
            error:
              "El número de WhatsApp es obligatorio.",
          },
          {
            status: 400,
          }
        );
      }

      const asesor =
        await prisma.asesorWhatsApp.update({
          where: {
            id: asesorId,
          },
          data: {
            nombre,
            cargo: cargo || null,
            telefono,
            imagenUrl: imagenUrl || null,
            imagenPublicId:
              imagenPublicId || null,
            activo,
          },
        });

      if (
        asesorActual.imagenPublicId &&
        asesorActual.imagenPublicId !==
          asesor.imagenPublicId
      ) {
        await eliminarImagenCloudinary(
          asesorActual.imagenPublicId
        );
      }

      revalidar();

      return NextResponse.json(asesor);
    }

    if (accion === "activar") {
      const asesor =
        await prisma.asesorWhatsApp.update({
          where: {
            id: asesorId,
          },
          data: {
            activo: true,
          },
        });

      revalidar();

      return NextResponse.json(asesor);
    }

    if (accion === "desactivar") {
      const asesor =
        await prisma.asesorWhatsApp.update({
          where: {
            id: asesorId,
          },
          data: {
            activo: false,
          },
        });

      revalidar();

      return NextResponse.json(asesor);
    }

    if (
      accion !== "subir" &&
      accion !== "bajar"
    ) {
      return NextResponse.json(
        {
          error: "Acción inválida.",
        },
        {
          status: 400,
        }
      );
    }

    const asesores =
      await prisma.asesorWhatsApp.findMany({
        orderBy: [
          {
            orden: "asc",
          },
          {
            id: "asc",
          },
        ],
      });

    const indiceActual =
      asesores.findIndex(
        (item) => item.id === asesorId
      );

    const indiceDestino =
      accion === "subir"
        ? indiceActual - 1
        : indiceActual + 1;

    if (
      indiceActual === -1 ||
      indiceDestino < 0 ||
      indiceDestino >= asesores.length
    ) {
      return NextResponse.json({
        success: true,
      });
    }

    const asesorDestino =
      asesores[indiceDestino];

    await prisma.$transaction([
      prisma.asesorWhatsApp.update({
        where: {
          id: asesorActual.id,
        },
        data: {
          orden: asesorDestino.orden,
        },
      }),

      prisma.asesorWhatsApp.update({
        where: {
          id: asesorDestino.id,
        },
        data: {
          orden: asesorActual.orden,
        },
      }),
    ]);

    revalidar();

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Error actualizando asesor de WhatsApp:",
      error
    );

    return NextResponse.json(
      {
        error:
          "No se pudo actualizar el asesor.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  request: Request
) {
  try {
    await requerirAdmin();

    const body = (await request.json()) as {
      asesorId?: unknown;
    };

    const asesorId = Number(
      body.asesorId
    );

    if (
      !Number.isInteger(asesorId) ||
      asesorId <= 0
    ) {
      return NextResponse.json(
        {
          error: "Asesor inválido.",
        },
        {
          status: 400,
        }
      );
    }

    const asesor =
      await prisma.asesorWhatsApp.findUnique({
        where: {
          id: asesorId,
        },
      });

    if (!asesor) {
      return NextResponse.json(
        {
          error: "El asesor no existe.",
        },
        {
          status: 404,
        }
      );
    }

    await prisma.asesorWhatsApp.delete({
      where: {
        id: asesorId,
      },
    });

    await eliminarImagenCloudinary(
      asesor.imagenPublicId
    );

    const restantes =
      await prisma.asesorWhatsApp.findMany({
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

    if (restantes.length > 0) {
      await prisma.$transaction(
        restantes.map((item, indice) =>
          prisma.asesorWhatsApp.update({
            where: {
              id: item.id,
            },
            data: {
              orden: indice,
            },
          })
        )
      );
    }

    revalidar();

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Error eliminando asesor de WhatsApp:",
      error
    );

    return NextResponse.json(
      {
        error:
          "No se pudo eliminar el asesor.",
      },
      {
        status: 500,
      }
    );
  }
}