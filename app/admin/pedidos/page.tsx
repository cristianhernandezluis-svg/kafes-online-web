import ActivarNotificaciones from "./ActivarNotificaciones";
import MonitorPedidos from "./MonitorPedidos";
import Link from "next/link";
import prisma from "@/lib/prisma";
import {
  ChevronRight,
  PackageSearch,
  Search,
} from "lucide-react";

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
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(fecha);
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

export default async function PedidosPage({
  searchParams,
}: PedidosPageProps) {
  const params = await searchParams;

  const buscar = params.buscar?.trim() ?? "";
  const estado = params.estado ?? "TODOS";

  const pedidos = await prisma.pedido.findMany({
    where: {
      AND: [
        estado !== "TODOS"
          ? {
              estado: estado as
                | "NUEVO"
                | "CONFIRMADO"
                | "PREPARANDO"
                | "ENVIADO"
                | "ENTREGADO"
                | "CANCELADO",
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
  });

  return (
  <main className="min-h-screen bg-slate-100 p-6">
    <MonitorPedidos
      ultimoPedidoInicial={pedidos[0]?.id ?? null}
    />

    <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-950">
              Pedidos
            </h1>

            <p className="mt-1 text-sm text-slate-600">
              Administra los pedidos recibidos desde tu tienda.
            </p>
          </div>

          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
  <ActivarNotificaciones />

  <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm">
    {pedidos.length} pedidos encontrados
  </div>
</div>
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
                  placeholder="Buscar por pedido, cliente o teléfono"
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
                      : item.replaceAll("_", " ")}
                  </option>
                ))}
              </select>

              <button
                type="submit"
                className="h-11 rounded-xl bg-slate-950 px-6 text-sm font-bold text-white transition hover:bg-slate-800"
              >
                Filtrar
              </button>
            </form>
          </div>

          {pedidos.length === 0 ? (
            <div className="flex min-h-[420px] flex-col items-center justify-center px-6 text-center">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                <PackageSearch
                  size={30}
                  className="text-slate-500"
                />
              </div>

              <h2 className="text-xl font-black text-slate-950">
                Todavía no hay pedidos
              </h2>

              <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
                Cuando conectemos el checkout, cada compra aparecerá
                automáticamente en esta sección.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-slate-50">
                  <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                    <th className="px-5 py-4">Pedido</th>
                    <th className="px-5 py-4">Fecha</th>
                    <th className="px-5 py-4">Cliente</th>
                    <th className="px-5 py-4">Productos</th>
                    <th className="px-5 py-4">Total</th>
                    <th className="px-5 py-4">Pago</th>
                    <th className="px-5 py-4">Estado</th>
                    <th className="px-5 py-4" />
                  </tr>
                </thead>

                <tbody>
                  {pedidos.map((pedido) => (
                    <tr
                      key={pedido.id}
                      className="border-b border-slate-100 transition hover:bg-slate-50"
                    >
                      <td className="px-5 py-4">
                        <Link
                          href={`/admin/pedidos/${pedido.id}`}
                          className="font-black text-slate-950 hover:underline"
                        >
                          #{pedido.codigo}
                        </Link>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                        {formatoFecha(pedido.createdAt)}
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-bold text-slate-900">
                          {pedido.nombreCliente}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {pedido.telefonoCliente}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {pedido.items.reduce(
                          (total, item) =>
                            total + item.cantidad,
                          0,
                        )}{" "}
                        unidades
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 font-black text-slate-950">
                        {formatoMoneda(Number(pedido.total))}
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                          {pedido.estadoPago.replaceAll("_", " ")}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${claseEstado(
                            pedido.estado,
                          )}`}
                        >
                          {pedido.estado.replaceAll("_", " ")}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <Link
                          href={`/admin/pedidos/${pedido.id}`}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-200 hover:text-slate-950"
                          title="Ver pedido"
                        >
                          <ChevronRight size={18} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}