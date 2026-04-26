import { EmptyState } from "@/components/shared/EmptyState";
import { cn } from "@/lib/utils";

type Game = {
  attempts: number;
  won: boolean;
  word: string;
  mode: string;
  duration: number;
};

export function AttemptsChart({ games }: { games: Game[] }) {
  if (games.length === 0) {
    return <EmptyState title="sem estatisticas" description="as barras aparecem depois da primeira partida" actionHref="/game" actionLabel="jogar agora" />;
  }

  const counts = [1, 2, 3, 4, 5, 6].map((attempt) => games.filter((game) => game.won && game.attempts === attempt).length);
  const losses = games.filter((game) => !game.won).length;
  const max = Math.max(...counts, 1);
  const most = counts.indexOf(Math.max(...counts));
  const fastest = games.filter((game) => game.won).sort((a, b) => a.duration - b.duration)[0]?.word ?? "N/A";
  const favorite = Object.entries(
    games.reduce<Record<string, number>>((acc, game) => {
      acc[game.mode] = (acc[game.mode] ?? 0) + 1;
      return acc;
    }, {}),
  ).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "N/A";

  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        {[1, 2, 3, 4, 5, 6].map((label, index) => (
          <div key={label} className="grid grid-cols-[44px_1fr_32px] items-center gap-2 font-mono text-xs">
            <span className="text-zinc-500">{label}</span>
            <div className="h-4 bg-zinc-900">
              <div
                className={cn("h-4", index === most ? "bg-green-800" : "bg-zinc-800")}
                style={{ width: `${(counts[index] / max) * 100}%` }}
              />
            </div>
            <span className="text-zinc-400">{counts[index]}</span>
          </div>
        ))}
        <div className="mt-2 border border-red-900/50 bg-red-950/20 p-3 font-mono text-xs text-red-300/70">
          derrotas registradas: <span className="text-red-300">{losses}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-px border border-zinc-800 bg-zinc-800">
        <div className="bg-zinc-950 p-3">
          <p className="font-mono text-[10px] tracking-widest text-zinc-600">MELHOR PALAVRA</p>
          <p className="mt-1 font-mono text-sm text-green-400">{fastest}</p>
        </div>
        <div className="bg-zinc-950 p-3">
          <p className="font-mono text-[10px] tracking-widest text-zinc-600">MODO FAVORITO</p>
          <p className="mt-1 font-mono text-sm text-green-400">{favorite}</p>
        </div>
      </div>
    </div>
  );
}
