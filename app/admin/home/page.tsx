import Link from "next/link";
import {
  Eye,
  EyeOff,
  GripVertical,
  ImageIcon,
  LayoutDashboard,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

import prisma from "@/lib/prisma";
import PageHeader from "@/components/admin/ui/PageHeader";

import {
  cambiarEstadoBanner,
  cambiarEstadoSeccion,
  eliminarBanner,
} from "./actions";

export const dynamic = "force-dynamic";

const SECCIONES_INICIALES = [
  {
    tipo: "HERO",
    nombre: "Banner principal",
    titulo: "Banner principal",
    subtitulo: "Carrusel principal de la tienda",
    orden: 1,
    activo: true,
  },
  {
    tipo: "CATEGORIAS",
    nombre: "Categorías",
    titulo: "Categorías principales",
    subtitulo: "Accesos rápidos a las categorías de productos",
    orden: 2,
    activo: true,
  },
  {
    tipo: "BENEFICIOS",
    nombre: "Beneficios",
    titulo: "Beneficios de comprar en KAFES",
    subtitulo: "Envíos, garantía, pago seguro y atención personalizada",
    orden: 3,
    activo: true,
  },
  {
    tipo: "PROMOCIONES",
    nombre: "Promociones",
    titulo: "Ofertas especiales",
    subtitulo: "Tarjetas promocionales de productos y categorías",
    orden: 4,
    activo: true,
  },
  {
    tipo: "PRODUCTOS_DESTACADOS",
    nombre: "Productos destacados",
    titulo: "Productos destacados",
    subtitulo: "Productos publicados y marcados como destacados",
    orden: 5,
    activo: true,
  },
  {
    tipo: "BANNER_INFERIOR",
    nombre: "Banner inferior",
    titulo: "Equipa tu taller con herramientas profesionales",
    subtitulo:
      "Encuentra equipos para construcción, agricultura, mantenimiento y trabajos especializados.",
    orden: 6,
    activo: true,
    configuracion: {
      textoBoton: "COMPRAR AHORA",
      urlBoton: "#productos",
      imagen: "/banner-taller-profesional.jpg",
    },
  },
];

async function inicializarSeccionesHome() {
  const seccionesExistentes = await prisma.homeSection.findMany({
    select: {
      tipo: true,
    },
  });

  const tiposExistentes = new Set(
    seccionesExistentes.map((seccion) => seccion.tipo),
  );

  const seccionesFaltantes = SECCIONES_INICIALES.filter(
    (seccion) => !tiposExistentes.has(seccion.tipo),
  );

  if (seccionesFaltantes.length === 0) {
    return;
  }

  await prisma.homeSection.createMany({
    data: seccionesFaltantes,
  });
}

function obtenerRutaEdicion(tipo: string) {
  switch (tipo) {
    case "HERO":
      return "#banners";

    case "PRODUCTOS_DESTACADOS":
      return "/admin/home/productos-destacados";

    default:
      return null;
  }
}

export default async function AdminHomePage() {
  await inicializarSeccionesHome();

  const [secciones, banners] = await Promise.all([
    prisma.homeSection.findMany({
      orderBy: [{ orden: "asc" }, { createdAt: "asc" }],
    }),

    prisma.banner.findMany({
      orderBy: [{ orden: "asc" }, { createdAt: "desc" }],
    }),
  ]);

  const seccionesActivas = secciones.filter(
    (seccion) => seccion.activo,
  ).length;

  return (
    <section className="space-y-10">
      <PageHeader
        eyebrow="Página de inicio"
        title="Constructor de la portada"
        description={`${seccionesActivas} de ${secciones.length} secciones visibles en la tienda.`}
        actions={
          <Link
            href="/"
            target="_blank"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
          >
            <Eye size={18} />
            Ver portada
          </Link>
        }
      />

      {/* Constructor del Home */}
      <div>
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-400 text-black">
            <LayoutDashboard size={22} />
          </div>

          <div>
            <h2 className="text-xl font-black text-slate-950">
              Secciones de la página principal
            </h2>

            <p className="text-sm text-slate-500">
              Controla qué bloques aparecen en la portada de KAFES ONLINE.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {secciones.map((seccion) => {
            const rutaEdicion = obtenerRutaEdicion(seccion.tipo);

            return (
              <article
                key={seccion.id}
                className={`flex flex-col gap-4 rounded-2xl border bg-white p-5 shadow-sm transition md:flex-row md:items-center ${
                  seccion.activo
                    ? "border-slate-200"
                    : "border-dashed border-slate-300 opacity-70"
                }`}
              >
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    aria-label="Cambiar orden"
                    title="El orden por arrastre se habilitará en la siguiente etapa"
                    className="cursor-not-allowed text-slate-300"
                  >
                    <GripVertical size={24} />
                  </button>

                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                      seccion.activo
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    <span className="text-sm font-black">
                      {seccion.orden}
                    </span>
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-black text-slate-950">
                        {seccion.nombre}
                      </h3>

                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-black tracking-wide ${
                          seccion.activo
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {seccion.activo ? "VISIBLE" : "OCULTO"}
                      </span>
                    </div>

                    <p className="mt-1 text-sm text-slate-500">
                      {seccion.subtitulo ??
                        "Sección de la página principal"}
                    </p>

                    <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-300">
                      {seccion.tipo}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 md:ml-auto">
                  {rutaEdicion ? (
                    <Link
                      href={rutaEdicion}
                      className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-300 px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                    >
                      <Pencil size={16} />
                      Editar
                    </Link>
                  ) : (
                    <button
                      type="button"
                      disabled
                      title="El editor se habilitará en las siguientes etapas"
                      className="inline-flex h-10 cursor-not-allowed items-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-bold text-slate-400"
                    >
                      <Pencil size={16} />
                      Próximamente
                    </button>
                  )}

                  <form action={cambiarEstadoSeccion}>
                    <input
                      type="hidden"
                      name="seccionId"
                      value={seccion.id}
                    />

                    <input
                      type="hidden"
                      name="activo"
                      value={String(!seccion.activo)}
                    />

                    <button
                      type="submit"
                      className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-300 px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                    >
                      {seccion.activo ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}

                      {seccion.activo ? "Ocultar" : "Mostrar"}
                    </button>
                  </form>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Administrador del banner principal */}
      <div
        id="banners"
        className="scroll-mt-24 border-t border-slate-200 pt-10"
      >
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-yellow-600">
              Banner principal
            </p>

            <h2 className="mt-1 text-2xl font-black text-slate-950">
              Banners del carrusel
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {banners.length} banner
              {banners.length === 1 ? "" : "s"} registrado
              {banners.length === 1 ? "" : "s"}.
            </p>
          </div>

          <Link
            href="/admin/home/nuevo"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-slate-800"
          >
            <Plus size={18} />
            Nuevo banner
          </Link>
        </div>

        {banners.length === 0 ? (
          <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
              <ImageIcon size={30} />
            </div>

            <h2 className="mt-5 text-xl font-black text-slate-950">
              Aún no tienes banners
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
              Agrega el primer banner para mostrar el carrusel principal
              de la tienda.
            </p>

            <Link
              href="/admin/home/nuevo"
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-bold text-white"
            >
              <Plus size={18} />
              Crear banner
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {banners.map((banner) => (
              <article
                key={banner.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={banner.imagenDesktopUrl}
                  alt={banner.alt}
                  className="aspect-[16/5] w-full object-cover"
                />

                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                        Orden {banner.orden}
                      </p>

                      <h3 className="mt-1 text-lg font-black text-slate-950">
                        {banner.titulo || banner.alt}
                      </h3>

                      <p className="mt-1 break-all text-xs text-slate-500">
                        {banner.href}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-black ${
                        banner.activo
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {banner.activo ? "ACTIVO" : "OCULTO"}
                    </span>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <Link
                      href={`/admin/home/${banner.id}/editar`}
                      className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-300 px-4 text-sm font-bold text-slate-700 hover:bg-slate-50"
                    >
                      <Pencil size={16} />
                      Editar
                    </Link>

                    <form action={cambiarEstadoBanner}>
                      <input
                        type="hidden"
                        name="bannerId"
                        value={banner.id}
                      />

                      <input
                        type="hidden"
                        name="activo"
                        value={String(!banner.activo)}
                      />

                      <button
                        type="submit"
                        className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-300 px-4 text-sm font-bold text-slate-700 hover:bg-slate-50"
                      >
                        {banner.activo ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}

                        {banner.activo ? "Ocultar" : "Activar"}
                      </button>
                    </form>

                    <form
                      action={eliminarBanner}
                      className="ml-auto"
                    >
                      <input
                        type="hidden"
                        name="bannerId"
                        value={banner.id}
                      />

                      <button
                        type="submit"
                        className="inline-flex h-10 items-center gap-2 rounded-xl bg-red-50 px-4 text-sm font-bold text-red-700 hover:bg-red-100"
                      >
                        <Trash2 size={16} />
                        Eliminar
                      </button>
                    </form>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}