import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { apiError, unauthorized } from "@/lib/apiError";
import { authOptions } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const emptyToUndefined = (value: unknown) => (value === "" ? undefined : value);

const accountSchema = z.object({
  username: z.preprocess(emptyToUndefined, z.string().min(3).max(20).regex(/^[a-z0-9_]+$/).optional()),
  email: z.preprocess(emptyToUndefined, z.string().email().optional()),
  currentPassword: z.preprocess(emptyToUndefined, z.string().optional()),
  newPassword: z.preprocess(emptyToUndefined, z.string().min(8).optional()),
  confirmPassword: z.preprocess(emptyToUndefined, z.string().optional()),
});

const deleteSchema = z.object({
  password: z.string().min(1),
});

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return unauthorized();
    }

    const parsed = accountSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json({ error: "dados inválidos" }, { status: 400 });
    }

    const username = parsed.data.username?.toLowerCase();
    const email = parsed.data.email?.toLowerCase();
    const { currentPassword, newPassword, confirmPassword } = parsed.data;
    const prisma = getPrisma();
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, username: true, email: true, password: true },
    });

    if (!user) {
      return NextResponse.json({ error: "usuário não encontrado" }, { status: 404 });
    }

    const data: { username?: string; email?: string; password?: string } = {};

    if (username && username !== user.username) {
      const existing = await prisma.user.findUnique({ where: { username } });
      if (existing) {
        return NextResponse.json({ error: "username já está em uso" }, { status: 409 });
      }
      data.username = username;
    }

    if (email && email !== user.email) {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        return NextResponse.json({ error: "email já está em uso" }, { status: 409 });
      }
      data.email = email;
    }

    if (newPassword) {
      if (!currentPassword || newPassword !== confirmPassword) {
        return NextResponse.json({ error: "senhas não conferem" }, { status: 400 });
      }

      const valid = await bcrypt.compare(currentPassword, user.password);
      if (!valid) {
        return NextResponse.json({ error: "senha atual inválida" }, { status: 400 });
      }

      data.password = await bcrypt.hash(newPassword, 12);
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ ok: true, changed: false });
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data,
      select: { username: true, email: true },
    });

    return NextResponse.json({
      ok: true,
      changed: true,
      requireReauth: Boolean(data.email || data.password),
      user: updated,
    });
  } catch (error) {
    return apiError(error, "falha ao atualizar conta");
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return unauthorized();
    }

    const parsed = deleteSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json({ error: "senha obrigatória para deletar conta" }, { status: 400 });
    }

    const prisma = getPrisma();
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, password: true },
    });

    if (!user || !(await bcrypt.compare(parsed.data.password, user.password))) {
      return NextResponse.json({ error: "senha incorreta" }, { status: 403 });
    }

    await prisma.user.delete({
      where: { id: user.id },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return apiError(error, "falha ao deletar conta");
  }
}
