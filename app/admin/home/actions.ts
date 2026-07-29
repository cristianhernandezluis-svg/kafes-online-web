"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requerirAdmin } from "@/lib/auth";
import { getCloudinary } from "@/lib/cloudinary";
import prisma from "@/lib/prisma";

function texto(formData: FormData, campo: string) {
  return String(formData.get(campo) ?? "").trim();
}

function entero(formData: FormData, campo: string, defecto = 0) {
  const valor = Number(formData.get(campo));
  return Number.isFinite(valor) ? Math.trunc(valor) : defecto;
}

function datosBanner(formData: FormData) {
  const imagenDesktopUrl = texto(formData, "imagenDesktopUrl");
  const imagenDesktopPublicId = texto(formData, "imagenDesktopPublicId");
  const alt = texto(formData, "alt");

  if (!imagenDesktopUrl || !imagenDesktopPublicId) {
    throw new Error("La imagen para computadora es obligatoria.");
  }

  if (!alt) {
    throw new Error("El texto alternativo es obligatorio.");
  }

  return {
    titulo: texto(formData, "titulo") || null,
    subtitulo: texto(formData, "subtitulo") || null,
    textoBoton: texto(formData, "textoBoton") || null,
    href: texto(formData, "href") || "/",
    alt,
    imagenDesktopUrl,
    imagenDesktopPublicId,
    imagenMobileUrl: texto(formData, "imagenMobileUrl") || null,
    imagenMobilePublicId: texto(formData, "imagenMobilePublicId") || null,
    activo: formData.get("activo") === "on",
    orden: entero(formData, "orden"),
  };
}

export async function crearBanner(formData: FormData) {
  await requerirAdmin();
  await prisma.banner.create({ data: datosBanner(formData) });
  revalidatePath("/");
  revalidatePath("/admin/home");
  redirect("/admin/home");
}

export async function actualizarBanner(formData: FormData) {
  await requerirAdmin();
  const bannerId = Number(formData.get("bannerId"));

  if (!Number.isInteger(bannerId) || bannerId <= 0) {
    throw new Error("Banner inválido.");
  }

  const anterior = await prisma.banner.findUnique({ where: { id: bannerId } });
  if (!anterior) throw new Error("El banner no existe.");

  const data = datosBanner(formData);
  await prisma.banner.update({ where: { id: bannerId }, data });

  const publicIdsAnteriores = [
    anterior.imagenDesktopPublicId,
    anterior.imagenMobilePublicId,
  ].filter(Boolean) as string[];
  const publicIdsNuevos = [
    data.imagenDesktopPublicId,
    data.imagenMobilePublicId,
  ].filter(Boolean) as string[];
  const reemplazados = publicIdsAnteriores.filter((id) => !publicIdsNuevos.includes(id));

  if (reemplazados.length > 0) {
    try {
      await getCloudinary().api.delete_resources(reemplazados, {
        resource_type: "image",
      });
    } catch (error) {
      console.error("No se pudieron eliminar imágenes antiguas del banner:", error);
    }
  }

  revalidatePath("/");
  revalidatePath("/admin/home");
  revalidatePath(`/admin/home/${bannerId}/editar`);
  redirect("/admin/home");
}

export async function eliminarBanner(formData: FormData) {
  await requerirAdmin();
  const bannerId = Number(formData.get("bannerId"));

  if (!Number.isInteger(bannerId) || bannerId <= 0) {
    throw new Error("Banner inválido.");
  }

  const banner = await prisma.banner.delete({ where: { id: bannerId } });
  const publicIds = [
    banner.imagenDesktopPublicId,
    banner.imagenMobilePublicId,
  ].filter(Boolean) as string[];

  if (publicIds.length > 0) {
    try {
      await getCloudinary().api.delete_resources(publicIds, {
        resource_type: "image",
      });
    } catch (error) {
      console.error("No se pudieron eliminar las imágenes del banner:", error);
    }
  }

  revalidatePath("/");
  revalidatePath("/admin/home");
}

export async function cambiarEstadoBanner(formData: FormData) {
  await requerirAdmin();
  const bannerId = Number(formData.get("bannerId"));
  const activo = formData.get("activo") === "true";

  await prisma.banner.update({
    where: { id: bannerId },
    data: { activo },
  });

  revalidatePath("/");
  revalidatePath("/admin/home");
}
export async function cambiarEstadoSeccion(formData: FormData) {
  await requerirAdmin();

  const seccionId = Number(formData.get("seccionId"));
  const activo = formData.get("activo") === "true";

  if (!Number.isInteger(seccionId) || seccionId <= 0) {
    throw new Error("Sección inválida.");
  }

  await prisma.homeSection.update({
    where: {
      id: seccionId,
    },
    data: {
      activo,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/home");
}
