import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import prisma from "@/lib/prisma";
import BannerForm from "@/components/admin/home/BannerForm";
import PageHeader from "@/components/admin/ui/PageHeader";
import { actualizarBanner } from "../../actions";

type Props = { params: Promise<{ id: string }> };

export const dynamic = "force-dynamic";

export default async function EditarBannerPage({ params }: Props) {
  const { id } = await params;
  const bannerId = Number(id);
  if (!Number.isInteger(bannerId)) notFound();

  const banner = await prisma.banner.findUnique({ where: { id: bannerId } });
  if (!banner) notFound();

  return (
    <section>
      <PageHeader
        eyebrow="Página de inicio / Hero"
        title="Editar banner"
        description="Actualiza la imagen, enlace, contenido y orden del banner."
        actions={
          <Link
            href="/admin/home"
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
          >
            <ArrowLeft size={17} /> Volver
          </Link>
        }
      />

      <BannerForm
        action={actualizarBanner}
        submitLabel="Guardar cambios"
        initialData={banner}
      />
    </section>
  );
}
