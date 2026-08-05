import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

import Card from "@/components/admin/ui/Card";
import Input from "@/components/admin/ui/Input";
import Textarea from "@/components/admin/ui/Textarea";
import PageHeader from "@/components/admin/ui/PageHeader";

import { crearCategoria } from "../actions";

export default function NuevaCategoriaPage() {
  return (
    <section>
      <PageHeader
        eyebrow="Catálogo / Categorías"
        title="Nueva categoría"
        description="Crea una categoría para organizar productos y mostrarla en la portada."
        actions={
          <Link
            href="/admin/categorias"
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
          >
            <ArrowLeft size={17} />
            Volver
          </Link>
        }
      />

      <form action={crearCategoria}>
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <Card
              title="Información de la categoría"
              description="Completa los datos principales que verá el cliente."
            >
              <div className="space-y-5">
                <Input
                  label="Nombre"
                  name="nombre"
                  placeholder="Ejemplo: Sierras"
                  required
                />

                <Input
                  label="Slug"
                  name="slug"
                  placeholder="sierras"
                  description="Puedes dejarlo vacío y se generará automáticamente."
                />

                <Textarea
                  label="Descripción"
                  name="descripcion"
                  placeholder="Herramientas para poda, corte de madera y trabajos agrícolas."
                />
              </div>
            </Card>

            <Card
              title="Imagen"
              description="Coloca la dirección pública de la imagen que representará esta categoría."
            >
              <div className="space-y-4">
                <Input
                  label="URL de la imagen"
                  name="imagenUrl"
                  type="url"
                  placeholder="https://res.cloudinary.com/..."
                  description="Por ahora pega una URL pública de Cloudinary. Luego agregaremos la carga directa desde tu computadora."
                />

                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm leading-6 text-slate-500">
                  Se recomienda una imagen cuadrada, con fondo blanco o transparente y el producto centrado.
                </div>
              </div>
            </Card>
          </div>

          <aside className="space-y-6">
            <Card
              title="Configuración"
              description="Controla el orden y la visibilidad."
            >
              <div className="space-y-5">
                <Input
                  label="Orden"
                  name="orden"
                  type="number"
                  min="0"
                  step="1"
                  defaultValue="0"
                  description="Los números menores aparecen primero."
                />

                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-slate-400">
                  <input
                    type="checkbox"
                    name="activa"
                    defaultChecked
                    className="mt-1 h-4 w-4 rounded border-slate-300"
                  />

                  <span>
                    <span className="block text-sm font-black text-slate-900">
                      Categoría activa
                    </span>

                    <span className="mt-1 block text-xs leading-5 text-slate-500">
                      La categoría estará disponible para seleccionarla en la portada.
                    </span>
                  </span>
                </label>
              </div>
            </Card>

            <Card title="Guardar categoría">
              <button
                type="submit"
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-slate-800"
              >
                <Save size={18} />
                Crear categoría
              </button>
            </Card>
          </aside>
        </div>
      </form>
    </section>
  );
}