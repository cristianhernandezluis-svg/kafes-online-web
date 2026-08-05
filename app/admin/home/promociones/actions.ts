"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requerirAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma";

const TIPO_SECCION = "PROMOCIONES";

const ICONOS_PERMITIDOS = new Set([
  "gotas",
  "arbol",
  "rayo",
]);

const FONDOS_PERMITIDOS = new Set([
  "azul",
  "verde",
  "oscuro",
  "rojo",
  "amarillo",
]);

const TARJETAS_PREDETERMINADAS = [
  {
    titulo: "Hidrolavadoras",
    texto: "Potencia para autos, motos y maquinaria.",
    href: "/categoria/hidrolavadoras",
    icono: "gotas",
    fondo: "azul",
  },
  {
    titulo: "Jardinería",
    texto: "Sierras, podadoras y cortasetos.",
    href: "/categoria/jardineria",
    icono: "arbol",
    fondo: "verde",
  },
  {
    titulo: "Generadores",
    texto: "Energía segura donde la necesites.",
    href: "/categoria/generadores",
    icono: "rayo",
    fondo: "oscuro",
  },
];

function obtenerTexto(
  formData: FormData,
  campo: string
) {
  return String(formData.get(campo) ?? "").trim();
}

function obtenerValorPermitido(
  valor: string,
  permitidos: Set<string>,
  valorPredeterminado: string
) {
  return permitidos.has(valor)
    ? valor
    : valorPredeterminado;
}

function obtenerTarjeta(
  formData: FormData,
  indice: number
) {
  const predeterminada =
    TARJETAS_PREDETERMINADAS[indice];

  const titulo =
    obtenerTexto(
      formData,
      `tarjeta${indice}Titulo`
    ) || predeterminada.titulo;

  const texto =
    obtenerTexto(
      formData,
      `tarjeta${indice}Texto`
    ) || predeterminada.texto;

  const href =
    obtenerTexto(
      formData,
      `tarjeta${indice}Href`
    ) || predeterminada.href;

  const icono = obtenerValorPermitido(
    obtenerTexto(
      formData,
      `tarjeta${indice}Icono`
    ),
    ICONOS_PERMITIDOS,
    predeterminada.icono
  );

  const fondo = obtenerValorPermitido(
    obtenerTexto(
      formData,
      `tarjeta${indice}Fondo`
    ),
    FONDOS_PERMITIDOS,
    predeterminada.fondo
  );

  return {
    titulo,
    texto,
    href,
    icono,
    fondo,
  };
}

export async function guardarPromocionesHome(
  formData: FormData
) {
  await requerirAdmin();

  const titulo =
    obtenerTexto(formData, "titulo") ||
    "Ofertas especiales";

  const subtitulo =
    obtenerTexto(formData, "subtitulo") ||
    "Solo por tiempo limitado";

  const enlaceTodos =
    obtenerTexto(formData, "enlaceTodos") ||
    "#productos";

  const activo =
    formData.get("activo") === "on";

  const tarjetas = [0, 1, 2].map((indice) =>
    obtenerTarjeta(formData, indice)
  );

  const configuracion = {
    enlaceTodos,
    tarjetas,
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
        nombre: "Promociones",
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
        nombre: "Promociones",
        titulo,
        subtitulo,
        configuracion,
        orden: 4,
        activo,
      },
    });
  }

  revalidatePath("/");
  revalidatePath("/admin/home");
  revalidatePath("/admin/home/promociones");

  redirect(
    "/admin/home/promociones?guardado=1"
  );
}