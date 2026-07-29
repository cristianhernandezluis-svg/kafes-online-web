"use client";

import { useState } from "react";
import { ImagePlus, Loader2, Save, X } from "lucide-react";

type BannerInicial = {
  id?: number;
  titulo?: string | null;
  subtitulo?: string | null;
  textoBoton?: string | null;
  href?: string | null;
  alt?: string | null;
  imagenDesktopUrl?: string | null;
  imagenDesktopPublicId?: string | null;
  imagenMobileUrl?: string | null;
  imagenMobilePublicId?: string | null;
  activo?: boolean;
  orden?: number;
};

type BannerFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  submitLabel: string;
  initialData?: BannerInicial;
};

type CloudinaryUpload = {
  secure_url: string;
  public_id: string;
};

async function subirImagen(file: File, bannerId?: number) {
  const firmaResponse = await fetch("/api/cloudinary/signature", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tipo: "banner", bannerId }),
  });

  if (!firmaResponse.ok) {
    throw new Error("No se pudo preparar la carga de la imagen.");
  }

  const firma = await firmaResponse.json();
  const formData = new FormData();

  formData.append("file", file);
  formData.append("api_key", firma.apiKey);
  formData.append("timestamp", String(firma.timestamp));
  formData.append("signature", firma.signature);
  formData.append("folder", firma.folder);

  const uploadResponse = await fetch(
    `https://api.cloudinary.com/v1_1/${firma.cloudName}/image/upload`,
    { method: "POST", body: formData },
  );

  if (!uploadResponse.ok) {
    throw new Error("Cloudinary no pudo subir la imagen.");
  }

  return (await uploadResponse.json()) as CloudinaryUpload;
}

export default function BannerForm({
  action,
  submitLabel,
  initialData,
}: BannerFormProps) {
  const [desktopUrl, setDesktopUrl] = useState(
    initialData?.imagenDesktopUrl ?? "",
  );
  const [desktopPublicId, setDesktopPublicId] = useState(
    initialData?.imagenDesktopPublicId ?? "",
  );
  const [mobileUrl, setMobileUrl] = useState(
    initialData?.imagenMobileUrl ?? "",
  );
  const [mobilePublicId, setMobilePublicId] = useState(
    initialData?.imagenMobilePublicId ?? "",
  );
  const [subiendo, setSubiendo] = useState<"desktop" | "mobile" | null>(null);
  const [error, setError] = useState("");

  const cargar = async (file: File, tipo: "desktop" | "mobile") => {
    if (!file.type.startsWith("image/")) {
      setError("Selecciona un archivo de imagen válido.");
      return;
    }

    try {
      setError("");
      setSubiendo(tipo);
      const resultado = await subirImagen(file, initialData?.id);

      if (tipo === "desktop") {
        setDesktopUrl(resultado.secure_url);
        setDesktopPublicId(resultado.public_id);
      } else {
        setMobileUrl(resultado.secure_url);
        setMobilePublicId(resultado.public_id);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo subir la imagen.");
    } finally {
      setSubiendo(null);
    }
  };

  return (
    <form action={action} className="space-y-6">
      {initialData?.id ? (
        <input type="hidden" name="bannerId" value={initialData.id} />
      ) : null}

      <input type="hidden" name="imagenDesktopUrl" value={desktopUrl} />
      <input type="hidden" name="imagenDesktopPublicId" value={desktopPublicId} />
      <input type="hidden" name="imagenMobileUrl" value={mobileUrl} />
      <input type="hidden" name="imagenMobilePublicId" value={mobilePublicId} />

      <div className="grid gap-6 xl:grid-cols-2">
        <ImageField
          title="Imagen para computadora"
          description="Recomendado: 1920 × 560 px. Es obligatoria."
          url={desktopUrl}
          loading={subiendo === "desktop"}
          onFile={(file) => cargar(file, "desktop")}
          onClear={() => {
            setDesktopUrl("");
            setDesktopPublicId("");
          }}
        />

        <ImageField
          title="Imagen para celular"
          description="Recomendado: 1080 × 1200 px. Es opcional."
          url={mobileUrl}
          loading={subiendo === "mobile"}
          onFile={(file) => cargar(file, "mobile")}
          onClear={() => {
            setMobileUrl("");
            setMobilePublicId("");
          }}
        />
      </div>

      {error ? (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </p>
      ) : null}

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-black text-slate-950">Contenido y enlace</h2>
        <p className="mt-1 text-sm text-slate-500">
          Los textos son opcionales. Puedes usar solamente una imagen diseñada.
        </p>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <Field label="Título" name="titulo" defaultValue={initialData?.titulo ?? ""} />
          <Field
            label="Texto del botón"
            name="textoBoton"
            defaultValue={initialData?.textoBoton ?? ""}
            placeholder="Ejemplo: Comprar ahora"
          />
          <Field
            label="Enlace"
            name="href"
            required
            defaultValue={initialData?.href ?? "/"}
            placeholder="/producto/mi-producto"
          />
          <Field
            label="Texto alternativo"
            name="alt"
            required
            defaultValue={initialData?.alt ?? ""}
            placeholder="Describe brevemente el banner"
          />
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-bold text-slate-800">
              Subtítulo
            </label>
            <textarea
              name="subtitulo"
              defaultValue={initialData?.subtitulo ?? ""}
              rows={3}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-500 focus:ring-4 focus:ring-slate-100"
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-black text-slate-950">Publicación</h2>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <Field
            label="Orden"
            name="orden"
            type="number"
            defaultValue={String(initialData?.orden ?? 0)}
          />

          <label className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3">
            <input
              type="checkbox"
              name="activo"
              defaultChecked={initialData?.activo ?? true}
              className="h-5 w-5"
            />
            <span>
              <strong className="block text-sm text-slate-950">Banner activo</strong>
              <span className="text-xs text-slate-500">Se mostrará en la portada.</span>
            </span>
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={subiendo !== null || !desktopUrl}
        className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Save size={18} />
        {submitLabel}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  placeholder,
  required,
  type = "text",
}: {
  label: string;
  name: string;
  defaultValue: string;
  placeholder?: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-800">{label}</label>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        className="h-11 w-full rounded-xl border border-slate-300 px-4 text-sm outline-none transition focus:border-slate-500 focus:ring-4 focus:ring-slate-100"
      />
    </div>
  );
}

function ImageField({
  title,
  description,
  url,
  loading,
  onFile,
  onClear,
}: {
  title: string;
  description: string;
  url: string;
  loading: boolean;
  onFile: (file: File) => void;
  onClear: () => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-black text-slate-950">{title}</h2>
          <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
        </div>

        {url ? (
          <button
            type="button"
            onClick={onClear}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            aria-label="Quitar imagen"
          >
            <X size={18} />
          </button>
        ) : null}
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-dashed border-slate-300 bg-slate-50">
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt="Vista previa" className="aspect-[16/6] w-full object-cover" />
        ) : (
          <label className="flex aspect-[16/6] cursor-pointer flex-col items-center justify-center gap-2 p-6 text-center">
            {loading ? <Loader2 className="animate-spin" /> : <ImagePlus />}
            <span className="text-sm font-bold text-slate-700">
              {loading ? "Subiendo..." : "Seleccionar imagen"}
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={loading}
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) onFile(file);
                event.currentTarget.value = "";
              }}
            />
          </label>
        )}
      </div>
    </div>
  );
}
