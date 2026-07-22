"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import prisma from "@/lib/prisma";
import { requerirAdmin } from "@/lib/auth";

function obtenerTexto(formData: FormData, nombre: string) {
  return String(formData.get(nombre) ?? "").trim();
}

function obtenerNumero(formData: FormData, nombre: string) {
  const valor = Number(formData.get(nombre) ?? 0);

  return Number.isFinite(valor) ? valor : 0;
}

export async function crearBanner(formData: FormData) {
  await requerirAdmin();

  const titulo = obtenerTexto(formData, "titulo");
  const subtitulo = obtenerTexto(formData, "subtitulo");
  const botonTexto = obtenerTexto(formData, "botonTexto");
  const botonLink = obtenerTexto(formData, "botonLink");
  const imagenUrl = obtenerTexto(formData, "imagenUrl");
  const publicId = obtenerTexto(formData, "publicId");
  const orden = obtenerNumero(formData, "orden");
  const activo = formData.get("activo") === "on";

  if (!imagenUrl) {
    throw new Error("Debes subir una imagen para el banner.");
  }

  const banner = await prisma.banner.create({
    data: {
      titulo: titulo || null,
      subtitulo: subtitulo || null,
      botonTexto: botonTexto || null,
      botonLink: botonLink || null,
      imagenUrl,
      publicId: publicId || null,
      orden,
      activo,
    },
  });

  revalidatePath("/admin/home");
  revalidatePath("/");

  redirect(`/admin/home/banners/${banner.id}/editar?creado=1`);
}

export async function actualizarBanner(formData: FormData) {
  await requerirAdmin();

  const bannerId = Number(formData.get("bannerId"));

  if (!Number.isInteger(bannerId) || bannerId <= 0) {
    throw new Error("Banner inválido.");
  }

  const titulo = obtenerTexto(formData, "titulo");
  const subtitulo = obtenerTexto(formData, "subtitulo");
  const botonTexto = obtenerTexto(formData, "botonTexto");
  const botonLink = obtenerTexto(formData, "botonLink");
  const imagenUrl = obtenerTexto(formData, "imagenUrl");
  const publicId = obtenerTexto(formData, "publicId");
  const orden = obtenerNumero(formData, "orden");
  const activo = formData.get("activo") === "on";

  if (!imagenUrl) {
    throw new Error("Debes subir una imagen para el banner.");
  }

  await prisma.banner.update({
    where: {
      id: bannerId,
    },
    data: {
      titulo: titulo || null,
      subtitulo: subtitulo || null,
      botonTexto: botonTexto || null,
      botonLink: botonLink || null,
      imagenUrl,
      publicId: publicId || null,
      orden,
      activo,
    },
  });

  revalidatePath("/admin/home");
  revalidatePath("/");
  revalidatePath(`/admin/home/banners/${bannerId}/editar`);

  redirect(`/admin/home/banners/${bannerId}/editar?guardado=1`);
}

export async function eliminarBanner(formData: FormData) {
  await requerirAdmin();

  const bannerId = Number(formData.get("bannerId"));

  if (!Number.isInteger(bannerId) || bannerId <= 0) {
    throw new Error("Banner inválido.");
  }

  await prisma.banner.delete({
    where: {
      id: bannerId,
    },
  });

  revalidatePath("/admin/home");
  revalidatePath("/");

  redirect("/admin/home");
}