"use server";

import crypto from "node:crypto";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { Resend } from "resend";

import prisma from "@/lib/prisma";

type RecuperacionState = {
  error: string;
  success: string;
};

export async function solicitarRecuperacion(
  _state: RecuperacionState,
  formData: FormData,
): Promise<RecuperacionState> {
  const email = String(
    formData.get("email") ?? "",
  )
    .trim()
    .toLowerCase();

  if (!email || !email.includes("@")) {
    return {
      error: "Ingresa un correo válido.",
      success: "",
    };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const emailFrom = process.env.EMAIL_FROM;

  if (!apiKey || !emailFrom) {
    console.error(
      "Faltan RESEND_API_KEY o EMAIL_FROM.",
    );

    return {
      error:
        "El servicio de correo no está configurado.",
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
        error: "",
        success:
          "Si el correo está registrado, recibirás un código de verificación.",
      };
    }

    const codigo = crypto
      .randomInt(0, 1_000_000)
      .toString()
      .padStart(6, "0");

    const codigoHash = await bcrypt.hash(
      codigo,
      12,
    );

    const expiraEn = new Date(
      Date.now() + 10 * 60 * 1000,
    );

    await prisma.$transaction([
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

      prisma.tokenRecuperacion.create({
        data: {
          administradorId:
            administrador.id,
          codigoHash,
          expiraEn,
          utilizado: false,
          intentos: 0,
        },
      }),
    ]);

    const resend = new Resend(apiKey);

    const resultado =
      await resend.emails.send({
        from: emailFrom,
        to: [administrador.email],
        subject:
          "Código para cambiar tu contraseña",
        html: `
          <div style="margin:0;background:#f1f5f9;padding:40px 16px;font-family:Arial,sans-serif;color:#0f172a">
            <div style="max-width:520px;margin:auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:20px;padding:32px">
              <div style="width:52px;height:52px;margin:0 auto 20px;background:#020617;color:#ffffff;border-radius:14px;text-align:center;line-height:52px;font-size:22px;font-weight:900">
                K
              </div>

              <h1 style="margin:0;text-align:center;font-size:25px">
                Recuperar contraseña
              </h1>

              <p style="margin:16px 0 0;text-align:center;color:#64748b;line-height:1.6">
                Usa este código para cambiar la contraseña del administrador de KAFES ONLINE.
              </p>

              <div style="margin:28px 0;background:#f8fafc;border:1px solid #e2e8f0;border-radius:16px;padding:24px;text-align:center">
                <p style="margin:0 0 12px;color:#64748b;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px">
                  Código de verificación
                </p>

                <div style="font-size:38px;font-weight:900;letter-spacing:8px">
                  ${codigo}
                </div>
              </div>

              <p style="margin:0;text-align:center;color:#64748b;line-height:1.6">
                Este código vence en <strong>10 minutos</strong>.
                Si no solicitaste este cambio, ignora este correo.
              </p>
            </div>
          </div>
        `,
      });

    if (resultado.error) {
      console.error(
        "Error de Resend:",
        resultado.error,
      );

      return {
        error:
          "No se pudo enviar el código. Inténtalo nuevamente.",
        success: "",
      };
    }
  } catch (error) {
    console.error(
      "Error recuperando contraseña:",
      error,
    );

    return {
      error:
        "Ocurrió un problema al procesar la solicitud.",
      success: "",
    };
  }

  redirect(
    `/verificar-codigo?email=${encodeURIComponent(
      email,
    )}`,
  );
}