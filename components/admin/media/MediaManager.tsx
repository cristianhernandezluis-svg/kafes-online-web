"use client";

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";

import { LoaderCircle } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import SortableImageCard from "./SortableImageCard";
import UploadZone from "./UploadZone";

import type {
  CloudinarySignatureResponse,
  CloudinaryUploadResponse,
  ImagenProducto,
} from "./types";

type MediaManagerProps = {
  apiPath: string;
  altText: string;
  signaturePayload?: Record<string, unknown>;
  titulo?: string;
  descripcionVacia?: string;
  maximoArchivos?: number;
};

export default function MediaManager({
  apiPath,
  altText,
  signaturePayload = {},
  titulo = "Galería de imágenes",
  descripcionVacia = "Todavía no hay imágenes registradas.",
  maximoArchivos = 15,
}: MediaManagerProps) {
  const [imagenes, setImagenes] = useState<ImagenProducto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [subiendo, setSubiendo] = useState(false);
  const [ordenando, setOrdenando] = useState(false);
  const [procesandoId, setProcesandoId] = useState<number | null>(
    null,
  );
  const [error, setError] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 180,
        tolerance: 6,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const cargarImagenes = useCallback(async () => {
    try {
      const response = await fetch(apiPath, {
  cache: "no-store",
});

      if (!response.ok) {
        throw new Error("No se pudo cargar la galería.");
      }

      const data = (await response.json()) as ImagenProducto[];

      setImagenes(
        [...data].sort((a, b) => a.orden - b.orden),
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se pudo cargar la galería.",
      );
    } finally {
      setCargando(false);
    }
  }, [apiPath]);

  useEffect(() => {
    void cargarImagenes();
  }, [cargarImagenes]);

  async function obtenerFirma() {
    const response = await fetch("/api/cloudinary/signature", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(signaturePayload),
    });

    if (!response.ok) {
      throw new Error("No se pudo preparar la carga.");
    }

    return (await response.json()) as CloudinarySignatureResponse;
  }

  async function subirACloudinary(
    file: File,
    signatureData: CloudinarySignatureResponse,
  ) {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("api_key", signatureData.apiKey);
    formData.append(
      "timestamp",
      String(signatureData.timestamp),
    );
    formData.append("signature", signatureData.signature);
    formData.append("folder", signatureData.folder);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      },
    );

    const result =
      (await response.json()) as CloudinaryUploadResponse;

    if (
      !response.ok ||
      !result.secure_url ||
      !result.public_id
    ) {
      throw new Error(
        result.error?.message ||
          `No se pudo subir ${file.name}.`,
      );
    }

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  }

  async function guardarImagen(
    url: string,
    publicId: string,
    fileName: string,
  ) {
    const response = await fetch(apiPath, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url,
          publicId,
          alt: altText,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(
        `La imagen ${fileName} subió, pero no pudo guardarse.`,
      );
    }
  }

  async function procesarArchivos(
    files: FileList | File[],
  ) {
    const lista = Array.from(files).filter((file) =>
      file.type.startsWith("image/"),
    );

    if (lista.length === 0) {
      setError("Selecciona archivos de imagen válidos.");
      return;
    }

    if (lista.length > maximoArchivos) {
  setError(
    `Puedes subir hasta ${maximoArchivos} imágenes por selección.`,
  );
  return;
}

    const archivoMuyGrande = lista.find(
      (file) => file.size > 10 * 1024 * 1024,
    );

    if (archivoMuyGrande) {
      setError(
        `${archivoMuyGrande.name} supera el máximo de 10 MB.`,
      );
      return;
    }

    setSubiendo(true);
    setError("");

    try {
      const signatureData = await obtenerFirma();

      for (const file of lista) {
        const subida = await subirACloudinary(
          file,
          signatureData,
        );

        await guardarImagen(
          subida.url,
          subida.publicId,
          file.name,
        );
      }

      await cargarImagenes();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Ocurrió un error durante la carga.",
      );
    } finally {
      setSubiendo(false);
    }
  }

  async function ponerComoPrincipal(imagenId: number) {
    setProcesandoId(imagenId);
    setError("");

    try {
      const response = await fetch(
        apiPath,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            imagenId,
            accion: "principal",
          }),
        },
      );

      if (!response.ok) {
        throw new Error(
          "No se pudo cambiar la imagen principal.",
        );
      }

      setImagenes((actuales) =>
        actuales.map((imagen) => ({
          ...imagen,
          esPrincipal: imagen.id === imagenId,
        })),
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se pudo actualizar la imagen.",
      );
    } finally {
      setProcesandoId(null);
    }
  }

  async function eliminarImagen(imagen: ImagenProducto) {
    const confirmar = window.confirm(
      "¿Eliminar esta imagen definitivamente?",
    );

    if (!confirmar) {
      return;
    }

    setProcesandoId(imagen.id);
    setError("");

    try {
      const response = await fetch(apiPath, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            imagenId: imagen.id,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("No se pudo eliminar la imagen.");
      }

      await cargarImagenes();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se pudo eliminar la imagen.",
      );
    } finally {
      setProcesandoId(null);
    }
  }

  async function guardarOrden(
    imagenesOrdenadas: ImagenProducto[],
  ) {
    const response = await fetch(apiPath, {
  method: "PATCH",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    accion: "ordenar",
    imagenIds: imagenesOrdenadas.map(
      (imagen) => imagen.id,
    ),
  }),
});

    if (!response.ok) {
      const result = (await response
        .json()
        .catch(() => null)) as { error?: string } | null;

      throw new Error(
        result?.error ||
          "No se pudo guardar el nuevo orden.",
      );
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (
      !over ||
      active.id === over.id ||
      ordenando
    ) {
      return;
    }

    const indiceAnterior = imagenes.findIndex(
      (imagen) => imagen.id === active.id,
    );

    const indiceNuevo = imagenes.findIndex(
      (imagen) => imagen.id === over.id,
    );

    if (indiceAnterior === -1 || indiceNuevo === -1) {
      return;
    }

    const ordenAnterior = imagenes;

    const nuevoOrden = arrayMove(
      imagenes,
      indiceAnterior,
      indiceNuevo,
    ).map((imagen, indice) => ({
      ...imagen,
      orden: indice,
    }));

    setImagenes(nuevoOrden);
    setOrdenando(true);
    setError("");

    try {
      await guardarOrden(nuevoOrden);
    } catch (error) {
      setImagenes(ordenAnterior);

      setError(
        error instanceof Error
          ? error.message
          : "No se pudo guardar el orden.",
      );
    } finally {
      setOrdenando(false);
    }
  }

  if (cargando) {
    return (
      <div className="flex min-h-52 items-center justify-center">
        <LoaderCircle
          className="animate-spin"
          size={30}
        />
      </div>
    );
  }

  const procesando =
    subiendo || ordenando || procesandoId !== null;

  return (
    <div className="space-y-6">
      <UploadZone
        subiendo={subiendo}
        disabled={ordenando}
        onFiles={(files) => void procesarArchivos(files)}
      />

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      {imagenes.length === 0 ? (
        <div className="rounded-xl border border-slate-200 p-8 text-center">
          <p className="font-bold text-slate-700">
            {descripcionVacia}
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h3 className="font-black text-slate-950">
                {titulo}
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Arrastra el icono de cada imagen para cambiar
                su posición.
              </p>
            </div>

            {ordenando && (
              <span className="inline-flex items-center gap-2 self-start rounded-full bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700">
                <LoaderCircle
                  size={15}
                  className="animate-spin"
                />
                Guardando orden
              </span>
            )}
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={(event) => void handleDragEnd(event)}
          >
            <SortableContext
              items={imagenes.map((imagen) => imagen.id)}
              strategy={rectSortingStrategy}
            >
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {imagenes.map((imagen, index) => (
                  <SortableImageCard
                    key={imagen.id}
                    imagen={imagen}
                    index={index}
                    cantidad={imagenes.length}
                    productoNombre={altText}
                    procesando={
                      procesando ||
                      procesandoId === imagen.id
                    }
                    onPrincipal={ponerComoPrincipal}
                    onEliminar={eliminarImagen}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </>
      )}
    </div>
  );
}