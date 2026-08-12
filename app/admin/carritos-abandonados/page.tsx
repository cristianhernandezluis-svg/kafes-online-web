import Link from "next/link";
import prisma from "@/lib/prisma";
import {
  CircleCheck,
  Clock3,
  MapPin,
  MessageCircle,
  Package,
  Search,
  ShoppingBasket,
  UserRound,
} from "lucide-react";

export const dynamic = "force-dynamic";

type CarritosPageProps = {
  searchParams: Promise<{
    buscar?: string;
    estado?: string;
  }>;
};

const estadosVista = [
  "ABANDONADOS",
  "ACTIVOS",
  "RECUPERADOS",
  "TODOS",
] as const;

type EstadoVista = (typeof estadosVista)[number];

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

function tiempoTranscurrido(fecha: Date, ahora: Date) {
  const minutos = Math.max(
    0,
    Math.floor(
      (ahora.getTime() - fecha.getTime()) / 60000,
    ),
  );

  if (minutos < 1) {
    return "Ahora";
  }

  if (minutos < 60) {
    return `${minutos} min`;
  }

  const horas = Math.floor(minutos / 60);

  if (horas < 24) {
    const minutosRestantes = minutos % 60;

    return minutosRestantes > 0
      ? `${horas} h ${minutosRestantes} min`
      : `${horas} h`;
  }

  const dias = Math.floor(horas / 24);

  return `${dias} d`;
}

function enlaceWhatsApp(
  celular: string,
  producto: string,
) {
  let numero = celular.replace(/\D/g, "");

  if (
    numero.length === 9 &&
    numero.startsWith("9")
  ) {
    numero = `51${numero}`;
  }

  const mensaje = encodeURIComponent(
    `Hola, te contactamos de KAFES ONLINE. Vimos que estuviste interesado en ${producto}. ¿Podemos ayudarte a finalizar tu pedido?`,
  );

  return `https://wa.me/${numero}?text=${mensaje}`;
}

function estadoValido(
  valor: string,
): valor is EstadoVista {
  return estadosVista.includes(
    valor as EstadoVista,
  );
}

