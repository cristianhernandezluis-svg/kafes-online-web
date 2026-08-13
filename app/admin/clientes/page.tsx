import Link from "next/link";
import prisma from "@/lib/prisma";
import {
  CircleCheck,
  MapPin,
  MessageCircle,
  PackageSearch,
  Phone,
  Search,
  ShoppingBag,
  UserRound,
  Users,
  UserX,
} from "lucide-react";

export const dynamic = "force-dynamic";

type ClientesPageProps = {
  searchParams: Promise<{
    buscar?: string;
    estado?: string;
  }>;
};

const estadosCliente = [
  "TODOS",
  "ACTIVOS",
  "INACTIVOS",
] as const;

type EstadoCliente =
  (typeof estadosCliente)[number];

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

function estadoValido(
  valor: string,
): valor is EstadoCliente {
  return estadosCliente.includes(
    valor as EstadoCliente,
  );
}

function obtenerWhatsApp(celular: string) {
  let numero = celular.replace(/\D/g, "");

  if (
    numero.length === 9 &&
    numero.startsWith("9")
  ) {
    numero = `51${numero}`;
  }

  const mensaje = encodeURIComponent(
    "Hola, te contactamos de KAFES ONLINE. ¿En qué podemos ayudarte?",
  );

  return `https://wa.me/${numero}?text=${mensaje}`;
}

