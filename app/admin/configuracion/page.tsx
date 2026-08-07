import Link from "next/link";
import {
  Building2,
  CheckCircle2,
  ExternalLink,
  Globe2,
  MessageCircle,
  Save,
  Settings,
} from "lucide-react";

import prisma from "@/lib/prisma";
import WhatsAppAdvisorManager from "@/components/admin/asesores/WhatsAppAdvisorManager";
import Card from "@/components/admin/ui/Card";
import Input from "@/components/admin/ui/Input";
import Textarea from "@/components/admin/ui/Textarea";
import PageHeader from "@/components/admin/ui/PageHeader";
import SingleImageUploader from "@/components/admin/media/SingleImageUploader";

import { guardarConfiguracionTienda } from "./actions";

export const dynamic = "force-dynamic";

type ConfiguracionPageProps = {
  searchParams: Promise<{
    guardado?: string;
  }>;
};

export default async function ConfiguracionPage({
  searchParams,
}: ConfiguracionPageProps) {
  const query = await searchParams;

  const configuracion =
    await prisma.configuracionTienda.findUnique({
      where: {
        id: 1,
      },
    });

  return (
    <form action={guardarConfiguracionTienda}>
      <PageHeader
        eyebrow="Administración"
        title="Configuración"
        description="Administra los datos generales, contacto, identidad y redes sociales de KAFES ONLINE."
        actions={
          <>
            <Link
              href="/"
              target="_blank"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            >
              <ExternalLink size={18} />
              Ver tienda
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
              Configuración guardada
            </p>

            <p className="mt-1 text-sm">
              Los datos generales de la tienda se
              actualizaron correctamente.
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <Card
            title="Datos de la empresa"
            description="Información principal de tu tienda y empresa."
          >
            <div className="space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <Input
                  label="Nombre de la tienda"
                  name="nombreTienda"
                  defaultValue={
                    configuracion?.nombreTienda ??
                    "KAFES ONLINE"
                  }
                  placeholder="KAFES ONLINE"
                  required
                />

                <Input
                  label="Razón social"
                  name="razonSocial"
                  defaultValue={
                    configuracion?.razonSocial ?? ""
                  }
                  placeholder="Nombre o razón social"
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <Input
                  label="RUC"
                  name="ruc"
                  defaultValue={
                    configuracion?.ruc ?? ""
                  }
                  placeholder="Ejemplo: 10477161630"
                />

                <Input
                  label="Correo electrónico"
                  name="email"
                  defaultValue={
                    configuracion?.email ?? ""
                  }
                  placeholder="ventas@kafesonline.com"
                />
              </div>

              <Input
                label="Dirección"
                name="direccion"
                defaultValue={
                  configuracion?.direccion ?? ""
                }
                placeholder="Dirección principal de la empresa"
              />

              <Input
                label="Horario de atención"
                name="horarioAtencion"
                defaultValue={
                  configuracion?.horarioAtencion ??
                  ""
                }
                placeholder="Lunes a sábado de 8:00 a.m. a 7:00 p.m."
              />
            </div>
          </Card>

          <Card
            title="Contacto y WhatsApp"
            description="Estos datos podrán utilizarse posteriormente en toda la tienda."
          >
            <div className="space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <Input
                  label="Teléfono"
                  name="telefono"
                  defaultValue={
                    configuracion?.telefono ??
                    "+51 980 296 583"
                  }
                  placeholder="+51 980 296 583"
                />

                <Input
                  label="WhatsApp"
                  name="whatsapp"
                  defaultValue={
                    configuracion?.whatsapp ??
                    "51980296583"
                  }
                  placeholder="51980296583"
                />
              </div>

              <Textarea
                label="Mensaje inicial de WhatsApp"
                name="whatsappMensaje"
                defaultValue={
                  configuracion?.whatsappMensaje ??
                  "Hola, quiero información sobre sus productos."
                }
                placeholder="Mensaje que aparecerá al abrir WhatsApp"
              />

              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                <div className="flex gap-3">
                  <MessageCircle
                    size={21}
                    className="mt-0.5 shrink-0 text-emerald-700"
                  />

                  <div>
                    <p className="text-sm font-black text-emerald-900">
                      Número recomendado
                    </p>

                    <p className="mt-1 text-xs leading-5 text-emerald-700">
                      Guarda WhatsApp con código de
                      país. Por ejemplo:
                      51980296583.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

<Card
  title="Asesores de WhatsApp"
  description="Administra los asesores que aparecerán en el botón flotante de WhatsApp."
>
  <WhatsAppAdvisorManager />
</Card>

          <Card
            title="Identidad visual"
            description="Configura el logo principal de KAFES ONLINE."
          >
            <SingleImageUploader
              nameUrl="logoUrl"
              namePublicId="logoPublicId"
              initialUrl={
                configuracion?.logoUrl ?? ""
              }
              initialPublicId={
                configuracion?.logoPublicId ?? ""
              }
              altText="Logo de KAFES ONLINE"
              signaturePayload={{
                tipo: "logoTienda",
              }}
            />

            <p className="mt-3 text-xs leading-5 text-slate-500">
              Recomendado: PNG o WebP con fondo
              transparente. Utiliza una imagen de
              buena resolución.
            </p>
          </Card>

          <Card
            title="Redes sociales"
            description="Agrega los enlaces oficiales de tu negocio."
          >
            <div className="space-y-5">
              <Input
                label="Facebook"
                name="facebookUrl"
                defaultValue={
                  configuracion?.facebookUrl ?? ""
                }
                placeholder="https://facebook.com/..."
              />

              <Input
                label="Instagram"
                name="instagramUrl"
                defaultValue={
                  configuracion?.instagramUrl ?? ""
                }
                placeholder="https://instagram.com/..."
              />

              <Input
                label="TikTok"
                name="tiktokUrl"
                defaultValue={
                  configuracion?.tiktokUrl ?? ""
                }
                placeholder="https://tiktok.com/@..."
              />

              <Input
                label="YouTube"
                name="youtubeUrl"
                defaultValue={
                  configuracion?.youtubeUrl ?? ""
                }
                placeholder="https://youtube.com/@..."
              />
            </div>
          </Card>

          <Card
            title="Pie de página"
            description="Texto institucional que podrá mostrarse en el footer de la tienda."
          >
            <Textarea
              label="Texto del footer"
              name="textoFooter"
              defaultValue={
                configuracion?.textoFooter ??
                "Herramientas profesionales con envío a todo el Perú."
              }
              placeholder="Escribe una descripción breve de la empresa"
            />
          </Card>
        </div>

        <aside className="space-y-6">
          <Card
            title="Moneda"
            description="Configuración comercial de la tienda."
          >
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Moneda
                </label>

                <select
                  name="moneda"
                  defaultValue={
                    configuracion?.moneda ?? "PEN"
                  }
                  className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-slate-700"
                >
                  <option value="PEN">
                    PEN - Sol peruano
                  </option>

                  <option value="USD">
                    USD - Dólar
                  </option>
                </select>
              </div>

              <Input
                label="Símbolo"
                name="simboloMoneda"
                defaultValue={
                  configuracion?.simboloMoneda ??
                  "S/"
                }
                placeholder="S/"
                required
              />
            </div>
          </Card>

          <Card
            title="Estado del módulo"
            description="Resumen de la configuración general."
          >
            <div className="space-y-4">
              <div className="flex items-start gap-3 rounded-xl border border-slate-200 p-4">
                <Building2
                  size={19}
                  className="mt-0.5 shrink-0 text-slate-500"
                />

                <div>
                  <p className="text-sm font-black text-slate-900">
                    Empresa
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Nombre, RUC, dirección y
                    contacto centralizados.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-slate-200 p-4">
                <Globe2
                  size={19}
                  className="mt-0.5 shrink-0 text-slate-500"
                />

                <div>
                  <p className="text-sm font-black text-slate-900">
                    Redes sociales
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Facebook, Instagram, TikTok y
                    YouTube desde un solo lugar.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-slate-200 p-4">
                <Settings
                  size={19}
                  className="mt-0.5 shrink-0 text-slate-500"
                />

                <div>
                  <p className="text-sm font-black text-slate-900">
                    Configuración global
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    En los siguientes pasos
                    conectaremos estos datos con
                    toda la tienda pública.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </aside>
      </div>
    </form>
  );
}