-- AlterTable
ALTER TABLE "carritos_abandonados" ADD COLUMN     "errorPedido" TEXT,
ADD COLUMN     "errorPedidoAt" TIMESTAMP(3),
ADD COLUMN     "intentoPedidoAt" TIMESTAMP(3),
ADD COLUMN     "ultimoPaso" TEXT NOT NULL DEFAULT 'CHECKOUT_INICIADO';
