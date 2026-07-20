import {
  cert,
  getApps,
  initializeApp,
} from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";

function obtenerVariable(nombre: string) {
  const valor = process.env[nombre];

  if (!valor) {
    throw new Error(
      `Falta la variable de entorno ${nombre}.`,
    );
  }

  return valor;
}

const projectId = obtenerVariable(
  "FIREBASE_ADMIN_PROJECT_ID",
);

const clientEmail = obtenerVariable(
  "FIREBASE_ADMIN_CLIENT_EMAIL",
);

const privateKey = obtenerVariable(
  "FIREBASE_ADMIN_PRIVATE_KEY",
).replace(/\\n/g, "\n");

const firebaseAdminApp =
  getApps().length > 0
    ? getApps()[0]
    : initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
        projectId,
      });

export const firebaseAdminMessaging =
  getMessaging(firebaseAdminApp);