"use client";

type LandingProductoProps = {
  producto: {
    contenidoHtml?: string | null;
  };
};

function optimizarImagenesHtml(html: string) {
  return html.replace(
    /<img\b([^>]*?)>/gi,
    (etiquetaCompleta) => {
      let etiqueta = etiquetaCompleta;

      etiqueta = etiqueta.replace(
        /src=(["'])(https:\/\/res\.cloudinary\.com\/dbu4nbnl\/image\/upload\/)([^"']+)\1/gi,
        (_match, comilla, base, resto) => {
          const yaOptimizada =
            resto.startsWith("f_auto,") ||
            resto.includes("/f_auto,") ||
            resto.includes("q_auto");

          const url = yaOptimizada
            ? `${base}${resto}`
            : `${base}f_auto,q_auto,c_limit,w_1200/${resto}`;

          return `src=${comilla}${url}${comilla}`;
        },
      );

      if (!/\bloading=/i.test(etiqueta)) {
        etiqueta = etiqueta.replace(
          /<img/i,
          '<img loading="lazy"',
        );
      }

      if (!/\bdecoding=/i.test(etiqueta)) {
        etiqueta = etiqueta.replace(
          /<img/i,
          '<img decoding="async"',
        );
      }

      return etiqueta;
    },
  );
}

export default function LandingProducto({
  producto,
}: LandingProductoProps) {
  if (!producto.contenidoHtml) {
    return null;
  }

  const contenidoOptimizado = optimizarImagenesHtml(
    producto.contenidoHtml,
  );

  return (
    <section className="bg-white py-10 md:py-16">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
        <article
          className="
            contenido-producto
            text-base leading-7 text-zinc-700
            [&_h1]:mb-6 [&_h1]:mt-10 [&_h1]:text-4xl [&_h1]:font-black
            [&_h2]:mb-5 [&_h2]:mt-9 [&_h2]:text-3xl [&_h2]:font-black
            [&_h3]:mb-4 [&_h3]:mt-8 [&_h3]:text-2xl [&_h3]:font-black
            [&_p]:my-4
            [&_strong]:font-black [&_strong]:text-black
            [&_ul]:my-5 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-7
            [&_ol]:my-5 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-7
            [&_img]:mx-auto [&_img]:my-8 [&_img]:h-auto
            [&_img]:max-w-full [&_img]:rounded-2xl
            [&_a]:font-bold [&_a]:text-blue-600 [&_a]:underline
          "
          dangerouslySetInnerHTML={{
            __html: contenidoOptimizado,
          }}
        />
      </div>
    </section>
  );
}