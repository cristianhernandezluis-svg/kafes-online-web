"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requerirAdmin } from "@/lib/auth";
import { getCloudinary } from "@/lib/cloudinary";
import prisma from "@/lib/prisma";

const TIPO_SECCION = "BANNER_INFERIOR";

function obtenerTexto(
  formData: FormData,
  campo: string
) {
  return String(
    formData.get(campo) ?? ""
  ).trim();
}

function obtenerPublicIdAnterior(
  valor: unknown
) {
  if (
    !valor ||
    typeof valor !== "object" ||
    Array.isArray(valor)
  ) {
    return "";
  }

  const configuracion =
    valor as Record<string, unknown>;

  return typeof configuracion.imagenPublicId ===
    "string"
    ? configuracion.imagenPublicId
    : "";
}

export async function guardarBannerInferiorHome(
  formData: FormData
) {
  await requerirAdmin();

  const etiqueta =
    obtenerTexto(formData, "etiqueta") ||
    "PRECIOS ESPECIALES";

  const titulo =
    obtenerTexto(formData, "titulo") ||
    "Equipa tu taller con herramientas profesionales";

  const subtitulo =
    obtenerTexto(formData, "subtitulo") ||
    "Encuentra equipos para construcción, agricultura, mantenimiento y trabajos especializados.";

  const textoBoton =
    obtenerTexto(formData, "textoBoton") ||
    "COMPRAR AHORA";

  const urlBoton =
    obtenerTexto(formData, "urlBoton") ||
    "#productos";

  const imagen =
    obtenerTexto(formData, "imagen") ||
    "/banner-taller-profesional.jpg";

  const imagenPublicId = obtenerTexto(
    formData,
    "imagenPublicId"
  );

  const alt =
    obtenerTexto(formData, "alt") ||
    "Herramientas profesionales Kafes Online";

  const activo =
    formData.get("activo") === "on";

  const seccionExistente =
    await prisma.homeSection.findFirst({
      where: {
        tipo: TIPO_SECCION,
      },
      orderBy: {
        id: "asc",
      },
    });

  const publicIdAnterior =
    obtenerPublicIdAnterior(
      seccionExistente?.configuracion
    );

  const configuracion = {
    etiqueta,
    textoBoton,
    urlBoton,
    imagen,
    imagenPublicId,
    alt,
  };

  if (seccionExistente) {
    await prisma.homeSection.update({
      where: {
        id: seccionExistente.id,
      },
      data: {
        nombre: "Banner inferior",
        titulo,
        subtitulo,
        configuracion,
        activo,
      },
    });
  } else {
    await prisma.homeSection.create({
      data: {
        tipo: TIPO_SECCION,
        nombre: "Banner inferior",
        titulo,
        subtitulo,
        configuracion,
        orden: 6,
        activo,
      },
    });
  }

  if (
    publicIdAnterior &&
    publicIdAnterior !== imagenPublicId
  ) {
    try {
      await getCloudinary().api.delete_resources(
        [publicIdAnterior],
        {
          resource_type: "image",
        }
      );
    } catch (error) {
      console.error(
        "No se pudo eliminar la imagen anterior del banner inferior:",
        error
      );
    }
  }

  revalidatePath("/");
  revalidatePath("/admin/home");
  revalidatePath(
    "/admin/home/banner-inferior"
  );

  redirect(
    "/admin/home/banner-inferior?guardado=1"
  );
}