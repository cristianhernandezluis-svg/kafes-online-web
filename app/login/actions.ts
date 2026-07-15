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

  const adminEmail = "tu-cristianhernandezluis@gmail.com";

const passwordHash =
  "$2b$12$dNy7Pp4U8oo9VP8O5nvtnuYwm7umLeYTh3gxO1YmMo1oXlXHAyy72";

  if (!adminEmail || !passwordHash) {
    return {
      error: "El administrador no está configurado.",
    };
  }

  const emailCorrecto = email === adminEmail;

  const passwordCorrecto = await bcrypt.compare(
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