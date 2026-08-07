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