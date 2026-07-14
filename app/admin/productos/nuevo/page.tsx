import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import Card from "@/components/admin/ui/Card";
import Input from "@/components/admin/ui/Input";
import Textarea from "@/components/admin/ui/Textarea";
import PageHeader from "@/components/admin/ui/PageHeader";
import { crearProducto } from "../actions";

export default function NuevoProductoPage() {
  return (
    <form action={crearProducto}>
      <PageHeader
        eyebrow="Catálogo"
        title="Nuevo producto"
        description="Completa la información principal. Después agregaremos imágenes, beneficios, ficha técnica y secciones de landing."
        actions={
          <>
            <Link
              href="/admin/productos"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            >
              <ArrowLeft size={18} />
              Cancelar
            </Link>

            <button
              type="submit"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              <Save size={18} />
              Guardar producto
            </button>
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <Card
            title="Información general"
            description="La información principal que verá el cliente."
          >
            <div className="space-y-5">
              <Input
                label="Nombre del producto"
                name="nombre"
                placeholder='Ejemplo: Sierra inalámbrica BOMVINK 8"'
                required
              />

              <Input
                label="Slug"
                name="slug"
                placeholder="Se generará automáticamente desde el nombre"
                description="Puedes dejarlo vacío. El sistema evitará URLs duplicadas."
              />

              <Textarea
                label="Descripción corta"
                name="descripcionCorta"
                placeholder="Resumen comercial breve del producto."
                maxLength={300}
              />

              <Textarea
                label="Descripción completa"
                name="descripcion"
                placeholder="Describe el producto, sus usos y características principales."
                className="min-h-52"
              />
            </div>
          </Card>

          <Card
            title="Precios e inventario"
            description="Define el precio de venta y la disponibilidad."
          >
            <div className="grid gap-5 md:grid-cols-2">
              <Input
                label="Precio"
                name="precio"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="249.00"
                required
              />

              <Input
                label="Precio anterior"
                name="precioAntes"
                type="number"
                min="0"
                step="0.01"
                placeholder="299.00"
                description="Se mostrará tachado cuando sea mayor al precio actual."
              />

              <Input
                label="Stock"
                name="stock"
                type="number"
                min="0"
                step="1"
                defaultValue="0"
              />

              <Input
                label="SKU"
                name="sku"
                placeholder="Ejemplo: BOMVINK-S8"
                description="Código interno opcional y único."
              />
            </div>
          </Card>

          <Card
            title="SEO"
            description="Información usada por Google y al compartir el producto."
          >
            <div className="space-y-5">
              <Input
                label="Título SEO"
                name="seoTitulo"
                placeholder="Si lo dejas vacío se utilizará el nombre."
                maxLength={70}
              />

              <Textarea
                label="Descripción SEO"
                name="seoDescripcion"
                placeholder="Descripción que puede aparecer en resultados de búsqueda."
                maxLength={170}
              />
            </div>
          </Card>

          <Card
            title="Imágenes y landing"
            description="Estos módulos se habilitarán después de crear el producto."
          >
            <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-10 text-center">
              <p className="font-bold text-slate-800">
                Primero guarda la información principal
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Después podrás subir imágenes, ordenar la galería y construir
                las secciones de la landing.
              </p>
            </div>
          </Card>
        </div>

        <aside className="space-y-6">
          <Card title="Estado">
            <div className="space-y-5">
              <div>
                <label
                  htmlFor="estado"
                  className="mb-2 block text-sm font-bold text-slate-800"
                >
                  Estado del producto
                </label>

                <select
                  id="estado"
                  name="estado"
                  defaultValue="BORRADOR"
                  className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-slate-500 focus:ring-4 focus:ring-slate-100"
                >
                  <option value="BORRADOR">Borrador</option>
                  <option value="PUBLICADO">Publicado</option>
                  <option value="OCULTO">Oculto</option>
                  <option value="AGOTADO">Agotado</option>
                </select>
              </div>

              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4">
                <input
                  type="checkbox"
                  name="destacado"
                  className="mt-1 h-4 w-4 rounded border-slate-300"
                />

                <span>
                  <span className="block text-sm font-bold text-slate-800">
                    Producto destacado
                  </span>

                  <span className="mt-1 block text-xs leading-5 text-slate-500">
                    Permite mostrarlo en secciones principales de la tienda.
                  </span>
                </span>
              </label>
            </div>
          </Card>

          <Card title="Publicación">
            <p className="text-sm leading-6 text-slate-600">
              Puedes guardarlo como borrador mientras completas las imágenes y
              la landing. Un producto publicado podrá aparecer en la tienda
              cuando conectemos la página pública a PostgreSQL.
            </p>

            <button
              type="submit"
              className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              <Save size={18} />
              Guardar producto
            </button>
          </Card>
        </aside>
      </div>
    </form>
  );
}