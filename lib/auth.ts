import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "kafes_admin_session";

function obtenerSecreto() {
  const secret = process.env.SESSION_SECRET;

  if (!secret) {
    throw new Error("SESSION_SECRET no está configurado.");
  }

  return new TextEncoder().encode(secret);
}

export async function crearSesionAdmin(email: string) {
  const token = await new SignJWT({
    email,
    role: "admin",
  })
    .setProtectedHeader({
      alg: "HS256",
    })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(obtenerSecreto());

  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}

export async function obtenerSesionAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(
      token,
      obtenerSecreto(),
    );

    if (
      payload.role !== "admin" ||
      typeof payload.email !== "string"
    ) {
      return null;
    }

    return {
      email: payload.email,
      role: "admin" as const,
    };
  } catch {
    return null;
  }
}

export async function requerirAdmin() {
  const session = await obtenerSesionAdmin();

  if (!session) {
    redirect("/login");
  }

  return session;
}

export async function cerrarSesionAdmin() {
  const cookieStore = await cookies();

  cookieStore.delete(COOKIE_NAME);
}