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

import { guardarPromocionesHome } from "./actions";

export const dynamic = "force-dynamic";

const TIPO_SECCION = "PROMOCIONES";

type TarjetaPromocion = {
  titulo: string;
  texto: string;
  href: string;
  icono: string;
  fondo: string;
};

type ConfiguracionPromociones = {
  enlaceTodos: string;
  tarjetas: TarjetaPromocion[];
};

type PromocionesPageProps = {
  searchParams: Promise<{
    guardado?: string;
  }>;
};

const TARJETAS_PREDETERMINADAS: TarjetaPromocion[] = [
  {
    titulo: "Hidrolavadoras",
    texto: "Potencia para autos, motos y maquinaria.",
    href: "/categoria/hidrolavadoras",
    icono: "gotas",
    fondo: "azul",
  },
  {
    titulo: "Jardinería",
    texto: "Sierras, podadoras y cortasetos.",
    href: "/categoria/jardineria",
    icono: "arbol",
    fondo: "verde",
  },
  {
    titulo: "Generadores",
    texto: "Energía segura donde la necesites.",
    href: "/categoria/generadores",
    icono: "rayo",
    fondo: "oscuro",
  },
];

function obtenerCadena(
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
): ConfiguracionPromociones {
  if (
    !valor ||
    typeof valor !== "object" ||
    Array.isArray(valor)
  ) {
    return {
      enlaceTodos: "#productos",
      tarjetas: TARJETAS_PREDETERMINADAS,
    };
  }

  const configuracion =
    valor as Record<string, unknown>;

  const tarjetasRecibidas =
    Array.isArray(configuracion.tarjetas)
      ? configuracion.tarjetas
      : [];

  const tarjetas =
    TARJETAS_PREDETERMINADAS.map(
      (predeterminada, indice) => {
        const valorTarjeta =
          tarjetasRecibidas[indice];

        if (
          !valorTarjeta ||
          typeof valorTarjeta !== "object" ||
          Array.isArray(valorTarjeta)
        ) {
          return predeterminada;
        }

        const tarjeta =
          valorTarjeta as Record<
            string,
            unknown
          >;

        return {
          titulo: obtenerCadena(
            tarjeta.titulo,
            predeterminada.titulo
          ),
          texto: obtenerCadena(
            tarjeta.texto,
            predeterminada.texto
          ),
          href: obtenerCadena(
            tarjeta.href,
            predeterminada.href
          ),
          icono: obtenerCadena(
            tarjeta.icono,
            predeterminada.icono
          ),
          fondo: obtenerCadena(
            tarjeta.fondo,
            predeterminada.fondo
          ),
        };
      }
    );

  return {
    enlaceTodos: obtenerCadena(
      configuracion.enlaceTodos,
      "#productos"
    ),
    tarjetas,
  };
}

export default async function PromocionesHomePage({
  searchParams,
}: PromocionesPageProps) {
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
    <form action={guardarPromocionesHome}>
      <PageHeader
        eyebrow="Página de inicio"
        title="Promociones"
        description="Personaliza las tarjetas de ofertas que aparecen en la portada."
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
              Las promociones de la portada se
              actualizaron correctamente.
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <Card
            title="Encabezado de la sección"
            description="Personaliza el título y el enlace superior."
          >
            <div className="space-y-5">
              <Input
                label="Título"
                name="titulo"
                defaultValue={
                  seccion?.titulo ??
                  "Ofertas especiales"
                }
                required
              />

              <Input
                label="Texto superior"
                name="subtitulo"
                defaultValue={
                  seccion?.subtitulo ??
                  "Solo por tiempo limitado"
                }
                required
              />

              <Input
                label="Enlace de Ver todos"
                name="enlaceTodos"
                defaultValue={
                  configuracion.enlaceTodos
                }
                placeholder="#productos"
                required
              />
            </div>
          </Card>

          {configuracion.tarjetas.map(
            (tarjeta, indice) => (
              <Card
                key={indice}
                title={`Promoción ${indice + 1}`}
                description="Configura el contenido, categoría y apariencia de esta tarjeta."
              >
                <div className="space-y-5">
                  <Input
                    label="Título"
                    name={`tarjeta${indice}Titulo`}
                    defaultValue={tarjeta.titulo}
                    required
                  />

                  <Textarea
                    label="Descripción"
                    name={`tarjeta${indice}Texto`}
                    defaultValue={tarjeta.texto}
                    required
                  />

                  <Input
                    label="Enlace"
                    name={`tarjeta${indice}Href`}
                    defaultValue={tarjeta.href}
                    placeholder="/categoria/hidrolavadoras"
                    required
                  />

                  <div className="grid gap-5 md:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 block text-sm font-bold text-slate-800">
                        Ícono
                      </span>

                      <select
                        name={`tarjeta${indice}Icono`}
                        defaultValue={tarjeta.icono}
                        className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none transition focus:border-slate-500 focus:ring-4 focus:ring-slate-100"
                      >
                        <option value="gotas">
                          Agua
                        </option>
                        <option value="arbol">
                          Jardinería
                        </option>
                        <option value="rayo">
                          Energía
                        </option>
                      </select>
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-sm font-bold text-slate-800">
                        Color
                      </span>

                      <select
                        name={`tarjeta${indice}Fondo`}
                        defaultValue={tarjeta.fondo}
                        className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none transition focus:border-slate-500 focus:ring-4 focus:ring-slate-100"
                      >
                        <option value="azul">
                          Azul
                        </option>
                        <option value="verde">
                          Verde
                        </option>
                        <option value="oscuro">
                          Negro
                        </option>
                        <option value="rojo">
                          Rojo
                        </option>
                        <option value="amarillo">
                          Amarillo
                        </option>
                      </select>
                    </label>
                  </div>
                </div>
              </Card>
            )
          )}
        </div>

        <aside>
          <Card
            title="Configuración"
            description="Controla la visibilidad del bloque."
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
                  Mostrar promociones
                </span>

                <span className="mt-1 block text-xs leading-5 text-slate-500">
                  Desmarca esta opción para ocultar
                  las tarjetas de la portada.
                </span>
              </span>
            </label>
          </Card>
        </aside>
      </div>
    </form>
  );
}