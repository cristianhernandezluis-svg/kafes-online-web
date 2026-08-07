"use client";

import {
  ArrowDown,
  ArrowUp,
  LoaderCircle,
  Pencil,
  Plus,
  Save,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

import SingleImageUploader from "@/components/admin/media/SingleImageUploader";

type Asesor = {
  id: number;
  nombre: string;
  cargo: string | null;
  telefono: string;
  imagenUrl: string | null;
  imagenPublicId: string | null;
  activo: boolean;
  orden: number;
};

export default function WhatsAppAdvisorManager() {
  const [asesores, setAsesores] = useState<Asesor[]>([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [procesandoId, setProcesandoId] =
    useState<number | null>(null);
  const [editandoId, setEditandoId] =
    useState<number | null>(null);
  const [error, setError] = useState("");

  const [nombre, setNombre] = useState("");
  const [cargo, setCargo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [imagenUrl, setImagenUrl] = useState("");
  const [imagenPublicId, setImagenPublicId] =
    useState("");
  const [activo, setActivo] = useState(true);

  const [nombreEditado, setNombreEditado] =
    useState("");
  const [cargoEditado, setCargoEditado] =
    useState("");
  const [telefonoEditado, setTelefonoEditado] =
    useState("");
  const [imagenUrlEditada, setImagenUrlEditada] =
    useState("");
  const [
    imagenPublicIdEditada,
    setImagenPublicIdEditada,
  ] = useState("");
  const [activoEditado, setActivoEditado] =
    useState(true);

  async function cargarAsesores() {
    try {
      setError("");

      const response = await fetch(
        "/api/admin/configuracion/asesores-whatsapp",
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok || !Array.isArray(data)) {
        throw new Error(
          data?.error ??
            "No se pudieron cargar los asesores."
        );
      }

      setAsesores(data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se pudieron cargar los asesores."
      );
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    void cargarAsesores();
  }, []);

  async function agregarAsesor() {
    if (!nombre.trim()) {
      setError("Escribe el nombre del asesor.");
      return;
    }

    if (!telefono.trim()) {
      setError(
        "Escribe el número de WhatsApp."
      );
      return;
    }

    setGuardando(true);
    setError("");

    try {
      const response = await fetch(
        "/api/admin/configuracion/asesores-whatsapp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nombre,
            cargo,
            telefono,
            imagenUrl,
            imagenPublicId,
            activo,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ??
            "No se pudo crear el asesor."
        );
      }

      setNombre("");
      setCargo("");
      setTelefono("");
      setImagenUrl("");
      setImagenPublicId("");
      setActivo(true);

      await cargarAsesores();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se pudo crear el asesor."
      );
    } finally {
      setGuardando(false);
    }
  }

  function empezarEdicion(asesor: Asesor) {
    setEditandoId(asesor.id);
    setNombreEditado(asesor.nombre);
    setCargoEditado(asesor.cargo ?? "");
    setTelefonoEditado(asesor.telefono);
    setImagenUrlEditada(
      asesor.imagenUrl ?? ""
    );
    setImagenPublicIdEditada(
      asesor.imagenPublicId ?? ""
    );
    setActivoEditado(asesor.activo);
    setError("");
  }

  function cancelarEdicion() {
    setEditandoId(null);
    setNombreEditado("");
    setCargoEditado("");
    setTelefonoEditado("");
    setImagenUrlEditada("");
    setImagenPublicIdEditada("");
    setActivoEditado(true);
  }

  async function guardarEdicion(
    asesorId: number
  ) {
    if (!nombreEditado.trim()) {
      setError(
        "El nombre del asesor es obligatorio."
      );
      return;
    }

    if (!telefonoEditado.trim()) {
      setError(
        "El WhatsApp del asesor es obligatorio."
      );
      return;
    }

    setProcesandoId(asesorId);
    setError("");

    try {
      const response = await fetch(
        "/api/admin/configuracion/asesores-whatsapp",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            asesorId,
            accion: "editar",
            nombre: nombreEditado,
            cargo: cargoEditado,
            telefono: telefonoEditado,
            imagenUrl: imagenUrlEditada,
            imagenPublicId:
              imagenPublicIdEditada,
            activo: activoEditado,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ??
            "No se pudo guardar el asesor."
        );
      }

      cancelarEdicion();
      await cargarAsesores();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se pudo guardar el asesor."
      );
    } finally {
      setProcesandoId(null);
    }
  }

  async function ejecutarAccion(
    asesorId: number,
    accion:
      | "subir"
      | "bajar"
      | "activar"
      | "desactivar"
  ) {
    setProcesandoId(asesorId);
    setError("");

    try {
      const response = await fetch(
        "/api/admin/configuracion/asesores-whatsapp",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            asesorId,
            accion,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ??
            "No se pudo actualizar el asesor."
        );
      }

      await cargarAsesores();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se pudo actualizar el asesor."
      );
    } finally {
      setProcesandoId(null);
    }
  }

  async function eliminarAsesor(
    asesor: Asesor
  ) {
    const confirmar = window.confirm(
      `¿Eliminar a "${asesor.nombre}"?`
    );

    if (!confirmar) {
      return;
    }

    setProcesandoId(asesor.id);
    setError("");

    try {
      const response = await fetch(
        "/api/admin/configuracion/asesores-whatsapp",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            asesorId: asesor.id,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ??
            "No se pudo eliminar el asesor."
        );
      }

      await cargarAsesores();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se pudo eliminar el asesor."
      );
    } finally {
      setProcesandoId(null);
    }
  }

  if (cargando) {
    return (
      <div className="flex min-h-48 items-center justify-center">
        <LoaderCircle
          size={28}
          className="animate-spin text-slate-600"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h3 className="font-black text-slate-950">
          Agregar asesor
        </h3>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Nombre
            </label>

            <input
              value={nombre}
              onChange={(event) =>
                setNombre(event.target.value)
              }
              placeholder="Ejemplo: Kathi"
              className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none focus:border-slate-700"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Cargo
            </label>

            <input
              value={cargo}
              onChange={(event) =>
                setCargo(event.target.value)
              }
              placeholder="Asesora comercial"
              className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none focus:border-slate-700"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              WhatsApp
            </label>

            <input
              value={telefono}
              onChange={(event) =>
                setTelefono(event.target.value)
              }
              placeholder="51945360973"
              className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none focus:border-slate-700"
            />

            <p className="mt-2 text-xs text-slate-500">
              Incluye código de país. Ejemplo:
              51945360973.
            </p>
          </div>

          <label className="flex h-11 cursor-pointer items-center gap-3 self-end rounded-xl border border-slate-300 bg-white px-4">
            <input
              type="checkbox"
              checked={activo}
              onChange={(event) =>
                setActivo(event.target.checked)
              }
              className="h-4 w-4"
            />

            <span className="text-sm font-bold text-slate-700">
              Asesor activo
            </span>
          </label>
        </div>

        <div className="mt-5">
          <p className="mb-2 text-sm font-bold text-slate-700">
            Foto del asesor
          </p>

          <SingleImageUploader
            nameUrl="asesorImagenUrlNueva"
            namePublicId="asesorImagenPublicIdNueva"
            initialUrl={imagenUrl}
            initialPublicId={imagenPublicId}
            altText="Foto del asesor"
            signaturePayload={{
              tipo: "asesorWhatsApp",
            }}
            onChange={({
              url,
              publicId,
            }) => {
              setImagenUrl(url);
              setImagenPublicId(publicId);
            }}
          />
        </div>

        <button
          type="button"
          disabled={guardando}
          onClick={() =>
            void agregarAsesor()
          }
          className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-slate-800 disabled:opacity-50"
        >
          {guardando ? (
            <LoaderCircle
              size={17}
              className="animate-spin"
            />
          ) : (
            <Plus size={17} />
          )}

          Agregar asesor
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      {asesores.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center">
          <UserRound
            size={36}
            className="mx-auto text-slate-400"
          />

          <p className="mt-4 font-black text-slate-900">
            Todavía no hay asesores.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {asesores.map(
            (asesor, indice) => {
              const editando =
                editandoId === asesor.id;

              const procesando =
                procesandoId === asesor.id;

              return (
                <div
                  key={asesor.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5"
                >
                  {editando ? (
                    <div className="space-y-5">
                      <div className="grid gap-4 md:grid-cols-2">
                        <input
                          value={nombreEditado}
                          onChange={(event) =>
                            setNombreEditado(
                              event.target.value
                            )
                          }
                          placeholder="Nombre"
                          className="h-11 rounded-xl border border-slate-300 px-4 text-sm"
                        />

                        <input
                          value={cargoEditado}
                          onChange={(event) =>
                            setCargoEditado(
                              event.target.value
                            )
                          }
                          placeholder="Cargo"
                          className="h-11 rounded-xl border border-slate-300 px-4 text-sm"
                        />

                        <input
                          value={telefonoEditado}
                          onChange={(event) =>
                            setTelefonoEditado(
                              event.target.value
                            )
                          }
                          placeholder="WhatsApp"
                          className="h-11 rounded-xl border border-slate-300 px-4 text-sm"
                        />

                        <label className="flex h-11 items-center gap-3 rounded-xl border border-slate-300 px-4">
                          <input
                            type="checkbox"
                            checked={activoEditado}
                            onChange={(event) =>
                              setActivoEditado(
                                event.target.checked
                              )
                            }
                          />

                          <span className="text-sm font-bold">
                            Activo
                          </span>
                        </label>
                      </div>

                      <SingleImageUploader
                        nameUrl={`asesorImagenUrl-${asesor.id}`}
                        namePublicId={`asesorImagenPublicId-${asesor.id}`}
                        initialUrl={
                          imagenUrlEditada
                        }
                        initialPublicId={
                          imagenPublicIdEditada
                        }
                        altText={`Foto de ${nombreEditado}`}
                        signaturePayload={{
                          tipo: "asesorWhatsApp",
                        }}
                        onChange={({
                          url,
                          publicId,
                        }) => {
                          setImagenUrlEditada(
                            url
                          );
                          setImagenPublicIdEditada(
                            publicId
                          );
                        }}
                      />

                      <div className="flex gap-2">
                        <button
                          type="button"
                          disabled={procesando}
                          onClick={() =>
                            void guardarEdicion(
                              asesor.id
                            )
                          }
                          className="inline-flex h-10 items-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-bold text-white"
                        >
                          <Save size={16} />
                          Guardar
                        </button>

                        <button
                          type="button"
                          onClick={
                            cancelarEdicion
                          }
                          className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-300 px-4 text-sm font-bold"
                        >
                          <X size={16} />
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4 md:flex-row md:items-center">
                      <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-100">
                        {asesor.imagenUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={
                              asesor.imagenUrl
                            }
                            alt={asesor.nombre}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <UserRound
                            size={30}
                            className="text-slate-400"
                          />
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-black text-slate-400">
                            #{indice + 1}
                          </span>

                          <p className="text-lg font-black text-slate-950">
                            {asesor.nombre}
                          </p>

                          <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-black ${
                              asesor.activo
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {asesor.activo
                              ? "ACTIVO"
                              : "INACTIVO"}
                          </span>
                        </div>

                        <p className="mt-1 text-sm text-slate-500">
                          {asesor.cargo ??
                            "Asesor comercial"}
                        </p>

                        <p className="mt-1 text-sm font-bold text-slate-700">
                          +{asesor.telefono}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          disabled={
                            indice === 0 ||
                            procesando
                          }
                          onClick={() =>
                            void ejecutarAccion(
                              asesor.id,
                              "subir"
                            )
                          }
                          className="h-10 rounded-xl border border-slate-300 px-3 disabled:opacity-30"
                        >
                          <ArrowUp size={17} />
                        </button>

                        <button
                          type="button"
                          disabled={
                            indice ===
                              asesores.length -
                                1 ||
                            procesando
                          }
                          onClick={() =>
                            void ejecutarAccion(
                              asesor.id,
                              "bajar"
                            )
                          }
                          className="h-10 rounded-xl border border-slate-300 px-3 disabled:opacity-30"
                        >
                          <ArrowDown size={17} />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            empezarEdicion(asesor)
                          }
                          className="h-10 rounded-xl border border-blue-200 px-3 text-blue-700"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            void ejecutarAccion(
                              asesor.id,
                              asesor.activo
                                ? "desactivar"
                                : "activar"
                            )
                          }
                          className="h-10 rounded-xl border border-slate-300 px-3 text-xs font-black"
                        >
                          {asesor.activo
                            ? "Desactivar"
                            : "Activar"}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            void eliminarAsesor(
                              asesor
                            )
                          }
                          className="h-10 rounded-xl border border-red-200 px-3 text-red-600"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            }
          )}
        </div>
      )}
    </div>
  );
}