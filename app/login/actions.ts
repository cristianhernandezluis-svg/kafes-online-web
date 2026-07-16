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
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  const password = String(
    formData.get("password") ?? "",
  );

  const adminEmail = process.env.ADMIN_EMAIL
    ?.trim()
    .toLowerCase();

  const passwordHash =
    process.env.ADMIN_PASSWORD_HASH;

  if (!adminEmail || !passwordHash) {
    return {
      error: "El administrador no está configurado.",
    };
  }

  console.log("========== LOGIN ==========");
  console.log("ADMIN_EMAIL:", adminEmail);
  console.log("EMAIL INGRESADO:", email);
  console.log("EMAIL OK:", email === adminEmail);
  console.log("HASH EXISTE:", Boolean(passwordHash));

  const emailCorrecto = email === adminEmail;

  const passwordCorrecto = await bcrypt.compare(
  "Kafes2026",
  passwordHash,
);

console.log("HASH LEÍDO JSON:", JSON.stringify(passwordHash));
console.log("PASSWORD OK:", passwordCorrecto);

  console.log("PASSWORD OK:", passwordCorrecto);
  console.log("===========================");

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