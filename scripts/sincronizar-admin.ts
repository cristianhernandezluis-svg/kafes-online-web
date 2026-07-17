import "dotenv/config";

import prisma from "../lib/prisma";

async function main() {
  const email = process.env.ADMIN_EMAIL
    ?.trim()
    .toLowerCase();

  const passwordHashBase64 =
    process.env.ADMIN_PASSWORD_HASH_B64;

  if (!email || !passwordHashBase64) {
    throw new Error(
      "Faltan ADMIN_EMAIL o ADMIN_PASSWORD_HASH_B64.",
    );
  }

  const passwordHash = Buffer.from(
    passwordHashBase64,
    "base64",
  ).toString("utf8");

  if (
    !passwordHash.startsWith("$2a$") &&
    !passwordHash.startsWith("$2b$")
  ) {
    throw new Error(
      "La contraseña decodificada no contiene un hash bcrypt válido.",
    );
  }

  const administrador =
    await prisma.administrador.upsert({
      where: {
        email,
      },
      update: {
        nombre: "Cristian",
        passwordHash,
        activo: true,
      },
      create: {
        nombre: "Cristian",
        email,
        passwordHash,
        activo: true,
      },
    });

  console.log(
    `Administrador guardado correctamente: ${administrador.email}`,
  );
}

main()
  .catch((error) => {
    console.error(
      "No se pudo guardar el administrador:",
      error,
    );

    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });