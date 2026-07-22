"use client";

import { ImageIcon, LoaderCircle, Trash2, Upload } from "lucide-react";
import { ChangeEvent, useRef, useState } from "react";

import type {
  CloudinarySignatureResponse,
  CloudinaryUploadResponse,
} from "./types";

type SingleImageUploaderProps = {
  nameUrl: string;
  namePublicId: string;
  initialUrl?: string;
  initialPublicId?: string;
  altText: string;
  signaturePayload: Record<string, unknown>;
};

export default function SingleImageUploader({
  nameUrl,
  namePublicId,
  initialUrl = "",
  initialPublicId = "",
  altText,
  signaturePayload,
}: SingleImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [imagenUrl, setImagenUrl] = useState(initialUrl);
  const [publicId, setPublicId] = useState(initialPublicId);
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState("");

  async function obtenerFirma() {
    const response = await fetch("/api/cloudinary/signature", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(signaturePayload),
    });

    const result = (await response.json().catch(() => null)) as
      | CloudinarySignatureResponse
      | { error?: string }
      | null;

    if (!response.ok) {
      throw new Error(
        result && "error" in result && result.error
          ? result.error
          : "No se pudo preparar la carga.",
      );
    }

    return result as CloudinarySignatureResponse;
  }

  async function subirImagen(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Selecciona una imagen válida.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("La imagen supera el máximo de 10 MB.");
      return;
    }

    setSubiendo(true);
    setError("");

    try {
      const signatureData = await obtenerFirma();

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
            "No se pudo subir la imagen.",
        );
      }

      setImagenUrl(result.secure_url);
      setPublicId(result.public_id);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se pudo subir la imagen.",
      );
    } finally {
      setSubiendo(false);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  function seleccionarArchivo(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (file) {
      void subirImagen(file);
    }
  }

  function quitarImagen() {
    setImagenUrl("");
    setPublicId("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-4">
      <input
        type="hidden"
        name={nameUrl}
        value={imagenUrl}
      />

      <input
        type="hidden"
        name={namePublicId}
        value={publicId}
      />

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={seleccionarArchivo}
        className="hidden"
      />

      {imagenUrl ? (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
          <div className="aspect-[16/6] w-full overflow-hidden bg-slate-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imagenUrl}
              alt={altText}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="min-w-0 truncate text-sm font-semibold text-slate-600">
              Imagen cargada correctamente
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                disabled={subiendo}
                onClick={() => inputRef.current?.click()}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Upload size={16} />
                Cambiar
              </button>

              <button
                type="button"
                disabled={subiendo}
                onClick={quitarImagen}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 text-sm font-bold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Trash2 size={16} />
                Quitar
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={subiendo}
          onClick={() => inputRef.current?.click()}
          className="flex min-h-64 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center transition hover:border-slate-400 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {subiendo ? (
            <>
              <LoaderCircle
                size={34}
                className="animate-spin text-slate-500"
              />

              <span className="mt-4 text-sm font-bold text-slate-700">
                Subiendo imagen...
              </span>
            </>
          ) : (
            <>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
                <ImageIcon
                  size={28}
                  className="text-slate-500"
                />
              </div>

              <span className="mt-4 text-sm font-black text-slate-900">
                Seleccionar imagen
              </span>

              <span className="mt-2 text-xs leading-5 text-slate-500">
                PNG, JPG o WebP. Máximo 10 MB.
              </span>
            </>
          )}
        </button>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}
    </div>
  );
}