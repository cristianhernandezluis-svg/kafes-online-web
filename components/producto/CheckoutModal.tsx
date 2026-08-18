"use client";

import Image from "next/image";
import {
  CheckCircle,
  Home,
  MapPin,
  Phone,
  Truck,
  User,
  X,
} from "lucide-react";
import type { ReactNode } from "react";

import type { ProductoPublico } from "./product-types";
import type { ConfiguracionTiendaPublica } from "@/lib/configuracion-tienda";

const regionesPeru = [
  "Amazonas",
  "Áncash",
  "Apurímac",
  "Arequipa",
  "Ayacucho",
  "Cajamarca",
  "Callao",
  "Cusco",
  "Huancavelica",
  "Huánuco",
  "Ica",
  "Junín",
  "La Libertad",
  "Lambayeque",
  "Lima",
  "Loreto",
  "Madre de Dios",
  "Moquegua",
  "Pasco",
  "Piura",
  "Puno",
  "San Martín",
  "Tacna",
  "Tumbes",
  "Ucayali",
];

type CheckoutModalProps = {
  open: boolean;
  dni: string;
  onDniChange: (value: string) => void;
  producto: ProductoPublico;
  cantidad: number;
  total: number;
  loading: boolean;
  pedidoFinalizado: boolean;

  configuracionTienda: ConfiguracionTiendaPublica;

  nombre: string;
  celular: string;
  ciudad: string;
  region: string;
  direccion: string;
  referencia: string;

  onNombreChange: (value: string) => void;
  onCelularChange: (value: string) => void;
  onCiudadChange: (value: string) => void;
  onRegionChange: (value: string) => void;
  onDireccionChange: (value: string) => void;
  onReferenciaChange: (value: string) => void;

  onClose: () => void;
  onSubmit: () => void;
};

