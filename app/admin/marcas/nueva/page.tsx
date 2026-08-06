import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

import Card from "@/components/admin/ui/Card";
import Input from "@/components/admin/ui/Input";
import Textarea from "@/components/admin/ui/Textarea";
import PageHeader from "@/components/admin/ui/PageHeader";

import { crearMarca } from "../actions";

export default function NuevaMarcaPage() {
  return (
    <section>
      <PageHeader
        eyebrow="Catálogo / Marcas"
        title="Nueva marca"
        description="Crea una marca para organizar y clasificar los productos de la tienda."
        actions={
          <Link
            href="/admin/marcas"
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
          >
            <ArrowLeft size={17} />
            Volver
          </Link>
        }
      />

      <form action={crearMarca}>
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <Card
              title="Información de la marca"
              description="Completa los datos que identificarán la marca."
            >
              <div className="space-y-5">
                <Input
                  label="Nombre"
                  name="nombre"
                  placeholder="Ejemplo: BOMVINK"
                  required
                />

                <Input
                  label="Slug"
                  name="slug"
                  placeholder="bomvink"
                  description="Puedes dejarlo vacío y se generará automáticamente."
                />

                <Textarea
                  label="Descripción"
                  name="descripcion"
                  placeholder="Herramientas inalámbricas profesionales para trabajos de corte y mantenimiento."
                />
              </div>
            </Card>

            <Card
              title="Logo de la marca"
              description="Coloca la dirección pública del logo."
            >
              <div className="space-y-4">
                <Input
                  label="URL del logo"
                  name="logoUrl"
                  type="url"
                  placeholder="https://res.cloudinary.com/..."
                  description="Pega una URL pública de Cloudinary o déjala vacía."
                />

                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm leading-6 text-slate-500">
                  Se recomienda usar un logo cuadrado o rectangular,
                  con fondo blanco o transparente.
                </div>
              </div>
            </Card>
          </div>

          <aside className="space-y-6">
            <Card
              title="Configuración"
              description="Controla la visibilidad de la marca."
            >
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-slate-400">
                <input
                  type="checkbox"
                  name="activa"
                  defaultChecked
                  className="mt-1 h-4 w-4 rounded border-slate-300"
                />

                <span>
                  <span className="block text-sm font-black text-slate-900">
                    Marca activa
                  </span>

                  <span className="mt-1 block text-xs leading-5 text-slate-500">
                    La marca estará disponible para seleccionarla
                    en los productos.
                  </span>
                </span>
              </label>
            </Card>

            <Card title="Guardar marca">
              <button
                type="submit"
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-slate-800"
              >
                <Save size={18} />
                Crear marca
              </button>
            </Card>
          </aside>
        </div>
      </form>
    </section>
  );
}