export default async function CarritosAbandonadosPage({
  searchParams,
}: CarritosPageProps) {
  const params = await searchParams;

  const buscar = params.buscar?.trim() ?? "";

  const estadoRecibido =
    params.estado?.toUpperCase() ??
    "ABANDONADOS";

  const estado: EstadoVista = estadoValido(
    estadoRecibido,
  )
    ? estadoRecibido
    : "ABANDONADOS";

  const ahora = new Date();

  // Después de 10 minutos sin actividad
  // consideramos que el checkout fue abandonado.
  const limiteAbandono = new Date(
    ahora.getTime() - 10 * 60 * 1000,
  );

  const busqueda = buscar
    ? {
        OR: [
          {
            nombre: {
              contains: buscar,
              mode: "insensitive" as const,
            },
          },
          {
            celular: {
              contains: buscar,
              mode: "insensitive" as const,
            },
          },
          {
            productoNombre: {
              contains: buscar,
              mode: "insensitive" as const,
            },
          },
          {
            ciudad: {
              contains: buscar,
              mode: "insensitive" as const,
            },
          },
          {
            region: {
              contains: buscar,
              mode: "insensitive" as const,
            },
          },
        ],
      }
    : {};

  const [
    abandonados,
    activos,
    recuperados,
  ] = await Promise.all([
    prisma.carritoAbandonado.count({
      where: {
        estado: "ABIERTO",
        ultimaActividadAt: {
          lte: limiteAbandono,
        },
      },
    }),

    prisma.carritoAbandonado.count({
      where: {
        estado: "ABIERTO",
        ultimaActividadAt: {
          gt: limiteAbandono,
        },
      },
    }),

    prisma.carritoAbandonado.count({
      where: {
        estado: "RECUPERADO",
      },
    }),
  ]);

  const configuracionConsulta = {
    orderBy: {
      ultimaActividadAt: "desc" as const,
    },
    take: 200,
  };

  const carritos =
    estado === "ABANDONADOS"
      ? await prisma.carritoAbandonado.findMany({
          ...configuracionConsulta,
          where: {
            estado: "ABIERTO",
            ultimaActividadAt: {
              lte: limiteAbandono,
            },
            ...busqueda,
          },
        })
      : estado === "ACTIVOS"
        ? await prisma.carritoAbandonado.findMany({
            ...configuracionConsulta,
            where: {
              estado: "ABIERTO",
              ultimaActividadAt: {
                gt: limiteAbandono,
              },
              ...busqueda,
            },
          })
        : estado === "RECUPERADOS"
          ? await prisma.carritoAbandonado.findMany({
              ...configuracionConsulta,
              where: {
                estado: "RECUPERADO",
                ...busqueda,
              },
            })
          : await prisma.carritoAbandonado.findMany({
              ...configuracionConsulta,
              where: {
                ...busqueda,
              },
            });

  const tarjetas = [
    {
      estado: "ABANDONADOS",
      nombre: "Abandonados",
      cantidad: abandonados,
      icono: ShoppingBasket,
      clase:
        "bg-amber-100 text-amber-700",
    },
    {
      estado: "ACTIVOS",
      nombre: "En checkout",
      cantidad: activos,
      icono: Clock3,
      clase:
        "bg-blue-100 text-blue-700",
    },
    {
      estado: "RECUPERADOS",
      nombre: "Recuperados",
      cantidad: recuperados,
      icono: CircleCheck,
      clase:
        "bg-emerald-100 text-emerald-700",
    },
  ] as const;

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-950 sm:text-3xl">
            Carritos abandonados
          </h1>

          <p className="mt-1 text-sm text-slate-600">
            Recupera clientes que iniciaron el
            checkout pero todavía no finalizaron
            su pedido.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm">
          {carritos.length} resultados
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {tarjetas.map((tarjeta) => {
          const Icono = tarjeta.icono;
          const activo =
            estado === tarjeta.estado;

          const parametrosBusqueda = buscar
            ? `&buscar=${encodeURIComponent(buscar)}`
            : "";

          return (
            <Link
              key={tarjeta.estado}
              href={`/admin/carritos-abandonados?estado=${tarjeta.estado}${parametrosBusqueda}`}
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
                placeholder="Cliente, celular, producto, ciudad o región"
                className="h-11 w-full rounded-xl border border-slate-300 pl-10 pr-4 text-sm outline-none transition focus:border-slate-950"
              />
            </div>

            <select
              name="estado"
              defaultValue={estado}
              className="h-11 rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold outline-none focus:border-slate-950"
            >
              <option value="ABANDONADOS">
                Abandonados
              </option>

              <option value="ACTIVOS">
                En checkout
              </option>

              <option value="RECUPERADOS">
                Recuperados
              </option>

              <option value="TODOS">
                Todos
              </option>
            </select>

            <button
              type="submit"
              className="h-11 rounded-xl bg-slate-950 px-6 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              Buscar
            </button>

            {buscar && (
              <Link
                href={`/admin/carritos-abandonados?estado=${estado}`}
                className="flex h-11 items-center justify-center rounded-xl border border-slate-300 px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
              >
                Limpiar
              </Link>
            )}
          </form>
        </div>

        {carritos.length === 0 ? (
          <div className="flex min-h-[360px] flex-col items-center justify-center px-6 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <ShoppingBasket
                size={30}
                className="text-slate-500"
              />
            </div>

            <h2 className="text-xl font-black text-slate-950">
              No hay carritos en esta vista
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
              Cuando los clientes comiencen a
              completar el checkout aparecerán
              aquí automáticamente.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {carritos.map((carrito) => {
              const esRecuperado =
                carrito.estado ===
                "RECUPERADO";

              const esAbandonado =
                !esRecuperado &&
                carrito.ultimaActividadAt <=
                  limiteAbandono;

              const textoEstado = esRecuperado
                ? "Recuperado"
                : esAbandonado
                  ? "Abandonado"
                  : "En checkout";

              const claseEstado = esRecuperado
                ? "bg-emerald-100 text-emerald-700"
                : esAbandonado
                  ? "bg-amber-100 text-amber-700"
                  : "bg-blue-100 text-blue-700";

              const urlWhatsApp =
                carrito.celular &&
                !esRecuperado
                  ? enlaceWhatsApp(
                      carrito.celular,
                      carrito.productoNombre,
                    )
                  : null;

              return (
                <div
                  key={carrito.id}
                  className="p-4 sm:p-5"
                >
                  <div className="flex flex-col gap-5 xl:flex-row xl:items-center">
                    <div className="flex min-w-0 flex-1 items-start gap-3">
                      {carrito.imagenUrl ? (
                        <img
                          src={carrito.imagenUrl}
                          alt={
                            carrito.productoNombre
                          }
                          className="h-16 w-16 flex-none rounded-xl border border-slate-200 object-cover"
                        />
                      ) : (
                        <div className="flex h-16 w-16 flex-none items-center justify-center rounded-xl bg-slate-100">
                          <Package
                            size={24}
                            className="text-slate-400"
                          />
                        </div>
                      )}

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-black text-slate-950">
                            {
                              carrito.productoNombre
                            }
                          </p>

                          <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase ${claseEstado}`}
                          >
                            {textoEstado}
                          </span>
                        </div>

                        <p className="mt-1 text-sm font-bold text-slate-700">
                          {carrito.cantidad} ×{" "}
                          {formatoMoneda(
                            Number(
                              carrito.precio,
                            ),
                          )}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Checkout iniciado:{" "}
                          {formatoFecha(
                            carrito.checkoutIniciadoAt,
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="grid flex-1 grid-cols-1 gap-3 md:grid-cols-2">
                      <div className="rounded-xl bg-slate-50 p-3">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                          <UserRound size={14} />
                          Cliente
                        </div>

                        <p className="mt-1 font-bold text-slate-950">
                          {carrito.nombre ??
                            "Sin nombre"}
                        </p>

                        <p className="text-sm text-slate-600">
                          {carrito.celular ??
                            "Sin celular"}
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-3">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                          <MapPin size={14} />
                          Ubicación
                        </div>

                        <p className="mt-1 font-bold text-slate-950">
                          {carrito.ciudad ||
                            carrito.region ||
                            "Sin ubicación"}
                        </p>

                        <p className="truncate text-sm text-slate-600">
                          {carrito.direccion ??
                            "-"}
                        </p>
                      </div>
                    </div>

                    <div className="xl:w-40 xl:text-right">
                      <p className="text-xs font-bold text-slate-500">
                        Total
                      </p>

                      <p className="text-xl font-black text-slate-950">
                        {formatoMoneda(
                          Number(carrito.total),
                        )}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Sin actividad:{" "}
                        {tiempoTranscurrido(
                          carrito.ultimaActividadAt,
                          ahora,
                        )}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 xl:w-56 xl:justify-end">
                      {urlWhatsApp && (
                        <a
                          href={urlWhatsApp}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex h-10 items-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-black text-white transition hover:bg-emerald-700"
                        >
                          <MessageCircle
                            size={16}
                          />
                          Recuperar
                        </a>
                      )}

                      {carrito.pedidoId && (
                        <Link
                          href={`/admin/pedidos/${carrito.pedidoId}`}
                          className="inline-flex h-10 items-center rounded-xl border border-slate-300 px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
                        >
                          Ver pedido
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}