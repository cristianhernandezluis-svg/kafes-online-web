import {
  Download,
  FileCheck2,
  FileText,
  Gauge,
  Library,
  ScrollText,
} from "lucide-react";

import type {
  ProductoDocumentoPublico,
  ProductoDocumentoTipo,
} from "./product-types";

type ProductDocumentsProps = {
  documentos: ProductoDocumentoPublico[];
};

const NOMBRES_TIPO: Record<ProductoDocumentoTipo, string> = {
  FICHA_TECNICA: "Ficha técnica",
  MANUAL: "Manual",
  CURVA_RENDIMIENTO: "Curva de rendimiento",
  CATALOGO: "Catálogo",
  CERTIFICADO: "Certificado",
  OTRO: "Documento",
};

function DocumentoIcono({
  tipo,
}: {
  tipo: ProductoDocumentoTipo;
}) {
  switch (tipo) {
    case "MANUAL":
      return <ScrollText size={24} />;

    case "CURVA_RENDIMIENTO":
      return <Gauge size={24} />;

    case "CATALOGO":
      return <Library size={24} />;

    case "CERTIFICADO":
      return <FileCheck2 size={24} />;

    case "FICHA_TECNICA":
    case "OTRO":
    default:
      return <FileText size={24} />;
  }
}

export default function ProductDocuments({
  documentos,
}: ProductDocumentsProps) {
  const documentosVisibles = documentos
    .filter((documento) => documento.visible)
    .sort((a, b) => a.orden - b.orden);

  if (documentosVisibles.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 md:py-16">
      <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-5 sm:p-8">
        <div className="text-center">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-yellow-600">
            Archivos oficiales
          </p>

          <h2 className="mt-2 text-2xl font-black text-zinc-950 sm:text-3xl">
            Documentación técnica
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-zinc-600 sm:text-base">
            Consulta las fichas técnicas, manuales, catálogos y
            demás documentos disponibles para este producto.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {documentosVisibles.map((documento) => (
            <a
              key={documento.id}
              href={documento.archivoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex min-w-0 items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-yellow-400 hover:shadow-md sm:p-5"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <DocumentoIcono tipo={documento.tipo} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs font-black uppercase tracking-wide text-zinc-500">
                  {NOMBRES_TIPO[documento.tipo]}
                </p>

                <h3 className="mt-1 break-words font-black text-zinc-950">
                  {documento.titulo}
                </h3>

                <p className="mt-1 text-sm font-semibold text-green-600">
                  Abrir documento PDF
                </p>
              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-950 text-white transition group-hover:bg-yellow-400 group-hover:text-black">
                <Download size={18} />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}