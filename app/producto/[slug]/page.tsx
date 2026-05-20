import Image from "next/image";
import { CheckCircle, ShoppingCart } from "lucide-react";

export default function ProductoPage() {
  return (
    <main className="min-h-screen bg-white text-black">

      <div className="max-w-7xl mx-auto py-10 px-6 grid md:grid-cols-2 gap-12">

        <div>
          <div className="bg-zinc-100 rounded-3xl p-8">
            <Image
              src="/sierra-bomvink.jpg"
              alt="Sierra BOMVINK"
              width={700}
              height={700}
              className="rounded-2xl object-cover"
            />
          </div>

          <div className="grid grid-cols-4 gap-4 mt-4">
            <Image
              src="/sierra-bomvink.jpg"
              alt=""
              width={150}
              height={150}
              className="rounded-xl border"
            />

            <Image
              src="/sierra-bomvink.jpg"
              alt=""
              width={150}
              height={150}
              className="rounded-xl border"
            />

            <Image
              src="/sierra-bomvink.jpg"
              alt=""
              width={150}
              height={150}
              className="rounded-xl border"
            />

            <Image
              src="/sierra-bomvink.jpg"
              alt=""
              width={150}
              height={150}
              className="rounded-xl border"
            />
          </div>
        </div>

        <div>

          <span className="bg-yellow-400 text-black px-4 py-2 rounded-full font-bold">
            NUEVO INGRESO
          </span>

          <h1 className="text-5xl font-black mt-6">
            Sierra Inalámbrica BOMVINK 8"
          </h1>

          <p className="text-5xl font-black text-yellow-500 mt-6">
            S/249
          </p>

          <p className="text-zinc-600 mt-6 text-lg">
            Sierra inalámbrica profesional ideal para poda,
            madera, trabajos de campo y uso continuo.
          </p>

          <div className="mt-10">
            <h2 className="text-3xl font-black mb-6">
              Características
            </h2>

            <div className="space-y-4 text-lg">

              <div className="flex gap-3 items-center">
                <CheckCircle className="text-green-500" />
                21V de potencia
              </div>

              <div className="flex gap-3 items-center">
                <CheckCircle className="text-green-500" />
                Incluye 2 baterías 4.0Ah
              </div>

              <div className="flex gap-3 items-center">
                <CheckCircle className="text-green-500" />
                Espada de 8 pulgadas
              </div>

              <div className="flex gap-3 items-center">
                <CheckCircle className="text-green-500" />
                Corte rápido y preciso
              </div>

              <div className="flex gap-3 items-center">
                <CheckCircle className="text-green-500" />
                Ideal para poda y madera
              </div>

            </div>
          </div>

          <button className="mt-10 bg-yellow-400 hover:bg-yellow-300 transition text-black w-full py-5 rounded-2xl text-2xl font-black flex items-center justify-center gap-3">
            <ShoppingCart />
            Comprar con Izipay
          </button>

          <a
            href="https://wa.me/51980296583"
            target="_blank"
            className="block mt-4 bg-green-500 hover:bg-green-400 transition text-white text-center py-5 rounded-2xl text-2xl font-black"
          >
            Comprar por WhatsApp
          </a>

        </div>

      </div>

      <section className="max-w-7xl mx-auto px-6 pb-20">

        <h2 className="text-4xl font-black mb-8">
          Descripción
        </h2>

        <div className="bg-zinc-100 p-8 rounded-3xl text-lg leading-9 text-zinc-700">

          <p>
            La Sierra Inalámbrica BOMVINK 8” está diseñada
            para trabajos profesionales y domésticos.
          </p>

          <br />

          <p>
            Cuenta con motor potente de alto rendimiento,
            batería de larga duración y diseño ergonómico.
          </p>

          <br />

          <p>
            Perfecta para poda, corte de madera, trabajos
            agrícolas y uso continuo.
          </p>

        </div>

      </section>

    </main>
  );
}