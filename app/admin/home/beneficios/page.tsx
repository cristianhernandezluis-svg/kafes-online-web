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

import { guardarBeneficiosHome } from "./actions";

export const dynamic = "force-dynamic";

const TIPO_SECCION = "BENEFICIOS";

type BeneficioHome = {
  titulo: string;
  texto: string;
  icono: string;
  orden: number;
};

type BeneficiosPageProps = {
  searchParams: Promise<{
    guardado?: string;
  }>;
};

const BENEFICIOS_PREDETERMINADOS: BeneficioHome[] = [
  {
    titulo: "Envíos nacionales",
    texto: "Llegamos a todo el Perú.",
    icono: "camion",
    orden: 1,
  },
  {
    titulo: "Compra confiable",
    texto: "Productos con garantía.",
    icono: "escudo",
    orden: 2,
  },
  {
    titulo: "Pago seguro",
    texto: "Compra mediante Izipay.",
    icono: "tarjeta",
    orden: 3,
  },
  {
    titulo: "Atención personalizada",
    texto: "Asesoría rápida por WhatsApp.",
    icono: "audifonos",
    orden: 4,
  },
];

function obtenerTexto(
  valor: unknown,
  predeterminado: string
) {
  return typeof valor === "string" &&
    valor.trim()
    ? valor.trim()
    : predeterminado;
}

function obtenerOrden(
  valor: unknown,
  predeterminado: number
) {
  return typeof valor === "number" &&
    Number.isInteger(valor) &&
    valor >= 1 &&
    valor <= 4
    ? valor
    : predeterminado;
}

function leerBeneficios(
  valor: unknown
): BeneficioHome[] {
  if (
    !valor ||
    typeof valor !== "object" ||
    Array.isArray(valor)
  ) {
    return BENEFICIOS_PREDETERMINADOS;
  }

  const configuracion =
    valor as Record<string, unknown>;

  const beneficiosRecibidos =
    Array.isArray(configuracion.beneficios)
      ? configuracion.beneficios
      : [];

  return BENEFICIOS_PREDETERMINADOS.map(
    (predeterminado, indice) => {
      const valorBeneficio =
        beneficiosRecibidos[indice];

      if (
        !valorBeneficio ||
        typeof valorBeneficio !== "object" ||
        Array.isArray(valorBeneficio)
      ) {
        return predeterminado;
      }

      const beneficio =
        valorBeneficio as Record<
          string,
          unknown
        >;

      return {
        titulo: obtenerTexto(
          beneficio.titulo,
          predeterminado.titulo
        ),
        texto: obtenerTexto(
          beneficio.texto,
          predeterminado.texto
        ),
        icono: obtenerTexto(
          beneficio.icono,
          predeterminado.icono
        ),
        orden: obtenerOrden(
          beneficio.orden,
          predeterminado.orden
        ),
      };
    }
  );
}

export default async function BeneficiosHomePage({
  searchParams,
}: BeneficiosPageProps) {
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

  const beneficios = leerBeneficios(
    seccion?.configuracion
  );

  return (
    <form action={guardarBeneficiosHome}>
      <PageHeader
        eyebrow="Página de inicio"
        title="Beneficios"
        description="Personaliza las ventajas que aparecen debajo del banner principal."
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
              Los beneficios de la portada se
              actualizaron correctamente.
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          {beneficios.map(
            (beneficio, indice) => (
              <Card
                key={indice}
                title={`Beneficio ${indice + 1}`}
                description="Personaliza el ícono, título, descripción y posición."
              >
                <div className="space-y-5">
                  <Input
                    label="Título"
                    name={`beneficio${indice}Titulo`}
                    defaultValue={beneficio.titulo}
                    required
                  />

                  <Textarea
                    label="Descripción"
                    name={`beneficio${indice}Texto`}
                    defaultValue={beneficio.texto}
                    required
                  />

                  <div className="grid gap-5 md:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 block text-sm font-bold text-slate-800">
                        Ícono
                      </span>

                      <select
                        name={`beneficio${indice}Icono`}
                        defaultValue={beneficio.icono}
                        className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none transition focus:border-slate-500 focus:ring-4 focus:ring-slate-100"
                      >
                        <option value="camion">
                          Camión / Envíos
                        </option>

                        <option value="escudo">
                          Escudo / Garantía
                        </option>

                        <option value="tarjeta">
                          Tarjeta / Pagos
                        </option>

                        <option value="audifonos">
                          Atención al cliente
                        </option>
                      </select>
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-sm font-bold text-slate-800">
                        Orden
                      </span>

                      <select
                        name={`beneficio${indice}Orden`}
                        defaultValue={String(
                          beneficio.orden
                        )}
                        className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none transition focus:border-slate-500 focus:ring-4 focus:ring-slate-100"
                      >
                        <option value="1">
                          Posición 1
                        </option>
                        <option value="2">
                          Posición 2
                        </option>
                        <option value="3">
                          Posición 3
                        </option>
                        <option value="4">
                          Posición 4
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
            description="Controla la visibilidad de los beneficios."
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
                  Mostrar beneficios
                </span>

                <span className="mt-1 block text-xs leading-5 text-slate-500">
                  Desmarca esta opción para ocultar
                  los cuatro beneficios de la
                  portada.
                </span>
              </span>
            </label>
          </Card>
        </aside>
      </div>
    </form>
  );
}