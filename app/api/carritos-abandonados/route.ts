import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type GuardarCarritoBody = {
  sessionId?: string;
  productoId?: number;
  cantidad?: number;
  nombre?: string;
  celular?: string;
  ciudad?: string;
  region?: string;
  direccion?: string;
};

function limpiarTexto(valor: unknown, maximo = 200) {
  return typeof valor === "string" ? valor.trim().slice(0, maximo) : "";
}

function campoOpcional(valor: unknown, maximo = 200) {
  if (typeof valor !== "string") return undefined;
  const texto = valor.trim().slice(0, maximo);
  return texto || null;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as GuardarCarritoBody;

    const sessionId = limpiarTexto(body.sessionId, 120);
    const productoId = Number(body.productoId);

    const cantidadRecibida = Number(body.cantidad ?? 1);
    const cantidad =
      Number.isInteger(cantidadRecibida) && cantidadRecibida > 0
        ? Math.min(cantidadRecibida, 20)
        : 1;

    if (!sessionId || !Number.isInteger(productoId) || productoId <= 0) {
      return NextResponse.json(
        { ok: false, error: "Datos incompletos" },
        { status: 400 }
      );
    }

    const [producto, sesion] = await Promise.all([
      prisma.producto.findUnique({
        where: { id: productoId },
        select: {
          id: true,
          nombre: true,
          slug: true,
          precio: true,
          imagenes: {
            orderBy: [{ esPrincipal: "desc" }, { orden: "asc" }],
            take: 1,
            select: { url: true },
          },
        },
      }),
      prisma.sesionAnalitica.findUnique({
        where: { sessionId },
        select: {
          utmSource: true,
          utmMedium: true,
          utmCampaign: true,
          utmContent: true,
          fbclid: true,
          ttclid: true,
        },
      }),
    ]);

    if (!producto) {
      return NextResponse.json(
        { ok: false, error: "Producto no encontrado" },
        { status: 404 }
      );
    }

    const precio = Number(producto.precio);
    const total = Number((precio * cantidad).toFixed(2));
    const ahora = new Date();

    const nombre = campoOpcional(body.nombre, 120);
    const celular = campoOpcional(body.celular, 40);
    const ciudad = campoOpcional(body.ciudad, 120);
    const region = campoOpcional(body.region, 120);
    const direccion = campoOpcional(body.direccion, 300);

    const carrito = await prisma.carritoAbandonado.upsert({
      where: { sessionId },
      create: {
        sessionId,
        productoId: producto.id,
        productoNombre: producto.nombre,
        productoSlug: producto.slug,
        imagenUrl: producto.imagenes[0]?.url ?? null,
        precio,
        cantidad,
        total,
        nombre: nombre ?? null,
        celular: celular ?? null,
        ciudad: ciudad ?? null,
        region: region ?? null,
        direccion: direccion ?? null,
        utmSource: sesion?.utmSource ?? null,
        utmMedium: sesion?.utmMedium ?? null,
        utmCampaign: sesion?.utmCampaign ?? null,
        utmContent: sesion?.utmContent ?? null,
        fbclid: sesion?.fbclid ?? null,
        ttclid: sesion?.ttclid ?? null,
        estado: "ABIERTO",
        checkoutIniciadoAt: ahora,
        ultimaActividadAt: ahora,
      },
      update: {
        productoId: producto.id,
        productoNombre: producto.nombre,
        productoSlug: producto.slug,
        imagenUrl: producto.imagenes[0]?.url ?? null,
        precio,
        cantidad,
        total,
        ...(nombre !== undefined ? { nombre } : {}),
        ...(celular !== undefined ? { celular } : {}),
        ...(ciudad !== undefined ? { ciudad } : {}),
        ...(region !== undefined ? { region } : {}),
        ...(direccion !== undefined ? { direccion } : {}),
        utmSource: sesion?.utmSource ?? null,
        utmMedium: sesion?.utmMedium ?? null,
        utmCampaign: sesion?.utmCampaign ?? null,
        utmContent: sesion?.utmContent ?? null,
        fbclid: sesion?.fbclid ?? null,
        ttclid: sesion?.ttclid ?? null,
        estado: "ABIERTO",
        ultimaActividadAt: ahora,
      },
      select: {
        id: true,
        sessionId: true,
        estado: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ ok: true, carrito });
  } catch (error) {
    console.error("Error guardando carrito abandonado:", error);

    return NextResponse.json(
      { ok: false, error: "No se pudo guardar el carrito" },
      { status: 500 }
    );
  }
}
