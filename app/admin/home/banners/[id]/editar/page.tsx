import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

import prisma from "@/lib/prisma";
import BannerForm from "@/components/admin/home/BannerForm";
import PageHeader from "@/components/admin/ui/PageHeader";
import { actualizarBanner } from "../../../actions";

type EditarBannerPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function EditarBannerPage({
  params,
}: EditarBannerPageProps) {
  const { id } = await params;
  const bannerId = Number(id);

  if (!Number.isInteger(bannerId) || bannerId <= 0) {
    notFound();
  }

  const banner = await prisma.banner.findUnique({
    where: {
      id: bannerId,
    },
  });

  if (!banner) {
    notFound();
  }

  return (
    <section>
      <PageHeader
        eyebrow="Página de inicio / Hero"
        title="Editar banner"
        description="Modifica las imágenes, textos, enlace y posición del banner."
        actions={
          <Link
            href="/admin/home#banners"
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
          >
            <ArrowLeft size={17} />
            Volver a banners
          </Link>
        }
      />

      <BannerForm
        action={actualizarBanner}
        submitLabel="Guardar cambios"
        initialData={{
          id: banner.id,
          titulo: banner.titulo,
          subtitulo: banner.subtitulo,
          textoBoton: banner.textoBoton,
          href: banner.href,
          alt: banner.alt,
          imagenDesktopUrl: banner.imagenDesktopUrl,
          imagenDesktopPublicId:
            banner.imagenDesktopPublicId,
          imagenMobileUrl: banner.imagenMobileUrl,
          imagenMobilePublicId:
            banner.imagenMobilePublicId,
          activo: banner.activo,
          orden: banner.orden,
        }}
      />
    </section>
  );
}