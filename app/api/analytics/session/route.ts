import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";

type SesionBody = {
  sessionId?: string;

  landingPath?: string | null;
  referrer?: string | null;

  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  utmContent?: string | null;
  utmTerm?: string | null;

  fbclid?: string | null;
  ttclid?: string | null;
};

function limpiarTexto(
  valor: unknown
) {
  if (typeof valor !== "string") {
    return null;
  }

  const limpio = valor.trim();

  return limpio || null;
}

function detectarDispositivo(
  userAgent: string
) {
  const ua = userAgent.toLowerCase();

  if (
    /ipad|tablet|kindle|silk/.test(
      ua
    )
  ) {
    return "TABLET";
  }

  if (
    /mobile|android|iphone|ipod/.test(
      ua
    )
  ) {
    return "MOVIL";
  }

  if (ua) {
    return "ESCRITORIO";
  }

  return "DESCONOCIDO";
}

export async function POST(
  request: Request
) {
  try {
    const body =
      (await request.json()) as SesionBody;

    const sessionId =
      limpiarTexto(body.sessionId);

    if (
      !sessionId ||
      sessionId.length > 120
    ) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "La sesión no es válida.",
        },
        {
          status: 400,
        }
      );
    }

    const userAgent =
      request.headers.get(
        "user-agent"
      ) || "";

    const deviceType =
      detectarDispositivo(userAgent);

    const sesion =
      await prisma.sesionAnalitica.upsert({
        where: {
          sessionId,
        },

        update: {
          pageViews: {
            increment: 1,
          },

          utmSource:
            limpiarTexto(
              body.utmSource
            ),
          utmMedium:
            limpiarTexto(
              body.utmMedium
            ),
          utmCampaign:
            limpiarTexto(
              body.utmCampaign
            ),
          utmContent:
            limpiarTexto(
              body.utmContent
            ),
          utmTerm:
            limpiarTexto(
              body.utmTerm
            ),

          fbclid:
            limpiarTexto(
              body.fbclid
            ),
          ttclid:
            limpiarTexto(
              body.ttclid
            ),

          deviceType,
          userAgent:
            userAgent || null,
        },

        create: {
          sessionId,

          landingPath:
            limpiarTexto(
              body.landingPath
            ),
          referrer:
            limpiarTexto(
              body.referrer
            ),

          utmSource:
            limpiarTexto(
              body.utmSource
            ),
          utmMedium:
            limpiarTexto(
              body.utmMedium
            ),
          utmCampaign:
            limpiarTexto(
              body.utmCampaign
            ),
          utmContent:
            limpiarTexto(
              body.utmContent
            ),
          utmTerm:
            limpiarTexto(
              body.utmTerm
            ),

          fbclid:
            limpiarTexto(
              body.fbclid
            ),
          ttclid:
            limpiarTexto(
              body.ttclid
            ),

          deviceType,
          userAgent:
            userAgent || null,

          pageViews: 1,
        },

        select: {
          id: true,
          sessionId: true,
          pageViews: true,
        },
      });

    return NextResponse.json({
      ok: true,
      sesion,
    });
  } catch (error) {
    console.error(
      "Error registrando sesión analítica:",
      error
    );

    return NextResponse.json(
      {
        ok: false,
        error:
          "No se pudo registrar la sesión.",
      },
      {
        status: 500,
      }
    );
  }
}