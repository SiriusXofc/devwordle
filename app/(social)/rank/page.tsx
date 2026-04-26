import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { RankPanel } from "@/components/rank/RankPanel";
import { TopCards } from "@/components/rank/TopCards";
import { PageHeader } from "@/components/shared/PageHeader";
import { authOptions } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";

type RankUser = {
  id: string;
  username: string;
  xp: number;
  totalWins: number;
  totalGames: number;
  currentStreak: number;
};

function sortRankUsers(users: RankUser[]) {
  return users.sort((a, b) => b.xp - a.xp || b.totalWins - a.totalWins).slice(0, 20);
}

async function getModeLeaderboard(mode: string): Promise<RankUser[]> {
  const prisma = getPrisma();
  const games = await prisma.game.findMany({
    where: { mode },
    select: {
      xpEarned: true,
      won: true,
      user: { select: { id: true, username: true, currentStreak: true } },
    },
  });

  const byUser = new Map<string, RankUser>();
  for (const game of games) {
    const existing =
      byUser.get(game.user.id) ??
      ({
        id: game.user.id,
        username: game.user.username,
        xp: 0,
        totalWins: 0,
        totalGames: 0,
        currentStreak: game.user.currentStreak,
      } satisfies RankUser);

    existing.xp += game.xpEarned;
    existing.totalGames += 1;
    existing.totalWins += game.won ? 1 : 0;
    byUser.set(game.user.id, existing);
  }

  return sortRankUsers(Array.from(byUser.values()));
}

async function getWeeklyLeaderboard(): Promise<RankUser[]> {
  const prisma = getPrisma();
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const games = await prisma.game.findMany({
    where: { createdAt: { gte: weekAgo } },
    select: {
      xpEarned: true,
      won: true,
      user: { select: { id: true, username: true, currentStreak: true } },
    },
  });

  const byUser = new Map<string, RankUser>();
  for (const game of games) {
    const existing =
      byUser.get(game.user.id) ??
      ({
        id: game.user.id,
        username: game.user.username,
        xp: 0,
        totalWins: 0,
        totalGames: 0,
        currentStreak: game.user.currentStreak,
      } satisfies RankUser);

    existing.xp += game.xpEarned;
    existing.totalGames += 1;
    existing.totalWins += game.won ? 1 : 0;
    byUser.set(game.user.id, existing);
  }

  return sortRankUsers(Array.from(byUser.values()));
}

async function getHardestWordThisWeek() {
  const prisma = getPrisma();
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const games = await prisma.game.findMany({
    where: { createdAt: { gte: weekAgo } },
    select: { word: true, won: true },
  });
  const byWord = new Map<string, { total: number; wins: number }>();

  for (const game of games) {
    const current = byWord.get(game.word) ?? { total: 0, wins: 0 };
    current.total += 1;
    current.wins += game.won ? 1 : 0;
    byWord.set(game.word, current);
  }

  const hardest = Array.from(byWord.entries())
    .filter(([, stats]) => stats.total >= 2)
    .sort((a, b) => a[1].wins / a[1].total - b[1].wins / b[1].total)[0];

  return hardest ? { word: hardest[0], sub: `${Math.round((hardest[1].wins / hardest[1].total) * 100)}% win rate` } : null;
}

export default async function RankPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/auth");
  }

  const prisma = getPrisma();
  const users = await prisma.user.findMany({
    orderBy: [{ xp: "desc" }, { totalWins: "desc" }],
    take: 20,
    select: {
      id: true,
      username: true,
      xp: true,
      totalWins: true,
      totalGames: true,
      currentStreak: true,
    },
  });
  const topWinsUser = [...users].sort((a, b) => b.totalWins - a.totalWins)[0];
  const topStreakUser = [...users].sort((a, b) => b.currentStreak - a.currentStreak)[0];
  const weeklyUsers = await getWeeklyLeaderboard();
  const hardestWord = await getHardestWordThisWeek();
  const byMode = {
    CLASSIC: await getModeLeaderboard("CLASSIC"),
    SPEED: await getModeLeaderboard("SPEED"),
    HARD: await getModeLeaderboard("HARD"),
    DAILY: await getModeLeaderboard("DAILY"),
  };

  return (
    <main className="min-h-screen bg-black pt-12">
      <Navbar />
      <div className="mx-auto grid w-full max-w-5xl gap-5 px-3 py-8">
        <PageHeader label="leaderboard" title="RANK GLOBAL" description="XP, streak e consistência. o topo não perdoa partida esquecida." />
        <TopCards
          winsToday={topWinsUser?.username ?? "N/A"}
          winsTodaySub={topWinsUser ? `${topWinsUser.totalWins} vitórias` : "sem dados"}
          streak={topStreakUser?.username ?? "N/A"}
          streakSub={topStreakUser ? `${topStreakUser.currentStreak} ativo` : "sem dados"}
          hardWord={hardestWord?.word ?? "N/A"}
          hardWordSub={hardestWord?.sub ?? "sem dados suficientes"}
        />
        <RankPanel users={users} weeklyUsers={weeklyUsers} byMode={byMode} currentUserId={session.user.id} />
      </div>
    </main>
  );
}
