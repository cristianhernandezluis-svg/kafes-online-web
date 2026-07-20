"use client";

import { useEffect, useState } from "react";

export default function ActualizadorPWA() {
  const [registro, setRegistro] =
    useState<ServiceWorkerRegistration | null>(null);

  const [mostrarActualizacion, setMostrarActualizacion] =
    useState(false);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !("serviceWorker" in navigator)
    ) {
      return;
    }

    let intervalo: ReturnType<typeof setInterval>;

    async function iniciar() {
      try {
        const swRegistro =
          await navigator.serviceWorker.register(
            "/firebase-messaging-sw.js",
            {
              scope: "/",
            },
          );

        setRegistro(swRegistro);

        if (swRegistro.waiting) {
          setMostrarActualizacion(true);
        }

        swRegistro.addEventListener("updatefound", () => {
          const nuevoWorker = swRegistro.installing;

          if (!nuevoWorker) return;

          nuevoWorker.addEventListener(
            "statechange",
            () => {
              if (
                nuevoWorker.state === "installed" &&
                navigator.serviceWorker.controller
              ) {
                setMostrarActualizacion(true);
              }
            },
          );
        });

        intervalo = setInterval(
          () => {
            swRegistro.update().catch(console.error);
          },
          60 * 1000,
        );
      } catch (error) {
        console.error(
          "Error registrando el service worker:",
          error,
        );
      }
    }

    iniciar();

    const actualizarPagina = () => {
      window.location.reload();
    };

    navigator.serviceWorker.addEventListener(
      "controllerchange",
      actualizarPagina,
    );

    return () => {
      if (intervalo) {
        clearInterval(intervalo);
      }

      navigator.serviceWorker.removeEventListener(
        "controllerchange",
        actualizarPagina,
      );
    };
  }, []);

  function actualizarAplicacion() {
    if (!registro?.waiting) {
      window.location.reload();
      return;
    }

    registro.waiting.postMessage({
      type: "SKIP_WAITING",
    });
  }

  if (!mostrarActualizacion) {
    return null;
  }

  return (
    <div className="fixed bottom-5 left-1/2 z-[9999] w-[calc(100%-32px)] max-w-md -translate-x-1/2 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl">
      <p className="text-sm font-bold text-slate-900">
        Nueva versión disponible
      </p>

      <p className="mt-1 text-xs text-slate-600">
        Actualiza KAFES ONLINE para obtener las últimas
        mejoras.
      </p>

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={actualizarAplicacion}
          className="flex-1 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white"
        >
          Actualizar ahora
        </button>

        <button
          type="button"
          onClick={() => setMostrarActualizacion(false)}
          className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700"
        >
          Después
        </button>
      </div>
    </div>
  );
}