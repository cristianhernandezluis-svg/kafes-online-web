"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  LoaderCircle,
  Package,
  ShoppingCart,
  X,
} from "lucide-react";

type CrearPedidoDesdeCarritoProps = {
  sessionId: string;
  productoId: number;
  productoNombre: string;
  imagenUrl: string | null;
  cantidad: number;

  nombre: string | null;
  celular: string | null;
  ciudad: string | null;
  region: string | null;
  direccion: string | null;

  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmContent: string | null;

  fbclid: string | null;
  ttclid: string | null;
};

const DEPARTAMENTOS_PERU = [
  "Amazonas", "Áncash", "Apurímac", "Arequipa", "Ayacucho", "Cajamarca", "Callao", "Cusco", "Huancavelica", "Huánuco", "Ica", "Junín", "La Libertad", "Lambayeque", "Lima", "Loreto", "Madre de Dios", "Moquegua", "Pasco", "Piura", "Puno", "San Martín", "Tacna", "Tumbes", "Ucayali",
] as const;

type RespuestaPedido = {
  ok?: boolean;
  error?: string;
  mensaje?: string;
  pedido?: {
    id: number;
    codigo: string;
    total: number;
    estado: string;
  };
};

export default function CrearPedidoDesdeCarrito({
  sessionId,
  productoId,
  productoNombre,
  imagenUrl,
  cantidad,
  nombre,
  celular,
  ciudad,
  region,
  direccion,
  utmSource,
  utmMedium,
  utmCampaign,
  utmContent,
  fbclid,
  ttclid,
}: CrearPedidoDesdeCarritoProps) {
  const router = useRouter();

  const [modalAbierto, setModalAbierto] =
    useState(false);

  const [creando, setCreando] =
    useState(false);

  const [error, setError] =
    useState("");

  const [nombreEditado, setNombreEditado] =
    useState(nombre ?? "");

  const [celularEditado, setCelularEditado] =
    useState(celular ?? "");

  const [ciudadEditada, setCiudadEditada] =
    useState(ciudad ?? "");

  const [regionEditada, setRegionEditada] =
    useState(region ?? "");

  const [
    direccionEditada,
    setDireccionEditada,
  ] = useState(direccion ?? "");

  const [
    cantidadEditada,
    setCantidadEditada,
  ] = useState(
    Math.max(1, cantidad),
  );

  function abrirModal() {
    setNombreEditado(nombre ?? "");
    setCelularEditado(celular ?? "");
    setCiudadEditada(ciudad ?? "");
    setRegionEditada(region ?? "");
    setDireccionEditada(
      direccion ?? "",
    );
    setCantidadEditada(
      Math.max(1, cantidad),
    );
    setError("");
    setModalAbierto(true);
  }

  function cerrarModal() {
    if (creando) {
      return;
    }

    setModalAbierto(false);
    setError("");
  }

  async function crearPedido() {
    if (creando) {
      return;
    }

    const nombreLimpio =
      nombreEditado.trim();

    const celularLimpio =
      celularEditado
        .replace(/\s+/g, "")
        .trim();

    const ciudadLimpia =
      ciudadEditada.trim();

    const regionLimpia =
      regionEditada.trim();

    const direccionLimpia =
      direccionEditada.trim();

    if (!nombreLimpio) {
      setError(
        "Ingresa el nombre del cliente.",
      );
      return;
    }

    if (!celularLimpio) {
      setError(
        "Ingresa el celular del cliente.",
      );
      return;
    }

    if (celularLimpio.length < 9) {
      setError(
        "Ingresa un celular válido.",
      );
      return;
    }

    if (
      !Number.isInteger(cantidadEditada) ||
      cantidadEditada < 1
    ) {
      setError(
        "La cantidad no es válida.",
      );
      return;
    }

    setCreando(true);
    setError("");

    try {
      const respuesta = await fetch(
        "/api/pedidos",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            productoId,
            cantidad: cantidadEditada,
            sessionId,

            nombre: nombreLimpio,
            celular: celularLimpio,

            dni: "",
            ciudad: ciudadLimpia,
            region: regionLimpia,
            direccion: direccionLimpia,
            referencia: "",

            utmSource,
            utmMedium,
            utmCampaign,
            utmContent,
            utmTerm: null,

            fbclid,
            ttclid,

            landingPath: null,
            referrer: null,
          }),
        },
      );

      const data =
        (await respuesta.json()) as RespuestaPedido;

      if (
        !respuesta.ok ||
        !data.ok ||
        !data.pedido?.id
      ) {
        setError(
          data.error ||
            "No se pudo crear el pedido.",
        );
        return;
      }

      setModalAbierto(false);

      router.push(
        `/admin/pedidos/${data.pedido.id}`,
      );

      router.refresh();
    } catch (errorCreandoPedido) {
      console.error(
        "Error creando pedido desde carrito:",
        errorCreandoPedido,
      );

      setError(
        "No pudimos crear el pedido. Inténtalo nuevamente.",
      );
    } finally {
      setCreando(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={abrirModal}
        className="inline-flex h-10 items-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-black text-white transition hover:bg-slate-800"
      >
        <ShoppingCart size={16} />
        Crear pedido
      </button>

      {modalAbierto && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Crear pedido desde carrito"
        >
          <div className="max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:max-w-2xl sm:rounded-3xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-xl font-black text-slate-950">
                  Crear pedido
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Revisa los datos antes de
                  enviarlo a Pedidos.
                </p>
              </div>

              <button
                type="button"
                onClick={cerrarModal}
                disabled={creando}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200 disabled:opacity-50"
                aria-label="Cerrar"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5 p-5 sm:p-6">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-14 w-14 flex-none items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    {imagenUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={imagenUrl}
                        alt={productoNombre}
                        className="h-full w-full object-contain p-1"
                      />
                    ) : (
                      <Package size={21} className="text-slate-700" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                      Producto
                    </p>

                    <p className="mt-1 font-black text-slate-950">
                      {productoNombre}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      El producto no se puede
                      cambiar desde esta ventana.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-bold text-slate-700">
                    Nombre y apellido
                  </span>

                  <input
                    type="text"
                    value={nombreEditado}
                    onChange={(event) => setNombreEditado(event.target.value)}
                    placeholder="Nombre del cliente"
                    className="h-12 w-full rounded-xl border border-slate-300 px-4 text-sm outline-none transition focus:border-slate-950"
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-sm font-bold text-slate-700">
                    Celular
                  </span>

                  <input
                    type="tel"
                    value={celularEditado}
                    onChange={(event) => setCelularEditado(event.target.value)}
                    placeholder="999999999"
                    className="h-12 w-full rounded-xl border border-slate-300 px-4 text-sm outline-none transition focus:border-slate-950"
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-sm font-bold text-slate-700">
                    Región
                  </span>

                  <select
                    value={regionEditada}
                    onChange={(event) => setRegionEditada(event.target.value)}
                    className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none transition focus:border-slate-950"
                  >
                    <option value="">Selecciona un departamento</option>
                    {regionEditada && !DEPARTAMENTOS_PERU.includes(regionEditada as (typeof DEPARTAMENTOS_PERU)[number]) && (
                      <option value={regionEditada}>{regionEditada}</option>
                    )}
                    {DEPARTAMENTOS_PERU.map((departamento) => (
                      <option key={departamento} value={departamento}>
                        {departamento}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-sm font-bold text-slate-700">
                    Ciudad / distrito
                  </span>

                  <input
                    type="text"
                    value={ciudadEditada}
                    onChange={(event) => setCiudadEditada(event.target.value)}
                    placeholder="Ej. San Juan de Lurigancho"
                    className="h-12 w-full rounded-xl border border-slate-300 px-4 text-sm outline-none transition focus:border-slate-950"
                  />
                </label>
              </div>

              <label className="block">
                <span className="mb-1.5 block text-sm font-bold text-slate-700">
                  Dirección de entrega
                </span>

                <textarea
                  value={direccionEditada}
                  onChange={(event) =>
                    setDireccionEditada(
                      event.target.value,
                    )
                  }
                  placeholder="Dirección actualizada del cliente"
                  rows={3}
                  className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-950"
                />
              </label>

              <label className="block sm:max-w-[180px]">
                <span className="mb-1.5 block text-sm font-bold text-slate-700">
                  Cantidad
                </span>

                <input
                  type="number"
                  min={1}
                  max={20}
                  value={cantidadEditada}
                  onChange={(event) => {
                    const valor = Number(
                      event.target.value,
                    );

                    setCantidadEditada(
                      Number.isFinite(valor)
                        ? Math.max(
                            1,
                            Math.floor(valor),
                          )
                        : 1,
                    );
                  }}
                  className="h-12 w-full rounded-xl border border-slate-300 px-4 text-sm font-bold outline-none transition focus:border-slate-950"
                />
              </label>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                  {error}
                </div>
              )}

              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-sm font-bold text-amber-900">
                  Confirma solamente cuando el
                  cliente ya aceptó comprar.
                </p>

                <p className="mt-1 text-xs leading-5 text-amber-700">
                  Al confirmar se creará un pedido
                  NUEVO y este carrito pasará
                  automáticamente a Recuperados.
                </p>
              </div>
            </div>

            <div className="sticky bottom-0 flex flex-col-reverse gap-2 border-t border-slate-200 bg-white p-4 sm:flex-row sm:justify-end sm:px-6">
              <button
                type="button"
                onClick={cerrarModal}
                disabled={creando}
                className="h-11 rounded-xl border border-slate-300 px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={crearPedido}
                disabled={creando}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 text-sm font-black text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {creando ? (
                  <>
                    <LoaderCircle
                      size={17}
                      className="animate-spin"
                    />
                    Creando pedido...
                  </>
                ) : (
                  <>
                    <ShoppingCart size={17} />
                    Confirmar y crear pedido
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}