import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      token?: string;
      nombre?: string;
    };

    const token = body.token?.trim();
    const nombre =
      body.nombre?.trim() || "Dispositivo administrador";

    if (!token) {
      return NextResponse.json(
        {
          error: "No se recibió el token del dispositivo.",
        },
        {
          status: 400,
        },
      );
    }

    const dispositivo = await prisma.dispositivoPush.upsert({
      where: {
        token,
      },
      update: {
        nombre,
        activo: true,
      },
      create: {
        token,
        nombre,
        activo: true,
      },
      select: {
        id: true,
        nombre: true,
        activo: true,
      },
    });

    return NextResponse.json({
      ok: true,
      dispositivo,
    });
  } catch (error) {
    console.error(
      "Error registrando dispositivo push:",
      error,
    );

    return NextResponse.json(
      {
        error: "No se pudo registrar el dispositivo.",
      },
      {
        status: 500,
      },
    );
  }
}