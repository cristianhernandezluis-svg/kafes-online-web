"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function WhatsAppButton() {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);

  const producto = "Sierra Inalámbrica BOMVINK 8";

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 20000);

    return () => clearTimeout(timer);
  }, []);

  const abrirWhatsApp = (nombre: string, numero: string) => {
    const mensaje = `Hola ${nombre}, quiero hacer mi pedido de la ${producto}. Vengo de la página web.`;
    const url = `https://wa.me/51${numero}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");
  };

  if (!visible) return null;

  return (
    <>
      <div className="fixed bottom-24 right-5 z-[998]">
        <button
          onClick={() => setOpen(true)}
          className="
            w-16 h-16 rounded-full
            shadow-[0_10px_30px_rgba(37,211,102,0.45)]
            flex items-center justify-center
            transition-all hover:scale-110
            overflow-hidden animate-[pulse_2s_ease-in-out_infinite]
          "
        >
          <Image
            src="/whatsapp-logo.png"
            alt="WhatsApp"
            width={64}
            height={64}
            className="w-full h-full object-cover"
          />
        </button>
      </div>

      {open && (
        <div className="fixed bottom-44 right-5 z-[999] w-[320px] max-w-[90vw] rounded-2xl overflow-hidden shadow-2xl border border-yellow-400 bg-neutral-950 text-white">
          <div className="bg-yellow-400 text-black px-4 py-3 flex justify-between items-center">
            <div>
              <h3 className="font-black text-lg">¿En qué podemos ayudarte?</h3>
              <p className="text-xs font-semibold">Elige un asesor disponible</p>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="text-black font-black text-xl"
            >
              ×
            </button>
          </div>

          <div className="p-4 space-y-3">
            <button
              onClick={() => abrirWhatsApp("Kathi", "945360973")}
              className="w-full text-left bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 rounded-xl p-4 transition-all"
            >
              <p className="font-black text-yellow-400">Kathi</p>
              <p className="text-sm text-neutral-300">Representante de ventas</p>
              <p className="mt-2 text-sm font-bold text-green-400">
                Hablar por WhatsApp
              </p>
            </button>

            <button
              onClick={() => abrirWhatsApp("Cristian", "980296583")}
              className="w-full text-left bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 rounded-xl p-4 transition-all"
            >
              <p className="font-black text-yellow-400">Cristian</p>
              <p className="text-sm text-neutral-300">Asesor comercial</p>
              <p className="mt-2 text-sm font-bold text-green-400">
                Hablar por WhatsApp
              </p>
            </button>
          </div>
        </div>
      )}
    </>
  );
}