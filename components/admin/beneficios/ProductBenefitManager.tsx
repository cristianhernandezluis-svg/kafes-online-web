"use client";

import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  LoaderCircle,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

type Beneficio = {
  id: number;
  productoId: number;
  titulo: string;
  descripcion: string | null;
  icono: string | null;
  orden: number;
};

type ProductBenefitManagerProps = {
  productoId: number;
};

const OPCIONES_ICONO = [
  {
    valor: "check",
    nombre: "Beneficio general",
  },
  {
    valor: "bateria",
    nombre: "Batería",
  },
  {
    valor: "potencia",
    nombre: "Potencia",
  },
  {
    valor: "garantia",
    nombre: "Garantía",
  },
  {
    valor: "envio",
    nombre: "Envío",
  },
  {
    valor: "accesorios",
    nombre: "Accesorios incluidos",
  },
];

function obtenerNombreIcono(icono: string | null) {
  return (
    OPCIONES_ICONO.find(
      (opcion) => opcion.valor === icono
    )?.nombre ?? "Beneficio general"
  );
}

export default function ProductBenefitManager({
  productoId,
}: ProductBenefitManagerProps) {
  const [beneficios, setBeneficios] = useState<
    Beneficio[]
  >([]);

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] =
    useState("");
  const [icono, setIcono] = useState("check");

  const [cargando, setCargando] =
    useState(true);
  const [guardando, setGuardando] =
    useState(false);
  const [procesandoId, setProcesandoId] =
    useState<number | null>(null);

  const [editandoId, setEditandoId] =
    useState<number | null>(null);

  const [tituloEditado, setTituloEditado] =
    useState("");
  const [
    descripcionEditada,
    setDescripcionEditada,
  ] = useState("");
  const [iconoEditado, setIconoEditado] =
    useState("check");

  const [error, setError] = useState("");

  async function cargarBeneficios() {
    try {
      setError("");

      const response = await fetch(
        `/api/admin/productos/${productoId}/beneficios`,
        {
          cache: "no-store",
        }
      );

      const data = (await response.json()) as
        | Beneficio[]
        | {
            error?: string;
          };

      if (!response.ok || !Array.isArray(data)) {
        throw new Error(
          !Array.isArray(data) && data.error
            ? data.error
            : "No se pudieron cargar los beneficios."
        );
      }

      setBeneficios(
        [...data].sort(
          (a, b) => a.orden - b.orden
        )
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se pudieron cargar los beneficios."
      );
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    void cargarBeneficios();
  }, [productoId]);

  async function agregarBeneficio() {
    if (!titulo.trim()) {
      setError(
        "Escribe el título del beneficio."
      );
      return;
    }

    setGuardando(true);
    setError("");

    try {
      const response = await fetch(
        `/api/admin/productos/${productoId}/beneficios`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            titulo,
            descripcion,
            icono,
          }),
        }
      );

      const data = (await response.json()) as {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(
          data.error ||
            "No se pudo agregar el beneficio."
        );
      }

      setTitulo("");
      setDescripcion("");
      setIcono("check");

      await cargarBeneficios();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se pudo agregar el beneficio."
      );
    } finally {
      setGuardando(false);
    }
  }

  function empezarEdicion(
    beneficio: Beneficio
  ) {
    setEditandoId(beneficio.id);
    setTituloEditado(beneficio.titulo);
    setDescripcionEditada(
      beneficio.descripcion ?? ""
    );
    setIconoEditado(
      beneficio.icono ?? "check"
    );
    setError("");
  }

  function cancelarEdicion() {
    setEditandoId(null);
    setTituloEditado("");
    setDescripcionEditada("");
    setIconoEditado("check");
  }

  async function guardarEdicion(
    beneficioId: number
  ) {
    if (!tituloEditado.trim()) {
      setError(
        "El título del beneficio es obligatorio."
      );
      return;
    }

    setProcesandoId(beneficioId);
    setError("");

    try {
      const response = await fetch(
        `/api/admin/productos/${productoId}/beneficios`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            beneficioId,
            accion: "editar",
            titulo: tituloEditado,
            descripcion: descripcionEditada,
            icono: iconoEditado,
          }),
        }
      );

      const data = (await response.json()) as {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(
          data.error ||
            "No se pudo guardar el beneficio."
        );
      }

      cancelarEdicion();
      await cargarBeneficios();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se pudo guardar el beneficio."
      );
    } finally {
      setProcesandoId(null);
    }
  }

  async function moverBeneficio(
    beneficioId: number,
    accion: "subir" | "bajar"
  ) {
    setProcesandoId(beneficioId);
    setError("");

    try {
      const response = await fetch(
        `/api/admin/productos/${productoId}/beneficios`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            beneficioId,
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

      await cargarBeneficios();
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

  async function eliminarBeneficio(
    beneficio: Beneficio
  ) {
    const confirmar = window.confirm(
      `¿Eliminar el beneficio "${beneficio.titulo}"?`
    );

    if (!confirmar) {
      return;
    }

    setProcesandoId(beneficio.id);
    setError("");

    try {
      const response = await fetch(
        `/api/admin/productos/${productoId}/beneficios`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            beneficioId: beneficio.id,
          }),
        }
      );

      const data = (await response.json()) as {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(
          data.error ||
            "No se pudo eliminar el beneficio."
        );
      }

      await cargarBeneficios();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se pudo eliminar el beneficio."
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
        <div className="grid gap-4 lg:grid-cols-[1fr_1fr_220px_auto]">
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-800">
              Título
            </label>

            <input
              type="text"
              value={titulo}
              onChange={(event) =>
                setTitulo(event.target.value)
              }
              placeholder="Ejemplo: Incluye 2 baterías"
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
              placeholder="Ejemplo: Mayor autonomía de trabajo"
              className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none transition focus:border-slate-700"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-800">
              Tipo de beneficio
            </label>

            <select
              value={icono}
              onChange={(event) =>
                setIcono(event.target.value)
              }
              className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none transition focus:border-slate-700"
            >
              {OPCIONES_ICONO.map((opcion) => (
                <option
                  key={opcion.valor}
                  value={opcion.valor}
                >
                  {opcion.nombre}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            disabled={guardando}
            onClick={() =>
              void agregarBeneficio()
            }
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
          Ejemplos: incluye dos baterías, motor
          potente, garantía, accesorios incluidos,
          envío nacional o uso profesional.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      {beneficios.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center">
          <CheckCircle2
            size={34}
            className="mx-auto text-slate-400"
          />

          <p className="mt-4 font-bold text-slate-800">
            Este producto todavía no tiene
            beneficios.
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Agrega los principales argumentos de
            compra usando el formulario superior.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200">
          <div className="hidden grid-cols-[70px_1fr_1fr_180px_190px] gap-4 bg-slate-950 px-5 py-3 text-xs font-black uppercase tracking-wide text-white lg:grid">
            <div>Orden</div>
            <div>Beneficio</div>
            <div>Descripción</div>
            <div>Tipo</div>
            <div className="text-right">
              Acciones
            </div>
          </div>

          <div className="divide-y divide-slate-200">
            {beneficios.map(
              (beneficio, indice) => {
                const estaProcesando =
                  procesandoId === beneficio.id;

                const estaEditando =
                  editandoId === beneficio.id;

                return (
                  <article
                    key={beneficio.id}
                    className="grid gap-4 bg-white p-5 lg:grid-cols-[70px_1fr_1fr_180px_190px] lg:items-center"
                  >
                    <div>
                      <span className="inline-flex h-9 min-w-9 items-center justify-center rounded-xl bg-slate-100 px-3 text-sm font-black text-slate-700">
                        {indice + 1}
                      </span>
                    </div>

                    {estaEditando ? (
                      <>
                        <input
                          type="text"
                          value={tituloEditado}
                          onChange={(event) =>
                            setTituloEditado(
                              event.target.value
                            )
                          }
                          className="h-10 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-slate-700"
                        />

                        <input
                          type="text"
                          value={
                            descripcionEditada
                          }
                          onChange={(event) =>
                            setDescripcionEditada(
                              event.target.value
                            )
                          }
                          className="h-10 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-slate-700"
                        />

                        <select
                          value={iconoEditado}
                          onChange={(event) =>
                            setIconoEditado(
                              event.target.value
                            )
                          }
                          className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none focus:border-slate-700"
                        >
                          {OPCIONES_ICONO.map(
                            (opcion) => (
                              <option
                                key={opcion.valor}
                                value={opcion.valor}
                              >
                                {opcion.nombre}
                              </option>
                            )
                          )}
                        </select>
                      </>
                    ) : (
                      <>
                        <div className="font-bold text-slate-900">
                          {beneficio.titulo}
                        </div>

                        <div className="text-sm leading-6 text-slate-600">
                          {beneficio.descripcion ||
                            "Sin descripción"}
                        </div>

                        <div className="text-sm font-semibold text-slate-600">
                          {obtenerNombreIcono(
                            beneficio.icono
                          )}
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
                                beneficio.id
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
                            onClick={
                              cancelarEdicion
                            }
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
                              indice === 0 ||
                              estaProcesando
                            }
                            onClick={() =>
                              void moverBeneficio(
                                beneficio.id,
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
                                beneficios.length -
                                  1 ||
                              estaProcesando
                            }
                            onClick={() =>
                              void moverBeneficio(
                                beneficio.id,
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
                                beneficio
                              )
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
                              void eliminarBeneficio(
                                beneficio
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
              }
            )}
          </div>
        </div>
      )}
    </div>
  );
}