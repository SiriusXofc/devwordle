import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { apiError, unauthorized } from "@/lib/apiError";
import { authOptions } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rateLimit";
import { getRankByXp } from "@/lib/rank";
import { calculateXp } from "@/lib/xp";
import { validateGamePayload } from "@/lib/gameValidation";
import { getWordCategory, getWordDifficulty } from "@/lib/words";

export const dynamic = "force-dynamic";

const gameSchema = z.object({
  word: z.string().length(5).regex(/^[A-Z]{5}$/),
  attempts: z.number().int().min(1).max(6),
  won: z.boolean(),
  mode: z.enum(["CLASSIC", "SPEED", "HARD", "DAILY"]),
  duration: z.number().int().min(3).max(3600),
  timeRemaining: z.number().int().min(0).max(90).optional(),
  guesses: z.array(z.object({ word: z.string(), result: z.array(z.enum(["correct", "present", "absent"])) })).optional(),
  hintUsed: z.boolean().optional(),
});

const COOLDOWN_MS: Record<z.infer<typeof gameSchema>["mode"], number> = {
  CLASSIC: 2 * 60_000,
  SPEED: 60_000,
  HARD: 60_000,
  DAILY: 0,
};

function dateKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function nextStreak({
  won,
  currentStreak,
  lastWonAt,
}: {
  won: boolean;
  currentStreak: number;
  lastWonAt: Date | null;
}) {
  if (!won) {
    return 0;
  }

  const today = dateKey();
  const yesterday = dateKey(new Date(Date.now() - 86_400_000));
  const lastWinDate = lastWonAt ? dateKey(lastWonAt) : null;

  if (lastWinDate === today) {
    return currentStreak;
  }

  if (lastWinDate === yesterday) {
    return currentStreak + 1;
  }

  return 1;
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return unauthorized();
    }

    const limited = await checkRateLimit(`game:${session.user.id}`, 30, 60_000);
    if (!limited.ok) {
      return NextResponse.json({ error: "muitas partidas. tente novamente em breve." }, { status: 429 });
    }

    const parsed = gameSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json({ error: "partida inválida" }, { status: 400 });
    }

    const payload = { ...parsed.data, word: parsed.data.word.toUpperCase() };
    const validationError = validateGamePayload(payload);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const prisma = getPrisma();
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        totalGames: true,
        totalWins: true,
        currentStreak: true,
        bestStreak: true,
        avgAttempts: true,
        xp: true,
        lastWonAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "usuário não encontrado" }, { status: 404 });
    }

    const today = dateKey();
    const cooldown = COOLDOWN_MS[payload.mode];
    if (cooldown > 0) {
      const recentGame = await prisma.game.findFirst({
        where: {
          userId: user.id,
          mode: payload.mode,
          createdAt: { gte: new Date(Date.now() - cooldown) },
        },
        select: { id: true },
      });

      if (recentGame) {
        return NextResponse.json({ error: "aguarde antes de registrar outra partida neste modo." }, { status: 429 });
      }
    }

    if (payload.mode === "DAILY") {
      const alreadyPlayed = await prisma.dailyCompletion.findUnique({
        where: { userId_date: { userId: user.id, date: today } },
      });

      if (alreadyPlayed) {
        return NextResponse.json({ error: "daily já registrado hoje" }, { status: 409 });
      }
    }

    const currentStreak = nextStreak({
      won: payload.won,
      currentStreak: user.currentStreak,
      lastWonAt: user.lastWonAt,
    });
    const xpEarned = calculateXp({
      ...payload,
      streak: payload.mode === "DAILY" ? currentStreak : 0,
    });
    const totalGames = user.totalGames + 1;
    const totalWins = user.totalWins + (payload.won ? 1 : 0);
    const bestStreak = Math.max(user.bestStreak, currentStreak);
    const avgAttempts = payload.won
      ? (user.avgAttempts * user.totalWins + payload.attempts) / Math.max(totalWins, 1)
      : user.avgAttempts;
    const nextXp = user.xp + xpEarned;
    const rank = getRankByXp(nextXp).name;

    await prisma.$transaction([
      prisma.game.create({
        data: {
          userId: user.id,
          word: payload.word,
          attempts: payload.attempts,
          won: payload.won,
          mode: payload.mode,
          duration: payload.duration,
          timeRemaining: payload.timeRemaining ?? null,
          difficulty: getWordDifficulty(payload.word),
          category: getWordCategory(payload.word),
          guesses: payload.guesses ? JSON.stringify(payload.guesses) : null,
          xpEarned,
          hintUsed: payload.hintUsed ?? false,
        },
      }),
      ...(payload.mode === "DAILY"
        ? [
            prisma.dailyCompletion.create({
              data: {
                userId: user.id,
                date: today,
              },
            }),
          ]
        : []),
      prisma.user.update({
        where: { id: user.id },
        data: {
          totalGames,
          totalWins,
          currentStreak,
          bestStreak,
          avgAttempts,
          xp: nextXp,
          rank,
          lastWonAt: payload.won ? new Date() : user.lastWonAt,
        },
      }),
    ]);

    return NextResponse.json({ xpEarned, rank, totalXp: nextXp });
  } catch (error) {
    return apiError(error, "falha ao registrar partida. tente novamente.");
  }
}
