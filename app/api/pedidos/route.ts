import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { enviarNotificacionNuevoPedido } from "@/lib/enviar-notificacion-pedido";

type CrearPedidoBody = {
  productoId?: number;
  cantidad?: number;
  nombre?: string;
  celular?: string;
  dni?: string;
  ciudad?: string;
  region?: string;
  direccion?: string;
  referencia?: string;
sessionId?: string | null;
  utmSource?: string | null;
utmMedium?: string | null;
utmCampaign?: string | null;
utmContent?: string | null;
utmTerm?: string | null;

fbclid?: string | null;
ttclid?: string | null;

landingPath?: string | null;
referrer?: string | null;
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

    const configuracion =
      await prisma.configuracionTienda.findUnique({
        where: {
          id: 1,
        },
        select: {
          checkoutActivo: true,
checkoutTipoPedido: true,
checkoutMontoAdelanto: true,
checkoutMostrarDni: true,
checkoutDniObligatorio: true,

          checkoutMostrarCiudad: true,
          checkoutCiudadObligatoria: true,

          checkoutMostrarRegion: true,
          checkoutRegionObligatoria: true,

          checkoutMostrarDireccion: true,
          checkoutDireccionObligatoria: true,

          checkoutMostrarReferencia: true,
          checkoutReferenciaObligatoria: true,

          checkoutPermitirCantidad: true,
          checkoutCantidadMaxima: true,
        },
      });

    const checkoutActivo =
      configuracion?.checkoutActivo ?? true;

const checkoutTipoPedido =
  configuracion?.checkoutTipoPedido ??
  "CONTRAENTREGA";

const metodoPago =
  checkoutTipoPedido === "CONTRAENTREGA"
    ? "CONTRA_ENTREGA"
    : "OTRO";

    if (!checkoutActivo) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Los pedidos están temporalmente desactivados.",
        },
        {
          status: 503,
        },
      );
    }

    const productoId = Number(body.productoId);

    const cantidadSolicitada = Math.max(
      1,
      Math.floor(Number(body.cantidad) || 1),
    );

    const cantidadMaxima = Math.max(
      1,
      configuracion?.checkoutCantidadMaxima ?? 5,
    );

    const permitirCantidad =
      configuracion?.checkoutPermitirCantidad ??
      true;

    const cantidad = permitirCantidad
      ? Math.min(
          cantidadSolicitada,
          cantidadMaxima,
        )
      : 1;

    const nombre = limpiarTexto(body.nombre);

    const celular = limpiarTexto(
      body.celular,
    ).replace(/\s+/g, "");

const dni = limpiarTexto(
  body.dni
).replace(/\D/g, "");

const mostrarDni =
  configuracion?.checkoutMostrarDni ??
  false;

const dniObligatorio =
  mostrarDni &&
  (configuracion?.checkoutDniObligatorio ??
    false);

if (dniObligatorio && !dni) {
  return NextResponse.json(
    {
      ok: false,
      error: "Ingresa tu DNI.",
    },
    {
      status: 400,
    },
  );
}

if (dni && dni.length !== 8) {
  return NextResponse.json(
    {
      ok: false,
      error:
        "El DNI debe tener 8 dígitos.",
    },
    {
      status: 400,
    },
  );
}

    const ciudad = limpiarTexto(body.ciudad);
    const region = limpiarTexto(body.region);
    const direccion = limpiarTexto(
      body.direccion,
    );
    const referencia = limpiarTexto(
      body.referencia,
    );

const utmSource =
  limpiarTexto(body.utmSource) || null;

const utmMedium =
  limpiarTexto(body.utmMedium) || null;

const utmCampaign =
  limpiarTexto(body.utmCampaign) || null;

const utmContent =
  limpiarTexto(body.utmContent) || null;

const utmTerm =
  limpiarTexto(body.utmTerm) || null;

const fbclid =
  limpiarTexto(body.fbclid) || null;

const ttclid =
  limpiarTexto(body.ttclid) || null;

const landingPath =
  limpiarTexto(body.landingPath) || null;