export default async function ClientesPage({
  searchParams,
}: ClientesPageProps) {
  const params = await searchParams;

  const buscar =
    params.buscar?.trim() ?? "";

  const estadoRecibido =
    params.estado?.toUpperCase() ??
    "TODOS";

  const estado: EstadoCliente =
    estadoValido(estadoRecibido)
      ? estadoRecibido
      : "TODOS";

  const filtroEstado =
    estado === "ACTIVOS"
      ? {
          activo: true,
        }
      : estado === "INACTIVOS"
        ? {
            activo: false,
          }
        : {};

  const filtroBusqueda = buscar
    ? {
        OR: [
          {
            nombre: {
              contains: buscar,
              mode: "insensitive" as const,
            },
          },
          {
            telefono: {
              contains: buscar,
              mode: "insensitive" as const,
            },
          },
          {
            email: {
              contains: buscar,
              mode: "insensitive" as const,
            },
          },
          {
            dni: {
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

  const where = {
    ...filtroEstado,
    ...filtroBusqueda,
  };

  const [
    clientes,
    totalClientes,
    clientesActivos,
    clientesConPedidos,
  ] = await Promise.all([
    prisma.cliente.findMany({
      where,
      orderBy: {
        updatedAt: "desc",
      },
      take: 200,
      select: {
        id: true,
        nombre: true,
        telefono: true,
        email: true,
        dni: true,
        ciudad: true,
        region: true,
        direccion: true,
        referencia: true,
        notas: true,
        activo: true,
        createdAt: true,
        updatedAt: true,

        pedidos: {
          orderBy: {
            createdAt: "desc",
          },
          select: {
            id: true,
            codigo: true,
            total: true,
            estado: true,
            createdAt: true,
          },
        },
      },
    }),

    prisma.cliente.count(),

    prisma.cliente.count({
      where: {
        activo: true,
      },
    }),

    prisma.cliente.count({
      where: {
        pedidos: {
          some: {},
        },
      },
    }),
  ]);

  const tarjetas = [
    {
      titulo: "Total clientes",
      valor: totalClientes,
      descripcion:
        "Registrados en KAFES ONLINE",
      icono: Users,
      clase:
        "bg-blue-100 text-blue-700",
    },
    {
      titulo: "Clientes activos",
      valor: clientesActivos,
      descripcion:
        "Disponibles para seguimiento",
      icono: CircleCheck,
      clase:
        "bg-emerald-100 text-emerald-700",
    },
    {
      titulo: "Con pedidos",
      valor: clientesConPedidos,
      descripcion:
        "Ya realizaron una compra",
      icono: ShoppingBag,
      clase:
        "bg-violet-100 text-violet-700",
    },
  ];

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-950 sm:text-3xl">
            Clientes
          </h1>

          <p className="mt-1 text-sm text-slate-600">
            Consulta tus clientes, sus
            pedidos y su historial de
            compras.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm">
          {clientes.length} resultados
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {tarjetas.map((tarjeta) => {
          const Icono = tarjeta.icono;

          return (
            <div
              key={tarjeta.titulo}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${tarjeta.clase}`}
              >
                <Icono size={20} />
              </div>

              <p className="mt-4 text-xs font-bold text-slate-500">
                {tarjeta.titulo}
              </p>

              <p className="mt-1 text-2xl font-black text-slate-950">
                {tarjeta.valor}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {tarjeta.descripcion}
              </p>
            </div>
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
                placeholder="Nombre, celular, DNI, ciudad o región"
                className="h-11 w-full rounded-xl border border-slate-300 pl-10 pr-4 text-sm outline-none transition focus:border-slate-950"
              />
            </div>

            <select
              key={estado}
              name="estado"
              defaultValue={estado}
              className="h-11 rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold outline-none focus:border-slate-950"
            >
              <option value="TODOS">
                Todos los clientes
              </option>

              <option value="ACTIVOS">
                Clientes activos
              </option>

              <option value="INACTIVOS">
                Clientes inactivos
              </option>
            </select>

            <button
              type="submit"
              className="h-11 rounded-xl bg-slate-950 px-6 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              Buscar
            </button>

            {(buscar ||
              estado !== "TODOS") && (
              <Link
                href="/admin/clientes"
                className="flex h-11 items-center justify-center rounded-xl border border-slate-300 px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
              >
                Limpiar
              </Link>
            )}
          </form>
        </div>

        {clientes.length === 0 ? (
          <div className="flex min-h-[360px] flex-col items-center justify-center px-6 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <UserRound
                size={30}
                className="text-slate-500"
              />
            </div>

            <h2 className="text-xl font-black text-slate-950">
              No encontramos clientes
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
              Prueba cambiando el filtro o
              buscando por nombre, celular,
              DNI o ubicación.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {clientes.map((cliente) => {
              const pedidosValidos =
                cliente.pedidos.filter(
                  (pedido) =>
                    pedido.estado !==
                    "CANCELADO",
                );

              const totalComprado =
                pedidosValidos.reduce(
                  (total, pedido) =>
                    total +
                    Number(pedido.total),
                  0,
                );

              const ultimoPedido =
                cliente.pedidos[0] ??
                null;

              const inicial =
                cliente.nombre
                  .trim()
                  .charAt(0)
                  .toUpperCase() || "C";

              const whatsapp =
                obtenerWhatsApp(
                  cliente.telefono,
                );

              const linkPedidos =
                `/admin/pedidos?buscar=${encodeURIComponent(
                  cliente.telefono,
                )}`;

              return (
                <div
                  key={cliente.id}
                  className="p-4 sm:p-5"
                >
                  <div className="flex flex-col gap-5 xl:flex-row xl:items-center">
                    <div className="flex min-w-0 flex-1 items-start gap-3">
                      <div className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-slate-950 text-lg font-black text-white">
                        {inicial}
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-black text-slate-950">
                            {cliente.nombre}
                          </p>

                          {cliente.activo ? (
                            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-black uppercase text-emerald-700">
                              Activo
                            </span>
                          ) : (
                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black uppercase text-slate-600">
                              Inactivo
                            </span>
                          )}
                        </div>

                        <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                          <Phone
                            size={14}
                            className="flex-none"
                          />

                          <span>
                            {cliente.telefono}
                          </span>
                        </div>

                        {cliente.email && (
                          <p className="mt-1 truncate text-xs text-slate-500">
                            {cliente.email}
                          </p>
                        )}

                        {cliente.dni && (
                          <p className="mt-1 text-xs text-slate-500">
                            DNI: {cliente.dni}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid flex-1 grid-cols-1 gap-3 md:grid-cols-2">
                      <div className="rounded-xl bg-slate-50 p-3">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                          <MapPin size={14} />
                          Ubicación
                        </div>

                        <p className="mt-1 font-bold text-slate-950">
                          {cliente.ciudad ||
                            cliente.region ||
                            "Sin ubicación"}
                        </p>

                        {cliente.region &&
                          cliente.ciudad && (
                            <p className="text-xs text-slate-500">
                              {cliente.region}
                            </p>
                          )}

                        {cliente.direccion && (
                          <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                            {
                              cliente.direccion
                            }
                          </p>
                        )}
                      </div>

                      <div className="rounded-xl bg-slate-50 p-3">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                          <ShoppingBag
                            size={14}
                          />
                          Compras
                        </div>

                        <p className="mt-1 font-black text-slate-950">
                          {
                            pedidosValidos.length
                          }{" "}
                          {pedidosValidos.length ===
                          1
                            ? "pedido"
                            : "pedidos"}
                        </p>

                        <p className="text-sm font-bold text-emerald-700">
                          {formatoMoneda(
                            totalComprado,
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="xl:w-52">
                      <p className="text-xs font-bold text-slate-500">
                        Último pedido
                      </p>

                      {ultimoPedido ? (
                        <>
                          <Link
                            href={`/admin/pedidos/${ultimoPedido.id}`}
                            className="mt-1 inline-block font-black text-slate-950 transition hover:text-blue-600"
                          >
                            #
                            {
                              ultimoPedido.codigo
                            }
                          </Link>

                          <p className="mt-1 text-xs text-slate-500">
                            {formatoFecha(
                              ultimoPedido.createdAt,
                            )}
                          </p>

                          <p className="mt-1 text-sm font-bold text-slate-700">
                            {formatoMoneda(
                              Number(
                                ultimoPedido.total,
                              ),
                            )}
                          </p>
                        </>
                      ) : (
                        <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                          <PackageSearch
                            size={16}
                          />
                          Sin pedidos
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 xl:w-60 xl:justify-end">
                      <a
                        href={whatsapp}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-10 items-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-black text-white transition hover:bg-emerald-700"
                      >
                        <MessageCircle
                          size={16}
                        />
                        WhatsApp
                      </a>

                      {cliente.pedidos.length >
                        0 && (
                        <Link
                          href={linkPedidos}
                          className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-300 px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
                        >
                          <ShoppingBag
                            size={16}
                          />
                          Ver pedidos
                        </Link>
                      )}
                    </div>
                  </div>

                  {!cliente.activo && (
                    <div className="mt-4 flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-500">
                      <UserX size={14} />
                      Este cliente está marcado
                      como inactivo.
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}