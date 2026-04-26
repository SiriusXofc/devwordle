import Link from "next/link";

const MODES = [
  { id: "classic", short: "CLS", badge: "BASE", label: "CLÁSSICO", description: "6 tentativas, sem timer, puro raciocínio.", attempts: "6", timer: "SEM TIMER" },
  { id: "speed", short: "SPD", badge: "60S", label: "SPEED", description: "Acerte o máximo de palavras antes do tempo acabar.", attempts: "∞", timer: "60S" },
  { id: "hard", short: "HRD", badge: "STRICT", label: "DIFÍCIL", description: "Letras confirmadas precisam ser usadas nos próximos chutes.", attempts: "6", timer: "SEM TIMER" },
  { id: "daily", short: "DLY", badge: "24H", label: "DIÁRIO", description: "Mesma palavra para todo mundo, uma vez por dia.", attempts: "6", timer: "24H" },
];

export function ModeCards() {
  return (
    <section className="border-b border-zinc-900">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-600"># modos</p>
        <h2 className="mt-2 font-mono text-2xl font-extrabold tracking-tight md:text-4xl">ESCOLHE TEU FLUXO.</h2>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {MODES.map((mode) => (
            <Link
              key={mode.id}
              href={`/game/${mode.id}`}
              className="group border border-zinc-800 p-5 transition-colors hover:border-green-500"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold tracking-[0.25em] text-zinc-600">{mode.short}</span>
                <span className="font-mono text-[10px] tracking-wider text-zinc-600">{mode.badge}</span>
              </div>
              <p className="mt-6 font-mono text-xl font-extrabold tracking-tight text-zinc-100 transition-colors group-hover:text-green-400">
                {mode.label}
              </p>
              <p className="mt-2 font-mono text-sm leading-relaxed text-zinc-500 sm:min-h-[3.5rem]">{mode.description}</p>
              <div className="mt-6 flex items-center justify-between font-mono text-[10px] tracking-[0.2em] text-zinc-600">
                <span>{mode.attempts} TENTATIVAS</span>
                <span>{mode.timer}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
