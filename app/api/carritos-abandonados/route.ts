import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type GuardarCarritoBody = {
  sessionId?: string;
  productoId?: number;
  cantidad?: number;
  nombre?: string;
  celular?: string;
  ciudad?: string;
  region?: string;
  direccion?: string;

  ultimoPaso?: string;
  errorPedido?: string;
};

const PASOS_VALIDOS = new Set([
  "CHECKOUT_INICIADO",
  "DATOS_COMPLETOS",
  "INTENTO_PEDIDO",
  "ERROR_PEDIDO",
]);

const ORDEN_PASOS: Record<string, number> = {
  CHECKOUT_INICIADO: 1,
  DATOS_COMPLETOS: 2,
  INTENTO_PEDIDO: 3,
  ERROR_PEDIDO: 4,
  PEDIDO_CREADO: 5,
};

function puedeAvanzarPaso(actual: string | null | undefined, nuevo: string) {
  const pasoActual = actual ?? "CHECKOUT_INICIADO";

  if (pasoActual === "PEDIDO_CREADO") return false;

  if (
    nuevo === "CHECKOUT_INICIADO" &&
    pasoActual !== "CHECKOUT_INICIADO"
  ) {
    return false;
  }

  if (
    nuevo === "DATOS_COMPLETOS" &&
    (pasoActual === "INTENTO_PEDIDO" || pasoActual === "ERROR_PEDIDO")
  ) {
    return false;
  }

  return true;
}

function limpiarTexto(
  valor: unknown,
  maximo = 200,
) {
  return typeof valor === "string"
    ? valor.trim().slice(0, maximo)
    : "";
}

function campoOpcional(
  valor: unknown,
  maximo = 200,
) {
  if (typeof valor !== "string") {
    return undefined;
  }

  const texto = valor
    .trim()
    .slice(0, maximo);

  return texto || null;
}

function obtenerUltimoPaso(
  valor: unknown,
) {
  if (typeof valor !== "string") {
    return undefined;
  }

  const paso = valor
    .trim()
    .toUpperCase();

  return PASOS_VALIDOS.has(paso)
    ? paso
    : undefined;
}

