import Link from "next/link";
import { Eye, EyeOff, ImageIcon, Pencil, Plus, Trash2 } from "lucide-react";
import prisma from "@/lib/prisma";
import PageHeader from "@/components/admin/ui/PageHeader";
import { cambiarEstadoBanner, eliminarBanner } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const banners = await prisma.banner.findMany({
    orderBy: [{ orden: "asc" }, { createdAt: "desc" }],
  });

  return (
    <section>
      <PageHeader
        eyebrow="Página de inicio"
        title="Banners principales"
        description={`${banners.length} banner${banners.length === 1 ? "" : "s"} registrado${banners.length === 1 ? "" : "s"}.`}
        actions={
          <Link
            href="/admin/home/nuevo"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-slate-800"
          >
            <Plus size={18} />
            Nuevo banner
          </Link>
        }
      />

      {banners.length === 0 ? (
        <div className="flex min-h-96 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
            <ImageIcon size={30} />
          </div>
          <h2 className="mt-5 text-xl font-black text-slate-950">Aún no tienes banners</h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
            Crea el primer banner para reemplazar el carrusel fijo de la portada.
          </p>
          <Link
            href="/admin/home/nuevo"
            className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-bold text-white"
          >
            <Plus size={18} /> Crear banner
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
                    <h2 className="mt-1 text-lg font-black text-slate-950">
                      {banner.titulo || banner.alt}
                    </h2>
                    <p className="mt-1 break-all text-xs text-slate-500">{banner.href}</p>
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
                    <Pencil size={16} /> Editar
                  </Link>

                  <form action={cambiarEstadoBanner}>
                    <input type="hidden" name="bannerId" value={banner.id} />
                    <input type="hidden" name="activo" value={String(!banner.activo)} />
                    <button
                      type="submit"
                      className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-300 px-4 text-sm font-bold text-slate-700 hover:bg-slate-50"
                    >
                      {banner.activo ? <EyeOff size={16} /> : <Eye size={16} />}
                      {banner.activo ? "Ocultar" : "Activar"}
                    </button>
                  </form>

                  <form action={eliminarBanner} className="ml-auto">
                    <input type="hidden" name="bannerId" value={banner.id} />
                    <button
                      type="submit"
                      className="inline-flex h-10 items-center gap-2 rounded-xl bg-red-50 px-4 text-sm font-bold text-red-700 hover:bg-red-100"
                    >
                      <Trash2 size={16} /> Eliminar
                    </button>
                  </form>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
