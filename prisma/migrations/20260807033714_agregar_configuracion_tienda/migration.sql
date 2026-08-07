-- CreateTable
CREATE TABLE "configuracion_tienda" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "nombreTienda" TEXT NOT NULL DEFAULT 'KAFES ONLINE',
    "razonSocial" TEXT,
    "ruc" TEXT,
    "telefono" TEXT,
    "whatsapp" TEXT,
    "whatsappMensaje" TEXT,
    "email" TEXT,
    "direccion" TEXT,
    "horarioAtencion" TEXT,
    "logoUrl" TEXT,
    "logoPublicId" TEXT,
    "moneda" TEXT NOT NULL DEFAULT 'PEN',
    "simboloMoneda" TEXT NOT NULL DEFAULT 'S/',
    "facebookUrl" TEXT,
    "instagramUrl" TEXT,
    "tiktokUrl" TEXT,
    "youtubeUrl" TEXT,
    "textoFooter" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "configuracion_tienda_pkey" PRIMARY KEY ("id")
);
