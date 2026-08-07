import prisma from "@/lib/prisma";
import {
  BadgeCheck,
  Ban,
  ChartNoAxesCombined,
  CircleDollarSign,
  PackageCheck,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";

export const dynamic = "force-dynamic";

const OFFSET_PERU_MS =
  5 * 60 * 60 * 1000;

function formatoMoneda(valor: number) {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
  }).format(valor);
}

function formatoNumero(valor: number) {
  return new Intl.NumberFormat(
    "es-PE"
  ).format(valor);
}

function formatoPorcentaje(valor: number) {
  return `${valor.toFixed(1)}%`;
}

function capitalizar(valor: string) {
  return valor
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letra) =>
      letra.toUpperCase()
    );
}

function obtenerRangosPeru() {
  const ahoraPeru = new Date(
    Date.now() - OFFSET_PERU_MS
  );

  const anio =
    ahoraPeru.getUTCFullYear();

  const mes =
    ahoraPeru.getUTCMonth();

  const dia =
    ahoraPeru.getUTCDate();

  const inicioHoy = new Date(
    Date.UTC(
      anio,
      mes,
      dia,
      5,
      0,
      0
    )
  );

  const inicioManana = new Date(
    Date.UTC(
      anio,
      mes,
      dia + 1,
      5,
      0,
      0
    )
  );

  const inicioMes = new Date(
    Date.UTC(
      anio,
      mes,
      1,
      5,
      0,
      0
    )
  );

  const inicioSiguienteMes = new Date(
    Date.UTC(
      anio,
      mes + 1,
      1,
      5,
      0,
      0
    )
  );

  return {
    inicioHoy,
    inicioManana,
    inicioMes,
    inicioSiguienteMes,
  };
}

