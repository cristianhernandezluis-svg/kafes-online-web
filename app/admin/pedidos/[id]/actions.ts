"use server";

import { revalidatePath } from "next/cache";

import { requerirAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma";

const ESTADOS_PERMITIDOS = [
  "NUEVO",
  "CONFIRMADO",
  "PREPARANDO",
  "ENVIADO",
  "ENTREGADO",
  "CANCELADO",
] as const;

type EstadoPedidoPermitido =
  (typeof ESTADOS_PERMITIDOS)[number];

function esEstadoPermitido(
  valor: string
): valor is EstadoPedidoPermitido {
  return ESTADOS_PERMITIDOS.includes(
    valor as EstadoPedidoPermitido
  );
}

function descripcionEstado(
  estado: EstadoPedidoPermitido
) {
  const textos: Record<
    EstadoPedidoPermitido,
    string
  > = {
    NUEVO: "El pedido fue marcado como nuevo.",
    CONFIRMADO:
      "El pedido fue confirmado.",
    PREPARANDO:
      "El pedido está siendo preparado.",
    ENVIADO:
      "El pedido fue marcado como enviado.",
    ENTREGADO:
      "El pedido fue marcado como entregado.",
    CANCELADO:
      "El pedido fue cancelado.",
  };

  return textos[estado];
}

export async function cambiarEstadoPedido(
  formData: FormData
) {
  await requerirAdmin();

  const pedidoId = Number(
    formData.get("pedidoId")
  );

  const nuevoEstado = String(
    formData.get("nuevoEstado") ?? ""
  );

  if (
    !Number.isInteger(pedidoId) ||
    pedidoId <= 0
  ) {
    throw new Error(
      "El pedido no es válido."
    );
  }

  if (!esEstadoPermitido(nuevoEstado)) {
    throw new Error(
      "El estado seleccionado no es válido."
    );
  }

  const pedido =
    await prisma.pedido.findUnique({
      where: {
        id: pedidoId,
      },
      select: {
        id: true,
        estado: true,
      },
    });

  if (!pedido) {
    throw new Error(
      "El pedido no existe."
    );
  }

  if (pedido.estado === nuevoEstado) {
    revalidatePath(
      `/admin/pedidos/${pedidoId}`
    );
    revalidatePath("/admin/pedidos");
    return;
  }

  const ahora = new Date();

  const datosFecha: {
    confirmadoAt?: Date;
    enviadoAt?: Date;
    entregadoAt?: Date;
    canceladoAt?: Date;
  } = {};

  if (nuevoEstado === "CONFIRMADO") {
    datosFecha.confirmadoAt = ahora;
  }

  if (nuevoEstado === "ENVIADO") {
    datosFecha.enviadoAt = ahora;
  }

  if (nuevoEstado === "ENTREGADO") {
    datosFecha.entregadoAt = ahora;
  }

  if (nuevoEstado === "CANCELADO") {
    datosFecha.canceladoAt = ahora;
  }

  const datosEnvio: {
    estadoEnvio?:
      | "PENDIENTE"
      | "PREPARANDO"
      | "DESPACHADO"
      | "ENTREGADO";
  } = {};

  if (nuevoEstado === "NUEVO") {
    datosEnvio.estadoEnvio =
      "PENDIENTE";
  }

  if (nuevoEstado === "CONFIRMADO") {
    datosEnvio.estadoEnvio =
      "PENDIENTE";
  }

  if (nuevoEstado === "PREPARANDO") {
    datosEnvio.estadoEnvio =
      "PREPARANDO";
  }

  if (nuevoEstado === "ENVIADO") {
    datosEnvio.estadoEnvio =
      "DESPACHADO";
  }

  if (nuevoEstado === "ENTREGADO") {
    datosEnvio.estadoEnvio =
      "ENTREGADO";
  }

  await prisma.$transaction([
    prisma.pedido.update({
      where: {
        id: pedidoId,
      },
      data: {
        estado: nuevoEstado,
        ...datosFecha,
        ...datosEnvio,
      },
    }),

    prisma.pedidoHistorial.create({
      data: {
        pedidoId,
        accion: "Estado actualizado",
        descripcion:
          descripcionEstado(nuevoEstado),
        estadoAntes: pedido.estado,
        estadoNuevo: nuevoEstado,
        autor: "Administrador",
      },
    }),
  ]);

  revalidatePath(
    `/admin/pedidos/${pedidoId}`
  );

  revalidatePath("/admin/pedidos");
}