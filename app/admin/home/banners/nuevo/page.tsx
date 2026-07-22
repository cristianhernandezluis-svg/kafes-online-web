import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import SingleImageUploader from "@/components/admin/media/SingleImageUploader";
import Card from "@/components/admin/ui/Card";
import Input from "@/components/admin/ui/Input";
import Textarea from "@/components/admin/ui/Textarea";
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

      <form action={crearBanner}>
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <Card
              title="Contenido del banner"
              description="Texto que aparecerá sobre la imagen."
            >
              <div className="space-y-5">
                <Input
                  label="Título"
                  name="titulo"
                  placeholder="Ejemplo: Herramientas para el campo"
                />

                <Textarea
                  label="Subtítulo"
                  name="subtitulo"
                  placeholder="Describe brevemente la promoción."
                />

                <div className="grid gap-5 md:grid-cols-2">
                  <Input
                    label="Texto del botón"
                    name="botonTexto"
                    placeholder="Comprar ahora"
                  />

                  <Input
                    label="Enlace del botón"
                    name="botonLink"
                    placeholder="/productos"
                  />
                </div>
              </div>
            </Card>

            <Card
  title="Imagen del banner"
  description="Sube la imagen que aparecerá en el carrusel principal."
>
  <SingleImageUploader
    nameUrl="imagenUrl"
    namePublicId="publicId"
    altText="Banner de inicio"
    signaturePayload={{
  tipo: "banner",
}}
  />
</Card>
          </div>

          <aside className="space-y-6">
            <Card title="Configuración">
              <div className="space-y-5">
                <Input
                  label="Orden"
                  name="orden"
                  type="number"
                  min="0"
                  step="1"
                  defaultValue="0"
                />

                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4">
                  <input
                    type="checkbox"
                    name="activo"
                    defaultChecked
                    className="mt-1 h-4 w-4 rounded border-slate-300"
                  />

                  <span>
                    <span className="block text-sm font-bold text-slate-800">
                      Banner activo
                    </span>

                    <span className="mt-1 block text-xs leading-5 text-slate-500">
                      Se mostrará en la portada de la tienda.
                    </span>
                  </span>
                </label>
              </div>
            </Card>

            <Card title="Guardar banner">
              <button
                type="submit"
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-slate-800"
              >
                <Save size={18} />
                Crear banner
              </button>
            </Card>
          </aside>
        </div>
      </form>
    </section>
  );
}