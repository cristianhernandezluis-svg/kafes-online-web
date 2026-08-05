import WhatsAppButton from "@/components/WhatsAppButton";
import prisma from "@/lib/prisma";
import BuscadorProductos from "@/components/BuscadorProductos";
import Benefit from "@/components/home/Benefit";
import HeroSlider from "@/components/home/HeroSlider";
import ProductCard from "@/components/home/ProductCard";
import PromoCard from "@/components/home/PromoCard";
import {
  ShoppingCart,
  Truck,
  ShieldCheck,
  Headphones,
  CreditCard,
  ChevronRight,
  Droplets,
  Trees,
  Zap,
  Sparkles,
  BadgePercent,
} from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function formatearPrecio(valor: { toString(): string } | null) {
  if (!valor) return null;

  const numero = Number(valor.toString());

  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: numero % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(numero);
}

type ConfiguracionProductosDestacados = {
  cantidad: number;
  textoBoton: string;
  hrefBoton: string;
  productoIds: number[];
};

function leerConfiguracionProductosDestacados(
  valor: unknown
): ConfiguracionProductosDestacados {
  const predeterminado: ConfiguracionProductosDestacados = {
    cantidad: 8,
    textoBoton: "Ver todos los productos",
    hrefBoton: "/productos",
    productoIds: [],
  };

  if (!valor || typeof valor !== "object" || Array.isArray(valor)) {
    return predeterminado;
  }

  const configuracion = valor as Record<string, unknown>;

  const cantidad =
    typeof configuracion.cantidad === "number" &&
    Number.isFinite(configuracion.cantidad)
      ? Math.min(Math.max(Math.trunc(configuracion.cantidad), 1), 12)
      : predeterminado.cantidad;

  const textoBoton =
    typeof configuracion.textoBoton === "string" &&
    configuracion.textoBoton.trim()
      ? configuracion.textoBoton.trim()
      : predeterminado.textoBoton;

  const hrefBoton =
    typeof configuracion.hrefBoton === "string" &&
    configuracion.hrefBoton.trim()
      ? configuracion.hrefBoton.trim()
      : predeterminado.hrefBoton;

  const productoIds = Array.isArray(configuracion.productoIds)
    ? configuracion.productoIds.filter(
        (id): id is number =>
          typeof id === "number" &&
          Number.isInteger(id) &&
          id > 0
      )
    : [];

  return {
    cantidad,
    textoBoton,
    hrefBoton,
    productoIds,
  };
}

type ConfiguracionCategoriasHome = {
  categoriaIds: number[] | null;
};

function leerConfiguracionCategorias(
  valor: unknown
): ConfiguracionCategoriasHome {
  if (
    !valor ||
    typeof valor !== "object" ||
    Array.isArray(valor)
  ) {
    return {
      categoriaIds: null,
    };
  }

  const configuracion = valor as Record<string, unknown>;

  if (!Array.isArray(configuracion.categoriaIds)) {
    return {
      categoriaIds: null,
    };
  }

  const categoriaIds = configuracion.categoriaIds.filter(
    (id): id is number =>
      typeof id === "number" &&
      Number.isInteger(id) &&
      id > 0
  );

  return {
    categoriaIds,
  };
}

type IconoPromocion =
  | "gotas"
  | "arbol"
  | "rayo";

type FondoPromocion =
  | "azul"
  | "verde"
  | "oscuro"
  | "rojo"
  | "amarillo";

type TarjetaPromocionHome = {
  titulo: string;
  texto: string;
  href: string;
  icono: IconoPromocion;
  fondo: FondoPromocion;
};

type ConfiguracionPromocionesHome = {
  enlaceTodos: string;
  tarjetas: TarjetaPromocionHome[];
};

const PROMOCIONES_PREDETERMINADAS: TarjetaPromocionHome[] = [
  {
    titulo: "Hidrolavadoras",
    texto: "Potencia para autos, motos y maquinaria.",
    href: "/categoria/hidrolavadoras",
    icono: "gotas",
    fondo: "azul",
  },
  {
    titulo: "Jardinería",
    texto: "Sierras, podadoras y cortasetos.",
    href: "/categoria/jardineria",
    icono: "arbol",
    fondo: "verde",
  },
  {
    titulo: "Generadores",
    texto: "Energía segura donde la necesites.",
    href: "/categoria/generadores",
    icono: "rayo",
    fondo: "oscuro",
  },
];

function esIconoPromocion(
  valor: unknown
): valor is IconoPromocion {
  return (
    valor === "gotas" ||
    valor === "arbol" ||
    valor === "rayo"
  );
}

