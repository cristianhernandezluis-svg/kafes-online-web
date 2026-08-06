import {
  Check,
  PackageOpen,
  Plus,
} from "lucide-react";

import type {
  ProductoAccesorioPublico,
} from "@/components/producto/product-types";

type ProductAccessoriesProps = {
  accesorios: ProductoAccesorioPublico[];
};

type AccessoryGroupProps = {
  titulo: string;
  descripcion: string;
  accesorios: ProductoAccesorioPublico[];
  tipo: "incluido" | "opcional";
};

function AccessoryGroup({
  titulo,
  descripcion,
  accesorios,
  tipo,
}: AccessoryGroupProps) {
  if (accesorios.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="mb-5">
        <h3 className="text-xl font-black text-zinc-950">
          {titulo}
        </h3>

        <p className="mt-1 text-sm leading-6 text-zinc-500">
          {descripcion}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {accesorios.map((accesorio) => (
          <article
            key={accesorio.id}
            className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex aspect-[4/3] items-center justify-center bg-zinc-50">
              {accesorio.imagenUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={accesorio.imagenUrl}
                  alt={accesorio.nombre}
                  className="h-full w-full object-contain p-4"
                  loading="lazy"
                />
              ) : (
                <PackageOpen
                  size={42}
                  className="text-zinc-300"
                />
              )}
            </div>

            <div className="p-4">
              <div className="mb-3 flex items-start justify-between gap-3">
                <h4 className="font-black leading-6 text-zinc-950">
                  {accesorio.nombre}
                </h4>

                <span
                  className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-black ${
                    tipo === "incluido"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {tipo === "incluido" ? (
                    <Check
                      size={12}
                      strokeWidth={3}
                    />
                  ) : (
                    <Plus
                      size={12}
                      strokeWidth={3}
                    />
                  )}

                  {tipo === "incluido"
                    ? "INCLUIDO"
                    : "OPCIONAL"}
                </span>
              </div>

              {accesorio.descripcion && (
                <p className="text-sm leading-6 text-zinc-500">
                  {accesorio.descripcion}
                </p>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default function ProductAccessories({
  accesorios,
}: ProductAccessoriesProps) {
  if (accesorios.length === 0) {
    return null;
  }

  const incluidos = accesorios.filter(
    (accesorio) => accesorio.incluido,
  );

  const opcionales = accesorios.filter(
    (accesorio) => !accesorio.incluido,
  );

  return (
    <section className="border-b border-zinc-200 bg-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="mb-9 max-w-2xl">
          <span className="inline-flex rounded-full bg-yellow-300 px-4 py-2 text-xs font-black uppercase tracking-wide text-black">
            Contenido del producto
          </span>

          <h2 className="mt-4 text-3xl font-black tracking-tight text-zinc-950 sm:text-4xl">
            Todo lo que recibirás
          </h2>

          <p className="mt-3 text-base leading-7 text-zinc-600">
            Revisa los accesorios incluidos con tu
            compra y los elementos opcionales
            disponibles.
          </p>
        </div>

        <div className="space-y-12">
          <AccessoryGroup
            titulo="¿Qué incluye tu compra?"
            descripcion="Estos accesorios se entregan junto con el producto."
            accesorios={incluidos}
            tipo="incluido"
          />

          <AccessoryGroup
            titulo="Accesorios opcionales"
            descripcion="Estos elementos pueden adquirirse de manera adicional."
            accesorios={opcionales}
            tipo="opcional"
          />
        </div>
      </div>
    </section>
  );
}