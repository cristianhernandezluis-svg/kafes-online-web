import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import prisma from "@/lib/prisma";
import Card from "@/components/admin/ui/Card";
import PageHeader from "@/components/admin/ui/PageHeader";
import ProductImageManager from "@/components/admin/media/ProductImageManager";

type EditarProductoPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function EditarProductoPage({
  params,
}: EditarProductoPageProps) {
  const { id } = await params;
  const productoId = Number(id);

  if (!Number.isInteger(productoId)) {
    notFound();
  }

  const producto = await prisma.producto.findUnique({
    where: {
      id: productoId,
    },
  });

  if (!producto) {
    notFound();
  }

  return (
    <section>
      <PageHeader
        eyebrow="Catálogo / Productos"
        title={producto.nombre}
        description="Administra la información y las imágenes del producto."
        actions={
          <>
            <Link
              href="/admin/productos"
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-sm font-bold"
            >
              <ArrowLeft size={17} />
              Productos
            </Link>

            {producto.estado === "PUBLICADO" && (
              <Link
                href={`/producto/${producto.slug}`}
                target="_blank"
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-bold text-white"
              >
                <ExternalLink size={17} />
                Ver producto
              </Link>
            )}
          </>
        }
      />

      <div className="mb-6 flex gap-2 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-2">
        <span className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white">
          Imágenes
        </span>

        <span className="px-5 py-3 text-sm font-semibold text-slate-400">
          Información
        </span>

        <span className="px-5 py-3 text-sm font-semibold text-slate-400">
          Beneficios
        </span>

        <span className="px-5 py-3 text-sm font-semibold text-slate-400">
          Ficha técnica
        </span>

        <span className="px-5 py-3 text-sm font-semibold text-slate-400">
          Landing
        </span>
      </div>

      <Card
        title="Imágenes del producto"
        description="Sube varias imágenes, elige la principal y controla el orden de la galería."
      >
        <ProductImageManager
          productoId={producto.id}
          productoNombre={producto.nombre}
        />
      </Card>
    </section>
  );
}