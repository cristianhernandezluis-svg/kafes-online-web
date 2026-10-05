ALTER TABLE "configuracion_tienda"
ADD COLUMN "checkoutMostrarAvisoProvincias" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "checkoutMensajeProvincias" TEXT NOT NULL DEFAULT 'Envio por Shalom u Olva. Para provincias trabajamos con adelanto para confirmar el pedido. No contamos con pago contraentrega fuera de Lima.';