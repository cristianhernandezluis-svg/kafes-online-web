"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requerirAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma";

function crearSlug(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function obtenerTexto(formData: FormData, campo: string) {
  return String(formData.get(campo) ?? "").trim();
}

function obtenerNumero(formData: FormData, campo: string, defecto = 0) {
  const valor = Number(formData.get(campo));

  return Number.isFinite(valor) ? valor : defecto;
}

export async function crearProducto(formData: FormData) {
  await requerirAdmin();
  const nombre = obtenerTexto(formData, "nombre");
  const slugIngresado = obtenerTexto(formData, "slug");
  const descripcionCorta = obtenerTexto(formData, "descripcionCorta");
  const descripcion = obtenerTexto(formData, "descripcion");
  const sku = obtenerTexto(formData, "sku");
  const seoTitulo = obtenerTexto(formData, "seoTitulo");
  const seoDescripcion = obtenerTexto(formData, "seoDescripcion");

  const precio = obtenerNumero(formData, "precio");
  const precioAntes = obtenerNumero(formData, "precioAntes");
  const stock = Math.max(0, Math.trunc(obtenerNumero(formData, "stock")));

  const estadoIngresado = obtenerTexto(formData, "estado");
  const destacado = formData.get("destacado") === "on";

  if (!nombre) {
    throw new Error("El nombre del producto es obligatorio.");
  }

  if (precio <= 0) {
    throw new Error("El precio debe ser mayor que cero.");
  }

  const slugBase = crearSlug(slugIngresado || nombre);

  if (!slugBase) {
    throw new Error("No se pudo generar un slug válido.");
  }

  let slugFinal = slugBase;
  let contador = 2;

  while (
    await prisma.producto.findUnique({
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

  const estadosPermitidos = [
    "BORRADOR",
    "PUBLICADO",
    "OCULTO",
    "AGOTADO",
    "ARCHIVADO",
  ] as const;

  const estado = estadosPermitidos.includes(
    estadoIngresado as (typeof estadosPermitidos)[number],
  )
    ? (estadoIngresado as (typeof estadosPermitidos)[number])
    : "BORRADOR";

  await prisma.producto.create({
    data: {
      nombre,
      slug: slugFinal,
      sku: sku || null,
      descripcionCorta: descripcionCorta || null,
      descripcion: descripcion || null,
      precio,
      precioAntes: precioAntes > 0 ? precioAntes : null,
      stock,
      estado,
      destacado,
      seoTitulo: seoTitulo || nombre,
      seoDescripcion: seoDescripcion || descripcionCorta || null,
      publishedAt: estado === "PUBLICADO" ? new Date() : null,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/productos");
  revalidatePath("/");

  redirect("/admin/productos");
}
export async function actualizarProducto(formData: FormData) {
  await requerirAdmin();
  const productoId = Number(formData.get("productoId"));

  if (!Number.isInteger(productoId) || productoId <= 0) {
    throw new Error("Producto inválido.");
  }

  const contenidoHtml = obtenerTexto(formData, "contenidoHtml");
  const nombre = obtenerTexto(formData, "nombre");
  const slugIngresado = obtenerTexto(formData, "slug");
  const descripcionCorta = obtenerTexto(
    formData,
    "descripcionCorta",
  );
  const descripcion = obtenerTexto(formData, "descripcion");
  const sku = obtenerTexto(formData, "sku");
  const seoTitulo = obtenerTexto(formData, "seoTitulo");
  const seoDescripcion = obtenerTexto(
    formData,
    "seoDescripcion",
  );

  const precio = obtenerNumero(formData, "precio");
  const precioAntes = obtenerNumero(formData, "precioAntes");
  const stock = Math.max(
    0,
    Math.trunc(obtenerNumero(formData, "stock")),
  );

  const estadoIngresado = obtenerTexto(formData, "estado");
  const destacado = formData.get("destacado") === "on";

  if (!nombre) {
    throw new Error("El nombre es obligatorio.");
  }

  if (precio <= 0) {
    throw new Error("El precio debe ser mayor que cero.");
  }

  const slugBase = crearSlug(slugIngresado || nombre);

  if (!slugBase) {
    throw new Error("El slug no es válido.");
  }

  const productoActual = await prisma.producto.findUnique({
    where: {
      id: productoId,
    },
    select: {
      id: true,
      estado: true,
      publishedAt: true,
    },
  });

  if (!productoActual) {
    throw new Error("El producto no existe.");
  }

  let slugFinal = slugBase;
  let contador = 2;

  while (true) {
    const productoConSlug = await prisma.producto.findUnique({
      where: {
        slug: slugFinal,
      },
      select: {
        id: true,
      },
    });

    if (!productoConSlug || productoConSlug.id === productoId) {
      break;
    }

    slugFinal = `${slugBase}-${contador}`;
    contador += 1;
  }

  if (sku) {
    const productoConSku = await prisma.producto.findUnique({
      where: {
        sku,
      },
      select: {
        id: true,
      },
    });

    if (productoConSku && productoConSku.id !== productoId) {
      throw new Error("Ese SKU ya pertenece a otro producto.");
    }
  }

  const estadosPermitidos = [
    "BORRADOR",
    "PUBLICADO",
    "OCULTO",
    "AGOTADO",
    "ARCHIVADO",
  ] as const;

  const estado = estadosPermitidos.includes(
    estadoIngresado as (typeof estadosPermitidos)[number],
  )
    ? (estadoIngresado as (typeof estadosPermitidos)[number])
    : "BORRADOR";

  await prisma.producto.update({
  where: {
    id: productoId,
  },
  data: {
    nombre,
    slug: slugFinal,
    sku: sku || null,
    descripcionCorta: descripcionCorta || null,
    descripcion: descripcion || null,
    contenidoHtml: contenidoHtml || null,
    precio,
    precioAntes: precioAntes > 0 ? precioAntes : null,
    stock,
    estado,
    destacado,
    seoTitulo: seoTitulo || nombre,
    seoDescripcion:
      seoDescripcion || descripcionCorta || null,
    publishedAt:
      estado === "PUBLICADO"
        ? productoActual.publishedAt ?? new Date()
        : productoActual.publishedAt,
  },
});

  revalidatePath("/admin");
  revalidatePath("/admin/productos");
  revalidatePath(`/admin/productos/${productoId}/editar`);
  revalidatePath(`/producto/${slugFinal}`);

  redirect(
    `/admin/productos/${productoId}/editar?tab=informacion&guardado=1`,
  );
}