export default function CheckoutModal({
  open,
  producto,
  dni,
  onDniChange,
  configuracionTienda,
  cantidad,
  total,
  loading,
  pedidoFinalizado,
  nombre,
  celular,
  ciudad,
  region,
  direccion,
  referencia,
  onNombreChange,
  onCelularChange,
  onCiudadChange,
  onRegionChange,
  onDireccionChange,
  onReferenciaChange,
  onClose,
  onSubmit,
}: CheckoutModalProps) {
  if (!open) {
    return null;
  }

const esPedidoConAdelanto =
  configuracionTienda.checkoutTipoPedido ===
  "ADELANTO";

const esPagoCompleto =
  configuracionTienda.checkoutTipoPedido ===
  "PAGO_COMPLETO";

const montoAdelanto = esPedidoConAdelanto
  ? Math.min(
      Math.max(
        0,
        configuracionTienda.checkoutMontoAdelanto
      ),
      total
    )
  : 0;

const saldoPendiente = Math.max(
  0,
  total - montoAdelanto
);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Finalizar pedido"
      onClick={onClose}
      className="fixed inset-0 z-[999] overflow-y-auto bg-black/70"
    >
      <div className="flex min-h-screen items-start justify-center p-4">
        <div
          onClick={(event) => event.stopPropagation()}
          className="relative my-10 w-full max-w-md overflow-hidden rounded-2xl bg-white text-black shadow-2xl"
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar formulario"
            className="absolute right-4 top-4 z-10 text-zinc-500 transition hover:text-black"
          >
            <X />
          </button>

          {!pedidoFinalizado ? (
            <>
              <div className="border-b bg-gradient-to-r from-yellow-400 to-yellow-300 p-4">
                <p className="text-xs font-black uppercase tracking-wide">
                  Oferta especial
                </p>

                <h2 className="text-2xl font-black leading-tight">
  {configuracionTienda.checkoutTitulo}
</h2>

                <p className="mt-1 text-sm font-semibold text-black/80">
                  🚚 Envíos rápidos a todo el Perú 🇵🇪
                </p>
              </div>

              <ProductSummary
                producto={producto}
                cantidad={cantidad}
                total={total}
                mostrarTotal={configuracionTienda.checkoutMostrarTotal}
              />

              {configuracionTienda.checkoutMostrarTotal && (
  <>
    {esPedidoConAdelanto && (
      <div className="mt-3 space-y-2 border-t border-slate-200 pt-3">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-slate-600">
            Adelanto para confirmar
          </span>

          <span className="font-black text-slate-900">
            S/{montoAdelanto.toFixed(2)}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-slate-600">
            Saldo pendiente
          </span>

          <span className="font-black text-slate-900">
            S/{saldoPendiente.toFixed(2)}
          </span>
        </div>
      </div>
    )}
{esPagoCompleto && (
  <div className="mt-3 border-t border-slate-200 pt-3">
    <div className="flex items-center justify-between text-sm">
      <span className="font-semibold text-slate-600">
        Pago requerido para confirmar
      </span>

      <span className="font-black text-slate-900">
        S/{total.toFixed(2)}
      </span>
    </div>

    <p className="mt-2 text-xs text-slate-500">
      El pedido quedará pendiente hasta confirmar el pago.
    </p>
  </div>
)}

  </>
)}

              <div className="space-y-3 p-4">
                <CheckoutInput
                  icon={<User size={18} />}
                  placeholder="Nombre completo *"
                  value={nombre}
                  onChange={onNombreChange}
                  name="name"
                  autoComplete="name"
                />

                <CheckoutInput
                  icon={<Phone size={18} />}
                  placeholder="Celular *"
                  value={celular}
                  onChange={onCelularChange}
                  name="tel"
                  type="tel"
                  autoComplete="tel"
                />

                {configuracionTienda.checkoutMostrarCiudad && (
  <CheckoutInput
    icon={<MapPin size={18} />}
    placeholder={`Ciudad o distrito${
      configuracionTienda.checkoutCiudadObligatoria
        ? " *"
        : ""
    }`}
    value={ciudad}
    onChange={onCiudadChange}
    name="address-level2"
    autoComplete="address-level2"
    required={
      configuracionTienda.checkoutCiudadObligatoria
    }
  />
)}

                {configuracionTienda.checkoutMostrarRegion && (
  <select
    required={
      configuracionTienda.checkoutRegionObligatoria
    }
    value={region}
    onChange={(event) =>
      onRegionChange(event.target.value)
    }
    name="region"
    autoComplete="address-level1"
    className="w-full rounded-2xl border bg-white px-5 py-4 text-lg font-semibold text-zinc-700 outline-none"
  >
    <option value="">
      Selecciona tu región
      {configuracionTienda.checkoutRegionObligatoria
        ? " *"
        : ""}
    </option>

    {regionesPeru.map((item) => (
      <option key={item} value={item}>
        {item}
      </option>
    ))}
  </select>
)}

                {configuracionTienda.checkoutMostrarRegion &&
  region && (
                  <div className="rounded-2xl border border-green-300 bg-green-50 px-4 py-3 text-sm font-bold text-green-700">
                    {region === "Lima"
                      ? "✅ Pago contra entrega disponible en Lima Metropolitana"
                      : "📦 Envío por Shalom u Olva. Se solicita adelanto para confirmar el envío"}
                  </div>
                )}

                {configuracionTienda.checkoutMostrarDireccion && (!configuracionTienda.checkoutMostrarRegion || region === "Lima") && (
  <CheckoutInput
    icon={<Home size={18} />}
    placeholder={`Dirección exacta${
      configuracionTienda.checkoutDireccionObligatoria
        ? " *"
        : ""
    }`}
    value={direccion}
    onChange={onDireccionChange}
    name="street-address"
    autoComplete="street-address"
    required={
      configuracionTienda.checkoutDireccionObligatoria
    }
  />
)}


                <button
                  type="button"
                  onClick={onSubmit}
                  disabled={loading}
                  className="flex w-full animate-[pulse_1.5s_ease-in-out_infinite] items-center justify-center gap-3 rounded-2xl border-b-[5px] border-yellow-600 bg-yellow-400 py-5 text-lg font-black text-black shadow-xl transition hover:bg-yellow-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Truck size={22} />

                  {loading
  ? "ENVIANDO..."
  : configuracionTienda.checkoutBotonTexto}
                </button>

                <p className="mt-3 text-center text-xs font-semibold text-zinc-500">
  {configuracionTienda.checkoutTextoConfianza}
</p>
              </div>
            </>
          ) : (
            <OrderSuccess
  mensaje={
    configuracionTienda.checkoutMensajeExito
  }
/>
          )}
        </div>
      </div>
    </div>
  );
}

