import prisma from "@/lib/prisma";
import { firebaseAdminMessaging } from "@/lib/firebase-admin";

type DatosPedido = {
  id: number;
  codigo: string;
  nombreCliente: string;
  telefonoCliente: string;
  total: number;
};

function prepararTelefonoWhatsApp(telefono: string) {
  const soloNumeros = telefono.replace(/\D/g, "");

  if (soloNumeros.startsWith("51")) {
    return soloNumeros;
  }

  if (soloNumeros.length === 9) {
    return `51${soloNumeros}`;
  }

  return soloNumeros;
}

export async function enviarNotificacionNuevoPedido(
  pedido: DatosPedido,
) {
  const dispositivos =
    await prisma.dispositivoPush.findMany({
      where: {
        activo: true,
      },
      select: {
        id: true,
        token: true,
      },
    });

  if (dispositivos.length === 0) {
    console.log(
      "No hay dispositivos registrados para notificaciones.",
    );

    return {
      enviados: 0,
      fallidos: 0,
    };
  }

  const tokens = dispositivos.map(
    (dispositivo) => dispositivo.token,
  );

  const telefonoWhatsApp = prepararTelefonoWhatsApp(
    pedido.telefonoCliente,
  );

  /*
   * Enviamos solamente datos.
   * El service worker construirá la notificación y sus botones.
   */
  const respuesta =
    await firebaseAdminMessaging.sendEachForMulticast({
      tokens,

      data: {
        title: "🔔 Nuevo pedido en KAFES ONLINE",
        body: `${pedido.nombreCliente} realizó el pedido #${pedido.codigo} por S/${pedido.total.toFixed(
          2,
        )}`,

        pedidoId: String(pedido.id),
        codigo: pedido.codigo,
        nombreCliente: pedido.nombreCliente,
        telefono: telefonoWhatsApp,

        url: `https://kafesonline.com/admin/pedidos/${pedido.id}`,

        whatsappUrl: `https://wa.me/${telefonoWhatsApp}?text=${encodeURIComponent(
          `Hola ${pedido.nombreCliente}, te escribimos de KAFES ONLINE para confirmar tu pedido ${pedido.codigo}.`,
        )}`,
      },

      webpush: {
        headers: {
          Urgency: "high",
        },
      },
    });

  const idsInvalidos: number[] = [];

  respuesta.responses.forEach(
    (resultado, indice) => {
      if (resultado.success) {
        return;
      }

      const codigo = resultado.error?.code;

      console.error(
        "Error enviando notificación:",
        codigo,
        resultado.error?.message,
      );

      if (
        codigo ===
          "messaging/registration-token-not-registered" ||
        codigo === "messaging/invalid-registration-token"
      ) {
        idsInvalidos.push(dispositivos[indice].id);
      }
    },
  );

  if (idsInvalidos.length > 0) {
    await prisma.dispositivoPush.updateMany({
      where: {
        id: {
          in: idsInvalidos,
        },
      },
      data: {
        activo: false,
      },
    });
  }

  return {
    enviados: respuesta.successCount,
    fallidos: respuesta.failureCount,
  };
}