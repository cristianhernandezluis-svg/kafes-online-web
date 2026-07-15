import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "kafes_admin_session";

async function sesionValida(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const secret = process.env.SESSION_SECRET;

  if (!token || !secret) {
    return false;
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret),
    );

    return payload.role === "admin";
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const autenticado = await sesionValida(request);
  const pathname = request.nextUrl.pathname;

  if (autenticado) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.json(
      {
        error: "No autorizado.",
      },
      {
        status: 401,
      },
    );
  }

  const loginUrl = new URL("/login", request.url);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/api/cloudinary/signature",
  ],
};