"use client";

import {
  useEffect,
  useRef,
} from "react";

import {
  usePathname,
  useSearchParams,
} from "next/navigation";

type SesionLocal = {
  sessionId: string;
  ultimaActividad: number;

  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmContent: string | null;
  utmTerm: string | null;

  fbclid: string | null;
  ttclid: string | null;
};

const CLAVE_SESION =
  "kafes_sesion_analitica";

const DURACION_SESION =
  30 * 60 * 1000;

function crearSessionId() {
  if (
    typeof crypto !== "undefined" &&
    "randomUUID" in crypto
  ) {
    return crypto.randomUUID();
  }

  return [
    Date.now(),
    Math.random()
      .toString(36)
      .slice(2),
  ].join("-");
}

function obtenerParametro(
  params: URLSearchParams,
  nombre: string
) {
  const valor =
    params.get(nombre)?.trim();

  return valor || null;
}

function obtenerSesion(
  params: URLSearchParams
): SesionLocal {
  const ahora = Date.now();

  let guardada: SesionLocal | null =
    null;

  try {
    const raw =
      localStorage.getItem(
        CLAVE_SESION
      );

    if (raw) {
      guardada =
        JSON.parse(raw) as SesionLocal;
    }
  } catch {
    guardada = null;
  }

  const expirada =
    !guardada ||
    !guardada.sessionId ||
    ahora -
      guardada.ultimaActividad >
      DURACION_SESION;

  const utmSource =
    obtenerParametro(
      params,
      "utm_source"
    );

  const utmMedium =
    obtenerParametro(
      params,
      "utm_medium"
    );

  const utmCampaign =
    obtenerParametro(
      params,
      "utm_campaign"
    );

  const utmContent =
    obtenerParametro(
      params,
      "utm_content"
    );

  const utmTerm =
    obtenerParametro(
      params,
      "utm_term"
    );

  const fbclid =
    obtenerParametro(
      params,
      "fbclid"
    );

  const ttclid =
    obtenerParametro(
      params,
      "ttclid"
    );

  const tieneAtribucionNueva =
    Boolean(
      utmSource ||
        utmMedium ||
        utmCampaign ||
        utmContent ||
        utmTerm ||
        fbclid ||
        ttclid
    );

  const sesion: SesionLocal =
  expirada
    ? {
        sessionId:
          crearSessionId(),

        ultimaActividad:
          ahora,

        utmSource,
        utmMedium,
        utmCampaign,
        utmContent,
        utmTerm,

        fbclid,
        ttclid,
      }
    : {
        sessionId:
          guardada!.sessionId,

        ultimaActividad:
          ahora,

        utmSource:
          tieneAtribucionNueva
            ? utmSource
            : guardada!.utmSource,

        utmMedium:
          tieneAtribucionNueva
            ? utmMedium
            : guardada!.utmMedium,

        utmCampaign:
          tieneAtribucionNueva
            ? utmCampaign
            : guardada!.utmCampaign,

        utmContent:
          tieneAtribucionNueva
            ? utmContent
            : guardada!.utmContent,

        utmTerm:
          tieneAtribucionNueva
            ? utmTerm
            : guardada!.utmTerm,

        fbclid:
          tieneAtribucionNueva
            ? fbclid
            : guardada!.fbclid,

        ttclid:
          tieneAtribucionNueva
            ? ttclid
            : guardada!.ttclid,
      };

  try {
    localStorage.setItem(
      CLAVE_SESION,
      JSON.stringify(sesion)
    );
  } catch {
    // No bloquear la tienda
  }

  return sesion;
}

export default function AnalyticsTracker() {
  const pathname =
    usePathname();

  const searchParams =
    useSearchParams();

  const ultimaPaginaRef =
    useRef<{
      clave: string;
      momento: number;
    } | null>(null);

  useEffect(() => {
    if (!pathname) {
      return;
    }

    if (
      pathname.startsWith(
        "/admin"
      )
    ) {
      return;
    }

    const query =
      searchParams.toString();

    const clavePagina =
      query
        ? `${pathname}?${query}`
        : pathname;

    const ahora =
      Date.now();

    if (
      ultimaPaginaRef.current &&
      ultimaPaginaRef.current
        .clave ===
        clavePagina &&
      ahora -
        ultimaPaginaRef.current
          .momento <
        2000
    ) {
      return;
    }

    ultimaPaginaRef.current = {
      clave: clavePagina,
      momento: ahora,
    };

    const params =
      new URLSearchParams(
        query
      );

    const sesion =
      obtenerSesion(params);

    const payload = {
      sessionId:
        sesion.sessionId,

      landingPath:
        clavePagina,

      referrer:
        document.referrer ||
        null,

      utmSource:
        sesion.utmSource,

      utmMedium:
        sesion.utmMedium,

      utmCampaign:
        sesion.utmCampaign,

      utmContent:
        sesion.utmContent,

      utmTerm:
        sesion.utmTerm,

      fbclid:
        sesion.fbclid,

      ttclid:
        sesion.ttclid,
    };

    fetch(
      "/api/analytics/session",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify(
          payload
        ),

        keepalive: true,
      }
    ).catch(() => {
      // La analítica nunca debe
      // interrumpir la compra
    });
  }, [
    pathname,
    searchParams,
  ]);

  return null;
}