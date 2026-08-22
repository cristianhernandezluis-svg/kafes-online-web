import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { cambiarEstadoPedido } from "./actions";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  User,
} from "lucide-react";

type PedidoDetallePageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatoMoneda(valor: number) {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
  }).format(valor);
}

function formatoFecha(fecha: Date) {
  return new Intl.DateTimeFormat("es-PE", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Lima",
  }).format(fecha);
}

function textoEstado(estado: string) {
  return estado.replaceAll("_", " ");
}

function textoTipoPedido(tipo: string) {
  if (tipo === "ADELANTO") {
    return "Pedido con adelanto";
  }

  if (tipo === "PAGO_COMPLETO") {
    return "Pago completo";
  }

  return "Pago contra entrega";
}

function textoMetodoPago(metodo: string) {
  const nombres: Record<string, string> = {
    CONTRA_ENTREGA: "Contra entrega",
    YAPE: "Yape",
    PLIN: "Plin",
    TRANSFERENCIA: "Transferencia",
    EFECTIVO: "Efectivo",
    OTRO: "Por definir",
  };

  return nombres[metodo] ?? textoEstado(metodo);
}

function claseEstado(estado: string) {
  const estilos: Record<string, string> = {
    NUEVO: "bg-blue-100 text-blue-700",
    CONFIRMADO: "bg-emerald-100 text-emerald-700",
    PREPARANDO: "bg-amber-100 text-amber-700",
    ENVIADO: "bg-violet-100 text-violet-700",
    ENTREGADO: "bg-green-100 text-green-700",
    CANCELADO: "bg-red-100 text-red-700",
  };

  return estilos[estado] ?? "bg-slate-100 text-slate-700";
}

