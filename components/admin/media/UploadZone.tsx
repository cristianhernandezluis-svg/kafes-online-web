"use client";

import {
  ImagePlus,
  LoaderCircle,
  Upload,
} from "lucide-react";
import {
  type DragEvent,
  type ChangeEvent,
  useRef,
} from "react";

type UploadZoneProps = {
  subiendo: boolean;
  disabled?: boolean;
  onFiles: (files: FileList | File[]) => void;
};

export default function UploadZone({
  subiendo,
  disabled = false,
  onFiles,
}: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function abrirSelector() {
    if (!disabled && !subiendo) {
      inputRef.current?.click();
    }
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();

    if (disabled || subiendo) {
      return;
    }

    if (event.dataTransfer.files.length > 0) {
      onFiles(event.dataTransfer.files);
    }
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files?.length) {
      onFiles(event.target.files);
    }

    event.target.value = "";
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={abrirSelector}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          abrirSelector();
        }
      }}
      onDragOver={(event) => event.preventDefault()}
      onDrop={handleDrop}
      className={[
        "flex min-h-56 flex-col items-center justify-center rounded-2xl",
        "border-2 border-dashed p-8 text-center transition",
        disabled || subiendo
          ? "cursor-not-allowed border-slate-200 bg-slate-100 opacity-70"
          : "cursor-pointer border-slate-300 bg-slate-50 hover:border-slate-500 hover:bg-white",
      ].join(" ")}
    >
      {subiendo ? (
        <>
          <LoaderCircle
            size={38}
            className="animate-spin text-slate-700"
          />

          <p className="mt-4 font-black text-slate-950">
            Subiendo imágenes...
          </p>

          <p className="mt-2 text-sm text-slate-500">
            No cierres esta página.
          </p>
        </>
      ) : (
        <>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
            <ImagePlus size={27} />
          </div>

          <p className="mt-5 text-base font-black text-slate-950">
            Arrastra imágenes aquí
          </p>

          <p className="mt-2 text-sm text-slate-500">
            o presiona para seleccionar archivos
          </p>

          <span className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-bold text-white">
            <Upload size={17} />
            Seleccionar imágenes
          </span>

          <p className="mt-4 text-xs text-slate-400">
            JPG, PNG o WEBP. Máximo 10 MB por imagen.
          </p>
        </>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        disabled={disabled || subiendo}
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}