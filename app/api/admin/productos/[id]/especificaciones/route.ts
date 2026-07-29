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

  if (!Number.isInteger(productoId) || productoId <= 0) {
    return null;
  }

  return productoId;
}

function obtenerTexto(valor: unknown) {
  return typeof valor === "string" ? valor.trim() : "";
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
        {
          error: "El producto no existe.",
        },
        {
          status: 404,
        },
      );
    }

    const especificaciones =
      await prisma.productoFichaTecnica.findMany({
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

    return NextResponse.json(especificaciones);
  } catch (error) {
    console.error("Error cargando especificaciones:", error);

    return NextResponse.json(
      {
        error: "No se pudieron cargar las especificaciones.",
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

    const body = (await request.json()) as {
      nombre?: unknown;
      valor?: unknown;
    };

    const nombre = obtenerTexto(body.nombre);
    const valor = obtenerTexto(body.valor);

    if (!nombre) {
      return NextResponse.json(
        {
          error: "El nombre de la característica es obligatorio.",
        },
        {
          status: 400,
        },
      );
    }

    if (!valor) {
      return NextResponse.json(
        {
          error: "El valor de la característica es obligatorio.",
        },
        {
          status: 400,
        },
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
        {
          error: "El producto no existe.",
        },
        {
          status: 404,
        },
      );
    }

    const ultimaEspecificacion =
      await prisma.productoFichaTecnica.findFirst({
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

    const especificacion =
      await prisma.productoFichaTecnica.create({
        data: {
          productoId,
          nombre,
          valor,
          orden: (ultimaEspecificacion?.orden ?? -1) + 1,
        },
      });

    return NextResponse.json(especificacion, {
      status: 201,
    });
  } catch (error) {
    console.error("Error creando especificación:", error);

    return NextResponse.json(
      {
        error: "No se pudo crear la especificación.",
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
      especificacionId?: unknown;
      accion?: unknown;
      nombre?: unknown;
      valor?: unknown;
    };

    const especificacionId = Number(body.especificacionId);
    const accion = obtenerTexto(body.accion);

    if (
      !Number.isInteger(especificacionId) ||
      especificacionId <= 0
    ) {
      return NextResponse.json(
        {
          error: "Especificación inválida.",
        },
        {
          status: 400,
        },
      );
    }

    const especificacionActual =
      await prisma.productoFichaTecnica.findFirst({
        where: {
          id: especificacionId,
          productoId,
        },
      });

    if (!especificacionActual) {
      return NextResponse.json(
        {
          error: "La especificación no existe.",
        },
        {
          status: 404,
        },
      );
    }

    if (accion === "editar") {
      const nombre = obtenerTexto(body.nombre);
      const valor = obtenerTexto(body.valor);

      if (!nombre || !valor) {
        return NextResponse.json(
          {
            error: "El nombre y el valor son obligatorios.",
          },
          {
            status: 400,
          },
        );
      }

      const especificacion =
        await prisma.productoFichaTecnica.update({
          where: {
            id: especificacionId,
          },
          data: {
            nombre,
            valor,
          },
        });

      return NextResponse.json(especificacion);
    }

    if (accion !== "subir" && accion !== "bajar") {
      return NextResponse.json(
        {
          error: "Acción inválida.",
        },
        {
          status: 400,
        },
      );
    }

    const especificaciones =
      await prisma.productoFichaTecnica.findMany({
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

    const indiceActual = especificaciones.findIndex(
      (item) => item.id === especificacionId,
    );

    const indiceDestino =
      accion === "subir"
        ? indiceActual - 1
        : indiceActual + 1;

    if (
      indiceActual === -1 ||
      indiceDestino < 0 ||
      indiceDestino >= especificaciones.length
    ) {
      return NextResponse.json({
        success: true,
      });
    }

    const elementoDestino = especificaciones[indiceDestino];

    await prisma.$transaction([
      prisma.productoFichaTecnica.update({
        where: {
          id: especificacionActual.id,
        },
        data: {
          orden: elementoDestino.orden,
        },
      }),

      prisma.productoFichaTecnica.update({
        where: {
          id: elementoDestino.id,
        },
        data: {
          orden: especificacionActual.orden,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Error actualizando especificación:", error);

    return NextResponse.json(
      {
        error: "No se pudo actualizar la especificación.",
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
      especificacionId?: unknown;
    };

    const especificacionId = Number(body.especificacionId);

    if (
      !Number.isInteger(especificacionId) ||
      especificacionId <= 0
    ) {
      return NextResponse.json(
        {
          error: "Especificación inválida.",
        },
        {
          status: 400,
        },
      );
    }

    const especificacion =
      await prisma.productoFichaTecnica.findFirst({
        where: {
          id: especificacionId,
          productoId,
        },
        select: {
          id: true,
        },
      });

    if (!especificacion) {
      return NextResponse.json(
        {
          error: "La especificación no existe.",
        },
        {
          status: 404,
        },
      );
    }

    await prisma.productoFichaTecnica.delete({
      where: {
        id: especificacion.id,
      },
    });

    const restantes =
      await prisma.productoFichaTecnica.findMany({
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
      restantes.map((item, index) =>
        prisma.productoFichaTecnica.update({
          where: {
            id: item.id,
          },
          data: {
            orden: index,
          },
        }),
      ),
    );

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Error eliminando especificación:", error);

    return NextResponse.json(
      {
        error: "No se pudo eliminar la especificación.",
      },
      {
        status: 500,
      },
    );
  }
}