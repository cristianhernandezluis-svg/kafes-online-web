import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { requerirAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function obtenerProductoId(id: string) {
  const productoId = Number(id);

  if (
    !Number.isInteger(productoId) ||
    productoId <= 0
  ) {
    return null;
  }

  return productoId;
}

function obtenerTexto(valor: unknown) {
  return typeof valor === "string"
    ? valor.trim()
    : "";
}

async function obtenerProducto(
  productoId: number
) {
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
  context: RouteContext
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
        }
      );
    }

    const producto =
      await obtenerProducto(productoId);

    if (!producto) {
      return NextResponse.json(
        {
          error: "El producto no existe.",
        },
        {
          status: 404,
        }
      );
    }

    const beneficios =
      await prisma.productoBeneficio.findMany({
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

    return NextResponse.json(beneficios);
  } catch (error) {
    console.error(
      "Error cargando beneficios:",
      error
    );

    return NextResponse.json(
      {
        error:
          "No se pudieron cargar los beneficios.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(
  request: Request,
  context: RouteContext
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
        }
      );
    }

    const body = (await request.json()) as {
      titulo?: unknown;
      descripcion?: unknown;
      icono?: unknown;
    };

    const titulo = obtenerTexto(body.titulo);
    const descripcion = obtenerTexto(
      body.descripcion
    );
    const icono = obtenerTexto(body.icono);

    if (!titulo) {
      return NextResponse.json(
        {
          error:
            "El título del beneficio es obligatorio.",
        },
        {
          status: 400,
        }
      );
    }

    const producto =
      await obtenerProducto(productoId);

    if (!producto) {
      return NextResponse.json(
        {
          error: "El producto no existe.",
        },
        {
          status: 404,
        }
      );
    }

    const ultimoBeneficio =
      await prisma.productoBeneficio.findFirst({
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

    const beneficio =
      await prisma.productoBeneficio.create({
        data: {
          productoId,
          titulo,
          descripcion: descripcion || null,
          icono: icono || null,
          orden:
            (ultimoBeneficio?.orden ?? -1) + 1,
        },
      });

    revalidatePath(
      `/producto/${producto.slug}`
    );

    return NextResponse.json(beneficio, {
      status: 201,
    });
  } catch (error) {
    console.error(
      "Error creando beneficio:",
      error
    );

    return NextResponse.json(
      {
        error:
          "No se pudo crear el beneficio.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PATCH(
  request: Request,
  context: RouteContext
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
        }
      );
    }

    const body = (await request.json()) as {
      beneficioId?: unknown;
      accion?: unknown;
      titulo?: unknown;
      descripcion?: unknown;
      icono?: unknown;
    };

    const beneficioId = Number(
      body.beneficioId
    );

    const accion = obtenerTexto(body.accion);

    if (
      !Number.isInteger(beneficioId) ||
      beneficioId <= 0
    ) {
      return NextResponse.json(
        {
          error: "Beneficio inválido.",
        },
        {
          status: 400,
        }
      );
    }

    const producto =
      await obtenerProducto(productoId);

    if (!producto) {
      return NextResponse.json(
        {
          error: "El producto no existe.",
        },
        {
          status: 404,
        }
      );
    }

    const beneficioActual =
      await prisma.productoBeneficio.findFirst({
        where: {
          id: beneficioId,
          productoId,
        },
      });

    if (!beneficioActual) {
      return NextResponse.json(
        {
          error: "El beneficio no existe.",
        },
        {
          status: 404,
        }
      );
    }

    if (accion === "editar") {
      const titulo = obtenerTexto(
        body.titulo
      );

      const descripcion = obtenerTexto(
        body.descripcion
      );

      const icono = obtenerTexto(
        body.icono
      );

      if (!titulo) {
        return NextResponse.json(
          {
            error:
              "El título del beneficio es obligatorio.",
          },
          {
            status: 400,
          }
        );
      }

      const beneficio =
        await prisma.productoBeneficio.update({
          where: {
            id: beneficioId,
          },
          data: {
            titulo,
            descripcion: descripcion || null,
            icono: icono || null,
          },
        });

      revalidatePath(
        `/producto/${producto.slug}`
      );

      return NextResponse.json(beneficio);
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

    const beneficios =
      await prisma.productoBeneficio.findMany({
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

    const indiceActual =
      beneficios.findIndex(
        (item) => item.id === beneficioId
      );

    const indiceDestino =
      accion === "subir"
        ? indiceActual - 1
        : indiceActual + 1;

    if (
      indiceActual === -1 ||
      indiceDestino < 0 ||
      indiceDestino >= beneficios.length
    ) {
      return NextResponse.json({
        success: true,
      });
    }

    const beneficioDestino =
      beneficios[indiceDestino];

    await prisma.$transaction([
      prisma.productoBeneficio.update({
        where: {
          id: beneficioActual.id,
        },
        data: {
          orden: beneficioDestino.orden,
        },
      }),

      prisma.productoBeneficio.update({
        where: {
          id: beneficioDestino.id,
        },
        data: {
          orden: beneficioActual.orden,
        },
      }),
    ]);

    revalidatePath(
      `/producto/${producto.slug}`
    );

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Error actualizando beneficio:",
      error
    );

    return NextResponse.json(
      {
        error:
          "No se pudo actualizar el beneficio.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  request: Request,
  context: RouteContext
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
        }
      );
    }

    const body = (await request.json()) as {
      beneficioId?: unknown;
    };

    const beneficioId = Number(
      body.beneficioId
    );

    if (
      !Number.isInteger(beneficioId) ||
      beneficioId <= 0
    ) {
      return NextResponse.json(
        {
          error: "Beneficio inválido.",
        },
        {
          status: 400,
        }
      );
    }

    const producto =
      await obtenerProducto(productoId);

    if (!producto) {
      return NextResponse.json(
        {
          error: "El producto no existe.",
        },
        {
          status: 404,
        }
      );
    }

    const beneficio =
      await prisma.productoBeneficio.findFirst({
        where: {
          id: beneficioId,
          productoId,
        },
        select: {
          id: true,
        },
      });

    if (!beneficio) {
      return NextResponse.json(
        {
          error: "El beneficio no existe.",
        },
        {
          status: 404,
        }
      );
    }

    await prisma.productoBeneficio.delete({
      where: {
        id: beneficio.id,
      },
    });

    const restantes =
      await prisma.productoBeneficio.findMany({
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

    await prisma.$transaction(
      restantes.map((item, indice) =>
        prisma.productoBeneficio.update({
          where: {
            id: item.id,
          },
          data: {
            orden: indice,
          },
        })
      )
    );

    revalidatePath(
      `/producto/${producto.slug}`
    );

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Error eliminando beneficio:",
      error
    );

    return NextResponse.json(
      {
        error:
          "No se pudo eliminar el beneficio.",
      },
      {
        status: 500,
      }
    );
  }
}