"use client";

import Image from "next/image";
import { useState } from "react";
import { CheckCircle, ShoppingCart, X, User, Phone, MapPin, Home } from "lucide-react";

export default function ProductoPage() {
  const [openCheckout, setOpenCheckout] = useState(false);
  const [cantidad, setCantidad] = useState(1);

  const precio = 249;
  const total = precio * cantidad;

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="max-w-7xl mx-auto py-10 px-6 grid md:grid-cols-2 gap-12">
        <div>
          <div className="bg-zinc-100 rounded-3xl p-8">
            <Image
              src="/sierra-bomvink-8.jpg"
              alt="Sierra BOMVINK"
              width={700}
              height={700}
              className="rounded-2xl object-contain"
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
            Sierra inalámbrica profesional ideal para poda, madera, trabajos de campo y uso continuo.
          </p>

          <div className="mt-10">
            <h2 className="text-3xl font-black mb-6">Características</h2>

            <div className="space-y-4 text-lg">
              {[
                "21V de potencia",
                "Incluye 2 baterías 4.0Ah",
                "Espada de 8 pulgadas",
                "Corte rápido y preciso",
                "Ideal para poda y madera",
              ].map((item) => (
                <div key={item} className="flex gap-3 items-center">
                  <CheckCircle className="text-green-500" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setOpenCheckout(true)}
            className="mt-10 bg-yellow-400 hover:bg-yellow-300 transition text-black w-full py-5 rounded-2xl text-2xl font-black flex items-center justify-center gap-3"
          >
            <ShoppingCart />
            Comprar ahora
          </button>
        </div>
      </div>

      {openCheckout && (
        <div
          onClick={() => setOpenCheckout(false)}
         className="fixed inset-0 bg-black/70 z-[999] flex items-start justify-center p-4 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white text-black w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative my-6"
          >
            <button
              onClick={() => setOpenCheckout(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-black"
            >
              <X />
            </button>

            <div className="p-5 border-b">
              <h2 className="font-black text-xl">PAGO CONTRA ENTREGA</h2>
            </div>

            <div className="p-5 flex gap-3 border-b">
              <Image
                src="/sierra-bomvink-8.jpg"
                alt="Sierra BOMVINK"
                width={80}
                height={80}
                className="rounded-xl object-contain bg-zinc-100"
              />

              <div className="flex-1">
                <h3 className="font-black text-sm">
                  Sierra Inalámbrica BOMVINK 8"
                </h3>
                <p className="text-sm text-zinc-500">Envío a todo el Perú</p>
                <p className="font-black mt-1">S/249</p>
              </div>
            </div>

            <div className="p-5 bg-zinc-100 border-b space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <strong>S/{total}</strong>
              </div>

              <div className="flex justify-between">
                <span>Envío</span>
                <strong>Gratis</strong>
              </div>

              <div className="flex justify-between text-lg">
                <span>Total</span>
                <strong>S/{total}</strong>
              </div>
            </div>

            <form className="p-5 space-y-3">
              <h3 className="font-black text-center mb-3">
                Ingresa tus datos de envío
              </h3>

              <Input icon={<User size={18} />} placeholder="Nombre completo" />
              <Input icon={<Phone size={18} />} placeholder="Celular" />
              <Input icon={<MapPin size={18} />} placeholder="Ciudad o distrito" />
              <Input icon={<Home size={18} />} placeholder="Dirección exacta" />
              <Input icon={<MapPin size={18} />} placeholder="Referencia" />

              <div>
                <label className="font-bold text-sm">Cantidad</label>
                <div className="flex mt-2">
                  <button
                    type="button"
                    onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                    className="bg-yellow-400 px-5 py-3 font-black"
                  >
                    -
                  </button>

                  <div className="flex-1 border-y flex items-center justify-center font-black">
                    {cantidad}
                  </div>

                  <button
                    type="button"
                    onClick={() => setCantidad(cantidad + 1)}
                    className="bg-yellow-400 px-5 py-3 font-black"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                type="button"
                className="w-full bg-black text-yellow-400 py-4 rounded-xl font-black text-lg"
              >
                Finalizar pedido
              </button>

              <p className="text-xs text-center text-zinc-500">
                Al finalizar, nuestro equipo confirmará tu pedido por WhatsApp.
              </p>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

function Input({ icon, placeholder }: any) {
  return (
    <div className="flex border rounded-xl overflow-hidden">
      <div className="bg-zinc-100 px-4 flex items-center text-zinc-500">
        {icon}
      </div>
      <input
        required
        placeholder={placeholder}
        className="w-full px-4 py-3 outline-none"
      />
    </div>
  );
}