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
  producto: ProductoPublico;
  cantidad: number;
  total: number;
  loading: boolean;
  pedidoFinalizado: boolean;

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
                  Finaliza tu pedido
                </h2>

                <p className="mt-1 text-sm font-semibold text-black/80">
                  🚚 Envíos rápidos a todo el Perú 🇵🇪
                </p>
              </div>

              <ProductSummary
                producto={producto}
                cantidad={cantidad}
              />

              <OrderTotals total={total} />

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

                <CheckoutInput
                  icon={<MapPin size={18} />}
                  placeholder="Ciudad o distrito *"
                  value={ciudad}
                  onChange={onCiudadChange}
                  name="address-level2"
                  autoComplete="address-level2"
                />

                <select
                  required
                  value={region}
                  onChange={(event) =>
                    onRegionChange(event.target.value)
                  }
                  name="region"
                  autoComplete="address-level1"
                  className="w-full rounded-2xl border bg-white px-5 py-4 text-lg font-semibold text-zinc-700 outline-none"
                >
                  <option value="">
                    Selecciona tu región *
                  </option>

                  {regionesPeru.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>

                {region && (
                  <div className="rounded-2xl border border-green-300 bg-green-50 px-4 py-3 text-sm font-bold text-green-700">
                    {region === "Lima"
                      ? "✅ Pago contra entrega disponible en Lima Metropolitana"
                      : "✅ Envío seguro disponible a tu ciudad. Confirmamos tu pedido por WhatsApp"}
                  </div>
                )}

                <CheckoutInput
                  icon={<Home size={18} />}
                  placeholder="Dirección exacta *"
                  value={direccion}
                  onChange={onDireccionChange}
                  name="street-address"
                  autoComplete="street-address"
                />

                <CheckoutInput
                  icon={<MapPin size={18} />}
                  placeholder="Referencia"
                  value={referencia}
                  onChange={onReferenciaChange}
                  name="address-line2"
                  autoComplete="address-line2"
                  required={false}
                />

                <button
                  type="button"
                  onClick={onSubmit}
                  disabled={loading}
                  className="flex w-full animate-[pulse_1.5s_ease-in-out_infinite] items-center justify-center gap-3 rounded-2xl border-b-[5px] border-yellow-600 bg-yellow-400 py-5 text-lg font-black text-black shadow-xl transition hover:bg-yellow-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Truck size={22} />

                  {loading
                    ? "ENVIANDO..."
                    : "REALIZAR PEDIDO"}
                </button>

                <p className="mt-3 text-center text-xs font-semibold text-zinc-500">
                  🔒 Tus datos están protegidos y tu pedido será
                  confirmado por WhatsApp.
                </p>
              </div>
            </>
          ) : (
            <OrderSuccess />
          )}
        </div>
      </div>
    </div>
  );
}

function ProductSummary({
  producto,
  cantidad,
}: {
  producto: ProductoPublico;
  cantidad: number;
}) {
  return (
    <div className="border-b bg-white p-4">
      <div className="flex gap-3">
        <Image
          src={producto.imagen}
          alt={producto.nombre}
          width={85}
          height={85}
          className="rounded-2xl border bg-zinc-100 object-cover"
        />

        <div className="flex-1">
          <h3 className="text-[15px] font-black leading-tight">
            {producto.nombre}
          </h3>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="text-2xl font-black text-black">
              S/{producto.precio}
            </span>

            {producto.precioAntes && (
              <span className="text-xl text-zinc-400 line-through">
                S/{producto.precioAntes}
              </span>
            )}
          </div>

          <p className="mt-1 text-xs font-semibold text-zinc-500">
            Cantidad: {cantidad}
          </p>

          <div className="mt-2 inline-flex items-center gap-2 rounded-lg bg-green-100 px-2 py-1 text-xs font-bold text-green-700">
            <Truck size={14} />
            ENVÍO GRATIS
          </div>
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

function OrderSuccess() {
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
        Gracias por confiar en KAFES ONLINE.
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