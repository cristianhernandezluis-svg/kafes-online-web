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

function crearSlug(valor: string) {
  return valor
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function generarSlugUnico(
  slugBase: string,
  marcaIdActual?: number
) {
  let slugFinal = slugBase;
  let contador = 2;

  while (true) {
    const marcaExistente =
      await prisma.marca.findUnique({
        where: {
          slug: slugFinal,
        },
        select: {
          id: true,
        },
      });

    if (
      !marcaExistente ||
      marcaExistente.id === marcaIdActual
    ) {
      return slugFinal;
    }

    slugFinal = `${slugBase}-${contador}`;
    contador += 1;
  }
}

export async function crearMarca(
  formData: FormData
) {
  await requerirAdmin();

  const nombre = obtenerTexto(
    formData,
    "nombre"
  );

  const slugIngresado = obtenerTexto(
    formData,
    "slug"
  );

  const descripcion = obtenerTexto(
    formData,
    "descripcion"
  );

  const logoUrl = obtenerTexto(
    formData,
    "logoUrl"
  );

  const activa =
    formData.get("activa") === "on";

  if (!nombre) {
    throw new Error(
      "El nombre de la marca es obligatorio."
    );
  }

  const slugBase = crearSlug(
    slugIngresado || nombre
  );

  if (!slugBase) {
    throw new Error(
      "No se pudo generar un slug válido."
    );
  }

  const slugFinal =
    await generarSlugUnico(slugBase);

  await prisma.marca.create({
    data: {
      nombre,
      slug: slugFinal,
      descripcion: descripcion || null,
      logoUrl: logoUrl || null,
      activa,
    },
  });

  revalidatePath("/");
  revalidatePath("/productos");
  revalidatePath("/admin/marcas");
  revalidatePath("/admin/productos");

  redirect("/admin/marcas");
}

export async function actualizarMarca(
  formData: FormData
) {
  await requerirAdmin();

  const marcaId = Number(
    formData.get("marcaId")
  );

  if (
    !Number.isInteger(marcaId) ||
    marcaId <= 0
  ) {
    throw new Error("Marca inválida.");
  }

  const marcaActual =
    await prisma.marca.findUnique({
      where: {
        id: marcaId,
      },
    });

  if (!marcaActual) {
    throw new Error(
      "La marca no existe."
    );
  }

  const nombre = obtenerTexto(
    formData,
    "nombre"
  );

  const slugIngresado = obtenerTexto(
    formData,
    "slug"
  );

  const descripcion = obtenerTexto(
    formData,
    "descripcion"
  );

  const logoUrl = obtenerTexto(
    formData,
    "logoUrl"
  );

  const activa =
    formData.get("activa") === "on";

  if (!nombre) {
    throw new Error(
      "El nombre de la marca es obligatorio."
    );
  }

  const slugBase = crearSlug(
    slugIngresado || nombre
  );

  if (!slugBase) {
    throw new Error(
      "El slug de la marca no es válido."
    );
  }

  const slugFinal =
    await generarSlugUnico(
      slugBase,
      marcaId
    );

  await prisma.marca.update({
    where: {
      id: marcaId,
    },
    data: {
      nombre,
      slug: slugFinal,
      descripcion: descripcion || null,
      logoUrl: logoUrl || null,
      activa,
    },
  });

  revalidatePath("/");
  revalidatePath("/productos");
  revalidatePath("/admin/marcas");
  revalidatePath("/admin/productos");

  redirect(
    `/admin/marcas/${marcaId}/editar?guardado=1`
  );
}

export async function cambiarEstadoMarca(
  formData: FormData
) {
  await requerirAdmin();

  const marcaId = Number(
    formData.get("marcaId")
  );

  if (
    !Number.isInteger(marcaId) ||
    marcaId <= 0
  ) {
    throw new Error("Marca inválida.");
  }

  const activa =
    formData.get("activa") === "true";

  await prisma.marca.update({
    where: {
      id: marcaId,
    },
    data: {
      activa,
    },
  });

  revalidatePath("/");
  revalidatePath("/productos");
  revalidatePath("/admin/marcas");
  revalidatePath("/admin/productos");
}