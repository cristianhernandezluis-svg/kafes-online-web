import ActivarNotificaciones from "./ActivarNotificaciones";
import MonitorPedidos from "./MonitorPedidos";
import Link from "next/link";
import prisma from "@/lib/prisma";
import {
  ChevronRight,
  CircleCheck,
  Clock3,
  PackageCheck,
  PackageSearch,
  Search,
  ShoppingCart,
  Truck,
  XCircle,
} from "lucide-react";

type EstadoPedido =
  | "NUEVO"
  | "CONFIRMADO"
  | "PREPARANDO"
  | "ENVIADO"
  | "ENTREGADO"
  | "CANCELADO";

type PedidosPageProps = {
  searchParams: Promise<{
    buscar?: string;
    estado?: string;
  }>;
};

const estadosPedido = [
  "TODOS",
  "NUEVO",
  "CONFIRMADO",
  "PREPARANDO",
  "ENVIADO",
  "ENTREGADO",
  "CANCELADO",
] as const;

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

function formatoEstado(estado: string) {
  return estado
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/^\w/, (letra) => letra.toUpperCase());
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

function esEstadoValido(estado: string): estado is EstadoPedido {
  return [
    "NUEVO",
    "CONFIRMADO",
    "PREPARANDO",
    "ENVIADO",
    "ENTREGADO",
    "CANCELADO",
  ].includes(estado);
}

export const dynamic = "force-dynamic";

