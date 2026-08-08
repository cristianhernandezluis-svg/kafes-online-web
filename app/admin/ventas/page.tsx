import prisma from "@/lib/prisma";
import Link from "next/link";
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

type PeriodoVentas =
  | "HOY"
  | "AYER"
  | "7D"
  | "30D"
  | "MES";

type VentasPageProps = {
  searchParams: Promise<{
    periodo?: string;
  }>;
};

function esPeriodoValido(
  valor: string
): valor is PeriodoVentas {
  return [
    "HOY",
    "AYER",
    "7D",
    "30D",
    "MES",
  ].includes(valor);
}

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

function obtenerRangoPeriodo(
  periodo: PeriodoVentas
) {
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

  if (periodo === "HOY") {
    return {
      inicio: inicioHoy,
      fin: inicioManana,
      etiqueta: "Hoy",
    };
  }

  if (periodo === "AYER") {
    return {
      inicio: new Date(
        Date.UTC(
          anio,
          mes,
          dia - 1,
          5,
          0,
          0
        )
      ),
      fin: inicioHoy,
      etiqueta: "Ayer",
    };
  }

  if (periodo === "7D") {
    return {
      inicio: new Date(
        Date.UTC(
          anio,
          mes,
          dia - 6,
          5,
          0,
          0
        )
      ),
      fin: inicioManana,
      etiqueta: "Últimos 7 días",
    };
  }

  if (periodo === "30D") {
    return {
      inicio: new Date(
        Date.UTC(
          anio,
          mes,
          dia - 29,
          5,
          0,
          0
        )
      ),
      fin: inicioManana,
      etiqueta: "Últimos 30 días",
    };
  }

  return {
    inicio: new Date(
      Date.UTC(
        anio,
        mes,
        1,
        5,
        0,
        0
      )
    ),
    fin: new Date(
      Date.UTC(
        anio,
        mes + 1,
        1,
        5,
        0,
        0
      )
    ),
    etiqueta: "Este mes",
  };
}

