"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type WhatsAppButtonProps = {
  whatsapp: string;
  mensaje: string;
  nombreTienda?: string;
};

export default function WhatsAppButton({
  whatsapp,
  mensaje,
  nombreTienda = "KAFES ONLINE",
}: WhatsAppButtonProps) {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 20000);

    return () => clearTimeout(timer);
  }, []);

  const abrirWhatsApp = () => {
  const url = `https://wa.me/${whatsapp}?text=${encodeURIComponent(
    mensaje
  )}`;

  setOpen(false);
  window.open(url, "_blank");
};

  if (!visible) return null;

  return (
    <>
      <div className="fixed bottom-24 right-5 z-[998]">
        <button
          onClick={() => setOpen(!open)}
          className="w-16 h-16 rounded-full shadow-[0_10px_30px_rgba(37,211,102,0.45)] flex items-center justify-center transition-all hover:scale-110 overflow-hidden animate-[pulse_2s_ease-in-out_infinite]"
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
        <div className="fixed bottom-44 right-5 z-[999] w-[360px] max-w-[90vw] rounded-[28px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.25)] bg-white">
          <div className="bg-[#0B7A68] text-white px-6 py-5 flex justify-between items-center">
            <div>
              <h3 className="font-black text-lg">
                ¿En qué podemos ayudarte?
              </h3>
              <p className="text-xs font-semibold">
  Estamos listos para ayudarte
</p>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="text-white font-black text-2xl"
            >
              ×
            </button>
          </div>

          <div className="p-4">
  <button
    onClick={abrirWhatsApp}
    className="w-full text-left bg-white hover:bg-gray-50 border border-gray-200 rounded-2xl p-4 transition-all"
  >
    <div className="flex items-center gap-4">
      <Image
        src="/whatsapp-logo.png"
        alt="WhatsApp"
        width={70}
        height={70}
        className="w-[70px] h-[70px] rounded-full object-cover"
      />

      <div className="flex-1">
        <p className="font-black text-xl text-gray-900">
          {nombreTienda}
        </p>

        <p className="text-sm text-gray-600">
          Atención de ventas
        </p>

        <div className="mt-3 bg-[#25D366] text-white text-center py-3 rounded-full font-bold">
          Hablar por WhatsApp
        </div>
      </div>
    </div>
  </button>
</div>
        </div>
      )}
    </>
  );
}