-- AlterTable
ALTER TABLE "configuracion_tienda" ADD COLUMN     "googleAnalyticsActivo" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "googleAnalyticsId" TEXT,
ADD COLUMN     "googleTagManagerActivo" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "googleTagManagerId" TEXT,
ADD COLUMN     "metaPixelActivo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "metaPixelId" TEXT DEFAULT '1247868925891875',
ADD COLUMN     "tiktokPixelActivo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "tiktokPixelId" TEXT DEFAULT 'D8D21TBC77UFK9KDRPDG';
