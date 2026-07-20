"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function PantallaInicio() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const temporizador = setTimeout(() => {
      setVisible(false);
    }, 1800);

    return () => clearTimeout(temporizador);
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-slate-950">
      <div className="flex flex-col items-center px-6 text-center">
        <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-3xl bg-white p-3 shadow-2xl">
          <Image
            src="/logo.png"
            alt="KAFES ONLINE"
            width={112}
            height={112}
            priority
            className="h-full w-full object-contain"
          />
        </div>

        <h1 className="mt-6 text-2xl font-extrabold tracking-wide text-white">
          KAFES ONLINE
        </h1>

        <p className="mt-2 text-sm font-medium text-slate-300">
          Cargando panel administrativo...
        </p>

        <div className="mt-7 h-1.5 w-44 overflow-hidden rounded-full bg-slate-700">
          <div className="h-full w-full origin-left animate-[carga_1.7s_ease-in-out_forwards] rounded-full bg-white" />
        </div>
      </div>

      <style jsx>{`
        @keyframes carga {
          from {
            transform: scaleX(0);
          }

          to {
            transform: scaleX(1);
          }
        }
      `}</style>
    </div>
  );
}