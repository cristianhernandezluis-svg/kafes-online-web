import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import {
  ArrowLeft,
  CalendarDays,
  ChevronRight,
  Mail,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  ShoppingBag,
  UserRound,
  WalletCards,
} from "lucide-react";

export const dynamic = "force-dynamic";

type ClienteDetallePageProps = {
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
    timeZone: "America/Lima",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(fecha);
}

function textoEstado(estado: string) {
  return estado.replaceAll("_", " ");
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

function clasePago(estado: string) {
  const estilos: Record<string, string> = {
    PENDIENTE: "bg-amber-100 text-amber-700",
    PAGADO: "bg-emerald-100 text-emerald-700",
    PARCIAL: "bg-blue-100 text-blue-700",
    REEMBOLSADO: "bg-red-100 text-red-700",
  };

  return estilos[estado] ?? "bg-slate-100 text-slate-700";
}

function obtenerWhatsApp(celular: string) {
  let numero = celular.replace(/\D/g, "");

  if (
    numero.length === 9 &&
    numero.startsWith("9")
  ) {
    numero = `51${numero}`;
  }

  return numero;
}

export default async function ClienteDetallePage({
  params,
}: ClienteDetallePageProps) {
  const { id } = await params;
  const clienteId = Number(id);

  if (
    !Number.isInteger(clienteId) ||
    clienteId <= 0
  ) {
    notFound();
  }

  const cliente =
    await prisma.cliente.findUnique({
      where: {
        id: clienteId,
      },
      include: {
        pedidos: {
          orderBy: {
            createdAt: "desc",
          },
          include: {
            items: {
              orderBy: {
                id: "asc",
              },
            },
          },
        },
      },
    });

  if (!cliente) {
    notFound();
  }

  const pedidosValidos =
    cliente.pedidos.filter(
      (pedido) =>
        pedido.estado !== "CANCELADO",
    );

  const totalComprado =
    pedidosValidos.reduce(
      (total, pedido) =>
        total + Number(pedido.total),
      0,
    );

  const ticketPromedio =
    pedidosValidos.length > 0
      ? totalComprado /
        pedidosValidos.length
      : 0;

  const ultimoPedido =
    cliente.pedidos[0] ?? null;

  const telefonoWhatsApp =
    obtenerWhatsApp(cliente.telefono);

  const mensajeWhatsApp =
    encodeURIComponent(
      `Hola ${cliente.nombre}, te escribimos de KAFES ONLINE.`,
    );

  const enlaceWhatsApp =
    `https://wa.me/${telefonoWhatsApp}?text=${mensajeWhatsApp}`;

  return (
    <main className="min-h-screen bg-slate-100 p-3 sm:p-5 lg:p-6">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-5">
          <Link
            href="/admin/clientes"
            className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-950"
          >
            <ArrowLeft size={17} />
            Volver a clientes
          </Link>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                  {cliente.nombre}
                </h1>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-black ${
                    cliente.activo
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {cliente.activo
                    ? "ACTIVO"
                    : "INACTIVO"}
                </span>
              </div>

              <p className="mt-1 text-sm text-slate-500">
                Cliente desde{" "}
                {formatoFecha(
                  cliente.createdAt,
                )}
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

        <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <ShoppingBag size={19} />
              </div>

              <div>
                <p className="text-xs font-bold text-slate-500">
                  Pedidos
                </p>

                <p className="text-xl font-black text-slate-950">
                  {pedidosValidos.length}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <WalletCards size={19} />
              </div>

              <div>
                <p className="text-xs font-bold text-slate-500">
                  Total comprado
                </p>

                <p className="text-xl font-black text-slate-950">
                  {formatoMoneda(
                    totalComprado,
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                <WalletCards size={19} />
              </div>

              <div>
                <p className="text-xs font-bold text-slate-500">
                  Ticket promedio
                </p>

                <p className="text-xl font-black text-slate-950">
                  {formatoMoneda(
                    ticketPromedio,
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                <CalendarDays size={19} />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-500">
                  Último pedido
                </p>

                <p className="truncate text-lg font-black text-slate-950">
                  {ultimoPedido
                    ? `#${ultimoPedido.codigo}`
                    : "Sin pedidos"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-4">
            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-5 py-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="flex items-center gap-2 text-base font-bold text-slate-950">
                      <ShoppingBag
                        size={20}
                      />
                      Historial de pedidos
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Todos los pedidos realizados por este cliente.
                    </p>
                  </div>

                  {cliente.pedidos.length >
                    0 && (
                    <Link
                      href={`/admin/pedidos?buscar=${encodeURIComponent(
                        cliente.telefono,
                      )}`}
                      className="text-sm font-bold text-blue-600 transition hover:text-blue-700"
                    >
                      Ver todos
                    </Link>
                  )}
                </div>
              </div>

              {cliente.pedidos.length ===
              0 ? (
                <div className="p-10 text-center">
                  <Package
                    size={34}
                    className="mx-auto text-slate-300"
                  />

                  <p className="mt-3 font-bold text-slate-700">
                    Este cliente todavía no tiene pedidos.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {cliente.pedidos.map(
                    (pedido) => (
                      <Link
                        key={pedido.id}
                        href={`/admin/pedidos/${pedido.id}`}
                        className="block p-4 transition hover:bg-slate-50 sm:p-5"
                      >
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-black text-slate-950">
                                Pedido #
                                {
                                  pedido.codigo
                                }
                              </p>

                              <span
                                className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase ${claseEstado(
                                  pedido.estado,
                                )}`}
                              >
                                {textoEstado(
                                  pedido.estado,
                                )}
                              </span>

                              <span
                                className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase ${clasePago(
                                  pedido.estadoPago,
                                )}`}
                              >
                                {textoEstado(
                                  pedido.estadoPago,
                                )}
                              </span>
                            </div>

                            <p className="mt-2 text-xs text-slate-500">
                              {formatoFecha(
                                pedido.createdAt,
                              )}
                            </p>

                            <div className="mt-3 space-y-1">
                              {pedido.items
                                .slice(0, 2)
                                .map(
                                  (item) => (
                                    <p
                                      key={
                                        item.id
                                      }
                                      className="truncate text-sm font-semibold text-slate-700"
                                    >
                                      {
                                        item.cantidad
                                      }{" "}
                                      ×{" "}
                                      {
                                        item.nombreProducto
                                      }
                                    </p>
                                  ),
                                )}

                              {pedido.items
                                .length >
                                2 && (
                                <p className="text-xs font-semibold text-slate-500">
                                  +
                                  {pedido
                                    .items
                                    .length -
                                    2}{" "}
                                  productos más
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-between gap-5 sm:justify-end">
                            <div className="text-right">
                              <p className="text-xs font-bold text-slate-500">
                                Total
                              </p>

                              <p className="mt-1 text-lg font-black text-slate-950">
                                {formatoMoneda(
                                  Number(
                                    pedido.total,
                                  ),
                                )}
                              </p>
                            </div>

                            <ChevronRight
                              size={20}
                              className="shrink-0 text-slate-400"
                            />
                          </div>
                        </div>
                      </Link>
                    ),
                  )}
                </div>
              )}
            </section>
          </div>

          <aside className="space-y-4">
            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="flex items-center gap-2 text-base font-bold text-slate-950">
                <UserRound size={20} />
                Datos del cliente
              </h2>

              <div className="mt-5 space-y-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Nombre
                  </p>

                  <p className="mt-1 font-bold text-slate-950">
                    {cliente.nombre}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Celular
                  </p>

                  <div className="mt-1 flex items-center gap-2 text-sm font-bold text-slate-800">
                    <Phone size={15} />
                    {cliente.telefono}
                  </div>
                </div>

                {cliente.email && (
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Email
                    </p>

                    <div className="mt-1 flex items-center gap-2 break-all text-sm font-semibold text-slate-700">
                      <Mail size={15} />
                      {cliente.email}
                    </div>
                  </div>
                )}

                {cliente.dni && (
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      DNI
                    </p>

                    <p className="mt-1 font-semibold text-slate-700">
                      {cliente.dni}
                    </p>
                  </div>
                )}
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="flex items-center gap-2 text-base font-bold text-slate-950">
                <MapPin size={20} />
                Ubicación
              </h2>

              <div className="mt-5 space-y-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Región
                  </p>

                  <p className="mt-1 font-semibold text-slate-700">
                    {cliente.region ||
                      "No registrada"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Ciudad / distrito
                  </p>

                  <p className="mt-1 font-semibold text-slate-700">
                    {cliente.ciudad ||
                      "No registrada"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Dirección
                  </p>

                  <p className="mt-1 text-sm font-semibold leading-6 text-slate-700">
                    {cliente.direccion ||
                      "No registrada"}
                  </p>
                </div>

                {cliente.referencia && (
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Referencia
                    </p>

                    <p className="mt-1 text-sm font-semibold leading-6 text-slate-700">
                      {
                        cliente.referencia
                      }
                    </p>
                  </div>
                )}
              </div>
            </section>

            {cliente.notas && (
              <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-base font-bold text-slate-950">
                  Notas
                </h2>

                <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                  {cliente.notas}
                </p>
              </section>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}