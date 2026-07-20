import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { enviarNotificacionNuevoPedido } from "@/lib/enviar-notificacion-pedido";

type CrearPedidoBody = {
  productoId?: number;
  cantidad?: number;
  nombre?: string;
  celular?: string;
  ciudad?: string;
  region?: string;
  direccion?: string;
  referencia?: string;
};

function limpiarTexto(valor: unknown) {
  return typeof valor === "string" ? valor.trim() : "";
}

function generarCodigoPedido() {
  const fecha = Date.now().toString().slice(-8);
  const aleatorio = Math.floor(100 + Math.random() * 900);

  return `KF-${fecha}-${aleatorio}`;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CrearPedidoBody;

    const productoId = Number(body.productoId);

    const cantidad = Math.max(
      1,
      Math.floor(Number(body.cantidad) || 1),
    );

    const nombre = limpiarTexto(body.nombre);

    const celular = limpiarTexto(body.celular).replace(
      /\s+/g,
      "",
    );

    const ciudad = limpiarTexto(body.ciudad);
    const region = limpiarTexto(body.region);
    const direccion = limpiarTexto(body.direccion);
    const referencia = limpiarTexto(body.referencia);

    if (!Number.isInteger(productoId) || productoId <= 0) {
      return NextResponse.json(
        {
          ok: false,
          error: "El producto seleccionado no es válido.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      !nombre ||
      !celular ||
      !ciudad ||
      !region ||
      !direccion
    ) {
      return NextResponse.json(
        {
          ok: false,
          error: "Completa todos los campos obligatorios.",
        },
        {
          status: 400,
        },
      );
    }

    if (celular.length < 9) {
      return NextResponse.json(
        {
          ok: false,
          error: "Ingresa un número de celular válido.",
        },
        {
          status: 400,
        },
      );
    }

    /*
     * Buscamos el producto directamente en PostgreSQL.
     * De esta manera, el precio no puede ser modificado
     * desde el navegador del cliente.
     */
    const producto = await prisma.producto.findUnique({
      where: {
        id: productoId,
      },
      select: {
        id: true,
        nombre: true,
        precio: true,
      },
    });

    if (!producto) {
      return NextResponse.json(
        {
          ok: false,
          error: "El producto ya no se encuentra disponible.",
        },
        {
          status: 404,
        },
      );
    }

    const precioUnitario = Number(producto.precio);
    const subtotal = precioUnitario * cantidad;
    const costoEnvio = 0;
    const descuento = 0;
    const total = subtotal - descuento + costoEnvio;

    const resultado = await prisma.$transaction(async (tx) => {
      /*
       * Buscamos al cliente por celular.
       * Si ya existe, actualizamos sus datos.
       * Si no existe, creamos uno nuevo.
       */
      const clienteExistente = await tx.cliente.findFirst({
        where: {
          telefono: celular,
        },
      });

      const cliente = clienteExistente
        ? await tx.cliente.update({
            where: {
              id: clienteExistente.id,
            },
            data: {
              nombre,
              ciudad,
              region,
              direccion,
              referencia: referencia || null,
              activo: true,
            },
          })
        : await tx.cliente.create({
            data: {
              nombre,
              telefono: celular,
              ciudad,
              region,
              direccion,
              referencia: referencia || null,
            },
          });

      const pedido = await tx.pedido.create({
        data: {
          codigo: generarCodigoPedido(),

          clienteId: cliente.id,

          nombreCliente: nombre,
          telefonoCliente: celular,

          ciudad,
          region,
          direccion,
          referencia: referencia || null,

          estado: "NUEVO",
          estadoPago: "PENDIENTE",
          metodoPago: "CONTRA_ENTREGA",
          estadoEnvio: "PENDIENTE",

          subtotal,
          descuento,
          costoEnvio,
          total,

          montoAdelanto: 0,
          montoPendiente: total,

          items: {
            create: {
              productoId: producto.id,
              nombreProducto: producto.nombre,
              precioUnitario,
              cantidad,
              subtotal,
            },
          },

          historial: {
            create: {
              accion: "Pedido creado",
              descripcion:
                "El cliente realizó el pedido desde la tienda online.",
              estadoNuevo: "NUEVO",
              autor: "Tienda online",
            },
          },
        },
        select: {
  id: true,
  codigo: true,
  nombreCliente: true,
  telefonoCliente: true,
  total: true,
  estado: true,
},
      });

      return pedido;
    });

    /*
     * Enviamos la notificación después de guardar el pedido.
     *
     * La notificación está dentro de su propio try/catch para
     * evitar que un error de Firebase anule una compra que ya
     * fue registrada correctamente en PostgreSQL.
     */
    try {
      const resultadoNotificacion =
        await enviarNotificacionNuevoPedido({
  id: resultado.id,
  codigo: resultado.codigo,
  nombreCliente: resultado.nombreCliente,
  telefonoCliente: resultado.telefonoCliente,
  total: Number(resultado.total),
});

      console.log(
        "Resultado de notificación push:",
        resultadoNotificacion,
      );
    } catch (errorNotificacion) {
      console.error(
        "El pedido se registró, pero no se pudo enviar la notificación:",
        errorNotificacion,
      );
    }

    return NextResponse.json(
      {
        ok: true,
        mensaje: "Pedido registrado correctamente.",
        pedido: {
          id: resultado.id,
          codigo: resultado.codigo,
          total: Number(resultado.total),
          estado: resultado.estado,
        },
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("Error al crear el pedido:", error);

    return NextResponse.json(
      {
        ok: false,
        error:
          "No pudimos registrar el pedido. Inténtalo nuevamente.",
      },
      {
        status: 500,
      },
    );
  }
}