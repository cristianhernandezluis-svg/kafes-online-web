"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  LoaderCircle,
  ShoppingCart,
} from "lucide-react";

type CrearPedidoDesdeCarritoProps = {
  sessionId: string;
  productoId: number;
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

  const [creando, setCreando] =
    useState(false);

  const [error, setError] =
    useState("");

  const datosBasicosCompletos =
    Boolean(nombre?.trim()) &&
    Boolean(celular?.trim());

  async function crearPedido() {
    if (creando) {
      return;
    }

    if (!datosBasicosCompletos) {
      setError(
        "Falta el nombre o celular del cliente.",
      );
      return;
    }

    const confirmado = window.confirm(
      "¿El cliente confirmó la compra? Se creará un pedido NUEVO y pasará a Pedidos.",
    );

    if (!confirmado) {
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
            cantidad,
            sessionId,

            nombre: nombre?.trim() ?? "",
            celular:
              celular?.trim() ?? "",

            dni: "",
            ciudad:
              ciudad?.trim() ?? "",
            region:
              region?.trim() ?? "",
            direccion:
              direccion?.trim() ?? "",
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

      /*
       * /api/pedidos ya se encarga de:
       *
       * 1. Crear el pedido como NUEVO.
       * 2. Crear o actualizar al cliente.
       * 3. Guardar el producto y precio.
       * 4. Marcar este carrito como RECUPERADO.
       * 5. Vincular el pedidoId al carrito.
       *
       * Después llevamos al asesor
       * directamente al pedido creado.
       */
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
    <div>
      <button
        type="button"
        onClick={crearPedido}
        disabled={
          creando ||
          !datosBasicosCompletos
        }
        className="inline-flex h-10 items-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-black text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {creando ? (
          <>
            <LoaderCircle
              size={16}
              className="animate-spin"
            />
            Creando...
          </>
        ) : (
          <>
            <ShoppingCart size={16} />
            Crear pedido
          </>
        )}
      </button>

      {error && (
        <p className="mt-2 max-w-56 text-xs font-semibold text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}