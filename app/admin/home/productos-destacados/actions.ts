"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requerirAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma";

const TIPO_SECCION = "PRODUCTOS_DESTACADOS";

function obtenerTexto(formData: FormData, campo: string) {
  return String(formData.get(campo) ?? "").trim();
}

function obtenerEntero(
  formData: FormData,
  campo: string,
  valorPredeterminado: number
) {
  const valor = Number(formData.get(campo));

  if (!Number.isFinite(valor)) {
    return valorPredeterminado;
  }

  return Math.trunc(valor);
}

function obtenerIdsProductos(formData: FormData) {
  const valor = obtenerTexto(formData, "productoIds");

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

export async function guardarProductosDestacados(formData: FormData) {
  await requerirAdmin();

  const titulo =
    obtenerTexto(formData, "titulo") || "Productos destacados";

  const subtitulo =
    obtenerTexto(formData, "subtitulo") || null;

  const cantidadSolicitada = obtenerEntero(formData, "cantidad", 8);

  const cantidad = Math.min(
    Math.max(cantidadSolicitada, 1),
    12
  );

  const textoBoton =
    obtenerTexto(formData, "textoBoton") || "Ver todos los productos";

  const hrefBoton =
    obtenerTexto(formData, "hrefBoton") || "/productos";

  const activo = formData.get("activo") === "on";

  const idsSolicitados = obtenerIdsProductos(formData);

  let productoIds: number[] = [];

  if (idsSolicitados.length > 0) {
    const productosExistentes = await prisma.producto.findMany({
      where: {
        id: {
          in: idsSolicitados,
        },
        estado: "PUBLICADO",
      },
      select: {
        id: true,
      },
    });

    const idsValidos = new Set(
      productosExistentes.map((producto) => producto.id)
    );

    productoIds = idsSolicitados.filter((id) => idsValidos.has(id));
  }

  const configuracion = {
    cantidad,
    textoBoton,
    hrefBoton,
    productoIds,
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
        nombre: "Productos destacados",
        titulo,
        subtitulo,
        configuracion,
        orden: 20,
        activo,
      },
    });
  } else {
    await prisma.homeSection.create({
      data: {
        tipo: TIPO_SECCION,
        nombre: "Productos destacados",
        titulo,
        subtitulo,
        configuracion,
        orden: 20,
        activo,
      },
    });
  }

  revalidatePath("/");
  revalidatePath("/admin/home");
  revalidatePath("/admin/home/productos-destacados");

  redirect("/admin/home/productos-destacados?guardado=1");
}