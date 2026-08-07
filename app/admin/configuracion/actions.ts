"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requerirAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma";

function obtenerTexto(
  formData: FormData,
  campo: string
) {
  return String(
    formData.get(campo) ?? ""
  ).trim();
}

function obtenerTextoONull(
  formData: FormData,
  campo: string
) {
  const valor = obtenerTexto(
    formData,
    campo
  );

  return valor || null;
}

function obtenerBooleano(
  formData: FormData,
  campo: string
) {
  return formData.get(campo) === "on";
}

function obtenerMetaEventoPedido(
  formData: FormData
) {
  const valor = obtenerTexto(
    formData,
    "metaEventoPedido"
  );

  if (
    valor === "Purchase" ||
    valor === "Lead" ||
    valor === "CompleteRegistration"
  ) {
    return valor;
  }

  return "CompleteRegistration";
}

function obtenerTipoPedido(
  formData: FormData
) {
  const valor = obtenerTexto(
    formData,
    "checkoutTipoPedido"
  );

  if (
    valor === "CONTRAENTREGA" ||
    valor === "ADELANTO" ||
    valor === "PAGO_COMPLETO"
  ) {
    return valor;
  }

  return "CONTRAENTREGA";
}

function obtenerCantidadMaxima(
  formData: FormData
) {
  const valor = Number(
    obtenerTexto(
      formData,
      "checkoutCantidadMaxima"
    )
  );

  if (!Number.isFinite(valor)) {
    return 5;
  }

  return Math.min(
    99,
    Math.max(1, Math.floor(valor))
  );
}

function obtenerMontoAdelanto(
  formData: FormData
) {
  const valor = Number(
    obtenerTexto(
      formData,
      "checkoutMontoAdelanto"
    )
  );

  if (
    !Number.isFinite(valor) ||
    valor < 0
  ) {
    return 30;
  }

  return Math.round(valor * 100) / 100;
}

function limpiarWhatsApp(valor: string) {
  return valor.replace(/\D/g, "");
}

