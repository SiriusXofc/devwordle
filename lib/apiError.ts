import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export function apiError(error: unknown, fallback = "erro interno. tente novamente.") {
  console.error("[api]", error);

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return NextResponse.json({ error: "conflito: registro já existe" }, { status: 409 });
    }

    if (error.code === "P2025") {
      return NextResponse.json({ error: "registro não encontrado" }, { status: 404 });
    }
  }

  return NextResponse.json({ error: fallback }, { status: 500 });
}

export function unauthorized() {
  return NextResponse.json({ error: "não autorizado" }, { status: 401 });
}

export function forbidden() {
  return NextResponse.json({ error: "acesso negado" }, { status: 403 });
}
