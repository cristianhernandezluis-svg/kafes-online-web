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

function obtenerBooleano(
  valor: unknown,
  predeterminado = true
) {
  if (typeof valor === "boolean") {
    return valor;
  }

  return predeterminado;
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

    const accesorios =
      await prisma.productoAccesorio.findMany({
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

    return NextResponse.json(accesorios);
  } catch (error) {
    console.error(
      "Error cargando accesorios:",
      error
    );

    return NextResponse.json(
      {
        error:
          "No se pudieron cargar los accesorios.",
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
      nombre?: unknown;
      descripcion?: unknown;
      imagenUrl?: unknown;
      incluido?: unknown;
    };

    const nombre = obtenerTexto(body.nombre);

    const descripcion = obtenerTexto(
      body.descripcion
    );

    const imagenUrl = obtenerTexto(
      body.imagenUrl
    );

    const incluido = obtenerBooleano(
      body.incluido
    );

    if (!nombre) {
      return NextResponse.json(
        {
          error:
            "El nombre del accesorio es obligatorio.",
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

    const ultimoAccesorio =
      await prisma.productoAccesorio.findFirst({
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

    const accesorio =
      await prisma.productoAccesorio.create({
        data: {
          productoId,
          nombre,
          descripcion: descripcion || null,
          imagenUrl: imagenUrl || null,
          incluido,
          orden:
            (ultimoAccesorio?.orden ?? -1) + 1,
        },
      });

    revalidatePath(
      `/producto/${producto.slug}`
    );

    return NextResponse.json(accesorio, {
      status: 201,
    });
  } catch (error) {
    console.error(
      "Error creando accesorio:",
      error
    );

    return NextResponse.json(
      {
        error:
          "No se pudo crear el accesorio.",
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
      accesorioId?: unknown;
      accion?: unknown;
      nombre?: unknown;
      descripcion?: unknown;
      imagenUrl?: unknown;
      incluido?: unknown;
    };

    const accesorioId = Number(
      body.accesorioId
    );

    const accion = obtenerTexto(body.accion);

    if (
      !Number.isInteger(accesorioId) ||
      accesorioId <= 0
    ) {
      return NextResponse.json(
        {
          error: "Accesorio inválido.",
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

    const accesorioActual =
      await prisma.productoAccesorio.findFirst({
        where: {
          id: accesorioId,
          productoId,
        },
      });

    if (!accesorioActual) {
      return NextResponse.json(
        {
          error: "El accesorio no existe.",
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

      const descripcion = obtenerTexto(
        body.descripcion
      );

      const imagenUrl = obtenerTexto(
        body.imagenUrl
      );

      const incluido = obtenerBooleano(
        body.incluido,
        accesorioActual.incluido
      );

      if (!nombre) {
        return NextResponse.json(
          {
            error:
              "El nombre del accesorio es obligatorio.",
          },
          {
            status: 400,
          }
        );
      }

      const accesorio =
        await prisma.productoAccesorio.update({
          where: {
            id: accesorioId,
          },
          data: {
            nombre,
            descripcion: descripcion || null,
            imagenUrl: imagenUrl || null,
            incluido,
          },
        });

      revalidatePath(
        `/producto/${producto.slug}`
      );

      return NextResponse.json(accesorio);
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

    const accesorios =
      await prisma.productoAccesorio.findMany({
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
      accesorios.findIndex(
        (item) => item.id === accesorioId
      );

    const indiceDestino =
      accion === "subir"
        ? indiceActual - 1
        : indiceActual + 1;

    if (
      indiceActual === -1 ||
      indiceDestino < 0 ||
      indiceDestino >= accesorios.length
    ) {
      return NextResponse.json({
        success: true,
      });
    }

    const accesorioDestino =
      accesorios[indiceDestino];

    await prisma.$transaction([
      prisma.productoAccesorio.update({
        where: {
          id: accesorioActual.id,
        },
        data: {
          orden: accesorioDestino.orden,
        },
      }),

      prisma.productoAccesorio.update({
        where: {
          id: accesorioDestino.id,
        },
        data: {
          orden: accesorioActual.orden,
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
      "Error actualizando accesorio:",
      error
    );

    return NextResponse.json(
      {
        error:
          "No se pudo actualizar el accesorio.",
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
      accesorioId?: unknown;
    };

    const accesorioId = Number(
      body.accesorioId
    );

    if (
      !Number.isInteger(accesorioId) ||
      accesorioId <= 0
    ) {
      return NextResponse.json(
        {
          error: "Accesorio inválido.",
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

    const accesorio =
      await prisma.productoAccesorio.findFirst({
        where: {
          id: accesorioId,
          productoId,
        },
        select: {
          id: true,
        },
      });

    if (!accesorio) {
      return NextResponse.json(
        {
          error: "El accesorio no existe.",
        },
        {
          status: 404,
        }
      );
    }

    await prisma.productoAccesorio.delete({
      where: {
        id: accesorio.id,
      },
    });

    const restantes =
      await prisma.productoAccesorio.findMany({
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
        prisma.productoAccesorio.update({
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
      "Error eliminando accesorio:",
      error
    );

    return NextResponse.json(
      {
        error:
          "No se pudo eliminar el accesorio.",
      },
      {
        status: 500,
      }
    );
  }
}