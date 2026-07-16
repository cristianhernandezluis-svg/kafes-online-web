"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

import {
  cerrarSesionAdmin,
  crearSesionAdmin,
} from "@/lib/auth";

type LoginState = {
  error: string;
};

export async function iniciarSesion(
  _state: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(
    formData.get("email") ?? "",
  )
    .trim()
    .toLowerCase();

  const password = String(
    formData.get("password") ?? "",
  );

  const adminEmail = process.env.ADMIN_EMAIL
    ?.trim()
    .toLowerCase();

  const passwordHashBase64 =
    process.env.ADMIN_PASSWORD_HASH_B64;

  const passwordHash = passwordHashBase64
    ? Buffer.from(
        passwordHashBase64,
        "base64",
      ).toString("utf8")
    : undefined;

  if (!adminEmail || !passwordHash) {
    return {
      error: "El administrador no está configurado.",
    };
  }

  const emailCorrecto =
    email === adminEmail;

  const passwordCorrecto =
    await bcrypt.compare(
      password,
      passwordHash,
    );

  if (!emailCorrecto || !passwordCorrecto) {
    return {
      error: "Correo o contraseña incorrectos.",
    };
  }

  await crearSesionAdmin(email);

  redirect("/admin");
}

export async function cerrarSesion() {
  await cerrarSesionAdmin();
  redirect("/login");
}