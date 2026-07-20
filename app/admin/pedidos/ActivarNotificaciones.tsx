"use client";

import { useEffect, useState } from "react";
import { getToken } from "firebase/messaging";
import { Bell, BellRing, LoaderCircle } from "lucide-react";
import { obtenerFirebaseMessaging } from "@/lib/firebase";

type Estado =
  | "cargando"
  | "inactivo"
  | "activando"
  | "activo"
  | "bloqueado"
  | "error";

export default function ActivarNotificaciones() {
  const [estado, setEstado] = useState<Estado>("cargando");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !("Notification" in window) ||
      !("serviceWorker" in navigator)
    ) {
      setEstado("error");
      setMensaje(
        "Este dispositivo no admite notificaciones web.",
      );
      return;
    }

    if (Notification.permission === "denied") {
      setEstado("bloqueado");
      return;
    }

    const registrado =
      localStorage.getItem("kafes-push-activo") === "true";

    setEstado(
      Notification.permission === "granted" && registrado
        ? "activo"
        : "inactivo",
    );
  }, []);

  async function activar() {
    try {
      setEstado("activando");
      setMensaje("");

      const permiso = await Notification.requestPermission();

      if (permiso !== "granted") {
        setEstado(
          permiso === "denied" ? "bloqueado" : "inactivo",
        );
        return;
      }

      const registro =
        await navigator.serviceWorker.register(
          "/firebase-messaging-sw.js",
          {
            scope: "/",
          },
        );

      await navigator.serviceWorker.ready;

      const messaging = await obtenerFirebaseMessaging();

      if (!messaging) {
        throw new Error(
          "Firebase Messaging no está disponible.",
        );
      }

      const vapidKey =
  "BG6uW4ozkPILCQkhudmrC79rMn1VYLswqctukglNi05rTcN6sKy0bvmP8cScrQsHsR2PiZqJbrEPWCa7-mHRbXI";

      const token = await getToken(messaging, {
        vapidKey,
        serviceWorkerRegistration: registro,
      });

      if (!token) {
        throw new Error(
          "Firebase no devolvió un token para este dispositivo.",
        );
      }

      const response = await fetch("/api/push/suscribir", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          nombre: navigator.userAgent.includes("Android")
            ? "Android de Kafes Admin"
            : "Navegador de Kafes Admin",
        }),
      });

      const data = (await response.json()) as {
        ok?: boolean;
        error?: string;
      };

      if (!response.ok || !data.ok) {
        throw new Error(
          data.error || "No se pudo guardar el dispositivo.",
        );
      }

      localStorage.setItem("kafes-push-activo", "true");

      setEstado("activo");
      setMensaje("Este celular recibirá nuevos pedidos.");
    } catch (error) {
      console.error(
        "Error activando notificaciones:",
        error,
      );

      setEstado("error");
      setMensaje(
        error instanceof Error
          ? error.message
          : "No se pudieron activar las notificaciones.",
      );
    }
  }

  if (estado === "cargando") {
    return null;
  }

  if (estado === "activo") {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-bold text-green-700">
        <BellRing size={18} />
        Notificaciones activadas
      </div>
    );
  }

  if (estado === "bloqueado") {
    return (
      <div className="max-w-sm rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        <p className="font-bold">
          Notificaciones bloqueadas
        </p>

        <p className="mt-1 text-xs leading-5">
          Abre la configuración del sitio en Chrome y permite
          las notificaciones para kafesonline.com.
        </p>
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={activar}
        disabled={estado === "activando"}
        className="inline-flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {estado === "activando" ? (
          <>
            <LoaderCircle
              size={18}
              className="animate-spin"
            />
            Activando...
          </>
        ) : (
          <>
            <Bell size={18} />
            Activar notificaciones
          </>
        )}
      </button>

      {mensaje && (
        <p
          className={`mt-2 max-w-sm text-xs ${
            estado === "error"
              ? "text-red-600"
              : "text-slate-600"
          }`}
        >
          {mensaje}
        </p>
      )}
    </div>
  );
}