function esFondoPromocion(
  valor: unknown
): valor is FondoPromocion {
  return (
    valor === "azul" ||
    valor === "verde" ||
    valor === "oscuro" ||
    valor === "rojo" ||
    valor === "amarillo"
  );
}

function obtenerTextoPromocion(
  valor: unknown,
  predeterminado: string
) {
  return typeof valor === "string" &&
    valor.trim()
    ? valor.trim()
    : predeterminado;
}

function leerConfiguracionPromociones(
  valor: unknown
): ConfiguracionPromocionesHome {
  if (
    !valor ||
    typeof valor !== "object" ||
    Array.isArray(valor)
  ) {
    return {
      enlaceTodos: "#productos",
      tarjetas: PROMOCIONES_PREDETERMINADAS,
    };
  }

  const configuracion =
    valor as Record<string, unknown>;

  const tarjetasRecibidas =
    Array.isArray(configuracion.tarjetas)
      ? configuracion.tarjetas
      : [];

  const tarjetas =
    PROMOCIONES_PREDETERMINADAS.map(
      (predeterminada, indice) => {
        const valorTarjeta =
          tarjetasRecibidas[indice];

        if (
          !valorTarjeta ||
          typeof valorTarjeta !== "object" ||
          Array.isArray(valorTarjeta)
        ) {
          return predeterminada;
        }

        const tarjeta =
          valorTarjeta as Record<
            string,
            unknown
          >;

        return {
          titulo: obtenerTextoPromocion(
            tarjeta.titulo,
            predeterminada.titulo
          ),

          texto: obtenerTextoPromocion(
            tarjeta.texto,
            predeterminada.texto
          ),

          href: obtenerTextoPromocion(
            tarjeta.href,
            predeterminada.href
          ),

          icono: esIconoPromocion(
            tarjeta.icono
          )
            ? tarjeta.icono
            : predeterminada.icono,

          fondo: esFondoPromocion(
            tarjeta.fondo
          )
            ? tarjeta.fondo
            : predeterminada.fondo,
        };
      }
    );

  return {
    enlaceTodos: obtenerTextoPromocion(
      configuracion.enlaceTodos,
      "#productos"
    ),
    tarjetas,
  };
}

async function obtenerPromocionesHome() {
  const seccion =
    await prisma.homeSection.findFirst({
      where: {
        tipo: "PROMOCIONES",
      },
      orderBy: {
        id: "asc",
      },
    });

  return {
    seccion,
    configuracion:
      leerConfiguracionPromociones(
        seccion?.configuracion
      ),
  };
}

function obtenerIconoPromocion(
  icono: IconoPromocion
) {
  switch (icono) {
    case "arbol":
      return <Trees size={38} />;

    case "rayo":
      return <Zap size={38} />;

    default:
      return <Droplets size={38} />;
  }
}

function obtenerFondoPromocion(
  fondo: FondoPromocion
) {
  switch (fondo) {
    case "verde":
      return "bg-green-600";

    case "oscuro":
      return "bg-zinc-900";

    case "rojo":
      return "bg-red-600";

    case "amarillo":
      return "bg-yellow-500 text-black";

    default:
      return "bg-blue-600";
  }
}

async function obtenerCategoriasHome() {
  const seccion = await prisma.homeSection.findFirst({
    where: {
      tipo: "CATEGORIAS",
    },
    orderBy: {
      id: "asc",
    },
  });

  const configuracion = leerConfiguracionCategorias(
    seccion?.configuracion
  );

  if (
    configuracion.categoriaIds !== null &&
    configuracion.categoriaIds.length === 0
  ) {
    return {
      seccion,
      categorias: [],
    };
  }

  const categoriasEncontradas =
    await prisma.categoria.findMany({
      where: {
        activa: true,
        ...(configuracion.categoriaIds !== null
          ? {
              id: {
                in: configuracion.categoriaIds,
              },
            }
          : {}),
      },
      select: {
        id: true,
        nombre: true,
        slug: true,
        imagenUrl: true,
        orden: true,
      },
      orderBy: [
        {
          orden: "asc",
        },
        {
          nombre: "asc",
        },
      ],
    });

  if (configuracion.categoriaIds === null) {
    return {
      seccion,
      categorias: categoriasEncontradas,
    };
  }

  const categoriasPorId = new Map(
    categoriasEncontradas.map((categoria) => [
      categoria.id,
      categoria,
    ])
  );

  const categoriasOrdenadas =
    configuracion.categoriaIds
      .map((id) => categoriasPorId.get(id))
      .filter(
        (
          categoria
        ): categoria is (typeof categoriasEncontradas)[number] =>
          Boolean(categoria)
      );

  return {
    seccion,
    categorias: categoriasOrdenadas,
  };
}