export async function POST(
  request: Request,
) {
  try {
    const body =
      (await request.json()) as GuardarCarritoBody;

    const sessionId = limpiarTexto(
      body.sessionId,
      120,
    );

    const productoId = Number(
      body.productoId,
    );

    const cantidadRecibida = Number(
      body.cantidad ?? 1,
    );

    const cantidad =
      Number.isInteger(
        cantidadRecibida,
      ) && cantidadRecibida > 0
        ? Math.min(
            cantidadRecibida,
            20,
          )
        : 1;

    if (
      !sessionId ||
      !Number.isInteger(productoId) ||
      productoId <= 0
    ) {
      return NextResponse.json(
        {
          ok: false,
          error: "Datos incompletos",
        },
        {
          status: 400,
        },
      );
    }

    const [producto, sesion] =
      await Promise.all([
        prisma.producto.findUnique({
          where: {
            id: productoId,
          },
          select: {
            id: true,
            nombre: true,
            slug: true,
            precio: true,
            imagenes: {
              orderBy: [
                {
                  esPrincipal:
                    "desc",
                },
                {
                  orden: "asc",
                },
              ],
              take: 1,
              select: {
                url: true,
              },
            },
          },
        }),

        prisma.sesionAnalitica.findUnique(
          {
            where: {
              sessionId,
            },
            select: {
              utmSource: true,
              utmMedium: true,
              utmCampaign: true,
              utmContent: true,
              fbclid: true,
              ttclid: true,
            },
          },
        ),
      ]);

    if (!producto) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Producto no encontrado",
        },
        {
          status: 404,
        },
      );
    }

    const precio = Number(
      producto.precio,
    );

    const total = Number(
      (
        precio * cantidad
      ).toFixed(2),
    );

    const ahora = new Date();

    const nombre = campoOpcional(
      body.nombre,
      120,
    );

    const celular = campoOpcional(
      body.celular,
      40,
    );

    const ciudad = campoOpcional(
      body.ciudad,
      120,
    );

    const region = campoOpcional(
      body.region,
      120,
    );

    const direccion = campoOpcional(
      body.direccion,
      300,
    );

    const ultimoPaso =
      obtenerUltimoPaso(
        body.ultimoPaso,
      );

    const errorPedido =
      campoOpcional(
        body.errorPedido,
        1000,
      );

    const carritoExistente = ultimoPaso
      ? await prisma.carritoAbandonado.findUnique({
          where: { sessionId },
          select: { ultimoPaso: true },
        })
      : null;

    const ultimoPasoAceptado =
      ultimoPaso &&
      (!carritoExistente ||
        puedeAvanzarPaso(
          carritoExistente.ultimoPaso,
          ultimoPaso,
        ))
        ? ultimoPaso
        : undefined;

    const datosPaso =
      ultimoPaso ===
      "INTENTO_PEDIDO"
        ? {
            ultimoPaso:
              "INTENTO_PEDIDO",
            intentoPedidoAt: ahora,
            errorPedido: null,
            errorPedidoAt: null,
          }
        : ultimoPaso ===
            "ERROR_PEDIDO"
          ? {
              ultimoPaso:
                "ERROR_PEDIDO",
              errorPedido:
                errorPedido ??
                "Error no especificado",
              errorPedidoAt: ahora,
            }
          : ultimoPaso
            ? {
                ultimoPaso,
              }
            : {};

    const carrito =
      await prisma.carritoAbandonado.upsert(
        {
          where: {
            sessionId,
          },

          create: {
            sessionId,
            productoId:
              producto.id,
            productoNombre:
              producto.nombre,
            productoSlug:
              producto.slug,
            imagenUrl:
              producto.imagenes[0]
                ?.url ?? null,
            precio,
            cantidad,
            total,

            nombre:
              nombre ?? null,
            celular:
              celular ?? null,
            ciudad:
              ciudad ?? null,
            region:
              region ?? null,
            direccion:
              direccion ?? null,

            utmSource:
              sesion?.utmSource ??
              null,
            utmMedium:
              sesion?.utmMedium ??
              null,
            utmCampaign:
              sesion?.utmCampaign ??
              null,
            utmContent:
              sesion?.utmContent ??
              null,
            fbclid:
              sesion?.fbclid ??
              null,
            ttclid:
              sesion?.ttclid ??
              null,

            estado: "ABIERTO",
            ultimoPaso:
              ultimoPaso ??
              "CHECKOUT_INICIADO",

            checkoutIniciadoAt:
              ahora,
            ultimaActividadAt:
              ahora,

            ...(ultimoPaso ===
            "INTENTO_PEDIDO"
              ? {
                  intentoPedidoAt:
                    ahora,
                }
              : {}),

            ...(ultimoPaso ===
            "ERROR_PEDIDO"
              ? {
                  errorPedido:
                    errorPedido ??
                    "Error no especificado",
                  errorPedidoAt:
                    ahora,
                }
              : {}),
          },

          update: {
            productoId:
              producto.id,
            productoNombre:
              producto.nombre,
            productoSlug:
              producto.slug,
            imagenUrl:
              producto.imagenes[0]
                ?.url ?? null,
            precio,
            cantidad,
            total,

            ...(nombre !==
            undefined
              ? {
                  nombre,
                }
              : {}),

            ...(celular !==
            undefined
              ? {
                  celular,
                }
              : {}),

            ...(ciudad !==
            undefined
              ? {
                  ciudad,
                }
              : {}),

            ...(region !==
            undefined
              ? {
                  region,
                }
              : {}),

            ...(direccion !==
            undefined
              ? {
                  direccion,
                }
              : {}),

            utmSource:
              sesion?.utmSource ??
              null,
            utmMedium:
              sesion?.utmMedium ??
              null,
            utmCampaign:
              sesion?.utmCampaign ??
              null,
            utmContent:
              sesion?.utmContent ??
              null,
            fbclid:
              sesion?.fbclid ??
              null,
            ttclid:
              sesion?.ttclid ??
              null,

            ...datosPaso,

            ultimaActividadAt:
              ahora,
          },

          select: {
            id: true,
            sessionId: true,
            estado: true,
            ultimoPaso: true,
            intentoPedidoAt: true,
            errorPedido: true,
            errorPedidoAt: true,
            updatedAt: true,
          },
        },
      );

    return NextResponse.json({
      ok: true,
      carrito,
    });
  } catch (error) {
    console.error(
      "Error guardando carrito abandonado:",
      error,
    );

    return NextResponse.json(
      {
        ok: false,
        error:
          "No se pudo guardar el carrito",
      },
      {
        status: 500,
      },
    );
  }
}