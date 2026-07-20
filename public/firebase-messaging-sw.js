/*
 * IMPORTANTE:
 * El listener notificationclick debe declararse antes
 * de importar Firebase para evitar que Firebase
 * reemplace el comportamiento personalizado.
 */

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const datos = event.notification.data || {};

  const urlPedido =
    datos.url ||
    "https://kafesonline.com/admin/pedidos";

  const whatsappUrl = datos.whatsappUrl;

  let urlDestino = urlPedido;

  if (event.action === "whatsapp" && whatsappUrl) {
    urlDestino = whatsappUrl;
  }

  if (event.action === "ver-pedido") {
    urlDestino = urlPedido;
  }

  event.waitUntil(
    (async () => {
      /*
       * Para WhatsApp abrimos directamente una nueva ventana.
       */
      if (event.action === "whatsapp") {
        await clients.openWindow(urlDestino);
        return;
      }

      /*
       * Para el pedido intentamos reutilizar una pestaña
       * ya abierta de KAFES ONLINE.
       */
      const ventanas = await clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });

      for (const ventana of ventanas) {
        if (
          ventana.url.includes("kafesonline.com") &&
          "focus" in ventana
        ) {
          if ("navigate" in ventana) {
            await ventana.navigate(urlDestino);
          }

          await ventana.focus();
          return;
        }
      }

      await clients.openWindow(urlDestino);
    })(),
  );
});

importScripts(
  "https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js",
);

importScripts(
  "https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js",
);

firebase.initializeApp({
  apiKey:
    "AIzaSyA65my-7A_U9N-mHMsbojU1tnLh7Jcc98A",
  authDomain:
    "kafes-online.firebaseapp.com",
  projectId:
    "kafes-online",
  storageBucket:
    "kafes-online.firebasestorage.app",
  messagingSenderId:
    "48167082668",
  appId:
    "1:48167082668:web:8c792aed47e433259c1d09",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Nuevo pedido:",
    payload,
  );

  const datos = payload.data || {};

  const titulo =
    datos.title ||
    "🔔 Nuevo pedido en KAFES ONLINE";

  const opciones = {
    body:
      datos.body ||
      "Se ha registrado un nuevo pedido.",

    icon: "/pwa/icon-192.png",
    badge: "/pwa/icon-192.png",

    tag: `pedido-${datos.pedidoId || Date.now()}`,
    renotify: true,
    requireInteraction: true,

    data: {
      url:
        datos.url ||
        "https://kafesonline.com/admin/pedidos",

      whatsappUrl:
        datos.whatsappUrl || "",
    },

    actions: [
      {
        action: "ver-pedido",
        title: "📦 Ver pedido",
      },
      {
        action: "whatsapp",
        title: "💬 WhatsApp",
      },
    ],
  };

  return self.registration.showNotification(
    titulo,
    opciones,
  );
});