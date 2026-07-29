"use client";

import {
  CheckCircle,
  ShieldCheck,
  Truck,
} from "lucide-react";
import {
  useEffect,
  useState,
  type RefObject,
} from "react";

import type { ProductoPublico } from "./product-types";

type ProductPurchasePanelProps = {
  producto: ProductoPublico;
  cantidad: number;
  onCantidadChange: (cantidad: number) => void;
  onComprar: () => void;
  comprarAhoraRef: RefObject<HTMLButtonElement | null>;
};

export default function ProductPurchasePanel({
  producto,
  cantidad,
  onCantidadChange,
  onComprar,
  comprarAhoraRef,
}: ProductPurchasePanelProps) {
  const [timeLeft, setTimeLeft] = useState(
    3 * 60 * 60,
  );

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTimeLeft((actual) =>
        actual > 0 ? actual - 1 : 0,
      );
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const disminuirCantidad = () => {
    onCantidadChange(Math.max(1, cantidad - 1));
  };

  const aumentarCantidad = () => {
    onCantidadChange(cantidad + 1);
  };

  return (
    <div>
      {producto.etiqueta && (
        <span className="inline-block rounded-full bg-yellow-400 px-4 py-2 font-bold text-black">
          {producto.etiqueta}
        </span>
      )}

      <h1 className="mt-6 text-4xl font-black md:text-5xl">
        {producto.nombre}
      </h1>

      <div className="mt-3 flex items-center gap-2 font-bold text-yellow-400">
        <span aria-label="5 estrellas">
          ★★★★★
        </span>

        <span className="text-sm text-zinc-600">
          4.9/5 +100 reseñas
        </span>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <p className="text-5xl font-black text-yellow-500">
          S/{producto.precio}
        </p>

        {producto.precioAntes && (
          <span className="text-2xl text-zinc-400 line-through">
            S/{producto.precioAntes}
          </span>
        )}
      </div>

      <div className="mt-4 inline-block rounded-2xl bg-red-100 px-4 py-3 font-bold text-red-600">
        🔥 Últimas unidades disponibles
      </div>

      <div className="mt-4">
        <div className="inline-block animate-pulse rounded-2xl bg-black px-5 py-4 font-black text-yellow-400 shadow-xl">
          ⏰ Oferta termina en:{" "}
          {formatTime(timeLeft)}
        </div>
      </div>

      {producto.descripcion && (
        <p className="mt-6 text-lg leading-8 text-zinc-600">
          {producto.descripcion}
        </p>
      )}

      <div className="mt-8 grid grid-cols-2 gap-4">
        <InfoBox
          icon={<Truck />}
          title="Envío rápido"
          text="A todo el Perú"
        />

        <InfoBox
          icon={<ShieldCheck />}
          title="Compra segura"
          text="Confirmación por WhatsApp"
        />
      </div>

      {producto.beneficios.length > 0 && (
        <div className="mt-8 space-y-3">
          {producto.beneficios.map((beneficio) => (
            <Benefit
              key={beneficio}
              text={beneficio}
            />
          ))}
        </div>
      )}

      <div className="mt-8">
        <label className="font-black">
          Cantidad
        </label>

        <div className="mt-3 flex w-[180px]">
          <button
            type="button"
            onClick={disminuirCantidad}
            disabled={cantidad <= 1}
            aria-label="Disminuir cantidad"
            className="rounded-l-xl bg-zinc-200 px-5 py-3 font-black transition hover:bg-zinc-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            −
          </button>

          <div className="flex flex-1 items-center justify-center border-y font-black">
            {cantidad}
          </div>

          <button
            type="button"
            onClick={aumentarCantidad}
            aria-label="Aumentar cantidad"
            className="rounded-r-xl bg-zinc-200 px-5 py-3 font-black transition hover:bg-zinc-300"
          >
            +
          </button>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <button
          type="button"
          onClick={onComprar}
          className="w-full rounded-2xl bg-green-500 py-5 text-2xl font-black text-white shadow-xl transition hover:bg-green-600 active:scale-[0.98]"
        >
          Agregar al carrito
        </button>

        <button
          ref={comprarAhoraRef}
          type="button"
          onClick={onComprar}
          className="w-full animate-[pulse_1.2s_ease-in-out_infinite] rounded-2xl bg-pink-600 py-5 text-2xl font-black text-white shadow-xl transition hover:bg-pink-700 active:scale-[0.98]"
        >
          Comprar ahora
        </button>
      </div>

      <div className="mt-6 space-y-3 rounded-2xl bg-zinc-100 p-5 text-sm">
        <p>🚚 Envío gratis a todo el Perú</p>
        <p>📦 Pago contra entrega</p>
        <p>🛡️ Garantía de satisfacción</p>
      </div>
    </div>
  );
}

function formatTime(seconds: number) {
  const horas = Math.floor(seconds / 3600);
  const minutos = Math.floor(
    (seconds % 3600) / 60,
  );
  const segundos = seconds % 60;

  return [
    horas,
    minutos,
    segundos,
  ]
    .map((valor) =>
      String(valor).padStart(2, "0"),
    )
    .join(":");
}

type InfoBoxProps = {
  icon: React.ReactNode;
  title: string;
  text: string;
};

function InfoBox({
  icon,
  title,
  text,
}: InfoBoxProps) {
  return (
    <div className="rounded-2xl border p-4">
      <div className="text-yellow-500">
        {icon}
      </div>

      <h3 className="mt-2 font-black">
        {title}
      </h3>

      <p className="text-sm text-zinc-500">
        {text}
      </p>
    </div>
  );
}

function Benefit({
  text,
}: {
  text: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <CheckCircle className="shrink-0 text-green-500" />

      <span className="font-medium">
        {text}
      </span>
    </div>
  );
}