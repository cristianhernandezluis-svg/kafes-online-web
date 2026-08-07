import prisma from "@/lib/prisma";

export type ConfiguracionTiendaPublica = {
  nombreTienda: string;
  razonSocial: string;
  ruc: string;

  telefono: string;
  whatsapp: string;
  whatsappMensaje: string;
  email: string;
  direccion: string;
  horarioAtencion: string;

  logoUrl: string;

  moneda: string;
  simboloMoneda: string;

  facebookUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
  youtubeUrl: string;

  textoFooter: string;
};

function texto(
  valor: string | null | undefined,
  predeterminado = ""
) {
  return valor?.trim() || predeterminado;
}

export async function obtenerConfiguracionTienda(): Promise<ConfiguracionTiendaPublica> {
  const configuracion =
    await prisma.configuracionTienda.findUnique({
      where: {
        id: 1,
      },
    });

  return {
    nombreTienda: texto(
      configuracion?.nombreTienda,
      "KAFES ONLINE"
    ),

    razonSocial: texto(
      configuracion?.razonSocial
    ),

    ruc: texto(
      configuracion?.ruc
    ),

    telefono: texto(
      configuracion?.telefono,
      "+51 980 296 583"
    ),

    whatsapp: texto(
      configuracion?.whatsapp,
      "51980296583"
    ),

    whatsappMensaje: texto(
      configuracion?.whatsappMensaje,
      "Hola, quiero información sobre sus productos."
    ),

    email: texto(
      configuracion?.email
    ),

    direccion: texto(
      configuracion?.direccion,
      "Lima, Perú"
    ),

    horarioAtencion: texto(
      configuracion?.horarioAtencion
    ),

    logoUrl: texto(
      configuracion?.logoUrl
    ),

    moneda: texto(
      configuracion?.moneda,
      "PEN"
    ),

    simboloMoneda: texto(
      configuracion?.simboloMoneda,
      "S/"
    ),

    facebookUrl: texto(
      configuracion?.facebookUrl
    ),

    instagramUrl: texto(
      configuracion?.instagramUrl
    ),

    tiktokUrl: texto(
      configuracion?.tiktokUrl
    ),

    youtubeUrl: texto(
      configuracion?.youtubeUrl
    ),

    textoFooter: texto(
      configuracion?.textoFooter,
      "Herramientas profesionales con envío a todo el Perú."
    ),
  };
}