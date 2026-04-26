import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { apiError } from "@/lib/apiError";
import { getPrisma } from "@/lib/prisma";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

const registerSchema = z.object({
  username: z.string().min(3).max(20).regex(/^[a-z0-9_]+$/),
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request.headers);
    const limited = await checkRateLimit(`register:${ip}`, 5, 60_000);
    if (!limited.ok) {
      return NextResponse.json({ error: "muitas tentativas. aguarde um pouco" }, { status: 429 });
    }

    const parsed = registerSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json({ error: "dados inválidos" }, { status: 400 });
    }

    const username = parsed.data.username.toLowerCase();
    const email = parsed.data.email.toLowerCase();
    const prisma = getPrisma();
    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (existing) {
      return NextResponse.json({ error: "usuário ou email já existe" }, { status: 409 });
    }

    const hashed = await bcrypt.hash(parsed.data.password, 12);
    await prisma.user.create({
      data: {
        username,
        email,
        password: hashed,
        avatar: username.slice(0, 2).toUpperCase(),
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return apiError(error, "não foi possível criar a conta");
  }
}