export default async function PedidoDetallePage({
  params,
}: PedidoDetallePageProps) {
  const { id } = await params;
  const pedidoId = Number(id);

  if (!Number.isInteger(pedidoId) || pedidoId <= 0) {
    notFound();
  }

  const pedido = await prisma.pedido.findUnique({
    where: {
      id: pedidoId,
    },
    include: {
      items: {
        orderBy: {
          id: "asc",
        },
        include: {
          producto: {
            select: {
              imagenes: {
                orderBy: [{ esPrincipal: "desc" }, { orden: "asc" }],
                take: 1,
                select: { url: true },
              },
            },
          },
        },
      },
      historial: {
        orderBy: {
          createdAt: "desc",
        },
      },
      cliente: true,
    },
  });

  if (!pedido) {
    notFound();
  }

const [pedidoAnterior, pedidoSiguiente] = await Promise.all([
  prisma.pedido.findFirst({
    where: {
      id: {
        gt: pedido.id,
      },
    },
    orderBy: {
      id: "asc",
    },
    select: {
      id: true,
    },
  }),

  prisma.pedido.findFirst({
    where: {
      id: {
        lt: pedido.id,
      },
    },
    orderBy: {
      id: "desc",
    },
    select: {
      id: true,
    },
  }),
]);

  const telefonoWhatsApp = pedido.telefonoCliente.replace(/\D/g, "");

  const mensajeWhatsApp = encodeURIComponent(
    `Hola ${pedido.nombreCliente}, te escribimos de Kafes Online por tu pedido #${pedido.codigo}.`,
  );

  const enlaceWhatsApp = `https://wa.me/${telefonoWhatsApp}?text=${mensajeWhatsApp}`;

  return (
    <main className="min-h-screen bg-slate-100 p-3 sm:p-5 lg:p-6">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-5">
          <Link
            href="/admin/pedidos"
            className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-950"
          >
            <ArrowLeft size={17} />
            Volver a pedidos
          </Link>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                  Pedido #{pedido.codigo}
                </h1>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${claseEstado(
                    pedido.estado,
                  )}`}
                >
                  {textoEstado(pedido.estado)}
                </span>
              </div>

              <p className="mt-1 text-sm text-slate-500">
                Creado el {formatoFecha(pedido.createdAt)}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
  {pedidoAnterior ? (
    <Link
      href={`/admin/pedidos/${pedidoAnterior.id}`}
      className="inline-flex h-11 items-center justify-center gap-1 rounded-xl border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
    >
      <ChevronLeft size={19} />
      Anterior
    </Link>
  ) : (
    <span className="inline-flex h-11 cursor-not-allowed items-center justify-center gap-1 rounded-xl border border-slate-200 bg-slate-100 px-3 text-sm font-semibold text-slate-400">
      <ChevronLeft size={19} />
      Anterior
    </span>
  )}

  {pedidoSiguiente ? (
    <Link
      href={`/admin/pedidos/${pedidoSiguiente.id}`}
      className="inline-flex h-11 items-center justify-center gap-1 rounded-xl border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
    >
      Siguiente
      <ChevronRight size={19} />
    </Link>
  ) : (
    <span className="inline-flex h-11 cursor-not-allowed items-center justify-center gap-1 rounded-xl border border-slate-200 bg-slate-100 px-3 text-sm font-semibold text-slate-400">
      Siguiente
      <ChevronRight size={19} />
    </span>
  )}

  <a
    href={enlaceWhatsApp}
    target="_blank"
    rel="noreferrer"
    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-bold text-white transition hover:bg-emerald-700"
  >
    <MessageCircle size={18} />
    Contactar por WhatsApp
  </a>
</div>
          </div>
        </div>

        <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-4">
            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-5 py-3">
                <h2 className="flex items-center gap-2 text-base font-bold text-slate-950">
                  <Package size={20} />
                  Productos
                </h2>
              </div>

              <div className="divide-y divide-slate-100">
                {pedido.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 px-5 py-4"
                  >
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                      {item.imagenUrl || item.producto?.imagenes[0]?.url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.imagenUrl || item.producto?.imagenes[0]?.url || ""}
                          alt={item.nombreProducto}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <Package
                          size={28}
                          className="text-slate-400"
                        />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="font-semibold leading-snug text-slate-950">
                        {item.nombreProducto}
                      </p>

                      {item.skuProducto && (
                        <p className="mt-1 text-xs text-slate-500">
                          SKU: {item.skuProducto}
                        </p>
                      )}

                      <p className="mt-2 text-sm text-slate-600">
                        {item.cantidad} ×{" "}
                        {formatoMoneda(Number(item.precioUnitario))}
                      </p>
                    </div>

                    <div className="text-right font-black text-slate-950">
                      {formatoMoneda(Number(item.subtotal))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-200 bg-white px-5 py-4">
                <div className="ml-auto max-w-sm space-y-2">
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Subtotal</span>
                    <span>
                      {formatoMoneda(Number(pedido.subtotal))}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Descuento</span>
                    <span>
                      -{formatoMoneda(Number(pedido.descuento))}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Envío</span>
                    <span>
                      {formatoMoneda(Number(pedido.costoEnvio))}
                    </span>
                  </div>

                  <div className="flex justify-between border-t border-slate-300 pt-3 text-lg font-black text-slate-950">
                    <span>Total</span>
                    <span>
                      {formatoMoneda(Number(pedido.total))}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-base font-bold text-slate-950">
                Cronología
              </h2>

              {pedido.historial.length === 0 ? (
                <p className="mt-3 text-sm text-slate-500">
                  Todavía no hay movimientos registrados.
                </p>
              ) : (
                <div className="mt-3 space-y-3">
                  {pedido.historial.map((registro) => (
                    <div
                      key={registro.id}
                      className="relative border-l border-slate-200 pl-5"
                    >
                      <div className="absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full bg-slate-900" />

                      <p className="font-semibold text-slate-900">
                        {registro.accion}
                      </p>

                      {registro.descripcion && (
                        <p className="mt-0.5 text-sm text-slate-600">
                          {registro.descripcion}
                        </p>
                      )}

                      <p className="mt-1 text-xs text-slate-400">
                        {formatoFecha(registro.createdAt)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          <aside className="space-y-4">

            <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-base font-bold text-slate-950">
                Acciones rápidas
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Actualiza el estado operativo del pedido.
              </p>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <form action={cambiarEstadoPedido}>
                  <input
                    type="hidden"
                    name="pedidoId"
                    value={pedido.id}
                  />

                  <input
                    type="hidden"
                    name="nuevoEstado"
                    value="CONFIRMADO"
                  />

                  <button
                    type="submit"
                    disabled={pedido.estado === "CONFIRMADO"}
                    className="w-full rounded-lg bg-emerald-600 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Confirmar
                  </button>
                </form>

                <form action={cambiarEstadoPedido}>
                  <input
                    type="hidden"
                    name="pedidoId"
                    value={pedido.id}
                  />

                  <input
                    type="hidden"
                    name="nuevoEstado"
                    value="PREPARANDO"
                  />

                  <button
                    type="submit"
                    disabled={pedido.estado === "PREPARANDO"}
                    className="w-full rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm font-semibold text-amber-800 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Preparando
                  </button>
                </form>

                <form action={cambiarEstadoPedido}>
                  <input
                    type="hidden"
                    name="pedidoId"
                    value={pedido.id}
                  />

                  <input
                    type="hidden"
                    name="nuevoEstado"
                    value="ENVIADO"
                  />

                  <button
                    type="submit"
                    disabled={pedido.estado === "ENVIADO"}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Enviado
                  </button>
                </form>

                <form action={cambiarEstadoPedido}>
                  <input
                    type="hidden"
                    name="pedidoId"
                    value={pedido.id}
                  />

                  <input
                    type="hidden"
                    name="nuevoEstado"
                    value="ENTREGADO"
                  />

                  <button
                    type="submit"
                    disabled={pedido.estado === "ENTREGADO"}
                    className="w-full rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Entregado
                  </button>
                </form>

                <form
                  action={cambiarEstadoPedido}
                  className="col-span-2"
                >
                  <input
                    type="hidden"
                    name="pedidoId"
                    value={pedido.id}
                  />

                  <input
                    type="hidden"
                    name="nuevoEstado"
                    value="CANCELADO"
                  />

                  <button
                    type="submit"
                    disabled={pedido.estado === "CANCELADO"}
                    className="w-full rounded-lg border border-red-200 bg-white px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Cancelar pedido
                  </button>
                </form>
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-base font-bold text-slate-950">
                Estado del pedido
              </h2>

              <div className="mt-3 divide-y divide-slate-100">
                <div className="flex items-center justify-between py-2.5">
                  <span className="text-sm text-slate-600">
                    Pedido
                  </span>

                  <span
                    className={
                      "rounded-full px-3 py-1 text-xs font-bold " +
                      claseEstado(pedido.estado)
                    }
                  >
                    {textoEstado(pedido.estado)}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2.5">
                  <span className="text-sm text-slate-600">
                    Pago
                  </span>

                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                    {textoEstado(pedido.estadoPago)}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2.5">
                  <span className="text-sm text-slate-600">
                    Envío
                  </span>

                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                    {textoEstado(pedido.estadoEnvio)}
                  </span>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="flex items-center gap-2 text-base font-bold text-slate-950">
                <User size={18} />
                Cliente
              </h2>

              <div className="mt-3 space-y-2">
                <p className="font-bold text-slate-950">
                  {pedido.nombreCliente}
                </p>

                {pedido.emailCliente && (
                  <p className="text-sm text-slate-500">
                    {pedido.emailCliente}
                  </p>
                )}

                <div className="flex items-center gap-2 text-sm text-slate-700">
                  <Phone
                    size={16}
                    className="text-slate-400"
                  />

                  <span>{pedido.telefonoCliente}</span>
                </div>

                <a
                  href={
                    "https://wa.me/51" +
                    pedido.telefonoCliente.replace(/\D/g, "")
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex text-sm font-bold text-emerald-600 hover:text-emerald-700"
                >
                  Abrir WhatsApp
                </a>
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="flex items-center gap-2 text-base font-bold text-slate-950">
                <MapPin size={18} />
                Dirección de entrega
              </h2>

              <div className="mt-3 space-y-1 text-sm leading-6 text-slate-700">
                <p>{pedido.direccion}</p>

                <p>
                  {pedido.ciudad}
                  {pedido.region ? ", " + pedido.region : ""}
                </p>
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-base font-bold text-slate-950">
                Pago
              </h2>

              <div className="mt-3 space-y-2 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-500">
                    Tipo de pedido
                  </span>

                  <span className="text-right font-bold text-slate-900">
                    {textoTipoPedido(pedido.tipoPedido)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-500">
                    Método
                  </span>

                  <span className="text-right font-bold text-slate-900">
                    {textoMetodoPago(pedido.metodoPago)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-500">
                    Estado
                  </span>

                  <span className="font-bold text-slate-900">
                    {textoEstado(pedido.estadoPago)}
                  </span>
                </div>

                <div className="mt-3 space-y-2 border-t border-slate-200 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">
                      Total
                    </span>

                    <span className="font-black text-slate-950">
                      {formatoMoneda(Number(pedido.total))}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">
                      Adelanto
                    </span>

                    <span className="font-bold text-slate-900">
                      {formatoMoneda(Number(pedido.montoAdelanto))}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">
                      Saldo pendiente
                    </span>

                    <span className="font-black text-slate-950">
                      {formatoMoneda(Number(pedido.montoPendiente))}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {(pedido.observaciones || pedido.notasInternas) && (
              <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <h2 className="text-base font-bold text-slate-950">
                  Notas
                </h2>

                {pedido.observaciones && (
                  <div className="mt-3">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Cliente
                    </p>

                    <p className="mt-1.5 text-sm leading-6 text-slate-700">
                      {pedido.observaciones}
                    </p>
                  </div>
                )}

                {pedido.notasInternas && (
                  <div className="mt-3 border-t border-slate-100 pt-3">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Internas
                    </p>

                    <p className="mt-1.5 text-sm leading-6 text-slate-700">
                      {pedido.notasInternas}
                    </p>
                  </div>
                )}
              </section>
            )}

            <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-sm font-bold text-slate-700">
                Origen del pedido
              </h2>

              <div className="mt-3 space-y-2 text-xs">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-500">
                    Fuente
                  </span>

                  <span className="text-right font-semibold text-slate-700">
                    {pedido.utmSource || "Directo / Sin atribución"}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-500">
                    Medio
                  </span>

                  <span className="text-right font-semibold text-slate-700">
                    {pedido.utmMedium || "-"}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-4">
                  <span className="text-slate-500">
                    Campaña
                  </span>

                  <span className="max-w-[65%] break-all text-right font-semibold text-slate-700">
                    {pedido.utmCampaign || "-"}
                  </span>
                </div>

                {pedido.utmContent && (
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-slate-500">
                      Contenido
                    </span>

                    <span className="max-w-[65%] break-all text-right text-slate-600">
                      {pedido.utmContent}
                    </span>
                  </div>
                )}

                {pedido.utmTerm && (
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-slate-500">
                      Término
                    </span>

                    <span className="max-w-[65%] break-all text-right text-slate-600">
                      {pedido.utmTerm}
                    </span>
                  </div>
                )}

                {pedido.landingPath && (
                  <div className="border-t border-slate-100 pt-2">
                    <p className="text-slate-400">
                      Página de entrada
                    </p>

                    <p className="mt-1 break-all text-slate-500">
                      {pedido.landingPath}
                    </p>
                  </div>
                )}
              </div>
            </section>

          </aside>
        </div>
      </div>
    </main>
  );
}