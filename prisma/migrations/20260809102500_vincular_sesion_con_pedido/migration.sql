-- AlterTable
ALTER TABLE "pedidos" ADD COLUMN     "sessionId" TEXT;

-- CreateIndex
CREATE INDEX "pedidos_sessionId_idx" ON "pedidos"("sessionId");

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "sesiones_analitica"("sessionId") ON DELETE SET NULL ON UPDATE CASCADE;
