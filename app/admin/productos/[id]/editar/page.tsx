import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ExternalLink,
  Save,
} from "lucide-react";

import prisma from "@/lib/prisma";
import Card from "@/components/admin/ui/Card";
import Input from "@/components/admin/ui/Input";
import Textarea from "@/components/admin/ui/Textarea";
import PageHeader from "@/components/admin/ui/PageHeader";
import ProductImageManager from "@/components/admin/media/ProductImageManager";
import ContenidoEditor from "@/components/admin/editor/ContenidoEditor";
import { actualizarProducto } from "../../actions";

type EditarProductoPageProps = {
  params: Promise<{
    id: string;
  }>;

  searchParams: Promise<{
    tab?: string;
    guardado?: string;
  }>;
};

export const dynamic = "force-dynamic";

const tabs = [
  {
    nombre: "Información",
    valor: "informacion",
  },
  {
    nombre: "Imágenes",
    valor: "imagenes",
  },
  {
    nombre: "Contenido",
    valor: "contenido",
  },
];

export default async function EditarProductoPage({
  params,
  searchParams,
}: EditarProductoPageProps) {
  const { id } = await params;
  const query = await searchParams;

  const productoId = Number(id);

  if (!Number.isInteger(productoId) || productoId <= 0) {
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

  const tabActiva = tabs.some(
    (tab) => tab.valor === query.tab,
  )
    ? query.tab!
    : "informacion";

  return (
    <section>
      <PageHeader
        eyebrow="Catálogo / Productos"
        title={producto.nombre}
        description="Administra toda la información comercial y multimedia del producto."
        actions={
          <>
            <Link
              href="/admin/productos"
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
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

      <nav className="mb-6 flex gap-2 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
        {tabs.map((tab) => (
          <Link
            key={tab.valor}
            href={`/admin/productos/${producto.id}/editar?tab=${tab.valor}`}
            className={[
              "whitespace-nowrap rounded-xl px-5 py-3 text-sm font-bold transition",
              tabActiva === tab.valor
                ? "bg-slate-950 text-white"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-950",
            ].join(" ")}
          >
            {tab.nombre}
          </Link>
        ))}
      </nav>

      {query.guardado === "1" && (
        <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-bold text-emerald-800">
          Producto actualizado correctamente.
        </div>
      )}

      {tabActiva === "informacion" && (
        <form action={actualizarProducto}>
          <input
            type="hidden"
            name="productoId"
            value={producto.id}
          />

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-6">
              <Card
                title="Información general"
                description="Datos principales que verá el cliente."
              >
                <div className="space-y-5">
                  <Input
                    label="Nombre del producto"
                    name="nombre"
                    defaultValue={producto.nombre}
                    required
                  />

                  <Input
                    label="Slug"
                    name="slug"
                    defaultValue={producto.slug}
                    description={`URL actual: /producto/${producto.slug}`}
                    required
                  />

                  <Textarea
                    label="Descripción corta"
                    name="descripcionCorta"
                    defaultValue={
                      producto.descripcionCorta ?? ""
                    }
                    maxLength={300}
                  />

                  <Textarea
                    label="Descripción completa"
                    name="descripcion"
                    defaultValue={producto.descripcion ?? ""}
                    className="min-h-52"
                  />
                </div>
              </Card>

              <Card
                title="Precios e inventario"
                description="Precio, stock y código interno."
              >
                <div className="grid gap-5 md:grid-cols-2">
                  <Input
                    label="Precio"
                    name="precio"
                    type="number"
                    min="0.01"
                    step="0.01"
                    defaultValue={Number(producto.precio)}
                    required
                  />

                  <Input
                    label="Precio anterior"
                    name="precioAntes"
                    type="number"
                    min="0"
                    step="0.01"
                    defaultValue={
                      producto.precioAntes
                        ? Number(producto.precioAntes)
                        : ""
                    }
                  />

                  <Input
                    label="Stock"
                    name="stock"
                    type="number"
                    min="0"
                    step="1"
                    defaultValue={producto.stock}
                  />

                  <Input
                    label="SKU"
                    name="sku"
                    defaultValue={producto.sku ?? ""}
                    placeholder="Ejemplo: BOMVINK-S8"
                  />
                </div>
              </Card>

              <Card
                title="SEO"
                description="Información para Google y redes sociales."
              >
                <div className="space-y-5">
                  <Input
                    label="Título SEO"
                    name="seoTitulo"
                    defaultValue={producto.seoTitulo ?? ""}
                    maxLength={70}
                  />

                  <Textarea
                    label="Descripción SEO"
                    name="seoDescripcion"
                    defaultValue={
                      producto.seoDescripcion ?? ""
                    }
                    maxLength={170}
                  />
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
                      defaultValue={producto.estado}
                      className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 outline-none focus:border-slate-500 focus:ring-4 focus:ring-slate-100"
                    >
                      <option value="BORRADOR">
                        Borrador
                      </option>

                      <option value="PUBLICADO">
                        Publicado
                      </option>

                      <option value="OCULTO">
                        Oculto
                      </option>

                      <option value="AGOTADO">
                        Agotado
                      </option>

                      <option value="ARCHIVADO">
                        Archivado
                      </option>
                    </select>
                  </div>

                  <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4">
                    <input
                      type="checkbox"
                      name="destacado"
                      defaultChecked={producto.destacado}
                      className="mt-1 h-4 w-4 rounded border-slate-300"
                    />

                    <span>
                      <span className="block text-sm font-bold text-slate-800">
                        Producto destacado
                      </span>

                      <span className="mt-1 block text-xs leading-5 text-slate-500">
                        Puede mostrarse en las secciones
                        principales de la tienda.
                      </span>
                    </span>
                  </label>
                </div>
              </Card>

              <Card title="Guardar cambios">
                <p className="text-sm leading-6 text-slate-600">
                  Los cambios se reflejarán en PostgreSQL y
                  posteriormente en la landing pública.
                </p>

                <button
                  type="submit"
                  className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-slate-800"
                >
                  <Save size={18} />
                  Guardar cambios
                </button>
              </Card>
            </aside>
          </div>
        </form>
      )}

      {tabActiva === "imagenes" && (
        <Card
          title="Imágenes del producto"
          description="Sube imágenes, arrástralas para ordenar y selecciona la portada."
        >
          <ProductImageManager
            productoId={producto.id}
            productoNombre={producto.nombre}
          />
        </Card>
      )}

      {tabActiva === "contenido" && (
  <form action={actualizarProducto}>
    <input
      type="hidden"
      name="productoId"
      value={producto.id}
    />

    <input
      type="hidden"
      name="nombre"
      value={producto.nombre}
    />

    <input
      type="hidden"
      name="slug"
      value={producto.slug}
    />

    <input
      type="hidden"
      name="precio"
      value={Number(producto.precio)}
    />

    <input
      type="hidden"
      name="precioAntes"
      value={
        producto.precioAntes
          ? Number(producto.precioAntes)
          : ""
      }
    />

    <input
      type="hidden"
      name="stock"
      value={producto.stock}
    />

    <input
      type="hidden"
      name="sku"
      value={producto.sku ?? ""}
    />

    <input
      type="hidden"
      name="estado"
      value={producto.estado}
    />

    <Card
      title="Contenido promocional"
      description="Este contenido aparecerá debajo del botón Comprar."
    >
      <ContenidoEditor
        name="contenidoHtml"
        initialContent={producto.contenidoHtml ?? ""}
      />

      <button
        type="submit"
        className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-bold text-white"
      >
        <Save size={18} />
        Guardar contenido
      </button>
    </Card>
  </form>
)}
    </section>
  );
}