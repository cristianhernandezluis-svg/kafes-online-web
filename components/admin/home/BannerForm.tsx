"use client";

import SingleImageUploader from "@/components/admin/media/SingleImageUploader";
import Button from "@/components/admin/ui/Button";
import Checkbox from "@/components/admin/ui/Checkbox";
import Input from "@/components/admin/ui/Input";
import Textarea from "@/components/admin/ui/Textarea";

type BannerFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  submitLabel: string;

  initialValues?: {
    id?: number;
    titulo?: string;
    subtitulo?: string;
    botonTexto?: string;
    botonLink?: string;
    orden?: number;
    activo?: boolean;
    imagenUrl?: string;
    publicId?: string;
  };
};

export default function BannerForm({
  action,
  submitLabel,
  initialValues,
}: BannerFormProps) {
  return (
    <form action={action} className="space-y-8">

      {initialValues?.id && (
        <input
          type="hidden"
          name="id"
          value={initialValues.id}
        />
      )}

      <SingleImageUploader
        nameUrl="imagenUrl"
        namePublicId="publicId"
        initialUrl={initialValues?.imagenUrl}
        initialPublicId={initialValues?.publicId}
        altText={initialValues?.titulo ?? "Banner"}
        signaturePayload={{
          tipo: "banner",
          bannerId: initialValues?.id,
        }}
      />

      <Input
        label="Título"
        name="titulo"
        defaultValue={initialValues?.titulo}
        required
      />

      <Textarea
        label="Subtítulo"
        name="subtitulo"
        defaultValue={initialValues?.subtitulo}
      />

      <div className="grid gap-6 md:grid-cols-2">

        <Input
          label="Texto del botón"
          name="botonTexto"
          defaultValue={initialValues?.botonTexto}
        />

        <Input
          label="Enlace"
          name="botonLink"
          defaultValue={initialValues?.botonLink}
        />

      </div>

      <div className="grid gap-6 md:grid-cols-2">

        <Input
          label="Orden"
          name="orden"
          type="number"
          defaultValue={String(
            initialValues?.orden ?? 0,
          )}
        />

        <Checkbox
          label="Banner activo"
          name="activo"
          defaultChecked={
            initialValues?.activo ?? true
          }
        />

      </div>

      <div className="flex justify-end">

        <Button type="submit">

          {submitLabel}

        </Button>

      </div>

    </form>
  );
}