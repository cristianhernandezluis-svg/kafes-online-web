"use client";

import {
  ArrowDown,
  ArrowUp,
  LoaderCircle,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

type Especificacion = {
  id: number;
  productoId: number;
  nombre: string;
  valor: string;
  orden: number;
};

type ProductSpecificationManagerProps = {
  productoId: number;
};

export default function ProductSpecificationManager({
  productoId,
}: ProductSpecificationManagerProps) {
  const [especificaciones, setEspecificaciones] = useState<
    Especificacion[]
  >([]);

  const [nombre, setNombre] = useState("");
  const [valor, setValor] = useState("");

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [procesandoId, setProcesandoId] = useState<
    number | null
  >(null);

  const [editandoId, setEditandoId] = useState<
    number | null
  >(null);

  const [nombreEditado, setNombreEditado] = useState("");
  const [valorEditado, setValorEditado] = useState("");
  const [error, setError] = useState("");

  async function cargarEspecificaciones() {
    try {
      const response = await fetch(
        `/api/admin/productos/${productoId}/especificaciones`,
        {
          cache: "no-store",
        },
      );

      const data = (await response.json()) as
        | Especificacion[]
        | {
            error?: string;
          };

      if (!response.ok || !Array.isArray(data)) {
        throw new Error(
          !Array.isArray(data) && data.error
            ? data.error
            : "No se pudieron cargar las especificaciones.",
        );
      }

      setEspecificaciones(
        [...data].sort((a, b) => a.orden - b.orden),
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se pudieron cargar las especificaciones.",
      );
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    void cargarEspecificaciones();
  }, [productoId]);

  async function agregarEspecificacion() {
    if (!nombre.trim() || !valor.trim()) {
      setError(
        "Escribe el nombre de la característica y su valor.",
      );
      return;
    }

    setGuardando(true);
    setError("");

    try {
      const response = await fetch(
        `/api/admin/productos/${productoId}/especificaciones`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nombre,
            valor,
          }),
        },
      );

      const data = (await response.json()) as {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(
          data.error || "No se pudo agregar la especificación.",
        );
      }

      setNombre("");
      setValor("");

      await cargarEspecificaciones();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se pudo agregar la especificación.",
      );
    } finally {
      setGuardando(false);
    }
  }

  function empezarEdicion(especificacion: Especificacion) {
    setEditandoId(especificacion.id);
    setNombreEditado(especificacion.nombre);
    setValorEditado(especificacion.valor);
    setError("");
  }

  function cancelarEdicion() {
    setEditandoId(null);
    setNombreEditado("");
    setValorEditado("");
  }

  async function guardarEdicion(especificacionId: number) {
    if (!nombreEditado.trim() || !valorEditado.trim()) {
      setError("El nombre y el valor son obligatorios.");
      return;
    }

    setProcesandoId(especificacionId);
    setError("");

    try {
      const response = await fetch(
        `/api/admin/productos/${productoId}/especificaciones`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            especificacionId,
            accion: "editar",
            nombre: nombreEditado,
            valor: valorEditado,
          }),
        },
      );

      const data = (await response.json()) as {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(
          data.error || "No se pudo guardar la especificación.",
        );
      }

      cancelarEdicion();
      await cargarEspecificaciones();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se pudo guardar la especificación.",
      );
    } finally {
      setProcesandoId(null);
    }
  }

  async function moverEspecificacion(
    especificacionId: number,
    accion: "subir" | "bajar",
  ) {
    setProcesandoId(especificacionId);
    setError("");

    try {
      const response = await fetch(
        `/api/admin/productos/${productoId}/especificaciones`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            especificacionId,
            accion,
          }),
        },
      );

      const data = (await response.json()) as {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(
          data.error || "No se pudo cambiar el orden.",
        );
      }

      await cargarEspecificaciones();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se pudo cambiar el orden.",
      );
    } finally {
      setProcesandoId(null);
    }
  }

  async function eliminarEspecificacion(
    especificacion: Especificacion,
  ) {
    const confirmar = window.confirm(
      `¿Eliminar "${especificacion.nombre}" de la ficha técnica?`,
    );

    if (!confirmar) {
      return;
    }

    setProcesandoId(especificacion.id);
    setError("");

    try {
      const response = await fetch(
        `/api/admin/productos/${productoId}/especificaciones`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            especificacionId: especificacion.id,
          }),
        },
      );

      const data = (await response.json()) as {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(
          data.error || "No se pudo eliminar la especificación.",
        );
      }

      await cargarEspecificaciones();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se pudo eliminar la especificación.",
      );
    } finally {
      setProcesandoId(null);
    }
  }

  if (cargando) {
    return (
      <div className="flex min-h-52 items-center justify-center">
        <LoaderCircle
          className="animate-spin text-slate-700"
          size={28}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto]">
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-800">
              Característica
            </label>

            <input
              type="text"
              value={nombre}
              onChange={(event) => setNombre(event.target.value)}
              placeholder="Ejemplo: Potencia"
              className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none transition focus:border-slate-700"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-800">
              Valor
            </label>

            <input
              type="text"
              value={valor}
              onChange={(event) => setValor(event.target.value)}
              placeholder="Ejemplo: 2 HP"
              className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none transition focus:border-slate-700"
            />
          </div>

          <button
            type="button"
            disabled={guardando}
            onClick={() => void agregarEspecificacion()}
            className="mt-auto inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
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

        <p className="mt-4 text-xs leading-5 text-slate-500">
          Ejemplos: potencia, voltaje, caudal, altura máxima,
          peso, velocidad, diámetro de salida y grado de
          protección.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      {especificaciones.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center">
          <p className="font-bold text-slate-800">
            Este producto todavía no tiene especificaciones.
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Agrega la primera característica usando el formulario
            superior.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200">
          <div className="hidden grid-cols-[70px_1fr_1fr_190px] gap-4 bg-slate-950 px-5 py-3 text-xs font-black uppercase tracking-wide text-white md:grid">
            <div>Orden</div>
            <div>Característica</div>
            <div>Valor</div>
            <div className="text-right">Acciones</div>
          </div>

          <div className="divide-y divide-slate-200">
            {especificaciones.map(
              (especificacion, index) => {
                const estaProcesando =
                  procesandoId === especificacion.id;

                const estaEditando =
                  editandoId === especificacion.id;

                return (
                  <article
                    key={especificacion.id}
                    className="grid gap-4 bg-white p-5 md:grid-cols-[70px_1fr_1fr_190px] md:items-center"
                  >
                    <div>
                      <span className="inline-flex h-9 min-w-9 items-center justify-center rounded-xl bg-slate-100 px-3 text-sm font-black text-slate-700">
                        {index + 1}
                      </span>
                    </div>

                    {estaEditando ? (
                      <>
                        <input
                          type="text"
                          value={nombreEditado}
                          onChange={(event) =>
                            setNombreEditado(
                              event.target.value,
                            )
                          }
                          className="h-10 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-slate-700"
                        />

                        <input
                          type="text"
                          value={valorEditado}
                          onChange={(event) =>
                            setValorEditado(
                              event.target.value,
                            )
                          }
                          className="h-10 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-slate-700"
                        />
                      </>
                    ) : (
                      <>
                        <div className="font-bold text-slate-900">
                          {especificacion.nombre}
                        </div>

                        <div className="text-sm text-slate-600">
                          {especificacion.valor}
                        </div>
                      </>
                    )}

                    <div className="flex flex-wrap justify-end gap-2">
                      {estaEditando ? (
                        <>
                          <button
                            type="button"
                            disabled={estaProcesando}
                            onClick={() =>
                              void guardarEdicion(
                                especificacion.id,
                              )
                            }
                            className="inline-flex h-10 items-center justify-center rounded-xl border border-emerald-200 px-3 text-emerald-700 transition hover:bg-emerald-50 disabled:opacity-40"
                            title="Guardar cambios"
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
                            className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-300 px-3 text-slate-600 transition hover:bg-slate-50 disabled:opacity-40"
                            title="Cancelar"
                          >
                            <X size={17} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            disabled={
                              index === 0 || estaProcesando
                            }
                            onClick={() =>
                              void moverEspecificacion(
                                especificacion.id,
                                "subir",
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
                              index ===
                                especificaciones.length - 1 ||
                              estaProcesando
                            }
                            onClick={() =>
                              void moverEspecificacion(
                                especificacion.id,
                                "bajar",
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
                              empezarEdicion(especificacion)
                            }
                            className="inline-flex h-10 items-center justify-center rounded-xl border border-blue-200 px-3 text-blue-700 transition hover:bg-blue-50 disabled:opacity-30"
                            title="Editar"
                          >
                            <Pencil size={17} />
                          </button>

                          <button
                            type="button"
                            disabled={estaProcesando}
                            onClick={() =>
                              void eliminarEspecificacion(
                                especificacion,
                              )
                            }
                            className="inline-flex h-10 items-center justify-center rounded-xl border border-red-200 px-3 text-red-600 transition hover:bg-red-50 disabled:opacity-30"
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
                        </>
                      )}
                    </div>
                  </article>
                );
              },
            )}
          </div>
        </div>
      )}
    </div>
  );
}