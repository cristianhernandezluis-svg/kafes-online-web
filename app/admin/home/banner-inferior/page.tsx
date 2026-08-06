import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  Save,
} from "lucide-react";

import prisma from "@/lib/prisma";
import Card from "@/components/admin/ui/Card";
import Input from "@/components/admin/ui/Input";
import Textarea from "@/components/admin/ui/Textarea";
import PageHeader from "@/components/admin/ui/PageHeader";
import SingleImageUploader from "@/components/admin/media/SingleImageUploader";

import { guardarBannerInferiorHome } from "./actions";

export const dynamic = "force-dynamic";

const TIPO_SECCION = "BANNER_INFERIOR";

type ConfiguracionBannerInferior = {
  etiqueta: string;
  textoBoton: string;
  urlBoton: string;
  imagen: string;
  imagenPublicId: string;
  alt: string;
};

type BannerInferiorPageProps = {
  searchParams: Promise<{
    guardado?: string;
  }>;
};

function obtenerTexto(
  valor: unknown,
  predeterminado: string
) {
  return typeof valor === "string" &&
    valor.trim()
    ? valor.trim()
    : predeterminado;
}

function leerConfiguracion(
  valor: unknown
): ConfiguracionBannerInferior {
  const predeterminado: ConfiguracionBannerInferior = {
    etiqueta: "PRECIOS ESPECIALES",
    textoBoton: "COMPRAR AHORA",
    urlBoton: "#productos",
    imagen: "/banner-taller-profesional.jpg",
    imagenPublicId: "",
    alt: "Herramientas profesionales Kafes Online",
  };

  if (
    !valor ||
    typeof valor !== "object" ||
    Array.isArray(valor)
  ) {
    return predeterminado;
  }

  const configuracion =
    valor as Record<string, unknown>;

  return {
    etiqueta: obtenerTexto(
      configuracion.etiqueta,
      predeterminado.etiqueta
    ),

    textoBoton: obtenerTexto(
      configuracion.textoBoton,
      predeterminado.textoBoton
    ),

    urlBoton: obtenerTexto(
      configuracion.urlBoton,
      predeterminado.urlBoton
    ),

    imagen: obtenerTexto(
      configuracion.imagen,
      predeterminado.imagen
    ),

    imagenPublicId:
      typeof configuracion.imagenPublicId ===
      "string"
        ? configuracion.imagenPublicId
        : "",

    alt: obtenerTexto(
      configuracion.alt,
      predeterminado.alt
    ),
  };
}

export default async function BannerInferiorPage({
  searchParams,
}: BannerInferiorPageProps) {
  const query = await searchParams;

  const seccion =
    await prisma.homeSection.findFirst({
      where: {
        tipo: TIPO_SECCION,
      },
      orderBy: {
        id: "asc",
      },
    });

  const configuracion = leerConfiguracion(
    seccion?.configuracion
  );

  return (
    <form action={guardarBannerInferiorHome}>
      <PageHeader
        eyebrow="Página de inicio"
        title="Banner inferior"
        description="Personaliza el banner promocional que aparece debajo de los productos destacados."
        actions={
          <>
            <Link
              href="/admin/home"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            >
              <ArrowLeft size={18} />
              Volver
            </Link>

            <Link
              href="/"
              target="_blank"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            >
              <ExternalLink size={18} />
              Ver portada
            </Link>

            <button
              type="submit"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              <Save size={18} />
              Guardar cambios
            </button>
          </>
        }
      />

      {query.guardado === "1" && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
          <CheckCircle2
            size={21}
            className="mt-0.5 shrink-0"
          />

          <div>
            <p className="font-black">
              Cambios guardados
            </p>

            <p className="mt-1 text-sm">
              El banner inferior se actualizó
              correctamente.
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <Card
            title="Imagen del banner"
            description="Sube una imagen horizontal para acompañar el texto promocional."
          >
            <SingleImageUploader
              nameUrl="imagen"
              namePublicId="imagenPublicId"
              initialUrl={configuracion.imagen}
              initialPublicId={
                configuracion.imagenPublicId
              }
              altText="Vista previa del banner inferior"
              signaturePayload={{
                tipo: "bannerInferior",
              }}
            />

            <p className="mt-3 text-xs leading-5 text-slate-500">
              Tamaño recomendado: 1200 × 800 px.
              Usa JPG, PNG o WebP.
            </p>
          </Card>

          <Card
            title="Contenido promocional"
            description="Personaliza los textos que verá el cliente."
          >
            <div className="space-y-5">
              <Input
                label="Etiqueta superior"
                name="etiqueta"
                defaultValue={configuracion.etiqueta}
                placeholder="PRECIOS ESPECIALES"
                required
              />

              <Input
                label="Título"
                name="titulo"
                defaultValue={
                  seccion?.titulo ??
                  "Equipa tu taller con herramientas profesionales"
                }
                required
              />

              <Textarea
                label="Descripción"
                name="subtitulo"
                defaultValue={
                  seccion?.subtitulo ??
                  "Encuentra equipos para construcción, agricultura, mantenimiento y trabajos especializados."
                }
                required
              />

              <div className="grid gap-5 md:grid-cols-2">
                <Input
                  label="Texto del botón"
                  name="textoBoton"
                  defaultValue={
                    configuracion.textoBoton
                  }
                  placeholder="COMPRAR AHORA"
                  required
                />

                <Input
                  label="Enlace del botón"
                  name="urlBoton"
                  defaultValue={
                    configuracion.urlBoton
                  }
                  placeholder="#productos"
                  required
                />
              </div>

              <Input
                label="Texto alternativo de la imagen"
                name="alt"
                defaultValue={configuracion.alt}
                placeholder="Describe brevemente la imagen"
                required
              />
            </div>
          </Card>
        </div>

        <aside>
          <Card
            title="Configuración"
            description="Controla la visibilidad del banner."
          >
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-slate-400">
              <input
                type="checkbox"
                name="activo"
                defaultChecked={
                  seccion?.activo ?? true
                }
                className="mt-1 h-4 w-4 rounded border-slate-300"
              />

              <span>
                <span className="block text-sm font-black text-slate-900">
                  Mostrar banner inferior
                </span>

                <span className="mt-1 block text-xs leading-5 text-slate-500">
                  Desmarca esta opción para ocultar
                  el banner de la portada.
                </span>
              </span>
            </label>
          </Card>
        </aside>
      </div>
    </form>
  );
}