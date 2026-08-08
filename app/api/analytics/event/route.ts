import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";

type EventoAnalitica =
  | "CHECKOUT_INICIADO"
  | "PEDIDO_REALIZADO";

type EventoBody = {
  sessionId?: string;
  evento?: EventoAnalitica;
};

export async function POST(
  request: Request
) {
  try {
    const body =
      (await request.json()) as EventoBody;

    const sessionId =
      typeof body.sessionId === "string"
        ? body.sessionId.trim()
        : "";

    if (
      !sessionId ||
      sessionId.length > 120
    ) {
      return NextResponse.json(
        {
          ok: false,
          error: "Sesión no válida.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      body.evento !==
        "CHECKOUT_INICIADO" &&
      body.evento !==
        "PEDIDO_REALIZADO"
    ) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Evento analítico no válido.",
        },
        {
          status: 400,
        }
      );
    }

    const ahora = new Date();

    const resultado =
      await prisma.sesionAnalitica.updateMany({
        where: {
          sessionId,
        },

        data:
          body.evento ===
          "CHECKOUT_INICIADO"
            ? {
                checkoutIniciadoAt:
                  ahora,
              }
            : {
                pedidoRealizadoAt:
                  ahora,
              },
      });

    return NextResponse.json({
      ok: true,
      registrada:
        resultado.count > 0,
    });
  } catch (error) {
    console.error(
      "Error registrando evento analítico:",
      error
    );

    return NextResponse.json(
      {
        ok: false,
        error:
          "No se pudo registrar el evento.",
      },
      {
        status: 500,
      }
    );
  }
}