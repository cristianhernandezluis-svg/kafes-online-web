"use client";

import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import {
  GripVertical,
  Star,
  Trash2,
} from "lucide-react";
import type { ImagenProducto } from "./types";

type SortableImageCardProps = {
  imagen: ImagenProducto;
  index: number;
  cantidad: number;
  productoNombre: string;
  procesando: boolean;
  onPrincipal: (imagenId: number) => Promise<void>;
  onEliminar: (imagen: ImagenProducto) => Promise<void>;
};

export default function SortableImageCard({
  imagen,
  index,
  cantidad,
  productoNombre,
  procesando,
  onPrincipal,
  onEliminar,
}: SortableImageCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: imagen.id,
    disabled: procesando,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 20 : undefined,
    opacity: isDragging ? 0.7 : 1,
  };

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={[
        "overflow-hidden rounded-2xl border bg-white shadow-sm transition",
        isDragging
          ? "border-slate-500 shadow-xl"
          : "border-slate-200",
      ].join(" ")}
    >
      <div className="relative aspect-square bg-slate-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imagen.url}
          alt={imagen.alt || productoNombre}
          className="h-full w-full object-contain"
          draggable={false}
        />

        <button
          type="button"
          disabled={procesando}
          aria-label={`Mover imagen ${index + 1}`}
          title="Arrastra para cambiar el orden"
          className={[
            "absolute right-3 top-3 flex h-10 w-10 items-center justify-center",
            "touch-none rounded-xl bg-white text-slate-700 shadow-md",
            "cursor-grab active:cursor-grabbing disabled:cursor-not-allowed",
            "disabled:opacity-50",
          ].join(" ")}
          {...attributes}
          {...listeners}
        >
          <GripVertical size={20} />
        </button>

        {imagen.esPrincipal && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-slate-950 px-3 py-1.5 text-xs font-bold text-white">
            <Star size={13} fill="currentColor" />
            Principal
          </span>
        )}

        <span className="absolute bottom-3 right-3 rounded-full bg-white px-3 py-1 text-xs font-black shadow">
          {index + 1} de {cantidad}
        </span>
      </div>

      <div className="space-y-3 p-4">
        {!imagen.esPrincipal ? (
          <button
            type="button"
            disabled={procesando}
            onClick={() => void onPrincipal(imagen.id)}
            className={[
              "flex h-10 w-full items-center justify-center gap-2 rounded-xl",
              "border border-slate-300 text-sm font-bold transition",
              "hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50",
            ].join(" ")}
          >
            <Star size={16} />
            Poner como principal
          </button>
        ) : (
          <div className="flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-100 text-sm font-bold text-slate-700">
            <Star size={16} fill="currentColor" />
            Imagen principal
          </div>
        )}

        <button
          type="button"
          disabled={procesando}
          onClick={() => void onEliminar(imagen)}
          className={[
            "flex h-10 w-full items-center justify-center gap-2 rounded-xl",
            "border border-red-200 text-sm font-bold text-red-600 transition",
            "hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50",
          ].join(" ")}
        >
          <Trash2 size={17} />
          Eliminar
        </button>
      </div>
    </article>
  );
}