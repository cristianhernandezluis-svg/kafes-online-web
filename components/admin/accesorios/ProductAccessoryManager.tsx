"use client";

import {
  ArrowDown,
  ArrowUp,
  ImageIcon,
  LoaderCircle,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

type Accesorio = {
  id: number;
  productoId: number;
  nombre: string;
  descripcion: string | null;
  imagenUrl: string | null;
  incluido: boolean;
  orden: number;
};

type ProductAccessoryManagerProps = {
  productoId: number;
};

export default function ProductAccessoryManager({
  productoId,
}: ProductAccessoryManagerProps) {
  const [accesorios, setAccesorios] = useState<
    Accesorio[]
  >([]);

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] =
    useState("");
  const [imagenUrl, setImagenUrl] =
    useState("");
  const [incluido, setIncluido] =
    useState(true);

  const [cargando, setCargando] =
    useState(true);
  const [guardando, setGuardando] =
    useState(false);
  const [procesandoId, setProcesandoId] =
    useState<number | null>(null);

  const [editandoId, setEditandoId] =
    useState<number | null>(null);

  const [nombreEditado, setNombreEditado] =
    useState("");
  const [
    descripcionEditada,
    setDescripcionEditada,
  ] = useState("");
  const [
    imagenUrlEditada,
    setImagenUrlEditada,
  ] = useState("");
  const [
    incluidoEditado,
    setIncluidoEditado,
  ] = useState(true);

  const [error, setError] = useState("");

  async function cargarAccesorios() {
    try {
      setError("");

      const response = await fetch(
        `/api/admin/productos/${productoId}/accesorios`,
        {
          cache: "no-store",
        }
      );

      const data = (await response.json()) as
        | Accesorio[]
        | {
            error?: string;
          };

      if (!response.ok || !Array.isArray(data)) {
        throw new Error(
          !Array.isArray(data) && data.error
            ? data.error
            : "No se pudieron cargar los accesorios."
        );
      }

      setAccesorios(
        [...data].sort(
          (a, b) => a.orden - b.orden
        )
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se pudieron cargar los accesorios."
      );
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    void cargarAccesorios();
  }, [productoId]);

  async function agregarAccesorio() {
    if (!nombre.trim()) {
      setError(
        "Escribe el nombre del accesorio."
      );
      return;
    }

    setGuardando(true);
    setError("");

    try {
      const response = await fetch(
        `/api/admin/productos/${productoId}/accesorios`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nombre,
            descripcion,
            imagenUrl,
            incluido,
          }),
        }
      );

      const data = (await response.json()) as {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(
          data.error ||
            "No se pudo agregar el accesorio."
        );
      }

      setNombre("");
      setDescripcion("");
      setImagenUrl("");
      setIncluido(true);

      await cargarAccesorios();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se pudo agregar el accesorio."
      );
    } finally {
      setGuardando(false);
    }
  }

  function empezarEdicion(
    accesorio: Accesorio
  ) {
    setEditandoId(accesorio.id);
    setNombreEditado(accesorio.nombre);
    setDescripcionEditada(
      accesorio.descripcion ?? ""
    );
    setImagenUrlEditada(
      accesorio.imagenUrl ?? ""
    );
    setIncluidoEditado(
      accesorio.incluido
    );
    setError("");
  }

  function cancelarEdicion() {
    setEditandoId(null);
    setNombreEditado("");
    setDescripcionEditada("");
    setImagenUrlEditada("");
    setIncluidoEditado(true);
  }

  async function guardarEdicion(
    accesorioId: number
  ) {
    if (!nombreEditado.trim()) {
      setError(
        "El nombre del accesorio es obligatorio."
      );
      return;
    }

    setProcesandoId(accesorioId);
    setError("");

    try {
      const response = await fetch(
        `/api/admin/productos/${productoId}/accesorios`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            accesorioId,
            accion: "editar",
            nombre: nombreEditado,
            descripcion: descripcionEditada,
            imagenUrl: imagenUrlEditada,
            incluido: incluidoEditado,
          }),
        }
      );

      const data = (await response.json()) as {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(
          data.error ||
            "No se pudo guardar el accesorio."
        );
      }

      cancelarEdicion();
      await cargarAccesorios();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se pudo guardar el accesorio."
      );
    } finally {
      setProcesandoId(null);
    }
  }

  async function moverAccesorio(
    accesorioId: number,
    accion: "subir" | "bajar"
  ) {
    setProcesandoId(accesorioId);
    setError("");

    try {
      const response = await fetch(
        `/api/admin/productos/${productoId}/accesorios`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            accesorioId,
            accion,
          }),
        }
      );

      const data = (await response.json()) as {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(
          data.error ||
            "No se pudo cambiar el orden."
        );
      }

      await cargarAccesorios();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se pudo cambiar el orden."
      );
    } finally {
      setProcesandoId(null);
    }
  }

  async function eliminarAccesorio(
    accesorio: Accesorio
  ) {
    const confirmar = window.confirm(
      `¿Eliminar el accesorio "${accesorio.nombre}"?`
    );

    if (!confirmar) {
      return;
    }

    setProcesandoId(accesorio.id);
    setError("");

    try {
      const response = await fetch(
        `/api/admin/productos/${productoId}/accesorios`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            accesorioId: accesorio.id,
          }),
        }
      );

      const data = (await response.json()) as {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(
          data.error ||
            "No se pudo eliminar el accesorio."
        );
      }

      await cargarAccesorios();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se pudo eliminar el accesorio."
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
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-800">
              Nombre del accesorio
            </label>

            <input
              type="text"
              value={nombre}
              onChange={(event) =>
                setNombre(event.target.value)
              }
              placeholder="Ejemplo: Batería de 21 V"
              className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none transition focus:border-slate-700"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-800">
              Descripción
            </label>

            <input
              type="text"
              value={descripcion}
              onChange={(event) =>
                setDescripcion(event.target.value)
              }
              placeholder="Ejemplo: Incluye 2 unidades"
              className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none transition focus:border-slate-700"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-800">
              URL de la imagen
            </label>

            <input
              type="url"
              value={imagenUrl}
              onChange={(event) =>
                setImagenUrl(event.target.value)
              }
              placeholder="https://res.cloudinary.com/..."
              className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none transition focus:border-slate-700"
            />
          </div>

          <div className="flex flex-wrap items-end gap-4">
            <label className="flex h-11 flex-1 cursor-pointer items-center gap-3 rounded-xl border border-slate-300 bg-white px-4">
              <input
                type="checkbox"
                checked={incluido}
                onChange={(event) =>
                  setIncluido(
                    event.target.checked
                  )
                }
                className="h-4 w-4 rounded border-slate-300"
              />

              <span className="text-sm font-bold text-slate-700">
                Incluido con el producto
              </span>
            </label>

            <button
              type="button"
              disabled={guardando}
              onClick={() =>
                void agregarAccesorio()
              }
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {guardando ? (
                <LoaderCircle
                  size={17}
                  className="animate-spin"
                />
              ) : (
                <Plus size={17} />
              )}

              Agregar
            </button>
          </div>
        </div>

        <p className="mt-4 text-xs leading-5 text-slate-500">
          Ejemplos: baterías, cargador, cadena,
          espada, maletín, llaves, discos,
          mangueras o manual.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      {accesorios.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center">
          <ImageIcon
            size={34}
            className="mx-auto text-slate-400"
          />

          <p className="mt-4 font-bold text-slate-800">
            Este producto todavía no tiene
            accesorios registrados.
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Agrega los elementos que recibirá el
            cliente con su compra.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {accesorios.map(
            (accesorio, indice) => {
              const estaEditando =
                editandoId === accesorio.id;

              const estaProcesando =
                procesandoId === accesorio.id;

              return (
                <article
                  key={accesorio.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5"
                >
                  {estaEditando ? (
                    <div className="grid gap-4 lg:grid-cols-2">
                      <input
                        type="text"
                        value={nombreEditado}
                        onChange={(event) =>
                          setNombreEditado(
                            event.target.value
                          )
                        }
                        className="h-11 rounded-xl border border-slate-300 px-4 text-sm outline-none focus:border-slate-700"
                      />

                      <input
                        type="text"
                        value={descripcionEditada}
                        onChange={(event) =>
                          setDescripcionEditada(
                            event.target.value
                          )
                        }
                        placeholder="Descripción"
                        className="h-11 rounded-xl border border-slate-300 px-4 text-sm outline-none focus:border-slate-700"
                      />

                      <input
                        type="url"
                        value={imagenUrlEditada}
                        onChange={(event) =>
                          setImagenUrlEditada(
                            event.target.value
                          )
                        }
                        placeholder="URL de la imagen"
                        className="h-11 rounded-xl border border-slate-300 px-4 text-sm outline-none focus:border-slate-700"
                      />

                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <label className="flex items-center gap-3 text-sm font-bold text-slate-700">
                          <input
                            type="checkbox"
                            checked={
                              incluidoEditado
                            }
                            onChange={(event) =>
                              setIncluidoEditado(
                                event.target.checked
                              )
                            }
                            className="h-4 w-4 rounded border-slate-300"
                          />

                          Incluido
                        </label>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            disabled={estaProcesando}
                            onClick={() =>
                              void guardarEdicion(
                                accesorio.id
                              )
                            }
                            className="inline-flex h-10 items-center justify-center rounded-xl border border-emerald-200 px-3 text-emerald-700 transition hover:bg-emerald-50 disabled:opacity-40"
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
                            onClick={
                              cancelarEdicion
                            }
                            className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-300 px-3 text-slate-600 transition hover:bg-slate-50"
                            title="Cancelar"
                          >
                            <X size={17} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-5 md:flex-row md:items-center">
                      <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                        {accesorio.imagenUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={
                              accesorio.imagenUrl
                            }
                            alt={accesorio.nombre}
                            className="h-full w-full object-contain p-1"
                          />
                        ) : (
                          <ImageIcon
                            size={25}
                            className="text-slate-400"
                          />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
                            {indice + 1}
                          </span>

                          <h3 className="font-black text-slate-950">
                            {accesorio.nombre}
                          </h3>

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-black ${
                              accesorio.incluido
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {accesorio.incluido
                              ? "INCLUIDO"
                              : "OPCIONAL"}
                          </span>
                        </div>

                        {accesorio.descripcion && (
                          <p className="mt-2 text-sm leading-6 text-slate-500">
                            {
                              accesorio.descripcion
                            }
                          </p>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2 md:justify-end">
                        <button
                          type="button"
                          disabled={
                            indice === 0 ||
                            estaProcesando
                          }
                          onClick={() =>
                            void moverAccesorio(
                              accesorio.id,
                              "subir"
                            )
                          }
                          className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-300 px-3 transition hover:bg-slate-50 disabled:opacity-30"
                          title="Mover arriba"
                        >
                          <ArrowUp size={17} />
                        </button>

                        <button
                          type="button"
                          disabled={
                            indice ===
                              accesorios.length -
                                1 ||
                            estaProcesando
                          }
                          onClick={() =>
                            void moverAccesorio(
                              accesorio.id,
                              "bajar"
                            )
                          }
                          className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-300 px-3 transition hover:bg-slate-50 disabled:opacity-30"
                          title="Mover abajo"
                        >
                          <ArrowDown size={17} />
                        </button>

                        <button
                          type="button"
                          disabled={estaProcesando}
                          onClick={() =>
                            empezarEdicion(
                              accesorio
                            )
                          }
                          className="inline-flex h-10 items-center justify-center rounded-xl border border-blue-200 px-3 text-blue-700 transition hover:bg-blue-50"
                          title="Editar"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          type="button"
                          disabled={estaProcesando}
                          onClick={() =>
                            void eliminarAccesorio(
                              accesorio
                            )
                          }
                          className="inline-flex h-10 items-center justify-center rounded-xl border border-red-200 px-3 text-red-600 transition hover:bg-red-50"
                          title="Eliminar"
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
                      </div>
                    </div>
                  )}
                </article>
              );
            }
          )}
        </div>
      )}
    </div>
  );
}