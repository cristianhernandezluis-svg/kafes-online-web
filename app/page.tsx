"use client";

import { useState } from "react";
import { ShoppingCart, Search, Truck, ShieldCheck, Headphones, X } from "lucide-react";

export default function Home() {
  const [openProduct, setOpenProduct] = useState(false);

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="bg-yellow-400 text-black p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-3xl font-black">KAFES ONLINE</h1>

          <div className="hidden md:flex items-center gap-2 bg-white rounded-full px-4 py-2 w-[400px]">
            <Search className="text-black" size={20} />
            <input placeholder="Buscar productos..." className="outline-none text-black w-full" />
          </div>

          <button className="bg-black text-yellow-400 p-3 rounded-full">
            <ShoppingCart />
          </button>
        </div>
      </header>

      <section className="max-w-7xl mx-auto py-20 px-6 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <span className="bg-yellow-400 text-black px-4 py-2 rounded-full font-bold">
            NUEVO INGRESO
          </span>

          <h2 className="text-6xl font-black mt-6 leading-tight">
            Herramientas Profesionales
          </h2>

          <p className="text-zinc-300 mt-6 text-lg">
            Compra herramientas de calidad con envío a todo el Perú y pago seguro mediante Izipay.
          </p>

          <button className="mt-8 bg-yellow-400 text-black px-8 py-4 rounded-2xl font-black text-xl">
            VER CATÁLOGO
          </button>
        </div>

        <div className="bg-zinc-900 rounded-[40px] p-10 border border-zinc-800">
          <img src="/logo-kafes.jpg" alt="Kafes Online" className="rounded-3xl w-full" />
        </div>
      </section>

      <section className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6 px-6 pb-20">
        <Benefit icon={<Truck />} title="Envíos a todo el Perú" text="Despachamos rápido y seguro." />
        <Benefit icon={<ShieldCheck />} title="Pago Seguro" text="Integración preparada para Izipay." />
        <Benefit icon={<Headphones />} title="Atención Personalizada" text="Soporte rápido por WhatsApp." />
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-24">
        <h2 className="text-4xl font-black mb-10">Productos Destacados</h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div
            onClick={() => setOpenProduct(true)}
            className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden cursor-pointer hover:-translate-y-2 transition"
          >
            <div className="bg-white p-6">
              <img src="/sierra-bomvink-8.jpg" alt="Sierra BOMVINK" className="w-full h-72 object-contain" />
            </div>

            <div className="p-6">
              <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-black">
                MÁS VENDIDO
              </span>

              <h3 className="text-2xl font-black mt-4">
                Sierra Inalámbrica BOMVINK 8"
              </h3>

              <p className="text-zinc-400 mt-3">
                Incluye 2 baterías de 21V. Ideal para poda y corte de madera.
              </p>

              <p className="text-yellow-400 text-4xl font-black mt-6">
                S/249
              </p>

              <button className="mt-5 w-full bg-yellow-400 text-black py-4 rounded-2xl font-black">
                Ver detalles
              </button>
            </div>
          </div>
        </div>
      </section>

      {openProduct && (
  <div 
    onClick={() => setOpenProduct(false)}
    className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-6"
  >
          <div
  onClick={(e) => e.stopPropagation()}
  className="bg-white text-black max-w-5xl w-full rounded-3xl overflow-hidden relative grid md:grid-cols-2"
>
            <button
              onClick={() => setOpenProduct(false)}
              className="absolute top-4 right-4 bg-black text-white p-2 rounded-full"
            >
              <X />
            </button>

            <div className="p-8 bg-zinc-100 flex items-center">
              <img src="/sierra-bomvink-8.jpg" alt="Sierra BOMVINK" className="w-full object-contain" />
            </div>

            <div className="p-8">
              <span className="bg-yellow-400 px-3 py-1 rounded-full text-sm font-black">
                NUEVO INGRESO
              </span>

              <h2 className="text-4xl font-black mt-4">
                Sierra Inalámbrica BOMVINK 8"
              </h2>

              <p className="text-yellow-500 text-5xl font-black mt-4">
                S/249
              </p>

              <p className="text-zinc-600 mt-4">
                Sierra inalámbrica ideal para poda, corte de madera, trabajos de campo y uso profesional.
              </p>

              <h3 className="text-2xl font-black mt-8 mb-4">
                Características
              </h3>

              <ul className="space-y-3 text-zinc-700">
                <li>✅ Marca: BOMVINK</li>
                <li>✅ Medida: 8 pulgadas</li>
                <li>✅ Voltaje: 21V</li>
                <li>✅ Incluye 2 baterías</li>
                <li>✅ Motor potente para corte rápido</li>
                <li>✅ Diseño inalámbrico y fácil de usar</li>
                <li>✅ Ideal para poda, madera y trabajos rápidos</li>
                <li>✅ Incluye espada, cadena, protector y cargador</li>
              </ul>

              <button className="mt-8 w-full bg-yellow-400 text-black py-4 rounded-2xl font-black text-xl">
                Comprar con Izipay
              </button>

              <a
                href="https://wa.me/51980296583?text=Hola,%20quiero%20la%20Sierra%20BOMVINK%208%20pulgadas"
                target="_blank"
                className="block text-center mt-4 w-full bg-green-500 text-white py-4 rounded-2xl font-black text-xl"
              >
                Consultar por WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function Benefit({ icon, title, text }: any) {
  return (
    <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800">
      <div className="text-yellow-400">{icon}</div>
      <h3 className="text-2xl font-black mt-4">{title}</h3>
      <p className="text-zinc-400 mt-2">{text}</p>
    </div>
  );
}