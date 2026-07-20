import prisma from "@/lib/prisma";
import { firebaseAdminMessaging } from "@/lib/firebase-admin";

type DatosPedido = {
  id: number;
  codigo: string;
  nombreCliente: string;
  total: number;
};

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

  const respuesta =
    await firebaseAdminMessaging.sendEachForMulticast({
      tokens,

      data: {
        title: "🔔 Nuevo pedido en KAFES ONLINE",
        body: `${pedido.nombreCliente} realizó el pedido #${pedido.codigo} por S/${pedido.total.toFixed(
          2,
        )}`,
        pedidoId: String(pedido.id),
        url: `/admin/pedidos/${pedido.id}`,
      },

      webpush: {
        headers: {
          Urgency: "high",
        },

        notification: {
          title: "🔔 Nuevo pedido en KAFES ONLINE",
          body: `${pedido.nombreCliente} · S/${pedido.total.toFixed(
            2,
          )}`,
          icon: "/pwa/icon-192.png",
          badge: "/pwa/icon-192.png",
          tag: `pedido-${pedido.id}`,
          renotify: true,
        },

        fcmOptions: {
          link: `/admin/pedidos/${pedido.id}`,
        },
      },
    });

  const idsInvalidos: number[] = [];

  respuesta.responses.forEach(
    (resultado, indice) => {
      if (resultado.success) return;

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