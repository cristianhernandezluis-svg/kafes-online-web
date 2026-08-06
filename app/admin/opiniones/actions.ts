"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requerirAdmin } from "@/lib/auth";
import { getCloudinary } from "@/lib/cloudinary";
import prisma from "@/lib/prisma";

function obtenerTexto(
  formData: FormData,
  campo: string
) {
  return String(
    formData.get(campo) ?? ""
  ).trim();
}

function obtenerEntero(
  formData: FormData,
  campo: string,
  predeterminado: number
) {
  const valor = Number(formData.get(campo));

  return Number.isInteger(valor)
    ? valor
    : predeterminado;
}

function obtenerCalificacion(
  formData: FormData
) {
  const valor = obtenerEntero(
    formData,
    "calificacion",
    5
  );

  return Math.min(5, Math.max(1, valor));
}

function obtenerFecha(
  formData: FormData
) {
  const fechaIngresada = obtenerTexto(
    formData,
    "fecha"
  );

  if (!fechaIngresada) {
    return new Date();
  }

  const fecha = new Date(
    `${fechaIngresada}T12:00:00.000Z`
  );

  return Number.isNaN(fecha.getTime())
    ? new Date()
    : fecha;
}

async function obtenerProducto(
  productoId: number
) {
  const producto =
    await prisma.producto.findUnique({
      where: {
        id: productoId,
      },
      select: {
        id: true,
        slug: true,
      },
    });

  if (!producto) {
    throw new Error(
      "El producto seleccionado no existe."
    );
  }

  return producto;
}

async function eliminarImagenCloudinary(
  publicId: string | null
) {
  if (!publicId) {
    return;
  }

  try {
    await getCloudinary().api.delete_resources(
      [publicId],
      {
        resource_type: "image",
      }
    );
  } catch (error) {
    console.error(
      "No se pudo eliminar la imagen de la opinión:",
      error
    );
  }
}

export async function crearOpinion(
  formData: FormData
) {
  await requerirAdmin();

  const productoId = Number(
    formData.get("productoId")
  );

  if (
    !Number.isInteger(productoId) ||
    productoId <= 0
  ) {
    throw new Error(
      "Selecciona un producto válido."
    );
  }

  const producto =
    await obtenerProducto(productoId);

  const clienteNombre = obtenerTexto(
    formData,
    "clienteNombre"
  );

  const ciudad = obtenerTexto(
    formData,
    "ciudad"
  );

  const comentario = obtenerTexto(
    formData,
    "comentario"
  );

  const imagenUrl = obtenerTexto(
    formData,
    "imagenUrl"
  );

  const imagenPublicId = obtenerTexto(
    formData,
    "imagenPublicId"
  );

  const calificacion =
    obtenerCalificacion(formData);

  const compraVerificada =
    formData.get("compraVerificada") === "on";

  const visible =
    formData.get("visible") === "on";

  const orden = Math.max(
    0,
    obtenerEntero(formData, "orden", 0)
  );

  const fecha = obtenerFecha(formData);

  if (!clienteNombre) {
    throw new Error(
      "El nombre del cliente es obligatorio."
    );
  }

  if (!comentario) {
    throw new Error(
      "El comentario es obligatorio."
    );
  }

  await prisma.opinion.create({
    data: {
      productoId,
      clienteNombre,
      ciudad: ciudad || null,
      comentario,
      calificacion,
      imagenUrl: imagenUrl || null,
      imagenPublicId:
        imagenPublicId || null,
      compraVerificada,
      visible,
      orden,
      fecha,
    },
  });

  revalidatePath("/admin/opiniones");
  revalidatePath(
    `/producto/${producto.slug}`
  );

  redirect("/admin/opiniones");
}

