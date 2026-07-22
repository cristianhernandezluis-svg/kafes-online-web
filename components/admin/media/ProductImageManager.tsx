"use client";

import MediaManager from "./MediaManager";

type ProductImageManagerProps = {
  productoId: number;
  productoNombre: string;
};

export default function ProductImageManager({
  productoId,
  productoNombre,
}: ProductImageManagerProps) {
  return (
    <MediaManager
      apiPath={`/api/admin/productos/${productoId}/imagenes`}
      altText={productoNombre}
      signaturePayload={{
        productoId,
        tipo: "producto",
      }}
      titulo="Galería del producto"
      descripcionVacia="Este producto todavía no tiene imágenes."
      maximoArchivos={15}
    />
  );
}