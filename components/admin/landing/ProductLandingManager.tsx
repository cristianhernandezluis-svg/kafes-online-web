"use client";

import {
  ArrowDown,
  ArrowUp,
  ImagePlus,
  LoaderCircle,
  Trash2,
} from "lucide-react";
import { ChangeEvent, useCallback, useEffect, useState } from "react";

type LandingSeccion = {
  id: number;
  productoId: number;
  tipo: string;
  imagenUrl: string | null;
  orden: number;
  visible: boolean;
  configuracion: unknown;
};

type CloudinarySignatureResponse = {
  timestamp: number;
  signature: string;
  apiKey: string;
  cloudName: string;
  folder: string;
};

type CloudinaryUploadResponse = {
  secure_url?: string;
  public_id?: string;
  error?: {
    message?: string;
  };
};

type ProductLandingManagerProps = {
  productoId: number;
  productoNombre: string;
};

function obtenerConfiguracion(
  configuracion: unknown
): Record<string, unknown> {
  if (
    configuracion &&
    typeof configuracion === "object" &&
    !Array.isArray(configuracion)
  ) {
    return configuracion as Record<string, unknown>;
  }

  return {};
}

export default function ProductLandingManager({
  productoId,
  productoNombre,
}: ProductLandingManagerProps) {
  const apiPath = `/api/admin/productos/${productoId}/landing`;

  const [activo, setActivo] = useState(false);
  const [imagenes, setImagenes] = useState<LandingSeccion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [subiendo, setSubiendo] = useState(false);
  const [procesandoId, setProcesandoId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const cargarLanding = useCallback(async () => {
    try {
      setError("");

      const response = await fetch(apiPath, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(
          "No se pudo cargar la landing visual."
        );
      }

      const data = (await response.json()) as LandingSeccion[];

      const configuracion = data.find(
        (item) => item.tipo === "LANDING_CONFIG"
      );

      const config = obtenerConfiguracion(
        configuracion?.configuracion
      );

      setActivo(config.activo === true);

      setImagenes(
        data
          .filter(
            (item) =>
              item.tipo === "LANDING_IMAGEN" &&
              item.imagenUrl
          )
          .sort((a, b) => a.orden - b.orden)
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se pudo cargar la landing."
      );
    } finally {
      setCargando(false);
    }
  }, [apiPath]);

  useEffect(() => {
    void cargarLanding();
  }, [cargarLanding]);

  async function cambiarEstadoLanding(
    nuevoEstado: boolean
  ) {
    try {
      setError("");

      const response = await fetch(apiPath, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accion: "configuracion",
          activo: nuevoEstado,
        }),
      });

      if (!response.ok) {
        throw new Error(
          "No se pudo actualizar el modo landing."
        );
      }

      setActivo(nuevoEstado);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se pudo actualizar la landing."
      );
    }
  }

  async function obtenerFirma() {
    const response = await fetch(
      "/api/cloudinary/signature",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productoId,
          tipo: "producto",
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        "No se pudo preparar la subida."
      );
    }

    return (await response.json()) as CloudinarySignatureResponse;
  }

  async function subirACloudinary(
    file: File,
    firma: CloudinarySignatureResponse
  ) {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("api_key", firma.apiKey);
    formData.append(
      "timestamp",
      String(firma.timestamp)
    );
    formData.append("signature", firma.signature);
    formData.append("folder", firma.folder);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${firma.cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
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
          "No se pudo subir la imagen."
      );
    }

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  }

  async function guardarImagen(
    url: string,
    publicId: string
  ) {
    const response = await fetch(apiPath, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        imagenUrl: url,
        publicId,
        mostrarBoton: true,
      }),
    });

    if (!response.ok) {
      throw new Error(
        "La imagen subió, pero no se pudo guardar."
      );
    }
  }

  async function seleccionarImagenes(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const files = Array.from(
      event.target.files ?? []
    ).filter((file) =>
      file.type.startsWith("image/")
    );

    event.target.value = "";

    if (files.length === 0) {
      return;
    }

    const demasiadoGrande = files.find(
      (file) => file.size > 10 * 1024 * 1024
    );

    if (demasiadoGrande) {
      setError(
        `${demasiadoGrande.name} supera los 10 MB.`
      );
      return;
    }

    setSubiendo(true);
    setError("");

    try {
      const firma = await obtenerFirma();

      for (const file of files) {
        const subida = await subirACloudinary(
          file,
          firma
        );

        await guardarImagen(
          subida.url,
          subida.publicId
        );
      }

      await cargarLanding();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Ocurrió un error subiendo las imágenes."
      );
    } finally {
      setSubiendo(false);
    }
  }

  async function cambiarBoton(
    seccion: LandingSeccion
  ) {
    const config = obtenerConfiguracion(
      seccion.configuracion
    );

    const mostrarActual =
      config.mostrarBoton !== false;

    const nuevoValor = !mostrarActual;

    setProcesandoId(seccion.id);
    setError("");

    try {
      const response = await fetch(apiPath, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accion: "boton",
          seccionId: seccion.id,
          mostrarBoton: nuevoValor,
        }),
      });

      if (!response.ok) {
        throw new Error(
          "No se pudo cambiar el botón."
        );
      }

      setImagenes((actuales) =>
        actuales.map((item) =>
          item.id === seccion.id
            ? {
                ...item,
                configuracion: {
                  ...obtenerConfiguracion(
                    item.configuracion
                  ),
                  mostrarBoton: nuevoValor,
                },
              }
            : item
        )
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se pudo actualizar el botón."
      );
    } finally {
      setProcesandoId(null);
    }
  }

  async function guardarOrden(
    nuevasImagenes: LandingSeccion[]
  ) {
    const response = await fetch(apiPath, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accion: "ordenar",
        ids: nuevasImagenes.map(
          (imagen) => imagen.id
        ),
      }),
    });

    if (!response.ok) {
      throw new Error(
        "No se pudo guardar el orden."
      );
    }
  }

  async function moverImagen(
    index: number,
    direccion: -1 | 1
  ) {
    const nuevoIndex = index + direccion;

    if (
      nuevoIndex < 0 ||
      nuevoIndex >= imagenes.length
    ) {
      return;
    }

    const anterior = [...imagenes];
    const nuevas = [...imagenes];

    [nuevas[index], nuevas[nuevoIndex]] = [
      nuevas[nuevoIndex],
      nuevas[index],
    ];

    const reordenadas = nuevas.map(
      (imagen, posicion) => ({
        ...imagen,
        orden: posicion,
      })
    );

    setImagenes(reordenadas);
    setError("");

    try {
      await guardarOrden(reordenadas);
    } catch (error) {
      setImagenes(anterior);

      setError(
        error instanceof Error
          ? error.message
          : "No se pudo ordenar."
      );
    }
  }

  async function eliminarImagen(
    seccion: LandingSeccion
  ) {
    const confirmar = window.confirm(
      "¿Eliminar esta imagen de la landing visual?"
    );

    if (!confirmar) {
      return;
    }

    setProcesandoId(seccion.id);
    setError("");

    try {
      const response = await fetch(apiPath, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          seccionId: seccion.id,
        }),
      });

      if (!response.ok) {
        throw new Error(
          "No se pudo eliminar la imagen."
        );
      }

      await cargarLanding();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se pudo eliminar."
      );
    } finally {
      setProcesandoId(null);
    }
  }

  if (cargando) {
    return (
      <div className="flex min-h-52 items-center justify-center">
        <LoaderCircle
          size={30}
          className="animate-spin"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <label className="flex cursor-pointer items-start gap-4">
          <input
            type="checkbox"
            checked={activo}
            onChange={(event) =>
              void cambiarEstadoLanding(
                event.target.checked
              )
            }
            className="mt-1 h-5 w-5 rounded border-slate-300"
          />

          <span>
            <span className="block text-base font-black text-slate-950">
              Usar landing visual estilo GemPages
            </span>

            <span className="mt-1 block text-sm leading-6 text-slate-500">
              Al activarla, el producto mostrará
              directamente estas imágenes en lugar de
              la ficha tradicional.
            </span>
          </span>
        </label>
      </div>

      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center">
        <ImagePlus
          size={36}
          className="mx-auto mb-3 text-slate-400"
        />

        <p className="font-black text-slate-900">
          Imágenes de la landing
        </p>

        <p className="mt-1 text-sm text-slate-500">
          Sube imágenes verticales de venta para{" "}
          {productoNombre}.
        </p>

        <label className="mt-5 inline-flex cursor-pointer items-center justify-center rounded-xl bg-slate-950 px-5 py-3 text-sm font-black text-white">
          {subiendo
            ? "Subiendo..."
            : "+ Subir imágenes"}

          <input
            type="file"
            accept="image/*"
            multiple
            disabled={subiendo}
            onChange={seleccionarImagenes}
            className="hidden"
          />
        </label>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
          {error}
        </div>
      )}

      {imagenes.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          Todavía no has agregado imágenes a esta
          landing.
        </div>
      ) : (
        <div className="space-y-5">
          {imagenes.map((imagen, index) => {
            const config = obtenerConfiguracion(
              imagen.configuracion
            );

            const mostrarBoton =
              config.mostrarBoton !== false;

            return (
              <div
                key={imagen.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                {imagen.imagenUrl && (
                  <img
                    src={imagen.imagenUrl}
                    alt={`${productoNombre} landing ${
                      index + 1
                    }`}
                    className="block h-auto w-full"
                  />
                )}

                <div className="space-y-4 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-black text-slate-900">
                        Imagen {index + 1}
                      </p>

                      <p className="text-xs text-slate-500">
                        Orden: {index + 1}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() =>
                          void moverImagen(index, -1)
                        }
                        className="rounded-lg border border-slate-200 p-2 disabled:opacity-30"
                        title="Subir"
                      >
                        <ArrowUp size={18} />
                      </button>

                      <button
                        type="button"
                        disabled={
                          index ===
                          imagenes.length - 1
                        }
                        onClick={() =>
                          void moverImagen(index, 1)
                        }
                        className="rounded-lg border border-slate-200 p-2 disabled:opacity-30"
                        title="Bajar"
                      >
                        <ArrowDown size={18} />
                      </button>

                      <button
                        type="button"
                        disabled={
                          procesandoId === imagen.id
                        }
                        onClick={() =>
                          void eliminarImagen(imagen)
                        }
                        className="rounded-lg border border-red-200 p-2 text-red-600"
                        title="Eliminar"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  <label className="flex cursor-pointer items-center gap-3 rounded-xl bg-slate-50 p-4">
                    <input
                      type="checkbox"
                      checked={mostrarBoton}
                      disabled={
                        procesandoId === imagen.id
                      }
                      onChange={() =>
                        void cambiarBoton(imagen)
                      }
                      className="h-5 w-5 rounded border-slate-300"
                    />

                    <span className="text-sm font-bold text-slate-800">
                      Mostrar botón REALIZAR PEDIDO
                      después de esta imagen
                    </span>
                  </label>

                  {mostrarBoton && (
                    <div className="rounded-2xl bg-black p-3">
                      <div className="w-full rounded-2xl bg-green-600 py-4 text-center text-lg font-black text-white">
                        REALIZAR PEDIDO
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}