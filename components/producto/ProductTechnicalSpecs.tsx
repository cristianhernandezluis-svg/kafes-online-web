import type { ProductoEspecificacion } from "./product-types";

type ProductTechnicalSpecsProps = {
  especificaciones: ProductoEspecificacion[];
};

export default function ProductTechnicalSpecs({
  especificaciones,
}: ProductTechnicalSpecsProps) {
  if (!especificaciones || especificaciones.length === 0) {
    return null;
  }

  const especificacionesOrdenadas = [...especificaciones].sort(
    (a, b) => a.orden - b.orden,
  );

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 md:py-16">
      <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
        <div className="border-b border-zinc-200 bg-zinc-950 px-5 py-6 text-white sm:px-8">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-yellow-400">
            Información del producto
          </p>

          <h2 className="mt-2 text-2xl font-black sm:text-3xl">
            Especificaciones técnicas
          </h2>
        </div>

        <dl>
          {especificacionesOrdenadas.map(
            (especificacion, index) => (
              <div
                key={especificacion.id}
                className={[
                  "grid gap-2 px-5 py-4 sm:grid-cols-[minmax(180px,0.8fr)_1.2fr] sm:gap-6 sm:px-8",
                  index % 2 === 0
                    ? "bg-white"
                    : "bg-zinc-50",
                ].join(" ")}
              >
                <dt className="font-black text-zinc-900">
                  {especificacion.nombre}
                </dt>

                <dd className="break-words text-zinc-600">
                  {especificacion.valor}
                </dd>
              </div>
            ),
          )}
        </dl>
      </div>
    </section>
  );
}