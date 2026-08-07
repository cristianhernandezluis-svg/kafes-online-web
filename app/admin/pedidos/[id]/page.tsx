import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { cambiarEstadoPedido } from "./actions";
import {
  ArrowLeft,
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

  const telefonoWhatsApp = pedido.telefonoCliente.replace(/\D/g, "");

  const mensajeWhatsApp = encodeURIComponent(
    `Hola ${pedido.nombreCliente}, te escribimos de Kafes Online por tu pedido #${pedido.codigo}.`,
  );

  const enlaceWhatsApp = `https://wa.me/${telefonoWhatsApp}?text=${mensajeWhatsApp}`;

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <Link
            href="/admin/pedidos"
            className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-slate-600 transition hover:text-slate-950"
          >
            <ArrowLeft size={17} />
            Volver a pedidos
          </Link>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-black text-slate-950">
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

              <p className="mt-2 text-sm text-slate-600">
                Creado el {formatoFecha(pedido.createdAt)}
              </p>
            </div>

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

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-5 py-4">
                <h2 className="flex items-center gap-2 text-lg font-black text-slate-950">
                  <Package size={20} />
                  Productos
                </h2>
              </div>

              <div className="divide-y divide-slate-100">
                {pedido.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 px-5 py-5"
                  >
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                      {item.imagenUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.imagenUrl}
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
                      <p className="font-bold text-slate-950">
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

              <div className="border-t border-slate-200 bg-slate-50 px-5 py-5">
                <div className="ml-auto max-w-sm space-y-3">
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

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-black text-slate-950">
                Historial
              </h2>

              {pedido.historial.length === 0 ? (
                <p className="mt-4 text-sm text-slate-500">
                  Todavía no hay movimientos registrados.
                </p>
              ) : (
                <div className="mt-5 space-y-5">
                  {pedido.historial.map((registro) => (
                    <div
                      key={registro.id}
                      className="relative border-l-2 border-slate-200 pl-5"
                    >
                      <div className="absolute -left-[7px] top-1 h-3 w-3 rounded-full bg-slate-950" />

                      <p className="font-bold text-slate-900">
                        {registro.accion}
                      </p>

                      {registro.descripcion && (
                        <p className="mt-1 text-sm text-slate-600">
                          {registro.descripcion}
                        </p>
                      )}

                      <p className="mt-2 text-xs text-slate-400">
                        {formatoFecha(registro.createdAt)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-black text-slate-950">

<section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
  <h2 className="text-lg font-black text-slate-950">
    Acciones rápidas
  </h2>

  <p className="mt-1 text-sm text-slate-500">
    Actualiza el estado operativo del pedido.
  </p>

  <div className="mt-4 grid grid-cols-2 gap-2">
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
        className="w-full rounded-xl bg-emerald-600 px-3 py-3 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
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
        className="w-full rounded-xl bg-amber-500 px-3 py-3 text-sm font-bold text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-40"
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
        className="w-full rounded-xl bg-violet-600 px-3 py-3 text-sm font-bold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-40"
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
        className="w-full rounded-xl bg-green-700 px-3 py-3 text-sm font-bold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-40"
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
        className="w-full rounded-xl border border-red-200 bg-red-50 px-3 py-3 text-sm font-bold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Cancelar pedido
      </button>
    </form>
  </div>
</section>

                Estado del pedido
              </h2>

              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">
                    Pedido
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${claseEstado(
                      pedido.estado,
                    )}`}
                  >
                    {textoEstado(pedido.estado)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">
                    Pago
                  </span>

                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                    {textoEstado(pedido.estadoPago)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">
                    Envío
                  </span>

                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                    {textoEstado(pedido.estadoEnvio)}
                  </span>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="flex items-center gap-2 text-lg font-black text-slate-950">
                <User size={19} />
                Cliente

<section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
  <h2 className="text-lg font-black text-slate-950">
    Pago y checkout
  </h2>

  <div className="mt-4 space-y-3">
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-slate-600">
        Tipo de pedido
      </span>

      <span className="text-right text-sm font-bold text-slate-900">
        {textoTipoPedido(pedido.tipoPedido)}
      </span>
    </div>

    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-slate-600">
        Método de pago
      </span>

      <span className="text-right text-sm font-bold text-slate-900">
        {textoMetodoPago(pedido.metodoPago)}
      </span>
    </div>

    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-slate-600">
        Estado del pago
      </span>

      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
        {textoEstado(pedido.estadoPago)}
      </span>
    </div>

    <div className="border-t border-slate-200 pt-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-600">
          Total
        </span>

        <span className="font-black text-slate-950">
          {formatoMoneda(Number(pedido.total))}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between text-sm">
        <span className="text-slate-600">
          Adelanto
        </span>

        <span className="font-bold text-slate-900">
          {formatoMoneda(Number(pedido.montoAdelanto))}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between text-sm">
        <span className="text-slate-600">
          Saldo pendiente
        </span>

        <span className="font-black text-slate-950">
          {formatoMoneda(Number(pedido.montoPendiente))}
        </span>
      </div>
    </div>
  </div>
</section>

              </h2>

              <div className="mt-4 space-y-4">
                <div>
                  <p className="font-bold text-slate-950">
                    {pedido.nombreCliente}
                  </p>

                  {pedido.emailCliente && (
                    <p className="mt-1 text-sm text-slate-500">
                      {pedido.emailCliente}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 text-sm text-slate-700">
                  <Phone size={17} className="text-slate-400" />
                  {pedido.telefonoCliente}
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="flex items-center gap-2 text-lg font-black text-slate-950">
                <MapPin size={19} />
                Dirección de entrega
              </h2>

              <div className="mt-4 space-y-2 text-sm leading-6 text-slate-700">
                <p>{pedido.direccion}</p>
                <p>
                  {pedido.ciudad}
                  {pedido.region ? `, ${pedido.region}` : ""}
                </p>

                {pedido.referencia && (
                  <p className="text-slate-500">
                    Referencia: {pedido.referencia}
                  </p>
                )}
              </div>
            </section>

            {(pedido.observaciones ||
              pedido.notasInternas) && (
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-black text-slate-950">
                  Notas
                </h2>

                {pedido.observaciones && (
                  <div className="mt-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Cliente
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-700">
                      {pedido.observaciones}
                    </p>
                  </div>
                )}

                {pedido.notasInternas && (
                  <div className="mt-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Internas
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-700">
                      {pedido.notasInternas}
                    </p>
                  </div>
                )}
              </section>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}