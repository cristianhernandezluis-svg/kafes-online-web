import { NextResponse } from "next/server";
import { requerirAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  _request: Request,
  { params }: Params
) {
  await requerirAdmin();

  const { id } = await params;
  const productoId = Number(id);

  if (!Number.isInteger(productoId) || productoId <= 0) {
    return NextResponse.json(
      { error: "Producto inválido." },
      { status: 400 }
    );
  }

  const secciones = await prisma.productoSeccion.findMany({
    where: {
      productoId,
      tipo: {
        in: ["LANDING_CONFIG", "LANDING_IMAGEN"],
      },
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

  return NextResponse.json(secciones);
}

export async function POST(
  request: Request,
  { params }: Params
) {
  await requerirAdmin();

  const { id } = await params;
  const productoId = Number(id);

  if (!Number.isInteger(productoId) || productoId <= 0) {
    return NextResponse.json(
      { error: "Producto inválido." },
      { status: 400 }
    );
  }

  const body = await request.json();

  if (body.accion === "configuracion") {
    const activo = Boolean(body.activo);

    const existente = await prisma.productoSeccion.findFirst({
      where: {
        productoId,
        tipo: "LANDING_CONFIG",
      },
    });

    if (existente) {
      const actualizado = await prisma.productoSeccion.update({
        where: {
          id: existente.id,
        },
        data: {
          configuracion: {
            activo,
          },
        },
      });

      return NextResponse.json(actualizado);
    }

    const creado = await prisma.productoSeccion.create({
      data: {
        productoId,
        tipo: "LANDING_CONFIG",
        configuracion: {
          activo,
        },
        orden: -1,
        visible: true,
      },
    });

    return NextResponse.json(creado);
  }

  const imagenUrl = String(body.imagenUrl ?? "").trim();
  const publicId = String(body.publicId ?? "").trim();

  if (!imagenUrl) {
    return NextResponse.json(
      { error: "La imagen es obligatoria." },
      { status: 400 }
    );
  }

  const ultima = await prisma.productoSeccion.findFirst({
    where: {
      productoId,
      tipo: "LANDING_IMAGEN",
    },
    orderBy: {
      orden: "desc",
    },
  });

  const mostrarBoton =
    body.mostrarBoton === undefined
      ? true
      : Boolean(body.mostrarBoton);

  const creada = await prisma.productoSeccion.create({
    data: {
      productoId,
      tipo: "LANDING_IMAGEN",
      imagenUrl,
      orden: (ultima?.orden ?? -1) + 1,
      visible: true,
      configuracion: {
        mostrarBoton,
        publicId: publicId || null,
      },
    },
  });

  return NextResponse.json(creada);
}

export async function PATCH(
  request: Request,
  { params }: Params
) {
  await requerirAdmin();

  const { id } = await params;
  const productoId = Number(id);

  if (!Number.isInteger(productoId) || productoId <= 0) {
    return NextResponse.json(
      { error: "Producto inválido." },
      { status: 400 }
    );
  }

  const body = await request.json();

  if (body.accion === "ordenar") {
    const ids: number[] = Array.isArray(body.ids)
  ? body.ids.map((valor: unknown) => Number(valor))
  : [];

await prisma.$transaction(
  ids.map((id: number, index: number) =>
        prisma.productoSeccion.updateMany({
          where: {
            id,
            productoId,
            tipo: "LANDING_IMAGEN",
          },
          data: {
            orden: index,
          },
        })
      )
    );

    return NextResponse.json({
      ok: true,
    });
  }

  if (body.accion === "boton") {
    const seccionId = Number(body.seccionId);
    const mostrarBoton = Boolean(body.mostrarBoton);

    const seccion = await prisma.productoSeccion.findFirst({
      where: {
        id: seccionId,
        productoId,
        tipo: "LANDING_IMAGEN",
      },
    });

    if (!seccion) {
      return NextResponse.json(
        { error: "Sección no encontrada." },
        { status: 404 }
      );
    }

    const configuracionActual =
      seccion.configuracion &&
      typeof seccion.configuracion === "object"
        ? seccion.configuracion
        : {};

    const actualizada = await prisma.productoSeccion.update({
      where: {
        id: seccionId,
      },
      data: {
        configuracion: {
          ...(configuracionActual as Record<string, unknown>),
          mostrarBoton,
        },
      },
    });

    return NextResponse.json(actualizada);
  }

  return NextResponse.json(
    { error: "Acción no válida." },
    { status: 400 }
  );
}

export async function DELETE(
  request: Request,
  { params }: Params
) {
  await requerirAdmin();

  const { id } = await params;
  const productoId = Number(id);

  if (!Number.isInteger(productoId) || productoId <= 0) {
    return NextResponse.json(
      { error: "Producto inválido." },
      { status: 400 }
    );
  }

  const body = await request.json();
  const seccionId = Number(body.seccionId);

  if (!Number.isInteger(seccionId) || seccionId <= 0) {
    return NextResponse.json(
      { error: "Sección inválida." },
      { status: 400 }
    );
  }

  await prisma.productoSeccion.deleteMany({
    where: {
      id: seccionId,
      productoId,
      tipo: "LANDING_IMAGEN",
    },
  });

  return NextResponse.json({
    ok: true,
  });
}