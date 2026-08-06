import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Star,
} from "lucide-react";

import prisma from "@/lib/prisma";
import Card from "@/components/admin/ui/Card";
import Input from "@/components/admin/ui/Input";
import Textarea from "@/components/admin/ui/Textarea";
import PageHeader from "@/components/admin/ui/PageHeader";
import SingleImageUploader from "@/components/admin/media/SingleImageUploader";

import { crearOpinion } from "../actions";

export const dynamic = "force-dynamic";

export default async function NuevaOpinionPage() {
  const productos =
    await prisma.producto.findMany({
      select: {
        id: true,
        nombre: true,
        estado: true,
        categoria: {
          select: {
            nombre: true,
          },
        },
        marca: {
          select: {
            nombre: true,
          },
        },
      },
      orderBy: {
        nombre: "asc",
      },
    });

  const fechaActual = new Date()
    .toISOString()
    .slice(0, 10);

  return (
    <section>
      <PageHeader
        eyebrow="Catálogo / Opiniones"
        title="Nueva opinión"
        description="Registra el testimonio real de un cliente y relaciónalo con un producto."
        actions={
          <Link
            href="/admin/opiniones"
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
          >
            <ArrowLeft size={17} />
            Opiniones
          </Link>
        }
      />

      <form action={crearOpinion}>
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <Card
              title="Producto"
              description="Selecciona el producto sobre el cual opinó el cliente."
            >
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-800">
                  Producto relacionado
                </span>

                <select
                  name="productoId"
                  required
                  defaultValue=""
                  className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none transition focus:border-slate-500 focus:ring-4 focus:ring-slate-100"
                >
                  <option value="" disabled>
                    Selecciona un producto
                  </option>

                  {productos.map((producto) => {
                    const detalles = [
                      producto.marca?.nombre,
                      producto.categoria?.nombre,
                    ]
                      .filter(Boolean)
                      .join(" · ");

                    return (
                      <option
                        key={producto.id}
                        value={producto.id}
                      >
                        {producto.nombre}
                        {detalles
                          ? ` — ${detalles}`
                          : ""}
                        {producto.estado !== "PUBLICADO"
                          ? " — BORRADOR"
                          : ""}
                      </option>
                    );
                  })}
                </select>

                {productos.length === 0 && (
                  <p className="mt-2 text-sm font-semibold text-red-600">
                    Primero debes registrar un producto.
                  </p>
                )}
              </label>
            </Card>

            <Card
              title="Datos del cliente"
              description="Información que aparecerá junto al testimonio."
            >
              <div className="grid gap-5 md:grid-cols-2">
                <Input
                  label="Nombre del cliente"
                  name="clienteNombre"
                  placeholder="Ejemplo: Carlos Ramírez"
                  required
                />

                <Input
                  label="Ciudad"
                  name="ciudad"
                  placeholder="Ejemplo: Arequipa"
                />
              </div>
            </Card>

            <Card
              title="Testimonio"
              description="Escribe el comentario tal como lo expresó el cliente."
            >
              <div className="space-y-5">
                <Textarea
                  label="Comentario"
                  name="comentario"
                  placeholder="La herramienta llegó bien embalada y funciona correctamente..."
                  required
                />

                <div className="grid gap-5 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-bold text-slate-800">
                      Calificación
                    </span>

                    <select
                      name="calificacion"
                      defaultValue="5"
                      className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none transition focus:border-slate-500 focus:ring-4 focus:ring-slate-100"
                    >
                      <option value="5">
                        5 estrellas
                      </option>
                      <option value="4">
                        4 estrellas
                      </option>
                      <option value="3">
                        3 estrellas
                      </option>
                      <option value="2">
                        2 estrellas
                      </option>
                      <option value="1">
                        1 estrella
                      </option>
                    </select>

                    <div className="mt-3 flex gap-1 text-yellow-400">
                      {Array.from({
                        length: 5,
                      }).map((_, indice) => (
                        <Star
                          key={indice}
                          size={18}
                          className="fill-current"
                        />
                      ))}
                    </div>
                  </label>

                  <Input
                    label="Fecha de la opinión"
                    name="fecha"
                    type="date"
                    defaultValue={fechaActual}
                    required
                  />
                </div>
              </div>
            </Card>

            <Card
              title="Foto del cliente"
              description="Es opcional. Puede ser una foto del cliente usando o recibiendo el producto."
            >
              <SingleImageUploader
                nameUrl="imagenUrl"
                namePublicId="imagenPublicId"
                altText="Foto de la opinión"
                signaturePayload={{
                  tipo: "opinion",
                }}
              />
            </Card>
          </div>

          <aside className="space-y-6">
            <Card
              title="Configuración"
              description="Controla la publicación y el orden."
            >
              <div className="space-y-4">
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
                    name="compraVerificada"
                    defaultChecked
                    className="mt-1 h-4 w-4 rounded border-slate-300"
                  />

                  <span>
                    <span className="block text-sm font-black text-slate-900">
                      Compra verificada
                    </span>

                    <span className="mt-1 block text-xs leading-5 text-slate-500">
                      Mostrará una insignia de compra
                      verificada.
                    </span>
                  </span>
                </label>

                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-slate-400">
                  <input
                    type="checkbox"
                    name="visible"
                    defaultChecked
                    className="mt-1 h-4 w-4 rounded border-slate-300"
                  />

                  <span>
                    <span className="block text-sm font-black text-slate-900">
                      Opinión visible
                    </span>

                    <span className="mt-1 block text-xs leading-5 text-slate-500">
                      Aparecerá en la página pública del
                      producto.
                    </span>
                  </span>
                </label>
              </div>
            </Card>

            <Card title="Guardar opinión">
              <button
                type="submit"
                disabled={productos.length === 0}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Save size={18} />
                Crear opinión
              </button>
            </Card>
          </aside>
        </div>
      </form>
    </section>
  );
}