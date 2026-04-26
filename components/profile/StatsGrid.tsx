import { getRankByXp } from "@/lib/rank";

type StatsGridProps = {
  totalGames: number;
  totalWins: number;
  avgAttempts: number;
  xp: number;
};

export function StatsGrid({ totalGames, totalWins, avgAttempts, xp }: StatsGridProps) {
  const winRate = totalGames > 0 ? Math.round((totalWins / totalGames) * 100) : 0;
  const rank = getRankByXp(xp);
  const stats = [
    ["Partidas", totalGames],
    ["Vitórias", totalWins],
    ["Win Rate", `${winRate}%`],
    ["Média", avgAttempts ? avgAttempts.toFixed(1) : "0.0"],
    ["XP Total", xp],
    ["Rank", rank.code],
  ];

  return (
    <div className="grid grid-cols-2 gap-px border border-zinc-800 bg-zinc-800 sm:grid-cols-3">
      {stats.map(([label, value]) => (
        <div key={label} className="bg-zinc-950 p-3">
          <p className="font-mono text-[10px] tracking-widest text-zinc-600">{label}</p>
          <p className="mt-1 font-mono text-lg text-white">{value}</p>
        </div>
      ))}
    </div>
  );
}