const referrer =
  limpiarTexto(body.referrer) || null;

const sessionIdSolicitado =
  limpiarTexto(body.sessionId) || null;

const sesionAnalitica =
  sessionIdSolicitado
    ? await prisma.sesionAnalitica.findUnique({
        where: {
          sessionId: sessionIdSolicitado,
        },
        select: {
          sessionId: true,
        },
      })
    : null;

const sessionId =
  sesionAnalitica?.sessionId ?? null;

    if (
      !Number.isInteger(productoId) ||
      productoId <= 0
    ) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "El producto seleccionado no es válido.",
        },
        {
          status: 400,
        },
      );
    }

    if (!nombre || !celular) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Completa tu nombre y celular.",
        },
        {
          status: 400,
        },
      );
    }

    const mostrarCiudad =
      configuracion?.checkoutMostrarCiudad ??
      true;

    const ciudadObligatoria =
      mostrarCiudad &&
      (configuracion?.checkoutCiudadObligatoria ??
        true);

    const mostrarRegion =
      configuracion?.checkoutMostrarRegion ??
      true;

    const regionObligatoria =
      mostrarRegion &&
      (configuracion?.checkoutRegionObligatoria ??
        true);

    const mostrarDireccion =
      configuracion?.checkoutMostrarDireccion ??
      true;

    const direccionObligatoria =
      mostrarDireccion &&
      (configuracion?.checkoutDireccionObligatoria ??
        true);

    if (ciudadObligatoria && !ciudad) {
      return NextResponse.json(
        {
          ok: false,
          error: "Ingresa tu ciudad o distrito.",
        },
        {
          status: 400,
        },
      );
    }

    if (regionObligatoria && !region) {
      return NextResponse.json(
        {
          ok: false,
          error: "Selecciona tu región.",
        },
        {
          status: 400,
        },
      );
    }

    if (direccionObligatoria && !direccion) {
      return NextResponse.json(
        {
          ok: false,
          error: "Ingresa tu dirección de entrega.",
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
          error:
            "Ingresa un número de celular válido.",
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
        imagenes: {
          orderBy: [{ esPrincipal: "desc" }, { orden: "asc" }],
          take: 1,
          select: { url: true },
        },
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

const montoAdelantoConfigurado = Math.max(
  0,
  Number(
    configuracion?.checkoutMontoAdelanto ?? 30
  )
);

let montoAdelanto = 0;
let montoPendiente = total;

if (checkoutTipoPedido === "ADELANTO") {
  montoAdelanto = Math.min(
    montoAdelantoConfigurado,
    total
  );

  montoPendiente = Math.max(
    0,
    total - montoAdelanto
  );
}

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
  dni: dni || null,
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
  dni: dni || null,
  ciudad,
  region,
  direccion,
  referencia: referencia || null,
},
          });

      const pedido = await tx.pedido.create({
        data: {
          codigo: generarCodigoPedido(),

          sessionId,

          clienteId: cliente.id,

          nombreCliente: nombre,
          telefonoCliente: celular,
          dniCliente: dni || null,

          ciudad,
          region,
          direccion,
          referencia: referencia || null,

          estado: "NUEVO",
estadoPago: "PENDIENTE",
metodoPago,
tipoPedido: checkoutTipoPedido,
utmSource,
utmMedium,
utmCampaign,
utmContent,
utmTerm,

fbclid,
ttclid,

landingPath,
referrer,
estadoEnvio: "PENDIENTE",

          subtotal,
          descuento,
          costoEnvio,
          total,

          montoAdelanto,
montoPendiente,

          items: {
            create: {
              productoId: producto.id,
              nombreProducto: producto.nombre,
              imagenUrl: producto.imagenes[0]?.url ?? null,
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

      if (sessionId) {
        const ahoraRecuperado = new Date();

        await tx.carritoAbandonado.updateMany({
          where: { sessionId },
          data: {
            estado: "RECUPERADO",
            pedidoId: pedido.id,
            recuperadoAt: ahoraRecuperado,
            ultimaActividadAt: ahoraRecuperado,
          },
        });
      }
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