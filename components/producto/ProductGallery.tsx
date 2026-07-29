"use client";

import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Expand,
  ShieldCheck,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

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
  const galeria = useMemo(() => {
    const fuentes = imagenes.length > 0 ? imagenes : [imagenPrincipal];
    return [...new Set(fuentes.filter(Boolean))];
  }, [imagenes, imagenPrincipal]);

  const [imagenActiva, setImagenActiva] = useState(0);
  const [zoomAbierto, setZoomAbierto] = useState(false);

  useEffect(() => {
    if (imagenActiva >= galeria.length) setImagenActiva(0);
  }, [galeria.length, imagenActiva]);

  useEffect(() => {
    if (!zoomAbierto) return;

    const cerrarConEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setZoomAbierto(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", cerrarConEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", cerrarConEscape);
    };
  }, [zoomAbierto]);

  const imagenSeleccionada = galeria[imagenActiva] ?? imagenPrincipal;

  const anterior = () => {
    setImagenActiva((actual) =>
      actual === 0 ? galeria.length - 1 : actual - 1,
    );
  };

  const siguiente = () => {
    setImagenActiva((actual) => (actual + 1) % galeria.length);
  };

  return (
    <section className="min-w-0">
      <div className="relative overflow-hidden rounded-[30px] border border-zinc-200 bg-white shadow-[0_20px_70px_rgba(0,0,0,0.07)]">
        <div className="absolute left-4 top-4 z-10 flex flex-wrap gap-2 sm:left-6 sm:top-6">
          <span className="rounded-full bg-zinc-950 px-3 py-2 text-[11px] font-black uppercase tracking-wide text-white shadow-lg">
            Producto original
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-yellow-400 px-3 py-2 text-[11px] font-black uppercase tracking-wide text-black shadow-lg">
            <ShieldCheck size={14} /> Compra protegida
          </span>
        </div>

        <button
          type="button"
          onClick={() => setZoomAbierto(true)}
          aria-label="Ampliar imagen"
          className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full border border-zinc-200 bg-white/95 text-zinc-900 shadow-lg backdrop-blur transition hover:scale-105 sm:right-6 sm:top-6"
        >
          <Expand size={20} />
        </button>

        <button
          type="button"
          onClick={() => setZoomAbierto(true)}
          className="group relative block aspect-square w-full bg-[radial-gradient(circle_at_center,_#ffffff_0%,_#fafafa_55%,_#f4f4f5_100%)] p-5 sm:p-8 lg:p-10"
          aria-label={`Ampliar ${nombre}`}
        >
          <Image
            src={imagenSeleccionada}
            alt={nombre}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain p-5 transition duration-500 group-hover:scale-[1.025] sm:p-8 lg:p-10"
            priority
          />
        </button>

        {galeria.length > 1 && (
          <>
            <GalleryArrow direction="left" onClick={anterior} />
            <GalleryArrow direction="right" onClick={siguiente} />

            <div className="absolute bottom-4 right-4 rounded-full bg-black/75 px-3 py-1.5 text-xs font-black text-white backdrop-blur sm:bottom-6 sm:right-6">
              {imagenActiva + 1} / {galeria.length}
            </div>
          </>
        )}
      </div>

      {galeria.length > 1 && (
        <div className="mt-4 flex w-full gap-3 overflow-x-auto pb-2 [scrollbar-width:thin]">
          {galeria.map((src, index) => (
            <button
              key={`${src}-${index}`}
              type="button"
              onClick={() => setImagenActiva(index)}
              aria-label={`Ver imagen ${index + 1} de ${nombre}`}
              className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 bg-white transition sm:h-24 sm:w-24 ${
                imagenActiva === index
                  ? "border-yellow-400 shadow-[0_8px_25px_rgba(250,204,21,0.22)]"
                  : "border-zinc-200 hover:border-zinc-400"
              }`}
            >
              <Image
                src={src}
                alt={`${nombre} - imagen ${index + 1}`}
                fill
                sizes="96px"
                className="object-contain p-2"
              />
            </button>
          ))}
        </div>
      )}

      {caracteristicas.length > 0 && (
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {caracteristicas.slice(0, 3).map((item) => (
            <div
              key={item}
              className="min-w-0 rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-3.5 text-center text-xs font-black leading-5 text-zinc-800 sm:px-4 sm:text-sm"
            >
              {item}
            </div>
          ))}
        </div>
      )}

      {zoomAbierto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Vista ampliada de ${nombre}`}
          className="fixed inset-0 z-[1000] grid place-items-center bg-black/90 p-3 backdrop-blur-sm sm:p-8"
          onClick={() => setZoomAbierto(false)}
        >
          <button
            type="button"
            onClick={() => setZoomAbierto(false)}
            className="absolute right-4 top-4 z-20 grid h-12 w-12 place-items-center rounded-full bg-white text-black shadow-xl sm:right-8 sm:top-8"
            aria-label="Cerrar imagen ampliada"
          >
            <X size={24} />
          </button>

          <div
            className="relative h-[88vh] w-full max-w-6xl overflow-hidden rounded-3xl bg-white"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={imagenSeleccionada}
              alt={`${nombre} ampliado`}
              fill
              sizes="100vw"
              className="object-contain p-4 sm:p-10"
              priority
            />

            {galeria.length > 1 && (
              <>
                <GalleryArrow direction="left" onClick={anterior} modal />
                <GalleryArrow direction="right" onClick={siguiente} modal />
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

function GalleryArrow({
  direction,
  onClick,
  modal = false,
}: {
  direction: "left" | "right";
  onClick: () => void;
  modal?: boolean;
}) {
  const Icon = direction === "left" ? ChevronLeft : ChevronRight;

  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      aria-label={direction === "left" ? "Imagen anterior" : "Imagen siguiente"}
      className={`absolute top-1/2 z-10 grid -translate-y-1/2 place-items-center rounded-full shadow-lg transition hover:scale-105 ${
        direction === "left" ? "left-3 sm:left-5" : "right-3 sm:right-5"
      } ${
        modal
          ? "h-12 w-12 bg-black/70 text-white backdrop-blur sm:h-14 sm:w-14"
          : "h-10 w-10 border border-zinc-200 bg-white/95 text-black backdrop-blur sm:h-12 sm:w-12"
      }`}
    >
      <Icon size={modal ? 28 : 22} />
    </button>
  );
}