async function obtenerBanners() {
  return prisma.banner.findMany({
    where: { activo: true },
    orderBy: [{ orden: "asc" }, { createdAt: "desc" }],
    select: {
      id: true,
      titulo: true,
      subtitulo: true,
      textoBoton: true,
      href: true,
      alt: true,
      imagenDesktopUrl: true,
      imagenMobileUrl: true,
    },
  });
}

async function obtenerProductosDestacados() {
  const seccion = await prisma.homeSection.findFirst({
    where: {
      tipo: "PRODUCTOS_DESTACADOS",
    },
    orderBy: {
      id: "asc",
    },
  });

  const configuracion = leerConfiguracionProductosDestacados(
    seccion?.configuracion
  );

  const camposProducto = {
    id: true,
    nombre: true,
    slug: true,
    descripcionCorta: true,
    precio: true,
    precioAntes: true,
    stock: true,
    categoria: {
      select: {
        nombre: true,
      },
    },
    marca: {
      select: {
        nombre: true,
      },
    },
    imagenes: {
      select: {
        url: true,
        alt: true,
      },
      orderBy: [
        {
          esPrincipal: "desc" as const,
        },
        {
          orden: "asc" as const,
        },
      ],
      take: 1,
    },
  };

  if (configuracion.productoIds.length > 0) {
    const productosEncontrados = await prisma.producto.findMany({
      where: {
        estado: "PUBLICADO",
        id: {
          in: configuracion.productoIds,
        },
      },
      select: camposProducto,
    });

    const productosPorId = new Map(
      productosEncontrados.map((producto) => [
        producto.id,
        producto,
      ])
    );

    const productosOrdenados = configuracion.productoIds
      .map((id) => productosPorId.get(id))
      .filter(
        (
          producto
        ): producto is (typeof productosEncontrados)[number] =>
          Boolean(producto)
      )
      .slice(0, configuracion.cantidad);

    return {
      seccion,
      configuracion,
      productos: productosOrdenados,
    };
  }

  const productos = await prisma.producto.findMany({
    where: {
      estado: "PUBLICADO",
      destacado: true,
    },
    select: camposProducto,
    orderBy: [
      {
        publishedAt: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
    take: configuracion.cantidad,
  });

  return {
    seccion,
    configuracion,
    productos,
  };
}
export default async function Home() {
  const [
  productosDestacados,
  bannersDb,
  categoriasHome,
  promocionesHome,
] = await Promise.all([
  obtenerProductosDestacados(),
  obtenerBanners(),
  obtenerCategoriasHome(),
  obtenerPromocionesHome(),
]);

const {
  productos,
  seccion: seccionProductos,
  configuracion: configuracionProductos,
} = productosDestacados;

const {
  seccion: seccionCategorias,
  categorias,
} = categoriasHome;

const {
  seccion: seccionPromociones,
  configuracion: configuracionPromociones,
} = promocionesHome;

  const banners = bannersDb.map((banner) => ({
    id: banner.id,
    imageDesktop: banner.imagenDesktopUrl,
    imageMobile: banner.imagenMobileUrl,
    alt: banner.alt,
    href: banner.href,
    titulo: banner.titulo,
    subtitulo: banner.subtitulo,
    textoBoton: banner.textoBoton,
  }));

  return (
    <main className="min-h-screen bg-[#f7f7f7] text-black">
      {/* Barra informativa superior */}
      <div className="bg-black text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-center text-xs font-bold md:text-sm">
          <Truck size={16} className="text-yellow-400" />
          <span>
            Envíos rápidos a todo el Perú
            <span className="mx-2 text-zinc-500">|</span>
            🇵🇪 Especial Fiestas Patrias
            <span className="mx-2 text-zinc-500">|</span>
            Hasta 30% de descuento
          </span>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-200 bg-yellow-400 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-6">
          <a href="/" className="shrink-0">
            <h1 className="text-xl font-black tracking-tight md:text-2xl">
              KAFES ONLINE
            </h1>
          </a>

          <BuscadorProductos variante="desktop" />

          <div className="flex items-center gap-2">
            <a
              href="https://wa.me/51980296583?text=Hola,%20quiero%20información%20de%20sus%20productos"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-full bg-white px-5 py-3 text-sm font-black transition hover:scale-105 lg:block"
            >
              Hablar con un asesor
            </a>

            <button
              aria-label="Ver carrito"
              className="rounded-full bg-black p-3 text-yellow-400 transition hover:scale-105"
            >
              <ShoppingCart size={22} />
            </button>
          </div>
        </div>

        {/* Buscador móvil */}
<div className="px-4 pb-4 md:hidden">
  <BuscadorProductos variante="mobile" />
</div>
      </header>

      {/* Franja industrial */}
      <div
        className="h-3 w-full"
        style={{
          background:
            "repeating-linear-gradient(-45deg, #000 0px, #000 12px, #facc15 12px, #facc15 24px)",
        }}
      />

      {/* Categorías rápidas */}
{(seccionCategorias?.activo ?? true) && (
  <section className="border-b border-zinc-200 bg-white">
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      {(seccionCategorias?.titulo ||
        seccionCategorias?.subtitulo) && (
        <div className="mb-6">
          <h2 className="text-2xl font-black text-zinc-950 md:text-3xl">
            {seccionCategorias?.titulo ||
              "Categorías principales"}
          </h2>

          {seccionCategorias?.subtitulo && (
            <p className="mt-2 text-sm text-zinc-600 md:text-base">
              {seccionCategorias.subtitulo}
            </p>
          )}
        </div>
      )}

      {categorias.length > 0 ? (
        <div className="overflow-x-auto pb-2">
          <div className="flex min-w-max justify-start gap-4 md:gap-6">
            {categorias.map((categoria) => (
              <a
                key={categoria.id}
                href={`/categoria/${categoria.slug}`}
                className="group w-24 text-center md:w-28"
              >
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 p-2 transition duration-300 group-hover:-translate-y-1 group-hover:border-yellow-400 group-hover:shadow-lg md:h-28 md:w-28">
                  {categoria.imagenUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={categoria.imagenUrl}
                      alt={categoria.nombre}
                      className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-yellow-400 text-2xl font-black text-black">
                      {categoria.nombre
                        .charAt(0)
                        .toUpperCase()}
                    </span>
                  )}
                </div>

                <p className="mt-2 line-clamp-2 text-xs font-bold md:text-sm">
                  {categoria.nombre}
                </p>
              </a>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-500">
          No hay categorías seleccionadas para mostrar.
        </div>
      )}
    </div>
  </section>
)}

      <HeroSlider banners={banners} />

      {/* Beneficios */}
      <section className="mx-auto max-w-7xl px-4 pb-10 md:px-6">
        <div className="grid overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm sm:grid-cols-2 lg:grid-cols-4">
          <Benefit
            icon={<Truck size={28} />}
            title="Envíos nacionales"
            text="Llegamos a todo el Perú."
          />

          <Benefit
            icon={<ShieldCheck size={28} />}
            title="Compra confiable"
            text="Productos con garantía."
          />

          <Benefit
            icon={<CreditCard size={28} />}
            title="Pago seguro"
            text="Compra mediante Izipay."
          />

          <Benefit
            icon={<Headphones size={28} />}
            title="Atención personalizada"
            text="Asesoría rápida por WhatsApp."
          />
        </div>
      </section>

      {/* Ofertas rápidas */}
{(seccionPromociones?.activo ?? true) && (
  <section
    id="ofertas"
    className="mx-auto max-w-7xl px-4 pb-12 md:px-6"
  >
    <div className="mb-6 flex items-end justify-between">
      <div>
        <span className="text-sm font-black uppercase tracking-widest text-red-600">
          {seccionPromociones?.subtitulo ||
            "Solo por tiempo limitado"}
        </span>

        <h2 className="mt-1 text-3xl font-black md:text-4xl">
          {seccionPromociones?.titulo ||
            "Ofertas especiales"}
        </h2>
      </div>

      <a
        href={configuracionPromociones.enlaceTodos}
        className="hidden items-center gap-1 font-bold text-zinc-700 transition hover:text-red-600 md:flex"
      >
        Ver todos
        <ChevronRight size={18} />
      </a>
    </div>

    <div className="grid gap-5 md:grid-cols-3">
      {configuracionPromociones.tarjetas.map(
        (tarjeta, indice) => (
          <PromoCard
            key={`${tarjeta.href}-${indice}`}
            icon={obtenerIconoPromocion(
              tarjeta.icono
            )}
            title={tarjeta.titulo}
            text={tarjeta.texto}
            href={tarjeta.href}
            background={obtenerFondoPromocion(
              tarjeta.fondo
            )}
          />
        )
      )}
    </div>
  </section>
)}

      {/* Productos destacados */}
{(seccionProductos?.activo ?? true) && (
  <section
    id="productos"
    className="border-y border-zinc-200 bg-white py-14"
  >
    <div className="mx-auto max-w-7xl px-4 md:px-6">
      <div className="mb-9 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-yellow-600">
            <Sparkles size={18} />
            Selección KAFES
          </span>

          <h2 className="mt-2 text-3xl font-black md:text-4xl">
            {seccionProductos?.titulo || "Productos destacados"}
          </h2>

          {seccionProductos?.subtitulo && (
            <p className="mt-3 max-w-2xl text-zinc-600">
              {seccionProductos.subtitulo}
            </p>
          )}
        </div>

        <a
          href={configuracionProductos.hrefBoton}
          className="inline-flex w-fit items-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-black text-white transition hover:bg-zinc-800"
        >
          {configuracionProductos.textoBoton}
          <ChevronRight size={18} />
        </a>
      </div>

      {productos.length > 0 ? (
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {productos.map((producto) => {
            const imagen = producto.imagenes[0];

            return (
              <ProductCard
                key={producto.id}
                href={`/producto/${producto.slug}`}
                image={
                  imagen?.url ??
                  "/categorias/herramientas.png"
                }
                alt={imagen?.alt ?? producto.nombre}
                badge={
                  producto.categoria?.nombre ??
                  producto.marca?.nombre ??
                  "DESTACADO"
                }
                title={producto.nombre}
                description={
                  producto.descripcionCorta ??
                  "Producto seleccionado por KAFES ONLINE."
                }
                price={
                  formatearPrecio(producto.precio) ??
                  "Consultar"
                }
                beforePrice={formatearPrecio(
                  producto.precioAntes
                )}
                available={producto.stock > 0}
              />
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-zinc-300 p-10 text-center text-zinc-500">
          No hay productos seleccionados para mostrar.
        </div>
      )}
    </div>
  </section>
)}

      {/* Banner secundario */}
      <section className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="grid overflow-hidden rounded-[32px] bg-black text-white shadow-xl md:grid-cols-2">
          <div className="flex flex-col justify-center px-8 py-12 md:px-14">
            <span className="flex w-fit items-center gap-2 rounded-full bg-yellow-400 px-4 py-2 text-sm font-black text-black">
              <BadgePercent size={18} />
              PRECIOS ESPECIALES
            </span>

            <h2 className="mt-6 text-4xl font-black md:text-5xl">
              Equipa tu taller con herramientas profesionales
            </h2>

            <p className="mt-5 max-w-xl text-lg text-zinc-300">
              Encuentra equipos para construcción, agricultura, mantenimiento y
              trabajos especializados.
            </p>

            <a
              href="#productos"
              className="mt-8 inline-flex w-fit items-center gap-2 rounded-2xl bg-yellow-400 px-7 py-4 text-lg font-black text-black transition hover:scale-105 hover:bg-yellow-300"
            >
              COMPRAR AHORA
              <ChevronRight size={22} />
            </a>
          </div>

          <div className="min-h-[330px] bg-zinc-900">
            <img
              src="/banner-taller-profesional.jpg"
              alt="Herramientas profesionales Kafes Online"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Pie básico */}
      <footer className="bg-black text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 md:grid-cols-3">
          <div>
            <h2 className="text-2xl font-black text-yellow-400">
              KAFES ONLINE
            </h2>

            <p className="mt-3 max-w-sm text-sm leading-relaxed text-zinc-400">
              Herramientas profesionales con envíos a todo el Perú y atención
              personalizada.
            </p>
          </div>

          <div>
            <h3 className="font-black">Categorías</h3>

            <div className="mt-4 flex flex-col gap-2 text-sm text-zinc-400">
              <a href="/categoria/sierras">Sierras</a>
              <a href="/categoria/hidrolavadoras">Hidrolavadoras</a>
              <a href="/categoria/bombas-de-agua">Bombas de agua</a>
              <a href="/categoria/generadores">Generadores</a>
            </div>
          </div>

          <div>
            <h3 className="font-black">Atención</h3>

            <p className="mt-4 text-sm text-zinc-400">
              Escríbenos por WhatsApp para recibir información sobre precios,
              stock y envíos.
            </p>

            <a
              href="https://wa.me/51980296583"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block rounded-xl bg-yellow-400 px-5 py-3 font-black text-black"
            >
              Contactar ahora
            </a>
          </div>
        </div>

        <div className="border-t border-zinc-800 py-5 text-center text-xs text-zinc-500">
          © 2026 KAFES ONLINE. Todos los derechos reservados.
        </div>
      </footer>

      <WhatsAppButton />
    </main>
  );
}
