import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { apiError, forbidden, unauthorized } from "@/lib/apiError";
import { authOptions } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const patchSchema = z.object({
  bio: z.string().max(180).optional(),
  avatar: z.string().max(4).optional(),
});

export async function GET(_: Request, { params }: { params: { username: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return unauthorized();
    }

    const prisma = getPrisma();
    const user = await prisma.user.findUnique({
      where: { username: params.username.toLowerCase() },
      select: {
        id: true,
        username: true,
        avatar: true,
        bio: true,
        createdAt: true,
        totalGames: true,
        totalWins: true,
        currentStreak: true,
        bestStreak: true,
        avgAttempts: true,
        xp: true,
        rank: true,
        games: {
          orderBy: { createdAt: "desc" },
          take: 50,
          select: {
            id: true,
            word: true,
            attempts: true,
            won: true,
            mode: true,
            duration: true,
            xpEarned: true,
            createdAt: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "perfil não encontrado" }, { status: 404 });
    }

    if (user.id !== session.user.id) {
      return NextResponse.json({ user, ownProfile: false });
    }

    const ownUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { email: true },
    });

    return NextResponse.json({ user: { ...user, email: ownUser?.email }, ownProfile: true });
  } catch (error) {
    return apiError(error, "falha ao carregar perfil");
  }
}

export async function PATCH(request: Request, { params }: { params: { username: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return unauthorized();
    }

    const parsed = patchSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json({ error: "dados inválidos" }, { status: 400 });
    }

    const body = parsed.data;
    const prisma = getPrisma();
    const user = await prisma.user.findUnique({
      where: { username: params.username.toLowerCase() },
      select: { id: true, bio: true, avatar: true },
    });

    if (!user || user.id !== session.user.id) {
      return forbidden();
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        bio: body.bio ?? user.bio,
        avatar: body.avatar ?? user.avatar,
      },
      select: {
        id: true,
        username: true,
        avatar: true,
        bio: true,
        createdAt: true,
        totalGames: true,
        totalWins: true,
        currentStreak: true,
        bestStreak: true,
        avgAttempts: true,
        xp: true,
        rank: true,
      },
    });

    return NextResponse.json({ user: updated });
  } catch (error) {
    return apiError(error, "falha ao atualizar perfil");
  }
}