export async function actualizarOpinion(
  formData: FormData
) {
  await requerirAdmin();

  const opinionId = Number(
    formData.get("opinionId")
  );

  const productoId = Number(
    formData.get("productoId")
  );

  if (
    !Number.isInteger(opinionId) ||
    opinionId <= 0
  ) {
    throw new Error("Opinión inválida.");
  }

  if (
    !Number.isInteger(productoId) ||
    productoId <= 0
  ) {
    throw new Error(
      "Selecciona un producto válido."
    );
  }

  const opinionActual =
    await prisma.opinion.findUnique({
      where: {
        id: opinionId,
      },
      include: {
        producto: {
          select: {
            slug: true,
          },
        },
      },
    });

  if (!opinionActual) {
    throw new Error(
      "La opinión no existe."
    );
  }

  const producto =
    await obtenerProducto(productoId);

  const clienteNombre = obtenerTexto(
    formData,
    "clienteNombre"
  );

  const ciudad = obtenerTexto(
    formData,
    "ciudad"
  );

  const comentario = obtenerTexto(
    formData,
    "comentario"
  );

  const imagenUrl = obtenerTexto(
    formData,
    "imagenUrl"
  );

  const imagenPublicId = obtenerTexto(
    formData,
    "imagenPublicId"
  );

  const calificacion =
    obtenerCalificacion(formData);

  const compraVerificada =
    formData.get("compraVerificada") === "on";

  const visible =
    formData.get("visible") === "on";

  const orden = Math.max(
    0,
    obtenerEntero(formData, "orden", 0)
  );

  const fecha = obtenerFecha(formData);

  if (!clienteNombre) {
    throw new Error(
      "El nombre del cliente es obligatorio."
    );
  }

  if (!comentario) {
    throw new Error(
      "El comentario es obligatorio."
    );
  }

  await prisma.opinion.update({
    where: {
      id: opinionId,
    },
    data: {
      productoId,
      clienteNombre,
      ciudad: ciudad || null,
      comentario,
      calificacion,
      imagenUrl: imagenUrl || null,
      imagenPublicId:
        imagenPublicId || null,
      compraVerificada,
      visible,
      orden,
      fecha,
    },
  });

  if (
    opinionActual.imagenPublicId &&
    opinionActual.imagenPublicId !==
      imagenPublicId
  ) {
    await eliminarImagenCloudinary(
      opinionActual.imagenPublicId
    );
  }

  revalidatePath("/admin/opiniones");
  revalidatePath(
    `/admin/opiniones/${opinionId}/editar`
  );
  revalidatePath(
    `/producto/${opinionActual.producto.slug}`
  );
  revalidatePath(
    `/producto/${producto.slug}`
  );

  redirect(
    `/admin/opiniones/${opinionId}/editar?guardado=1`
  );
}

export async function cambiarEstadoOpinion(
  formData: FormData
) {
  await requerirAdmin();

  const opinionId = Number(
    formData.get("opinionId")
  );

  if (
    !Number.isInteger(opinionId) ||
    opinionId <= 0
  ) {
    throw new Error("Opinión inválida.");
  }

  const visible =
    formData.get("visible") === "true";

  const opinion =
    await prisma.opinion.update({
      where: {
        id: opinionId,
      },
      data: {
        visible,
      },
      select: {
        producto: {
          select: {
            slug: true,
          },
        },
      },
    });

  revalidatePath("/admin/opiniones");
  revalidatePath(
    `/producto/${opinion.producto.slug}`
  );
}

export async function eliminarOpinion(
  formData: FormData
) {
  await requerirAdmin();

  const opinionId = Number(
    formData.get("opinionId")
  );

  if (
    !Number.isInteger(opinionId) ||
    opinionId <= 0
  ) {
    throw new Error("Opinión inválida.");
  }

  const opinion =
    await prisma.opinion.findUnique({
      where: {
        id: opinionId,
      },
      select: {
        imagenPublicId: true,
        producto: {
          select: {
            slug: true,
          },
        },
      },
    });

  if (!opinion) {
    throw new Error(
      "La opinión no existe."
    );
  }

  await prisma.opinion.delete({
    where: {
      id: opinionId,
    },
  });

  await eliminarImagenCloudinary(
    opinion.imagenPublicId
  );

  revalidatePath("/admin/opiniones");
  revalidatePath(
    `/producto/${opinion.producto.slug}`
  );

  redirect("/admin/opiniones");
}