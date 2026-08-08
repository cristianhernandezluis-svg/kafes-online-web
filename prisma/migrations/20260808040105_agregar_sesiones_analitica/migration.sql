-- CreateTable
CREATE TABLE "sesiones_analitica" (
    "id" SERIAL NOT NULL,
    "sessionId" TEXT NOT NULL,
    "landingPath" TEXT,
    "referrer" TEXT,
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "utmContent" TEXT,
    "utmTerm" TEXT,
    "fbclid" TEXT,
    "ttclid" TEXT,
    "deviceType" TEXT NOT NULL DEFAULT 'DESCONOCIDO',
    "userAgent" TEXT,
    "pageViews" INTEGER NOT NULL DEFAULT 1,
    "checkoutIniciadoAt" TIMESTAMP(3),
    "pedidoRealizadoAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sesiones_analitica_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sesiones_analitica_sessionId_key" ON "sesiones_analitica"("sessionId");

-- CreateIndex
CREATE INDEX "sesiones_analitica_createdAt_idx" ON "sesiones_analitica"("createdAt");

-- CreateIndex
CREATE INDEX "sesiones_analitica_deviceType_idx" ON "sesiones_analitica"("deviceType");

-- CreateIndex
CREATE INDEX "sesiones_analitica_utmSource_idx" ON "sesiones_analitica"("utmSource");

-- CreateIndex
CREATE INDEX "sesiones_analitica_utmCampaign_idx" ON "sesiones_analitica"("utmCampaign");

-- CreateIndex
CREATE INDEX "sesiones_analitica_checkoutIniciadoAt_idx" ON "sesiones_analitica"("checkoutIniciadoAt");

-- CreateIndex
CREATE INDEX "sesiones_analitica_pedidoRealizadoAt_idx" ON "sesiones_analitica"("pedidoRealizadoAt");
