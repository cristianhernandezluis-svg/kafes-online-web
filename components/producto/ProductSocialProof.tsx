"use client";

type Testimonio = {
  nombre: string;
  texto: string;
};

type PreguntaFrecuente = {
  pregunta: string;
  respuesta: string;
};

type ProductSocialProofProps = {
  testimonios?: Testimonio[];
  preguntas?: PreguntaFrecuente[];
};

const testimoniosPorDefecto: Testimonio[] = [
  {
    nombre: "Carlos M.",
    texto: "Me llegó rápido y funciona muy bien.",
  },
  {
    nombre: "Luis R.",
    texto: "Buena potencia y excelente atención.",
  },
  {
    nombre: "Miguel A.",
    texto: "Producto recomendado, buena calidad.",
  },
];

const preguntasPorDefecto: PreguntaFrecuente[] = [
  {
    pregunta: "¿Hacen envíos a provincia?",
    respuesta: "Sí, enviamos a todo el Perú.",
  },
  {
    pregunta: "¿El pago es contra entrega?",
    respuesta:
      "Sí, un asesor confirmará tu pedido por WhatsApp.",
  },
  {
    pregunta: "¿Tiene garantía?",
    respuesta:
      "Sí, todos nuestros productos cuentan con garantía.",
  },
];

export default function ProductSocialProof({
  testimonios = testimoniosPorDefecto,
  preguntas = preguntasPorDefecto,
}: ProductSocialProofProps) {
  return (
    <>
      {testimonios.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-20">
          <h2 className="mb-10 text-center text-4xl font-black">
            Clientes felices
          </h2>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonios.map((testimonio) => (
              <Testimonial
                key={`${testimonio.nombre}-${testimonio.texto}`}
                nombre={testimonio.nombre}
                texto={testimonio.texto}
              />
            ))}
          </div>
        </section>
      )}

      {preguntas.length > 0 && (
        <section className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="mb-10 text-center text-4xl font-black">
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
  nombre,
  texto,
}: {
  nombre: string;
  texto: string;
}) {
  return (
    <article className="rounded-3xl border bg-white p-6 text-center shadow-sm">
      <div
        className="mb-3 text-xl text-yellow-400"
        aria-label="5 estrellas"
      >
        ★★★★★
      </div>

      <p className="text-zinc-700">
        “{texto}”
      </p>

      <h3 className="mt-4 font-black">
        {nombre}
      </h3>
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
    <details className="group rounded-3xl border p-6">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-xl font-black">
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