"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

import prisma from "@/lib/prisma";

type VerificarCodigoState = {
  error: string;
  success: string;
};

export async function verificarCodigoYCambiarPassword(
  _state: VerificarCodigoState,
  formData: FormData,
): Promise<VerificarCodigoState> {
  const email = String(
    formData.get("email") ?? "",
  )
    .trim()
    .toLowerCase();

  const codigo = String(
    formData.get("codigo") ?? "",
  ).trim();

  const password = String(
    formData.get("password") ?? "",
  );

  const confirmarPassword = String(
    formData.get("confirmarPassword") ?? "",
  );

  if (!email || !email.includes("@")) {
    return {
      error:
        "El correo de recuperación no es válido.",
      success: "",
    };
  }

  if (!/^\d{6}$/.test(codigo)) {
    return {
      error:
        "Ingresa el código completo de 6 dígitos.",
      success: "",
    };
  }

  if (password.length < 8) {
    return {
      error:
        "La nueva contraseña debe tener al menos 8 caracteres.",
      success: "",
    };
  }

  if (password !== confirmarPassword) {
    return {
      error: "Las contraseñas no coinciden.",
      success: "",
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
          "El código es incorrecto o ha vencido.",
        success: "",
      };
    }

    const token =
      await prisma.tokenRecuperacion.findFirst({
        where: {
          administradorId:
            administrador.id,
          utilizado: false,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    if (!token) {
      return {
        error:
          "El código es incorrecto o ha vencido.",
        success: "",
      };
    }

    if (token.intentos >= 5) {
      await prisma.tokenRecuperacion.update({
        where: {
          id: token.id,
        },
        data: {
          utilizado: true,
        },
      });

      return {
        error:
          "Superaste el número máximo de intentos. Solicita un código nuevo.",
        success: "",
      };
    }

    if (token.expiraEn.getTime() < Date.now()) {
      await prisma.tokenRecuperacion.update({
        where: {
          id: token.id,
        },
        data: {
          utilizado: true,
        },
      });

      return {
        error:
          "El código ha vencido. Solicita uno nuevo.",
        success: "",
      };
    }

    const codigoCorrecto =
      await bcrypt.compare(
        codigo,
        token.codigoHash,
      );

    if (!codigoCorrecto) {
      await prisma.tokenRecuperacion.update({
        where: {
          id: token.id,
        },
        data: {
          intentos: {
            increment: 1,
          },
        },
      });

      return {
        error:
          "El código es incorrecto o ha vencido.",
        success: "",
      };
    }

    const nuevoPasswordHash =
      await bcrypt.hash(password, 12);

    await prisma.$transaction([
      prisma.administrador.update({
        where: {
          id: administrador.id,
        },
        data: {
          passwordHash: nuevoPasswordHash,
        },
      }),

      prisma.tokenRecuperacion.update({
        where: {
          id: token.id,
        },
        data: {
          utilizado: true,
        },
      }),

      prisma.tokenRecuperacion.updateMany({
        where: {
          administradorId:
            administrador.id,
          utilizado: false,
        },
        data: {
          utilizado: true,
        },
      }),
    ]);
  } catch (error) {
    console.error(
      "Error cambiando contraseña:",
      error,
    );

    return {
      error:
        "No se pudo cambiar la contraseña. Inténtalo nuevamente.",
      success: "",
    };
  }

  redirect("/login?passwordActualizado=1");
}