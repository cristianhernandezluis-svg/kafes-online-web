import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const pedido = await prisma.pedido.findFirst({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        codigo: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      ok: true,
      pedido,
    });
  } catch (error) {
    console.error("Error consultando último pedido:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "No se pudo consultar el último pedido.",
      },
      {
        status: 500,
      },
    );
  }
}