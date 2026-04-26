import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/EmptyState";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getRankByXp } from "@/lib/rank";
import { cn } from "@/lib/utils";

type User = {
  id: string;
  username: string;
  xp: number;
  totalWins: number;
  totalGames: number;
  currentStreak: number;
};

export function LeaderboardTable({
  users,
  currentUserId,
  emptyLabel = "NENHUM JOGADOR NO RANK",
}: {
  users: User[];
  currentUserId?: string;
  emptyLabel?: string;
}) {
  if (users.length === 0) {
    return (
      <EmptyState title={emptyLabel.toLowerCase()} description="jogue partidas ranqueadas para aparecer aqui" actionHref="/game" actionLabel="jogar agora" />
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>#</TableHead>
          <TableHead>PLAYER</TableHead>
          <TableHead>RANK</TableHead>
          <TableHead>XP</TableHead>
          <TableHead className="hidden md:table-cell">WIN RATE</TableHead>
          <TableHead className="hidden md:table-cell">STREAK</TableHead>
          <TableHead className="hidden md:table-cell">PARTIDAS</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user, index) => {
          const rank = getRankByXp(user.xp);
          const winRate = user.totalGames ? Math.round((user.totalWins / user.totalGames) * 100) : 0;

          return (
            <TableRow
              key={user.id}
              className={cn(
                "rounded-none",
                index === 0 && "border-l-2 border-yellow-500 bg-yellow-950/30 text-yellow-400",
                index === 1 && "border-l-2 border-zinc-400 bg-zinc-900/30 text-zinc-300",
                index === 2 && "border-l-2 border-amber-700 bg-amber-950/20 text-amber-600",
                user.id === currentUserId && "border-l-2 border-green-500 bg-green-950/20",
              )}
            >
              <TableCell className={cn(index < 3 && "font-bold")}>#{index + 1}</TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>
                <Badge variant="outline" className="border-zinc-700 bg-transparent font-mono text-[10px]" style={{ color: rank.color }}>
                  [{rank.code}]
                </Badge>
              </TableCell>
              <TableCell>{user.xp}</TableCell>
              <TableCell className="hidden md:table-cell">{winRate}%</TableCell>
              <TableCell className="hidden md:table-cell">{user.currentStreak}</TableCell>
              <TableCell className="hidden md:table-cell">{user.totalGames}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
