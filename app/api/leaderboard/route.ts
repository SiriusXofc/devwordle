import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { apiError, unauthorized } from "@/lib/apiError";
import { authOptions } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return unauthorized();
    }

    const { searchParams } = new URL(request.url);
    const mode = searchParams.get("mode");
    const period = searchParams.get("period");
    const limit = Math.min(Number(searchParams.get("limit") ?? 20) || 20, 50);
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const prisma = getPrisma();

    const users = await prisma.user.findMany({
      orderBy: [{ xp: "desc" }, { totalWins: "desc" }],
      take: limit,
      where: {
        ...(mode && mode !== "ALL"
          ? {
              games: {
                some: { mode },
              },
            }
          : {}),
        ...(period === "weekly"
          ? {
              games: {
                some: {
                  ...(mode && mode !== "ALL" ? { mode } : {}),
                  createdAt: { gte: weekAgo },
                },
              },
            }
          : {}),
      },
      select: {
        id: true,
        username: true,
        avatar: true,
        xp: true,
        rank: true,
        totalWins: true,
        totalGames: true,
        currentStreak: true,
        bestStreak: true,
      },
    });

    return NextResponse.json({ users });
  } catch (error) {
    return apiError(error, "falha ao carregar leaderboard");
  }
}
