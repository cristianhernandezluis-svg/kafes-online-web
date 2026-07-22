import Link from "next/link";
import {
  Eye,
  EyeOff,
  ImageIcon,
  Pencil,
  Plus,
} from "lucide-react";

import prisma from "@/lib/prisma";
import Badge from "@/components/admin/ui/Badge";
import PageHeader from "@/components/admin/ui/PageHeader";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const banners = await prisma.banner.findMany({
    orderBy: [
      {
        orden: "asc",
      },
      {
        createdAt: "desc",
      },
    ],
  });

  const activos = banners.filter((banner) => banner.activo).length;

  return (
    <section>
      <PageHeader
        eyebrow="Personalización"
        title="Página de inicio"
        description="Administra el contenido y las secciones visibles en la portada de KAFES ONLINE."
        actions={
          <Link
            href="/admin/home/banners/nuevo"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-slate-800"
          >
            <Plus size={18} />
            Nuevo banner
          </Link>
        }
      />

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">
            Banners registrados
          </p>

          <p className="mt-2 text-3xl font-black text-slate-950">
            {banners.length}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">
            Banners activos
          </p>

          <p className="mt-2 text-3xl font-black text-slate-950">
            {activos}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">
            Próxima sección
          </p>

          <p className="mt-2 text-lg font-black text-slate-950">
            Productos destacados
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5">
          <h2 className="text-lg font-black text-slate-950">
            Hero principal
          </h2>

          <p className="mt-1 text-sm leading-6 text-slate-500">
            Estos banners aparecerán en el carrusel superior de la página de
            inicio.
          </p>
        </div>

        {banners.length === 0 ? (
          <div className="flex min-h-96 flex-col items-center justify-center p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
              <ImageIcon size={30} className="text-slate-500" />
            </div>

            <h2 className="mt-5 text-xl font-black text-slate-950">
              Todavía no tienes banners
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
              Crea el primer banner para administrar el carrusel principal
              desde el panel.
            </p>

            <Link
              href="/admin/home/banners/nuevo"
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-bold text-white"
            >
              <Plus size={18} />
              Crear primer banner
            </Link>
          </div>
                ) : (
          <div className="grid gap-6 p-5 md:grid-cols-2 xl:grid-cols-3">
            {banners.map((banner) => (
              <article
                key={banner.id}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="relative aspect-[16/7] overflow-hidden bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={banner.imagenUrl}
                    alt={banner.titulo ?? "Banner de KAFES ONLINE"}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                  />

                  <div className="absolute left-3 top-3">
                    <Badge
                      variant={banner.activo ? "success" : "default"}
                    >
                      <span className="inline-flex items-center gap-1.5">
                        {banner.activo ? (
                          <Eye size={14} />
                        ) : (
                          <EyeOff size={14} />
                        )}

                        {banner.activo ? "ACTIVO" : "INACTIVO"}
                      </span>
                    </Badge>
                  </div>

                  <div className="absolute right-3 top-3 rounded-lg bg-slate-950/80 px-2.5 py-1 text-xs font-bold text-white backdrop-blur">
                    Orden {banner.orden}
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="line-clamp-1 text-lg font-black text-slate-950">
                    {banner.titulo || "Banner sin título"}
                  </h3>

                  <p className="mt-2 min-h-10 line-clamp-2 text-sm leading-5 text-slate-500">
                    {banner.subtitulo ||
                      "Este banner todavía no tiene subtítulo."}
                  </p>

                  <div className="mt-5 rounded-xl bg-slate-50 p-3">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Botón
                    </p>

                    <p className="mt-1 truncate text-sm font-bold text-slate-700">
                      {banner.botonTexto || "Sin botón configurado"}
                    </p>

                    {banner.botonLink && (
                      <p className="mt-1 truncate text-xs text-slate-400">
                        {banner.botonLink}
                      </p>
                    )}
                  </div>

                  <div className="mt-5 border-t border-slate-100 pt-4">
                    <Link
                      href={`/admin/home/banners/${banner.id}/editar`}
                      className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-bold text-white transition hover:bg-slate-800"
                    >
                      <Pencil size={16} />
                      Editar banner
                    </Link>
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