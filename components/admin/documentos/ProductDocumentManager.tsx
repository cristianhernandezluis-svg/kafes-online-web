"use client";

import {
  ArrowDown,
  ArrowUp,
  Download,
  Eye,
  EyeOff,
  FileText,
  LoaderCircle,
  Pencil,
  Save,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

type TipoDocumento =
  | "FICHA_TECNICA"
  | "MANUAL"
  | "CURVA_RENDIMIENTO"
  | "CATALOGO"
  | "CERTIFICADO"
  | "OTRO";

type DocumentoProducto = {
  id: number;
  productoId: number;
  titulo: string;
  tipo: TipoDocumento;
  archivoUrl: string;
  publicId: string | null;
  orden: number;
  visible: boolean;
};

type CloudinarySignatureResponse = {
  timestamp: number;
  signature: string;
  folder: string;
  apiKey: string;
  cloudName: string;
};

type CloudinaryUploadResponse = {
  secure_url?: string;
  public_id?: string;
  error?: {
    message?: string;
  };
};

type ProductDocumentManagerProps = {
  productoId: number;
  productoNombre: string;
};

const TIPOS_DOCUMENTO: {
  valor: TipoDocumento;
  nombre: string;
}[] = [
  {
    valor: "FICHA_TECNICA",
    nombre: "Ficha técnica",
  },
  {
    valor: "MANUAL",
    nombre: "Manual",
  },
  {
    valor: "CURVA_RENDIMIENTO",
    nombre: "Curva de rendimiento",
  },
  {
    valor: "CATALOGO",
    nombre: "Catálogo",
  },
  {
    valor: "CERTIFICADO",
    nombre: "Certificado",
  },
  {
    valor: "OTRO",
    nombre: "Otro documento",
  },
];

function obtenerNombreTipo(tipo: TipoDocumento) {
  return (
    TIPOS_DOCUMENTO.find((item) => item.valor === tipo)
      ?.nombre ?? "Otro documento"
  );
}

function crearTituloDesdeArchivo(nombreArchivo: string) {
  return nombreArchivo
    .replace(/\.pdf$/i, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export default function ProductDocumentManager({
  productoId,
  productoNombre,
}: ProductDocumentManagerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [documentos, setDocumentos] = useState<
    DocumentoProducto[]
  >([]);

  const [tipoNuevo, setTipoNuevo] =
    useState<TipoDocumento>("FICHA_TECNICA");

  const [tituloNuevo, setTituloNuevo] = useState("");

  const [cargando, setCargando] = useState(true);
  const [subiendo, setSubiendo] = useState(false);

  const [procesandoId, setProcesandoId] = useState<
    number | null
  >(null);

  const [editandoId, setEditandoId] = useState<
    number | null
  >(null);

  const [tituloEditado, setTituloEditado] = useState("");
  const [tipoEditado, setTipoEditado] =
    useState<TipoDocumento>("OTRO");

  const [error, setError] = useState("");

  async function cargarDocumentos() {
    try {
      const response = await fetch(
        `/api/admin/productos/${productoId}/documentos`,
        {
          cache: "no-store",
        },
      );

      const data = (await response.json()) as
        | DocumentoProducto[]
        | {
            error?: string;
          };

      if (!response.ok || !Array.isArray(data)) {
        throw new Error(
          !Array.isArray(data) && data.error
            ? data.error
            : "No se pudieron cargar los documentos.",
        );
      }

      setDocumentos(
        [...data].sort((a, b) => a.orden - b.orden),
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se pudieron cargar los documentos.",
      );
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    void cargarDocumentos();
  }, [productoId]);

  async function obtenerFirmaCloudinary() {
    const response = await fetch("/api/cloudinary/signature", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tipo: "producto",
        productoId,
      }),
    });

    const data = (await response.json()) as
      | CloudinarySignatureResponse
      | {
          error?: string;
        };

    if (
      !response.ok ||
      !("signature" in data) ||
      !data.signature
    ) {
      throw new Error(
        "error" in data && data.error
          ? data.error
          : "No se pudo preparar la carga.",
      );
    }

    return data;
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
      `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/raw/upload`,
      {
        method: "POST",
        body: formData,
      },
    );

    const data =
      (await response.json()) as CloudinaryUploadResponse;

    if (
      !response.ok ||
      !data.secure_url ||
      !data.public_id
    ) {
      throw new Error(
        data.error?.message ||
          `No se pudo subir ${file.name}.`,
      );
    }

    return {
      archivoUrl: data.secure_url,
      publicId: data.public_id,
    };
  }

  async function guardarDocumento(
    archivoUrl: string,
    publicId: string,
    titulo: string,
    tipo: TipoDocumento,
  ) {
    const response = await fetch(
      `/api/admin/productos/${productoId}/documentos`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          titulo,
          tipo,
          archivoUrl,
          publicId,
          visible: true,
        }),
      },
    );

    const data = (await response.json()) as {
      error?: string;
    };

    if (!response.ok) {
      throw new Error(
        data.error ||
          "El documento subió, pero no pudo guardarse.",
      );
    }
  }

  async function procesarArchivo(file: File) {
    if (file.type !== "application/pdf") {
      setError("Selecciona un archivo PDF válido.");
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setError("El archivo supera el máximo de 20 MB.");
      return;
    }

    setSubiendo(true);
    setError("");

    try {
      const signatureData = await obtenerFirmaCloudinary();

      const subida = await subirACloudinary(
        file,
        signatureData,
      );

      const tituloFinal =
        tituloNuevo.trim() ||
        crearTituloDesdeArchivo(file.name) ||
        `${obtenerNombreTipo(tipoNuevo)} - ${productoNombre}`;

      await guardarDocumento(
        subida.archivoUrl,
        subida.publicId,
        tituloFinal,
        tipoNuevo,
      );

      setTituloNuevo("");
      setTipoNuevo("FICHA_TECNICA");

      if (inputRef.current) {
        inputRef.current.value = "";
      }

      await cargarDocumentos();
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

  async function ejecutarAccion(
    documentoId: number,
    accion:
      | "subir"
      | "bajar"
      | "visibilidad"
      | "editar",
    datos?: {
      titulo?: string;
      tipo?: TipoDocumento;
      visible?: boolean;
    },
  ) {
    setProcesandoId(documentoId);
    setError("");

    try {
      const response = await fetch(
        `/api/admin/productos/${productoId}/documentos`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            documentoId,
            accion,
            ...datos,
          }),
        },
      );

      const data = (await response.json()) as {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(
          data.error ||
            "No se pudo actualizar el documento.",
        );
      }

      await cargarDocumentos();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se pudo actualizar el documento.",
      );
    } finally {
      setProcesandoId(null);
    }
  }

  function empezarEdicion(documento: DocumentoProducto) {
    setEditandoId(documento.id);
    setTituloEditado(documento.titulo);
    setTipoEditado(documento.tipo);
    setError("");
  }

  function cancelarEdicion() {
    setEditandoId(null);
    setTituloEditado("");
    setTipoEditado("OTRO");
  }

  async function guardarEdicion(documentoId: number) {
    if (!tituloEditado.trim()) {
      setError("El título del documento es obligatorio.");
      return;
    }

    await ejecutarAccion(documentoId, "editar", {
      titulo: tituloEditado,
      tipo: tipoEditado,
    });

    cancelarEdicion();
  }

  async function eliminarDocumento(
    documento: DocumentoProducto,
  ) {
    const confirmar = window.confirm(
      `¿Eliminar definitivamente "${documento.titulo}"?`,
    );

    if (!confirmar) {
      return;
    }

    setProcesandoId(documento.id);
    setError("");

    try {
      const response = await fetch(
        `/api/admin/productos/${productoId}/documentos`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            documentoId: documento.id,
          }),
        },
      );

      const data = (await response.json()) as {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(
          data.error ||
            "No se pudo eliminar el documento.",
        );
      }

      await cargarDocumentos();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se pudo eliminar el documento.",
      );
    } finally {
      setProcesandoId(null);
    }
  }

  if (cargando) {
    return (
      <div className="flex min-h-52 items-center justify-center">
        <LoaderCircle
          size={28}
          className="animate-spin text-slate-700"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-800">
              Tipo de documento
            </label>

            <select
              value={tipoNuevo}
              onChange={(event) =>
                setTipoNuevo(
                  event.target.value as TipoDocumento,
                )
              }
              disabled={subiendo}
              className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none focus:border-slate-700 disabled:opacity-60"
            >
              {TIPOS_DOCUMENTO.map((tipo) => (
                <option
                  key={tipo.valor}
                  value={tipo.valor}
                >
                  {tipo.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-800">
              Título
            </label>

            <input
              type="text"
              value={tituloNuevo}
              onChange={(event) =>
                setTituloNuevo(event.target.value)
              }
              disabled={subiendo}
              placeholder="Ejemplo: Ficha técnica generador 1100W"
              className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none focus:border-slate-700 disabled:opacity-60"
            />

            <p className="mt-2 text-xs text-slate-500">
              Puedes dejarlo vacío y se usará el nombre del
              archivo.
            </p>
          </div>
        </div>

        <div
          onClick={() => {
            if (!subiendo) {
              inputRef.current?.click();
            }
          }}
          onDragOver={(event) => {
            event.preventDefault();
          }}
          onDrop={(event) => {
            event.preventDefault();

            if (subiendo) {
              return;
            }

            const file = event.dataTransfer.files[0];

            if (file) {
              void procesarArchivo(file);
            }
          }}
          className="mt-5 flex min-h-52 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white p-8 text-center transition hover:border-slate-500"
        >
          {subiendo ? (
            <>
              <LoaderCircle
                size={38}
                className="animate-spin text-slate-700"
              />

              <p className="mt-4 font-black text-slate-950">
                Subiendo documento…
              </p>

              <p className="mt-2 text-sm text-slate-500">
                No cierres esta página.
              </p>
            </>
          ) : (
            <>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                <FileText size={28} />
              </div>

              <p className="mt-5 text-base font-black text-slate-950">
                Arrastra un PDF aquí
              </p>

              <p className="mt-2 text-sm text-slate-500">
                o presiona para seleccionar el documento
              </p>

              <span className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-bold text-white">
                <Upload size={17} />
                Seleccionar PDF
              </span>

              <p className="mt-4 text-xs text-slate-400">
                Formato PDF. Máximo 20 MB.
              </p>
            </>
          )}

          <input
            ref={inputRef}
            type="file"
            accept="application/pdf,.pdf"
            disabled={subiendo}
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];

              if (file) {
                void procesarArchivo(file);
              }
            }}
          />
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      {documentos.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center">
          <FileText
            size={35}
            className="mx-auto text-slate-400"
          />

          <p className="mt-4 font-bold text-slate-800">
            Este producto todavía no tiene documentos.
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Sube una ficha técnica, manual, catálogo o curva de
            rendimiento.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {documentos.map((documento, index) => {
            const estaProcesando =
              procesandoId === documento.id;

            const estaEditando =
              editandoId === documento.id;

            return (
              <article
                key={documento.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
                  <div className="flex min-w-0 flex-1 items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                      <FileText size={24} />
                    </div>

                    <div className="min-w-0 flex-1">
                      {estaEditando ? (
                        <div className="grid gap-3 md:grid-cols-2">
                          <input
                            type="text"
                            value={tituloEditado}
                            onChange={(event) =>
                              setTituloEditado(
                                event.target.value,
                              )
                            }
                            className="h-10 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-slate-700"
                          />

                          <select
                            value={tipoEditado}
                            onChange={(event) =>
                              setTipoEditado(
                                event.target
                                  .value as TipoDocumento,
                              )
                            }
                            className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none focus:border-slate-700"
                          >
                            {TIPOS_DOCUMENTO.map((tipo) => (
                              <option
                                key={tipo.valor}
                                value={tipo.valor}
                              >
                                {tipo.nombre}
                              </option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        <>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="truncate font-black text-slate-950">
                              {documento.titulo}
                            </h3>

                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                              {obtenerNombreTipo(
                                documento.tipo,
                              )}
                            </span>

                            <span
                              className={[
                                "rounded-full px-3 py-1 text-xs font-bold",
                                documento.visible
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-amber-50 text-amber-700",
                              ].join(" ")}
                            >
                              {documento.visible
                                ? "Visible"
                                : "Oculto"}
                            </span>
                          </div>

                          <p className="mt-2 text-xs text-slate-500">
                            Documento {index + 1}
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {estaEditando ? (
                      <>
                        <button
                          type="button"
                          disabled={estaProcesando}
                          onClick={() =>
                            void guardarEdicion(documento.id)
                          }
                          className="inline-flex h-10 items-center justify-center rounded-xl border border-emerald-200 px-3 text-emerald-700 hover:bg-emerald-50 disabled:opacity-40"
                          title="Guardar"
                        >
                          {estaProcesando ? (
                            <LoaderCircle
                              size={17}
                              className="animate-spin"
                            />
                          ) : (
                            <Save size={17} />
                          )}
                        </button>

                        <button
                          type="button"
                          disabled={estaProcesando}
                          onClick={cancelarEdicion}
                          className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-300 px-3 text-slate-600 hover:bg-slate-50"
                          title="Cancelar"
                        >
                          <X size={17} />
                        </button>
                      </>
                    ) : (
                      <>
                        <a
                          href={documento.archivoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-300 px-3 text-slate-700 hover:bg-slate-50"
                          title="Abrir documento"
                        >
                          <Download size={17} />
                        </a>

                        <button
                          type="button"
                          disabled={
                            estaProcesando || index === 0
                          }
                          onClick={() =>
                            void ejecutarAccion(
                              documento.id,
                              "subir",
                            )
                          }
                          className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-300 px-3 hover:bg-slate-50 disabled:opacity-30"
                          title="Mover arriba"
                        >
                          <ArrowUp size={17} />
                        </button>

                        <button
                          type="button"
                          disabled={
                            estaProcesando ||
                            index === documentos.length - 1
                          }
                          onClick={() =>
                            void ejecutarAccion(
                              documento.id,
                              "bajar",
                            )
                          }
                          className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-300 px-3 hover:bg-slate-50 disabled:opacity-30"
                          title="Mover abajo"
                        >
                          <ArrowDown size={17} />
                        </button>

                        <button
                          type="button"
                          disabled={estaProcesando}
                          onClick={() =>
                            void ejecutarAccion(
                              documento.id,
                              "visibilidad",
                              {
                                visible:
                                  !documento.visible,
                              },
                            )
                          }
                          className="inline-flex h-10 items-center justify-center rounded-xl border border-amber-200 px-3 text-amber-700 hover:bg-amber-50 disabled:opacity-30"
                          title={
                            documento.visible
                              ? "Ocultar documento"
                              : "Mostrar documento"
                          }
                        >
                          {documento.visible ? (
                            <EyeOff size={17} />
                          ) : (
                            <Eye size={17} />
                          )}
                        </button>

                        <button
                          type="button"
                          disabled={estaProcesando}
                          onClick={() =>
                            empezarEdicion(documento)
                          }
                          className="inline-flex h-10 items-center justify-center rounded-xl border border-blue-200 px-3 text-blue-700 hover:bg-blue-50 disabled:opacity-30"
                          title="Editar documento"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          type="button"
                          disabled={estaProcesando}
                          onClick={() =>
                            void eliminarDocumento(documento)
                          }
                          className="inline-flex h-10 items-center justify-center rounded-xl border border-red-200 px-3 text-red-600 hover:bg-red-50 disabled:opacity-30"
                          title="Eliminar documento"
                        >
                          {estaProcesando ? (
                            <LoaderCircle
                              size={17}
                              className="animate-spin"
                            />
                          ) : (
                            <Trash2 size={17} />
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}