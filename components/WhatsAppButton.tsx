"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import type {
  AsesorWhatsAppPublico,
} from "@/lib/configuracion-tienda";

type WhatsAppButtonProps = {
  whatsapp: string;
  mensaje: string;
  nombreTienda?: string;
  asesores?: AsesorWhatsAppPublico[];
};

export default function WhatsAppButton({
  whatsapp,
  mensaje,
  nombreTienda = "KAFES ONLINE",
  asesores = [],
}: WhatsAppButtonProps) {
  const [visible, setVisible] =
    useState(false);

  const [open, setOpen] =
    useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 20000);

    return () => clearTimeout(timer);
  }, []);

  function abrirWhatsApp(
    numero: string
  ) {
    const url =
      `https://wa.me/${numero}?text=${encodeURIComponent(
        mensaje
      )}`;

    setOpen(false);

    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );
  }

  if (!visible) {
    return null;
  }

  const hayAsesores =
    asesores.length > 0;

  return (
    <>
      <div className="fixed bottom-24 right-5 z-[998]">
        <button
          type="button"
          aria-label="Contactar por WhatsApp"
          onClick={() =>
            setOpen((actual) => !actual)
          }
          className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full shadow-[0_10px_30px_rgba(37,211,102,0.45)] transition-all hover:scale-110 animate-[pulse_2s_ease-in-out_infinite]"
        >
          <Image
            src="/whatsapp-logo.png"
            alt="WhatsApp"
            width={64}
            height={64}
            className="h-full w-full object-cover"
          />
        </button>
      </div>

      {open && (
        <div className="fixed bottom-44 right-5 z-[999] w-[360px] max-w-[90vw] overflow-hidden rounded-[28px] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
          <div className="flex items-center justify-between bg-[#0B7A68] px-6 py-5 text-white">
            <div>
              <h3 className="text-lg font-black">
                ¿En qué podemos ayudarte?
              </h3>

              <p className="text-xs font-semibold">
                {hayAsesores
                  ? "Elige un asesor disponible"
                  : "Estamos listos para ayudarte"}
              </p>
            </div>

            <button
              type="button"
              aria-label="Cerrar"
              onClick={() =>
                setOpen(false)
              }
              className="text-2xl font-black text-white"
            >
              ×
            </button>
          </div>

          <div className="max-h-[460px] space-y-3 overflow-y-auto p-4">
            {hayAsesores ? (
              asesores.map((asesor) => (
                <button
                  key={asesor.id}
                  type="button"
                  onClick={() =>
                    abrirWhatsApp(
                      asesor.telefono
                    )
                  }
                  className="w-full rounded-2xl border border-gray-200 bg-white p-4 text-left transition-all hover:border-green-300 hover:bg-gray-50 hover:shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-[70px] w-[70px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-100">
                      {asesor.imagenUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={
                            asesor.imagenUrl
                          }
                          alt={asesor.nombre}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Image
                          src="/whatsapp-logo.png"
                          alt="WhatsApp"
                          width={70}
                          height={70}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xl font-black text-gray-900">
                        {asesor.nombre}
                      </p>

                      <p className="mt-1 text-sm text-gray-600">
                        {asesor.cargo}
                      </p>

                      <div className="mt-3 rounded-full bg-[#25D366] py-2.5 text-center text-sm font-bold text-white">
                        Hablar por WhatsApp
                      </div>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <button
                type="button"
                onClick={() =>
                  abrirWhatsApp(whatsapp)
                }
                className="w-full rounded-2xl border border-gray-200 bg-white p-4 text-left transition-all hover:border-green-300 hover:bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <Image
                    src="/whatsapp-logo.png"
                    alt="WhatsApp"
                    width={70}
                    height={70}
                    className="h-[70px] w-[70px] rounded-full object-cover"
                  />

                  <div className="flex-1">
                    <p className="text-xl font-black text-gray-900">
                      {nombreTienda}
                    </p>

                    <p className="text-sm text-gray-600">
                      Atención de ventas
                    </p>

                    <div className="mt-3 rounded-full bg-[#25D366] py-2.5 text-center text-sm font-bold text-white">
                      Hablar por WhatsApp
                    </div>
                  </div>
                </div>
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}