"use server";

import crypto from "node:crypto";

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

  const codigo = crypto
    .randomInt(0, 1000000)
    .toString()
    .padStart(6, "0");

  console.log("Código generado:", codigo);

  return {
    error: "",
    success:
      "Código generado correctamente. Revisa la consola del servidor.",
  };
}