export async function guardarConfiguracionTienda(
  formData: FormData
) {
  await requerirAdmin();

  const nombreTienda =
    obtenerTexto(
      formData,
      "nombreTienda"
    ) || "KAFES ONLINE";

  const razonSocial =
    obtenerTextoONull(
      formData,
      "razonSocial"
    );

  const ruc =
    obtenerTextoONull(
      formData,
      "ruc"
    );

  const telefono =
    obtenerTextoONull(
      formData,
      "telefono"
    );

  const whatsappOriginal =
    obtenerTexto(
      formData,
      "whatsapp"
    );

  const whatsapp =
    whatsappOriginal
      ? limpiarWhatsApp(
          whatsappOriginal
        )
      : null;

  const whatsappMensaje =
    obtenerTexto(
      formData,
      "whatsappMensaje"
    ) ||
    "Hola, quiero información sobre sus productos.";

  const email =
    obtenerTextoONull(
      formData,
      "email"
    );

  const direccion =
    obtenerTextoONull(
      formData,
      "direccion"
    );

  const horarioAtencion =
    obtenerTextoONull(
      formData,
      "horarioAtencion"
    );

  const logoUrl =
    obtenerTextoONull(
      formData,
      "logoUrl"
    );

  const logoPublicId =
    obtenerTextoONull(
      formData,
      "logoPublicId"
    );

  const moneda =
    obtenerTexto(
      formData,
      "moneda"
    ) || "PEN";

  const simboloMoneda =
    obtenerTexto(
      formData,
      "simboloMoneda"
    ) || "S/";

  const facebookUrl =
    obtenerTextoONull(
      formData,
      "facebookUrl"
    );

  const instagramUrl =
    obtenerTextoONull(
      formData,
      "instagramUrl"
    );

  const tiktokUrl =
    obtenerTextoONull(
      formData,
      "tiktokUrl"
    );

  const youtubeUrl =
    obtenerTextoONull(
      formData,
      "youtubeUrl"
    );

  const textoFooter =
    obtenerTextoONull(
      formData,
      "textoFooter"
    );

  // TRACKING

  const metaPixelId =
    obtenerTextoONull(
      formData,
      "metaPixelId"
    );

  const metaPixelActivo =
    obtenerBooleano(
      formData,
      "metaPixelActivo"
    );

  const metaEventoPedido =
    obtenerMetaEventoPedido(formData);

  const tiktokPixelId =
    obtenerTextoONull(
      formData,
      "tiktokPixelId"
    );

  const tiktokPixelActivo =
    obtenerBooleano(
      formData,
      "tiktokPixelActivo"
    );

  const googleAnalyticsId =
    obtenerTextoONull(
      formData,
      "googleAnalyticsId"
    );

  const googleAnalyticsActivo =
    obtenerBooleano(
      formData,
      "googleAnalyticsActivo"
    );

  const googleTagManagerId =
    obtenerTextoONull(
      formData,
      "googleTagManagerId"
    );

  const googleTagManagerActivo =
    obtenerBooleano(
      formData,
      "googleTagManagerActivo"
    );

  // PEDIDOS Y CHECKOUT

  const checkoutActivo =
    obtenerBooleano(
      formData,
      "checkoutActivo"
    );

  const checkoutTipoPedido =
    obtenerTipoPedido(formData);

  const checkoutMontoAdelanto =
    obtenerMontoAdelanto(formData);

  const checkoutTitulo =
    obtenerTexto(
      formData,
      "checkoutTitulo"
    ) ||
    "Completa tus datos para realizar tu pedido";

  const checkoutBotonTexto =
    obtenerTexto(
      formData,
      "checkoutBotonTexto"
    ) ||
    "REALIZAR PEDIDO";

  const checkoutMensajeExito =
    obtenerTexto(
      formData,
      "checkoutMensajeExito"
    ) ||
    "Tu pedido fue registrado correctamente.";

  const checkoutTextoConfianza =
    obtenerTexto(
      formData,
      "checkoutTextoConfianza"
    ) ||
    "Compra segura | Envíos a todo el Perú";

  const checkoutMostrarDireccion =
    obtenerBooleano(
      formData,
      "checkoutMostrarDireccion"
    );

  const checkoutDireccionObligatoria =
    obtenerBooleano(
      formData,
      "checkoutDireccionObligatoria"
    );

  const checkoutMostrarReferencia =
    obtenerBooleano(
      formData,
      "checkoutMostrarReferencia"
    );

  const checkoutReferenciaObligatoria =
    obtenerBooleano(
      formData,
      "checkoutReferenciaObligatoria"
    );

  const checkoutMostrarDni =
    obtenerBooleano(
      formData,
      "checkoutMostrarDni"
    );

  const checkoutDniObligatorio =
    obtenerBooleano(
      formData,
      "checkoutDniObligatorio"
    );

  const checkoutMostrarRegion =
    obtenerBooleano(
      formData,
      "checkoutMostrarRegion"
    );

  const checkoutRegionObligatoria =
    obtenerBooleano(
      formData,
      "checkoutRegionObligatoria"
    );

  const checkoutMostrarCiudad =
    obtenerBooleano(
      formData,
      "checkoutMostrarCiudad"
    );

  const checkoutCiudadObligatoria =
    obtenerBooleano(
      formData,
      "checkoutCiudadObligatoria"
    );

  const checkoutPermitirCantidad =
    obtenerBooleano(
      formData,
      "checkoutPermitirCantidad"
    );

  const checkoutCantidadMaxima =
    obtenerCantidadMaxima(formData);

  const checkoutMostrarTotal =
    obtenerBooleano(
      formData,
      "checkoutMostrarTotal"
    );

  const checkoutBotonFijo =
    obtenerBooleano(
      formData,
      "checkoutBotonFijo"
    );

  const checkoutWhatsAppPostPedido =
    obtenerBooleano(
      formData,
      "checkoutWhatsAppPostPedido"
    );

  await prisma.configuracionTienda.upsert({
    where: {
      id: 1,
    },

    update: {
      nombreTienda,
      razonSocial,
      ruc,
      telefono,
      whatsapp,
      whatsappMensaje,
      email,
      direccion,
      horarioAtencion,
      logoUrl,
      logoPublicId,
      moneda,
      simboloMoneda,
      facebookUrl,
      instagramUrl,
      tiktokUrl,
      youtubeUrl,
      textoFooter,

      metaPixelId,
      metaPixelActivo,
      metaEventoPedido,

      tiktokPixelId,
      tiktokPixelActivo,

      googleAnalyticsId,
      googleAnalyticsActivo,

      googleTagManagerId,
      googleTagManagerActivo,

      checkoutActivo,
      checkoutTipoPedido,
      checkoutMontoAdelanto,
      checkoutTitulo,
      checkoutBotonTexto,
      checkoutMensajeExito,
      checkoutTextoConfianza,

      checkoutMostrarDireccion,
      checkoutDireccionObligatoria,

      checkoutMostrarReferencia,
      checkoutReferenciaObligatoria,

      checkoutMostrarDni,
      checkoutDniObligatorio,

      checkoutMostrarRegion,
      checkoutRegionObligatoria,

      checkoutMostrarCiudad,
      checkoutCiudadObligatoria,

      checkoutPermitirCantidad,
      checkoutCantidadMaxima,

      checkoutMostrarTotal,
      checkoutBotonFijo,
      checkoutWhatsAppPostPedido,
    },

    create: {
      id: 1,

      nombreTienda,
      razonSocial,
      ruc,
      telefono,
      whatsapp,
      whatsappMensaje,
      email,
      direccion,
      horarioAtencion,
      logoUrl,
      logoPublicId,
      moneda,
      simboloMoneda,
      facebookUrl,
      instagramUrl,
      tiktokUrl,
      youtubeUrl,
      textoFooter,

      metaPixelId,
      metaPixelActivo,
      metaEventoPedido,

      tiktokPixelId,
      tiktokPixelActivo,

      googleAnalyticsId,
      googleAnalyticsActivo,

      googleTagManagerId,
      googleTagManagerActivo,

      checkoutActivo,
      checkoutTipoPedido,
      checkoutMontoAdelanto,
      checkoutTitulo,
      checkoutBotonTexto,
      checkoutMensajeExito,
      checkoutTextoConfianza,

      checkoutMostrarDireccion,
      checkoutDireccionObligatoria,

      checkoutMostrarReferencia,
      checkoutReferenciaObligatoria,

      checkoutMostrarDni,
      checkoutDniObligatorio,

      checkoutMostrarRegion,
      checkoutRegionObligatoria,

      checkoutMostrarCiudad,
      checkoutCiudadObligatoria,

      checkoutPermitirCantidad,
      checkoutCantidadMaxima,

      checkoutMostrarTotal,
      checkoutBotonFijo,
      checkoutWhatsAppPostPedido,
    },
  });

  revalidatePath("/");
  revalidatePath("/productos");
  revalidatePath("/admin");
  revalidatePath(
    "/admin/configuracion"
  );

  redirect(
    "/admin/configuracion?guardado=1"
  );
}