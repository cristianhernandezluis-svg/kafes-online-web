"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

import prisma from "@/lib/prisma";
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

  if (!email || !password) {
    return {
      error: "Ingresa tu correo y contraseña.",
    };
  }

  try {
    const administrador =
      await prisma.administrador.findUnique({
        where: {
          email,
        },
      });

    if (
      !administrador ||
      !administrador.activo
    ) {
      return {
        error:
          "Correo o contraseña incorrectos.",
      };
    }

    const passwordCorrecto =
      await bcrypt.compare(
        password,
        administrador.passwordHash,
      );

    if (!passwordCorrecto) {
      return {
        error:
          "Correo o contraseña incorrectos.",
      };
    }

    await crearSesionAdmin(
      administrador.email,
    );
  } catch (error) {
    console.error(
      "Error al iniciar sesión:",
      error,
    );

    return {
      error:
        "No se pudo iniciar sesión. Inténtalo nuevamente.",
    };
  }

  redirect("/admin");
}

export async function cerrarSesion() {
  await cerrarSesionAdmin();
  redirect("/login");
}