export default async function PedidosPage({
  searchParams,
}: PedidosPageProps) {
  const params = await searchParams;

  const buscar = params.buscar?.trim() ?? "";
  const estadoRecibido = params.estado ?? "TODOS";

  const estado =
    estadoRecibido === "TODOS" ||
    esEstadoValido(estadoRecibido)
      ? estadoRecibido
      : "TODOS";

  const [
    pedidos,
    nuevos,
    confirmados,
    preparando,
    enviados,
    entregados,
    cancelados,
  ] = await Promise.all([
    prisma.pedido.findMany({
      where: {
        AND: [
          estado !== "TODOS"
            ? {
                estado,
              }
            : {},
          buscar
            ? {
                OR: [
                  {
                    codigo: {
                      contains: buscar,
                      mode: "insensitive",
                    },
                  },
                  {
                    nombreCliente: {
                      contains: buscar,
                      mode: "insensitive",
                    },
                  },
                  {
                    telefonoCliente: {
                      contains: buscar,
                    },
                  },
                  {
                    ciudad: {
                      contains: buscar,
                      mode: "insensitive",
                    },
                  },
{
  utmSource: {
    contains: buscar,
    mode: "insensitive",
  },
},
{
  utmCampaign: {
    contains: buscar,
    mode: "insensitive",
  },
},
{
  utmContent: {
    contains: buscar,
    mode: "insensitive",
  },
},
                ],
              }
            : {},
        ],
      },
      include: {
        items: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 100,
    }),

    prisma.pedido.count({
      where: {
        estado: "NUEVO",
      },
    }),

    prisma.pedido.count({
      where: {
        estado: "CONFIRMADO",
      },
    }),

    prisma.pedido.count({
      where: {
        estado: "PREPARANDO",
      },
    }),

    prisma.pedido.count({
      where: {
        estado: "ENVIADO",
      },
    }),

    prisma.pedido.count({
      where: {
        estado: "ENTREGADO",
      },
    }),

    prisma.pedido.count({
      where: {
        estado: "CANCELADO",
      },
    }),
  ]);

  const tarjetasEstado = [
    {
      nombre: "Nuevos",
      estado: "NUEVO",
      cantidad: nuevos,
      icono: ShoppingCart,
      clase: "bg-blue-100 text-blue-700",
    },
    {
      nombre: "Confirmados",
      estado: "CONFIRMADO",
      cantidad: confirmados,
      icono: CircleCheck,
      clase: "bg-emerald-100 text-emerald-700",
    },
    {
      nombre: "Preparando",
      estado: "PREPARANDO",
      cantidad: preparando,
      icono: Clock3,
      clase: "bg-amber-100 text-amber-700",
    },
    {
      nombre: "Enviados",
      estado: "ENVIADO",
      cantidad: enviados,
      icono: Truck,
      clase: "bg-violet-100 text-violet-700",
    },
    {
      nombre: "Entregados",
      estado: "ENTREGADO",
      cantidad: entregados,
      icono: PackageCheck,
      clase: "bg-green-100 text-green-700",
    },
    {
      nombre: "Cancelados",
      estado: "CANCELADO",
      cantidad: cancelados,
      icono: XCircle,
      clase: "bg-red-100 text-red-700",
    },
  ];

  return (
    <section className="space-y-6">
      <MonitorPedidos
        ultimoPedidoInicial={pedidos[0]?.id ?? null}
      />

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-950 sm:text-3xl">
            Pedidos
          </h1>

          <p className="mt-1 text-sm text-slate-600">
            Administra los pedidos recibidos desde tu tienda.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <ActivarNotificaciones />

          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm">
            {pedidos.length} resultados
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {tarjetasEstado.map((tarjeta) => {
          const Icono = tarjeta.icono;
          const activo = estado === tarjeta.estado;

          return (
            <Link
              key={tarjeta.estado}
              href={`/admin/pedidos?estado=${tarjeta.estado}`}
              className={`rounded-2xl border p-4 shadow-sm transition ${
                activo
                  ? "border-slate-950 bg-slate-950 text-white"
                  : "border-slate-200 bg-white hover:border-slate-400"
              }`}
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                  activo
                    ? "bg-white/15 text-white"
                    : tarjeta.clase
                }`}
              >
                <Icono size={20} />
              </div>

              <p
                className={`mt-4 text-xs font-bold ${
                  activo
                    ? "text-slate-300"
                    : "text-slate-500"
                }`}
              >
                {tarjeta.nombre}
              </p>

              <p className="mt-1 text-2xl font-black">
                {tarjeta.cantidad}
              </p>
            </Link>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-4">
          <form className="flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="search"
                name="buscar"
                defaultValue={buscar}
                placeholder="Pedido, cliente, teléfono, ciudad, campaña o anuncio"
                className="h-11 w-full rounded-xl border border-slate-300 pl-10 pr-4 text-sm outline-none transition focus:border-slate-950"
              />
            </div>

            <select
              name="estado"
              defaultValue={estado}
              className="h-11 rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold outline-none focus:border-slate-950"
            >
              {estadosPedido.map((item) => (
                <option key={item} value={item}>
                  {item === "TODOS"
                    ? "Todos los estados"
                    : formatoEstado(item)}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="h-11 rounded-xl bg-slate-950 px-6 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              Buscar
            </button>

            {(buscar || estado !== "TODOS") && (
              <Link
                href="/admin/pedidos"
                className="flex h-11 items-center justify-center rounded-xl border border-slate-300 px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
              >
                Limpiar
              </Link>
            )}
          </form>
        </div>

        {pedidos.length === 0 ? (
          <div className="flex min-h-[360px] flex-col items-center justify-center px-6 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <PackageSearch
                size={30}
                className="text-slate-500"
              />
            </div>

            <h2 className="text-xl font-black text-slate-950">
              No encontramos pedidos
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
              Prueba cambiando el estado o escribiendo otro dato en el
              buscador.
            </p>
          </div>
        ) : (
          <>
            {/* Vista para celular */}
            <div className="divide-y divide-slate-100 md:hidden">
              {pedidos.map((pedido) => {
                const totalUnidades = pedido.items.reduce(
                  (total, item) => total + item.cantidad,
                  0,
                );

                return (
                  <Link
                    key={pedido.id}
                    href={`/admin/pedidos/${pedido.id}`}
                    className="block p-4 transition active:bg-slate-50"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-black text-slate-950">
                            #{pedido.codigo}
                          </p>

                          <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase ${claseEstado(
                              pedido.estado,
                            )}`}
                          >
                            {formatoEstado(pedido.estado)}
                          </span>
                        </div>

                        <p className="mt-3 truncate text-sm font-bold text-slate-800">
                          {pedido.nombreCliente}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {pedido.telefonoCliente}
                        </p>
                      </div>

                      <ChevronRight
                        size={20}
                        className="shrink-0 text-slate-400"
                      />
                    </div>

                    <div className="mt-4 rounded-xl bg-slate-50 p-3">
                      <p className="truncate text-sm font-semibold text-slate-700">
                        {pedido.items[0]?.nombreProducto ??
                          "Producto no disponible"}
                      </p>

                      {pedido.items.length > 1 && (
                        <p className="mt-1 text-xs text-slate-500">
                          +{pedido.items.length - 1} productos más
                        </p>
                      )}
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs font-semibold text-slate-500">
                          Total
                        </p>

                        <p className="mt-1 font-black text-slate-950">
                          {formatoMoneda(Number(pedido.total))}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-slate-500">
                          Unidades
                        </p>

                        <p className="mt-1 font-bold text-slate-700">
                          {totalUnidades}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-slate-500">
                          Ciudad
                        </p>

                        <p className="mt-1 truncate font-bold text-slate-700">
                          {pedido.ciudad}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-slate-500">
                          Pago
                        </p>

                        <p className="mt-1 font-bold text-slate-700">
                          {formatoEstado(pedido.estadoPago)}
                        </p>
                      </div>
                    </div>

                    <p className="mt-4 text-xs text-slate-400">
                      {formatoFecha(pedido.createdAt)}
                    </p>
                  </Link>
                );
              })}
            </div>

            {/* Vista para computadora */}
            <div className="hidden overflow-x-auto md:block">
              <table className="min-w-full">
                <thead className="bg-slate-50">
                  <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                    <th className="px-5 py-4">Pedido</th>
                    <th className="px-5 py-4">Fecha</th>
                    <th className="px-5 py-4">Cliente</th>
<th className="px-5 py-4">Origen</th>
<th className="px-5 py-4">Ciudad</th>
                    <th className="px-5 py-4">Productos</th>
                    <th className="px-5 py-4">Total</th>
                    <th className="px-5 py-4">Pago</th>
                    <th className="px-5 py-4">Estado</th>
                    <th className="px-5 py-4" />
                  </tr>
                </thead>

                <tbody>
                  {pedidos.map((pedido) => {
  const hrefPedido = `/admin/pedidos/${pedido.id}`;

  return (
    <tr
      key={pedido.id}
      className="cursor-pointer border-b border-slate-100 transition hover:bg-slate-50"
    >
      <td className="p-0">
        <Link
          href={hrefPedido}
          className="block px-5 py-4 font-black text-slate-950"
        >
          #{pedido.codigo}
        </Link>
      </td>

      <td className="p-0">
        <Link
          href={hrefPedido}
          className="block whitespace-nowrap px-5 py-4 text-sm text-slate-600"
        >
          {formatoFecha(pedido.createdAt)}
        </Link>
      </td>

      <td className="p-0">
        <Link
          href={hrefPedido}
          className="block px-5 py-4"
        >
          <p className="font-bold text-slate-900">
            {pedido.nombreCliente}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {pedido.telefonoCliente}
          </p>
        </Link>
      </td>

      <td className="p-0">
        <Link
          href={hrefPedido}
          className="block px-5 py-4"
        >
          <p className="text-sm font-bold text-slate-900">
            {pedido.utmSource
              ? pedido.utmSource
                  .replaceAll("_", " ")
                  .replace(/^\w/, (letra) =>
                    letra.toUpperCase(),
                  )
              : "Directo"}
          </p>

          {pedido.utmCampaign && (
            <p className="mt-1 max-w-[180px] truncate text-xs text-slate-500">
              {pedido.utmCampaign}
            </p>
          )}

          {pedido.utmContent && (
            <p className="mt-1 max-w-[180px] truncate text-xs font-semibold text-slate-600">
              {pedido.utmContent}
            </p>
          )}
        </Link>
      </td>

      <td className="p-0">
        <Link
          href={hrefPedido}
          className="block px-5 py-4 text-sm font-semibold text-slate-600"
        >
          {pedido.ciudad}
        </Link>
      </td>

      <td className="p-0">
        <Link
          href={hrefPedido}
          className="block px-5 py-4 text-sm text-slate-600"
        >
          {pedido.items.reduce(
            (total, item) => total + item.cantidad,
            0,
          )}{" "}
          unidades
        </Link>
      </td>

      <td className="p-0">
        <Link
          href={hrefPedido}
          className="block whitespace-nowrap px-5 py-4 font-black text-slate-950"
        >
          {formatoMoneda(Number(pedido.total))}
        </Link>
      </td>

      <td className="p-0">
        <Link
          href={hrefPedido}
          className="block px-5 py-4"
        >
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
            {formatoEstado(pedido.estadoPago)}
          </span>
        </Link>
      </td>

      <td className="p-0">
        <Link
          href={hrefPedido}
          className="block px-5 py-4"
        >
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${claseEstado(
              pedido.estado,
            )}`}
          >
            {formatoEstado(pedido.estado)}
          </span>
        </Link>
      </td>

      <td className="p-0">
        <Link
          href={hrefPedido}
          className="flex min-h-[68px] items-center justify-end px-5 py-4 text-slate-500 transition hover:text-slate-950"
          title="Ver pedido"
        >
          <ChevronRight size={18} />
        </Link>
      </td>
    </tr>
  );
})}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </section>
  );
}