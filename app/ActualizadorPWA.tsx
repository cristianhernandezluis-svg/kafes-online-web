"use client";

import { useEffect } from "react";

export default function ActualizadorPWA() {
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !("serviceWorker" in navigator)
    ) {
      return;
    }

    let intervalo: ReturnType<typeof setInterval>;

    async function activarNuevaVersion(
      registro: ServiceWorkerRegistration
    ) {
      if (!registro.waiting) return;

      registro.waiting.postMessage({
        type: "SKIP_WAITING",
      });
    }

    async function iniciar() {
      try {
        const registro =
          await navigator.serviceWorker.register(
            "/firebase-messaging-sw.js",
            {
              scope: "/",
            }
          );

        // Si ya hay una versión nueva esperando,
        // activarla automáticamente.
        await activarNuevaVersion(registro);

        registro.addEventListener(
          "updatefound",
          () => {
            const nuevoWorker =
              registro.installing;

            if (!nuevoWorker) return;

            nuevoWorker.addEventListener(
              "statechange",
              () => {
                if (
                  nuevoWorker.state === "installed" &&
                  navigator.serviceWorker.controller
                ) {
                  void activarNuevaVersion(
                    registro
                  );
                }
              }
            );
          }
        );

        // Revisar actualizaciones cada minuto
        intervalo = setInterval(() => {
          registro.update().catch(console.error);
        }, 60 * 1000);
      } catch (error) {
        console.error(
          "Error registrando el service worker:",
          error
        );
      }
    }

    void iniciar();

    // Cuando la nueva versión toma control,
    // recargar automáticamente.
    const recargarPagina = () => {
      window.location.reload();
    };

    navigator.serviceWorker.addEventListener(
      "controllerchange",
      recargarPagina
    );

    return () => {
      if (intervalo) {
        clearInterval(intervalo);
      }

      navigator.serviceWorker.removeEventListener(
        "controllerchange",
        recargarPagina
      );
    };
  }, []);

  return null;
}