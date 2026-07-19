import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kafes Online Administrador",
    short_name: "Kafes Admin",
    description:
      "Aplicación administrativa de Kafes Online para gestionar pedidos, productos y clientes.",

    start_url: "/admin/pedidos",
    scope: "/",
    display: "standalone",

    background_color: "#f1f5f9",
    theme_color: "#020617",

    orientation: "portrait",

    icons: [
      {
        src: "/pwa/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/pwa/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/pwa/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}