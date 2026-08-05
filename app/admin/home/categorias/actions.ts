"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requerirAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma";

const TIPO_SECCION = "CATEGORIAS";

function obtenerTexto(formData: FormData, campo: string) {
  return String(formData.get(campo) ?? "").trim();
}

function obtenerIdsCategorias(formData: FormData) {
  const valor = obtenerTexto(formData, "categoriaIds");

  if (!valor) {
    return [];
  }

  return [
    ...new Set(
      valor
        .split(",")
        .map((id) => Number(id.trim()))
        .filter((id) => Number.isInteger(id) && id > 0)
    ),
  ];
}

export async function guardarCategoriasHome(formData: FormData) {
  await requerirAdmin();

  const titulo =
    obtenerTexto(formData, "titulo") || "Categorías principales";

  const subtitulo =
    obtenerTexto(formData, "subtitulo") ||
    "Explora nuestros productos por categoría.";

  const activo = formData.get("activo") === "on";

  const idsSolicitados = obtenerIdsCategorias(formData);

  let categoriaIds: number[] = [];

  if (idsSolicitados.length > 0) {
    const categoriasExistentes = await prisma.categoria.findMany({
      where: {
        id: {
          in: idsSolicitados,
        },
        activa: true,
      },
      select: {
        id: true,
      },
    });

    const idsValidos = new Set(
      categoriasExistentes.map((categoria) => categoria.id)
    );

    categoriaIds = idsSolicitados.filter((id) =>
      idsValidos.has(id)
    );
  }

  const configuracion = {
    categoriaIds,
  };

  const seccionExistente = await prisma.homeSection.findFirst({
    where: {
      tipo: TIPO_SECCION,
    },
    orderBy: {
      id: "asc",
    },
    select: {
      id: true,
    },
  });

  if (seccionExistente) {
    await prisma.homeSection.update({
      where: {
        id: seccionExistente.id,
      },
      data: {
        nombre: "Categorías",
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
        nombre: "Categorías",
        titulo,
        subtitulo,
        configuracion,
        orden: 2,
        activo,
      },
    });
  }

  revalidatePath("/");
  revalidatePath("/admin/home");
  revalidatePath("/admin/home/categorias");

  redirect("/admin/home/categorias?guardado=1");
}