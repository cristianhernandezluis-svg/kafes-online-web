"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type MonitorPedidosProps = {
  ultimoPedidoInicial: number | null;
};

export default function MonitorPedidos({
  ultimoPedidoInicial,
}: MonitorPedidosProps) {
  const router = useRouter();

  const ultimoPedidoRef = useRef<number | null>(
  ultimoPedidoInicial,
);

  const primeraConsultaRef = useRef(true);
  const [sonidoActivo, setSonidoActivo] = useState(false);
  const [nuevoPedido, setNuevoPedido] = useState(false);

  async function activarSonido() {
    try {
      const audio = new Audio("/sonidos/nuevo-pedido.mp3");
      audio.volume = 0.8;

      await audio.play();
      audio.pause();
      audio.currentTime = 0;

      setSonidoActivo(true);
    } catch (error) {
      console.error("No se pudo activar el sonido:", error);
    }
  }

  useEffect(() => {
    let ejecutando = false;

    async function revisarPedidos() {
      if (ejecutando) return;

      ejecutando = true;

      try {
        const response = await fetch(
          "/api/admin/pedidos/ultimo",
          {
            method: "GET",
            cache: "no-store",
          },
        );

        if (!response.ok) {
          throw new Error(
            `Error consultando pedidos: ${response.status}`,
          );
        }

        const data = (await response.json()) as {
          pedido: {
  id: number;
  codigo: string;
  createdAt: string;
} | null;
        };

        const pedidoActual = data.pedido;

        if (!pedidoActual) {
          primeraConsultaRef.current = false;
          return;
        }

        if (primeraConsultaRef.current) {
          ultimoPedidoRef.current = pedidoActual.id;
          primeraConsultaRef.current = false;
          return;
        }

        if (
          ultimoPedidoRef.current &&
          pedidoActual.id !== ultimoPedidoRef.current
        ) {
          ultimoPedidoRef.current = pedidoActual.id;
          setNuevoPedido(true);

          if (sonidoActivo) {
            const audio = new Audio(
              "/sonidos/nuevo-pedido.mp3",
            );

            audio.volume = 1;

            audio.play().catch((error) => {
              console.error(
                "El navegador bloqueó el sonido:",
                error,
              );
            });
          }

          router.refresh();

          window.setTimeout(() => {
            setNuevoPedido(false);
          }, 8000);
        }
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.warn("Monitor de pedidos: consulta temporalmente no disponible.", error);
        }
      } finally {
        ejecutando = false;
      }
    }

    revisarPedidos();

    const intervalo = window.setInterval(
      revisarPedidos,
      10000,
    );

    return () => {
      window.clearInterval(intervalo);
    };
  }, [router, sonidoActivo]);

  return (
    <>
      {!sonidoActivo && (
        <button
          type="button"
          onClick={activarSonido}
          className="fixed bottom-5 right-5 z-50 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-lg"
        >
          🔔 Activar sonido de pedidos
        </button>
      )}

      {sonidoActivo && !nuevoPedido && (
        <div className="fixed bottom-5 right-5 z-40 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700 shadow">
          🔊 Alertas activadas
        </div>
      )}

      {nuevoPedido && (
        <div className="fixed right-5 top-5 z-50 w-[calc(100%-40px)] max-w-sm rounded-2xl bg-slate-950 p-5 text-white shadow-2xl">
          <p className="text-lg font-extrabold">
            🔔 ¡Nuevo pedido!
          </p>

          <p className="mt-1 text-sm text-slate-300">
            El listado se actualizó automáticamente.
          </p>
        </div>
      )}
    </>
  );
}