function ProductSummary({
  producto,
  cantidad,
  total,
  mostrarTotal,
}: {
  producto: ProductoPublico;
  cantidad: number;
  total: number;
  mostrarTotal: boolean;
}) {
  return (
    <div className="border-b bg-white p-3">
      <div className="flex gap-3">
        <Image
          src={producto.imagen}
          alt={producto.nombre}
          width={64}
          height={64}
          className="h-16 w-16 shrink-0 rounded-lg border bg-white object-contain p-1"
        />

        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-black px-2 py-1 text-[10px] font-black text-white">{cantidad} UNIDAD{cantidad > 1 ? "ES" : ""}</span>
            <span className="rounded-md bg-green-600 px-2 py-1 text-[10px] font-black text-white">OFERTA</span>
          </div>

          <h3 className="mt-2 text-[15px] font-black leading-tight">
            {producto.nombre}
          </h3>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="text-2xl font-black text-red-600">
              S/{producto.precio}
            </span>

            {producto.precioAntes && (
              <span className="text-base font-semibold text-zinc-400 line-through">
                S/{producto.precioAntes}
              </span>
            )}
          </div>

          <div className="mt-2 inline-flex items-center gap-2 rounded-lg bg-green-100 px-2 py-1 text-xs font-bold text-green-700">
            <Truck size={14} />
            ENVÍO GRATIS
          </div>

          {mostrarTotal && (
            <div className="mt-3 flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2">
              <span className="text-sm font-bold text-zinc-600">Total del pedido</span>
              <span className="text-xl font-black text-black">S/{total}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function OrderTotals({
  total,
}: {
  total: number;
}) {
  return (
    <div className="border-b bg-zinc-50 p-4">
      <div className="overflow-hidden rounded-2xl border bg-white">
        <div className="flex justify-between border-b px-4 py-3 text-sm">
          <span className="font-medium text-zinc-600">
            Subtotal
          </span>

          <strong className="font-black">
            S/{total}
          </strong>
        </div>

        <div className="flex justify-between border-b px-4 py-3 text-sm">
          <span className="font-medium text-zinc-600">
            Envío
          </span>

          <strong className="font-black text-green-600">
            Gratis
          </strong>
        </div>

        <div className="flex justify-between bg-yellow-50 px-4 py-4">
          <span className="text-lg font-black">
            Total
          </span>

          <strong className="text-2xl font-black text-black">
            S/{total}
          </strong>
        </div>
      </div>
    </div>
  );
}

function OrderSuccess({
  mensaje,
}: {
  mensaje: string;
}) {
  return (
    <div className="p-10 text-center">
      <div className="mb-5 flex justify-center">
        <CheckCircle
          size={90}
          className="text-green-500"
        />
      </div>

      <h2 className="mb-4 text-3xl font-black">
        ¡Pedido recibido!
      </h2>

      <p className="text-lg leading-8 text-zinc-600">
  {mensaje}
</p>

      <div className="mt-6 space-y-3 rounded-2xl border border-green-200 bg-green-50 p-4 text-left">
        <p className="font-bold text-green-700">
          ✅ Un asesor se comunicará contigo por WhatsApp para
          confirmar tu pedido.
        </p>

        <p className="font-bold text-green-700">
          📦 Envíos a todo el Perú.
        </p>

        <p className="font-bold text-green-700">
          ☎️ Mantén tu celular disponible.
        </p>
      </div>
    </div>
  );
}

type CheckoutInputProps = {
  icon: ReactNode;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  name: string;
  autoComplete: string;
  type?: string;
  required?: boolean;
};

function CheckoutInput({
  icon,
  placeholder,
  value,
  onChange,
  name,
  autoComplete,
  type = "text",
  required = true,
}: CheckoutInputProps) {
  return (
    <div className="flex overflow-hidden rounded-2xl border">
      <div className="flex items-center bg-zinc-100 px-5 text-zinc-500">
        {icon}
      </div>

      <input
        required={required}
        type={type}
        name={name}
        autoComplete={autoComplete}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="w-full px-5 py-4 text-lg outline-none"
      />
    </div>
  );
}