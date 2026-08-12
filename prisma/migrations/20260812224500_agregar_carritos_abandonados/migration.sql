-- CreateTable
CREATE TABLE "carritos_abandonados" (
    "id" SERIAL NOT NULL,
    "sessionId" TEXT NOT NULL,
    "productoId" INTEGER NOT NULL,
    "productoNombre" TEXT NOT NULL,
    "productoSlug" TEXT NOT NULL,
    "imagenUrl" TEXT,
    "precio" DECIMAL(10,2) NOT NULL,
    "cantidad" INTEGER NOT NULL DEFAULT 1,
    "total" DECIMAL(10,2) NOT NULL,
    "nombre" TEXT,
    "celular" TEXT,
    "ciudad" TEXT,
    "region" TEXT,
    "direccion" TEXT,
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "utmContent" TEXT,
    "fbclid" TEXT,
    "ttclid" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'ABIERTO',
    "checkoutIniciadoAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ultimaActividadAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "recuperadoAt" TIMESTAMP(3),
    "pedidoId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "carritos_abandonados_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "carritos_abandonados_sessionId_key" ON "carritos_abandonados"("sessionId");

-- CreateIndex
CREATE INDEX "carritos_abandonados_estado_idx" ON "carritos_abandonados"("estado");

-- CreateIndex
CREATE INDEX "carritos_abandonados_celular_idx" ON "carritos_abandonados"("celular");

-- CreateIndex
CREATE INDEX "carritos_abandonados_productoId_idx" ON "carritos_abandonados"("productoId");

-- CreateIndex
CREATE INDEX "carritos_abandonados_updatedAt_idx" ON "carritos_abandonados"("updatedAt");
