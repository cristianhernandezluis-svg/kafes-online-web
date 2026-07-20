/* global firebase */

importScripts(
  "https://www.gstatic.com/firebasejs/12.0.0/firebase-app-compat.js",
);

importScripts(
  "https://www.gstatic.com/firebasejs/12.0.0/firebase-messaging-compat.js",
);

firebase.initializeApp({
  apiKey: "BG6uW4ozkPILCQkhudmrC79rMn1VYLswqctukglNi05rTcN6sKy0bvmP8cScrQsHsR2PiZqJbrEPWCa7-mHRbXI",
  authDomain: "kafes-online.firebaseapp.com",
  projectId: "kafes-online",
  storageBucket:
    "kafes-online.firebasestorage.app",
  messagingSenderId: "48167082668",
  appId: "TU_FIREBASE_APP_ID",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const datos = payload.data || {};

  const titulo =
    datos.title || "🔔 Nuevo pedido en KAFES ONLINE";

  const opciones = {
    body:
      datos.body ||
      "Acaba de ingresar un nuevo pedido.",
    icon: "/pwa/icon-192.png",
    badge: "/pwa/icon-192.png",
    tag: datos.pedidoId
      ? `pedido-${datos.pedidoId}`
      : "nuevo-pedido",
    renotify: true,
    data: {
      url:
        datos.url ||
        "/admin/pedidos",
    },
  };

  return self.registration.showNotification(
    titulo,
    opciones,
  );
});

self.addEventListener(
  "notificationclick",
  (event) => {
    event.notification.close();

    const url =
      event.notification.data?.url ||
      "/admin/pedidos";

    event.waitUntil(
      clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      }).then((ventanas) => {
        for (const ventana of ventanas) {
          if ("focus" in ventana) {
            ventana.navigate(url);
            return ventana.focus();
          }
        }

        return clients.openWindow(url);
      }),
    );
  },
);