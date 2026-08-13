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
  metaEventoPedido:
  | "CompleteRegistration"
  | "Lead"
  | "Purchase";
  logoUrl: string;

  moneda: string;
  simboloMoneda: string;

  facebookUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
  youtubeUrl: string;

  textoFooter: string;
  checkoutActivo: boolean;
checkoutTipoPedido: string;
checkoutMontoAdelanto: number;

  checkoutTitulo: string;
  checkoutBotonTexto: string;
  checkoutMensajeExito: string;
  checkoutTextoConfianza: string;

  checkoutMostrarDireccion: boolean;
  checkoutDireccionObligatoria: boolean;

  checkoutMostrarReferencia: boolean;
  checkoutReferenciaObligatoria: boolean;

  checkoutMostrarDni: boolean;
  checkoutDniObligatorio: boolean;

  checkoutMostrarRegion: boolean;
  checkoutRegionObligatoria: boolean;

  checkoutMostrarCiudad: boolean;
  checkoutCiudadObligatoria: boolean;

  checkoutPermitirCantidad: boolean;
  checkoutCantidadMaxima: number;

  checkoutMostrarTotal: boolean;
  checkoutBotonFijo: boolean;
  checkoutWhatsAppPostPedido: boolean;
};

function texto(
  valor: string | null | undefined,
  predeterminado = ""
) {
  return valor?.trim() || predeterminado;
}

export type AsesorWhatsAppPublico = {
  id: number;
  nombre: string;
  cargo: string;
  telefono: string;
  imagenUrl: string;
};

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

metaEventoPedido:
  configuracion?.metaEventoPedido === "Lead" ||
  configuracion?.metaEventoPedido === "Purchase"
    ? configuracion.metaEventoPedido
    : "CompleteRegistration",

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
    checkoutActivo:
      configuracion?.checkoutActivo ?? true,

    checkoutTipoPedido:
      configuracion?.checkoutTipoPedido ??
      "CONTRAENTREGA",

checkoutMontoAdelanto: Number(
  configuracion?.checkoutMontoAdelanto ?? 30
),

    checkoutTitulo: texto(
      configuracion?.checkoutTitulo,
      "Completa tus datos para realizar tu pedido"
    ),

    checkoutBotonTexto: (() => {
      const valor = texto(
        configuracion?.checkoutBotonTexto,
        "REALIZAR PEDIDO"
      );

      return valor.trim().toUpperCase() === "CONFIRMAR PEDIDO"
        ? "REALIZAR PEDIDO"
        : valor;
    })(),

    checkoutMensajeExito: texto(
      configuracion?.checkoutMensajeExito,
      "Tu pedido fue registrado correctamente."
    ),

    checkoutTextoConfianza: texto(
      configuracion?.checkoutTextoConfianza,
      "Compra segura | Envíos a todo el Perú"
    ),

    checkoutMostrarDireccion:
      configuracion?.checkoutMostrarDireccion ??
      true,

    checkoutDireccionObligatoria:
      configuracion?.checkoutDireccionObligatoria ??
      true,

    checkoutMostrarReferencia:
      configuracion?.checkoutMostrarReferencia ??
      true,

    checkoutReferenciaObligatoria:
      configuracion?.checkoutReferenciaObligatoria ??
      false,

    checkoutMostrarDni:
      configuracion?.checkoutMostrarDni ??
      false,

    checkoutDniObligatorio:
      configuracion?.checkoutDniObligatorio ??
      false,

    checkoutMostrarRegion:
      configuracion?.checkoutMostrarRegion ??
      true,

    checkoutRegionObligatoria:
      configuracion?.checkoutRegionObligatoria ??
      true,

    checkoutMostrarCiudad:
      configuracion?.checkoutMostrarCiudad ??
      true,

    checkoutCiudadObligatoria:
      configuracion?.checkoutCiudadObligatoria ??
      true,

    checkoutPermitirCantidad:
      configuracion?.checkoutPermitirCantidad ??
      true,

    checkoutCantidadMaxima:
      configuracion?.checkoutCantidadMaxima ??
      5,

    checkoutMostrarTotal:
      configuracion?.checkoutMostrarTotal ??
      true,

    checkoutBotonFijo:
      configuracion?.checkoutBotonFijo ??
      true,

    checkoutWhatsAppPostPedido:
      configuracion?.checkoutWhatsAppPostPedido ??
      false,
  };
}

export async function obtenerAsesoresWhatsApp(): Promise<
  AsesorWhatsAppPublico[]
> {
  const asesores =
    await prisma.asesorWhatsApp.findMany({
      where: {
        activo: true,
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
        nombre: true,
        cargo: true,
        telefono: true,
        imagenUrl: true,
      },
    });

  return asesores.map((asesor) => ({
    id: asesor.id,
    nombre: asesor.nombre,
    cargo:
      asesor.cargo?.trim() ||
      "Asesor comercial",
    telefono: asesor.telefono,
    imagenUrl: asesor.imagenUrl ?? "",
  }));
}