import Link from "next/link";
import BannerForm from "@/components/admin/home/BannerForm";
import { ArrowLeft } from "lucide-react";
import PageHeader from "@/components/admin/ui/PageHeader";
import { crearBanner } from "../../actions";

export default function NuevoBannerPage() {
  return (
    <section>
      <PageHeader
        eyebrow="Página de inicio / Hero"
        title="Nuevo banner"
        description="Crea un banner para el carrusel principal de la tienda."
        actions={
          <Link
            href="/admin/home"
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
          >
            <ArrowLeft size={17} />
            Volver
          </Link>
        }
      />

      <BannerForm action={crearBanner} submitLabel="Crear banner" />
    </section>
  );
}
