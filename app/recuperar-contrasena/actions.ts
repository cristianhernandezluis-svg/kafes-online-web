"use server";

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

  return {
    error: "",
    success:
      "La solicitud fue recibida. En el siguiente paso conectaremos el envío del correo.",
  };
}