export default async function VentasPage() {
  const {
    inicioHoy,
    inicioManana,
    inicioMes,
    inicioSiguienteMes,
  } = obtenerRangosPeru();

  const pedidosMes =
    await prisma.pedido.findMany({
      where: {
        createdAt: {
          gte: inicioMes,
          lt: inicioSiguienteMes,
        },
      },

      select: {
        id: true,
        codigo: true,
        estado: true,
        total: true,
        createdAt: true,

        confirmadoAt: true,
        entregadoAt: true,
        canceladoAt: true,

        utmSource: true,
        utmCampaign: true,
        utmContent: true,

        items: {
          select: {
            productoId: true,
            nombreProducto: true,
            cantidad: true,
            subtotal: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

  const pedidosHoy =
    pedidosMes.filter(
      (pedido) =>
        pedido.createdAt >= inicioHoy &&
        pedido.createdAt < inicioManana
    );

  const pedidosNoCanceladosHoy =
    pedidosHoy.filter(
      (pedido) =>
        pedido.estado !== "CANCELADO"
    );

  const pedidosNoCanceladosMes =
    pedidosMes.filter(
      (pedido) =>
        pedido.estado !== "CANCELADO"
    );

  const pedidosEntregadosMes =
    pedidosMes.filter(
      (pedido) =>
        pedido.estado === "ENTREGADO"
    );

  const pedidosConfirmadosMes =
    pedidosMes.filter(
      (pedido) =>
        pedido.confirmadoAt !== null
    );

  const pedidosCanceladosMes =
    pedidosMes.filter(
      (pedido) =>
        pedido.estado === "CANCELADO"
    );

  const valorGeneradoHoy =
    pedidosNoCanceladosHoy.reduce(
      (total, pedido) =>
        total + Number(pedido.total),
      0
    );

  const valorPedidosMes =
    pedidosNoCanceladosMes.reduce(
      (total, pedido) =>
        total + Number(pedido.total),
      0
    );

  const ventasRealesMes =
    pedidosEntregadosMes.reduce(
      (total, pedido) =>
        total + Number(pedido.total),
      0
    );

  const ticketPromedio =
    pedidosEntregadosMes.length > 0
      ? ventasRealesMes /
        pedidosEntregadosMes.length
      : 0;

  const porcentajeConfirmacion =
    pedidosMes.length > 0
      ? (pedidosConfirmadosMes.length /
          pedidosMes.length) *
        100
      : 0;

  const porcentajeCancelacion =
    pedidosMes.length > 0
      ? (pedidosCanceladosMes.length /
          pedidosMes.length) *
        100
      : 0;

  /*
   * PRODUCTOS MÁS PEDIDOS
   */
  const productosMap = new Map<
    string,
    {
      nombre: string;
      unidades: number;
      monto: number;
    }
  >();

  for (const pedido of pedidosNoCanceladosMes) {
    for (const item of pedido.items) {
      const clave =
        item.productoId?.toString() ??
        item.nombreProducto;

      const actual =
        productosMap.get(clave) ?? {
          nombre: item.nombreProducto,
          unidades: 0,
          monto: 0,
        };

      actual.unidades += item.cantidad;
      actual.monto += Number(
        item.subtotal
      );

      productosMap.set(
        clave,
        actual
      );
    }
  }

  const productosTop = Array.from(
    productosMap.values()
  )
    .sort(
      (a, b) =>
        b.unidades - a.unidades
    )
    .slice(0, 8);

  /*
   * ORIGEN DE LOS PEDIDOS
   */
  const origenesMap = new Map<
    string,
    {
      origen: string;
      pedidos: number;
      monto: number;
    }
  >();

  for (const pedido of pedidosMes) {
    const origen =
      pedido.utmSource?.trim() ||
      "directo";

    const clave =
      origen.toLowerCase();

    const actual =
      origenesMap.get(clave) ?? {
        origen,
        pedidos: 0,
        monto: 0,
      };

    actual.pedidos += 1;

    if (
      pedido.estado !== "CANCELADO"
    ) {
      actual.monto += Number(
        pedido.total
      );
    }

    origenesMap.set(
      clave,
      actual
    );
  }

  const origenes = Array.from(
    origenesMap.values()
  ).sort(
    (a, b) =>
      b.pedidos - a.pedidos
  );

  /*
   * CAMPAÑAS
   */
  const campanasMap = new Map<
    string,
    {
      nombre: string;
      pedidos: number;
      monto: number;
    }
  >();

  for (const pedido of pedidosMes) {
    if (!pedido.utmCampaign) {
      continue;
    }

    const nombre =
      pedido.utmCampaign;

    const actual =
      campanasMap.get(nombre) ?? {
        nombre,
        pedidos: 0,
        monto: 0,
      };

    actual.pedidos += 1;

    if (
      pedido.estado !== "CANCELADO"
    ) {
      actual.monto += Number(
        pedido.total
      );
    }

    campanasMap.set(
      nombre,
      actual
    );
  }

  const campanas = Array.from(
    campanasMap.values()
  )
    .sort(
      (a, b) =>
        b.pedidos - a.pedidos
    )
    .slice(0, 8);

  const tarjetas = [
    {
      titulo: "Pedidos hoy",
      valor: formatoNumero(
        pedidosHoy.length
      ),
      descripcion:
        "Pedidos generados hoy",
      icono: ShoppingCart,
    },
    {
      titulo: "Valor generado hoy",
      valor: formatoMoneda(
        valorGeneradoHoy
      ),
      descripcion:
        "Sin contar cancelados",
      icono: TrendingUp,
    },
    {
      titulo: "Pedidos del mes",
      valor: formatoNumero(
        pedidosMes.length
      ),
      descripcion: formatoMoneda(
        valorPedidosMes
      ),
      icono: ChartNoAxesCombined,
    },
    {
      titulo: "Ventas reales",
      valor: formatoMoneda(
        ventasRealesMes
      ),
      descripcion: `${pedidosEntregadosMes.length} pedidos entregados`,
      icono: CircleDollarSign,
    },
    {
      titulo: "Confirmados",
      valor: formatoNumero(
        pedidosConfirmadosMes.length
      ),
      descripcion: formatoPorcentaje(
        porcentajeConfirmacion
      ),
      icono: BadgeCheck,
    },
    {
      titulo: "Cancelados",
      valor: formatoNumero(
        pedidosCanceladosMes.length
      ),
      descripcion: formatoPorcentaje(
        porcentajeCancelacion
      ),
      icono: Ban,
    },
    {
      titulo: "Entregados",
      valor: formatoNumero(
        pedidosEntregadosMes.length
      ),
      descripcion:
        "Ventas completadas",
      icono: PackageCheck,
    },
    {
      titulo: "Ticket promedio",
      valor: formatoMoneda(
        ticketPromedio
      ),
      descripcion:
        "Sobre pedidos entregados",
      icono: CircleDollarSign,
    },
  ];

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-950 sm:text-3xl">
          Ventas
        </h1>

        <p className="mt-1 text-sm text-slate-600">
          Controla pedidos, ventas reales,
          productos y origen de tus clientes.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {tarjetas.map((tarjeta) => {
          const Icono =
            tarjeta.icono;

          return (
            <div
              key={tarjeta.titulo}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-slate-500">
                    {tarjeta.titulo}
                  </p>

                  <p className="mt-2 text-2xl font-black text-slate-950">
                    {tarjeta.valor}
                  </p>
                </div>

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                  <Icono size={21} />
                </div>
              </div>

              <p className="mt-3 text-xs font-semibold text-slate-500">
                {tarjeta.descripcion}
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="text-lg font-black text-slate-950">
              Productos más pedidos
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Pedidos del mes sin contar cancelados.
            </p>
          </div>

          {productosTop.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500">
              Todavía no hay productos para mostrar.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {productosTop.map(
                (producto, index) => (
                  <div
                    key={producto.nombre}
                    className="flex items-center justify-between gap-4 px-5 py-4"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-black text-slate-400">
                        #{index + 1}
                      </p>

                      <p className="mt-1 truncate text-sm font-bold text-slate-900">
                        {producto.nombre}
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="font-black text-slate-950">
                        {producto.unidades} und.
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {formatoMoneda(
                          producto.monto
                        )}
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="text-lg font-black text-slate-950">
              Origen de pedidos
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Facebook, TikTok, tráfico directo y otras fuentes.
            </p>
          </div>

          {origenes.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500">
              Todavía no hay datos de origen.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {origenes.map(
                (origen) => (
                  <div
                    key={origen.origen}
                    className="flex items-center justify-between gap-4 px-5 py-4"
                  >
                    <div>
                      <p className="font-bold text-slate-900">
                        {capitalizar(
                          origen.origen
                        )}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {origen.pedidos} pedidos
                      </p>
                    </div>

                    <p className="font-black text-slate-950">
                      {formatoMoneda(
                        origen.monto
                      )}
                    </p>
                  </div>
                )
              )}
            </div>
          )}
        </section>
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="text-lg font-black text-slate-950">
            Campañas que generan pedidos
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Basado en los parámetros UTM guardados en cada pedido.
          </p>
        </div>

        {campanas.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">
            Todavía no hay campañas con atribución.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-50">
                <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-4">
                    Campaña
                  </th>

                  <th className="px-5 py-4">
                    Pedidos
                  </th>

                  <th className="px-5 py-4">
                    Valor generado
                  </th>
                </tr>
              </thead>

              <tbody>
                {campanas.map(
                  (campana) => (
                    <tr
                      key={campana.nombre}
                      className="border-b border-slate-100"
                    >
                      <td className="px-5 py-4 font-bold text-slate-900">
                        {campana.nombre}
                      </td>

                      <td className="px-5 py-4 text-sm font-semibold text-slate-700">
                        {campana.pedidos}
                      </td>

                      <td className="px-5 py-4 font-black text-slate-950">
                        {formatoMoneda(
                          campana.monto
                        )}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </section>
  );
}