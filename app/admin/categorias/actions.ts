"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requerirAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma";

function obtenerTexto(formData: FormData, campo: string) {
  return String(formData.get(campo) ?? "").trim();
}

function obtenerEntero(
  formData: FormData,
  campo: string,
  valorPredeterminado = 0
) {
  const valor = Number(formData.get(campo));

  if (!Number.isFinite(valor)) {
    return valorPredeterminado;
  }

  return Math.trunc(valor);
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

export async function crearCategoria(formData: FormData) {
  await requerirAdmin();

  const nombre = obtenerTexto(formData, "nombre");
  const slugIngresado = obtenerTexto(formData, "slug");
  const descripcion = obtenerTexto(formData, "descripcion");
  const imagenUrl = obtenerTexto(formData, "imagenUrl");
  const activa = formData.get("activa") === "on";
  const orden = Math.max(
    0,
    obtenerEntero(formData, "orden", 0)
  );

  if (!nombre) {
    throw new Error("El nombre de la categoría es obligatorio.");
  }

  const slugBase = crearSlug(slugIngresado || nombre);

  if (!slugBase) {
    throw new Error("No se pudo generar un slug válido.");
  }

  let slugFinal = slugBase;
  let contador = 2;

  while (
    await prisma.categoria.findUnique({
      where: {
        slug: slugFinal,
      },
      select: {
        id: true,
      },
    })
  ) {
    slugFinal = `${slugBase}-${contador}`;
    contador += 1;
  }

  await prisma.categoria.create({
    data: {
      nombre,
      slug: slugFinal,
      descripcion: descripcion || null,
      imagenUrl: imagenUrl || null,
      activa,
      orden,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/categorias");
  revalidatePath("/admin/home/categorias");

  redirect("/admin/categorias");
}

export async function actualizarCategoria(
  formData: FormData
) {
  await requerirAdmin();

  const categoriaId = Number(
    formData.get("categoriaId")
  );

  if (
    !Number.isInteger(categoriaId) ||
    categoriaId <= 0
  ) {
    throw new Error("Categoría inválida.");
  }

  const categoriaActual =
    await prisma.categoria.findUnique({
      where: {
        id: categoriaId,
      },
    });

  if (!categoriaActual) {
    throw new Error("La categoría no existe.");
  }

  const nombre = obtenerTexto(formData, "nombre");
  const slugIngresado = obtenerTexto(formData, "slug");
  const descripcion = obtenerTexto(
    formData,
    "descripcion"
  );
  const imagenUrl = obtenerTexto(formData, "imagenUrl");
  const activa = formData.get("activa") === "on";
  const orden = Math.max(
    0,
    obtenerEntero(formData, "orden", 0)
  );

  if (!nombre) {
    throw new Error("El nombre de la categoría es obligatorio.");
  }

  const slugBase = crearSlug(slugIngresado || nombre);

  if (!slugBase) {
    throw new Error("El slug no es válido.");
  }

  let slugFinal = slugBase;
  let contador = 2;

  while (true) {
    const categoriaConSlug =
      await prisma.categoria.findUnique({
        where: {
          slug: slugFinal,
        },
        select: {
          id: true,
        },
      });

    if (
      !categoriaConSlug ||
      categoriaConSlug.id === categoriaId
    ) {
      break;
    }

    slugFinal = `${slugBase}-${contador}`;
    contador += 1;
  }

  await prisma.categoria.update({
    where: {
      id: categoriaId,
    },
    data: {
      nombre,
      slug: slugFinal,
      descripcion: descripcion || null,
      imagenUrl: imagenUrl || null,
      activa,
      orden,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/categorias");
  revalidatePath("/admin/home/categorias");
  revalidatePath(`/categoria/${categoriaActual.slug}`);
  revalidatePath(`/categoria/${slugFinal}`);

  redirect(
    `/admin/categorias/${categoriaId}/editar?guardado=1`
  );
}

export async function cambiarEstadoCategoria(
  formData: FormData
) {
  await requerirAdmin();

  const categoriaId = Number(
    formData.get("categoriaId")
  );

  if (
    !Number.isInteger(categoriaId) ||
    categoriaId <= 0
  ) {
    throw new Error("Categoría inválida.");
  }

  const activa =
    formData.get("activa") === "true";

  await prisma.categoria.update({
    where: {
      id: categoriaId,
    },
    data: {
      activa,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/categorias");
  revalidatePath("/admin/home/categorias");
}