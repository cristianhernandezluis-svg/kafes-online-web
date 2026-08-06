"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requerirAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma";

const TIPO_SECCION = "BENEFICIOS";

const ICONOS_PERMITIDOS = new Set([
  "camion",
  "escudo",
  "tarjeta",
  "audifonos",
]);

const BENEFICIOS_PREDETERMINADOS = [
  {
    titulo: "Envíos nacionales",
    texto: "Llegamos a todo el Perú.",
    icono: "camion",
    orden: 1,
  },
  {
    titulo: "Compra confiable",
    texto: "Productos con garantía.",
    icono: "escudo",
    orden: 2,
  },
  {
    titulo: "Pago seguro",
    texto: "Compra mediante Izipay.",
    icono: "tarjeta",
    orden: 3,
  },
  {
    titulo: "Atención personalizada",
    texto: "Asesoría rápida por WhatsApp.",
    icono: "audifonos",
    orden: 4,
  },
];

function obtenerTexto(
  formData: FormData,
  campo: string
) {
  return String(formData.get(campo) ?? "").trim();
}

function obtenerOrden(
  formData: FormData,
  campo: string,
  predeterminado: number
) {
  const valor = Number(formData.get(campo));

  return Number.isInteger(valor) &&
    valor >= 1 &&
    valor <= 4
    ? valor
    : predeterminado;
}

function obtenerBeneficio(
  formData: FormData,
  indice: number
) {
  const predeterminado =
    BENEFICIOS_PREDETERMINADOS[indice];

  const titulo =
    obtenerTexto(
      formData,
      `beneficio${indice}Titulo`
    ) || predeterminado.titulo;

  const texto =
    obtenerTexto(
      formData,
      `beneficio${indice}Texto`
    ) || predeterminado.texto;

  const iconoIngresado = obtenerTexto(
    formData,
    `beneficio${indice}Icono`
  );

  const icono = ICONOS_PERMITIDOS.has(
    iconoIngresado
  )
    ? iconoIngresado
    : predeterminado.icono;

  const orden = obtenerOrden(
    formData,
    `beneficio${indice}Orden`,
    predeterminado.orden
  );

  return {
    titulo,
    texto,
    icono,
    orden,
  };
}

export async function guardarBeneficiosHome(
  formData: FormData
) {
  await requerirAdmin();

  const activo =
    formData.get("activo") === "on";

  const beneficios = [0, 1, 2, 3]
    .map((indice) =>
      obtenerBeneficio(formData, indice)
    )
    .sort((a, b) => a.orden - b.orden);

  const configuracion = {
    beneficios,
  };

  const seccionExistente =
    await prisma.homeSection.findFirst({
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
        nombre: "Beneficios",
        titulo: "Beneficios de comprar en KAFES",
        subtitulo:
          "Envíos, garantía, pago seguro y atención personalizada",
        configuracion,
        activo,
      },
    });
  } else {
    await prisma.homeSection.create({
      data: {
        tipo: TIPO_SECCION,
        nombre: "Beneficios",
        titulo: "Beneficios de comprar en KAFES",
        subtitulo:
          "Envíos, garantía, pago seguro y atención personalizada",
        configuracion,
        orden: 3,
        activo,
      },
    });
  }

  revalidatePath("/");
  revalidatePath("/admin/home");
  revalidatePath("/admin/home/beneficios");

  redirect(
    "/admin/home/beneficios?guardado=1"
  );
}