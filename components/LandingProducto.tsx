"use client";

import Image from "next/image";
import { CheckCircle } from "lucide-react";

type LandingProductoProps = {
  producto: any;
  precio: number;
  abrirCheckout: () => void;
};

export default function LandingProducto({
  producto,
  precio,
  abrirCheckout,
}: LandingProductoProps) {
  if (!producto?.aida) return null;

  return (
    <section className="bg-white py-10 md:py-16">
      <div className="mx-auto w-full max-w-[820px] px-3 sm:px-5">
        <div className="overflow-hidden rounded-3xl bg-zinc-50 shadow-sm">
          <Image
            src={producto.aida.atencion.imagen}
            alt={producto.aida.atencion.titulo}
            width={1080}
            height={1350}
            className="block h-auto w-full object-cover"
          />

          <div className="px-5 py-8 text-center sm:px-10 sm:py-10">
            <span className="inline-block rounded-full bg-yellow-400 px-4 py-2 text-xs font-black uppercase text-black">
              Potencia profesional
            </span>

            <h2 className="mt-5 text-3xl font-black leading-tight sm:text-4xl">
              {producto.aida.atencion.titulo}
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg">
              {producto.aida.atencion.texto}
            </p>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-3xl bg-black text-white shadow-lg">
          <Image
            src={producto.aida.interes.imagen}
            alt={producto.aida.interes.titulo}
            width={1080}
            height={1350}
            className="block h-auto w-full object-cover"
          />

          <div className="px-5 py-8 sm:px-10 sm:py-10">
            <span className="text-sm font-black uppercase tracking-widest text-yellow-400">
              Rendimiento POWFULL
            </span>

            <h2 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">
              {producto.aida.interes.titulo}
            </h2>

            <p className="mt-4 text-base leading-7 text-zinc-300 sm:text-lg">
              {producto.aida.interes.texto}
            </p>

            <div className="mt-7 grid grid-cols-2 gap-3">
              <FeatureBox title="1600W" text="Potencia nominal" />
              <FeatureBox title="45J" text="Energía de impacto" />
              <FeatureBox title="1900/min" text="Frecuencia de impacto" />
              <FeatureBox title="HEX30" text="Portaherramientas" />
            </div>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-3xl bg-zinc-50 shadow-sm">
          <Image
            src={producto.aida.deseo.imagen}
            alt={producto.aida.deseo.titulo}
            width={1080}
            height={1350}
            className="block h-auto w-full object-cover"
          />

          <div className="px-5 py-8 sm:px-10 sm:py-10">
            <h2 className="text-3xl font-black leading-tight sm:text-4xl">
              {producto.aida.deseo.titulo}
            </h2>

            <p className="mt-4 text-base leading-7 text-zinc-600 sm:text-lg">
              {producto.aida.deseo.texto}
            </p>

            {producto.accesorios && (
              <div className="mt-7 space-y-3">
                {producto.accesorios.map((item: string) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-sm"
                  >
                    <CheckCircle
                      size={22}
                      className="mt-0.5 shrink-0 text-green-500"
                    />
                    <span className="font-bold">{item}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {producto.fichaTecnica && (
          <div className="mt-8 overflow-hidden rounded-3xl bg-zinc-100 p-5 sm:p-8">
            <h2 className="text-center text-3xl font-black">
              Ficha técnica
            </h2>

            <div className="mt-7 overflow-hidden rounded-2xl border border-zinc-200 bg-white">
              {producto.fichaTecnica.map(
                (
                  dato: { nombre: string; valor: string },
                  index: number
                ) => (
                  <div
                    key={dato.nombre}
                    className={`grid grid-cols-2 gap-3 px-4 py-4 ${
                      index !== producto.fichaTecnica.length - 1
                        ? "border-b border-zinc-200"
                        : ""
                    }`}
                  >
                    <span className="font-bold text-zinc-600">
                      {dato.nombre}
                    </span>

                    <span className="text-right font-black">
                      {dato.valor}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        <div className="mt-8 overflow-hidden rounded-3xl bg-gradient-to-b from-yellow-400 to-yellow-300 shadow-xl">
          <Image
            src={producto.aida.accion.imagen}
            alt={producto.aida.accion.titulo}
            width={1080}
            height={1350}
            className="block h-auto w-full object-cover"
          />

          <div className="px-5 py-9 text-center sm:px-10 sm:py-12">
            <span className="text-sm font-black uppercase tracking-widest">
              Oferta por tiempo limitado
            </span>

            <h2 className="mt-3 text-3xl font-black leading-tight sm:text-5xl">
              {producto.aida.accion.titulo}
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-base font-semibold leading-7 text-black/70 sm:text-lg">
              {producto.aida.accion.texto}
            </p>

            <div className="mt-7 flex items-end justify-center gap-3">
              <span className="text-5xl font-black text-black">
                S/{precio}
              </span>

              <span className="pb-1 text-xl text-black/50 line-through">
                S/{producto.precioAntes}
              </span>
            </div>

            <button
              type="button"
              onClick={abrirCheckout}
              className="mt-7 w-full rounded-2xl bg-green-600 px-6 py-5 text-xl font-black text-white shadow-xl transition hover:bg-green-500 active:scale-[0.98]"
            >
              🛒 COMPRAR AHORA
            </button>

            <div className="mt-6 grid gap-2 text-sm font-bold sm:grid-cols-3">
              <div className="rounded-xl bg-white/65 px-3 py-3">
                🚚 Envíos al Perú
              </div>

              <div className="rounded-xl bg-white/65 px-3 py-3">
                🛡️ Compra segura
              </div>

              <div className="rounded-xl bg-white/65 px-3 py-3">
                📱 Confirmación WhatsApp
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureBox({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl bg-white/10 p-4 text-center">
      <p className="text-xl font-black text-yellow-400">{title}</p>
      <p className="mt-1 text-xs font-semibold text-zinc-300">{text}</p>
    </div>
  );
}