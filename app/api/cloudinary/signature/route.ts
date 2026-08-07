import { NextResponse } from "next/server";

import { getCloudinary } from "@/lib/cloudinary";

export const runtime = "nodejs";

type Body = {
  tipo?:
  | "producto"
  | "banner"
  | "bannerInferior"
  | "logoTienda"
  | "asesorWhatsApp"
  | "opinion";

  productoId?: number;
  bannerId?: number;
  opinionId?: number;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Body;

    const tipo = body.tipo ?? "producto";

    let folder = "";

    switch (tipo) {
      case "producto": {
        const productoId = Number(
          body.productoId
        );

        if (
          !Number.isInteger(productoId) ||
          productoId <= 0
        ) {
          return NextResponse.json(
            {
              error: "Producto inválido.",
            },
            {
              status: 400,
            }
          );
        }

        folder =
          `kafes-online/productos/${productoId}`;

        break;
      }

      case "banner": {
        const bannerId = Number(body.bannerId);

        folder =
          Number.isInteger(bannerId) &&
          bannerId > 0
            ? `kafes-online/banners/${bannerId}`
            : "kafes-online/banners/nuevos";

        break;
      }

      case "bannerInferior": {
        folder =
          "kafes-online/home/banner-inferior";

        break;
      }

case "logoTienda": {
  folder =
    "kafes-online/configuracion/logo";

  break;
}

case "asesorWhatsApp": {
  folder =
    "kafes-online/configuracion/asesores";

  break;
}

      case "opinion": {
        const opinionId = Number(
          body.opinionId
        );

        folder =
          Number.isInteger(opinionId) &&
          opinionId > 0
            ? `kafes-online/opiniones/${opinionId}`
            : "kafes-online/opiniones/nuevas";

        break;
      }

      default: {
        return NextResponse.json(
          {
            error: "Tipo no soportado.",
          },
          {
            status: 400,
          }
        );
      }
    }

    const timestamp = Math.round(
      Date.now() / 1000
    );

    const cloudinary = getCloudinary();

    const signature =
      cloudinary.utils.api_sign_request(
        {
          timestamp,
          folder,
        },
        process.env.CLOUDINARY_API_SECRET!
      );

    return NextResponse.json({
      timestamp,
      signature,
      folder,
      apiKey:
        process.env.CLOUDINARY_API_KEY,
      cloudName:
        process.env
          .NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    });
  } catch (error) {
    console.error(
      "Error generando firma de Cloudinary:",
      error
    );

    return NextResponse.json(
      {
        error:
          "No se pudo preparar la carga.",
      },
      {
        status: 500,
      }
    );
  }
}