"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type ProductGalleryProps = {
  nombre: string;
  imagenPrincipal: string;
  imagenes: string[];
  caracteristicas: string[];
};

export default function ProductGallery({
  nombre,
  imagenPrincipal,
  imagenes,
  caracteristicas,
}: ProductGalleryProps) {
  const galeria =
    imagenes.length > 0
      ? imagenes
      : [imagenPrincipal];

  const [imagenActiva, setImagenActiva] = useState(0);

  useEffect(() => {
    if (imagenActiva >= galeria.length) {
      setImagenActiva(0);
    }
  }, [galeria.length, imagenActiva]);

  const imagenSeleccionada =
    galeria[imagenActiva] ?? imagenPrincipal;

  return (
    <div>
      <div className="w-full overflow-hidden rounded-3xl bg-zinc-100 p-3 sm:p-5 md:p-8">
        <Image
          src={imagenSeleccionada}
          alt={nombre}
          width={700}
          height={700}
          className="block h-auto w-full rounded-2xl object-contain"
          priority
        />
      </div>

      {galeria.length > 1 && (
        <div className="mt-4 flex w-full gap-2 overflow-x-auto pb-2">
          {galeria.map((src, index) => (
            <button
              key={`${src}-${index}`}
              type="button"
              onClick={() => setImagenActiva(index)}
              aria-label={`Ver imagen ${index + 1} de ${nombre}`}
              className={[
                "shrink-0 rounded-xl border-2 bg-white p-1.5 transition sm:rounded-2xl sm:p-2",
                imagenActiva === index
                  ? "border-yellow-400 shadow-lg"
                  : "border-zinc-200",
              ].join(" ")}
            >
              <Image
                src={src}
                alt={`${nombre} - imagen ${index + 1}`}
                width={110}
                height={110}
                className="h-16 w-16 object-contain sm:h-24 sm:w-24"
              />
            </button>
          ))}
        </div>
      )}

      {caracteristicas.length > 0 && (
        <div className="mt-5 grid w-full grid-cols-3 gap-2 sm:gap-4">
          {caracteristicas.map((item) => (
            <MiniBox key={item} text={item} />
          ))}
        </div>
      )}
    </div>
  );
}

function MiniBox({ text }: { text: string }) {
  return (
    <div className="min-w-0 break-words rounded-xl bg-zinc-100 px-2 py-3 text-center text-xs font-black sm:rounded-2xl sm:p-4 sm:text-base">
      {text}
    </div>
  );
}