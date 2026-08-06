"use client";

import {
  BadgeCheck,
  Check,
  LockKeyhole,
  MessageCircle,
  Minus,
  PackageCheck,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Star,
  Truck,
} from "lucide-react";
import type { RefObject } from "react";

import type { ProductoPublico } from "./product-types";

type ProductPurchasePanelProps = {
  producto: ProductoPublico;
  cantidad: number;
  onCantidadChange: (cantidad: number) => void;
  onComprar: () => void;
  comprarAhoraRef: RefObject<HTMLButtonElement | null>;
};

const WHATSAPP_NUMBER = "51980296583";

export default function ProductPurchasePanel({
  producto,
  cantidad,
  onCantidadChange,
  onComprar,
  comprarAhoraRef,
}: ProductPurchasePanelProps) {
  const disminuirCantidad = () => {
    onCantidadChange(Math.max(1, cantidad - 1));
  };

  const aumentarCantidad = () => {
    onCantidadChange(cantidad + 1);
  };

  const ahorro =
    producto.precioAntes && producto.precioAntes > producto.precio
      ? producto.precioAntes - producto.precio
      : 0;

  const porcentajeDescuento =
    ahorro > 0 && producto.precioAntes
      ? Math.round((ahorro / producto.precioAntes) * 100)
      : 0;

  const disponible = producto.stock > 0;
  const pocasUnidades = disponible && producto.stock <= 5;

const cantidadOpiniones = producto.opiniones.length;

const promedioOpiniones =
  cantidadOpiniones > 0
    ? producto.opiniones.reduce(
        (total, opinion) =>
          total + opinion.calificacion,
        0
      ) / cantidadOpiniones
    : 0;

const promedioFormateado =
  promedioOpiniones.toFixed(1);

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hola, deseo información sobre ${producto.nombre}`,
  )}`;

  return (
    <aside className="rounded-[28px] border border-zinc-200 bg-white p-5 shadow-[0_20px_70px_rgba(0,0,0,0.08)] sm:p-7 lg:sticky lg:top-28 lg:self-start">
      <div className="flex flex-wrap items-center gap-2">
        {producto.etiqueta && (
          <span className="rounded-full bg-yellow-400 px-3.5 py-2 text-xs font-black uppercase tracking-wide text-black">
            {producto.etiqueta}
          </span>
        )}

        <span
          className={`rounded-full px-3.5 py-2 text-xs font-black uppercase tracking-wide ${
            disponible
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {disponible ? "Disponible" : "Agotado"}
        </span>
      </div>

      <h1 className="mt-5 text-3xl font-black leading-[1.08] tracking-tight text-zinc-950 sm:text-4xl lg:text-[42px]">
        {producto.nombre}
      </h1>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-3 text-sm">
  {cantidadOpiniones > 0 ? (
    <a
      href="#opiniones"
      className="inline-flex flex-wrap items-center gap-2 font-bold transition hover:text-yellow-600"
      aria-label={`${promedioFormateado} de 5 estrellas, ${cantidadOpiniones} opiniones`}
    >
      <span className="flex items-center gap-0.5">
        {Array.from({
          length: 5,
        }).map((_, indice) => (
          <Star
            key={indice}
            size={18}
            className={
              indice < Math.round(promedioOpiniones)
                ? "fill-yellow-400 text-yellow-400"
                : "text-zinc-300"
            }
          />
        ))}
      </span>

      <span className="text-zinc-700">
        {promedioFormateado} ·{" "}
        {cantidadOpiniones} opinión
        {cantidadOpiniones === 1 ? "" : "es"}
      </span>
    </a>
  ) : (
    <span className="font-bold text-zinc-500">
      Aún sin opiniones
    </span>
  )}

  <span className="hidden h-4 w-px bg-zinc-300 sm:block" />

  <span className="inline-flex items-center gap-1.5 font-bold text-green-700">
    <BadgeCheck size={17} />
    Compra segura
  </span>
</div>

      <div className="mt-6 rounded-3xl bg-zinc-950 p-5 text-white sm:p-6">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-yellow-400">
          Precio online
        </p>

        <div className="mt-2 flex flex-wrap items-end gap-x-3 gap-y-1">
          <span className="text-4xl font-black tracking-tight sm:text-5xl">
            S/{producto.precio.toLocaleString("es-PE")}
          </span>

          {producto.precioAntes && (
            <span className="pb-1 text-xl font-bold text-zinc-400 line-through">
              S/{producto.precioAntes.toLocaleString("es-PE")}
            </span>
          )}
        </div>

        {ahorro > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-yellow-400 px-3 py-1.5 text-xs font-black text-black">
              -{porcentajeDescuento}%
            </span>
            <span className="text-sm font-bold text-green-400">
              Ahorras S/{ahorro.toLocaleString("es-PE")}
            </span>
          </div>
        )}
      </div>

      {producto.descripcion && (
        <p className="mt-5 text-base leading-7 text-zinc-600">
          {producto.descripcion}
        </p>
      )}

      {producto.beneficios.length > 0 && (
        <div className="mt-5 space-y-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
          {producto.beneficios.slice(0, 5).map((beneficio) => (
            <div key={beneficio} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-500 text-white">
                <Check size={13} strokeWidth={3} />
              </span>
              <span className="text-sm font-semibold leading-6 text-zinc-700">
                {beneficio}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 grid grid-cols-2 gap-3">
        <TrustCard icon={<Truck size={21} />} title="Envíos" text="A todo el Perú" />
        <TrustCard icon={<ShieldCheck size={21} />} title="Garantía" text="Compra respaldada" />
        <TrustCard icon={<MessageCircle size={21} />} title="Asesoría" text="Antes y después" />
        <TrustCard icon={<LockKeyhole size={21} />} title="Pago seguro" text="Pedido confirmado" />
      </div>

      <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-t border-zinc-200 pt-6">
        <div>
          <label className="text-sm font-black text-zinc-950">Cantidad</label>
          <div className="mt-2 inline-flex overflow-hidden rounded-2xl border border-zinc-300 bg-white">
            <button
              type="button"
              onClick={disminuirCantidad}
              disabled={cantidad <= 1}
              aria-label="Disminuir cantidad"
              className="grid h-12 w-12 place-items-center transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Minus size={18} />
            </button>

            <div className="grid h-12 min-w-14 place-items-center border-x border-zinc-300 px-3 text-lg font-black">
              {cantidad}
            </div>

            <button
              type="button"
              onClick={aumentarCantidad}
              aria-label="Aumentar cantidad"
              className="grid h-12 w-12 place-items-center transition hover:bg-zinc-100"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>

        <div className="pb-1 text-right text-sm font-bold">
          {pocasUnidades ? (
            <p className="text-orange-600">Quedan {producto.stock} unidades</p>
          ) : disponible ? (
            <p className="text-green-700">Stock disponible</p>
          ) : (
            <p className="text-red-600">Sin stock</p>
          )}
          <p className="mt-1 text-zinc-500">Confirmación por WhatsApp</p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <button
          ref={comprarAhoraRef}
          type="button"
          onClick={onComprar}
          disabled={!disponible}
          className="flex w-full items-center justify-center gap-3 rounded-2xl border-b-4 border-yellow-600 bg-yellow-400 px-5 py-4 text-lg font-black text-black shadow-[0_12px_30px_rgba(250,204,21,0.28)] transition hover:-translate-y-0.5 hover:bg-yellow-300 active:translate-y-0 disabled:cursor-not-allowed disabled:border-zinc-400 disabled:bg-zinc-300 disabled:text-zinc-500 disabled:shadow-none"
        >
          <ShoppingCart size={22} />
          {disponible ? "COMPRAR AHORA" : "PRODUCTO AGOTADO"}
        </button>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-3 rounded-2xl bg-green-600 px-5 py-4 text-base font-black text-white transition hover:bg-green-700 active:scale-[0.99]"
        >
          <MessageCircle size={21} />
          CONSULTAR POR WHATSAPP
        </a>
      </div>

      <div className="mt-5 flex items-start gap-3 rounded-2xl bg-green-50 p-4 text-sm text-green-800">
        <PackageCheck className="mt-0.5 shrink-0" size={21} />
        <p className="leading-6">
          <strong>Compra con tranquilidad.</strong> Un asesor verificará tus datos y coordinará el envío antes del despacho.
        </p>
      </div>
    </aside>
  );
}

function TrustCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-3.5">
      <div className="text-yellow-600">{icon}</div>
      <p className="mt-2 text-sm font-black text-zinc-950">{title}</p>
      <p className="mt-0.5 text-xs font-semibold leading-5 text-zinc-500">{text}</p>
    </div>
  );
}
