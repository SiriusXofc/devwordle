import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { AttemptsChart } from "@/components/profile/AttemptsChart";
import { GameHistory } from "@/components/profile/GameHistory";
import { ProfileCard } from "@/components/profile/ProfileCard";
import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authOptions } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";
import { getNextRank, getRankByXp } from "@/lib/rank";

export default async function ProfilePage({
  params,
  searchParams,
}: {
  params: { username: string };
  searchParams?: { tab?: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/auth");
  }

  const prisma = getPrisma();
  const user = await prisma.user.findUnique({
    where: { username: params.username },
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
      games: {
        orderBy: { createdAt: "desc" },
        take: 50,
        select: {
          id: true,
          createdAt: true,
          word: true,
          attempts: true,
          won: true,
          mode: true,
          duration: true,
          xpEarned: true,
        },
      },
    },
  });

  if (!user) {
    redirect("/game");
  }

  const rank = getRankByXp(user.xp);
  const next = getNextRank(user.xp);
  const progress = next ? ((user.xp - rank.min) / (next.min - rank.min)) * 100 : 100;

  return (
    <main className="min-h-screen bg-black pt-12">
      <Navbar />
      <div className="mx-auto grid w-full max-w-5xl gap-4 px-3 pb-8 md:grid-cols-[360px_1fr]">
        <ProfileCard user={user} ownProfile={user.id === session.user.id} />
        <Card className="rounded-none border-zinc-800 bg-zinc-950 shadow-none">
          <CardContent className="grid gap-4 p-5">
            <div className="grid gap-1">
              <Progress
                value={progress}
                className="h-1 rounded-none bg-zinc-900"
                indicatorClassName="rounded-none bg-green-500"
              />
              <p className="font-mono text-[10px] text-zinc-500">
                XP para próximo rank: {next ? next.min - user.xp : 0}
              </p>
            </div>
            <Tabs defaultValue={searchParams?.tab === "stats" ? "stats" : "history"}>
              <TabsList>
                <TabsTrigger value="history">HISTÓRICO</TabsTrigger>
                <TabsTrigger value="stats">ESTATÍSTICAS</TabsTrigger>
              </TabsList>
              <TabsContent value="history">
                <GameHistory games={user.games} />
              </TabsContent>
              <TabsContent value="stats">
                <AttemptsChart games={user.games} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
