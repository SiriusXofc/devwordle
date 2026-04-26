const RANKS = [
  { name: "INICIANTE", xp: "0", desc: "Começou agora. Bem-vindo ao terminal." },
  { name: "PLENO", xp: "600", desc: "Já dominou o vocabulário básico." },
  { name: "SENIOR", xp: "1000", desc: "Reconhece libs raras e comandos antigos." },
  { name: "STAFF", xp: "1800", desc: "Stack na ponta do dedo. Dificilmente erra." },
  { name: "10X DEV", xp: "5000", desc: "Lendário. Aparece no topo do leaderboard." },
];

export function RanksSection() {
  return (
    <section className="border-b border-zinc-900">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-600"># progressão</p>
        <h2 className="mt-2 font-mono text-2xl font-extrabold tracking-tight md:text-4xl">RANK + XP.</h2>
        <p className="mt-2 max-w-md font-mono text-sm text-zinc-500">Ganhe XP a cada partida vencida. Seu rank evolui automaticamente.</p>

        <div className="mt-10 divide-y divide-zinc-800 border border-zinc-800">
          {RANKS.map((rank, index) => (
            <div key={rank.name} className="grid grid-cols-[44px_1fr_auto] items-center gap-4 px-4 py-4 transition-colors hover:bg-zinc-950 md:grid-cols-[60px_120px_1fr_120px] md:px-6">
              <span className="font-mono text-[10px] tracking-[0.25em] text-zinc-600">#{String(index + 1).padStart(2, "0")}</span>
              <span className="font-mono text-sm font-bold tracking-[0.18em] text-zinc-100">{rank.name}</span>
              <span className="hidden font-mono text-sm text-zinc-500 md:block">{rank.desc}</span>
              <span className="text-right font-mono text-xs tracking-wider text-green-400">{rank.xp} XP</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
