import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const pedido = await prisma.pedido.findFirst({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        codigo: true,
        total: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        pedido: pedido
          ? {
              ...pedido,
              total: pedido.total.toString(),
            }
          : null,
      },
      {
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate",
        },
      },
    );
  } catch (error) {
    console.error("Error obteniendo último pedido:", error);

    return NextResponse.json(
      {
        error: "No se pudo consultar el último pedido.",
      },
      {
        status: 500,
      },
    );
  }
}