import { TerminalCard } from "@/components/shared/TerminalCard";

export function TopCards({
  winsToday,
  winsTodaySub,
  streak,
  streakSub,
  hardWord,
  hardWordSub,
}: {
  winsToday: string;
  winsTodaySub: string;
  streak: string;
  streakSub: string;
  hardWord: string;
  hardWordSub: string;
}) {
  const cards = [
    ["MAIS VITORIAS HOJE", winsToday, winsTodaySub],
    ["MAIOR STREAK ATIVO", streak, streakSub],
    ["PALAVRA MAIS DIFICIL", hardWord, hardWordSub],
  ];

  return (
    <div className="grid gap-3 md:grid-cols-3">
      {cards.map(([label, value, sub]) => (
        <TerminalCard key={label} className="p-4 transition-colors hover:border-green-900">
            <p className="font-mono text-[9px] tracking-widest text-zinc-600">{label}</p>
            <p className="mt-2 font-mono text-lg text-green-400">{value}</p>
            <p className="font-mono text-[10px] text-zinc-700">{sub}</p>
        </TerminalCard>
      ))}
    </div>
  );
}