export default async function VentasPage({
  searchParams,
}: VentasPageProps) {
  const params = await searchParams;

const opcionesPeriodo: {
  valor: PeriodoVentas;
  texto: string;
}[] = [
  {
    valor: "HOY",
    texto: "Hoy",
  },
  {
    valor: "AYER",
    texto: "Ayer",
  },
  {
    valor: "7D",
    texto: "7 días",
  },
  {
    valor: "30D",
    texto: "30 días",
  },
  {
    valor: "MES",
    texto: "Este mes",
  },
];

  const periodoRecibido =
    params.periodo ?? "MES";

  const periodo: PeriodoVentas =
    esPeriodoValido(periodoRecibido)
      ? periodoRecibido
      : "MES";

  const {
    inicio,
    fin,
    etiqueta,
  } = obtenerRangoPeriodo(periodo);

const duracionPeriodo =
  fin.getTime() - inicio.getTime();

const inicioAnterior = new Date(
  inicio.getTime() - duracionPeriodo
);

const finAnterior = inicio;

  const [
  pedidosMes,
  pedidosPeriodoAnterior,
] = await Promise.all([
  prisma.pedido.findMany({
      where: {
        createdAt: {
  gte: inicio,
  lt: fin,
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
}),

prisma.pedido.findMany({
  where: {
    createdAt: {
      gte: inicioAnterior,
      lt: finAnterior,
    },
  },

  select: {
    id: true,
    estado: true,
    total: true,
    createdAt: true,
    confirmadoAt: true,
    entregadoAt: true,
    canceladoAt: true,
  },
}),
]);

const graficoPorHora =
  periodo === "HOY" ||
  periodo === "AYER";

const intervaloGrafico =
  graficoPorHora
    ? 60 * 60 * 1000
    : 24 * 60 * 60 * 1000;

type PuntoGrafico = {
  clave: string;
  etiqueta: string;
  pedidos: number;
  valorGenerado: number;
  ventasReales: number;
};

const graficoMap = new Map<
  string,
  PuntoGrafico
>();

function obtenerClaveGrafico(
  fecha: Date
) {
  const fechaPeru = new Date(
    fecha.getTime() -
      OFFSET_PERU_MS
  );

  const anio =
    fechaPeru.getUTCFullYear();

  const mes = String(
    fechaPeru.getUTCMonth() + 1
  ).padStart(2, "0");

  const dia = String(
    fechaPeru.getUTCDate()
  ).padStart(2, "0");

  if (graficoPorHora) {
    const hora = String(
      fechaPeru.getUTCHours()
    ).padStart(2, "0");

    return `${anio}-${mes}-${dia}-${hora}`;
  }

  return `${anio}-${mes}-${dia}`;
}

function obtenerEtiquetaGrafico(
  fecha: Date
) {
  const fechaPeru = new Date(
    fecha.getTime() -
      OFFSET_PERU_MS
  );

  if (graficoPorHora) {
    const hora = String(
      fechaPeru.getUTCHours()
    ).padStart(2, "0");

    return `${hora}:00`;
  }

  return new Intl.DateTimeFormat(
    "es-PE",
    {
      day: "2-digit",
      month: "short",
      timeZone: "UTC",
    }
  ).format(fechaPeru);
}

/*
 * Creamos todos los puntos del período,
 * incluso cuando no hubo pedidos.
 */
for (
  let tiempo = inicio.getTime();
  tiempo < fin.getTime();
  tiempo += intervaloGrafico
) {
  const fecha = new Date(tiempo);

  const clave =
    obtenerClaveGrafico(fecha);

  graficoMap.set(clave, {
    clave,
    etiqueta:
      obtenerEtiquetaGrafico(fecha),
    pedidos: 0,
    valorGenerado: 0,
    ventasReales: 0,
  });
}

/*
 * Colocamos cada pedido en su hora o día.
 */
for (const pedido of pedidosMes) {
  const clave =
    obtenerClaveGrafico(
      pedido.createdAt
    );

  const punto =
    graficoMap.get(clave);

  if (!punto) {
    continue;
  }

  punto.pedidos += 1;

  if (
    pedido.estado !==
    "CANCELADO"
  ) {
    punto.valorGenerado += Number(
      pedido.total
    );
  }

  if (
    pedido.estado ===
    "ENTREGADO"
  ) {
    punto.ventasReales += Number(
      pedido.total
    );
  }
}

const datosGrafico = Array.from(
  graficoMap.values()
);

const valorMaximoGrafico = Math.max(
  1,
  ...datosGrafico.map(
    (punto) =>
      Math.max(
        punto.valorGenerado,
        punto.ventasReales
      )
  )
);

const anchoGrafico = 1000;
const altoGrafico = 320;
const margenX = 95;
const margenY = 30;

const anchoUtil =
  anchoGrafico - margenX * 2;

const altoUtil =
  altoGrafico - margenY * 2;

function obtenerXGrafico(
  indice: number
) {
  if (datosGrafico.length <= 1) {
    return margenX;
  }

  return (
    margenX +
    (indice /
      (datosGrafico.length - 1)) *
      anchoUtil
  );
}

function obtenerYGrafico(
  valor: number
) {
  return (
    margenY +
    (1 -
      valor / valorMaximoGrafico) *
      altoUtil
  );
}

const puntosValorGenerado =
  datosGrafico
    .map(
      (punto, indice) =>
        `${obtenerXGrafico(
          indice
        )},${obtenerYGrafico(
          punto.valorGenerado
        )}`
    )
    .join(" ");

const puntosVentasReales =
  datosGrafico
    .map(
      (punto, indice) =>
        `${obtenerXGrafico(
          indice
        )},${obtenerYGrafico(
          punto.ventasReales
        )}`
    )
    .join(" ");

const saltoEtiquetas = Math.max(
  1,
  Math.ceil(
    datosGrafico.length / 8
  )
);

const maxPedidosGrafico = Math.max(
  1,
  ...datosGrafico.map(
    (punto) => punto.pedidos
  )
);

const altoGraficoPedidos = 180;
const margenSuperiorPedidos = 20;
const margenInferiorPedidos = 35;

const altoUtilPedidos =
  altoGraficoPedidos -
  margenSuperiorPedidos -
  margenInferiorPedidos;

const anchoBarraPedidos = Math.max(
  8,
  Math.min(
    28,
    (anchoUtil /
      Math.max(
        datosGrafico.length,
        1
      )) *
      0.55
  )
);

function obtenerYPedidos(
  valor: number
) {
  return (
    margenSuperiorPedidos +
    (1 -
      valor / maxPedidosGrafico) *
      altoUtilPedidos
  );
}

  const pedidosHoy = pedidosMes;

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

const pedidosNoCanceladosAnterior =
  pedidosPeriodoAnterior.filter(
    (pedido) =>
      pedido.estado !== "CANCELADO"
  );

const pedidosConfirmadosAnterior =
  pedidosPeriodoAnterior.filter(
    (pedido) =>
      pedido.confirmadoAt !== null
  );

const pedidosCanceladosAnterior =
  pedidosPeriodoAnterior.filter(
    (pedido) =>
      pedido.estado === "CANCELADO"
  );

const valorGeneradoAnterior =
  pedidosNoCanceladosAnterior.reduce(
    (total, pedido) =>
      total + Number(pedido.total),
    0
  );

function calcularVariacion(
  actual: number,
  anterior: number
) {
  if (anterior === 0) {
    if (actual === 0) {
      return 0;
    }

    return null;
  }

  return (
    ((actual - anterior) /
      anterior) *
    100
  );
}

const variacionPedidos =
  calcularVariacion(
    pedidosMes.length,
    pedidosPeriodoAnterior.length
  );

const variacionValor =
  calcularVariacion(
    valorGeneradoHoy,
    valorGeneradoAnterior
  );

const variacionConfirmados =
  calcularVariacion(
    pedidosConfirmadosMes.length,
    pedidosConfirmadosAnterior.length
  );

const variacionCancelados =
  calcularVariacion(
    pedidosCanceladosMes.length,
    pedidosCanceladosAnterior.length
  );

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

function claseVariacion(
  variacion: number | null,
  inversa = false
) {
  if (variacion === null) {
    return "text-blue-600";
  }

  if (variacion === 0) {
    return "text-slate-500";
  }

  const positiva = variacion > 0;

  if (inversa) {
    return positiva
      ? "text-red-600"
      : "text-emerald-600";
  }

  return positiva
    ? "text-emerald-600"
    : "text-red-600";
}

  const tarjetas = [
  {
    titulo: `Pedidos · ${etiqueta}`,
    valor: formatoNumero(
      pedidosHoy.length
    ),
    descripcion:
      "Pedidos generados",
    icono: ShoppingCart,
    variacion: variacionPedidos,
    inversa: false,
  },
  {
    titulo: `Valor generado · ${etiqueta}`,
    valor: formatoMoneda(
      valorGeneradoHoy
    ),
    descripcion:
      "Sin contar cancelados",
    icono: TrendingUp,
    variacion: variacionValor,
    inversa: false,
  },
  {
    titulo: "Valor de pedidos",
    valor: formatoNumero(
      pedidosMes.length
    ),
    descripcion: formatoMoneda(
      valorPedidosMes
    ),
    icono: ChartNoAxesCombined,
    variacion: undefined,
    inversa: false,
  },
  {
    titulo: "Ventas reales",
    valor: formatoMoneda(
      ventasRealesMes
    ),
    descripcion: `${pedidosEntregadosMes.length} pedidos entregados`,
    icono: CircleDollarSign,
    variacion: undefined,
    inversa: false,
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
    variacion:
      variacionConfirmados,
    inversa: false,
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
    variacion:
      variacionCancelados,
    inversa: true,
  },
  {
    titulo: "Entregados",
    valor: formatoNumero(
      pedidosEntregadosMes.length
    ),
    descripcion:
      "Ventas completadas",
    icono: PackageCheck,
    variacion: undefined,
    inversa: false,
  },
  {
    titulo: "Ticket promedio",
    valor: formatoMoneda(
      ticketPromedio
    ),
    descripcion:
      "Sobre pedidos entregados",
    icono: CircleDollarSign,
    variacion: undefined,
    inversa: false,
  },
];

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
  <div>
    <h1 className="text-2xl font-black text-slate-950 sm:text-3xl">
      Ventas
    </h1>

    <p className="mt-1 text-sm text-slate-600">
      Controla pedidos, ventas reales,
      productos y origen de tus clientes.
    </p>
  </div>

  <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
    {opcionesPeriodo.map((opcion) => {
      const activo =
        periodo === opcion.valor;

      return (
        <Link
          key={opcion.valor}
          href={`/admin/ventas?periodo=${opcion.valor}`}
          className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
            activo
              ? "bg-slate-950 text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
          }`}
        >
          {opcion.texto}
        </Link>
      );
    })}
  </div>
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

{tarjeta.variacion !== undefined && (
  <p
    className={`mt-2 text-xs font-black ${claseVariacion(
      tarjeta.variacion,
      tarjeta.inversa
    )}`}
  >
    {tarjeta.variacion === null
      ? "Nuevo vs período anterior"
      : tarjeta.variacion > 0
        ? `↑ ${Math.abs(
            tarjeta.variacion
          ).toFixed(
            1
          )}% vs período anterior`
        : tarjeta.variacion < 0
          ? `↓ ${Math.abs(
              tarjeta.variacion
            ).toFixed(
              1
            )}% vs período anterior`
          : "Sin cambio vs período anterior"}
  </p>
)}

            </div>
          );
        })}
      </div>

<div className="grid gap-6 xl:grid-cols-2">
  {/* VENTAS */}
  <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
    <div className="border-b border-slate-200 px-5 py-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-black text-slate-950">
            Rendimiento de ventas
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            {etiqueta} · Valor generado vs. ventas reales
          </p>
        </div>

        <div className="flex flex-wrap gap-3 text-[11px] font-bold">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-950" />
            Valor generado
          </div>

          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            Ventas reales
          </div>
        </div>
      </div>
    </div>

    <div className="p-4">
      <svg
        viewBox={`0 0 ${anchoGrafico} ${altoGrafico}`}
        className="w-full"
        role="img"
        aria-label="Gráfico de rendimiento de ventas"
      >
        {[0, 0.25, 0.5, 0.75, 1].map(
          (nivel) => {
            const y =
              margenY +
              nivel * altoUtil;

            const valor =
              valorMaximoGrafico *
              (1 - nivel);

            return (
              <g key={nivel}>
                <line
                  x1={margenX}
                  y1={y}
                  x2={
                    anchoGrafico -
                    margenX
                  }
                  y2={y}
                  stroke="#e2e8f0"
                  strokeWidth="1"
                />

                <text
                  x={margenX - 10}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="11"
                  fill="#64748b"
                >
                  {formatoMoneda(valor)}
                </text>
              </g>
            );
          }
        )}

        <polyline
          points={puntosValorGenerado}
          fill="none"
          stroke="#0f172a"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <polyline
          points={puntosVentasReales}
          fill="none"
          stroke="#10b981"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {datosGrafico.map(
          (punto, indice) => {
            const ultimoIndice =
              datosGrafico.length - 1;

            const mostrarEtiqueta =
              indice === 0 ||
              indice === ultimoIndice ||
              (
                indice %
                  saltoEtiquetas ===
                  0 &&
                indice <=
                  ultimoIndice -
                    saltoEtiquetas
              );

            return (
              <g key={punto.clave}>
                <circle
                  cx={obtenerXGrafico(
                    indice
                  )}
                  cy={obtenerYGrafico(
                    punto.valorGenerado
                  )}
                  r="14"
                  fill="transparent"
                >
                  <title>
                    {`${punto.etiqueta} | Pedidos: ${
                      punto.pedidos
                    } | Valor generado: ${formatoMoneda(
                      punto.valorGenerado
                    )} | Ventas reales: ${formatoMoneda(
                      punto.ventasReales
                    )}`}
                  </title>
                </circle>

                <circle
                  cx={obtenerXGrafico(
                    indice
                  )}
                  cy={obtenerYGrafico(
                    punto.valorGenerado
                  )}
                  r="4"
                  fill="#0f172a"
                />

                {punto.ventasReales >
                  0 && (
                  <circle
                    cx={obtenerXGrafico(
                      indice
                    )}
                    cy={obtenerYGrafico(
                      punto.ventasReales
                    )}
                    r="4"
                    fill="#10b981"
                  />
                )}

                {mostrarEtiqueta && (
                  <text
                    x={obtenerXGrafico(
                      indice
                    )}
                    y={
                      altoGrafico - 5
                    }
                    textAnchor="middle"
                    fontSize="11"
                    fill="#64748b"
                  >
                    {punto.etiqueta}
                  </text>
                )}
              </g>
            );
          }
        )}
      </svg>
    </div>
  </section>

  {/* PEDIDOS */}
  <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
    <div className="border-b border-slate-200 px-5 py-4">
      <h2 className="text-base font-black text-slate-950">
        Pedidos
      </h2>

      <p className="mt-1 text-xs text-slate-500">
        {etiqueta} · Cantidad de pedidos generados
      </p>
    </div>

    <div className="p-4">
      <svg
        viewBox={`0 0 ${anchoGrafico} ${altoGrafico}`}
        className="w-full"
        role="img"
        aria-label="Gráfico de pedidos"
      >
        {[0, 0.25, 0.5, 0.75, 1].map(
          (nivel) => {
            const y =
              margenY +
              nivel * altoUtil;

            const valor = Math.round(
              maxPedidosGrafico *
                (1 - nivel)
            );

            return (
              <g key={nivel}>
                <line
                  x1={margenX}
                  y1={y}
                  x2={
                    anchoGrafico -
                    margenX
                  }
                  y2={y}
                  stroke="#e2e8f0"
                  strokeWidth="1"
                />

                <text
                  x={margenX - 10}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="11"
                  fill="#64748b"
                >
                  {valor}
                </text>
              </g>
            );
          }
        )}

        {datosGrafico.map(
          (punto, indice) => {
            const x =
              obtenerXGrafico(indice);

            const alturaMaxima =
              altoUtil;

            const altura =
              maxPedidosGrafico > 0
                ? (punto.pedidos /
                    maxPedidosGrafico) *
                  alturaMaxima
                : 0;

            const y =
              margenY +
              altoUtil -
              altura;

            const anchoBarra =
              Math.max(
                8,
                Math.min(
                  34,
                  anchoUtil /
                    Math.max(
                      datosGrafico.length *
                        1.8,
                      1
                    )
                )
              );

            const ultimoIndice =
              datosGrafico.length - 1;

            const mostrarEtiqueta =
              indice === 0 ||
              indice === ultimoIndice ||
              (
                indice %
                  saltoEtiquetas ===
                  0 &&
                indice <=
                  ultimoIndice -
                    saltoEtiquetas
              );

            return (
              <g key={punto.clave}>
                <rect
                  x={
                    x -
                    anchoBarra / 2
                  }
                  y={y}
                  width={anchoBarra}
                  height={Math.max(
                    0,
                    altura
                  )}
                  rx="5"
                  fill="#0f172a"
                >
                  <title>
                    {`${punto.etiqueta} | ${punto.pedidos} pedidos`}
                  </title>
                </rect>

                {punto.pedidos >
                  0 && (
                  <text
                    x={x}
                    y={y - 8}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="700"
                    fill="#0f172a"
                  >
                    {punto.pedidos}
                  </text>
                )}

                {mostrarEtiqueta && (
                  <text
                    x={x}
                    y={
                      altoGrafico - 5
                    }
                    textAnchor="middle"
                    fontSize="11"
                    fill="#64748b"
                  >
                    {punto.etiqueta}
                  </text>
                )}
              </g>
            );
          }
        )}
      </svg>
    </div>
  </section>
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