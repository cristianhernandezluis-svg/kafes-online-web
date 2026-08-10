import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Banknote,
  Boxes,
  CheckCircle2,
  Clock3,
  Package,
  Plus,
  ShoppingCart,
  Truck,
  Users,
} from "lucide-react";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

function obtenerRangoHoyPeru() {
  const ahora = new Date();

  const partes = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Lima",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(ahora);

  const year = Number(
    partes.find((parte) => parte.type === "year")?.value,
  );

  const month = Number(
    partes.find((parte) => parte.type === "month")?.value,
  );

  const day = Number(
    partes.find((parte) => parte.type === "day")?.value,
  );

  // PerÃº utiliza UTC-5.
  const inicio = new Date(
    Date.UTC(year, month - 1, day, 5, 0, 0, 0),
  );

  const fin = new Date(
    Date.UTC(year, month - 1, day + 1, 5, 0, 0, 0),
  );

  return { inicio, fin };
}

function formatearDinero(valor: number) {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 2,
  }).format(valor);
}

function formatearFecha(fecha: Date) {
  return new Intl.DateTimeFormat("es-PE", {
    timeZone: "America/Lima",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(fecha);
}

function obtenerEstiloEstado(estado: string) {
  switch (estado) {
    case "NUEVO":
      return "bg-blue-100 text-blue-700";

    case "CONFIRMADO":
      return "bg-violet-100 text-violet-700";

    case "PREPARANDO":
      return "bg-amber-100 text-amber-700";

    case "ENVIADO":
      return "bg-cyan-100 text-cyan-700";

    case "ENTREGADO":
      return "bg-emerald-100 text-emerald-700";

    case "CANCELADO":
      return "bg-red-100 text-red-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
}

function formatearEstado(estado: string) {
  return estado
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/^\w/, (letra) => letra.toUpperCase());
}

export default async function AdminPage() {
  const { inicio, fin } = obtenerRangoHoyPeru();

  const [
    totalProductos,
    productosPublicados,
    productosStockBajo,
    totalClientes,
    pedidosHoy,
    pedidosNuevos,
    pedidosPreparando,
    pedidosEnviados,
    pedidosEntregadosHoy,
    ventasHoy,
    ultimosPedidos,
    productosMasVendidos,
  ] = await Promise.all([
    prisma.producto.count(),

    prisma.producto.count({
      where: {
        estado: "PUBLICADO",
      },
    }),

    prisma.producto.count({
      where: {
        stock: {
          lte: 5,
        },
        estado: {
          notIn: ["ARCHIVADO", "OCULTO"],
        },
      },
    }),

    prisma.cliente.count(),

    prisma.pedido.count({
      where: {
        createdAt: {
          gte: inicio,
          lt: fin,
        },
      },
    }),

    prisma.pedido.count({
      where: {
        estado: "NUEVO",
      },
    }),

    prisma.pedido.count({
      where: {
        estado: {
          in: ["CONFIRMADO", "PREPARANDO"],
        },
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
        entregadoAt: {
          gte: inicio,
          lt: fin,
        },
      },
    }),

    prisma.pedido.aggregate({
      where: {
        estado: {
          not: "CANCELADO",
        },
        createdAt: {
          gte: inicio,
          lt: fin,
        },
      },
      _sum: {
        total: true,
      },
    }),

    prisma.pedido.findMany({
      take: 8,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        codigo: true,
        nombreCliente: true,
        telefonoCliente: true,
        ciudad: true,
        estado: true,
        estadoPago: true,
        total: true,
        createdAt: true,
        items: {
          take: 1,
          select: {
            nombreProducto: true,
            cantidad: true,
          },
        },
      },
    }),

    prisma.pedidoItem.groupBy({
      by: ["nombreProducto"],
      where: {
        pedido: {
          estado: {
            not: "CANCELADO",
          },
        },
      },
      _sum: {
        cantidad: true,
        subtotal: true,
      },
      orderBy: {
        _sum: {
          cantidad: "desc",
        },
      },
      take: 5,
    }),
  ]);

  const ingresoHoy = Number(ventasHoy._sum.total ?? 0);

  const tarjetas = [
    {
      titulo: "Ventas de hoy",
      valor: formatearDinero(ingresoHoy),
      descripcion: `${pedidosHoy} pedidos recibidos`,
      icono: Banknote,
      href: "/admin/ventas",
    },
    {
      titulo: "Pedidos nuevos",
      valor: pedidosNuevos.toString(),
      descripcion: "Pendientes de confirmar",
      icono: ShoppingCart,
      href: "/admin/pedidos",
    },
    {
      titulo: "En preparaciÃ³n",
      valor: pedidosPreparando.toString(),
      descripcion: "Confirmados o preparando",
      icono: Clock3,
      href: "/admin/pedidos",
    },
    {
      titulo: "Pedidos enviados",
      valor: pedidosEnviados.toString(),
      descripcion: `${pedidosEntregadosHoy} entregados hoy`,
      icono: Truck,
      href: "/admin/pedidos",
    },
  ];

  return (
    <section className="space-y-7">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="mb-1 text-sm font-semibold text-slate-500">
            Kafes Online 2.0
          </p>

          <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
            Dashboard
          </h1>

          <p className="mt-2 text-sm text-slate-600 sm:text-base">
            Revisa tus pedidos, ventas, productos y clientes.
          </p>
        </div>

        <Link
          href="/admin/productos/nuevo"
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
        >
          <Plus size={19} />
          Nuevo producto
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {tarjetas.map((tarjeta) => {
          const Icono = tarjeta.icono;

          return (
            <Link
              key={tarjeta.titulo}
              href={tarjeta.href}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="mb-5 flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-800">
                  <Icono size={22} />
                </div>

                <ArrowRight
                  size={18}
                  className="text-slate-400"
                />
              </div>

              <p className="text-sm font-semibold text-slate-500">
                {tarjeta.titulo}
              </p>

              <p className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">
                {tarjeta.valor}
              </p>

              <p className="mt-2 text-xs font-medium text-slate-500">
                {tarjeta.descripcion}
              </p>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Link
          href="/admin/productos"
          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">
              <Package size={20} />
            </div>

            <div className="min-w-0">
              <p className="text-xl font-black">
                {totalProductos}
              </p>

              <p className="truncate text-xs font-semibold text-slate-500">
                Productos
              </p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/productos"
          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <CheckCircle2 size={20} />
            </div>

            <div className="min-w-0">
              <p className="text-xl font-black">
                {productosPublicados}
              </p>

              <p className="truncate text-xs font-semibold text-slate-500">
                Publicados
              </p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/productos"
          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <AlertTriangle size={20} />
            </div>

            <div className="min-w-0">
              <p className="text-xl font-black">
                {productosStockBajo}
              </p>

              <p className="truncate text-xs font-semibold text-slate-500">
                Stock bajo
              </p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/clientes"
          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
              <Users size={20} />
            </div>

            <div className="min-w-0">
              <p className="text-xl font-black">
                {totalClientes}
              </p>

              <p className="truncate text-xs font-semibold text-slate-500">
                Clientes
              </p>
            </div>
          </div>
        </Link>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 p-5">
            <div>
              <h2 className="font-black">
                Ãšltimos pedidos
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Pedidos recibidos recientemente
              </p>
            </div>

            <Link
              href="/admin/pedidos"
              className="text-sm font-bold text-slate-900"
            >
              Ver todos
            </Link>
          </div>

          {ultimosPedidos.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
              <ShoppingCart
                size={38}
                className="text-slate-300"
              />

              <p className="mt-4 font-bold">
                TodavÃ­a no hay pedidos
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Los pedidos nuevos aparecerÃ¡n aquÃ­.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {ultimosPedidos.map((pedido) => (
                <Link
                  key={pedido.id}
                  href={`/admin/pedidos/${pedido.id}`}
                  className="block p-4 transition hover:bg-slate-50 sm:p-5"
                >
                  <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-black text-slate-950">
                          #{pedido.codigo}
                        </p>

                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase ${obtenerEstiloEstado(
                            pedido.estado,
                          )}`}
                        >
                          {formatearEstado(pedido.estado)}
                        </span>
                      </div>

                      <p className="mt-2 truncate text-sm font-bold text-slate-700">
                        {pedido.nombreCliente}
                      </p>

                      <p className="mt-1 truncate text-xs text-slate-500">
                        {pedido.items[0]?.nombreProducto ??
                          "Pedido sin producto"}
                        {pedido.items[0]?.cantidad
                          ? ` Ã— ${pedido.items[0].cantidad}`
                          : ""}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {pedido.ciudad} Â·{" "}
                        {formatearFecha(pedido.createdAt)}
                      </p>
                    </div>

                    <div className="shrink-0 text-left sm:text-right">
                      <p className="font-black">
                        {formatearDinero(
                          Number(pedido.total),
                        )}
                      </p>

                      <p className="mt-1 text-[11px] font-semibold text-slate-500">
                        {formatearEstado(
                          pedido.estadoPago,
                        )}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-5">
            <h2 className="font-black">
              Productos mÃ¡s vendidos
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              SegÃºn las unidades pedidas
            </p>
          </div>

          {productosMasVendidos.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
              <Boxes
                size={38}
                className="text-slate-300"
              />

              <p className="mt-4 font-bold">
                Sin informaciÃ³n de ventas
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Los productos vendidos aparecerÃ¡n aquÃ­.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {productosMasVendidos.map(
                (producto, index) => (
                  <div
                    key={producto.nombreProducto}
                    className="flex items-center gap-4 p-5"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-sm font-black text-white">
                      {index + 1}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold">
                        {producto.nombreProducto}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {producto._sum.cantidad ?? 0} unidades
                      </p>
                    </div>

                    <p className="shrink-0 text-sm font-black">
                      {formatearDinero(
                        Number(
                          producto._sum.subtotal ?? 0,
                        ),
                      )}
                    </p>
                  </div>
                ),
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
