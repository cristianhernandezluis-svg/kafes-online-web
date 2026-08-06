"use client";

import {
  BadgeCheck,
  MapPin,
  Star,
} from "lucide-react";

import type { ProductoOpinionPublica } from "./product-types";

type PreguntaFrecuente = {
  pregunta: string;
  respuesta: string;
};

type ProductSocialProofProps = {
  opiniones?: ProductoOpinionPublica[];
  preguntas?: PreguntaFrecuente[];
};

const preguntasPorDefecto: PreguntaFrecuente[] = [
  {
    pregunta: "¿Hacen envíos a provincia?",
    respuesta:
      "Sí, realizamos envíos a todo el Perú.",
  },
  {
    pregunta: "¿El pago es contra entrega?",
    respuesta:
      "En Lima contamos con pago contra entrega. Para provincias, un asesor confirmará las condiciones del envío.",
  },
  {
    pregunta: "¿Tiene garantía?",
    respuesta:
      "Sí, nuestros productos cuentan con garantía según las condiciones informadas por el asesor.",
  },
];

function formatearFecha(fecha: string) {
  const fechaConvertida = new Date(fecha);

  if (Number.isNaN(fechaConvertida.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(fechaConvertida);
}

export default function ProductSocialProof({
  opiniones = [],
  preguntas = preguntasPorDefecto,
}: ProductSocialProofProps) {
  return (
    <>
      {opiniones.length > 0 && (
  <section
    id="opiniones"
    className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 md:px-6 md:py-20"
  >
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <span className="text-sm font-black uppercase tracking-widest text-yellow-600">
              Opiniones verificadas
            </span>

            <h2 className="mt-2 text-3xl font-black md:text-4xl">
              Lo que dicen nuestros clientes
            </h2>

            <p className="mt-3 text-zinc-500">
              Experiencias de clientes que compraron este
              producto.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {opiniones.map((opinion) => (
              <Testimonial
                key={opinion.id}
                opinion={opinion}
              />
            ))}
          </div>
        </section>
      )}

      {preguntas.length > 0 && (
        <section className="mx-auto max-w-5xl px-4 py-16 md:px-6">
          <h2 className="mb-10 text-center text-3xl font-black md:text-4xl">
            Preguntas frecuentes
          </h2>

          <div className="space-y-5">
            {preguntas.map((item) => (
              <Faq
                key={item.pregunta}
                pregunta={item.pregunta}
                respuesta={item.respuesta}
              />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

function Testimonial({
  opinion,
}: {
  opinion: ProductoOpinionPublica;
}) {
  const fechaFormateada = formatearFecha(
    opinion.fecha
  );

  return (
    <article className="flex h-full flex-col rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-zinc-200 bg-yellow-400">
          {opinion.imagenUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={opinion.imagenUrl}
              alt={opinion.clienteNombre}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-xl font-black text-black">
              {opinion.clienteNombre
                .charAt(0)
                .toUpperCase()}
            </span>
          )}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-black text-zinc-950">
              {opinion.clienteNombre}
            </h3>

            {opinion.compraVerificada && (
              <BadgeCheck
                size={18}
                className="shrink-0 text-emerald-600"
              />
            )}
          </div>

          {opinion.ciudad && (
            <p className="mt-1 flex items-center gap-1 text-xs text-zinc-500">
              <MapPin size={13} />
              {opinion.ciudad}
            </p>
          )}
        </div>
      </div>

      <div
        className="mt-5 flex gap-1"
        aria-label={`${opinion.calificacion} de 5 estrellas`}
      >
        {Array.from({
          length: 5,
        }).map((_, indice) => (
          <Star
            key={indice}
            size={18}
            className={
              indice < opinion.calificacion
                ? "fill-yellow-400 text-yellow-400"
                : "text-zinc-300"
            }
          />
        ))}
      </div>

      <p className="mt-5 flex-1 leading-7 text-zinc-700">
        “{opinion.comentario}”
      </p>

      <div className="mt-5 border-t border-zinc-100 pt-4">
        {opinion.compraVerificada && (
          <p className="text-xs font-bold text-emerald-600">
            Compra verificada
          </p>
        )}

        {fechaFormateada && (
          <p className="mt-1 text-xs text-zinc-400">
            {fechaFormateada}
          </p>
        )}
      </div>
    </article>
  );
}

function Faq({
  pregunta,
  respuesta,
}: {
  pregunta: string;
  respuesta: string;
}) {
  return (
    <details className="group rounded-3xl border border-zinc-200 bg-white p-6">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-black md:text-xl">
        <span>{pregunta}</span>

        <span className="text-2xl transition group-open:rotate-45">
          +
        </span>
      </summary>

      <p className="mt-4 leading-7 text-zinc-600">
        {respuesta}
      </p>
    </details>
  );
}