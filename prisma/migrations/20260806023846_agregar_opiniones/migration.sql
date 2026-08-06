-- CreateTable
CREATE TABLE "opiniones" (
    "id" SERIAL NOT NULL,
    "productoId" INTEGER NOT NULL,
    "clienteNombre" TEXT NOT NULL,
    "ciudad" TEXT,
    "comentario" TEXT NOT NULL,
    "calificacion" INTEGER NOT NULL DEFAULT 5,
    "imagenUrl" TEXT,
    "imagenPublicId" TEXT,
    "compraVerificada" BOOLEAN NOT NULL DEFAULT true,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "opiniones_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "opiniones_productoId_idx" ON "opiniones"("productoId");

-- CreateIndex
CREATE INDEX "opiniones_productoId_visible_orden_idx" ON "opiniones"("productoId", "visible", "orden");

-- CreateIndex
CREATE INDEX "opiniones_visible_idx" ON "opiniones"("visible");

-- CreateIndex
CREATE INDEX "opiniones_fecha_idx" ON "opiniones"("fecha");

-- AddForeignKey
ALTER TABLE "opiniones" ADD CONSTRAINT "opiniones_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "productos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
