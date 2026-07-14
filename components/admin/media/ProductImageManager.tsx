"use client";

import {
  ArrowDown,
  ArrowUp,
  ImagePlus,
  LoaderCircle,
  Star,
  Trash2,
  Upload,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

type ImagenProducto = {
  id: number;
  productoId: number;
  url: string;
  publicId: string | null;
  alt: string | null;
  orden: number;
  esPrincipal: boolean;
};

type CloudinaryUploadResponse = {
  secure_url: string;
  public_id: string;
  error?: {
    message?: string;
  };
};

type ProductImageManagerProps = {
  productoId: number;
  productoNombre: string;
};

export default function ProductImageManager({
  productoId,
  productoNombre,
}: ProductImageManagerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [imagenes, setImagenes] = useState<ImagenProducto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState("");

  async function cargarImagenes() {
    try {
      const response = await fetch(
        `/api/admin/productos/${productoId}/imagenes`,
        {
          cache: "no-store",
        },
      );

      if (!response.ok) {
        throw new Error("No se pudo cargar la galería.");
      }

      const data = (await response.json()) as ImagenProducto[];
      setImagenes(data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se pudo cargar la galería.",
      );
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    void cargarImagenes();
  }, [productoId]);

  async function subirArchivo(file: File) {
    const signatureResponse = await fetch(
      "/api/cloudinary/signature",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productoId,
        }),
      },
    );

    if (!signatureResponse.ok) {
      throw new Error("No se pudo preparar la carga.");
    }

    const signatureData = (await signatureResponse.json()) as {
      timestamp: number;
      signature: string;
      folder: string;
      apiKey: string;
      cloudName: string;
    };

    const cloudinaryData = new FormData();

    cloudinaryData.append("file", file);
    cloudinaryData.append("api_key", signatureData.apiKey);
    cloudinaryData.append(
      "timestamp",
      String(signatureData.timestamp),
    );
    cloudinaryData.append("signature", signatureData.signature);
    cloudinaryData.append("folder", signatureData.folder);

    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`,
      {
        method: "POST",
        body: cloudinaryData,
      },
    );

    const uploadResult =
      (await uploadResponse.json()) as CloudinaryUploadResponse;

    if (!uploadResponse.ok || !uploadResult.secure_url) {
      throw new Error(
        uploadResult.error?.message ||
          `No se pudo subir ${file.name}.`,
      );
    }

    const saveResponse = await fetch(
      `/api/admin/productos/${productoId}/imagenes`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: uploadResult.secure_url,
          publicId: uploadResult.public_id,
          alt: productoNombre,
        }),
      },
    );

    if (!saveResponse.ok) {
      throw new Error(
        `La imagen ${file.name} subió, pero no pudo guardarse.`,
      );
    }
  }

  async function procesarArchivos(files: FileList | File[]) {
    const lista = Array.from(files).filter((file) =>
      file.type.startsWith("image/"),
    );

    if (lista.length === 0) {
      setError("Selecciona archivos de imagen válidos.");
      return;
    }

    if (lista.length > 15) {
      setError("Puedes subir hasta 15 imágenes por selección.");
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
      for (const file of lista) {
        await subirArchivo(file);
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

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  async function ejecutarAccion(
    imagenId: number,
    accion: "principal" | "subir" | "bajar",
  ) {
    setError("");

    const response = await fetch(
      `/api/admin/productos/${productoId}/imagenes`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imagenId,
          accion,
        }),
      },
    );

    if (!response.ok) {
      setError("No se pudo actualizar la imagen.");
      return;
    }

    await cargarImagenes();
  }

  async function eliminarImagen(imagen: ImagenProducto) {
    const confirmar = window.confirm(
      "¿Eliminar esta imagen definitivamente?",
    );

    if (!confirmar) {
      return;
    }

    setError("");

    const response = await fetch(
      `/api/admin/productos/${productoId}/imagenes`,
      {
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
      setError("No se pudo eliminar la imagen.");
      return;
    }

    await cargarImagenes();
  }

  if (cargando) {
    return (
      <div className="flex min-h-52 items-center justify-center">
        <LoaderCircle className="animate-spin" size={28} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div
        className="flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center transition hover:border-slate-500 hover:bg-white"
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
        }}
        onDrop={(event) => {
          event.preventDefault();
          void procesarArchivos(event.dataTransfer.files);
        }}
      >
        {subiendo ? (
          <>
            <LoaderCircle
              size={36}
              className="animate-spin text-slate-700"
            />

            <p className="mt-4 font-black text-slate-950">
              Subiendo imágenes…
            </p>

            <p className="mt-2 text-sm text-slate-500">
              No cierres esta página.
            </p>
          </>
        ) : (
          <>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
              <ImagePlus size={27} />
            </div>

            <p className="mt-5 text-base font-black text-slate-950">
              Arrastra imágenes aquí
            </p>

            <p className="mt-2 text-sm text-slate-500">
              o presiona para seleccionar archivos
            </p>

            <span className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-bold text-white">
              <Upload size={17} />
              Seleccionar imágenes
            </span>

            <p className="mt-4 text-xs text-slate-400">
              JPG, PNG, WEBP. Máximo 10 MB por imagen.
            </p>
          </>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          disabled={subiendo}
          className="hidden"
          onChange={(event) => {
            if (event.target.files) {
              void procesarArchivos(event.target.files);
            }
          }}
        />
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      {imagenes.length === 0 ? (
        <div className="rounded-xl border border-slate-200 p-8 text-center">
          <p className="font-bold text-slate-700">
            Este producto todavía no tiene imágenes.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {imagenes.map((imagen, index) => (
            <article
              key={imagen.id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="relative aspect-square bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imagen.url}
                  alt={imagen.alt || productoNombre}
                  className="h-full w-full object-contain"
                />

                {imagen.esPrincipal && (
                  <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-slate-950 px-3 py-1.5 text-xs font-bold text-white">
                    <Star size={13} fill="currentColor" />
                    Principal
                  </span>
                )}

                <span className="absolute right-3 top-3 rounded-full bg-white px-2.5 py-1 text-xs font-black shadow">
                  {index + 1}
                </span>
              </div>

              <div className="space-y-3 p-4">
                {!imagen.esPrincipal && (
                  <button
                    type="button"
                    onClick={() =>
                      void ejecutarAccion(
                        imagen.id,
                        "principal",
                      )
                    }
                    className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-slate-300 text-sm font-bold transition hover:bg-slate-50"
                  >
                    <Star size={16} />
                    Poner como principal
                  </button>
                )}

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() =>
                      void ejecutarAccion(imagen.id, "subir")
                    }
                    className="flex h-10 items-center justify-center rounded-xl border border-slate-300 disabled:opacity-30"
                    title="Mover antes"
                  >
                    <ArrowUp size={17} />
                  </button>

                  <button
                    type="button"
                    disabled={index === imagenes.length - 1}
                    onClick={() =>
                      void ejecutarAccion(imagen.id, "bajar")
                    }
                    className="flex h-10 items-center justify-center rounded-xl border border-slate-300 disabled:opacity-30"
                    title="Mover después"
                  >
                    <ArrowDown size={17} />
                  </button>

                  <button
                    type="button"
                    onClick={() => void eliminarImagen(imagen)}
                    className="flex h-10 items-center justify-center rounded-xl border border-red-200 text-red-600 transition hover:bg-red-50"
                    title="Eliminar imagen"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}